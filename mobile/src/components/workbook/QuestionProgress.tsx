/**
 * QuestionProgress Component
 *
 * A progress indicator showing the current question position in a questionnaire.
 * Uses connected dots style to represent progress through the journey.
 *
 * Design follows APP-DESIGN.md specifications:
 * - Muted gold (#c9a227) for progress indicator
 * - Dark theme with subtle glows
 * - Connected dots showing completed vs remaining
 *
 * @example
 * ```tsx
 * <QuestionProgress
 *   currentIndex={2}
 *   totalQuestions={7}
 *   answeredQuestions={[0, 1]}
 * />
 * ```
 */

import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Text } from '../Text';
import { colors, spacing, typography, fontWeights } from '../../theme';

/**
 * Props for the QuestionProgress component
 */
export interface QuestionProgressProps {
  /** Current question index (0-based) */
  currentIndex: number;
  /** Total number of questions */
  totalQuestions: number;
  /** Array of indices for answered questions */
  answeredQuestions: number[];
  /** Callback when a dot is pressed (for navigation) */
  onDotPress?: (index: number) => void;
  /** Test ID for automation */
  testID?: string;
}

/**
 * QuestionProgress Component
 */
export const QuestionProgress: React.FC<QuestionProgressProps> = ({
  currentIndex,
  totalQuestions,
  answeredQuestions,
  onDotPress,
  testID,
}) => {
  const progressPercentage = ((currentIndex + 1) / totalQuestions) * 100;

  return (
    <View style={styles.container} testID={testID}>
      {/* Progress dots */}
      <View style={styles.dotsContainer}>
        {Array.from({ length: totalQuestions }).map((_, index) => {
          const isAnswered = answeredQuestions.includes(index);
          const isCurrent = index === currentIndex;
          const isPast = index < currentIndex;

          return (
            <React.Fragment key={index}>
              {/* Connecting line (except before first dot) */}
              {index > 0 && (
                <View
                  style={[
                    styles.connectingLine,
                    isPast && styles.connectingLineFilled,
                  ]}
                />
              )}

              {/* Dot */}
              <TouchableOpacity
                style={[
                  styles.dot,
                  isAnswered && styles.dotAnswered,
                  isCurrent && styles.dotCurrent,
                ]}
                onPress={() => onDotPress?.(index)}
                disabled={!onDotPress}
                accessibilityRole="button"
                accessibilityLabel={`Question ${index + 1} of ${totalQuestions}${isAnswered ? ', answered' : ''}${isCurrent ? ', current' : ''}`}
                accessibilityState={{ selected: isCurrent }}
                testID={`${testID}-dot-${index}`}
              >
                {isCurrent && <View style={styles.dotInner} />}
                {isAnswered && !isCurrent && (
                  <Text style={styles.checkmark}>check</Text>
                )}
              </TouchableOpacity>
            </React.Fragment>
          );
        })}
      </View>

      {/* Progress text */}
      <View style={styles.textContainer}>
        <Text style={styles.progressText}>
          Question {currentIndex + 1} of {totalQuestions}
        </Text>
        <Text style={styles.percentageText}>
          {Math.round(progressPercentage)}% Complete
        </Text>
      </View>

      {/* Progress bar (alternative visual) */}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarTrack}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${progressPercentage}%` },
            ]}
          />
        </View>
      </View>
    </View>
  );
};

/**
 * Styles following APP-DESIGN.md dark spiritual theme
 */
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },

  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },

  connectingLine: {
    height: 2,
    width: 20,
    backgroundColor: colors.dark.textTertiary,
    opacity: 0.3,
  },

  connectingLineFilled: {
    backgroundColor: colors.dark.accentGold,
    opacity: 0.6,
  },

  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.dark.textTertiary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  dotAnswered: {
    backgroundColor: colors.dark.accentGold,
    borderColor: colors.dark.accentGold,
  },

  dotCurrent: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderColor: colors.dark.accentGold,
    borderWidth: 2,
    backgroundColor: 'transparent',
    shadowColor: colors.dark.accentGold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 3,
  },

  dotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.dark.accentGold,
  },

  checkmark: {
    fontSize: 8,
    color: colors.dark.bgPrimary,
    fontWeight: fontWeights.bold as any,
  },

  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },

  progressText: {
    ...typography.bodySmall,
    fontSize: 13,
    color: colors.dark.textSecondary,
    fontWeight: fontWeights.medium as any,
  },

  percentageText: {
    ...typography.bodySmall,
    fontSize: 13,
    color: colors.dark.accentGold,
    fontWeight: fontWeights.semibold as any,
  },

  progressBarContainer: {
    paddingHorizontal: spacing.xs,
  },

  progressBarTrack: {
    height: 4,
    backgroundColor: colors.dark.bgElevated,
    borderRadius: 2,
    overflow: 'hidden',
  },

  progressBarFill: {
    height: '100%',
    backgroundColor: colors.dark.accentGold,
    borderRadius: 2,
    shadowColor: colors.dark.accentGold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
});

export default QuestionProgress;
