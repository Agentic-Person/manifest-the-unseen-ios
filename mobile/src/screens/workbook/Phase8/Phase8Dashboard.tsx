/**
 * Phase 8 Dashboard - Turning Envy Into Inspiration
 *
 * Dashboard for Phase 8 exercises focused on transforming envy into inspiration.
 */

import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { PhaseDashboard } from '../../../components/workbook/PhaseDashboard';
import type { WorkbookStackScreenProps } from '../../../types/navigation';
import { usePhaseExercises, type ExerciseConfig, type ExerciseWithProgress } from '../../../hooks/usePhaseExercises';
import { colors } from '../../../theme';

// Phase 8 exercises
const PHASE8_EXERCISES: ExerciseConfig[] = [
  {
    id: 'envy-inventory',
    name: 'Envy Inventory',
    description: 'Identify what triggers envy',
    icon: '👁️',
    estimatedTime: '15 min',
  },
  {
    id: 'inspiration-reframe',
    name: 'Inspiration Reframe',
    description: 'Transform envy into inspiration',
    icon: '🔄',
    estimatedTime: '20 min',
  },
  {
    id: 'role-models',
    name: 'Role Models',
    description: 'Learn from those you admire',
    icon: '⭐',
    estimatedTime: '15 min',
  },
];

type Props = WorkbookStackScreenProps<'Phase8Dashboard'>;

const Phase8Dashboard: React.FC<Props> = ({ navigation }) => {
  // Fetch real progress from database and merge with static config
  const { exercises, completedCount, totalCount, overallProgress, isLoading } = usePhaseExercises(8, PHASE8_EXERCISES);

  const handleExercisePress = (exerciseId: string) => {
    switch (exerciseId) {
      case 'envy-inventory':
        navigation.navigate('EnvyInventory');
        break;
      case 'inspiration-reframe':
        navigation.navigate('InspirationReframe');
        break;
      case 'role-models':
        navigation.navigate('RoleModels');
        break;
    }
  };

  // Show loading state while fetching progress
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary[600]} />
      </View>
    );
  }

  return (
    <PhaseDashboard
      phaseNumber={8}
      phaseName="Envy to Inspiration"
      phaseDescription="Transform feelings of envy into powerful inspiration by learning from those you admire."
      exercises={exercises}
      overallProgress={overallProgress}
      onExercisePress={handleExercisePress}
    />
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
  },
});

export default Phase8Dashboard;
