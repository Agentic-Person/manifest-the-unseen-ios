/**
 * Phase 10 Dashboard - Trust & Letting Go
 *
 * Dashboard for Phase 10 exercises - the final phase celebrating completion.
 */

import React from 'react';
import { PhaseDashboard } from '../../../components/workbook/PhaseDashboard';
import type { WorkbookStackScreenProps } from '../../../types/navigation';

// Phase 10 exercises
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

type Props = WorkbookStackScreenProps<'Phase10Dashboard'>;

const Phase10Dashboard: React.FC<Props> = ({ navigation }) => {
  const handleExercisePress = (exerciseId: string) => {
    switch (exerciseId) {
      case 'journey-review':
        navigation.navigate('JourneyReview');
        break;
      case 'future-letter':
        navigation.navigate('FutureLetter');
        break;
      case 'graduation':
        navigation.navigate('Graduation');
        break;
    }
  };

  const overallProgress = 0;

  return (
    <PhaseDashboard
      phaseNumber={10}
      phaseName="Letting Go"
      phaseDescription="Complete your journey. Review your growth, write to your future self, and celebrate your transformation."
      exercises={EXERCISES}
      overallProgress={overallProgress}
      onExercisePress={handleExercisePress}
    />
  );
};

export default Phase10Dashboard;
