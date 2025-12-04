/**
 * Phase 2 Dashboard - Values & Vision
 *
 * Dashboard for Phase 2 exercises focused on clarifying values and vision.
 * Users can navigate to each individual exercise from this screen.
 */
import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Card, Text } from '../../../components';
import { colors, spacing, borderRadius, shadows } from '../../../theme';
import type { WorkbookStackScreenProps } from '../../../types/navigation';
import { PhaseHeader } from '../../../components/workbook';
import { PhaseImages } from '../../../assets';
import { usePhaseExercises, type ExerciseConfig, type ExerciseWithProgress } from '../../../hooks/usePhaseExercises';

/**
 * Phase 2 exercises configuration
 */
const PHASE2_EXERCISES: ExerciseConfig[] = [
  {
    id: 'life-mission',
    name: 'Life Mission',
    description: 'Define your core life mission',
    icon: '🎯',
    estimatedTime: '20 min',
  },
  {
    id: 'vision-board',
    name: 'Vision Board',
    description: 'Create a visual representation of your goals',
    icon: '🖼️',
    estimatedTime: '30 min',
  },
];

type Props = WorkbookStackScreenProps<'Phase2Dashboard'>;

/**
 * Exercise Card Component
 */
const ExerciseCard: React.FC<{
  exercise: ExerciseWithProgress;
  onPress: () => void;
}> = ({ exercise, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.exerciseCard}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`${exercise.name}, ${exercise.progress}% complete`}
      accessibilityHint={`Opens ${exercise.name} exercise`}
    >
      <View style={styles.exerciseHeader}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{exercise.icon}</Text>
        </View>
        <View style={styles.exerciseInfo}>
          <Text style={styles.exerciseName}>{exercise.name}</Text>
          <Text style={styles.exerciseDescription}>{exercise.description}</Text>
        </View>
        {exercise.isCompleted ? (
          <View style={styles.completedBadge}>
            <Text style={styles.completedCheck}>✓</Text>
          </View>
        ) : (
          <Text style={styles.arrow}>›</Text>
        )}
      </View>
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${exercise.progress}%` },
              exercise.isCompleted && styles.progressFillCompleted,
            ]}
          />
        </View>
        <View style={styles.progressMeta}>
          <Text style={styles.progressText}>
            {exercise.progress}% complete
          </Text>
          <Text style={styles.timeEstimate}>
            {exercise.estimatedTime}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
/**
 * Phase 2 Dashboard Component
 */
const Phase2Dashboard: React.FC<Props> = ({ navigation }) => {
  // Fetch real progress from database and merge with static config
  const {
    exercises,
    completedCount,
    totalCount,
    overallProgress,
    isLoading,
  } = usePhaseExercises(2, PHASE2_EXERCISES);
  /**
   * Handle exercise card press - navigate to appropriate screen
   */
  const handleExercisePress = (exerciseId: string) => {
    switch (exerciseId) {
      case 'life-mission':
        (navigation.navigate as any)('LifeMission');
        break;
      case 'vision-board':
        (navigation.navigate as any)('VisionBoard');
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
      {/* Phase Header with Image */}
      <PhaseHeader
        phaseNumber={2}
        title="Values & Vision"
        subtitle="Clarify your core values and create a compelling vision for your future"
        image={PhaseImages.phase2}
      />
      {/* Overall Progress Card */}
      <Card elevation="raised" style={styles.progressCard}>
        <View style={styles.progressCardHeader}>
          <Text style={styles.progressCardTitle}>Your Progress</Text>
          <Text style={styles.progressCardPercentage}>{overallProgress}%</Text>
        </View>
        <View style={styles.overallProgressBar}>
          <View
            style={[
              styles.overallProgressFill,
              { width: `${overallProgress}%` },
            ]}
          />
        </View>
        <Text style={styles.progressCardSubtext}>
          {completedCount} of {totalCount} exercises completed
        </Text>
      </Card>
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
  header: {
    marginBottom: spacing.lg,
  },
  phaseLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary[600],
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    lineHeight: 24,
  },
  progressCard: {
    marginBottom: spacing.lg,
  },
  progressCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  progressCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  progressCardPercentage: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary[600],
  },
  overallProgressBar: {
    height: 8,
    backgroundColor: colors.gray[200],
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  overallProgressFill: {
    height: '100%',
    backgroundColor: colors.primary[600],
    borderRadius: borderRadius.full,
  },
  progressCardSubtext: {
    fontSize: 14,
    color: colors.text.tertiary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  exercisesList: {
    gap: spacing.sm,
  },
  exerciseCard: {
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  icon: {
    fontSize: 24,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 2,
  },
  exerciseDescription: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  arrow: {
    fontSize: 24,
    color: colors.gray[400],
  },
  completedBadge: {
    width: 28,
    height: 28,
    borderRadius: borderRadius.full,
    backgroundColor: colors.success[500],
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedCheck: {
    fontSize: 16,
    color: colors.white,
    fontWeight: '700',
  },
  progressContainer: {
    marginTop: spacing.xs,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.gray[200],
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary[400],
    borderRadius: borderRadius.full,
  },
  progressFillCompleted: {
    backgroundColor: colors.success[500],
  },
  progressMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 12,
    color: colors.text.tertiary,
  },
  timeEstimate: {
    fontSize: 12,
    color: colors.text.tertiary,
  },
  bottomSpacer: {
    height: spacing.xl,
  },
});
export default Phase2Dashboard;
