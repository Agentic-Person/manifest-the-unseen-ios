# Navigation Wiring Agent

**Task ID:** navigation-wiring
**Created:** 2025-12-02
**Status:** PENDING
**Priority:** HIGH
**Parent:** WORKBOOK-TESTING-ORCHESTRATOR.md

---

## Overview

Wires up navigation for the 7 missing Phase 1 screens. Currently, clicking these exercises in Phase1Dashboard just logs to console.

---

## Current State

### Phase1Dashboard.tsx default case (the problem):
```typescript
default:
  // TODO: Navigate to other exercise screens as they are implemented
  console.log('Navigate to exercise:', exerciseId);
```

### Expected behavior:
Each exercise should navigate to its dedicated screen.

---

## Files to Modify

### 1. Phase1Dashboard.tsx
**Path:** `mobile/src/screens/workbook/Phase1/Phase1Dashboard.tsx`
**Change:** Add navigation cases for 7 new screens

```typescript
// Replace default case with specific navigation
case 'feel-wheel':
  navigation.navigate('FeelWheel');
  break;
case 'abc-model':
  navigation.navigate('AbcModel');
  break;
case 'strengths-weaknesses':
  navigation.navigate('StrengthsWeaknesses');
  break;
case 'comfort-zone':
  navigation.navigate('ComfortZone');
  break;
case 'know-yourself':
  navigation.navigate('KnowYourself');
  break;
case 'abilities-rating':
  navigation.navigate('AbilitiesRating');
  break;
case 'thought-awareness':
  navigation.navigate('ThoughtAwareness');
  break;
```

### 2. WorkbookNavigator.tsx
**Path:** `mobile/src/navigation/WorkbookNavigator.tsx`
**Change:** Add 7 Stack.Screen entries

```typescript
// Add these screens
<Stack.Screen
  name="FeelWheel"
  component={FeelWheelScreen}
  options={{ title: 'Feel Wheel' }}
/>
<Stack.Screen
  name="AbcModel"
  component={AbcModelScreen}
  options={{ title: 'ABC Model' }}
/>
<Stack.Screen
  name="StrengthsWeaknesses"
  component={StrengthsWeaknessesScreen}
  options={{ title: 'Strengths & Weaknesses' }}
/>
<Stack.Screen
  name="ComfortZone"
  component={ComfortZoneScreen}
  options={{ title: 'Comfort Zone' }}
/>
<Stack.Screen
  name="KnowYourself"
  component={KnowYourselfScreen}
  options={{ title: 'Know Yourself' }}
/>
<Stack.Screen
  name="AbilitiesRating"
  component={AbilitiesRatingScreen}
  options={{ title: 'Abilities Rating' }}
/>
<Stack.Screen
  name="ThoughtAwareness"
  component={ThoughtAwarenessScreen}
  options={{ title: 'Thought Awareness' }}
/>
```

### 3. types/navigation.ts
**Path:** `mobile/src/types/navigation.ts`
**Change:** Add route types for type-safe navigation

```typescript
// In WorkbookStackParamList
export type WorkbookStackParamList = {
  // ... existing routes
  FeelWheel: undefined;
  AbcModel: undefined;
  StrengthsWeaknesses: undefined;
  ComfortZone: undefined;
  KnowYourself: undefined;
  AbilitiesRating: undefined;
  ThoughtAwareness: undefined;
};
```

---

## Implementation Steps

### Step 1: Update Navigation Types
Add all 7 new route types to `WorkbookStackParamList` in `types/navigation.ts`.

### Step 2: Add Screen Imports
Import all 7 new screens in `WorkbookNavigator.tsx`.

### Step 3: Add Stack.Screen Entries
Add 7 `<Stack.Screen>` components for each new screen.

### Step 4: Update Phase1Dashboard Navigation
Replace the default console.log with actual navigation cases.

### Step 5: Verify TypeScript
Run `npx tsc --noEmit` to ensure no type errors.

---

## Route Mapping

| Exercise ID | Route Name | Screen Component |
|-------------|------------|------------------|
| `feel-wheel` | FeelWheel | FeelWheelScreen |
| `abc-model` | AbcModel | AbcModelScreen |
| `strengths-weaknesses` | StrengthsWeaknesses | StrengthsWeaknessesScreen |
| `comfort-zone` | ComfortZone | ComfortZoneScreen |
| `know-yourself` | KnowYourself | KnowYourselfScreen |
| `abilities-rating` | AbilitiesRating | AbilitiesRatingScreen |
| `thought-awareness` | ThoughtAwareness | ThoughtAwarenessScreen |

---

## Checklist

- [ ] Update `types/navigation.ts` with 7 new route types
- [ ] Add screen imports to `WorkbookNavigator.tsx`
- [ ] Add 7 `<Stack.Screen>` entries to navigator
- [ ] Update `Phase1Dashboard.tsx` navigation switch statement
- [ ] Run TypeScript check (`npx tsc --noEmit`)
- [ ] Test each exercise navigates correctly

---

## Dependencies

**Depends on:**
- PROGRESS-FIX-AGENT.md (completion tracking must work)
- PHASE1-BUILDER-AGENT.md (screens must exist to navigate to)

**Parallel with:** PHASE1-BUILDER-AGENT.md (can wire routes while screens are built)
**Blocks:** Playwright testing

---

## Playwright Verification

```
browser_navigate: http://localhost:8081
# Login
browser_click: element="Workbook"
browser_click: element="Phase 1"

# Test each exercise navigates
browser_click: element="Feel Wheel"
browser_snapshot
# Verify: Screen loads, not console.log
browser_navigate_back

browser_click: element="ABC Model"
browser_snapshot
# Verify: Screen loads
browser_navigate_back

# ... repeat for all 7 exercises
```

---

## Related Documents

- **Parent:** WORKBOOK-TESTING-ORCHESTRATOR.md
- **Navigation:** `mobile/src/navigation/WorkbookNavigator.tsx`
- **Types:** `mobile/src/types/navigation.ts`

---

**Document Version:** 1.0
**Last Updated:** 2025-12-02
