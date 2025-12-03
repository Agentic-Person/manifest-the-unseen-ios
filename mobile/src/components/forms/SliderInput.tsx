/**
 * SliderInput Component
 *
 * Labeled slider for 0-10 ratings or custom ranges
 * Used for workbook exercises like Wheel of Life assessments
 *
 * @example
 * ```tsx
 * <SliderInput
 *   label="Life Satisfaction"
 *   value={satisfaction}
 *   onValueChange={setSatisfaction}
 *   min={0}
 *   max={10}
 * />
 * ```
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { colors, typography, spacing, fontWeights } from '../../theme';

/**
 * Get color based on value for POSITIVE metrics (higher is better)
 * Red (low/needs work) -> Orange -> Yellow -> Green (high/excellent)
 */
const getPositiveGradientColor = (value: number, max: number = 10): string => {
  // Normalize to 0-1 range
  const normalized = value / max;
  if (normalized <= 0.3) return '#dc2626'; // Red - needs improvement
  if (normalized <= 0.5) return '#c9a227'; // Orange/gold - developing
  if (normalized <= 0.7) return '#8b6914'; // Yellow/amber - good
  return '#2d5a4a'; // Green - excellent
};

export interface SliderInputProps {
  /** Label displayed above the slider */
  label: string;

  /** Current value */
  value: number;

  /** Callback when value changes */
  onValueChange: (value: number) => void;

  /** Minimum value (default: 0) */
  min?: number;

  /** Maximum value (default: 10) */
  max?: number;

  /** Step increment (default: 1) */
  step?: number;

  /** Show current value display (default: true) */
  showValue?: boolean;

  /** Custom track fill color - only used when useGradient is false */
  color?: string;

  /** Disabled state */
  disabled?: boolean;

  /** Custom container style */
  containerStyle?: ViewStyle;

  /** Accessibility label (defaults to label) */
  accessibilityLabel?: string;

  /** Use dynamic gradient colors based on value (default: true) */
  useGradient?: boolean;

  /** Show gradient indicator dots (default: true when useGradient is true) */
  showGradientDots?: boolean;
}

export const SliderInput: React.FC<SliderInputProps> = ({
  label,
  value,
  onValueChange,
  min = 0,
  max = 10,
  step = 1,
  showValue = true,
  color = colors.primary[600],
  disabled = false,
  containerStyle,
  accessibilityLabel,
  useGradient = true,
  showGradientDots = true,
}) => {
  // Determine the active color based on gradient mode
  const activeColor = useGradient ? getPositiveGradientColor(value, max) : color;

  // Calculate number of dots based on range
  const dotCount = Math.min(10, max - min + 1);

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Label and value display */}
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        {showValue && (
          <Text style={[styles.valueDisplay, { color: activeColor }]}>
            {value}
          </Text>
        )}
      </View>

      {/* Gradient indicator dots */}
      {useGradient && showGradientDots && (
        <View style={styles.gradientIndicator}>
          {Array.from({ length: dotCount }, (_, i) => {
            const dotValue = min + i * ((max - min) / (dotCount - 1));
            return (
              <View
                key={i}
                style={[
                  styles.gradientDot,
                  {
                    backgroundColor: getPositiveGradientColor(dotValue, max),
                    opacity: dotValue <= value ? 1 : 0.3,
                  },
                ]}
              />
            );
          })}
        </View>
      )}

      {/* Slider */}
      <Slider
        style={styles.slider}
        value={value}
        onValueChange={onValueChange}
        minimumValue={min}
        maximumValue={max}
        step={step}
        minimumTrackTintColor={activeColor}
        maximumTrackTintColor={colors.gray[700]}
        thumbTintColor={activeColor}
        disabled={disabled}
        accessible
        accessibilityLabel={accessibilityLabel || label}
        accessibilityRole="adjustable"
        accessibilityValue={{
          min,
          max,
          now: value,
        }}
      />

      {/* Min/Max labels */}
      <View style={styles.rangeLabels}>
        <Text style={styles.rangeLabel}>{min}</Text>
        <Text style={styles.rangeLabel}>{max}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },

  label: {
    ...typography.bodySmall,
    fontWeight: fontWeights.semibold as any,
    color: colors.text.primary,
  },

  valueDisplay: {
    ...typography.h4,
    fontWeight: fontWeights.bold as any,
    minWidth: 32,
    textAlign: 'right',
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
    marginTop: -spacing.xs,
    paddingHorizontal: spacing.xs,
  },

  rangeLabel: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
});
