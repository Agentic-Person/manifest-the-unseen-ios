/**
 * Central asset exports for Manifest the Unseen
 *
 * Usage:
 *   import { PhaseImages, MeditationImages, Icons } from '@/assets';
 *   <Image source={PhaseImages.phase1} />
 */

// =============================================================================
// PHASE IMAGES - Workbook phase headers/banners
// =============================================================================
export const PhaseImages = {
  phase1: require('./images-compressed/phases/phase-1-self-evaluation.png'),
  phase2: require('./images-compressed/phases/phase-2-values-vision.png'),
  phase3: require('./images-compressed/phases/phase-3-goal-setting.png'),
  phase4: require('./images-compressed/phases/phase-4-fears-beliefs.png'),
  phase5: require('./images-compressed/phases/phase-5-self-love.png'),
  phase6: require('./images-compressed/phases/phase-6-manifestation.png'),
  phase7: require('./images-compressed/phases/phase-7-gratitude.png'),
  phase8: require('./images-compressed/phases/phase-8-envy-inspiration.png'),
  phase9: require('./images-compressed/phases/phase-9-trust-surrender.png'),
  phase10: require('./images-compressed/phases/phase-10-letting-go.png'),
} as const;

// Type for phase keys (useful for dynamic access)
export type PhaseImageKey = keyof typeof PhaseImages;

// =============================================================================
// MEDITATION IMAGES - Backgrounds for meditation screens
// =============================================================================

// Guided Meditation Images
export const GuidedMeditationImages = {
  morningAwakening: require('./images-compressed/meditation/Guided/guided-morning-awakening.png'),
  mindBody: require('./images-compressed/meditation/Guided/guided-mind-body.png'),
  innerPeace: require('./images-compressed/meditation/Guided/guided-inner-peace.png'),
} as const;

export type GuidedMeditationImageKey = keyof typeof GuidedMeditationImages;

// Breathing Exercise Images
export const BreathingImages = {
  boxBreathing: require('./images-compressed/meditation/Breathing/breathing-box.png'),
  deepCalm: require('./images-compressed/meditation/Breathing/breathing-deep-calm.png'),
  energyBoost: require('./images-compressed/meditation/Breathing/breathing-energy-boost.png'),
} as const;

export type BreathingImageKey = keyof typeof BreathingImages;

// Instrumental/Music Images
export const InstrumentalImages = {
  track01: require('./images-compressed/meditation/Instrumental/instrumental-01.png'),
  track02: require('./images-compressed/meditation/Instrumental/instrumental-02.png'),
  track03: require('./images-compressed/meditation/Instrumental/instrumental-03.png'),
  track04: require('./images-compressed/meditation/Instrumental/instrumental-04.png'),
  track05: require('./images-compressed/meditation/Instrumental/instrumental-05.png'),
  track06: require('./images-compressed/meditation/Instrumental/instrumental-06.png'),
  track07: require('./images-compressed/meditation/Instrumental/instrumental-07.png'),
  track08: require('./images-compressed/meditation/Instrumental/instrumental-08.png'),
  track09: require('./images-compressed/meditation/Instrumental/instrumental-09.png'),
  track10: require('./images-compressed/meditation/Instrumental/instrumental-10.png'),
  track11: require('./images-compressed/meditation/Instrumental/instrumental-11.png'),
  track12: require('./images-compressed/meditation/Instrumental/instrumental-12.png'),
  track13: require('./images-compressed/meditation/Instrumental/instrumental-13.png'),
} as const;

export type InstrumentalImageKey = keyof typeof InstrumentalImages;

// Combined MeditationImages for backwards compatibility
export const MeditationImages = {
  ...GuidedMeditationImages,
  ...BreathingImages,
  ...InstrumentalImages,
} as const;

export type MeditationImageKey = keyof typeof MeditationImages;

// Helper to get instrumental image by index (1-13)
export function getInstrumentalImage(index: number) {
  const key = `track${index.toString().padStart(2, '0')}` as InstrumentalImageKey;
  return InstrumentalImages[key];
}

// =============================================================================
// WORKBOOK EXERCISE IMAGES - Exercise-specific images for all 10 phases
// =============================================================================

// Phase 1: Self-Evaluation (11 exercises)
export const Phase1ExerciseImages = {
  wheelOfLife: require('./images-compressed/workbook/1-Self-Evaluation/eval_wheel_of_life.png'),
  feelWheel: require('./images-compressed/workbook/1-Self-Evaluation/eval_feel_wheel.png'),
  habitTracking: require('./images-compressed/workbook/1-Self-Evaluation/eval_habit_tracking.png'),
  abcModel: require('./images-compressed/workbook/1-Self-Evaluation/eval_abc_model.png'),
  swotAnalysis: require('./images-compressed/workbook/1-Self-Evaluation/eval_swot_analysis.png'),
  personalValues: require('./images-compressed/workbook/1-Self-Evaluation/eval_personal_values.png'),
  strengthsWeaknesses: require('./images-compressed/workbook/1-Self-Evaluation/eval_strengths_weaknesses.png'),
  comfortZone: require('./images-compressed/workbook/1-Self-Evaluation/eval_comfort_zone.png'),
  knowYourself: require('./images-compressed/workbook/1-Self-Evaluation/eval_know_yourself.png'),
  abilitiesRating: require('./images-compressed/workbook/1-Self-Evaluation/eval_abilities_rating.png'),
  thoughtAwareness: require('./images-compressed/workbook/1-Self-Evaluation/eval_thought_awareness.png'),
} as const;

export type Phase1ExerciseImageKey = keyof typeof Phase1ExerciseImages;

// Phase 2: Values & Vision (2 exercises)
export const Phase2ExerciseImages = {
  lifeMission: require('./images-compressed/workbook/2-Values-Vision/values_life_mission.png'),
  visionBoard: require('./images-compressed/workbook/2-Values-Vision/values_vision_board.png'),
} as const;

export type Phase2ExerciseImageKey = keyof typeof Phase2ExerciseImages;

// Phase 3: Goal Setting (3 exercises)
export const Phase3ExerciseImages = {
  smartGoals: require('./images-compressed/workbook/3-Goal-Setting/goals_smart_goals.png'),
  timeline: require('./images-compressed/workbook/3-Goal-Setting/goals_timeline.png'),
  actionPlan: require('./images-compressed/workbook/3-Goal-Setting/goals_action_plan.png'),
} as const;

export type Phase3ExerciseImageKey = keyof typeof Phase3ExerciseImages;

// Phase 4: Facing Fears & Limiting Beliefs (3 exercises)
export const Phase4ExerciseImages = {
  fearsInventory: require('./images-compressed/workbook/4-Facing-Fears/fears_inventory.png'),
  limitingBeliefs: require('./images-compressed/workbook/4-Facing-Fears/fears_limiting_beliefs.png'),
  facingPlan: require('./images-compressed/workbook/4-Facing-Fears/fears_facing_plan.png'),
} as const;

export type Phase4ExerciseImageKey = keyof typeof Phase4ExerciseImages;

// Phase 5: Self-Love & Self-Care (3 exercises)
export const Phase5ExerciseImages = {
  affirmations: require('./images-compressed/workbook/5-Self-Love-Care/selflove_affirmations.png'),
  selfcareRoutine: require('./images-compressed/workbook/5-Self-Love-Care/selflove_selfcare_routine.png'),
  innerChild: require('./images-compressed/workbook/5-Self-Love-Care/selflove_inner_child.png'),
} as const;

export type Phase5ExerciseImageKey = keyof typeof Phase5ExerciseImages;

// Phase 6: Manifestation Techniques (3 exercises)
export const Phase6ExerciseImages = {
  method369: require('./images-compressed/workbook/6-Manifestation/manifest_369_method.webp'),
  scripting: require('./images-compressed/workbook/6-Manifestation/manifest_scripting.webp'),
  woop: require('./images-compressed/workbook/6-Manifestation/manifest_wooop.webp'),
} as const;

export type Phase6ExerciseImageKey = keyof typeof Phase6ExerciseImages;

// Phase 7: Gratitude (3 exercises)
export const Phase7ExerciseImages = {
  gratitudeJournal: require('./images-compressed/workbook/7-Gratitude/gratitude_journal.webp'),
  gratitudeLetters: require('./images-compressed/workbook/7-Gratitude/gratitude_letters.webp'),
  gratitudeMeditation: require('./images-compressed/workbook/7-Gratitude/gratitude_meditation.webp'),
} as const;

export type Phase7ExerciseImageKey = keyof typeof Phase7ExerciseImages;

// Phase 8: Turning Envy Into Inspiration (3 exercises)
export const Phase8ExerciseImages = {
  envyInventory: require('./images-compressed/workbook/8-Envy-Inspiration/envy_inventory.png'),
  inspirationReframe: require('./images-compressed/workbook/8-Envy-Inspiration/inspiration_reframe.png'),
  roleModels: require('./images-compressed/workbook/8-Envy-Inspiration/role_models.png'),
} as const;

export type Phase8ExerciseImageKey = keyof typeof Phase8ExerciseImages;

// Phase 9: Trust & Surrender (3 exercises)
export const Phase9ExerciseImages = {
  trustAssessment: require('./images-compressed/workbook/9-Trust-Surrender/trust_assessment.webp'),
  surrenderPractice: require('./images-compressed/workbook/9-Trust-Surrender/surrender_practice.webp'),
  synchronicity: require('./images-compressed/workbook/9-Trust-Surrender/synchronicity.webp'),
} as const;

export type Phase9ExerciseImageKey = keyof typeof Phase9ExerciseImages;

// Phase 10: Letting Go (3 exercises)
export const Phase10ExerciseImages = {
  journeyReview: require('./images-compressed/workbook/10-Letting-Go/journey_review.webp'),
  letterFutureSelf: require('./images-compressed/workbook/10-Letting-Go/letter_future_self.png'),
  graduation: require('./images-compressed/workbook/10-Letting-Go/graduation.png'),
} as const;

export type Phase10ExerciseImageKey = keyof typeof Phase10ExerciseImages;

// Combined WorkbookExerciseImages for easy access by phase
export const WorkbookExerciseImages = {
  phase1: Phase1ExerciseImages,
  phase2: Phase2ExerciseImages,
  phase3: Phase3ExerciseImages,
  phase4: Phase4ExerciseImages,
  phase5: Phase5ExerciseImages,
  phase6: Phase6ExerciseImages,
  phase7: Phase7ExerciseImages,
  phase8: Phase8ExerciseImages,
  phase9: Phase9ExerciseImages,
  phase10: Phase10ExerciseImages,
} as const;

/**
 * Get exercise images for a specific phase (1-10)
 */
export function getPhaseExerciseImages(phaseNumber: number) {
  const key = `phase${phaseNumber}` as keyof typeof WorkbookExerciseImages;
  return WorkbookExerciseImages[key];
}

// =============================================================================
// BACKGROUND IMAGES - General app backgrounds
// =============================================================================
export const BackgroundImages = {
  journal: require('./images-compressed/backgrounds/journal.png'),
  scroll: require('./images-compressed/backgrounds/scroll.png'),
  home: require('./images-compressed/backgrounds/home.png'),
  meditate: require('./images-compressed/backgrounds/meditate.png'),
  workbook: require('./images-compressed/backgrounds/workbook.png'),
} as const;

export type BackgroundImageKey = keyof typeof BackgroundImages;

// =============================================================================
// ILLUSTRATION IMAGES - Decorative elements
// =============================================================================
export const IllustrationImages = {
  // Add illustrations as you upload them
  // lotus: require('./images-compressed/illustrations/lotus.png'),
  // chakra: require('./images-compressed/illustrations/chakra.png'),
} as const;

export type IllustrationImageKey = keyof typeof IllustrationImages;

// =============================================================================
// NAVIGATION ICONS - Tab bar icons
// =============================================================================
export const NavigationIcons = {
  // Format: iconName and iconNameActive for tab states
  // home: require('./icons/navigation/home.png'),
  // homeActive: require('./icons/navigation/home-active.png'),
} as const;

export type NavigationIconKey = keyof typeof NavigationIcons;

// =============================================================================
// UI ICONS - General interface icons
// =============================================================================
export const UIIcons = {
  // Add UI icons as you upload them
  // play: require('./icons/ui/play.png'),
  // pause: require('./icons/ui/pause.png'),
  // microphone: require('./icons/ui/microphone.png'),
} as const;

export type UIIconKey = keyof typeof UIIcons;

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get phase image by phase number (1-10)
 */
export function getPhaseImage(phaseNumber: number) {
  const key = `phase${phaseNumber}` as PhaseImageKey;
  return PhaseImages[key];
}

/**
 * Phase metadata with images
 */
export const PhaseData = [
  { id: 1, title: 'Self-Evaluation', image: PhaseImages.phase1 },
  { id: 2, title: 'Values & Vision', image: PhaseImages.phase2 },
  { id: 3, title: 'Goal Setting', image: PhaseImages.phase3 },
  { id: 4, title: 'Facing Fears & Limiting Beliefs', image: PhaseImages.phase4 },
  { id: 5, title: 'Cultivating Self-Love', image: PhaseImages.phase5 },
  { id: 6, title: 'Manifestation Techniques', image: PhaseImages.phase6 },
  { id: 7, title: 'Practicing Gratitude', image: PhaseImages.phase7 },
  { id: 8, title: 'Turning Envy Into Inspiration', image: PhaseImages.phase8 },
  { id: 9, title: 'Trust & Surrender', image: PhaseImages.phase9 },
  { id: 10, title: 'Trust & Letting Go', image: PhaseImages.phase10 },
] as const;
