/**
 * Text Component
 *
 * Typography wrapper with variants matching design system
 * Handles accessibility and Dynamic Type automatically
 *
 * Color Palette (Ancient Mystical Design):
 * - primary: #F5F0E6 (Enlightened White) - DEFAULT
 * - secondary: #A09080 (Muted Wisdom)
 * - tertiary: #6B6B6B (Subtle hints)
 * - disabled: #4a4a5a (Dimmed)
 * - golden: #C4A052 (Aged Gold - for emphasis/headers)
 * - inverse: #0A0A0F (Dark text for light backgrounds)
 * - link: #D4A84B (Amber Glow)
 *
 * @example
 * ```tsx
 * <Text variant="h1" color="golden">
 *   Phase 1: Self-Evaluation
 * </Text>
 *
 * <Text variant="body" color="secondary">
 *   Supporting text in muted wisdom
 * </Text>
 *
 * <Text variant="h2" color="primary">
 *   Header in enlightened white
 * </Text>
 * ```
 */

import React from 'react';
import {
  Text as RNText,
  TextProps as RNTextProps,
  TextStyle,
} from 'react-native';
import { colors, typography, TypographyVariant } from '../theme';

export interface TextProps extends RNTextProps {
  /** Typography variant */
  variant?: TypographyVariant;

  /**
   * Text color (theme color key or custom hex)
   * Theme keys: 'primary' | 'secondary' | 'tertiary' | 'disabled' | 'golden' | 'inverse' | 'link'
   * Default: 'primary' (#F5F0E6 - Enlightened White)
   */
  color?: keyof typeof colors.text | string;

  /** Text alignment */
  align?: 'left' | 'center' | 'right' | 'justify';

  /** Font weight override */
  weight?: '300' | '400' | '500' | '600' | '700' | '800';

  /** Number of lines (with ellipsis) */
  numberOfLines?: number;
}

export const Text: React.FC<TextProps> = ({
  variant = 'body',
  color = 'primary',
  align = 'left',
  weight,
  numberOfLines,
  style,
  children,
  ...rest
}) => {
  const getTextStyle = (): TextStyle[] => {
    const baseStyles: TextStyle[] = [
      typography[variant],
      { textAlign: align },
    ];

    // Color
    const colorValue = color in colors.text
      ? colors.text[color as keyof typeof colors.text]
      : color;
    baseStyles.push({ color: colorValue });

    // Weight override
    if (weight) {
      baseStyles.push({ fontWeight: weight });
    }

    // Custom style
    if (style) {
      baseStyles.push(style as TextStyle);
    }

    return baseStyles;
  };

  return (
    <RNText
      style={getTextStyle()}
      numberOfLines={numberOfLines}
      allowFontScaling // Support Dynamic Type
      accessible
      {...rest}
    >
      {children}
    </RNText>
  );
};
