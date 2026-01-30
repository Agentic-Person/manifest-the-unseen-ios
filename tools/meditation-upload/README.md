# Prayer Audio Upload & Timing Generation

## Overview

This directory contains scripts for uploading prayer audio files and generating accurate text-to-audio sync timings using OpenAI Whisper.

---

## ⚠️ CRITICAL: The Timing Algorithm

The timing generation uses **actual Whisper word-level timestamps** - NOT proportional distribution.

### What Works (Current Implementation)
```
For each prayer line:
1. Count words in the line
2. Consume that many words from Whisper's word array
3. Use the first word's START timestamp as line startMs
4. Use the last word's END timestamp as line endMs
```

### What Does NOT Work (Previous Bug)
```
❌ Proportional distribution: lineDuration = (wordCount / totalWords) * totalDuration
❌ Only using speech start/end boundaries and distributing evenly
```

The proportional approach causes text to drift out of sync because it assumes all words are spoken at the same pace, which is not true.

---

## Adding New Prayers

### Step 1: Prepare Audio File
- Format: M4A or MP3
- Naming: `XXX_Prayer_Title_Here.m4a` (e.g., `039_New_Prayer_Name.m4a`)
- Place in: `meditation-audio/prayers/`

### Step 2: Add Prayer to Database
- Add entry to `prayers` table in Supabase with:
  - `title`: "New Prayer Name" (Title Case, matches filename)
  - `content`: Full prayer text (one line per phrase, as you want it displayed)
  - `audio_url`: "prayers/xxx-new-prayer-name.m4a" (lowercase with dashes)
  - Other fields as needed

### Step 3: Update File Mapping
Edit `whisper-regenerate-timings.js` and add to `LOCAL_FILE_MAP`:
```javascript
const LOCAL_FILE_MAP = {
  // ... existing entries ...
  'xxx-new-prayer-name.m4a': 'XXX_New_Prayer_Name.m4a',
};
```

### Step 4: Generate Timings
```bash
cd tools/meditation-upload
node whisper-regenerate-timings.js
```

### Step 5: Verify
```bash
node verify-timings.js
```

### Step 6: Test in App
- Run the app locally
- Play the new prayer
- Verify text appears in sync with narrator

---

## Scripts

| Script | Purpose |
|--------|---------|
| `whisper-regenerate-timings.js` | **Main script** - Regenerates timings for all prayers |
| `generate-prayer-timings.js` | Alternative script using prayer-content.json |
| `verify-timings.js` | Validates timing data in database |
| `prayer-content.json` | Prayer text content (backup/reference) |

---

## Troubleshooting

### Text appears too early or late
- The timing algorithm may have been changed
- Check that `generateLineTimingsFromWhisper()` uses actual Whisper timestamps
- Do NOT use proportional distribution

### Whisper returns fewer words than prayer
- This is handled - algorithm clamps to last available word
- Some minor drift at end is acceptable

### API errors
- Check `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`
- Verify the `whisper-transcribe` edge function is deployed

---

## Technical Details

### Why Actual Timestamps?

Whisper returns word-level data like:
```json
{
  "words": [
    { "word": "I", "start": 7.02, "end": 7.18 },
    { "word": "speak", "start": 7.20, "end": 7.56 },
    { "word": "healing", "start": 7.58, "end": 8.12 }
  ]
}
```

The correct algorithm consumes these sequentially:
- Line "I speak healing" uses words 0-2
- startMs = word[0].start * 1000 = 7020
- endMs = word[2].end * 1000 = 8120

### Edge Function

Whisper transcription runs via Supabase Edge Function (`whisper-transcribe`) which:
1. Receives base64-encoded audio
2. Calls OpenAI Whisper API with `timestamp_granularities: ["word"]`
3. Returns word-level timestamps

---

## History

- **2025-01**: Fixed critical bug where proportional distribution caused sync drift
- Algorithm now uses actual Whisper word timestamps
- All 8 prayers verified working correctly
