/**
 * RatingScale Component
 *
 * Horizontal scale with tappable number buttons for ratings
 * Used for workbook exercises requiring specific value selection
 *
 * @example
 * ```tsx
 * <RatingScale
 *   label="How satisfied are you?"
 *   value={satisfaction}
 *   onValueChange={setSatisfaction}
 *   scale={10}
 *   labels={{ min: 'Not at all', max: 'Extremely' }}
 * />
 * ```
 */

import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, typography, spacing, fontWeights, borderRadius } from '../../theme';

export interface RatingScaleProps {
  /** Label displayed above the scale */
  label: string;

  /** Current selected value */
  value: number;

  /** Callback when value changes */
  onValueChange: (value: number) => void;

  /** Maximum scale value (default: 10, creates 0 to scale) */
  scale?: number;

  /** Min/max text labels */
  labels?: {
    min: string;
    max: string;
  };

  /** Disabled state */
  disabled?: boolean;

  /** Custom container style */
  containerStyle?: ViewStyle;

  /** Accessibility label (defaults to label) */
  accessibilityLabel?: string;

  /** Enable haptic feedback on press (default: true) */
  enableHaptic?: boolean;
}

export const RatingScale: React.FC<RatingScaleProps> = ({
  label,
  value,
  onValueChange,
  scale = 10,
  labels,
  disabled = false,
  containerStyle,
  accessibilityLabel,
  enableHaptic = true,
}) => {
  // Generate array of values from 0 to scale
  const values = Array.from({ length: scale + 1 }, (_, i) => i);

  const handlePress = (newValue: number) => {
    if (disabled) return;

    if (enableHaptic) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    onValueChange(newValue);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Label */}
      <Text style={styles.label}>{label}</Text>

      {/* Scale buttons */}
      <View
        style={styles.scaleContainer}
        accessible
        accessibilityLabel={accessibilityLabel || label}
        accessibilityRole="radiogroup"
      >
        {values.map((val) => {
          const isSelected = val === value;

          return (
            <Pressable
              key={val}
              onPress={() => handlePress(val)}
              disabled={disabled}
              style={({ pressed }) => [
                styles.scaleButton,
                isSelected && styles.scaleButtonSelected,
                pressed && !disabled && styles.scaleButtonPressed,
                disabled && styles.scaleButtonDisabled,
              ]}
              accessible
              accessibilityRole="radio"
              accessibilityState={{
                checked: isSelected,
                disabled,
              }}
              accessibilityLabel={`${val}`}
            >
              <Text
                style={[
                  styles.scaleButtonText,
                  isSelected && styles.scaleButtonTextSelected,
                  disabled && styles.scaleButtonTextDisabled,
                ]}
              >
                {val}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Min/Max text labels */}
      {labels && (
        <View style={styles.textLabels}>
          <Text style={styles.textLabel}>{labels.min}</Text>
          <Text style={styles.textLabel}>{labels.max}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },

  label: {
    ...typography.bodySmall,
    fontWeight: fontWeights.semibold as any,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },

  scaleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },

  scaleButton: {
    minWidth: 28,
    minHeight: 28,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border.default,
    backgroundColor: colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  scaleButtonSelected: {
    backgroundColor: colors.primary[600],
    borderColor: colors.primary[600],
  },

  scaleButtonPressed: {
    backgroundColor: colors.primary[900],
    borderColor: colors.primary[500],
  },

  scaleButtonDisabled: {
    opacity: 0.5,
    backgroundColor: colors.background.tertiary,
  },

  scaleButtonText: {
    ...typography.bodySmall,
    fontWeight: fontWeights.medium as any,
    color: colors.text.primary,
  },

  scaleButtonTextSelected: {
    color: colors.white,
    fontWeight: fontWeights.semibold as any,
  },

  scaleButtonTextDisabled: {
    color: colors.text.disabled,
  },

  textLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
    paddingHorizontal: spacing.xs,
  },

  textLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    maxWidth: '40%',
  },
});
