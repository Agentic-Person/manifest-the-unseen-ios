/**
 * Root Navigator
 *
 * Top-level navigation that handles authentication flow.
 * Shows auth screens or main app based on authentication state.
 */

import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';

// Import navigators and screens
import { MainTabNavigator } from './MainTabNavigator';
import { useAuthStore } from '../stores/authStore';
import { supabase } from '../services/supabase';

// TODO: Create these auth screens
// import WelcomeScreen from '../screens/auth/WelcomeScreen';
// import SignInScreen from '../screens/auth/SignInScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Root Navigator
 *
 * Manages authentication flow and app navigation.
 *
 * @example
 * ```tsx
 * import { RootNavigator } from '@/navigation/RootNavigator';
 *
 * function App() {
 *   return <RootNavigator />;
 * }
 * ```
 */
export const RootNavigator = () => {
  const { isAuthenticated, setUser, setSession, setLoading } = useAuthStore();

  /**
   * Initialize Auth State
   * Listen for auth state changes and update store
   */
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [setUser, setSession, setLoading]);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        {isAuthenticated ? (
          // Authenticated: Show main app
          <Stack.Screen name="Main" component={MainTabNavigator} />
        ) : (
          // Not authenticated: Show auth flow
          // TODO: Uncomment when auth screens are created
          // <Stack.Screen name="Auth" component={AuthNavigator} />

          // Temporary: Show main app for development
          <Stack.Screen name="Main" component={MainTabNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
