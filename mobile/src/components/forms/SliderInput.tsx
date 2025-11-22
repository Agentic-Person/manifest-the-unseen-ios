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

  /** Custom track fill color */
  color?: string;

  /** Disabled state */
  disabled?: boolean;

  /** Custom container style */
  containerStyle?: ViewStyle;

  /** Accessibility label (defaults to label) */
  accessibilityLabel?: string;
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
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {/* Label and value display */}
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        {showValue && (
          <Text style={[styles.valueDisplay, { color }]}>
            {value}
          </Text>
        )}
      </View>

      {/* Slider */}
      <Slider
        style={styles.slider}
        value={value}
        onValueChange={onValueChange}
        minimumValue={min}
        maximumValue={max}
        step={step}
        minimumTrackTintColor={color}
        maximumTrackTintColor={colors.gray[200]}
        thumbTintColor={color}
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
