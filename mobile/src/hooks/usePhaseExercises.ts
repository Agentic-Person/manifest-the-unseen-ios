/**
 * usePhaseExercises Hook
 *
 * Combines static exercise configuration with real progress data from the database.
 * Used by all Phase dashboards to display accurate progress tracking.
 *
 * IMPORTANT: This hook runs completion detection on-the-fly using the actual
 * worksheet data, not just the `completed` boolean in the database. This ensures
 * progress is always calculated using the latest completion criteria.
 */

import { useMemo } from 'react';
import { ImageSourcePropType } from 'react-native';
import { usePhaseProgress } from './useWorkbook';
import { getWorksheetConfig } from '../config/worksheetConfigs';
import { detectCompletion } from '../utils/completionDetection';
import { logger } from '../utils/logger';

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
  const { data: phaseProgress, isLoading, isError, error, refetch } = usePhaseProgress(phaseNumber);

  const exercisesWithProgress = useMemo<ExerciseWithProgress[]>(() => {
    return exercises.map((exercise) => {
      const saved = phaseProgress?.worksheets?.find(
        (w) => w.worksheet_id === exercise.id
      );

      // Determine if the worksheet is actually complete by:
      // 1. First check the database boolean (fast path)
      // 2. If not marked complete, run completion detection on the actual data
      let isActuallyComplete = saved?.completed ?? false;

      if (!isActuallyComplete && saved?.data && typeof saved.data === 'object') {
        try {
          const config = getWorksheetConfig(exercise.id);
          if (config?.completionCriteria) {
            isActuallyComplete = detectCompletion(
              saved.data as Record<string, unknown>,
              config.completionCriteria
            );
            if (isActuallyComplete) {
              logger.debug(`[usePhaseExercises] Exercise ${exercise.id} detected as complete via criteria (not marked in DB)`);
            }
          }
        } catch (err) {
          // If detection fails, use database boolean
          logger.warn(`[usePhaseExercises] Completion detection failed for ${exercise.id}:`, err);
        }
      }

      // Calculate progress:
      // - 0% if no saved data
      // - 50% if data exists but not complete
      // - 100% if complete (either via DB flag or criteria detection)
      let progress = 0;
      if (isActuallyComplete) {
        progress = 100;
      } else if (saved?.data && typeof saved.data === 'object' && Object.keys(saved.data).length > 0) {
        progress = 50;
      }

      return {
        ...exercise,
        progress,
        isCompleted: isActuallyComplete,
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
    isError,
    error,
    refetch,
  };
}
