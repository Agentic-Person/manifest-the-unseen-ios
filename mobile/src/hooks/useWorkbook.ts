/**
 * Workbook Hooks
 *
 * TanStack Query hooks for fetching and mutating workbook data.
 * Provides caching, optimistic updates, and automatic refetching.
 */

import { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../stores/authStore';
import type { WorkbookProgressWithCalculated } from '../types/workbook';
import {
  getWorkbookProgress,
  getAllWorkbookProgress,
  getPhaseProgress,
  upsertWorkbookProgress,
  markWorksheetComplete,
  deleteWorkbookProgress,
} from '../services/workbook';
import { logger } from '../utils/logger';

/**
 * Query keys for cache management
 */
export const workbookKeys = {
  all: ['workbook'] as const,
  progress: (userId: string) => [...workbookKeys.all, 'progress', userId] as const,
  worksheet: (userId: string, phase: number, worksheet: string) =>
    [...workbookKeys.progress(userId), phase, worksheet] as const,
  phase: (userId: string, phase: number) =>
    [...workbookKeys.progress(userId), 'phase', phase] as const,
};

/**
 * Fetch single worksheet progress
 *
 * @param phaseNumber - The phase number (1-10)
 * @param worksheetId - The worksheet identifier
 *
 * @example
 * ```tsx
 * const { data, isLoading } = useWorkbookProgress(1, 'wheel-of-life');
 * // data.progress will be 0, 50, or 100
 * ```
 */
export function useWorkbookProgress(phaseNumber: number, worksheetId: string) {
  const user = useAuthStore((state) => state.user);

  logger.debug('useWorkbookProgress hook called', {
    phaseNumber,
    worksheetId,
    userId: user?.id,
    enabled: !!user?.id
  });

  const query = useQuery({
    queryKey: workbookKeys.worksheet(user?.id || '', phaseNumber, worksheetId),
    queryFn: async () => {
      logger.debug('useWorkbookProgress query executing', { phaseNumber, worksheetId, userId: user!.id });
      const result = await getWorkbookProgress(user!.id, phaseNumber, worksheetId);
      logger.debug('useWorkbookProgress query result', { phaseNumber, worksheetId, hasData: !!result });
      return result;
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Calculate progress on-the-fly (0%, 50%, or 100%)
  const dataWithProgress = useMemo<WorkbookProgressWithCalculated | undefined>(() => {
    if (!query.data) return undefined;

    let progress = 0;
    if (query.data.completed) {
      progress = 100;
    } else if (query.data.data && Object.keys(query.data.data).length > 0) {
      progress = 50;
    }

    return { ...query.data, progress };
  }, [query.data]);

  return {
    ...query,
    data: dataWithProgress,
  };
}

/**
 * Fetch all progress for user
 *
 * @example
 * ```tsx
 * const { data: allProgress } = useAllWorkbookProgress();
 * const completedCount = allProgress?.filter(p => p.completed).length;
 * ```
 */
export function useAllWorkbookProgress() {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: workbookKeys.progress(user?.id || ''),
    queryFn: () => getAllWorkbookProgress(user!.id),
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Fetch phase progress summary
 *
 * @param phaseNumber - The phase number (1-10)
 *
 * @example
 * ```tsx
 * const { data } = usePhaseProgress(1);
 * console.log(`${data?.completed}/${data?.total} completed`);
 * ```
 */
export function usePhaseProgress(phaseNumber: number) {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: workbookKeys.phase(user?.id || '', phaseNumber),
    queryFn: () => getPhaseProgress(user!.id, phaseNumber),
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Save workbook progress mutation
 *
 * @example
 * ```tsx
 * const { mutate: save, isPending } = useSaveWorkbook();
 *
 * save({
 *   phaseNumber: 1,
 *   worksheetId: 'wheel-of-life',
 *   data: { career: 7, health: 8, ... },
 * });
 * ```
 */
export function useSaveWorkbook() {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      phaseNumber,
      worksheetId,
      data,
      completed = false,
    }: {
      phaseNumber: number;
      worksheetId: string;
      data: Record<string, unknown>;
      completed?: boolean;
    }) => {
      if (!user?.id) throw new Error('User not authenticated');
      return upsertWorkbookProgress(user.id, phaseNumber, worksheetId, data, completed);
    },
    onSuccess: (result) => {
      // Update cache directly instead of invalidating (prevents refetch loops)
      const worksheetKey = workbookKeys.worksheet(
        user!.id,
        result.phase_number,
        result.worksheet_id
      );
      queryClient.setQueryData(worksheetKey, result);

      // Only invalidate the broad progress query (acceptable cost)
      queryClient.invalidateQueries({
        queryKey: workbookKeys.progress(user!.id),
      });
    },
    onError: (error, variables) => {
      // Log mutation errors for debugging
      logger.error(
        `useSaveWorkbook mutation failed for phase ${variables.phaseNumber}, worksheet ${variables.worksheetId}`,
        error
      );
    },
  });
}

/**
 * Mark worksheet complete mutation
 *
 * @example
 * ```tsx
 * const { mutate: markComplete } = useMarkComplete();
 *
 * markComplete({ phaseNumber: 1, worksheetId: 'wheel-of-life' });
 * ```
 */
export function useMarkComplete() {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      phaseNumber,
      worksheetId,
    }: {
      phaseNumber: number;
      worksheetId: string;
    }) => {
      if (!user?.id) throw new Error('User not authenticated');
      return markWorksheetComplete(user.id, phaseNumber, worksheetId);
    },
    onSuccess: (result) => {
      // Update cache directly instead of invalidating (prevents refetch loops)
      const worksheetKey = workbookKeys.worksheet(
        user!.id,
        result.phase_number,
        result.worksheet_id
      );
      queryClient.setQueryData(worksheetKey, result);

      // Only invalidate the broad progress query (acceptable cost)
      queryClient.invalidateQueries({
        queryKey: workbookKeys.progress(user!.id),
      });
    },
  });
}

/**
 * Delete worksheet progress mutation
 *
 * @example
 * ```tsx
 * const { mutate: deleteProgress } = useDeleteWorkbookProgress();
 *
 * deleteProgress({ phaseNumber: 1, worksheetId: 'wheel-of-life' });
 * ```
 */
export function useDeleteWorkbookProgress() {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      phaseNumber,
      worksheetId,
    }: {
      phaseNumber: number;
      worksheetId: string;
    }) => {
      if (!user?.id) throw new Error('User not authenticated');
      return deleteWorkbookProgress(user.id, phaseNumber, worksheetId);
    },
    onSuccess: (_, variables) => {
      // Clear cache directly for deleted worksheet (prevents refetch loops)
      const worksheetKey = workbookKeys.worksheet(
        user!.id,
        variables.phaseNumber,
        variables.worksheetId
      );
      queryClient.setQueryData(worksheetKey, null);

      // Only invalidate the broad progress query (acceptable cost)
      queryClient.invalidateQueries({
        queryKey: workbookKeys.progress(user!.id),
      });
    },
  });
}
