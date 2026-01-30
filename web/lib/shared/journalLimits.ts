/**
 * Journal Limit Utilities
 *
 * Helper functions for calculating and checking journal entry limits
 * based on subscription tier.
 */

import { SubscriptionTier } from '@/types/subscription'
import {
  getFeatureAccess,
  getRemainingJournalEntries,
  hasReachedJournalLimit,
  TierFeatureAccess
} from '@/types/platform'

/**
 * Get the start of the current month in UTC
 */
export function getMonthStart(): Date {
  const now = new Date()
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))
}

/**
 * Get the end of the current month in UTC
 */
export function getMonthEnd(): Date {
  const now = new Date()
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0, 23, 59, 59, 999))
}

/**
 * Get ISO strings for the current month range (for Supabase queries)
 */
export function getMonthRange(): { start: string; end: string } {
  return {
    start: getMonthStart().toISOString(),
    end: getMonthEnd().toISOString(),
  }
}

/**
 * Calculate entries used this month
 */
export function calculateEntriesUsed(entries: { created_at: string }[]): number {
  const monthStart = getMonthStart()
  const monthEnd = getMonthEnd()

  return entries.filter(entry => {
    const createdAt = new Date(entry.created_at)
    return createdAt >= monthStart && createdAt <= monthEnd
  }).length
}

/**
 * Get journal limit information for a tier
 */
export interface JournalLimitInfo {
  maxEntries: number
  isUnlimited: boolean
  usedEntries: number
  remainingEntries: number
  percentUsed: number
  hasReachedLimit: boolean
  isLow: boolean // Less than 20% remaining
  isWarning: boolean // Less than 10% remaining
}

export function getJournalLimitInfo(
  tier: SubscriptionTier | null,
  usedThisMonth: number
): JournalLimitInfo {
  const access = getFeatureAccess(tier)
  const maxEntries = access.maxJournalEntriesPerMonth
  const isUnlimited = maxEntries === -1
  const remaining = getRemainingJournalEntries(tier, usedThisMonth)
  const reachedLimit = hasReachedJournalLimit(tier, usedThisMonth)

  const percentUsed = isUnlimited ? 0 : Math.min(100, Math.round((usedThisMonth / maxEntries) * 100))
  const percentRemaining = 100 - percentUsed

  return {
    maxEntries,
    isUnlimited,
    usedEntries: usedThisMonth,
    remainingEntries: remaining,
    percentUsed,
    hasReachedLimit: reachedLimit,
    isLow: !isUnlimited && percentRemaining <= 20 && percentRemaining > 10,
    isWarning: !isUnlimited && percentRemaining <= 10,
  }
}

/**
 * Get display text for journal limit
 */
export function getJournalLimitDisplayText(info: JournalLimitInfo): string {
  if (info.isUnlimited) {
    return 'Unlimited entries'
  }

  if (info.hasReachedLimit) {
    return 'Monthly limit reached'
  }

  return `${info.remainingEntries} entries remaining this month`
}

/**
 * Get upgrade suggestion based on current tier and usage
 */
export function getUpgradeSuggestion(
  tier: SubscriptionTier | null,
  info: JournalLimitInfo
): string | null {
  if (info.isUnlimited) {
    return null
  }

  if (info.hasReachedLimit || info.isWarning) {
    if (!tier) {
      return 'Upgrade to Seeker for 50 entries/month'
    }
    if (tier === 'novice') {
      return 'Upgrade to Awakening for 200 entries/month'
    }
    if (tier === 'awakening') {
      return 'Upgrade to Enlightenment for unlimited entries'
    }
  }

  return null
}
