/**
 * Splash Screen
 *
 * Shown while the app is initializing and checking authentication state.
 * Displays a simple loading indicator with the app branding.
 */

import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing } from '../theme';

export const SplashScreen = () => {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <LinearGradient
        colors={[colors.background.primary, colors.background.purple]}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Manifest the Unseen</Text>
          <ActivityIndicator
            size="large"
            color={colors.brand.gold}
            style={styles.loader}
          />
          <Text style={styles.subtitle}>Loading your journey...</Text>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  loader: {
    marginBottom: spacing.lg,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.secondary,
    textAlign: 'center',
  },
});

export default SplashScreen;
