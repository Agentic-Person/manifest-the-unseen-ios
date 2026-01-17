/**
 * Breathing Meditation Upload Script
 *
 * Uploads breathing meditation audio files to Supabase Storage and creates database entries.
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const mm = require('music-metadata');
require('dotenv').config({ path: path.join(__dirname, '../../.env.local') });

// Configuration
const BUCKET_NAME = 'meditation-audio';
const SOURCE_DIR = path.join(__dirname, '../../meditation-audio/breathing');

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
 * Breathing meditation metadata
 */
const breathingMeditations = [
  {
    filename: 'BR-01_Box_Breathing_Basic.m4a',
    title: 'Box Breathing - Basic',
    description: 'A foundational breathing technique that uses a 4-4-4-4 rhythm (inhale, hold, exhale, hold) to activate the parasympathetic nervous system and reduce stress.',
    image: 'breathing-box.png',
    orderIndex: 1,
    tierRequired: 'novice',
    tags: ['breathing', 'stress-relief', 'focus', 'beginner'],
    lifeAreas: ['stress-management', 'mental-clarity']
  },
  {
    filename: 'BR-02_Deep_Calm_and_Relax_5_2_5_2.m4a',
    title: 'Deep Calm and Relax',
    description: 'A soothing 5-2-5-2 breathing pattern designed to promote deep relaxation and calmness, perfect for unwinding after a busy day.',
    image: 'breathing-deep-calm.png',
    orderIndex: 2,
    tierRequired: 'novice',
    tags: ['breathing', 'relaxation', 'calm', 'sleep'],
    lifeAreas: ['stress-management', 'sleep-quality']
  },
  {
    filename: 'BR_03_The _Currents_of_Heaven_and_Earth.m4a',
    title: 'The Currents of Heaven and Earth',
    description: 'An advanced breathing meditation connecting you to the flow of energy between heaven and earth, balancing your spiritual and physical being.',
    image: null, // No matching image found
    orderIndex: 3,
    tierRequired: 'awakening',
    tags: ['breathing', 'energy', 'spiritual', 'advanced'],
    lifeAreas: ['spiritual-growth', 'energy-balance']
  },
  {
    filename: 'BR-04_Hemisphere_Balance.m4a',
    title: 'Hemisphere Balance',
    description: 'Alternate nostril breathing technique designed to balance the left and right hemispheres of the brain, enhancing mental clarity and emotional equilibrium.',
    image: 'breathing-energy-boost.png',
    orderIndex: 4,
    tierRequired: 'awakening',
    tags: ['breathing', 'balance', 'focus', 'clarity'],
    lifeAreas: ['mental-clarity', 'emotional-balance']
  }
];

/**
 * Process breathing meditation files
 */
async function processBreathingFiles() {
  console.log('\n=== Processing Breathing Meditations ===');

  const results = [];

  for (const meditation of breathingMeditations) {
    const filePath = path.join(SOURCE_DIR, meditation.filename);

    if (!fs.existsSync(filePath)) {
      console.error(`\n❌ File not found: ${meditation.filename}`);
      results.push({ file: meditation.filename, success: false, error: 'File not found' });
      continue;
    }

    const slug = slugify(meditation.filename);
    const storagePath = `breathing/${slug}`;

    console.log(`\nProcessing: ${meditation.filename}`);

    try {
      // Get duration
      const duration = await getDuration(filePath);
      console.log(`  Duration: ${Math.floor(duration / 60)}m ${duration % 60}s`);

      // Upload file
      console.log(`  Uploading to ${storagePath}...`);
      await uploadFile(filePath, storagePath);
      console.log(`  Uploaded successfully`);

      // Create database entry
      const dbMeditation = {
        title: meditation.title,
        description: meditation.description,
        duration_seconds: duration,
        audio_url: storagePath,
        narrator_gender: 'female',
        tier_required: meditation.tierRequired,
        type: 'breathing',
        order_index: meditation.orderIndex,
        tags: meditation.tags,
        life_areas: meditation.lifeAreas
      };

      console.log(`  Creating database entry: "${dbMeditation.title}"`);
      const dbEntry = await createDbEntry(dbMeditation);
      console.log(`  Database entry created: ${dbEntry.id}`);

      results.push({
        file: meditation.filename,
        success: true,
        id: dbEntry.id,
        title: meditation.title,
        image: meditation.image
      });

    } catch (err) {
      console.error(`  ERROR: ${err.message}`);
      results.push({ file: meditation.filename, success: false, error: err.message });
    }
  }

  return results;
}

/**
 * Main function
 */
async function main() {
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║     Breathing Meditation Upload Tool                   ║');
  console.log('╠════════════════════════════════════════════════════════╣');
  console.log(`║  Source: ${SOURCE_DIR}`);
  console.log(`║  Bucket: ${BUCKET_NAME}`);
  console.log('╚════════════════════════════════════════════════════════╝');

  try {
    // Process files
    const results = await processBreathingFiles();

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
      console.log('\n✅ Successfully uploaded:');
      successful.forEach(r => {
        const imageNote = r.image ? `(image: ${r.image})` : '(no image)';
        console.log(`   - ${r.title} ${imageNote}`);
      });
    }

    if (failed.length > 0) {
      console.log('\n❌ Failed:');
      failed.forEach(r => console.log(`   - ${r.file}: ${r.error}`));
    }

    console.log('\n📝 Note: One meditation is missing an image:');
    console.log('   - "The Currents of Heaven and Earth" - please provide an image');

  } catch (err) {
    console.error('\n❌ Fatal error:', err.message);
    process.exit(1);
  }
}

// Run
main();
