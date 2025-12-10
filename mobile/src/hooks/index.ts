/**
 * Hooks Exports
 *
 * Central export point for all custom hooks.
 */

// Workbook hooks
export {
  useWorkbookProgress,
  useAllWorkbookProgress,
  usePhaseProgress,
  useSaveWorkbook,
  useMarkComplete,
  useDeleteWorkbookProgress,
  workbookKeys,
} from './useWorkbook';

// Auto-save hook
export { useAutoSave } from './useAutoSave';

// Audio player hook
export { useAudioPlayer } from './useAudioPlayer';

// Meditation hooks
export {
  useMeditations,
  useMeditation,
  useGuidedMeditations,
  useBreathingExercises,
  useMeditationMusic,
  useMeditationSessions,
  useMeditationStats,
  useStartMeditationSession,
  useCompleteMeditationSession,
  getMeditationAudioUrl,
  meditationKeys,
} from './useMeditation';

// AI Chat hooks
export { useAIChat, useConversations } from './useAIChat';

// Guru hooks
export { useGuru } from './useGuru';

// All phases progress hook
export {
  useAllPhasesProgress,
  getProgressColor,
  getProgressMessage,
} from './useAllPhasesProgress';
export type {
  PhaseProgressSummary,
  AllPhasesProgressResult,
} from './useAllPhasesProgress';
