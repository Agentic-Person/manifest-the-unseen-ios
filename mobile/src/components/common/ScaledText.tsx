/**
 * Scaled Text Component
 *
 * A Text component wrapper that automatically applies font scaling
 * based on user preferences from the FontSizeContext.
 */

import React, { useMemo } from 'react';
import {
  Text,
  TextProps,
  TextStyle,
  StyleSheet,
  StyleProp,
} from 'react-native';
import { useFontSizeContext } from '../../contexts/FontSizeContext';

interface ScaledTextProps extends TextProps {
  children?: React.ReactNode;
}

/**
 * Extracts and flattens font size from a style prop
 */
const extractFontSize = (style: StyleProp<TextStyle>): number | undefined => {
  if (!style) return undefined;

  // Handle array of styles
  if (Array.isArray(style)) {
    for (let i = style.length - 1; i >= 0; i--) {
      const fontSize = extractFontSize(style[i]);
      if (fontSize !== undefined) return fontSize;
    }
    return undefined;
  }

  // Handle StyleSheet.create styles (get flattened version)
  const flatStyle = StyleSheet.flatten(style);
  return flatStyle?.fontSize;
};

/**
 * Scaled Text Component
 *
 * Automatically scales fontSize and lineHeight based on user preferences.
 * Use this as a drop-in replacement for Text when you want scaling.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <ScaledText style={styles.title}>Hello World</ScaledText>
 *
 * // With inline styles
 * <ScaledText style={{ fontSize: 16, color: 'red' }}>Scaled text</ScaledText>
 * ```
 */
export const ScaledText: React.FC<ScaledTextProps> = ({
  style,
  children,
  ...props
}) => {
  const { scaleFont } = useFontSizeContext();

  const scaledStyle = useMemo(() => {
    if (!style) return undefined;

    const flatStyle = StyleSheet.flatten(style);
    if (!flatStyle) return style;

    const scaledProps: TextStyle = {};

    if (flatStyle.fontSize !== undefined) {
      scaledProps.fontSize = scaleFont(flatStyle.fontSize);
    }

    if (flatStyle.lineHeight !== undefined) {
      scaledProps.lineHeight = scaleFont(flatStyle.lineHeight);
    }

    // Only create new style if we have scaled properties
    if (Object.keys(scaledProps).length === 0) {
      return style;
    }

    return [style, scaledProps];
  }, [style, scaleFont]);

  return (
    <Text style={scaledStyle} {...props}>
      {children}
    </Text>
  );
};

export default ScaledText;
