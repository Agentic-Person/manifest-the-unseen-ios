/**
 * Store Exports
 *
 * Centralized exports for all Zustand stores.
 */

export {
  useAuthStore,
  useUser,
  useProfile,
  useSession,
  useIsAuthenticated,
  useAuthLoading,
  useAuthError,
  useSignOut,
  useRefreshProfile,
  useSubscriptionTier,
  useHasFeatureAccess,
} from './authStore';

export {
  useSettingsStore,
  useTheme,
  usePreferredNarrator,
  useMeditationReminder,
  useJournalReminder,
  useAutoTranscribeVoice,
  usePushNotifications,
  useFontSize,
  useReducedMotion,
  useAnalyticsEnabled,
} from './settingsStore';

export {
  useAppStore,
  useIsOnline,
  useIsAppReady,
  useLastSynced,
  useActiveTab,
  useOnboarding,
} from './appStore';

// Workbook store
export {
  useWorkbookStore,
  useCurrentPhase,
  useCurrentWorksheet,
  useSaveStatus,
  useLastSavedAt,
  useSaveError,
} from './workbookStore';
