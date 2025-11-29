/**
 * Color palette for Manifest the Unseen
 *
 * Brand colors: Purple (primary) and Gold (secondary) for spiritual, ethereal aesthetic
 * All colors meet WCAG AA contrast requirements (4.5:1 for text)
 *
 * Usage:
 * - Import: `import { colors } from '@/theme'`
 * - Access: `colors.primary[600]` or `colors.text.primary`
 */

export const colors = {
  // Primary brand color - Purple (spiritual, mystical)
  primary: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',  // Main brand color
    700: '#7e22ce',
    800: '#6b21a8',
    900: '#581c87',
    950: '#3b0764',
  },

  // Secondary brand color - Gold (enlightenment, achievement)
  secondary: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',  // Main gold accent
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
    950: '#451a03',
  },

  // Semantic colors
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',  // Main success color
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },

  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',  // Main error color
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },

  warning: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#f97316',  // Main warning color
    600: '#ea580c',
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12',
  },

  info: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',  // Main info color
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },

  // Neutral grays
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
    950: '#030712',
  },

  // Special colors
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',

  // Semantic text colors (for easy access) - DARK MODE DEFAULT
  text: {
    primary: '#e8e8e8',      // Soft off-white (never pure white)
    secondary: '#a0a0b0',    // Muted gray
    tertiary: '#6b6b80',     // Subtle hints
    disabled: '#4a4a5a',     // Dimmed
    inverse: '#111827',      // Dark text for light backgrounds
    link: '#c084fc',         // Lighter purple for dark bg
  },

  // Background colors - DARK MODE DEFAULT
  background: {
    primary: '#1a1a2e',      // Deep charcoal
    secondary: '#16213e',    // Dark slate blue
    tertiary: '#252547',     // Elevated surface
    elevated: '#252547',     // Cards, modals
    inverse: '#ffffff',      // White (for rare light elements)
    purple: '#2d1f47',       // Dark purple tint
    gold: '#2d2815',         // Dark gold tint
  },

  // Border colors - DARK MODE DEFAULT
  border: {
    default: '#3a3a50',      // Subtle dark border
    focused: '#c084fc',      // Lighter purple for visibility
    error: '#f87171',        // Brighter red for dark bg
    disabled: '#2a2a3e',     // Very subtle
  },

  // Overlay colors (for modals, bottom sheets)
  overlay: {
    light: 'rgba(0, 0, 0, 0.5)',
    dark: 'rgba(0, 0, 0, 0.75)',
  },

  // Brand colors (quick access to main brand colors)
  brand: {
    purple: '#9333ea',       // primary-600 (main brand color)
    gold: '#fbbf24',         // secondary-400 (main gold accent)
  },

  // Dark theme colors (spiritual/meditation app aesthetic)
  dark: {
    bgPrimary: '#1a1a2e',     // Deep charcoal (primary background)
    bgSecondary: '#16213e',   // Dark slate blue (alternative background)
    bgElevated: '#252547',    // Elevated surface (cards)
    textPrimary: '#e8e8e8',   // Soft off-white (NEVER pure white)
    textSecondary: '#a0a0b0', // Muted gray
    textTertiary: '#6b6b80',  // Subtle hints
    accentPurple: '#4a1a6b',  // Deep purple (primary accent)
    accentTeal: '#1a5f5f',    // Deep teal (opportunities, wisdom)
    accentGold: '#c9a227',    // Muted gold (enlightenment, value)
    accentRose: '#8b3a5f',    // Deep rose (heart, compassion)
    accentGreen: '#2d5a4a',   // Forest green (growth, nature)
    accentAmber: '#8b6914',   // Deep amber (earth, grounding)
    accentBurgundy: '#6b2d3d', // Deep burgundy (awareness, threats)
  },

  // SWOT Analysis specific colors (dark theme)
  swot: {
    strengths: {
      primary: '#2d5a4a',     // Deep forest green
      light: 'rgba(45, 90, 74, 0.2)',
      border: 'rgba(45, 90, 74, 0.4)',
      glow: 'rgba(45, 90, 74, 0.3)',
    },
    weaknesses: {
      primary: '#8b6914',     // Deep amber
      light: 'rgba(139, 105, 20, 0.2)',
      border: 'rgba(139, 105, 20, 0.4)',
      glow: 'rgba(139, 105, 20, 0.3)',
    },
    opportunities: {
      primary: '#1a5f5f',     // Deep teal
      light: 'rgba(26, 95, 95, 0.2)',
      border: 'rgba(26, 95, 95, 0.4)',
      glow: 'rgba(26, 95, 95, 0.3)',
    },
    threats: {
      primary: '#6b2d3d',     // Deep burgundy
      light: 'rgba(107, 45, 61, 0.2)',
      border: 'rgba(107, 45, 61, 0.4)',
      glow: 'rgba(107, 45, 61, 0.3)',
    },
  },

  // Status colors (quick access to main semantic colors)
  status: {
    success: '#16a34a',      // success-600
    error: '#dc2626',        // error-600
    warning: '#ea580c',      // warning-600
    info: '#2563eb',         // info-600
  },
} as const;

/**
 * Type for color keys (for TypeScript autocomplete)
 */
export type ColorKey = keyof typeof colors;
export type PrimaryColorShade = keyof typeof colors.primary;
export type SemanticColor = keyof typeof colors.text;
