/**
 * Main Tab Navigator
 *
 * Bottom tab navigation for the main app screens.
 * Matches the PRD wireframes with 5 primary tabs.
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { MainTabParamList } from '../types/navigation';
import { colors } from '../theme';

// Import screen components
import HomeScreen from '../screens/HomeScreen';
import { WorkbookNavigator } from './WorkbookNavigator';
import { MeditateNavigator } from './MeditateNavigator';
import JournalScreen from '../screens/JournalScreen';
import { AIChatScreen } from '../screens/AIChatScreen';
import ProfileScreen from '../screens/ProfileScreen';
import NewJournalEntryScreen from '../screens/NewJournalEntryScreen';

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
          height: 80, // Generous spacing like temple courtyard
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          letterSpacing: 0.5, // Refined spacing
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
          // TODO: Add icon when design system is ready
          // tabBarIcon: ({ color, size }) => (
          //   <HomeIcon color={color} size={size} />
          // ),
        }}
      />

      <Tab.Screen
        name="Workbook"
        component={WorkbookNavigator}
        options={{
          title: 'Workbook',
          tabBarLabel: 'Workbook',
          headerShown: false, // WorkbookNavigator handles its own headers
          // TODO: Add icon when design system is ready
          // tabBarIcon: ({ color, size }) => (
          //   <BookIcon color={color} size={size} />
          // ),
        }}
      />

      <Tab.Screen
        name="Meditate"
        component={MeditateNavigator}
        options={{
          title: 'Meditate',
          tabBarLabel: 'Meditate',
          headerShown: false, // MeditateNavigator handles its own headers
          // TODO: Add icon when design system is ready
          // tabBarIcon: ({ color, size }) => (
          //   <MeditateIcon color={color} size={size} />
          // ),
        }}
      />

      <Tab.Screen
        name="Journal"
        component={JournalScreen}
        options={{
          title: 'Journal',
          tabBarLabel: 'Journal',
          // TODO: Add icon when design system is ready
          // tabBarIcon: ({ color, size }) => (
          //   <JournalIcon color={color} size={size} />
          // ),
        }}
      />

      <Tab.Screen
        name="Wisdom"
        component={AIChatScreen}
        options={{
          title: 'Wisdom',
          tabBarLabel: 'Wisdom',
          // TODO: Add icon when design system is ready
          // tabBarIcon: ({ color, size }) => (
          //   <WisdomIcon color={color} size={size} />
          // ),
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

      {/* NewJournalEntry Screen - Hidden from tab bar */}
      <Tab.Screen
        name="NewJournalEntry"
        component={NewJournalEntryScreen}
        options={{
          title: 'New Entry',
          tabBarButton: () => null, // Hide from tab bar
          headerShown: true,
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
          headerTintColor: colors.text.primary,
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
