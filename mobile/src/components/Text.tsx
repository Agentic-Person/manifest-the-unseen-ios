/**
 * Text Component
 *
 * Typography wrapper with variants matching design system
 * Handles accessibility and Dynamic Type automatically
 *
 * @example
 * ```tsx
 * <Text variant="h1" color="primary">
 *   Phase 1: Self-Evaluation
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

  /** Text color (theme color key or custom hex) */
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
