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

// Journal hooks
export {
  useJournalEntries,
  useJournalEntry,
  useCreateJournalEntry,
  useUpdateJournalEntry,
  useDeleteJournalEntry,
  useUploadJournalImage,
  journalKeys,
} from './useJournal';

// Voice journal hooks
export { useWhisper } from './useWhisper';
export { useAudioRecorder, type RecordingStatus } from './useAudioRecorder';
