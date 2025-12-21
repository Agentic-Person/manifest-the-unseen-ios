/**
 * Settings Picker Component
 *
 * A segmented control picker for selecting between options.
 */

import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextStyle } from 'react-native';
import { colors, spacing } from '../../theme';
import { useFontSizeContext } from '../../contexts/FontSizeContext';

interface Option<T extends string> {
  label: string;
  value: T;
}

interface SettingsPickerProps<T extends string> {
  label: string;
  description?: string;
  options: Option<T>[];
  selectedValue: T;
  onValueChange: (value: T) => void;
  disabled?: boolean;
  isLast?: boolean;
}

/**
 * SettingsPicker
 *
 * A row with a segmented control for selecting options.
 *
 * @example
 * ```tsx
 * <SettingsPicker
 *   label="Theme"
 *   options={[
 *     { label: 'Light', value: 'light' },
 *     { label: 'Dark', value: 'dark' },
 *     { label: 'System', value: 'system' },
 *   ]}
 *   selectedValue={theme}
 *   onValueChange={setTheme}
 * />
 * ```
 */
export function SettingsPicker<T extends string>({
  label,
  description,
  options,
  selectedValue,
  onValueChange,
  disabled = false,
  isLast = false,
}: SettingsPickerProps<T>) {
  const { scaleFont } = useFontSizeContext();

  const scaledStyles = useMemo(() => ({
    label: {
      ...styles.label,
      fontSize: scaleFont(16),
    } as TextStyle,
    description: {
      ...styles.description,
      fontSize: scaleFont(13),
    } as TextStyle,
    segmentText: {
      ...styles.segmentText,
      fontSize: scaleFont(14),
    } as TextStyle,
  }), [scaleFont]);

  return (
    <View
      style={[
        styles.container,
        !isLast && styles.borderBottom,
        disabled && styles.disabled,
      ]}
    >
      <View style={styles.labelContainer}>
        <Text style={[scaledStyles.label, disabled && styles.labelDisabled]}>
          {label}
        </Text>
        {description && (
          <Text style={scaledStyles.description}>{description}</Text>
        )}
      </View>

      <View style={styles.segmentedControl}>
        {options.map((option, index) => {
          const isSelected = option.value === selectedValue;
          const isFirst = index === 0;
          const isLastOption = index === options.length - 1;

          return (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.segment,
                isFirst && styles.segmentFirst,
                isLastOption && styles.segmentLast,
                isSelected && styles.segmentSelected,
              ]}
              onPress={() => !disabled && onValueChange(option.value)}
              activeOpacity={0.7}
              disabled={disabled}
            >
              <Text
                style={[
                  scaledStyles.segmentText,
                  isSelected && styles.segmentTextSelected,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border.default,
  },
  disabled: {
    opacity: 0.5,
  },
  labelContainer: {
    marginBottom: spacing.sm,
  },
  label: {
    fontSize: 16,
    color: colors.text.primary,
  },
  labelDisabled: {
    color: colors.text.tertiary,
  },
  description: {
    fontSize: 13,
    color: colors.text.secondary,
    marginTop: 2,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: colors.background.primary,
    borderRadius: 8,
    padding: 2,
  },
  segment: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
  },
  segmentFirst: {
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
  },
  segmentLast: {
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
  },
  segmentSelected: {
    backgroundColor: colors.primary[500],
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.secondary,
  },
  segmentTextSelected: {
    color: colors.white,
    fontWeight: '600',
  },
});

export default SettingsPicker;
