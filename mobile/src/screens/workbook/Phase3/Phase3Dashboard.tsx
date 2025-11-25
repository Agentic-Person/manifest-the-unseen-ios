/**
 * Phase 3 Dashboard - Goal Setting
 *
 * Dashboard for Phase 3 exercises focused on setting and planning goals.
 */

import React from 'react';
import { PhaseDashboard } from '../../../components/workbook/PhaseDashboard';
import type { WorkbookStackScreenProps } from '../../../types/navigation';

// Phase 3 exercises
const EXERCISES = [
  {
    id: 'smart-goals',
    name: 'SMART Goals',
    description: 'Set specific, measurable, achievable goals',
    icon: '🎯',
    estimatedTime: '25 min',
    isCompleted: false,
  },
  {
    id: 'timeline',
    name: 'Goal Timeline',
    description: 'Map your goals to a timeline',
    icon: '📅',
    estimatedTime: '15 min',
    isCompleted: false,
  },
  {
    id: 'action-plan',
    name: 'Action Plan',
    description: 'Break goals into actionable steps',
    icon: '📋',
    estimatedTime: '20 min',
    isCompleted: false,
  },
];

type Props = WorkbookStackScreenProps<'Phase3Dashboard'>;

const Phase3Dashboard: React.FC<Props> = ({ navigation }) => {
  const handleExercisePress = (exerciseId: string) => {
    switch (exerciseId) {
      case 'smart-goals':
        (navigation.navigate as any)('SMARTGoals');
        break;
      case 'timeline':
        (navigation.navigate as any)('Timeline');
        break;
      case 'action-plan':
        (navigation.navigate as any)('ActionPlan');
        break;
    }
  };

  const overallProgress = 0;

  return (
    <PhaseDashboard
      phaseNumber={3}
      phaseName="Goal Setting"
      phaseDescription="Transform your vision into concrete, achievable goals with clear timelines and action plans."
      exercises={EXERCISES}
      overallProgress={overallProgress}
      onExercisePress={handleExercisePress}
    />
  );
};

export default Phase3Dashboard;
