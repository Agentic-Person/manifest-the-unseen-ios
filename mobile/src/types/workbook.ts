/**
 * Workbook Types
 *
 * Type definitions for all workbook data structures.
 * Used across services, hooks, and components.
 */

/**
 * Database row type (matches Supabase schema)
 */
export interface WorkbookProgress {
  id: string;
  user_id: string;
  phase_number: number;
  worksheet_id: string;
  data: Record<string, unknown>;
  completed: boolean;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Insert type (for creating/updating)
 */
export interface WorkbookProgressInsert {
  user_id: string;
  phase_number: number;
  worksheet_id: string;
  data: Record<string, unknown>;
  completed?: boolean;
  completed_at?: string | null;
  updated_at?: string;
}

/**
 * Phase progress summary
 */
export interface PhaseProgress {
  phaseNumber: number;
  completed: number;
  total: number;
  percentage: number;
  worksheets: WorkbookProgress[];
}

/**
 * Worksheet ID constants for all 30 screens
 */
export const WORKSHEET_IDS = {
  // Phase 1: Self-Evaluation
  WHEEL_OF_LIFE: 'wheel-of-life',
  SWOT_ANALYSIS: 'swot-analysis',
  HABITS_AUDIT: 'habits-audit',
  VALUES_ASSESSMENT: 'values-assessment',

  // Phase 2: Values & Vision
  LIFE_MISSION: 'life-mission',
  PURPOSE_STATEMENT: 'purpose-statement',
  VISION_BOARD: 'vision-board',

  // Phase 3: Goal Setting
  SMART_GOALS: 'smart-goals',
  TIMELINE: 'timeline',
  ACTION_PLAN: 'action-plan',

  // Phase 4: Facing Fears
  FEAR_INVENTORY: 'fear-inventory',
  LIMITING_BELIEFS: 'limiting-beliefs',
  FEAR_FACING_PLAN: 'fear-facing-plan',

  // Phase 5: Self-Love & Self-Care
  SELF_LOVE_AFFIRMATIONS: 'self-love-affirmations',
  SELF_CARE_ROUTINE: 'self-care-routine',
  INNER_CHILD: 'inner-child',

  // Phase 6: Manifestation Techniques
  THREE_SIX_NINE: '369-method',
  SCRIPTING: 'scripting',
  WOOP: 'woop-method',

  // Phase 7: Practicing Gratitude
  GRATITUDE_JOURNAL: 'gratitude-journal',
  GRATITUDE_LETTERS: 'gratitude-letters',
  GRATITUDE_MEDITATION: 'gratitude-meditation',

  // Phase 8: Envy to Inspiration
  ENVY_INVENTORY: 'envy-inventory',
  INSPIRATION_REFRAME: 'inspiration-reframe',
  ROLE_MODELS: 'role-models',

  // Phase 9: Trust & Surrender
  TRUST_ASSESSMENT: 'trust-assessment',
  SURRENDER_PRACTICE: 'surrender-practice',
  SIGNS_TRACKING: 'signs-tracking',

  // Phase 10: Letting Go
  JOURNEY_REVIEW: 'journey-review',
  FUTURE_LETTER: 'future-letter',
  GRADUATION: 'graduation',
} as const;

export type WorksheetId = (typeof WORKSHEET_IDS)[keyof typeof WORKSHEET_IDS];

/**
 * Total worksheets per phase (from PRD)
 */
export const WORKSHEETS_PER_PHASE: Record<number, number> = {
  1: 4,
  2: 3,
  3: 3,
  4: 3,
  5: 3,
  6: 3,
  7: 3,
  8: 3,
  9: 3,
  10: 3,
};

// ============================================
// Specific worksheet data types
// ============================================

/**
 * Phase 1: Wheel of Life data
 */
export interface WheelOfLifeData {
  career: number;
  health: number;
  relationships: number;
  finance: number;
  personalGrowth: number;
  family: number;
  recreation: number;
  spirituality: number;
}

/**
 * Phase 1: SWOT Analysis data
 */
export interface SWOTData {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

/**
 * Phase 1: Habits Audit data
 */
export interface HabitsAuditData {
  habits: Array<{
    id: string;
    name: string;
    type: 'good' | 'bad';
    frequency: string;
  }>;
}

/**
 * Phase 1: Values Assessment data
 */
export interface ValuesAssessmentData {
  values: Array<{
    id: string;
    name: string;
    rank: number;
    importance: number;
  }>;
}

/**
 * Phase 3: SMART Goal data
 */
export interface GoalData {
  id: string;
  title: string;
  description: string;
  specific: string;
  measurable: string;
  achievable: string;
  relevant: string;
  timeBound: string;
  deadline: string;
  status: 'not_started' | 'in_progress' | 'completed';
}

/**
 * Phase 4: Fear data
 */
export interface FearData {
  id: string;
  description: string;
  intensity: number; // 1-10
  reframe: string;
  actionPlan: string;
}

/**
 * Phase 5: Affirmation data
 */
export interface AffirmationData {
  id: string;
  text: string;
  category: string;
  createdAt: string;
}

/**
 * Phase 7: Gratitude entry
 */
export interface GratitudeEntry {
  id: string;
  date: string;
  items: string[];
  reflection: string;
  mood?: number; // 1-10
}

/**
 * Phase 6: 3-6-9 Method data
 */
export interface ThreeSixNineData {
  manifestation: string;
  cycles: Array<{
    date: string;
    morning: { completed: boolean; count: number };
    afternoon: { completed: boolean; count: number };
    evening: { completed: boolean; count: number };
  }>;
}

/**
 * Phase 6: WOOP data
 */
export interface WOOPData {
  wish: string;
  outcome: string;
  obstacle: string;
  plan: string;
  ifThen: string;
}

/**
 * Phase 10: Graduation data
 */
export interface GraduationData {
  graduation: {
    completed: boolean;
    completedAt: string;
    certificate: {
      name: string;
      date: string;
      achievements: string[];
    };
    reflection: string;
  };
}
