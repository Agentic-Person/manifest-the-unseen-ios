/**
 * Profile Navigator
 *
 * Stack navigator for profile and settings screens.
 * Handles navigation from profile home to various settings screens.
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { ProfileStackParamList } from '../types/navigation';
import { colors } from '../theme';
import { ClickableHeaderLogo } from '../components';

// Import screens
import ProfileScreen from '../screens/ProfileScreen';
import AccountSettingsScreen from '../screens/profile/AccountSettingsScreen';
import NotificationsScreen from '../screens/profile/NotificationsScreen';
import AppearanceScreen from '../screens/profile/AppearanceScreen';
import PrivacySecurityScreen from '../screens/profile/PrivacySecurityScreen';
import HelpCenterScreen from '../screens/profile/HelpCenterScreen';
import AboutScreen from '../screens/profile/AboutScreen';
import PrivacyPolicyScreen from '../screens/profile/PrivacyPolicyScreen';
import TermsOfServiceScreen from '../screens/profile/TermsOfServiceScreen';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

/**
 * Profile Navigator
 *
 * Stack navigation for profile and settings:
 * - ProfileHome: Main profile screen with user info and settings links
 * - AccountSettings: Edit profile name, view email
 * - Notifications: Push notification preferences
 * - Appearance: Theme, font size, reduced motion
 * - PrivacySecurity: Biometric lock, analytics toggles
 * - HelpCenter: Contact form
 * - About: App info and legal docs
 */
export const ProfileNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background.primary,
        },
        headerTintColor: colors.text.primary,
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 18,
        },
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: colors.background.primary,
        },
        headerLeft: () => <ClickableHeaderLogo />,
        headerBackVisible: false, // Hide default back button since we're using custom headerLeft
      }}
    >
      <Stack.Screen
        name="ProfileHome"
        component={ProfileScreen}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="AccountSettings"
        component={AccountSettingsScreen}
        options={{
          title: 'Account Settings',
        }}
      />

      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          title: 'Notifications',
        }}
      />

      <Stack.Screen
        name="Appearance"
        component={AppearanceScreen}
        options={{
          title: 'Appearance',
        }}
      />

      <Stack.Screen
        name="PrivacySecurity"
        component={PrivacySecurityScreen}
        options={{
          title: 'Privacy & Security',
        }}
      />

      <Stack.Screen
        name="HelpCenter"
        component={HelpCenterScreen}
        options={{
          title: 'Help Center',
        }}
      />

      <Stack.Screen
        name="About"
        component={AboutScreen}
        options={{
          title: 'About',
        }}
      />

      <Stack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicyScreen}
        options={{
          title: 'Privacy Policy',
        }}
      />

      <Stack.Screen
        name="TermsOfService"
        component={TermsOfServiceScreen}
        options={{
          title: 'Terms of Service',
        }}
      />
    </Stack.Navigator>
  );
};

export default ProfileNavigator;
