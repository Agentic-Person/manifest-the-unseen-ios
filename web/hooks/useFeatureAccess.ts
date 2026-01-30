'use client'

import { useMemo } from 'react'
import { useSubscription } from './useSubscription'
import { usePlatform } from './usePlatform'
import {
  UserFeatureAccess,
  FeatureAccessResult,
  getUserFeatureAccess,
  canAccessWorkbookPhase,
  canAccessGuruAI,
  canAccessMeditations,
  canAccessMeditationByTier,
  canAccessJournal,
  canCreateJournalEntry,
  canAccessBilling,
  getAccessiblePhases,
  getMaxAccessiblePhase,
  isFeatureLocked,
  getJournalEntriesRemaining,
} from '@/lib/featureAccess'
import { SubscriptionTier } from '@/types/subscription'

export interface UseFeatureAccessReturn extends UserFeatureAccess {
  /**
   * Loading state while fetching subscription
   */
  loading: boolean

  /**
   * Whether the user has an active subscription
   */
  isSubscribed: boolean

  /**
   * Check if user can access a specific workbook phase
   */
  canAccessPhase: (phaseNumber: number) => FeatureAccessResult

  /**
   * Check if user can access Guru AI
   */
  canAccessGuru: () => FeatureAccessResult

  /**
   * Check if user can access meditations feature
   */
  canAccessMeditations: () => FeatureAccessResult

  /**
   * Check if user can access a specific meditation by tier
   */
  canAccessMeditationByTier: (meditationTier: SubscriptionTier) => FeatureAccessResult

  /**
   * Check if user can access journal feature
   */
  canAccessJournal: () => FeatureAccessResult

  /**
   * Check if user can create a new journal entry (checks monthly limit)
   */
  canCreateJournalEntry: (usedThisMonth: number) => FeatureAccessResult

  /**
   * Get remaining journal entries for the month
   */
  getJournalEntriesRemaining: (usedThisMonth: number) => number

  /**
   * Check if user can access billing management
   */
  canAccessBilling: () => FeatureAccessResult

  /**
   * Get list of accessible workbook phases
   */
  getAccessiblePhases: () => number[]

  /**
   * Get maximum accessible phase number
   */
  getMaxAccessiblePhase: () => number

  /**
   * Check if a specific feature is locked
   */
  isFeatureLocked: (feature: 'guru' | 'journal' | 'meditations' | 'billing') => boolean
}

/**
 * Hook combining subscription and platform for comprehensive feature access control.
 *
 * @example
 * ```tsx
 * const { tier, canAccessPhase, canAccessGuru, loading } = useFeatureAccess()
 *
 * if (loading) return <LoadingSpinner />
 *
 * const phaseAccess = canAccessPhase(7)
 * if (!phaseAccess.canAccess) {
 *   return <UpgradePrompt reason={phaseAccess.reason} />
 * }
 *
 * // User can access phase 7
 * return <Phase7Content />
 * ```
 */
export function useFeatureAccess(): UseFeatureAccessReturn {
  const { tier, isSubscribed, loading } = useSubscription()
  const { product, platform, config } = usePlatform()

  const featureAccess = useMemo(
    () => getUserFeatureAccess(tier, product),
    [tier, product]
  )

  return {
    ...featureAccess,
    loading,
    isSubscribed,

    canAccessPhase: (phaseNumber: number) =>
      canAccessWorkbookPhase(tier, product, phaseNumber),

    canAccessGuru: () => canAccessGuruAI(tier, product),

    canAccessMeditations: () => canAccessMeditations(tier, product),

    canAccessMeditationByTier: (meditationTier: SubscriptionTier) =>
      canAccessMeditationByTier(tier, meditationTier),

    canAccessJournal: () => canAccessJournal(tier, product),

    canCreateJournalEntry: (usedThisMonth: number) =>
      canCreateJournalEntry(tier, usedThisMonth),

    getJournalEntriesRemaining: (usedThisMonth: number) =>
      getJournalEntriesRemaining(tier, usedThisMonth),

    canAccessBilling: () => canAccessBilling(product),

    getAccessiblePhases: () => getAccessiblePhases(tier),

    getMaxAccessiblePhase: () => getMaxAccessiblePhase(tier),

    isFeatureLocked: (feature: 'guru' | 'journal' | 'meditations' | 'billing') =>
      isFeatureLocked(feature, tier, product),
  }
}
