/**
 * Subscription Components Showcase
 *
 * Development-only screen to preview all subscription components
 * in isolation for testing and design iteration
 *
 * Usage: Add this to your dev navigation stack to preview components
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../../theme';
import type { SubscriptionPeriod } from '../../types/subscription';

// Import all components
import { TrialBadge } from '../../components/subscription/TrialBadge';
import { PopularBadge } from '../../components/subscription/PopularBadge';
import { PriceToggle } from '../../components/subscription/PriceToggle';
import { PurchaseButton } from '../../components/subscription/PurchaseButton';
import { FeatureComparison } from '../../components/subscription/FeatureComparison';

/**
 * Component Showcase Screen
 * FOR DEVELOPMENT ONLY - Remove from production build
 */
export const ComponentShowcase: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<SubscriptionPeriod>('monthly');

  const handlePurchase = () => {
    // Mock purchase handler for showcase
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text style={styles.title}>Subscription Components Showcase</Text>
        <Text style={styles.subtitle}>Development Preview</Text>

        {/* Trial Badge */}
        <Section title="TrialBadge">
          <TrialBadge />
          <View style={{ marginTop: spacing.sm }}>
            <TrialBadge days={14} />
          </View>
        </Section>

        {/* Popular Badge */}
        <Section title="PopularBadge">
          <View style={{ width: 200, height: 60, position: 'relative' }}>
            <PopularBadge />
          </View>
        </Section>

        {/* Price Toggle */}
        <Section title="PriceToggle">
          <PriceToggle
            selectedPeriod={selectedPeriod}
            onToggle={setSelectedPeriod}
          />
        </Section>

        {/* Purchase Buttons */}
        <Section title="PurchaseButton - States">
          <View style={{ gap: spacing.md }}>
            <PurchaseButton
              onPress={handlePurchase}
              label="Start Free Trial"
            />
            <PurchaseButton
              onPress={handlePurchase}
              isLoading={true}
              label="Processing..."
            />
            <PurchaseButton
              onPress={handlePurchase}
              isCurrentTier={true}
              label="Current Plan"
            />
            <PurchaseButton
              onPress={handlePurchase}
              isCurrentTier={true}
              inTrial={true}
              label="Current Trial"
            />
            <PurchaseButton
              onPress={handlePurchase}
              disabled={true}
              label="Disabled"
            />
          </View>
        </Section>

        {/* Feature Comparison */}
        <Section title="FeatureComparison">
          <FeatureComparison currentTier="novice" />
        </Section>

        {/* Color Swatches */}
        <Section title="Color Palette">
          <View style={styles.colorGrid}>
            <ColorSwatch label="Gold" color={colors.brand.gold} />
            <ColorSwatch label="Amber" color={colors.brand.amber} />
            <ColorSwatch label="Bronze" color={colors.brand.bronze} />
            <ColorSwatch label="Purple" color={colors.brand.purple} />
          </View>
        </Section>

        {/* Spacing Scale */}
        <Section title="Spacing Scale">
          <View style={{ gap: spacing.sm }}>
            <SpacingBar label="xs (4px)" size={spacing.xs} />
            <SpacingBar label="sm (8px)" size={spacing.sm} />
            <SpacingBar label="md (16px)" size={spacing.md} />
            <SpacingBar label="lg (24px)" size={spacing.lg} />
            <SpacingBar label="xl (32px)" size={spacing.xl} />
          </View>
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
};

/**
 * Section Component
 */
interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.sectionContent}>{children}</View>
  </View>
);

/**
 * Color Swatch Component
 */
interface ColorSwatchProps {
  label: string;
  color: string;
}

const ColorSwatch: React.FC<ColorSwatchProps> = ({ label, color }) => (
  <View style={styles.swatchContainer}>
    <View style={[styles.swatch, { backgroundColor: color }]} />
    <Text style={styles.swatchLabel}>{label}</Text>
    <Text style={styles.swatchCode}>{color}</Text>
  </View>
);

/**
 * Spacing Bar Component
 */
interface SpacingBarProps {
  label: string;
  size: number;
}

const SpacingBar: React.FC<SpacingBarProps> = ({ label, size }) => (
  <View style={styles.spacingContainer}>
    <Text style={styles.spacingLabel}>{label}</Text>
    <View style={[styles.spacingBar, { width: size }]} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing['4xl'],
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.secondary,
    marginBottom: spacing.xl,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.brand.gold,
    marginBottom: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.gold,
  },
  sectionContent: {
    padding: spacing.md,
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  swatchContainer: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  swatch: {
    width: 60,
    height: 60,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  swatchLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  swatchCode: {
    fontSize: 11,
    fontWeight: '400',
    color: colors.text.secondary,
    fontFamily: 'monospace',
  },
  spacingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  spacingLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.text.secondary,
    width: 100,
  },
  spacingBar: {
    height: 20,
    backgroundColor: colors.brand.amber,
    borderRadius: 4,
  },
});

export default ComponentShowcase;
