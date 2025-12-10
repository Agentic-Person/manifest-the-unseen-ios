/**
 * Main Tab Navigator
 *
 * Bottom tab navigation for the main app screens.
 * 4 primary tabs: Home, Workbook, Meditate, Guru, Profile
 */

import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { MainTabParamList } from '../types/navigation';
import { colors } from '../theme';
import { BackgroundImages } from '../assets';

// Import screen components
import HomeScreen from '../screens/HomeScreen';
import { WorkbookNavigator } from './WorkbookNavigator';
import { MeditateNavigator } from './MeditateNavigator';
import GuruScreen from '../screens/GuruScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

/**
 * Main Tab Navigator
 *
 * @example
 * ```tsx
 * import { MainTabNavigator } from '@/navigation/MainTabNavigator';
 *
 * function App() {
 *   return (
 *     <NavigationContainer>
 *       <MainTabNavigator />
 *     </NavigationContainer>
 *   );
 * }
 * ```
 */
export const MainTabNavigator = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        // Tab bar styling - Ancient Mystical Design with transparency
        tabBarActiveTintColor: colors.primary[500], // Aged Gold (#C4A052)
        tabBarInactiveTintColor: colors.text.tertiary, // Muted gray (#6B6B6B)
        tabBarStyle: {
          backgroundColor: 'rgba(10, 10, 15, 0.85)', // Semi-transparent Deep Void
          borderTopColor: colors.border.default, // Subtle gold border
          borderTopWidth: 1,
          height: 60 + insets.bottom, // Dynamic height based on safe area
          paddingBottom: insets.bottom, // Safe area padding for home indicator
          paddingTop: 8,
          position: 'absolute', // Float above content
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          letterSpacing: 0.5, // Refined spacing
          marginTop: -2, // Tighter gap between icon and label
        },
        tabBarIconStyle: {
          marginBottom: -4, // Pull icon down closer to label
        },
        // Header styling - Transparent to show global background
        headerStyle: {
          backgroundColor: 'transparent',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
        headerTransparent: true,
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: '700',
          color: colors.text.primary,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
          headerShown: false, // HomeScreen handles its own layout
          tabBarIcon: ({ focused }) => (
            <Image
              source={BackgroundImages.home}
              style={[
                styles.tabIcon,
                { opacity: focused ? 1 : 0.5 },
              ]}
              resizeMode="contain"
            />
          ),
        }}
      />

      <Tab.Screen
        name="Workbook"
        component={WorkbookNavigator}
        options={{
          title: 'Workbook',
          tabBarLabel: 'Workbook',
          headerShown: false, // WorkbookNavigator handles its own headers
          tabBarIcon: ({ focused }) => (
            <Image
              source={BackgroundImages.workbook}
              style={[
                styles.tabIcon,
                { opacity: focused ? 1 : 0.5 },
              ]}
              resizeMode="contain"
            />
          ),
        }}
      />

      <Tab.Screen
        name="Meditate"
        component={MeditateNavigator}
        options={{
          title: 'Meditate',
          tabBarLabel: 'Meditate',
          headerShown: false, // MeditateNavigator handles its own headers
          tabBarIcon: ({ focused }) => (
            <Image
              source={BackgroundImages.meditate}
              style={[
                styles.tabIcon,
                { opacity: focused ? 1 : 0.5 },
              ]}
              resizeMode="contain"
            />
          ),
        }}
      />

      <Tab.Screen
        name="Guru"
        component={GuruScreen}
        options={{
          title: 'Guru',
          tabBarLabel: 'Guru',
          tabBarIcon: ({ focused }) => (
            <Image
              source={BackgroundImages.guru}
              style={[
                styles.tabIcon,
                { opacity: focused ? 1 : 0.5 },
              ]}
              resizeMode="contain"
            />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
          // TODO: Add icon when design system is ready
          // tabBarIcon: ({ color, size }) => (
          //   <ProfileIcon color={color} size={size} />
          // ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabIcon: {
    width: 30,
    height: 30,
  },
});

export default MainTabNavigator;
