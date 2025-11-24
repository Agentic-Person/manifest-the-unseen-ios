# Supabase Integration Orchestrator

> **Role**: Master orchestrator coordinating 4 sub-agents for Supabase backend integration
> **Created**: 2025-11-24
> **Workstream**: Backend Integration
> **Final Output**: Update MTU-PROJECT-STATUS.md when all agents verified

---

## Status Dashboard

| Agent | Task | Status | Playwright |
|-------|------|--------|------------|
| Agent 1 | Core Infrastructure | `pending` | `not_tested` |
| Agent 2 | Phases 1-4 Integration | `pending` | `not_tested` |
| Agent 3 | Phases 5-7 Integration | `pending` | `not_tested` |
| Agent 4 | Phases 8-10 Integration | `pending` | `not_tested` |

**Overall Progress**: 0/4 agents completed | 0/4 verified

---

## Objective

Connect all 30 workbook screens to the Supabase backend, replacing `console.log` stubs with real database operations using auto-save with TanStack Query.

---

## Architecture Overview

### Database Schema (workbook_progress table)
```sql
CREATE TABLE workbook_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  phase_number INTEGER NOT NULL CHECK (phase_number >= 1 AND phase_number <= 10),
  worksheet_id TEXT NOT NULL,
  data JSONB NOT NULL DEFAULT '{}',
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, phase_number, worksheet_id)
);
```

### Auto-Save Strategy
- **Debounce**: 1500ms after last user input
- **Optimistic Updates**: Update UI immediately, sync to DB
- **Error Handling**: Retry with exponential backoff (1s, 2s, 4s, max 30s)
- **Offline**: Queue mutations, sync when online

### Worksheet ID Mapping (30 screens)

| Phase | Screen | worksheet_id |
|-------|--------|--------------|
| 1 | WheelOfLifeScreen | `wheel-of-life` |
| 1 | SWOTAnalysisScreen | `swot-analysis` |
| 1 | HabitsAuditScreen | `habits-audit` |
| 1 | ValuesAssessmentScreen | `values-assessment` |
| 2 | LifeMissionScreen | `life-mission` |
| 2 | PurposeStatementScreen | `purpose-statement` |
| 2 | VisionBoardScreen | `vision-board` |
| 3 | SMARTGoalsScreen | `smart-goals` |
| 3 | TimelineScreen | `timeline` |
| 3 | ActionPlanScreen | `action-plan` |
| 4 | FearInventoryScreen | `fear-inventory` |
| 4 | LimitingBeliefsScreen | `limiting-beliefs` |
| 4 | FearFacingPlanScreen | `fear-facing-plan` |
| 5 | SelfLoveAffirmationsScreen | `self-love-affirmations` |
| 5 | SelfCareRoutineScreen | `self-care-routine` |
| 5 | InnerChildScreen | `inner-child` |
| 6 | ThreeSixNineScreen | `369-method` |
| 6 | ScriptingScreen | `scripting` |
| 6 | WOOPScreen | `woop-method` |
| 7 | GratitudeJournalScreen | `gratitude-journal` |
| 7 | GratitudeLettersScreen | `gratitude-letters` |
| 7 | GratitudeMeditationScreen | `gratitude-meditation` |
| 8 | EnvyInventoryScreen | `envy-inventory` |
| 8 | InspirationReframeScreen | `inspiration-reframe` |
| 8 | RoleModelsScreen | `role-models` |
| 9 | TrustAssessmentScreen | `trust-assessment` |
| 9 | SurrenderPracticeScreen | `surrender-practice` |
| 9 | SignsScreen | `signs-tracking` |
| 10 | JourneyReviewScreen | `journey-review` |
| 10 | FutureLetterScreen | `future-letter` |
| 10 | GraduationScreen | `graduation` |

---

## Agent Assignments

### Agent 1: Core Infrastructure (BLOCKING)
**Document**: `SUPABASE-AGENT-1-INFRASTRUCTURE.md`
**Est. Time**: 3-4 hours
**Dependencies**: None (must complete before Agents 2-4 start)

**Creates**:
- `mobile/src/services/workbook.ts`
- `mobile/src/hooks/useWorkbook.ts`
- `mobile/src/hooks/useAutoSave.ts`
- `mobile/src/stores/workbookStore.ts`
- `mobile/src/types/workbook.ts`
- `mobile/src/components/workbook/SaveIndicator.tsx`

### Agent 2: Phases 1-4 Integration
**Document**: `SUPABASE-AGENT-2-PHASES-1-4.md`
**Est. Time**: 4-5 hours
**Dependencies**: Agent 1 must complete first

**Modifies** (12 screens):
- Phase 1: WheelOfLife, SWOTAnalysis, HabitsAudit, ValuesAssessment
- Phase 2: LifeMission, PurposeStatement, VisionBoard
- Phase 3: SMARTGoals, Timeline, ActionPlan
- Phase 4: FearInventory, LimitingBeliefs, FearFacingPlan

### Agent 3: Phases 5-7 Integration
**Document**: `SUPABASE-AGENT-3-PHASES-5-7.md`
**Est. Time**: 4-5 hours
**Dependencies**: Agent 1 must complete first

**Modifies** (9 screens):
- Phase 5: SelfLoveAffirmations, SelfCareRoutine, InnerChild
- Phase 6: ThreeSixNine, Scripting, WOOP
- Phase 7: GratitudeJournal, GratitudeLetters, GratitudeMeditation

### Agent 4: Phases 8-10 Integration
**Document**: `SUPABASE-AGENT-4-PHASES-8-10.md`
**Est. Time**: 3-4 hours
**Dependencies**: Agent 1 must complete first

**Modifies** (9 screens):
- Phase 8: EnvyInventory, InspirationReframe, RoleModels
- Phase 9: TrustAssessment, SurrenderPractice, Signs
- Phase 10: JourneyReview, FutureLetter, Graduation

---

## Dependency Diagram

```
                    ┌─────────────────────────┐
                    │   ORCHESTRATOR (You)    │
                    │   Coordinates & Tracks  │
                    └───────────┬─────────────┘
                                │
                    ┌───────────▼─────────────┐
                    │  Agent 1: Infrastructure │
                    │  (BLOCKING - First)      │
                    └───────────┬─────────────┘
                                │
            ┌───────────────────┼───────────────────┐
            │                   │                   │
            ▼                   ▼                   ▼
┌───────────────────┐ ┌───────────────────┐ ┌───────────────────┐
│ Agent 2: Ph 1-4   │ │ Agent 3: Ph 5-7   │ │ Agent 4: Ph 8-10  │
│ (12 screens)      │ │ (9 screens)       │ │ (9 screens)       │
│ PARALLEL          │ │ PARALLEL          │ │ PARALLEL          │
└─────────┬─────────┘ └─────────┬─────────┘ └─────────┬─────────┘
          │                     │                     │
          └─────────────────────┼─────────────────────┘
                                │
                    ┌───────────▼─────────────┐
                    │  Playwright Verification │
                    │  SUPABASE-PLAYWRIGHT-    │
                    │  VERIFICATION.md         │
                    └───────────┬─────────────┘
                                │
                    ┌───────────▼─────────────┐
                    │  Update MTU-PROJECT-    │
                    │  STATUS.md              │
                    └─────────────────────────┘
```

---

## Progress Log

> Agents should add timestamped entries here when they start, complete, or encounter blockers.

### Template Entry
```
### [YYYY-MM-DD HH:MM] - Agent X
**Status**: started | completed | blocked | verified
**Summary**: Brief description of work done
**Files Changed**: List of files
**Blockers**: Any issues encountered
**Next**: What happens next
```

---

## [Progress entries will be added here by agents]

---

## Verification Checklist

Before marking workstream complete, orchestrator verifies:

- [ ] Agent 1 infrastructure created and exports work
- [ ] All 30 screens have `useAutoSave` hook integrated
- [ ] All screens load saved data on mount
- [ ] SaveIndicator component displays on all screens
- [ ] TypeScript compiles with 0 errors (`npm run type-check`)
- [ ] Playwright tests pass for sample screens
- [ ] Data persists in Supabase (verified in Studio)

---

## Final Actions (After All Verified)

1. Update status dashboard above to all `verified`
2. Update `MTU-PROJECT-STATUS.md`:
   - Move "Supabase Integration" from "What's NOT Working" to "What's Working"
   - Add changelog entry with date and summary
   - Update "Next Steps" section
3. Create git commit: `feat: integrate all workbook screens with Supabase backend`

---

## How to Use This Document

### If You Are the Orchestrator
1. Spawn Agent 1 first (infrastructure is blocking)
2. Wait for Agent 1 to mark `completed` in their doc
3. Spawn Agents 2, 3, 4 in parallel
4. Wait for all agents to mark `completed`
5. Run Playwright verification (see `SUPABASE-PLAYWRIGHT-VERIFICATION.md`)
6. Update this dashboard as agents report
7. Final: Update `MTU-PROJECT-STATUS.md`

### If You Are a Sub-Agent
1. Read your assigned document (e.g., `SUPABASE-AGENT-2-PHASES-1-4.md`)
2. Update your document's status as you work
3. When complete, add entry to Progress Log above
4. Mark your document status as `completed`
5. Wait for Playwright verification

---

*Document Version: 1.0*
*Created by: Orchestrator Planning Agent*
