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
import { AuthNavigator } from './AuthNavigator';
import { PaywallScreen } from '../screens/subscription/PaywallScreen';
import { useAuthStore } from '../stores/authStore';
import { supabase } from '../services/supabase';

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
  const { isAuthenticated, isLoading: _isLoading, initialize, setUser, setSession, setProfile } = useAuthStore();

  /**
   * Initialize Auth State
   * Restore session and listen for auth state changes
   */
  useEffect(() => {
    // Initialize auth on app launch
    initialize();

    // Skip Supabase listener in dev mode
    if (process.env.EXPO_PUBLIC_DEV_SKIP_AUTH === 'true') {
      return;
    }

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      // Fetch profile when user signs in
      if (session?.user) {
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          setProfile(profile);
        }
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [initialize, setUser, setSession, setProfile]);

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
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}

        {/* Modal Screens - Available from anywhere */}
        <Stack.Group screenOptions={{ presentation: 'modal' }}>
          <Stack.Screen
            name="Paywall"
            component={PaywallScreen}
            options={{
              headerShown: false,
              gestureEnabled: true,
            }}
          />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
