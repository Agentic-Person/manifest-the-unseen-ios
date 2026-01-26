/**
 * Check Meditation Audio Files
 *
 * Verifies that meditation audio URLs in the database match actual files in Supabase storage.
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

async function checkMeditationAudio() {
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║      Check Meditation Audio Files in Storage          ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  // Get all meditations from database
  const { data: meditations, error: fetchError } = await supabase
    .from('meditations')
    .select('id, title, audio_url, type')
    .order('order_index');

  if (fetchError) {
    console.error('Error fetching meditations:', fetchError.message);
    process.exit(1);
  }

  console.log(`Found ${meditations.length} meditations in database\n`);

  // List all folders and files in storage
  const folders = ['guided', 'breathing', 'music'];
  const storageFiles = {};

  for (const folder of folders) {
    const { data: files, error } = await supabase
      .storage
      .from('meditation-audio')
      .list(folder, { limit: 100 });

    if (error) {
      console.error(`Error listing ${folder}:`, error.message);
    } else {
      storageFiles[folder] = files.map(f => f.name);
      console.log(`📂 ${folder}/ has ${files.length} files`);
    }
  }

  // Also check root
  const { data: rootFiles } = await supabase
    .storage
    .from('meditation-audio')
    .list('', { limit: 100 });
  storageFiles['root'] = rootFiles?.filter(f => f.name.endsWith('.m4a') || f.name.endsWith('.mp3')).map(f => f.name) || [];
  console.log(`📂 root/ has ${storageFiles['root'].length} audio files`);

  console.log('\nChecking database audio_url vs storage files:\n');

  let found = 0;
  let missing = 0;

  for (const med of meditations) {
    if (!med.audio_url) {
      continue; // Skip meditations without audio
    }

    // Parse folder from audio_url
    // Format is like "guided/some-file.m4a" or just "file.m4a"
    const parts = med.audio_url.split('/');
    let folder, filename;
    if (parts.length > 1) {
      folder = parts[0];
      filename = parts.slice(1).join('/');
    } else {
      folder = 'root';
      filename = parts[0];
    }

    const folderFiles = storageFiles[folder] || [];
    const exists = folderFiles.includes(filename);

    if (exists) {
      console.log(`✅ [${med.type}] ${med.title}`);
      found++;
    } else {
      console.log(`❌ [${med.type}] ${med.title}`);
      console.log(`   audio_url: ${med.audio_url}`);
      console.log(`   NOT FOUND in storage/${folder}/`);
      missing++;
    }
  }

  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║                     SUMMARY                            ║');
  console.log('╠════════════════════════════════════════════════════════╣');
  console.log(`║  Found: ${found}`);
  console.log(`║  Missing: ${missing}`);
  console.log('╚════════════════════════════════════════════════════════╝');
}

// Run
checkMeditationAudio().catch(err => {
  console.error('\n❌ Fatal error:', err.message);
  process.exit(1);
});
