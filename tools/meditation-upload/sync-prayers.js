#!/usr/bin/env node
/**
 * Google Sheets → Supabase Prayer Sync
 *
 * Syncs prayer content from a published Google Sheet CSV to Supabase.
 * Only updates prayers that have changed, and only regenerates timings
 * for modified prayers that have audio.
 *
 * Usage:
 *   node tools/sync-prayers.js
 *
 * Environment Variables Required:
 *   GOOGLE_SHEET_CSV_URL - Published CSV URL from Google Sheets
 *   SUPABASE_URL - Supabase project URL
 *   SUPABASE_SERVICE_ROLE_KEY - Service role key for admin access
 */

const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '../../.env.local') });

// Validate environment variables
const requiredVars = ['GOOGLE_SHEET_CSV_URL', 'SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'];
const missing = requiredVars.filter(v => !process.env[v]);
if (missing.length > 0) {
  console.error('Missing required environment variables:');
  missing.forEach(v => console.error(`  - ${v}`));
  console.error('\nMake sure these are set in .env.local');
  process.exit(1);
}

// Dynamic imports for ES modules
let fetch, supabase;

/**
 * Parse CSV content into array of objects
 * Handles quoted fields with commas and newlines
 */
function parseCSV(csvText) {
  const lines = [];
  let currentLine = '';
  let inQuotes = false;

  // Split by character to handle quoted newlines
  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];

    if (char === '"') {
      // Handle escaped quotes ("")
      if (inQuotes && csvText[i + 1] === '"') {
        currentLine += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
        currentLine += char;
      }
    } else if (char === '\n' && !inQuotes) {
      if (currentLine.trim()) {
        lines.push(currentLine);
      }
      currentLine = '';
    } else if (char === '\r') {
      // Skip carriage returns
      continue;
    } else {
      currentLine += char;
    }
  }

  // Don't forget the last line
  if (currentLine.trim()) {
    lines.push(currentLine);
  }

  if (lines.length === 0) {
    return [];
  }

  // Parse header row
  const headers = parseCSVRow(lines[0]).map(h => h.trim().toLowerCase());

  // Parse data rows
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVRow(lines[i]);
    const row = {};
    headers.forEach((header, idx) => {
      row[header] = values[idx] !== undefined ? values[idx].trim() : '';
    });
    rows.push(row);
  }

  return rows;
}

/**
 * Parse a single CSV row, handling quoted fields
 */
function parseCSVRow(line) {
  const values = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  values.push(current);
  return values;
}

/**
 * Check if row is a valid prayer (not meditation, not notes, etc.)
 */
function isValidPrayer(row) {
  // Must have Type = "Prayer" (case-insensitive)
  const type = (row.type || '').toLowerCase().trim();
  if (type !== 'prayer') {
    return false;
  }

  // Must have a title
  if (!row.title || !row.title.trim()) {
    return false;
  }

  // Must have script text (content)
  if (!row.script_text || !row.script_text.trim()) {
    return false;
  }

  return true;
}

/**
 * Strip metadata headers from script content
 * Removes lines like "Theme:", "Type:", "Music Cue:", title headers, etc.
 */
function stripMetadataHeaders(content) {
  if (!content) return '';

  const lines = content.split('\n');
  const cleanLines = [];
  let foundActualContent = false;

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip empty lines at the start
    if (!foundActualContent && !trimmed) continue;

    // Skip metadata header lines
    if (
      trimmed.match(/^Theme:/i) ||
      trimmed.match(/^Type:/i) ||
      trimmed.match(/^Music Cue:/i) ||
      trimmed.match(/^Duration:/i) ||
      trimmed.match(/^Category:/i) ||
      trimmed.match(/^Instructions:/i) ||
      trimmed.match(/^Note:/i) ||
      trimmed.match(/^Audio:/i) ||
      // Skip title lines like "I SPEAK HEALING OVER MY BODY - Short Prayer (3-4 minutes)"
      trimmed.match(/^[A-Z\s]+[-–]\s*(Short|Medium|Long|Extended)\s*(Prayer|Meditation|Breathing)/i) ||
      // Skip lines that are just section markers
      trimmed.match(/^[-=]{3,}$/) ||
      // Skip lines like "(3-4 minutes)" or "(5-7 min)"
      trimmed.match(/^\(\d+[-–]\d+\s*(min|minutes?)\)$/i)
    ) {
      continue;
    }

    // Found actual content
    foundActualContent = true;
    cleanLines.push(line);
  }

  // Trim trailing empty lines
  while (cleanLines.length > 0 && !cleanLines[cleanLines.length - 1].trim()) {
    cleanLines.pop();
  }

  return cleanLines.join('\n');
}

/**
 * Convert spreadsheet row to prayer object matching database schema
 *
 * Spreadsheet columns:
 * - ID → order_index
 * - Category → life_areas
 * - Type → filter (Prayer only)
 * - Short_Description → description
 * - Title → title
 * - Script_Text → content
 */
function rowToPrayer(row) {
  // Parse content from Script_Text column and strip metadata headers
  let content = row.script_text || '';
  // Handle literal \n in cells
  content = content.replace(/\\n/g, '\n');
  // Strip metadata headers
  content = stripMetadataHeaders(content);

  // Parse category into life_areas array
  const parseArray = (str) => {
    if (!str) return [];
    return str.split(',').map(s => s.trim()).filter(Boolean);
  };

  // Map category to life_areas
  // e.g., "Healing & Restoration" → ["health", "spirituality"]
  const categoryToLifeAreas = (category) => {
    if (!category) return [];
    const cat = category.toLowerCase();
    const areas = [];
    if (cat.includes('healing') || cat.includes('restoration')) areas.push('health', 'spirituality');
    if (cat.includes('abundance') || cat.includes('prosperity')) areas.push('finance', 'career');
    if (cat.includes('peace') || cat.includes('anxiety')) areas.push('health', 'spirituality');
    if (cat.includes('forgiveness') || cat.includes('release')) areas.push('relationships', 'spirituality');
    if (cat.includes('gratitude')) areas.push('spirituality', 'personalGrowth');
    if (cat.includes('purpose') || cat.includes('calling')) areas.push('career', 'personalGrowth');
    if (cat.includes('love') || cat.includes('relationship')) areas.push('relationships', 'family');
    if (cat.includes('identity') || cat.includes('worth')) areas.push('personalGrowth', 'spirituality');
    if (cat.includes('surrender') || cat.includes('trust')) areas.push('spirituality');
    if (cat.includes('divine') || cat.includes('spiritual')) areas.push('spirituality');
    return [...new Set(areas)]; // Remove duplicates
  };

  // Build audio URL from title (assuming filename pattern: XXX_Title.m4a)
  // Only set if Script_Audio_Complete is marked
  let audioUrl = null;
  const audioComplete = (row.script_audio_complete || '').toLowerCase();
  if (audioComplete === 'yes' || audioComplete === 'true' || audioComplete === 'x' || audioComplete === '✓') {
    // Derive filename from ID and Title
    const id = (row.id || '').padStart(3, '0');
    const title = row.title || '';
    audioUrl = `prayers/${id}_${title}.m4a`;
  }

  return {
    order_index: parseInt(row.id) || 0,
    title: row.title,
    description: row.short_description || null,
    content: content,
    audio_url: audioUrl,
    tier_required: 'novice', // Default all to novice for now
    life_areas: categoryToLifeAreas(row.category),
    tags: parseArray(row.category) // Use category as tag
  };
}

/**
 * Normalize title for comparison
 * Converts underscores to spaces, normalizes case
 */
function normalizeTitle(title) {
  if (!title) return '';
  return title
    .replace(/_/g, ' ')           // underscores → spaces
    .replace(/\s+/g, ' ')         // collapse multiple spaces
    .trim()
    .toLowerCase();
}

/**
 * Check if prayer content has changed
 */
function prayerChanged(existing, updated) {
  // If prayer doesn't exist, it's "changed" (new)
  if (!existing) return true;

  // Compare content (the main thing we care about for timing regeneration)
  if (existing.content !== updated.content) return true;

  // Also check other fields
  if (existing.description !== updated.description) return true;
  if (existing.tier_required !== updated.tier_required) return true;
  if (existing.order_index !== updated.order_index) return true;
  if (existing.audio_url !== updated.audio_url) return true;

  // Compare arrays
  const arraysEqual = (a, b) => {
    if (!a && !b) return true;
    if (!a || !b) return false;
    if (a.length !== b.length) return false;
    return a.every((v, i) => v === b[i]);
  };

  if (!arraysEqual(existing.life_areas, updated.life_areas)) return true;
  if (!arraysEqual(existing.tags, updated.tags)) return true;

  return false;
}

/**
 * Check if content specifically changed (for timing regeneration)
 */
function contentChanged(existing, updated) {
  if (!existing) return true;
  return existing.content !== updated.content;
}

/**
 * Get prayer lines for Whisper timing generation
 */
function getPrayerLines(prayerText) {
  return prayerText
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);
}

/**
 * Generate proportional timings from Whisper result
 */
function generateProportionalTimings(whisperResult, prayerLines) {
  const words = whisperResult.words;
  if (!words || words.length === 0) {
    return null;
  }

  const speechStartMs = Math.round(words[0].start * 1000);
  const speechEndMs = Math.round(words[words.length - 1].end * 1000);
  const totalSpeechDurationMs = speechEndMs - speechStartMs;

  const lineWordCounts = prayerLines.map(line =>
    line.split(/\s+/).filter(w => w.length > 0).length
  );
  const totalWords = lineWordCounts.reduce((sum, c) => sum + c, 0);

  let currentTimeMs = speechStartMs;
  const lineTimings = prayerLines.map((text, index) => {
    const wordCount = lineWordCounts[index];
    const lineDurationMs = (wordCount / totalWords) * totalSpeechDurationMs;
    const startMs = currentTimeMs;
    const endMs = startMs + lineDurationMs;
    currentTimeMs = endMs;

    return {
      line: index,
      text,
      startMs: Math.round(startMs),
      endMs: Math.round(endMs)
    };
  });

  return lineTimings;
}

/**
 * Regenerate line timings for a prayer using Whisper
 */
async function regenerateTimings(prayer, prayerContent) {
  const WHISPER_EDGE_FUNCTION_URL = `${process.env.SUPABASE_URL}/functions/v1/whisper-transcribe`;
  const PRAYERS_DIR = path.join(__dirname, '../../meditation-audio/prayers');

  // Get audio filename from audio_url
  const audioFilename = prayer.audio_url.replace('prayers/', '');
  const audioFilePath = path.join(PRAYERS_DIR, audioFilename);

  // Check if audio file exists locally
  if (!fs.existsSync(audioFilePath)) {
    console.log(`    ⚠️  Audio file not found locally: ${audioFilePath}`);
    console.log(`       Skipping timing regeneration (audio might be in cloud storage only)`);
    return null;
  }

  console.log(`    Transcribing with Whisper...`);

  // Read audio file and convert to base64
  const audioBuffer = fs.readFileSync(audioFilePath);
  const audioBase64 = audioBuffer.toString('base64');

  console.log(`    Audio file size: ${(audioBuffer.length / 1024 / 1024).toFixed(2)} MB`);

  const response = await fetch(WHISPER_EDGE_FUNCTION_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
    },
    body: JSON.stringify({
      audioBase64,
      filename: audioFilename,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Whisper API error: ${response.status} - ${errorText}`);
  }

  const whisperResult = await response.json();

  if (!whisperResult.words || whisperResult.words.length === 0) {
    throw new Error('No word-level timestamps returned from Whisper');
  }

  console.log(`    ✓ Transcribed (${whisperResult.words.length} words)`);

  // Generate timings
  const prayerLines = getPrayerLines(prayerContent);
  const lineTimings = generateProportionalTimings(whisperResult, prayerLines);

  if (lineTimings) {
    console.log(`    ✓ Generated ${lineTimings.length} line timings`);
  }

  return lineTimings;
}

/**
 * Main sync function
 */
async function syncPrayers() {
  console.log('╔════════════════════════════════════════════════════════════════════╗');
  console.log('║           Google Sheets → Supabase Prayer Sync                     ║');
  console.log('╚════════════════════════════════════════════════════════════════════╝\n');

  // Dynamic imports
  const fetchModule = await import('node-fetch');
  fetch = fetchModule.default;

  const { createClient } = await import('@supabase/supabase-js');
  supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  // Step 1: Fetch CSV from Google Sheets
  console.log('📥 Fetching prayers from Google Sheets...');
  const csvUrl = process.env.GOOGLE_SHEET_CSV_URL;

  let csvText;
  try {
    const response = await fetch(csvUrl);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    csvText = await response.text();
  } catch (error) {
    console.error(`\n❌ Failed to fetch Google Sheet: ${error.message}`);
    console.error('\nMake sure:');
    console.error('  1. The sheet is published as CSV (File → Share → Publish to web)');
    console.error('  2. GOOGLE_SHEET_CSV_URL is correct in .env.local');
    process.exit(1);
  }

  // Step 2: Parse CSV
  const rows = parseCSV(csvText);
  console.log(`✓ Fetched ${rows.length} prayers from Google Sheets\n`);

  if (rows.length === 0) {
    console.log('No prayers found in spreadsheet. Exiting.');
    process.exit(0);
  }

  // Filter to only prayers (not meditations, not notes)
  const prayerRows = rows.filter(isValidPrayer);
  console.log(`✓ Filtered to ${prayerRows.length} prayers (Type = "Prayer")\n`);

  // Convert to prayer objects
  const sheetPrayers = prayerRows.map(rowToPrayer).filter(p => p.title);

  // Step 3: Fetch existing prayers from Supabase
  console.log('📊 Fetching existing prayers from Supabase...');
  const { data: existingPrayers, error: fetchError } = await supabase
    .from('prayers')
    .select('*');

  if (fetchError) {
    console.error(`\n❌ Failed to fetch existing prayers: ${fetchError.message}`);
    process.exit(1);
  }

  console.log(`✓ Found ${existingPrayers.length} existing prayers in database\n`);

  // Create lookup by normalized title
  const existingByTitle = {};
  existingPrayers.forEach(p => {
    existingByTitle[normalizeTitle(p.title)] = p;
  });

  // Step 4: Compare and categorize prayers
  const toInsert = [];
  const toUpdate = [];
  const unchanged = [];
  const needsTimingRegen = [];

  for (const prayer of sheetPrayers) {
    const existing = existingByTitle[normalizeTitle(prayer.title)];

    if (!existing) {
      toInsert.push(prayer);
      if (prayer.audio_url) {
        needsTimingRegen.push({ prayer, content: prayer.content, isNew: true });
      }
    } else if (prayerChanged(existing, prayer)) {
      // Preserve existing audio_url and line_timings if not set in spreadsheet
      const mergedPrayer = {
        ...prayer,
        id: existing.id,
        audio_url: prayer.audio_url || existing.audio_url,  // Preserve existing
      };
      toUpdate.push(mergedPrayer);

      // Check for timing regen using existing audio_url if spreadsheet doesn't set one
      const effectiveAudioUrl = prayer.audio_url || existing.audio_url;
      const contentDiff = contentChanged(existing, prayer);
      if (effectiveAudioUrl && contentDiff) {
        needsTimingRegen.push({ prayer: mergedPrayer, content: prayer.content, isNew: false });
      }
    } else {
      unchanged.push(prayer.title);
    }
  }

  // Step 5: Insert new prayers
  if (toInsert.length > 0) {
    console.log(`📝 Inserting ${toInsert.length} new prayer(s)...`);
    for (const prayer of toInsert) {
      console.log(`  + ${prayer.title}`);
      const { error } = await supabase.from('prayers').insert(prayer);
      if (error) {
        console.error(`    ❌ Error: ${error.message}`);
      } else {
        console.log(`    ✓ Inserted`);
      }
    }
    console.log('');
  }

  // Step 6: Update existing prayers
  if (toUpdate.length > 0) {
    console.log(`🔄 Updating ${toUpdate.length} prayer(s)...`);
    for (const prayer of toUpdate) {
      const { id, ...updateData } = prayer;
      console.log(`  ↻ ${prayer.title}`);
      const { error } = await supabase
        .from('prayers')
        .update(updateData)
        .eq('id', id);
      if (error) {
        console.error(`    ❌ Error: ${error.message}`);
      } else {
        console.log(`    ✓ Updated`);
      }
    }
    console.log('');
  }

  // Step 7: Regenerate timings for changed prayers with audio
  if (needsTimingRegen.length > 0) {
    console.log(`🎙️  Regenerating timings for ${needsTimingRegen.length} prayer(s) with audio...`);
    for (const { prayer, content } of needsTimingRegen) {
      console.log(`  🔊 ${prayer.title}`);
      try {
        const lineTimings = await regenerateTimings(prayer, content);
        if (lineTimings) {
          // Get the prayer ID (might need to fetch it for new prayers)
          let prayerId = prayer.id;
          if (!prayerId) {
            const { data } = await supabase
              .from('prayers')
              .select('id')
              .eq('title', prayer.title)
              .single();
            prayerId = data?.id;
          }

          if (prayerId) {
            const { error } = await supabase
              .from('prayers')
              .update({ line_timings: lineTimings })
              .eq('id', prayerId);

            if (error) {
              console.error(`    ❌ Failed to save timings: ${error.message}`);
            } else {
              console.log(`    ✓ Timings saved`);
            }
          }
        }
      } catch (error) {
        console.error(`    ❌ Error: ${error.message}`);
      }

      // Rate limit between Whisper calls
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    console.log('');
  }

  // Summary
  console.log('╔════════════════════════════════════════════════════════════════════╗');
  console.log('║                           SUMMARY                                  ║');
  console.log('╠════════════════════════════════════════════════════════════════════╣');
  console.log(`║  ✓ Fetched ${sheetPrayers.length} prayers from Google Sheets`);
  console.log(`║  ✓ Inserted ${toInsert.length} new prayer(s)`);
  console.log(`║  ✓ Updated ${toUpdate.length} prayer(s) (content changed)`);
  console.log(`║  ✓ Regenerated timings for ${needsTimingRegen.length} prayer(s)`);
  console.log(`║  ○ Skipped ${unchanged.length} prayer(s) (unchanged)`);
  console.log('╚════════════════════════════════════════════════════════════════════╝');

  if (unchanged.length > 0 && unchanged.length <= 10) {
    console.log('\nUnchanged prayers:');
    unchanged.forEach(title => console.log(`  - ${title}`));
  }
}

// Run
syncPrayers().catch(err => {
  console.error('\n❌ Fatal error:', err.message);
  process.exit(1);
});
