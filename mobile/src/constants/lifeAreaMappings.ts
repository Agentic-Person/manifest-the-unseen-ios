/**
 * Life Area Mappings
 * Maps Wheel of Life areas to recommended practices
 */

export const LIFE_AREAS = [
  'career', 'health', 'relationships', 'finance',
  'personalGrowth', 'family', 'recreation', 'spirituality'
] as const;

export type LifeArea = typeof LIFE_AREAS[number];

export const LIFE_AREA_DISPLAY_NAMES: Record<LifeArea, string> = {
  career: 'Career',
  health: 'Health',
  relationships: 'Relationships',
  finance: 'Finance',
  personalGrowth: 'Personal Growth',
  family: 'Family',
  recreation: 'Recreation',
  spirituality: 'Spirituality',
};

export const LIFE_AREA_TO_BREATHING: Record<LifeArea, { pattern: string; reason: string }> = {
  career: { pattern: 'Energy Boost (2-0-2-0)', reason: 'increases focus and motivation' },
  health: { pattern: 'Deep Calm (5-2-5-2)', reason: 'activates healing response' },
  relationships: { pattern: 'Coherent Breathing (5-5)', reason: 'opens heart center' },
  finance: { pattern: 'Box Breathing (4-4-4-4)', reason: 'reduces anxiety around money' },
  personalGrowth: { pattern: 'Box Breathing (4-4-4-4)', reason: 'enhances clarity' },
  family: { pattern: 'Coherent Breathing (5-5)', reason: 'cultivates compassion' },
  recreation: { pattern: 'Deep Calm (5-2-5-2)', reason: 'promotes relaxation' },
  spirituality: { pattern: '4-7-8 Relaxation', reason: 'deepens spiritual connection' },
};

export const LIFE_AREA_TO_MEDITATION_TAGS: Record<LifeArea, string[]> = {
  career: ['goals', 'manifestation', 'visualization', 'focus'],
  health: ['grounding', 'breath', 'healing', 'self-love'],
  relationships: ['compassion', 'gratitude', 'healing', 'self-love'],
  finance: ['abundance', 'manifestation', 'goals', 'trust'],
  personalGrowth: ['mindfulness', 'visualization', 'letting go', 'trust'],
  family: ['compassion', 'gratitude', 'healing', 'self-love'],
  recreation: ['mindfulness', 'grounding', 'breath'],
  spirituality: ['trust', 'surrender', 'faith', 'divine', 'mindfulness'],
};

export const LOW_SCORE_THRESHOLD = 5;
