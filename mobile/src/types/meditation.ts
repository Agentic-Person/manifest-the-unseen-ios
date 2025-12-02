/**
 * Meditation Types
 *
 * Type definitions for meditation, breathing, and music content.
 * Matches the Supabase schema with meditation_type enum.
 */

// =============================================================================
// ENUMS & CONSTANTS
// =============================================================================

/**
 * Type of meditation content
 */
export type MeditationType = 'guided' | 'breathing' | 'music';

/**
 * Narrator gender for guided meditations
 */
export type NarratorGender = 'male' | 'female';

/**
 * Subscription tier required to access content
 */
export type SubscriptionTier = 'novice' | 'awakening' | 'enlightenment';

/**
 * Breathing phase during animation
 */
export type BreathingPhase = 'inhale' | 'holdIn' | 'exhale' | 'holdOut';

// =============================================================================
// MEDITATION TYPES
// =============================================================================

/**
 * Meditation content from database
 */
export interface Meditation {
  id: string;
  title: string;
  description: string | null;
  duration_seconds: number;
  audio_url: string;
  narrator_gender: NarratorGender;
  tier_required: SubscriptionTier;
  type: MeditationType;
  tags: string[];
  order_index: number;
  created_at: string;
}

/**
 * Meditation session tracking
 */
export interface MeditationSession {
  id: string;
  user_id: string;
  meditation_id: string;
  completed: boolean;
  duration_seconds: number | null;
  completed_at: string | null;
  created_at: string;
}

/**
 * Create a new meditation session
 */
export interface CreateMeditationSession {
  user_id: string;
  meditation_id: string;
}

/**
 * Update an existing session (mark complete)
 */
export interface UpdateMeditationSession {
  completed?: boolean;
  duration_seconds?: number;
  completed_at?: string;
}

// =============================================================================
// SESSION STATS
// =============================================================================

/**
 * User's meditation statistics
 */
export interface SessionStats {
  totalMinutes: number;
  sessionCount: number;
  currentStreak: number;
  longestStreak: number;
}

// =============================================================================
// BREATHING PATTERNS
// =============================================================================

/**
 * Breathing pattern timing configuration
 */
export interface BreathingPattern {
  /** Seconds to inhale */
  inhale: number;
  /** Seconds to hold after inhale (0 = skip) */
  holdIn: number;
  /** Seconds to exhale */
  exhale: number;
  /** Seconds to hold after exhale (0 = skip) */
  holdOut: number;
}

/**
 * Predefined breathing patterns
 */
export const BREATHING_PATTERNS: Record<string, BreathingPattern> = {
  /** Box Breathing: 4-4-4-4 - Classic calming technique */
  box: { inhale: 4, holdIn: 4, exhale: 4, holdOut: 4 },

  /** Deep Calm: 5-2-5-2 - Parasympathetic activation */
  deepCalm: { inhale: 5, holdIn: 2, exhale: 5, holdOut: 2 },

  /** Energy Boost: 2-0-2-0 - Quick rhythmic breathing */
  energyBoost: { inhale: 2, holdIn: 0, exhale: 2, holdOut: 0 },

  /** 4-7-8 Relaxation: Deep calming breath */
  relaxation: { inhale: 4, holdIn: 7, exhale: 8, holdOut: 0 },

  /** Coherent Breathing: 5-5 - Heart coherence */
  coherent: { inhale: 5, holdIn: 0, exhale: 5, holdOut: 0 },
} as const;

/**
 * Get phase labels for display
 */
export const BREATHING_PHASE_LABELS: Record<BreathingPhase, string> = {
  inhale: 'Breathe In',
  holdIn: 'Hold',
  exhale: 'Breathe Out',
  holdOut: 'Hold',
};

// =============================================================================
// AUDIO PLAYER TYPES
// =============================================================================

/**
 * Audio playback state
 */
export type PlaybackState =
  | 'idle'
  | 'loading'
  | 'playing'
  | 'paused'
  | 'ended'
  | 'error';

/**
 * Audio player progress info
 */
export interface AudioProgress {
  /** Current position in milliseconds */
  position: number;
  /** Total duration in milliseconds */
  duration: number;
  /** Progress ratio 0-1 */
  progress: number;
}

// =============================================================================
// DISPLAY HELPERS
// =============================================================================

/**
 * Format seconds as "X min" display
 */
export function formatDuration(seconds: number): string {
  const minutes = Math.round(seconds / 60);
  return `${minutes} min`;
}

/**
 * Format milliseconds as "M:SS" display
 */
export function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Get icon name based on meditation type
 */
export function getMeditationIcon(type: MeditationType): string {
  switch (type) {
    case 'guided':
      return 'person-outline'; // or 'body-outline'
    case 'breathing':
      return 'leaf-outline'; // or 'fitness-outline'
    case 'music':
      return 'musical-notes-outline';
    default:
      return 'ellipse-outline';
  }
}

/**
 * Get display label for meditation type
 */
export function getMeditationTypeLabel(type: MeditationType): string {
  switch (type) {
    case 'guided':
      return 'Meditations';
    case 'breathing':
      return 'Breathing';
    case 'music':
      return 'Music';
    default:
      return 'Unknown';
  }
}
