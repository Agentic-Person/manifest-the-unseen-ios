/**
 * App Root Component
 *
 * Main entry point for the Manifest the Unseen iOS app.
 * Sets up providers for navigation, state management, and server state.
 */

import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';

// Import services and navigation
import { queryClient } from './src/services/queryClient';
import { RootNavigator } from './src/navigation/RootNavigator';
import { configurePurchases, setUserId } from './src/services/subscriptionService';

// Import stores for initialization
import { useAppStore } from './src/stores/appStore';
import { useSubscriptionStore } from './src/stores/subscriptionStore';
import { useAuthStore } from './src/stores/authStore';

/**
 * App Component
 */
const App = () => {
  const setAppReady = useAppStore((state) => state.setAppReady);
  const loadSubscription = useSubscriptionStore((state) => state.loadSubscription);
  const loadOfferings = useSubscriptionStore((state) => state.loadOfferings);
  const user = useAuthStore((state) => state.user);

  /**
   * Initialize App
   */
  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('🚀 Initializing Manifest the Unseen...');

        // 1. Initialize RevenueCat SDK
        await configurePurchases();
        console.log('✅ RevenueCat initialized');

        // 2. If user is logged in, sync their ID with RevenueCat
        if (user?.id) {
          await setUserId(user.id);
          console.log('✅ RevenueCat user ID synced:', user.id);
        }

        // 3. Load subscription state
        await loadSubscription();
        console.log('✅ Subscription state loaded');

        // 4. Load available subscription offerings
        await loadOfferings();
        console.log('✅ Subscription offerings loaded');

        // TODO: Add any other initialization logic here
        // - Load cached data
        // - Check for updates
        // - Initialize analytics
        // - Request permissions

        // Mark app as ready
        setAppReady(true);
        console.log('✅ App ready');
      } catch (error) {
        console.error('❌ App initialization error:', error);
        // Still mark as ready to show error screen
        setAppReady(true);
      }
    };

    initializeApp();
  }, [setAppReady, loadSubscription, loadOfferings, user]);

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <RootNavigator />
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
