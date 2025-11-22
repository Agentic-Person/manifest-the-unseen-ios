/**
 * MultiSelect Component
 *
 * Multi-select chips/tags for selecting from predefined options
 * Used for workbook exercises like values selection, habit tracking
 *
 * @example
 * ```tsx
 * <MultiSelect
 *   label="Select your core values"
 *   options={['Honesty', 'Growth', 'Family', 'Health', 'Success']}
 *   selected={selectedValues}
 *   onSelectionChange={setSelectedValues}
 *   maxSelections={5}
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

export interface MultiSelectProps {
  /** Label displayed above the options */
  label: string;

  /** Available options to select from */
  options: string[];

  /** Currently selected options */
  selected: string[];

  /** Callback when selection changes */
  onSelectionChange: (selected: string[]) => void;

  /** Maximum number of selections allowed */
  maxSelections?: number;

  /** Disabled state */
  disabled?: boolean;

  /** Custom container style */
  containerStyle?: ViewStyle;

  /** Accessibility label (defaults to label) */
  accessibilityLabel?: string;

  /** Enable haptic feedback on press (default: true) */
  enableHaptic?: boolean;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  options,
  selected,
  onSelectionChange,
  maxSelections,
  disabled = false,
  containerStyle,
  accessibilityLabel,
  enableHaptic = true,
}) => {
  const handleToggle = (option: string) => {
    if (disabled) return;

    if (enableHaptic) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    const isSelected = selected.includes(option);

    if (isSelected) {
      // Remove from selection
      onSelectionChange(selected.filter((item) => item !== option));
    } else {
      // Add to selection (if under max)
      if (maxSelections && selected.length >= maxSelections) {
        // At max selections - could optionally show feedback here
        return;
      }
      onSelectionChange([...selected, option]);
    }
  };

  const atMaxSelections = maxSelections ? selected.length >= maxSelections : false;

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Label with selection count */}
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        {maxSelections && (
          <Text style={styles.selectionCount}>
            {selected.length}/{maxSelections}
          </Text>
        )}
      </View>

      {/* Options chips */}
      <View
        style={styles.chipsContainer}
        accessible
        accessibilityLabel={accessibilityLabel || label}
        accessibilityRole="none"
      >
        {options.map((option) => {
          const isSelected = selected.includes(option);
          const isDisabledByMax = atMaxSelections && !isSelected;

          return (
            <Pressable
              key={option}
              onPress={() => handleToggle(option)}
              disabled={disabled || isDisabledByMax}
              style={({ pressed }) => [
                styles.chip,
                isSelected && styles.chipSelected,
                pressed && !disabled && !isDisabledByMax && styles.chipPressed,
                (disabled || isDisabledByMax) && styles.chipDisabled,
              ]}
              accessible
              accessibilityRole="checkbox"
              accessibilityState={{
                checked: isSelected,
                disabled: disabled || isDisabledByMax,
              }}
              accessibilityLabel={option}
            >
              <Text
                style={[
                  styles.chipText,
                  isSelected && styles.chipTextSelected,
                  (disabled || isDisabledByMax) && styles.chipTextDisabled,
                ]}
              >
                {option}
              </Text>
            </Pressable>
          );
        })}
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
    marginBottom: spacing.sm,
  },

  label: {
    ...typography.bodySmall,
    fontWeight: fontWeights.semibold as any,
    color: colors.text.primary,
  },

  selectionCount: {
    ...typography.caption,
    color: colors.text.tertiary,
  },

  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },

  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border.default,
    backgroundColor: colors.background.primary,
  },

  chipSelected: {
    backgroundColor: colors.primary[600],
    borderColor: colors.primary[600],
  },

  chipPressed: {
    backgroundColor: colors.primary[50],
    borderColor: colors.primary[300],
  },

  chipDisabled: {
    opacity: 0.5,
    backgroundColor: colors.background.tertiary,
  },

  chipText: {
    ...typography.bodySmall,
    fontWeight: fontWeights.medium as any,
    color: colors.text.primary,
  },

  chipTextSelected: {
    color: colors.white,
    fontWeight: fontWeights.semibold as any,
  },

  chipTextDisabled: {
    color: colors.text.disabled,
  },
});
