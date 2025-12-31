# UI-Components-Agent

**Task ID:** meditation-ui-components
**Parent:** meditation-breathing-orchestrator.md
**Priority:** Second
**Dependencies:** Audio-Service-Agent must be complete
**Status:** Pending

---

## Overview

This agent builds all UI screens and components for the meditation feature, including the main browse screen, audio player, and breathing exercise screen.

---

## Prerequisites

Before starting, verify:
- [ ] Audio-Service-Agent completed successfully
- [ ] Types in `types/meditation.ts` available
- [ ] Service in `services/meditationService.ts` working
- [ ] Hooks in `hooks/useMeditation.ts` and `hooks/useAudioPlayer.ts` working

---

## Tasks

### 1. Category Tabs Component

**File:** `mobile/src/components/meditation/CategoryTabs.tsx`

```typescript
interface CategoryTabsProps {
  activeTab: MeditationType;
  onTabChange: (tab: MeditationType) => void;
}
```

Features:
- Three tabs: "Meditations" | "Breathing" | "Music"
- Animated underline indicator
- Uses theme colors from `theme/colors.ts`
- Horizontal layout, evenly spaced

---

### 2. Narrator Selector Component

**File:** `mobile/src/components/meditation/NarratorSelector.tsx`

```typescript
interface NarratorSelectorProps {
  value: NarratorGender;
  onChange: (gender: NarratorGender) => void;
}
```

Features:
- Two toggle buttons: "Male" | "Female"
- Selected state with gold accent color
- Integrates with settingsStore.preferredNarrator
- Compact horizontal layout

---

### 3. Meditation Card Component

**File:** `mobile/src/components/meditation/MeditationCard.tsx`

```typescript
interface MeditationCardProps {
  meditation: Meditation;
  onPress: () => void;
}
```

Features:
- Card with subtle background
- Icon based on type (guided=person, breathing=wind, music=musical-note)
- Title (1-2 lines, truncate)
- Duration badge (e.g., "12 min")
- Narrator indicator for guided type only
- Tier lock icon if tier_required > user's tier
- Pressable with opacity feedback

**Layout:**
```
+------------------------+
|  [Icon]                |
|  Title                 |
|  12 min  [Female]      |
+------------------------+
```

---

### 4. Progress Bar Component

**File:** `mobile/src/components/meditation/ProgressBar.tsx`

```typescript
interface ProgressBarProps {
  progress: number;       // 0-1
  duration: number;       // total ms
  position: number;       // current ms
  onSeek?: (positionMs: number) => void;
}
```

Features:
- Horizontal slider bar
- Time display: current / total (format: "3:45 / 12:00")
- Draggable if onSeek provided
- Gold accent for filled portion
- Uses react-native Slider or custom implementation

---

### 5. Audio Player Component

**File:** `mobile/src/components/meditation/AudioPlayer.tsx`

```typescript
interface AudioPlayerProps {
  meditation: Meditation;
  onComplete?: () => void;
  onClose?: () => void;
}
```

Features:
- Large centered play/pause button (60x60)
- Skip back 15s / Skip forward 15s buttons
- ProgressBar component
- Uses useAudioPlayer hook
- Loading state while audio loads
- Handles errors gracefully

**Layout:**
```
        Progress Bar
   [Time current / total]

    [-15s] [Play/Pause] [+15s]
```

---

### 6. Meditation Player Screen

**File:** `mobile/src/screens/meditation/MeditationPlayerScreen.tsx`

**Route Params:**
```typescript
type MeditationPlayerParams = {
  meditationId: string;
};
```

Features:
- Full-screen player
- Background gradient (deep purple/gold from theme)
- Meditation title at top
- Description (optional, collapsible)
- AudioPlayer component centered
- Back button in header
- Session tracking: create session on mount, complete on finish
- Navigation: `navigation.goBack()` on close

---

### 7. Breathing Exercise Screen

**File:** `mobile/src/screens/meditation/BreathingExerciseScreen.tsx`

**Route Params:**
```typescript
type BreathingExerciseParams = {
  meditationId: string;
};
```

Features:
- Full-screen player (same layout as MeditationPlayer)
- AudioPlayer component for voice-guided audio
- Optional: BreathingCircle animation overlay (if available from Session-Tracking-Agent)
- Session tracking same as meditation player

---

### 8. Meditate Home Screen (Rebuild)

**File:** `mobile/src/screens/MeditateScreen.tsx`

Complete rebuild of existing placeholder.

Features:
- Header with SessionStats component (if available)
- CategoryTabs for type selection
- NarratorSelector (visible only when activeTab='guided')
- FlatList grid of MeditationCard components
- Pull-to-refresh
- Loading and empty states
- Filter content by:
  - activeTab (type)
  - selectedNarrator (for guided only)

**State:**
```typescript
const [activeTab, setActiveTab] = useState<MeditationType>('guided');
const narratorPref = usePreferredNarrator();
```

**Data Fetching:**
```typescript
const { data: meditations, isLoading } = useMeditations(
  activeTab,
  activeTab === 'guided' ? narratorPref : undefined
);
```

**Navigation:**
- Card press → navigate to MeditationPlayer or BreathingExercise based on type

---

### 9. Meditation Navigator

**File:** `mobile/src/navigation/MeditateNavigator.tsx`

```typescript
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export type MeditateStackParamList = {
  MeditateHome: undefined;
  MeditationPlayer: { meditationId: string };
  BreathingExercise: { meditationId: string };
};

const Stack = createNativeStackNavigator<MeditateStackParamList>();

export function MeditateNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        presentation: 'card',
      }}
    >
      <Stack.Screen name="MeditateHome" component={MeditateScreen} />
      <Stack.Screen
        name="MeditationPlayer"
        component={MeditationPlayerScreen}
        options={{ presentation: 'fullScreenModal' }}
      />
      <Stack.Screen
        name="BreathingExercise"
        component={BreathingExerciseScreen}
        options={{ presentation: 'fullScreenModal' }}
      />
    </Stack.Navigator>
  );
}
```

---

### 10. Update Main Tab Navigator

**File:** `mobile/src/navigation/MainTabNavigator.tsx`

Change:
```typescript
// Before
import MeditateScreen from '../screens/MeditateScreen';
// ...
<Tab.Screen name="Meditate" component={MeditateScreen} />

// After
import { MeditateNavigator } from './MeditateNavigator';
// ...
<Tab.Screen name="Meditate" component={MeditateNavigator} />
```

---

### 11. Component Index

**File:** `mobile/src/components/meditation/index.ts`

```typescript
export { CategoryTabs } from './CategoryTabs';
export { NarratorSelector } from './NarratorSelector';
export { MeditationCard } from './MeditationCard';
export { ProgressBar } from './ProgressBar';
export { AudioPlayer } from './AudioPlayer';
// SessionStats exported from here when available from Session-Tracking-Agent
```

---

### 12. Screen Index

**File:** `mobile/src/screens/meditation/index.ts`

```typescript
export { MeditationPlayerScreen } from './MeditationPlayerScreen';
export { BreathingExerciseScreen } from './BreathingExerciseScreen';
```

---

## Styling Guidelines

Use existing theme:
- `theme/colors.ts` - colors.background, colors.surface, colors.gold, colors.text
- `theme/spacing.ts` - spacing.sm, spacing.md, spacing.lg
- `theme/typography.ts` - typography.h1, typography.body

Card styling:
- Background: `colors.surface`
- Border radius: 12
- Padding: `spacing.md`
- Shadow: subtle elevation

Button styling:
- Primary: Gold background, dark text
- Secondary: Transparent with gold border

---

## Validation Checklist

Before marking complete:

- [ ] MeditateScreen renders with tabs
- [ ] Category switching filters content
- [ ] Narrator selector works for guided tab
- [ ] Cards display correctly for all types
- [ ] MeditationPlayerScreen plays audio
- [ ] BreathingExerciseScreen plays audio
- [ ] Navigation flow works end-to-end
- [ ] Loading and error states handled
- [ ] No TypeScript errors
- [ ] No console warnings

---

## Output

When complete, these files should exist:
1. `mobile/src/components/meditation/CategoryTabs.tsx`
2. `mobile/src/components/meditation/NarratorSelector.tsx`
3. `mobile/src/components/meditation/MeditationCard.tsx`
4. `mobile/src/components/meditation/ProgressBar.tsx`
5. `mobile/src/components/meditation/AudioPlayer.tsx`
6. `mobile/src/components/meditation/index.ts`
7. `mobile/src/screens/meditation/MeditationPlayerScreen.tsx`
8. `mobile/src/screens/meditation/BreathingExerciseScreen.tsx`
9. `mobile/src/screens/meditation/index.ts`
10. `mobile/src/screens/MeditateScreen.tsx` (rebuilt)
11. `mobile/src/navigation/MeditateNavigator.tsx`
12. `mobile/src/navigation/MainTabNavigator.tsx` (updated)

**Report:** "UI-Components-Agent complete - All screens and components ready"
