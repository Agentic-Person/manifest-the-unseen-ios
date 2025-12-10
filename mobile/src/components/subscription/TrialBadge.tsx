/**
 * Trial Badge Component
 *
 * Displays "7-Day Free Trial" badge on subscription cards
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '../../theme';

interface TrialBadgeProps {
  days?: number;
}

export const TrialBadge: React.FC<TrialBadgeProps> = ({ days = 7 }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{days}-Day Free Trial</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.brand.amber,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 12,
    alignSelf: 'flex-start',
    shadowColor: colors.brand.amber,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  text: {
    color: colors.background.primary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});
