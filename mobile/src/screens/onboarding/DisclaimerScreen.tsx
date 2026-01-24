/**
 * Health Disclaimer Screen
 *
 * Shown once on first app launch to comply with App Store Guidelines 5.1.1(ix)
 * for health and wellness apps.
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing } from '../../theme';

const DISCLAIMER_KEY = '@disclaimer_accepted';

interface DisclaimerScreenProps {
  onAccept: () => void;
}

export const DisclaimerScreen: React.FC<DisclaimerScreenProps> = ({ onAccept }) => {
  const handleAccept = async () => {
    try {
      await AsyncStorage.setItem(DISCLAIMER_KEY, 'true');
      onAccept();
    } catch (error) {
      console.error('Failed to save disclaimer acceptance:', error);
      onAccept(); // Proceed anyway
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.icon}>⚕️</Text>
          <Text style={styles.title}>Important Disclaimer</Text>
        </View>

        {/* Content */}
        <View style={styles.section}>
          <Text style={styles.paragraph}>
            Manifest the Unseen provides general wellness and personal development content for
            educational and inspirational purposes only.
          </Text>

          <Text style={styles.paragraph}>
            This app is{' '}
            <Text style={styles.bold}>
              not intended to diagnose, treat, cure, or prevent any disease
            </Text>
            , medical condition, or mental health disorder.
          </Text>

          <Text style={styles.paragraph}>
            The information provided, including AI-generated guidance, meditation practices, and
            workbook exercises, should not be considered professional medical, psychological,
            therapeutic, or financial advice.
          </Text>

          <Text style={styles.paragraph}>
            Results may vary, and we make no guarantees about specific outcomes.
          </Text>
        </View>

        {/* Crisis Info */}
        <View style={[styles.section, styles.crisisSection]}>
          <Text style={styles.crisisTitle}>Mental Health Crisis?</Text>
          <Text style={styles.crisisParagraph}>
            If you are experiencing severe emotional distress or thoughts of self-harm, please
            contact emergency services (911) or a mental health crisis hotline immediately.
          </Text>
          <Text style={styles.crisisParagraph}>National Suicide Prevention Lifeline: 988</Text>
        </View>

        {/* Professional Advice */}
        <View style={styles.section}>
          <Text style={styles.paragraph}>
            Always consult with qualified healthcare professionals before making significant changes
            to your health, wellness, or lifestyle practices.
          </Text>
        </View>
      </ScrollView>

      {/* Accept Button */}
      <View style={styles.footer}>
        <Pressable style={styles.button} onPress={handleAccept}>
          <Text style={styles.buttonText}>I Understand</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

/**
 * Check if disclaimer has been accepted
 * Use this in App.tsx or root navigation to conditionally show DisclaimerScreen
 */
export const hasAcceptedDisclaimer = async (): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(DISCLAIMER_KEY);
    return value === 'true';
  } catch (error) {
    console.error('Failed to check disclaimer status:', error);
    return false;
  }
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
    padding: spacing.xl,
    paddingBottom: spacing['2xl'],
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  icon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    textAlign: 'center',
  },
  section: {
    marginBottom: spacing.lg,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  bold: {
    fontWeight: '600',
    color: colors.text.primary,
  },
  crisisSection: {
    backgroundColor: colors.error[900],
    borderRadius: 12,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.error[600],
  },
  crisisTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.error[200],
    marginBottom: spacing.sm,
  },
  crisisParagraph: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.error[100],
    marginBottom: spacing.sm,
  },
  footer: {
    padding: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.border.default,
  },
  button: {
    backgroundColor: colors.primary[600],
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text.inverse,
  },
});
