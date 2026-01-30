/**
 * Re-upload a single prayer audio file and update database
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

const WHISPER_URL = `${process.env.SUPABASE_URL}/functions/v1/whisper-transcribe`;

// Prayer to re-upload
const LOCAL_FILE = 'C:/projects/mobileApps/manifest-the-unseen-ios/meditation-audio/prayers/001_I_Speak_Healing.m4a';
const STORAGE_PATH = 'prayers/001-i-speak-healing.m4a';
const PRAYER_TITLE = 'I_Speak_Healing';

// Content from Google Sheet (the correct version)
const CORRECT_CONTENT = `I stand in the truth of who I am.

I am energy.
I am frequency.
I am a being designed for wholeness.

The Kingdom of God is within me...
and so is my healing.

I speak to every cell in my body...
Align.

I speak to every organ...
every tissue...
every system...
Remember your original design.

My body is not fighting against me.
My body is fighting for me.
And today...
I partner with it.

I release the vibration of sickness.
I release the frequency of fear.
I release every belief that says healing is not for me.

I am worthy of health.
I am worthy of vitality.
I am worthy of waking up in a body that feels alive.

Yeshua said...
by His stripes I am healed.
Not I will be healed.
I am healed.

I do not beg for healing.
I receive it.

I do not hope for restoration.
I embody it.

My body hears the frequency of wholeness.
My cells respond to the signal I am broadcasting.

And that signal is health.
That signal is restoration.
That signal is life.

I am healed.
I am whole.
I am restored.

And so it is.`;

function getPrayerLines(content) {
  return content.split('\n').map(l => l.trim()).filter(l => l.length > 0);
}

function generateTimingsFromWhisper(whisperResult, lines) {
  const words = whisperResult.words || [];
  if (words.length === 0) return null;

  const audioDurationMs = Math.round((words[words.length - 1].end || 0) * 1000);
  const speechStartMs = Math.round((words[0].start || 0) * 1000);
  const totalSpeechDurationMs = audioDurationMs - speechStartMs;

  const lineWordCounts = lines.map(line =>
    line.split(/\s+/).filter(w => w.length > 0).length
  );
  const totalWords = lineWordCounts.reduce((sum, c) => sum + c, 0);

  if (totalWords === 0) return null;

  let currentTimeMs = speechStartMs;
  return lines.map((text, index) => {
    const wordCount = lineWordCounts[index];
    const lineDurationMs = (wordCount / totalWords) * totalSpeechDurationMs;
    const startMs = Math.round(currentTimeMs);
    const endMs = Math.round(startMs + lineDurationMs);
    currentTimeMs = endMs;
    return { line: index, text, startMs, endMs };
  });
}

async function reuploadPrayer() {
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║        Re-upload Prayer: I_Speak_Healing              ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  // Step 1: Read audio file
  console.log('1. Reading audio file...');
  if (!fs.existsSync(LOCAL_FILE)) {
    console.error(`   ❌ File not found: ${LOCAL_FILE}`);
    process.exit(1);
  }
  const audioBuffer = fs.readFileSync(LOCAL_FILE);
  console.log(`   Size: ${(audioBuffer.length / 1024 / 1024).toFixed(2)} MB`);

  // Step 2: Upload to Supabase Storage (replace existing)
  console.log('\n2. Uploading to Supabase Storage...');
  const { error: uploadError } = await supabase.storage
    .from('meditation-audio')
    .upload(STORAGE_PATH, audioBuffer, {
      contentType: 'audio/mp4',
      upsert: true  // Replace if exists
    });

  if (uploadError) {
    console.error(`   ❌ Upload failed: ${uploadError.message}`);
    process.exit(1);
  }
  console.log(`   ✅ Uploaded to ${STORAGE_PATH}`);

  // Step 3: Update database content
  console.log('\n3. Updating database content...');
  const lines = getPrayerLines(CORRECT_CONTENT);
  console.log(`   Content lines: ${lines.length}`);

  const { data: prayer, error: fetchError } = await supabase
    .from('prayers')
    .select('id')
    .eq('title', PRAYER_TITLE)
    .single();

  if (fetchError || !prayer) {
    console.error(`   ❌ Prayer not found: ${PRAYER_TITLE}`);
    process.exit(1);
  }

  const { error: updateError } = await supabase
    .from('prayers')
    .update({ content: CORRECT_CONTENT })
    .eq('id', prayer.id);

  if (updateError) {
    console.error(`   ❌ Update failed: ${updateError.message}`);
    process.exit(1);
  }
  console.log(`   ✅ Content updated`);

  // Step 4: Transcribe with Whisper
  console.log('\n4. Transcribing with Whisper...');
  const audioBase64 = audioBuffer.toString('base64');

  const response = await fetch(WHISPER_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
    },
    body: JSON.stringify({
      audioBase64,
      filename: '001_I_Speak_Healing.m4a',
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`   ❌ Whisper failed: ${response.status} - ${errorText}`);
    process.exit(1);
  }

  const whisperResult = await response.json();
  console.log(`   ✅ Transcribed (${whisperResult.words?.length || 0} words)`);

  // Step 5: Generate and save timings
  console.log('\n5. Generating line timings...');
  const timings = generateTimingsFromWhisper(whisperResult, lines);

  if (!timings) {
    console.error(`   ❌ Failed to generate timings`);
    process.exit(1);
  }

  console.log(`   Generated ${timings.length} timings`);
  console.log(`   First: ${timings[0].startMs}ms - "${timings[0].text.substring(0, 40)}..."`);
  console.log(`   Last: ${timings[timings.length-1].endMs}ms`);

  const { error: timingError } = await supabase
    .from('prayers')
    .update({ line_timings: timings })
    .eq('id', prayer.id);

  if (timingError) {
    console.error(`   ❌ Timing update failed: ${timingError.message}`);
    process.exit(1);
  }
  console.log(`   ✅ Timings saved`);

  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║                    COMPLETE                            ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  console.log('\n✅ Prayer re-uploaded successfully!');
  console.log('   Refresh the app to test.');
}

reuploadPrayer().catch(err => {
  console.error('\n❌ Fatal error:', err.message);
  process.exit(1);
});
