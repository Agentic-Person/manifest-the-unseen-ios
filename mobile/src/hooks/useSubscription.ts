/**
 * Subscription Custom Hooks
 *
 * React hooks for accessing subscription state and checking feature access.
 *
 * Three-tier model:
 * - Novice: Workbook + progress tracking + music meditations
 * - Awakening: + Guided meditations + Guru workbook analysis + Analytics
 * - Enlightenment: + Coming Soon features (journaling, full AI chat, 12+ tracks)
 *
 * 7-day free trial = Novice-level access
 */

import { useEffect, useMemo } from 'react';
import { useSubscriptionStore } from '../stores/subscriptionStore';
import { useTrialStore } from '../stores/trialStore';
import { FEATURE_LIMITS } from '../types/subscription';
import type { SubscriptionTier } from '../types/subscription';

/**
 * Initialize Subscription
 * Call this in App.tsx or root component to load subscription state
 */
export function useInitializeSubscription() {
  const loadSubscription = useSubscriptionStore((state) => state.loadSubscription);
  const loadOfferings = useSubscriptionStore((state) => state.loadOfferings);

  useEffect(() => {
    // Load subscription info and offerings on mount
    loadSubscription();
    loadOfferings();
  }, [loadSubscription, loadOfferings]);
}

/**
 * Check if user has an active subscription (Novice or Enlightenment)
 * This includes users in their 7-day free trial
 */
export function useHasSubscription(): boolean {
  const tier = useSubscriptionStore((state) => state.tier);
  return tier !== 'free';
}

/**
 * Check Guru Workbook Analysis Access
 * Returns true for Awakening+ tiers
 * Novice and free users do NOT have Guru access
 */
export function useGuruAccess(): boolean {
  const tier = useSubscriptionStore((state) => state.tier);

  return useMemo(() => {
    const limits = FEATURE_LIMITS[tier];
    return limits.hasGuruAnalysis;
  }, [tier]);
}

/**
 * Check Guided Meditation Access
 * Returns true for Awakening+ tiers
 * Novice gets only music meditations
 */
export function useGuidedMeditationAccess(): boolean {
  const tier = useSubscriptionStore((state) => state.tier);

  return useMemo(() => {
    const limits = FEATURE_LIMITS[tier];
    return limits.hasGuidedMeditations;
  }, [tier]);
}

/**
 * Check Phase Access
 * Returns true if user has any paid subscription
 * All paid tiers have access to all 10 phases
 */
export function usePhaseAccess(phaseNumber: number): boolean {
  const tier = useSubscriptionStore((state) => state.tier);

  return useMemo(() => {
    const limits = FEATURE_LIMITS[tier];
    return phaseNumber <= limits.maxPhase;
  }, [tier, phaseNumber]);
}

/**
 * Check Basic Meditation Access (music tracks)
 * Returns true if user has any paid subscription
 */
export function useMeditationAccess(_meditationIndex?: number): boolean {
  const tier = useSubscriptionStore((state) => state.tier);

  return useMemo(() => {
    // Free tier has no meditation access
    if (tier === 'free') {
      return false;
    }
    // All paid tiers have access to music meditations
    return true;
  }, [tier]);
}

/**
 * Check Vision Board Access
 * Returns true if user has any subscription (Novice or Enlightenment)
 */
export function useVisionBoardAccess(): boolean {
  const tier = useSubscriptionStore((state) => state.tier);

  return useMemo(() => {
    const limits = FEATURE_LIMITS[tier];
    return limits.hasVisionBoard;
  }, [tier]);
}

/**
 * Get All Feature Access
 * Returns comprehensive feature access status for current tier
 */
export function useFeatureAccess() {
  const tier = useSubscriptionStore((state) => state.tier);

  return useMemo(() => {
    const limits = FEATURE_LIMITS[tier];

    return {
      tier,
      isSubscribed: tier !== 'free',
      maxPhase: limits.maxPhase,
      maxMeditations: limits.maxMeditations,
      hasGuidedMeditations: limits.hasGuidedMeditations,
      hasGuruAnalysis: limits.hasGuruAnalysis,
      hasFullGuruChat: limits.hasFullGuruChat,
      hasJournaling: limits.hasJournaling,
      hasAdvancedAnalytics: limits.hasAdvancedAnalytics,
      hasVisionBoard: limits.hasVisionBoard,
    };
  }, [tier]);
}

/**
 * Get Subscription Summary
 * Returns complete subscription information for display in UI
 *
 * Combines data from both subscriptionStore (RevenueCat) and trialStore (local trial tracking)
 * to provide accurate, user-friendly subscription status.
 */
export function useSubscriptionSummary() {
  const tier = useSubscriptionStore((state) => state.tier);
  const status = useSubscriptionStore((state) => state.status);
  const isSubscribed = useSubscriptionStore((state) => state.isSubscribed);
  const isInTrial = useSubscriptionStore((state) => state.isInTrial);
  const period = useSubscriptionStore((state) => state.period);
  const trialEndDate = useSubscriptionStore((state) => state.trialEndDate);
  const expirationDate = useSubscriptionStore((state) => state.expirationDate);
  const willRenew = useSubscriptionStore((state) => state.willRenew);
  const testModeEnabled = useSubscriptionStore((state) => state.testModeEnabled);

  // Also check local trial store for accurate trial status
  const isInTrialPeriod = useTrialStore((state) => state.isInTrialPeriod);
  const trialDaysRemaining = useTrialStore((state) => state.trialDaysRemaining);

  return useMemo(() => {
    const tierNames: Record<SubscriptionTier, string> = {
      free: 'Free',
      novice: 'Novice Path',
      awakening: 'Awakening Path',
      enlightenment: 'Enlightenment Path',
    };

    // Check if we're in TestFlight/DEV mode (auto-subscribed)
    const isTestFlight = process.env.EXPO_PUBLIC_TESTFLIGHT_FULL_ACCESS === 'true';
    const isDevMode = __DEV__;
    const isTestEnvironment = (isTestFlight || isDevMode) && !testModeEnabled;

    // Determine the display tier name
    let displayTierName = tierNames[tier];

    // Determine the status label with more context
    let statusLabel: string;

    if (isTestEnvironment) {
      // TestFlight/DEV with bypass active
      statusLabel = 'TestFlight Access';
    } else if (isInTrialPeriod && !isSubscribed) {
      // User is in local trial period (not a paid subscription)
      statusLabel =
        trialDaysRemaining === 1 ? 'Trial - 1 day left' : `Trial - ${trialDaysRemaining} days left`;
      displayTierName = 'Free Trial';
    } else if (isInTrial && isSubscribed) {
      // User has started a subscription trial (from RevenueCat)
      if (trialEndDate) {
        const daysLeft = Math.ceil(
          (new Date(trialEndDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        );
        statusLabel = daysLeft === 1 ? 'Trial - 1 day left' : `Trial - ${daysLeft} days left`;
      } else {
        statusLabel = 'Trial';
      }
    } else if (status === 'active') {
      statusLabel =
        period === 'monthly'
          ? 'Active - Monthly'
          : period === 'yearly'
            ? 'Active - Annual'
            : 'Active';
    } else if (status === 'cancelled') {
      if (expirationDate) {
        const expDate = new Date(expirationDate);
        statusLabel = `Cancelled - Expires ${expDate.toLocaleDateString()}`;
      } else {
        statusLabel = 'Cancelled';
      }
    } else if (status === 'expired') {
      statusLabel = 'Expired';
    } else if (status === 'grace_period') {
      statusLabel = 'Payment Issue - Update billing';
    } else if (tier === 'free' && !isInTrialPeriod) {
      statusLabel = 'No Active Subscription';
    } else {
      statusLabel = 'No Subscription';
    }

    return {
      tier,
      tierName: displayTierName,
      status,
      statusLabel,
      isSubscribed,
      isInTrial: isInTrial || isInTrialPeriod,
      isInTrialPeriod, // Local trial (first 7 days of app use)
      trialDaysRemaining,
      period,
      periodLabel:
        period === 'monthly'
          ? 'Monthly'
          : period === 'yearly'
            ? 'Annual'
            : period === 'lifetime'
              ? 'Lifetime'
              : null,
      trialEndDate,
      expirationDate,
      willRenew,
      isTestEnvironment,
    };
  }, [
    tier,
    status,
    isSubscribed,
    isInTrial,
    period,
    trialEndDate,
    expirationDate,
    willRenew,
    isInTrialPeriod,
    trialDaysRemaining,
    testModeEnabled,
  ]);
}

/**
 * Get Upgrade Tier Recommendation
 * Three-tier upgrade paths:
 * - Free -> Novice (for workbook, music meditations)
 * - Novice -> Awakening (for guided meditations, Guru analysis)
 * - Awakening -> Enlightenment (for Coming Soon features)
 */
export function useUpgradeTierRecommendation(feature: string): SubscriptionTier | null {
  const currentTier = useSubscriptionStore((state) => state.tier);

  return useMemo(() => {
    // If already at highest tier, no upgrade available
    if (currentTier === 'enlightenment') {
      return null;
    }

    // Enlightenment-only features (Coming Soon)
    if (
      feature === 'full_guru_chat' ||
      feature === 'journaling' ||
      feature === 'all_meditation_tracks'
    ) {
      return 'enlightenment';
    }

    // Awakening+ features
    if (
      feature === 'guided_meditations' ||
      feature === 'guru' ||
      feature === 'guru_analysis' ||
      feature === 'advanced_analytics'
    ) {
      if (currentTier === 'awakening') {
        return null; // Already has access
      }
      return 'awakening';
    }

    // Basic features just need Novice
    if (currentTier === 'free') {
      return 'novice';
    }

    // Novice users - recommend Awakening for next level
    if (currentTier === 'novice') {
      return 'awakening';
    }

    return null;
  }, [currentTier, feature]);
}

/**
 * Get Effective Feature Access
 *
 * CRITICAL: This is the hook all screens should use for feature gating!
 *
 * Combines:
 * 1. Trial status (from trialStore) - 7-day free trial with full access
 * 2. Subscription tier (from RevenueCat/subscriptionStore) - paid subscriptions
 *
 * Returns effective access based on whichever grants more access.
 *
 * Business Logic:
 * - Trial users (first 7 days): Full access like Enlightenment, but Guru is rate-limited
 * - After trial expires: Access based on subscription tier (free = locked)
 * - Paid subscribers: Access based on their tier, unlimited Guru for Awakening+
 */
export function useEffectiveAccess() {
  const tier = useSubscriptionStore((state) => state.tier);
  const isInTrialPeriod = useTrialStore((state) => state.isInTrialPeriod);
  const trialDaysRemaining = useTrialStore((state) => state.trialDaysRemaining);
  const trialLoading = useTrialStore((state) => state.isLoading);
  const subscriptionLoading = useSubscriptionStore((state) => state.isLoading);

  return useMemo(() => {
    const isLoading = trialLoading || subscriptionLoading;

    // Trial users get full access (like enlightenment but with rate-limited Guru)
    if (isInTrialPeriod) {
      return {
        // Status
        tier: 'free' as SubscriptionTier, // Actual tier from RevenueCat
        effectiveTier: 'enlightenment' as SubscriptionTier, // Effective access level
        isTrialUser: true,
        trialDaysRemaining,
        isLoading,

        // Feature access (full access during trial)
        maxPhase: FEATURE_LIMITS.enlightenment.maxPhase,
        maxMeditations: FEATURE_LIMITS.enlightenment.maxMeditations,
        hasGuidedMeditations: FEATURE_LIMITS.enlightenment.hasGuidedMeditations,
        hasGuruAnalysis: true, // Enabled but rate-limited (handled by guruRateLimitStore)
        hasFullGuruChat: FEATURE_LIMITS.enlightenment.hasFullGuruChat,
        hasJournaling: FEATURE_LIMITS.enlightenment.hasJournaling,
        hasAdvancedAnalytics: FEATURE_LIMITS.enlightenment.hasAdvancedAnalytics,
        hasVisionBoard: FEATURE_LIMITS.enlightenment.hasVisionBoard,

        // Subscription status
        isSubscribed: false,
      };
    }

    // Non-trial users: use actual tier from RevenueCat
    const limits = FEATURE_LIMITS[tier];

    return {
      // Status
      tier,
      effectiveTier: tier,
      isTrialUser: false,
      trialDaysRemaining: 0,
      isLoading,

      // Feature access from tier
      maxPhase: limits.maxPhase,
      maxMeditations: limits.maxMeditations,
      hasGuidedMeditations: limits.hasGuidedMeditations,
      hasGuruAnalysis: limits.hasGuruAnalysis,
      hasFullGuruChat: limits.hasFullGuruChat,
      hasJournaling: limits.hasJournaling,
      hasAdvancedAnalytics: limits.hasAdvancedAnalytics,
      hasVisionBoard: limits.hasVisionBoard,

      // Subscription status
      isSubscribed: tier !== 'free',
    };
  }, [tier, isInTrialPeriod, trialDaysRemaining, trialLoading, subscriptionLoading]);
}
