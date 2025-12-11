/**
 * Feature Comparison Component
 *
 * Displays a comparison table of features across subscription tiers
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors, spacing } from '../../theme';
import type { SubscriptionTier } from '../../types/subscription';

interface FeatureComparisonProps {
  currentTier?: SubscriptionTier;
}

interface FeatureRow {
  label: string;
  novice: string;
  enlightenment: string;
}

/**
 * Two-tier model:
 * - Novice: All features EXCEPT Guru AI chat
 * - Enlightenment: All features INCLUDING Guru AI chat
 */
const FEATURES: FeatureRow[] = [
  {
    label: 'Workbook Phases',
    novice: 'All 10 Phases',
    enlightenment: 'All 10 Phases',
  },
  {
    label: 'Guided Meditations',
    novice: 'All 18 sessions',
    enlightenment: 'All 18 sessions',
  },
  {
    label: 'Breathing Exercises',
    novice: 'All exercises',
    enlightenment: 'All exercises',
  },
  {
    label: 'Meditation Music',
    novice: 'All tracks',
    enlightenment: 'All tracks',
  },
  {
    label: 'AI Guru Chat',
    novice: '✗',
    enlightenment: 'Unlimited',
  },
  {
    label: 'Vision Board',
    novice: '✓',
    enlightenment: '✓',
  },
  {
    label: 'Progress Tracking',
    novice: '✓',
    enlightenment: '✓',
  },
];

export const FeatureComparison: React.FC<FeatureComparisonProps> = ({
  currentTier,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Compare All Features</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tableContainer}
      >
        {/* Feature Labels Column */}
        <View style={styles.labelColumn}>
          <View style={styles.headerCell}>
            <Text style={styles.headerText}>Features</Text>
          </View>
          {FEATURES.map((feature, index) => (
            <View key={index} style={styles.labelCell}>
              <Text style={styles.labelText}>{feature.label}</Text>
            </View>
          ))}
        </View>

        {/* Novice Column */}
        <View style={styles.tierColumn}>
          <View style={[styles.headerCell, styles.tierHeader, styles.popularTier]}>
            <Text style={styles.tierHeaderTextHighlight}>Novice</Text>
            <Text style={styles.popularLabel}>★ Most Popular</Text>
            {currentTier === 'novice' && (
              <View style={styles.currentBadge}>
                <Text style={styles.currentBadgeText}>Current</Text>
              </View>
            )}
          </View>
          {FEATURES.map((feature, index) => (
            <View key={index} style={styles.featureCell}>
              <Text style={styles.featureText}>{feature.novice}</Text>
            </View>
          ))}
        </View>

        {/* Enlightenment Column */}
        <View style={styles.tierColumn}>
          <View style={[styles.headerCell, styles.tierHeader]}>
            <Text style={styles.tierHeaderText}>Enlightenment</Text>
            {currentTier === 'enlightenment' && (
              <View style={styles.currentBadge}>
                <Text style={styles.currentBadgeText}>Current</Text>
              </View>
            )}
          </View>
          {FEATURES.map((feature, index) => (
            <View key={index} style={styles.featureCell}>
              <Text style={styles.featureText}>{feature.enlightenment}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.xl,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  tableContainer: {
    flexDirection: 'row',
  },
  labelColumn: {
    width: 140,
  },
  tierColumn: {
    width: 120,
    marginLeft: spacing.xs,
  },
  headerCell: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderWidth: 1,
    borderColor: colors.border.default,
    paddingHorizontal: spacing.sm,
  },
  tierHeader: {
    backgroundColor: colors.background.tertiary,
  },
  popularTier: {
    backgroundColor: colors.brand.gold,
    borderColor: colors.brand.gold,
  },
  headerText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  tierHeaderText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text.primary,
  },
  tierHeaderTextHighlight: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.background.primary,
  },
  popularLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.background.primary,
    marginTop: 2,
  },
  currentBadge: {
    backgroundColor: colors.background.primary,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: spacing.xs / 2,
  },
  currentBadgeText: {
    fontSize: 9,
    fontWeight: '600',
    color: colors.brand.amber,
  },
  labelCell: {
    height: 50,
    justifyContent: 'center',
    paddingLeft: spacing.sm,
    backgroundColor: colors.background.secondary,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.border.default,
  },
  featureCell: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.border.default,
    paddingHorizontal: spacing.xs,
  },
  labelText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.text.secondary,
  },
  featureText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text.primary,
    textAlign: 'center',
  },
});
