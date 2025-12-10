/**
 * Paywall Screen
 *
 * Beautiful subscription paywall with pricing display and purchase flow.
 *
 * TEST MODE: Simplified for RevenueCat Test Store with monthly/yearly/lifetime products.
 * All products grant 'enlightenment' tier for testing.
 *
 * PRODUCTION: Will be updated to show 3-tier pricing (novice/awakening/enlightenment)
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
import type { SubscriptionPeriod, SubscriptionPackage } from '../../types/subscription';
import { TIER_PRICING } from '../../types/subscription';
import { useSubscriptionStore, useOfferings, usePurchaseState } from '../../stores/subscriptionStore';

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
}

const TestPackageCard: React.FC<TestPackageCardProps> = ({
  packageData,
  label,
  sublabel,
  isPopular = false,
  onPurchase,
  isPurchasing,
  isDisabled = false,
}) => (
  <View style={[styles.packageCard, isPopular && styles.packageCardPopular]}>
    {isPopular && (
      <View style={styles.popularBadge}>
        <Text style={styles.popularBadgeText}>BEST VALUE</Text>
      </View>
    )}
    <View style={styles.packageContent}>
      <View style={styles.packageHeader}>
        <Text style={styles.packageLabel}>{label}</Text>
        <Text style={styles.packagePrice}>{packageData.price}</Text>
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
  const [purchasingPeriod, setPurchasingPeriod] = useState<SubscriptionPeriod | null>(null);

  const { offerings, isLoading: isLoadingOfferings } = useOfferings();
  const { isRestoring } = usePurchaseState();
  const currentTier = useSubscriptionStore((state) => state.tier);
  const isInTrial = useSubscriptionStore((state) => state.isInTrial);
  const isSubscribed = useSubscriptionStore((state) => state.isSubscribed);
  const purchasePackage = useSubscriptionStore((state) => state.purchasePackage);
  const restorePurchases = useSubscriptionStore((state) => state.restorePurchases);
  const loadOfferings = useSubscriptionStore((state) => state.loadOfferings);

  // Load offerings on mount
  useEffect(() => {
    if (!offerings) {
      loadOfferings();
    }
  }, []);

  /**
   * Handle Purchase
   * TEST MODE: Uses simplified monthly/yearly/lifetime products
   */
  const handlePurchase = async (period: SubscriptionPeriod) => {
    if (!offerings) {
      Alert.alert('Error', 'Subscription packages are not available yet. Please try again.');
      return;
    }

    const packageData = offerings[period];

    if (!packageData) {
      Alert.alert('Error', 'Selected subscription package is not available.');
      return;
    }

    setPurchasingPeriod(period);

    try {
      const result = await purchasePackage(packageData);

      if (result.success) {
        Alert.alert(
          'Success!',
          'Welcome to your free trial! Your subscription is now active.',
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
      setPurchasingPeriod(null);
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
  if (isLoadingOfferings || !offerings) {
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

          {/* Locked Feature Message */}
          {route?.params?.lockedFeature && (
            <View style={styles.lockedFeatureContainer}>
              <Text style={styles.lockedFeatureIcon}>🔒</Text>
              <Text style={styles.lockedFeatureText}>
                Unlock {route.params.lockedFeature} with a subscription
              </Text>
            </View>
          )}

          {/* TEST MODE: Show available packages */}
          <View style={styles.testModeContainer}>
            <Text style={styles.testModeLabel}>🧪 TEST MODE</Text>
            <Text style={styles.testModeDescription}>
              Using RevenueCat Test Store - All purchases grant full access
            </Text>
          </View>

          {/* Already Subscribed Message */}
          {isSubscribed && (
            <View style={styles.subscribedContainer}>
              <Text style={styles.subscribedIcon}>✓</Text>
              <Text style={styles.subscribedText}>
                You're subscribed to {currentTier === 'enlightenment' ? 'Enlightenment Path' : currentTier === 'awakening' ? 'Awakening Path' : 'Novice Path'}
                {isInTrial && ' (Trial)'}
              </Text>
            </View>
          )}

          {/* Subscription Options */}
          <View style={styles.optionsContainer}>
            {/* Yearly - Best Value */}
            {offerings.yearly && (
              <TestPackageCard
                packageData={offerings.yearly}
                label="Annual"
                sublabel="Best Value - Save 37%"
                isPopular
                onPurchase={() => handlePurchase('yearly')}
                isPurchasing={purchasingPeriod === 'yearly'}
                isDisabled={isSubscribed}
              />
            )}

            {/* Monthly */}
            {offerings.monthly && (
              <TestPackageCard
                packageData={offerings.monthly}
                label="Monthly"
                sublabel="Cancel anytime"
                onPurchase={() => handlePurchase('monthly')}
                isPurchasing={purchasingPeriod === 'monthly'}
                isDisabled={isSubscribed}
              />
            )}

            {/* Lifetime */}
            {offerings.lifetime && (
              <TestPackageCard
                packageData={offerings.lifetime}
                label="Lifetime"
                sublabel="One-time purchase, forever access"
                onPurchase={() => handlePurchase('lifetime')}
                isPurchasing={purchasingPeriod === 'lifetime'}
                isDisabled={isSubscribed}
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
