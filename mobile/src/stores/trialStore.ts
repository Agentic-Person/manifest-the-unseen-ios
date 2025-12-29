/**
 * Trial Store
 *
 * Tracks the 7-day free trial period for new users.
 * This is SEPARATE from RevenueCat subscriptions.
 *
 * Business logic:
 * - New install starts a 7-day trial
 * - Trial users get full access (like Enlightenment tier)
 * - Guru is rate-limited to 3/day during trial (handled by guruRateLimitStore)
 * - After trial expires, user must subscribe to access features
 */

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TRIAL_KEY = 'app_first_install_date';
const TRIAL_DAYS = 7;

interface TrialState {
  firstInstallDate: string | null;
  isInTrialPeriod: boolean;
  trialDaysRemaining: number;
  isLoading: boolean;

  // Actions
  initializeTrial: () => Promise<void>;
  checkTrialStatus: () => void;
}

/**
 * Trial Store - manages 7-day trial tracking
 */
export const useTrialStore = create<TrialState>((set, get) => ({
  firstInstallDate: null,
  isInTrialPeriod: false,
  trialDaysRemaining: 0,
  isLoading: true,

  /**
   * Initialize trial on app startup
   * - If first install, record the date and start trial
   * - If returning user, check if trial is still active
   */
  initializeTrial: async () => {
    try {
      let installDate = await AsyncStorage.getItem(TRIAL_KEY);

      if (!installDate) {
        // First install - start trial
        installDate = new Date().toISOString();
        await AsyncStorage.setItem(TRIAL_KEY, installDate);
        console.log('[Trial] First install, starting 7-day trial');
      } else {
        console.log('[Trial] Returning user, checking trial status');
      }

      set({ firstInstallDate: installDate, isLoading: false });
      get().checkTrialStatus();
    } catch (error) {
      console.error('[Trial] Failed to initialize:', error);
      // On error, assume trial is active (fail open for UX)
      set({
        firstInstallDate: new Date().toISOString(),
        isInTrialPeriod: true,
        trialDaysRemaining: TRIAL_DAYS,
        isLoading: false,
      });
    }
  },

  /**
   * Check if trial is still active based on install date
   */
  checkTrialStatus: () => {
    const { firstInstallDate } = get();
    if (!firstInstallDate) {
      set({ isInTrialPeriod: false, trialDaysRemaining: 0 });
      return;
    }

    const install = new Date(firstInstallDate);
    const now = new Date();
    const diffMs = now.getTime() - install.getTime();
    const daysPassed = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const daysRemaining = Math.max(0, TRIAL_DAYS - daysPassed);

    const isInTrialPeriod = daysRemaining > 0;

    console.log(`[Trial] Days passed: ${daysPassed}, Days remaining: ${daysRemaining}, In trial: ${isInTrialPeriod}`);

    set({
      isInTrialPeriod,
      trialDaysRemaining: daysRemaining,
    });
  },
}));

/**
 * Export trial duration constant for UI display
 */
export const TRIAL_DURATION_DAYS = TRIAL_DAYS;
