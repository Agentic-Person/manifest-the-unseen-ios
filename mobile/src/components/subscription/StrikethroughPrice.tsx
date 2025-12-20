/**
 * Strikethrough Price Component
 *
 * Displays original price crossed out with discounted price below.
 * Used for sale pricing display.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '../../theme';

interface StrikethroughPriceProps {
  originalPrice: string;
  discountedPrice: string;
}

export const StrikethroughPrice: React.FC<StrikethroughPriceProps> = ({
  originalPrice,
  discountedPrice,
}) => {
  return (
    <View style={styles.container}>
      {/* Original price with strikethrough */}
      <View style={styles.originalPriceContainer}>
        <Text style={styles.originalPrice}>{originalPrice}</Text>
        <View style={styles.strikethrough} />
      </View>

      {/* Discounted price */}
      <Text style={styles.discountedPrice}>{discountedPrice}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
  },
  originalPriceContainer: {
    position: 'relative',
    marginBottom: spacing.xs,
  },
  originalPrice: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.tertiary,
    letterSpacing: 0.5,
  },
  strikethrough: {
    position: 'absolute',
    left: -2,
    right: -2,
    top: '50%',
    height: 2,
    backgroundColor: '#DC2626',
    transform: [{ rotate: '-5deg' }],
  },
  discountedPrice: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.brand.gold,
  },
});
