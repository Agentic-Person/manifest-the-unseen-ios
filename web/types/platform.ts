/**
 * Platform Types and Utilities
 *
 * Handles routing and feature access for iOS Companion vs Full Web App
 */

import { SubscriptionTier } from './subscription'

export type Platform = 'ios' | 'web'
export type Product = 'companion' | 'app'

/**
 * Route configuration for each product
 */
export interface ProductRouteConfig {
  prefix: string
  platform: Platform
  requiresSubscription: boolean
  subscriptionRedirect: string
  loginRedirect: string
  features: ProductFeatures
}

/**
 * Features available per product
 */
export interface ProductFeatures {
  workbook: boolean
  guru: boolean
  meditations: boolean
  journal: boolean
  billing: boolean
}

/**
 * Product configurations
 */
export const PRODUCT_CONFIG: Record<Product, ProductRouteConfig> = {
  companion: {
    prefix: '/companion',
    platform: 'ios',
    requiresSubscription: true,
    subscriptionRedirect: '/ios-pricing',
    loginRedirect: '/auth/login?platform=ios',
    features: {
      workbook: true,
      guru: false, // Guru is on mobile app
      meditations: false, // Meditations are on mobile app
      journal: false, // Journal is on mobile app
      billing: false, // Billing is via App Store
    },
  },
  app: {
    prefix: '/app',
    platform: 'web',
    requiresSubscription: true,
    subscriptionRedirect: '/pricing',
    loginRedirect: '/auth/login?platform=web',
    features: {
      workbook: true,
      guru: true,
      meditations: true,
      journal: true,
      billing: true,
    },
  },
}

/**
 * Get product from pathname
 */
export function getProductFromPath(pathname: string): Product | null {
  if (pathname.startsWith('/companion')) return 'companion'
  if (pathname.startsWith('/app')) return 'app'
  return null
}

/**
 * Get product config from pathname
 */
export function getProductConfigFromPath(pathname: string): ProductRouteConfig | null {
  const product = getProductFromPath(pathname)
  return product ? PRODUCT_CONFIG[product] : null
}

/**
 * Get platform from pathname
 */
export function getPlatformFromPath(pathname: string): Platform | null {
  const config = getProductConfigFromPath(pathname)
  return config?.platform ?? null
}

/**
 * Feature access rules by tier
 */
export interface TierFeatureAccess {
  workbookPhases: number[] // Which phases are accessible
  maxJournalEntriesPerMonth: number
  guruAccess: boolean
  guruMessagesPerDay: number
  meditationTiers: SubscriptionTier[] // Which meditation tiers are accessible
}

/**
 * Feature access by subscription tier
 */
export const TIER_FEATURE_ACCESS: Record<SubscriptionTier, TierFeatureAccess> = {
  novice: {
    workbookPhases: [1, 2, 3, 4, 5],
    maxJournalEntriesPerMonth: 50,
    guruAccess: false,
    guruMessagesPerDay: 0,
    meditationTiers: ['novice'],
  },
  awakening: {
    workbookPhases: [1, 2, 3, 4, 5, 6, 7, 8],
    maxJournalEntriesPerMonth: 200,
    guruAccess: true,
    guruMessagesPerDay: 50,
    meditationTiers: ['novice', 'awakening'],
  },
  enlightenment: {
    workbookPhases: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    maxJournalEntriesPerMonth: -1, // Unlimited
    guruAccess: true,
    guruMessagesPerDay: -1, // Unlimited
    meditationTiers: ['novice', 'awakening', 'enlightenment'],
  },
}

/**
 * Free tier access (no subscription)
 */
export const FREE_TIER_ACCESS: TierFeatureAccess = {
  workbookPhases: [1, 2, 3, 4, 5], // Preview phases 1-5
  maxJournalEntriesPerMonth: 10,
  guruAccess: false,
  guruMessagesPerDay: 0,
  meditationTiers: ['novice'], // Basic meditations only
}

/**
 * Get feature access for a tier
 */
export function getFeatureAccess(tier: SubscriptionTier | null): TierFeatureAccess {
  if (!tier) return FREE_TIER_ACCESS
  return TIER_FEATURE_ACCESS[tier]
}

/**
 * Check if user can access a workbook phase
 */
export function canAccessPhase(tier: SubscriptionTier | null, phaseNumber: number): boolean {
  const access = getFeatureAccess(tier)
  return access.workbookPhases.includes(phaseNumber)
}

/**
 * Check if user can access Guru AI
 */
export function canAccessGuru(tier: SubscriptionTier | null): boolean {
  const access = getFeatureAccess(tier)
  return access.guruAccess
}

/**
 * Check if user can access a meditation by its required tier
 */
export function canAccessMeditation(
  userTier: SubscriptionTier | null,
  meditationTier: SubscriptionTier
): boolean {
  const access = getFeatureAccess(userTier)
  return access.meditationTiers.includes(meditationTier)
}

/**
 * Get remaining journal entries for the month
 */
export function getRemainingJournalEntries(
  tier: SubscriptionTier | null,
  usedThisMonth: number
): number {
  const access = getFeatureAccess(tier)
  if (access.maxJournalEntriesPerMonth === -1) return -1 // Unlimited
  return Math.max(0, access.maxJournalEntriesPerMonth - usedThisMonth)
}

/**
 * Check if user has reached journal limit
 */
export function hasReachedJournalLimit(
  tier: SubscriptionTier | null,
  usedThisMonth: number
): boolean {
  const remaining = getRemainingJournalEntries(tier, usedThisMonth)
  return remaining === 0
}

/**
 * Get next upgrade tier
 */
export function getUpgradeTier(currentTier: SubscriptionTier | null): SubscriptionTier | null {
  if (!currentTier) return 'novice'
  if (currentTier === 'novice') return 'awakening'
  if (currentTier === 'awakening') return 'enlightenment'
  return null // Already at highest tier
}
