/**
 * Clickable Header Title Component
 *
 * A pressable header title that navigates to the Home screen when tapped.
 * Used across all navigation stacks to provide consistent navigation back to home.
 */

import React from 'react';
import { Text, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { MainTabParamList } from '../../types/navigation';
import { colors } from '../../theme';

interface ClickableHeaderTitleProps {
  /**
   * Title text to display
   * Defaults to "Manifest the Unseen"
   */
  title?: string;
}

/**
 * Clickable Header Title Component
 *
 * Displays the app name in the navigation header as a pressable element.
 * Tapping the title navigates to the Home tab.
 *
 * @example
 * ```tsx
 * // In a navigator's screenOptions:
 * screenOptions={{
 *   headerTitle: (props) => <ClickableHeaderTitle {...props} />,
 * }}
 * ```
 */
export const ClickableHeaderTitle = ({
  title = 'Manifest the Unseen',
}: ClickableHeaderTitleProps) => {
  const navigation = useNavigation<BottomTabNavigationProp<MainTabParamList>>();

  /**
   * Navigate to Home tab when header title is pressed
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
      <Text style={styles.title}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  pressed: {
    opacity: 0.7,
    backgroundColor: colors.background.secondary,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    textAlign: 'center',
  },
});

export default ClickableHeaderTitle;
