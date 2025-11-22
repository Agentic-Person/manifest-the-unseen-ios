/**
 * Workbook Navigator
 *
 * Stack navigator for the workbook feature containing all phases
 * and their exercises. Nested within the main tab navigator.
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { WorkbookStackParamList } from '../types/navigation';
import { colors } from '../theme';

// Import screens
import WorkbookScreen from '../screens/WorkbookScreen';
import Phase1Dashboard from '../screens/workbook/Phase1/Phase1Dashboard';
import WheelOfLifeScreen from '../screens/workbook/Phase1/WheelOfLifeScreen';
import SWOTScreen from '../screens/workbook/Phase1/SWOTScreen';

const Stack = createNativeStackNavigator<WorkbookStackParamList>();

/**
 * Default screen options for workbook screens
 */
const screenOptions = {
  headerStyle: {
    backgroundColor: colors.background.primary,
  },
  headerTitleStyle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.text.primary,
  },
  headerTintColor: colors.primary[600],
  headerShadowVisible: false,
  headerBackTitleVisible: false,
};

/**
 * Workbook Navigator Component
 *
 * Contains all workbook-related screens organized by phase.
 */
export const WorkbookNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      {/* Main Workbook Home - List of Phases */}
      <Stack.Screen
        name="WorkbookHome"
        component={WorkbookScreen}
        options={{
          headerShown: false, // Uses tab header
        }}
      />

      {/* Phase 1: Self-Evaluation */}
      <Stack.Screen
        name="Phase1Dashboard"
        component={Phase1Dashboard}
        options={{
          title: 'Phase 1: Self-Evaluation',
        }}
      />
      <Stack.Screen
        name="WheelOfLife"
        component={WheelOfLifeScreen}
        options={{
          title: 'Wheel of Life',
        }}
      />
      <Stack.Screen
        name="SWOT"
        component={SWOTScreen}
        options={{
          title: 'SWOT Analysis',
        }}
      />

      {/* TODO: Add remaining Phase 1 screens */}
      {/* FeelWheel, HabitTracking, ABCModel, PersonalValues, etc. */}

      {/* TODO: Add Phase 2-10 screens as they're built */}
    </Stack.Navigator>
  );
};

export default WorkbookNavigator;
