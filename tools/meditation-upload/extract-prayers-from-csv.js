/**
 * Extract Prayer Content from CSV
 *
 * Parses the meditation content CSV and extracts prayer scripts
 * for updating the database.
 */

const fs = require('fs');
const path = require('path');

// CSV file location
const CSV_FILE = process.argv[2] || path.join(__dirname, 'prayers-clean.csv');

// Prayers to extract (Title column values)
const PRAYER_TITLES = [
  'I_Speak_Healing',
  'Complete_Declaration_of_Restoration',
  'I_Am_Open_to_Receive',
  'Breaking_the_Chains',
  'I_Am_at_Peace',
  'The_Courage_to_Be_Still',
  'The_Frequency_of_Thankfulness',
  'Communion_with_the_Divine'
];

/**
 * Simple CSV parser that handles multiline fields
 */
function parseCSV(csvText) {
  const rows = [];
  let currentRow = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        currentField += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
      currentRow.push(currentField);
      currentField = '';
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      // End of row
      if (char === '\r' && nextChar === '\n') {
        i++; // Skip \n in \r\n
      }
      if (currentField || currentRow.length > 0) {
        currentRow.push(currentField);
        rows.push(currentRow);
        currentRow = [];
        currentField = '';
      }
    } else {
      currentField += char;
    }
  }

  // Add last field/row if any
  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField);
    rows.push(currentRow);
  }

  return rows;
}

/**
 * Clean script text (remove intro lines and formatting instructions)
 */
function cleanScriptText(scriptText) {
  if (!scriptText) return '';

  const lines = scriptText.split('\n');
  const cleanedLines = [];
  let pastIntro = false;

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip header lines
    if (!pastIntro) {
      if (trimmed.startsWith('===') || trimmed.startsWith('Theme:') ||
          trimmed.startsWith('Type:') || trimmed.startsWith('Music Cue:') ||
          trimmed.includes('Prayer') || trimmed.includes('minutes)')) {
        continue;
      }
      if (trimmed.length > 0) {
        pastIntro = true;
      }
    }

    // Skip separator lines and speaker tags
    if (trimmed.startsWith('===') || trimmed.startsWith('___') ||
        trimmed.startsWith('[speaker') || trimmed === '') {
      continue;
    }

    cleanedLines.push(trimmed);
  }

  return cleanedLines.join('\n').trim();
}

/**
 * Main function
 */
function main() {
  console.log('Reading CSV file...');

  // Read the CSV file
  let csvText;
  try {
    csvText = fs.readFileSync(CSV_FILE, 'utf8');
  } catch (err) {
    console.error('Error reading CSV file:', err.message);
    process.exit(1);
  }

  console.log('Parsing CSV...');
  const rows = parseCSV(csvText);

  // First row is headers
  const headers = rows[0];
  console.log(`Found ${headers.length} columns:`, headers.slice(0, 10).join(', '), '...');

  const titleIndex = headers.indexOf('Title');
  const scriptIndex = headers.indexOf('Script_Text');

  if (titleIndex === -1 || scriptIndex === -1) {
    console.error('Could not find Title or Script_Text columns');
    console.error('Available columns:', headers);
    process.exit(1);
  }

  console.log(`\nFound ${rows.length - 1} content rows`);
  console.log('Extracting prayers...\n');

  const prayers = {};

  // Find and extract prayers
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const title = row[titleIndex];
    const scriptText = row[scriptIndex];

    if (PRAYER_TITLES.includes(title)) {
      const cleanedText = cleanScriptText(scriptText);
      prayers[title] = cleanedText;
      console.log(`✓ Found: ${title} (${cleanedText.split('\n').length} lines)`);
    }
  }

  // Check if we found all prayers
  const missing = PRAYER_TITLES.filter(t => !prayers[t]);
  if (missing.length > 0) {
    console.log(`\n⚠️  Missing prayers: ${missing.join(', ')}`);
  }

  // Save to JSON file
  const outputFile = path.join(__dirname, 'prayer-content.json');
  fs.writeFileSync(outputFile, JSON.stringify(prayers, null, 2));

  console.log(`\n✅ Saved ${Object.keys(prayers).length} prayers to: ${outputFile}`);
}

main();
