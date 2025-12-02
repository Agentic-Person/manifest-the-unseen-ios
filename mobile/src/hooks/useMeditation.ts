/**
 * Meditation Hooks
 *
 * TanStack Query hooks for fetching meditation data and tracking sessions.
 * Provides caching, optimistic updates, and automatic refetching.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../stores/authStore';
import {
  getMeditations,
  getMeditationById,
  getGuidedMeditations,
  getBreathingExercises,
  getMeditationMusic,
  createSession,
  completeSession,
  getUserSessions,
  getSessionStats,
  getMeditationAudioUrl,
} from '../services/meditationService';
import type {
  MeditationType,
  NarratorGender,
  CreateMeditationSession,
} from '../types/meditation';

/**
 * Query keys for cache management
 */
export const meditationKeys = {
  all: ['meditations'] as const,
  lists: () => [...meditationKeys.all, 'list'] as const,
  list: (type?: MeditationType, narrator?: NarratorGender) =>
    [...meditationKeys.lists(), { type, narrator }] as const,
  detail: (id: string) => [...meditationKeys.all, 'detail', id] as const,
  sessions: (userId: string) => [...meditationKeys.all, 'sessions', userId] as const,
  stats: (userId: string) => [...meditationKeys.all, 'stats', userId] as const,
};

// =============================================================================
// MEDITATION QUERIES
// =============================================================================

/**
 * Fetch all meditations, optionally filtered by type and narrator
 *
 * @param type - Filter by meditation type
 * @param narrator - Filter by narrator gender (only for guided)
 *
 * @example
 * ```tsx
 * // All meditations
 * const { data: meditations } = useMeditations();
 *
 * // Only breathing exercises
 * const { data: breathing } = useMeditations('breathing');
 *
 * // Only female-narrated guided meditations
 * const { data: guided } = useMeditations('guided', 'female');
 * ```
 */
export function useMeditations(type?: MeditationType, narrator?: NarratorGender) {
  return useQuery({
    queryKey: meditationKeys.list(type, narrator),
    queryFn: () => getMeditations(type, narrator),
    staleTime: 1000 * 60 * 30, // 30 minutes (content rarely changes)
  });
}

/**
 * Fetch a single meditation by ID
 *
 * @param id - Meditation ID
 *
 * @example
 * ```tsx
 * const { data: meditation, isLoading } = useMeditation(meditationId);
 * ```
 */
export function useMeditation(id: string) {
  return useQuery({
    queryKey: meditationKeys.detail(id),
    queryFn: () => getMeditationById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 30,
  });
}

/**
 * Fetch guided meditations, optionally filtered by narrator
 *
 * @param narrator - Filter by narrator gender
 *
 * @example
 * ```tsx
 * const { data: guided } = useGuidedMeditations('female');
 * ```
 */
export function useGuidedMeditations(narrator?: NarratorGender) {
  return useQuery({
    queryKey: meditationKeys.list('guided', narrator),
    queryFn: () => getGuidedMeditations(narrator),
    staleTime: 1000 * 60 * 30,
  });
}

/**
 * Fetch all breathing exercises
 *
 * @example
 * ```tsx
 * const { data: exercises } = useBreathingExercises();
 * ```
 */
export function useBreathingExercises() {
  return useQuery({
    queryKey: meditationKeys.list('breathing'),
    queryFn: getBreathingExercises,
    staleTime: 1000 * 60 * 30,
  });
}

/**
 * Fetch all meditation music
 *
 * @example
 * ```tsx
 * const { data: music } = useMeditationMusic();
 * ```
 */
export function useMeditationMusic() {
  return useQuery({
    queryKey: meditationKeys.list('music'),
    queryFn: getMeditationMusic,
    staleTime: 1000 * 60 * 30,
  });
}

// =============================================================================
// SESSION QUERIES & MUTATIONS
// =============================================================================

/**
 * Fetch user's meditation sessions
 *
 * @param limit - Maximum number of sessions (default: 50)
 *
 * @example
 * ```tsx
 * const { data: sessions } = useMeditationSessions();
 * ```
 */
export function useMeditationSessions(limit: number = 50) {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: meditationKeys.sessions(user?.id || ''),
    queryFn: () => getUserSessions(user!.id, limit),
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Fetch user's meditation statistics
 *
 * @example
 * ```tsx
 * const { data: stats } = useMeditationStats();
 * // stats.totalMinutes, stats.sessionCount, stats.currentStreak, stats.longestStreak
 * ```
 */
export function useMeditationStats() {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: meditationKeys.stats(user?.id || ''),
    queryFn: () => getSessionStats(user!.id),
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Create a new meditation session
 * Called when user starts playing a meditation
 *
 * @example
 * ```tsx
 * const { mutate: startSession, isPending } = useStartMeditationSession();
 *
 * startSession({
 *   meditation_id: 'meditation-uuid',
 * }, {
 *   onSuccess: (session) => {
 *     console.log('Session started:', session.id);
 *   },
 * });
 * ```
 */
export function useStartMeditationSession() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: (data: Omit<CreateMeditationSession, 'user_id'>) => {
      if (!user?.id) throw new Error('User not authenticated');
      return createSession({
        user_id: user.id,
        meditation_id: data.meditation_id,
      });
    },
    onSuccess: () => {
      if (user?.id) {
        // Invalidate sessions and stats
        queryClient.invalidateQueries({ queryKey: meditationKeys.sessions(user.id) });
      }
    },
  });
}

/**
 * Complete a meditation session
 * Called when user finishes playing a meditation
 *
 * @example
 * ```tsx
 * const { mutate: finishSession, isPending } = useCompleteMeditationSession();
 *
 * finishSession({
 *   sessionId: 'session-uuid',
 *   durationSeconds: 720, // 12 minutes
 * }, {
 *   onSuccess: (session) => {
 *     console.log('Session completed!');
 *   },
 * });
 * ```
 */
export function useCompleteMeditationSession() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: ({
      sessionId,
      durationSeconds,
    }: {
      sessionId: string;
      durationSeconds: number;
    }) => completeSession(sessionId, durationSeconds),
    onSuccess: () => {
      if (user?.id) {
        // Invalidate sessions and stats (streak may have changed)
        queryClient.invalidateQueries({ queryKey: meditationKeys.sessions(user.id) });
        queryClient.invalidateQueries({ queryKey: meditationKeys.stats(user.id) });
      }
    },
  });
}

// =============================================================================
// UTILITY EXPORTS
// =============================================================================

/**
 * Re-export the audio URL helper for components
 */
export { getMeditationAudioUrl };
