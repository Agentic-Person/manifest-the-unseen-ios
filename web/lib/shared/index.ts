/**
 * Shared types and constants for web app
 *
 * This is a local copy of what web needs from @manifest/shared
 * to avoid monorepo dependency issues in Vercel deployment.
 */

export type SubscriptionTier = 'free' | 'novice' | 'awakening' | 'enlightenment';

export interface WorkbookPhase {
  id: number; // 1-10
  title: string;
  description: string;
  worksheets: string[];
  estimatedMinutes: number;
  requiredTier: SubscriptionTier;
}

/**
 * Workbook phases metadata
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
    worksheets: ['three-six-nine', 'woop', 'scripting'],
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
    worksheets: ['trust-assessment', 'surrender-practice', 'signs'],
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
 * Mapping between phase numbers and worksheet slugs
 */
export const PHASE_WORKSHEETS: Record<number, string[]> = {
  1: [
    'wheel-of-life',
    'swot-analysis',
    'values-assessment',
    'habits-audit',
    'know-yourself',
    'strengths-weaknesses',
    'abilities-rating',
    'comfort-zone',
    'feel-wheel',
    'thought-awareness',
    'abc-model'
  ],
  2: ['life-mission', 'purpose-statement', 'vision-board'],
  3: ['smart-goals', 'timeline', 'action-plan'],
  4: ['fear-inventory', 'limiting-beliefs', 'fear-facing-plan'],
  5: ['self-love-affirmations', 'self-care-routine', 'inner-child'],
  6: ['three-six-nine', 'woop', 'scripting'],
  7: ['gratitude-journal', 'gratitude-meditation', 'gratitude-letters'],
  8: ['envy-inventory', 'inspiration-reframe', 'role-models'],
  9: ['trust-assessment', 'surrender-practice', 'signs'],
  10: ['journey-review', 'future-letter', 'graduation']
};

/**
 * Get the first worksheet slug for a given phase
 */
export function getFirstWorksheetSlug(phaseNumber: number): string | null {
  return PHASE_WORKSHEETS[phaseNumber]?.[0] ?? null;
}

/**
 * Get total number of worksheets across all phases
 */
export function getTotalWorksheets(): number {
  return Object.values(PHASE_WORKSHEETS).reduce((sum, ws) => sum + ws.length, 0);
}
