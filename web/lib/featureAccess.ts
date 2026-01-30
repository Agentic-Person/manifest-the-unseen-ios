/**
 * Centralized Feature Gating Logic
 *
 * Provides functions to check feature access based on subscription tier and platform.
 */

import {
  Platform,
  Product,
  ProductFeatures,
  TierFeatureAccess,
  PRODUCT_CONFIG,
  TIER_FEATURE_ACCESS,
  FREE_TIER_ACCESS,
  getFeatureAccess as getTierFeatureAccess,
  canAccessPhase as tierCanAccessPhase,
  canAccessGuru as tierCanAccessGuru,
  canAccessMeditation as tierCanAccessMeditation,
  getRemainingJournalEntries as tierGetRemainingJournalEntries,
  hasReachedJournalLimit as tierHasReachedJournalLimit,
} from '@/types/platform'
import { SubscriptionTier } from '@/types/subscription'

export interface FeatureAccessResult {
  canAccess: boolean
  reason?: string
  upgradeRequired?: boolean
  requiredTier?: SubscriptionTier
}

export interface UserFeatureAccess {
  tier: SubscriptionTier | null
  platform: Platform | null
  product: Product | null
  productFeatures: ProductFeatures | null
  tierAccess: TierFeatureAccess
}

/**
 * Get complete feature access for a user based on their tier and current product
 */
export function getUserFeatureAccess(
  tier: SubscriptionTier | null,
  product: Product | null
): UserFeatureAccess {
  const productConfig = product ? PRODUCT_CONFIG[product] : null

  return {
    tier,
    platform: productConfig?.platform ?? null,
    product,
    productFeatures: productConfig?.features ?? null,
    tierAccess: getTierFeatureAccess(tier),
  }
}

/**
 * Check if user can access a specific workbook phase
 */
export function canAccessWorkbookPhase(
  tier: SubscriptionTier | null,
  product: Product | null,
  phaseNumber: number
): FeatureAccessResult {
  const productConfig = product ? PRODUCT_CONFIG[product] : null

  // Check if product supports workbook
  if (productConfig && !productConfig.features.workbook) {
    return {
      canAccess: false,
      reason: 'Workbook is not available in this product',
    }
  }

  // Check tier access
  const access = getTierFeatureAccess(tier)
  const canAccess = access.workbookPhases.includes(phaseNumber)

  if (!canAccess) {
    // Determine which tier is required
    let requiredTier: SubscriptionTier = 'novice'
    if (phaseNumber > 5 && phaseNumber <= 8) {
      requiredTier = 'awakening'
    } else if (phaseNumber > 8) {
      requiredTier = 'enlightenment'
    }

    return {
      canAccess: false,
      reason: `Phase ${phaseNumber} requires ${requiredTier} tier or higher`,
      upgradeRequired: true,
      requiredTier,
    }
  }

  return { canAccess: true }
}

/**
 * Check if user can access Guru AI
 */
export function canAccessGuruAI(
  tier: SubscriptionTier | null,
  product: Product | null
): FeatureAccessResult {
  const productConfig = product ? PRODUCT_CONFIG[product] : null

  // Check if product supports Guru
  if (productConfig && !productConfig.features.guru) {
    return {
      canAccess: false,
      reason: 'Guru AI is only available in the full web app',
    }
  }

  // Check tier access
  if (!tierCanAccessGuru(tier)) {
    return {
      canAccess: false,
      reason: 'Guru AI requires Awakening tier or higher',
      upgradeRequired: true,
      requiredTier: 'awakening',
    }
  }

  return { canAccess: true }
}

/**
 * Check if user can access meditations
 */
export function canAccessMeditations(
  tier: SubscriptionTier | null,
  product: Product | null
): FeatureAccessResult {
  const productConfig = product ? PRODUCT_CONFIG[product] : null

  // Check if product supports meditations
  if (productConfig && !productConfig.features.meditations) {
    return {
      canAccess: false,
      reason: 'Meditations are only available in the full web app',
    }
  }

  return { canAccess: true }
}

/**
 * Check if user can access a specific meditation by tier
 */
export function canAccessMeditationByTier(
  userTier: SubscriptionTier | null,
  meditationTier: SubscriptionTier
): FeatureAccessResult {
  if (!tierCanAccessMeditation(userTier, meditationTier)) {
    return {
      canAccess: false,
      reason: `This meditation requires ${meditationTier} tier`,
      upgradeRequired: true,
      requiredTier: meditationTier,
    }
  }

  return { canAccess: true }
}

/**
 * Check if user can access journal feature
 */
export function canAccessJournal(
  tier: SubscriptionTier | null,
  product: Product | null
): FeatureAccessResult {
  const productConfig = product ? PRODUCT_CONFIG[product] : null

  // Check if product supports journal
  if (productConfig && !productConfig.features.journal) {
    return {
      canAccess: false,
      reason: 'Journal is only available in the full web app',
    }
  }

  return { canAccess: true }
}

/**
 * Check if user can create a new journal entry (limit check)
 */
export function canCreateJournalEntry(
  tier: SubscriptionTier | null,
  usedThisMonth: number
): FeatureAccessResult {
  if (tierHasReachedJournalLimit(tier, usedThisMonth)) {
    const access = getTierFeatureAccess(tier)
    return {
      canAccess: false,
      reason: `You've reached your monthly limit of ${access.maxJournalEntriesPerMonth} journal entries`,
      upgradeRequired: true,
      requiredTier: tier === 'novice' ? 'awakening' : 'enlightenment',
    }
  }

  return { canAccess: true }
}

/**
 * Get the number of remaining journal entries for the month
 */
export function getJournalEntriesRemaining(
  tier: SubscriptionTier | null,
  usedThisMonth: number
): number {
  return tierGetRemainingJournalEntries(tier, usedThisMonth)
}

/**
 * Check if user can access billing management
 */
export function canAccessBilling(product: Product | null): FeatureAccessResult {
  const productConfig = product ? PRODUCT_CONFIG[product] : null

  if (productConfig && !productConfig.features.billing) {
    return {
      canAccess: false,
      reason: 'Billing is managed through the iOS App Store',
    }
  }

  return { canAccess: true }
}

/**
 * Get the list of accessible phases for a tier
 */
export function getAccessiblePhases(tier: SubscriptionTier | null): number[] {
  const access = getTierFeatureAccess(tier)
  return access.workbookPhases
}

/**
 * Get the maximum phase number accessible for a tier
 */
export function getMaxAccessiblePhase(tier: SubscriptionTier | null): number {
  const phases = getAccessiblePhases(tier)
  return Math.max(...phases)
}

/**
 * Check if a feature is locked and requires upgrade
 */
export function isFeatureLocked(
  feature: 'guru' | 'journal' | 'meditations' | 'billing',
  tier: SubscriptionTier | null,
  product: Product | null
): boolean {
  switch (feature) {
    case 'guru':
      return !canAccessGuruAI(tier, product).canAccess
    case 'journal':
      return !canAccessJournal(tier, product).canAccess
    case 'meditations':
      return !canAccessMeditations(tier, product).canAccess
    case 'billing':
      return !canAccessBilling(product).canAccess
    default:
      return false
  }
}

// Re-export tier-level functions for convenience
export {
  getTierFeatureAccess as getFeatureAccess,
  tierCanAccessPhase as canAccessPhase,
  tierCanAccessGuru,
  tierCanAccessMeditation,
  tierGetRemainingJournalEntries as getRemainingJournalEntries,
  tierHasReachedJournalLimit as hasReachedJournalLimit,
}
