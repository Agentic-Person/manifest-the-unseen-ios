/**
 * IntensitySlider Component
 *
 * A visual 1-10 intensity slider with color gradient (green to red).
 * Used for rating fear intensity in Phase 4 exercises.
 *
 * Features:
 * - Color gradient from green (1) to red (10)
 * - Haptic feedback on value changes
 * - Accessible with proper roles and labels
 *
 * @example
 * ```tsx
 * <IntensitySlider
 *   value={intensity}
 *   onValueChange={setIntensity}
 *   label="Fear Intensity"
 * />
 * ```
 */

import React, { useCallback } from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import Slider from '@react-native-community/slider';
import * as Haptics from 'expo-haptics';
import { Text } from '../Text';
import { colors, spacing } from '../../theme';

/**
 * Get color based on intensity value (1-10)
 * Green (low) -> Yellow (medium) -> Red (high)
 */
const getIntensityColor = (value: number): string => {
  if (value <= 3) {
    // Green range
    return '#2d5a4a';
  } else if (value <= 5) {
    // Yellow/amber range
    return '#8b6914';
  } else if (value <= 7) {
    // Orange range
    return '#c9a227';
  } else {
    // Red range
    return '#dc2626';
  }
};

/**
 * Get intensity label based on value
 */
const getIntensityLabel = (value: number): string => {
  if (value <= 2) return 'Minimal';
  if (value <= 4) return 'Low';
  if (value <= 6) return 'Moderate';
  if (value <= 8) return 'High';
  return 'Intense';
};

/**
 * Props for IntensitySlider component
 */
export interface IntensitySliderProps {
  /** Current value (1-10) */
  value: number;

  /** Callback when value changes */
  onValueChange: (value: number) => void;

  /** Label displayed above slider */
  label?: string;

  /** Minimum value (default: 1) */
  min?: number;

  /** Maximum value (default: 10) */
  max?: number;

  /** Disabled state */
  disabled?: boolean;

  /** Custom container style */
  containerStyle?: ViewStyle;

  /** Test ID for automation */
  testID?: string;
}

/**
 * IntensitySlider Component
 */
export const IntensitySlider: React.FC<IntensitySliderProps> = ({
  value,
  onValueChange,
  label = 'Intensity',
  min = 1,
  max = 10,
  disabled = false,
  containerStyle,
  testID,
}) => {
  const intensityColor = getIntensityColor(value);
  const intensityLabel = getIntensityLabel(value);

  /**
   * Handle value change with haptic feedback
   */
  const handleValueChange = useCallback((newValue: number) => {
    const roundedValue = Math.round(newValue);
    if (roundedValue !== value) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onValueChange(roundedValue);
  }, [value, onValueChange]);

  /**
   * Handle sliding complete with medium haptic
   */
  const handleSlidingComplete = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, []);

  return (
    <View style={[styles.container, containerStyle]} testID={testID}>
      {/* Header with label and value */}
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.valueContainer}>
          <View style={[styles.valueBadge, { backgroundColor: `${intensityColor}30` }]}>
            <Text style={[styles.valueNumber, { color: intensityColor }]}>
              {value}
            </Text>
          </View>
          <Text style={[styles.valueLabel, { color: intensityColor }]}>
            {intensityLabel}
          </Text>
        </View>
      </View>

      {/* Slider with gradient background */}
      <View style={styles.sliderContainer}>
        {/* Gradient indicator dots */}
        <View style={styles.gradientIndicator}>
          {Array.from({ length: 10 }, (_, i) => (
            <View
              key={i}
              style={[
                styles.gradientDot,
                {
                  backgroundColor: getIntensityColor(i + 1),
                  opacity: i + 1 <= value ? 1 : 0.3,
                },
              ]}
            />
          ))}
        </View>

        {/* Slider */}
        <Slider
          style={styles.slider}
          value={value}
          onValueChange={handleValueChange}
          onSlidingComplete={handleSlidingComplete}
          minimumValue={min}
          maximumValue={max}
          step={1}
          minimumTrackTintColor={intensityColor}
          maximumTrackTintColor={`${colors.dark.textTertiary}40`}
          thumbTintColor={intensityColor}
          disabled={disabled}
          accessible
          accessibilityLabel={`${label}: ${value} out of ${max}, ${intensityLabel}`}
          accessibilityRole="adjustable"
          accessibilityValue={{
            min,
            max,
            now: value,
            text: intensityLabel,
          }}
        />
      </View>

      {/* Range labels */}
      <View style={styles.rangeLabels}>
        <Text style={styles.rangeLabel}>Low</Text>
        <Text style={styles.rangeLabel}>High</Text>
      </View>
    </View>
  );
};

/**
 * Styles - Dark Spiritual Theme
 */
const styles = StyleSheet.create({
  container: {
    width: '100%',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.dark.textPrimary,
  },

  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },

  valueBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  valueNumber: {
    fontSize: 16,
    fontWeight: '700',
  },

  valueLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  sliderContainer: {
    position: 'relative',
  },

  gradientIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xs,
    marginBottom: spacing.xs,
  },

  gradientDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  slider: {
    width: '100%',
    height: 40,
  },

  rangeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xs,
    marginTop: -spacing.xs,
  },

  rangeLabel: {
    fontSize: 11,
    color: colors.dark.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

export default IntensitySlider;
