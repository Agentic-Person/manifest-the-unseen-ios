/**
 * RoutineItem Component
 *
 * Self-care activity item with checkbox, time estimate, and reorder controls.
 * Used in morning and evening routine builders for Phase 5.
 *
 * Design: Dark spiritual theme with nurturing accents
 */

import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import * as Haptics from 'expo-haptics';

// Design system colors from APP-DESIGN.md
const DESIGN_COLORS = {
  bgPrimary: '#1a1a2e',
  bgSecondary: '#16213e',
  bgElevated: '#252547',
  textPrimary: '#e8e8e8',
  textSecondary: '#a0a0b0',
  textTertiary: '#6b6b80',
  accentPurple: '#4a1a6b',
  accentGold: '#c9a227',
  accentTeal: '#1a5f5f',
  accentGreen: '#2d5a4a',
  accentRose: '#8b3a5f',
  border: '#3a3a5a',
  success: '#2d5a4a',
  error: '#dc2626',
};

/**
 * Activity icon mapping
 */
const ACTIVITY_ICONS: Record<string, string> = {
  meditation: '\u{1F9D8}', // Person in lotus position
  journaling: '\u{1F4DD}', // Memo
  exercise: '\u{1F3CB}',   // Person lifting weights
  skincare: '\u{2728}',    // Sparkles
  reading: '\u{1F4DA}',    // Books
  stretching: '\u{1F9D8}', // Yoga
  hydration: '\u{1F4A7}',  // Droplet
  gratitude: '\u{1F64F}',  // Folded hands
  affirmations: '\u{1F4AB}', // Dizzy
  breathing: '\u{1F32C}',  // Wind face
  walking: '\u{1F6B6}',    // Person walking
  sleep: '\u{1F319}',      // Crescent moon
  tea: '\u{1F375}',        // Teacup
  music: '\u{1F3B5}',      // Musical note
  custom: '\u{2B50}',      // Star
};

/**
 * RoutineActivity data interface
 */
export interface RoutineActivityData {
  id: string;
  name: string;
  duration: number; // in minutes
  icon: string;
  completed: boolean;
  order: number;
  isCustom: boolean;
  routineType: 'morning' | 'evening';
  createdAt: string;
  updatedAt: string;
}

/**
 * RoutineItem component props
 */
export interface RoutineItemProps {
  activity: RoutineActivityData;
  index: number;
  totalItems: number;
  onToggleComplete: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit?: (activity: RoutineActivityData) => void;
}

/**
 * Format duration for display
 */
const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

/**
 * RoutineItem Component
 */
const RoutineItem: React.FC<RoutineItemProps> = ({
  activity,
  index,
  totalItems,
  onToggleComplete,
  onMoveUp,
  onMoveDown,
  onDelete,
  onEdit,
}) => {
  const isFirst = index === 0;
  const isLast = index === totalItems - 1;

  /**
   * Handle checkbox toggle
   */
  const handleToggle = useCallback(() => {
    Haptics.impactAsync(
      activity.completed
        ? Haptics.ImpactFeedbackStyle.Light
        : Haptics.ImpactFeedbackStyle.Medium
    );
    onToggleComplete(activity.id);
  }, [activity.id, activity.completed, onToggleComplete]);

  /**
   * Handle move up
   */
  const handleMoveUp = useCallback(() => {
    if (!isFirst) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onMoveUp(activity.id);
    }
  }, [activity.id, isFirst, onMoveUp]);

  /**
   * Handle move down
   */
  const handleMoveDown = useCallback(() => {
    if (!isLast) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onMoveDown(activity.id);
    }
  }, [activity.id, isLast, onMoveDown]);

  /**
   * Handle delete
   */
  const handleDelete = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    onDelete(activity.id);
  }, [activity.id, onDelete]);

  /**
   * Handle edit
   */
  const handleEdit = useCallback(() => {
    if (onEdit) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onEdit(activity);
    }
  }, [activity, onEdit]);

  // Get icon for activity
  const icon = ACTIVITY_ICONS[activity.icon] || ACTIVITY_ICONS.custom;

  return (
    <View
      style={[styles.container, activity.completed && styles.containerCompleted]}
      testID={`routine-item-${activity.id}`}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: activity.completed }}
      accessibilityLabel={`${activity.name}, ${formatDuration(activity.duration)}${activity.completed ? ', completed' : ''}`}
    >
      {/* Checkbox */}
      <Pressable
        style={({ pressed }) => [
          styles.checkbox,
          activity.completed && styles.checkboxChecked,
          pressed && styles.checkboxPressed,
        ]}
        onPress={handleToggle}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: activity.completed }}
        accessibilityLabel={activity.completed ? 'Mark as incomplete' : 'Mark as complete'}
        testID={`routine-checkbox-${activity.id}`}
      >
        {activity.completed && <Text style={styles.checkmark}>{'\u2713'}</Text>}
      </Pressable>

      {/* Activity Icon */}
      <View style={styles.iconContainer}>
        <Text style={styles.activityIcon}>{icon}</Text>
      </View>

      {/* Activity Info */}
      <Pressable
        style={styles.activityInfo}
        onPress={handleEdit}
        disabled={!onEdit}
        accessibilityRole={onEdit ? 'button' : 'text'}
        accessibilityLabel={onEdit ? `Edit ${activity.name}` : activity.name}
      >
        <Text
          style={[styles.activityName, activity.completed && styles.activityNameCompleted]}
          numberOfLines={1}
        >
          {activity.name}
        </Text>
        <View style={styles.activityMeta}>
          <Text style={styles.duration}>{formatDuration(activity.duration)}</Text>
          {activity.isCustom && <Text style={styles.customLabel}>Custom</Text>}
        </View>
      </Pressable>

      {/* Reorder Buttons */}
      <View style={styles.reorderButtons}>
        <TouchableOpacity
          style={[styles.reorderButton, isFirst && styles.reorderButtonDisabled]}
          onPress={handleMoveUp}
          disabled={isFirst}
          accessibilityRole="button"
          accessibilityLabel="Move activity up"
          accessibilityHint={isFirst ? 'Cannot move first item up' : 'Moves this activity up in the routine'}
          testID={`routine-move-up-${activity.id}`}
        >
          <Text
            style={[styles.reorderButtonText, isFirst && styles.reorderButtonTextDisabled]}
          >
            {'\u2191'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.reorderButton, isLast && styles.reorderButtonDisabled]}
          onPress={handleMoveDown}
          disabled={isLast}
          accessibilityRole="button"
          accessibilityLabel="Move activity down"
          accessibilityHint={isLast ? 'Cannot move last item down' : 'Moves this activity down in the routine'}
          testID={`routine-move-down-${activity.id}`}
        >
          <Text
            style={[styles.reorderButtonText, isLast && styles.reorderButtonTextDisabled]}
          >
            {'\u2193'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Delete Button */}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={handleDelete}
        accessibilityRole="button"
        accessibilityLabel="Delete activity"
        accessibilityHint="Removes this activity from the routine"
        testID={`routine-delete-${activity.id}`}
      >
        <Text style={styles.deleteButtonText}>{'\u00D7'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DESIGN_COLORS.bgElevated,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
  },
  containerCompleted: {
    backgroundColor: 'rgba(45, 90, 74, 0.2)',
    borderColor: DESIGN_COLORS.accentGreen,
  },

  // Checkbox
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: DESIGN_COLORS.textTertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: DESIGN_COLORS.accentGreen,
    borderColor: DESIGN_COLORS.accentGreen,
  },
  checkboxPressed: {
    opacity: 0.7,
  },
  checkmark: {
    color: DESIGN_COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },

  // Icon
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: DESIGN_COLORS.bgSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityIcon: {
    fontSize: 18,
  },

  // Activity info
  activityInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  activityName: {
    fontSize: 15,
    fontWeight: '600',
    color: DESIGN_COLORS.textPrimary,
    marginBottom: 2,
  },
  activityNameCompleted: {
    textDecorationLine: 'line-through',
    color: DESIGN_COLORS.textSecondary,
  },
  activityMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  duration: {
    fontSize: 12,
    color: DESIGN_COLORS.textSecondary,
  },
  customLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: DESIGN_COLORS.accentGold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Reorder buttons
  reorderButtons: {
    flexDirection: 'column',
    marginLeft: 8,
    marginRight: 4,
  },
  reorderButton: {
    width: 26,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: DESIGN_COLORS.bgSecondary,
    borderRadius: 4,
    marginVertical: 1,
  },
  reorderButtonDisabled: {
    opacity: 0.3,
  },
  reorderButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: DESIGN_COLORS.accentGold,
  },
  reorderButtonTextDisabled: {
    color: DESIGN_COLORS.textTertiary,
  },

  // Delete button
  deleteButton: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(220, 38, 38, 0.2)',
    borderRadius: 8,
    marginLeft: 4,
  },
  deleteButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: DESIGN_COLORS.error,
  },
});

export default RoutineItem;

export { ACTIVITY_ICONS };
