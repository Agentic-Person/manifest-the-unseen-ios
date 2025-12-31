# Supabase Agent 2: Phases 1-4 Integration

> **Agent Role**: Integrate Phases 1-4 screens with Supabase (12 screens)
> **Reports To**: `SUPABASE-ORCHESTRATOR.md`
> **Depends On**: Agent 1 (Infrastructure) must complete first
> **Status**: `pending`
> **Playwright Tested**: `not_tested`
> **Est. Time**: 4-5 hours

---

## Task Summary

Replace `console.log` stubs in 12 workbook screens (Phases 1-4) with real Supabase saves using the infrastructure created by Agent 1.

---

## Status Tracking

| Phase | Screen | File | Status |
|-------|--------|------|--------|
| 1 | Wheel of Life | `Phase1/WheelOfLifeScreen.tsx` | `pending` |
| 1 | SWOT Analysis | `Phase1/SWOTAnalysisScreen.tsx` | `pending` |
| 1 | Habits Audit | `Phase1/HabitsAuditScreen.tsx` | `pending` |
| 1 | Values Assessment | `Phase1/ValuesAssessmentScreen.tsx` | `pending` |
| 2 | Life Mission | `Phase2/LifeMissionScreen.tsx` | `pending` |
| 2 | Purpose Statement | `Phase2/PurposeStatementScreen.tsx` | `pending` |
| 2 | Vision Board | `Phase2/VisionBoardScreen.tsx` | `pending` |
| 3 | SMART Goals | `Phase3/SMARTGoalsScreen.tsx` | `pending` |
| 3 | Timeline | `Phase3/TimelineScreen.tsx` | `pending` |
| 3 | Action Plan | `Phase3/ActionPlanScreen.tsx` | `pending` |
| 4 | Fear Inventory | `Phase4/FearInventoryScreen.tsx` | `pending` |
| 4 | Limiting Beliefs | `Phase4/LimitingBeliefsScreen.tsx` | `pending` |
| 4 | Fear Facing Plan | `Phase4/FearFacingPlanScreen.tsx` | `pending` |

---

## Integration Pattern

For each screen, follow this pattern:

### Step 1: Add Imports
```typescript
// ADD these imports at top of file
import { useWorkbookProgress, useAutoSave } from '../../../hooks/useWorkbook';
import { SaveIndicator } from '../../../components/workbook/SaveIndicator';
import { useAuthStore } from '../../../stores/authStore';
```

### Step 2: Load Saved Data
```typescript
// ADD after other hooks
const user = useAuthStore((state) => state.user);
const { data: savedProgress, isLoading } = useWorkbookProgress(PHASE_NUMBER, 'worksheet-id');

// Load saved data on mount
useEffect(() => {
  if (savedProgress?.data) {
    // Cast to the correct type for this screen
    setValues(savedProgress.data as YourDataType);
  }
}, [savedProgress]);
```

### Step 3: Replace Auto-Save Stub
```typescript
// REMOVE this pattern:
const autoSave = useCallback(async () => {
  console.log('Auto-saving data:', values);
}, [values]);

// REPLACE with:
const { isSaving, isError, lastSaved, saveNow } = useAutoSave({
  data: values,
  phaseNumber: PHASE_NUMBER,
  worksheetId: 'worksheet-id',
  debounceMs: 1500,
});
```

### Step 4: Add SaveIndicator to UI
```typescript
// ADD in the render, typically near the top or bottom of content
<SaveIndicator
  isSaving={isSaving}
  lastSaved={lastSaved}
  isError={isError}
  onRetry={saveNow}
/>
```

### Step 5: Handle Loading State
```typescript
// ADD loading check
if (isLoading) {
  return <Loading message="Loading your progress..." />;
}
```

---

## Screen-Specific Details

### Phase 1: Self-Evaluation

#### WheelOfLifeScreen.tsx
- **worksheet_id**: `wheel-of-life`
- **Data structure**: `{ career, health, relationships, finance, personalGrowth, family, recreation, spirituality }` (all numbers 1-10)
- **Special**: Uses slider components, data is 8 numeric values

#### SWOTAnalysisScreen.tsx
- **worksheet_id**: `swot-analysis`
- **Data structure**: `{ strengths: string[], weaknesses: string[], opportunities: string[], threats: string[] }`
- **Special**: Tag-based input, 4 arrays of strings

#### HabitsAuditScreen.tsx
- **worksheet_id**: `habits-audit`
- **Data structure**: `{ habits: Array<{ id, name, type: 'good'|'bad', frequency }> }`
- **Special**: List of habit objects

#### ValuesAssessmentScreen.tsx
- **worksheet_id**: `values-assessment`
- **Data structure**: `{ values: Array<{ id, name, rank, importance }> }`
- **Special**: Ranked list of values

### Phase 2: Values & Vision

#### LifeMissionScreen.tsx
- **worksheet_id**: `life-mission`
- **Data structure**: `{ mission: string, keywords: string[], lastUpdated: string }`
- **Special**: Long text input

#### PurposeStatementScreen.tsx
- **worksheet_id**: `purpose-statement`
- **Data structure**: `{ purpose: string, whyItMatters: string }`
- **Special**: Multiple text areas

#### VisionBoardScreen.tsx
- **worksheet_id**: `vision-board`
- **Data structure**: `{ images: Array<{ id, uri, position, scale }>, goals: string[] }`
- **Special**: May also use `vision_boards` table - coordinate with that table if needed

### Phase 3: Goal Setting

#### SMARTGoalsScreen.tsx
- **worksheet_id**: `smart-goals`
- **Data structure**: `{ goals: Array<GoalData> }` (see types/workbook.ts)
- **Special**: Complex structured goals with SMART criteria

#### TimelineScreen.tsx
- **worksheet_id**: `timeline`
- **Data structure**: `{ milestones: Array<{ id, title, date, goalId, completed }> }`
- **Special**: Date-based entries

#### ActionPlanScreen.tsx
- **worksheet_id**: `action-plan`
- **Data structure**: `{ actions: Array<{ id, task, deadline, priority, status }> }`
- **Special**: Task list with statuses

### Phase 4: Facing Fears

#### FearInventoryScreen.tsx
- **worksheet_id**: `fear-inventory`
- **Data structure**: `{ fears: Array<FearData> }` (see types/workbook.ts)
- **Special**: Intensity slider (1-10)

#### LimitingBeliefsScreen.tsx
- **worksheet_id**: `limiting-beliefs`
- **Data structure**: `{ beliefs: Array<{ id, belief, evidence, reframe, newBelief }> }`
- **Special**: 3-column restructuring format

#### FearFacingPlanScreen.tsx
- **worksheet_id**: `fear-facing-plan`
- **Data structure**: `{ plans: Array<{ fearId, steps: string[], targetDate, progress }> }`
- **Special**: Links to fears from FearInventory

---

## Verification Per Screen

After integrating each screen, verify:

- [ ] Data loads from Supabase on mount
- [ ] SaveIndicator shows "Saving..." during save
- [ ] SaveIndicator shows "Saved at HH:MM" after save
- [ ] Data persists after closing and reopening screen
- [ ] Error state shows if Supabase is unreachable
- [ ] No TypeScript errors

---

## Report to Orchestrator

When all 12 screens complete, add to `SUPABASE-ORCHESTRATOR.md`:

```
### [DATE TIME] - Agent 2 (Phases 1-4)
**Status**: completed
**Summary**: Integrated 12 screens with Supabase backend
**Screens Modified**:
- Phase 1: WheelOfLife, SWOTAnalysis, HabitsAudit, ValuesAssessment
- Phase 2: LifeMission, PurposeStatement, VisionBoard
- Phase 3: SMARTGoals, Timeline, ActionPlan
- Phase 4: FearInventory, LimitingBeliefs, FearFacingPlan
**Blockers**: [any issues]
**Next**: Ready for Playwright verification
```

Update status above to `completed`.

---

*Agent Document Version: 1.0*
