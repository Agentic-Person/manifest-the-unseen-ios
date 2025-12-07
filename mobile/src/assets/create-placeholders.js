/**
 * Run this script to create placeholder images
 * Usage: node create-placeholders.js
 *
 * Creates 1x1 transparent PNGs as placeholders until real images are added
 */

const fs = require('fs');
const path = require('path');

// 1x1 transparent PNG in base64
const PLACEHOLDER_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  'base64'
);

const placeholders = [
  // Phase images
  'images/phases/phase-1-self-evaluation.png',
  'images/phases/phase-2-values-vision.png',
  'images/phases/phase-3-goal-setting.png',
  'images/phases/phase-4-fears-beliefs.png',
  'images/phases/phase-5-self-love.png',
  'images/phases/phase-6-manifestation.png',
  'images/phases/phase-7-gratitude.png',
  'images/phases/phase-8-envy-inspiration.png',
  'images/phases/phase-9-trust-surrender.png',
  'images/phases/phase-10-letting-go.png',
];

const assetsDir = __dirname;

placeholders.forEach((relativePath) => {
  const fullPath = path.join(assetsDir, relativePath);
  const dir = path.dirname(fullPath);

  // Create directory if it doesn't exist
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Only create if file doesn't exist (don't overwrite real images)
  if (!fs.existsSync(fullPath)) {
    fs.writeFileSync(fullPath, PLACEHOLDER_PNG);
    console.log(`Created placeholder: ${relativePath}`);
  } else {
    console.log(`Skipped (exists): ${relativePath}`);
  }
});

console.log('\nDone! Replace these placeholders with your real images.');
