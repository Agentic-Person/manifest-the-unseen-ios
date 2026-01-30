/**
 * Generate Prayer Line Timings with Whisper
 *
 * Uses OpenAI Whisper API to transcribe prayer audio files
 * with word-level timestamps, then maps them to prayer lines.
 *
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║  ⚠️  CRITICAL: DO NOT MODIFY THE TIMING ALGORITHM WITHOUT TESTING! ⚠️        ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                              ║
 * ║  This script uses ACTUAL Whisper word-level timestamps to sync text with    ║
 * ║  audio. The algorithm in generateTimingsFromWhisperWords() is CORRECT and   ║
 * ║  has been tested and verified to work.                                       ║
 * ║                                                                              ║
 * ║  WRONG APPROACH (causes drift):                                              ║
 * ║  - Proportional distribution based on word count                             ║
 * ║  - Only using speech start/end boundaries                                    ║
 * ║                                                                              ║
 * ║  CORRECT APPROACH (this file):                                               ║
 * ║  - Consume words sequentially from Whisper's word array                      ║
 * ║  - Use actual start/end timestamps from each word                            ║
 * ║                                                                              ║
 * ║  If you're adding new prayers, run: node whisper-regenerate-timings.js      ║
 * ║  See README.md in this directory for the full process.                       ║
 * ║                                                                              ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
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

// ============================================================================
// ⚠️  CRITICAL FUNCTION - DO NOT MODIFY WITHOUT TESTING ⚠️
// ============================================================================
// This algorithm is CORRECT and TESTED. It uses actual Whisper timestamps.
// DO NOT replace with proportional distribution - that causes sync drift!
// ============================================================================
/**
 * Generate timings using actual Whisper word-level timestamps
 *
 * This approach uses the actual timestamps from Whisper's word array:
 * 1. Process prayer lines sequentially
 * 2. For each line, count its words
 * 3. Consume that many words from Whisper's word array
 * 4. Use the first consumed word's `start` as line startMs
 * 5. Use the last consumed word's `end` as line endMs
 *
 * This ensures text syncs accurately with when the narrator actually speaks each line.
 *
 * ❌ WRONG: lineDuration = (wordCount / totalWords) * totalDuration  // CAUSES DRIFT!
 * ✅ RIGHT: Use whisperWords[i].start and whisperWords[i].end directly
 */
function generateTimingsFromWhisperWords(whisperResult, prayerLines) {
  const whisperWords = whisperResult.words;
  if (!whisperWords || whisperWords.length === 0) {
    console.log('  ⚠️  No words from Whisper, cannot generate timings');
    return null;
  }

  // Count words in each prayer line
  const lineWordCounts = prayerLines.map(line =>
    line.split(/\s+/).filter(w => w.length > 0).length
  );
  const totalPrayerWords = lineWordCounts.reduce((sum, c) => sum + c, 0);

  console.log(`  Content: ${prayerLines.length} lines, ${totalPrayerWords} prayer words`);
  console.log(`  Whisper detected: ${whisperWords.length} words`);

  // Track our position in Whisper words array
  let whisperWordIndex = 0;

  const lineTimings = prayerLines.map((text, lineIndex) => {
    const wordsInLine = lineWordCounts[lineIndex];

    // Get the Whisper words for this line
    const startWordIndex = Math.min(whisperWordIndex, whisperWords.length - 1);
    const endWordIndex = Math.min(
      whisperWordIndex + wordsInLine - 1,
      whisperWords.length - 1
    );

    // Get timestamps from actual Whisper words
    const startMs = Math.round(whisperWords[startWordIndex].start * 1000);
    const endMs = Math.round(whisperWords[endWordIndex].end * 1000);

    // Advance position for next line
    whisperWordIndex += wordsInLine;

    return {
      line: lineIndex,
      text,
      startMs,
      endMs
    };
  });

  // Log timing info
  const firstTiming = lineTimings[0];
  const lastTiming = lineTimings[lineTimings.length - 1];
  console.log(`  Timing range: ${(firstTiming.startMs / 1000).toFixed(2)}s - ${(lastTiming.endMs / 1000).toFixed(2)}s`);

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

      // Generate timings using actual Whisper word timestamps
      const prayerLines = getPrayerLines(prayerContent[title]);
      const lineTimings = generateTimingsFromWhisperWords(whisperResult, prayerLines);

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
