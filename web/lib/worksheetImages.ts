/**
 * Worksheet image mapping
 *
 * Maps worksheet slugs to their corresponding exercise image paths.
 * Images are optimized WebP format (80-150KB each) from original mobile assets.
 *
 * Note: Not all worksheets have images yet (Phases 6, 7, 9 are pending).
 * Phase header images are handled separately in PhaseCard component.
 */

export const WORKSHEET_IMAGES: Record<string, string> = {
  // ==========================================
  // Phase 1: Self-Evaluation (11 worksheets)
  // ==========================================
  'wheel-of-life': '/images/workbook/exercises/phase-1/eval_wheel_of_life.webp',
  'swot-analysis': '/images/workbook/exercises/phase-1/eval_swot_analysis.webp',
  'values-assessment': '/images/workbook/exercises/phase-1/eval_personal_values.webp',
  'habits-audit': '/images/workbook/exercises/phase-1/eval_habit_tracking.webp',
  'know-yourself': '/images/workbook/exercises/phase-1/eval_know_yourself.webp',
  'strengths-weaknesses': '/images/workbook/exercises/phase-1/eval_strengths_weaknesses.webp',
  'abilities-rating': '/images/workbook/exercises/phase-1/eval_abilities_rating.webp',
  'comfort-zone': '/images/workbook/exercises/phase-1/eval_comfort_zone.webp',
  'feel-wheel': '/images/workbook/exercises/phase-1/eval_feel_wheel.webp',
  'thought-awareness': '/images/workbook/exercises/phase-1/eval_thought_awareness.webp',
  'abc-model': '/images/workbook/exercises/phase-1/eval_abc_model.webp',

  // ==========================================
  // Phase 2: Values & Vision (3 worksheets)
  // ==========================================
  'life-mission': '/images/workbook/exercises/phase-2/values_life_mission.webp',
  'vision-board': '/images/workbook/exercises/phase-2/values_vision_board.webp',
  // 'purpose-statement': No image yet

  // ==========================================
  // Phase 3: Goal Setting (3 worksheets)
  // ==========================================
  'smart-goals': '/images/workbook/exercises/phase-3/goals_smart_goals.webp',
  'timeline': '/images/workbook/exercises/phase-3/goals_timeline.webp',
  'action-plan': '/images/workbook/exercises/phase-3/goals_action_plan.webp',

  // ==========================================
  // Phase 4: Facing Fears (3 worksheets)
  // ==========================================
  'fear-inventory': '/images/workbook/exercises/phase-4/fears_inventory.webp',
  'limiting-beliefs': '/images/workbook/exercises/phase-4/fears_limiting_beliefs.webp',
  'fear-facing-plan': '/images/workbook/exercises/phase-4/fears_facing_plan.webp',

  // ==========================================
  // Phase 5: Self-Love & Care (3 worksheets)
  // ==========================================
  'self-love-affirmations': '/images/workbook/exercises/phase-5/selflove_affirmations.webp',
  'self-care-routine': '/images/workbook/exercises/phase-5/selflove_selfcare_routine.webp',
  'inner-child': '/images/workbook/exercises/phase-5/selflove_inner_child.webp',

  // ==========================================
  // Phase 6: Manifestation (3 worksheets)
  // ==========================================
  // No images yet - coming soon
  // 'three-six-nine': No image
  // 'woop': No image
  // 'scripting': No image

  // ==========================================
  // Phase 7: Gratitude (3 worksheets)
  // ==========================================
  // No images yet - coming soon
  // 'gratitude-journal': No image
  // 'gratitude-meditation': No image
  // 'gratitude-letters': No image

  // ==========================================
  // Phase 8: Envy → Inspiration (3 worksheets)
  // ==========================================
  'envy-inventory': '/images/workbook/exercises/phase-8/envy_inventory.webp',
  'inspiration-reframe': '/images/workbook/exercises/phase-8/inspiration_reframe.webp',
  'role-models': '/images/workbook/exercises/phase-8/role_models.webp',

  // ==========================================
  // Phase 9: Trust & Surrender (3 worksheets)
  // ==========================================
  // No images yet - coming soon
  // 'trust-assessment': No image
  // 'surrender-practice': No image
  // 'signs': No image

  // ==========================================
  // Phase 10: Letting Go (3 worksheets)
  // ==========================================
  // 'journey-review': No image yet
  'future-letter': '/images/workbook/exercises/phase-10/letter_future_self.webp',
  'graduation': '/images/workbook/exercises/phase-10/graduation.webp',
};

/**
 * Get the image path for a worksheet, if available
 *
 * @param worksheetId - The worksheet slug (e.g., 'wheel-of-life')
 * @returns Image path or undefined if no image exists
 */
export function getWorksheetImage(worksheetId: string): string | undefined {
  return WORKSHEET_IMAGES[worksheetId];
}

/**
 * Get phase header image path
 *
 * @param phaseNumber - Phase number (1-10)
 * @param phaseTitle - Phase title (e.g., 'Self-Evaluation')
 * @returns Phase header image path
 */
export function getPhaseHeaderImage(phaseNumber: number, phaseTitle: string): string {
  // Convert title to kebab-case for filename
  const slug = phaseTitle
    .toLowerCase()
    .replace(/ & /g, '-')
    .replace(/ /g, '-');

  return `/images/workbook/phases/phase-${phaseNumber}-${slug}.webp`;
}

/**
 * Check if a worksheet has an associated image
 *
 * @param worksheetId - The worksheet slug
 * @returns True if image exists
 */
export function hasWorksheetImage(worksheetId: string): boolean {
  return worksheetId in WORKSHEET_IMAGES;
}
