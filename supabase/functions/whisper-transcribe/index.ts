/**
 * Supabase Edge Function: Whisper Transcribe
 *
 * Transcribes audio using OpenAI's Whisper API with word-level timestamps.
 * Used for generating prayer line timings for synchronized text display.
 *
 * Request Body:
 * - audioBase64: Base64-encoded audio file
 * - filename: Original filename (for MIME type detection)
 *
 * Response:
 * - text: Full transcription text
 * - words: Array of {word, start, end} with timestamps in seconds
 *
 * Environment Variables Required:
 * - OPENAI_API_KEY
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

// =============================================================================
// CORS Headers
// =============================================================================

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// =============================================================================
// Types
// =============================================================================

interface WhisperRequest {
  audioBase64: string;
  filename: string;
}

interface WhisperWord {
  word: string;
  start: number;
  end: number;
}

interface WhisperResponse {
  text: string;
  words: WhisperWord[];
}

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Detect MIME type from filename extension
 */
function getMimeType(filename: string): string {
  const ext = filename.toLowerCase().split('.').pop();
  const mimeTypes: Record<string, string> = {
    'm4a': 'audio/mp4',
    'mp3': 'audio/mpeg',
    'mp4': 'audio/mp4',
    'wav': 'audio/wav',
    'webm': 'audio/webm',
    'ogg': 'audio/ogg',
    'flac': 'audio/flac',
  };
  return mimeTypes[ext || ''] || 'audio/mp4';
}

/**
 * Convert base64 to Uint8Array
 */
function base64ToUint8Array(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Call OpenAI Whisper API with word-level timestamps
 */
async function transcribeWithWhisper(
  audioData: Uint8Array,
  filename: string,
  mimeType: string
): Promise<WhisperResponse> {
  const openaiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openaiKey) {
    throw new Error('OPENAI_API_KEY not configured');
  }

  // Create FormData with the audio file
  const formData = new FormData();
  const blob = new Blob([audioData], { type: mimeType });
  formData.append('file', blob, filename);
  formData.append('model', 'whisper-1');
  formData.append('response_format', 'verbose_json');
  formData.append('timestamp_granularities[]', 'word');

  console.log(`Calling Whisper API for ${filename} (${(audioData.length / 1024 / 1024).toFixed(2)} MB)`);

  const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiKey}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Whisper API error:', errorText);
    throw new Error(`Whisper API failed: ${response.status} - ${errorText}`);
  }

  const result = await response.json();

  // Extract word-level timestamps
  const words: WhisperWord[] = (result.words || []).map((w: any) => ({
    word: w.word,
    start: w.start,
    end: w.end,
  }));

  console.log(`Transcription complete: ${words.length} words, ${result.text?.length || 0} chars`);

  return {
    text: result.text || '',
    words,
  };
}

// =============================================================================
// Main Handler
// =============================================================================

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Parse request body
    const { audioBase64, filename }: WhisperRequest = await req.json();

    if (!audioBase64) {
      throw new Error('audioBase64 is required');
    }

    if (!filename) {
      throw new Error('filename is required');
    }

    // Validate base64 size (Whisper API max is 25MB)
    const estimatedSize = (audioBase64.length * 3) / 4; // Approximate decoded size
    if (estimatedSize > 25 * 1024 * 1024) {
      throw new Error('Audio file too large (max 25MB)');
    }

    console.log(`Processing: ${filename}`);

    // Convert base64 to binary
    const audioData = base64ToUint8Array(audioBase64);
    const mimeType = getMimeType(filename);

    console.log(`MIME type: ${mimeType}, Size: ${(audioData.length / 1024 / 1024).toFixed(2)} MB`);

    // Call Whisper API
    const result = await transcribeWithWhisper(audioData, filename, mimeType);

    // Return response
    return new Response(
      JSON.stringify(result),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Whisper transcribe error:', error);

    return new Response(
      JSON.stringify({
        error: error.message || 'Transcription failed',
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

/**
 * To deploy this function:
 *
 * 1. Ensure OPENAI_API_KEY is set:
 *    npx supabase secrets set OPENAI_API_KEY=sk-...
 *
 * 2. Deploy function:
 *    npx supabase functions deploy whisper-transcribe
 *
 * 3. Test:
 *    curl -X POST 'https://your-project.supabase.co/functions/v1/whisper-transcribe' \
 *      -H 'Authorization: Bearer YOUR_SERVICE_ROLE_KEY' \
 *      -H 'Content-Type: application/json' \
 *      -d '{"audioBase64": "...", "filename": "audio.m4a"}'
 */
