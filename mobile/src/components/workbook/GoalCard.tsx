/**
 * GoalCard Component
 *
 * Displays a SMART goal with status badge, category, and action buttons.
 * Features touch feedback with haptics and smooth animations.
 *
 * @example
 * ```tsx
 * <GoalCard
 *   goal={goal}
 *   onPress={() => editGoal(goal.id)}
 *   onDelete={() => deleteGoal(goal.id)}
 *   onStatusChange={(status) => updateStatus(goal.id, status)}
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
 * Goal categories with their colors
 */
export const CATEGORY_COLORS: Record<GoalCategory, string> = {
  personal: '#9333ea',     // Purple
  professional: '#2563eb', // Blue
  health: '#16a34a',       // Green
  financial: '#d97706',    // Amber
  relationship: '#db2777', // Pink
};

/**
 * Category display names
 */
export const CATEGORY_NAMES: Record<GoalCategory, string> = {
  personal: 'Personal',
  professional: 'Professional',
  health: 'Health',
  financial: 'Financial',
  relationship: 'Relationship',
};

/**
 * Status display configuration
 */
const STATUS_CONFIG = {
  not_started: {
    label: 'Not Started',
    color: colors.dark.textTertiary,
    bgColor: `${colors.dark.textTertiary}30`,
  },
  in_progress: {
    label: 'In Progress',
    color: colors.dark.accentTeal,
    bgColor: `${colors.dark.accentTeal}30`,
  },
  completed: {
    label: 'Completed',
    color: colors.dark.accentGreen,
    bgColor: `${colors.dark.accentGreen}30`,
  },
};

/**
 * Goal category type
 */
export type GoalCategory = 'personal' | 'professional' | 'health' | 'financial' | 'relationship';

/**
 * Goal status type
 */
export type GoalStatus = 'not_started' | 'in_progress' | 'completed';

/**
 * SMART Goal data structure
 */
export interface SMARTGoal {
  id: string;
  title: string;
  category: GoalCategory;
  specific: string;
  measurable: string;
  achievable: string;
  relevant: string;
  timeBound: string; // ISO date string
  status: GoalStatus;
  createdAt: string;
  updatedAt: string;
}

/**
 * Props for GoalCard component
 */
export interface GoalCardProps {
  /** The SMART goal to display */
  goal: SMARTGoal;

  /** Called when card is pressed */
  onPress: () => void;

  /** Called when delete is confirmed */
  onDelete: () => void;

  /** Called when status changes */
  onStatusChange: (status: GoalStatus) => void;

  /** Test ID for automation */
  testID?: string;
}

/**
 * GoalCard Component
 */
export const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  onPress,
  onDelete,
  onStatusChange,
  testID,
}) => {
  const categoryColor = CATEGORY_COLORS[goal.category];
  const statusConfig = STATUS_CONFIG[goal.status];

  /**
   * Handle card press with haptic feedback
   */
  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  }, [onPress]);

  /**
   * Handle delete with confirmation
   */
  const handleDelete = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'Delete Goal',
      `Are you sure you want to delete "${goal.title}"?`,
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
  }, [goal.title, onDelete]);

  /**
   * Cycle through statuses
   */
  const handleStatusCycle = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const statusOrder: GoalStatus[] = ['not_started', 'in_progress', 'completed'];
    const currentIndex = statusOrder.indexOf(goal.status);
    const nextIndex = (currentIndex + 1) % statusOrder.length;
    onStatusChange(statusOrder[nextIndex]);
  }, [goal.status, onStatusChange]);

  /**
   * Format deadline date
   */
  const formatDeadline = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays < 0) {
        return 'Overdue';
      } else if (diffDays === 0) {
        return 'Due today';
      } else if (diffDays === 1) {
        return 'Due tomorrow';
      } else if (diffDays <= 7) {
        return `${diffDays} days left`;
      } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }
    } catch {
      return 'No deadline';
    }
  };

  const deadlineText = formatDeadline(goal.timeBound);
  const isOverdue = deadlineText === 'Overdue' && goal.status !== 'completed';

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { borderLeftColor: categoryColor },
      ]}
      onPress={handlePress}
      onLongPress={handleDelete}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`${goal.title}, ${CATEGORY_NAMES[goal.category]}, ${statusConfig.label}`}
      accessibilityHint="Tap to edit, long press to delete"
      testID={testID}
    >
      {/* Header Row */}
      <View style={styles.header}>
        {/* Category Badge */}
        <View style={[styles.categoryBadge, { backgroundColor: `${categoryColor}30` }]}>
          <Text style={[styles.categoryText, { color: categoryColor }]}>
            {CATEGORY_NAMES[goal.category]}
          </Text>
        </View>

        {/* Status Badge - Tappable */}
        <TouchableOpacity
          style={[styles.statusBadge, { backgroundColor: statusConfig.bgColor }]}
          onPress={handleStatusCycle}
          accessibilityRole="button"
          accessibilityLabel={`Status: ${statusConfig.label}. Tap to change`}
          testID={`${testID}-status`}
        >
          <Text style={[styles.statusText, { color: statusConfig.color }]}>
            {statusConfig.label}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Title */}
      <Text style={styles.title} numberOfLines={2}>
        {goal.title}
      </Text>

      {/* Specific preview */}
      {goal.specific && (
        <Text style={styles.preview} numberOfLines={2}>
          {goal.specific}
        </Text>
      )}

      {/* Footer Row */}
      <View style={styles.footer}>
        {/* Deadline */}
        <View style={styles.deadlineContainer}>
          <Text style={styles.deadlineIcon}>{'\u23F0'}</Text>
          <Text style={[styles.deadlineText, isOverdue && styles.overdueText]}>
            {deadlineText}
          </Text>
        </View>

        {/* SMART Progress */}
        <View style={styles.smartProgress}>
          {['S', 'M', 'A', 'R', 'T'].map((letter, index) => {
            const fields = ['specific', 'measurable', 'achievable', 'relevant', 'timeBound'];
            const isFilled = Boolean(goal[fields[index] as keyof SMARTGoal]);
            return (
              <View
                key={letter}
                style={[
                  styles.smartDot,
                  isFilled && { backgroundColor: categoryColor },
                ]}
              >
                <Text style={[
                  styles.smartLetter,
                  isFilled && styles.smartLetterFilled,
                ]}>
                  {letter}
                </Text>
              </View>
            );
          })}
        </View>
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
    borderLeftWidth: 4,
    ...shadows.sm,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },

  categoryBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },

  categoryText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },

  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.dark.textPrimary,
    marginBottom: spacing.xs,
    lineHeight: 24,
  },

  preview: {
    fontSize: 14,
    color: colors.dark.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: `${colors.dark.textTertiary}20`,
  },

  deadlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  deadlineIcon: {
    fontSize: 12,
    marginRight: spacing.xs,
  },

  deadlineText: {
    fontSize: 12,
    color: colors.dark.textTertiary,
  },

  overdueText: {
    color: colors.error[500],
    fontWeight: '600',
  },

  smartProgress: {
    flexDirection: 'row',
    gap: 4,
  },

  smartDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: `${colors.dark.textTertiary}30`,
    justifyContent: 'center',
    alignItems: 'center',
  },

  smartLetter: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.dark.textTertiary,
  },

  smartLetterFilled: {
    color: colors.dark.textPrimary,
  },
});

export default GoalCard;
