/**
 * Privacy Policy Screen
 *
 * Displays the app's privacy policy.
 */

import React from 'react';
import { Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { ProfileStackScreenProps } from '../../types/navigation';
import { colors, spacing } from '../../theme';

type Props = ProfileStackScreenProps<'PrivacyPolicy'>;

/**
 * Privacy Policy Screen Component
 */
const PrivacyPolicyScreen = (_props: Props) => {
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.lastUpdated}>Last Updated: December 2024</Text>

        <Text style={styles.sectionTitle}>1. Introduction</Text>
        <Text style={styles.paragraph}>
          Welcome to Manifest the Unseen ("we," "our," or "us"). We are committed
          to protecting your privacy and ensuring the security of your personal
          information. This Privacy Policy explains how we collect, use, disclose,
          and safeguard your information when you use our mobile application.
        </Text>

        <Text style={styles.sectionTitle}>2. Information We Collect</Text>
        <Text style={styles.paragraph}>
          We collect information you provide directly to us, including:
        </Text>
        <Text style={styles.bulletPoint}>
          {'\u2022'} Account information (email address, name)
        </Text>
        <Text style={styles.bulletPoint}>
          {'\u2022'} Profile information you choose to provide
        </Text>
        <Text style={styles.bulletPoint}>
          {'\u2022'} Content you create (journal entries, workbook responses, vision boards)
        </Text>
        <Text style={styles.bulletPoint}>
          {'\u2022'} Usage data and app interactions
        </Text>
        <Text style={styles.bulletPoint}>
          {'\u2022'} Device information (device type, operating system)
        </Text>

        <Text style={styles.sectionTitle}>3. Voice Recording & Transcription</Text>
        <Text style={styles.paragraph}>
          When you use voice journaling features, audio is processed entirely
          on your device using on-device transcription technology. Audio recordings
          are never uploaded to our servers. Only the transcribed text is stored
          in your account, ensuring maximum privacy for your voice content.
        </Text>

        <Text style={styles.sectionTitle}>4. How We Use Your Information</Text>
        <Text style={styles.paragraph}>
          We use the information we collect to:
        </Text>
        <Text style={styles.bulletPoint}>
          {'\u2022'} Provide, maintain, and improve our services
        </Text>
        <Text style={styles.bulletPoint}>
          {'\u2022'} Process transactions and manage subscriptions
        </Text>
        <Text style={styles.bulletPoint}>
          {'\u2022'} Send notifications and reminders you've requested
        </Text>
        <Text style={styles.bulletPoint}>
          {'\u2022'} Provide AI-powered guidance and recommendations
        </Text>
        <Text style={styles.bulletPoint}>
          {'\u2022'} Analyze usage patterns to improve the app
        </Text>

        <Text style={styles.sectionTitle}>5. Data Security</Text>
        <Text style={styles.paragraph}>
          We implement appropriate technical and organizational measures to protect
          your personal information. Your journal entries and personal data are
          encrypted both in transit and at rest. We use industry-standard security
          protocols and regularly review our security practices.
        </Text>

        <Text style={styles.sectionTitle}>6. Data Retention</Text>
        <Text style={styles.paragraph}>
          We retain your personal information for as long as your account is active
          or as needed to provide you services. You can request deletion of your
          account and associated data at any time through the app settings.
        </Text>

        <Text style={styles.sectionTitle}>7. Third-Party Services</Text>
        <Text style={styles.paragraph}>
          We use select third-party services to provide our app functionality:
        </Text>
        <Text style={styles.bulletPoint}>
          {'\u2022'} Supabase for secure data storage and authentication
        </Text>
        <Text style={styles.bulletPoint}>
          {'\u2022'} RevenueCat for subscription management
        </Text>
        <Text style={styles.bulletPoint}>
          {'\u2022'} AI services for providing wisdom guidance (anonymized queries)
        </Text>

        <Text style={styles.sectionTitle}>8. Your Rights</Text>
        <Text style={styles.paragraph}>
          You have the right to:
        </Text>
        <Text style={styles.bulletPoint}>
          {'\u2022'} Access your personal data
        </Text>
        <Text style={styles.bulletPoint}>
          {'\u2022'} Correct inaccurate data
        </Text>
        <Text style={styles.bulletPoint}>
          {'\u2022'} Request deletion of your data
        </Text>
        <Text style={styles.bulletPoint}>
          {'\u2022'} Export your data
        </Text>
        <Text style={styles.bulletPoint}>
          {'\u2022'} Opt out of analytics collection
        </Text>

        <Text style={styles.sectionTitle}>9. Children's Privacy</Text>
        <Text style={styles.paragraph}>
          Our app is not intended for children under 13 years of age. We do not
          knowingly collect personal information from children under 13.
        </Text>

        <Text style={styles.sectionTitle}>10. Changes to This Policy</Text>
        <Text style={styles.paragraph}>
          We may update this Privacy Policy from time to time. We will notify you
          of any changes by posting the new Privacy Policy on this page and
          updating the "Last Updated" date.
        </Text>

        <Text style={styles.sectionTitle}>11. Contact Us</Text>
        <Text style={styles.paragraph}>
          If you have any questions about this Privacy Policy, please contact us
          at: jimmy@agenticpersonnel.com
        </Text>
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
  lastUpdated: {
    fontSize: 13,
    color: colors.text.tertiary,
    marginBottom: spacing.lg,
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text.primary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  paragraph: {
    fontSize: 15,
    color: colors.text.secondary,
    lineHeight: 22,
    marginBottom: spacing.sm,
  },
  bulletPoint: {
    fontSize: 15,
    color: colors.text.secondary,
    lineHeight: 22,
    paddingLeft: spacing.md,
    marginBottom: spacing.xs,
  },
});

export default PrivacyPolicyScreen;
