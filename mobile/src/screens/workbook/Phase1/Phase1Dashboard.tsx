/**
 * Phase 1 Dashboard - Self-Evaluation
 *
 * Main dashboard showing all 12 exercises in Phase 1 with progress tracking.
 * Users can navigate to each individual exercise from this screen.
 */
import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from '../../../components';
import { colors, spacing, borderRadius } from '../../../theme';
import type { WorkbookStackScreenProps } from '../../../types/navigation';
import { PhaseImages, Phase1ExerciseImages } from '../../../assets';
import { usePhaseExercises, type ExerciseConfig, type ExerciseWithProgress } from '../../../hooks/usePhaseExercises';

/**
 * Phase 1 exercises configuration
 */
const PHASE1_EXERCISES: ExerciseConfig[] = [
  {
    id: 'wheel-of-life',
    name: 'Wheel of Life',
    description: 'Rate 8 life areas and visualize balance',
    icon: Phase1ExerciseImages.wheelOfLife,
    estimatedTime: '10 min',
  },
  {
    id: 'feel-wheel',
    name: 'Feel Wheel',
    description: 'Track and identify your emotions',
    icon: Phase1ExerciseImages.feelWheel,
    estimatedTime: '5 min',
  },
  {
    id: 'habit-tracking',
    name: 'Habit Tracking',
    description: 'Assess your daily routines and habits',
    icon: Phase1ExerciseImages.habitTracking,
    estimatedTime: '15 min',
  },
  {
    id: 'abc-model',
    name: 'ABC Model',
    description: 'Cognitive behavioral analysis',
    icon: Phase1ExerciseImages.abcModel,
    estimatedTime: '20 min',
  },
  {
    id: 'swot-analysis',
    name: 'SWOT Analysis',
    description: 'Strengths, Weaknesses, Opportunities, Threats',
    icon: Phase1ExerciseImages.swotAnalysis,
    estimatedTime: '25 min',
  },
  {
    id: 'personal-values',
    name: 'Personal Values',
    description: 'Identify your core values',
    icon: Phase1ExerciseImages.personalValues,
    estimatedTime: '20 min',
  },
  {
    id: 'strengths-weaknesses',
    name: 'Strengths & Weaknesses',
    description: 'Deep dive into your capabilities',
    icon: Phase1ExerciseImages.strengthsWeaknesses,
    estimatedTime: '15 min',
  },
  {
    id: 'comfort-zone',
    name: 'Comfort Zone',
    description: 'Map your comfort boundaries',
    icon: Phase1ExerciseImages.comfortZone,
    estimatedTime: '15 min',
  },
  {
    id: 'know-yourself',
    name: 'Know Yourself',
    description: 'Personal insights questionnaire',
    icon: Phase1ExerciseImages.knowYourself,
    estimatedTime: '20 min',
  },
  {
    id: 'abilities-rating',
    name: 'Abilities Rating',
    description: 'Rate your skills and abilities',
    icon: Phase1ExerciseImages.abilitiesRating,
    estimatedTime: '15 min',
  },
  {
    id: 'thought-awareness',
    name: 'Thought Awareness',
    description: 'Mindfulness and thought patterns',
    icon: Phase1ExerciseImages.thoughtAwareness,
    estimatedTime: '10 min',
  },
];

type Props = WorkbookStackScreenProps<'Phase1Dashboard'>;

/**
 * Exercise Card Component - Styled like Workbook Journey phase cards
 */
const ExerciseCard: React.FC<{
  exercise: ExerciseWithProgress;
  onPress: () => void;
}> = ({ exercise, onPress }) => {
  return (
    <TouchableOpacity
      style={[
        styles.exerciseCard,
        exercise.isCompleted && styles.exerciseCardCompleted,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={`${exercise.name}, ${exercise.progress}% complete`}
      accessibilityHint={`Opens ${exercise.name} exercise`}
    >
      {/* Exercise Image */}
      <View style={styles.exerciseImageContainer}>
        <Image source={exercise.icon} style={styles.exerciseImage} resizeMode="cover" />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.exerciseImageGradient}
        />
        {/* Progress Bar at Bottom Right */}
        <View style={styles.exerciseProgressContainer}>
          <View style={styles.exerciseProgressBarBg}>
            <LinearGradient
              colors={['#ef4444', '#f97316', '#eab308', '#22c55e']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.exerciseProgressGradient}
            >
              <View
                style={[
                  styles.exerciseProgressUnfilled,
                  { width: `${100 - exercise.progress}%` },
                ]}
              />
            </LinearGradient>
          </View>
          <Text style={styles.exerciseProgressText}>
            {exercise.isCompleted ? '✓' : `${exercise.progress}%`}
          </Text>
        </View>
      </View>

      {/* Exercise Content */}
      <View style={styles.exerciseContent}>
        <View style={styles.exerciseInfo}>
          <View style={styles.exerciseTitleRow}>
            <Text style={styles.exerciseName}>{exercise.name}</Text>
            <Text style={styles.exerciseTime}>{exercise.estimatedTime}</Text>
          </View>
          <Text style={styles.exerciseDescription}>{exercise.description}</Text>
        </View>
        <Text style={styles.exerciseArrow}>›</Text>
      </View>
    </TouchableOpacity>
  );
};
/**
 * Phase 1 Dashboard Component
 */
const Phase1Dashboard: React.FC<Props> = ({ navigation }) => {
  // Fetch real progress from database and merge with static config
  const {
    exercises,
    completedCount,
    totalCount,
    overallProgress,
    isLoading,
  } = usePhaseExercises(1, PHASE1_EXERCISES);
  /**
   * Handle exercise card press - navigate to appropriate screen
   */
  const handleExercisePress = (exerciseId: string) => {
    switch (exerciseId) {
      case 'wheel-of-life':
        navigation.navigate('WheelOfLife');
        break;
      case 'feel-wheel':
        navigation.navigate('FeelWheel');
        break;
      case 'swot-analysis':
        navigation.navigate('SWOT');
        break;
      case 'personal-values':
        navigation.navigate('PersonalValues');
        break;
      case 'habit-tracking':
        navigation.navigate('HabitTracking');
        break;
      case 'abc-model':
        navigation.navigate('AbcModel');
        break;
      case 'strengths-weaknesses':
        navigation.navigate('StrengthsWeaknesses');
        break;
      case 'comfort-zone':
        navigation.navigate('ComfortZone');
        break;
      case 'know-yourself':
        navigation.navigate('KnowYourself');
        break;
      case 'abilities-rating':
        navigation.navigate('AbilitiesRating');
        break;
      case 'thought-awareness':
        navigation.navigate('ThoughtAwareness');
        break;
      default:
        console.log('Unknown exercise:', exerciseId);
    }
  };
  // Show loading state while fetching progress
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary[600]} />
      </View>
    );
  }
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* New Header Section */}
      <View style={styles.newHeader}>
        {/* Centered Image with Golden Border */}
        <View style={styles.headerImageContainer}>
          <Image
            source={PhaseImages.phase1}
            style={styles.headerImage}
            resizeMode="cover"
          />
        </View>

        {/* Centered Title */}
        <Text style={styles.headerTitle}>Self-Evaluation</Text>

        {/* Centered Subtitle */}
        <Text style={styles.headerSubtitle}>
          Discover who you truly are through deep self-reflection
        </Text>
      </View>

      {/* Compact Progress Section */}
      <View style={styles.progressSection}>
        {/* Gradient Progress Bar */}
        <View style={styles.gradientProgressContainer}>
          <LinearGradient
            colors={['#ef4444', '#f97316', '#eab308', '#22c55e']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientProgressTrack}
          >
            {/* Unfilled overlay from right */}
            <View
              style={[
                styles.gradientProgressUnfilled,
                { width: `${100 - overallProgress}%` },
              ]}
            />
          </LinearGradient>
        </View>

        {/* Progress Text - All on one line */}
        <Text style={styles.progressCount}>
          {completedCount} of {totalCount} exercises completed • {overallProgress}%
        </Text>
      </View>
      {/* Exercises List */}
      <View style={styles.exercisesList}>
        <Text style={styles.sectionTitle}>Exercises</Text>
        {exercises.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            onPress={() => handleExercisePress(exercise.id)}
          />
        ))}
      </View>
      {/* Bottom Spacing */}
      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};
/**
 * Styles
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  content: {
    padding: spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
  },
  // New Header Styles
  newHeader: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  headerImageContainer: {
    width: '100%',
    height: 140,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.brand.gold,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  headerImage: {
    width: '100%',
    height: 200,
    marginTop: -30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: 15,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: spacing.md,
  },
  // Progress Section Styles
  progressSection: {
    alignItems: 'center',
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  gradientProgressContainer: {
    width: '100%',
    height: 10,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  gradientProgressTrack: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  gradientProgressUnfilled: {
    height: '100%',
    backgroundColor: colors.gray[700],
  },
  progressCount: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  exercisesList: {
    gap: spacing.md,
  },
  exerciseCard: {
    backgroundColor: colors.background.elevated,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  exerciseCardCompleted: {
    borderColor: colors.success[500],
    opacity: 0.85,
  },
  exerciseImageContainer: {
    height: 120,
    backgroundColor: colors.primary[800],
    position: 'relative',
  },
  exerciseImage: {
    width: '100%',
    height: '100%',
  },
  exerciseImageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  exerciseProgressContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: borderRadius.md,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  exerciseProgressBarBg: {
    width: 50,
    height: 6,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    marginRight: 6,
  },
  exerciseProgressGradient: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  exerciseProgressUnfilled: {
    height: '100%',
    backgroundColor: colors.gray[700],
  },
  exerciseProgressText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.white,
  },
  exerciseContent: {
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    flex: 1,
  },
  exerciseDescription: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  exerciseTime: {
    fontSize: 12,
    color: colors.text.tertiary,
    marginLeft: spacing.sm,
  },
  exerciseArrow: {
    fontSize: 28,
    color: colors.text.tertiary,
    marginLeft: 12,
  },
  bottomSpacer: {
    height: spacing.xl,
  },
});
export default Phase1Dashboard;
