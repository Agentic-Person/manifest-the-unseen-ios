/**
 * Progress Bar Component
 *
 * Reusable progress bar with customizable styling.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme';

interface ProgressBarProps {
  progress: number; // 0-100
  label?: string;
  showPercentage?: boolean;
  height?: number;
  fillColor?: string;
  backgroundColor?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  label,
  showPercentage = true,
  height = 8,
  fillColor = colors.primary[600],
  backgroundColor = colors.gray[200],
}) => {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.row}>
        <View style={[styles.track, { height, backgroundColor }]}>
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
          <Text style={styles.percentage}>{Math.round(clampedProgress)}%</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 4,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  track: {
    flex: 1,
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
  percentage: {
    fontSize: 14,
    color: colors.text.primary,
    fontWeight: '600',
    marginLeft: 8,
    minWidth: 40,
    textAlign: 'right',
  },
});
