# Dashboard Agent 1: Navigation Infrastructure

> **Agent Role**: Set up navigation infrastructure for Phase Dashboards
> **Reports To**: `DASHBOARD-ORCHESTRATOR.md`
> **Status**: `pending`
> **Playwright Tested**: `not_tested`
> **Est. Time**: 1-2 hours
> **Priority**: First (Agents 2-3 depend on routes existing)

---

## Task Summary

Prepare the navigation infrastructure so Phase2-10 Dashboard screens can be registered. Verify types are correct and update WorkbookNavigator.

---

## Status Tracking

| Task | Status | Notes |
|------|--------|-------|
| Verify `types/navigation.ts` | `pending` | |
| Update `WorkbookNavigator.tsx` | `pending` | |
| Test navigation compiles | `pending` | |

---

## Files to Review/Modify

### 1. `mobile/src/types/navigation.ts`

**Action**: Review and verify all routes are defined

The `WorkbookStackParamList` should already have:
```typescript
export type WorkbookStackParamList = {
  WorkbookHome: undefined;
  Phase1Dashboard: undefined;
  Phase2Dashboard: undefined;
  Phase3Dashboard: undefined;
  Phase4Dashboard: undefined;
  Phase5Dashboard: undefined;
  Phase6Dashboard: undefined;
  Phase7Dashboard: undefined;
  Phase8Dashboard: undefined;
  Phase9Dashboard: undefined;
  Phase10Dashboard: undefined;
  // ... all individual screens
};
```

**Verify**:
- All 10 Phase Dashboards are in the type
- All individual screen routes exist
- Proper params defined where needed

---

### 2. `mobile/src/navigation/WorkbookNavigator.tsx`

**Action**: Register Phase2-10Dashboard screens

**Current State**: WorkbookNavigator likely only has Phase1Dashboard registered.

**Add these screen registrations**:

```typescript
import { Phase2Dashboard } from '../screens/workbook/Phase2/Phase2Dashboard';
import { Phase3Dashboard } from '../screens/workbook/Phase3/Phase3Dashboard';
import { Phase4Dashboard } from '../screens/workbook/Phase4/Phase4Dashboard';
import { Phase5Dashboard } from '../screens/workbook/Phase5/Phase5Dashboard';
import { Phase6Dashboard } from '../screens/workbook/Phase6/Phase6Dashboard';
import { Phase7Dashboard } from '../screens/workbook/Phase7/Phase7Dashboard';
import { Phase8Dashboard } from '../screens/workbook/Phase8/Phase8Dashboard';
import { Phase9Dashboard } from '../screens/workbook/Phase9/Phase9Dashboard';
import { Phase10Dashboard } from '../screens/workbook/Phase10/Phase10Dashboard';

// In the Stack.Navigator, add:
<Stack.Screen
  name="Phase2Dashboard"
  component={Phase2Dashboard}
  options={{ title: 'Values & Vision' }}
/>
<Stack.Screen
  name="Phase3Dashboard"
  component={Phase3Dashboard}
  options={{ title: 'Goal Setting' }}
/>
<Stack.Screen
  name="Phase4Dashboard"
  component={Phase4Dashboard}
  options={{ title: 'Facing Fears' }}
/>
<Stack.Screen
  name="Phase5Dashboard"
  component={Phase5Dashboard}
  options={{ title: 'Self-Love & Self-Care' }}
/>
<Stack.Screen
  name="Phase6Dashboard"
  component={Phase6Dashboard}
  options={{ title: 'Manifestation Techniques' }}
/>
<Stack.Screen
  name="Phase7Dashboard"
  component={Phase7Dashboard}
  options={{ title: 'Practicing Gratitude' }}
/>
<Stack.Screen
  name="Phase8Dashboard"
  component={Phase8Dashboard}
  options={{ title: 'Envy to Inspiration' }}
/>
<Stack.Screen
  name="Phase9Dashboard"
  component={Phase9Dashboard}
  options={{ title: 'Trust & Surrender' }}
/>
<Stack.Screen
  name="Phase10Dashboard"
  component={Phase10Dashboard}
  options={{ title: 'Letting Go' }}
/>
```

**Header Styling** (match existing dark theme):
```typescript
screenOptions={{
  headerStyle: {
    backgroundColor: '#1a1a2e',
  },
  headerTitleStyle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#e8e8e8',
  },
  headerTintColor: '#c9a227', // Gold accent
  headerBackTitleVisible: false,
}}
```

---

## Note: Placeholder Components

Since Agent 3 creates the actual dashboard screens later, you may need to create **placeholder components** so the navigator compiles:

```typescript
// Temporary placeholder (Agent 3 will replace)
// mobile/src/screens/workbook/Phase2/Phase2Dashboard.tsx

import React from 'react';
import { View, Text } from 'react-native';

export const Phase2Dashboard: React.FC = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a1a2e' }}>
    <Text style={{ color: '#e8e8e8' }}>Phase 2 Dashboard - Coming Soon</Text>
  </View>
);
```

Create placeholders for Phase2-10 so the app compiles. Agent 3 will replace them with real implementations.

---

## Verification Checklist

Before marking complete:

- [ ] `types/navigation.ts` has all 10 Phase Dashboards
- [ ] `WorkbookNavigator.tsx` imports all dashboards
- [ ] All 10 screens registered in Stack.Navigator
- [ ] Header styling matches dark theme
- [ ] Placeholder components created (if needed)
- [ ] TypeScript compiles: `npm run type-check`
- [ ] App builds without crash

---

## Report to Orchestrator

When complete, add to `DASHBOARD-ORCHESTRATOR.md`:

```
### [DATE TIME] - Agent 1 (Nav Infrastructure)
**Status**: completed
**Summary**: Registered Phase2-10Dashboard routes in WorkbookNavigator
**Files Modified**:
- types/navigation.ts (verified)
- navigation/WorkbookNavigator.tsx (added 9 screens)
**Files Created**: 9 placeholder dashboard components (for compilation)
**Blockers**: None
**Next**: Agents 2 and 3 can now run in parallel
```

Update status above to `completed`.

---

*Agent Document Version: 1.0*
