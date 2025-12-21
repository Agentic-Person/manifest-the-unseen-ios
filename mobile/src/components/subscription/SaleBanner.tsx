/**
 * Sale Banner Component
 *
 * Prominent banner displaying the current sale promotion.
 * Shows discount percentage with urgency messaging.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { spacing } from '../../theme';

interface SaleBannerProps {
  discountPercentage: number;
  bannerText?: string;
}

export const SaleBanner: React.FC<SaleBannerProps> = ({
  discountPercentage,
  bannerText,
}) => {
  return (
    <LinearGradient
      colors={['#DC2626', '#B91C1C']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.discountText}>{discountPercentage}% OFF</Text>
        <Text style={styles.bannerText}>
          {bannerText || 'Monthly or Annual - You Choose!'}
        </Text>
        <View style={styles.urgencyBadge}>
          <Text style={styles.urgencyText}>Limited Time Offer</Text>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  content: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  discountText: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  bannerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: spacing.xs,
    opacity: 0.95,
  },
  urgencyBadge: {
    marginTop: spacing.sm,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  urgencyText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FEF08A',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});
