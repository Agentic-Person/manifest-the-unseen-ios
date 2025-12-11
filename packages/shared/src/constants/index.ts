/**
 * Shared constants
 */

import type { SubscriptionTier, TierLimits, WorkbookPhase } from '../models';

/**
 * Subscription tier limits
 *
 * All paid tiers get ALL 10 phases (no phase-based gating)
 * Tier differentiation is via meditations and Guru access
 */
export const TIER_LIMITS: Record<SubscriptionTier, TierLimits> = {
  free: {
    phases: 0, // No access
    meditations: 0, // No meditations
    journalEntriesPerMonth: 0,
    aiMessagesPerDay: 0,
    visionBoards: 0,
    hasAdvancedAnalytics: false,
    hasPrioritySupport: false,
  },
  novice: {
    phases: 10, // ALL phases
    meditations: 6, // Music tracks only
    journalEntriesPerMonth: 0, // Coming Soon
    aiMessagesPerDay: 0, // No Guru access
    visionBoards: 1,
    hasAdvancedAnalytics: false,
    hasPrioritySupport: false,
  },
  awakening: {
    phases: 10, // ALL phases
    meditations: 12, // Music + 6 guided meditations
    journalEntriesPerMonth: 0, // Coming Soon
    aiMessagesPerDay: 50, // Guru workbook analysis
    visionBoards: 3,
    hasAdvancedAnalytics: true,
    hasPrioritySupport: true,
  },
  enlightenment: {
    phases: 10, // ALL phases
    meditations: 18, // All meditations (Coming Soon: 12+)
    journalEntriesPerMonth: -1, // Coming Soon: Unlimited
    aiMessagesPerDay: -1, // Coming Soon: Unlimited full AI chat
    visionBoards: -1, // Unlimited
    hasAdvancedAnalytics: true,
    hasPrioritySupport: true,
  },
};

/**
 * Subscription pricing (in USD)
 * Yearly = 2 months free (~17% discount)
 */
export const SUBSCRIPTION_PRICING = {
  novice: {
    monthly: 7.99,
    yearly: 79.92,
  },
  awakening: {
    monthly: 19.99,
    yearly: 199.90,
  },
  enlightenment: {
    monthly: 49.99,
    yearly: 499.90,
  },
} as const;

/**
 * Free trial duration
 */
export const FREE_TRIAL_DAYS = 7;

/**
 * Workbook phases metadata
 *
 * Note: ALL paid tiers (novice+) get access to ALL 10 phases
 * requiredTier is set to 'novice' for all phases (no phase-based gating)
 */
export const WORKBOOK_PHASES: WorkbookPhase[] = [
  {
    id: 1,
    title: 'Self-Evaluation',
    description: 'Assess your current state with Wheel of Life, SWOT analysis, values identification, and habit tracking.',
    worksheets: ['wheel-of-life', 'swot-analysis', 'core-values', 'daily-habits'],
    estimatedMinutes: 45,
    requiredTier: 'novice',
  },
  {
    id: 2,
    title: 'Values & Vision',
    description: 'Define your core values and create a compelling vision for your future.',
    worksheets: ['values-deep-dive', 'vision-statement', 'vision-board-planning'],
    estimatedMinutes: 60,
    requiredTier: 'novice',
  },
  {
    id: 3,
    title: 'Goal Setting',
    description: 'Set SMART goals and create actionable plans to achieve them.',
    worksheets: ['smart-goals', 'action-plans', 'milestone-tracking'],
    estimatedMinutes: 50,
    requiredTier: 'novice',
  },
  {
    id: 4,
    title: 'Facing Fears & Limiting Beliefs',
    description: 'Identify and overcome fears, limiting beliefs, and cognitive distortions.',
    worksheets: ['fear-inventory', 'limiting-beliefs', 'cognitive-restructuring'],
    estimatedMinutes: 55,
    requiredTier: 'novice',
  },
  {
    id: 5,
    title: 'Cultivating Self-Love & Self-Care',
    description: 'Develop practices for self-compassion, self-care, and positive self-talk.',
    worksheets: ['self-love-affirmations', 'self-care-plan', 'inner-child-work'],
    estimatedMinutes: 45,
    requiredTier: 'novice',
  },
  {
    id: 6,
    title: 'Manifestation Techniques',
    description: 'Learn powerful manifestation methods: 3-6-9, WOOP, scripting, and visualization.',
    worksheets: ['369-method', 'woop-framework', 'scripting-exercises', 'visualization-practice'],
    estimatedMinutes: 70,
    requiredTier: 'novice',
  },
  {
    id: 7,
    title: 'Practicing Gratitude',
    description: 'Cultivate deep gratitude through daily practices and reflection.',
    worksheets: ['gratitude-journal', 'gratitude-meditation', 'appreciation-letters'],
    estimatedMinutes: 40,
    requiredTier: 'novice',
  },
  {
    id: 8,
    title: 'Turning Envy Into Inspiration',
    description: 'Transform jealousy and envy into motivation and inspiration.',
    worksheets: ['envy-inventory', 'inspiration-reframe', 'role-model-analysis'],
    estimatedMinutes: 50,
    requiredTier: 'novice',
  },
  {
    id: 9,
    title: 'Trust & Surrender',
    description: 'Learn to trust the process and surrender control.',
    worksheets: ['trust-exercises', 'surrender-practice', 'faith-building'],
    estimatedMinutes: 45,
    requiredTier: 'novice',
  },
  {
    id: 10,
    title: 'Trust & Letting Go',
    description: 'Master the art of letting go and trusting in divine timing.',
    worksheets: ['letting-go-ritual', 'detachment-practice', 'integration-reflection'],
    estimatedMinutes: 55,
    requiredTier: 'novice',
  },
];

/**
 * App configuration constants
 */
export const APP_CONFIG = {
  AUTO_SAVE_INTERVAL_MS: 30000, // 30 seconds
  MEDITATION_MIN_SESSION_SECONDS: 60, // Count as session if > 1 minute
  AI_MESSAGE_MAX_LENGTH: 1000,
  JOURNAL_ENTRY_MAX_LENGTH: 10000,
  VISION_BOARD_MAX_IMAGES: 20,
  MAX_TAGS_PER_ENTRY: 10,
} as const;

/**
 * Meditation categories
 */
export const MEDITATION_CATEGORIES = [
  'Morning',
  'Evening',
  'Quick Reset',
  'Abundance',
  'Limiting Beliefs',
  'Deep Alignment',
] as const;

/**
 * AI knowledge sources
 */
export const AI_KNOWLEDGE_SOURCES = [
  'lunar-rivers',
  'shi-heng-yi',
  'tesla',
  'book-essence',
  'workbook',
] as const;

/**
 * Color palette (matches mobile Tailwind config)
 */
export const COLORS = {
  primary: {
    DEFAULT: '#9333EA',
    50: '#FAF5FF',
    100: '#F3E8FF',
    200: '#E9D5FF',
    300: '#D8B4FE',
    400: '#C084FC',
    500: '#A855F7',
    600: '#9333EA',
    700: '#7E22CE',
    800: '#6B21A8',
    900: '#581C87',
  },
  secondary: {
    DEFAULT: '#F59E0B',
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
  },
  ethereal: {
    DEFAULT: '#E9D5FF',
    light: '#FAF5FF',
    dark: '#C084FC',
  },
} as const;
