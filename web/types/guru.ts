/**
 * Guru AI Chat Types
 *
 * Types for the Guru AI phase analysis feature
 */

/**
 * Message role in conversation
 */
export type MessageRole = 'user' | 'assistant'

/**
 * Single message in a Guru conversation
 */
export interface GuruMessage {
  role: MessageRole
  content: string
  timestamp: string // ISO format
}

/**
 * Guru conversation from database
 */
export interface GuruConversation {
  id: string
  user_id: string
  title: string
  messages: GuruMessage[]
  conversation_type: 'guru'
  guru_phase: number
  created_at: string
  updated_at: string
}

/**
 * Request to guru-analysis Edge Function
 */
export interface GuruAnalysisRequest {
  message: string
  phaseNumber: number
  conversationId?: string
  isInitialAnalysis?: boolean
}

/**
 * Response from guru-analysis Edge Function
 */
export interface GuruAnalysisResponse {
  reply: string
  conversationId: string
  phaseNumber: number
  isInitialAnalysis: boolean
  context: {
    knowledgeMatches: number
    worksheetsAnalyzed: number
  }
}

/**
 * Error response from Guru API
 */
export interface GuruAnalysisError {
  error: string
  code?: 'SUBSCRIPTION_REQUIRED' | 'PHASE_INCOMPLETE' | 'RATE_LIMIT_EXCEEDED'
  details?: {
    phaseNumber: number
    expectedWorksheets: number
    foundWorksheets: number
    completedWorksheets: number
    incompleteWorksheets: string[]
  }
}

/**
 * Phase info for Guru selection
 */
export interface PhaseInfo {
  phaseNumber: number
  title: string
  description: string
  worksheetCount: number
  completedWorksheets: number
  isComplete: boolean
}

/**
 * Guru chat state
 */
export interface GuruChatState {
  selectedPhase: number | null
  conversations: GuruConversation[]
  currentConversation: GuruConversation | null
  messages: GuruMessage[]
  isLoading: boolean
  isSending: boolean
  error: string | null
}

/**
 * Worksheets per phase (from guru-analysis Edge Function)
 */
export const WORKSHEETS_PER_PHASE: Record<number, number> = {
  1: 11, // WheelOfLife, FeelWheel, SWOT, Habits, Values, ABC, StrengthsWeaknesses, ComfortZone, KnowYourself, AbilitiesRating, ThoughtAwareness
  2: 3,
  3: 3,
  4: 3,
  5: 3,
  6: 3,
  7: 3,
  8: 3,
  9: 3,
  10: 3,
}

/**
 * Phase titles
 */
export const PHASE_TITLES: Record<number, string> = {
  1: 'Self-Evaluation',
  2: 'Values & Vision',
  3: 'Goal Setting',
  4: 'Facing Fears & Limiting Beliefs',
  5: 'Self-Love & Self-Care',
  6: 'Manifestation Techniques',
  7: 'Practicing Gratitude',
  8: 'Turning Envy Into Inspiration',
  9: 'Trust & Surrender',
  10: 'Trust & Letting Go',
}

/**
 * Get phase title by number
 */
export function getPhaseTitle(phaseNumber: number): string {
  return PHASE_TITLES[phaseNumber] || `Phase ${phaseNumber}`
}

/**
 * Get required worksheets for phase
 */
export function getRequiredWorksheets(phaseNumber: number): number {
  return WORKSHEETS_PER_PHASE[phaseNumber] || 3
}

/**
 * Check if phase is complete
 */
export function isPhaseComplete(phaseNumber: number, completedWorksheets: number): boolean {
  const required = getRequiredWorksheets(phaseNumber)
  return completedWorksheets >= required
}

/**
 * Format timestamp for display
 */
export function formatMessageTimestamp(timestamp: string): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

/**
 * Starter prompts for initial Guru analysis
 */
export const GURU_STARTER_PROMPTS: Record<number, string[]> = {
  1: [
    'Analyze my Wheel of Life scores and identify patterns',
    'What do my SWOT results reveal about my potential?',
    'Help me understand my habit patterns',
  ],
  2: [
    'Help me refine my life purpose statement',
    'What themes do you see in my vision board choices?',
    'How aligned are my values with my daily actions?',
  ],
  3: [
    'Review my SMART goals for feasibility',
    'What obstacles might I face achieving my goals?',
    'How can I stay motivated on my action plans?',
  ],
  4: [
    'Help me understand the root of my biggest fears',
    'What limiting beliefs are holding me back most?',
    'How can I reframe my negative thought patterns?',
  ],
  5: [
    'Evaluate my self-care routine completeness',
    'What self-love practices would benefit me most?',
    'How can I be more compassionate with myself?',
  ],
  6: [
    'Assess my manifestation practice effectiveness',
    'How can I better embody my desires?',
    'What blocks my manifestation energy?',
  ],
  7: [
    'Deepen my gratitude practice beyond surface level',
    'What gratitude patterns have shifted my perspective?',
    'Help me find gratitude in my challenges',
  ],
  8: [
    'Transform my envy into inspiration',
    'What do my envies reveal about my desires?',
    'How can I celebrate others while honoring myself?',
  ],
  9: [
    'Help me trust the manifestation process more',
    'Where am I still trying to control outcomes?',
    'What signs should I pay attention to?',
  ],
  10: [
    'Review my complete transformation journey',
    'What were my biggest breakthroughs across all phases?',
    'How can I sustain this growth going forward?',
  ],
}

/**
 * Get starter prompts for a phase
 */
export function getStarterPrompts(phaseNumber: number): string[] {
  return GURU_STARTER_PROMPTS[phaseNumber] || [
    'Analyze my progress in this phase',
    'What patterns do you notice in my work?',
    'What should I focus on next?',
  ]
}
