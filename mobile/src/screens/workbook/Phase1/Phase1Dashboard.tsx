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
} from 'react-native';
import { Card, Text } from '../../../components';
import { colors, spacing, borderRadius, shadows } from '../../../theme';
import type { WorkbookStackScreenProps } from '../../../types/navigation';

/**
 * Exercise data structure
 */
interface Exercise {
  id: string;
  name: string;
  description: string;
  icon: string;
  progress: number; // 0-100
  isCompleted: boolean;
  estimatedTime: string;
}

/**
 * Phase 1 exercises configuration
 */
const PHASE1_EXERCISES: Exercise[] = [
  {
    id: 'wheel-of-life',
    name: 'Wheel of Life',
    description: 'Rate 8 life areas and visualize balance',
    icon: '🎯',
    progress: 0,
    isCompleted: false,
    estimatedTime: '10 min',
  },
  {
    id: 'feel-wheel',
    name: 'Feel Wheel',
    description: 'Track and identify your emotions',
    icon: '😊',
    progress: 0,
    isCompleted: false,
    estimatedTime: '5 min',
  },
  {
    id: 'habit-tracking',
    name: 'Habit Tracking',
    description: 'Assess your daily routines and habits',
    icon: '📊',
    progress: 0,
    isCompleted: false,
    estimatedTime: '15 min',
  },
  {
    id: 'abc-model',
    name: 'ABC Model',
    description: 'Cognitive behavioral analysis',
    icon: '🧠',
    progress: 0,
    isCompleted: false,
    estimatedTime: '20 min',
  },
  {
    id: 'swot-analysis',
    name: 'SWOT Analysis',
    description: 'Strengths, Weaknesses, Opportunities, Threats',
    icon: '📋',
    progress: 0,
    isCompleted: false,
    estimatedTime: '25 min',
  },
  {
    id: 'personal-values',
    name: 'Personal Values',
    description: 'Identify your core values',
    icon: '💎',
    progress: 0,
    isCompleted: false,
    estimatedTime: '20 min',
  },
  {
    id: 'strengths-weaknesses',
    name: 'Strengths & Weaknesses',
    description: 'Deep dive into your capabilities',
    icon: '💪',
    progress: 0,
    isCompleted: false,
    estimatedTime: '15 min',
  },
  {
    id: 'comfort-zone',
    name: 'Comfort Zone',
    description: 'Map your comfort boundaries',
    icon: '🌀',
    progress: 0,
    isCompleted: false,
    estimatedTime: '15 min',
  },
  {
    id: 'know-yourself',
    name: 'Know Yourself',
    description: 'Personal insights questionnaire',
    icon: '🔍',
    progress: 0,
    isCompleted: false,
    estimatedTime: '20 min',
  },
  {
    id: 'abilities-rating',
    name: 'Abilities Rating',
    description: 'Rate your skills and abilities',
    icon: '⭐',
    progress: 0,
    isCompleted: false,
    estimatedTime: '15 min',
  },
  {
    id: 'thought-awareness',
    name: 'Thought Awareness',
    description: 'Mindfulness and thought patterns',
    icon: '💭',
    progress: 0,
    isCompleted: false,
    estimatedTime: '10 min',
  },
];

type Props = WorkbookStackScreenProps<'Phase1Dashboard'>;

/**
 * Exercise Card Component
 */
const ExerciseCard: React.FC<{
  exercise: Exercise;
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
 * Phase 1 Dashboard Component
 */
const Phase1Dashboard: React.FC<Props> = ({ navigation }) => {
  // Calculate overall progress
  const completedExercises = PHASE1_EXERCISES.filter(e => e.isCompleted).length;
  const totalExercises = PHASE1_EXERCISES.length;
  const overallProgress = Math.round(
    PHASE1_EXERCISES.reduce((sum, e) => sum + e.progress, 0) / totalExercises
  );

  /**
   * Handle exercise card press - navigate to appropriate screen
   */
  const handleExercisePress = (exerciseId: string) => {
    switch (exerciseId) {
      case 'wheel-of-life':
        navigation.navigate('WheelOfLife');
        break;
      case 'swot-analysis':
        navigation.navigate('SWOT');
        break;
      default:
        // TODO: Navigate to other exercise screens as they are implemented
        console.log('Navigate to exercise:', exerciseId);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.phaseLabel}>Phase 1</Text>
        <Text style={styles.title}>Self-Evaluation</Text>
        <Text style={styles.subtitle}>
          Discover who you truly are through deep self-reflection
        </Text>
      </View>

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
          {completedExercises} of {totalExercises} exercises completed
        </Text>
      </Card>

      {/* Exercises List */}
      <View style={styles.exercisesList}>
        <Text style={styles.sectionTitle}>Exercises</Text>
        {PHASE1_EXERCISES.map((exercise) => (
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
    backgroundColor: colors.primary[50],
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

export default Phase1Dashboard;
