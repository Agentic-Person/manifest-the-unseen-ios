/**
 * Phase 8 Dashboard - Turning Envy Into Inspiration
 *
 * Dashboard for Phase 8 exercises focused on transforming envy into inspiration.
 */

import React from 'react';
import { PhaseDashboard } from '../../../components/workbook/PhaseDashboard';
import type { WorkbookStackScreenProps } from '../../../types/navigation';

// Phase 8 exercises
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

type Props = WorkbookStackScreenProps<'Phase8Dashboard'>;

const Phase8Dashboard: React.FC<Props> = ({ navigation }) => {
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

  const overallProgress = 0;

  return (
    <PhaseDashboard
      phaseNumber={8}
      phaseName="Envy to Inspiration"
      phaseDescription="Transform feelings of envy into powerful inspiration by learning from those you admire."
      exercises={EXERCISES}
      overallProgress={overallProgress}
      onExercisePress={handleExercisePress}
    />
  );
};

export default Phase8Dashboard;
