/**
 * Phase 6 Dashboard - Manifestation Techniques
 *
 * Dashboard for Phase 6 exercises focused on manifestation methods.
 */

import React from 'react';
import { PhaseDashboard } from '../../../components/workbook/PhaseDashboard';
import type { WorkbookStackScreenProps } from '../../../types/navigation';

// Phase 6 exercises
const EXERCISES = [
  {
    id: '369-method',
    name: '3-6-9 Method',
    description: "Tesla's powerful manifestation technique",
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

type Props = WorkbookStackScreenProps<'Phase6Dashboard'>;

const Phase6Dashboard: React.FC<Props> = ({ navigation }) => {
  const handleExercisePress = (exerciseId: string) => {
    switch (exerciseId) {
      case '369-method':
        navigation.navigate('ThreeSixNine');
        break;
      case 'scripting':
        navigation.navigate('Scripting');
        break;
      case 'woop':
        navigation.navigate('WOOP');
        break;
    }
  };

  const overallProgress = 0;

  return (
    <PhaseDashboard
      phaseNumber={6}
      phaseName="Manifestation Techniques"
      phaseDescription="Master powerful manifestation methods including the 3-6-9 technique, scripting, and the WOOP framework."
      exercises={EXERCISES}
      overallProgress={overallProgress}
      onExercisePress={handleExercisePress}
    />
  );
};

export default Phase6Dashboard;
