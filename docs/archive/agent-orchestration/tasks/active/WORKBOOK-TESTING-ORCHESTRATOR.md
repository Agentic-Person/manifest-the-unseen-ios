# Workbook Testing Orchestrator

**Task ID:** workbook-testing-orchestrator
**Created:** 2025-12-02
**Status:** IN PROGRESS
**Priority:** CRITICAL
**Parent:** None (Top-level orchestrator)

---

## Overview

Coordinates the fix for the workbook feature which is 70% dysfunctional. Discovered during manual testing on 2025-12-02.

---

## Problems Discovered

### Problem 1: Progress Shows 0% When Exercises Are Saved
**Root Cause:** Exercises call `saveNow()` without passing `completed: true` flag.

**Evidence - WheelOfLifeScreen.tsx (line 119-123):**
```typescript
const handleSaveAndContinue = async () => {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  saveNow();  // Does NOT pass completed: true
  navigation.goBack();
};
```

### Problem 2: 7 of 11 Phase 1 Exercises Don't Exist
**Root Cause:** Screens were never built. Navigation just logs to console.

**Evidence - Phase1Dashboard.tsx default case:**
```typescript
default:
  // TODO: Navigate to other exercise screens as they are implemented
  console.log('Navigate to exercise:', exerciseId);
```

**Missing Screens:**
- Feel Wheel
- ABC Model
- Strengths & Weaknesses
- Comfort Zone
- Know Yourself
- Abilities Rating
- Thought Awareness

---

## Agent Coordination

### Execution Order

```
┌─────────────────────────────────┐
│  WORKBOOK-TESTING-ORCHESTRATOR  │
└─────────────┬───────────────────┘
              │
              ▼
┌─────────────────────────────────┐
│     PROGRESS-FIX-AGENT          │  ← Run FIRST (Critical)
│     Fix completion tracking     │
└─────────────┬───────────────────┘
              │
    ┌─────────┴─────────┐
    │                   │
    ▼                   ▼
┌─────────────┐   ┌───────────────────┐
│ PHASE1-     │   │ NAVIGATION-       │  ← Run in PARALLEL
│ BUILDER     │   │ WIRING-AGENT      │
│ (7 screens) │   │ (routes + nav)    │
└─────────────┘   └───────────────────┘
              │
              ▼
┌─────────────────────────────────┐
│     PLAYWRIGHT TESTING          │  ← Run LAST (Validation)
│     E2E verification            │
└─────────────────────────────────┘
```

### Agent 1: PROGRESS-FIX-AGENT.md
**Priority:** CRITICAL (Run First)
**Status:** Pending
**Blocks:** All other agents (must fix tracking before testing)

### Agent 2: PHASE1-BUILDER-AGENT.md
**Priority:** HIGH
**Status:** Pending
**Dependencies:** Agent 1 complete
**Parallel:** Can run with Agent 3

### Agent 3: NAVIGATION-WIRING-AGENT.md
**Priority:** HIGH
**Status:** Pending
**Dependencies:** Agent 1 complete
**Parallel:** Can run with Agent 2

### Agent 4: Playwright Testing
**Priority:** FINAL
**Status:** Pending
**Dependencies:** Agents 2 and 3 complete

---

## Files Overview

### Files to Modify (Existing)
| File | Agent | Changes |
|------|-------|---------|
| `Phase1/WheelOfLifeScreen.tsx` | Agent 1 | Add `completed: true` |
| `Phase1/SwotAnalysisScreen.tsx` | Agent 1 | Audit completion flag |
| `Phase1/PersonalValuesScreen.tsx` | Agent 1 | Audit completion flag |
| `Phase1/HabitTrackingScreen.tsx` | Agent 1 | Audit completion flag |
| `Phase1/Phase1Dashboard.tsx` | Agent 3 | Add 7 navigation cases |
| `navigation/WorkbookNavigator.tsx` | Agent 3 | Add 7 Stack.Screen |
| `types/navigation.ts` | Agent 3 | Add 7 route types |

### Files to Create (New)
| File | Agent | Purpose |
|------|-------|---------|
| `Phase1/FeelWheelScreen.tsx` | Agent 2 | Emotion wheel |
| `Phase1/AbcModelScreen.tsx` | Agent 2 | ABC cognitive model |
| `Phase1/StrengthsWeaknessesScreen.tsx` | Agent 2 | S&W analysis |
| `Phase1/ComfortZoneScreen.tsx` | Agent 2 | Zone mapping |
| `Phase1/KnowYourselfScreen.tsx` | Agent 2 | Self-reflection |
| `Phase1/AbilitiesRatingScreen.tsx` | Agent 2 | Skills assessment |
| `Phase1/ThoughtAwarenessScreen.tsx` | Agent 2 | Cognitive patterns |

---

## Testing Requirements

### Pre-Fix Baseline
- Wheel of Life: Saves but shows 0% complete
- Feel Wheel: Click does nothing (console.log only)
- Habit Tracking: Saves but shows 0% complete

### Post-Fix Expected
- All 11 Phase 1 exercises clickable
- All exercises navigate to dedicated screens
- Progress updates correctly when saved
- Data persists across navigation

---

## Success Criteria

- [ ] Agent 1 complete: Progress tracking fixed in 4 existing screens
- [ ] Agent 2 complete: 7 new screens created
- [ ] Agent 3 complete: Navigation wired for all 11 exercises
- [ ] Playwright tests pass for all Phase 1 exercises
- [ ] Manual verification by user confirms functionality

---

## Test User Credentials

**Email:** `devtest@manifest.app`
**Password:** `TestPassword123!`
**Note:** Must use `EXPO_PUBLIC_DEV_SKIP_AUTH=false` for real persistence

---

## Related Documents

- **Plan File:** `~/.claude/plans/squishy-puzzling-goose.md`
- **Project Status:** `docs/project_status.md`
- **PRD:** `docs/manifest-the-unseen-prd.md`

---

**Document Version:** 1.0
**Last Updated:** 2025-12-02
