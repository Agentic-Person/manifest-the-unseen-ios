/**
 * Regenerate Prayer Timings using Whisper
 *
 * Runs OpenAI Whisper transcription on each prayer audio file to get
 * accurate word-level timestamps, then maps them to prayer lines.
 *
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║  ⚠️  CRITICAL: DO NOT MODIFY THE TIMING ALGORITHM WITHOUT TESTING! ⚠️        ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                              ║
 * ║  This script uses ACTUAL Whisper word-level timestamps to sync text with    ║
 * ║  audio. The algorithm in generateLineTimingsFromWhisper() is CORRECT and    ║
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
 * ║  HOW TO USE:                                                                 ║
 * ║  1. Add new prayer audio files to meditation-audio/prayers/                  ║
 * ║  2. Update LOCAL_FILE_MAP below with the new filename mapping                ║
 * ║  3. Run: node whisper-regenerate-timings.js                                  ║
 * ║  4. Test in app to verify sync                                               ║
 * ║                                                                              ║
 * ║  See README.md in this directory for the full process.                       ║
 * ║                                                                              ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env.local') });

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const WHISPER_EDGE_FUNCTION_URL = `${process.env.SUPABASE_URL}/functions/v1/whisper-transcribe`;
const PRAYERS_DIR = path.join(__dirname, '../../meditation-audio/prayers');

// Map database audio_url to local filename
// Database: prayers/001-i-speak-healing.m4a
// Local: 001_I_Speak_Healing.m4a
const LOCAL_FILE_MAP = {
  '001-i-speak-healing.m4a': '001_I_Speak_Healing.m4a',
  '002-complete-declaration-of-restoration.m4a': '002_Complete_Declaration_of_Restoration.m4a',
  '006-i-am-open-to-receive.m4a': '006_I_Am_Open_to_Receive.m4a',
  '014-breaking-the-chains.m4a': '014_Breaking_the_Chains.m4a',
  '017-i-am-at-peace.m4a': '017_I_Am_at_Peace.m4a',
  '018-the-courage-to-be-still.m4a': '018_The_Courage_to_Be_Still.m4a',
  '022-the-frequency-of-thankfulness.m4a': '022_The_Frequency_of_Thankfulness.m4a',
  '038-communion-with-the-divine.m4a': '038_Communion_with_the_Divine.m4a',
};

/**
 * Parse prayer content into lines
 */
function getPrayerLines(content) {
  if (!content) return [];
  return content
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
 * Generate line timings from Whisper word timestamps
 *
 * Uses actual word-level timestamps from Whisper instead of proportional distribution.
 * For each prayer line:
 * 1. Count words in the line
 * 2. Consume that many words from Whisper's word array
 * 3. Use first word's start time and last word's end time
 *
 * ❌ WRONG: lineDuration = (wordCount / totalWords) * totalDuration  // CAUSES DRIFT!
 * ✅ RIGHT: Use whisperWords[i].start and whisperWords[i].end directly
 */
function generateLineTimingsFromWhisper(whisperResult, prayerLines) {
  const whisperWords = whisperResult.words || [];
  if (whisperWords.length === 0) return null;

  // Count words in each prayer line
  const lineWordCounts = prayerLines.map(line =>
    line.split(/\s+/).filter(word => word.length > 0).length
  );
  const totalPrayerWords = lineWordCounts.reduce((sum, count) => sum + count, 0);

  if (totalPrayerWords === 0) return null;

  console.log(`    Prayer words: ${totalPrayerWords}, Whisper words: ${whisperWords.length}`);

  // Track position in Whisper words array
  let whisperWordIndex = 0;

  const lineTimings = prayerLines.map((text, lineIndex) => {
    const wordsInLine = lineWordCounts[lineIndex];

    // Get the Whisper words for this line (clamped to available words)
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

  return lineTimings;
}

/**
 * Transcribe audio file using Whisper edge function
 */
async function transcribeWithWhisper(audioFilePath, filename) {
  console.log(`    Reading audio file...`);
  const audioBuffer = fs.readFileSync(audioFilePath);
  const audioBase64 = audioBuffer.toString('base64');
  const sizeMB = (audioBuffer.length / 1024 / 1024).toFixed(2);
  console.log(`    File size: ${sizeMB} MB`);

  if (audioBuffer.length > 25 * 1024 * 1024) {
    console.log(`    ⚠️  File too large for Whisper API (max 25MB)`);
    return null;
  }

  console.log(`    Calling Whisper API...`);
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
    throw new Error(`Whisper API error: ${response.status} - ${errorText}`);
  }

  const result = await response.json();
  console.log(`    ✓ Transcribed (${result.words?.length || 0} words)`);
  return result;
}

async function regenerateAllTimings() {
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║   Regenerate Prayer Timings using Whisper             ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  // Get all prayers with audio
  const { data: prayers, error: fetchError } = await supabase
    .from('prayers')
    .select('id, title, content, audio_url')
    .not('audio_url', 'is', null)
    .order('order_index');

  if (fetchError) {
    console.error('Error fetching prayers:', fetchError.message);
    process.exit(1);
  }

  console.log(`Found ${prayers.length} prayers with audio\n`);

  let updated = 0;
  let failed = 0;

  for (const prayer of prayers) {
    console.log(`\n${'═'.repeat(60)}`);
    console.log(`Processing: ${prayer.title}`);
    console.log(`${'═'.repeat(60)}`);

    // Get local filename
    const storageFilename = prayer.audio_url.replace('prayers/', '');
    const localFilename = LOCAL_FILE_MAP[storageFilename];

    if (!localFilename) {
      console.log(`  ⚠️  No local file mapping for: ${storageFilename}`);
      failed++;
      continue;
    }

    const audioFilePath = path.join(PRAYERS_DIR, localFilename);
    if (!fs.existsSync(audioFilePath)) {
      console.log(`  ⚠️  Local file not found: ${audioFilePath}`);
      failed++;
      continue;
    }

    console.log(`  Local file: ${localFilename}`);

    try {
      // Transcribe with Whisper
      const whisperResult = await transcribeWithWhisper(audioFilePath, localFilename);

      if (!whisperResult || !whisperResult.words || whisperResult.words.length === 0) {
        console.log(`  ⚠️  No words returned from Whisper`);
        failed++;
        continue;
      }

      // Generate line timings
      const lines = getPrayerLines(prayer.content);
      console.log(`  Content lines: ${lines.length}`);

      const timings = generateLineTimingsFromWhisper(whisperResult, lines);

      if (!timings) {
        console.log(`  ⚠️  Failed to generate timings`);
        failed++;
        continue;
      }

      console.log(`  Generated ${timings.length} line timings`);
      console.log(`  First: ${timings[0].startMs}ms - ${timings[0].endMs}ms`);
      console.log(`  Last: ${timings[timings.length-1].startMs}ms - ${timings[timings.length-1].endMs}ms`);

      // Update database
      const { error: updateError } = await supabase
        .from('prayers')
        .update({ line_timings: timings })
        .eq('id', prayer.id);

      if (updateError) {
        console.error(`  ❌ Database error: ${updateError.message}`);
        failed++;
      } else {
        console.log(`  ✅ Updated!`);
        updated++;
      }

    } catch (err) {
      console.error(`  ❌ Error: ${err.message}`);
      failed++;
    }
  }

  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║                     SUMMARY                            ║');
  console.log('╠════════════════════════════════════════════════════════╣');
  console.log(`║  Updated: ${updated}`);
  console.log(`║  Failed: ${failed}`);
  console.log('╚════════════════════════════════════════════════════════╝');
}

// Run
regenerateAllTimings().catch(err => {
  console.error('\n❌ Fatal error:', err.message);
  process.exit(1);
});
