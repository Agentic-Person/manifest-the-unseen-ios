/**
 * LifeAreaSlider Component
 *
 * A beautifully styled slider for rating life areas in the Wheel of Life exercise.
 * Features the dark spiritual theme from APP-DESIGN.md.
 *
 * Design Requirements:
 * - Dark background (#252547 card, #1a1a2e background)
 * - Muted gold accent for active states (#c9a227)
 * - Subtle gradients and glows
 * - Organic, rounded corners (spiritual aesthetic)
 *
 * @example
 * ```tsx
 * <LifeAreaSlider
 *   label="Career"
 *   description="Your professional life and job satisfaction"
 *   value={7}
 *   onValueChange={(value) => updateCareer(value)}
 *   accentColor="#4a1a6b"
 * />
 * ```
 */

import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import Slider from '@react-native-community/slider';
import * as Haptics from 'expo-haptics';

// Design system colors from APP-DESIGN.md
const DESIGN_COLORS = {
  bgPrimary: '#1a1a2e',
  bgSecondary: '#16213e',
  bgElevated: '#252547',
  textPrimary: '#e8e8e8',
  textSecondary: '#a0a0b0',
  textTertiary: '#6b6b80',
  accentPurple: '#4a1a6b',
  accentGold: '#c9a227',
  accentTeal: '#1a5f5f',
  border: '#3a3a5a',
};

/**
 * Get color based on value for POSITIVE metrics (higher is better)
 * Red (low/needs work) -> Orange -> Yellow -> Green (high/excellent)
 */
const getPositiveGradientColor = (value: number): string => {
  if (value <= 3) return '#dc2626'; // Red - needs improvement
  if (value <= 5) return '#c9a227'; // Orange/gold - developing
  if (value <= 7) return '#8b6914'; // Yellow/amber - good
  return '#2d5a4a'; // Green - excellent
};

export interface LifeAreaSliderProps {
  /** Label for the life area */
  label: string;
  /** Description of what this area represents */
  description?: string;
  /** Current rating value (1-10) */
  value: number;
  /** Callback when value changes */
  onValueChange: (value: number) => void;
  /** Accent color for this area (defaults to gold) - only used when useGradient is false */
  accentColor?: string;
  /** Whether the slider is disabled */
  disabled?: boolean;
  /** Callback when slider is pressed (for expanding details) */
  onPress?: () => void;
  /** Whether this slider is currently selected/focused */
  isSelected?: boolean;
  /** Use dynamic gradient colors based on value (default: true) */
  useGradient?: boolean;
  /** Show gradient indicator dots (default: true when useGradient is true) */
  showGradientDots?: boolean;
}

export const LifeAreaSlider: React.FC<LifeAreaSliderProps> = ({
  label,
  description,
  value,
  onValueChange,
  accentColor = DESIGN_COLORS.accentGold,
  disabled = false,
  onPress,
  isSelected = false,
  useGradient = true,
  showGradientDots = true,
}) => {
  // Determine the active color based on gradient mode
  const activeColor = useGradient ? getPositiveGradientColor(value) : accentColor;
  /**
   * Handle slider value change with haptic feedback
   */
  const handleValueChange = useCallback(
    (newValue: number) => {
      const roundedValue = Math.round(newValue);
      if (roundedValue !== value) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      onValueChange(roundedValue);
    },
    [onValueChange, value]
  );

  /**
   * Get rating label based on value
   */
  const getRatingLabel = (val: number): string => {
    if (val <= 2) return 'Needs Work';
    if (val <= 4) return 'Developing';
    if (val <= 6) return 'Moderate';
    if (val <= 8) return 'Good';
    return 'Excellent';
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        isSelected && styles.containerSelected,
        pressed && styles.containerPressed,
        disabled && styles.containerDisabled,
      ]}
      disabled={disabled}
    >
      {/* Header: Label and Value */}
      <View style={styles.header}>
        <View style={styles.labelContainer}>
          <View style={[styles.colorDot, { backgroundColor: activeColor }]} />
          <Text style={styles.label}>{label}</Text>
        </View>
        <View style={styles.valueContainer}>
          <Text style={[styles.value, { color: activeColor }]}>{value}</Text>
          <Text style={styles.maxValue}>/10</Text>
        </View>
      </View>

      {/* Description */}
      {description && (
        <Text style={styles.description}>{description}</Text>
      )}

      {/* Slider */}
      <View style={styles.sliderContainer}>
        {/* Gradient indicator dots */}
        {useGradient && showGradientDots && (
          <View style={styles.gradientIndicator}>
            {Array.from({ length: 10 }, (_, i) => (
              <View
                key={i}
                style={[
                  styles.gradientDot,
                  {
                    backgroundColor: getPositiveGradientColor(i + 1),
                    opacity: i + 1 <= value ? 1 : 0.3,
                  },
                ]}
              />
            ))}
          </View>
        )}
        <Slider
          style={styles.slider}
          value={value}
          onValueChange={handleValueChange}
          minimumValue={1}
          maximumValue={10}
          step={1}
          minimumTrackTintColor={activeColor}
          maximumTrackTintColor={DESIGN_COLORS.border}
          thumbTintColor={activeColor}
          disabled={disabled}
          accessible
          accessibilityLabel={`${label} rating`}
          accessibilityRole="adjustable"
          accessibilityValue={{
            min: 1,
            max: 10,
            now: value,
          }}
        />
      </View>

      {/* Rating Labels */}
      <View style={styles.labelsRow}>
        <Text style={styles.minLabel}>1</Text>
        <Text style={[styles.ratingLabel, { color: activeColor }]}>
          {getRatingLabel(value)}
        </Text>
        <Text style={styles.maxLabel}>10</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: DESIGN_COLORS.bgElevated,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
    // Subtle shadow for floating card effect
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  containerSelected: {
    borderColor: DESIGN_COLORS.accentGold,
    borderWidth: 2,
  },
  containerPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  containerDisabled: {
    opacity: 0.5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: DESIGN_COLORS.textPrimary,
    letterSpacing: 0.3,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
  },
  maxValue: {
    fontSize: 14,
    color: DESIGN_COLORS.textTertiary,
    marginLeft: 2,
  },
  description: {
    fontSize: 13,
    color: DESIGN_COLORS.textTertiary,
    lineHeight: 18,
    marginBottom: 8,
    marginLeft: 22,
  },
  sliderContainer: {
    marginHorizontal: -4,
  },
  gradientIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginBottom: 4,
  },
  gradientDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  slider: {
    width: '100%',
    height: 44,
  },
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: -4,
    paddingHorizontal: 4,
  },
  minLabel: {
    fontSize: 12,
    color: DESIGN_COLORS.textTertiary,
    width: 20,
  },
  ratingLabel: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  maxLabel: {
    fontSize: 12,
    color: DESIGN_COLORS.textTertiary,
    width: 20,
    textAlign: 'right',
  },
});

export default LifeAreaSlider;
