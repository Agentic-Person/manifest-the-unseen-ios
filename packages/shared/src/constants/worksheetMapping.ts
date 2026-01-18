/**
 * Definitive mapping between workbook phases and their implemented worksheets
 *
 * This maps phase numbers (1-10) to arrays of worksheet slugs that exist
 * in the codebase. These slugs correspond to the route segments used in
 * /workbook/phase/{phaseId}/{worksheetSlug}
 *
 * Total: 40 worksheets across 10 phases
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
}

/**
 * Get the first worksheet slug for a given phase
 * Used for direct navigation from phase cards
 *
 * @param phaseNumber - Phase number (1-10)
 * @returns First worksheet slug or null if phase doesn't exist
 */
export function getFirstWorksheetSlug(phaseNumber: number): string | null {
  return PHASE_WORKSHEETS[phaseNumber]?.[0] ?? null
}

/**
 * Get total number of worksheets in a phase
 *
 * @param phaseNumber - Phase number (1-10)
 * @returns Number of worksheets in the phase
 */
export function getTotalWorksheetsInPhase(phaseNumber: number): number {
  return PHASE_WORKSHEETS[phaseNumber]?.length ?? 0
}

/**
 * Get total number of worksheets across all phases
 *
 * @returns Total worksheet count (should be 40)
 */
export function getTotalWorksheets(): number {
  return Object.values(PHASE_WORKSHEETS).reduce((sum, ws) => sum + ws.length, 0)
}
