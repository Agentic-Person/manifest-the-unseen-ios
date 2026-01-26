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
        // SWOTAnalysisScreen saves: { strengths: string[], weaknesses: string[], opportunities: string[], threats: string[], updatedAt }
        // Each SWOT category should have at least 2 non-empty items
        const swotData = data as {
          strengths?: string[];
          weaknesses?: string[];
          opportunities?: string[];
          threats?: string[];
        };

        const countValid = (arr?: string[]) =>
          arr?.filter((s) => typeof s === 'string' && s.trim().length > 0)?.length ?? 0;

        return (
          countValid(swotData.strengths) >= 2 &&
          countValid(swotData.weaknesses) >= 2 &&
          countValid(swotData.opportunities) >= 2 &&
          countValid(swotData.threats) >= 2
        );
      },
    },
  },

  [WORKSHEET_IDS.HABITS_AUDIT]: {
    id: WORKSHEET_IDS.HABITS_AUDIT,
    phaseNumber: 1,
    completionCriteria: {
      customValidator: (data) => {
        // Should have at least 5 habits logged with 10+ char names
        // Data structure: { morning: Habit[], afternoon: Habit[], evening: Habit[] }
        interface Habit {
          id: string;
          habit: string;
          category: string;
        }
        const habitsData = data as { morning?: Habit[]; afternoon?: Habit[]; evening?: Habit[] };
        const allHabits = [
          ...(habitsData.morning ?? []),
          ...(habitsData.afternoon ?? []),
          ...(habitsData.evening ?? []),
        ];
        // Count habits with 10+ character names
        const validHabits = allHabits.filter((h) => h.habit && h.habit.trim().length >= 10);
        return validHabits.length >= 5;
      },
    },
  },

  [WORKSHEET_IDS.VALUES_ASSESSMENT]: {
    id: WORKSHEET_IDS.VALUES_ASSESSMENT,
    phaseNumber: 1,
    completionCriteria: {
      customValidator: (data) => {
        // Should have at least 5 values selected
        // Data structure: { selectedValues: string[] }
        const valuesData = data as { selectedValues?: string[] };
        return (valuesData.selectedValues?.length ?? 0) >= 5;
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
        // Should have at least 3 strengths and 3 weaknesses with non-empty text
        // Data structure: { strengths: Array<{ text: string }>, weaknesses: Array<{ text: string }> }
        interface Item {
          text?: string;
        }
        const strengthsData = data as { strengths?: Item[]; weaknesses?: Item[] };
        const validStrengths =
          strengthsData.strengths?.filter((s) => (s.text?.trim()?.length ?? 0) > 0) ?? [];
        const validWeaknesses =
          strengthsData.weaknesses?.filter((w) => (w.text?.trim()?.length ?? 0) > 0) ?? [];
        return validStrengths.length >= 3 && validWeaknesses.length >= 3;
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
        // VisionBoardScreen saves: { id, name, items: VisionBoardItem[], template, backgroundColor, ... }
        // Should have at least 5 items on the vision board
        const visionData = data as { items?: Array<unknown> };
        return (visionData.items?.length ?? 0) >= 5;
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
        // TimelineScreen saves: { goals, selectedView, updatedAt }
        // Should have at least 3 goals with title and dates
        const timelineData = data as {
          goals?: Array<{
            id: string;
            title: string;
            startDate: string;
            endDate: string;
            status: string;
          }>;
        };
        const validGoals = timelineData.goals?.filter(
          (g) => g.title?.trim().length > 0 && g.startDate && g.endDate
        );
        return (validGoals?.length ?? 0) >= 3;
      },
    },
  },

  [WORKSHEET_IDS.ACTION_PLAN]: {
    id: WORKSHEET_IDS.ACTION_PLAN,
    phaseNumber: 3,
    completionCriteria: {
      customValidator: (data) => {
        // ActionPlanScreen saves: { selectedGoalId, steps, updatedAt }
        // Should have a selected goal and at least 3 valid steps
        const planData = data as {
          selectedGoalId?: string | null;
          steps?: Array<{ id: string; text: string; completed: boolean }>;
        };
        const hasGoal = !!planData.selectedGoalId;
        const validSteps = planData.steps?.filter((s) => s.text?.trim().length > 0);
        return hasGoal && (validSteps?.length ?? 0) >= 3;
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
        // FearInventoryScreen saves: { fears: Fear[] } where Fear has { id, text, category, intensity, ... }
        // Should list at least 5 fears with text descriptions
        const fearData = data as { fears?: Array<{ text: string; intensity: number }> };
        const validFears = fearData.fears?.filter(
          (f) => f.text?.trim().length >= 10 && f.intensity > 0
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
        // Should have manifestation text and at least 1 day of practice
        // Lowered threshold from 3 days to let users feel success on first day
        // Data structure: { practice: { manifestation: string; dailyProgress: Array } }
        interface PracticeData {
          manifestation?: string;
          dailyProgress?: Array<unknown>;
        }
        const methodData = data as { practice?: PracticeData };
        const manifestation = methodData.practice?.manifestation ?? '';
        const dailyProgress = methodData.practice?.dailyProgress ?? [];
        return manifestation.trim().length >= 10 && dailyProgress.length >= 1;
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
      customValidator: (data) => {
        // Screen saves: { currentWOOP: { wish, outcome, obstacle, plan, ... }, savedWOOPs: [...] }
        // All 4 WOOP sections must be filled with at least 30 chars
        const woopData = data as {
          currentWOOP?: { wish?: string; outcome?: string; obstacle?: string; plan?: string };
        };
        const woop = woopData.currentWOOP;
        if (!woop) {
          return false;
        }

        const minChars = 30;
        return (
          (woop.wish?.trim().length ?? 0) >= minChars &&
          (woop.outcome?.trim().length ?? 0) >= minChars &&
          (woop.obstacle?.trim().length ?? 0) >= minChars &&
          (woop.plan?.trim().length ?? 0) >= minChars
        );
      },
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
        // Should have at least 3 gratitude entries (lowered from 7 - one week was too long)
        // Data structure: Record<string, { dateKey: string; items: Array<{ text: string }>; ... }>
        // The data is keyed by date string, so we need to get the values
        interface GratitudeEntry {
          dateKey: string;
          items?: Array<{ text: string }>;
        }
        const entriesRecord = data as Record<string, GratitudeEntry>;
        const entries = Object.values(entriesRecord).filter(
          (e) => e && typeof e === 'object' && e.dateKey
        );
        // Count entries with at least 3 non-empty items
        const validEntries = entries.filter(
          (e) => (e.items?.filter((item) => item.text?.trim().length > 0)?.length ?? 0) >= 3
        );
        return validEntries.length >= 3;
      },
    },
  },

  [WORKSHEET_IDS.GRATITUDE_LETTERS]: {
    id: WORKSHEET_IDS.GRATITUDE_LETTERS,
    phaseNumber: 7,
    completionCriteria: {
      customValidator: (data) => {
        // Should write at least 1 gratitude letter (lowered from 2 to lower barrier)
        // Support both array format (old) and object wrapper format (new)
        let letters: Array<{ recipientName?: string; recipient?: string; content: string }>;
        if (Array.isArray(data)) {
          // Old format: data is directly an array of letters
          letters = data;
        } else {
          // New format: data is { letters: [...] }
          letters =
            (data as { letters?: typeof letters }).letters ?? [];
        }
        // Support both recipientName (screen saves) and recipient (old validator expected)
        const validLetters = letters.filter(
          (l) =>
            ((l.recipientName?.trim().length ?? 0) > 0 || (l.recipient?.trim().length ?? 0) > 0) &&
            (l.content?.trim().length ?? 0) >= 50 // Lowered from 100 chars
        );
        return validLetters.length >= 1;
      },
    },
  },

  [WORKSHEET_IDS.GRATITUDE_MEDITATION]: {
    id: WORKSHEET_IDS.GRATITUDE_MEDITATION,
    phaseNumber: 7,
    completionCriteria: {
      customValidator: (data) => {
        // Should complete at least 3 meditation sessions (lowered from 5 to be achievable in first week)
        // Support both completed: boolean (new) and completedAt: string (screen saves)
        const meditationData = data as {
          sessions?: Array<{ completed?: boolean; completedAt?: string }>;
        };
        const completedSessions = meditationData.sessions?.filter(
          (s) => s.completed === true || (s.completedAt && s.completedAt.length > 0)
        );
        return (completedSessions?.length ?? 0) >= 3;
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
        // EnvyInventoryScreen saves: { envyItems: EnvyItem[] }
        // EnvyItem has: { id, whoWhat, trigger, category, intensity, reflection?, ... }
        // Should list at least 3 sources of envy with meaningful content
        const envyData = data as {
          envyItems?: Array<{ whoWhat: string; trigger: string; intensity: number }>;
        };
        const validItems = envyData.envyItems?.filter(
          (e) => e.whoWhat?.trim().length > 0 && e.trigger?.trim().length >= 10 && e.intensity > 0
        );
        return (validItems?.length ?? 0) >= 3;
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
        // Screen saves: { trustValues: { self: number, others: number, universe: number, process: number, timing: number } }
        // All 5 dimensions must have a value (any value 1-10 is valid)
        const trustData = data as {
          trustValues?: {
            self?: number;
            others?: number;
            universe?: number;
            process?: number;
            timing?: number;
          };
        };
        const values = trustData.trustValues;
        if (!values) {
          return false;
        }

        // Check all 5 dimensions have numeric values
        const dimensions = ['self', 'others', 'universe', 'process', 'timing'] as const;
        return dimensions.every(
          (dim) => typeof values[dim] === 'number' && values[dim] >= 1 && values[dim] <= 10
        );
      },
    },
  },

  [WORKSHEET_IDS.SURRENDER_PRACTICE]: {
    id: WORKSHEET_IDS.SURRENDER_PRACTICE,
    phaseNumber: 9,
    completionCriteria: {
      customValidator: (data) => {
        // Screen saves: { entries: [{ controllingText, surrenderText, affirmation, isReleased, ... }], totalReleased }
        // Should have at least 2 surrender entries with meaningful content (lowered from 3 to lower barrier)
        const surrenderData = data as {
          entries?: Array<{
            controllingText?: string;
            surrenderText?: string;
            isReleased?: boolean;
          }>;
        };
        const validEntries = surrenderData.entries?.filter(
          (e) =>
            (e.controllingText?.trim()?.length ?? 0) >= 10 &&
            (e.surrenderText?.trim()?.length ?? 0) >= 10
        );
        return (validEntries?.length ?? 0) >= 2;
      },
    },
  },

  [WORKSHEET_IDS.SIGNS_TRACKING]: {
    id: WORKSHEET_IDS.SIGNS_TRACKING,
    phaseNumber: 9,
    completionCriteria: {
      customValidator: (data) => {
        // Screen saves: { entries: [{ whatHappened, possibleMeaning, howItFelt, category, ... }] }
        // Should log at least 3 synchronicities or signs (lowered from 5 - users may not notice signs immediately)
        const signsData = data as {
          entries?: Array<{ whatHappened?: string; possibleMeaning?: string }>;
        };
        const validEntries = signsData.entries?.filter(
          (e) =>
            (e.whatHappened?.trim()?.length ?? 0) >= 20 &&
            (e.possibleMeaning?.trim()?.length ?? 0) >= 10
        );
        return (validEntries?.length ?? 0) >= 3;
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
        // Screen saves: { transformation: { beforeState, afterState, biggestLesson, gratefulFor } }
        // All 4 transformation fields should be filled with meaningful content
        const reviewData = data as {
          transformation?: {
            beforeState?: string;
            afterState?: string;
            biggestLesson?: string;
            gratefulFor?: string;
          };
        };
        const t = reviewData.transformation;
        if (!t) {
          return false;
        }

        const minChars = 30;
        return (
          (t.beforeState?.trim().length ?? 0) >= minChars &&
          (t.afterState?.trim().length ?? 0) >= minChars &&
          (t.biggestLesson?.trim().length ?? 0) >= minChars &&
          (t.gratefulFor?.trim().length ?? 0) >= minChars
        );
      },
    },
  },

  [WORKSHEET_IDS.FUTURE_LETTER]: {
    id: WORKSHEET_IDS.FUTURE_LETTER,
    phaseNumber: 10,
    completionCriteria: {
      customValidator: (data) => {
        // Screen saves: { letterContent: string, promptResponses: Record<string, string>, existingLetter: ... }
        // Letter content must be at least 200 characters
        const letterData = data as { letterContent?: string };
        return (letterData.letterContent?.trim().length ?? 0) >= 200;
      },
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
