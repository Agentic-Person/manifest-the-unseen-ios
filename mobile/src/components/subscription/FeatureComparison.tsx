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
  awakening: string;
  enlightenment: string;
}

/**
 * Three-tier model:
 * - Novice: Workbook, progress, music meditations
 * - Awakening: + Guided meditations, Guru workbook analysis, Analytics
 * - Enlightenment: + Coming Soon features (journaling, full AI chat, 12+ tracks)
 */
const FEATURES: FeatureRow[] = [
  {
    label: 'Workbook Phases',
    novice: 'All 10 Phases',
    awakening: 'All 10 Phases',
    enlightenment: 'All 10 Phases',
  },
  {
    label: 'Progress Tracking',
    novice: '✓',
    awakening: '✓',
    enlightenment: '✓',
  },
  {
    label: 'PDF Manuscript',
    novice: '✓',
    awakening: '✓',
    enlightenment: '✓',
  },
  {
    label: 'Music Meditations',
    novice: '6 tracks',
    awakening: '6 tracks',
    enlightenment: '6 tracks',
  },
  {
    label: 'Guided Meditations',
    novice: '✗',
    awakening: '6 sessions',
    enlightenment: '6 sessions',
  },
  {
    label: 'Guru Analysis',
    novice: '✗',
    awakening: '✓ Workbook',
    enlightenment: '✓ Workbook',
  },
  {
    label: 'Advanced Analytics',
    novice: '✗',
    awakening: '✓',
    enlightenment: '✓',
  },
  {
    label: 'Full AI Chat',
    novice: '✗',
    awakening: '✗',
    enlightenment: 'Coming Soon',
  },
  {
    label: 'Journaling',
    novice: '✗',
    awakening: '✗',
    enlightenment: 'Coming Soon',
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
          <View style={[styles.headerCell, styles.tierHeader]}>
            <Text style={styles.tierHeaderText}>Novice</Text>
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

        {/* Awakening Column - MOST POPULAR */}
        <View style={styles.tierColumn}>
          <View style={[styles.headerCell, styles.tierHeader, styles.popularTier]}>
            <Text style={styles.tierHeaderTextHighlight}>Awakening</Text>
            <Text style={styles.popularLabel}>★ Most Popular</Text>
            {currentTier === 'awakening' && (
              <View style={styles.currentBadge}>
                <Text style={styles.currentBadgeText}>Current</Text>
              </View>
            )}
          </View>
          {FEATURES.map((feature, index) => (
            <View key={index} style={styles.featureCell}>
              <Text style={styles.featureText}>{feature.awakening}</Text>
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
