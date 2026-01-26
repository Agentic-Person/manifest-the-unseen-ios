/**
 * Restore Prayer Content
 *
 * Restores the correct prayer content from prayer-content.json to match
 * the actual audio narration. The Google Sheet sync may have overwritten
 * the content with a different/shortened version.
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

// Load correct content from prayer-content.json
const prayerContentFile = path.join(__dirname, 'prayer-content.json');
const PRAYER_CONTENT = JSON.parse(fs.readFileSync(prayerContentFile, 'utf8'));

// Map from database title format to prayer-content.json key format
// Database: "I_Speak_Healing" -> JSON: "I_Speak_Healing"
// Both use underscores now, so direct lookup should work

async function restorePrayerContent() {
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║     Restore Prayer Content from prayer-content.json   ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  // Get all prayers with audio from database
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
  console.log('Available content keys:', Object.keys(PRAYER_CONTENT));
  console.log('');

  let updated = 0;
  let notFound = 0;

  for (const prayer of prayers) {
    // Try to find matching content
    // Database title might be "I_Speak_Healing"
    // JSON key might be "I_Speak_Healing" or with different casing
    let correctContent = PRAYER_CONTENT[prayer.title];

    // If not found, try case-insensitive match
    if (!correctContent) {
      const keys = Object.keys(PRAYER_CONTENT);
      const matchKey = keys.find(k => k.toLowerCase() === prayer.title.toLowerCase());
      if (matchKey) {
        correctContent = PRAYER_CONTENT[matchKey];
      }
    }

    if (!correctContent) {
      console.log(`⚠️  No content found for: "${prayer.title}"`);
      notFound++;
      continue;
    }

    // Compare current vs correct content
    const currentLineCount = (prayer.content || '').split('\n').length;
    const correctLineCount = correctContent.split('\n').length;

    if (prayer.content === correctContent) {
      console.log(`✓ "${prayer.title}" - already correct (${currentLineCount} lines)`);
      continue;
    }

    console.log(`Updating "${prayer.title}":`);
    console.log(`  Current: ${currentLineCount} lines`);
    console.log(`  Correct: ${correctLineCount} lines`);

    // Show first line comparison
    const currentFirst = (prayer.content || '').split('\n')[0] || '(empty)';
    const correctFirst = correctContent.split('\n')[0] || '(empty)';
    console.log(`  Current first line: "${currentFirst.substring(0, 50)}..."`);
    console.log(`  Correct first line: "${correctFirst.substring(0, 50)}..."`);

    const { error: updateError } = await supabase
      .from('prayers')
      .update({ content: correctContent })
      .eq('id', prayer.id);

    if (updateError) {
      console.error(`  ❌ Error: ${updateError.message}`);
    } else {
      console.log(`  ✅ Content restored!`);
      updated++;
    }
    console.log('');
  }

  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║                     SUMMARY                            ║');
  console.log('╠════════════════════════════════════════════════════════╣');
  console.log(`║  Restored: ${updated}`);
  console.log(`║  Not found: ${notFound}`);
  console.log('╚════════════════════════════════════════════════════════╝');

  if (updated > 0) {
    console.log('\n✅ Prayer content restored!');
    console.log('\n⚠️  IMPORTANT: Line timings need to be regenerated to match new content.');
    console.log('   Run: node regenerate-prayer-timings.js');
  }
}

restorePrayerContent().catch(err => {
  console.error('\n❌ Fatal error:', err.message);
  process.exit(1);
});
