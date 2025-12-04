/**
 * usePhaseExercises Hook
 *
 * Combines static exercise configuration with real progress data from the database.
 * Used by all Phase dashboards to display accurate progress tracking.
 */

import { useMemo } from 'react';
import { ImageSourcePropType } from 'react-native';
import { usePhaseProgress } from './useWorkbook';

/**
 * Exercise configuration (static definition)
 */
export interface ExerciseConfig {
  id: string;
  name: string;
  description: string;
  icon: ImageSourcePropType;
  estimatedTime: string;
}

/**
 * Exercise with progress data (computed from database)
 */
export interface ExerciseWithProgress extends ExerciseConfig {
  progress: number; // 0-100
  isCompleted: boolean;
}

/**
 * Hook that merges static exercise config with real progress data
 *
 * @param phaseNumber - The phase number (1-10)
 * @param exercises - Static exercise configuration array
 *
 * @example
 * ```tsx
 * const {
 *   exercises,
 *   completedCount,
 *   totalCount,
 *   overallProgress,
 *   isLoading,
 * } = usePhaseExercises(1, PHASE1_EXERCISES);
 * ```
 */
export function usePhaseExercises(
  phaseNumber: number,
  exercises: ExerciseConfig[]
) {
  const { data: phaseProgress, isLoading, refetch } = usePhaseProgress(phaseNumber);

  const exercisesWithProgress = useMemo<ExerciseWithProgress[]>(() => {
    return exercises.map((exercise) => {
      const saved = phaseProgress?.worksheets?.find(
        (w) => w.worksheet_id === exercise.id
      );

      // Calculate progress:
      // - 0% if no saved data
      // - 50% if data exists but not marked complete
      // - 100% if marked complete
      let progress = 0;
      if (saved?.completed) {
        progress = 100;
      } else if (saved?.data && Object.keys(saved.data).length > 0) {
        progress = 50;
      }

      return {
        ...exercise,
        progress,
        isCompleted: saved?.completed ?? false,
      };
    });
  }, [exercises, phaseProgress]);

  const completedCount = useMemo(
    () => exercisesWithProgress.filter((e) => e.isCompleted).length,
    [exercisesWithProgress]
  );

  const totalCount = exercises.length;

  const overallProgress = useMemo(
    () =>
      Math.round(
        exercisesWithProgress.reduce((sum, e) => sum + e.progress, 0) /
          totalCount
      ),
    [exercisesWithProgress, totalCount]
  );

  return {
    exercises: exercisesWithProgress,
    completedCount,
    totalCount,
    overallProgress,
    isLoading,
    refetch,
  };
}
