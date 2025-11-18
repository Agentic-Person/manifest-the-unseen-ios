/**
 * Auth Navigator
 *
 * Navigation stack for authentication flow.
 * Includes Login, Signup, and Forgot Password screens.
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../types/navigation';

// Auth Screens
import { LoginScreen, SignupScreen, ForgotPasswordScreen } from '../screens/auth';

const Stack = createNativeStackNavigator<AuthStackParamList>();

/**
 * Authentication Navigator
 *
 * Handles navigation between auth screens.
 */
export const AuthNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: {
          backgroundColor: 'transparent',
        },
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          title: 'Sign In',
        }}
      />

      <Stack.Screen
        name="Signup"
        component={SignupScreen}
        options={{
          title: 'Sign Up',
        }}
      />

      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{
          title: 'Reset Password',
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
