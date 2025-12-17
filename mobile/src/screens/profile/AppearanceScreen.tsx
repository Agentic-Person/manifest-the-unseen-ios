/**
 * Appearance Screen
 *
 * Allows users to customize theme, font size, and motion settings.
 */

import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { ProfileStackScreenProps } from '../../types/navigation';
import { colors, spacing } from '../../theme';
import { useSettingsStore } from '../../stores/settingsStore';
import { SettingsSection } from '../../components/settings/SettingsSection';
import { SettingsPicker } from '../../components/settings/SettingsPicker';
import { SettingsToggle } from '../../components/settings/SettingsToggle';

type Props = ProfileStackScreenProps<'Appearance'>;

type Theme = 'light' | 'dark' | 'system';
type FontSize = 'small' | 'medium' | 'large';

const themeOptions: { label: string; value: Theme }[] = [
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
  { label: 'System', value: 'system' },
];

const fontSizeOptions: { label: string; value: FontSize }[] = [
  { label: 'Small', value: 'small' },
  { label: 'Medium', value: 'medium' },
  { label: 'Large', value: 'large' },
];

/**
 * Appearance Screen Component
 *
 * Settings for:
 * - Theme (Light/Dark/System)
 * - Font Size (Small/Medium/Large)
 * - Reduced Motion toggle
 */
const AppearanceScreen = (_props: Props) => {
  const {
    theme,
    fontSize,
    reducedMotion,
    setTheme,
    setFontSize,
    setReducedMotion,
  } = useSettingsStore();

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        <SettingsSection title="Theme">
          <SettingsPicker<Theme>
            label="App Theme"
            description="Choose how the app looks"
            options={themeOptions}
            selectedValue={theme}
            onValueChange={setTheme}
            isLast
          />
        </SettingsSection>

        <SettingsSection title="Text">
          <SettingsPicker<FontSize>
            label="Font Size"
            description="Adjust text size throughout the app"
            options={fontSizeOptions}
            selectedValue={fontSize}
            onValueChange={setFontSize}
            isLast
          />
        </SettingsSection>

        <SettingsSection title="Accessibility">
          <SettingsToggle
            label="Reduce Motion"
            description="Minimize animations and motion effects"
            value={reducedMotion}
            onValueChange={setReducedMotion}
            isLast
          />
        </SettingsSection>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing['2xl'],
  },
});

export default AppearanceScreen;
