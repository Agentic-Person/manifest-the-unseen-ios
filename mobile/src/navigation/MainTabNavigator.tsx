/**
 * Main Tab Navigator
 *
 * Bottom tab navigation for the main app screens.
 * Matches the PRD wireframes with 5 primary tabs.
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { MainTabParamList } from '../types/navigation';

// Import screen components
import HomeScreen from '../screens/HomeScreen';
import { WorkbookNavigator } from './WorkbookNavigator';
import MeditateScreen from '../screens/MeditateScreen';
import JournalScreen from '../screens/JournalScreen';
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
        // Tab bar styling (to be enhanced with design system)
        tabBarActiveTintColor: '#8B5CF6', // Purple primary
        tabBarInactiveTintColor: '#9CA3AF', // Gray
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E5E7EB',
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        // Header styling
        headerStyle: {
          backgroundColor: '#FFFFFF',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: '#E5E7EB',
        },
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: '700',
          color: '#111827',
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
        component={MeditateScreen}
        options={{
          title: 'Meditate',
          tabBarLabel: 'Meditate',
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

export default MainTabNavigator;
