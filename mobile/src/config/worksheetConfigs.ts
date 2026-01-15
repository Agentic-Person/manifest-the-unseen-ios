/**
 * Worksheet Configuration
 *
 * Defines completion criteria for all 39 worksheets in the workbook.
 * Each worksheet has specific criteria for what constitutes "completion".
 */

import { WORKSHEET_IDS } from '../types/workbook';
import type { CompletionCriteria } from '../utils/completionDetection';

interface WorksheetConfig {
  id: string;
  phaseNumber: number;
  completionCriteria: CompletionCriteria;
}

/**
 * Completion configurations for all worksheets
 */
export const WORKSHEET_CONFIGS: Record<string, WorksheetConfig> = {
  // ============================================
  // Phase 1: Self-Evaluation (11 worksheets)
  // ============================================

  [WORKSHEET_IDS.WHEEL_OF_LIFE]: {
    id: WORKSHEET_IDS.WHEEL_OF_LIFE,
    phaseNumber: 1,
    completionCriteria: {
      requiredFields: 8, // All 8 life areas must be rated
      customValidator: (data) => {
        // Ensure all 8 areas have numeric ratings
        const areas = [
          'career',
          'health',
          'relationships',
          'finance',
          'personalGrowth',
          'family',
          'recreation',
          'spirituality',
        ];
        return areas.every((area) => typeof data[area] === 'number' && data[area] > 0);
      },
    },
  },

  [WORKSHEET_IDS.FEEL_WHEEL]: {
    id: WORKSHEET_IDS.FEEL_WHEEL,
    phaseNumber: 1,
    completionCriteria: {
      requiredFields: 8, // All 8 emotions must be rated
      customValidator: (data) => {
        // Ensure all emotions have been rated (not just default value of 5)
        const emotions = [
          'joy',
          'trust',
          'fear',
          'surprise',
          'sadness',
          'disgust',
          'anger',
          'anticipation',
        ];
        return emotions.every((emotion) => typeof data[emotion] === 'number');
      },
    },
  },

  [WORKSHEET_IDS.SWOT_ANALYSIS]: {
    id: WORKSHEET_IDS.SWOT_ANALYSIS,
    phaseNumber: 1,
    completionCriteria: {
      customValidator: (data) => {
        // Each SWOT category should have at least 2 items
        const swotData = data as {
          strengths?: string[];
          weaknesses?: string[];
          opportunities?: string[];
          threats?: string[];
        };
        return (
          (swotData.strengths?.length ?? 0) >= 2 &&
          (swotData.weaknesses?.length ?? 0) >= 2 &&
          (swotData.opportunities?.length ?? 0) >= 2 &&
          (swotData.threats?.length ?? 0) >= 2
        );
      },
    },
  },

  [WORKSHEET_IDS.HABITS_AUDIT]: {
    id: WORKSHEET_IDS.HABITS_AUDIT,
    phaseNumber: 1,
    completionCriteria: {
      customValidator: (data) => {
        // Should have at least 5 habits logged
        const habitsData = data as { habits?: Array<{ name: string }> };
        return (habitsData.habits?.length ?? 0) >= 5;
      },
    },
  },

  [WORKSHEET_IDS.VALUES_ASSESSMENT]: {
    id: WORKSHEET_IDS.VALUES_ASSESSMENT,
    phaseNumber: 1,
    completionCriteria: {
      customValidator: (data) => {
        // Should have at least 5 values ranked
        const valuesData = data as { values?: Array<{ name: string; rank: number }> };
        return (valuesData.values?.length ?? 0) >= 5;
      },
    },
  },

  [WORKSHEET_IDS.ABC_MODEL]: {
    id: WORKSHEET_IDS.ABC_MODEL,
    phaseNumber: 1,
    completionCriteria: {
      customValidator: (data) => {
        // Should have at least 2 ABC entries with all required fields
        const abcData = data as {
          entries?: Array<{ activatingEvent: string; belief: string; consequence: string }>;
        };
        const validEntries = abcData.entries?.filter(
          (e) =>
            e.activatingEvent?.trim().length > 10 &&
            e.belief?.trim().length > 10 &&
            e.consequence?.trim().length > 10
        );
        return (validEntries?.length ?? 0) >= 2;
      },
    },
  },

  [WORKSHEET_IDS.STRENGTHS_WEAKNESSES]: {
    id: WORKSHEET_IDS.STRENGTHS_WEAKNESSES,
    phaseNumber: 1,
    completionCriteria: {
      customValidator: (data) => {
        // Should have at least 3 strengths and 3 weaknesses
        const strengthsData = data as { strengths?: string[]; weaknesses?: string[] };
        return (
          (strengthsData.strengths?.length ?? 0) >= 3 &&
          (strengthsData.weaknesses?.length ?? 0) >= 3
        );
      },
    },
  },

  [WORKSHEET_IDS.COMFORT_ZONE]: {
    id: WORKSHEET_IDS.COMFORT_ZONE,
    phaseNumber: 1,
    completionCriteria: {
      customValidator: (data) => {
        // Should have items in each zone
        const zoneData = data as {
          comfort?: Array<{ text: string }>;
          growth?: Array<{ text: string }>;
          panic?: Array<{ text: string }>;
        };
        return (
          (zoneData.comfort?.length ?? 0) >= 2 &&
          (zoneData.growth?.length ?? 0) >= 2 &&
          (zoneData.panic?.length ?? 0) >= 1
        );
      },
    },
  },

  [WORKSHEET_IDS.KNOW_YOURSELF]: {
    id: WORKSHEET_IDS.KNOW_YOURSELF,
    phaseNumber: 1,
    completionCriteria: {
      customValidator: (data) => {
        // Should answer at least 6 of 8 questions with meaningful responses
        const responses = data.responses as Record<string, string> | undefined;
        if (!responses) {
          return false;
        }
        const answeredQuestions = Object.values(responses).filter((r) => r.trim().length >= 30);
        return answeredQuestions.length >= 6;
      },
    },
  },

  [WORKSHEET_IDS.ABILITIES_RATING]: {
    id: WORKSHEET_IDS.ABILITIES_RATING,
    phaseNumber: 1,
    completionCriteria: {
      customValidator: (data) => {
        // Should rate all 12 abilities
        const ratingsData = data as { ratings?: Record<string, number> };
        return !!(ratingsData.ratings && Object.keys(ratingsData.ratings).length >= 12);
      },
    },
  },

  [WORKSHEET_IDS.THOUGHT_AWARENESS]: {
    id: WORKSHEET_IDS.THOUGHT_AWARENESS,
    phaseNumber: 1,
    completionCriteria: {
      customValidator: (data) => {
        // Should log at least 3 thought entries
        const thoughtData = data as {
          entries?: Array<{ thought: string; situation: string; emotion: string }>;
        };
        const validEntries = thoughtData.entries?.filter(
          (e) =>
            e.thought?.trim().length > 10 &&
            e.situation?.trim().length > 10 &&
            e.emotion?.trim().length > 0
        );
        return (validEntries?.length ?? 0) >= 3;
      },
    },
  },

  // ============================================
  // Phase 2: Values & Vision (3 worksheets)
  // ============================================

  [WORKSHEET_IDS.LIFE_MISSION]: {
    id: WORKSHEET_IDS.LIFE_MISSION,
    phaseNumber: 2,
    completionCriteria: {
      mandatoryFields: ['personalMission', 'professionalMission', 'impactMission', 'legacyMission'],
      minCharsPerField: 50,
    },
  },

  [WORKSHEET_IDS.PURPOSE_STATEMENT]: {
    id: WORKSHEET_IDS.PURPOSE_STATEMENT,
    phaseNumber: 2,
    completionCriteria: {
      customValidator: (data) => {
        // Must have answered all 7 questions and have a final statement
        const purposeData = data as { answers?: Record<string, string>; finalStatement?: string };
        const answeredCount = purposeData.answers
          ? Object.values(purposeData.answers).filter((a) => a.trim().length >= 20).length
          : 0;
        return answeredCount >= 7 && (purposeData.finalStatement?.trim().length ?? 0) >= 50;
      },
    },
  },

  [WORKSHEET_IDS.VISION_BOARD]: {
    id: WORKSHEET_IDS.VISION_BOARD,
    phaseNumber: 2,
    completionCriteria: {
      customValidator: (data) => {
        // Should have at least 5 images or items on the vision board
        const visionData = data as { images?: Array<unknown> };
        return (visionData.images?.length ?? 0) >= 5;
      },
    },
  },

  // ============================================
  // Phase 3: Goal Setting (3 worksheets)
  // ============================================

  [WORKSHEET_IDS.SMART_GOALS]: {
    id: WORKSHEET_IDS.SMART_GOALS,
    phaseNumber: 3,
    completionCriteria: {
      customValidator: (data) => {
        // Should have at least 3 SMART goals with all criteria filled
        const goalsData = data as {
          goals?: Array<{
            title: string;
            specific: string;
            measurable: string;
            achievable: string;
            relevant: string;
            timeBound: string;
          }>;
        };
        const validGoals = goalsData.goals?.filter(
          (g) =>
            g.title?.trim().length > 0 &&
            g.specific?.trim().length >= 20 &&
            g.measurable?.trim().length >= 20 &&
            g.achievable?.trim().length >= 20 &&
            g.relevant?.trim().length >= 20 &&
            g.timeBound?.trim().length > 0
        );
        return (validGoals?.length ?? 0) >= 3;
      },
    },
  },

  [WORKSHEET_IDS.TIMELINE]: {
    id: WORKSHEET_IDS.TIMELINE,
    phaseNumber: 3,
    completionCriteria: {
      customValidator: (data) => {
        // Should have timeline entries for at least 3 goals
        const timelineData = data as {
          entries?: Array<{ goal: string; milestones: Array<unknown> }>;
        };
        return (timelineData.entries?.length ?? 0) >= 3;
      },
    },
  },

  [WORKSHEET_IDS.ACTION_PLAN]: {
    id: WORKSHEET_IDS.ACTION_PLAN,
    phaseNumber: 3,
    completionCriteria: {
      customValidator: (data) => {
        // Should have action plans for at least 2 goals with multiple steps
        const planData = data as { plans?: Array<{ goal: string; steps: Array<unknown> }> };
        const validPlans = planData.plans?.filter((p) => (p.steps?.length ?? 0) >= 3);
        return (validPlans?.length ?? 0) >= 2;
      },
    },
  },

  // ============================================
  // Phase 4: Facing Fears (3 worksheets)
  // ============================================

  [WORKSHEET_IDS.FEAR_INVENTORY]: {
    id: WORKSHEET_IDS.FEAR_INVENTORY,
    phaseNumber: 4,
    completionCriteria: {
      customValidator: (data) => {
        // Should list at least 5 fears with descriptions
        const fearData = data as { fears?: Array<{ description: string; intensity: number }> };
        const validFears = fearData.fears?.filter(
          (f) => f.description?.trim().length >= 10 && f.intensity > 0
        );
        return (validFears?.length ?? 0) >= 5;
      },
    },
  },

  [WORKSHEET_IDS.LIMITING_BELIEFS]: {
    id: WORKSHEET_IDS.LIMITING_BELIEFS,
    phaseNumber: 4,
    completionCriteria: {
      customValidator: (data) => {
        // Should identify at least 3 limiting beliefs with reframes
        const beliefsData = data as { beliefs?: Array<{ belief: string; reframe: string }> };
        const validBeliefs = beliefsData.beliefs?.filter(
          (b) => b.belief?.trim().length >= 10 && b.reframe?.trim().length >= 10
        );
        return (validBeliefs?.length ?? 0) >= 3;
      },
    },
  },

  [WORKSHEET_IDS.FEAR_FACING_PLAN]: {
    id: WORKSHEET_IDS.FEAR_FACING_PLAN,
    phaseNumber: 4,
    completionCriteria: {
      customValidator: (data) => {
        // Should have action plans for at least 2 fears
        const planData = data as { plans?: Array<{ fear: string; steps: Array<unknown> }> };
        const validPlans = planData.plans?.filter((p) => (p.steps?.length ?? 0) >= 3);
        return (validPlans?.length ?? 0) >= 2;
      },
    },
  },

  // ============================================
  // Phase 5: Self-Love & Self-Care (3 worksheets)
  // ============================================

  [WORKSHEET_IDS.SELF_LOVE_AFFIRMATIONS]: {
    id: WORKSHEET_IDS.SELF_LOVE_AFFIRMATIONS,
    phaseNumber: 5,
    completionCriteria: {
      customValidator: (data) => {
        // Should create at least 10 affirmations
        const affirmationsData = data as { affirmations?: Array<{ text: string }> };
        const validAffirmations = affirmationsData.affirmations?.filter(
          (a) => a.text?.trim().length >= 10
        );
        return (validAffirmations?.length ?? 0) >= 10;
      },
    },
  },

  [WORKSHEET_IDS.SELF_CARE_ROUTINE]: {
    id: WORKSHEET_IDS.SELF_CARE_ROUTINE,
    phaseNumber: 5,
    completionCriteria: {
      customValidator: (data) => {
        // Should plan self-care activities for multiple categories
        const routineData = data as { activities?: Array<{ category: string; activity: string }> };
        return (routineData.activities?.length ?? 0) >= 7; // At least one per day of week
      },
    },
  },

  [WORKSHEET_IDS.INNER_CHILD]: {
    id: WORKSHEET_IDS.INNER_CHILD,
    phaseNumber: 5,
    completionCriteria: {
      mandatoryFields: ['letter', 'wounds', 'healing'],
      minCharsPerField: 50,
    },
  },

  // ============================================
  // Phase 6: Manifestation Techniques (3 worksheets)
  // ============================================

  [WORKSHEET_IDS.THREE_SIX_NINE]: {
    id: WORKSHEET_IDS.THREE_SIX_NINE,
    phaseNumber: 6,
    completionCriteria: {
      customValidator: (data) => {
        // Should have manifestation text and at least 3 days of cycles
        const methodData = data as { manifestation?: string; cycles?: Array<unknown> };
        return (
          (methodData.manifestation?.trim().length ?? 0) >= 10 &&
          (methodData.cycles?.length ?? 0) >= 3
        );
      },
    },
  },

  [WORKSHEET_IDS.SCRIPTING]: {
    id: WORKSHEET_IDS.SCRIPTING,
    phaseNumber: 6,
    completionCriteria: {
      customValidator: (data) => {
        // Should have at least 2 scripting entries with meaningful content
        const scriptData = data as { scripts?: Array<{ content: string }> };
        const validScripts = scriptData.scripts?.filter((s) => s.content?.trim().length >= 100);
        return (validScripts?.length ?? 0) >= 2;
      },
    },
  },

  [WORKSHEET_IDS.WOOP]: {
    id: WORKSHEET_IDS.WOOP,
    phaseNumber: 6,
    completionCriteria: {
      mandatoryFields: ['wish', 'outcome', 'obstacle', 'plan', 'ifThen'],
      minCharsPerField: 30,
    },
  },

  // ============================================
  // Phase 7: Practicing Gratitude (3 worksheets)
  // ============================================

  [WORKSHEET_IDS.GRATITUDE_JOURNAL]: {
    id: WORKSHEET_IDS.GRATITUDE_JOURNAL,
    phaseNumber: 7,
    completionCriteria: {
      customValidator: (data) => {
        // Should have at least 7 gratitude entries (one week)
        const journalData = data as { entries?: Array<{ items: string[]; reflection: string }> };
        const validEntries = journalData.entries?.filter(
          (e) => (e.items?.length ?? 0) >= 3 && e.reflection?.trim().length >= 20
        );
        return (validEntries?.length ?? 0) >= 7;
      },
    },
  },

  [WORKSHEET_IDS.GRATITUDE_LETTERS]: {
    id: WORKSHEET_IDS.GRATITUDE_LETTERS,
    phaseNumber: 7,
    completionCriteria: {
      customValidator: (data) => {
        // Should write at least 2 gratitude letters
        const lettersData = data as { letters?: Array<{ recipient: string; content: string }> };
        const validLetters = lettersData.letters?.filter(
          (l) => l.recipient?.trim().length > 0 && l.content?.trim().length >= 100
        );
        return (validLetters?.length ?? 0) >= 2;
      },
    },
  },

  [WORKSHEET_IDS.GRATITUDE_MEDITATION]: {
    id: WORKSHEET_IDS.GRATITUDE_MEDITATION,
    phaseNumber: 7,
    completionCriteria: {
      customValidator: (data) => {
        // Should complete at least 5 meditation sessions
        const meditationData = data as { sessions?: Array<{ completed: boolean }> };
        const completedSessions = meditationData.sessions?.filter((s) => s.completed === true);
        return (completedSessions?.length ?? 0) >= 5;
      },
    },
  },

  // ============================================
  // Phase 8: Envy to Inspiration (3 worksheets)
  // ============================================

  [WORKSHEET_IDS.ENVY_INVENTORY]: {
    id: WORKSHEET_IDS.ENVY_INVENTORY,
    phaseNumber: 8,
    completionCriteria: {
      customValidator: (data) => {
        // Should list at least 3 sources of envy
        const envyData = data as {
          entries?: Array<{ person: string; quality: string; reason: string }>;
        };
        const validEntries = envyData.entries?.filter(
          (e) =>
            e.person?.trim().length > 0 &&
            e.quality?.trim().length > 0 &&
            e.reason?.trim().length >= 20
        );
        return (validEntries?.length ?? 0) >= 3;
      },
    },
  },

  [WORKSHEET_IDS.INSPIRATION_REFRAME]: {
    id: WORKSHEET_IDS.INSPIRATION_REFRAME,
    phaseNumber: 8,
    completionCriteria: {
      customValidator: (data) => {
        // Should reframe at least 3 envy situations to inspiration
        const reframeData = data as {
          reframes?: Array<{ envy: string; inspiration: string; action: string }>;
        };
        const validReframes = reframeData.reframes?.filter(
          (r) =>
            r.envy?.trim().length >= 10 &&
            r.inspiration?.trim().length >= 20 &&
            r.action?.trim().length >= 20
        );
        return (validReframes?.length ?? 0) >= 3;
      },
    },
  },

  [WORKSHEET_IDS.ROLE_MODELS]: {
    id: WORKSHEET_IDS.ROLE_MODELS,
    phaseNumber: 8,
    completionCriteria: {
      customValidator: (data) => {
        // Should identify at least 3 role models with qualities and lessons
        const roleModelsData = data as {
          models?: Array<{ name: string; qualities: string[]; lessons: string }>;
        };
        const validModels = roleModelsData.models?.filter(
          (m) =>
            m.name?.trim().length > 0 &&
            (m.qualities?.length ?? 0) >= 3 &&
            m.lessons?.trim().length >= 30
        );
        return (validModels?.length ?? 0) >= 3;
      },
    },
  },

  // ============================================
  // Phase 9: Trust & Surrender (3 worksheets)
  // ============================================

  [WORKSHEET_IDS.TRUST_ASSESSMENT]: {
    id: WORKSHEET_IDS.TRUST_ASSESSMENT,
    phaseNumber: 9,
    completionCriteria: {
      customValidator: (data) => {
        // Should complete trust ratings for multiple life areas
        const trustData = data as {
          assessments?: Array<{ area: string; rating: number; notes: string }>;
        };
        const validAssessments = trustData.assessments?.filter(
          (a) => a.area?.trim().length > 0 && a.rating > 0
        );
        return (validAssessments?.length ?? 0) >= 5;
      },
    },
  },

  [WORKSHEET_IDS.SURRENDER_PRACTICE]: {
    id: WORKSHEET_IDS.SURRENDER_PRACTICE,
    phaseNumber: 9,
    completionCriteria: {
      customValidator: (data) => {
        // Should identify things to surrender and practice exercises
        const surrenderData = data as {
          items?: Array<{ item: string; reason: string; practice: string }>;
        };
        const validItems = surrenderData.items?.filter(
          (i) =>
            i.item?.trim().length >= 10 &&
            i.reason?.trim().length >= 20 &&
            i.practice?.trim().length >= 20
        );
        return (validItems?.length ?? 0) >= 3;
      },
    },
  },

  [WORKSHEET_IDS.SIGNS_TRACKING]: {
    id: WORKSHEET_IDS.SIGNS_TRACKING,
    phaseNumber: 9,
    completionCriteria: {
      customValidator: (data) => {
        // Should log at least 5 synchronicities or signs
        const signsData = data as { signs?: Array<{ description: string; meaning: string }> };
        const validSigns = signsData.signs?.filter(
          (s) => s.description?.trim().length >= 20 && s.meaning?.trim().length >= 10
        );
        return (validSigns?.length ?? 0) >= 5;
      },
    },
  },

  // ============================================
  // Phase 10: Letting Go (3 worksheets)
  // ============================================

  [WORKSHEET_IDS.JOURNEY_REVIEW]: {
    id: WORKSHEET_IDS.JOURNEY_REVIEW,
    phaseNumber: 10,
    completionCriteria: {
      customValidator: (data) => {
        // Should reflect on all phases and major learnings
        const reviewData = data as {
          phases?: Array<{ phaseNumber: number; learnings: string; growth: string }>;
        };
        const validReviews = reviewData.phases?.filter(
          (p) => p.learnings?.trim().length >= 30 && p.growth?.trim().length >= 30
        );
        return (validReviews?.length ?? 0) >= 10; // All 10 phases
      },
    },
  },

  [WORKSHEET_IDS.FUTURE_LETTER]: {
    id: WORKSHEET_IDS.FUTURE_LETTER,
    phaseNumber: 10,
    completionCriteria: {
      mandatoryFields: ['letter'],
      minCharsPerField: 200, // Substantial letter to future self
    },
  },

  [WORKSHEET_IDS.GRADUATION]: {
    id: WORKSHEET_IDS.GRADUATION,
    phaseNumber: 10,
    completionCriteria: {
      customValidator: (data) => {
        // Must complete commitment and select daily practices
        const gradData = data as {
          commitmentStatement?: string;
          selectedPractices?: string[];
          hasGraduated?: boolean;
        };
        return (
          (gradData.commitmentStatement?.trim().length ?? 0) >= 50 &&
          (gradData.selectedPractices?.length ?? 0) >= 1 &&
          gradData.hasGraduated === true
        );
      },
    },
  },
};

/**
 * Get configuration for a specific worksheet
 *
 * @param worksheetId - The worksheet ID
 * @returns The worksheet configuration, or undefined if not found
 */
export const getWorksheetConfig = (worksheetId: string): WorksheetConfig | undefined => {
  return WORKSHEET_CONFIGS[worksheetId];
};

/**
 * Get all worksheets for a phase
 *
 * @param phaseNumber - The phase number (1-10)
 * @returns Array of worksheet configurations for that phase
 */
export const getWorksheetsByPhase = (phaseNumber: number): WorksheetConfig[] => {
  return Object.values(WORKSHEET_CONFIGS).filter((config) => config.phaseNumber === phaseNumber);
};
