/**
 * Price Toggle Component
 *
 * Monthly/Annual toggle switch for subscription pricing display
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors, spacing } from '../../theme';
import type { SubscriptionPeriod } from '../../types/subscription';

interface PriceToggleProps {
  selectedPeriod: SubscriptionPeriod;
  onToggle: (period: SubscriptionPeriod) => void;
}

export const PriceToggle: React.FC<PriceToggleProps> = ({
  selectedPeriod,
  onToggle,
}) => {
  const isYearly = selectedPeriod === 'yearly';

  return (
    <View style={styles.container}>
      {/* Monthly Button */}
      <Pressable
        style={[
          styles.option,
          !isYearly && styles.optionSelected,
        ]}
        onPress={() => onToggle('monthly')}
        accessibilityRole="button"
        accessibilityState={{ selected: !isYearly }}
      >
        <Text
          style={[
            styles.optionText,
            !isYearly && styles.optionTextSelected,
          ]}
        >
          Monthly
        </Text>
      </Pressable>

      {/* Yearly Button */}
      <Pressable
        style={[
          styles.option,
          isYearly && styles.optionSelected,
        ]}
        onPress={() => onToggle('yearly')}
        accessibilityRole="button"
        accessibilityState={{ selected: isYearly }}
      >
        <View style={styles.yearlyContent}>
          <Text
            style={[
              styles.optionText,
              isYearly && styles.optionTextSelected,
            ]}
          >
            Annual
          </Text>
          <View style={styles.saveBadge}>
            <Text style={styles.saveText}>Save 37%</Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  option: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionSelected: {
    backgroundColor: colors.brand.gold,
    shadowColor: colors.brand.gold,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  optionText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  optionTextSelected: {
    color: colors.background.primary,
    fontWeight: '700',
  },
  yearlyContent: {
    alignItems: 'center',
  },
  saveBadge: {
    backgroundColor: colors.background.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: spacing.xs / 2,
  },
  saveText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.brand.amber,
    letterSpacing: 0.3,
  },
});
