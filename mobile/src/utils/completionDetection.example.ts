/**
 * Example Usage of Completion Detection System
 *
 * This file demonstrates how to use the completion detection utilities
 * with worksheet data to determine if a worksheet is complete.
 */

import { detectCompletion } from './completionDetection';
import { getWorksheetConfig } from '../config/worksheetConfigs';
import { WORKSHEET_IDS } from '../types/workbook';

/**
 * Example 1: Check if Life Mission worksheet is complete
 */
export function checkLifeMissionCompletion() {
  const config = getWorksheetConfig(WORKSHEET_IDS.LIFE_MISSION);

  if (!config) {
    console.error('Config not found');
    return false;
  }

  // Sample data from a user's Life Mission worksheet
  const userData = {
    personalMission: 'To live authentically and inspire others through my creative work and compassionate actions.',
    professionalMission: 'To build meaningful products that help people discover their potential and live more fulfilling lives.',
    impactMission: 'To create positive change in my community through mentorship and environmental stewardship.',
    legacyMission: 'To leave behind a body of work that continues to inspire and uplift future generations.',
    combinedStatement: 'My purpose is to...',
    updatedAt: new Date().toISOString(),
  };

  const isComplete = detectCompletion(
    userData as unknown as Record<string, unknown>,
    config.completionCriteria
  );

  console.log('Life Mission complete:', isComplete); // true - all mandatory fields filled with 50+ chars
  return isComplete;
}

/**
 * Example 2: Check if SMART Goals worksheet is complete
 */
export function checkSMARTGoalsCompletion() {
  const config = getWorksheetConfig(WORKSHEET_IDS.SMART_GOALS);

  if (!config) {
    console.error('Config not found');
    return false;
  }

  // Sample data with 3 SMART goals
  const userData = {
    goals: [
      {
        id: 'goal1',
        title: 'Complete Marathon',
        category: 'health',
        specific: 'Train for and complete a full 26.2 mile marathon by following a 16-week training plan',
        measurable: 'Track weekly mileage, gradually increasing from 20 to 40 miles per week',
        achievable: 'I have 4 months to train, access to running routes, and past experience with half marathons',
        relevant: 'Running supports my health goals and demonstrates discipline and perseverance',
        timeBound: '2024-12-15',
        status: 'in_progress',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'goal2',
        title: 'Learn Spanish',
        category: 'personal',
        specific: 'Achieve conversational fluency in Spanish through daily practice and weekly tutoring',
        measurable: 'Complete Duolingo tree, have 30-minute conversations with native speakers, pass B1 exam',
        achievable: 'Dedicating 30 minutes daily plus weekly 1-hour tutoring sessions',
        relevant: 'Opens career opportunities and allows deeper connection with Hispanic culture and family',
        timeBound: '2025-06-01',
        status: 'not_started',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'goal3',
        title: 'Start Side Business',
        category: 'career',
        specific: 'Launch a freelance design business with website, portfolio, and first 5 paying clients',
        measurable: 'Live website, 10 portfolio pieces, 5 client contracts signed, $5000 revenue',
        achievable: 'Have design skills, existing network, and can dedicate 10 hours per week',
        relevant: 'Builds financial independence and allows me to pursue creative passion professionally',
        timeBound: '2025-03-31',
        status: 'in_progress',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    updatedAt: new Date().toISOString(),
  };

  const isComplete = detectCompletion(
    userData as unknown as Record<string, unknown>,
    config.completionCriteria
  );

  console.log('SMART Goals complete:', isComplete); // true - has 3+ goals with all SMART criteria
  return isComplete;
}

/**
 * Example 3: Check if Wheel of Life is complete
 */
export function checkWheelOfLifeCompletion() {
  const config = getWorksheetConfig(WORKSHEET_IDS.WHEEL_OF_LIFE);

  if (!config) {
    console.error('Config not found');
    return false;
  }

  // Sample data with all 8 life areas rated
  const userData = {
    career: 7,
    health: 6,
    relationships: 8,
    finance: 5,
    personalGrowth: 8,
    family: 9,
    recreation: 4,
    spirituality: 7,
  };

  const isComplete = detectCompletion(
    userData as unknown as Record<string, unknown>,
    config.completionCriteria
  );

  console.log('Wheel of Life complete:', isComplete); // true - all 8 areas rated
  return isComplete;
}

/**
 * Example 4: Incomplete worksheet (missing data)
 */
export function checkIncompleteWorksheet() {
  const config = getWorksheetConfig(WORKSHEET_IDS.LIFE_MISSION);

  if (!config) {
    console.error('Config not found');
    return false;
  }

  // Incomplete data - missing some mandatory fields
  const incompleteData = {
    personalMission: 'To be a good person.',
    professionalMission: '', // Empty
    impactMission: 'Help others.', // Too short (< 50 chars)
    // legacyMission is missing entirely
  };

  const isComplete = detectCompletion(
    incompleteData as unknown as Record<string, unknown>,
    config.completionCriteria
  );

  console.log('Incomplete worksheet:', isComplete); // false - missing fields and too short
  return isComplete;
}

/**
 * Run all examples
 */
export function runExamples() {
  console.log('=== Completion Detection Examples ===\n');

  console.log('Example 1: Life Mission (complete)');
  checkLifeMissionCompletion();
  console.log('');

  console.log('Example 2: SMART Goals (complete)');
  checkSMARTGoalsCompletion();
  console.log('');

  console.log('Example 3: Wheel of Life (complete)');
  checkWheelOfLifeCompletion();
  console.log('');

  console.log('Example 4: Life Mission (incomplete)');
  checkIncompleteWorksheet();
  console.log('');

  console.log('=== End Examples ===');
}
