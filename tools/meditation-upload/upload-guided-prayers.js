/**
 * Guided Meditations and Prayers Upload Script
 *
 * Uploads guided meditation and prayer audio files to Supabase Storage and creates database entries.
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const mm = require('music-metadata');
require('dotenv').config({ path: path.join(__dirname, '../../.env.local') });

// Configuration
const BUCKET_NAME = 'meditation-audio';
const GUIDED_DIR = path.join(__dirname, '../../meditation-audio/guided');
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
 * Parse meditation metadata from filename
 * Format: 001_Title_Words.m4a or similar
 */
function parseMetadata(filename, type) {
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

  // Determine narrator gender from filename hints
  let narratorGender = 'female'; // default
  if (filename.toLowerCase().includes('malevoice') || filename.toLowerCase().includes('male-voice')) {
    narratorGender = 'male';
  } else if (filename.toLowerCase().includes('femalevoice') || filename.toLowerCase().includes('female-voice')) {
    narratorGender = 'female';
  }

  return {
    title,
    orderPrefix,
    narratorGender
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
 * Check if meditation already exists in database
 */
async function entryExists(table, title, type) {
  const { data, error } = await supabase
    .from(table)
    .select('id, title')
    .eq('title', title)
    .eq('type', type)
    .maybeSingle();

  if (error) {
    console.warn(`  Warning: Could not check for existing entry: ${error.message}`);
    return null;
  }

  return data;
}

/**
 * Create database entry for meditation
 */
async function createDbEntry(meditation) {
  // Check for existing entry first
  const existing = await entryExists('meditations', meditation.title, meditation.type);

  if (existing) {
    console.log(`  ⚠️  Entry already exists: "${existing.title}" (id: ${existing.id})`);
    console.log(`  Skipping duplicate insertion.`);
    return existing;
  }

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
  if (!fs.existsSync(GUIDED_DIR)) {
    console.log('\n⚠️  Guided meditations folder not found, skipping...');
    return [];
  }

  console.log('\n=== Processing Guided Meditations ===');

  const files = fs.readdirSync(GUIDED_DIR)
    .filter(f => f.match(/\.(mp3|m4a|wav)$/i))
    .sort(); // Sort alphabetically

  const results = [];
  let baseOrderIndex = 100; // Start at 100 for guided meditations

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filePath = path.join(GUIDED_DIR, file);
    const slug = slugify(file);
    const storagePath = `guided/${slug}`;

    console.log(`\n[${i + 1}/${files.length}] Processing: ${file}`);

    try {
      // Get duration
      const duration = await getDuration(filePath);
      console.log(`  Duration: ${Math.floor(duration / 60)}m ${duration % 60}s`);

      // Parse metadata
      const metadata = parseMetadata(file, 'guided');
      const orderIndex = metadata.orderPrefix !== null ?
        baseOrderIndex + metadata.orderPrefix :
        baseOrderIndex + i;

      console.log(`  Title: "${metadata.title}"`);
      console.log(`  Narrator: ${metadata.narratorGender}`);

      // Upload file
      console.log(`  Uploading to ${storagePath}...`);
      await uploadFile(filePath, storagePath);
      console.log(`  ✅ Uploaded successfully`);

      // Create database entry
      const meditation = {
        title: metadata.title,
        description: `A guided meditation journey to support your manifestation practice.`,
        duration_seconds: duration,
        audio_url: storagePath,
        narrator_gender: metadata.narratorGender,
        tier_required: 'enlightenment', // Premium tier for guided meditations
        type: 'guided',
        order_index: orderIndex,
        tags: ['guided', 'meditation', 'manifestation'],
        life_areas: ['spiritual-growth', 'manifestation']
      };

      console.log(`  Creating database entry...`);
      const dbEntry = await createDbEntry(meditation);
      console.log(`  ✅ Database entry created: ${dbEntry.id}`);

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
 * Process prayer files
 */
async function processPrayerFiles() {
  if (!fs.existsSync(PRAYERS_DIR)) {
    console.log('\n⚠️  Prayers folder not found, skipping...');
    return [];
  }

  console.log('\n=== Processing Prayers ===');

  const files = fs.readdirSync(PRAYERS_DIR)
    .filter(f => f.match(/\.(mp3|m4a|wav)$/i))
    .sort(); // Sort alphabetically

  const results = [];
  let baseOrderIndex = 200; // Start at 200 for prayers

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
      const metadata = parseMetadata(file, 'prayer');
      const orderIndex = metadata.orderPrefix !== null ?
        baseOrderIndex + metadata.orderPrefix :
        baseOrderIndex + i;

      console.log(`  Title: "${metadata.title}"`);
      console.log(`  Narrator: ${metadata.narratorGender}`);

      // Upload file
      console.log(`  Uploading to ${storagePath}...`);
      await uploadFile(filePath, storagePath);
      console.log(`  ✅ Uploaded successfully`);

      // Create database entry
      const meditation = {
        title: metadata.title,
        description: `A spoken prayer to align your spirit with divine guidance and manifestation.`,
        duration_seconds: duration,
        audio_url: storagePath,
        narrator_gender: metadata.narratorGender,
        tier_required: 'awakening', // Mid-tier for prayers
        type: 'prayer',
        order_index: orderIndex,
        tags: ['prayer', 'spiritual', 'divine', 'manifestation'],
        life_areas: ['spiritual-growth', 'faith', 'manifestation']
      };

      console.log(`  Creating database entry...`);
      const dbEntry = await createDbEntry(meditation);
      console.log(`  ✅ Database entry created: ${dbEntry.id}`);

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
  console.log('║   Guided Meditations & Prayers Upload Tool             ║');
  console.log('╠════════════════════════════════════════════════════════╣');
  console.log(`║  Guided: ${GUIDED_DIR}`);
  console.log(`║  Prayers: ${PRAYERS_DIR}`);
  console.log(`║  Bucket: ${BUCKET_NAME}`);
  console.log('╚════════════════════════════════════════════════════════╝');

  try {
    // Process files
    const guidedResults = await processGuidedFiles();
    const prayerResults = await processPrayerFiles();

    // Summary
    const allResults = [...guidedResults, ...prayerResults];
    const successful = allResults.filter(r => r.success);
    const failed = allResults.filter(r => !r.success);

    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║                     SUMMARY                            ║');
    console.log('╠════════════════════════════════════════════════════════╣');
    console.log(`║  Total files processed: ${allResults.length}`);
    console.log(`║  Guided meditations: ${guidedResults.filter(r => r.success).length}/${guidedResults.length}`);
    console.log(`║  Prayers: ${prayerResults.filter(r => r.success).length}/${prayerResults.length}`);
    console.log(`║  Successful: ${successful.length}`);
    console.log(`║  Failed: ${failed.length}`);
    console.log('╚════════════════════════════════════════════════════════╝');

    if (successful.length > 0) {
      console.log('\n✅ Successfully uploaded:');
      console.log('\n📿 Guided Meditations:');
      guidedResults.filter(r => r.success).forEach(r => {
        console.log(`   - ${r.title}`);
      });

      if (prayerResults.filter(r => r.success).length > 0) {
        console.log('\n🙏 Prayers:');
        prayerResults.filter(r => r.success).forEach(r => {
          console.log(`   - ${r.title}`);
        });
      }
    }

    if (failed.length > 0) {
      console.log('\n❌ Failed:');
      failed.forEach(r => console.log(`   - ${r.file}: ${r.error}`));
    }

  } catch (err) {
    console.error('\n❌ Fatal error:', err.message);
    process.exit(1);
  }
}

// Run
main();
