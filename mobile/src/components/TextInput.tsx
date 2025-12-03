/**
 * TextInput Component
 *
 * Reusable text input with label, error states, and accessibility
 * Supports single-line and multi-line input
 *
 * @example
 * ```tsx
 * <TextInput
 *   label="Email"
 *   value={email}
 *   onChangeText={setEmail}
 *   placeholder="Enter your email"
 *   error={errors.email}
 * />
 * ```
 */

import React, { useState } from 'react';
import {
  View,
  TextInput as RNTextInput,
  Text,
  StyleSheet,
  TextInputProps as RNTextInputProps,
  ViewStyle,
} from 'react-native';
import { colors, typography, spacing, fontWeights } from '../theme';

export interface TextInputProps extends Omit<RNTextInputProps, 'style'> {
  /** Input label */
  label?: string;

  /** Error message */
  error?: string;

  /** Helper text */
  helperText?: string;

  /** Disabled state */
  disabled?: boolean;

  /** Multiline (textarea) */
  multiline?: boolean;

  /** Number of lines (for multiline) */
  numberOfLines?: number;

  /** Character counter (shows current/max) */
  maxLength?: number;

  /** Show character counter */
  showCharacterCount?: boolean;

  /** Custom container style */
  containerStyle?: ViewStyle;

  /** Custom input style */
  style?: ViewStyle;
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  error,
  helperText,
  disabled = false,
  multiline = false,
  numberOfLines = 4,
  maxLength,
  showCharacterCount = false,
  containerStyle,
  value = '',
  onChangeText,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const hasError = Boolean(error);
  const characterCount = value?.length || 0;

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Label */}
      {label && (
        <Text
          style={styles.label}
          accessible
          accessibilityRole="text"
        >
          {label}
        </Text>
      )}

      {/* Input */}
      <RNTextInput
        style={[
          styles.input,
          multiline && styles.inputMultiline,
          multiline && { height: numberOfLines * 24 },
          isFocused && styles.inputFocused,
          hasError && styles.inputError,
          disabled && styles.inputDisabled,
        ]}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        editable={!disabled}
        multiline={multiline}
        numberOfLines={multiline ? numberOfLines : 1}
        maxLength={maxLength}
        placeholderTextColor="#6B6B6B"
        accessible
        accessibilityLabel={label}
        accessibilityHint={helperText}
        accessibilityState={{
          disabled,
        }}
        {...rest}
      />

      {/* Helper text, error, or character count */}
      <View style={styles.footer}>
        {/* Error or helper text */}
        {hasError ? (
          <Text
            style={styles.errorText}
            accessible
            accessibilityRole="alert"
            accessibilityLiveRegion="polite"
          >
            {error}
          </Text>
        ) : helperText ? (
          <Text style={styles.helperText}>{helperText}</Text>
        ) : (
          <View />
        )}

        {/* Character counter */}
        {showCharacterCount && maxLength && (
          <Text
            style={[
              styles.characterCount,
              characterCount > maxLength && styles.characterCountError,
            ]}
            accessible
            accessibilityLabel={`${characterCount} of ${maxLength} characters`}
          >
            {characterCount}/{maxLength}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },

  label: {
    ...typography.bodySmall,
    fontWeight: fontWeights.semibold as any,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },

  input: {
    ...typography.body,
    color: colors.text.primary,
    backgroundColor: 'rgba(26, 26, 36, 0.8)', // Semi-transparent Temple Stone
    borderWidth: 1,
    borderColor: 'rgba(196, 160, 82, 0.2)', // Subtle gold
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    minHeight: 44, // iOS minimum touch target
  },

  inputMultiline: {
    paddingTop: 16,
    textAlignVertical: 'top',
  },

  inputFocused: {
    borderColor: '#C4A052', // Aged Gold
    borderWidth: 1,
    shadowColor: '#C4A052',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4, // Android shadow
  },

  inputError: {
    borderColor: '#f87171', // Error red
    borderWidth: 1,
  },

  inputDisabled: {
    backgroundColor: 'rgba(26, 26, 36, 0.5)', // More transparent when disabled
    borderColor: 'rgba(196, 160, 82, 0.1)', // Very subtle gold
    color: colors.text.disabled,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: spacing.xs,
    minHeight: 20, // Prevent layout shift
  },

  helperText: {
    ...typography.caption,
    color: colors.text.secondary,
    flex: 1,
  },

  errorText: {
    ...typography.caption,
    color: colors.error[600],
    flex: 1,
  },

  characterCount: {
    ...typography.caption,
    color: colors.text.tertiary,
    marginLeft: spacing.sm,
  },

  characterCountError: {
    color: colors.error[600],
  },
});
