/**
 * Workbook Components
 *
 * Exports all components used in the workbook exercises.
 */

// Wheel of Life Components
export { WheelChart, LIFE_AREAS } from './WheelChart';
export type { WheelOfLifeValues, LifeAreaKey } from './WheelChart';

export { LifeAreaSlider } from './LifeAreaSlider';
export type { LifeAreaSliderProps } from './LifeAreaSlider';

// SWOT Analysis Components (Organic Flower Petal Design)
export { SWOTTag } from './SWOTTag';
export type { SWOTTagProps, SWOTQuadrantType } from './SWOTTag';

export { SWOTQuadrant } from './SWOTQuadrant';
export type { SWOTQuadrantProps } from './SWOTQuadrant';

// Values Assessment Components
export { ValueCard } from './ValueCard';

// Habits Audit Components
export { HabitEntry } from './HabitEntry';
export { HabitSection } from './HabitSection';

// Phase 2: Purpose Statement Components
export { GuidedQuestion } from './GuidedQuestion';
export type { GuidedQuestionProps, GuidedQuestionData } from './GuidedQuestion';

export { StatementDisplay } from './StatementDisplay';
export type { StatementDisplayProps } from './StatementDisplay';

export { QuestionProgress } from './QuestionProgress';
export type { QuestionProgressProps } from './QuestionProgress';

// Phase 2: Life Mission Components
export { MissionSection } from './MissionSection';
export type { MissionSectionProps, MissionId } from './MissionSection';

export { CombinedMissionView } from './CombinedMissionView';
export type { CombinedMissionViewProps } from './CombinedMissionView';

// Phase 3: Goal Setting Components
export { GoalCard, CATEGORY_COLORS, CATEGORY_NAMES } from './GoalCard';
export type { GoalCardProps, SMARTGoal, GoalCategory, GoalStatus } from './GoalCard';

export { SMARTGoalForm } from './SMARTGoalForm';
export type { SMARTGoalFormProps } from './SMARTGoalForm';

// Phase 3: Action Plan Components
export { default as ActionStep } from './ActionStep';
export type { ActionStepData } from './ActionStep';

export { default as StepList } from './StepList';

// Phase 4: Facing Fears & Limiting Beliefs Components
export { IntensitySlider } from './IntensitySlider';
export type { IntensitySliderProps } from './IntensitySlider';

export { FearCard, FEAR_CATEGORIES } from './FearCard';
export type { FearCardProps, Fear, FearCategory } from './FearCard';

export { BeliefCard } from './BeliefCard';
export type { BeliefCardProps, LimitingBelief } from './BeliefCard';

// Phase 5: Cultivating Self-Love & Self-Care Components
export { default as AffirmationCard } from './AffirmationCard';
export type { AffirmationCardProps, AffirmationData, AffirmationCategory } from './AffirmationCard';

export { default as RoutineItem, ACTIVITY_ICONS } from './RoutineItem';
export type { RoutineItemProps, RoutineActivityData } from './RoutineItem';

export { default as StreakCounter, STREAK_THRESHOLDS, getStreakLevel } from './StreakCounter';
export type { StreakCounterProps } from './StreakCounter';

// Phase 7: Practicing Gratitude Components
export { GratitudeItem, GRATITUDE_CATEGORIES } from './GratitudeItem';
export type { GratitudeItemProps, GratitudeItemData, GratitudeCategory } from './GratitudeItem';

export { StreakDisplay } from './StreakDisplay';
export type { StreakDisplayProps, StreakData } from './StreakDisplay';

export { MeditationTimer, DURATION_OPTIONS } from './MeditationTimer';
export type { MeditationTimerProps, TimerState } from './MeditationTimer';
// Phase 6: Manifestation Techniques Components
export { RepetitionTracker, PERIOD_CONFIG } from './RepetitionTracker';
export type { RepetitionTrackerProps, RepetitionPeriod, PeriodConfig } from './RepetitionTracker';

export { ScriptTemplate, SCRIPT_TEMPLATES, CATEGORY_COLORS as SCRIPT_CATEGORY_COLORS } from './ScriptTemplate';
export type { ScriptTemplateProps, ScriptTemplateData } from './ScriptTemplate';

export { WOOPSection, WOOP_CONFIG } from './WOOPSection';
export type { WOOPSectionProps, WOOPSectionType, WOOPSectionConfig } from './WOOPSection';

// Phase 8: Turning Envy Into Inspiration Components
export { EnvyCard, ENVY_CATEGORIES } from './EnvyCard';
export type { EnvyCardProps, EnvyItem, EnvyCategory } from './EnvyCard';

export { ReframeCard } from './ReframeCard';
export type { ReframeCardProps, ReframeData } from './ReframeCard';

export { RoleModelCard, ROLE_MODEL_CATEGORIES } from './RoleModelCard';
export type { RoleModelCardProps, RoleModel, RoleModelCategory } from './RoleModelCard';

// Phase 9: Trust & Surrender Components
export { TrustRadar, TRUST_DIMENSIONS } from './TrustRadar';
export type { TrustRadarProps, TrustValues, TrustDimension, TrustDimensionConfig } from './TrustRadar';

export { SurrenderCard, SURRENDER_AFFIRMATIONS } from './SurrenderCard';
export type { SurrenderCardProps, SurrenderEntryData } from './SurrenderCard';

export { SignCard, SIGN_CATEGORIES } from './SignCard';
export type { SignCardProps, SignEntryData, SignCategory, SignCategoryConfig } from './SignCard';

// Phase 10: Trust & Letting Go Components
export { PhaseProgressCard } from './PhaseProgressCard';
export type { PhaseProgressCardProps, PhaseProgressData } from './PhaseProgressCard';

export { SealedLetter } from './SealedLetter';
export type { SealedLetterProps } from './SealedLetter';

export { CertificateView } from './CertificateView';
export type { CertificateViewProps } from './CertificateView';

export { ConfettiCelebration, ConfettiBurst } from './ConfettiCelebration';
export type { ConfettiCelebrationProps, ConfettiBurstProps } from './ConfettiCelebration';

// Save Status Indicator
export { SaveIndicator } from './SaveIndicator';
export type { default as SaveIndicatorDefault } from './SaveIndicator';

// Dashboard Navigation Components
export { PhaseCard } from './PhaseCard';
export { ProgressBar } from './ProgressBar';
export { PhaseDashboard } from './PhaseDashboard';
// Phase Header Component
export { PhaseHeader } from './PhaseHeader';

// Exercise Header Component (for individual exercise screens)
export { ExerciseHeader } from './ExerciseHeader';
