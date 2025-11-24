/**
 * Phase 1 - Self-Evaluation Screens
 *
 * Exports all Phase 1 exercise screens for the Manifest the Unseen workbook.
 * Phase 1 focuses on comprehensive self-assessment through 12 exercises.
 */

export { default as Phase1Dashboard } from './Phase1Dashboard';
export { default as WheelOfLifeScreen } from './WheelOfLifeScreen';

// SWOT Analysis - Organic Flower Petal Layout (Dark Theme)
// Legacy corporate-style version kept as SWOTScreen.tsx for reference
export { default as SWOTAnalysisScreen } from './SWOTAnalysisScreen';
export type { SWOTData } from './SWOTAnalysisScreen';

// Backwards compatibility alias
export { default as SWOTScreen } from './SWOTAnalysisScreen';

// Habits Audit - Current Habits tracking by time of day
export { default as HabitsAuditScreen } from './HabitsAuditScreen';

// Future exports for remaining Phase 1 exercises:
// export { default as FeelWheelScreen } from './FeelWheelScreen';
// export { default as ABCModelScreen } from './ABCModelScreen';
// export { default as PersonalValuesScreen } from './PersonalValuesScreen';
// export { default as StrengthsWeaknessesScreen } from './StrengthsWeaknessesScreen';
// export { default as ComfortZoneScreen } from './ComfortZoneScreen';
// export { default as KnowYourselfScreen } from './KnowYourselfScreen';
// export { default as AbilitiesRatingScreen } from './AbilitiesRatingScreen';
// export { default as ThoughtAwarenessScreen } from './ThoughtAwarenessScreen';
