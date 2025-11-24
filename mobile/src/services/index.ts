/**
 * Services Exports
 *
 * Central export point for all services.
 */

export { supabase } from './supabase';
export {
  signInWithEmail,
  signUpWithEmail,
  signInWithApple,
  signOut,
  getSession,
  getCurrentUser,
  resetPassword,
  updatePassword,
  getUserProfile,
  updateUserProfile,
  uploadFile,
  getPublicUrl,
  deleteFile,
  subscribeToTable,
  unsubscribe,
} from './supabase';

export {
  queryClient,
  queryKeys,
  invalidateUserQueries,
  invalidateWorkbookQueries,
  invalidateJournalQueries,
  invalidateMeditationQueries,
  clearAllCaches,
} from './queryClient';

export type { Database } from './supabase';

// Workbook service
export {
  getWorkbookProgress,
  getAllWorkbookProgress,
  getPhaseProgress,
  upsertWorkbookProgress,
  markWorksheetComplete,
  deleteWorkbookProgress,
  resetPhaseProgress,
  resetAllProgress,
} from './workbook';
