/**
 * RepetitionTracker Component
 *
 * Visual tracker for 3-6-9 manifestation method showing completion circles.
 * Displays morning (3x), afternoon (6x), and evening (9x) repetitions.
 *
 * Features:
 * - Animated completion circles
 * - Haptic feedback on toggle
 * - Glowing active states
 * - Dark spiritual theme
 *
 * @example
 * ```tsx
 * <RepetitionTracker
 *   period="morning"
 *   count={3}
 *   completed={2}
 *   onToggle={(index) => handleToggle(index)}
 * />
 * ```
 */

import React, { useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Text } from '../Text';
import { colors, spacing, borderRadius, shadows } from '../../theme';

/**
 * Time period for manifestation practice
 */
export type RepetitionPeriod = 'morning' | 'afternoon' | 'evening';

/**
 * Period configuration with display info
 */
export interface PeriodConfig {
  label: string;
  icon: string;
  count: number;
  color: string;
  glowColor: string;
}

/**
 * Props for RepetitionTracker
 */
export interface RepetitionTrackerProps {
  /** Time period (morning=3, afternoon=6, evening=9) */
  period: RepetitionPeriod;
  /** Number of completed repetitions */
  completed: number;
  /** Callback when a repetition is toggled */
  onToggle: (index: number) => void;
  /** Whether the tracker is disabled */
  disabled?: boolean;
  /** Custom style */
  style?: ViewStyle;
  /** Test ID for E2E testing */
  testID?: string;
}

/**
 * Period configurations
 */
export const PERIOD_CONFIG: Record<RepetitionPeriod, PeriodConfig> = {
  morning: {
    label: 'Morning',
    icon: '\u2600', // Sun
    count: 3,
    color: colors.dark.accentGold,
    glowColor: 'rgba(201, 162, 39, 0.4)',
  },
  afternoon: {
    label: 'Afternoon',
    icon: '\u2601', // Cloud/Sky
    count: 6,
    color: colors.dark.accentTeal,
    glowColor: 'rgba(26, 95, 95, 0.4)',
  },
  evening: {
    label: 'Evening',
    icon: '\u263E', // Moon
    count: 9,
    color: colors.dark.accentPurple,
    glowColor: 'rgba(74, 26, 107, 0.4)',
  },
};

/**
 * Individual repetition circle component
 */
interface RepCircleProps {
  index: number;
  isCompleted: boolean;
  color: string;
  glowColor: string;
  onPress: () => void;
  disabled: boolean;
  testID?: string;
}

const RepCircle: React.FC<RepCircleProps> = ({
  index,
  isCompleted,
  color,
  glowColor,
  onPress,
  disabled,
  testID,
}) => {
  const handlePress = useCallback(() => {
    if (!disabled) {
      Haptics.impactAsync(
        isCompleted
          ? Haptics.ImpactFeedbackStyle.Light
          : Haptics.ImpactFeedbackStyle.Medium
      );
      onPress();
    }
  }, [disabled, isCompleted, onPress]);

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: isCompleted, disabled }}
      accessibilityLabel={`Repetition ${index + 1}`}
      accessibilityHint={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
      testID={testID}
    >
      <View
        style={[
          styles.circle,
          isCompleted && { backgroundColor: color, borderColor: color },
          isCompleted && { shadowColor: glowColor },
          disabled && styles.circleDisabled,
        ]}
      >
        {isCompleted && (
          <Text style={styles.checkmark}>{'\u2713'}</Text>
        )}
        {!isCompleted && (
          <Text style={[styles.circleNumber, { color: colors.dark.textTertiary }]}>
            {index + 1}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

/**
 * RepetitionTracker Component
 */
export const RepetitionTracker: React.FC<RepetitionTrackerProps> = ({
  period,
  completed,
  onToggle,
  disabled = false,
  style,
  testID,
}) => {
  const config = PERIOD_CONFIG[period];
  const circles = Array.from({ length: config.count }, (_, i) => i);
  const isComplete = completed >= config.count;

  return (
    <View
      style={[styles.container, style]}
      accessibilityRole="none"
      accessibilityLabel={`${config.label} repetitions: ${completed} of ${config.count} completed`}
      testID={testID}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.periodIcon}>{config.icon}</Text>
        <Text style={styles.periodLabel}>{config.label}</Text>
        <View style={[styles.countBadge, { backgroundColor: `${config.color}20` }]}>
          <Text style={[styles.countText, { color: config.color }]}>
            {completed}/{config.count}
          </Text>
        </View>
      </View>

      {/* Progress Text */}
      <Text style={styles.instruction}>
        Write your manifestation {config.count} times
      </Text>

      {/* Circles Grid */}
      <View style={styles.circlesContainer}>
        {circles.map((_, index) => (
          <RepCircle
            key={index}
            index={index}
            isCompleted={index < completed}
            color={config.color}
            glowColor={config.glowColor}
            onPress={() => onToggle(index)}
            disabled={disabled}
            testID={testID ? `${testID}-circle-${index}` : undefined}
          />
        ))}
      </View>

      {/* Completion Message */}
      {isComplete && (
        <View style={styles.completeContainer}>
          <Text style={[styles.completeText, { color: config.color }]}>
            {'\u2728'} {config.label} practice complete! {'\u2728'}
          </Text>
        </View>
      )}
    </View>
  );
};

/**
 * Styles
 */
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.dark.bgElevated,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.sm,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },

  periodIcon: {
    fontSize: 20,
    marginRight: spacing.sm,
  },

  periodLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.dark.textPrimary,
    flex: 1,
  },

  countBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: borderRadius.full,
  },

  countText: {
    fontSize: 12,
    fontWeight: '700',
  },

  instruction: {
    fontSize: 13,
    color: colors.dark.textSecondary,
    marginBottom: spacing.md,
  },

  circlesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: spacing.sm,
  },

  circle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: colors.dark.textTertiary,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 4,
  },

  circleDisabled: {
    opacity: 0.5,
  },

  circleNumber: {
    fontSize: 14,
    fontWeight: '600',
  },

  checkmark: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.dark.bgPrimary,
  },

  completeContainer: {
    marginTop: spacing.md,
    alignItems: 'center',
  },

  completeText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default RepetitionTracker;
