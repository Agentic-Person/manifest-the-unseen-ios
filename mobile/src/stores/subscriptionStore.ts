/**
 * Subscription Store
 *
 * Zustand store for managing subscription state globally.
 * Provides actions for loading, purchasing, and checking subscription status.
 */

import { create } from 'zustand';
import type {
  SubscriptionTier,
  SubscriptionStatus,
  SubscriptionOffering,
  SubscriptionInfo,
  SubscriptionPackage,
  PurchaseResult,
  RestoreResult,
  SubscriptionPeriod,
} from '../types/subscription';
import {
  getOfferings,
  getSubscriptionInfo,
  purchasePackage as purchaseSubscriptionPackage,
  restorePurchases as restoreSubscriptionPurchases,
} from '../services/subscriptionService';
import type { CustomerInfo } from 'react-native-purchases';

/**
 * Subscription Store State
 */
interface SubscriptionState {
  // Subscription Status
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  isSubscribed: boolean;
  isInTrial: boolean;
  period: SubscriptionPeriod | null;

  // Dates
  trialEndDate: string | null;
  expirationDate: string | null;
  willRenew: boolean;

  // Available Offerings
  offerings: SubscriptionOffering | null;

  // Loading States
  isLoading: boolean;
  isLoadingOfferings: boolean;
  isPurchasing: boolean;
  isRestoring: boolean;

  // Error States
  error: string | null;

  // Raw Customer Info (for advanced use)
  customerInfo: CustomerInfo | null;

  // Actions
  loadSubscription: () => Promise<void>;
  loadOfferings: () => Promise<void>;
  purchasePackage: (pkg: SubscriptionPackage) => Promise<PurchaseResult>;
  restorePurchases: () => Promise<RestoreResult>;
  checkAccess: (feature: string) => boolean;
  reset: () => void;
}

/**
 * Initial State
 */
const initialState = {
  tier: 'free' as SubscriptionTier,
  status: 'none' as SubscriptionStatus,
  isSubscribed: false,
  isInTrial: false,
  period: null,
  trialEndDate: null,
  expirationDate: null,
  willRenew: false,
  offerings: null,
  isLoading: false,
  isLoadingOfferings: false,
  isPurchasing: false,
  isRestoring: false,
  error: null,
  customerInfo: null,
};

/**
 * Subscription Store
 */
export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  ...initialState,

  /**
   * Load Subscription Info
   * Fetches current subscription status from RevenueCat
   */
  loadSubscription: async () => {
    set({ isLoading: true, error: null });

    try {
      const info: SubscriptionInfo = await getSubscriptionInfo();

      set({
        tier: info.tier,
        status: info.status,
        isSubscribed: info.isSubscribed,
        isInTrial: info.isInTrial,
        period: info.period,
        trialEndDate: info.trialEndDate,
        expirationDate: info.expirationDate,
        willRenew: info.willRenew,
        customerInfo: info.customerInfo,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      console.error('Failed to load subscription:', error);
      set({
        isLoading: false,
        error: error.message || 'Failed to load subscription',
      });
    }
  },

  /**
   * Load Available Offerings
   * Fetches subscription packages from RevenueCat
   */
  loadOfferings: async () => {
    set({ isLoadingOfferings: true, error: null });

    try {
      const offerings = await getOfferings();

      set({
        offerings,
        isLoadingOfferings: false,
        error: null,
      });
    } catch (error: any) {
      console.error('Failed to load offerings:', error);
      set({
        isLoadingOfferings: false,
        error: error.message || 'Failed to load offerings',
      });
    }
  },

  /**
   * Purchase Subscription Package
   *
   * @param pkg - Package to purchase
   * @returns Purchase result
   */
  purchasePackage: async (pkg: SubscriptionPackage): Promise<PurchaseResult> => {
    set({ isPurchasing: true, error: null });

    try {
      const result = await purchaseSubscriptionPackage(pkg);

      if (result.success && result.customerInfo) {
        // Refresh subscription info after successful purchase
        await get().loadSubscription();
      }

      set({ isPurchasing: false });
      return result;
    } catch (error: any) {
      console.error('Purchase failed:', error);
      set({
        isPurchasing: false,
        error: error.message || 'Purchase failed',
      });

      return {
        success: false,
        error,
      };
    }
  },

  /**
   * Restore Previous Purchases
   *
   * @returns Restore result
   */
  restorePurchases: async (): Promise<RestoreResult> => {
    set({ isRestoring: true, error: null });

    try {
      const result = await restoreSubscriptionPurchases();

      if (result.success && result.customerInfo) {
        // Refresh subscription info after successful restore
        await get().loadSubscription();
      }

      set({ isRestoring: false });
      return result;
    } catch (error: any) {
      console.error('Restore failed:', error);
      set({
        isRestoring: false,
        error: error.message || 'Restore failed',
      });

      return {
        success: false,
        error,
      };
    }
  },

  /**
   * Check Feature Access
   * Simple boolean check for feature availability
   *
   * @param feature - Feature identifier
   * @returns True if user has access
   *
   * @example
   * const hasAccess = checkAccess('phase_6');
   */
  checkAccess: (feature: string): boolean => {
    const { tier } = get();

    // Feature access rules (Two-tier model: Novice and Enlightenment)
    // Novice: All features EXCEPT Guru AI chat
    // Enlightenment: All features INCLUDING Guru AI chat
    switch (feature) {
      case 'all_phases':
        return tier === 'novice' || tier === 'enlightenment';

      case 'meditations':
        return tier === 'novice' || tier === 'enlightenment';

      case 'voice_transcription':
        return tier === 'novice' || tier === 'enlightenment';

      case 'vision_board':
        return tier === 'novice' || tier === 'enlightenment';

      case 'unlimited_journals':
        return tier === 'novice' || tier === 'enlightenment';

      case 'guru_chat':
        return tier === 'enlightenment';

      default:
        return false;
    }
  },

  /**
   * Reset Store to Initial State
   * Use when user logs out
   */
  reset: () => {
    set(initialState);
  },
}));

/**
 * Subscription Store Selectors
 * Convenience selectors for common state patterns
 */

/**
 * Get Current Tier
 */
export const useCurrentTier = () =>
  useSubscriptionStore((state) => state.tier);

/**
 * Get Subscription Status
 */
export const useSubscriptionStatus = () =>
  useSubscriptionStore((state) => ({
    tier: state.tier,
    status: state.status,
    isSubscribed: state.isSubscribed,
    isInTrial: state.isInTrial,
  }));

/**
 * Get Available Offerings
 */
export const useOfferings = () =>
  useSubscriptionStore((state) => ({
    offerings: state.offerings,
    isLoading: state.isLoadingOfferings,
  }));

/**
 * Get Purchase Loading State
 */
export const usePurchaseState = () =>
  useSubscriptionStore((state) => ({
    isPurchasing: state.isPurchasing,
    isRestoring: state.isRestoring,
  }));

/**
 * Check if User is Subscribed
 */
export const useIsSubscribed = () =>
  useSubscriptionStore((state) => state.isSubscribed);

/**
 * Check if User is in Trial
 */
export const useIsInTrial = () =>
  useSubscriptionStore((state) => state.isInTrial);

/**
 * Get Trial End Date
 */
export const useTrialEndDate = () =>
  useSubscriptionStore((state) => state.trialEndDate);

/**
 * Get Expiration Date
 */
export const useExpirationDate = () =>
  useSubscriptionStore((state) => state.expirationDate);
