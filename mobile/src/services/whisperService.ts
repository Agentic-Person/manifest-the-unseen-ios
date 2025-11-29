/**
 * Whisper Service
 *
 * On-device speech-to-text transcription using Whisper AI.
 * Provides model management and transcription for voice journal entries.
 */

import { Paths, File } from 'expo-file-system';
import { initWhisper, WhisperContext } from 'whisper.rn';

/**
 * Whisper Model Configuration
 * Using whisper-tiny for balance of speed/accuracy (~40MB)
 */
const WHISPER_MODEL_URL = 'https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-tiny.bin';
const MODEL_FILENAME = 'ggml-tiny.bin';

/**
 * Cached Whisper context instance
 */
let whisperContext: WhisperContext | null = null;

/**
 * Get File instance for Whisper model
 */
function getModelFile(): File {
  return new File(Paths.document, MODEL_FILENAME);
}

/**
 * Get path where Whisper model is stored
 */
export function getModelPath(): string {
  return getModelFile().uri;
}

/**
 * Check if Whisper model is downloaded
 *
 * @returns True if model exists locally
 *
 * @example
 * ```tsx
 * const downloaded = await isModelDownloaded();
 * if (!downloaded) {
 *   await downloadModel();
 * }
 * ```
 */
export async function isModelDownloaded(): Promise<boolean> {
  try {
    const modelFile = getModelFile();
    return modelFile.exists;
  } catch (error) {
    console.error('Error checking model download status:', error);
    return false;
  }
}

/**
 * Download Whisper model with progress callback
 *
 * @param onProgress - Optional callback for download progress (0-100)
 *
 * @throws Error if download fails
 *
 * @example
 * ```tsx
 * await downloadModel((progress) => {
 *   console.log(`Download: ${progress}%`);
 * });
 * ```
 */
export async function downloadModel(
  onProgress?: (progress: number) => void
): Promise<void> {
  const modelFile = getModelFile();

  try {
    // Check if already downloaded
    const alreadyDownloaded = await isModelDownloaded();
    if (alreadyDownloaded) {
      onProgress?.(100);
      return;
    }

    // Download the model file
    onProgress?.(0);

    // Use fetch to download with progress tracking
    const response = await fetch(WHISPER_MODEL_URL);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const contentLength = response.headers.get('content-length');
    const total = contentLength ? parseInt(contentLength, 10) : 0;

    if (!response.body) {
      throw new Error('Response body is null');
    }

    const reader = response.body.getReader();
    const chunks: Uint8Array[] = [];
    let received = 0;

    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      chunks.push(value);
      received += value.length;

      if (total > 0) {
        const progress = Math.round((received / total) * 100);
        onProgress?.(progress);
      }
    }

    // Combine chunks into a single Uint8Array
    const fullData = new Uint8Array(received);
    let position = 0;
    for (const chunk of chunks) {
      fullData.set(chunk, position);
      position += chunk.length;
    }

    // Write to file
    modelFile.write(fullData);

    // Verify file was downloaded
    if (!modelFile.exists) {
      throw new Error('Download failed: Model file not found after download');
    }

    // Initialize Whisper with the downloaded model
    whisperContext = await initWhisper({
      filePath: modelFile.uri,
    });

    onProgress?.(100);
  } catch (error) {
    // Clean up partial download
    try {
      if (modelFile.exists) {
        modelFile.delete();
      }
    } catch (cleanupError) {
      console.error('Error cleaning up partial download:', cleanupError);
    }

    throw new Error(
      `Failed to download Whisper model: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
}

/**
 * Transcribe audio file to text using Whisper
 *
 * @param audioUri - Local file URI of the audio recording
 * @returns Transcribed text
 *
 * @throws Error if transcription fails or model not downloaded
 *
 * @example
 * ```tsx
 * const text = await transcribe('file:///path/to/audio.m4a');
 * console.log('Transcription:', text);
 * ```
 */
export async function transcribe(audioUri: string): Promise<string> {
  try {
    // Verify model is downloaded
    const modelDownloaded = await isModelDownloaded();
    if (!modelDownloaded) {
      throw new Error('Whisper model not downloaded. Please download the model first.');
    }

    // Initialize Whisper context if not already initialized
    if (!whisperContext) {
      whisperContext = await initWhisper({
        filePath: getModelPath(),
      });
    }

    // Verify audio file exists
    const audioFile = new File(audioUri);
    if (!audioFile.exists) {
      throw new Error('Audio file not found');
    }

    // Transcribe the audio file
    const { promise } = whisperContext.transcribe(audioUri, {
      language: 'en',
      maxLen: 1,
      tokenTimestamps: false,
      translate: false,
    });

    const result = await promise;

    if (!result || !result.result) {
      throw new Error('Transcription returned no result');
    }

    // Extract text from result
    const text = result.result.trim();

    if (!text) {
      throw new Error('Transcription produced empty text');
    }

    return text;
  } catch (error) {
    throw new Error(
      `Transcription failed: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
}

/**
 * Delete audio file after transcription (privacy-first design)
 *
 * @param uri - File URI to delete
 *
 * @example
 * ```tsx
 * const text = await transcribe(audioUri);
 * await deleteAudioFile(audioUri); // Delete after successful transcription
 * ```
 */
export async function deleteAudioFile(uri: string): Promise<void> {
  try {
    const audioFile = new File(uri);
    if (audioFile.exists) {
      audioFile.delete();
    }
  } catch (error) {
    console.error('Error deleting audio file:', error);
    // Don't throw - deletion failure shouldn't block the flow
  }
}

/**
 * Get model file size if downloaded
 *
 * @returns File size in bytes, or null if not downloaded
 */
export async function getModelSize(): Promise<number | null> {
  try {
    const modelFile = getModelFile();

    if (modelFile.exists) {
      return modelFile.size;
    }

    return null;
  } catch (error) {
    console.error('Error getting model size:', error);
    return null;
  }
}

/**
 * Delete downloaded model (for clearing cache/storage)
 */
export async function deleteModel(): Promise<void> {
  try {
    const modelFile = getModelFile();

    if (modelFile.exists) {
      modelFile.delete();
    }

    // Release Whisper context if initialized
    if (whisperContext) {
      await whisperContext.release();
      whisperContext = null;
    }
  } catch (error) {
    console.error('Error deleting model:', error);
    throw new Error(
      `Failed to delete model: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
}
