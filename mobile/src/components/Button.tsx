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
import { colors, typography, spacing } from '../theme';

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
          color={variant === 'primary' ? colors.text.inverse : colors.brand.gold}
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
    borderRadius: 12, // Ancient mystical design - 12px border radius
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },

  // Variants - Gold Gradient Styling
  primary: {
    // Solid Aged Gold background (fallback until LinearGradient is added)
    // TODO: Replace with LinearGradient from Burnished Bronze (#8B6914) to Aged Gold (#C4A052)
    backgroundColor: colors.brand.gold, // #C4A052 - Aged Gold
    // Golden shadow for mystical glow
    shadowColor: colors.brand.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  primaryPressed: {
    backgroundColor: colors.brand.bronze, // #8B6914 - Burnished Bronze (darker)
    shadowColor: colors.brand.bronze,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryText: {
    color: colors.text.inverse, // #0A0A0F - Dark text on gold background
  },

  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.brand.gold, // #C4A052 - Gold border
  },
  secondaryPressed: {
    backgroundColor: 'rgba(196, 160, 82, 0.1)', // Subtle gold tint
    borderColor: colors.brand.amber, // #D4A84B - Lighter amber on press
  },
  secondaryText: {
    color: colors.brand.gold, // #C4A052 - Gold text
  },

  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  ghostPressed: {
    backgroundColor: 'rgba(196, 160, 82, 0.08)', // Very subtle gold background
  },
  ghostText: {
    color: colors.text.secondary, // #A09080 - Muted Wisdom
  },

  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.brand.gold,
  },
  outlinePressed: {
    backgroundColor: 'rgba(196, 160, 82, 0.1)',
    borderColor: colors.brand.amber,
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
