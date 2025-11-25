/**
 * Phase 2 Dashboard - Values & Vision
 *
 * Dashboard for Phase 2 exercises focused on clarifying values and vision.
 */

import React from 'react';
import { PhaseDashboard } from '../../../components/workbook/PhaseDashboard';
import type { WorkbookStackScreenProps } from '../../../types/navigation';

// Phase 2 exercises
const EXERCISES = [
  {
    id: 'life-mission',
    name: 'Life Mission',
    description: 'Define your core life mission',
    icon: '🎯',
    estimatedTime: '20 min',
    isCompleted: false,
  },
  {
    id: 'vision-board',
    name: 'Vision Board',
    description: 'Create a visual representation of your goals',
    icon: '🖼️',
    estimatedTime: '30 min',
    isCompleted: false,
  },
];

type Props = WorkbookStackScreenProps<'Phase2Dashboard'>;

const Phase2Dashboard: React.FC<Props> = ({ navigation }) => {
  const handleExercisePress = (exerciseId: string) => {
    // Map exercise ID to screen name
    switch (exerciseId) {
      case 'life-mission':
        (navigation.navigate as any)('LifeMission');
        break;
      case 'vision-board':
        (navigation.navigate as any)('VisionBoard');
        break;
    }
  };

  // TODO: Calculate from Supabase data
  const overallProgress = 0;

  return (
    <PhaseDashboard
      phaseNumber={2}
      phaseName="Values & Vision"
      phaseDescription="Clarify your core values and create a compelling vision for your future. This phase helps you define what truly matters to you."
      exercises={EXERCISES}
      overallProgress={overallProgress}
      onExercisePress={handleExercisePress}
    />
  );
};

export default Phase2Dashboard;
