/**
 * Card Component - Temple Stone Styling
 *
 * Container component with ancient mystical design
 * Features temple stone background with subtle gold borders
 * Supports elevation levels and variant states
 *
 * @example
 * ```tsx
 * // Default card with temple stone styling
 * <Card elevation="raised">
 *   <Text>Card content</Text>
 * </Card>
 *
 * // Elevated variant with stronger gold border
 * <Card variant="elevated">
 *   <Text>Important content</Text>
 * </Card>
 *
 * // Active variant with golden glow
 * <Card variant="active" onPress={handlePress}>
 *   <Text>Interactive content</Text>
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
import { colors, spacing } from '../theme';

export type CardElevation = 'flat' | 'raised' | 'lifted';
export type CardVariant = 'default' | 'elevated' | 'active';

export interface CardProps {
  /** Card content */
  children: React.ReactNode;

  /** Elevation level */
  elevation?: CardElevation;

  /** Card variant style */
  variant?: CardVariant;

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
  variant = 'default',
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

    // Variant styles
    if (variant === 'elevated') {
      baseStyles.push(styles.variantElevated);
    } else if (variant === 'active') {
      baseStyles.push(styles.variantActive);
    }

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
    backgroundColor: colors.background.secondary, // Temple Stone #1A1A24
    borderWidth: 1,
    borderColor: colors.border.default, // rgba(196, 160, 82, 0.15)
    borderRadius: 16,
    overflow: 'hidden',
  },

  flat: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },

  raised: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 8,
  },

  lifted: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 32,
    elevation: 12,
  },

  pressed: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 4,
    opacity: 0.95,
  },

  // Variant styles
  variantElevated: {
    borderColor: colors.border.gold, // rgba(196, 160, 82, 0.4) - stronger gold
    shadowColor: 'rgba(196, 160, 82, 0.2)', // Subtle golden glow in shadow
  },

  variantActive: {
    borderColor: colors.border.gold, // rgba(196, 160, 82, 0.4) - stronger gold
    shadowColor: colors.brand.gold, // #C4A052 - golden glow
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
});
