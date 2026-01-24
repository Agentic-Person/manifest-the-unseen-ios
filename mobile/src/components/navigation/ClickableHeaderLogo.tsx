/**
 * Clickable Header Logo Component
 *
 * A pressable logo/app name that appears in the header's left side
 * and navigates to the Home screen when tapped.
 */

import React from 'react';
import { Text, Pressable, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { MainTabParamList } from '../../types/navigation';
import { colors } from '../../theme';

/**
 * Clickable Header Logo Component
 *
 * Displays a compact version of the app name in the header as a pressable element.
 * Tapping the logo navigates to the Home tab.
 *
 * @example
 * ```tsx
 * // In a navigator's screenOptions:
 * screenOptions={{
 *   headerLeft: (props) => <ClickableHeaderLogo {...props} />,
 * }}
 * ```
 */
export const ClickableHeaderLogo = () => {
  const navigation = useNavigation<BottomTabNavigationProp<MainTabParamList>>();

  /**
   * Navigate to Home tab when logo is pressed
   */
  const handlePress = () => {
    try {
      // Navigate to the Home tab
      navigation.navigate('Home');
    } catch (error) {
      console.warn('Unable to navigate to Home:', error);
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel="Go to Home"
      accessibilityHint="Returns to the home screen"
    >
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>MTU</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    marginLeft: 16,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
  },
  pressed: {
    opacity: 0.6,
  },
  logoContainer: {
    backgroundColor: colors.primary[500], // Aged Gold
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.primary[400],
  },
  logoText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.background.primary, // Dark text on gold background
    letterSpacing: 1,
  },
});

export default ClickableHeaderLogo;
