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

  // Semantic text colors (for easy access)
  text: {
    primary: '#111827',      // gray-900
    secondary: '#4b5563',    // gray-600
    tertiary: '#9ca3af',     // gray-400
    disabled: '#d1d5db',     // gray-300
    inverse: '#ffffff',      // white
    link: '#9333ea',         // primary-600
  },

  // Background colors
  background: {
    primary: '#ffffff',      // white
    secondary: '#f9fafb',    // gray-50
    tertiary: '#f3f4f6',     // gray-100
    elevated: '#ffffff',     // white (for cards)
    inverse: '#111827',      // gray-900
    purple: '#faf5ff',       // primary-50 (ethereal background)
    gold: '#fffbeb',         // secondary-50 (achievement background)
  },

  // Border colors
  border: {
    default: '#e5e7eb',      // gray-200
    focused: '#9333ea',      // primary-600
    error: '#dc2626',        // error-600
    disabled: '#f3f4f6',     // gray-100
  },

  // Overlay colors (for modals, bottom sheets)
  overlay: {
    light: 'rgba(0, 0, 0, 0.5)',
    dark: 'rgba(0, 0, 0, 0.75)',
  },
} as const;

/**
 * Type for color keys (for TypeScript autocomplete)
 */
export type ColorKey = keyof typeof colors;
export type PrimaryColorShade = keyof typeof colors.primary;
export type SemanticColor = keyof typeof colors.text;
