/**
 * Settings Section Component
 *
 * A container for grouping related settings with a title header.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '../../theme';

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

/**
 * SettingsSection
 *
 * Groups related settings under a section title.
 *
 * @example
 * ```tsx
 * <SettingsSection title="Notifications">
 *   <SettingsToggle label="Push Notifications" ... />
 *   <SettingsToggle label="Daily Reminders" ... />
 * </SettingsSection>
 * ```
 */
export const SettingsSection: React.FC<SettingsSectionProps> = ({
  title,
  children,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  content: {
    backgroundColor: colors.background.elevated,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border.default,
    overflow: 'hidden',
  },
});

export default SettingsSection;
