#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Worksheets with available images (27 total, wheel-of-life already done = 26 to update)
const worksheetsWithImages = {
  // Phase 1 (10 more to update)
  'swot-analysis': 'web/app/workbook/phase/1/swot-analysis/page.tsx',
  'values-assessment': 'web/app/workbook/phase/1/values-assessment/page.tsx',
  'habits-audit': 'web/app/workbook/phase/1/habits-audit/page.tsx',
  'know-yourself': 'web/app/workbook/phase/1/know-yourself/page.tsx',
  'strengths-weaknesses': 'web/app/workbook/phase/1/strengths-weaknesses/page.tsx',
  'abilities-rating': 'web/app/workbook/phase/1/abilities-rating/page.tsx',
  'comfort-zone': 'web/app/workbook/phase/1/comfort-zone/page.tsx',
  'feel-wheel': 'web/app/workbook/phase/1/feel-wheel/page.tsx',
  'thought-awareness': 'web/app/workbook/phase/1/thought-awareness/page.tsx',
  'abc-model': 'web/app/workbook/phase/1/abc-model/page.tsx',

  // Phase 2 (2)
  'life-mission': 'web/app/workbook/phase/2/life-mission/page.tsx',
  'vision-board': 'web/app/workbook/phase/2/vision-board/page.tsx',

  // Phase 3 (3)
  'smart-goals': 'web/app/workbook/phase/3/smart-goals/page.tsx',
  'timeline': 'web/app/workbook/phase/3/timeline/page.tsx',
  'action-plan': 'web/app/workbook/phase/3/action-plan/page.tsx',

  // Phase 4 (3)
  'fear-inventory': 'web/app/workbook/phase/4/fear-inventory/page.tsx',
  'limiting-beliefs': 'web/app/workbook/phase/4/limiting-beliefs/page.tsx',
  'fear-facing-plan': 'web/app/workbook/phase/4/fear-facing-plan/page.tsx',

  // Phase 5 (3)
  'self-love-affirmations': 'web/app/workbook/phase/5/self-love-affirmations/page.tsx',
  'self-care-routine': 'web/app/workbook/phase/5/self-care-routine/page.tsx',
  'inner-child': 'web/app/workbook/phase/5/inner-child/page.tsx',

  // Phase 8 (3)
  'envy-inventory': 'web/app/workbook/phase/8/envy-inventory/page.tsx',
  'inspiration-reframe': 'web/app/workbook/phase/8/inspiration-reframe/page.tsx',
  'role-models': 'web/app/workbook/phase/8/role-models/page.tsx',

  // Phase 10 (2)
  'future-letter': 'web/app/workbook/phase/10/future-letter/page.tsx',
  'graduation': 'web/app/workbook/phase/10/graduation/page.tsx',
};

let updatedCount = 0;
let skippedCount = 0;
let errorCount = 0;

console.log('Updating worksheet pages with headerImage prop...\n');

for (const [worksheetSlug, filePath] of Object.entries(worksheetsWithImages)) {
  try {
    const fullPath = path.join(__dirname, filePath);

    if (!fs.existsSync(fullPath)) {
      console.log(`⚠️  SKIP: ${worksheetSlug} - File not found: ${filePath}`);
      skippedCount++;
      continue;
    }

    let content = fs.readFileSync(fullPath, 'utf8');

    // Check if already has the import
    if (content.includes('getWorksheetImage')) {
      console.log(`✓ SKIP: ${worksheetSlug} - Already has image integration`);
      skippedCount++;
      continue;
    }

    // Add import if not present
    if (!content.includes("import { getWorksheetImage } from '@/lib/worksheetImages'")) {
      // Find the last import statement
      const importLines = content.split('\n').filter(line => line.trim().startsWith('import '));
      const lastImportIndex = content.lastIndexOf(importLines[importLines.length - 1]);
      const insertPosition = content.indexOf('\n', lastImportIndex) + 1;

      content = content.slice(0, insertPosition) +
                "import { getWorksheetImage } from '@/lib/worksheetImages'\n" +
                content.slice(insertPosition);
    }

    // Add headerImage prop to WorksheetLayout
    // Find the WorksheetLayout component usage
    const layoutRegex = /(<WorksheetLayout\s+[^>]*?)>/;
    const match = content.match(layoutRegex);

    if (match) {
      // Check if it already has headerImage
      if (match[1].includes('headerImage=')) {
        console.log(`✓ SKIP: ${worksheetSlug} - Already has headerImage prop`);
        skippedCount++;
        continue;
      }

      // Add headerImage prop after description
      const replacement = match[1].replace(
        /description="([^"]*)"/,
        `description="$1"\n      headerImage={getWorksheetImage('${worksheetSlug}')}`
      );

      content = content.replace(layoutRegex, replacement + '>');

      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`✅ ${worksheetSlug}`);
      updatedCount++;
    } else {
      console.log(`❌ ERROR: ${worksheetSlug} - Could not find WorksheetLayout component`);
      errorCount++;
    }

  } catch (error) {
    console.log(`❌ ERROR: ${worksheetSlug} - ${error.message}`);
    errorCount++;
  }
}

console.log('\n' + '═'.repeat(50));
console.log('Summary:');
console.log(`✅ Updated: ${updatedCount}`);
console.log(`⚠️  Skipped: ${skippedCount}`);
console.log(`❌ Errors: ${errorCount}`);
console.log('═'.repeat(50));
