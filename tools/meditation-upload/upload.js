/**
 * Meditation Audio Upload Script
 *
 * Uploads meditation audio files to Supabase Storage and creates database entries.
 *
 * Usage:
 *   npm install
 *   npm run upload
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const mm = require('music-metadata');
require('dotenv').config({ path: path.join(__dirname, '../../.env.local') });

// Configuration
const BUCKET_NAME = 'meditation-audio';
const AUDIO_DIR = path.join(__dirname, '../../meditation-audio');

// Validate environment
const requiredEnvVars = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

// Initialize Supabase client with service role key
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * Convert filename to URL-friendly slug
 */
function slugify(filename) {
  return filename
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, '-')  // Replace non-alphanumeric with hyphens
    .replace(/-+/g, '-')           // Collapse multiple hyphens
    .replace(/^-|-$/g, '');        // Remove leading/trailing hyphens
}

/**
 * Generate display title from filename
 */
function generateTitle(filename) {
  // Remove extension
  const name = filename.replace(/\.(mp3|m4a|wav)$/i, '');
  // Remove common suffixes
  const cleaned = name
    .replace(/-Preview$/i, '')
    .replace(/-\d+min$/i, '')
    .replace(/\d+min$/i, '');
  // Convert to title case
  return cleaned
    .split(/[-_]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
    .trim();
}

/**
 * Extract duration from audio file
 */
async function getDuration(filePath) {
  try {
    const metadata = await mm.parseFile(filePath);
    return Math.round(metadata.format.duration || 0);
  } catch (err) {
    console.warn(`  Could not extract duration from ${path.basename(filePath)}: ${err.message}`);
    return 0;
  }
}

/**
 * Create storage bucket if it doesn't exist
 */
async function ensureBucket() {
  console.log(`\nChecking storage bucket '${BUCKET_NAME}'...`);

  const { data: buckets, error: listError } = await supabase.storage.listBuckets();

  if (listError) {
    throw new Error(`Failed to list buckets: ${listError.message}`);
  }

  const exists = buckets.some(b => b.name === BUCKET_NAME);

  if (!exists) {
    console.log(`  Creating bucket '${BUCKET_NAME}'...`);
    const { error: createError } = await supabase.storage.createBucket(BUCKET_NAME, {
      public: true,
      allowedMimeTypes: ['audio/mpeg', 'audio/mp4', 'audio/x-m4a', 'audio/wav']
    });

    if (createError) {
      throw new Error(`Failed to create bucket: ${createError.message}`);
    }
    console.log(`  Bucket created successfully`);
  } else {
    console.log(`  Bucket already exists`);
  }
}

/**
 * Upload a single file to storage
 */
async function uploadFile(filePath, storagePath) {
  const fileBuffer = fs.readFileSync(filePath);
  const ext = path.extname(filePath).toLowerCase();

  const mimeTypes = {
    '.mp3': 'audio/mpeg',
    '.m4a': 'audio/mp4',
    '.wav': 'audio/wav'
  };

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(storagePath, fileBuffer, {
      contentType: mimeTypes[ext] || 'audio/mpeg',
      upsert: true
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  return storagePath;
}

/**
 * Create database entry for meditation
 */
async function createDbEntry(meditation) {
  const { data, error } = await supabase
    .from('meditations')
    .insert(meditation)
    .select()
    .single();

  if (error) {
    throw new Error(`Database insert failed: ${error.message}`);
  }

  return data;
}

/**
 * Process guided meditation files
 */
async function processGuidedFiles() {
  const guidedDir = path.join(AUDIO_DIR, 'guided');

  if (!fs.existsSync(guidedDir)) {
    console.log('\nNo guided folder found, skipping...');
    return [];
  }

  console.log('\n=== Processing Guided Meditations ===');

  const files = fs.readdirSync(guidedDir).filter(f =>
    f.match(/\.(mp3|m4a|wav)$/i)
  );

  const results = [];
  let orderIndex = 10;

  for (const file of files) {
    const filePath = path.join(guidedDir, file);
    const slug = slugify(file);
    const storagePath = `guided/${slug}`;

    console.log(`\nProcessing: ${file}`);

    try {
      // Get duration
      const duration = await getDuration(filePath);
      console.log(`  Duration: ${Math.floor(duration / 60)}m ${duration % 60}s`);

      // Upload file
      console.log(`  Uploading to ${storagePath}...`);
      await uploadFile(filePath, storagePath);
      console.log(`  Uploaded successfully`);

      // Create database entry
      const meditation = {
        title: generateTitle(file),
        description: null,
        duration_seconds: duration,
        audio_url: storagePath,
        narrator_gender: 'female',
        tier_required: 'enlightenment',
        type: 'guided',
        order_index: orderIndex++,
        tags: ['guided', 'meditation']
      };

      console.log(`  Creating database entry: "${meditation.title}"`);
      const dbEntry = await createDbEntry(meditation);
      console.log(`  Database entry created: ${dbEntry.id}`);

      results.push({ file, success: true, id: dbEntry.id, title: meditation.title });

    } catch (err) {
      console.error(`  ERROR: ${err.message}`);
      results.push({ file, success: false, error: err.message });
    }
  }

  return results;
}

/**
 * Process music track files
 */
async function processMusicFiles() {
  const musicDir = path.join(AUDIO_DIR, 'music');

  if (!fs.existsSync(musicDir)) {
    console.log('\nNo music folder found, skipping...');
    return [];
  }

  console.log('\n=== Processing Music Tracks ===');

  const files = fs.readdirSync(musicDir).filter(f =>
    f.match(/\.(mp3|m4a|wav)$/i)
  );

  const results = [];
  let orderIndex = 40;

  for (const file of files) {
    const filePath = path.join(musicDir, file);
    const slug = slugify(file);
    const storagePath = `music/${slug}`;

    console.log(`\nProcessing: ${file}`);

    try {
      // Get duration
      const duration = await getDuration(filePath);
      console.log(`  Duration: ${Math.floor(duration / 60)}m ${duration % 60}s`);

      // Upload file
      console.log(`  Uploading to ${storagePath}...`);
      await uploadFile(filePath, storagePath);
      console.log(`  Uploaded successfully`);

      // Create database entry
      const meditation = {
        title: generateTitle(file),
        description: null,
        duration_seconds: duration,
        audio_url: storagePath,
        narrator_gender: 'female', // Placeholder for music
        tier_required: 'novice',
        type: 'music',
        order_index: orderIndex++,
        tags: ['music', 'ambient']
      };

      console.log(`  Creating database entry: "${meditation.title}"`);
      const dbEntry = await createDbEntry(meditation);
      console.log(`  Database entry created: ${dbEntry.id}`);

      results.push({ file, success: true, id: dbEntry.id, title: meditation.title });

    } catch (err) {
      console.error(`  ERROR: ${err.message}`);
      results.push({ file, success: false, error: err.message });
    }
  }

  return results;
}

/**
 * Main function
 */
async function main() {
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║     Meditation Audio Upload Tool                       ║');
  console.log('╠════════════════════════════════════════════════════════╣');
  console.log(`║  Source: ${AUDIO_DIR}`);
  console.log(`║  Bucket: ${BUCKET_NAME}`);
  console.log('╚════════════════════════════════════════════════════════╝');

  try {
    // Ensure bucket exists
    await ensureBucket();

    // Process files
    const guidedResults = await processGuidedFiles();
    const musicResults = await processMusicFiles();

    // Summary
    const allResults = [...guidedResults, ...musicResults];
    const successful = allResults.filter(r => r.success);
    const failed = allResults.filter(r => !r.success);

    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║                     SUMMARY                            ║');
    console.log('╠════════════════════════════════════════════════════════╣');
    console.log(`║  Total files processed: ${allResults.length}`);
    console.log(`║  Successful: ${successful.length}`);
    console.log(`║  Failed: ${failed.length}`);
    console.log('╚════════════════════════════════════════════════════════╝');

    if (successful.length > 0) {
      console.log('\n✅ Successfully uploaded:');
      successful.forEach(r => console.log(`   - ${r.title}`));
    }

    if (failed.length > 0) {
      console.log('\n❌ Failed:');
      failed.forEach(r => console.log(`   - ${r.file}: ${r.error}`));
    }

    // Get public URL example
    if (successful.length > 0) {
      const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(successful[0].file);
      console.log('\n📎 Example public URL format:');
      console.log(`   ${process.env.SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/<path>`);
    }

  } catch (err) {
    console.error('\n❌ Fatal error:', err.message);
    process.exit(1);
  }
}

// Run
main();
