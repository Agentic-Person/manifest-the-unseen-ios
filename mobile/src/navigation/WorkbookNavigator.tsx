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
// SWOT Analysis - New organic flower petal layout (dark spiritual theme)
import SWOTAnalysisScreen from '../screens/workbook/Phase1/SWOTAnalysisScreen';
import ValuesAssessmentScreen from '../screens/workbook/Phase1/ValuesAssessmentScreen';
import HabitsAuditScreen from '../screens/workbook/Phase1/HabitsAuditScreen';
// Phase 2: Values & Vision screens
import { Phase2Dashboard, VisionBoardScreen, LifeMissionScreen } from '../screens/workbook/Phase2';
// Phase 3: Goal Setting screens
import { Phase3Dashboard, SMARTGoalsScreen, TimelineScreen, ActionPlanScreen } from '../screens/workbook/Phase3';
// Phase 4: Facing Fears & Limiting Beliefs screens
import { Phase4Dashboard, FearInventoryScreen, LimitingBeliefsScreen, FearFacingPlanScreen } from '../screens/workbook/Phase4';
// Phase 5: Cultivating Self-Love & Self-Care screens
import {
  Phase5Dashboard,
  SelfLoveAffirmationsScreen,
  SelfCareRoutineScreen,
  InnerChildScreen,
} from '../screens/workbook/Phase5';
// Phase 6: Manifestation Techniques screens
import { Phase6Dashboard, ThreeSixNineScreen, ScriptingScreen, WOOPScreen } from '../screens/workbook/Phase6';
// Phase 7: Practicing Gratitude screens
import { Phase7Dashboard, GratitudeJournalScreen, GratitudeLettersScreen, GratitudeMeditationScreen } from '../screens/workbook/Phase7';
// Phase 8: Turning Envy Into Inspiration screens
import { Phase8Dashboard, EnvyInventoryScreen, InspirationReframeScreen, RoleModelsScreen } from '../screens/workbook/Phase8';
// Phase 9: Trust & Surrender screens
import { Phase9Dashboard, TrustAssessmentScreen, SurrenderPracticeScreen, SignsScreen } from '../screens/workbook/Phase9';
// Phase 10: Trust & Letting Go screens
import { Phase10Dashboard, JourneyReviewScreen, FutureLetterScreen, GraduationScreen } from '../screens/workbook/Phase10';

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

      {/* Phase 2: Values & Vision */}
      <Stack.Screen
        name="Phase2Dashboard"
        component={Phase2Dashboard}
        options={{
          title: 'Phase 2: Values & Vision',
        }}
      />

      {/* Phase 3: Goal Setting */}
      <Stack.Screen
        name="Phase3Dashboard"
        component={Phase3Dashboard}
        options={{
          title: 'Phase 3: Goal Setting',
        }}
      />

      {/* Phase 4: Facing Fears & Limiting Beliefs */}
      <Stack.Screen
        name="Phase4Dashboard"
        component={Phase4Dashboard}
        options={{
          title: 'Phase 4: Facing Fears',
        }}
      />

      {/* Phase 5: Cultivating Self-Love & Self-Care */}
      <Stack.Screen
        name="Phase5Dashboard"
        component={Phase5Dashboard}
        options={{
          title: 'Phase 5: Self-Love & Care',
        }}
      />

      {/* Phase 6: Manifestation Techniques */}
      <Stack.Screen
        name="Phase6Dashboard"
        component={Phase6Dashboard}
        options={{
          title: 'Phase 6: Manifestation',
        }}
      />

      {/* Phase 7: Practicing Gratitude */}
      <Stack.Screen
        name="Phase7Dashboard"
        component={Phase7Dashboard}
        options={{
          title: 'Phase 7: Gratitude',
        }}
      />

      {/* Phase 8: Turning Envy Into Inspiration */}
      <Stack.Screen
        name="Phase8Dashboard"
        component={Phase8Dashboard}
        options={{
          title: 'Phase 8: Envy to Inspiration',
        }}
      />

      {/* Phase 9: Trust & Surrender */}
      <Stack.Screen
        name="Phase9Dashboard"
        component={Phase9Dashboard}
        options={{
          title: 'Phase 9: Trust & Surrender',
        }}
      />

      {/* Phase 10: Trust & Letting Go */}
      <Stack.Screen
        name="Phase10Dashboard"
        component={Phase10Dashboard}
        options={{
          title: 'Phase 10: Letting Go',
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
        component={SWOTAnalysisScreen}
        options={{
          title: 'SWOT Analysis',
          // Dark theme header for SWOT screen
          headerStyle: {
            backgroundColor: colors.dark?.bgPrimary || '#1a1a2e',
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '700',
            color: colors.dark?.textPrimary || '#e8e8e8',
          },
          headerTintColor: colors.dark?.accentGold || '#c9a227',
        }}
      />
      <Stack.Screen
        name="PersonalValues"
        component={ValuesAssessmentScreen}
        options={{
          title: 'Personal Values',
        }}
      />
      <Stack.Screen
        name="HabitTracking"
        component={HabitsAuditScreen}
        options={{
          title: 'Habit Tracking',
        }}
      />

      {/* TODO: Add remaining Phase 1 screens */}
      {/* FeelWheel, ABCModel, etc. */}

      {/* Phase 2: Values & Vision */}
      <Stack.Screen
        name="LifeMission"
        component={LifeMissionScreen}
        options={{
          title: 'Life Mission',
          // Dark theme header for Life Mission screen
          headerStyle: {
            backgroundColor: colors.dark?.bgPrimary || '#1a1a2e',
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '700',
            color: colors.dark?.textPrimary || '#e8e8e8',
          },
          headerTintColor: colors.dark?.accentGold || '#c9a227',
        }}
      />
      <Stack.Screen
        name="VisionBoard"
        component={VisionBoardScreen}
        options={{
          title: 'Vision Board',
          // Dark theme header for Vision Board screen
          headerStyle: {
            backgroundColor: colors.dark?.bgPrimary || '#1a1a2e',
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '700',
            color: colors.dark?.textPrimary || '#e8e8e8',
          },
          headerTintColor: colors.dark?.accentGold || '#c9a227',
        }}
      />

      {/* Phase 3: Goal Setting */}
      <Stack.Screen
        name="SMARTGoals"
        component={SMARTGoalsScreen}
        options={{
          title: 'SMART Goals',
          // Dark theme header for SMART Goals screen
          headerStyle: {
            backgroundColor: colors.dark?.bgPrimary || '#1a1a2e',
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '700',
            color: colors.dark?.textPrimary || '#e8e8e8',
          },
          headerTintColor: colors.dark?.accentGold || '#c9a227',
        }}
      />
      <Stack.Screen
        name="Timeline"
        component={TimelineScreen}
        options={{
          title: 'Goal Timeline',
          // Dark theme header for Timeline screen
          headerStyle: {
            backgroundColor: colors.dark?.bgPrimary || '#1a1a2e',
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '700',
            color: colors.dark?.textPrimary || '#e8e8e8',
          },
          headerTintColor: colors.dark?.accentGold || '#c9a227',
        }}
      />
      <Stack.Screen
        name="ActionPlan"
        component={ActionPlanScreen}
        options={{
          title: 'Action Plan',
          // Dark theme header for Action Plan screen
          headerStyle: {
            backgroundColor: colors.dark?.bgPrimary || '#1a1a2e',
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '700',
            color: colors.dark?.textPrimary || '#e8e8e8',
          },
          headerTintColor: colors.dark?.accentGold || '#c9a227',
        }}
      />

      {/* Phase 4: Facing Fears & Limiting Beliefs */}
      <Stack.Screen
        name="FearInventory"
        component={FearInventoryScreen}
        options={{
          title: 'Fear Inventory',
          // Dark theme header for Fear Inventory screen
          headerStyle: {
            backgroundColor: colors.dark?.bgPrimary || '#1a1a2e',
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '700',
            color: colors.dark?.textPrimary || '#e8e8e8',
          },
          headerTintColor: colors.dark?.accentGold || '#c9a227',
        }}
      />
      <Stack.Screen
        name="LimitingBeliefs"
        component={LimitingBeliefsScreen}
        options={{
          title: 'Limiting Beliefs',
          // Dark theme header for Limiting Beliefs screen
          headerStyle: {
            backgroundColor: colors.dark?.bgPrimary || '#1a1a2e',
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '700',
            color: colors.dark?.textPrimary || '#e8e8e8',
          },
          headerTintColor: colors.dark?.accentGold || '#c9a227',
        }}
      />
      <Stack.Screen
        name="FearFacingPlan"
        component={FearFacingPlanScreen}
        options={{
          title: 'Fear Facing Plan',
          // Dark theme header for Fear Facing Plan screen
          headerStyle: {
            backgroundColor: colors.dark?.bgPrimary || '#1a1a2e',
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '700',
            color: colors.dark?.textPrimary || '#e8e8e8',
          },
          headerTintColor: colors.dark?.accentGold || '#c9a227',
        }}
      />

      {/* Phase 5: Cultivating Self-Love & Self-Care */}
      <Stack.Screen
        name="SelfLoveAffirmations"
        component={SelfLoveAffirmationsScreen}
        options={{
          title: 'Self-Love Affirmations',
          // Dark theme header for Self-Love Affirmations screen
          headerStyle: {
            backgroundColor: colors.dark?.bgPrimary || '#1a1a2e',
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '700',
            color: colors.dark?.textPrimary || '#e8e8e8',
          },
          headerTintColor: colors.dark?.accentGold || '#c9a227',
        }}
      />
      <Stack.Screen
        name="SelfCareRoutine"
        component={SelfCareRoutineScreen}
        options={{
          title: 'Self-Care Routines',
          // Dark theme header for Self-Care Routine screen
          headerStyle: {
            backgroundColor: colors.dark?.bgPrimary || '#1a1a2e',
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '700',
            color: colors.dark?.textPrimary || '#e8e8e8',
          },
          headerTintColor: colors.dark?.accentGold || '#c9a227',
        }}
      />
      <Stack.Screen
        name="InnerChild"
        component={InnerChildScreen}
        options={{
          title: 'Inner Child Healing',
          // Dark theme header with softer accent for nurturing feel
          headerStyle: {
            backgroundColor: colors.dark?.bgPrimary || '#1a1a2e',
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '700',
            color: colors.dark?.textPrimary || '#e8e8e8',
          },
          headerTintColor: '#6b5b8a', // Softer lavender for inner child work
        }}
      />

      {/* Phase 6: Manifestation Techniques */}
      <Stack.Screen
        name="ThreeSixNine"
        component={ThreeSixNineScreen}
        options={{
          title: '3-6-9 Method',
          // Dark theme header for ThreeSixNine screen
          headerStyle: {
            backgroundColor: colors.dark?.bgPrimary || '#1a1a2e',
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '700',
            color: colors.dark?.textPrimary || '#e8e8e8',
          },
          headerTintColor: colors.dark?.accentGold || '#c9a227',
        }}
      />
      <Stack.Screen
        name="Scripting"
        component={ScriptingScreen}
        options={{
          title: 'Scripting',
          // Dark theme header for Scripting screen
          headerStyle: {
            backgroundColor: colors.dark?.bgPrimary || '#1a1a2e',
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '700',
            color: colors.dark?.textPrimary || '#e8e8e8',
          },
          headerTintColor: colors.dark?.accentGold || '#c9a227',
        }}
      />
      <Stack.Screen
        name="WOOP"
        component={WOOPScreen}
        options={{
          title: 'WOOP Method',
          // Dark theme header for WOOP screen
          headerStyle: {
            backgroundColor: colors.dark?.bgPrimary || '#1a1a2e',
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '700',
            color: colors.dark?.textPrimary || '#e8e8e8',
          },
          headerTintColor: colors.dark?.accentGold || '#c9a227',
        }}
      />

      {/* Phase 7: Practicing Gratitude */}
      <Stack.Screen
        name="GratitudeJournal"
        component={GratitudeJournalScreen}
        options={{
          title: 'Gratitude Journal',
          // Dark theme header for Gratitude Journal screen
          headerStyle: {
            backgroundColor: colors.dark?.bgPrimary || '#1a1a2e',
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '700',
            color: colors.dark?.textPrimary || '#e8e8e8',
          },
          headerTintColor: colors.dark?.accentGold || '#c9a227',
        }}
      />
      <Stack.Screen
        name="GratitudeLetters"
        component={GratitudeLettersScreen}
        options={{
          title: 'Gratitude Letters',
          // Dark theme header for Gratitude Letters screen
          headerStyle: {
            backgroundColor: colors.dark?.bgPrimary || '#1a1a2e',
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '700',
            color: colors.dark?.textPrimary || '#e8e8e8',
          },
          headerTintColor: colors.dark?.accentGold || '#c9a227',
        }}
      />
      <Stack.Screen
        name="GratitudeMeditation"
        component={GratitudeMeditationScreen}
        options={{
          title: 'Gratitude Meditation',
          // Dark theme header for Gratitude Meditation screen
          headerStyle: {
            backgroundColor: colors.dark?.bgPrimary || '#1a1a2e',
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '700',
            color: colors.dark?.textPrimary || '#e8e8e8',
          },
          headerTintColor: colors.dark?.accentGold || '#c9a227',
        }}
      />

      {/* Phase 8: Turning Envy Into Inspiration */}
      <Stack.Screen
        name="EnvyInventory"
        component={EnvyInventoryScreen}
        options={{
          title: 'Envy Inventory',
          // Dark theme header for Envy Inventory screen
          headerStyle: {
            backgroundColor: colors.dark?.bgPrimary || '#1a1a2e',
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '700',
            color: colors.dark?.textPrimary || '#e8e8e8',
          },
          headerTintColor: colors.dark?.accentGold || '#c9a227',
        }}
      />
      <Stack.Screen
        name="InspirationReframe"
        component={InspirationReframeScreen}
        options={{
          title: 'Inspiration Reframe',
          // Dark theme header for Inspiration Reframe screen
          headerStyle: {
            backgroundColor: colors.dark?.bgPrimary || '#1a1a2e',
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '700',
            color: colors.dark?.textPrimary || '#e8e8e8',
          },
          headerTintColor: colors.dark?.accentGold || '#c9a227',
        }}
      />
      <Stack.Screen
        name="RoleModels"
        component={RoleModelsScreen}
        options={{
          title: 'Role Models',
          // Dark theme header for Role Models screen
          headerStyle: {
            backgroundColor: colors.dark?.bgPrimary || '#1a1a2e',
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '700',
            color: colors.dark?.textPrimary || '#e8e8e8',
          },
          headerTintColor: colors.dark?.accentGold || '#c9a227',
        }}
      />

      {/* Phase 9: Trust & Surrender - screens already registered above */}
      <Stack.Screen
        name="TrustAssessment"
        component={TrustAssessmentScreen}
        options={{
          title: 'Trust Assessment',
          headerStyle: {
            backgroundColor: colors.dark?.bgPrimary || '#1a1a2e',
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '700',
            color: colors.dark?.textPrimary || '#e8e8e8',
          },
          headerTintColor: colors.dark?.accentGold || '#c9a227',
        }}
      />
      <Stack.Screen
        name="SurrenderPractice"
        component={SurrenderPracticeScreen}
        options={{
          title: 'Surrender Practice',
          headerStyle: {
            backgroundColor: colors.dark?.bgPrimary || '#1a1a2e',
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '700',
            color: colors.dark?.textPrimary || '#e8e8e8',
          },
          headerTintColor: colors.dark?.accentGold || '#c9a227',
        }}
      />
      <Stack.Screen
        name="Signs"
        component={SignsScreen}
        options={{
          title: 'Signs & Synchronicities',
          headerStyle: {
            backgroundColor: colors.dark?.bgPrimary || '#1a1a2e',
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '700',
            color: colors.dark?.textPrimary || '#e8e8e8',
          },
          headerTintColor: colors.dark?.accentGold || '#c9a227',
        }}
      />

      {/* Phase 10: Trust & Letting Go - FINAL PHASE */}
      <Stack.Screen
        name="JourneyReview"
        component={JourneyReviewScreen}
        options={{
          title: 'Journey Review',
          // Celebratory gold theme for Phase 10
          headerStyle: {
            backgroundColor: colors.dark?.bgPrimary || '#1a1a2e',
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '700',
            color: colors.dark?.accentGold || '#c9a227',
          },
          headerTintColor: colors.dark?.accentGold || '#c9a227',
        }}
      />
      <Stack.Screen
        name="FutureLetter"
        component={FutureLetterScreen}
        options={{
          title: 'Letter to Future Self',
          headerStyle: {
            backgroundColor: colors.dark?.bgPrimary || '#1a1a2e',
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '700',
            color: colors.dark?.accentGold || '#c9a227',
          },
          headerTintColor: colors.dark?.accentGold || '#c9a227',
        }}
      />
      <Stack.Screen
        name="Graduation"
        component={GraduationScreen}
        options={{
          title: 'Graduation',
          // Special celebratory header for graduation
          headerStyle: {
            backgroundColor: colors.dark?.bgPrimary || '#1a1a2e',
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: '700',
            color: colors.dark?.accentGold || '#c9a227',
          },
          headerTintColor: colors.dark?.accentGold || '#c9a227',
        }}
      />
    </Stack.Navigator>
  );
};

export default WorkbookNavigator;
