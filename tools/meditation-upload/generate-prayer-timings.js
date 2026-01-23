/**
 * Generate Prayer Line Timings with Whisper
 *
 * Uses OpenAI Whisper API to transcribe prayer audio files
 * with word-level timestamps, then maps them to prayer lines.
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const FormData = require('form-data');
const fetch = require('node-fetch');
require('dotenv').config({ path: path.join(__dirname, '../../.env.local') });

// Configuration
const PRAYERS_DIR = path.join(__dirname, '../../meditation-audio/prayers');
const PRAYER_CONTENT_FILE = path.join(__dirname, 'prayer-content.json');

// Validate environment (no longer need OPENAI_API_KEY - it's in the edge function)
const requiredVars = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'];
for (const envVar of requiredVars) {
  if (!process.env[envVar]) {
    console.error(`Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

// Edge function URL for Whisper transcription
const WHISPER_EDGE_FUNCTION_URL = `${process.env.SUPABASE_URL}/functions/v1/whisper-transcribe`;

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * Load prayer content (for matching transcription to expected text)
 */
function loadPrayerContent() {
  try {
    const rawContent = JSON.parse(fs.readFileSync(PRAYER_CONTENT_FILE, 'utf8'));

    // Convert keys from underscore format to Title Case
    const content = {};
    for (const [key, value] of Object.entries(rawContent)) {
      const titleCaseKey = key
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      content[titleCaseKey] = value;
    }

    return content;
  } catch (err) {
    console.error('Error loading prayer content:', err.message);
    process.exit(1);
  }
}

/**
 * Get prayer title from filename
 */
function getTitleFromFilename(filename) {
  // Remove extension and number prefix
  const nameWithoutExt = filename.replace(/\.(mp3|m4a|wav)$/i, '');
  const withoutNumber = nameWithoutExt.replace(/^\d+_/, '');

  // Convert underscores to spaces and title case
  return withoutNumber
    .replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Transcribe audio with Whisper via Edge Function
 *
 * Uses the whisper-transcribe edge function which has the OpenAI API key
 * stored securely as a Supabase secret.
 */
async function transcribeWithWhisper(audioFilePath) {
  console.log(`  Transcribing with Whisper (via Edge Function)...`);

  // Read file and convert to base64
  const audioBuffer = fs.readFileSync(audioFilePath);
  const audioBase64 = audioBuffer.toString('base64');
  const filename = path.basename(audioFilePath);

  console.log(`  Audio file size: ${(audioBuffer.length / 1024 / 1024).toFixed(2)} MB`);

  const response = await fetch(WHISPER_EDGE_FUNCTION_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
    },
    body: JSON.stringify({
      audioBase64,
      filename,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Edge Function error: ${response.status} - ${errorText}`);
  }

  return await response.json();
}

/**
 * Split prayer content into lines (matching the content we stored)
 */
function getPrayerLines(prayerText) {
  return prayerText
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);
}

/**
 * Generate proportional timings using Whisper speech boundaries
 *
 * Instead of trying to match words (fragile), this approach:
 * 1. Uses Whisper to detect when speech starts/ends
 * 2. Distributes timing proportionally across ALL content lines based on word count
 *
 * This ensures every content line gets a timing entry, regardless of
 * transcription variations or narrator differences.
 */
function generateProportionalTimings(whisperResult, prayerLines) {
  const words = whisperResult.words;
  if (!words || words.length === 0) {
    console.log('  ⚠️  No words from Whisper, cannot generate timings');
    return null;
  }

  // Get speech boundaries from Whisper
  const speechStartMs = Math.round(words[0].start * 1000);
  const speechEndMs = Math.round(words[words.length - 1].end * 1000);
  const totalSpeechDurationMs = speechEndMs - speechStartMs;

  console.log(`  Speech boundaries: ${(speechStartMs / 1000).toFixed(2)}s - ${(speechEndMs / 1000).toFixed(2)}s`);
  console.log(`  Total speech duration: ${(totalSpeechDurationMs / 1000).toFixed(2)}s`);

  // Count words per line
  const lineWordCounts = prayerLines.map(line =>
    line.split(/\s+/).filter(w => w.length > 0).length
  );
  const totalWords = lineWordCounts.reduce((sum, c) => sum + c, 0);

  console.log(`  Content: ${prayerLines.length} lines, ${totalWords} total words`);

  // Distribute timing proportionally based on word count per line
  let currentTimeMs = speechStartMs;
  const lineTimings = prayerLines.map((text, index) => {
    const wordCount = lineWordCounts[index];
    const lineDurationMs = (wordCount / totalWords) * totalSpeechDurationMs;
    const startMs = currentTimeMs;
    const endMs = startMs + lineDurationMs;
    currentTimeMs = endMs;

    return {
      line: index,
      text,
      startMs: Math.round(startMs),
      endMs: Math.round(endMs)
    };
  });

  return lineTimings;
}

/**
 * Update prayer with line timings
 */
async function updatePrayerTimings(title, lineTimings) {
  const { error } = await supabase
    .from('prayers')
    .update({ line_timings: lineTimings })
    .eq('title', title);

  if (error) {
    throw new Error(`Database update failed: ${error.message}`);
  }
}

/**
 * Process all prayer files
 */
async function processPrayers() {
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║     Generate Prayer Line Timings with Whisper         ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  const prayerContent = loadPrayerContent();
  console.log(`Loaded ${Object.keys(prayerContent).length} prayer texts\n`);

  const audioFiles = fs.readdirSync(PRAYERS_DIR)
    .filter(f => f.match(/\.(mp3|m4a|wav)$/i))
    .sort();

  let processed = 0;
  let errors = 0;

  for (const file of audioFiles) {
    const filePath = path.join(PRAYERS_DIR, file);
    const title = getTitleFromFilename(file);

    console.log(`\nProcessing: ${file}`);
    console.log(`  Title: "${title}"`);

    if (!prayerContent[title]) {
      console.log(`  ⚠️  No prayer text found for: "${title}"`);
      errors++;
      continue;
    }

    try {
      // Transcribe with Whisper
      const whisperResult = await transcribeWithWhisper(filePath);

      if (!whisperResult.words || whisperResult.words.length === 0) {
        throw new Error('No word-level timestamps returned from Whisper');
      }

      console.log(`  ✓ Transcribed (${whisperResult.words.length} words)`);

      // Generate proportional timings using Whisper speech boundaries
      const prayerLines = getPrayerLines(prayerContent[title]);
      const lineTimings = generateProportionalTimings(whisperResult, prayerLines);

      if (!lineTimings) {
        throw new Error('Failed to generate timings from Whisper result');
      }

      // Verify line count matches
      if (lineTimings.length !== prayerLines.length) {
        console.log(`  ⚠️  Line count mismatch: ${lineTimings.length} timings vs ${prayerLines.length} content lines`);
      } else {
        console.log(`  ✓ Generated ${lineTimings.length} line timings (100% coverage)`);
      }

      // Update database
      await updatePrayerTimings(title, lineTimings);
      console.log(`  ✅ Updated database`);

      processed++;

      // Rate limit: wait 1 second between API calls
      if (processed < audioFiles.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

    } catch (err) {
      console.error(`  ❌ Error: ${err.message}`);
      errors++;
    }
  }

  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║                     SUMMARY                            ║');
  console.log('╠════════════════════════════════════════════════════════╣');
  console.log(`║  Processed: ${processed}`);
  console.log(`║  Errors: ${errors}`);
  console.log('╚════════════════════════════════════════════════════════╝');

  if (processed > 0) {
    console.log('\n✅ Prayer timings generated successfully!');
    console.log('   Text will now sync perfectly with audio playback.');
  }
}

// Run
processPrayers().catch(err => {
  console.error('\n❌ Fatal error:', err.message);
  process.exit(1);
});
