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
 * - novice: Full app access EXCEPT Guru AI chat ($7.99/mo, $59.99/yr)
 * - enlightenment: Full app access INCLUDING Guru AI chat ($19.99/mo, $149.99/yr)
 *
 * Note: 7-day free trial gives Novice-level access (everything except Guru)
 */
export type SubscriptionTier = 'free' | 'novice' | 'enlightenment';

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
 * Only two tiers: Novice and Enlightenment
 */
export const ENTITLEMENT_IDS = {
  NOVICE: 'novice_path',
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
 * Only two tiers: Novice and Enlightenment
 */
export const PRODUCTION_PRODUCT_IDS = {
  NOVICE_MONTHLY: 'manifest_novice_monthly',
  NOVICE_YEARLY: 'manifest_novice_yearly',
  ENLIGHTENMENT_MONTHLY: 'manifest_enlightenment_monthly',
  ENLIGHTENMENT_YEARLY: 'manifest_enlightenment_yearly',
} as const;

/**
 * Subscription Tier Pricing
 *
 * Two tiers:
 * - Novice: Full app access EXCEPT Guru AI chat
 * - Enlightenment: Full app access INCLUDING Guru AI chat
 */
export const TIER_PRICING = {
  novice: {
    monthly: 7.99,
    yearly: 59.99,
    features: [
      'All 10 workbook phases',
      'All guided meditations',
      'All breathing exercises',
      'All meditation music',
      'Progress tracking',
      'Daily inspiration',
    ],
  },
  enlightenment: {
    monthly: 19.99,
    yearly: 149.99,
    features: [
      'Everything in Novice, plus:',
      'AI Guru - Personalized wisdom chat',
      'Phase-based insights & analysis',
      'Priority support',
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
 * Simplified two-tier model:
 * - Free: No access (pre-trial or expired)
 * - Novice: Full app access EXCEPT Guru AI chat
 * - Enlightenment: Full app access INCLUDING Guru AI chat
 *
 * 7-day free trial = Novice-level access
 */
export const FEATURE_LIMITS = {
  free: {
    maxPhase: 0,
    maxMeditations: 0,
    hasGuru: false,
    hasVisionBoard: false,
  },
  novice: {
    maxPhase: 10,        // All phases
    maxMeditations: 18,  // All meditations
    hasGuru: false,      // NO Guru access
    hasVisionBoard: true,
  },
  enlightenment: {
    maxPhase: 10,        // All phases
    maxMeditations: 18,  // All meditations
    hasGuru: true,       // YES Guru access
    hasVisionBoard: true,
  },
} as const;
