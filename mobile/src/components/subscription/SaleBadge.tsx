/**
 * Sale Badge Component
 *
 * Small "50% OFF" badge to overlay on pricing cards.
 * Positioned in top-right with slight rotation for visual pop.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { spacing } from '../../theme';

interface SaleBadgeProps {
  discountPercentage?: number;
}

export const SaleBadge: React.FC<SaleBadgeProps> = ({
  discountPercentage = 50,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{discountPercentage}% OFF</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#DC2626',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 8,
    position: 'absolute',
    top: 8,
    right: 8,
    transform: [{ rotate: '12deg' }],
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 10,
  },
  text: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});
