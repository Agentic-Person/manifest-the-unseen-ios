/**
 * Exercise Header Component
 *
 * Reusable header for exercise screens with full-width image,
 * golden border, progress indicator, and title/subtitle.
 *
 * Design pattern matches the Phase Dashboard cards.
 */

import React from 'react';
import { View, Image, ImageSourcePropType, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from '../Text';
import { colors, spacing, borderRadius } from '../../theme';

interface ExerciseHeaderProps {
  /** The exercise image to display */
  image: ImageSourcePropType;
  /** Exercise title */
  title: string;
  /** Exercise description/subtitle */
  subtitle: string;
  /** Progress percentage (0-100) */
  progress?: number;
  /** Whether the exercise is completed */
  isCompleted?: boolean;
}

export const ExerciseHeader: React.FC<ExerciseHeaderProps> = ({
  image,
  title,
  subtitle,
  progress = 0,
  isCompleted = false,
}) => {
  return (
    <View style={styles.container}>
      {/* Header Image Section */}
      <View style={styles.imageContainer}>
        <Image source={image} style={styles.image} resizeMode="cover" />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.imageGradient}
        />
        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBarBg}>
            <LinearGradient
              colors={['#ef4444', '#f97316', '#eab308', '#22c55e']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.progressGradient}
            >
              <View
                style={[
                  styles.progressUnfilled,
                  { width: `${100 - progress}%` },
                ]}
              />
            </LinearGradient>
          </View>
          <Text style={styles.progressText}>
            {isCompleted ? '✓' : `${progress}%`}
          </Text>
        </View>
      </View>

      {/* Title Section */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  imageContainer: {
    width: '100%',
    height: 140,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.brand.gold,
    overflow: 'hidden',
    marginBottom: spacing.md,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 200,
    marginTop: -30,
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  progressContainer: {
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
  progressBarBg: {
    width: 50,
    height: 6,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    marginRight: 6,
  },
  progressGradient: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  progressUnfilled: {
    height: '100%',
    backgroundColor: colors.gray[700],
  },
  progressText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.white,
  },
  titleContainer: {
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing.xs,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 15,
    color: colors.text.secondary,
    lineHeight: 22,
  },
});

export default ExerciseHeader;
