/**
 * Error Fallback Component
 *
 * User-friendly error screen shown when ErrorBoundary catches an error.
 * Provides options to retry or report the issue.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as MailComposer from 'expo-mail-composer';
import { colors, spacing, typography } from '../theme';
import { getDiagnosticInfo } from '../services/crashReportingService';

interface Props {
  error: Error | null;
  onReset?: () => void;
}

const SUPPORT_EMAIL = 'jimmy@agenticpersonnel.com';

/**
 * Error Fallback
 *
 * Displays a friendly error message with:
 * - Error description (in dev mode)
 * - Retry button
 * - Report issue button
 */
const ErrorFallback: React.FC<Props> = ({ error, onReset }) => {
  const handleReportIssue = async () => {
    try {
      const isAvailable = await MailComposer.isAvailableAsync();

      if (!isAvailable) {
        Alert.alert('Email Not Available', `Please email us directly at ${SUPPORT_EMAIL}`, [
          { text: 'OK' },
        ]);
        return;
      }

      const diagnosticInfo = getDiagnosticInfo();

      const body = `Hi,

I encountered an error while using the app.

Error Details:
${error?.message || 'Unknown error'}

---
Diagnostic Information:
App Version: ${diagnosticInfo.appVersion}
Platform: ${diagnosticInfo.platform}
Device: ${diagnosticInfo.deviceName}

${__DEV__ && error?.stack ? `\nStack Trace:\n${error.stack}` : ''}`;

      await MailComposer.composeAsync({
        recipients: [SUPPORT_EMAIL],
        subject: '[Manifest the Unseen] App Error Report',
        body,
      });
    } catch (emailError) {
      Alert.alert('Error', 'Could not open email. Please try again or email us directly.');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Icon */}
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>!</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>Something Went Wrong</Text>

        {/* Description */}
        <Text style={styles.description}>
          We're sorry, but something unexpected happened. Don't worry - your data is safe.
        </Text>

        {/* Error details (development only) */}
        {__DEV__ && error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorLabel}>Error (Dev Only):</Text>
            <Text style={styles.errorMessage}>{error.message}</Text>
          </View>
        )}

        {/* Actions */}
        <View style={styles.actions}>
          {onReset && (
            <TouchableOpacity style={styles.primaryButton} onPress={onReset} activeOpacity={0.8}>
              <Text style={styles.primaryButtonText}>Try Again</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleReportIssue}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryButtonText}>Report Issue</Text>
          </TouchableOpacity>
        </View>

        {/* Help text */}
        <Text style={styles.helpText}>
          If this problem persists, try closing and reopening the app.
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
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${colors.error[500]}20`, // 20% opacity
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  icon: {
    fontSize: 40,
    fontWeight: '700',
    color: colors.error[500],
  },
  title: {
    ...typography.h2,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  description: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  errorBox: {
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.xl,
    width: '100%',
  },
  errorLabel: {
    ...typography.caption,
    color: colors.error[500],
    marginBottom: spacing.xs,
    fontWeight: '600',
  },
  errorMessage: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.text.tertiary,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  actions: {
    width: '100%',
    gap: spacing.md,
  },
  primaryButton: {
    backgroundColor: colors.primary[500],
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
  },
  primaryButtonText: {
    ...typography.button,
    color: colors.white,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border.default,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
  },
  secondaryButtonText: {
    ...typography.button,
    color: colors.text.secondary,
  },
  helpText: {
    ...typography.caption,
    color: colors.text.tertiary,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});

export default ErrorFallback;
