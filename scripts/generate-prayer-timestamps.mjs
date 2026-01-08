/**
 * Prayer Timestamp Generator
 *
 * Downloads prayer audio files from Supabase Storage,
 * processes them through OpenAI Whisper to generate timestamps,
 * and updates the database with line_timings.
 *
 * Prerequisites:
 *   - Node.js 18+
 *   - OpenAI Whisper CLI installed: pip install openai-whisper
 *   - ffmpeg installed (for audio conversion)
 *   - .env with SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 *
 * Usage:
 *   node scripts/generate-prayer-timestamps.mjs [--prayer-id UUID]
 *   node scripts/generate-prayer-timestamps.mjs --all
 */

import { createClient } from '@supabase/supabase-js';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables from .env.local (root) and mobile/.env
dotenv.config({ path: '.env.local' });
dotenv.config({ path: 'mobile/.env' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const TEMP_DIR = path.join(__dirname, '../.tmp-whisper');
const WHISPER_MODEL = 'tiny'; // Use 'small' or 'medium' for better accuracy
const WHISPER_SCRIPT = path.join(__dirname, 'whisper_transcribe.py');

// Supabase client - prefer service role key for admin access, fall back to anon key
const supabaseUrl = process.env.SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables:');
  console.error('   - SUPABASE_URL or EXPO_PUBLIC_SUPABASE_URL');
  console.error('   - SUPABASE_SERVICE_ROLE_KEY or EXPO_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const usingServiceRole = !!process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Download audio file from Supabase Storage
 */
async function downloadAudio(audioPath, localPath) {
  console.log(`   Downloading: ${audioPath}`);

  const { data, error } = await supabase.storage
    .from('meditation-audio')
    .download(audioPath);

  if (error) throw error;

  const buffer = await data.arrayBuffer();
  fs.writeFileSync(localPath, Buffer.from(buffer));
  console.log(`   Downloaded to: ${localPath}`);
}

/**
 * Run Whisper transcription with timestamps
 * Returns segments with timing
 */
function transcribeWithWhisper(audioPath) {
  const baseName = path.basename(audioPath, path.extname(audioPath));
  const jsonPath = path.join(TEMP_DIR, `${baseName}.json`);

  console.log(`   Running Whisper (model: ${WHISPER_MODEL})...`);

  try {
    // Add WinGet Links to PATH for ffmpeg
    const wingetPath = 'C:\\Users\\jimmy\\AppData\\Local\\Microsoft\\WinGet\\Links';
    const envPath = process.env.PATH || '';
    const newPath = envPath.includes(wingetPath) ? envPath : `${wingetPath};${envPath}`;

    execSync(
      `python "${WHISPER_SCRIPT}" "${audioPath}" "${TEMP_DIR}" --model ${WHISPER_MODEL}`,
      {
        stdio: 'inherit',
        env: { ...process.env, PATH: newPath },
      }
    );
  } catch (err) {
    console.error('   Whisper error:', err.message);
    throw err;
  }

  const result = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  console.log(`   Whisper found ${result.segments.length} segments`);

  return result.segments;
}

/**
 * Normalize text for comparison - remove punctuation and extra whitespace
 */
function normalizeText(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Simple approach: Map lines to timeline based on sequential order
 * Since prayers are spoken in order, we just need to find timing boundaries
 */
function matchSegmentsToLines(segments, prayerContent) {
  // Parse prayer content into lines
  const lines = prayerContent
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  console.log(`   Mapping ${segments.length} segments to ${lines.length} lines`);

  if (segments.length === 0) {
    console.warn('   No segments from Whisper!');
    return [];
  }

  // Get total audio duration from last segment
  const totalDurationMs = Math.round(segments[segments.length - 1].end * 1000);

  // Find the start of actual speech (skip intro music)
  // Look for first segment that starts after potential intro
  let speechStartMs = 0;
  if (segments.length > 0) {
    speechStartMs = Math.round(segments[0].start * 1000);
    console.log(`   Speech starts at: ${speechStartMs}ms`);
  }

  // Calculate speech duration (excluding intro)
  const speechDurationMs = totalDurationMs - speechStartMs;

  // Calculate total word count for proportional timing
  const lineWordCounts = lines.map(line =>
    line.split(/\s+/).filter(w => w.length > 0).length
  );
  const totalWords = lineWordCounts.reduce((sum, count) => sum + count, 0);

  console.log(`   Total words: ${totalWords}, Speech duration: ${speechDurationMs}ms`);

  // Build line timings based on word count proportion
  const lineTimings = [];
  let currentTimeMs = speechStartMs;
  const msPerWord = speechDurationMs / totalWords;
  const linePauseMs = 200; // Small pause between lines

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const lineText = lines[lineIndex];
    const wordCount = lineWordCounts[lineIndex];
    const lineDurationMs = Math.round(wordCount * msPerWord);

    const startMs = Math.round(currentTimeMs);
    const endMs = Math.round(currentTimeMs + lineDurationMs);

    lineTimings.push({
      line: lineIndex,
      text: lineText,
      startMs,
      endMs,
    });

    currentTimeMs = endMs + linePauseMs;
  }

  console.log(`   Generated ${lineTimings.length} line timings`);
  console.log(`   First line starts at: ${lineTimings[0]?.startMs}ms`);
  console.log(`   Last line ends at: ${lineTimings[lineTimings.length - 1]?.endMs}ms`);

  return lineTimings;
}

/**
 * Update prayer in database with line timings
 */
async function updatePrayerTimings(prayerId, lineTimings) {
  const { error } = await supabase
    .from('prayers')
    .update({ line_timings: lineTimings })
    .eq('id', prayerId);

  if (error) throw error;
}

/**
 * Process a single prayer
 */
async function processPrayer(prayer) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Processing: ${prayer.title}`);
  console.log(`ID: ${prayer.id}`);
  console.log(`Audio: ${prayer.audio_url}`);
  console.log(`Content lines: ${prayer.content.split('\n').filter((l) => l.trim()).length}`);
  console.log(`${'='.repeat(60)}`);

  const localAudioPath = path.join(TEMP_DIR, path.basename(prayer.audio_url));

  try {
    // Download audio
    await downloadAudio(prayer.audio_url, localAudioPath);

    // Transcribe with timestamps
    const segments = transcribeWithWhisper(localAudioPath);

    // Match to lines
    const lineTimings = matchSegmentsToLines(segments, prayer.content);

    if (lineTimings.length === 0) {
      console.error('   ❌ No line timings generated - skipping update');
      return;
    }

    // Update database
    console.log(`   Updating database with ${lineTimings.length} line timings...`);
    await updatePrayerTimings(prayer.id, lineTimings);

    console.log(`   ✅ Success! ${lineTimings.length} line timings saved.`);
  } catch (err) {
    console.error(`   ❌ Error: ${err.message}`);
    throw err;
  } finally {
    // Cleanup audio file
    if (fs.existsSync(localAudioPath)) {
      fs.unlinkSync(localAudioPath);
    }
  }
}

/**
 * Main entry point
 */
async function main() {
  console.log('\n🎙️  Prayer Timestamp Generator');
  console.log('================================\n');

  console.log(`📡 Supabase URL: ${supabaseUrl}`);
  console.log(`🔑 Using ${usingServiceRole ? 'Service Role Key (admin)' : 'Anon Key (may have limited access)'}`);
  if (!usingServiceRole) {
    console.log('   ⚠️  For full access, set SUPABASE_SERVICE_ROLE_KEY\n');
  }

  // Check for Whisper Python module
  try {
    execSync('python -c "import whisper"', { stdio: 'pipe' });
    console.log('✅ Whisper Python module found');
  } catch {
    console.error('❌ Whisper Python module not found!');
    console.error('   Install with: pip install openai-whisper');
    process.exit(1);
  }

  // Create temp directory
  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
  }

  // Get prayers with audio
  const { data: prayers, error } = await supabase
    .from('prayers')
    .select('*')
    .not('audio_url', 'is', null);

  if (error) {
    console.error('❌ Failed to fetch prayers:', error.message);
    process.exit(1);
  }

  console.log(`📿 Found ${prayers.length} prayers with audio\n`);

  // Check for specific prayer ID argument
  const args = process.argv.slice(2);
  const specificId = args.find((arg) => arg.startsWith('--prayer-id='))?.split('=')[1];
  const processAll = args.includes('--all');

  if (!specificId && !processAll) {
    console.log('Usage:');
    console.log('  node scripts/generate-prayer-timestamps.mjs --all');
    console.log('  node scripts/generate-prayer-timestamps.mjs --prayer-id=UUID');
    console.log('\nAvailable prayers:');
    prayers.forEach((p) => {
      console.log(`  - ${p.id}: ${p.title}`);
    });
    process.exit(0);
  }

  const prayersToProcess = specificId
    ? prayers.filter((p) => p.id === specificId)
    : prayers;

  if (prayersToProcess.length === 0) {
    console.error('❌ No prayers found to process');
    process.exit(1);
  }

  // Process each prayer
  let successCount = 0;
  let errorCount = 0;

  for (const prayer of prayersToProcess) {
    try {
      await processPrayer(prayer);
      successCount++;
    } catch (err) {
      console.error(`   Error processing ${prayer.title}:`, err.message);
      errorCount++;
    }
  }

  // Cleanup temp directory
  if (fs.existsSync(TEMP_DIR)) {
    fs.rmSync(TEMP_DIR, { recursive: true, force: true });
  }

  console.log('\n================================');
  console.log(`✅ Completed: ${successCount} prayers`);
  if (errorCount > 0) {
    console.log(`❌ Errors: ${errorCount} prayers`);
  }
  console.log('================================\n');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
