/**
 * Card Component
 *
 * Container component with elevation and optional press behavior
 * Supports flat, raised, and lifted variants
 *
 * @example
 * ```tsx
 * <Card elevation="raised" onPress={handlePress}>
 *   <Text>Card content</Text>
 * </Card>
 * ```
 */

import React from 'react';
import {
  View,
  Pressable,
  StyleSheet,
  ViewStyle,
  PressableStateCallbackType,
} from 'react-native';
import { colors, spacing, borderRadius, shadows } from '../theme';

export type CardElevation = 'flat' | 'raised' | 'lifted';

export interface CardProps {
  /** Card content */
  children: React.ReactNode;

  /** Elevation level */
  elevation?: CardElevation;

  /** Optional press handler (makes card pressable) */
  onPress?: () => void;

  /** Padding size */
  padding?: keyof typeof spacing | number;

  /** Custom style */
  style?: ViewStyle;

  /** Accessibility label */
  accessibilityLabel?: string;

  /** Accessibility hint */
  accessibilityHint?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  elevation = 'raised',
  onPress,
  padding = 'md',
  style,
  accessibilityLabel,
  accessibilityHint,
}) => {
  const paddingValue = typeof padding === 'number' ? padding : spacing[padding];

  const getContainerStyle = ({ pressed }: PressableStateCallbackType = { pressed: false }): ViewStyle[] => {
    const baseStyles: ViewStyle[] = [
      styles.base,
      { padding: paddingValue },
    ];

    // Elevation styles
    if (elevation === 'flat') {
      baseStyles.push(styles.flat);
    } else if (elevation === 'raised') {
      baseStyles.push(styles.raised);
      if (pressed) baseStyles.push(styles.pressed);
    } else if (elevation === 'lifted') {
      baseStyles.push(styles.lifted);
      if (pressed) baseStyles.push(styles.pressed);
    }

    // Custom style
    if (style) {
      baseStyles.push(style);
    }

    return baseStyles;
  };

  // If pressable, wrap in Pressable
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={getContainerStyle}
        accessible
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
      >
        {children}
      </Pressable>
    );
  }

  // Otherwise, just a View
  return (
    <View
      style={getContainerStyle()}
      accessible={Boolean(accessibilityLabel)}
      accessibilityLabel={accessibilityLabel}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },

  flat: {
    borderWidth: 1,
    borderColor: colors.border.default,
  },

  raised: {
    ...shadows.sm,
  },

  lifted: {
    ...shadows.md,
  },

  pressed: {
    ...shadows.xs,
    opacity: 0.95,
  },
});
