/**
 * Meditate Navigator
 *
 * Stack navigator for meditation screens.
 * Handles navigation from meditation list to player.
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { MeditateStackParamList } from '../types/navigation';
import { colors } from '../theme';

// Import screens
import MeditateScreen from '../screens/MeditateScreen';
import MeditationPlayerScreen from '../screens/meditation/MeditationPlayerScreen';

const Stack = createNativeStackNavigator<MeditateStackParamList>();

/**
 * Meditate Navigator
 *
 * Stack navigation for meditation features:
 * - MeditateHome: Main meditation hub with tabs
 * - MeditationPlayer: Full-screen audio player
 */
export const MeditateNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background.primary,
        },
        headerTintColor: colors.text.primary,
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 18,
        },
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: colors.background.primary,
        },
      }}
    >
      <Stack.Screen
        name="MeditateHome"
        component={MeditateScreen}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="MeditationPlayer"
        component={MeditationPlayerScreen}
        options={{
          headerShown: false,
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
    </Stack.Navigator>
  );
};

export default MeditateNavigator;
