/**
 * Check Prayer Audio Files
 *
 * Verifies that prayer audio URLs in the database match actual files in Supabase storage.
 */

const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env.local') });

// Validate environment
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const SUPABASE_URL = process.env.SUPABASE_URL;

// Initialize Supabase client
const supabase = createClient(
  SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkPrayerAudio() {
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║        Check Prayer Audio Files in Storage            ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  // Get all prayers with audio from database
  const { data: prayers, error: fetchError } = await supabase
    .from('prayers')
    .select('id, title, audio_url, order_index')
    .not('audio_url', 'is', null)
    .order('order_index');

  if (fetchError) {
    console.error('Error fetching prayers:', fetchError.message);
    process.exit(1);
  }

  console.log(`Found ${prayers.length} prayers with audio in database\n`);

  // List all files in storage
  const { data: storageFiles, error: storageError } = await supabase
    .storage
    .from('meditation-audio')
    .list('prayers', { limit: 100 });

  if (storageError) {
    console.error('Error listing storage:', storageError.message);
    process.exit(1);
  }

  const storageFilenames = storageFiles.map(f => f.name);
  console.log(`Found ${storageFilenames.length} files in storage/prayers/:\n`);
  storageFilenames.forEach(f => console.log(`  📂 ${f}`));
  console.log('');

  // Check each prayer's audio URL
  console.log('Checking database audio_url vs storage files:\n');

  for (const prayer of prayers) {
    // audio_url is like "prayers/001_I_Speak_Healing.m4a"
    // we need just the filename part
    const expectedFilename = prayer.audio_url.replace('prayers/', '');
    const exists = storageFilenames.includes(expectedFilename);

    if (exists) {
      console.log(`✅ ${prayer.order_index}. ${prayer.title}`);
      console.log(`   audio_url: ${prayer.audio_url}`);
    } else {
      console.log(`❌ ${prayer.order_index}. ${prayer.title}`);
      console.log(`   audio_url: ${prayer.audio_url}`);
      console.log(`   Expected filename: ${expectedFilename}`);
      console.log(`   NOT FOUND in storage!`);

      // Find closest match
      const titlePart = expectedFilename.replace(/^\d{3}_/, '').replace('.m4a', '').toLowerCase();
      const possibleMatches = storageFilenames.filter(f =>
        f.toLowerCase().includes(titlePart.split('_')[0]) ||
        f.toLowerCase().includes(titlePart.split('_')[1] || '')
      );
      if (possibleMatches.length > 0) {
        console.log(`   Possible matches: ${possibleMatches.join(', ')}`);
      }
    }
    console.log('');
  }

  // Generate full public URL for first prayer
  console.log('\n📋 Example full URL for first prayer:');
  const firstPrayer = prayers[0];
  if (firstPrayer) {
    const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/meditation-audio/${firstPrayer.audio_url}`;
    console.log(`   ${publicUrl}`);
  }
}

// Run
checkPrayerAudio().catch(err => {
  console.error('\n❌ Fatal error:', err.message);
  process.exit(1);
});
