/**
 * Root Navigator
 *
 * Top-level navigation that handles authentication flow.
 * Shows auth screens or main app based on authentication state.
 */

import React, { useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';

// Import navigators and screens
import { MainTabNavigator } from './MainTabNavigator';
import { GuestNavigator } from './GuestNavigator';
import { PaywallScreen } from '../screens/subscription/PaywallScreen';
import { SplashScreen } from '../screens/SplashScreen';
import ManuscriptScreen from '../screens/ManuscriptScreen';
import ObservableScienceScreen from '../screens/ObservableScienceScreen';
import { useAuthStore } from '../stores/authStore';
import { useSubscriptionStore } from '../stores/subscriptionStore';
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
  const {
    authState,
    isLoading: _isLoading,
    initialize,
    setUser,
    setSession,
    setProfile,
  } = useAuthStore();

  // Check subscription state - anonymous users with active subscription should see main app
  const isSubscribed = useSubscriptionStore((state) => state.isSubscribed);

  // Debounce timer for TOKEN_REFRESHED events
  const tokenRefreshDebounceRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Initialize Auth State
   * Restore session and listen for auth state changes
   */
  useEffect(() => {
    // Initialize auth on app launch
    initialize();

    // Listen for auth changes (including token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Always update session and user from Supabase (source of truth)
      setSession(session);
      setUser(session?.user ?? null);

      // Fetch profile when user signs in or token refreshes
      if (
        session?.user &&
        (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION')
      ) {
        // Debounce TOKEN_REFRESHED events to prevent rapid auth state flips during navigation
        if (event === 'TOKEN_REFRESHED') {
          // Clear any existing debounce timer
          if (tokenRefreshDebounceRef.current) {
            clearTimeout(tokenRefreshDebounceRef.current);
          }

          // Set new debounce timer (500ms delay)
          tokenRefreshDebounceRef.current = setTimeout(async () => {
            try {
              const { data: profile } = await supabase
                .from('users')
                .select('*')
                .eq('id', session.user.id)
                .single();

              if (profile) {
                setProfile(profile);
              }
            } catch (err) {
              console.error('[RootNavigator] Failed to fetch profile (debounced):', err);
            }
          }, 500);
        } else {
          // For SIGNED_IN and INITIAL_SESSION, fetch immediately (no debounce)
          try {
            const { data: profile } = await supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (profile) {
              setProfile(profile);
            }
          } catch (err) {
            console.error('[RootNavigator] Failed to fetch profile:', err);
          }
        }
      } else if (event === 'SIGNED_OUT') {
        // Clear any pending debounce timers on sign out
        if (tokenRefreshDebounceRef.current) {
          clearTimeout(tokenRefreshDebounceRef.current);
          tokenRefreshDebounceRef.current = null;
        }
        setProfile(null);
      }
    });

    return () => {
      subscription.unsubscribe();
      // Clean up debounce timer on unmount
      if (tokenRefreshDebounceRef.current) {
        clearTimeout(tokenRefreshDebounceRef.current);
      }
    };
  }, [initialize, setUser, setSession, setProfile]);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        {/* Three-state navigation for App Store Guideline 5.1.1 compliance */}
        {authState === 'loading' && (
          // Loading: Show splash while checking session
          <Stack.Screen name="Splash" component={SplashScreen} />
        )}
        {authState === 'anonymous' && !isSubscribed && (
          // Anonymous without subscription: Show GuestNavigator (paywall first, auth optional)
          // Users can browse and purchase without registration
          <Stack.Screen name="Guest" component={GuestNavigator} />
        )}
        {(authState === 'authenticated' || isSubscribed) && (
          // Authenticated OR subscribed (including dev/TestFlight): Show full app
          <Stack.Screen name="Main" component={MainTabNavigator} />
        )}

        {/* Stack Screens - Accessible from HomeScreen */}
        <Stack.Screen
          name="Manuscript"
          component={ManuscriptScreen}
          options={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="ObservableScience"
          component={ObservableScienceScreen}
          options={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />

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
