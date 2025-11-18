/**
 * Settings Store
 *
 * Manages app settings and user preferences using Zustand.
 * Persists settings to AsyncStorage for offline access.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { SettingsState } from '../types/store';

/**
 * Default Settings
 */
const defaultSettings: Omit<
  SettingsState,
  | 'setTheme'
  | 'setPreferredNarrator'
  | 'setMeditationReminder'
  | 'setJournalReminder'
  | 'setAutoTranscribeVoice'
  | 'setPushNotifications'
  | 'setDailyInspirations'
  | 'setProgressMilestones'
  | 'setFontSize'
  | 'setReducedMotion'
  | 'setAnalytics'
  | 'setCrashReporting'
  | 'loadSettings'
  | 'saveSettings'
  | 'reset'
> = {
  // Theme
  theme: 'system',

  // Meditation Preferences
  preferredNarrator: 'female',
  meditationReminderEnabled: false,
  meditationReminderTime: undefined,

  // Journal Preferences
  journalReminderEnabled: false,
  journalReminderTime: undefined,
  autoTranscribeVoice: true,

  // Notifications
  pushNotificationsEnabled: true,
  dailyInspirationsEnabled: true,
  progressMilestonesEnabled: true,

  // Accessibility
  fontSize: 'medium',
  reducedMotion: false,

  // Privacy
  analyticsEnabled: true,
  crashReportingEnabled: true,
};

/**
 * Settings Store
 *
 * @example
 * ```tsx
 * import { useSettingsStore } from '@/stores/settingsStore';
 *
 * function SettingsScreen() {
 *   const {
 *     theme,
 *     setTheme,
 *     meditationReminderEnabled,
 *     setMeditationReminder
 *   } = useSettingsStore();
 *
 *   return (
 *     <View>
 *       <Switch
 *         value={meditationReminderEnabled}
 *         onValueChange={(value) => setMeditationReminder(value)}
 *       />
 *     </View>
 *   );
 * }
 * ```
 */
export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      ...defaultSettings,

      /**
       * Set Theme
       */
      setTheme: (theme) => {
        set({ theme });
      },

      /**
       * Set Preferred Meditation Narrator
       */
      setPreferredNarrator: (narrator) => {
        set({ preferredNarrator: narrator });
      },

      /**
       * Set Meditation Reminder
       */
      setMeditationReminder: (enabled, time) => {
        set({
          meditationReminderEnabled: enabled,
          meditationReminderTime: time,
        });
      },

      /**
       * Set Journal Reminder
       */
      setJournalReminder: (enabled, time) => {
        set({
          journalReminderEnabled: enabled,
          journalReminderTime: time,
        });
      },

      /**
       * Set Auto Transcribe Voice
       */
      setAutoTranscribeVoice: (enabled) => {
        set({ autoTranscribeVoice: enabled });
      },

      /**
       * Set Push Notifications
       */
      setPushNotifications: (enabled) => {
        set({ pushNotificationsEnabled: enabled });
      },

      /**
       * Set Daily Inspirations
       */
      setDailyInspirations: (enabled) => {
        set({ dailyInspirationsEnabled: enabled });
      },

      /**
       * Set Progress Milestones
       */
      setProgressMilestones: (enabled) => {
        set({ progressMilestonesEnabled: enabled });
      },

      /**
       * Set Font Size
       */
      setFontSize: (size) => {
        set({ fontSize: size });
      },

      /**
       * Set Reduced Motion
       */
      setReducedMotion: (enabled) => {
        set({ reducedMotion: enabled });
      },

      /**
       * Set Analytics
       */
      setAnalytics: (enabled) => {
        set({ analyticsEnabled: enabled });
      },

      /**
       * Set Crash Reporting
       */
      setCrashReporting: (enabled) => {
        set({ crashReportingEnabled: enabled });
      },

      /**
       * Load Settings
       * Loads settings from AsyncStorage (handled by persist middleware)
       */
      loadSettings: async () => {
        // Settings are automatically loaded by persist middleware
        // This method is here for explicit loading if needed
        return Promise.resolve();
      },

      /**
       * Save Settings
       * Saves settings to AsyncStorage (handled by persist middleware)
       */
      saveSettings: async () => {
        // Settings are automatically saved by persist middleware
        // This method is here for explicit saving if needed
        return Promise.resolve();
      },

      /**
       * Reset Settings
       * Resets all settings to default values
       */
      reset: () => {
        set(defaultSettings);
      },
    }),
    {
      name: 'manifest-settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

/**
 * Selector Hooks
 * Optimized hooks that only re-render when specific values change
 */

// Theme
export const useTheme = () => useSettingsStore((state) => state.theme);

// Meditation
export const usePreferredNarrator = () =>
  useSettingsStore((state) => state.preferredNarrator);
export const useMeditationReminder = () =>
  useSettingsStore((state) => ({
    enabled: state.meditationReminderEnabled,
    time: state.meditationReminderTime,
  }));

// Journal
export const useJournalReminder = () =>
  useSettingsStore((state) => ({
    enabled: state.journalReminderEnabled,
    time: state.journalReminderTime,
  }));
export const useAutoTranscribeVoice = () =>
  useSettingsStore((state) => state.autoTranscribeVoice);

// Notifications
export const usePushNotifications = () =>
  useSettingsStore((state) => state.pushNotificationsEnabled);

// Accessibility
export const useFontSize = () => useSettingsStore((state) => state.fontSize);
export const useReducedMotion = () =>
  useSettingsStore((state) => state.reducedMotion);

// Privacy
export const useAnalyticsEnabled = () =>
  useSettingsStore((state) => state.analyticsEnabled);
