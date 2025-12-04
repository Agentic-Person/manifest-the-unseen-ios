/**
 * Phase 4 Dashboard - Facing Fears & Limiting Beliefs
 *
 * Dashboard for Phase 4 exercises focused on confronting fears and reframing beliefs.
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
import { PhaseImages, Phase4ExerciseImages } from '../../../assets';
import { usePhaseExercises, type ExerciseConfig, type ExerciseWithProgress } from '../../../hooks/usePhaseExercises';

/**
 * Phase 4 exercises configuration
 */
const PHASE4_EXERCISES: ExerciseConfig[] = [
  {
    id: 'fear-inventory',
    name: 'Fear Inventory',
    description: 'Identify and examine your fears',
    icon: Phase4ExerciseImages.fearsInventory,
    estimatedTime: '20 min',
  },
  {
    id: 'limiting-beliefs',
    name: 'Limiting Beliefs',
    description: 'Challenge and reframe limiting beliefs',
    icon: Phase4ExerciseImages.limitingBeliefs,
    estimatedTime: '25 min',
  },
  {
    id: 'fear-facing-plan',
    name: 'Fear Facing Plan',
    description: 'Create a plan to overcome your fears',
    icon: Phase4ExerciseImages.facingPlan,
    estimatedTime: '15 min',
  },
];

type Props = WorkbookStackScreenProps<'Phase4Dashboard'>;

/**
 * Exercise Card Component
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
 * Phase 4 Dashboard Component
 */
const Phase4Dashboard: React.FC<Props> = ({ navigation }) => {
  // Fetch real progress from database and merge with static config
  const {
    exercises,
    completedCount,
    totalCount,
    overallProgress,
    isLoading,
  } = usePhaseExercises(4, PHASE4_EXERCISES);
  /**
   * Handle exercise card press - navigate to appropriate screen
   */
  const handleExercisePress = (exerciseId: string) => {
    switch (exerciseId) {
      case 'fear-inventory':
        (navigation.navigate as any)('FearInventory');
        break;
      case 'limiting-beliefs':
        (navigation.navigate as any)('LimitingBeliefs');
        break;
      case 'fear-facing-plan':
        (navigation.navigate as any)('FearFacingPlan');
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
        <View style={styles.headerImageContainer}>
          <Image
            source={PhaseImages.phase4}
            style={styles.headerImage}
            resizeMode="cover"
          />
        </View>
        <Text style={styles.headerTitle}>Facing Fears</Text>
        <Text style={styles.headerSubtitle}>
          Confront the fears and limiting beliefs that hold you back. Transform them into sources of strength.
        </Text>
      </View>

      {/* Compact Progress Section */}
      <View style={styles.progressSection}>
        <View style={styles.gradientProgressContainer}>
          <LinearGradient
            colors={['#ef4444', '#f97316', '#eab308', '#22c55e']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientProgressTrack}
          >
            <View
              style={[
                styles.gradientProgressUnfilled,
                { width: `${100 - overallProgress}%` },
              ]}
            />
          </LinearGradient>
        </View>
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
export default Phase4Dashboard;
