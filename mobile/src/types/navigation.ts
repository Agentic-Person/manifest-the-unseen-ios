/**
 * Navigation Type Definitions
 *
 * Defines TypeScript types for React Navigation to ensure type-safe navigation
 * throughout the app. This includes tab navigation and future stack navigators.
 */

import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

/**
 * Root Stack Navigator Param List
 * Top-level navigator that handles auth flow and main app
 */
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

/**
 * Auth Stack Navigator Param List
 * Handles authentication flow screens
 */
export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
};

/**
 * Main Tab Navigator Param List
 * Bottom tab navigation for authenticated users
 */
export type MainTabParamList = {
  Home: undefined;
  Workbook: undefined;
  Meditate: undefined;
  Journal: undefined;
  Profile: undefined;
};

/**
 * Workbook Stack Navigator Param List
 * Nested navigation for workbook phases and exercises
 */
export type WorkbookStackParamList = {
  WorkbookHome: undefined;
  PhaseDetail: { phaseId: number; phaseName: string };
  ExerciseDetail: {
    phaseId: number;
    exerciseId: string;
    exerciseName: string
  };
};

/**
 * Journal Stack Navigator Param List
 * Nested navigation for journal features
 */
export type JournalStackParamList = {
  JournalHome: undefined;
  JournalEntry: { entryId?: string };
  VoiceRecorder: undefined;
};

/**
 * Meditate Stack Navigator Param List
 * Nested navigation for meditation features
 */
export type MeditateStackParamList = {
  MeditateHome: undefined;
  MeditationPlayer: {
    meditationId: string;
    title: string;
    duration: number;
  };
  BreathingExercise: { exerciseType: 'box' | 'deep' | 'calm' };
};

/**
 * Profile Stack Navigator Param List
 * Nested navigation for profile and settings
 */
export type ProfileStackParamList = {
  ProfileHome: undefined;
  Settings: undefined;
  Subscription: undefined;
  About: undefined;
};

/**
 * AI Chat Stack Navigator Param List
 * Nested navigation for AI wisdom chat
 */
export type AIChatStackParamList = {
  ChatHome: undefined;
  ChatConversation: { conversationId?: string };
};

/**
 * Screen Props Type Helpers
 * Use these types in screen components for type-safe navigation and route params
 */

// Root Stack Screen Props
export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

// Auth Stack Screen Props
export type AuthStackScreenProps<T extends keyof AuthStackParamList> =
  NativeStackScreenProps<AuthStackParamList, T>;

// Main Tab Screen Props
export type MainTabScreenProps<T extends keyof MainTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<MainTabParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

// Workbook Stack Screen Props
export type WorkbookStackScreenProps<T extends keyof WorkbookStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<WorkbookStackParamList, T>,
    MainTabScreenProps<'Workbook'>
  >;

// Journal Stack Screen Props
export type JournalStackScreenProps<T extends keyof JournalStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<JournalStackParamList, T>,
    MainTabScreenProps<'Journal'>
  >;

// Meditate Stack Screen Props
export type MeditateStackScreenProps<T extends keyof MeditateStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<MeditateStackParamList, T>,
    MainTabScreenProps<'Meditate'>
  >;

// Profile Stack Screen Props
export type ProfileStackScreenProps<T extends keyof ProfileStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<ProfileStackParamList, T>,
    MainTabScreenProps<'Profile'>
  >;

/**
 * Global Navigation Declaration
 * Augment React Navigation's types to provide autocomplete for navigate() calls
 */
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
