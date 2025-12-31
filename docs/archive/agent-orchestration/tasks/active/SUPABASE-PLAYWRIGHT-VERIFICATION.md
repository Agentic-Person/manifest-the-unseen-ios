# Supabase Integration - Playwright Verification

> **Role**: Verify all Supabase integrations work correctly via E2E testing
> **Reports To**: `SUPABASE-ORCHESTRATOR.md`
> **Depends On**: All Agents (1-4) must complete first
> **Status**: `pending`

---

## Overview

This document outlines the Playwright MCP server verification tests for the Supabase backend integration. Run these tests after all agents complete their work.

---

## Prerequisites

Before running verification:
- [ ] All 4 agents marked `completed` in orchestrator
- [ ] TypeScript compiles: `cd mobile && npm run type-check`
- [ ] Supabase local running: `npx supabase status`
- [ ] Test user exists in Supabase (or create via auth flow)
- [ ] Expo web running: `cd mobile && npm run web`

---

## Test Categories

### Category 1: Infrastructure Tests

| Test ID | Description | Status |
|---------|-------------|--------|
| INFRA-01 | `useWorkbookProgress` hook returns data | `pending` |
| INFRA-02 | `useAutoSave` triggers after input | `pending` |
| INFRA-03 | `SaveIndicator` shows correct states | `pending` |
| INFRA-04 | Error state displays on network failure | `pending` |

### Category 2: Phase 1-4 Screen Tests

| Test ID | Screen | Test Description | Status |
|---------|--------|------------------|--------|
| PH1-01 | WheelOfLife | Slider values save and reload | `pending` |
| PH1-02 | SWOTAnalysis | Tags persist after refresh | `pending` |
| PH1-03 | HabitsAudit | Habit list saves correctly | `pending` |
| PH1-04 | ValuesAssessment | Ranked values persist | `pending` |
| PH2-01 | LifeMission | Text saves on debounce | `pending` |
| PH2-02 | VisionBoard | Image positions save | `pending` |
| PH3-01 | SMARTGoals | Goal data structure saves | `pending` |
| PH3-02 | ActionPlan | Task status updates save | `pending` |
| PH4-01 | FearInventory | Fear intensity saves | `pending` |
| PH4-02 | LimitingBeliefs | Reframe saves correctly | `pending` |

### Category 3: Phase 5-7 Screen Tests

| Test ID | Screen | Test Description | Status |
|---------|--------|------------------|--------|
| PH5-01 | SelfLoveAffirmations | Affirmations list saves | `pending` |
| PH5-02 | SelfCareRoutine | Routine schedule saves | `pending` |
| PH6-01 | ThreeSixNine | Daily tracking saves | `pending` |
| PH6-02 | WOOP | 4-part framework saves | `pending` |
| PH7-01 | GratitudeJournal | Daily entry saves | `pending` |
| PH7-02 | GratitudeJournal | Streak calculates correctly | `pending` |

### Category 4: Phase 8-10 Screen Tests

| Test ID | Screen | Test Description | Status |
|---------|--------|------------------|--------|
| PH8-01 | EnvyInventory | Envy triggers save | `pending` |
| PH8-02 | RoleModels | Role model data saves | `pending` |
| PH9-01 | TrustAssessment | Trust scores save | `pending` |
| PH9-02 | Signs | Synchronicity log saves | `pending` |
| PH10-01 | JourneyReview | Shows data from all phases | `pending` |
| PH10-02 | FutureLetter | Letter seals correctly | `pending` |
| PH10-03 | Graduation | Completion triggers | `pending` |

---

## Test Scripts for Playwright MCP

### Test: INFRA-01 - Hook Returns Data

```javascript
// Using Playwright MCP browser automation
// Navigate to a workbook screen (e.g., Wheel of Life)

await mcp_playwright_browser_navigate({ url: 'http://localhost:8081/workbook/phase1/wheel-of-life' });
await mcp_playwright_browser_wait_for({ text: 'Wheel of Life' });

// Check that data loads (SaveIndicator should show "Saved at" if data exists)
const snapshot = await mcp_playwright_browser_snapshot();
// Verify: No loading spinner, data displayed

// Result: PASS/FAIL
```

### Test: INFRA-02 - Auto-Save Triggers

```javascript
// Navigate to Wheel of Life screen
await mcp_playwright_browser_navigate({ url: 'http://localhost:8081/workbook/phase1/wheel-of-life' });
await mcp_playwright_browser_wait_for({ text: 'Wheel of Life' });

// Move a slider
await mcp_playwright_browser_click({ element: 'Career slider', ref: '[slider-ref]' });

// Wait for debounce (1.5s) + save
await mcp_playwright_browser_wait_for({ time: 2 });

// Check SaveIndicator shows "Saved at HH:MM"
const snapshot = await mcp_playwright_browser_snapshot();
// Verify: "Saved at" text appears

// Result: PASS/FAIL
```

### Test: PH1-01 - Wheel of Life Persistence

```javascript
// 1. Navigate and set values
await mcp_playwright_browser_navigate({ url: 'http://localhost:8081/workbook/phase1/wheel-of-life' });
await mcp_playwright_browser_wait_for({ text: 'Wheel of Life' });

// Move Career slider to 8
// (Slider interaction via drag or click at position)

// Wait for save
await mcp_playwright_browser_wait_for({ time: 2 });
await mcp_playwright_browser_wait_for({ text: 'Saved at' });

// 2. Refresh page
await mcp_playwright_browser_navigate({ url: 'http://localhost:8081/workbook/phase1/wheel-of-life' });
await mcp_playwright_browser_wait_for({ text: 'Wheel of Life' });

// 3. Verify slider value is still 8
const snapshot = await mcp_playwright_browser_snapshot();
// Check Career slider position/value

// Result: PASS/FAIL
```

### Test: PH7-02 - Gratitude Streak

```javascript
// 1. Add gratitude entry for today
await mcp_playwright_browser_navigate({ url: 'http://localhost:8081/workbook/phase7/gratitude-journal' });

// Add 3 gratitude items
await mcp_playwright_browser_type({ element: 'Gratitude item 1', ref: '[input-ref]', text: 'Family' });
// ... add more items

// Save
await mcp_playwright_browser_wait_for({ time: 2 });

// 2. Check streak counter shows "1 day streak"
const snapshot = await mcp_playwright_browser_snapshot();
// Verify streak display

// Result: PASS/FAIL
```

### Test: PH10-01 - Journey Review Aggregation

```javascript
// Navigate to Journey Review
await mcp_playwright_browser_navigate({ url: 'http://localhost:8081/workbook/phase10/journey-review' });
await mcp_playwright_browser_wait_for({ text: 'Journey Review' });

// Verify it shows data from previous phases
const snapshot = await mcp_playwright_browser_snapshot();
// Check for: "Phase 1: X completed", "Phase 2: Y completed", etc.

// Result: PASS/FAIL
```

---

## Verification Procedure

### Step 1: Start Test Environment
```bash
# Terminal 1: Start Supabase
npx supabase start

# Terminal 2: Start Expo Web
cd mobile
npm run web
```

### Step 2: Run Tests
Use Playwright MCP server to execute tests:
1. Navigate to each screen
2. Perform input actions
3. Verify save indicator
4. Refresh and verify persistence
5. Mark test status in table above

### Step 3: Database Verification
Open Supabase Studio (http://localhost:54323):
1. Go to Table Editor → workbook_progress
2. Verify rows exist for tested worksheets
3. Check JSONB data column has correct structure
4. Verify timestamps update on save

### Step 4: Report Results
Update orchestrator with:
```
### [DATE TIME] - Playwright Verification
**Status**: completed
**Tests Passed**: X/Y
**Tests Failed**: [list any failures]
**Notes**: [any observations]
```

---

## Common Failure Scenarios

| Failure | Likely Cause | Fix |
|---------|--------------|-----|
| Data not saving | Auth not working | Check user session in authStore |
| SaveIndicator stuck on "Saving" | Network/Supabase error | Check console for errors |
| Data not loading on refresh | Query key mismatch | Check useWorkbookProgress params |
| TypeScript errors | Missing types | Run `npm run type-check` |
| RLS blocking saves | Policy issue | Check Supabase RLS policies |

---

## Final Checklist

Before marking Supabase integration verified:

- [ ] All infrastructure tests pass (INFRA-01 to INFRA-04)
- [ ] At least 1 screen per phase tested
- [ ] Data persists after app restart
- [ ] SaveIndicator works on all screens
- [ ] No console errors during saves
- [ ] Supabase Studio shows correct data

---

## Update Orchestrator

After all tests pass, update `SUPABASE-ORCHESTRATOR.md`:
1. Set all agents to `verified` status
2. Add Playwright verification entry to Progress Log
3. Proceed to final MTU-PROJECT-STATUS.md update

---

*Verification Document Version: 1.0*
