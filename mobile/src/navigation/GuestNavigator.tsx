/**
 * Guest Navigator
 *
 * Navigation stack for anonymous users who haven't signed in yet.
 * Shows PaywallScreen first, with optional auth screens accessible.
 *
 * This allows users to browse and purchase subscriptions without
 * creating an account first (App Store Guideline 5.1.1 compliance).
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { GuestStackParamList } from '../types/navigation';

// Screens
import { PaywallScreen } from '../screens/subscription/PaywallScreen';
import { LoginScreen, SignupScreen, ForgotPasswordScreen } from '../screens/auth';

const Stack = createNativeStackNavigator<GuestStackParamList>();

/**
 * Guest Navigator
 *
 * Handles navigation for anonymous users.
 * PaywallScreen is the initial route - users see subscription options first.
 * Auth screens are available for users who want to sign in or create an account.
 */
export const GuestNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="GuestPaywall"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: {
          backgroundColor: 'transparent',
        },
      }}
    >
      {/* Paywall is the default landing - users can purchase without auth */}
      <Stack.Screen
        name="GuestPaywall"
        component={PaywallScreen}
        options={{
          title: 'Choose Your Path',
        }}
      />

      {/* Auth screens for users who want to sign in */}
      <Stack.Screen
        name="GuestLogin"
        component={LoginScreen}
        options={{
          title: 'Sign In',
          animation: 'slide_from_bottom',
        }}
      />

      <Stack.Screen
        name="GuestSignup"
        component={SignupScreen}
        options={{
          title: 'Create Account',
          animation: 'slide_from_bottom',
        }}
      />

      <Stack.Screen
        name="GuestForgotPassword"
        component={ForgotPasswordScreen}
        options={{
          title: 'Reset Password',
          animation: 'slide_from_bottom',
        }}
      />
    </Stack.Navigator>
  );
};

export default GuestNavigator;
