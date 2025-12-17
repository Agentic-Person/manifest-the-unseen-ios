/**
 * Settings Row Component
 *
 * Base component for individual setting rows.
 * Supports labels, descriptions, icons, and navigation chevrons.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing } from '../../theme';

interface SettingsRowProps {
  label: string;
  description?: string;
  value?: string;
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
  onPress?: () => void;
  showChevron?: boolean;
  disabled?: boolean;
  isLast?: boolean;
}

/**
 * SettingsRow
 *
 * A single row in a settings section.
 *
 * @example
 * ```tsx
 * <SettingsRow
 *   label="Account Settings"
 *   description="Manage your profile"
 *   onPress={() => navigate('AccountSettings')}
 *   showChevron
 * />
 * ```
 */
export const SettingsRow: React.FC<SettingsRowProps> = ({
  label,
  description,
  value,
  leftIcon,
  rightElement,
  onPress,
  showChevron = false,
  disabled = false,
  isLast = false,
}) => {
  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      style={[
        styles.container,
        !isLast && styles.borderBottom,
        disabled && styles.disabled,
      ]}
      onPress={disabled ? undefined : onPress}
      activeOpacity={0.7}
    >
      {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

      <View style={styles.content}>
        <Text style={[styles.label, disabled && styles.labelDisabled]}>
          {label}
        </Text>
        {description && (
          <Text style={styles.description}>{description}</Text>
        )}
      </View>

      <View style={styles.rightContainer}>
        {value && <Text style={styles.value}>{value}</Text>}
        {rightElement}
        {showChevron && <Text style={styles.chevron}>›</Text>}
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
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
  leftIcon: {
    marginRight: spacing.md,
  },
  content: {
    flex: 1,
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
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  value: {
    fontSize: 15,
    color: colors.text.secondary,
    marginRight: spacing.xs,
  },
  chevron: {
    fontSize: 22,
    color: colors.text.tertiary,
    fontWeight: '300',
  },
});

export default SettingsRow;
