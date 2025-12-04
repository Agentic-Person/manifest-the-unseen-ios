/**
 * Phase 9 Dashboard - Trust & Surrender
 *
 * Dashboard for Phase 9 exercises focused on trust and letting go.
 */

import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { PhaseDashboard } from '../../../components/workbook/PhaseDashboard';
import type { WorkbookStackScreenProps } from '../../../types/navigation';
import { usePhaseExercises, type ExerciseConfig } from '../../../hooks/usePhaseExercises';
import { colors } from '../../../theme';

// Phase 9 exercises
const PHASE9_EXERCISES: ExerciseConfig[] = [
  {
    id: 'trust-assessment',
    name: 'Trust Assessment',
    description: 'Evaluate your trust in self, others, and universe',
    icon: '🤝',
    estimatedTime: '15 min',
  },
  {
    id: 'surrender-practice',
    name: 'Surrender Practice',
    description: 'Learn to release control',
    icon: '🕊️',
    estimatedTime: '20 min',
  },
  {
    id: 'signs-tracking',
    name: 'Signs & Synchronicities',
    description: 'Track meaningful coincidences',
    icon: '🔮',
    estimatedTime: '10 min',
  },
];

type Props = WorkbookStackScreenProps<'Phase9Dashboard'>;

const Phase9Dashboard: React.FC<Props> = ({ navigation }) => {
  const { exercises, completedCount, totalCount, overallProgress, isLoading } =
    usePhaseExercises(9, PHASE9_EXERCISES);

  const handleExercisePress = (exerciseId: string) => {
    switch (exerciseId) {
      case 'trust-assessment':
        navigation.navigate('TrustAssessment');
        break;
      case 'surrender-practice':
        navigation.navigate('SurrenderPractice');
        break;
      case 'signs-tracking':
        navigation.navigate('Signs');
        break;
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary[600]} />
      </View>
    );
  }

  return (
    <PhaseDashboard
      phaseNumber={9}
      phaseName="Trust & Surrender"
      phaseDescription="Develop deep trust in yourself and the universe. Learn the art of surrender and letting go."
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

export default Phase9Dashboard;
