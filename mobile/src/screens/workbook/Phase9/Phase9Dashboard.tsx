/**
 * Phase 9 Dashboard - Trust & Surrender
 *
 * Dashboard for Phase 9 exercises focused on trust and letting go.
 */

import React from 'react';
import { PhaseDashboard } from '../../../components/workbook/PhaseDashboard';
import type { WorkbookStackScreenProps } from '../../../types/navigation';

// Phase 9 exercises
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

type Props = WorkbookStackScreenProps<'Phase9Dashboard'>;

const Phase9Dashboard: React.FC<Props> = ({ navigation }) => {
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

  const overallProgress = 0;

  return (
    <PhaseDashboard
      phaseNumber={9}
      phaseName="Trust & Surrender"
      phaseDescription="Develop deep trust in yourself and the universe. Learn the art of surrender and letting go."
      exercises={EXERCISES}
      overallProgress={overallProgress}
      onExercisePress={handleExercisePress}
    />
  );
};

export default Phase9Dashboard;
