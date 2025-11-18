/**
 * Store Type Definitions
 *
 * TypeScript types for Zustand stores
 */

import type { User, Session } from '@supabase/supabase-js';

/**
 * User Subscription Tier
 * Matches the tiers defined in PRD Section 8
 */
export type SubscriptionTier = 'free' | 'novice' | 'awakening' | 'enlightenment';

/**
 * User Profile Data
 * Extended user information stored in Supabase
 */
export interface UserProfile {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  subscriptionTier: SubscriptionTier;
  subscriptionStatus: 'active' | 'canceled' | 'expired' | 'trial';
  trialEndsAt?: string;
  currentPhase: number; // Current workbook phase (1-10)
  createdAt: string;
  updatedAt: string;
}

/**
 * Authentication State
 */
export interface AuthState {
  // State
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;

  // Actions
  setUser: (user: User | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  setSession: (session: Session | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  reset: () => void;
}

/**
 * App Settings State
 */
export interface SettingsState {
  // Theme
  theme: 'light' | 'dark' | 'system';

  // Meditation Preferences
  preferredNarrator: 'male' | 'female';
  meditationReminderEnabled: boolean;
  meditationReminderTime?: string; // HH:mm format

  // Journal Preferences
  journalReminderEnabled: boolean;
  journalReminderTime?: string;
  autoTranscribeVoice: boolean;

  // Notifications
  pushNotificationsEnabled: boolean;
  dailyInspirationsEnabled: boolean;
  progressMilestonesEnabled: boolean;

  // Accessibility
  fontSize: 'small' | 'medium' | 'large';
  reducedMotion: boolean;

  // Privacy
  analyticsEnabled: boolean;
  crashReportingEnabled: boolean;

  // Actions
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setPreferredNarrator: (narrator: 'male' | 'female') => void;
  setMeditationReminder: (enabled: boolean, time?: string) => void;
  setJournalReminder: (enabled: boolean, time?: string) => void;
  setAutoTranscribeVoice: (enabled: boolean) => void;
  setPushNotifications: (enabled: boolean) => void;
  setDailyInspirations: (enabled: boolean) => void;
  setProgressMilestones: (enabled: boolean) => void;
  setFontSize: (size: 'small' | 'medium' | 'large') => void;
  setReducedMotion: (enabled: boolean) => void;
  setAnalytics: (enabled: boolean) => void;
  setCrashReporting: (enabled: boolean) => void;
  loadSettings: () => Promise<void>;
  saveSettings: () => Promise<void>;
  reset: () => void;
}

/**
 * App State
 * Global app state for UI and navigation
 */
export interface AppState {
  // Network
  isOnline: boolean;

  // App Lifecycle
  isAppReady: boolean;
  lastSyncedAt?: string;

  // UI State
  isDrawerOpen: boolean;
  activeTab: string;

  // Onboarding
  hasCompletedOnboarding: boolean;
  onboardingStep: number;

  // Actions
  setOnline: (isOnline: boolean) => void;
  setAppReady: (isReady: boolean) => void;
  setLastSynced: (timestamp: string) => void;
  setDrawerOpen: (isOpen: boolean) => void;
  setActiveTab: (tab: string) => void;
  completeOnboarding: () => void;
  setOnboardingStep: (step: number) => void;
  reset: () => void;
}
