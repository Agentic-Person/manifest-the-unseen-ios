/**
 * Subscription Type Definitions
 *
 * Defines types for RevenueCat subscription management,
 * including tiers, packages, entitlements, and purchase results.
 */

import type { PurchasesPackage, CustomerInfo, PurchasesError } from 'react-native-purchases';

/**
 * Subscription Tier Levels
 * - free: No subscription (before trial or after expiration)
 * - novice: Workbook access, progress tracking, music meditations ($7.99/mo, $79.92/yr)
 * - awakening: Everything in Novice + guided meditations + Guru workbook analysis ($19.99/mo, $199.90/yr)
 * - enlightenment: Everything + Coming Soon features ($49.99/mo, $499.90/yr)
 *
 * Note: 7-day free trial gives Novice-level access
 */
export type SubscriptionTier = 'free' | 'novice' | 'awakening' | 'enlightenment';

/**
 * Subscription Period (Monthly or Annual)
 */
export type SubscriptionPeriod = 'monthly' | 'yearly' | 'lifetime';

/**
 * Subscription Status
 */
export type SubscriptionStatus =
  | 'active'
  | 'trial'
  | 'expired'
  | 'cancelled'
  | 'grace_period'
  | 'none';

/**
 * Subscription Package with Pricing Info
 * Extends RevenueCat's PurchasesPackage with our tier mapping
 */
export interface SubscriptionPackage {
  id: string;
  tier: SubscriptionTier;
  period: SubscriptionPeriod;
  price: string;
  pricePerMonth: string;
  currencyCode: string;
  title: string;
  description: string;
  rcPackage: PurchasesPackage;
}

/**
 * Subscription Offering - Simplified for Test Store
 * In production, each tier would have monthly/yearly options
 */
export interface SubscriptionOffering {
  monthly: SubscriptionPackage | null;
  yearly: SubscriptionPackage | null;
  lifetime: SubscriptionPackage | null;
}

/**
 * Purchase Result
 */
export interface PurchaseResult {
  success: boolean;
  customerInfo?: CustomerInfo;
  userCancelled?: boolean;
  error?: PurchasesError;
}

/**
 * Restore Result
 */
export interface RestoreResult {
  success: boolean;
  customerInfo?: CustomerInfo;
  error?: PurchasesError;
}

/**
 * Subscription Info
 * Complete user subscription state
 */
export interface SubscriptionInfo {
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  isSubscribed: boolean;
  isInTrial: boolean;
  trialEndDate: string | null;
  expirationDate: string | null;
  willRenew: boolean;
  period: SubscriptionPeriod | null;
  customerInfo: CustomerInfo | null;
}

/**
 * Entitlement IDs (matches RevenueCat dashboard configuration)
 * Three tiers: Novice, Awakening, and Enlightenment
 */
export const ENTITLEMENT_IDS = {
  NOVICE: 'novice_path',
  AWAKENING: 'awakening_path',
  ENLIGHTENMENT: 'enlightenment_path',
} as const;

/**
 * Product IDs - Test Store (simplified for development)
 */
export const PRODUCT_IDS = {
  MONTHLY: 'monthly',
  YEARLY: 'yearly',
  LIFETIME: 'lifetime',
} as const;

/**
 * Product IDs - Production (for App Store Connect)
 * Three tiers: Novice, Awakening, and Enlightenment
 */
export const PRODUCTION_PRODUCT_IDS = {
  NOVICE_MONTHLY: 'manifest_novice_monthly',
  NOVICE_YEARLY: 'manifest_novice_yearly',
  AWAKENING_MONTHLY: 'manifest_awakening_monthly',
  AWAKENING_YEARLY: 'manifest_awakening_yearly',
  ENLIGHTENMENT_MONTHLY: 'manifest_enlightenment_monthly',
  ENLIGHTENMENT_YEARLY: 'manifest_enlightenment_yearly',
} as const;

/**
 * Subscription Tier Pricing
 *
 * Three tiers:
 * - Novice: Workbook + progress tracking + music meditations
 * - Awakening: + Guided meditations + Guru workbook analysis + Advanced analytics
 * - Enlightenment: + Coming Soon features (Journaling, Full AI chat, etc.)
 */
export const TIER_PRICING = {
  novice: {
    monthly: 7.99,
    yearly: 79.92,
    features: [
      'All 10 workbook phases',
      'Progress tracking',
      'Meditation music tracks',
      'PDF Manuscript',
      'Daily inspiration',
    ],
  },
  awakening: {
    monthly: 19.99,
    yearly: 199.90,
    features: [
      'Everything in Novice, plus:',
      '6 Guided meditations',
      'Guru workbook analysis',
      'Advanced analytics',
      'Priority support',
    ],
  },
  enlightenment: {
    monthly: 49.99,
    yearly: 499.90,
    features: [
      'Everything in Awakening, plus:',
      'Coming Soon: Full Guru AI chat',
      'Coming Soon: Voice journaling',
      'Coming Soon: 12+ meditation tracks',
      'Early access to new features',
    ],
  },
} as const;

/**
 * Free Trial Duration
 */
export const TRIAL_DURATION_DAYS = 7;

/**
 * Feature Access Limits by Tier
 *
 * Business Model:
 * - Free/Trial (7 days): FULL access, Guru rate-limited to 3/day
 * - Novice: Workbook, progress, music meditations - NO Guru
 * - Awakening: + Guided meditations, Guru UNLIMITED, analytics
 * - Enlightenment: + Coming Soon features (full AI chat, journaling, etc.)
 */
export const FEATURE_LIMITS = {
  free: {
    maxPhase: 10,                 // All phases during trial
    maxMeditations: 18,           // All meditations during trial
    hasGuidedMeditations: true,   // Guided meditations during trial
    hasGuruAnalysis: true,        // Guru enabled (rate-limited to 3/day - see guruRateLimitStore)
    hasFullGuruChat: false,       // Coming Soon
    hasJournaling: false,         // Coming Soon
    hasAdvancedAnalytics: false,
    hasVisionBoard: true,         // Vision board during trial
  },
  novice: {
    maxPhase: 10,                 // All phases
    maxMeditations: 6,            // Music tracks only
    hasGuidedMeditations: false,  // NO guided meditations
    hasGuruAnalysis: false,       // NO Guru - must upgrade to Awakening
    hasFullGuruChat: false,
    hasJournaling: false,
    hasAdvancedAnalytics: false,
    hasVisionBoard: true,
  },
  awakening: {
    maxPhase: 10,                 // All phases
    maxMeditations: 12,           // Music + 6 guided meditations
    hasGuidedMeditations: true,   // YES guided meditations
    hasGuruAnalysis: true,        // YES Guru workbook analysis
    hasFullGuruChat: false,       // NO full AI chat (Coming Soon in Enlightenment)
    hasJournaling: false,         // Coming Soon
    hasAdvancedAnalytics: true,   // YES analytics
    hasVisionBoard: true,
  },
  enlightenment: {
    maxPhase: 10,                 // All phases
    maxMeditations: 18,           // All meditations (Coming Soon: 12+)
    hasGuidedMeditations: true,   // YES guided meditations
    hasGuruAnalysis: true,        // YES Guru workbook analysis
    hasFullGuruChat: false,       // Coming Soon
    hasJournaling: false,         // Coming Soon
    hasAdvancedAnalytics: true,   // YES analytics
    hasVisionBoard: true,
  },
} as const;

/**
 * Sale Configuration
 * Controls promotional discount display on PaywallScreen
 */
export interface SaleConfig {
  isActive: boolean;
  discountPercentage: number;
  endDate?: string; // ISO date string for countdown timer
  bannerText?: string; // e.g., "Limited Time - 50% OFF!"
}

/**
 * Get active sale configuration from environment
 * Toggle sale on/off via EXPO_PUBLIC_SALE_ACTIVE env var
 */
export const getSaleConfig = (): SaleConfig => ({
  isActive: process.env.EXPO_PUBLIC_SALE_ACTIVE === 'true',
  discountPercentage: parseInt(process.env.EXPO_PUBLIC_SALE_DISCOUNT || '50', 10),
  endDate: process.env.EXPO_PUBLIC_SALE_END_DATE,
  bannerText: process.env.EXPO_PUBLIC_SALE_BANNER_TEXT || 'Monthly or Annual - You Choose!',
});
