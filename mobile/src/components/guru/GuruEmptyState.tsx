/**
 * GuruEmptyState Component
 *
 * Displayed when user has no completed phases.
 * Encourages user to complete their first phase to unlock Guru insights.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, shadows, borderRadius } from '../../theme';

/**
 * Guru Empty State Component
 *
 * Shows when user has completed 0 phases.
 * Provides encouragement and CTA to go to Workbook.
 *
 * @example
 * ```tsx
 * {completedPhases.length === 0 && <GuruEmptyState />}
 * ```
 */
export const GuruEmptyState: React.FC = () => {
  const navigation = useNavigation();

  const handleGoToWorkbook = () => {
    // Navigate to Workbook screen
    navigation.navigate('Workbook' as never);
  };

  return (
    <View style={styles.container}>
      {/* Icon */}
      <View style={styles.iconContainer}>
        <View style={styles.iconCircle}>
          <Ionicons name="book-outline" size={48} color={colors.dark.accentGold} />
        </View>
      </View>

      {/* Title */}
      <Text style={styles.title}>Begin Your Journey</Text>

      {/* Description */}
      <Text style={styles.description}>
        Complete your first phase in the Workbook to unlock personalized insights
        from your Guru. Your journey to manifestation starts with self-discovery.
      </Text>

      {/* Encouragement */}
      <View style={styles.encouragementBox}>
        <Ionicons name="star" size={20} color={colors.brand.amber} />
        <Text style={styles.encouragementText}>
          Every master was once a beginner. Take the first step today.
        </Text>
      </View>

      {/* CTA Button */}
      <TouchableOpacity
        style={styles.ctaButton}
        onPress={handleGoToWorkbook}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="Go to Workbook to start your journey"
      >
        <Text style={styles.ctaButtonText}>Start with Phase 1</Text>
        <Ionicons
          name="arrow-forward"
          size={20}
          color={colors.background.primary}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
  },
  iconContainer: {
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
    fontSize: 24,
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
    marginBottom: spacing.xl,
  },
  encouragementBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.background.elevated,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border.gold,
    marginBottom: spacing.xl,
    ...shadows.sm,
  },
  encouragementText: {
    flex: 1,
    fontSize: 14,
    color: colors.brand.amber,
    fontStyle: 'italic',
    fontWeight: '500',
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.dark.accentGold,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    ...shadows.md,
  },
  ctaButtonText: {
    color: colors.background.primary,
    fontSize: 16,
    fontWeight: '700',
  },
});

export default GuruEmptyState;
