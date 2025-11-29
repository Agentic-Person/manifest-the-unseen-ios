/**
 * HabitEntry Component
 *
 * A single habit entry with editable text and category selector.
 * Displays the habit name with options to mark as Positive, Negative, or Neutral.
 * Used within HabitSection components.
 *
 * @example
 * ```tsx
 * <HabitEntry
 *   habitId="habit-1"
 *   habitText="Morning meditation"
 *   category="positive"
 *   onTextChange={(newText) => updateHabit(id, newText)}
 *   onCategoryChange={(category) => updateCategory(id, category)}
 *   onRemove={() => removeHabit(id)}
 * />
 * ```
 */

import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Keyboard,
} from 'react-native';
import { Text } from '../Text';
import { colors, spacing, borderRadius } from '../../theme';

/**
 * Habit category type
 */
export type HabitCategory = 'positive' | 'negative' | 'neutral';

/**
 * Category configuration with colors and labels
 */
const CATEGORY_CONFIG: Record<HabitCategory, {
  label: string;
  icon: string;
  color: string;
  bgColor: string;
  textColor: string;
}> = {
  positive: {
    label: 'Positive',
    icon: '+',
    color: '#2d5a4a', // Forest green from design spec
    bgColor: 'rgba(45, 90, 74, 0.15)',
    textColor: '#2d5a4a',
  },
  negative: {
    label: 'Negative',
    icon: '-',
    color: '#6b2d3d', // Burgundy from design spec
    bgColor: 'rgba(107, 45, 61, 0.15)',
    textColor: '#6b2d3d',
  },
  neutral: {
    label: 'Neutral',
    icon: '=',
    color: '#a0a0b0', // Gray from design spec
    bgColor: 'rgba(160, 160, 176, 0.15)',
    textColor: '#6b6b80',
  },
};

/**
 * Props for the HabitEntry component
 */
export interface HabitEntryProps {
  /** Unique identifier for the habit */
  habitId: string;

  /** The habit text */
  habitText: string;

  /** Current category of the habit */
  category: HabitCategory;

  /** Callback when habit text changes */
  onTextChange: (newText: string) => void;

  /** Callback when category changes */
  onCategoryChange: (category: HabitCategory) => void;

  /** Callback when habit is removed */
  onRemove: () => void;

  /** Whether the entry is in editing mode */
  isEditing?: boolean;

  /** Test ID for automation */
  testID?: string;
}

/**
 * HabitEntry Component
 */
export const HabitEntry: React.FC<HabitEntryProps> = ({
  habitId: _habitId, // Used for key prop by parent
  habitText,
  category,
  onTextChange,
  onCategoryChange,
  onRemove,
  isEditing: initialEditing = false,
  testID,
}) => {
  const [isEditing, setIsEditing] = useState(initialEditing || !habitText);
  const [localText, setLocalText] = useState(habitText);
  const inputRef = useRef<TextInput>(null);
  const config = CATEGORY_CONFIG[category];

  /**
   * Handle text input submission
   */
  const handleSubmitText = useCallback(() => {
    const trimmedText = localText.trim();
    if (trimmedText) {
      onTextChange(trimmedText);
      setIsEditing(false);
      Keyboard.dismiss();
    } else {
      // If empty, show confirmation to delete
      Alert.alert(
        'Delete Habit?',
        'This habit has no text. Would you like to delete it?',
        [
          {
            text: 'Cancel',
            onPress: () => inputRef.current?.focus(),
            style: 'cancel',
          },
          {
            text: 'Delete',
            onPress: onRemove,
            style: 'destructive',
          },
        ]
      );
    }
  }, [localText, onTextChange, onRemove]);

  /**
   * Handle text editing start
   */
  const handleStartEditing = useCallback(() => {
    setIsEditing(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  /**
   * Handle category button press
   */
  const handleCategoryPress = useCallback((newCategory: HabitCategory) => {
    onCategoryChange(newCategory);
  }, [onCategoryChange]);

  /**
   * Handle remove with confirmation
   */
  const handleRemove = useCallback(() => {
    Alert.alert(
      'Delete Habit',
      `Are you sure you want to delete "${habitText || 'this habit'}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: onRemove, style: 'destructive' },
      ]
    );
  }, [habitText, onRemove]);

  return (
    <View
      style={[
        styles.container,
        { borderLeftColor: config.color },
      ]}
      testID={testID}
    >
      {/* Main Content Row */}
      <View style={styles.mainRow}>
        {/* Habit Text / Input */}
        <View style={styles.textContainer}>
          {isEditing ? (
            <TextInput
              ref={inputRef}
              style={styles.input}
              value={localText}
              onChangeText={setLocalText}
              onBlur={handleSubmitText}
              onSubmitEditing={handleSubmitText}
              placeholder="Enter habit..."
              placeholderTextColor={colors.text.tertiary}
              returnKeyType="done"
              autoFocus={!habitText}
              accessibilityLabel="Habit text input"
              accessibilityHint="Enter your habit description"
            />
          ) : (
            <TouchableOpacity
              style={styles.textTouchable}
              onPress={handleStartEditing}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={habitText}
              accessibilityHint="Double tap to edit"
            >
              <Text style={styles.habitText} numberOfLines={2}>
                {habitText}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Delete Button */}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleRemove}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityRole="button"
          accessibilityLabel="Delete habit"
        >
          <Text style={styles.deleteIcon}>×</Text>
        </TouchableOpacity>
      </View>

      {/* Category Selector Row */}
      <View style={styles.categoryRow}>
        <Text style={styles.categoryLabel}>Category:</Text>
        <View style={styles.categoryButtons}>
          {(['positive', 'negative', 'neutral'] as HabitCategory[]).map((cat) => {
            const catConfig = CATEGORY_CONFIG[cat];
            const isActive = category === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryButton,
                  isActive && { backgroundColor: catConfig.bgColor, borderColor: catConfig.color },
                ]}
                onPress={() => handleCategoryPress(cat)}
                activeOpacity={0.7}
                accessibilityRole="radio"
                accessibilityState={{ checked: isActive }}
                accessibilityLabel={`${catConfig.label} category`}
              >
                <Text
                  style={[
                    styles.categoryButtonIcon,
                    { color: isActive ? catConfig.color : colors.text.tertiary },
                  ]}
                >
                  {catConfig.icon}
                </Text>
                <Text
                  style={[
                    styles.categoryButtonText,
                    { color: isActive ? catConfig.textColor : colors.text.tertiary },
                  ]}
                >
                  {catConfig.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};

/**
 * Styles
 */
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.elevated,
    borderRadius: borderRadius.md,
    borderLeftWidth: 4,
    padding: spacing.sm,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  textContainer: {
    flex: 1,
    marginRight: spacing.sm,
  },
  textTouchable: {
    minHeight: 32,
    justifyContent: 'center',
  },
  habitText: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text.primary,
    lineHeight: 20,
  },
  input: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text.primary,
    backgroundColor: colors.background.primary,
    borderWidth: 1,
    borderColor: colors.border.focused,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    minHeight: 36,
  },
  deleteButton: {
    width: 28,
    height: 28,
    borderRadius: borderRadius.full,
    backgroundColor: colors.gray[700],
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteIcon: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.secondary,
    lineHeight: 20,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text.tertiary,
    marginRight: spacing.sm,
  },
  categoryButtons: {
    flexDirection: 'row',
    flex: 1,
    gap: spacing.xs,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border.default,
    backgroundColor: colors.background.primary,
  },
  categoryButtonIcon: {
    fontSize: 14,
    fontWeight: '700',
    marginRight: 4,
  },
  categoryButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default HabitEntry;
