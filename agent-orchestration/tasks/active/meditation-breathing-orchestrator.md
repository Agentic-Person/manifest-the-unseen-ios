# Meditation & Breathing Orchestrator Agent

**Task ID:** meditation-breathing-mvp
**Created:** 2025-11-28
**Status:** Active
**Priority:** High
**Estimated Effort:** 3.5 weeks

---

## Overview

This orchestrator agent coordinates the implementation of the Meditation & Breathing MVP feature by launching and managing specialized sub-agents in the correct sequence.

## Reference Document

**MVP Plan:** `agent-orchestration/orchestrator/Meditation and Breathing MVP Plan.md`

Read this document thoroughly before executing sub-agents.

---

## Sub-Agent Execution Order

```
Phase 1: Foundation (Audio-Service-Agent)
    ↓
Phase 2: UI (UI-Components-Agent) + Session (Session-Tracking-Agent) [parallel]
    ↓
Phase 3: Testing (Testing-Agent)
    ↓
Phase 4: Integration Validation (Orchestrator)
```

---

## Sub-Agents

### 1. Audio-Service-Agent
**File:** `audio-service-agent.md`
**Priority:** First (foundation)
**Dependencies:** None

**Scope:**
- Database migration (meditation_type enum)
- TypeScript types (`meditation.ts`)
- Meditation service (`meditationService.ts`)
- Audio player hook (`useAudioPlayer.ts`)
- Meditation query hook (`useMeditation.ts`)
- Seed data updates

**Success Criteria:**
- [ ] Migration runs without errors
- [ ] Service functions work in isolation
- [ ] Audio hook plays test audio
- [ ] Query hooks fetch data correctly

---

### 2. UI-Components-Agent
**File:** `ui-components-agent.md`
**Priority:** Second (depends on Audio-Service-Agent)
**Dependencies:** Audio-Service-Agent complete

**Scope:**
- MeditateScreen.tsx rebuild
- MeditationPlayerScreen.tsx
- BreathingExerciseScreen.tsx
- MeditationCard.tsx
- AudioPlayer.tsx
- CategoryTabs.tsx
- NarratorSelector.tsx
- ProgressBar.tsx
- MeditateNavigator.tsx

**Success Criteria:**
- [ ] All screens render without errors
- [ ] Navigation flow works
- [ ] Audio plays in player screen
- [ ] Categories filter correctly

---

### 3. Session-Tracking-Agent
**File:** `session-tracking-agent.md`
**Priority:** Second (runs parallel with UI-Components-Agent)
**Dependencies:** Audio-Service-Agent complete

**Scope:**
- Session stats hook (`useSessionStats.ts`)
- Streak calculation logic
- SessionStats.tsx component
- BreathingCircle.tsx animation
- useBreathingAnimation.ts hook

**Success Criteria:**
- [ ] Stats calculate correctly
- [ ] Streak logic handles edge cases
- [ ] Animation runs at 60fps
- [ ] Stats component displays properly

---

### 4. Testing-Agent
**File:** `testing-agent.md`
**Priority:** Last (depends on all other agents)
**Dependencies:** All other agents complete

**Scope:**
- Unit tests (Jest)
- Component tests (React Native Testing Library)
- E2E tests (Playwright MCP)
- Performance validation
- Polish and error handling

**Success Criteria:**
- [ ] Unit tests pass
- [ ] Component tests pass
- [ ] E2E critical flows pass
- [ ] 60fps animation on iPhone 11+
- [ ] <2s audio load time

---

## Execution Instructions

### Step 1: Launch Audio-Service-Agent
```
Execute: audio-service-agent.md
Wait for completion
Validate: Database migration, service functions, hooks working
```

### Step 2: Launch UI and Session Agents (Parallel)
```
Execute in parallel:
  - ui-components-agent.md
  - session-tracking-agent.md
Wait for both to complete
Validate: Screens render, navigation works, stats display
```

### Step 3: Launch Testing-Agent
```
Execute: testing-agent.md
Wait for completion
Validate: All tests pass
```

### Step 4: Integration Validation
```
Orchestrator performs final checks:
1. Navigate through all screens
2. Play meditation, verify session tracked
3. Check stats update correctly
4. Test breathing animation
5. Verify narrator filtering
6. Test on physical device if available
```

---

## Conflict Resolution

If sub-agents create conflicting changes:

1. **File Conflicts:**
   - Audio-Service-Agent has priority for service files
   - UI-Components-Agent has priority for screen/component files
   - Session-Tracking-Agent has priority for stats/animation files

2. **Import Conflicts:**
   - Ensure index.ts files export all components
   - Use named exports consistently

3. **Type Conflicts:**
   - meditation.ts is source of truth for types
   - All agents should import from types/meditation.ts

---

## Rollback Plan

If critical issues arise:
1. Git stash or revert uncommitted changes
2. Review agent logs for error source
3. Fix issue in specific agent scope
4. Re-run affected agent only
5. Continue from failed step

---

## Communication Protocol

Sub-agents should report:
- **Start:** "Starting [Agent Name] - [Scope Summary]"
- **Progress:** "Completed [Task] - [X of Y tasks done]"
- **Blocked:** "Blocked on [Issue] - Needs [Resolution]"
- **Complete:** "Completed [Agent Name] - All tasks done"

---

## Final Deliverables

When orchestration complete:
- [ ] All 4 sub-agents completed successfully
- [ ] Integration validation passed
- [ ] MVP Plan checklist complete
- [ ] Documentation updated if needed
- [ ] Ready for content upload (audio files)

---

**Next Step:** Execute Audio-Service-Agent first.
