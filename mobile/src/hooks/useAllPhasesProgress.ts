/**
 * All Phases Progress Hook
 *
 * Fetches progress for all 10 workbook phases efficiently in a single query.
 * Returns per-phase progress summaries and overall completion percentage.
 */

import { useMemo } from 'react';
import { useAllWorkbookProgress } from './useWorkbook';
import { WORKSHEETS_PER_PHASE } from '../types/workbook';

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
  if (percentage <= 25) return '#dc2626'; // Red
  if (percentage <= 50) return '#c9a227'; // Orange
  if (percentage <= 75) return '#8b6914'; // Yellow/Amber
  return '#2d5a4a'; // Green
}

/**
 * Get a motivational message based on overall progress
 */
export function getProgressMessage(percentage: number): string {
  if (percentage === 0) return 'Begin your transformation journey';
  if (percentage <= 25) return "You've taken the first steps!";
  if (percentage <= 50) return 'Making great progress!';
  if (percentage <= 75) return 'Over halfway there!';
  if (percentage < 100) return 'Almost complete!';
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
      const phaseEntries = allProgress?.filter(
        (entry) => entry.phase_number === phaseNumber
      ) || [];

      // Count completed worksheets (marked as complete)
      const completed = phaseEntries.filter((entry) => entry.completed).length;
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
