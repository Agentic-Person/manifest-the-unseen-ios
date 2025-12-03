/**
 * Shadow/elevation system for Manifest the Unseen
 *
 * Provides consistent depth hierarchy for cards, modals, and floating elements
 * iOS uses shadow properties, Android uses elevation
 *
 * Usage:
 * - Import: `import { shadows } from '@/theme'`
 * - Access: `...shadows.md` (spread operator)
 * - In styles: `const styles = { container: { ...shadows.sm } }`
 */

import { Platform, ViewStyle } from 'react-native';

/**
 * Shadow type definition
 */
export interface Shadow {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number; // Android
}

/**
 * Create a shadow based on elevation level
 * @param elevation - Elevation level (0-24)
 * @returns Shadow style object
 */
const createShadow = (elevation: number): Shadow => {
  if (Platform.OS === 'android') {
    return {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation,
    };
  }

  // iOS shadow calculation
  // Formula based on Material Design shadow depths
  const shadowOpacity = Math.min(0.2 + elevation * 0.01, 0.3);
  const shadowRadius = elevation * 0.5;
  const shadowOffsetHeight = elevation * 0.5;

  return {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: shadowOffsetHeight,
    },
    shadowOpacity,
    shadowRadius,
    elevation, // Keep for consistency
  };
};

/**
 * Pre-defined shadow levels
 * Following Material Design elevation system
 */
export const shadows = {
  // No elevation (flat)
  none: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  } as Shadow,

  // Extra small elevation (subtle depth)
  xs: createShadow(2),

  // Small elevation (raised elements)
  sm: createShadow(4),

  // Medium elevation (cards)
  md: createShadow(8),

  // Large elevation (floating action buttons, modals)
  lg: createShadow(12),

  // Extra large elevation (dialogs)
  xl: createShadow(16),

  // 2x extra large (bottom sheets)
  '2xl': createShadow(20),

  // Maximum elevation (top-level overlays)
  max: createShadow(24),
} as const;

/**
 * Component-specific shadow presets
 * Enhanced with golden glow effects for ancient mystical design
 */
export const componentShadows = {
  // Cards with subtle golden tint for Deep Void (#0A0A0F) background
  card: {
    shadowColor: '#C4A052', // Aged Gold tint
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  } as Shadow,
  cardPressed: shadows.md,
  cardElevated: {
    shadowColor: '#C4A052', // Aged Gold tint
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  } as Shadow,

  // Buttons with golden glow
  button: {
    shadowColor: '#C4A052', // Aged Gold
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  } as Shadow,
  buttonPressed: shadows.xs,
  fab: shadows.lg, // Floating action button

  // Modals and dialogs
  modal: shadows.xl,
  dialog: shadows['2xl'],
  bottomSheet: shadows.max,

  // Navigation elements
  header: shadows.sm,
  tabBar: shadows.sm,

  // Input elements
  input: shadows.none,
  inputFocused: shadows.xs,

  // Dropdown/menu
  dropdown: shadows.lg,
  menu: shadows.md,
} as const;

/**
 * Inner shadow effect (for inputs, pressed states)
 * Note: React Native doesn't support inner shadows natively
 * This creates a border effect that mimics inner shadow
 */
export const innerShadow = {
  borderWidth: 1,
  borderColor: 'rgba(0, 0, 0, 0.08)',
} as ViewStyle;

/**
 * Glow effect (for focused states, special highlights)
 * Ancient mystical design system with golden glow effects
 */
export const glow = {
  // Primary golden glow (Aged Gold)
  primary: {
    shadowColor: '#C4A052', // Aged Gold
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  } as Shadow,

  // Golden glow for mystical elements
  glowGold: {
    shadowColor: '#C4A052', // Aged Gold
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  } as Shadow,

  // Amber glow for active/interactive states
  glowAmber: {
    shadowColor: '#D4A84B', // Amber Glow
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  } as Shadow,

  // Bronze glow for subtle emphasis
  glowBronze: {
    shadowColor: '#8B6914', // Burnished Bronze
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  } as Shadow,

  secondary: {
    shadowColor: '#fbbf24', // secondary-400
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  } as Shadow,

  success: {
    shadowColor: '#22c55e', // success-500
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  } as Shadow,

  error: {
    shadowColor: '#dc2626', // error-600
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  } as Shadow,
} as const;

/**
 * Types for TypeScript autocomplete
 */
export type ShadowLevel = keyof typeof shadows;
export type GlowColor = keyof typeof glow;
