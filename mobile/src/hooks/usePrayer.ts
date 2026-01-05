/**
 * Prayer Hooks
 *
 * TanStack Query hooks for fetching prayer data.
 * Used by the prayer player feature and Guru AI recommendations.
 */

import { useQuery } from '@tanstack/react-query';
import {
  getPrayers,
  getPrayersWithAudio,
  getPrayerById,
  getPrayersByLifeArea,
  getPrayerAudioUrl,
  hasPrayerAudio,
} from '../services/prayerService';
import type { Prayer } from '../types/guru';

/**
 * Query keys for cache management
 */
export const prayerKeys = {
  all: ['prayers'] as const,
  lists: () => [...prayerKeys.all, 'list'] as const,
  withAudio: () => [...prayerKeys.lists(), 'withAudio'] as const,
  byLifeArea: (lifeArea: string) => [...prayerKeys.lists(), 'lifeArea', lifeArea] as const,
  detail: (id: string) => [...prayerKeys.all, 'detail', id] as const,
};

// =============================================================================
// PRAYER QUERIES
// =============================================================================

/**
 * Fetch all prayers
 *
 * @example
 * ```tsx
 * const { data: prayers } = usePrayers();
 * ```
 */
export function usePrayers() {
  return useQuery({
    queryKey: prayerKeys.lists(),
    queryFn: getPrayers,
    staleTime: 1000 * 60 * 30, // 30 minutes (content rarely changes)
  });
}

/**
 * Fetch prayers that have audio files
 * Used by the prayer player feature in the Meditate tab
 *
 * @example
 * ```tsx
 * const { data: prayers } = usePrayersWithAudio();
 *
 * // Filter for navigation
 * prayers?.map(prayer => (
 *   <PrayerCard
 *     key={prayer.id}
 *     prayer={prayer}
 *     onPress={() => navigateToPlayer(prayer)}
 *   />
 * ));
 * ```
 */
export function usePrayersWithAudio() {
  return useQuery({
    queryKey: prayerKeys.withAudio(),
    queryFn: getPrayersWithAudio,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}

/**
 * Fetch a single prayer by ID
 *
 * @param id - Prayer ID
 *
 * @example
 * ```tsx
 * const { data: prayer, isLoading } = usePrayer(prayerId);
 * ```
 */
export function usePrayer(id: string) {
  return useQuery({
    queryKey: prayerKeys.detail(id),
    queryFn: () => getPrayerById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 30,
  });
}

/**
 * Fetch prayers by life area
 * Used by Guru AI to recommend relevant prayers
 *
 * @param lifeArea - Life area to filter by (e.g., 'career', 'health', 'relationships')
 *
 * @example
 * ```tsx
 * const { data: careerPrayers } = usePrayersByLifeArea('career');
 * ```
 */
export function usePrayersByLifeArea(lifeArea: string) {
  return useQuery({
    queryKey: prayerKeys.byLifeArea(lifeArea),
    queryFn: () => getPrayersByLifeArea(lifeArea),
    enabled: !!lifeArea,
    staleTime: 1000 * 60 * 30,
  });
}

// =============================================================================
// UTILITY EXPORTS
// =============================================================================

/**
 * Re-export utility functions for components
 */
export { getPrayerAudioUrl, hasPrayerAudio };

/**
 * Re-export Prayer type for convenience
 */
export type { Prayer };
