/**
 * Design System Theme - Manifest the Unseen
 *
 * Centralized export of all design tokens
 * Use this single import for all theme values
 *
 * @example
 * ```typescript
 * import { theme, colors, typography, spacing, shadows } from '@/theme';
 *
 * const styles = StyleSheet.create({
 *   container: {
 *     backgroundColor: colors.background.primary,
 *     padding: spacing.md,
 *     ...shadows.sm,
 *   },
 *   title: {
 *     ...typography.h1,
 *     color: colors.text.primary,
 *   },
 * });
 * ```
 */

export * from './colors';
export * from './typography';
export * from './spacing';
export * from './shadows';

import { colors } from './colors';
import { typography, fontFamilies, fontWeights, fontSizes, lineHeights, letterSpacing } from './typography';
import { spacing, borderRadius, componentSpacing, safeAreaInsets, createSpacing } from './spacing';
import { shadows, componentShadows, innerShadow, glow } from './shadows';

/**
 * Complete theme object
 * Use this for passing theme to context providers or theme libraries
 */
export const theme = {
  colors,
  typography,
  spacing,
  shadows,
  borderRadius,

  // Component-specific presets
  components: {
    spacing: componentSpacing,
    shadows: componentShadows,
  },

  // Typography utilities
  fonts: {
    families: fontFamilies,
    weights: fontWeights,
    sizes: fontSizes,
    lineHeights,
    letterSpacing,
  },

  // Spacing utilities
  utils: {
    createSpacing,
    safeAreaInsets,
    innerShadow,
    glow,
  },
} as const;

/**
 * Type for the complete theme
 */
export type Theme = typeof theme;

/**
 * Default export
 */
export default theme;
