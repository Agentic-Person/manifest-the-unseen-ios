#!/usr/bin/env node

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Image optimization configuration
const CONFIG = {
  phases: {
    maxWidth: 1200,
    quality: 85,
    targetSizeKB: 300
  },
  exercises: {
    maxWidth: 800,
    quality: 80,
    targetSizeKB: 150
  }
};

/**
 * Optimize a single image
 * @param {string} inputPath - Path to input PNG
 * @param {string} outputPath - Path to output WebP
 * @param {object} config - Optimization config (maxWidth, quality)
 */
async function optimizeImage(inputPath, outputPath, config) {
  try {
    const stats = fs.statSync(inputPath);
    const sizeBeforeKB = Math.round(stats.size / 1024);

    await sharp(inputPath)
      .resize(config.maxWidth, null, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality: config.quality })
      .toFile(outputPath);

    const statsAfter = fs.statSync(outputPath);
    const sizeAfterKB = Math.round(statsAfter.size / 1024);
    const reduction = Math.round(((sizeBeforeKB - sizeAfterKB) / sizeBeforeKB) * 100);

    console.log(`✓ ${path.basename(inputPath)} → ${path.basename(outputPath)}`);
    console.log(`  ${sizeBeforeKB} KB → ${sizeAfterKB} KB (${reduction}% reduction)`);

    return { success: true, sizeBeforeKB, sizeAfterKB };
  } catch (error) {
    console.error(`✗ Error optimizing ${inputPath}:`, error.message);
    return { success: false, error };
  }
}

/**
 * Process all images in a directory
 * @param {string} inputDir - Directory containing PNG images
 * @param {string} outputDir - Directory for WebP output
 * @param {object} config - Optimization config
 */
async function processDirectory(inputDir, outputDir, config) {
  const files = fs.readdirSync(inputDir).filter(f => f.endsWith('.png'));

  console.log(`\nProcessing ${files.length} images in ${inputDir}...`);

  const results = [];
  for (const file of files) {
    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(outputDir, file.replace('.png', '.webp'));

    const result = await optimizeImage(inputPath, outputPath, config);
    results.push(result);
  }

  return results;
}

/**
 * Main optimization routine
 */
async function main() {
  const basePath = path.join(__dirname, '..', 'public', 'images', 'workbook');

  console.log('=== Workbook Image Optimization ===\n');

  let totalSizeBefore = 0;
  let totalSizeAfter = 0;
  let totalImages = 0;

  // Optimize phase header images
  console.log('\n📸 Phase Headers (target: <300KB each)');
  console.log('─'.repeat(50));

  const phasesDir = path.join(basePath, 'phases');
  const phaseResults = await processDirectory(phasesDir, phasesDir, CONFIG.phases);

  phaseResults.forEach(r => {
    if (r.success) {
      totalSizeBefore += r.sizeBeforeKB;
      totalSizeAfter += r.sizeAfterKB;
      totalImages++;
    }
  });

  // Optimize exercise images for each phase
  console.log('\n📝 Exercise Images (target: <150KB each)');
  console.log('─'.repeat(50));

  for (let phase = 1; phase <= 10; phase++) {
    const exerciseDir = path.join(basePath, 'exercises', `phase-${phase}`);

    if (!fs.existsSync(exerciseDir)) {
      console.log(`  Phase ${phase}: No images (directory doesn't exist)`);
      continue;
    }

    const files = fs.readdirSync(exerciseDir).filter(f => f.endsWith('.png'));
    if (files.length === 0) {
      console.log(`  Phase ${phase}: No PNG images`);
      continue;
    }

    console.log(`\n  Phase ${phase}:`);
    const exerciseResults = await processDirectory(
      exerciseDir,
      exerciseDir,
      CONFIG.exercises
    );

    exerciseResults.forEach(r => {
      if (r.success) {
        totalSizeBefore += r.sizeBeforeKB;
        totalSizeAfter += r.sizeAfterKB;
        totalImages++;
      }
    });
  }

  // Summary
  console.log('\n' + '═'.repeat(50));
  console.log('📊 Optimization Summary');
  console.log('═'.repeat(50));
  console.log(`Total images: ${totalImages}`);
  console.log(`Size before: ${Math.round(totalSizeBefore / 1024)} MB`);
  console.log(`Size after: ${Math.round(totalSizeAfter / 1024)} MB`);
  console.log(`Total reduction: ${Math.round(((totalSizeBefore - totalSizeAfter) / totalSizeBefore) * 100)}%`);
  console.log(`Space saved: ${Math.round((totalSizeBefore - totalSizeAfter) / 1024)} MB`);
  console.log('');
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { optimizeImage, processDirectory };
