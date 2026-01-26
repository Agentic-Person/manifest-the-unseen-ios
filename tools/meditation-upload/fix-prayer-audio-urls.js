/**
 * Fix Prayer Audio URLs
 *
 * Updates prayer audio_url values to match actual filenames in Supabase storage.
 * Storage uses lowercase with hyphens: 001-i-speak-healing.m4a
 * Database had Title_Case with underscores: 001_I_Speak_Healing.m4a
 */

const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env.local') });

// Validate environment
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Map from database titles to actual storage filenames
// Based on what's actually in Supabase storage
const STORAGE_FILENAME_MAP = {
  'I_Speak_Healing': '001-i-speak-healing.m4a',
  'Complete_Declaration_of_Restoration': '002-complete-declaration-of-restoration.m4a',
  'I_Am_Open_to_Receive': '006-i-am-open-to-receive.m4a',
  'Breaking_the_Chains': '014-breaking-the-chains.m4a',
  'I_Am_at_Peace': '017-i-am-at-peace.m4a',
  'The_Courage_to_Be_Still': '018-the-courage-to-be-still.m4a',
  'The_Frequency_of_Thankfulness': '022-the-frequency-of-thankfulness.m4a',
  'Communion_with_the_Divine': '038-communion-with-the-divine.m4a',
};

async function fixPrayerAudioUrls() {
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║     Fix Prayer Audio URLs - Match Storage Names       ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  // Get all prayers with audio
  const { data: prayers, error: fetchError } = await supabase
    .from('prayers')
    .select('id, title, audio_url')
    .not('audio_url', 'is', null)
    .order('order_index');

  if (fetchError) {
    console.error('Error fetching prayers:', fetchError.message);
    process.exit(1);
  }

  console.log(`Found ${prayers.length} prayers with audio\n`);

  let fixed = 0;
  let notFound = 0;

  for (const prayer of prayers) {
    const storageFilename = STORAGE_FILENAME_MAP[prayer.title];

    if (!storageFilename) {
      console.log(`⚠️  No mapping for: "${prayer.title}"`);
      notFound++;
      continue;
    }

    const newAudioUrl = `prayers/${storageFilename}`;

    if (prayer.audio_url === newAudioUrl) {
      console.log(`✓ "${prayer.title}" - already correct`);
      continue;
    }

    console.log(`Fixing "${prayer.title}":`);
    console.log(`  Old: ${prayer.audio_url}`);
    console.log(`  New: ${newAudioUrl}`);

    const { error: updateError } = await supabase
      .from('prayers')
      .update({ audio_url: newAudioUrl })
      .eq('id', prayer.id);

    if (updateError) {
      console.error(`  ❌ Error: ${updateError.message}`);
    } else {
      console.log(`  ✅ Fixed!`);
      fixed++;
    }
  }

  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║                     SUMMARY                            ║');
  console.log('╠════════════════════════════════════════════════════════╣');
  console.log(`║  Fixed: ${fixed}`);
  console.log(`║  No mapping: ${notFound}`);
  console.log('╚════════════════════════════════════════════════════════╝');

  if (fixed > 0) {
    console.log('\n✅ Prayer audio URLs fixed!');
    console.log('   The app should now load audio correctly.');
    console.log('\n   Note: No new build is needed - the fix is in the database.');
    console.log('   Just restart the app and try playing a prayer again.');
  }
}

// Run
fixPrayerAudioUrls().catch(err => {
  console.error('\n❌ Fatal error:', err.message);
  process.exit(1);
});
