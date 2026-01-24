/**
 * Privacy & Security Screen
 *
 * Allows users to manage biometric lock, analytics, crash reporting,
 * and export their personal data (GDPR/Privacy compliance).
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as LocalAuthentication from 'expo-local-authentication';
import type { ProfileStackScreenProps } from '../../types/navigation';
import { colors, spacing } from '../../theme';
import { useSettingsStore } from '../../stores/settingsStore';
import { SettingsSection } from '../../components/settings/SettingsSection';
import { SettingsToggle } from '../../components/settings/SettingsToggle';
import { exportUserData } from '../../services/dataExportService';

type Props = ProfileStackScreenProps<'PrivacySecurity'>;

/**
 * Privacy & Security Screen Component
 *
 * Settings for:
 * - Biometric lock (Face ID/Touch ID)
 * - Analytics opt-in/out
 * - Crash reporting opt-in/out
 */
const PrivacySecurityScreen = (_props: Props) => {
  const { analyticsEnabled, crashReportingEnabled, setAnalytics, setCrashReporting } =
    useSettingsStore();

  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricType, setBiometricType] = useState<string>('Biometrics');
  const [isExporting, setIsExporting] = useState(false);

  // Check biometric availability on mount
  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      setBiometricAvailable(hasHardware && isEnrolled);

      if (hasHardware) {
        const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();

        if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
          setBiometricType('Face ID');
        } else if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
          setBiometricType('Touch ID');
        }
      }
    } catch (error) {
      console.error('Error checking biometric availability:', error);
      setBiometricAvailable(false);
    }
  };

  const handleBiometricToggle = useCallback(
    async (value: boolean) => {
      if (value) {
        // Verify biometrics work before enabling
        try {
          const result = await LocalAuthentication.authenticateAsync({
            promptMessage: `Enable ${biometricType} for Manifest the Unseen`,
            fallbackLabel: 'Use Passcode',
            cancelLabel: 'Cancel',
          });

          if (result.success) {
            setBiometricEnabled(true);
            // TODO: Store this preference in secure storage
          } else {
            Alert.alert(
              'Authentication Failed',
              `Could not verify ${biometricType}. Please try again.`
            );
          }
        } catch (error) {
          console.error('Biometric authentication error:', error);
          Alert.alert('Error', 'An error occurred during authentication.');
        }
      } else {
        setBiometricEnabled(false);
        // TODO: Remove preference from secure storage
      }
    },
    [biometricType]
  );

  const handleAnalyticsToggle = (value: boolean) => {
    if (!value) {
      Alert.alert(
        'Disable Analytics',
        'Analytics helps us improve the app. Are you sure you want to disable it?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Disable',
            style: 'destructive',
            onPress: () => setAnalytics(false),
          },
        ]
      );
    } else {
      setAnalytics(true);
    }
  };

  const handleCrashReportingToggle = (value: boolean) => {
    if (!value) {
      Alert.alert(
        'Disable Crash Reporting',
        'Crash reporting helps us fix bugs faster. Are you sure you want to disable it?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Disable',
            style: 'destructive',
            onPress: () => setCrashReporting(false),
          },
        ]
      );
    } else {
      setCrashReporting(true);
    }
  };

  /**
   * Handle data export
   */
  const handleExportData = async () => {
    setIsExporting(true);

    try {
      const result = await exportUserData();

      if (result.success) {
        // The share dialog was shown - no need for additional alert
        console.log('[PrivacySecurity] Data exported successfully');
      } else {
        Alert.alert(
          'Export Failed',
          result.error || 'Unable to export your data. Please try again.'
        );
      }
    } catch (error) {
      console.error('[PrivacySecurity] Export error:', error);
      Alert.alert('Export Failed', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <SettingsSection title="Security">
          <SettingsToggle
            label={`${biometricType} Lock`}
            description={
              biometricAvailable
                ? `Require ${biometricType} to open the app`
                : `${biometricType} is not available on this device`
            }
            value={biometricEnabled}
            onValueChange={handleBiometricToggle}
            disabled={!biometricAvailable}
            isLast
          />
        </SettingsSection>

        {!biometricAvailable && (
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              To enable biometric security, make sure {biometricType} is set up in your device
              settings.
            </Text>
          </View>
        )}

        <SettingsSection title="Privacy">
          <SettingsToggle
            label="Analytics"
            description="Help us improve the app with anonymous usage data"
            value={analyticsEnabled}
            onValueChange={handleAnalyticsToggle}
          />
          <SettingsToggle
            label="Crash Reporting"
            description="Automatically send crash reports to help fix bugs"
            value={crashReportingEnabled}
            onValueChange={handleCrashReportingToggle}
            isLast
          />
        </SettingsSection>

        <SettingsSection title="Your Data">
          <TouchableOpacity
            style={styles.exportButton}
            onPress={handleExportData}
            disabled={isExporting}
            accessibilityRole="button"
            accessibilityLabel="Export your data"
          >
            <View style={styles.exportButtonContent}>
              <View>
                <Text style={styles.exportButtonText}>Export My Data</Text>
                <Text style={styles.exportButtonDescription}>
                  Download all your data as a JSON file
                </Text>
              </View>
              {isExporting ? (
                <ActivityIndicator size="small" color={colors.primary[500]} />
              ) : (
                <Text style={styles.exportButtonIcon}>↓</Text>
              )}
            </View>
          </TouchableOpacity>
        </SettingsSection>

        <View style={styles.privacyNote}>
          <Text style={styles.privacyNoteTitle}>Your Privacy Matters</Text>
          <Text style={styles.privacyNoteText}>
            We never sell your personal data. Journal entries and workbook responses are encrypted
            and only accessible to you. Analytics data is anonymous and cannot be traced back to
            you.
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
    paddingBottom: spacing['2xl'],
  },
  infoBox: {
    backgroundColor: colors.background.elevated,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  infoText: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  privacyNote: {
    backgroundColor: colors.background.elevated,
    borderRadius: 12,
    padding: spacing.md,
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: `${colors.primary[500]}40`,
  },
  privacyNoteTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary[500],
    marginBottom: spacing.xs,
  },
  privacyNoteText: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  // Export button styles
  exportButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  exportButtonContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  exportButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
  },
  exportButtonDescription: {
    fontSize: 13,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  exportButtonIcon: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.primary[500],
  },
});

export default PrivacySecurityScreen;
