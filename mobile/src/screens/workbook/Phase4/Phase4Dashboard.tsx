/**
 * Phase 4 Dashboard - Facing Fears & Limiting Beliefs
 *
 * Dashboard for Phase 4 exercises focused on confronting fears and reframing beliefs.
 */

import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { PhaseDashboard } from '../../../components/workbook/PhaseDashboard';
import { colors } from '../../../theme';
import type { WorkbookStackScreenProps } from '../../../types/navigation';
import { usePhaseExercises, type ExerciseConfig } from '../../../hooks/usePhaseExercises';

// Phase 4 exercises
const PHASE4_EXERCISES: ExerciseConfig[] = [
  {
    id: 'fear-inventory',
    name: 'Fear Inventory',
    description: 'Identify and examine your fears',
    icon: '😨',
    estimatedTime: '20 min',
  },
  {
    id: 'limiting-beliefs',
    name: 'Limiting Beliefs',
    description: 'Challenge and reframe limiting beliefs',
    icon: '🔗',
    estimatedTime: '25 min',
  },
  {
    id: 'fear-facing-plan',
    name: 'Fear Facing Plan',
    description: 'Create a plan to overcome your fears',
    icon: '💪',
    estimatedTime: '15 min',
  },
];

type Props = WorkbookStackScreenProps<'Phase4Dashboard'>;

const Phase4Dashboard: React.FC<Props> = ({ navigation }) => {
  // Fetch real progress from database and merge with static config
  const { exercises, overallProgress, isLoading } = usePhaseExercises(4, PHASE4_EXERCISES);

  const handleExercisePress = (exerciseId: string) => {
    switch (exerciseId) {
      case 'fear-inventory':
        (navigation.navigate as any)('FearInventory');
        break;
      case 'limiting-beliefs':
        (navigation.navigate as any)('LimitingBeliefs');
        break;
      case 'fear-facing-plan':
        (navigation.navigate as any)('FearFacingPlan');
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
      phaseNumber={4}
      phaseName="Facing Fears"
      phaseDescription="Confront the fears and limiting beliefs that hold you back. Transform them into sources of strength."
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

export default Phase4Dashboard;
