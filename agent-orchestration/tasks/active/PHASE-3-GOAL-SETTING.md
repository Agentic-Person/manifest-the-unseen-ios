# Phase 3 Orchestrator: Goal Setting

**Created**: November 22, 2025
**Status**: Pending (Waiting for Phase 2)
**Owner**: Phase 3 Orchestrator Agent
**Parent**: `WORKBOOK-PHASES-1-3-MASTER.md`
**Timeline**: Week 6-7 (Dec 8 - Dec 20, 2025)

---

## Phase Overview

Phase 3 "Goal Setting" transforms the clarity from Phases 1-2 into actionable plans. Users create SMART goals, break them into steps, and visualize their timeline.

## Agents to Spawn

| # | Agent | Screen | Priority | Complexity |
|---|-------|--------|----------|------------|
| 1 | **SMART Goals** | Goal creation form | HIGH | Medium |
| 2 | **Action Plan** | Step breakdown builder | HIGH | Medium |
| 3 | **Timeline** | Gantt-style visualization | MEDIUM | High |

---

## Agent 1: SMART Goals

### Requirements
- **SMART Framework**:
  - **S**pecific - What exactly will you accomplish?
  - **M**easurable - How will you know when it's done?
  - **A**chievable - Is this realistic given your resources?
  - **R**elevant - Why does this matter to you?
  - **T**ime-bound - When will this be complete?
- **Categories**: Personal, Professional, Health, Financial, Relationship
- **Multiple Goals**: User can create multiple goals

### Visual Style
- Clean form layout
- Section for each SMART criterion
- Category badges/tags
- Goal cards for overview

### Data Schema
```typescript
interface SMARTGoal {
  id: string;
  title: string;
  category: 'personal' | 'professional' | 'health' | 'financial' | 'relationship';
  specific: string;
  measurable: string;
  achievable: string;
  relevant: string;
  timeBound: string;  // ISO date or description
  deadline: string;   // ISO date
  status: 'not_started' | 'in_progress' | 'completed';
  createdAt: string;
  updatedAt: string;
}

interface GoalsData {
  goals: SMARTGoal[];
}
```

### Files to Create
- `mobile/src/screens/workbook/phase3/SMARTGoalsScreen.tsx`
- `mobile/src/components/workbook/SMARTGoalForm.tsx`
- `mobile/src/components/workbook/GoalCard.tsx`
- `mobile/tests/e2e/smart-goals.spec.ts`

### Acceptance Criteria
- [ ] User can create SMART goals with all 5 criteria
- [ ] Goals can be categorized
- [ ] Goals list view with status
- [ ] Edit/delete goals
- [ ] Data saves to Supabase
- [ ] Playwright test passes

---

## Agent 2: Action Plan

### Requirements
- **Layout**: Goal → Steps breakdown
- **Steps**: Each goal breaks into actionable steps
- **Ordering**: Drag-and-drop to reorder steps
- **Completion**: Mark steps as done
- **Dependencies**: (Optional) Link steps that depend on others

### Visual Style
- Goal at top, steps below as checklist
- Drag handles for reordering
- Progress bar showing completion
- Celebratory animation when all steps done

### Data Schema
```typescript
interface ActionPlan {
  goalId: string;
  steps: ActionStep[];
  updatedAt: string;
}

interface ActionStep {
  id: string;
  title: string;
  description?: string;
  order: number;
  completed: boolean;
  completedAt?: string;
  dependsOn?: string[];  // Other step IDs
}
```

### Files to Create
- `mobile/src/screens/workbook/phase3/ActionPlanScreen.tsx`
- `mobile/src/components/workbook/ActionStep.tsx`
- `mobile/src/components/workbook/StepList.tsx`
- `mobile/tests/e2e/action-plan.spec.ts`

### Acceptance Criteria
- [ ] Select goal to create action plan
- [ ] Add steps to goal
- [ ] Reorder steps via drag-and-drop
- [ ] Mark steps complete
- [ ] Progress indicator
- [ ] Data saves to Supabase
- [ ] Playwright test passes

---

## Agent 3: Timeline Visualization

### Requirements
- **Layout**: Gantt-style chart or timeline view
- **Display**: Goals and their deadlines over time
- **Zoom**: Week, Month, Quarter views
- **Milestones**: Key dates highlighted
- **Today Line**: Visual indicator of current date

### Visual Style
- Horizontal timeline
- Color-coded by goal category
- Interactive (tap goal for details)
- Dark theme compatible

### Data Schema
```typescript
// Uses existing SMARTGoal data
// Timeline is a visualization layer, not new data
```

### Files to Create
- `mobile/src/screens/workbook/phase3/TimelineScreen.tsx`
- `mobile/src/components/workbook/GanttChart.tsx`
- `mobile/src/components/workbook/TimelineBar.tsx`
- `mobile/tests/e2e/timeline.spec.ts`

### Libraries to Consider
- `react-native-chart-kit` - Has basic Gantt support
- Custom SVG with `react-native-svg` - More control
- `react-native-calendars` - Timeline component

### Acceptance Criteria
- [ ] Goals displayed on timeline
- [ ] Deadlines visible
- [ ] Today line indicator
- [ ] Zoom levels (week/month/quarter)
- [ ] Tap goal for details
- [ ] Playwright test passes

---

## Progress Tracker

See: `agent-orchestration/tasks/tracking/PHASE-3-TRACKER.md`

---

## Dependencies

- **Phase 2 Complete**: Vision/Purpose inform goal setting
- **SMART Goals**: Required before Action Plan and Timeline
- **Gesture Handler**: For drag-and-drop in Action Plan
- **SVG Library**: For Timeline visualization

---

## Execution Order

1. **SMART Goals** - Start first (foundation for other features)
2. **Action Plan** - Start after SMART Goals (needs goals to exist)
3. **Timeline** - Can start in parallel with Action Plan

---

*Phase 3 Orchestrator - Goal Setting Features*
