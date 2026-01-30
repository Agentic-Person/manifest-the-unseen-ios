# Prayer Audio-Text Sync: The Disaster Log

**Date**: January 30, 2026
**Status**: STILL BROKEN
**Hours Wasted**: Many

---

## The Problem

Prayer text is supposed to highlight/sync with audio playback. It doesn't work.

---

## What We Thought Was Wrong

After hours of debugging, we identified what we believed was the **root cause**: the `whisper-transcribe` edge function referenced by timing generation scripts **did not exist**.

```
Existing functions: ai-chat, delete-account, guru-analysis, validate-promo
Missing: whisper-transcribe  ← Scripts call this but it was never created
```

---

## What We Did

### Step 1: Created the Missing Edge Function

**File Created**: `supabase/functions/whisper-transcribe/index.ts`

A Deno edge function that:
- Accepts base64-encoded audio + filename
- Calls OpenAI Whisper API with `response_format: verbose_json` and `timestamp_granularities: ["word"]`
- Returns `{ text, words: [{word, start, end}, ...] }`

Full source (~150 lines):
- CORS headers for cross-origin requests
- Base64 to Uint8Array conversion
- MIME type detection from filename
- OpenAI Whisper API integration
- Word-level timestamp extraction

### Step 2: Deployed the Edge Function

```bash
cd supabase
npx supabase functions deploy whisper-transcribe --no-verify-jwt
```

**Result**: Deployed successfully (22.15kB)
```
Deployed Functions on project zbyszxtwzoylyygtexdr: whisper-transcribe
```

### Step 3: Cleared Existing Timing Data

```sql
UPDATE prayers SET line_timings = NULL WHERE audio_url IS NOT NULL;
```

**Result**: Cleared 8 prayers:
- Breaking the Chains
- Complete Declaration of Restoration
- The Courage to Be Still
- The Frequency of Thankfulness
- Communion with the Divine
- I Am Open to Receive
- I Speak Healing
- I Am at Peace

### Step 4: Ran Timing Regeneration Script

```bash
cd tools/meditation-upload
node whisper-regenerate-timings.js
```

**Result**: All 8 prayers processed "successfully":

| Prayer | Words Transcribed | Lines Generated |
|--------|-------------------|-----------------|
| I Speak Healing | 201 | 39 |
| Complete Declaration of Restoration | 897 | 139 |
| I Am Open to Receive | 546 | 42 |
| Breaking the Chains | 820 | 125 |
| I Am at Peace | 375 | 49 |
| The Courage to Be Still | 1119 | 210 |
| The Frequency of Thankfulness | 988 | 222 |
| Communion with the Divine | 1143 | 190 |

**Summary Output**:
```
Updated: 8
Failed: 0
```

### Step 5: Verified Database

Created and ran `tools/meditation-upload/verify-timings.js`:

```
========================================================================
                    VERIFICATION RESULTS
========================================================================
[OK] I Speak Healing                     | Content:  39 | Timings:  39
[OK] Complete Declaration of Restoration | Content: 139 | Timings: 139
[OK] I Am Open to Receive                | Content:  42 | Timings:  42
[OK] Breaking the Chains                 | Content: 125 | Timings: 125
[OK] I Am at Peace                       | Content:  49 | Timings:  49
[OK] The Courage to Be Still             | Content: 210 | Timings: 210
[OK] The Frequency of Thankfulness       | Content: 222 | Timings: 222
[OK] Communion with the Divine           | Content: 190 | Timings: 190
========================================================================
Overall: ALL PRAYERS SYNCED CORRECTLY
========================================================================

Sample timing (first prayer, first 3 lines):
  Line 0: 7020ms - 16133ms
    "I stand in the truth of who I am."
  Line 1: 16133ms - 19171ms
    "I am energy."
  Line 2: 19171ms - 22209ms
    "I am frequency."
```

### Step 6: Committed & Pushed

```bash
git commit -m "feat: add whisper-transcribe edge function for prayer audio-text sync"
git push origin main
```

Commit: `3cfb151`

---

## Files Created/Modified

| File | Action |
|------|--------|
| `supabase/functions/whisper-transcribe/index.ts` | CREATED |
| `tools/meditation-upload/verify-timings.js` | CREATED |
| `tools/meditation-upload/whisper-regenerate-timings.js` | COMMITTED (existed) |
| `tools/meditation-upload/reupload-prayer.js` | COMMITTED (existed) |

---

## What The Database Shows

The `prayers` table now has `line_timings` JSONB populated for all 8 prayers.

Sample structure:
```json
[
  {"line": 0, "text": "I stand in the truth of who I am.", "startMs": 7020, "endMs": 16133},
  {"line": 1, "text": "I am energy.", "startMs": 16133, "endMs": 19171},
  {"line": 2, "text": "I am frequency.", "startMs": 19171, "endMs": 22209},
  ...
]
```

---

## What's STILL Broken

Despite all the above:
- Prayer text still doesn't sync with audio
- The actual issue was never the edge function or database

---

## What We Haven't Checked

1. **Frontend code**: Does `usePrayerTiming.ts` actually read and use `line_timings`?
2. **Audio player**: Is the current playback position being tracked correctly?
3. **PrayerTextDisplay.tsx**: Is it receiving timing data and highlighting correctly?
4. **Web vs iOS**: Does audio playback work differently in web mode?
5. **Data fetching**: Is the app even fetching the updated `line_timings` from the database?

---

## Relevant Frontend Files (Not Yet Investigated)

- `mobile/src/hooks/usePrayerTiming.ts` - Hook for prayer timing logic
- `mobile/src/components/meditation/PrayerTextDisplay.tsx` - Component that displays prayer text
- `mobile/src/screens/meditation/MeditationPlayerScreen.tsx` - Player screen

---

## Cost of This Adventure

- **Whisper API**: ~$0.10 (8 audio files)
- **Time**: Hours of debugging
- **Sanity**: Depleted

---

## Next Steps

1. Actually test in the app (not web mode)
2. Check if frontend code reads `line_timings`
3. Add console logs to trace the data flow
4. Verify audio position tracking
5. Consider that the problem might be completely different

---

## Lessons Learned

1. "All tests passing" doesn't mean it works
2. Database having data doesn't mean the app uses it
3. Always test the actual user-facing feature, not just the backend

---

---

## Debug Session 2: Tracing the Data Flow

### What We Found

The code chain looks correct:
- `Prayer` type has `line_timings: PrayerLineTiming[] | null` (guru.ts:144)
- `prayerService.ts` uses `select=*` which includes all columns
- `MeditationPlayerScreen.tsx` passes `prayerData?.line_timings` to `PrayerTextDisplay`
- `PrayerTextDisplay.tsx` passes it to `useCurrentPrayerLine`
- `useCurrentPrayerLine` uses Whisper timings when available

### Debug Logging Added

Added console.log statements to trace exactly where the breakdown occurs:

**MeditationPlayerScreen.tsx** - logs when prayer data is loaded:
```javascript
console.log('[MeditationPlayerScreen] Prayer data:', {
  id: prayerData.id,
  title: prayerData.title,
  hasLineTimings: !!prayerData.line_timings,
  lineTimingsCount: prayerData.line_timings?.length || 0,
  firstTiming: prayerData.line_timings?.[0],
  audioUrl: prayerData.audio_url,
});
```

**PrayerTextDisplay.tsx** - logs props and computed values:
```javascript
console.log('[PrayerTextDisplay] Props:', {
  contentLength: prayerContent?.length,
  audioDurationMs,
  currentPositionMs,
  isPlaying,
  hasLineTimings: !!lineTimings,
  lineTimingsCount: lineTimings?.length || 0,
  firstTiming: lineTimings?.[0],
});

console.log('[PrayerTextDisplay] Computed:', {
  currentIndex,
  totalLines,
  currentLineText: currentLine?.text?.substring(0, 30),
});
```

### Possible Issues to Investigate

1. **TanStack Query cache** - might have stale data without line_timings
2. **Web audio position** - might not report position updates correctly
3. **`progress.position`** - might always be 0 on web
4. **Audio not playing** - web preview has known audio issues

### Navigation Fix Also Applied

Fixed an unrelated issue where the app was showing the Paywall even when subscribed in dev mode:

**RootNavigator.tsx** - now checks subscription status:
```javascript
{authState === 'anonymous' && !isSubscribed && (
  <Stack.Screen name="Guest" component={GuestNavigator} />
)}
{(authState === 'authenticated' || isSubscribed) && (
  <Stack.Screen name="Main" component={MainTabNavigator} />
)}
```

---

*Last Updated: 2026-01-30*
