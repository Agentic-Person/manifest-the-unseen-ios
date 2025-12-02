/**
 * Meditation Service
 *
 * Supabase CRUD operations for meditations, breathing exercises,
 * meditation music, and session tracking.
 */

import { supabase, getPublicUrl } from './supabase';
import type {
  Meditation,
  MeditationType,
  NarratorGender,
  MeditationSession,
  CreateMeditationSession,
  SessionStats,
} from '../types/meditation';

// =============================================================================
// MEDITATION QUERIES
// =============================================================================

/**
 * Get all meditations, optionally filtered by type and narrator
 */
export async function getMeditations(
  type?: MeditationType,
  narrator?: NarratorGender
): Promise<Meditation[]> {
  let query = supabase
    .from('meditations')
    .select('*')
    .order('order_index', { ascending: true });

  if (type) {
    query = query.eq('type', type);
  }

  if (narrator) {
    query = query.eq('narrator_gender', narrator);
  }

  const { data, error } = await query;

  if (error) throw error;
  return (data as Meditation[]) || [];
}

/**
 * Get a single meditation by ID
 */
export async function getMeditationById(id: string): Promise<Meditation | null> {
  const { data, error } = await supabase
    .from('meditations')
    .select('*')
    .eq('id', id)
    .single();

  // PGRST116 = no rows returned
  if (error && error.code !== 'PGRST116') throw error;
  return data as Meditation | null;
}

/**
 * Get meditations by type (convenience function)
 */
export async function getMeditationsByType(
  type: MeditationType
): Promise<Meditation[]> {
  return getMeditations(type);
}

/**
 * Get guided meditations filtered by narrator preference
 */
export async function getGuidedMeditations(
  narrator?: NarratorGender
): Promise<Meditation[]> {
  return getMeditations('guided', narrator);
}

/**
 * Get breathing exercises
 */
export async function getBreathingExercises(): Promise<Meditation[]> {
  return getMeditations('breathing');
}

/**
 * Get meditation music
 */
export async function getMeditationMusic(): Promise<Meditation[]> {
  return getMeditations('music');
}

// =============================================================================
// AUDIO URL HELPERS
// =============================================================================

/**
 * Get the full public URL for a meditation audio file
 * Audio files are stored in Supabase Storage 'meditations' bucket
 */
export function getMeditationAudioUrl(audioPath: string): string {
  // If already a full URL, return as-is
  if (audioPath.startsWith('http')) {
    return audioPath;
  }

  // Otherwise, get public URL from Supabase Storage
  return getPublicUrl('meditations', audioPath);
}

// =============================================================================
// SESSION TRACKING
// =============================================================================

/**
 * Create a new meditation session (called when user starts playing)
 */
export async function createSession(
  session: CreateMeditationSession
): Promise<MeditationSession> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase
    .from('meditation_sessions') as any)
    .insert({
      user_id: session.user_id,
      meditation_id: session.meditation_id,
      completed: false,
      duration_seconds: null,
      completed_at: null,
    })
    .select()
    .single();

  if (error) throw error;
  return data as MeditationSession;
}

/**
 * Mark a session as complete
 */
export async function completeSession(
  sessionId: string,
  durationSeconds: number
): Promise<MeditationSession> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase
    .from('meditation_sessions') as any)
    .update({
      completed: true,
      duration_seconds: durationSeconds,
      completed_at: new Date().toISOString(),
    })
    .eq('id', sessionId)
    .select()
    .single();

  if (error) throw error;
  return data as MeditationSession;
}

/**
 * Get user's meditation sessions
 */
export async function getUserSessions(
  userId: string,
  limit: number = 50
): Promise<MeditationSession[]> {
  const { data, error } = await supabase
    .from('meditation_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data as MeditationSession[]) || [];
}

/**
 * Get completed sessions for a user
 */
export async function getCompletedSessions(
  userId: string
): Promise<MeditationSession[]> {
  const { data, error } = await supabase
    .from('meditation_sessions')
    .select('*')
    .eq('user_id', userId)
    .eq('completed', true)
    .order('completed_at', { ascending: false });

  if (error) throw error;
  return (data as MeditationSession[]) || [];
}

// =============================================================================
// SESSION STATISTICS
// =============================================================================

/**
 * Calculate streak from completed sessions
 * A streak is consecutive days with at least one completed session
 */
function calculateStreaks(sessions: MeditationSession[]): {
  currentStreak: number;
  longestStreak: number;
} {
  if (sessions.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  // Get unique dates (YYYY-MM-DD format) from completed sessions
  const uniqueDates = new Set<string>();
  sessions.forEach((session) => {
    if (session.completed_at) {
      const date = new Date(session.completed_at).toISOString().split('T')[0];
      uniqueDates.add(date);
    }
  });

  if (uniqueDates.size === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  // Sort dates descending (most recent first)
  const sortedDates = Array.from(uniqueDates).sort().reverse();

  // Check if today or yesterday has a session (for current streak)
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  // Calculate streaks by checking consecutive days
  for (let i = 0; i < sortedDates.length; i++) {
    if (i === 0) {
      // First date - start streak if it's today or yesterday
      if (sortedDates[i] === today || sortedDates[i] === yesterday) {
        tempStreak = 1;
      } else {
        // Most recent session is older than yesterday - no current streak
        tempStreak = 1; // Count for longest streak calculation
      }
    } else {
      const currentDate = new Date(sortedDates[i]);
      const prevDate = new Date(sortedDates[i - 1]);
      const dayDiff = Math.round(
        (prevDate.getTime() - currentDate.getTime()) / 86400000
      );

      if (dayDiff === 1) {
        // Consecutive day
        tempStreak++;
      } else {
        // Streak broken - update longest and reset
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
  }

  // Final update for longest streak
  longestStreak = Math.max(longestStreak, tempStreak);

  // Current streak is tempStreak only if most recent date is today/yesterday
  if (sortedDates[0] === today || sortedDates[0] === yesterday) {
    // Recalculate current streak from the beginning
    currentStreak = 1;
    for (let i = 1; i < sortedDates.length; i++) {
      const currentDate = new Date(sortedDates[i]);
      const prevDate = new Date(sortedDates[i - 1]);
      const dayDiff = Math.round(
        (prevDate.getTime() - currentDate.getTime()) / 86400000
      );

      if (dayDiff === 1) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  return { currentStreak, longestStreak };
}

/**
 * Get session statistics for a user
 */
export async function getSessionStats(userId: string): Promise<SessionStats> {
  // Fetch all completed sessions
  const sessions = await getCompletedSessions(userId);

  if (sessions.length === 0) {
    return {
      totalMinutes: 0,
      sessionCount: 0,
      currentStreak: 0,
      longestStreak: 0,
    };
  }

  // Calculate total minutes
  const totalSeconds = sessions.reduce(
    (sum, session) => sum + (session.duration_seconds || 0),
    0
  );
  const totalMinutes = Math.round(totalSeconds / 60);

  // Calculate session count
  const sessionCount = sessions.length;

  // Calculate streaks
  const { currentStreak, longestStreak } = calculateStreaks(sessions);

  return {
    totalMinutes,
    sessionCount,
    currentStreak,
    longestStreak,
  };
}

// =============================================================================
// EXPORTS
// =============================================================================

export {
  // Re-export types for convenience
  type Meditation,
  type MeditationType,
  type NarratorGender,
  type MeditationSession,
  type SessionStats,
};
