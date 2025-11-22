/**
 * TagInput Component
 *
 * Text input for adding custom text tags with removable chips display
 * Used for workbook exercises like listing goals, habits, beliefs
 *
 * @example
 * ```tsx
 * <TagInput
 *   label="Your limiting beliefs"
 *   tags={beliefs}
 *   onTagsChange={setBeliefs}
 *   placeholder="Type and press enter to add"
 *   maxTags={10}
 * />
 * ```
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput as RNTextInput,
  Pressable,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, typography, spacing, fontWeights, borderRadius } from '../../theme';

export interface TagInputProps {
  /** Label displayed above the input */
  label: string;

  /** Current list of tags */
  tags: string[];

  /** Callback when tags change */
  onTagsChange: (tags: string[]) => void;

  /** Placeholder text for input */
  placeholder?: string;

  /** Maximum number of tags allowed */
  maxTags?: number;

  /** Disabled state */
  disabled?: boolean;

  /** Custom container style */
  containerStyle?: ViewStyle;

  /** Accessibility label (defaults to label) */
  accessibilityLabel?: string;

  /** Enable haptic feedback on press (default: true) */
  enableHaptic?: boolean;
}

export const TagInput: React.FC<TagInputProps> = ({
  label,
  tags,
  onTagsChange,
  placeholder = 'Add tag...',
  maxTags,
  disabled = false,
  containerStyle,
  accessibilityLabel,
  enableHaptic = true,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const atMaxTags = maxTags ? tags.length >= maxTags : false;

  const handleAddTag = () => {
    const trimmedValue = inputValue.trim();

    if (!trimmedValue || disabled || atMaxTags) return;

    // Check for duplicate
    if (tags.includes(trimmedValue)) {
      setInputValue('');
      return;
    }

    if (enableHaptic) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    onTagsChange([...tags, trimmedValue]);
    setInputValue('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (disabled) return;

    if (enableHaptic) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    onTagsChange(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyPress = (e: { nativeEvent: { key: string } }) => {
    if (e.nativeEvent.key === 'Enter') {
      handleAddTag();
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Label with tag count */}
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        {maxTags && (
          <Text style={styles.tagCount}>
            {tags.length}/{maxTags}
          </Text>
        )}
      </View>

      {/* Tags display */}
      {tags.length > 0 && (
        <View
          style={styles.tagsContainer}
          accessible
          accessibilityLabel={`${accessibilityLabel || label}: ${tags.join(', ')}`}
          accessibilityRole="list"
        >
          {tags.map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
              <Pressable
                onPress={() => handleRemoveTag(tag)}
                disabled={disabled}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                style={({ pressed }) => [
                  styles.removeButton,
                  pressed && styles.removeButtonPressed,
                ]}
                accessible
                accessibilityRole="button"
                accessibilityLabel={`Remove ${tag}`}
              >
                <Text style={styles.removeButtonText}>x</Text>
              </Pressable>
            </View>
          ))}
        </View>
      )}

      {/* Input field */}
      <RNTextInput
        style={[
          styles.input,
          isFocused && styles.inputFocused,
          disabled && styles.inputDisabled,
          atMaxTags && styles.inputDisabled,
        ]}
        value={inputValue}
        onChangeText={setInputValue}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          setIsFocused(false);
          // Add tag on blur if there's content
          if (inputValue.trim()) {
            handleAddTag();
          }
        }}
        onSubmitEditing={handleAddTag}
        onKeyPress={handleKeyPress}
        placeholder={atMaxTags ? 'Maximum tags reached' : placeholder}
        placeholderTextColor={colors.text.tertiary}
        editable={!disabled && !atMaxTags}
        returnKeyType="done"
        blurOnSubmit={false}
        accessible
        accessibilityLabel={accessibilityLabel || label}
        accessibilityHint="Type and press enter to add a tag"
        accessibilityState={{
          disabled: disabled || atMaxTags,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },

  label: {
    ...typography.bodySmall,
    fontWeight: fontWeights.semibold as any,
    color: colors.text.primary,
  },

  tagCount: {
    ...typography.caption,
    color: colors.text.tertiary,
  },

  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },

  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: spacing.sm,
    paddingRight: spacing.xs,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary[100],
    gap: spacing.xs,
  },

  tagText: {
    ...typography.bodySmall,
    fontWeight: fontWeights.medium as any,
    color: colors.primary[700],
  },

  removeButton: {
    width: 20,
    height: 20,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary[200],
    alignItems: 'center',
    justifyContent: 'center',
  },

  removeButtonPressed: {
    backgroundColor: colors.primary[300],
  },

  removeButtonText: {
    ...typography.caption,
    fontWeight: fontWeights.bold as any,
    color: colors.primary[700],
    lineHeight: 16,
  },

  input: {
    ...typography.body,
    color: colors.text.primary,
    backgroundColor: colors.background.primary,
    borderWidth: 1,
    borderColor: colors.border.default,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 44, // iOS minimum touch target
  },

  inputFocused: {
    borderColor: colors.border.focused,
    borderWidth: 2,
  },

  inputDisabled: {
    backgroundColor: colors.background.tertiary,
    borderColor: colors.border.disabled,
    color: colors.text.disabled,
  },
});
