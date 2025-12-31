# Dashboard Agent 2: WorkbookScreen + Components

> **Agent Role**: Update WorkbookScreen and create reusable components
> **Reports To**: `DASHBOARD-ORCHESTRATOR.md`
> **Depends On**: Agent 1 (routes must exist)
> **Status**: `pending`
> **Playwright Tested**: `not_tested`
> **Est. Time**: 2-3 hours

---

## Task Summary

Update WorkbookScreen to navigate to all 10 phases and create reusable components for phase cards, progress bars, and dashboard templates.

---

## Status Tracking

| Task | Status | Notes |
|------|--------|-------|
| Update `WorkbookScreen.tsx` | `pending` | |
| Create `PhaseCard.tsx` | `pending` | |
| Create `ProgressBar.tsx` | `pending` | |
| Create `PhaseDashboard.tsx` | `pending` | |
| Update exports in index.ts | `pending` | |

---

## Files to Create/Modify

### 1. `mobile/src/screens/WorkbookScreen.tsx`

**Current State**: Only navigates to Phase 1, others show "coming soon"

**Changes Needed**:

```typescript
// Find the phase tap handler and update it:

const handlePhasePress = (phase: Phase) => {
  if (!phase.isUnlocked) {
    // Show toast or alert
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert('Phase Locked', `Complete Phase ${phase.id - 1} first`);
    return;
  }

  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

  // Navigate to the correct Phase Dashboard
  const dashboardMap: Record<number, keyof WorkbookStackParamList> = {
    1: 'Phase1Dashboard',
    2: 'Phase2Dashboard',
    3: 'Phase3Dashboard',
    4: 'Phase4Dashboard',
    5: 'Phase5Dashboard',
    6: 'Phase6Dashboard',
    7: 'Phase7Dashboard',
    8: 'Phase8Dashboard',
    9: 'Phase9Dashboard',
    10: 'Phase10Dashboard',
  };

  const screenName = dashboardMap[phase.id];
  if (screenName) {
    navigation.navigate(screenName);
  }
};
```

**Also update**:
- Import `Haptics` from 'expo-haptics'
- Import navigation types
- Replace phase cards with PhaseCard component (after creating it)

---

### 2. `mobile/src/components/workbook/PhaseCard.tsx`

**Purpose**: Reusable phase card with locked/unlocked/current/completed states

```typescript
import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';

interface PhaseCardProps {
  phaseNumber: number;
  phaseName: string;
  description: string;
  progress: number; // 0-100
  isLocked: boolean;
  isCurrent: boolean;
  isCompleted: boolean;
  exerciseCount: number;
  completedExercises: number;
  onPress: () => void;
}

export const PhaseCard: React.FC<PhaseCardProps> = ({
  phaseNumber,
  phaseName,
  description,
  progress,
  isLocked,
  isCurrent,
  isCompleted,
  exerciseCount,
  completedExercises,
  onPress,
}) => {
  const handlePress = () => {
    if (isLocked) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onPress();
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        isLocked && styles.cardLocked,
        isCurrent && styles.cardCurrent,
        isCompleted && styles.cardCompleted,
      ]}
      onPress={handlePress}
      activeOpacity={isLocked ? 1 : 0.7}
      accessibilityRole="button"
      accessibilityLabel={`Phase ${phaseNumber}: ${phaseName}. ${isLocked ? 'Locked' : `${progress}% complete`}`}
    >
      <View style={styles.header}>
        <View style={styles.phaseNumber}>
          <Text style={styles.phaseNumberText}>{phaseNumber}</Text>
        </View>
        {isCurrent && (
          <View style={styles.currentBadge}>
            <Text style={styles.currentBadgeText}>Current</Text>
          </View>
        )}
        {isCompleted && <Text style={styles.checkmark}>✓</Text>}
        {isLocked && <Text style={styles.lockIcon}>🔒</Text>}
      </View>

      <Text style={[styles.phaseName, isLocked && styles.textLocked]}>
        {phaseName}
      </Text>
      <Text style={[styles.description, isLocked && styles.textLocked]}>
        {description}
      </Text>

      {!isLocked && (
        <View style={styles.progressSection}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {completedExercises}/{exerciseCount} exercises
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#252547',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  cardLocked: {
    backgroundColor: '#1a1a2e',
    opacity: 0.6,
  },
  cardCurrent: {
    borderColor: '#4a1a6b',
    backgroundColor: '#2a2a4e',
  },
  cardCompleted: {
    borderColor: '#2d5a2d',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  phaseNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4a1a6b',
    justifyContent: 'center',
    alignItems: 'center',
  },
  phaseNumberText: {
    color: '#e8e8e8',
    fontWeight: '700',
    fontSize: 16,
  },
  currentBadge: {
    backgroundColor: '#c9a227',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 8,
  },
  currentBadgeText: {
    color: '#1a1a2e',
    fontSize: 10,
    fontWeight: '700',
  },
  checkmark: {
    fontSize: 20,
    color: '#4CAF50',
    marginLeft: 'auto',
  },
  lockIcon: {
    fontSize: 18,
    marginLeft: 'auto',
  },
  phaseName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#e8e8e8',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#a0a0b0',
    marginBottom: 12,
  },
  textLocked: {
    color: '#6b6b80',
  },
  progressSection: {
    marginTop: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#1a1a2e',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#c9a227',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#a0a0b0',
    marginTop: 4,
  },
});
```

---

### 3. `mobile/src/components/workbook/ProgressBar.tsx`

**Purpose**: Reusable progress bar component

```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ProgressBarProps {
  progress: number; // 0-100
  label?: string;
  showPercentage?: boolean;
  height?: number;
  fillColor?: string;
  backgroundColor?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  label,
  showPercentage = true,
  height = 8,
  fillColor = '#c9a227',
  backgroundColor = '#1a1a2e',
}) => {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.row}>
        <View style={[styles.track, { height, backgroundColor }]}>
          <View
            style={[
              styles.fill,
              {
                width: `${clampedProgress}%`,
                backgroundColor: fillColor,
              },
            ]}
          />
        </View>
        {showPercentage && (
          <Text style={styles.percentage}>{Math.round(clampedProgress)}%</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    color: '#a0a0b0',
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  track: {
    flex: 1,
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
  percentage: {
    fontSize: 14,
    color: '#e8e8e8',
    fontWeight: '600',
    marginLeft: 8,
    minWidth: 40,
    textAlign: 'right',
  },
});
```

---

### 4. `mobile/src/components/workbook/PhaseDashboard.tsx`

**Purpose**: Reusable dashboard template that Agent 3 can use

```typescript
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { ProgressBar } from './ProgressBar';

interface Exercise {
  id: string;
  name: string;
  description?: string;
  icon: string;
  estimatedTime: string;
  isCompleted: boolean;
}

interface PhaseDashboardProps {
  phaseNumber: number;
  phaseName: string;
  phaseDescription: string;
  exercises: Exercise[];
  overallProgress: number;
  onExercisePress: (exerciseId: string) => void;
}

export const PhaseDashboard: React.FC<PhaseDashboardProps> = ({
  phaseNumber,
  phaseName,
  phaseDescription,
  exercises,
  overallProgress,
  onExercisePress,
}) => {
  const handleExercisePress = (exerciseId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onExercisePress(exerciseId);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.phaseTag}>
          <Text style={styles.phaseTagText}>Phase {phaseNumber}</Text>
        </View>
        <Text style={styles.title}>{phaseName}</Text>
        <Text style={styles.description}>{phaseDescription}</Text>
      </View>

      {/* Progress */}
      <View style={styles.progressSection}>
        <ProgressBar
          progress={overallProgress}
          label="Phase Progress"
          height={10}
        />
      </View>

      {/* Exercises */}
      <View style={styles.exercisesSection}>
        <Text style={styles.sectionTitle}>Exercises</Text>
        {exercises.map((exercise) => (
          <TouchableOpacity
            key={exercise.id}
            style={[
              styles.exerciseCard,
              exercise.isCompleted && styles.exerciseCompleted,
            ]}
            onPress={() => handleExercisePress(exercise.id)}
            accessibilityRole="button"
            accessibilityLabel={`${exercise.name}. ${exercise.isCompleted ? 'Completed' : 'Not started'}`}
          >
            <View style={styles.exerciseIcon}>
              <Text style={styles.exerciseIconText}>{exercise.icon}</Text>
            </View>
            <View style={styles.exerciseInfo}>
              <Text style={styles.exerciseName}>{exercise.name}</Text>
              <Text style={styles.exerciseTime}>{exercise.estimatedTime}</Text>
            </View>
            {exercise.isCompleted ? (
              <Text style={styles.completedIcon}>✓</Text>
            ) : (
              <Text style={styles.arrowIcon}>→</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 24,
  },
  phaseTag: {
    backgroundColor: '#4a1a6b',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  phaseTagText: {
    color: '#e8e8e8',
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#e8e8e8',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#a0a0b0',
    lineHeight: 24,
  },
  progressSection: {
    marginBottom: 32,
  },
  exercisesSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#e8e8e8',
    marginBottom: 16,
  },
  exerciseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#252547',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  exerciseCompleted: {
    opacity: 0.7,
    borderColor: '#2d5a2d',
    borderWidth: 1,
  },
  exerciseIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  exerciseIconText: {
    fontSize: 24,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e8e8e8',
    marginBottom: 2,
  },
  exerciseTime: {
    fontSize: 12,
    color: '#a0a0b0',
  },
  completedIcon: {
    fontSize: 20,
    color: '#4CAF50',
    marginLeft: 8,
  },
  arrowIcon: {
    fontSize: 20,
    color: '#c9a227',
    marginLeft: 8,
  },
});
```

---

### 5. Update `mobile/src/components/workbook/index.ts`

**Add exports**:
```typescript
export * from './PhaseCard';
export * from './ProgressBar';
export * from './PhaseDashboard';
```

---

## Verification Checklist

Before marking complete:

- [ ] WorkbookScreen navigates to all 10 phases
- [ ] Locked phases show alert/toast
- [ ] PhaseCard renders all states correctly
- [ ] ProgressBar shows accurate percentage
- [ ] PhaseDashboard template is reusable
- [ ] Haptic feedback works
- [ ] TypeScript compiles: `npm run type-check`

---

## Report to Orchestrator

When complete, add to `DASHBOARD-ORCHESTRATOR.md`:

```
### [DATE TIME] - Agent 2 (WorkbookScreen + Components)
**Status**: completed
**Summary**: Updated WorkbookScreen, created 3 reusable components
**Files Modified**:
- screens/WorkbookScreen.tsx
- components/workbook/index.ts
**Files Created**:
- components/workbook/PhaseCard.tsx
- components/workbook/ProgressBar.tsx
- components/workbook/PhaseDashboard.tsx
**Blockers**: None
**Next**: Ready for Playwright verification
```

Update status above to `completed`.

---

*Agent Document Version: 1.0*
