/**
 * All Phases Progress Hook
 *
 * Fetches progress for all 10 workbook phases efficiently in a single query.
 * Returns per-phase progress summaries and overall completion percentage.
 *
 * IMPORTANT: This hook runs completion detection on-the-fly using the actual
 * worksheet data, not just the `completed` boolean in the database. This ensures
 * progress is always calculated using the latest completion criteria.
 */

import { useMemo } from 'react';
import { useAllWorkbookProgress } from './useWorkbook';
import { WORKSHEETS_PER_PHASE } from '../types/workbook';
import { getWorksheetConfig } from '../config/worksheetConfigs';
import { detectCompletion } from '../utils/completionDetection';
import { logger } from '../utils/logger';

/**
 * Summary for a single phase's progress
 */
export interface PhaseProgressSummary {
  phaseNumber: number;
  completed: number;
  total: number;
  percentage: number;
  hasStarted: boolean;
}

/**
 * Return type for useAllPhasesProgress hook
 */
export interface AllPhasesProgressResult {
  phases: PhaseProgressSummary[];
  overallPercentage: number;
  totalCompleted: number;
  totalWorksheets: number;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

/**
 * Get the dynamic color for a progress percentage
 * Red (0-25%) -> Orange (26-50%) -> Yellow (51-75%) -> Green (76-100%)
 */
export function getProgressColor(percentage: number): string {
  if (percentage <= 25) {
    return '#dc2626';
  } // Red
  if (percentage <= 50) {
    return '#c9a227';
  } // Orange
  if (percentage <= 75) {
    return '#8b6914';
  } // Yellow/Amber
  return '#2d5a4a'; // Green
}

/**
 * Get a motivational message based on overall progress
 */
export function getProgressMessage(percentage: number): string {
  if (percentage === 0) {
    return 'Begin your transformation journey';
  }
  if (percentage <= 25) {
    return "You've taken the first steps!";
  }
  if (percentage <= 50) {
    return 'Making great progress!';
  }
  if (percentage <= 75) {
    return 'Over halfway there!';
  }
  if (percentage < 100) {
    return 'Almost complete!';
  }
  return 'Journey complete!';
}

/**
 * Hook to fetch progress for all 10 phases efficiently
 *
 * @example
 * ```tsx
 * const { phases, overallPercentage, isLoading } = useAllPhasesProgress();
 *
 * // Get a specific phase's progress
 * const phase1Progress = phases.find(p => p.phaseNumber === 1);
 * console.log(`Phase 1: ${phase1Progress?.percentage}%`);
 * ```
 */
export function useAllPhasesProgress(): AllPhasesProgressResult {
  const { data: allProgress, isLoading, isError, refetch } = useAllWorkbookProgress();

  const result = useMemo(() => {
    // Initialize phases array with all 10 phases
    const phases: PhaseProgressSummary[] = [];
    let totalCompleted = 0;
    let totalWorksheets = 0;

    for (let phaseNumber = 1; phaseNumber <= 10; phaseNumber++) {
      const total = WORKSHEETS_PER_PHASE[phaseNumber] || 3;
      totalWorksheets += total;

      // Filter progress entries for this phase
      const phaseEntries = allProgress?.filter((entry) => entry.phase_number === phaseNumber) || [];

      // Count completed worksheets using ACTUAL completion detection
      // This runs the completion criteria against the saved data, not just the boolean flag
      // This ensures we always use the latest completion criteria
      const completed = phaseEntries.filter((entry) => {
        // First check the database boolean (fast path)
        if (entry.completed) {
          return true;
        }

        // If not marked complete, run completion detection on the actual data
        // This catches worksheets saved before criteria were fixed
        if (entry.data && typeof entry.data === 'object') {
          try {
            const config = getWorksheetConfig(entry.worksheet_id);
            if (config?.completionCriteria) {
              const isComplete = detectCompletion(
                entry.data as Record<string, unknown>,
                config.completionCriteria
              );
              if (isComplete) {
                logger.debug(
                  `[useAllPhasesProgress] Worksheet ${entry.worksheet_id} detected as complete via criteria (not marked in DB)`
                );
              }
              return isComplete;
            }
          } catch (err) {
            // If detection fails, fall back to database boolean
            logger.warn(
              `[useAllPhasesProgress] Completion detection failed for ${entry.worksheet_id}:`,
              err
            );
          }
        }

        return false;
      }).length;
      totalCompleted += completed;

      // Check if user has started this phase (has any data)
      const hasStarted = phaseEntries.length > 0;

      // Calculate percentage
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

      phases.push({
        phaseNumber,
        completed,
        total,
        percentage,
        hasStarted,
      });
    }

    // Calculate overall percentage
    const overallPercentage =
      totalWorksheets > 0 ? Math.round((totalCompleted / totalWorksheets) * 100) : 0;

    return {
      phases,
      overallPercentage,
      totalCompleted,
      totalWorksheets,
    };
  }, [allProgress]);

  return {
    ...result,
    isLoading,
    isError,
    refetch,
  };
}
