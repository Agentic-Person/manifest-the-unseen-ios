# Dashboard Agent 3: Phase Dashboards 2-10

> **Agent Role**: Create 9 Phase Dashboard screens (Phase 2 through Phase 10)
> **Reports To**: `DASHBOARD-ORCHESTRATOR.md`
> **Depends On**: Agent 1 (routes must be registered)
> **Status**: `pending`
> **Playwright Tested**: `not_tested`
> **Est. Time**: 3-4 hours

---

## Task Summary

Create 9 Phase Dashboard screens that display exercises for each phase and navigate to individual screens. Use the `PhaseDashboard` template component from Agent 2.

---

## Status Tracking

| Phase | Dashboard Screen | Status |
|-------|------------------|--------|
| 2 | Phase2Dashboard.tsx | `pending` |
| 3 | Phase3Dashboard.tsx | `pending` |
| 4 | Phase4Dashboard.tsx | `pending` |
| 5 | Phase5Dashboard.tsx | `pending` |
| 6 | Phase6Dashboard.tsx | `pending` |
| 7 | Phase7Dashboard.tsx | `pending` |
| 8 | Phase8Dashboard.tsx | `pending` |
| 9 | Phase9Dashboard.tsx | `pending` |
| 10 | Phase10Dashboard.tsx | `pending` |

---

## Template Pattern

Use this pattern for each dashboard. Reference `Phase1Dashboard.tsx` for existing conventions.

```typescript
import React from 'react';
import { PhaseDashboard } from '../../../components/workbook/PhaseDashboard';
import type { WorkbookStackScreenProps } from '../../../types/navigation';

// Exercise data for this phase
const EXERCISES = [
  {
    id: 'exercise-id',
    name: 'Exercise Name',
    description: 'Brief description',
    icon: '🎯',
    estimatedTime: '20 min',
    isCompleted: false, // TODO: Get from Supabase progress
  },
  // ... more exercises
];

type Props = WorkbookStackScreenProps<'PhaseXDashboard'>;

export const PhaseXDashboard: React.FC<Props> = ({ navigation }) => {
  const handleExercisePress = (exerciseId: string) => {
    // Map exercise ID to screen name
    const screenMap: Record<string, keyof WorkbookStackParamList> = {
      'exercise-id': 'ScreenName',
      // ... more mappings
    };

    const screenName = screenMap[exerciseId];
    if (screenName) {
      navigation.navigate(screenName);
    }
  };

  // TODO: Calculate from Supabase data
  const overallProgress = 0;

  return (
    <PhaseDashboard
      phaseNumber={X}
      phaseName="Phase Name"
      phaseDescription="Description of what this phase covers..."
      exercises={EXERCISES}
      overallProgress={overallProgress}
      onExercisePress={handleExercisePress}
    />
  );
};
```

---

## Phase 2: Values & Vision

**File**: `mobile/src/screens/workbook/Phase2/Phase2Dashboard.tsx`

```typescript
const EXERCISES = [
  {
    id: 'life-mission',
    name: 'Life Mission',
    description: 'Define your core life mission',
    icon: '🎯',
    estimatedTime: '20 min',
    isCompleted: false,
  },
  {
    id: 'purpose-statement',
    name: 'Purpose Statement',
    description: 'Craft your personal purpose statement',
    icon: '📜',
    estimatedTime: '15 min',
    isCompleted: false,
  },
  {
    id: 'vision-board',
    name: 'Vision Board',
    description: 'Create a visual representation of your goals',
    icon: '🖼️',
    estimatedTime: '30 min',
    isCompleted: false,
  },
];

// Screen mappings
const screenMap = {
  'life-mission': 'LifeMission',
  'purpose-statement': 'PurposeStatement',
  'vision-board': 'VisionBoard',
};

// Phase info
phaseNumber: 2,
phaseName: 'Values & Vision',
phaseDescription: 'Clarify your core values and create a compelling vision for your future. This phase helps you define what truly matters to you.',
```

---

## Phase 3: Goal Setting

**File**: `mobile/src/screens/workbook/Phase3/Phase3Dashboard.tsx`

```typescript
const EXERCISES = [
  {
    id: 'smart-goals',
    name: 'SMART Goals',
    description: 'Set specific, measurable, achievable goals',
    icon: '🎯',
    estimatedTime: '25 min',
    isCompleted: false,
  },
  {
    id: 'timeline',
    name: 'Goal Timeline',
    description: 'Map your goals to a timeline',
    icon: '📅',
    estimatedTime: '15 min',
    isCompleted: false,
  },
  {
    id: 'action-plan',
    name: 'Action Plan',
    description: 'Break goals into actionable steps',
    icon: '📋',
    estimatedTime: '20 min',
    isCompleted: false,
  },
];

// Screen mappings
const screenMap = {
  'smart-goals': 'SMARTGoals',
  'timeline': 'Timeline',
  'action-plan': 'ActionPlan',
};

// Phase info
phaseNumber: 3,
phaseName: 'Goal Setting',
phaseDescription: 'Transform your vision into concrete, achievable goals with clear timelines and action plans.',
```

---

## Phase 4: Facing Fears

**File**: `mobile/src/screens/workbook/Phase4/Phase4Dashboard.tsx`

```typescript
const EXERCISES = [
  {
    id: 'fear-inventory',
    name: 'Fear Inventory',
    description: 'Identify and examine your fears',
    icon: '😨',
    estimatedTime: '20 min',
    isCompleted: false,
  },
  {
    id: 'limiting-beliefs',
    name: 'Limiting Beliefs',
    description: 'Challenge and reframe limiting beliefs',
    icon: '🔗',
    estimatedTime: '25 min',
    isCompleted: false,
  },
  {
    id: 'fear-facing-plan',
    name: 'Fear Facing Plan',
    description: 'Create a plan to overcome your fears',
    icon: '💪',
    estimatedTime: '15 min',
    isCompleted: false,
  },
];

// Screen mappings
const screenMap = {
  'fear-inventory': 'FearInventory',
  'limiting-beliefs': 'LimitingBeliefs',
  'fear-facing-plan': 'FearFacingPlan',
};

// Phase info
phaseNumber: 4,
phaseName: 'Facing Fears',
phaseDescription: 'Confront the fears and limiting beliefs that hold you back. Transform them into sources of strength.',
```

---

## Phase 5: Self-Love & Self-Care

**File**: `mobile/src/screens/workbook/Phase5/Phase5Dashboard.tsx`

```typescript
const EXERCISES = [
  {
    id: 'self-love-affirmations',
    name: 'Self-Love Affirmations',
    description: 'Build a collection of empowering affirmations',
    icon: '💖',
    estimatedTime: '15 min',
    isCompleted: false,
  },
  {
    id: 'self-care-routine',
    name: 'Self-Care Routine',
    description: 'Design your daily self-care practice',
    icon: '🛁',
    estimatedTime: '20 min',
    isCompleted: false,
  },
  {
    id: 'inner-child',
    name: 'Inner Child Healing',
    description: 'Connect with and heal your inner child',
    icon: '👶',
    estimatedTime: '25 min',
    isCompleted: false,
  },
];

// Screen mappings
const screenMap = {
  'self-love-affirmations': 'SelfLoveAffirmations',
  'self-care-routine': 'SelfCareRoutine',
  'inner-child': 'InnerChild',
};

// Phase info
phaseNumber: 5,
phaseName: 'Self-Love & Self-Care',
phaseDescription: 'Cultivate deep self-love and establish nurturing self-care practices that support your journey.',
```

---

## Phase 6: Manifestation Techniques

**File**: `mobile/src/screens/workbook/Phase6/Phase6Dashboard.tsx`

```typescript
const EXERCISES = [
  {
    id: '369-method',
    name: '3-6-9 Method',
    description: 'Tesla\'s powerful manifestation technique',
    icon: '✨',
    estimatedTime: '10 min daily',
    isCompleted: false,
  },
  {
    id: 'scripting',
    name: 'Scripting',
    description: 'Write your desired reality into existence',
    icon: '✍️',
    estimatedTime: '20 min',
    isCompleted: false,
  },
  {
    id: 'woop',
    name: 'WOOP Method',
    description: 'Wish, Outcome, Obstacle, Plan framework',
    icon: '🎯',
    estimatedTime: '15 min',
    isCompleted: false,
  },
];

// Screen mappings
const screenMap = {
  '369-method': 'ThreeSixNine',
  'scripting': 'Scripting',
  'woop': 'WOOP',
};

// Phase info
phaseNumber: 6,
phaseName: 'Manifestation Techniques',
phaseDescription: 'Master powerful manifestation methods including the 3-6-9 technique, scripting, and the WOOP framework.',
```

---

## Phase 7: Practicing Gratitude

**File**: `mobile/src/screens/workbook/Phase7/Phase7Dashboard.tsx`

```typescript
const EXERCISES = [
  {
    id: 'gratitude-journal',
    name: 'Gratitude Journal',
    description: 'Daily gratitude practice',
    icon: '📔',
    estimatedTime: '10 min daily',
    isCompleted: false,
  },
  {
    id: 'gratitude-letters',
    name: 'Gratitude Letters',
    description: 'Write heartfelt letters of appreciation',
    icon: '✉️',
    estimatedTime: '20 min',
    isCompleted: false,
  },
  {
    id: 'gratitude-meditation',
    name: 'Gratitude Meditation',
    description: 'Guided gratitude meditation practice',
    icon: '🧘',
    estimatedTime: '15 min',
    isCompleted: false,
  },
];

// Screen mappings
const screenMap = {
  'gratitude-journal': 'GratitudeJournal',
  'gratitude-letters': 'GratitudeLetters',
  'gratitude-meditation': 'GratitudeMeditation',
};

// Phase info
phaseNumber: 7,
phaseName: 'Practicing Gratitude',
phaseDescription: 'Develop a deep gratitude practice that raises your vibration and attracts abundance.',
```

---

## Phase 8: Envy to Inspiration

**File**: `mobile/src/screens/workbook/Phase8/Phase8Dashboard.tsx`

```typescript
const EXERCISES = [
  {
    id: 'envy-inventory',
    name: 'Envy Inventory',
    description: 'Identify what triggers envy',
    icon: '👁️',
    estimatedTime: '15 min',
    isCompleted: false,
  },
  {
    id: 'inspiration-reframe',
    name: 'Inspiration Reframe',
    description: 'Transform envy into inspiration',
    icon: '🔄',
    estimatedTime: '20 min',
    isCompleted: false,
  },
  {
    id: 'role-models',
    name: 'Role Models',
    description: 'Learn from those you admire',
    icon: '⭐',
    estimatedTime: '15 min',
    isCompleted: false,
  },
];

// Screen mappings
const screenMap = {
  'envy-inventory': 'EnvyInventory',
  'inspiration-reframe': 'InspirationReframe',
  'role-models': 'RoleModels',
};

// Phase info
phaseNumber: 8,
phaseName: 'Envy to Inspiration',
phaseDescription: 'Transform feelings of envy into powerful inspiration by learning from those you admire.',
```

---

## Phase 9: Trust & Surrender

**File**: `mobile/src/screens/workbook/Phase9/Phase9Dashboard.tsx`

```typescript
const EXERCISES = [
  {
    id: 'trust-assessment',
    name: 'Trust Assessment',
    description: 'Evaluate your trust in self, others, and universe',
    icon: '🤝',
    estimatedTime: '15 min',
    isCompleted: false,
  },
  {
    id: 'surrender-practice',
    name: 'Surrender Practice',
    description: 'Learn to release control',
    icon: '🕊️',
    estimatedTime: '20 min',
    isCompleted: false,
  },
  {
    id: 'signs-tracking',
    name: 'Signs & Synchronicities',
    description: 'Track meaningful coincidences',
    icon: '🔮',
    estimatedTime: '10 min',
    isCompleted: false,
  },
];

// Screen mappings
const screenMap = {
  'trust-assessment': 'TrustAssessment',
  'surrender-practice': 'SurrenderPractice',
  'signs-tracking': 'Signs',
};

// Phase info
phaseNumber: 9,
phaseName: 'Trust & Surrender',
phaseDescription: 'Develop deep trust in yourself and the universe. Learn the art of surrender and letting go.',
```

---

## Phase 10: Letting Go

**File**: `mobile/src/screens/workbook/Phase10/Phase10Dashboard.tsx`

```typescript
const EXERCISES = [
  {
    id: 'journey-review',
    name: 'Journey Review',
    description: 'Reflect on your transformation',
    icon: '🛤️',
    estimatedTime: '30 min',
    isCompleted: false,
  },
  {
    id: 'future-letter',
    name: 'Letter to Future Self',
    description: 'Write to your future self',
    icon: '💌',
    estimatedTime: '20 min',
    isCompleted: false,
  },
  {
    id: 'graduation',
    name: 'Graduation',
    description: 'Celebrate your completion!',
    icon: '🎓',
    estimatedTime: '15 min',
    isCompleted: false,
  },
];

// Screen mappings
const screenMap = {
  'journey-review': 'JourneyReview',
  'future-letter': 'FutureLetter',
  'graduation': 'Graduation',
};

// Phase info
phaseNumber: 10,
phaseName: 'Letting Go',
phaseDescription: 'Complete your journey. Review your growth, write to your future self, and celebrate your transformation.',
```

---

## Files to Update

### Update index.ts files for each phase folder

For each phase folder (Phase2 through Phase10), update the `index.ts`:

```typescript
// mobile/src/screens/workbook/Phase2/index.ts
export * from './Phase2Dashboard';
export * from './LifeMissionScreen';
export * from './PurposeStatementScreen';
export * from './VisionBoardScreen';
```

Repeat pattern for Phase3 through Phase10.

---

## Verification Checklist

Before marking complete:

- [ ] All 9 dashboard files created
- [ ] Each dashboard has correct exercises
- [ ] Navigation works to all exercise screens
- [ ] Back button returns to dashboard
- [ ] PhaseDashboard component renders correctly
- [ ] TypeScript compiles: `npm run type-check`

---

## Report to Orchestrator

When complete, add to `DASHBOARD-ORCHESTRATOR.md`:

```
### [DATE TIME] - Agent 3 (Phase Dashboards 2-10)
**Status**: completed
**Summary**: Created 9 Phase Dashboard screens
**Files Created**:
- Phase2Dashboard.tsx through Phase10Dashboard.tsx
**Files Modified**:
- 9 index.ts files (added dashboard exports)
**Blockers**: None
**Next**: Ready for Playwright verification
```

Update status above to `completed`.

---

*Agent Document Version: 1.0*
