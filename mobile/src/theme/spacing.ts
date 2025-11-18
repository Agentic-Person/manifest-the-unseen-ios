/**
 * Spacing system for Manifest the Unseen
 *
 * Based on 4px grid for consistent alignment
 * Scale follows common spacing needs (4, 8, 12, 16, 24, 32, 48, 64, 96)
 *
 * Usage:
 * - Import: `import { spacing } from '@/theme'`
 * - Access: `spacing[4]` or `spacing.md`
 * - In styles: `paddingHorizontal: spacing.md` (16px)
 */

/**
 * Base spacing unit (4px)
 */
export const BASE_SPACING = 4;

/**
 * Spacing scale (in pixels)
 * Each value is a multiple of BASE_SPACING (4px)
 */
export const spacing = {
  // Numeric scale (multiples of 4)
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
  32: 128,
  40: 160,
  48: 192,
  56: 224,
  64: 256,

  // Named scale (semantic)
  none: 0,
  xs: 4,      // Extra small (1 unit)
  sm: 8,      // Small (2 units)
  md: 16,     // Medium (4 units) - default spacing
  lg: 24,     // Large (6 units)
  xl: 32,     // Extra large (8 units)
  '2xl': 48,  // 2x extra large (12 units)
  '3xl': 64,  // 3x extra large (16 units)
  '4xl': 96,  // 4x extra large (24 units)
} as const;

/**
 * Component-specific spacing presets
 */
export const componentSpacing = {
  // Screen padding
  screen: {
    horizontal: spacing.md,  // 16px
    vertical: spacing.lg,    // 24px
  },

  // Card spacing
  card: {
    padding: spacing.md,     // 16px
    gap: spacing.sm,         // 8px
  },

  // List item spacing
  listItem: {
    padding: spacing.md,     // 16px
    gap: spacing.sm,         // 8px
    verticalGap: spacing.xs, // 4px
  },

  // Form field spacing
  form: {
    fieldGap: spacing.md,    // 16px
    labelGap: spacing.xs,    // 4px
    sectionGap: spacing.xl,  // 32px
  },

  // Button spacing
  button: {
    paddingHorizontal: spacing.md,  // 16px
    paddingVertical: spacing.sm,    // 8px
    gap: spacing.xs,                // 4px (icon-to-text)
  },

  // Modal/Dialog spacing
  modal: {
    padding: spacing.lg,     // 24px
    gap: spacing.md,         // 16px
  },

  // Navigation spacing
  navigation: {
    tabPadding: spacing.sm,  // 8px
    headerPadding: spacing.md, // 16px
  },
} as const;

/**
 * Border radius values (also based on 4px grid)
 */
export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  '3xl': 32,
  full: 9999,  // For circular elements
} as const;

/**
 * Safe area insets (for iOS notched devices)
 * These are defaults - actual values should come from SafeAreaView
 */
export const safeAreaInsets = {
  top: 44,     // Status bar height
  bottom: 34,  // Home indicator height (iPhone X+)
  left: 0,
  right: 0,
} as const;

/**
 * Types for TypeScript autocomplete
 */
export type SpacingKey = keyof typeof spacing;
export type BorderRadiusKey = keyof typeof borderRadius;

/**
 * Helper function to create spacing values
 * @param multiplier - How many base units (4px each)
 * @returns Spacing value in pixels
 *
 * @example
 * createSpacing(2) // Returns 8 (2 × 4px)
 * createSpacing(4) // Returns 16 (4 × 4px)
 */
export const createSpacing = (multiplier: number): number => {
  return BASE_SPACING * multiplier;
};
