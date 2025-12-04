/**
 * Phase Dashboard Template Component
 *
 * Reusable template for phase dashboards with progress tracking and exercise list.
 * Now with beautiful header images for each phase.
 */

import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, ImageSourcePropType } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { colors, spacing, borderRadius } from '../../theme';
import { getPhaseImage } from '../../assets';

interface Exercise {
  id: string;
  name: string;
  description?: string;
  icon: ImageSourcePropType;
  estimatedTime: string;
  progress?: number;
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
  const phaseImage = getPhaseImage(phaseNumber);

  const handleExercisePress = (exerciseId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onExercisePress(exerciseId);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Phase Header with Image */}
      <View style={styles.headerContainer}>
        <Image source={phaseImage} style={styles.headerImage} resizeMode="cover" />
        <LinearGradient
          colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.8)']}
          style={styles.headerGradient}
        />
        <View style={styles.headerOverlay}>
          <View style={styles.phaseBadge}>
            <Text style={styles.phaseLabel}>Phase {phaseNumber}</Text>
          </View>
          <Text style={styles.title}>{phaseName}</Text>
          <Text style={styles.subtitle}>{phaseDescription}</Text>
        </View>
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
              <Image source={exercise.icon} style={styles.exerciseIconImage} resizeMode="cover" />
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
    paddingBottom: spacing.md,
  },
  headerContainer: {
    height: 220,
    position: 'relative',
    marginBottom: spacing.lg,
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  headerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.md,
  },
  phaseBadge: {
    backgroundColor: colors.primary[500],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: spacing.xs,
  },
  phaseLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.white,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.white,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 22,
  },
  progressCard: {
    backgroundColor: colors.background.elevated,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginHorizontal: spacing.md,
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
    paddingHorizontal: spacing.md,
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
    overflow: 'hidden',
  },
  exerciseIconImage: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg,
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
