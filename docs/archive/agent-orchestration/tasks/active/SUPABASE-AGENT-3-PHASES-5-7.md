# Supabase Agent 3: Phases 5-7 Integration

> **Agent Role**: Integrate Phases 5-7 screens with Supabase (9 screens)
> **Reports To**: `SUPABASE-ORCHESTRATOR.md`
> **Depends On**: Agent 1 (Infrastructure) must complete first
> **Status**: `pending`
> **Playwright Tested**: `not_tested`
> **Est. Time**: 4-5 hours

---

## Task Summary

Replace `console.log` stubs in 9 workbook screens (Phases 5-7) with real Supabase saves using the infrastructure created by Agent 1.

---

## Status Tracking

| Phase | Screen | File | Status |
|-------|--------|------|--------|
| 5 | Self-Love Affirmations | `Phase5/SelfLoveAffirmationsScreen.tsx` | `pending` |
| 5 | Self-Care Routine | `Phase5/SelfCareRoutineScreen.tsx` | `pending` |
| 5 | Inner Child | `Phase5/InnerChildScreen.tsx` | `pending` |
| 6 | 3-6-9 Method | `Phase6/ThreeSixNineScreen.tsx` | `pending` |
| 6 | Scripting | `Phase6/ScriptingScreen.tsx` | `pending` |
| 6 | WOOP | `Phase6/WOOPScreen.tsx` | `pending` |
| 7 | Gratitude Journal | `Phase7/GratitudeJournalScreen.tsx` | `pending` |
| 7 | Gratitude Letters | `Phase7/GratitudeLettersScreen.tsx` | `pending` |
| 7 | Gratitude Meditation | `Phase7/GratitudeMeditationScreen.tsx` | `pending` |

---

## Integration Pattern

Same pattern as Agent 2. For each screen:

### Step 1: Add Imports
```typescript
import { useWorkbookProgress, useAutoSave } from '../../../hooks/useWorkbook';
import { SaveIndicator } from '../../../components/workbook/SaveIndicator';
import { useAuthStore } from '../../../stores/authStore';
```

### Step 2: Load Saved Data
```typescript
const user = useAuthStore((state) => state.user);
const { data: savedProgress, isLoading } = useWorkbookProgress(PHASE_NUMBER, 'worksheet-id');

useEffect(() => {
  if (savedProgress?.data) {
    setValues(savedProgress.data as YourDataType);
  }
}, [savedProgress]);
```

### Step 3: Replace Auto-Save
```typescript
const { isSaving, isError, lastSaved, saveNow } = useAutoSave({
  data: values,
  phaseNumber: PHASE_NUMBER,
  worksheetId: 'worksheet-id',
});
```

### Step 4: Add SaveIndicator
```typescript
<SaveIndicator
  isSaving={isSaving}
  lastSaved={lastSaved}
  isError={isError}
  onRetry={saveNow}
/>
```

---

## Screen-Specific Details

### Phase 5: Self-Love & Self-Care

#### SelfLoveAffirmationsScreen.tsx
- **worksheet_id**: `self-love-affirmations`
- **Data structure**: `{ affirmations: Array<AffirmationData> }`
- **Special**: Category-tagged affirmations

#### SelfCareRoutineScreen.tsx
- **worksheet_id**: `self-care-routine`
- **Data structure**: `{ routines: { morning: Activity[], evening: Activity[], weekly: Activity[] } }`
- **Special**: Time-slot based activities

#### InnerChildScreen.tsx
- **worksheet_id**: `inner-child`
- **Data structure**: `{ letter: string, memories: string[], healing: string }`
- **Special**: Journaling/letter writing

### Phase 6: Manifestation Techniques

#### ThreeSixNineScreen.tsx
- **worksheet_id**: `369-method`
- **Data structure**:
```typescript
{
  manifestation: string,
  cycles: Array<{
    date: string,
    morning: { completed: boolean, count: number }, // 3x
    afternoon: { completed: boolean, count: number }, // 6x
    evening: { completed: boolean, count: number } // 9x
  }>
}
```
- **Special**: Daily tracking with repetition counts. Multiple entries per day cycle.

#### ScriptingScreen.tsx
- **worksheet_id**: `scripting`
- **Data structure**: `{ scripts: Array<{ id, title, content, date, category }> }`
- **Special**: Long-form text entries

#### WOOPScreen.tsx
- **worksheet_id**: `woop-method`
- **Data structure**:
```typescript
{
  wish: string,
  outcome: string,
  obstacle: string,
  plan: string,
  ifThen: string // "If [obstacle], then I will [action]"
}
```
- **Special**: Structured 4-part framework

### Phase 7: Practicing Gratitude

#### GratitudeJournalScreen.tsx
- **worksheet_id**: `gratitude-journal`
- **Data structure**:
```typescript
{
  entries: Array<{
    id: string,
    date: string,
    items: string[], // 3-5 gratitude items
    reflection: string,
    mood: number // 1-10
  }>,
  streak: number
}
```
- **Special**: Date-based entries, streak tracking. May need special handling for daily entries.

#### GratitudeLettersScreen.tsx
- **worksheet_id**: `gratitude-letters`
- **Data structure**: `{ letters: Array<{ id, recipient, content, date, sent: boolean }> }`
- **Special**: Letter writing to specific people

#### GratitudeMeditationScreen.tsx
- **worksheet_id**: `gratitude-meditation`
- **Data structure**:
```typescript
{
  sessions: Array<{
    date: string,
    duration: number, // minutes
    focus: string,
    reflection: string
  }>
}
```
- **Special**: May also interact with `meditation_sessions` table for analytics

---

## Special Considerations for This Agent

### Daily Tracking Screens
ThreeSixNineScreen and GratitudeJournalScreen have **daily entries**. The data structure uses arrays to store multiple entries over time. When loading:
- Check if today's entry exists
- If not, create a new entry for today
- If yes, load and allow editing

### Streak Calculation
GratitudeJournalScreen tracks streaks. Calculate streak on load:
```typescript
const calculateStreak = (entries: GratitudeEntry[]) => {
  // Sort by date descending
  // Count consecutive days from today
  // Return streak count
};
```

---

## Verification Per Screen

After integrating each screen, verify:

- [ ] Data loads from Supabase on mount
- [ ] SaveIndicator shows correct states
- [ ] Data persists after app restart
- [ ] Daily entries work correctly (369, Gratitude)
- [ ] No TypeScript errors

---

## Report to Orchestrator

When all 9 screens complete, add to `SUPABASE-ORCHESTRATOR.md`:

```
### [DATE TIME] - Agent 3 (Phases 5-7)
**Status**: completed
**Summary**: Integrated 9 screens with Supabase backend
**Screens Modified**:
- Phase 5: SelfLoveAffirmations, SelfCareRoutine, InnerChild
- Phase 6: ThreeSixNine, Scripting, WOOP
- Phase 7: GratitudeJournal, GratitudeLetters, GratitudeMeditation
**Blockers**: [any issues]
**Next**: Ready for Playwright verification
```

Update status above to `completed`.

---

*Agent Document Version: 1.0*
