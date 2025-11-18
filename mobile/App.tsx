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

// Import stores for initialization
import { useAppStore } from './src/stores/appStore';

/**
 * App Component
 */
const App = () => {
  const setAppReady = useAppStore((state) => state.setAppReady);

  /**
   * Initialize App
   */
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // TODO: Add any initialization logic here
        // - Load cached data
        // - Check for updates
        // - Initialize analytics
        // - Request permissions

        // Mark app as ready
        setAppReady(true);
      } catch (error) {
        console.error('App initialization error:', error);
        // Still mark as ready to show error screen
        setAppReady(true);
      }
    };

    initializeApp();
  }, [setAppReady]);

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
