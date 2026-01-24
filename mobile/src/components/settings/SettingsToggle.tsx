/**
 * Settings Toggle Component
 *
 * A toggle switch row for boolean settings.
 */

import React, { useMemo } from 'react';
import { View, Text, Switch, StyleSheet, TextStyle } from 'react-native';
import { colors, spacing } from '../../theme';
import { useFontSizeContext } from '../../contexts/FontSizeContext';

interface SettingsToggleProps {
  label: string;
  description?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  isLast?: boolean;
}

/**
 * SettingsToggle
 *
 * A row with a toggle switch for boolean settings.
 *
 * @example
 * ```tsx
 * <SettingsToggle
 *   label="Push Notifications"
 *   description="Receive push notifications"
 *   value={pushEnabled}
 *   onValueChange={setPushEnabled}
 * />
 * ```
 */
export const SettingsToggle: React.FC<SettingsToggleProps> = ({
  label,
  description,
  value,
  onValueChange,
  disabled = false,
  isLast = false,
}) => {
  const { scaleFont } = useFontSizeContext();

  const scaledStyles = useMemo(
    () => ({
      label: {
        ...styles.label,
        fontSize: scaleFont(16),
      } as TextStyle,
      description: {
        ...styles.description,
        fontSize: scaleFont(13),
      } as TextStyle,
    }),
    [scaleFont]
  );

  return (
    <View style={[styles.container, !isLast && styles.borderBottom, disabled && styles.disabled]}>
      <View style={styles.content}>
        <Text style={[scaledStyles.label, disabled && styles.labelDisabled]}>{label}</Text>
        {description && <Text style={scaledStyles.description}>{description}</Text>}
      </View>

      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{
          false: colors.border.default,
          true: colors.primary[500],
        }}
        thumbColor={colors.white}
        ios_backgroundColor={colors.border.default}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    minHeight: 52,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border.default,
  },
  disabled: {
    opacity: 0.5,
  },
  content: {
    flex: 1,
    marginRight: spacing.md,
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
});

export default SettingsToggle;
