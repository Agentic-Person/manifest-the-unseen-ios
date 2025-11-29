/**
 * Phase Dashboard Template Component
 *
 * Reusable template for phase dashboards with progress tracking and exercise list.
 * Agent 3 can use this to create Phase2-10 dashboards.
 */

import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, spacing, borderRadius } from '../../theme';

interface Exercise {
  id: string;
  name: string;
  description?: string;
  icon: string;
  estimatedTime: string;
  progress?: number; // 0-100
  isCompleted: boolean;
}

interface PhaseDashboardProps {
  phaseNumber: number;
  phaseName: string;
  phaseDescription: string;
  exercises: Exercise[];
  overallProgress: number;
  onExercisePress: (exerciseId: string) => void;
}

export const PhaseDashboard: React.FC<PhaseDashboardProps> = ({
  phaseNumber,
  phaseName,
  phaseDescription,
  exercises,
  overallProgress,
  onExercisePress,
}) => {
  const completedCount = exercises.filter((e) => e.isCompleted).length;

  const handleExercisePress = (exerciseId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onExercisePress(exerciseId);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.phaseLabel}>Phase {phaseNumber}</Text>
        <Text style={styles.title}>{phaseName}</Text>
        <Text style={styles.subtitle}>{phaseDescription}</Text>
      </View>

      {/* Progress Card */}
      <View style={styles.progressCard}>
        <View style={styles.progressCardHeader}>
          <Text style={styles.progressCardTitle}>Your Progress</Text>
          <Text style={styles.progressCardPercentage}>
            {Math.round(overallProgress)}%
          </Text>
        </View>
        <View style={styles.progressBarContainer}>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${overallProgress}%` },
              ]}
            />
          </View>
        </View>
        <Text style={styles.progressCardSubtext}>
          {completedCount} of {exercises.length} exercises completed
        </Text>
      </View>

      {/* Exercises List */}
      <View style={styles.exercisesSection}>
        <Text style={styles.sectionTitle}>Exercises</Text>
        {exercises.map((exercise) => (
          <TouchableOpacity
            key={exercise.id}
            style={[
              styles.exerciseCard,
              exercise.isCompleted && styles.exerciseCompleted,
            ]}
            onPress={() => handleExercisePress(exercise.id)}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={`${exercise.name}. ${
              exercise.isCompleted ? 'Completed' : 'Not started'
            }`}
          >
            <View style={styles.exerciseIcon}>
              <Text style={styles.exerciseIconText}>{exercise.icon}</Text>
            </View>
            <View style={styles.exerciseInfo}>
              <Text style={styles.exerciseName}>{exercise.name}</Text>
              {exercise.description && (
                <Text style={styles.exerciseDescription}>
                  {exercise.description}
                </Text>
              )}
              <Text style={styles.exerciseTime}>{exercise.estimatedTime}</Text>
            </View>
            {exercise.isCompleted ? (
              <View style={styles.completedBadge}>
                <Text style={styles.completedIcon}>✓</Text>
              </View>
            ) : (
              <Text style={styles.arrowIcon}>›</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Bottom Spacing */}
      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

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
    backgroundColor: colors.background.elevated,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.default,
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
  progressBarContainer: {
    marginBottom: spacing.sm,
  },
  progressTrack: {
    height: 8,
    backgroundColor: colors.gray[700],
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary[600],
    borderRadius: borderRadius.full,
  },
  progressCardSubtext: {
    fontSize: 14,
    color: colors.text.tertiary,
  },
  exercisesSection: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  exerciseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.elevated,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  exerciseCompleted: {
    opacity: 0.7,
    borderColor: colors.success[500],
    borderWidth: 1,
  },
  exerciseIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  exerciseIconText: {
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
    marginBottom: 2,
  },
  exerciseTime: {
    fontSize: 12,
    color: colors.text.tertiary,
  },
  completedBadge: {
    width: 28,
    height: 28,
    borderRadius: borderRadius.full,
    backgroundColor: colors.success[500],
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedIcon: {
    fontSize: 16,
    color: colors.white,
    fontWeight: '700',
  },
  arrowIcon: {
    fontSize: 24,
    color: colors.gray[400],
  },
  bottomSpacer: {
    height: spacing.xl,
  },
});
