/**
 * Prayer Service
 *
 * Supabase CRUD operations for prayers with audio support.
 * Used by the prayer player feature for synchronized text display.
 */

import { supabase, getPublicUrl } from './supabase';
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
  const { data, error } = await supabase
    .from('prayers')
    .select('*')
    .not('audio_url', 'is', null)
    .order('order_index', { ascending: true });

  if (error) throw error;
  return (data as Prayer[]) || [];
}

/**
 * Get a single prayer by ID
 */
export async function getPrayerById(id: string): Promise<Prayer | null> {
  const { data, error } = await supabase
    .from('prayers')
    .select('*')
    .eq('id', id)
    .single();

  // PGRST116 = no rows returned
  if (error && error.code !== 'PGRST116') throw error;
  return data as Prayer | null;
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
 * Audio files are stored in Supabase Storage 'prayer-audio' bucket
 */
export function getPrayerAudioUrl(audioPath: string): string {
  // If already a full URL, return as-is
  if (audioPath.startsWith('http')) {
    return audioPath;
  }

  // Otherwise, get public URL from Supabase Storage
  return getPublicUrl('prayer-audio', audioPath);
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
