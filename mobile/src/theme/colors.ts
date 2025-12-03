/**
 * Color palette for Manifest the Unseen
 *
 * Ancient Mystical Design System
 * Inspired by Tibetan Buddhist, Hindu, and Mayan traditions
 * Dark mode default with gold/amber accents
 *
 * Usage:
 * - Import: `import { colors } from '@/theme'`
 * - Access: `colors.primary[600]` or `colors.text.primary`
 */

export const colors = {
  // Primary brand color - Aged Gold (sacred, ancient, enlightenment)
  primary: {
    50: '#fdf8e8',
    100: '#f9edc4',
    200: '#f0d890',
    300: '#e5c05c',
    400: '#D4A84B',  // Amber Glow (highlights, active states)
    500: '#C4A052',  // Aged Gold (main brand color)
    600: '#a8873f',  // Slightly darker
    700: '#8B6914',  // Burnished Bronze (secondary accent)
    800: '#6b5210',
    900: '#4a3a0c',
    950: '#2d2308',
  },

  // Secondary brand color - Crown Purple (spirituality, wisdom)
  secondary: {
    50: '#f5f0ff',
    100: '#ebe0ff',
    200: '#d4c0ff',
    300: '#b894f6',
    400: '#9b6ce8',
    500: '#7e4dcf',
    600: '#6B4C9A',  // Crown Purple (main secondary)
    700: '#5a3d82',
    800: '#4a3269',
    900: '#3b2854',
    950: '#251838',
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
    primary: '#F5F0E6',      // Enlightened White (warm, never pure white)
    secondary: '#A09080',    // Muted Wisdom (earthy gray)
    tertiary: '#6B6B6B',     // Subtle hints
    disabled: '#4a4a5a',     // Dimmed
    inverse: '#0A0A0F',      // Dark text for light backgrounds (Deep Void)
    link: '#D4A84B',         // Amber Glow for links
    golden: '#C4A052',       // Aged Gold for emphasis
  },

  // Background colors - DARK MODE DEFAULT
  background: {
    primary: '#0A0A0F',      // Deep Void (infinite darkness)
    secondary: '#1A1A24',    // Temple Stone (cards, elevated surfaces)
    tertiary: '#22222E',     // Slightly elevated
    elevated: '#1A1A24',     // Cards, modals (Temple Stone)
    inverse: '#F5F0E6',      // Enlightened White (rare light elements)
    purple: '#1A1525',       // Dark purple tint
    gold: '#1A1810',         // Dark gold tint
  },

  // Border colors - DARK MODE DEFAULT
  border: {
    default: 'rgba(196, 160, 82, 0.15)',  // Subtle gold border
    focused: '#C4A052',      // Aged Gold for focus
    gold: 'rgba(196, 160, 82, 0.4)',      // Stronger gold border
    error: '#f87171',        // Brighter red for dark bg
    disabled: 'rgba(196, 160, 82, 0.08)', // Very subtle gold
  },

  // Overlay colors (for modals, bottom sheets)
  overlay: {
    light: 'rgba(0, 0, 0, 0.5)',
    dark: 'rgba(0, 0, 0, 0.75)',
  },

  // Brand colors (quick access to main brand colors)
  brand: {
    gold: '#C4A052',         // Aged Gold (main brand color)
    amber: '#D4A84B',        // Amber Glow (highlights)
    bronze: '#8B6914',       // Burnished Bronze (secondary accent)
    purple: '#6B4C9A',       // Crown Purple (spirituality)
  },

  // Dark theme colors (ancient mystical aesthetic)
  dark: {
    bgPrimary: '#0A0A0F',     // Deep Void (primary background)
    bgSecondary: '#1A1A24',   // Temple Stone (alternative background)
    bgElevated: '#1A1A24',    // Temple Stone (cards, elevated surfaces)
    textPrimary: '#F5F0E6',   // Enlightened White (NEVER pure white)
    textSecondary: '#A09080', // Muted Wisdom
    textTertiary: '#6B6B6B',  // Subtle hints
    // Spiritual accent colors (chakra-inspired)
    accentPurple: '#6B4C9A',  // Crown Purple (spirituality, third eye)
    accentTeal: '#1a5f5f',    // Deep teal (opportunities, wisdom)
    accentGold: '#C4A052',    // Aged Gold (enlightenment, sacred)
    accentRose: '#8b3a5f',    // Deep rose (heart chakra, compassion)
    accentGreen: '#2D5A4A',   // Heart Emerald (growth, healing)
    accentAmber: '#8B6914',   // Burnished Bronze (earth, grounding)
    accentBurgundy: '#7A3333', // Root Crimson (grounding, passion)
    accentOrange: '#C4702C',  // Sacral Orange (creativity, energy)
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
