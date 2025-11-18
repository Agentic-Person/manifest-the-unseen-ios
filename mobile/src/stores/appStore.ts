/**
 * App Store
 *
 * Manages global app state for UI, network, and lifecycle events.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AppState } from '../types/store';

/**
 * Initial State
 */
const initialState: Omit<
  AppState,
  | 'setOnline'
  | 'setAppReady'
  | 'setLastSynced'
  | 'setDrawerOpen'
  | 'setActiveTab'
  | 'completeOnboarding'
  | 'setOnboardingStep'
  | 'reset'
> = {
  isOnline: true,
  isAppReady: false,
  lastSyncedAt: undefined,
  isDrawerOpen: false,
  activeTab: 'Home',
  hasCompletedOnboarding: false,
  onboardingStep: 0,
};

/**
 * App Store
 *
 * @example
 * ```tsx
 * import { useAppStore } from '@/stores/appStore';
 *
 * function MyComponent() {
 *   const { isOnline, isAppReady } = useAppStore();
 *
 *   if (!isAppReady) {
 *     return <LoadingScreen />;
 *   }
 *
 *   if (!isOnline) {
 *     return <OfflineBanner />;
 *   }
 *
 *   return <MainContent />;
 * }
 * ```
 */
export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      ...initialState,

      /**
       * Set Online Status
       */
      setOnline: (isOnline) => {
        set({ isOnline });
      },

      /**
       * Set App Ready
       */
      setAppReady: (isReady) => {
        set({ isAppReady: isReady });
      },

      /**
       * Set Last Synced Timestamp
       */
      setLastSynced: (timestamp) => {
        set({ lastSyncedAt: timestamp });
      },

      /**
       * Set Drawer Open State
       */
      setDrawerOpen: (isOpen) => {
        set({ isDrawerOpen: isOpen });
      },

      /**
       * Set Active Tab
       */
      setActiveTab: (tab) => {
        set({ activeTab: tab });
      },

      /**
       * Complete Onboarding
       */
      completeOnboarding: () => {
        set({
          hasCompletedOnboarding: true,
          onboardingStep: 0,
        });
      },

      /**
       * Set Onboarding Step
       */
      setOnboardingStep: (step) => {
        set({ onboardingStep: step });
      },

      /**
       * Reset Store
       */
      reset: () => {
        set(initialState);
      },
    }),
    {
      name: 'manifest-app-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist onboarding state
      partialize: (state) => ({
        hasCompletedOnboarding: state.hasCompletedOnboarding,
        onboardingStep: state.onboardingStep,
      }),
    }
  )
);

/**
 * Selector Hooks
 */

export const useIsOnline = () => useAppStore((state) => state.isOnline);
export const useIsAppReady = () => useAppStore((state) => state.isAppReady);
export const useLastSynced = () => useAppStore((state) => state.lastSyncedAt);
export const useActiveTab = () => useAppStore((state) => state.activeTab);
export const useOnboarding = () =>
  useAppStore((state) => ({
    hasCompleted: state.hasCompletedOnboarding,
    currentStep: state.onboardingStep,
  }));
