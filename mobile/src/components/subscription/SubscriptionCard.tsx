/**
 * Subscription Card Component
 *
 * Individual subscription tier card with pricing, features, and CTA
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing } from '../../theme';
import type { SubscriptionTier, SubscriptionPeriod, SubscriptionPackage } from '../../types/subscription';
import { TIER_PRICING } from '../../types/subscription';
import { TrialBadge } from './TrialBadge';
import { PopularBadge } from './PopularBadge';
import { PurchaseButton } from './PurchaseButton';

interface SubscriptionCardProps {
  tier: SubscriptionTier;
  period: SubscriptionPeriod;
  packageData: SubscriptionPackage | null;
  isPopular?: boolean;
  isCurrentTier?: boolean;
  inTrial?: boolean;
  onPurchase: () => void;
  isPurchasing?: boolean;
}

const TIER_NAMES: Record<string, string> = {
  novice: 'Novice Path',
  awakening: 'Awakening Path',
  enlightenment: 'Enlightenment Path',
  free: 'Free',
};

const TIER_DESCRIPTIONS: Record<string, string> = {
  novice: 'Begin your journey',
  awakening: 'Deepen your practice',
  enlightenment: 'Complete experience',
  free: 'Limited access',
};

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  tier,
  period,
  packageData,
  isPopular = false,
  isCurrentTier = false,
  inTrial = false,
  onPurchase,
  isPurchasing = false,
}) => {
  // Only show pricing for paid tiers
  const tierData = tier === 'free' ? null : TIER_PRICING[tier as 'novice' | 'awakening' | 'enlightenment'];

  // Get price - packageData takes priority, fallback to tier pricing for monthly/yearly
  const getPrice = (): string => {
    if (packageData?.price) return packageData.price;
    if (!tierData) return '$0';
    if (period === 'monthly') return `$${tierData.monthly}`;
    if (period === 'yearly') return `$${tierData.yearly}`;
    return '$0'; // lifetime handled by packageData
  };

  const price = getPrice();
  const pricePerMonth = packageData?.pricePerMonth || (
    tierData && period === 'yearly' ? `$${(tierData.yearly / 12).toFixed(2)}/mo` : price
  );

  // Calculate savings for yearly
  const savingsPercent = period === 'yearly' && tierData
    ? Math.round((1 - (tierData.yearly / 12) / tierData.monthly) * 100)
    : 0;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        isPopular && styles.containerPopular,
        pressed && styles.containerPressed,
      ]}
      onPress={onPurchase}
      disabled={isPurchasing || isCurrentTier}
      accessibilityRole="button"
      accessibilityLabel={`Subscribe to ${TIER_NAMES[tier] || tier}`}
    >
      <LinearGradient
        colors={
          isPopular
            ? ['rgba(212, 168, 75, 0.15)', 'rgba(10, 10, 15, 0.95)']
            : ['rgba(26, 26, 36, 0.8)', 'rgba(10, 10, 15, 0.95)']
        }
        style={styles.gradient}
      >
        {/* Popular Badge */}
        {isPopular && <PopularBadge />}

        {/* Card Content */}
        <View style={[styles.content, isPopular && styles.contentPopular]}>
          {/* Trial Badge */}
          {!isCurrentTier && <TrialBadge />}

          {/* Tier Name */}
          <Text style={styles.tierName}>{TIER_NAMES[tier] || tier}</Text>
          <Text style={styles.tierDescription}>{TIER_DESCRIPTIONS[tier] || ''}</Text>

          {/* Pricing */}
          <View style={styles.pricingContainer}>
            <View style={styles.priceRow}>
              <Text style={styles.price}>{price}</Text>
              <Text style={styles.period}>
                /{period === 'monthly' ? 'month' : 'year'}
              </Text>
            </View>
            {period === 'yearly' && (
              <View style={styles.savingsRow}>
                <Text style={styles.pricePerMonth}>{pricePerMonth}</Text>
                <View style={styles.savingsBadge}>
                  <Text style={styles.savingsText}>Save {savingsPercent}%</Text>
                </View>
              </View>
            )}
          </View>

          {/* Features List */}
          <View style={styles.featuresContainer}>
            {(tierData?.features || []).map((feature: string, index: number) => (
              <View key={index} style={styles.featureRow}>
                <Text style={styles.checkmark}>✓</Text>
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>

          {/* CTA Button */}
          <View style={styles.buttonContainer}>
            <PurchaseButton
              onPress={onPurchase}
              isLoading={isPurchasing}
              isCurrentTier={isCurrentTier}
              inTrial={inTrial}
            />
          </View>

          {/* Current Tier Indicator */}
          {isCurrentTier && (
            <View style={styles.currentIndicator}>
              <Text style={styles.currentText}>
                {inTrial ? 'Active Trial' : 'Active Plan'}
              </Text>
            </View>
          )}
        </View>
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 300,
    marginHorizontal: spacing.sm,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border.default,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  containerPopular: {
    borderColor: colors.brand.gold,
    borderWidth: 2,
    shadowColor: colors.brand.gold,
    shadowOpacity: 0.3,
    transform: [{ scale: 1.05 }],
  },
  containerPressed: {
    opacity: 0.9,
  },
  gradient: {
    flex: 1,
    paddingBottom: spacing.lg,
  },
  content: {
    padding: spacing.lg,
  },
  contentPopular: {
    paddingTop: spacing.xl + spacing.md, // Account for popular badge
  },
  tierName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  tierDescription: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.secondary,
    marginBottom: spacing.lg,
  },
  pricingContainer: {
    marginBottom: spacing.lg,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.default,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 42,
    fontWeight: '800',
    color: colors.brand.gold,
    letterSpacing: -1,
  },
  period: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.secondary,
    marginLeft: spacing.xs,
  },
  savingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  pricePerMonth: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  savingsBadge: {
    backgroundColor: colors.brand.amber,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: 6,
    marginLeft: spacing.sm,
  },
  savingsText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.background.primary,
  },
  featuresContainer: {
    marginBottom: spacing.lg,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  checkmark: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.brand.gold,
    marginRight: spacing.sm,
    marginTop: 2,
  },
  featureText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
    lineHeight: 20,
  },
  buttonContainer: {
    marginTop: spacing.md,
  },
  currentIndicator: {
    marginTop: spacing.md,
    alignItems: 'center',
  },
  currentText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.brand.amber,
    letterSpacing: 0.5,
  },
});
