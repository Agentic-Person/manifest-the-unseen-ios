/**
 * Main Tab Navigator
 *
 * Bottom tab navigation for the main app screens.
 * 4 primary tabs: Home, Workbook, Meditate, Guru, Profile
 */

import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
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
  return (
    <Tab.Navigator
      screenOptions={{
        // Tab bar styling - Ancient Mystical Design
        tabBarActiveTintColor: colors.primary[500], // Aged Gold (#C4A052)
        tabBarInactiveTintColor: colors.text.tertiary, // Muted gray (#6B6B6B)
        tabBarStyle: {
          backgroundColor: colors.background.primary, // Deep Void (#0A0A0F)
          borderTopColor: colors.border.default, // Subtle gold border rgba(196, 160, 82, 0.15)
          borderTopWidth: 1,
          height: 70, // Compact height
          paddingBottom: 4,
          paddingTop: 2,
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
        // Header styling - DARK MODE
        headerStyle: {
          backgroundColor: colors.background.primary,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: colors.border.default,
        },
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
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name="bulb-outline"
              size={26}
              color={focused ? colors.primary[500] : color}
              style={{ opacity: focused ? 1 : 0.5 }}
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
