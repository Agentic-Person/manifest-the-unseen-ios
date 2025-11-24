/**
 * BeliefCard Component
 *
 * Three-column cognitive restructuring card for Phase 4.
 * Displays: Limiting Belief -> Evidence Against -> New Empowering Belief
 *
 * Features:
 * - Visual transformation flow (arrow indicators)
 * - Color-coded sections (negative -> neutral -> positive)
 * - Edit and delete actions
 * - Completion status indicator
 * - Haptic feedback on interactions
 * - Dark spiritual theme
 *
 * @example
 * ```tsx
 * <BeliefCard
 *   belief={belief}
 *   onEdit={() => editBelief(belief.id)}
 *   onDelete={() => deleteBelief(belief.id)}
 * />
 * ```
 */

import React, { useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Text } from '../Text';
import { colors, spacing, borderRadius, shadows } from '../../theme';

/**
 * Limiting belief data structure
 */
export interface LimitingBelief {
  id: string;
  limitingBelief: string;
  evidenceAgainst: string;
  newBelief: string;
  isComplete: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Props for BeliefCard component
 */
export interface BeliefCardProps {
  /** The belief to display */
  belief: LimitingBelief;

  /** Called when edit is pressed */
  onEdit: () => void;

  /** Called when delete is confirmed */
  onDelete: () => void;

  /** Test ID for automation */
  testID?: string;
}

/**
 * BeliefCard Component
 */
export const BeliefCard: React.FC<BeliefCardProps> = ({
  belief,
  onEdit,
  onDelete,
  testID,
}) => {
  const isComplete = Boolean(belief.limitingBelief && belief.evidenceAgainst && belief.newBelief);

  /**
   * Handle card press with haptic feedback
   */
  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onEdit();
  }, [onEdit]);

  /**
   * Handle delete with confirmation
   */
  const handleDelete = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'Delete Belief',
      'Are you sure you want to remove this belief restructuring?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            onDelete();
          },
        },
      ]
    );
  }, [onDelete]);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      onLongPress={handleDelete}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`Belief restructuring: ${belief.limitingBelief}`}
      accessibilityHint="Tap to edit, long press to delete"
      testID={testID}
    >
      {/* Header Row */}
      <View style={styles.header}>
        {/* Completion Badge */}
        <View style={[
          styles.statusBadge,
          isComplete ? styles.statusComplete : styles.statusIncomplete,
        ]}>
          <Text style={[
            styles.statusText,
            isComplete ? styles.statusTextComplete : styles.statusTextIncomplete,
          ]}>
            {isComplete ? '\u2713 Restructured' : 'In Progress'}
          </Text>
        </View>

        {/* Delete Button */}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
          accessibilityRole="button"
          accessibilityLabel="Delete belief"
          testID={`${testID}-delete`}
        >
          <Text style={styles.deleteIcon}>{'\u00D7'}</Text>
        </TouchableOpacity>
      </View>

      {/* Three Column Layout */}
      <View style={styles.columns}>
        {/* Column 1: Limiting Belief */}
        <View style={[styles.column, styles.columnNegative]}>
          <View style={styles.columnHeader}>
            <Text style={styles.columnIcon}>{'\uD83D\uDEAB'}</Text>
            <Text style={styles.columnTitle}>Limiting Belief</Text>
          </View>
          <Text style={styles.columnContent} numberOfLines={4}>
            {belief.limitingBelief || 'Tap to add...'}
          </Text>
        </View>

        {/* Arrow 1 */}
        <View style={styles.arrowContainer}>
          <Text style={styles.arrow}>{'\u2192'}</Text>
        </View>

        {/* Column 2: Evidence Against */}
        <View style={[styles.column, styles.columnNeutral]}>
          <View style={styles.columnHeader}>
            <Text style={styles.columnIcon}>{'\uD83D\uDD0D'}</Text>
            <Text style={styles.columnTitle}>Evidence Against</Text>
          </View>
          <Text style={styles.columnContent} numberOfLines={4}>
            {belief.evidenceAgainst || 'Tap to add...'}
          </Text>
        </View>

        {/* Arrow 2 */}
        <View style={styles.arrowContainer}>
          <Text style={styles.arrow}>{'\u2192'}</Text>
        </View>

        {/* Column 3: New Empowering Belief */}
        <View style={[styles.column, styles.columnPositive]}>
          <View style={styles.columnHeader}>
            <Text style={styles.columnIcon}>{'\u2728'}</Text>
            <Text style={styles.columnTitle}>New Belief</Text>
          </View>
          <Text style={styles.columnContent} numberOfLines={4}>
            {belief.newBelief || 'Tap to add...'}
          </Text>
        </View>
      </View>

      {/* Transformation Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${(
                  (belief.limitingBelief ? 33 : 0) +
                  (belief.evidenceAgainst ? 33 : 0) +
                  (belief.newBelief ? 34 : 0)
                )}%`,
              },
            ]}
          />
        </View>
        <Text style={styles.progressLabel}>
          Transformation Progress
        </Text>
      </View>
    </TouchableOpacity>
  );
};

/**
 * Styles - Dark Spiritual Theme
 */
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.dark.bgElevated,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.sm,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },

  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },

  statusComplete: {
    backgroundColor: `${colors.dark.accentGreen}30`,
  },

  statusIncomplete: {
    backgroundColor: `${colors.dark.textTertiary}30`,
  },

  statusText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  statusTextComplete: {
    color: colors.dark.accentGreen,
  },

  statusTextIncomplete: {
    color: colors.dark.textTertiary,
  },

  deleteButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: `${colors.dark.textTertiary}20`,
    justifyContent: 'center',
    alignItems: 'center',
  },

  deleteIcon: {
    fontSize: 18,
    color: colors.dark.textTertiary,
    fontWeight: '300',
    lineHeight: 20,
  },

  columns: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },

  column: {
    flex: 1,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    minHeight: 100,
  },

  columnNegative: {
    backgroundColor: `${colors.error[600]}15`,
    borderWidth: 1,
    borderColor: `${colors.error[600]}30`,
  },

  columnNeutral: {
    backgroundColor: `${colors.dark.accentTeal}15`,
    borderWidth: 1,
    borderColor: `${colors.dark.accentTeal}30`,
  },

  columnPositive: {
    backgroundColor: `${colors.dark.accentGreen}15`,
    borderWidth: 1,
    borderColor: `${colors.dark.accentGreen}30`,
  },

  columnHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
    gap: 4,
  },

  columnIcon: {
    fontSize: 12,
  },

  columnTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.dark.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    flex: 1,
  },

  columnContent: {
    fontSize: 12,
    color: colors.dark.textPrimary,
    lineHeight: 18,
  },

  arrowContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    height: 100,
  },

  arrow: {
    fontSize: 16,
    color: colors.dark.accentGold,
    fontWeight: '700',
  },

  progressContainer: {
    alignItems: 'center',
  },

  progressTrack: {
    width: '100%',
    height: 4,
    backgroundColor: `${colors.dark.textTertiary}30`,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },

  progressFill: {
    height: '100%',
    backgroundColor: colors.dark.accentGold,
    borderRadius: 2,
  },

  progressLabel: {
    fontSize: 10,
    color: colors.dark.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

export default BeliefCard;
