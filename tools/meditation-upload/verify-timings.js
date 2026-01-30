/**
 * Verify Prayer Timings
 * Checks that all prayers with audio have matching line_timings
 */

const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env.local') });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function verify() {
  const { data, error } = await supabase
    .from('prayers')
    .select('title, content, line_timings, audio_url')
    .not('audio_url', 'is', null)
    .order('order_index');

  if (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }

  console.log('');
  console.log('='.repeat(72));
  console.log('                    VERIFICATION RESULTS');
  console.log('='.repeat(72));

  let allMatch = true;
  data.forEach(p => {
    const contentLines = p.content
      ? p.content.split('\n').map(l => l.trim()).filter(l => l.length > 0).length
      : 0;
    const timingLines = Array.isArray(p.line_timings) ? p.line_timings.length : 0;
    const match = contentLines === timingLines;
    if (!match) allMatch = false;

    const status = match ? '[OK]' : '[!!]';
    const title = p.title.substring(0, 35).padEnd(35);
    console.log(`${status} ${title} | Content: ${String(contentLines).padStart(3)} | Timings: ${String(timingLines).padStart(3)}`);
  });

  console.log('='.repeat(72));
  console.log(`Overall: ${allMatch ? 'ALL PRAYERS SYNCED CORRECTLY' : 'SOME PRAYERS HAVE MISMATCHES'}`);
  console.log('='.repeat(72));

  // Show sample timing from first prayer
  if (data[0]?.line_timings?.length > 0) {
    console.log('\nSample timing (first prayer, first 3 lines):');
    data[0].line_timings.slice(0, 3).forEach((t, i) => {
      const text = t.text.length > 50 ? t.text.substring(0, 50) + '...' : t.text;
      console.log(`  Line ${i}: ${t.startMs}ms - ${t.endMs}ms`);
      console.log(`    "${text}"`);
    });
  }
}

verify().catch(err => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
