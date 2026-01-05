/**
 * Guru Feature Type Definitions
 *
 * Types for phase-based analysis conversations with the AI Guru.
 * Premium feature exclusive to Enlightenment tier.
 */

/**
 * Guru Message
 * Represents a single message in a Guru conversation
 */
export interface GuruMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

/**
 * Guru Conversation
 * Complete conversation with phase context
 */
export interface GuruConversation {
  id: string;
  user_id: string;
  title: string;
  messages: GuruMessage[];
  conversation_type: 'guru';
  guru_phase: number;
  created_at: string;
  updated_at: string;
}

/**
 * Guru Conversation Insert
 * Type for creating new conversations
 */
export interface GuruConversationInsert {
  user_id: string;
  phase_number: number;
  messages: GuruMessage[];
  updated_at?: string;
}

/**
 * Guru Analysis Request
 * Sent to Edge Function for AI analysis
 */
export interface GuruAnalysisRequest {
  conversationId?: string;
  phaseNumber: number;
  userMessage: string;
  worksheetData: Record<string, unknown>[];
}

/**
 * Guru Analysis Response
 * Response from Edge Function
 */
export interface GuruAnalysisResponse {
  conversationId: string;
  message: GuruMessage;
  error?: string;
}

/**
 * Meditation Suggestion
 * Recommended meditation and breathing based on low life areas
 */
export interface MeditationSuggestion {
  meditation: string;
  breathing: string;
  reason: string;
  lifeAreas: string[];
}

/**
 * Enhanced Guru Analysis Response
 * Extended response with meditation/breathing suggestions
 */
export interface EnhancedGuruAnalysisResponse extends GuruAnalysisResponse {
  suggestions?: MeditationSuggestion;
  lowAreas?: string[];
}

/**
 * Phase Analysis
 * Initial analysis generated when user selects a completed phase
 */
export interface PhaseAnalysis {
  phaseNumber: number;
  phaseName: string;
  analysis: string;
  suggestedQuestions: string[];
  createdAt: string;
}

/**
 * Completed Phase
 * Summary of a completed phase for selection UI
 */
export interface CompletedPhase {
  phaseNumber: number;
  phaseName: string;
  completedAt: string;
  worksheetCount: number;
}

/**
 * Guru UI State
 */
export type GuruState = 'locked' | 'selecting' | 'loading' | 'conversation';

/**
 * Prayer type (mirrors meditation structure)
 */
export interface Prayer {
  id: string;
  title: string;
  description: string;
  content: string;
  /** Path to audio file in Supabase Storage. When present, enables synchronized line-by-line text display. */
  audio_url: string | null;
  duration_seconds: number;
  tier_required: 'novice' | 'awakening' | 'enlightenment';
  life_areas: string[];
  tags: string[];
  order_index: number;
  created_at: string;
}

/**
 * Guru recommendations returned with analysis
 */
export interface GuruRecommendations {
  meditations: Array<{
    id: string;
    title: string;
    description: string;
    life_areas: string[];
  }>;
  prayers: Array<{
    id: string;
    title: string;
    description: string;
    life_areas: string[];
  }>;
  breathing: {
    name: string;
    reason: string;
  };
}

/**
 * User insights extracted from worksheets
 */
export interface UserInsights {
  lowLifeAreas: string[];
  topWeaknesses: string[];
  badHabits: string[];
  highIntensityFears: string[];
  unrestructuredBeliefs: string[];
}

/**
 * Phase Names
 */
export const PHASE_NAMES: Record<number, string> = {
  1: 'Self-Evaluation',
  2: 'Values & Vision',
  3: 'Goal Setting',
  4: 'Facing Fears & Limiting Beliefs',
  5: 'Cultivating Self-Love & Self-Care',
  6: 'Manifestation Techniques',
  7: 'Practicing Gratitude',
  8: 'Turning Envy Into Inspiration',
  9: 'Trust & Surrender',
  10: 'Trust & Letting Go',
};
