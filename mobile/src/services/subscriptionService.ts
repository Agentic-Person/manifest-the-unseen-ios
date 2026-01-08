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
 * Debug State - tracks RevenueCat SDK status for debugging
 * Access via getRevenueCatDebugState()
 */
interface RevenueCatDebugState {
  sdkConfigured: boolean;
  configureAttempted: boolean;
  configureError: string | null;
  apiKeyPresent: boolean;
  apiKeyPrefix: string;
  platform: string;
  isTestFlightBypass: boolean;
  isDev: boolean;
  lastOfferingsError: string | null;
  lastOfferingsAttempt: string | null;
  offeringsResponse: {
    hasOfferings: boolean;
    hasCurrent: boolean;
    currentId: string | null;
    packageCount: number;
    packageIds: string[];
  } | null;
}

let debugState: RevenueCatDebugState = {
  sdkConfigured: false,
  configureAttempted: false,
  configureError: null,
  apiKeyPresent: false,
  apiKeyPrefix: '',
  platform: Platform.OS,
  isTestFlightBypass: false,
  isDev: __DEV__,
  lastOfferingsError: null,
  lastOfferingsAttempt: null,
  offeringsResponse: null,
};

/**
 * Get RevenueCat Debug State
 * Use this to display debug info in the app
 */
export function getRevenueCatDebugState(): RevenueCatDebugState {
  return { ...debugState };
}

/**
 * Initialize RevenueCat SDK
 * Call this early in app lifecycle (e.g., App.tsx)
 *
 * @param userId - Optional user ID to sync with your backend
 */
export async function configurePurchases(userId?: string): Promise<void> {
  console.log('[RC Debug] 🚀 configurePurchases() called');
  console.log('[RC Debug] Platform:', Platform.OS);
  console.log('[RC Debug] __DEV__:', __DEV__);
  console.log('[RC Debug] TESTFLIGHT_FULL_ACCESS:', process.env.EXPO_PUBLIC_TESTFLIGHT_FULL_ACCESS);

  // Mark that configuration was attempted
  debugState.configureAttempted = true;
  debugState.platform = Platform.OS;
  debugState.isDev = __DEV__;

  // Skip RevenueCat in web browser - it doesn't work and causes errors
  if (Platform.OS === 'web') {
    console.log('[RC Debug] ⏭️ Web platform - skipping RevenueCat');
    debugState.configureError = 'Web platform - SDK not supported';
    return;
  }

  // Only skip if TESTFLIGHT_FULL_ACCESS is explicitly true
  // NOTE: Removed __DEV__ check to allow local testing!
  const isTestFlight = process.env.EXPO_PUBLIC_TESTFLIGHT_FULL_ACCESS === 'true';
  debugState.isTestFlightBypass = isTestFlight;

  if (isTestFlight) {
    console.log('[RC Debug] ⏭️ TestFlight bypass mode - skipping RevenueCat');
    debugState.configureError = 'TestFlight bypass mode - SDK skipped';
    return;
  }

  try {
    const apiKey =
      Platform.OS === 'ios' ? REVENUECAT_API_KEY_IOS : REVENUECAT_API_KEY_ANDROID;

    debugState.apiKeyPresent = !!apiKey;
    debugState.apiKeyPrefix = apiKey ? apiKey.substring(0, 15) + '...' : 'MISSING';

    console.log('[RC Debug] API Key prefix:', apiKey ? apiKey.substring(0, 10) + '...' : 'MISSING');

    if (!apiKey) {
      console.error('[RC Debug] ❌ No API key found!');
      debugState.configureError = 'No API key found in environment';
      return;
    }

    // Configure SDK with verbose logging for debugging
    Purchases.configure({
      apiKey,
      appUserID: userId,
    });

    // Set DEBUG log level to see everything
    Purchases.setLogLevel(__DEV__ ? LOG_LEVEL.DEBUG : LOG_LEVEL.ERROR);

    debugState.sdkConfigured = true;
    debugState.configureError = null;
    console.log('[RC Debug] ✅ RevenueCat SDK configured successfully');
  } catch (error: any) {
    debugState.configureError = error.message || 'Unknown configuration error';
    console.error('[RC Debug] ❌ configurePurchases() failed:', {
      message: error.message,
      code: error.code,
      stack: error.stack,
    });
    throw error;
  }
}

/**
 * Set User ID
 * Call this after user logs in to sync purchases with user account
 */
export async function setUserId(userId: string): Promise<void> {
  // Skip on web - RevenueCat not supported
  if (Platform.OS === 'web') {
    console.log('[Subscription] Web platform - skipping setUserId');
    return;
  }

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
  // Skip on web - RevenueCat not supported
  if (Platform.OS === 'web') {
    console.log('[Subscription] Web platform - skipping logoutUser');
    return;
  }

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
  debugState.lastOfferingsAttempt = new Date().toISOString();

  // Check if TestFlight bypass is active
  const isTestFlight = process.env.EXPO_PUBLIC_TESTFLIGHT_FULL_ACCESS === 'true';

  // Return mock offerings for web mode or TestFlight (RevenueCat SDK is skipped in these modes)
  if (Platform.OS === 'web' || isTestFlight) {
    console.log(`[Subscription] ${Platform.OS === 'web' ? 'Web' : 'TestFlight'} mode - returning mock offerings for UI testing`);
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
    console.log('[RC Debug] 🔍 Calling Purchases.getOfferings()...');
    console.log('[RC Debug] SDK configured:', debugState.sdkConfigured);

    // Check if SDK was configured before calling
    if (!debugState.sdkConfigured) {
      const errorMsg = `SDK not configured. Config attempted: ${debugState.configureAttempted}, Error: ${debugState.configureError}`;
      console.error('[RC Debug] ❌ ' + errorMsg);
      debugState.lastOfferingsError = errorMsg;
      return null;
    }

    const offerings: PurchasesOfferings = await Purchases.getOfferings();

    console.log('[RC Debug] Raw offerings response:', {
      hasOfferings: !!offerings,
      allOfferingsCount: Object.keys(offerings.all || {}).length,
      allOfferingsKeys: Object.keys(offerings.all || {}),
      hasCurrent: !!offerings.current,
      currentIdentifier: offerings.current?.identifier,
    });

    // Update debug state with offerings response
    debugState.offeringsResponse = {
      hasOfferings: !!offerings,
      hasCurrent: !!offerings.current,
      currentId: offerings.current?.identifier || null,
      packageCount: offerings.current?.availablePackages?.length || 0,
      packageIds: offerings.current?.availablePackages?.map(p => p.identifier) || [],
    };

    if (!offerings.current) {
      const errorMsg = 'No current offering! Check RevenueCat dashboard - must set one offering as "current"';
      console.error('[RC Debug] ❌ ' + errorMsg);
      debugState.lastOfferingsError = errorMsg;
      return null;
    }

    const currentOffering = offerings.current;
    const packages = currentOffering.availablePackages;

    console.log('[RC Debug] Current offering details:', {
      identifier: currentOffering.identifier,
      packageCount: packages.length,
      packages: packages.map(p => ({
        id: p.identifier,
        productId: p.product.identifier,
        price: p.product.priceString,
      })),
    });

    // Log what we're looking for vs what we have
    console.log('[RC Debug] 🎯 Looking for package IDs:', PACKAGE_IDS);
    console.log('[RC Debug] 📦 Available package IDs:', packages.map(p => p.identifier));

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

    console.log('[RC Debug] ✅ Parsed offerings result:', {
      novice_monthly: offering.novice_monthly ? '✓ ' + offering.novice_monthly.price : '✗ NOT FOUND',
      novice_annual: offering.novice_annual ? '✓ ' + offering.novice_annual.price : '✗ NOT FOUND',
      awakening_monthly: offering.awakening_monthly ? '✓ ' + offering.awakening_monthly.price : '✗ NOT FOUND',
      awakening_annual: offering.awakening_annual ? '✓ ' + offering.awakening_annual.price : '✗ NOT FOUND',
      enlightenment_monthly: offering.enlightenment_monthly ? '✓ ' + offering.enlightenment_monthly.price : '✗ NOT FOUND',
      enlightenment_annual: offering.enlightenment_annual ? '✓ ' + offering.enlightenment_annual.price : '✗ NOT FOUND',
    });

    debugState.lastOfferingsError = null;
    return offering;
  } catch (error: any) {
    const errorMsg = `${error.code || 'ERROR'}: ${error.message || 'Unknown error'}`;
    debugState.lastOfferingsError = errorMsg;
    console.error('[RC Debug] ❌ getOfferings() FAILED:', {
      message: error.message,
      code: error.code,
      userInfo: error.userInfo,
      stack: error.stack,
    });
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
  // Skip on web - RevenueCat not supported
  if (Platform.OS === 'web') {
    console.log('[Subscription] Web platform - purchases not supported');
    return {
      success: false,
      error: new Error('Purchases not available on web') as any,
    };
  }

  // Handle TestFlight mode - simulate purchase success for UI testing
  // In TestFlight mode, RevenueCat SDK is not configured, so real purchases won't work
  const isTestFlight = process.env.EXPO_PUBLIC_TESTFLIGHT_FULL_ACCESS === 'true';
  if (isTestFlight || __DEV__) {
    console.log('[Subscription] TestFlight/DEV mode - simulating purchase success for:', subscriptionPackage.id);
    // Return success with the purchased tier info (no customerInfo since SDK not configured)
    // Using Object.assign to add extra properties while maintaining PurchaseResult type
    const result: PurchaseResult = {
      success: true,
      customerInfo: null as any, // null in test mode
    };
    // Attach purchased package info for state update (accessed via type assertion in store)
    (result as any).purchasedTier = subscriptionPackage.tier;
    (result as any).purchasedPeriod = subscriptionPackage.period;
    return result;
  }

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
  // Skip on web - RevenueCat not supported
  if (Platform.OS === 'web') {
    console.log('[Subscription] Web platform - restore not supported');
    return {
      success: false,
      error: new Error('Restore not available on web') as any,
    };
  }

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
  // Skip on web - RevenueCat not supported
  if (Platform.OS === 'web') {
    console.log('[Subscription] Web platform - returning null for getCustomerInfo');
    return null;
  }

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
