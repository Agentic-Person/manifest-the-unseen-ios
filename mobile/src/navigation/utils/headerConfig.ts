/**
 * Header Configuration Utilities
 *
 * Centralized header options for navigation screens
 */

import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { colors } from '../../theme';

/**
 * Default header options for child screens (with back button)
 * Use this for most screens that should allow navigating back
 */
export const childScreenHeaderOptions: NativeStackNavigationOptions = {
  headerStyle: {
    backgroundColor: colors.background.primary,
  },
  headerTitleStyle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
  },
  headerTintColor: colors.primary[600],
  headerShadowVisible: false,
  headerBackTitleVisible: false,
  // Back button is visible by default (headerBackVisible is not set to false)
};

/**
 * Dark theme header options (with back button)
 * Use this for screens with dark backgrounds
 */
export const darkChildScreenHeaderOptions: NativeStackNavigationOptions = {
  headerStyle: {
    backgroundColor: colors.dark?.bgPrimary || '#1a1a2e',
  },
  headerTitleStyle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.dark?.textPrimary || '#e8e8e8',
  },
  headerTintColor: colors.dark?.accentGold || '#c9a227',
  headerShadowVisible: false,
  headerBackTitleVisible: false,
};
