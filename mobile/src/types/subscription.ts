/**
 * Subscription Type Definitions
 *
 * Defines types for RevenueCat subscription management,
 * including tiers, packages, entitlements, and purchase results.
 */

import type { PurchasesPackage, CustomerInfo, PurchasesError } from 'react-native-purchases';

/**
 * Subscription Tier Levels
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
 */
export const TIER_PRICING = {
  novice: {
    monthly: 7.99,
    yearly: 59.99,
    features: [
      'Phases 1-5',
      '3 guided meditations',
      'AI wisdom chat (10 per day)',
      'Progress tracking',
    ],
  },
  awakening: {
    monthly: 12.99,
    yearly: 99.99,
    features: [
      'Phases 1-8',
      '6 guided meditations',
      'AI wisdom chat (50 per day)',
      'Vision board creation',
      'Daily inspiration',
    ],
  },
  enlightenment: {
    monthly: 19.99,
    yearly: 149.99,
    lifetime: 299.99,
    features: [
      'All 10 phases',
      'All 18 guided meditations',
      'Unlimited AI wisdom chat',
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
 */
export const FEATURE_LIMITS = {
  free: {
    maxPhase: 2,
    maxMeditations: 0,
    maxAIChatPerDay: 3,
    hasVisionBoard: false,
  },
  novice: {
    maxPhase: 5,
    maxMeditations: 3,
    maxAIChatPerDay: 10,
    hasVisionBoard: false,
  },
  awakening: {
    maxPhase: 8,
    maxMeditations: 6,
    maxAIChatPerDay: 50,
    hasVisionBoard: true,
  },
  enlightenment: {
    maxPhase: 10,
    maxMeditations: 18,
    maxAIChatPerDay: -1,
    hasVisionBoard: true,
  },
} as const;
