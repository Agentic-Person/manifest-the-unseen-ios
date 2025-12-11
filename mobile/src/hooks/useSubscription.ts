/**
 * Subscription Custom Hooks
 *
 * React hooks for accessing subscription state and checking feature access.
 *
 * Simplified two-tier model:
 * - Novice: Full app access EXCEPT Guru AI chat
 * - Enlightenment: Full app access INCLUDING Guru AI chat
 *
 * 7-day free trial = Novice-level access (everything except Guru)
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
 * Check Guru Access
 * Returns true ONLY for Enlightenment tier
 * Novice and free users do NOT have Guru access
 */
export function useGuruAccess(): boolean {
  const tier = useSubscriptionStore((state) => state.tier);

  return useMemo(() => {
    const limits = FEATURE_LIMITS[tier];
    return limits.hasGuru;
  }, [tier]);
}

/**
 * Check Phase Access
 * Returns true if user has any subscription (Novice or Enlightenment)
 * Both tiers have access to all 10 phases
 */
export function usePhaseAccess(phaseNumber: number): boolean {
  const tier = useSubscriptionStore((state) => state.tier);

  return useMemo(() => {
    const limits = FEATURE_LIMITS[tier];
    return phaseNumber <= limits.maxPhase;
  }, [tier, phaseNumber]);
}

/**
 * Check Meditation Access
 * Returns true if user has any subscription (Novice or Enlightenment)
 * Both tiers have access to all meditations
 */
export function useMeditationAccess(_meditationIndex?: number): boolean {
  const tier = useSubscriptionStore((state) => state.tier);

  return useMemo(() => {
    // Free tier has no meditation access
    if (tier === 'free') {
      return false;
    }
    // Both Novice and Enlightenment have access to all meditations
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
      hasGuru: limits.hasGuru,
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
 * Simplified: Only two upgrade paths
 * - Free -> Novice (for app access)
 * - Novice -> Enlightenment (for Guru access)
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

    // Guru feature requires Enlightenment
    if (feature === 'guru' || feature === 'ai_chat') {
      return 'enlightenment';
    }

    // All other features just need Novice subscription
    if (currentTier === 'free') {
      return 'novice';
    }

    // Novice users wanting to upgrade
    return 'enlightenment';
  }, [currentTier, feature]);
}
