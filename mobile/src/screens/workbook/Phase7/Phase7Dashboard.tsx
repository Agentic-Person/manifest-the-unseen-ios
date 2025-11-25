/**
 * Phase 7 Dashboard - Practicing Gratitude
 *
 * Dashboard for Phase 7 exercises focused on gratitude practices.
 */

import React from 'react';
import { PhaseDashboard } from '../../../components/workbook/PhaseDashboard';
import type { WorkbookStackScreenProps } from '../../../types/navigation';

// Phase 7 exercises
const EXERCISES = [
  {
    id: 'gratitude-journal',
    name: 'Gratitude Journal',
    description: 'Daily gratitude practice',
    icon: '📔',
    estimatedTime: '10 min daily',
    isCompleted: false,
  },
  {
    id: 'gratitude-letters',
    name: 'Gratitude Letters',
    description: 'Write heartfelt letters of appreciation',
    icon: '✉️',
    estimatedTime: '20 min',
    isCompleted: false,
  },
  {
    id: 'gratitude-meditation',
    name: 'Gratitude Meditation',
    description: 'Guided gratitude meditation practice',
    icon: '🧘',
    estimatedTime: '15 min',
    isCompleted: false,
  },
];

type Props = WorkbookStackScreenProps<'Phase7Dashboard'>;

const Phase7Dashboard: React.FC<Props> = ({ navigation }) => {
  const handleExercisePress = (exerciseId: string) => {
    switch (exerciseId) {
      case 'gratitude-journal':
        navigation.navigate('GratitudeJournal');
        break;
      case 'gratitude-letters':
        navigation.navigate('GratitudeLetters');
        break;
      case 'gratitude-meditation':
        navigation.navigate('GratitudeMeditation');
        break;
    }
  };

  const overallProgress = 0;

  return (
    <PhaseDashboard
      phaseNumber={7}
      phaseName="Practicing Gratitude"
      phaseDescription="Develop a deep gratitude practice that raises your vibration and attracts abundance."
      exercises={EXERCISES}
      overallProgress={overallProgress}
      onExercisePress={handleExercisePress}
    />
  );
};

export default Phase7Dashboard;
