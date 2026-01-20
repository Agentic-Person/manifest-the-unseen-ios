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

// Validate environment
const requiredVars = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'OPENAI_API_KEY'];
for (const envVar of requiredVars) {
  if (!process.env[envVar]) {
    console.error(`Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

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
 * Transcribe audio with Whisper (word-level timestamps)
 */
async function transcribeWithWhisper(audioFilePath) {
  console.log(`  Transcribing with Whisper...`);

  const formData = new FormData();
  formData.append('file', fs.createReadStream(audioFilePath));
  formData.append('model', 'whisper-1');
  formData.append('response_format', 'verbose_json');
  formData.append('timestamp_granularities[]', 'word');

  const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      ...formData.getHeaders(),
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Whisper API error: ${response.status} - ${errorText}`);
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
 * Map Whisper words to prayer lines with timestamps
 */
function mapWordsToLines(whisperWords, prayerLines) {
  const lineTimings = [];
  let currentLineIndex = 0;
  let currentLineWords = [];
  let currentLineStartMs = null;

  // Get expected words for current line
  let expectedWords = prayerLines[currentLineIndex]
    .toLowerCase()
    .replace(/[.,!?;:]/g, '')
    .split(/\s+/);

  for (const wordData of whisperWords) {
    const word = wordData.word.toLowerCase().replace(/[.,!?;:]/g, '');
    const startMs = Math.round(wordData.start * 1000);
    const endMs = Math.round(wordData.end * 1000);

    if (currentLineStartMs === null) {
      currentLineStartMs = startMs;
    }

    currentLineWords.push(word);

    // Check if we've completed the current line
    const matchedAllWords = expectedWords.every(ew =>
      currentLineWords.some(cw => cw.includes(ew) || ew.includes(cw))
    );

    if (matchedAllWords && currentLineIndex < prayerLines.length) {
      // Line complete
      lineTimings.push({
        line: currentLineIndex,
        text: prayerLines[currentLineIndex],
        startMs: currentLineStartMs,
        endMs: endMs,
      });

      // Move to next line
      currentLineIndex++;
      currentLineWords = [];
      currentLineStartMs = null;

      if (currentLineIndex < prayerLines.length) {
        expectedWords = prayerLines[currentLineIndex]
          .toLowerCase()
          .replace(/[.,!?;:]/g, '')
          .split(/\s+/);
      }
    }
  }

  // Handle any remaining line
  if (currentLineIndex < prayerLines.length && currentLineWords.length > 0) {
    const lastWord = whisperWords[whisperWords.length - 1];
    lineTimings.push({
      line: currentLineIndex,
      text: prayerLines[currentLineIndex],
      startMs: currentLineStartMs,
      endMs: Math.round(lastWord.end * 1000),
    });
  }

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

      // Map words to prayer lines
      const prayerLines = getPrayerLines(prayerContent[title]);
      const lineTimings = mapWordsToLines(whisperResult.words, prayerLines);

      console.log(`  ✓ Mapped to ${lineTimings.length} lines`);

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
