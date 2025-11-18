/**
 * Central Exports
 *
 * Main export file for easy importing throughout the app.
 * Use this for commonly accessed items.
 */

// Stores
export * from './stores';

// Navigation Types
export type {
  MainTabParamList,
  MainTabScreenProps,
  RootStackParamList,
  RootStackScreenProps,
  WorkbookStackParamList,
  WorkbookStackScreenProps,
  JournalStackParamList,
  JournalStackScreenProps,
  MeditateStackParamList,
  MeditateStackScreenProps,
  ProfileStackParamList,
  ProfileStackScreenProps,
} from './types/navigation';

// Store Types
export type {
  UserProfile,
  SubscriptionTier,
  AuthState,
  SettingsState,
  AppState,
} from './types/store';

// Database Types
export type { Database } from './types/database';

// Services
export { supabase, queryClient, queryKeys } from './services';
export {
  signInWithEmail,
  signUpWithEmail,
  signInWithApple,
  getUserProfile,
  updateUserProfile,
} from './services/supabase';

// Hooks
export { useUserProfile, useUpdateUserProfile, useSubscriptionStatus } from './hooks/useUser';
