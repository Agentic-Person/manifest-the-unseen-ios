/**
 * Gradient Progress Bar Component
 *
 * Progress bar with dynamic color based on completion percentage.
 * Colors transition: Red (0-25%) -> Orange (26-50%) -> Yellow (51-75%) -> Green (76-100%)
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme';

export interface GradientProgressBarProps {
  /** Progress percentage (0-100) */
  progress: number;
  /** Height of the progress bar in pixels */
  height?: number;
  /** Whether to show percentage text next to the bar */
  showPercentage?: boolean;
  /** Whether to show a compact version (smaller text) */
  compact?: boolean;
}

/**
 * Get the dynamic color for a progress percentage
 * Red (0-25%) -> Orange (26-50%) -> Yellow (51-75%) -> Green (76-100%)
 */
export function getProgressColor(percentage: number): string {
  if (percentage <= 25) return '#dc2626'; // Red
  if (percentage <= 50) return '#c9a227'; // Orange
  if (percentage <= 75) return '#8b6914'; // Yellow/Amber
  return '#2d5a4a'; // Green
}

/**
 * Gradient Progress Bar
 *
 * @example
 * ```tsx
 * <GradientProgressBar progress={42} />
 * <GradientProgressBar progress={100} showPercentage={false} />
 * <GradientProgressBar progress={75} height={4} compact />
 * ```
 */
export const GradientProgressBar: React.FC<GradientProgressBarProps> = ({
  progress,
  height = 8,
  showPercentage = true,
  compact = false,
}) => {
  const clampedProgress = Math.min(100, Math.max(0, progress));
  const fillColor = getProgressColor(clampedProgress);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={[styles.track, { height }]}>
          <View
            style={[
              styles.fill,
              {
                width: `${clampedProgress}%`,
                backgroundColor: fillColor,
              },
            ]}
          />
        </View>
        {showPercentage && (
          <Text
            style={[
              styles.percentage,
              compact && styles.percentageCompact,
              { color: fillColor },
            ]}
          >
            {Math.round(clampedProgress)}%
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  track: {
    flex: 1,
    backgroundColor: colors.gray[700],
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
  percentage: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
    minWidth: 40,
    textAlign: 'right',
  },
  percentageCompact: {
    fontSize: 12,
    minWidth: 32,
  },
});

export default GradientProgressBar;
