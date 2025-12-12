/**
 * Typography system for Manifest the Unseen
 *
 * Uses system fonts for optimal performance and native feel
 * Scale follows 1.25 ratio (major third) for harmonious sizing
 *
 * Usage:
 * - Import: `import { typography } from '@/theme'`
 * - Access: `typography.h1.fontSize` or `typography.fontWeights.bold`
 */

import { Platform } from 'react-native';

/**
 * Font families
 */
export const fontFamilies = {
  // System font (default for iOS/Android) - used for body text
  primary: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System',
  }),

  // Serif font for headings - classical, meditative aesthetic
  heading: Platform.select({
    ios: 'Baskerville',
    android: 'serif',
    default: 'serif',
  }),

  // Monospace for code or technical content
  monospace: Platform.select({
    ios: 'Menlo',
    android: 'monospace',
    default: 'monospace',
  }),
} as const;

/**
 * Font weights
 */
export const fontWeights = {
  light: '300',
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
} as const;

/**
 * Font sizes (in pixels)
 * Scale: 1.25 ratio (major third)
 */
export const fontSizes = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 32,
  '5xl': 36,
  '6xl': 48,
} as const;

/**
 * Line heights (multipliers)
 */
export const lineHeights = {
  tight: 1.2,   // For headings
  normal: 1.5,  // For body text
  relaxed: 1.75, // For long-form content
} as const;

/**
 * Letter spacing (in pixels)
 */
export const letterSpacing = {
  tight: -0.5,
  normal: 0,
  wide: 0.5,
  wider: 1,
} as const;

/**
 * Typography variants (pre-configured text styles)
 */
export const typography = {
  // Display text (hero sections)
  display: {
    fontSize: fontSizes['6xl'],
    lineHeight: fontSizes['6xl'] * lineHeights.tight,
    fontWeight: fontWeights.bold,
    letterSpacing: letterSpacing.tight,
    fontFamily: fontFamilies.heading,
  },

  // Headings - use Baskerville for classical, meditative aesthetic
  h1: {
    fontSize: fontSizes['5xl'],
    lineHeight: fontSizes['5xl'] * lineHeights.tight,
    fontWeight: fontWeights.bold,
    letterSpacing: letterSpacing.tight,
    fontFamily: fontFamilies.heading,
  },

  h2: {
    fontSize: fontSizes['4xl'],
    lineHeight: fontSizes['4xl'] * lineHeights.tight,
    fontWeight: fontWeights.bold,
    letterSpacing: letterSpacing.tight,
    fontFamily: fontFamilies.heading,
  },

  h3: {
    fontSize: fontSizes['3xl'],
    lineHeight: fontSizes['3xl'] * lineHeights.tight,
    fontWeight: fontWeights.semibold,
    letterSpacing: letterSpacing.normal,
    fontFamily: fontFamilies.heading,
  },

  h4: {
    fontSize: fontSizes['2xl'],
    lineHeight: fontSizes['2xl'] * lineHeights.tight,
    fontWeight: fontWeights.semibold,
    letterSpacing: letterSpacing.normal,
    fontFamily: fontFamilies.heading,
  },

  h5: {
    fontSize: fontSizes.xl,
    lineHeight: fontSizes.xl * lineHeights.tight,
    fontWeight: fontWeights.semibold,
    letterSpacing: letterSpacing.normal,
    fontFamily: fontFamilies.heading,
  },

  h6: {
    fontSize: fontSizes.lg,
    lineHeight: fontSizes.lg * lineHeights.tight,
    fontWeight: fontWeights.semibold,
    letterSpacing: letterSpacing.normal,
    fontFamily: fontFamilies.heading,
  },

  // Body text
  body: {
    fontSize: fontSizes.base,
    lineHeight: fontSizes.base * lineHeights.normal,
    fontWeight: fontWeights.regular,
    letterSpacing: letterSpacing.normal,
    fontFamily: fontFamilies.primary,
  },

  bodyLarge: {
    fontSize: fontSizes.lg,
    lineHeight: fontSizes.lg * lineHeights.normal,
    fontWeight: fontWeights.regular,
    letterSpacing: letterSpacing.normal,
    fontFamily: fontFamilies.primary,
  },

  bodySmall: {
    fontSize: fontSizes.sm,
    lineHeight: fontSizes.sm * lineHeights.normal,
    fontWeight: fontWeights.regular,
    letterSpacing: letterSpacing.normal,
    fontFamily: fontFamilies.primary,
  },

  // Caption text
  caption: {
    fontSize: fontSizes.xs,
    lineHeight: fontSizes.xs * lineHeights.normal,
    fontWeight: fontWeights.regular,
    letterSpacing: letterSpacing.wide,
    fontFamily: fontFamilies.primary,
  },

  // Overline text (labels, tags)
  overline: {
    fontSize: fontSizes.xs,
    lineHeight: fontSizes.xs * lineHeights.tight,
    fontWeight: fontWeights.semibold,
    letterSpacing: letterSpacing.wider,
    fontFamily: fontFamilies.primary,
    textTransform: 'uppercase' as const,
  },

  // Button text
  button: {
    fontSize: fontSizes.base,
    lineHeight: fontSizes.base * lineHeights.tight,
    fontWeight: fontWeights.semibold,
    letterSpacing: letterSpacing.wide,
    fontFamily: fontFamilies.primary,
  },

  buttonSmall: {
    fontSize: fontSizes.sm,
    lineHeight: fontSizes.sm * lineHeights.tight,
    fontWeight: fontWeights.semibold,
    letterSpacing: letterSpacing.wide,
    fontFamily: fontFamilies.primary,
  },

  buttonLarge: {
    fontSize: fontSizes.lg,
    lineHeight: fontSizes.lg * lineHeights.tight,
    fontWeight: fontWeights.semibold,
    letterSpacing: letterSpacing.wide,
    fontFamily: fontFamilies.primary,
  },

  // Code
  code: {
    fontSize: fontSizes.sm,
    lineHeight: fontSizes.sm * lineHeights.normal,
    fontWeight: fontWeights.regular,
    letterSpacing: letterSpacing.normal,
    fontFamily: fontFamilies.monospace,
  },
} as const;

/**
 * Types for TypeScript autocomplete
 */
export type TypographyVariant = keyof typeof typography;
export type FontWeight = keyof typeof fontWeights;
export type FontSize = keyof typeof fontSizes;
