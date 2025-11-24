# Phase 1 Orchestrator: Self-Evaluation

**Created**: November 22, 2025
**Status**: Active
**Owner**: Phase 1 Orchestrator Agent
**Parent**: `WORKBOOK-PHASES-1-3-MASTER.md`
**Timeline**: Week 4-5 (Nov 23 - Dec 6, 2025)

---

## Phase Overview

Phase 1 "Self-Evaluation" is the foundation of the manifestation workbook. Users assess their current life state across multiple dimensions before setting goals and visualizing their future.

## Agents to Spawn

This orchestrator manages 4 feature agents:

| # | Agent | Screen | Priority | Complexity |
|---|-------|--------|----------|------------|
| 1 | **Wheel of Life** | Target/bullseye visualization | HIGH | High |
| 2 | **SWOT Analysis** | Organic flower petal quadrants | HIGH | Medium |
| 3 | **Values Assessment** | Select top 5 values | MEDIUM | Low |
| 4 | **Current Habits** | Morning/afternoon/evening audit | MEDIUM | Medium |

---

## Agent 1: Wheel of Life

### Requirements
- **Layout**: Target/bullseye style (NOT pie chart)
- **Life Areas**: 8 categories (Career, Health, Relationships, Finance, Personal Growth, Family, Recreation, Spirituality)
- **Rating**: Each area rated 1-10 via slider or tap
- **Visualization**: Concentric rings (1 = center, 10 = outer edge)
- **Connected Shape**: User's ratings connected by a polygon line showing "balance"
- **Goal**: Perfect circle = balanced life at 10/10

### Design Reference
- `docs/APP-DESIGN.md` → "Wheel of Life Screen" section
- Canva mockup: See "Approved Designs" section

### Visual Style
- Dark background `#1a1a2e`
- Hand-drawn style icons for each life area
- Muted gold `#c9a227` for the connected polygon
- Subtle gradient rings from center to edge

### Data Schema
```typescript
interface WheelOfLifeData {
  career: number;      // 1-10
  health: number;
  relationships: number;
  finance: number;
  personalGrowth: number;
  family: number;
  recreation: number;
  spirituality: number;
  updatedAt: string;   // ISO timestamp
}
```

### Files to Create
- `mobile/src/screens/workbook/phase1/WheelOfLifeScreen.tsx`
- `mobile/src/components/workbook/WheelChart.tsx` (custom SVG component)
- `mobile/src/components/workbook/LifeAreaSlider.tsx`
- `mobile/tests/e2e/wheel-of-life.spec.ts`

### Acceptance Criteria
- [ ] 8 life areas displayed with icons
- [ ] Each area has slider (1-10) that updates chart in real-time
- [ ] Connected polygon shows user's current "shape"
- [ ] Data saves to Supabase `workbook_progress` table
- [ ] Matches approved Canva design
- [ ] Playwright test passes

---

## Agent 2: SWOT Analysis

### Requirements
- **Layout**: Organic flower petal quadrants (NOT corporate grid!)
- **Quadrants**: Strengths, Weaknesses, Opportunities, Threats
- **Input**: Add tags/items to each quadrant
- **Central Element**: Mandala or lotus connecting all four
- **AI Insights**: (Future) Show connections between quadrants

### Design Reference
- `docs/APP-DESIGN.md` → "SWOT Analysis Screen" section
- Canva mockup: See "Approved Designs" section

### Quadrant Colors
```
Strengths:     #2d5a4a (deep forest green)
Weaknesses:    #8b6914 (deep amber)
Opportunities: #1a5f5f (deep teal)
Threats:       #6b2d3d (deep burgundy)
```

### Visual Style
- Quadrants shaped like flower petals, NOT rectangles
- Hand-drawn borders with organic curves
- Tags styled like natural elements (leaves, stones, waves, fire)
- Central mandala connecting all four quadrants

### Data Schema
```typescript
interface SWOTData {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  updatedAt: string;
}
```

### Files to Create
- `mobile/src/screens/workbook/phase1/SWOTAnalysisScreen.tsx`
- `mobile/src/components/workbook/SWOTQuadrant.tsx`
- `mobile/src/components/workbook/SWOTTag.tsx`
- `mobile/tests/e2e/swot-analysis.spec.ts`

### Acceptance Criteria
- [ ] 4 quadrants displayed in flower petal layout
- [ ] User can add/remove tags to each quadrant
- [ ] Tags have organic styling (not corporate chips)
- [ ] Data saves to Supabase
- [ ] Matches approved Canva design
- [ ] Playwright test passes

---

## Agent 3: Values Assessment

### Requirements
- **Layout**: Grid or list of 20+ core values
- **Selection**: User selects their top 5 values
- **Ranking**: Optional drag-and-drop to rank selected values
- **Categories**: May group values by theme (Personal, Relational, Professional)

### Values List (Example)
```
Integrity, Authenticity, Growth, Freedom, Love,
Family, Health, Wealth, Creativity, Adventure,
Security, Peace, Knowledge, Impact, Joy,
Connection, Excellence, Balance, Spirituality, Service
```

### Visual Style
- Cards or chips for each value
- Selected values highlighted with accent color
- Hand-drawn decorative elements
- Minimal, focused UI

### Data Schema
```typescript
interface ValuesData {
  selectedValues: string[];  // Top 5, ordered by priority
  allValuesViewed: boolean;
  updatedAt: string;
}
```

### Files to Create
- `mobile/src/screens/workbook/phase1/ValuesAssessmentScreen.tsx`
- `mobile/src/components/workbook/ValueCard.tsx`
- `mobile/tests/e2e/values-assessment.spec.ts`

### Acceptance Criteria
- [ ] 20+ values displayed
- [ ] User can select exactly 5 values
- [ ] Selected values visually distinct
- [ ] Data saves to Supabase
- [ ] Playwright test passes

---

## Agent 4: Current Habits Audit

### Requirements
- **Layout**: Three sections (Morning, Afternoon, Evening)
- **Input**: List habits for each time of day
- **Categories**: Mark habits as Positive/Negative/Neutral
- **Summary**: Show habit balance (positive vs negative)

### Visual Style
- Timeline or sectioned list
- Color coding for habit types
- Icons for common habits
- Progress indicator

### Data Schema
```typescript
interface HabitsData {
  morning: HabitEntry[];
  afternoon: HabitEntry[];
  evening: HabitEntry[];
  updatedAt: string;
}

interface HabitEntry {
  habit: string;
  category: 'positive' | 'negative' | 'neutral';
}
```

### Files to Create
- `mobile/src/screens/workbook/phase1/HabitsAuditScreen.tsx`
- `mobile/src/components/workbook/HabitEntry.tsx`
- `mobile/src/components/workbook/HabitSection.tsx`
- `mobile/tests/e2e/habits-audit.spec.ts`

### Acceptance Criteria
- [ ] Three time-of-day sections
- [ ] User can add habits with category
- [ ] Visual summary of habit balance
- [ ] Data saves to Supabase
- [ ] Playwright test passes

---

## Progress Tracker

See: `agent-orchestration/tasks/tracking/PHASE-1-TRACKER.md`

---

## Execution Order

1. **Wheel of Life** - Start first (highest priority, approved mockup exists)
2. **SWOT Analysis** - Start in parallel (approved mockup exists)
3. **Values Assessment** - Start after Wheel of Life completes
4. **Current Habits** - Start after SWOT completes

Agents 1 & 2 can run in parallel.
Agents 3 & 4 can run in parallel after 1 & 2 complete.

---

## Shared Components

Create these shared components first (any agent can create):
- `mobile/src/components/workbook/WorkbookHeader.tsx` - Consistent header
- `mobile/src/components/workbook/SaveButton.tsx` - Consistent save UX
- `mobile/src/hooks/useWorkbookProgress.ts` - Supabase CRUD hook

---

## Report to Master

When all 4 features are verified:
1. Update `PHASE-1-TRACKER.md` with final status
2. Notify Master Orchestrator
3. Update `MTU-PROJECT-STATUS.md`
4. Phase 1 complete → Master can start Phase 2

---

*Phase 1 Orchestrator - Self-Evaluation Features*
