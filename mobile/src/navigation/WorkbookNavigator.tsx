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
import { childScreenHeaderOptions, darkChildScreenHeaderOptions } from './utils/headerConfig';

// Import screens
import WorkbookScreen from '../screens/WorkbookScreen';
import Phase1Dashboard from '../screens/workbook/Phase1/Phase1Dashboard';
import WheelOfLifeScreen from '../screens/workbook/Phase1/WheelOfLifeScreen';
// SWOT Analysis - New organic flower petal layout (dark spiritual theme)
import SWOTAnalysisScreen from '../screens/workbook/Phase1/SWOTAnalysisScreen';
import ValuesAssessmentScreen from '../screens/workbook/Phase1/ValuesAssessmentScreen';
import HabitsAuditScreen from '../screens/workbook/Phase1/HabitsAuditScreen';
// Phase 1 additional screens
import FeelWheelScreen from '../screens/workbook/Phase1/FeelWheelScreen';
import AbcModelScreen from '../screens/workbook/Phase1/AbcModelScreen';
import StrengthsWeaknessesScreen from '../screens/workbook/Phase1/StrengthsWeaknessesScreen';
import ComfortZoneScreen from '../screens/workbook/Phase1/ComfortZoneScreen';
import KnowYourselfScreen from '../screens/workbook/Phase1/KnowYourselfScreen';
import AbilitiesRatingScreen from '../screens/workbook/Phase1/AbilitiesRatingScreen';
import ThoughtAwarenessScreen from '../screens/workbook/Phase1/ThoughtAwarenessScreen';
// Phase 2: Values & Vision screens
import { Phase2Dashboard, VisionBoardScreen, LifeMissionScreen, PurposeStatementScreen } from '../screens/workbook/Phase2';
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
 * Workbook Navigator Component
 *
 * Contains all workbook-related screens organized by phase.
 */
export const WorkbookNavigator = () => {
  return (
    <Stack.Navigator screenOptions={childScreenHeaderOptions}>
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
          ...darkChildScreenHeaderOptions,
          title: 'SWOT Analysis',
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
      <Stack.Screen
        name="FeelWheel"
        component={FeelWheelScreen}
        options={{
          ...darkChildScreenHeaderOptions,
          title: 'Feel Wheel',
        }}
      />
      <Stack.Screen
        name="AbcModel"
        component={AbcModelScreen}
        options={{
          ...darkChildScreenHeaderOptions,
          title: 'ABC Model',
        }}
      />
      <Stack.Screen
        name="StrengthsWeaknesses"
        component={StrengthsWeaknessesScreen}
        options={{
          ...darkChildScreenHeaderOptions,
          title: 'Strengths & Weaknesses',
        }}
      />
      <Stack.Screen
        name="ComfortZone"
        component={ComfortZoneScreen}
        options={{
          ...darkChildScreenHeaderOptions,
          title: 'Comfort Zone',
        }}
      />
      <Stack.Screen
        name="KnowYourself"
        component={KnowYourselfScreen}
        options={{
          ...darkChildScreenHeaderOptions,
          title: 'Know Yourself',
        }}
      />
      <Stack.Screen
        name="AbilitiesRating"
        component={AbilitiesRatingScreen}
        options={{
          ...darkChildScreenHeaderOptions,
          title: 'Abilities Rating',
        }}
      />
      <Stack.Screen
        name="ThoughtAwareness"
        component={ThoughtAwarenessScreen}
        options={{
          ...darkChildScreenHeaderOptions,
          title: 'Thought Awareness',
        }}
      />

      {/* Phase 2: Values & Vision */}
      <Stack.Screen
        name="LifeMission"
        component={LifeMissionScreen}
        options={{
          ...darkChildScreenHeaderOptions,
          title: 'Life Mission',
        }}
      />
      <Stack.Screen
        name="VisionBoard"
        component={VisionBoardScreen}
        options={{
          ...darkChildScreenHeaderOptions,
          title: 'Vision Board',
        }}
      />
      <Stack.Screen
        name="PurposeStatement"
        component={PurposeStatementScreen}
        options={{
          ...darkChildScreenHeaderOptions,
          title: 'Purpose Statement',
        }}
      />

      {/* Phase 3: Goal Setting */}
      <Stack.Screen
        name="SMARTGoals"
        component={SMARTGoalsScreen}
        options={{
          ...darkChildScreenHeaderOptions,
          title: 'SMART Goals',
        }}
      />
      <Stack.Screen
        name="Timeline"
        component={TimelineScreen}
        options={{
          ...darkChildScreenHeaderOptions,
          title: 'Goal Timeline',
        }}
      />
      <Stack.Screen
        name="ActionPlan"
        component={ActionPlanScreen}
        options={{
          ...darkChildScreenHeaderOptions,
          title: 'Action Plan',
        }}
      />

      {/* Phase 4: Facing Fears & Limiting Beliefs */}
      <Stack.Screen
        name="FearInventory"
        component={FearInventoryScreen}
        options={{
          ...darkChildScreenHeaderOptions,
          title: 'Fear Inventory',
        }}
      />
      <Stack.Screen
        name="LimitingBeliefs"
        component={LimitingBeliefsScreen}
        options={{
          ...darkChildScreenHeaderOptions,
          title: 'Limiting Beliefs',
        }}
      />
      <Stack.Screen
        name="FearFacingPlan"
        component={FearFacingPlanScreen}
        options={{
          ...darkChildScreenHeaderOptions,
          title: 'Fear Facing Plan',
        }}
      />

      {/* Phase 5: Cultivating Self-Love & Self-Care */}
      <Stack.Screen
        name="SelfLoveAffirmations"
        component={SelfLoveAffirmationsScreen}
        options={{
          ...darkChildScreenHeaderOptions,
          title: 'Self-Love Affirmations',
        }}
      />
      <Stack.Screen
        name="SelfCareRoutine"
        component={SelfCareRoutineScreen}
        options={{
          ...darkChildScreenHeaderOptions,
          title: 'Self-Care Routines',
        }}
      />
      <Stack.Screen
        name="InnerChild"
        component={InnerChildScreen}
        options={{
          ...darkChildScreenHeaderOptions,
          title: 'Inner Child Healing',
          headerTintColor: '#6b5b8a', // Softer lavender for inner child work
        }}
      />

      {/* Phase 6: Manifestation Techniques */}
      <Stack.Screen
        name="ThreeSixNine"
        component={ThreeSixNineScreen}
        options={{
          ...darkChildScreenHeaderOptions,
          title: '3-6-9 Method',
        }}
      />
      <Stack.Screen
        name="Scripting"
        component={ScriptingScreen}
        options={{
          ...darkChildScreenHeaderOptions,
          title: 'Scripting',
        }}
      />
      <Stack.Screen
        name="WOOP"
        component={WOOPScreen}
        options={{
          ...darkChildScreenHeaderOptions,
          title: 'WOOP Method',
        }}
      />

      {/* Phase 7: Practicing Gratitude */}
      <Stack.Screen
        name="GratitudeJournal"
        component={GratitudeJournalScreen}
        options={{
          ...darkChildScreenHeaderOptions,
          title: 'Gratitude Journal',
        }}
      />
      <Stack.Screen
        name="GratitudeLetters"
        component={GratitudeLettersScreen}
        options={{
          ...darkChildScreenHeaderOptions,
          title: 'Gratitude Letters',
        }}
      />
      <Stack.Screen
        name="GratitudeMeditation"
        component={GratitudeMeditationScreen}
        options={{
          ...darkChildScreenHeaderOptions,
          title: 'Gratitude Meditation',
        }}
      />

      {/* Phase 8: Turning Envy Into Inspiration */}
      <Stack.Screen
        name="EnvyInventory"
        component={EnvyInventoryScreen}
        options={{
          ...darkChildScreenHeaderOptions,
          title: 'Envy Inventory',
        }}
      />
      <Stack.Screen
        name="InspirationReframe"
        component={InspirationReframeScreen}
        options={{
          ...darkChildScreenHeaderOptions,
          title: 'Inspiration Reframe',
        }}
      />
      <Stack.Screen
        name="RoleModels"
        component={RoleModelsScreen}
        options={{
          ...darkChildScreenHeaderOptions,
          title: 'Role Models',
        }}
      />

      {/* Phase 9: Trust & Surrender */}
      <Stack.Screen
        name="TrustAssessment"
        component={TrustAssessmentScreen}
        options={{
          ...darkChildScreenHeaderOptions,
          title: 'Trust Assessment',
        }}
      />
      <Stack.Screen
        name="SurrenderPractice"
        component={SurrenderPracticeScreen}
        options={{
          ...darkChildScreenHeaderOptions,
          title: 'Surrender Practice',
        }}
      />
      <Stack.Screen
        name="Signs"
        component={SignsScreen}
        options={{
          ...darkChildScreenHeaderOptions,
          title: 'Signs & Synchronicities',
        }}
      />

      {/* Phase 10: Trust & Letting Go - FINAL PHASE */}
      <Stack.Screen
        name="JourneyReview"
        component={JourneyReviewScreen}
        options={{
          ...darkChildScreenHeaderOptions,
          title: 'Journey Review',
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '700',
            color: colors.dark?.accentGold || '#c9a227',
          },
        }}
      />
      <Stack.Screen
        name="FutureLetter"
        component={FutureLetterScreen}
        options={{
          ...darkChildScreenHeaderOptions,
          title: 'Letter to Future Self',
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '700',
            color: colors.dark?.accentGold || '#c9a227',
          },
        }}
      />
      <Stack.Screen
        name="Graduation"
        component={GraduationScreen}
        options={{
          ...darkChildScreenHeaderOptions,
          title: 'Graduation',
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: '700',
            color: colors.dark?.accentGold || '#c9a227',
          },
        }}
      />
    </Stack.Navigator>
  );
};

export default WorkbookNavigator;
