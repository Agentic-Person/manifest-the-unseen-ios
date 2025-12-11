/**
 * Subscription Service
 *
 * Manages RevenueCat SDK integration for in-app subscriptions.
 * Handles purchase flow, restore, entitlements, and tier detection.
 */

import Purchases, {
  CustomerInfo,
  PurchasesOfferings,
  LOG_LEVEL,
  PurchasesPackage,
} from 'react-native-purchases';
import { Platform } from 'react-native';
import type {
  SubscriptionTier,
  SubscriptionPackage,
  SubscriptionOffering,
  PurchaseResult,
  RestoreResult,
  SubscriptionInfo,
  SubscriptionStatus,
  SubscriptionPeriod,
} from '../types/subscription';
import { ENTITLEMENT_IDS, PRODUCT_IDS } from '../types/subscription';

/**
 * RevenueCat Configuration
 * TODO: Add your RevenueCat API keys to .env file
 */
const REVENUECAT_API_KEY_IOS = process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY || '';
const REVENUECAT_API_KEY_ANDROID =
  process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY || '';

/**
 * Initialize RevenueCat SDK
 * Call this early in app lifecycle (e.g., App.tsx)
 *
 * @param userId - Optional user ID to sync with your backend
 */
export async function configurePurchases(userId?: string): Promise<void> {
  try {
    const apiKey =
      Platform.OS === 'ios' ? REVENUECAT_API_KEY_IOS : REVENUECAT_API_KEY_ANDROID;

    if (!apiKey) {
      console.warn(
        'RevenueCat API key not found. Subscriptions will not work until configured.'
      );
      return;
    }

    // Configure SDK
    Purchases.configure({
      apiKey,
      appUserID: userId, // Optional: sync with your auth system
    });

    // Set log level (use ERROR in production)
    if (__DEV__) {
      Purchases.setLogLevel(LOG_LEVEL.DEBUG);
    } else {
      Purchases.setLogLevel(LOG_LEVEL.ERROR);
    }

    console.log('RevenueCat configured successfully');
  } catch (error) {
    console.error('Failed to configure RevenueCat:', error);
    throw error;
  }
}

/**
 * Set User ID
 * Call this after user logs in to sync purchases with user account
 */
export async function setUserId(userId: string): Promise<void> {
  try {
    await Purchases.logIn(userId);
    console.log('RevenueCat user ID set:', userId);
  } catch (error) {
    console.error('Failed to set RevenueCat user ID:', error);
    throw error;
  }
}

/**
 * Clear User ID
 * Call this when user logs out
 */
export async function logoutUser(): Promise<void> {
  try {
    await Purchases.logOut();
    console.log('RevenueCat user logged out');
  } catch (error) {
    console.error('Failed to logout RevenueCat user:', error);
    throw error;
  }
}

/**
 * Get Available Offerings
 * Returns subscription packages for test store (simplified)
 *
 * Test Store Setup: Uses simplified product IDs (monthly, yearly, lifetime)
 * All map to 'enlightenment' tier for testing purposes
 */
export async function getOfferings(): Promise<SubscriptionOffering | null> {
  try {
    const offerings: PurchasesOfferings = await Purchases.getOfferings();

    if (!offerings.current) {
      console.warn('No current offerings available');
      return null;
    }

    const currentOffering = offerings.current;
    const packages = currentOffering.availablePackages;

    console.log('Available packages:', packages.map(p => ({
      id: p.identifier,
      productId: p.product.identifier,
      price: p.product.priceString,
    })));

    // Test Store: Simplified offering with monthly/yearly/lifetime
    // All products grant 'enlightenment' tier for testing
    const offering: SubscriptionOffering = {
      monthly: findPackage(packages, PRODUCT_IDS.MONTHLY, 'enlightenment', 'monthly'),
      yearly: findPackage(packages, PRODUCT_IDS.YEARLY, 'enlightenment', 'yearly'),
      lifetime: findPackage(packages, PRODUCT_IDS.LIFETIME, 'enlightenment', 'lifetime'),
    };

    return offering;
  } catch (error) {
    console.error('Failed to get offerings:', error);
    return null;
  }
}

/**
 * Helper: Find and map package by product ID
 */
function findPackage(
  packages: PurchasesPackage[],
  productId: string,
  tier: SubscriptionTier,
  period: SubscriptionPeriod
): SubscriptionPackage | null {
  // Try to find by product identifier first, then by package identifier
  const rcPackage = packages.find(
    (pkg) => pkg.product.identifier === productId || pkg.identifier === productId
  );

  if (!rcPackage) {
    console.warn(`Package not found: ${productId}`);
    return null;
  }

  const product = rcPackage.product;
  const price = product.priceString;
  const priceAmount = product.price;

  // Calculate price per month for yearly/lifetime subscriptions
  let pricePerMonth: string;
  if (period === 'yearly') {
    pricePerMonth = `$${(priceAmount / 12).toFixed(2)}/mo`;
  } else if (period === 'lifetime') {
    pricePerMonth = 'One-time';
  } else {
    pricePerMonth = price;
  }

  // Get display name for period
  const periodDisplay = period === 'monthly' ? 'Monthly' : period === 'yearly' ? 'Annual' : 'Lifetime';

  return {
    id: productId,
    tier,
    period,
    price,
    pricePerMonth,
    currencyCode: product.currencyCode || 'USD',
    title: product.title || getTierDisplayName(tier),
    description: product.description || `${getTierDisplayName(tier)} - ${periodDisplay}`,
    rcPackage,
  };
}

/**
 * Purchase a Subscription Package
 *
 * @param subscriptionPackage - The package to purchase
 * @returns Purchase result with customer info or error
 */
export async function purchasePackage(
  subscriptionPackage: SubscriptionPackage
): Promise<PurchaseResult> {
  try {
    const { customerInfo, productIdentifier } =
      await Purchases.purchasePackage(subscriptionPackage.rcPackage);

    console.log('Purchase successful:', productIdentifier);

    return {
      success: true,
      customerInfo,
    };
  } catch (error: any) {
    console.error('Purchase failed:', error);

    // Check if user cancelled
    if (error.userCancelled) {
      return {
        success: false,
        userCancelled: true,
      };
    }

    return {
      success: false,
      error,
    };
  }
}

/**
 * Restore Previous Purchases
 * Use this for "Restore Purchases" button
 */
export async function restorePurchases(): Promise<RestoreResult> {
  try {
    const customerInfo: CustomerInfo = await Purchases.restorePurchases();

    console.log('Purchases restored successfully');

    return {
      success: true,
      customerInfo,
    };
  } catch (error: any) {
    console.error('Restore failed:', error);

    return {
      success: false,
      error,
    };
  }
}

/**
 * Get Current Customer Info
 * Includes active subscriptions, entitlements, and trial status
 */
export async function getCustomerInfo(): Promise<CustomerInfo | null> {
  try {
    const customerInfo: CustomerInfo = await Purchases.getCustomerInfo();
    return customerInfo;
  } catch (error) {
    console.error('Failed to get customer info:', error);
    return null;
  }
}

/**
 * Check if User Has Specific Entitlement
 *
 * @param entitlementId - Entitlement identifier from RevenueCat
 * @returns True if user has active entitlement
 */
export async function checkEntitlement(
  entitlementId: string
): Promise<boolean> {
  try {
    const customerInfo = await getCustomerInfo();

    if (!customerInfo) {
      return false;
    }

    const entitlement = customerInfo.entitlements.active[entitlementId];
    return !!entitlement;
  } catch (error) {
    console.error('Failed to check entitlement:', error);
    return false;
  }
}

/**
 * Get User's Current Subscription Tier
 * Determines tier from active entitlements
 *
 * Two-tier model:
 * - Enlightenment: Full access including Guru AI chat
 * - Novice: Full access EXCEPT Guru AI chat
 */
export function getTierFromCustomerInfo(
  customerInfo: CustomerInfo | null
): SubscriptionTier {
  if (!customerInfo) {
    return 'free';
  }

  const activeEntitlements = customerInfo.entitlements.active;

  // Check in priority order (highest tier first)
  if (activeEntitlements[ENTITLEMENT_IDS.ENLIGHTENMENT]) {
    return 'enlightenment';
  }

  if (activeEntitlements[ENTITLEMENT_IDS.NOVICE]) {
    return 'novice';
  }

  return 'free';
}

/**
 * Get Subscription Status from Customer Info
 */
function getSubscriptionStatus(
  customerInfo: CustomerInfo | null,
  tier: SubscriptionTier
): SubscriptionStatus {
  if (!customerInfo || tier === 'free') {
    return 'none';
  }

  // Find the active entitlement for current tier (two-tier model)
  const entitlementId =
    tier === 'enlightenment'
      ? ENTITLEMENT_IDS.ENLIGHTENMENT
      : ENTITLEMENT_IDS.NOVICE;

  const entitlement = customerInfo.entitlements.active[entitlementId];

  if (!entitlement) {
    return 'expired';
  }

  // Check if in trial period
  if (entitlement.periodType === 'trial') {
    return 'trial';
  }

  // Check if will renew
  if (entitlement.willRenew) {
    return 'active';
  }

  // Check if in grace period
  if (entitlement.billingIssueDetectedAt) {
    return 'grace_period';
  }

  // Check if cancelled but still valid
  if (!entitlement.willRenew && entitlement.expirationDate) {
    const now = new Date();
    const expirationDate = new Date(entitlement.expirationDate);

    if (expirationDate > now) {
      return 'cancelled'; // Still valid until expiration
    }
  }

  return 'expired';
}

/**
 * Get Subscription Period from Customer Info
 */
function getSubscriptionPeriod(
  customerInfo: CustomerInfo | null,
  tier: SubscriptionTier
): SubscriptionPeriod | null {
  if (!customerInfo || tier === 'free') {
    return null;
  }

  // Find the active entitlement for current tier (two-tier model)
  const entitlementId =
    tier === 'enlightenment'
      ? ENTITLEMENT_IDS.ENLIGHTENMENT
      : ENTITLEMENT_IDS.NOVICE;

  const entitlement = customerInfo.entitlements.active[entitlementId];

  if (!entitlement) {
    return null;
  }

  // Detect period from product identifier
  const productId = entitlement.productIdentifier;

  if (productId.includes('lifetime')) {
    return 'lifetime';
  }

  if (productId.includes('yearly') || productId.includes('annual')) {
    return 'yearly';
  }

  if (productId.includes('monthly')) {
    return 'monthly';
  }

  return null;
}

/**
 * Get Complete Subscription Info
 * Returns all subscription details for current user
 */
export async function getSubscriptionInfo(): Promise<SubscriptionInfo> {
  try {
    const customerInfo = await getCustomerInfo();
    const tier = getTierFromCustomerInfo(customerInfo);
    const status = getSubscriptionStatus(customerInfo, tier);
    const period = getSubscriptionPeriod(customerInfo, tier);

    const isSubscribed = tier !== 'free' && status !== 'expired';
    const isInTrial = status === 'trial';

    // Get trial end date
    let trialEndDate: string | null = null;
    let expirationDate: string | null = null;
    let willRenew = false;

    if (customerInfo && tier !== 'free') {
      const entitlementId =
        tier === 'enlightenment'
          ? ENTITLEMENT_IDS.ENLIGHTENMENT
          : ENTITLEMENT_IDS.NOVICE;

      const entitlement = customerInfo.entitlements.active[entitlementId];

      if (entitlement) {
        expirationDate = entitlement.expirationDate || null;
        willRenew = entitlement.willRenew || false;

        // If in trial, expiration date is trial end date
        if (isInTrial) {
          trialEndDate = entitlement.expirationDate || null;
        }
      }
    }

    return {
      tier,
      status,
      isSubscribed,
      isInTrial,
      trialEndDate,
      expirationDate,
      willRenew,
      period,
      customerInfo,
    };
  } catch (error) {
    console.error('Failed to get subscription info:', error);

    // Return default free state on error
    return {
      tier: 'free',
      status: 'none',
      isSubscribed: false,
      isInTrial: false,
      trialEndDate: null,
      expirationDate: null,
      willRenew: false,
      period: null,
      customerInfo: null,
    };
  }
}

/**
 * Helper: Get Display Name for Tier
 */
function getTierDisplayName(tier: SubscriptionTier): string {
  switch (tier) {
    case 'novice':
      return 'Novice Path';
    case 'enlightenment':
      return 'Enlightenment Path';
    default:
      return 'Free';
  }
}
