/**
 * Regenerate Prayer Line Timings
 *
 * Regenerates line_timings for all prayers with audio.
 * Uses proportional timing based on audio duration and word counts.
 */

const { createClient } = require('@supabase/supabase-js');
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

// Audio durations in milliseconds (measured from actual files with ffprobe)
const AUDIO_DURATIONS = {
  'I_Speak_Healing': 205504,                     // 3:25
  'Complete_Declaration_of_Restoration': 971866, // 16:12
  'I_Am_Open_to_Receive': 958868,                // 15:59 (NOTE: originally this was different audio)
  'Breaking_the_Chains': 556150,                 // 9:16
  'I_Am_at_Peace': 353406,                       // 5:53
  'The_Courage_to_Be_Still': 678420,             // 11:18
  'The_Frequency_of_Thankfulness': 736219,       // 12:16
  'Communion_with_the_Divine': 729938,           // 12:10
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

/**
 * Generate proportional timings based on word count
 */
function generateProportionalTimings(lines, audioDurationMs) {
  // Account for intro/outro silence (about 5 seconds each)
  const introMs = 5000;
  const outroMs = 5000;
  const speechDurationMs = audioDurationMs - introMs - outroMs;

  // Count words per line
  const lineWordCounts = lines.map(line =>
    line.split(/\s+/).filter(word => word.length > 0).length
  );
  const totalWords = lineWordCounts.reduce((sum, count) => sum + count, 0);

  if (totalWords === 0) return [];

  // Distribute time proportionally by word count
  let currentTimeMs = introMs;
  const timings = lines.map((text, index) => {
    const wordCount = lineWordCounts[index];
    const lineDurationMs = (wordCount / totalWords) * speechDurationMs;
    const startMs = Math.round(currentTimeMs);
    const endMs = Math.round(currentTimeMs + lineDurationMs);
    currentTimeMs = endMs;

    return {
      line: index,
      text,
      startMs,
      endMs
    };
  });

  return timings;
}

async function regenerateTimings() {
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║       Regenerate Prayer Line Timings                  ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  // Get all prayers with audio
  const { data: prayers, error: fetchError } = await supabase
    .from('prayers')
    .select('id, title, content, audio_url, duration_seconds')
    .not('audio_url', 'is', null)
    .order('order_index');

  if (fetchError) {
    console.error('Error fetching prayers:', fetchError.message);
    process.exit(1);
  }

  console.log(`Found ${prayers.length} prayers with audio\n`);

  let updated = 0;

  for (const prayer of prayers) {
    console.log(`Processing: ${prayer.title}`);

    const lines = getPrayerLines(prayer.content);
    console.log(`  Lines: ${lines.length}`);

    // Get audio duration
    let audioDurationMs = AUDIO_DURATIONS[prayer.title];
    if (!audioDurationMs && prayer.duration_seconds) {
      audioDurationMs = prayer.duration_seconds * 1000;
    }
    if (!audioDurationMs) {
      console.log(`  ⚠️  No duration available, using default 5 minutes`);
      audioDurationMs = 300000;
    }
    console.log(`  Duration: ${(audioDurationMs / 1000 / 60).toFixed(1)} minutes`);

    // Generate timings
    const timings = generateProportionalTimings(lines, audioDurationMs);
    console.log(`  Generated ${timings.length} timings`);

    // Show first few timings
    if (timings.length > 0) {
      console.log(`  First timing: ${timings[0].startMs}ms - ${timings[0].endMs}ms "${timings[0].text.substring(0, 40)}..."`);
      console.log(`  Last timing: ${timings[timings.length-1].startMs}ms - ${timings[timings.length-1].endMs}ms`);
    }

    // Update database
    const { error: updateError } = await supabase
      .from('prayers')
      .update({ line_timings: timings })
      .eq('id', prayer.id);

    if (updateError) {
      console.error(`  ❌ Error: ${updateError.message}`);
    } else {
      console.log(`  ✅ Timings updated!`);
      updated++;
    }
    console.log('');
  }

  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║                     SUMMARY                            ║');
  console.log('╠════════════════════════════════════════════════════════╣');
  console.log(`║  Updated: ${updated}`);
  console.log('╚════════════════════════════════════════════════════════╝');

  if (updated > 0) {
    console.log('\n✅ Line timings regenerated!');
    console.log('   Restart the app and test the prayer playback.');
  }
}

regenerateTimings().catch(err => {
  console.error('\n❌ Fatal error:', err.message);
  process.exit(1);
});
