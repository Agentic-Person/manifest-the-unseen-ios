# Guru AI System Prompt & Configuration Plan

**Date:** December 14, 2025
**Status:** Implementation Ready

---

## Goal

Enhance the "Guru" AI feature to:
1. Fix critical bugs preventing the feature from working
2. Analyze completed workbook phases using RAG knowledge base
3. Suggest relevant meditations and breathing exercises from the app

---

## Current State

**Already Implemented:**
- `guru-analysis` edge function (786 lines) with phase-specific prompts
- RAG knowledge search integration (pgvector, threshold 0.7, top 5 results)
- 327 knowledge embeddings in database (Shi Heng Yi, Tesla 3-6-9, etc.)
- Claude API integration with 2048 max tokens
- Conversation history management
- Enlightenment tier verification (currently broken)

**Phase Prompts Already Exist For:**
| Phase | Focus |
|-------|-------|
| 1. Self-Evaluation | Wheel of Life, SWOT, values, habits analysis |
| 2. Values & Vision | Purpose, vision board alignment |
| 3. Goal Setting | SMART goals, action plans |
| 4. Fears & Limiting Beliefs | Cognitive patterns, reframes |
| 5. Self-Love & Self-Care | Self-compassion |
| 6. Manifestation Techniques | 3-6-9, WOOP, scripting |
| 7. Gratitude | Abundance mindset |
| 8. Envy to Inspiration | Shadow work |
| 9. Trust & Surrender | Letting go |
| 10. Graduation | Journey integration |

---

## Critical Bugs to Fix

### Bug 1: Phase 1 Worksheet Count Mismatch (CRITICAL)

**Problem:** Client says Phase 1 has 4 worksheets, but Edge Function expects 11

| Location | Value |
|----------|-------|
| `mobile/src/hooks/useGuru.ts` line 86 | `1: 4` |
| `supabase/functions/guru-analysis/index.ts` line 79 | `1: 11` |

**Impact:** Phase 1 users will NEVER unlock Guru analysis

**Fix:** Update `useGuru.ts` to: `1: 11`

---

### Bug 2: Subscription Tier Mismatch (CRITICAL)

**Problem:** Edge function requires Enlightenment only, but client allows Awakening+

| Location | Behavior |
|----------|----------|
| Client `useGuruAccess()` | Returns `true` for Awakening tier |
| Edge Function `verifyEnlightenmentTier()` | Requires `enlightenment` only |

**Impact:** Awakening users see Guru UI but get 403 errors when trying to use it

**Fix:** Update Edge Function to accept Awakening+ tiers:
```typescript
// Change from:
return data.subscription_tier === 'enlightenment';

// Change to:
return ['awakening', 'enlightenment'].includes(data.subscription_tier);
```

---

### Bug 3: Timestamp Type Mismatch

**Problem:** Edge Function sends `timestamp: number`, client expects `string`

| Location | Type |
|----------|------|
| Edge Function line 712 | `timestamp: Date.now()` (number - milliseconds) |
| Client GuruMessage type | `timestamp: string` (ISO format) |

**Fix:** Update Edge Function to use ISO strings:
```typescript
// Change from:
timestamp: Date.now()

// Change to:
timestamp: new Date().toISOString()
```

---

## New Feature: Meditation & Breathing Suggestions

### Available Content in App

**Guided Meditations (3):**
- Morning Awakening - Start the day with clarity
- Mind Body - Focus and grounding
- Inner Peace - Calm and centering

**Breathing Exercises (5 patterns):**
- Box Breathing (4-4-4-4) - Classic calming technique
- Deep Calm (5-2-5-2) - Parasympathetic activation
- Energy Boost (2-0-2-0) - Quick rhythmic breathing
- 4-7-8 Relaxation (4-7-8-0) - Deep calming breath
- Coherent Breathing (5-5) - Heart coherence

**Meditation Music (13 tracks):**
- Various ambient/instrumental tracks

---

### Phase-to-Practice Mapping

| Phase | Suggested Meditation | Suggested Breathing | Why |
|-------|---------------------|---------------------|-----|
| 1. Self-Evaluation | Morning Awakening | Box Breathing (4-4-4-4) | Clarity and centering for self-reflection |
| 2. Values & Vision | Inner Peace | Coherent Breathing (5-5) | Heart-centered for vision clarity |
| 3. Goal Setting | Mind Body | Energy Boost (2-0-2-0) | Focus and motivation |
| 4. Fears & Limiting Beliefs | Inner Peace | Deep Calm (5-2-5-2) | Calming the nervous system |
| 5. Self-Love & Self-Care | Morning Awakening | 4-7-8 Relaxation | Self-nurturing and rest |
| 6. Manifestation Techniques | Any (context-dependent) | Box Breathing (4-4-4-4) | Focus for visualization |
| 7. Gratitude | Inner Peace | Coherent Breathing (5-5) | Heart opening |
| 8. Envy to Inspiration | Mind Body | Deep Calm (5-2-5-2) | Grounding |
| 9. Trust & Surrender | Inner Peace | 4-7-8 Relaxation | Letting go |
| 10. Graduation | Any (celebration) | Coherent Breathing (5-5) | Integration |

---

## Enhanced Response Structure

Update system prompts to guide Claude's response format:

```
Your responses should flow through these stages:

1. **Observation** - What patterns do you notice in their workbook answers?
   Reference specific data points from their worksheets.

2. **Wisdom** - What teachings from the knowledge base apply here?
   Draw from Shi Heng Yi, manifestation principles, or Tesla's 3-6-9.

3. **Reflection** - Pose a thought-provoking question for deeper self-inquiry.
   Help them see something they may have missed.

4. **Practice** - Suggest a specific action:
   - A meditation from the app's Meditate section
   - A breathing exercise with the pattern name
   - A journaling prompt or workbook revisit

Keep responses focused: 3-5 paragraphs max.
```

---

## Implementation Steps

### Step 1: Fix Critical Bugs

**File: `mobile/src/hooks/useGuru.ts`**
- Line 86: Change `1: 4` to `1: 11`

**File: `supabase/functions/guru-analysis/index.ts`**
- Lines 364-380: Update `verifyEnlightenmentTier()` to `verifyGuruAccess()` accepting 'awakening' or 'enlightenment'
- Lines 710-719: Change `Date.now()` to `new Date().toISOString()`

### Step 2: Add Meditation Suggestions Constant

**File: `supabase/functions/guru-analysis/index.ts`**

Add after line 88 (after WORKSHEETS_PER_PHASE):

```typescript
const PHASE_PRACTICE_SUGGESTIONS: Record<number, { meditation: string; breathing: string }> = {
  1: { meditation: 'Morning Awakening', breathing: 'Box Breathing (4-4-4-4)' },
  2: { meditation: 'Inner Peace', breathing: 'Coherent Breathing (5-5)' },
  3: { meditation: 'Mind Body', breathing: 'Energy Boost (quick rhythmic)' },
  4: { meditation: 'Inner Peace', breathing: 'Deep Calm (5-2-5-2)' },
  5: { meditation: 'Morning Awakening', breathing: '4-7-8 Relaxation' },
  6: { meditation: 'any that supports visualization', breathing: 'Box Breathing (4-4-4-4)' },
  7: { meditation: 'Inner Peace', breathing: 'Coherent Breathing (5-5)' },
  8: { meditation: 'Mind Body', breathing: 'Deep Calm (5-2-5-2)' },
  9: { meditation: 'Inner Peace', breathing: '4-7-8 Relaxation' },
  10: { meditation: 'any guided meditation', breathing: 'Coherent Breathing (5-5)' },
};
```

### Step 3: Update Phase Prompts

Add to each PHASE_PROMPT:

```typescript
**Suggested Practices:**
- Meditation: ${PHASE_PRACTICE_SUGGESTIONS[phaseNumber].meditation}
- Breathing: ${PHASE_PRACTICE_SUGGESTIONS[phaseNumber].breathing}

When appropriate, recommend the user explore these in the app's Meditate section.

**Response Structure:**
1. Observation - specific patterns from their data
2. Wisdom - relevant teachings from the knowledge base
3. Reflection - a question for deeper inquiry
4. Practice - meditation or breathing suggestion
```

### Step 4: Deploy and Test

```bash
# Deploy updated Edge Function
cd supabase
npx supabase functions deploy guru-analysis

# Test locally first (optional)
npx supabase functions serve guru-analysis
```

---

## Files to Modify

| File | Changes |
|------|---------|
| `mobile/src/hooks/useGuru.ts` | Fix Phase 1 worksheet count (line 86) |
| `supabase/functions/guru-analysis/index.ts` | Fix tier verification, fix timestamps, add meditation suggestions, enhance prompts |

---

## Testing Checklist

- [ ] Complete all Phase 1 worksheets (11 total) with test account
- [ ] Verify Phase 1 shows as "completed" in Guru phase selection
- [ ] Test with Awakening tier subscription - should work
- [ ] Test with Novice tier subscription - should be blocked
- [ ] Send message to Guru and verify:
  - [ ] RAG knowledge retrieval works (check console logs)
  - [ ] Response references specific workbook data
  - [ ] Response suggests meditation/breathing exercise
  - [ ] Response follows Observation → Wisdom → Reflection → Practice structure
- [ ] Test conversation continuity (multiple messages)
- [ ] Verify timestamps display correctly in UI

---

## Success Criteria

1. Awakening and Enlightenment tier users can access Guru
2. Phase 1 (11 worksheets) and other phases unlock correctly
3. Guru responses reference user's specific workbook answers
4. Guru suggests relevant meditations and breathing exercises
5. Responses follow structured format for consistency
6. Conversation history persists correctly
