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

  return useMemo(() => {
    const tierNames: Record<SubscriptionTier, string> = {
      free: 'Free',
      novice: 'Novice Path',
      awakening: 'Awakening Path',
      enlightenment: 'Enlightenment Path',
    };

    const statusLabels = {
      none: 'No Subscription',
      active: 'Active',
      trial: 'Trial',
      expired: 'Expired',
      cancelled: 'Cancelled',
      grace_period: 'Grace Period',
    };

    return {
      tier,
      tierName: tierNames[tier],
      status,
      statusLabel: statusLabels[status],
      isSubscribed,
      isInTrial,
      period,
      periodLabel: period === 'monthly' ? 'Monthly' : period === 'yearly' ? 'Annual' : period === 'lifetime' ? 'Lifetime' : null,
      trialEndDate,
      expirationDate,
      willRenew,
    };
  }, [tier, status, isSubscribed, isInTrial, period, trialEndDate, expirationDate, willRenew]);
}

/**
 * Get Upgrade Tier Recommendation
 * Three-tier upgrade paths:
 * - Free -> Novice (for workbook, music meditations)
 * - Novice -> Awakening (for guided meditations, Guru analysis)
 * - Awakening -> Enlightenment (for Coming Soon features)
 */
export function useUpgradeTierRecommendation(
  feature: string
): SubscriptionTier | null {
  const currentTier = useSubscriptionStore((state) => state.tier);

  return useMemo(() => {
    // If already at highest tier, no upgrade available
    if (currentTier === 'enlightenment') {
      return null;
    }

    // Enlightenment-only features (Coming Soon)
    if (feature === 'full_guru_chat' || feature === 'journaling' || feature === 'all_meditation_tracks') {
      return 'enlightenment';
    }

    // Awakening+ features
    if (feature === 'guided_meditations' || feature === 'guru' || feature === 'guru_analysis' || feature === 'advanced_analytics') {
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
