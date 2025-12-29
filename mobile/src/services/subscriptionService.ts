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
import { ENTITLEMENT_IDS, PACKAGE_IDS } from '../types/subscription';

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
  // Skip RevenueCat in web browser - it doesn't work and causes errors
  if (Platform.OS === 'web') {
    console.log('[Subscription] Web platform detected - skipping RevenueCat (use subscriptionStore DEV bypass)');
    return;
  }

  // Skip in DEV/TestFlight mode to avoid API key issues during testing
  // EXPO_PUBLIC_TESTFLIGHT_FULL_ACCESS is set in eas.json for TestFlight builds
  const isTestFlight = process.env.EXPO_PUBLIC_TESTFLIGHT_FULL_ACCESS === 'true';
  if (__DEV__ || isTestFlight) {
    console.log('[Subscription] DEV/TestFlight mode - skipping RevenueCat configuration');
    return;
  }

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
    Purchases.setLogLevel(LOG_LEVEL.ERROR);

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
    // H3 Security Fix: Don't log userId in production
    if (__DEV__) {
      console.log('RevenueCat user ID set');
    }
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
 * Returns subscription packages for the three-tier model
 *
 * Production Setup: Uses RevenueCat package identifiers
 * - novice_monthly, novice_annual
 * - awakening_monthly, awakening_annual
 * - enlightenment_monthly, enlightenment_annual
 */
export async function getOfferings(): Promise<SubscriptionOffering | null> {
  // Return mock offerings for web mode (RevenueCat doesn't work in browser)
  if (Platform.OS === 'web') {
    console.log('[Subscription] Web mode - returning mock offerings for UI testing');
    return {
      novice_monthly: {
        id: 'mock_novice_monthly',
        tier: 'novice',
        period: 'monthly',
        price: '$7.99',
        pricePerMonth: '$7.99/mo',
        currencyCode: 'USD',
        title: 'Novice Path Monthly',
        description: 'Workbook + Progress + Music',
        rcPackage: {} as any,
      },
      novice_annual: {
        id: 'mock_novice_annual',
        tier: 'novice',
        period: 'yearly',
        price: '$79.99',
        pricePerMonth: '$6.67/mo',
        currencyCode: 'USD',
        title: 'Novice Path Annual',
        description: 'Workbook + Progress + Music - Save 17%',
        rcPackage: {} as any,
      },
      awakening_monthly: {
        id: 'mock_awakening_monthly',
        tier: 'awakening',
        period: 'monthly',
        price: '$19.99',
        pricePerMonth: '$19.99/mo',
        currencyCode: 'USD',
        title: 'Awakening Path Monthly',
        description: '+ Guided Meditations + Guru Analysis',
        rcPackage: {} as any,
      },
      awakening_annual: {
        id: 'mock_awakening_annual',
        tier: 'awakening',
        period: 'yearly',
        price: '$199.99',
        pricePerMonth: '$16.67/mo',
        currencyCode: 'USD',
        title: 'Awakening Path Annual',
        description: '+ Guided Meditations + Guru Analysis - Save 17%',
        rcPackage: {} as any,
      },
      enlightenment_monthly: {
        id: 'mock_enlightenment_monthly',
        tier: 'enlightenment',
        period: 'monthly',
        price: '$49.99',
        pricePerMonth: '$49.99/mo',
        currencyCode: 'USD',
        title: 'Enlightenment Path Monthly',
        description: 'Everything + Coming Soon features',
        rcPackage: {} as any,
      },
      enlightenment_annual: {
        id: 'mock_enlightenment_annual',
        tier: 'enlightenment',
        period: 'yearly',
        price: '$499.99',
        pricePerMonth: '$41.67/mo',
        currencyCode: 'USD',
        title: 'Enlightenment Path Annual',
        description: 'Everything + Coming Soon features - Save 17%',
        rcPackage: {} as any,
      },
    };
  }

  try {
    const offerings: PurchasesOfferings = await Purchases.getOfferings();

    if (!offerings.current) {
      console.warn('No current offerings available');
      return null;
    }

    const currentOffering = offerings.current;
    const packages = currentOffering.availablePackages;

    console.log('[Subscription] Available packages:', packages.map(p => ({
      id: p.identifier,
      productId: p.product.identifier,
      price: p.product.priceString,
    })));

    // Production: Three-tier model with monthly/annual options
    // Packages are found by their RevenueCat package identifier
    const offering: SubscriptionOffering = {
      // Novice tier
      novice_monthly: findPackageById(packages, PACKAGE_IDS.NOVICE_MONTHLY, 'novice', 'monthly'),
      novice_annual: findPackageById(packages, PACKAGE_IDS.NOVICE_ANNUAL, 'novice', 'yearly'),
      // Awakening tier
      awakening_monthly: findPackageById(packages, PACKAGE_IDS.AWAKENING_MONTHLY, 'awakening', 'monthly'),
      awakening_annual: findPackageById(packages, PACKAGE_IDS.AWAKENING_ANNUAL, 'awakening', 'yearly'),
      // Enlightenment tier
      enlightenment_monthly: findPackageById(packages, PACKAGE_IDS.ENLIGHTENMENT_MONTHLY, 'enlightenment', 'monthly'),
      enlightenment_annual: findPackageById(packages, PACKAGE_IDS.ENLIGHTENMENT_ANNUAL, 'enlightenment', 'yearly'),
    };

    console.log('[Subscription] Parsed offerings:', {
      novice_monthly: offering.novice_monthly?.price,
      novice_annual: offering.novice_annual?.price,
      awakening_monthly: offering.awakening_monthly?.price,
      awakening_annual: offering.awakening_annual?.price,
      enlightenment_monthly: offering.enlightenment_monthly?.price,
      enlightenment_annual: offering.enlightenment_annual?.price,
    });

    return offering;
  } catch (error) {
    console.error('Failed to get offerings:', error);
    return null;
  }
}

/**
 * Helper: Find and map package by RevenueCat package identifier
 * This matches against the package identifier in RevenueCat offerings (e.g., 'novice_monthly')
 */
function findPackageById(
  packages: PurchasesPackage[],
  packageId: string,
  tier: SubscriptionTier,
  period: SubscriptionPeriod
): SubscriptionPackage | null {
  // Find by package identifier (the ID shown in RevenueCat offerings)
  const rcPackage = packages.find((pkg) => pkg.identifier === packageId);

  if (!rcPackage) {
    console.warn(`[Subscription] Package not found: ${packageId}`);
    return null;
  }

  const product = rcPackage.product;
  const price = product.priceString;
  const priceAmount = product.price;

  // Calculate price per month for yearly subscriptions
  let pricePerMonth: string;
  if (period === 'yearly') {
    pricePerMonth = `$${(priceAmount / 12).toFixed(2)}/mo`;
  } else {
    pricePerMonth = `${price}/mo`;
  }

  // Get display name for period
  const periodDisplay = period === 'monthly' ? 'Monthly' : 'Annual';

  return {
    id: packageId,
    tier,
    period,
    price,
    pricePerMonth,
    currencyCode: product.currencyCode || 'USD',
    title: product.title || `${getTierDisplayName(tier)} ${periodDisplay}`,
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
 * Three-tier model:
 * - Enlightenment: Everything + Coming Soon features
 * - Awakening: + Guided meditations + Guru workbook analysis + Analytics
 * - Novice: Workbook + music meditations + progress tracking
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

  if (activeEntitlements[ENTITLEMENT_IDS.AWAKENING]) {
    return 'awakening';
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

  // Find the active entitlement for current tier (three-tier model)
  const entitlementId = getEntitlementIdForTier(tier);

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

  // Find the active entitlement for current tier (three-tier model)
  const entitlementId = getEntitlementIdForTier(tier);

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
  // DEV/TestFlight/Web mode: return enlightenment tier without calling RevenueCat
  const isTestFlight = process.env.EXPO_PUBLIC_TESTFLIGHT_FULL_ACCESS === 'true';
  if (__DEV__ || isTestFlight || Platform.OS === 'web') {
    console.log('[Subscription] DEV/TestFlight/Web mode - returning mock enlightenment subscription');
    return {
      tier: 'enlightenment',
      status: 'active',
      isSubscribed: true,
      isInTrial: false,
      trialEndDate: null,
      expirationDate: null,
      willRenew: true,
      period: 'yearly',
      customerInfo: null,
    };
  }

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
      const entitlementId = getEntitlementIdForTier(tier);
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
 * Helper: Get Entitlement ID for Tier
 */
function getEntitlementIdForTier(tier: SubscriptionTier): string {
  switch (tier) {
    case 'enlightenment':
      return ENTITLEMENT_IDS.ENLIGHTENMENT;
    case 'awakening':
      return ENTITLEMENT_IDS.AWAKENING;
    case 'novice':
      return ENTITLEMENT_IDS.NOVICE;
    default:
      return '';
  }
}

/**
 * Helper: Get Display Name for Tier
 */
function getTierDisplayName(tier: SubscriptionTier): string {
  switch (tier) {
    case 'novice':
      return 'Novice Path';
    case 'awakening':
      return 'Awakening Path';
    case 'enlightenment':
      return 'Enlightenment Path';
    default:
      return 'Free';
  }
}
