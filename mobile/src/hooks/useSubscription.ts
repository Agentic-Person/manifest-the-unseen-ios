/**
 * Subscription Custom Hooks
 *
 * React hooks for accessing subscription state and checking feature access.
 * Provides convenient hooks for components to check phase access, quotas, etc.
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
 * Check Phase Access
 * Returns true if user's subscription tier allows access to the specified phase
 *
 * @param phaseNumber - Phase number (1-10)
 * @returns True if user has access to this phase
 *
 * @example
 * const hasAccess = usePhaseAccess(6);
 * if (!hasAccess) {
 *   // Show upgrade prompt
 * }
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
 * Returns true if user's subscription tier allows access to the meditation
 *
 * @param meditationIndex - Meditation index (0-17, where 0 is first meditation)
 * @returns True if user has access to this meditation
 *
 * @example
 * const hasAccess = useMeditationAccess(5);
 */
export function useMeditationAccess(meditationIndex: number): boolean {
  const tier = useSubscriptionStore((state) => state.tier);

  return useMemo(() => {
    const limits = FEATURE_LIMITS[tier];

    // Free tier has no meditation access
    if (tier === 'free') {
      return false;
    }

    // Enlightenment tier has access to all 18 meditations
    if (limits.maxMeditations === 18) {
      return true;
    }

    // Check if meditation index is within tier's limit
    return meditationIndex < limits.maxMeditations;
  }, [tier, meditationIndex]);
}

/**
 * Get AI Chat Quota
 * Returns AI chat quota information for current tier
 *
 * @param todayCount - Number of AI chat messages sent today
 * @returns Quota information
 *
 * @example
 * const { hasQuota, limit, remaining } = useAIChatQuota(8);
 * if (!hasQuota) {
 *   // Show upgrade prompt
 * }
 */
export function useAIChatQuota(todayCount: number): {
  hasQuota: boolean;
  limit: number;
  remaining: number;
  isUnlimited: boolean;
} {
  const tier = useSubscriptionStore((state) => state.tier);

  return useMemo(() => {
    const limits = FEATURE_LIMITS[tier];
    const limit = limits.maxAIChatPerDay;

    // Unlimited (-1 means unlimited)
    if (limit === -1) {
      return {
        hasQuota: true,
        limit: -1,
        remaining: -1,
        isUnlimited: true,
      };
    }

    // Check if under quota
    const hasQuota = todayCount < limit;
    const remaining = Math.max(0, limit - todayCount);

    return {
      hasQuota,
      limit,
      remaining,
      isUnlimited: false,
    };
  }, [tier, todayCount]);
}

/**
 * Check Vision Board Access
 * Returns true if user's tier includes vision board feature
 *
 * @returns True if user has vision board access
 *
 * @example
 * const hasVisionBoard = useVisionBoardAccess();
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
 *
 * @returns Object with all feature access booleans
 *
 * @example
 * const features = useFeatureAccess();
 * if (!features.hasVisionBoard) {
 *   // Disable vision board button
 * }
 */
export function useFeatureAccess() {
  const tier = useSubscriptionStore((state) => state.tier);

  return useMemo(() => {
    const limits = FEATURE_LIMITS[tier];

    return {
      tier,
      maxPhase: limits.maxPhase,
      maxMeditations: limits.maxMeditations,
      maxAIChatPerDay: limits.maxAIChatPerDay,
      hasVisionBoard: limits.hasVisionBoard,
      isUnlimitedAIChat: limits.maxAIChatPerDay === -1,
    };
  }, [tier]);
}

/**
 * Get Subscription Summary
 * Returns complete subscription information for display in UI
 *
 * @returns Subscription summary object
 *
 * @example
 * const summary = useSubscriptionSummary();
 * console.log(`Tier: ${summary.tierName}, Trial: ${summary.isInTrial}`);
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
    const tierNames = {
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
 * Returns the recommended tier to upgrade to based on locked feature
 *
 * @param feature - Feature that is locked
 * @returns Recommended tier to unlock this feature
 *
 * @example
 * const recommendedTier = useUpgradeTierRecommendation('phase_9');
 * // Returns 'enlightenment'
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

    // Feature-specific recommendations
    if (feature.startsWith('phase_')) {
      const phaseNumber = parseInt(feature.split('_')[1], 10);

      if (phaseNumber >= 9) {
        return 'enlightenment';
      }

      if (phaseNumber >= 6) {
        return 'awakening';
      }

      return 'novice';
    }

    if (feature === 'unlimited_journals' || feature === 'unlimited_ai_chat') {
      return 'enlightenment';
    }

    if (feature === 'voice_transcription' || feature === 'vision_board') {
      return 'awakening';
    }

    // Default: recommend next tier up
    if (currentTier === 'free') {
      return 'novice';
    }

    if (currentTier === 'novice') {
      return 'awakening';
    }

    return 'enlightenment';
  }, [currentTier, feature]);
}
