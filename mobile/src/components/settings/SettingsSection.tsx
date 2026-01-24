/**
 * Settings Section Component
 *
 * A container for grouping related settings with a title header.
 */

import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TextStyle } from 'react-native';
import { colors, spacing } from '../../theme';
import { useFontSizeContext } from '../../contexts/FontSizeContext';

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
export const SettingsSection: React.FC<SettingsSectionProps> = ({ title, children }) => {
  const { scaleFont } = useFontSizeContext();

  const scaledTitleStyle = useMemo(
    (): TextStyle => ({
      ...styles.title,
      fontSize: scaleFont(13),
    }),
    [scaleFont]
  );

  return (
    <View style={styles.container}>
      <Text style={scaledTitleStyle}>{title}</Text>
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
