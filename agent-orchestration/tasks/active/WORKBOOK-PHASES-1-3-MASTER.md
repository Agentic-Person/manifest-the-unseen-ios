# Master Orchestrator: Workbook Phases 1-3

**Created**: November 22, 2025
**Status**: Active
**Owner**: Master Orchestrator Agent
**Timeline**: Weeks 4-7 (Nov 23 - Dec 20, 2025)

---

## Objective

Coordinate the implementation of Workbook Phases 1-3, managing three phase orchestrators that each spawn specialized agents for individual screens/features.

## Architecture

```
MASTER ORCHESTRATOR (this document)
├── PHASE 1: Self-Evaluation (4 agents)
├── PHASE 2: Values & Vision (3 agents)
└── PHASE 3: Goal Setting (3 agents)
```

## Design Reference

**CRITICAL**: All implementations must follow `docs/APP-DESIGN.md`

Key design requirements:
- Dark theme: `#1a1a2e` primary background
- NO bright whites - soft off-white `#e8e8e8` for text only
- Hand-drawn/sketch visual style
- Spiritual/organic aesthetic (Tibetan/Hindu/Mayan fusion)
- Color palette: Purple `#4a1a6b`, Gold `#c9a227`, Teal `#1a5f5f`

Approved Canva mockups are linked in `docs/APP-DESIGN.md` Section: "Approved Designs"

---

## Phase Orchestrators

### Phase 1: Self-Evaluation
- **Document**: `agent-orchestration/tasks/active/PHASE-1-SELF-EVALUATION.md`
- **Tracker**: `agent-orchestration/tasks/tracking/PHASE-1-TRACKER.md`
- **Agents**: 4 (Wheel of Life, SWOT, Values, Habits)
- **Target**: Week 4-5

### Phase 2: Values & Vision
- **Document**: `agent-orchestration/tasks/active/PHASE-2-VALUES-VISION.md`
- **Tracker**: `agent-orchestration/tasks/tracking/PHASE-2-TRACKER.md`
- **Agents**: 3 (Vision Board, Purpose Statement, Life Mission)
- **Target**: Week 5-6

### Phase 3: Goal Setting
- **Document**: `agent-orchestration/tasks/active/PHASE-3-GOAL-SETTING.md`
- **Tracker**: `agent-orchestration/tasks/tracking/PHASE-3-TRACKER.md`
- **Agents**: 3 (SMART Goals, Action Plan, Timeline)
- **Target**: Week 6-7

---

## Overall Progress

| Phase | Status | Agents | Started | Completed | Verified |
|-------|--------|--------|---------|-----------|----------|
| Phase 1 | Pending | 0/4 | No | No | No |
| Phase 2 | Pending | 0/3 | No | No | No |
| Phase 3 | Pending | 0/3 | No | No | No |

**Total Progress**: 0/10 features complete

---

## Verification Strategy (Playwright MCP)

Each completed screen requires:
1. **Navigation test** - User can reach the screen from app navigation
2. **UI render test** - All components render correctly
3. **Interaction test** - Forms, buttons, sliders work as expected
4. **Data persistence test** - Data saves to Supabase correctly
5. **Screenshot test** - Visual regression baseline captured

Test files location: `mobile/tests/e2e/`

---

## Execution Protocol

### For Phase Orchestrators:
1. Read your phase task document
2. Reference `docs/APP-DESIGN.md` for visual guidelines
3. Spawn agents for each feature in parallel
4. Update tracker document as agents complete work
5. Run Playwright verification tests
6. Report completion to Master Orchestrator

### For Feature Agents:
1. Read the feature requirements from your task
2. Study the approved Canva mockup (linked in APP-DESIGN.md)
3. Create the React Native screen/component
4. Implement data persistence (Supabase)
5. Create Playwright E2E test
6. Update tracker: Started → Completed → Verified
7. Document handoff notes for junior developers

---

## File Structure (Expected Output)

```
mobile/src/screens/workbook/
├── phase1/
│   ├── WheelOfLifeScreen.tsx
│   ├── SWOTAnalysisScreen.tsx
│   ├── ValuesAssessmentScreen.tsx
│   └── HabitsAuditScreen.tsx
├── phase2/
│   ├── VisionBoardScreen.tsx
│   ├── PurposeStatementScreen.tsx
│   └── LifeMissionScreen.tsx
└── phase3/
    ├── SMARTGoalsScreen.tsx
    ├── ActionPlanScreen.tsx
    └── TimelineScreen.tsx

mobile/tests/e2e/
├── wheel-of-life.spec.ts
├── swot-analysis.spec.ts
├── values-assessment.spec.ts
├── habits-audit.spec.ts
├── vision-board.spec.ts
├── purpose-statement.spec.ts
├── life-mission.spec.ts
├── smart-goals.spec.ts
├── action-plan.spec.ts
└── timeline.spec.ts
```

---

## Dependencies

- Supabase tables: `workbook_progress` (stores all phase data as JSONB)
- Navigation: Add screens to Workbook tab navigator
- State: Zustand store for local form state + TanStack Query for server sync
- Forms: React Hook Form + Zod validation schemas

---

## Success Criteria

- [ ] All 10 screens implemented and functional
- [ ] All screens match approved Canva designs
- [ ] All screens persist data to Supabase
- [ ] All 10 Playwright tests passing
- [ ] Tracker documents show 100% verified
- [ ] Junior developer can understand and modify code

---

## Handoff Notes

When this master task completes:
1. Update `MTU-PROJECT-STATUS.md` with completion status
2. Create session log in `agent-orchestration/logs/sessions/`
3. Update Week summary document
4. Mark all tracker documents as complete
5. Commit all changes with descriptive message

---

*Master Orchestrator - Coordinating Workbook Phases 1-3*
