/**
 * Phase 4 Dashboard - Facing Fears & Limiting Beliefs
 *
 * Dashboard for Phase 4 exercises focused on confronting fears and reframing beliefs.
 */

import React from 'react';
import { PhaseDashboard } from '../../../components/workbook/PhaseDashboard';
import type { WorkbookStackScreenProps } from '../../../types/navigation';

// Phase 4 exercises
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

type Props = WorkbookStackScreenProps<'Phase4Dashboard'>;

const Phase4Dashboard: React.FC<Props> = ({ navigation }) => {
  const handleExercisePress = (exerciseId: string) => {
    switch (exerciseId) {
      case 'fear-inventory':
        navigation.navigate('FearInventory');
        break;
      case 'limiting-beliefs':
        navigation.navigate('LimitingBeliefs');
        break;
      case 'fear-facing-plan':
        navigation.navigate('FearFacingPlan');
        break;
    }
  };

  const overallProgress = 0;

  return (
    <PhaseDashboard
      phaseNumber={4}
      phaseName="Facing Fears"
      phaseDescription="Confront the fears and limiting beliefs that hold you back. Transform them into sources of strength."
      exercises={EXERCISES}
      overallProgress={overallProgress}
      onExercisePress={handleExercisePress}
    />
  );
};

export default Phase4Dashboard;
