/**
 * PhaseCard Component
 *
 * Displays a single phase card with completion status.
 * Shows completed phases with gold border and checkmark.
 * Shows locked phases with grey styling and lock icon.
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, shadows, borderRadius } from '../../theme';

interface PhaseCardProps {
  phaseNumber: number;
  phaseName: string;
  isCompleted: boolean;
  onPress?: () => void;
}

/**
 * Phase Card Component
 *
 * Renders a card for a single phase (1-10) with completion state.
 *
 * @example
 * ```tsx
 * <PhaseCard
 *   phaseNumber={1}
 *   phaseName="Self-Evaluation"
 *   isCompleted={true}
 *   onPress={() => handlePhaseSelect(1)}
 * />
 * ```
 */
export const PhaseCard: React.FC<PhaseCardProps> = ({
  phaseNumber,
  phaseName,
  isCompleted,
  onPress,
}) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        isCompleted ? styles.cardCompleted : styles.cardLocked,
        pressed && styles.cardPressed,
      ]}
      onPress={isCompleted ? onPress : undefined}
      disabled={!isCompleted}
      accessibilityRole="button"
      accessibilityLabel={
        isCompleted
          ? `Phase ${phaseNumber}: ${phaseName}. Analyze this phase.`
          : `Phase ${phaseNumber}: ${phaseName}. Complete this phase to unlock Guru insights.`
      }
      accessibilityState={{ disabled: !isCompleted }}
    >
      {/* Phase Number Badge */}
      <View
        style={[
          styles.badge,
          isCompleted ? styles.badgeCompleted : styles.badgeLocked,
        ]}
      >
        <Text
          style={[
            styles.badgeText,
            isCompleted ? styles.badgeTextCompleted : styles.badgeTextLocked,
          ]}
        >
          {phaseNumber}
        </Text>
      </View>

      {/* Phase Name */}
      <Text
        style={[
          styles.phaseName,
          isCompleted ? styles.phaseNameCompleted : styles.phaseNameLocked,
        ]}
        numberOfLines={2}
      >
        {phaseName}
      </Text>

      {/* Status Icon & Text */}
      <View style={styles.statusContainer}>
        {isCompleted ? (
          <>
            <Ionicons
              name="checkmark-circle"
              size={18}
              color={colors.dark.accentGold}
            />
            <Text style={styles.statusText}>Analyze</Text>
          </>
        ) : (
          <>
            <Ionicons name="lock-closed" size={16} color={colors.text.tertiary} />
            <Text style={styles.statusTextLocked}>Complete to unlock</Text>
          </>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 140,
    backgroundColor: colors.background.elevated,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginRight: spacing.sm,
    borderWidth: 2,
    ...shadows.sm,
  },
  cardCompleted: {
    borderColor: colors.dark.accentGold,
  },
  cardLocked: {
    borderColor: colors.border.disabled,
    opacity: 0.6,
  },
  cardPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.97 }],
  },
  badge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    borderWidth: 2,
  },
  badgeCompleted: {
    backgroundColor: `${colors.dark.accentGold}20`,
    borderColor: colors.dark.accentGold,
  },
  badgeLocked: {
    backgroundColor: colors.background.secondary,
    borderColor: colors.border.disabled,
  },
  badgeText: {
    fontSize: 18,
    fontWeight: '700',
  },
  badgeTextCompleted: {
    color: colors.dark.accentGold,
  },
  badgeTextLocked: {
    color: colors.text.tertiary,
  },
  phaseName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: spacing.sm,
    minHeight: 36,
    lineHeight: 18,
  },
  phaseNameCompleted: {
    color: colors.text.primary,
  },
  phaseNameLocked: {
    color: colors.text.secondary,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.dark.accentGold,
  },
  statusTextLocked: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.text.tertiary,
  },
});

export default PhaseCard;
