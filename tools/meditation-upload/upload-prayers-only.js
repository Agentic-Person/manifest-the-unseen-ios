/**
 * Prayers Upload Script
 *
 * Uploads prayer audio files to Supabase Storage and creates entries in prayers table.
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const mm = require('music-metadata');
require('dotenv').config({ path: path.join(__dirname, '../../.env.local') });

// Configuration
const BUCKET_NAME = 'meditation-audio';
const PRAYERS_DIR = path.join(__dirname, '../../meditation-audio/prayers');

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
 * Parse prayer metadata from filename
 * Format: 001_Title_Words.m4a
 */
function parseMetadata(filename) {
  // Remove extension
  const nameWithoutExt = filename.replace(/\.(mp3|m4a|wav)$/i, '');

  // Try to extract number prefix (001_, 002_, etc.)
  const numberMatch = nameWithoutExt.match(/^(\d+)_(.+)$/);
  let orderPrefix = null;
  let title = nameWithoutExt;

  if (numberMatch) {
    orderPrefix = parseInt(numberMatch[1], 10);
    title = numberMatch[2];
  }

  // Convert underscores to spaces and title case
  title = title
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
    .trim();

  return {
    title,
    orderPrefix
  };
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
 * Check if prayer already exists in database
 */
async function prayerExists(title) {
  const { data, error } = await supabase
    .from('prayers')
    .select('id, title')
    .eq('title', title)
    .maybeSingle();

  if (error) {
    console.warn(`  Warning: Could not check for existing prayer: ${error.message}`);
    return null;
  }

  return data;
}

/**
 * Create database entry in prayers table
 */
async function createPrayerEntry(prayer) {
  // Check for existing prayer first
  const existing = await prayerExists(prayer.title);

  if (existing) {
    console.log(`  ⚠️  Prayer already exists: "${existing.title}" (id: ${existing.id})`);
    console.log(`  Skipping duplicate insertion.`);
    return existing;
  }

  const { data, error } = await supabase
    .from('prayers')
    .insert(prayer)
    .select()
    .single();

  if (error) {
    throw new Error(`Database insert failed: ${error.message}`);
  }

  return data;
}

/**
 * Process prayer files
 */
async function processPrayerFiles() {
  if (!fs.existsSync(PRAYERS_DIR)) {
    console.log('\n⚠️  Prayers folder not found!');
    return [];
  }

  console.log('\n=== Processing Prayers ===');

  const files = fs.readdirSync(PRAYERS_DIR)
    .filter(f => f.match(/\.(mp3|m4a|wav)$/i))
    .sort(); // Sort alphabetically

  const results = [];
  let baseOrderIndex = 100; // Start at 100 for prayers

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filePath = path.join(PRAYERS_DIR, file);
    const slug = slugify(file);
    const storagePath = `prayers/${slug}`;

    console.log(`\n[${i + 1}/${files.length}] Processing: ${file}`);

    try {
      // Get duration
      const duration = await getDuration(filePath);
      console.log(`  Duration: ${Math.floor(duration / 60)}m ${duration % 60}s`);

      // Parse metadata
      const metadata = parseMetadata(file);
      const orderIndex = metadata.orderPrefix !== null ?
        baseOrderIndex + metadata.orderPrefix :
        baseOrderIndex + i;

      console.log(`  Title: "${metadata.title}"`);

      // Upload file
      console.log(`  Uploading to ${storagePath}...`);
      await uploadFile(filePath, storagePath);
      console.log(`  ✅ Uploaded successfully`);

      // Create database entry in prayers table
      const prayer = {
        title: metadata.title,
        description: `A spoken prayer for manifestation and spiritual alignment.`,
        content: `[Audio prayer - listen for full content]\n\n${metadata.title}`,
        duration_seconds: duration,
        audio_url: storagePath,
        tier_required: 'awakening', // Mid-tier for prayers
        order_index: orderIndex,
        tags: ['prayer', 'spiritual', 'manifestation', 'spoken'],
        life_areas: ['spirituality', 'personalGrowth']
      };

      console.log(`  Creating prayer entry...`);
      const dbEntry = await createPrayerEntry(prayer);
      console.log(`  ✅ Prayer entry created: ${dbEntry.id}`);

      results.push({
        file,
        success: true,
        id: dbEntry.id,
        title: metadata.title
      });

    } catch (err) {
      console.error(`  ❌ ERROR: ${err.message}`);
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
  console.log('║         Prayers Upload Tool                            ║');
  console.log('╠════════════════════════════════════════════════════════╣');
  console.log(`║  Source: ${PRAYERS_DIR}`);
  console.log(`║  Bucket: ${BUCKET_NAME}`);
  console.log(`║  Table: prayers`);
  console.log('╚════════════════════════════════════════════════════════╝');

  try {
    // Process files
    const results = await processPrayerFiles();

    // Summary
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);

    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║                     SUMMARY                            ║');
    console.log('╠════════════════════════════════════════════════════════╣');
    console.log(`║  Total files processed: ${results.length}`);
    console.log(`║  Successful: ${successful.length}`);
    console.log(`║  Failed: ${failed.length}`);
    console.log('╚════════════════════════════════════════════════════════╝');

    if (successful.length > 0) {
      console.log('\n✅ Successfully uploaded prayers:');
      successful.forEach(r => {
        console.log(`   🙏 ${r.title}`);
      });
    }

    if (failed.length > 0) {
      console.log('\n❌ Failed:');
      failed.forEach(r => console.log(`   - ${r.file}: ${r.error}`));
    }

    console.log('\n📝 Note: Prayers added to prayers table with audio_url field');
    console.log('   Users can now listen to these prayers in the app!');

  } catch (err) {
    console.error('\n❌ Fatal error:', err.message);
    process.exit(1);
  }
}

// Run
main();
