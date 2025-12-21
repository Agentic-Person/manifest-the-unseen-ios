/**
 * About Screen
 *
 * Displays app information, version, and links to legal documents.
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Constants from 'expo-constants';
import type { ProfileStackScreenProps } from '../../types/navigation';
import { colors, spacing } from '../../theme';
import { SettingsSection } from '../../components/settings/SettingsSection';
import { SettingsRow } from '../../components/settings/SettingsRow';

type Props = ProfileStackScreenProps<'About'>;

/**
 * About Screen Component
 *
 * Displays:
 * - App icon and name
 * - Version information
 * - Brief description
 * - Links to Privacy Policy and Terms of Service
 */
const AboutScreen = ({ navigation }: Props) => {
  const appVersion = Constants.expoConfig?.version || '1.0.0';
  const buildNumber = Constants.expoConfig?.ios?.buildNumber || '1';

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        {/* App Info Header */}
        <View style={styles.header}>
          <View style={styles.appIconContainer}>
            <Text style={styles.appIconText}>MTU</Text>
          </View>
          <Text style={styles.appName}>Manifest the Unseen</Text>
          <Text style={styles.version}>
            Version {appVersion} ({buildNumber})
          </Text>
        </View>

        {/* Description */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>
            Transform your life through the ancient art of manifestation.
            Manifest the Unseen combines structured workbook exercises,
            AI-guided wisdom, and meditation practices to help you achieve
            your deepest desires.
          </Text>
        </View>

        {/* Legal Links */}
        <SettingsSection title="Legal">
          <SettingsRow
            label="Privacy Policy"
            onPress={() => navigation.navigate('PrivacyPolicy')}
            showChevron
          />
          <SettingsRow
            label="Terms of Service"
            onPress={() => navigation.navigate('TermsOfService')}
            showChevron
            isLast
          />
        </SettingsSection>

        {/* Credits */}
        <View style={styles.credits}>
          <Text style={styles.creditsText}>
            Created by Agentic Personnel LLC
          </Text>
          <Text style={styles.copyrightText}>
            {'\u00A9'} {new Date().getFullYear()} Agentic Personnel LLC. All rights reserved.
          </Text>
        </View>
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
  },
  header: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  appIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  appIconText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.white,
  },
  appName: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  version: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  descriptionContainer: {
    backgroundColor: colors.background.elevated,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  description: {
    fontSize: 15,
    color: colors.text.secondary,
    lineHeight: 22,
    textAlign: 'center',
  },
  credits: {
    alignItems: 'center',
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  creditsText: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  copyrightText: {
    fontSize: 12,
    color: colors.text.tertiary,
  },
});

export default AboutScreen;
