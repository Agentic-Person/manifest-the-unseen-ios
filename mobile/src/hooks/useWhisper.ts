/**
 * useWhisper Hook
 *
 * React hook for managing Whisper model download and transcription.
 * Handles model status, download progress, and transcription state.
 */

import { useState, useEffect, useCallback } from 'react';
import {
  isModelDownloaded,
  downloadModel as downloadWhisperModel,
  transcribe as transcribeAudio,
} from '../services/whisperService';

/**
 * Hook return interface
 */
interface UseWhisperReturn {
  // Model status
  modelDownloaded: boolean;
  isDownloading: boolean;
  downloadProgress: number;
  downloadError: string | null;

  // Transcription
  isTranscribing: boolean;
  transcriptionError: string | null;

  // Actions
  downloadModel: () => Promise<void>;
  transcribe: (audioUri: string) => Promise<string>;
}

/**
 * Custom hook for Whisper transcription
 *
 * Manages Whisper model download and audio transcription with state tracking.
 *
 * @example
 * ```tsx
 * function VoiceJournal() {
 *   const {
 *     modelDownloaded,
 *     isDownloading,
 *     downloadProgress,
 *     downloadModel,
 *     transcribe,
 *     isTranscribing,
 *   } = useWhisper();
 *
 *   useEffect(() => {
 *     if (!modelDownloaded) {
 *       downloadModel();
 *     }
 *   }, [modelDownloaded]);
 *
 *   const handleRecord = async (audioUri: string) => {
 *     const text = await transcribe(audioUri);
 *     console.log('Transcribed:', text);
 *   };
 *
 *   return (
 *     <View>
 *       {isDownloading && <Text>Downloading model: {downloadProgress}%</Text>}
 *       {isTranscribing && <Text>Transcribing...</Text>}
 *     </View>
 *   );
 * }
 * ```
 */
export function useWhisper(): UseWhisperReturn {
  // Model download state
  const [modelDownloaded, setModelDownloaded] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  // Transcription state
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptionError, setTranscriptionError] = useState<string | null>(null);

  /**
   * Check model download status on mount
   */
  useEffect(() => {
    let isMounted = true;

    const checkModelStatus = async () => {
      try {
        const downloaded = await isModelDownloaded();
        if (isMounted) {
          setModelDownloaded(downloaded);
          if (downloaded) {
            setDownloadProgress(100);
          }
        }
      } catch (error) {
        console.error('Error checking model status:', error);
        if (isMounted) {
          setModelDownloaded(false);
        }
      }
    };

    checkModelStatus();

    return () => {
      isMounted = false;
    };
  }, []);

  /**
   * Download Whisper model
   */
  const downloadModel = useCallback(async (): Promise<void> => {
    // Don't download if already downloaded or downloading
    if (modelDownloaded || isDownloading) {
      return;
    }

    setIsDownloading(true);
    setDownloadError(null);
    setDownloadProgress(0);

    try {
      await downloadWhisperModel((progress) => {
        setDownloadProgress(progress);
      });

      setModelDownloaded(true);
      setDownloadProgress(100);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to download model';
      setDownloadError(errorMessage);
      setModelDownloaded(false);
      setDownloadProgress(0);
      throw error;
    } finally {
      setIsDownloading(false);
    }
  }, [modelDownloaded, isDownloading]);

  /**
   * Transcribe audio file to text
   */
  const transcribe = useCallback(
    async (audioUri: string): Promise<string> => {
      if (!modelDownloaded) {
        throw new Error('Model not downloaded. Please download the model first.');
      }

      if (isTranscribing) {
        throw new Error('Transcription already in progress');
      }

      setIsTranscribing(true);
      setTranscriptionError(null);

      try {
        const text = await transcribeAudio(audioUri);
        return text;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Transcription failed';
        setTranscriptionError(errorMessage);
        throw error;
      } finally {
        setIsTranscribing(false);
      }
    },
    [modelDownloaded, isTranscribing]
  );

  return {
    // Model status
    modelDownloaded,
    isDownloading,
    downloadProgress,
    downloadError,

    // Transcription
    isTranscribing,
    transcriptionError,

    // Actions
    downloadModel,
    transcribe,
  };
}
