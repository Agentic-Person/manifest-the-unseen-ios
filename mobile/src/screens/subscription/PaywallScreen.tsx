/**
 * Paywall Screen
 *
 * Beautiful subscription paywall with pricing display and purchase flow.
 *
 * Three-tier subscription model:
 * - Novice: $7.99/mo - Workbook, progress, music meditations
 * - Awakening: $19.99/mo - + Guided meditations, Guru workbook analysis, Analytics
 * - Enlightenment: $49.99/mo - + Coming Soon features (journaling, full AI chat)
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing } from '../../theme';
import type { SubscriptionPackage, PackageId } from '../../types/subscription';
import { TIER_PRICING, getSaleConfig, PACKAGE_IDS } from '../../types/subscription';
import { SaleBanner } from '../../components/subscription/SaleBanner';
import { SaleBadge } from '../../components/subscription/SaleBadge';
import { StrikethroughPrice } from '../../components/subscription/StrikethroughPrice';
import { useSubscriptionStore, useOfferings, usePurchaseState, usePromoCodeState } from '../../stores/subscriptionStore';
import { PromoCodeInput } from '../../components/PromoCodeInput';
import { recordPromoRedemption } from '../../services/promoService';
import { getRevenueCatDebugState } from '../../services/subscriptionService';

interface PaywallScreenProps {
  navigation: any;
  route?: {
    params?: {
      lockedFeature?: string;
      onDismiss?: () => void;
    };
  };
}

/**
 * Test Package Card Component
 * Simple card for displaying test store packages
 */
interface TestPackageCardProps {
  packageData: SubscriptionPackage;
  label: string;
  sublabel: string;
  isPopular?: boolean;
  onPurchase: () => void;
  isPurchasing: boolean;
  isDisabled?: boolean;
  // Sale props
  isSaleActive?: boolean;
  originalPrice?: string;
  discountPercentage?: number;
}

/**
 * Debug Overlay Component
 * Shows RevenueCat SDK status for debugging
 * Tap the title 5 times to toggle visibility
 */
interface DebugOverlayProps {
  visible: boolean;
  offeringsError: string | null;
}

const DebugOverlay: React.FC<DebugOverlayProps> = ({ visible, offeringsError }) => {
  if (!visible) return null;

  const debugState = getRevenueCatDebugState();

  return (
    <View style={debugStyles.container}>
      <Text style={debugStyles.title}>🔧 RevenueCat Debug</Text>

      <View style={debugStyles.row}>
        <Text style={debugStyles.label}>Platform:</Text>
        <Text style={debugStyles.value}>{debugState.platform}</Text>
      </View>

      <View style={debugStyles.row}>
        <Text style={debugStyles.label}>__DEV__:</Text>
        <Text style={[debugStyles.value, debugState.isDev ? debugStyles.warning : debugStyles.success]}>
          {String(debugState.isDev)}
        </Text>
      </View>

      <View style={debugStyles.row}>
        <Text style={debugStyles.label}>TestFlight Bypass:</Text>
        <Text style={[debugStyles.value, debugState.isTestFlightBypass ? debugStyles.warning : debugStyles.success]}>
          {String(debugState.isTestFlightBypass)}
        </Text>
      </View>

      <View style={debugStyles.row}>
        <Text style={debugStyles.label}>API Key Present:</Text>
        <Text style={[debugStyles.value, debugState.apiKeyPresent ? debugStyles.success : debugStyles.error]}>
          {String(debugState.apiKeyPresent)}
        </Text>
      </View>

      <View style={debugStyles.row}>
        <Text style={debugStyles.label}>API Key:</Text>
        <Text style={debugStyles.value}>{debugState.apiKeyPrefix || 'N/A'}</Text>
      </View>

      <View style={debugStyles.row}>
        <Text style={debugStyles.label}>Config Attempted:</Text>
        <Text style={debugStyles.value}>{String(debugState.configureAttempted)}</Text>
      </View>

      <View style={debugStyles.row}>
        <Text style={debugStyles.label}>SDK Configured:</Text>
        <Text style={[debugStyles.value, debugState.sdkConfigured ? debugStyles.success : debugStyles.error]}>
          {String(debugState.sdkConfigured)}
        </Text>
      </View>

      {debugState.configureError && (
        <View style={debugStyles.row}>
          <Text style={debugStyles.label}>Config Error:</Text>
          <Text style={[debugStyles.value, debugStyles.error]}>{debugState.configureError}</Text>
        </View>
      )}

      {debugState.lastOfferingsAttempt && (
        <View style={debugStyles.row}>
          <Text style={debugStyles.label}>Last Attempt:</Text>
          <Text style={debugStyles.value}>{new Date(debugState.lastOfferingsAttempt).toLocaleTimeString()}</Text>
        </View>
      )}

      {debugState.lastOfferingsError && (
        <View style={debugStyles.row}>
          <Text style={debugStyles.label}>Offerings Error:</Text>
          <Text style={[debugStyles.value, debugStyles.error]}>{debugState.lastOfferingsError}</Text>
        </View>
      )}

      {debugState.offeringsResponse && (
        <>
          <View style={debugStyles.row}>
            <Text style={debugStyles.label}>Has Current:</Text>
            <Text style={[debugStyles.value, debugState.offeringsResponse.hasCurrent ? debugStyles.success : debugStyles.error]}>
              {String(debugState.offeringsResponse.hasCurrent)}
            </Text>
          </View>
          <View style={debugStyles.row}>
            <Text style={debugStyles.label}>Current ID:</Text>
            <Text style={debugStyles.value}>{debugState.offeringsResponse.currentId || 'N/A'}</Text>
          </View>
          <View style={debugStyles.row}>
            <Text style={debugStyles.label}>Packages:</Text>
            <Text style={debugStyles.value}>{debugState.offeringsResponse.packageCount}</Text>
          </View>
          {debugState.offeringsResponse.packageIds.length > 0 && (
            <View style={debugStyles.row}>
              <Text style={debugStyles.label}>IDs:</Text>
              <Text style={[debugStyles.value, { flex: 1 }]}>{debugState.offeringsResponse.packageIds.join(', ')}</Text>
            </View>
          )}
        </>
      )}

      {offeringsError && (
        <View style={debugStyles.row}>
          <Text style={debugStyles.label}>Store Error:</Text>
          <Text style={[debugStyles.value, debugStyles.error]}>{offeringsError}</Text>
        </View>
      )}

      <Text style={debugStyles.hint}>Tap title 5x to hide</Text>
    </View>
  );
};

const debugStyles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    padding: spacing.md,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FF6B35',
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FF6B35',
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: '#999',
    width: 110,
  },
  value: {
    fontSize: 11,
    fontWeight: '500',
    color: '#FFF',
  },
  success: {
    color: '#22C55E',
  },
  warning: {
    color: '#F59E0B',
  },
  error: {
    color: '#EF4444',
  },
  hint: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});

const TestPackageCard: React.FC<TestPackageCardProps> = ({
  packageData,
  label,
  sublabel,
  isPopular = false,
  onPurchase,
  isPurchasing,
  isDisabled = false,
  isSaleActive = false,
  originalPrice,
  discountPercentage = 50,
}) => (
  <View style={[styles.packageCard, isPopular && styles.packageCardPopular]}>
    {/* Sale Badge */}
    {isSaleActive && <SaleBadge discountPercentage={discountPercentage} />}

    {isPopular && (
      <View style={styles.popularBadge}>
        <Text style={styles.popularBadgeText}>BEST VALUE</Text>
      </View>
    )}
    <View style={styles.packageContent}>
      <View style={styles.packageHeader}>
        <Text style={styles.packageLabel}>{label}</Text>

        {/* Price display - strikethrough for sale, normal otherwise */}
        {isSaleActive && originalPrice ? (
          <StrikethroughPrice
            originalPrice={originalPrice}
            discountedPrice={packageData.price}
          />
        ) : (
          <Text style={styles.packagePrice}>{packageData.price}</Text>
        )}

        <Text style={styles.packageSublabel}>{sublabel}</Text>
      </View>
      <Pressable
        style={[
          styles.purchaseButton,
          isPopular && styles.purchaseButtonPopular,
          isDisabled && styles.purchaseButtonDisabled,
        ]}
        onPress={onPurchase}
        disabled={isPurchasing || isDisabled}
        accessibilityRole="button"
        accessibilityLabel={`Subscribe to ${label} plan`}
      >
        {isPurchasing ? (
          <ActivityIndicator size="small" color={isPopular ? colors.background.primary : colors.brand.gold} />
        ) : (
          <Text style={[
            styles.purchaseButtonText,
            isPopular && styles.purchaseButtonTextPopular,
            isDisabled && styles.purchaseButtonTextDisabled,
          ]}>
            {isDisabled ? 'Current Plan' : 'Start Free Trial'}
          </Text>
        )}
      </Pressable>
    </View>
  </View>
);

export const PaywallScreen: React.FC<PaywallScreenProps> = ({
  navigation,
  route,
}) => {
  const [purchasingPackageId, setPurchasingPackageId] = useState<PackageId | null>(null);
  const [selectedTier, setSelectedTier] = useState<'novice' | 'awakening' | 'enlightenment'>('awakening');
  const [showDebug, setShowDebug] = useState(false);
  const [titleTapCount, setTitleTapCount] = useState(0);

  // Handle title tap for debug toggle
  const handleTitleTap = () => {
    const newCount = titleTapCount + 1;
    setTitleTapCount(newCount);
    if (newCount >= 5) {
      setShowDebug(!showDebug);
      setTitleTapCount(0);
    }
    // Reset tap count after 2 seconds of no taps
    setTimeout(() => setTitleTapCount(0), 2000);
  };

  const { offerings, isLoading: isLoadingOfferings } = useOfferings();
  const { isRestoring } = usePurchaseState();
  const { appliedPromoCode } = usePromoCodeState();
  const currentTier = useSubscriptionStore((state) => state.tier);
  const isInTrial = useSubscriptionStore((state) => state.isInTrial);
  const isSubscribed = useSubscriptionStore((state) => state.isSubscribed);
  const purchasePackage = useSubscriptionStore((state) => state.purchasePackage);
  const restorePurchases = useSubscriptionStore((state) => state.restorePurchases);
  const loadOfferings = useSubscriptionStore((state) => state.loadOfferings);
  const clearPromo = useSubscriptionStore((state) => state.clearPromo);
  const offeringsError = useSubscriptionStore((state) => state.error);

  // Get sale configuration
  const saleConfig = getSaleConfig();

  /**
   * Calculate original price from discounted price
   * Used for strikethrough display when sale is active
   */
  const getOriginalPrice = (discountedPrice: string, discountPercent: number): string => {
    const priceNum = parseFloat(discountedPrice.replace(/[^0-9.]/g, ''));
    const original = priceNum / (1 - discountPercent / 100);
    return `$${original.toFixed(2)}`;
  };

  // Load offerings on mount
  useEffect(() => {
    if (!offerings) {
      loadOfferings();
    }
  }, []);

  /**
   * Handle Purchase
   * Uses package ID to select the correct offering
   */
  const handlePurchase = async (packageId: PackageId) => {
    if (!offerings) {
      Alert.alert('Error', 'Subscription packages are not available yet. Please try again.');
      return;
    }

    const packageData = offerings[packageId];

    if (!packageData) {
      Alert.alert('Error', 'Selected subscription package is not available.');
      return;
    }

    setPurchasingPackageId(packageId);

    try {
      const result = await purchasePackage(packageData);

      if (result.success) {
        // Record promo code redemption if one was applied
        if (appliedPromoCode) {
          try {
            await recordPromoRedemption(appliedPromoCode, packageData.tier);
            console.log('[Paywall] Promo code redemption recorded:', appliedPromoCode);
          } catch (promoError) {
            // Don't fail the purchase if promo recording fails
            console.error('[Paywall] Failed to record promo redemption:', promoError);
          }
          // Clear the promo code after successful purchase
          clearPromo();
        }

        Alert.alert(
          'Success!',
          appliedPromoCode
            ? 'Your discount has been applied! Welcome to your subscription.'
            : 'Welcome to your free trial! Your subscription is now active.',
          [
            {
              text: 'Get Started',
              onPress: () => handleDismiss(),
            },
          ]
        );
      } else if (!result.userCancelled) {
        Alert.alert(
          'Purchase Failed',
          result.error?.message || 'An error occurred during purchase. Please try again.'
        );
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'An unexpected error occurred.');
    } finally {
      setPurchasingPackageId(null);
    }
  };

  /**
   * Handle Restore Purchases
   */
  const handleRestore = async () => {
    try {
      const result = await restorePurchases();

      if (result.success) {
        Alert.alert(
          'Restored!',
          'Your previous purchases have been restored.',
          [
            {
              text: 'OK',
              onPress: () => handleDismiss(),
            },
          ]
        );
      } else {
        Alert.alert(
          'No Purchases Found',
          'We could not find any previous purchases to restore.'
        );
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to restore purchases.');
    }
  };

  /**
   * Handle Dismiss
   */
  const handleDismiss = () => {
    if (route?.params?.onDismiss) {
      route.params.onDismiss();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Home');
    }
  };

  /**
   * Render Loading State
   */
  if (isLoadingOfferings) {
    return (
      <SafeAreaView style={styles.loadingContainer} edges={['top']}>
        <LinearGradient
          colors={[colors.background.primary, colors.background.purple]}
          style={styles.gradient}
        >
          <ActivityIndicator size="large" color={colors.brand.gold} />
          <Text style={styles.loadingText}>Loading subscription options...</Text>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  /**
   * Render Error State - when offerings failed to load
   */
  if (!offerings) {
    return (
      <SafeAreaView style={styles.loadingContainer} edges={['top']}>
        <LinearGradient
          colors={[colors.background.primary, colors.background.purple]}
          style={styles.gradient}
        >
          {/* Close Button */}
          <Pressable
            style={styles.closeButton}
            onPress={handleDismiss}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Close"
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </Pressable>

          <ScrollView contentContainerStyle={styles.errorScrollContent}>
            {/* Debug Overlay - always visible in error state for debugging */}
            <DebugOverlay visible={true} offeringsError={offeringsError} />

            <View style={styles.errorContainer}>
              <Text style={styles.errorIcon}>⚠️</Text>
              <Pressable onPress={handleTitleTap}>
                <Text style={styles.errorTitle}>Unable to Load Subscriptions</Text>
              </Pressable>
              <Text style={styles.errorMessage}>
                {offeringsError || 'Please check your internet connection and try again.'}
              </Text>
              <Pressable
                style={styles.retryButton}
                onPress={() => loadOfferings()}
                accessibilityRole="button"
                accessibilityLabel="Retry loading subscriptions"
              >
                <Text style={styles.retryButtonText}>Try Again</Text>
              </Pressable>

              {/* Sandbox Account Info */}
              <View style={styles.sandboxInfoContainer}>
                <Text style={styles.sandboxInfoTitle}>📱 Sandbox Account Required</Text>
                <Text style={styles.sandboxInfoText}>
                  To test purchases on TestFlight, you need a Sandbox Apple ID:
                </Text>
                <Text style={styles.sandboxInfoStep}>1. Go to Settings → App Store</Text>
                <Text style={styles.sandboxInfoStep}>2. Scroll down and tap "Sandbox Account"</Text>
                <Text style={styles.sandboxInfoStep}>3. Sign in with a test Apple ID</Text>
                <Text style={styles.sandboxInfoHint}>
                  Create sandbox accounts at App Store Connect → Users and Access → Sandbox Testers
                </Text>
              </View>
            </View>
          </ScrollView>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient
        colors={[colors.background.primary, colors.background.purple]}
        style={styles.gradient}
      >
        {/* Close Button */}
        <Pressable
          style={styles.closeButton}
          onPress={handleDismiss}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Close"
        >
          <Text style={styles.closeButtonText}>✕</Text>
        </Pressable>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Choose Your Path</Text>
            <Text style={styles.subtitle}>
              Start your 7-day free trial. Cancel anytime.
            </Text>
          </View>

          {/* Sale Banner - shown when sale is active */}
          {saleConfig.isActive && !isSubscribed && (
            <SaleBanner
              discountPercentage={saleConfig.discountPercentage}
              bannerText={saleConfig.bannerText}
            />
          )}

          {/* Locked Feature Message */}
          {route?.params?.lockedFeature && (
            <View style={styles.lockedFeatureContainer}>
              <Text style={styles.lockedFeatureIcon}>🔒</Text>
              <Text style={styles.lockedFeatureText}>
                Unlock {route.params.lockedFeature} with a subscription
              </Text>
            </View>
          )}

          {/* TEST MODE: Only show in development builds */}
          {__DEV__ && (
            <View style={styles.testModeContainer}>
              <Text style={styles.testModeLabel}>🧪 TEST MODE</Text>
              <Text style={styles.testModeDescription}>
                Using RevenueCat Test Store - All purchases grant full access
              </Text>
            </View>
          )}

          {/* Already Subscribed Message */}
          {isSubscribed && (
            <View style={styles.subscribedContainer}>
              <Text style={styles.subscribedIcon}>✓</Text>
              <Text style={styles.subscribedText}>
                You're subscribed to {currentTier === 'enlightenment' ? 'Enlightenment Path' : 'Novice Path'}
                {isInTrial && ' (Trial)'}
              </Text>
            </View>
          )}

          {/* Promo Code Input */}
          {!isSubscribed && (
            <PromoCodeInput
              onApplied={(code, discount) => {
                console.log(`[Paywall] Promo code applied: ${code} (${discount}% off)`);
              }}
            />
          )}

          {/* Tier Selection Tabs */}
          <View style={styles.tierTabs}>
            <Pressable
              style={[styles.tierTab, selectedTier === 'novice' && styles.tierTabSelected]}
              onPress={() => setSelectedTier('novice')}
            >
              <Text style={[styles.tierTabText, selectedTier === 'novice' && styles.tierTabTextSelected]}>
                Novice
              </Text>
              <Text style={styles.tierTabPrice}>$7.99/mo</Text>
            </Pressable>
            <Pressable
              style={[styles.tierTab, selectedTier === 'awakening' && styles.tierTabSelected, styles.tierTabPopular]}
              onPress={() => setSelectedTier('awakening')}
            >
              <View style={styles.popularPill}>
                <Text style={styles.popularPillText}>POPULAR</Text>
              </View>
              <Text style={[styles.tierTabText, selectedTier === 'awakening' && styles.tierTabTextSelected]}>
                Awakening
              </Text>
              <Text style={styles.tierTabPrice}>$19.99/mo</Text>
            </Pressable>
            <Pressable
              style={[styles.tierTab, selectedTier === 'enlightenment' && styles.tierTabSelected]}
              onPress={() => setSelectedTier('enlightenment')}
            >
              <Text style={[styles.tierTabText, selectedTier === 'enlightenment' && styles.tierTabTextSelected]}>
                Enlightenment
              </Text>
              <Text style={styles.tierTabPrice}>$49.99/mo</Text>
            </Pressable>
          </View>

          {/* Tier Features */}
          <View style={styles.tierFeaturesContainer}>
            {selectedTier === 'novice' && (
              <>
                {TIER_PRICING.novice.features.map((feature, index) => (
                  <View key={index} style={styles.featureRow}>
                    <Text style={styles.featureCheckmark}>✓</Text>
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </>
            )}
            {selectedTier === 'awakening' && (
              <>
                {TIER_PRICING.awakening.features.map((feature, index) => (
                  <View key={index} style={styles.featureRow}>
                    <Text style={styles.featureCheckmark}>✓</Text>
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </>
            )}
            {selectedTier === 'enlightenment' && (
              <>
                {TIER_PRICING.enlightenment.features.map((feature, index) => (
                  <View key={index} style={styles.featureRow}>
                    <Text style={styles.featureCheckmark}>✓</Text>
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </>
            )}
          </View>

          {/* Subscription Options for Selected Tier */}
          <View style={styles.optionsContainer}>
            {/* Annual - Best Value */}
            {selectedTier === 'novice' && offerings.novice_annual && (
              <TestPackageCard
                packageData={offerings.novice_annual}
                label="Annual"
                sublabel="Best Value - Save 17%"
                isPopular
                onPurchase={() => handlePurchase(PACKAGE_IDS.NOVICE_ANNUAL)}
                isPurchasing={purchasingPackageId === PACKAGE_IDS.NOVICE_ANNUAL}
                isDisabled={isSubscribed && currentTier === 'novice'}
                isSaleActive={saleConfig.isActive}
                originalPrice={saleConfig.isActive ? getOriginalPrice(offerings.novice_annual.price, saleConfig.discountPercentage) : undefined}
                discountPercentage={saleConfig.discountPercentage}
              />
            )}
            {selectedTier === 'novice' && offerings.novice_monthly && (
              <TestPackageCard
                packageData={offerings.novice_monthly}
                label="Monthly"
                sublabel="Cancel anytime"
                onPurchase={() => handlePurchase(PACKAGE_IDS.NOVICE_MONTHLY)}
                isPurchasing={purchasingPackageId === PACKAGE_IDS.NOVICE_MONTHLY}
                isDisabled={isSubscribed && currentTier === 'novice'}
                isSaleActive={saleConfig.isActive}
                originalPrice={saleConfig.isActive ? getOriginalPrice(offerings.novice_monthly.price, saleConfig.discountPercentage) : undefined}
                discountPercentage={saleConfig.discountPercentage}
              />
            )}

            {selectedTier === 'awakening' && offerings.awakening_annual && (
              <TestPackageCard
                packageData={offerings.awakening_annual}
                label="Annual"
                sublabel="Best Value - Save 17%"
                isPopular
                onPurchase={() => handlePurchase(PACKAGE_IDS.AWAKENING_ANNUAL)}
                isPurchasing={purchasingPackageId === PACKAGE_IDS.AWAKENING_ANNUAL}
                isDisabled={isSubscribed && currentTier === 'awakening'}
                isSaleActive={saleConfig.isActive}
                originalPrice={saleConfig.isActive ? getOriginalPrice(offerings.awakening_annual.price, saleConfig.discountPercentage) : undefined}
                discountPercentage={saleConfig.discountPercentage}
              />
            )}
            {selectedTier === 'awakening' && offerings.awakening_monthly && (
              <TestPackageCard
                packageData={offerings.awakening_monthly}
                label="Monthly"
                sublabel="Cancel anytime"
                onPurchase={() => handlePurchase(PACKAGE_IDS.AWAKENING_MONTHLY)}
                isPurchasing={purchasingPackageId === PACKAGE_IDS.AWAKENING_MONTHLY}
                isDisabled={isSubscribed && currentTier === 'awakening'}
                isSaleActive={saleConfig.isActive}
                originalPrice={saleConfig.isActive ? getOriginalPrice(offerings.awakening_monthly.price, saleConfig.discountPercentage) : undefined}
                discountPercentage={saleConfig.discountPercentage}
              />
            )}

            {selectedTier === 'enlightenment' && offerings.enlightenment_annual && (
              <TestPackageCard
                packageData={offerings.enlightenment_annual}
                label="Annual"
                sublabel="Best Value - Save 17%"
                isPopular
                onPurchase={() => handlePurchase(PACKAGE_IDS.ENLIGHTENMENT_ANNUAL)}
                isPurchasing={purchasingPackageId === PACKAGE_IDS.ENLIGHTENMENT_ANNUAL}
                isDisabled={isSubscribed && currentTier === 'enlightenment'}
                isSaleActive={saleConfig.isActive}
                originalPrice={saleConfig.isActive ? getOriginalPrice(offerings.enlightenment_annual.price, saleConfig.discountPercentage) : undefined}
                discountPercentage={saleConfig.discountPercentage}
              />
            )}
            {selectedTier === 'enlightenment' && offerings.enlightenment_monthly && (
              <TestPackageCard
                packageData={offerings.enlightenment_monthly}
                label="Monthly"
                sublabel="Cancel anytime"
                onPurchase={() => handlePurchase(PACKAGE_IDS.ENLIGHTENMENT_MONTHLY)}
                isPurchasing={purchasingPackageId === PACKAGE_IDS.ENLIGHTENMENT_MONTHLY}
                isDisabled={isSubscribed && currentTier === 'enlightenment'}
                isSaleActive={saleConfig.isActive}
                originalPrice={saleConfig.isActive ? getOriginalPrice(offerings.enlightenment_monthly.price, saleConfig.discountPercentage) : undefined}
                discountPercentage={saleConfig.discountPercentage}
              />
            )}
          </View>

          {/* Features List */}
          <View style={styles.featuresContainer}>
            <Text style={styles.featuresTitle}>All plans include:</Text>
            {TIER_PRICING.enlightenment.features.map((feature, index) => (
              <View key={index} style={styles.featureRow}>
                <Text style={styles.featureCheckmark}>✓</Text>
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>

          {/* Restore Purchases Button */}
          <Pressable
            style={styles.restoreButton}
            onPress={handleRestore}
            disabled={isRestoring}
            accessibilityRole="button"
            accessibilityLabel="Restore purchases"
          >
            {isRestoring ? (
              <ActivityIndicator size="small" color={colors.text.secondary} />
            ) : (
              <Text style={styles.restoreButtonText}>Restore Purchases</Text>
            )}
          </Pressable>

          {/* Terms & Privacy */}
          <View style={styles.legalContainer}>
            <Text style={styles.legalText}>
              Subscription automatically renews unless auto-renew is turned off at least
              24 hours before the end of the current period. Payment will be charged to
              your Apple ID account at confirmation of purchase.
            </Text>
            <View style={styles.legalLinks}>
              <Text style={styles.legalLink}>Terms of Service</Text>
              <Text style={styles.legalSeparator}> • </Text>
              <Text style={styles.legalLink}>Privacy Policy</Text>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing['2xl'],
  },
  closeButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    zIndex: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(26, 26, 36, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.primary,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text.primary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  lockedFeatureContainer: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    padding: spacing.md,
    backgroundColor: 'rgba(212, 168, 75, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.brand.gold,
    flexDirection: 'row',
    alignItems: 'center',
  },
  lockedFeatureIcon: {
    fontSize: 24,
    marginRight: spacing.sm,
  },
  lockedFeatureText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: colors.brand.gold,
  },
  toggleContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  cardsContainer: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
  },
  restoreButton: {
    marginTop: spacing.xl,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  restoreButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.secondary,
    textDecorationLine: 'underline',
  },
  legalContainer: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
  },
  legalText: {
    fontSize: 11,
    fontWeight: '400',
    color: colors.text.tertiary,
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: spacing.md,
  },
  legalLinks: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legalLink: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text.link,
    textDecorationLine: 'underline',
  },
  legalSeparator: {
    fontSize: 12,
    color: colors.text.tertiary,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.secondary,
  },
  // Error State Styles
  errorScrollContent: {
    flexGrow: 1,
    paddingTop: spacing.xl * 2,
    paddingBottom: spacing.xl,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: spacing.lg,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  errorMessage: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.xl,
  },
  retryButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: 24,
    backgroundColor: colors.brand.gold,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.background.primary,
  },
  // Sandbox Account Info Styles
  sandboxInfoContainer: {
    marginTop: spacing.xl,
    padding: spacing.md,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
    width: '100%',
  },
  sandboxInfoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3B82F6',
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  sandboxInfoText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text.secondary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  sandboxInfoStep: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: 4,
    paddingLeft: spacing.md,
  },
  sandboxInfoHint: {
    fontSize: 11,
    fontWeight: '400',
    color: colors.text.tertiary,
    marginTop: spacing.sm,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  // Test Mode Styles
  testModeContainer: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    padding: spacing.md,
    backgroundColor: 'rgba(147, 51, 234, 0.15)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(147, 51, 234, 0.3)',
    alignItems: 'center',
  },
  testModeLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#9333EA',
    marginBottom: spacing.xs,
  },
  testModeDescription: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text.secondary,
    textAlign: 'center',
  },
  subscribedContainer: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    padding: spacing.md,
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.3)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subscribedIcon: {
    fontSize: 20,
    color: '#22C55E',
    marginRight: spacing.sm,
  },
  subscribedText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#22C55E',
  },
  optionsContainer: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  // Tier tab styles
  tierTabs: {
    flexDirection: 'row',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    borderRadius: 12,
    backgroundColor: 'rgba(26, 26, 36, 0.8)',
    padding: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  tierTab: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xs,
    borderRadius: 10,
    alignItems: 'center',
  },
  tierTabSelected: {
    backgroundColor: colors.brand.gold,
  },
  tierTabPopular: {
    position: 'relative',
  },
  tierTabText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text.secondary,
    textAlign: 'center',
  },
  tierTabTextSelected: {
    color: colors.background.primary,
  },
  tierTabPrice: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.text.tertiary,
    marginTop: 2,
  },
  popularPill: {
    position: 'absolute',
    top: -8,
    backgroundColor: colors.brand.gold,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 8,
  },
  popularPillText: {
    fontSize: 8,
    fontWeight: '800',
    color: colors.background.primary,
    letterSpacing: 0.5,
  },
  tierFeaturesContainer: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    padding: spacing.md,
    backgroundColor: 'rgba(26, 26, 36, 0.6)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  packageCard: {
    backgroundColor: 'rgba(26, 26, 36, 0.9)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border.default,
    overflow: 'hidden',
  },
  packageCardPopular: {
    borderColor: colors.brand.gold,
    borderWidth: 2,
  },
  popularBadge: {
    backgroundColor: colors.brand.gold,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
  },
  popularBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.background.primary,
    letterSpacing: 1,
  },
  packageContent: {
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  packageHeader: {
    flex: 1,
  },
  packageLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  packagePrice: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.brand.gold,
    marginBottom: spacing.xs,
  },
  packageSublabel: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.text.secondary,
  },
  purchaseButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: colors.brand.gold,
    backgroundColor: 'transparent',
    minWidth: 140,
    alignItems: 'center',
  },
  purchaseButtonPopular: {
    backgroundColor: colors.brand.gold,
    borderColor: colors.brand.gold,
  },
  purchaseButtonDisabled: {
    opacity: 0.5,
    backgroundColor: 'rgba(128, 128, 128, 0.3)',
    borderColor: 'rgba(128, 128, 128, 0.5)',
  },
  purchaseButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.brand.gold,
  },
  purchaseButtonTextPopular: {
    color: colors.background.primary,
  },
  purchaseButtonTextDisabled: {
    color: colors.text.tertiary,
  },
  featuresContainer: {
    marginTop: spacing.xl,
    marginHorizontal: spacing.lg,
    padding: spacing.lg,
    backgroundColor: 'rgba(26, 26, 36, 0.6)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  featureCheckmark: {
    fontSize: 16,
    color: colors.brand.gold,
    marginRight: spacing.sm,
    width: 24,
  },
  featureText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.secondary,
    flex: 1,
  },
});
