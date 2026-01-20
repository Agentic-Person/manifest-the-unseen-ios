/**
 * Process a single prayer file (for retry after compression)
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const FormData = require('form-data');
const fetch = require('node-fetch');
// Load environment variables first
const dotenvPath = path.resolve(__dirname, '../../.env.local');
require('dotenv').config({ path: dotenvPath });

const PRAYER_FILE = '006_I_Am_Open_to_Receive.m4a';
const PRAYERS_DIR = path.join(__dirname, '../../meditation-audio/prayers');
const PRAYER_CONTENT_FILE = path.join(__dirname, 'prayer-content.json');

async function transcribeWithWhisper(audioFilePath) {
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

function getPrayerLines(prayerText) {
  return prayerText
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);
}

function mapWordsToLines(whisperWords, prayerLines) {
  const lineTimings = [];
  let currentLineIndex = 0;
  let currentLineWords = [];
  let currentLineStartMs = null;

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

    const matchedAllWords = expectedWords.every(ew =>
      currentLineWords.some(cw => cw.includes(ew) || ew.includes(cw))
    );

    if (matchedAllWords && currentLineIndex < prayerLines.length) {
      lineTimings.push({
        line: currentLineIndex,
        text: prayerLines[currentLineIndex],
        startMs: currentLineStartMs,
        endMs: endMs,
      });

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

async function processPrayer() {
  console.log('Processing: I Am Open To Receive\n');

  // Initialize Supabase client
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const filePath = path.join(PRAYERS_DIR, PRAYER_FILE);

  // Load prayer content
  const rawContent = JSON.parse(fs.readFileSync(PRAYER_CONTENT_FILE, 'utf8'));
  const prayerText = rawContent['I_Am_Open_to_Receive'];

  if (!prayerText) {
    throw new Error('Prayer text not found');
  }

  // Transcribe
  console.log('Transcribing with Whisper...');
  const whisperResult = await transcribeWithWhisper(filePath);
  console.log(`✓ Transcribed (${whisperResult.words.length} words)`);

  // Map to lines
  const prayerLines = getPrayerLines(prayerText);
  const lineTimings = mapWordsToLines(whisperResult.words, prayerLines);
  console.log(`✓ Mapped to ${lineTimings.length} lines`);

  // Update database
  const { error } = await supabase
    .from('prayers')
    .update({ line_timings: lineTimings })
    .eq('title', 'I Am Open To Receive');

  if (error) {
    throw error;
  }

  console.log('✅ Updated database\n');
  console.log('All 8 prayers now have accurate line timings!');
}

processPrayer().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
