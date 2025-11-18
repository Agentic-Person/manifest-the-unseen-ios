/**
 * Button Component
 *
 * Reusable button with multiple variants, sizes, and states
 * Includes haptic feedback and accessibility support
 *
 * @example
 * ```tsx
 * <Button
 *   title="Continue"
 *   onPress={handlePress}
 *   variant="primary"
 *   size="lg"
 * />
 * ```
 */

import React from 'react';
import {
  Pressable,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  PressableStateCallbackType,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, typography, spacing, shadows } from '../theme';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  /** Button text */
  title: string;

  /** Press handler */
  onPress: () => void;

  /** Visual variant */
  variant?: ButtonVariant;

  /** Size variant */
  size?: ButtonSize;

  /** Disabled state */
  disabled?: boolean;

  /** Loading state (shows spinner) */
  loading?: boolean;

  /** Full width button */
  fullWidth?: boolean;

  /** Custom style */
  style?: ViewStyle;

  /** Accessibility label (defaults to title) */
  accessibilityLabel?: string;

  /** Accessibility hint */
  accessibilityHint?: string;

  /** Enable haptic feedback on press (default: true) */
  enableHaptic?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  accessibilityLabel,
  accessibilityHint,
  enableHaptic = true,
}) => {
  const handlePress = () => {
    if (disabled || loading) return;

    // Haptic feedback
    if (enableHaptic) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    onPress();
  };

  const getContainerStyle = ({ pressed }: PressableStateCallbackType): ViewStyle[] => {
    const baseStyles: ViewStyle[] = [styles.base];

    // Variant styles
    if (variant === 'primary') {
      baseStyles.push(styles.primary);
      if (pressed) baseStyles.push(styles.primaryPressed);
    } else if (variant === 'secondary') {
      baseStyles.push(styles.secondary);
      if (pressed) baseStyles.push(styles.secondaryPressed);
    } else if (variant === 'ghost') {
      baseStyles.push(styles.ghost);
      if (pressed) baseStyles.push(styles.ghostPressed);
    } else if (variant === 'outline') {
      baseStyles.push(styles.outline);
      if (pressed) baseStyles.push(styles.outlinePressed);
    }

    // Size styles
    if (size === 'sm') {
      baseStyles.push(styles.small);
    } else if (size === 'lg') {
      baseStyles.push(styles.large);
    } else {
      baseStyles.push(styles.medium);
    }

    // State styles
    if (disabled || loading) {
      baseStyles.push(styles.disabled);
    }

    // Full width
    if (fullWidth) {
      baseStyles.push(styles.fullWidth);
    }

    // Custom style
    if (style) {
      baseStyles.push(style);
    }

    return baseStyles;
  };

  const getTextStyle = (): TextStyle[] => {
    const baseStyles: TextStyle[] = [styles.text];

    // Variant text styles
    if (variant === 'primary') {
      baseStyles.push(styles.primaryText);
    } else if (variant === 'secondary') {
      baseStyles.push(styles.secondaryText);
    } else if (variant === 'ghost' || variant === 'outline') {
      baseStyles.push(styles.ghostText);
    }

    // Size text styles
    if (size === 'sm') {
      baseStyles.push(styles.smallText);
    } else if (size === 'lg') {
      baseStyles.push(styles.largeText);
    } else {
      baseStyles.push(styles.mediumText);
    }

    // Disabled text
    if (disabled || loading) {
      baseStyles.push(styles.disabledText);
    }

    return baseStyles;
  };

  return (
    <Pressable
      onPress={handlePress}
      style={getContainerStyle}
      disabled={disabled || loading}
      accessible
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{
        disabled: disabled || loading,
        busy: loading,
      }}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? colors.white : colors.primary[600]}
          size="small"
        />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 9999, // Full rounded
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },

  // Variants
  primary: {
    backgroundColor: colors.primary[600],
    ...shadows.sm,
  },
  primaryPressed: {
    backgroundColor: colors.primary[700],
    ...shadows.xs,
  },
  primaryText: {
    color: colors.white,
  },

  secondary: {
    backgroundColor: colors.secondary[400],
    ...shadows.sm,
  },
  secondaryPressed: {
    backgroundColor: colors.secondary[500],
    ...shadows.xs,
  },
  secondaryText: {
    color: colors.gray[900],
  },

  ghost: {
    backgroundColor: 'transparent',
  },
  ghostPressed: {
    backgroundColor: colors.gray[100],
  },
  ghostText: {
    color: colors.primary[600],
  },

  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary[600],
  },
  outlinePressed: {
    backgroundColor: colors.primary[50],
  },

  // Sizes
  small: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    minHeight: 32,
  },
  medium: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 44, // iOS minimum touch target
  },
  large: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minHeight: 56,
  },

  // States
  disabled: {
    opacity: 0.5,
  },

  fullWidth: {
    width: '100%',
  },

  // Text
  text: {
    fontFamily: typography.button.fontFamily,
    fontWeight: typography.button.fontWeight as any,
    letterSpacing: typography.button.letterSpacing,
    textAlign: 'center',
  },
  smallText: {
    fontSize: typography.buttonSmall.fontSize,
    lineHeight: typography.buttonSmall.lineHeight,
  },
  mediumText: {
    fontSize: typography.button.fontSize,
    lineHeight: typography.button.lineHeight,
  },
  largeText: {
    fontSize: typography.buttonLarge.fontSize,
    lineHeight: typography.buttonLarge.lineHeight,
  },
  disabledText: {
    opacity: 0.7,
  },
});
