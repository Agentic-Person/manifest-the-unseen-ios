/**
 * Prayer Service
 *
 * Supabase CRUD operations for prayers with audio support.
 * Used by the prayer player feature for synchronized text display.
 */

import { supabase, getPublicUrl } from './supabase';
import { logger } from '../utils/logger';
import type { Prayer } from '../types/guru';

// =============================================================================
// PRAYER QUERIES
// =============================================================================

/**
 * Get all prayers
 */
export async function getPrayers(): Promise<Prayer[]> {
  const { data, error } = await supabase
    .from('prayers')
    .select('*')
    .order('order_index', { ascending: true });

  if (error) throw error;
  return (data as Prayer[]) || [];
}

/**
 * Get prayers that have audio files (for prayer player feature)
 * Only returns prayers with audio_url set
 */
export async function getPrayersWithAudio(): Promise<Prayer[]> {
  logger.debug('[getPrayersWithAudio] Starting query...');

  // Use direct fetch to bypass Supabase client hanging issue on web
  const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
  const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

  const url = `${SUPABASE_URL}/rest/v1/prayers?select=*&audio_url=not.is.null&order=order_index.asc`;

  logger.debug('[getPrayersWithAudio] Fetching via direct fetch...');
  const startTime = Date.now();

  try {
    const response = await fetch(url, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    logger.debug('[getPrayersWithAudio] Fetch response status:', response.status);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    logger.debug('[getPrayersWithAudio] Query complete in', Date.now() - startTime, 'ms', { dataCount: data?.length });

    return (data as Prayer[]) || [];
  } catch (err) {
    logger.error('[getPrayersWithAudio] Query failed after', Date.now() - startTime, 'ms', err);
    throw err;
  }
}

/**
 * Get a single prayer by ID
 */
export async function getPrayerById(id: string): Promise<Prayer | null> {
  if (!id) return null;

  logger.debug('[getPrayerById] Fetching prayer:', id);

  // Use direct fetch to bypass Supabase client hanging issue on web
  const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
  const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

  const url = `${SUPABASE_URL}/rest/v1/prayers?select=*&id=eq.${id}`;

  try {
    const response = await fetch(url, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.pgrst.object+json', // Return single object instead of array
      },
    });

    logger.debug('[getPrayerById] Fetch response status:', response.status);

    // 406 means no rows found with Accept: application/vnd.pgrst.object+json
    if (response.status === 406) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    logger.debug('[getPrayerById] Found prayer:', data?.title);

    return data as Prayer | null;
  } catch (err) {
    console.error('[getPrayerById] Query failed:', err);
    throw err;
  }
}

/**
 * Get prayers by life area (for Guru recommendations)
 */
export async function getPrayersByLifeArea(lifeArea: string): Promise<Prayer[]> {
  const { data, error } = await supabase
    .from('prayers')
    .select('*')
    .contains('life_areas', [lifeArea])
    .order('order_index', { ascending: true });

  if (error) throw error;
  return (data as Prayer[]) || [];
}

/**
 * Get prayers by tier
 */
export async function getPrayersByTier(
  tier: 'novice' | 'awakening' | 'enlightenment'
): Promise<Prayer[]> {
  const { data, error } = await supabase
    .from('prayers')
    .select('*')
    .eq('tier_required', tier)
    .order('order_index', { ascending: true });

  if (error) throw error;
  return (data as Prayer[]) || [];
}

// =============================================================================
// AUDIO URL HELPERS
// =============================================================================

/**
 * Get the full public URL for a prayer audio file
 * Audio files are stored in Supabase Storage 'meditation-audio' bucket under 'prayers/' folder
 */
export function getPrayerAudioUrl(audioPath: string): string {
  // If already a full URL, return as-is
  if (audioPath.startsWith('http')) {
    return audioPath;
  }

  // Prayers are stored in meditation-audio bucket under prayers/ folder
  // audioPath should be like "prayers/the-presence-within.m4a"
  return getPublicUrl('meditation-audio', audioPath);
}

/**
 * Check if a prayer has audio available
 */
export function hasPrayerAudio(prayer: Prayer): boolean {
  return prayer.audio_url !== null && prayer.audio_url.length > 0;
}

// =============================================================================
// EXPORTS
// =============================================================================

export {
  // Re-export types for convenience
  type Prayer,
};
