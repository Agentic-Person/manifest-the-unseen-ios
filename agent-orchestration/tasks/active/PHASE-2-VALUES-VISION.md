# Phase 2 Orchestrator: Values & Vision

**Created**: November 22, 2025
**Status**: Pending (Waiting for Phase 1)
**Owner**: Phase 2 Orchestrator Agent
**Parent**: `WORKBOOK-PHASES-1-3-MASTER.md`
**Timeline**: Week 5-6 (Dec 1 - Dec 13, 2025)

---

## Phase Overview

Phase 2 "Values & Vision" helps users define what matters most and visualize their ideal future. Building on Phase 1's self-evaluation, users create tangible representations of their goals.

## Agents to Spawn

| # | Agent | Screen | Priority | Complexity |
|---|-------|--------|----------|------------|
| 1 | **Vision Board** | Image collage creator | HIGH | High |
| 2 | **Purpose Statement** | AI-guided statement builder | HIGH | Medium |
| 3 | **Life Mission** | Multi-step worksheet | MEDIUM | Medium |

---

## Agent 1: Vision Board

### Requirements
- **Layout**: Canvas for arranging images and text
- **Image Upload**: From device gallery or camera
- **Text Overlays**: Add motivational text/quotes
- **Templates**: Pre-designed layouts to start with
- **Storage**: Images stored in Supabase Storage bucket

### Visual Style
- Dark theme canvas background
- Polaroid-style image frames (optional)
- Handwritten-style fonts for text overlays
- Drag-and-drop positioning

### Data Schema
```typescript
interface VisionBoardData {
  id: string;
  items: VisionBoardItem[];
  template: string | null;
  createdAt: string;
  updatedAt: string;
}

interface VisionBoardItem {
  type: 'image' | 'text';
  content: string;  // URL for images, text content for text
  position: { x: number; y: number };
  size: { width: number; height: number };
  style?: object;  // Font, color, etc.
}
```

### Files to Create
- `mobile/src/screens/workbook/phase2/VisionBoardScreen.tsx`
- `mobile/src/components/workbook/VisionCanvas.tsx`
- `mobile/src/components/workbook/VisionItem.tsx`
- `mobile/src/components/workbook/ImagePicker.tsx`
- `mobile/tests/e2e/vision-board.spec.ts`

### Acceptance Criteria
- [ ] User can add images from gallery
- [ ] User can add text overlays
- [ ] Items can be positioned via drag-and-drop
- [ ] Board saves to Supabase (metadata) + Storage (images)
- [ ] Playwright test passes

---

## Agent 2: Purpose Statement

### Requirements
- **Layout**: Guided questionnaire leading to statement
- **Questions**: 5-7 reflective prompts
- **AI Assistance**: (Future) Claude suggests statement based on answers
- **Output**: Generated purpose statement user can edit
- **Save**: Final statement stored with workbook progress

### Guided Questions (Example)
1. What activities make you lose track of time?
2. What would you do if money wasn't a concern?
3. What problems do you want to solve in the world?
4. What are you naturally good at?
5. What legacy do you want to leave?

### Visual Style
- One question per page (focused)
- Progress indicator
- Inspirational quotes between questions
- Beautiful typography for final statement display

### Data Schema
```typescript
interface PurposeStatementData {
  answers: Record<string, string>;  // questionId -> answer
  generatedStatement: string | null;
  finalStatement: string;
  updatedAt: string;
}
```

### Files to Create
- `mobile/src/screens/workbook/phase2/PurposeStatementScreen.tsx`
- `mobile/src/components/workbook/GuidedQuestion.tsx`
- `mobile/src/components/workbook/StatementDisplay.tsx`
- `mobile/tests/e2e/purpose-statement.spec.ts`

### Acceptance Criteria
- [ ] 5-7 guided questions displayed
- [ ] User can answer each question
- [ ] Purpose statement generated/displayed
- [ ] User can edit final statement
- [ ] Data saves to Supabase
- [ ] Playwright test passes

---

## Agent 3: Life Mission Worksheet

### Requirements
- **Layout**: Multi-section form/worksheet
- **Sections**:
  - Personal Mission (who I am)
  - Professional Mission (what I do)
  - Impact Mission (how I serve others)
  - Legacy Mission (what I leave behind)
- **Prompts**: Guiding questions for each section
- **Output**: Combined life mission document

### Visual Style
- Sections as cards or expandable accordions
- Hand-drawn decorative dividers
- Inspirational headers for each section
- Print/export option (future)

### Data Schema
```typescript
interface LifeMissionData {
  personalMission: string;
  professionalMission: string;
  impactMission: string;
  legacyMission: string;
  combinedStatement: string;
  updatedAt: string;
}
```

### Files to Create
- `mobile/src/screens/workbook/phase2/LifeMissionScreen.tsx`
- `mobile/src/components/workbook/MissionSection.tsx`
- `mobile/tests/e2e/life-mission.spec.ts`

### Acceptance Criteria
- [ ] 4 mission sections displayed
- [ ] Each section has input area
- [ ] Combined statement view available
- [ ] Data saves to Supabase
- [ ] Playwright test passes

---

## Progress Tracker

See: `agent-orchestration/tasks/tracking/PHASE-2-TRACKER.md`

---

## Dependencies

- **Phase 1 Complete**: Values Assessment informs Purpose Statement
- **Supabase Storage**: Required for Vision Board images
- **Image Picker**: `expo-image-picker` for gallery access
- **Gesture Handler**: `react-native-gesture-handler` for drag-and-drop

---

## Execution Order

1. **Vision Board** - Start first (independent, highest complexity)
2. **Purpose Statement** - Can start in parallel
3. **Life Mission** - Start after Purpose Statement (conceptually related)

---

*Phase 2 Orchestrator - Values & Vision Features*
