/**
 * TimelineBar Component
 *
 * Individual goal bar for the Gantt-style timeline.
 * Displays a colored horizontal bar representing a goal's duration.
 *
 * Features:
 * - Category color-coded background
 * - Gradient effect for depth
 * - Status indicator (border styling)
 * - Tap interaction for details
 * - Accessible touch target
 */

import React, { useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import type { TimelineGoal } from '../../screens/workbook/Phase3/TimelineScreen';

// Design colors
const COLORS = {
  textPrimary: '#e8e8e8',
  statusCompleted: '#2d5a4a',
  statusOverdue: '#6b2d3d',
  statusInProgress: 'transparent',
  statusNotStarted: 'rgba(255, 255, 255, 0.1)',
};

interface TimelineBarProps {
  goal: TimelineGoal;
  width: number;
  height: number;
  onPress: () => void;
}

/**
 * Get border style based on goal status
 */
const getStatusBorderStyle = (status: TimelineGoal['status']) => {
  switch (status) {
    case 'completed':
      return {
        borderWidth: 2,
        borderColor: COLORS.statusCompleted,
      };
    case 'overdue':
      return {
        borderWidth: 2,
        borderColor: COLORS.statusOverdue,
        borderStyle: 'dashed' as const,
      };
    case 'in_progress':
      return {
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
      };
    default:
      return {
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
      };
  }
};

/**
 * TimelineBar Component
 */
export const TimelineBar: React.FC<TimelineBarProps> = ({
  goal,
  width,
  height,
  onPress,
}) => {
  const animatedScale = React.useRef(new Animated.Value(1)).current;

  /**
   * Handle press in - scale down
   */
  const handlePressIn = useCallback(() => {
    Animated.spring(animatedScale, {
      toValue: 0.95,
      useNativeDriver: true,
      friction: 8,
    }).start();
  }, [animatedScale]);

  /**
   * Handle press out - scale back
   */
  const handlePressOut = useCallback(() => {
    Animated.spring(animatedScale, {
      toValue: 1,
      useNativeDriver: true,
      friction: 8,
    }).start();
  }, [animatedScale]);

  /**
   * Handle press - trigger callback with haptic
   */
  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  }, [onPress]);

  const statusBorderStyle = getStatusBorderStyle(goal.status);

  return (
    <TouchableOpacity
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
      accessibilityRole="button"
      accessibilityLabel={`Goal: ${goal.title}, ${goal.category}, ${goal.status.replace('_', ' ')}`}
      accessibilityHint="Tap to view goal details"
    >
      <Animated.View
        style={[
          styles.container,
          {
            width,
            height,
            backgroundColor: goal.color,
            transform: [{ scale: animatedScale }],
          },
          statusBorderStyle,
        ]}
      >
        {/* Gradient overlay for depth */}
        <View style={styles.gradientOverlay} />

        {/* Status indicator dot */}
        {goal.status === 'completed' && (
          <View style={styles.completedIndicator}>
            <View style={styles.checkmark} />
          </View>
        )}

        {goal.status === 'overdue' && (
          <View style={styles.overdueIndicator}>
            <View style={styles.exclamation} />
          </View>
        )}

        {/* Progress indicator for in_progress goals */}
        {goal.status === 'in_progress' && (
          <View style={styles.progressIndicator}>
            <View
              style={[
                styles.progressDot,
                { backgroundColor: 'rgba(255, 255, 255, 0.8)' },
              ]}
            />
          </View>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 6,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 8,
    // Shadow for depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },

  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    // Simulate gradient with semi-transparent overlay
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
  },

  // Completed status indicator
  completedIndicator: {
    position: 'absolute',
    right: 6,
    top: '50%',
    marginTop: -6,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.statusCompleted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    width: 6,
    height: 3,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: COLORS.textPrimary,
    transform: [{ rotate: '-45deg' }, { translateY: -1 }],
  },

  // Overdue status indicator
  overdueIndicator: {
    position: 'absolute',
    right: 6,
    top: '50%',
    marginTop: -6,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.statusOverdue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exclamation: {
    width: 2,
    height: 6,
    backgroundColor: COLORS.textPrimary,
    borderRadius: 1,
  },

  // In progress indicator
  progressIndicator: {
    position: 'absolute',
    right: 6,
    top: '50%',
    marginTop: -4,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

export default TimelineBar;
