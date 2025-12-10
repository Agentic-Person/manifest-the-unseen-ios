/**
 * Guru Locked Screen
 *
 * Displayed when non-Enlightenment tier users try to access the Guru feature.
 * Shows feature benefits and prompts upgrade to Enlightenment tier.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, shadows, borderRadius } from '../theme';
import { TIER_PRICING } from '../types/subscription';

/**
 * Guru Locked Screen Component
 *
 * Premium feature lock screen for Guru personalized wisdom feature.
 * Requires Enlightenment tier subscription.
 */
const GuruLockedScreen = () => {
  const navigation = useNavigation();

  const handleUpgrade = () => {
    // Navigate to subscription screen
    navigation.navigate('Profile' as never);
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const benefits = [
    'Personalized insights based on your completed phases',
    'Deep analysis of your unique journey and progress',
    'AI-powered guidance tailored to your growth areas',
    'Unlimited wisdom conversations with your Guru',
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleGoBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Guru</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Lock Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Ionicons name="lock-closed" size={48} color={colors.dark.accentGold} />
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>Unlock Personalized Wisdom</Text>

        {/* Description */}
        <Text style={styles.description}>
          Your personal Guru provides deep, customized insights based on your
          unique manifestation journey and completed phases.
        </Text>

        {/* Tier Badge */}
        <View style={styles.tierBadge}>
          <Ionicons name="star" size={16} color={colors.white} />
          <Text style={styles.tierBadgeText}>Enlightenment Path Exclusive</Text>
        </View>

        {/* Benefits List */}
        <View style={styles.benefitsContainer}>
          <Text style={styles.benefitsTitle}>What you'll unlock:</Text>
          {benefits.map((benefit, index) => (
            <View key={index} style={styles.benefitItem}>
              <View style={styles.benefitIconContainer}>
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={colors.dark.accentGold}
                />
              </View>
              <Text style={styles.benefitText}>{benefit}</Text>
            </View>
          ))}
        </View>

        {/* Pricing */}
        <View style={styles.pricingContainer}>
          <Text style={styles.pricingLabel}>Starting at</Text>
          <Text style={styles.pricingAmount}>
            ${TIER_PRICING.enlightenment.monthly}/month
          </Text>
          <Text style={styles.pricingSubtext}>
            or ${TIER_PRICING.enlightenment.yearly}/year
          </Text>
        </View>

        {/* CTA Button */}
        <TouchableOpacity
          style={styles.upgradeButton}
          onPress={handleUpgrade}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Upgrade to Enlightenment Path"
        >
          <Text style={styles.upgradeButtonText}>
            Upgrade to Enlightenment
          </Text>
          <Ionicons name="arrow-forward" size={20} color={colors.background.primary} />
        </TouchableOpacity>

        {/* Later Button */}
        <TouchableOpacity
          style={styles.laterButton}
          onPress={handleGoBack}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Maybe later"
        >
          <Text style={styles.laterButtonText}>Maybe Later</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    alignItems: 'center',
  },
  iconContainer: {
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: `${colors.dark.accentGold}20`,
    borderWidth: 2,
    borderColor: colors.dark.accentGold,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  description: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.lg,
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.dark.accentPurple,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    marginBottom: spacing.xl,
    ...shadows.sm,
  },
  tierBadgeText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  benefitsContainer: {
    width: '100%',
    marginBottom: spacing.xl,
  },
  benefitsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  benefitIconContainer: {
    marginRight: spacing.sm,
    marginTop: 2,
  },
  benefitText: {
    flex: 1,
    fontSize: 15,
    color: colors.text.secondary,
    lineHeight: 22,
  },
  pricingContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  pricingLabel: {
    fontSize: 14,
    color: colors.text.tertiary,
    marginBottom: spacing.xs,
  },
  pricingAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.dark.accentGold,
    marginBottom: spacing.xs,
  },
  pricingSubtext: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.dark.accentGold,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    width: '100%',
    ...shadows.md,
    marginBottom: spacing.md,
  },
  upgradeButtonText: {
    color: colors.background.primary,
    fontSize: 18,
    fontWeight: '700',
  },
  laterButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  laterButtonText: {
    color: colors.text.tertiary,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default GuruLockedScreen;
