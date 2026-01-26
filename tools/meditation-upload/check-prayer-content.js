/**
 * Check Prayer Content and Timings
 *
 * Displays the current content and line_timings for prayers to debug sync issues.
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

async function checkPrayerContent() {
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║        Check Prayer Content and Line Timings          ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  // Get first prayer (I Speak Healing)
  const { data: prayers, error } = await supabase
    .from('prayers')
    .select('*')
    .not('audio_url', 'is', null)
    .order('order_index')
    .limit(2);

  if (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }

  for (const prayer of prayers) {
    console.log('═'.repeat(60));
    console.log(`PRAYER: ${prayer.title}`);
    console.log(`Order: ${prayer.order_index}`);
    console.log(`Audio URL: ${prayer.audio_url}`);
    console.log('═'.repeat(60));

    console.log('\n📝 CONTENT (first 500 chars):');
    console.log('-'.repeat(40));
    console.log(prayer.content?.substring(0, 500) || '(no content)');
    console.log('...');

    console.log('\n⏱️ LINE TIMINGS (raw JSON):');
    console.log('-'.repeat(40));
    if (prayer.line_timings && Array.isArray(prayer.line_timings)) {
      console.log(`Total lines: ${prayer.line_timings.length}`);
      console.log('\nFirst 5 timings (raw):');
      prayer.line_timings.slice(0, 5).forEach((timing, i) => {
        console.log(`  ${i}: ${JSON.stringify(timing)}`);
      });

      // Check what fields are present
      if (prayer.line_timings.length > 0) {
        const firstTiming = prayer.line_timings[0];
        console.log('\n  Fields in first timing:', Object.keys(firstTiming));
        console.log('  Has startMs?', 'startMs' in firstTiming);
        console.log('  Has endMs?', 'endMs' in firstTiming);
        console.log('  startMs value:', firstTiming.startMs);
        console.log('  endMs value:', firstTiming.endMs);
      }
    } else {
      console.log('(no line_timings or not an array)');
      console.log('Type:', typeof prayer.line_timings);
      console.log('Raw value:', JSON.stringify(prayer.line_timings)?.substring(0, 200));
    }

    console.log('\n');
  }
}

checkPrayerContent().catch(err => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
