# Progress Fix Agent

**Task ID:** progress-fix
**Created:** 2025-12-02
**Status:** PENDING
**Priority:** CRITICAL (Run First)
**Parent:** WORKBOOK-TESTING-ORCHESTRATOR.md

---

## Overview

Fixes the progress tracking issue where exercises save data but show 0% complete. This is caused by `saveNow()` being called without `completed: true`.

---

## Root Cause Analysis

### The Problem
When a user completes an exercise (e.g., Wheel of Life) and clicks "Save and Continue":
1. Data saves correctly to Supabase
2. But progress shows 0% because `completed` field is `false`

### The Code (WheelOfLifeScreen.tsx line 119-123)
```typescript
const handleSaveAndContinue = async () => {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  saveNow();  // ❌ Does NOT pass completed: true
  navigation.goBack();
};
```

### The Fix Pattern (from PurposeStatementScreen.tsx)
```typescript
const { mutate: saveProgress } = useSaveProgress();

saveProgress({
  phaseNumber: 1,
  worksheetId: WORKSHEET_ID,
  data: formData,
  completed: true,  // ✅ This marks the exercise as complete
});
```

---

## Files to Audit and Fix

### 1. WheelOfLifeScreen.tsx
**Path:** `mobile/src/screens/workbook/Phase1/WheelOfLifeScreen.tsx`
**Issue:** Uses `saveNow()` without completion
**Fix:** Add `completed: true` to save mutation

### 2. SwotAnalysisScreen.tsx
**Path:** `mobile/src/screens/workbook/Phase1/SwotAnalysisScreen.tsx`
**Issue:** Needs audit
**Fix:** Ensure `completed: true` on save

### 3. PersonalValuesScreen.tsx
**Path:** `mobile/src/screens/workbook/Phase1/PersonalValuesScreen.tsx`
**Issue:** Needs audit
**Fix:** Ensure `completed: true` on save

### 4. HabitTrackingScreen.tsx
**Path:** `mobile/src/screens/workbook/Phase1/HabitTrackingScreen.tsx`
**Issue:** Needs audit (user reported 0% after completing)
**Fix:** Ensure `completed: true` on save

---

## Implementation Steps

### Step 1: Read useWorksheetProgress Hook
Understand how the hook handles the `completed` flag.
```
File: mobile/src/hooks/useWorkbook.ts
```

### Step 2: Fix WheelOfLifeScreen.tsx
```typescript
// Find the handleSaveAndContinue function
// Change from:
saveNow();

// To:
saveProgress({
  phaseNumber: 1,
  worksheetId: WORKSHEET_ID,
  data: formData,
  completed: true,
});
```

### Step 3: Audit Other Screens
Check SwotAnalysisScreen, PersonalValuesScreen, HabitTrackingScreen for the same pattern.

### Step 4: Test with Playwright
```
browser_navigate: http://localhost:8081
# Login
browser_click: element="Workbook"
browser_click: element="Phase 1"
browser_snapshot # Note progress %

browser_click: element="Wheel of Life"
# Fill values
browser_click: element="Save and Continue"

browser_snapshot # Verify progress increased
```

---

## Checklist

- [ ] Read useWorksheetProgress hook to understand completion tracking
- [ ] Fix WheelOfLifeScreen.tsx - add `completed: true`
- [ ] Audit SwotAnalysisScreen.tsx - fix if needed
- [ ] Audit PersonalValuesScreen.tsx - fix if needed
- [ ] Audit HabitTrackingScreen.tsx - fix if needed
- [ ] Playwright test: Progress updates after save

---

## Dependencies

**Blocks:** All other workbook agents (must fix tracking before building new screens)
**Blocked by:** None

---

## Related Documents

- **Parent:** WORKBOOK-TESTING-ORCHESTRATOR.md
- **Hook:** `mobile/src/hooks/useWorkbook.ts`

---

**Document Version:** 1.0
**Last Updated:** 2025-12-02
