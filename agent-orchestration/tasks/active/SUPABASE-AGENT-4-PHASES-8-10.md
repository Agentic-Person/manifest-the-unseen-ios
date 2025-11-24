# Supabase Agent 4: Phases 8-10 Integration

> **Agent Role**: Integrate Phases 8-10 screens with Supabase (9 screens)
> **Reports To**: `SUPABASE-ORCHESTRATOR.md`
> **Depends On**: Agent 1 (Infrastructure) must complete first
> **Status**: `pending`
> **Playwright Tested**: `not_tested`
> **Est. Time**: 3-4 hours

---

## Task Summary

Replace `console.log` stubs in 9 workbook screens (Phases 8-10) with real Supabase saves using the infrastructure created by Agent 1.

---

## Status Tracking

| Phase | Screen | File | Status |
|-------|--------|------|--------|
| 8 | Envy Inventory | `Phase8/EnvyInventoryScreen.tsx` | `pending` |
| 8 | Inspiration Reframe | `Phase8/InspirationReframeScreen.tsx` | `pending` |
| 8 | Role Models | `Phase8/RoleModelsScreen.tsx` | `pending` |
| 9 | Trust Assessment | `Phase9/TrustAssessmentScreen.tsx` | `pending` |
| 9 | Surrender Practice | `Phase9/SurrenderPracticeScreen.tsx` | `pending` |
| 9 | Signs | `Phase9/SignsScreen.tsx` | `pending` |
| 10 | Journey Review | `Phase10/JourneyReviewScreen.tsx` | `pending` |
| 10 | Future Letter | `Phase10/FutureLetterScreen.tsx` | `pending` |
| 10 | Graduation | `Phase10/GraduationScreen.tsx` | `pending` |

---

## Integration Pattern

Same pattern as Agents 2 and 3. For each screen:

### Standard Integration Steps
```typescript
// 1. Imports
import { useWorkbookProgress, useAutoSave } from '../../../hooks/useWorkbook';
import { SaveIndicator } from '../../../components/workbook/SaveIndicator';
import { useAuthStore } from '../../../stores/authStore';

// 2. Load saved data
const { data: savedProgress, isLoading } = useWorkbookProgress(PHASE, 'worksheet-id');

useEffect(() => {
  if (savedProgress?.data) {
    setValues(savedProgress.data as DataType);
  }
}, [savedProgress]);

// 3. Auto-save hook
const { isSaving, isError, lastSaved, saveNow } = useAutoSave({
  data: values,
  phaseNumber: PHASE,
  worksheetId: 'worksheet-id',
});

// 4. SaveIndicator in UI
<SaveIndicator isSaving={isSaving} lastSaved={lastSaved} isError={isError} onRetry={saveNow} />
```

---

## Screen-Specific Details

### Phase 8: Envy to Inspiration

#### EnvyInventoryScreen.tsx
- **worksheet_id**: `envy-inventory`
- **Data structure**:
```typescript
{
  triggers: Array<{
    id: string,
    person: string,
    trait: string,
    feeling: string,
    intensity: number // 1-10
  }>
}
```

#### InspirationReframeScreen.tsx
- **worksheet_id**: `inspiration-reframe`
- **Data structure**:
```typescript
{
  reframes: Array<{
    envyId: string, // links to EnvyInventory
    originalThought: string,
    reframedThought: string,
    actionable: string // what can I do?
  }>
}
```

#### RoleModelsScreen.tsx
- **worksheet_id**: `role-models`
- **Data structure**:
```typescript
{
  roleModels: Array<{
    id: string,
    name: string,
    traits: string[],
    whyInspiring: string,
    lessonsToLearn: string[]
  }>
}
```

### Phase 9: Trust & Surrender

#### TrustAssessmentScreen.tsx
- **worksheet_id**: `trust-assessment`
- **Data structure**:
```typescript
{
  areas: {
    self: number, // 1-10
    others: number,
    universe: number,
    process: number
  },
  reflections: {
    self: string,
    others: string,
    universe: string,
    process: string
  }
}
```
- **Special**: Radar chart visualization

#### SurrenderPracticeScreen.tsx
- **worksheet_id**: `surrender-practice`
- **Data structure**:
```typescript
{
  practices: Array<{
    id: string,
    date: string,
    whatToRelease: string,
    affirmation: string,
    feeling: string
  }>
}
```

#### SignsScreen.tsx
- **worksheet_id**: `signs-tracking`
- **Data structure**:
```typescript
{
  signs: Array<{
    id: string,
    date: string,
    description: string,
    interpretation: string,
    category: 'synchronicity' | 'dream' | 'intuition' | 'other'
  }>
}
```

### Phase 10: Letting Go (Graduation)

#### JourneyReviewScreen.tsx
- **worksheet_id**: `journey-review`
- **Data structure**:
```typescript
{
  review: {
    biggestLearning: string,
    proudestMoment: string,
    biggestChallenge: string,
    howOvercame: string,
    gratefulFor: string[],
    nextSteps: string[]
  }
}
```
- **Special**: This screen should also FETCH data from all other phases to show summary. Use `useAllWorkbookProgress()` hook.

#### FutureLetterScreen.tsx
- **worksheet_id**: `future-letter`
- **Data structure**:
```typescript
{
  letter: {
    toSelf: string,
    openDate: string, // future date
    sealed: boolean,
    sealedAt: string | null
  }
}
```
- **Special**: Once sealed, letter content should be hidden (envelope animation)

#### GraduationScreen.tsx
- **worksheet_id**: `graduation`
- **Data structure**:
```typescript
{
  graduation: {
    completed: boolean,
    completedAt: string,
    certificate: {
      name: string,
      date: string,
      achievements: string[]
    },
    reflection: string
  }
}
```
- **Special**:
  - Should trigger confetti animation
  - Should update user's `current_phase` to indicate completion
  - Consider: Update users table with graduation status

---

## Special Considerations for This Agent

### JourneyReviewScreen - Data Aggregation
This screen needs to pull data from ALL phases to display a summary:

```typescript
import { useAllWorkbookProgress } from '../../../hooks/useWorkbook';

const { data: allProgress } = useAllWorkbookProgress();

// Calculate summary from all phases
const summary = useMemo(() => {
  if (!allProgress) return null;

  return {
    totalWorksheets: allProgress.length,
    completedWorksheets: allProgress.filter(p => p.completed).length,
    phaseBreakdown: groupByPhase(allProgress),
    highlights: extractHighlights(allProgress),
  };
}, [allProgress]);
```

### GraduationScreen - Mark User Complete
After user completes graduation, consider updating the users table:

```typescript
// After saving graduation data
if (data.graduation.completed) {
  await supabase
    .from('users')
    .update({
      workbook_completed: true,
      workbook_completed_at: new Date().toISOString()
    })
    .eq('id', user.id);
}
```

This may require coordinating with backend team or adding a new column to users table.

---

## Verification Per Screen

After integrating each screen, verify:

- [ ] Data loads from Supabase on mount
- [ ] SaveIndicator shows correct states
- [ ] Data persists after app restart
- [ ] JourneyReview shows data from all phases
- [ ] GraduationScreen confetti/certificate works
- [ ] No TypeScript errors

---

## Report to Orchestrator

When all 9 screens complete, add to `SUPABASE-ORCHESTRATOR.md`:

```
### [DATE TIME] - Agent 4 (Phases 8-10)
**Status**: completed
**Summary**: Integrated 9 screens with Supabase backend
**Screens Modified**:
- Phase 8: EnvyInventory, InspirationReframe, RoleModels
- Phase 9: TrustAssessment, SurrenderPractice, Signs
- Phase 10: JourneyReview, FutureLetter, Graduation
**Special Notes**: JourneyReview aggregates all phase data, Graduation may need users table update
**Blockers**: [any issues]
**Next**: Ready for Playwright verification
```

Update status above to `completed`.

---

*Agent Document Version: 1.0*
