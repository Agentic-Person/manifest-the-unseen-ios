/**
 * HabitSection Component
 *
 * A collapsible section for organizing habits by time of day (Morning, Afternoon, Evening).
 * Displays a header with icon, title, count, and expand/collapse functionality.
 * Contains a list of HabitEntry components when expanded.
 *
 * @example
 * ```tsx
 * <HabitSection
 *   title="Morning"
 *   icon="sunrise"
 *   habits={morningHabits}
 *   onAddHabit={handleAddMorningHabit}
 *   onEditHabit={handleEditHabit}
 *   onRemoveHabit={handleRemoveHabit}
 *   onCategoryChange={handleCategoryChange}
 * />
 * ```
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { Text } from '../Text';
import { colors, spacing, borderRadius, shadows } from '../../theme';
import HabitEntry, { HabitCategory } from './HabitEntry';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

/**
 * Time of day type
 */
export type TimeOfDay = 'morning' | 'afternoon' | 'evening';

/**
 * Habit data structure
 */
export interface Habit {
  id: string;
  habit: string;
  category: HabitCategory;
}

/**
 * Icon and color configuration for each time of day
 */
const TIME_CONFIG: Record<TimeOfDay, { icon: string; title: string; accentColor: string; bgColor: string }> = {
  morning: {
    icon: '🌅',
    title: 'Morning',
    accentColor: '#f59e0b', // Amber/sunrise color
    bgColor: 'rgba(245, 158, 11, 0.1)',
  },
  afternoon: {
    icon: '☀️',
    title: 'Afternoon',
    accentColor: '#f97316', // Orange/midday color
    bgColor: 'rgba(249, 115, 22, 0.1)',
  },
  evening: {
    icon: '🌙',
    title: 'Evening',
    accentColor: '#6366f1', // Indigo/night color
    bgColor: 'rgba(99, 102, 241, 0.1)',
  },
};

/**
 * Props for the HabitSection component
 */
export interface HabitSectionProps {
  /** Time of day for this section */
  timeOfDay: TimeOfDay;

  /** Array of habits for this time period */
  habits: Habit[];

  /** Callback when a new habit is added */
  onAddHabit: (timeOfDay: TimeOfDay) => void;

  /** Callback when a habit text is edited */
  onEditHabit: (timeOfDay: TimeOfDay, habitId: string, newText: string) => void;

  /** Callback when a habit is removed */
  onRemoveHabit: (timeOfDay: TimeOfDay, habitId: string) => void;

  /** Callback when a habit's category changes */
  onCategoryChange: (timeOfDay: TimeOfDay, habitId: string, category: HabitCategory) => void;

  /** Whether the section is initially expanded */
  initialExpanded?: boolean;

  /** Test ID for automation */
  testID?: string;
}

/**
 * HabitSection Component
 */
export const HabitSection: React.FC<HabitSectionProps> = ({
  timeOfDay,
  habits,
  onAddHabit,
  onEditHabit,
  onRemoveHabit,
  onCategoryChange,
  initialExpanded = true,
  testID,
}) => {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const config = TIME_CONFIG[timeOfDay];

  // Calculate category counts
  const positiveCount = habits.filter(h => h.category === 'positive').length;
  const negativeCount = habits.filter(h => h.category === 'negative').length;
  const neutralCount = habits.filter(h => h.category === 'neutral').length;

  /**
   * Toggle expand/collapse with animation
   */
  const toggleExpand = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(prev => !prev);
  }, []);

  /**
   * Handle add habit button press
   */
  const handleAddHabit = useCallback(() => {
    onAddHabit(timeOfDay);
  }, [onAddHabit, timeOfDay]);

  /**
   * Handle habit text edit
   */
  const handleEditHabit = useCallback((habitId: string, newText: string) => {
    onEditHabit(timeOfDay, habitId, newText);
  }, [onEditHabit, timeOfDay]);

  /**
   * Handle habit removal
   */
  const handleRemoveHabit = useCallback((habitId: string) => {
    onRemoveHabit(timeOfDay, habitId);
  }, [onRemoveHabit, timeOfDay]);

  /**
   * Handle category change
   */
  const handleCategoryChange = useCallback((habitId: string, category: HabitCategory) => {
    onCategoryChange(timeOfDay, habitId, category);
  }, [onCategoryChange, timeOfDay]);

  return (
    <View style={styles.container} testID={testID}>
      {/* Section Header */}
      <TouchableOpacity
        style={[
          styles.header,
          { backgroundColor: config.bgColor },
        ]}
        onPress={toggleExpand}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityState={{ expanded: isExpanded }}
        accessibilityLabel={`${config.title} habits section, ${habits.length} habits`}
        accessibilityHint={isExpanded ? 'Double tap to collapse' : 'Double tap to expand'}
      >
        <View style={styles.headerLeft}>
          <View style={[styles.iconContainer, { backgroundColor: config.accentColor }]}>
            <Text style={styles.icon}>{config.icon}</Text>
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{config.title}</Text>
            <Text style={styles.habitCount}>
              {habits.length} {habits.length === 1 ? 'habit' : 'habits'}
            </Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          {/* Mini category counts */}
          {habits.length > 0 && (
            <View style={styles.miniCounts}>
              {positiveCount > 0 && (
                <View style={[styles.miniCountBadge, styles.miniPositive]}>
                  <Text style={styles.miniCountText}>+{positiveCount}</Text>
                </View>
              )}
              {negativeCount > 0 && (
                <View style={[styles.miniCountBadge, styles.miniNegative]}>
                  <Text style={styles.miniCountText}>-{negativeCount}</Text>
                </View>
              )}
              {neutralCount > 0 && (
                <View style={[styles.miniCountBadge, styles.miniNeutral]}>
                  <Text style={styles.miniCountText}>{neutralCount}</Text>
                </View>
              )}
            </View>
          )}

          {/* Expand/Collapse Chevron */}
          <Text style={[styles.chevron, isExpanded && styles.chevronExpanded]}>
            {isExpanded ? '▼' : '▶'}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Expanded Content */}
      {isExpanded && (
        <View style={styles.content}>
          {/* Habits List */}
          {habits.length > 0 ? (
            <View style={styles.habitsList}>
              {habits.map((habit) => (
                <HabitEntry
                  key={habit.id}
                  habitId={habit.id}
                  habitText={habit.habit}
                  category={habit.category}
                  onTextChange={(newText) => handleEditHabit(habit.id, newText)}
                  onCategoryChange={(category) => handleCategoryChange(habit.id, category)}
                  onRemove={() => handleRemoveHabit(habit.id)}
                  testID={`habit-entry-${habit.id}`}
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                No {config.title.toLowerCase()} habits yet
              </Text>
              <Text style={styles.emptySubtext}>
                Tap the button below to add your first habit
              </Text>
            </View>
          )}

          {/* Add Habit Button */}
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddHabit}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={`Add ${config.title.toLowerCase()} habit`}
          >
            <Text style={styles.addButtonIcon}>+</Text>
            <Text style={styles.addButtonText}>Add {config.title} Habit</Text>
          </TouchableOpacity>
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
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    overflow: 'hidden',
    ...shadows.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  icon: {
    fontSize: 22,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
  },
  habitCount: {
    fontSize: 13,
    color: colors.text.secondary,
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  miniCounts: {
    flexDirection: 'row',
    marginRight: spacing.sm,
    gap: 4,
  },
  miniCountBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  miniPositive: {
    backgroundColor: 'rgba(45, 90, 74, 0.15)',
  },
  miniNegative: {
    backgroundColor: 'rgba(107, 45, 61, 0.15)',
  },
  miniNeutral: {
    backgroundColor: 'rgba(160, 160, 176, 0.15)',
  },
  miniCountText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  chevron: {
    fontSize: 12,
    color: colors.text.tertiary,
    marginLeft: spacing.xs,
  },
  chevronExpanded: {
    // Chevron rotation is handled by changing the character
  },
  content: {
    padding: spacing.md,
    paddingTop: 0,
  },
  habitsList: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  emptyText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  emptySubtext: {
    fontSize: 13,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.gray[100],
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderStyle: 'dashed',
  },
  addButtonIcon: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary[600],
    marginRight: spacing.xs,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary[600],
  },
});

export default HabitSection;
