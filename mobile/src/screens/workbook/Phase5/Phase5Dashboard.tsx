/**
 * Phase 5 Dashboard - Cultivating Self-Love & Self-Care
 *
 * Dashboard for Phase 5 exercises focused on self-love and self-care practices.
 */

import React from 'react';
import { PhaseDashboard } from '../../../components/workbook/PhaseDashboard';
import type { WorkbookStackScreenProps } from '../../../types/navigation';

// Phase 5 exercises
const EXERCISES = [
  {
    id: 'self-love-affirmations',
    name: 'Self-Love Affirmations',
    description: 'Build a collection of empowering affirmations',
    icon: '💖',
    estimatedTime: '15 min',
    isCompleted: false,
  },
  {
    id: 'self-care-routine',
    name: 'Self-Care Routine',
    description: 'Design your daily self-care practice',
    icon: '🛁',
    estimatedTime: '20 min',
    isCompleted: false,
  },
  {
    id: 'inner-child',
    name: 'Inner Child Healing',
    description: 'Connect with and heal your inner child',
    icon: '👶',
    estimatedTime: '25 min',
    isCompleted: false,
  },
];

type Props = WorkbookStackScreenProps<'Phase5Dashboard'>;

const Phase5Dashboard: React.FC<Props> = ({ navigation }) => {
  const handleExercisePress = (exerciseId: string) => {
    switch (exerciseId) {
      case 'self-love-affirmations':
        navigation.navigate('SelfLoveAffirmations');
        break;
      case 'self-care-routine':
        navigation.navigate('SelfCareRoutine');
        break;
      case 'inner-child':
        navigation.navigate('InnerChild');
        break;
    }
  };

  const overallProgress = 0;

  return (
    <PhaseDashboard
      phaseNumber={5}
      phaseName="Self-Love & Self-Care"
      phaseDescription="Cultivate deep self-love and establish nurturing self-care practices that support your journey."
      exercises={EXERCISES}
      overallProgress={overallProgress}
      onExercisePress={handleExercisePress}
    />
  );
};

export default Phase5Dashboard;
