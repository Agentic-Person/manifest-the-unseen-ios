/**
 * Help Center Screen
 *
 * Contact form that sends email to support.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as MailComposer from 'expo-mail-composer';
import type { ProfileStackScreenProps } from '../../types/navigation';
import { colors, spacing } from '../../theme';
import { useUser } from '../../stores/authStore';
import { SettingsSection } from '../../components/settings/SettingsSection';
import { getDiagnosticInfo } from '../../services/crashReportingService';
import { useSubscriptionStore } from '../../stores/subscriptionStore';

type Props = ProfileStackScreenProps<'HelpCenter'>;

type SubjectType = 'bug' | 'feature' | 'subscription' | 'other';

const subjectOptions: { label: string; value: SubjectType }[] = [
  { label: 'Bug Report', value: 'bug' },
  { label: 'Feature Request', value: 'feature' },
  { label: 'Subscription Issue', value: 'subscription' },
  { label: 'Other', value: 'other' },
];

const SUPPORT_EMAIL = 'jimmy@agenticpersonnel.com';

/**
 * Help Center Screen Component
 *
 * Features:
 * - Subject selector
 * - Message input
 * - Send button (opens mail composer)
 */
const HelpCenterScreen = (_props: Props) => {
  const user = useUser();
  const tier = useSubscriptionStore((state) => state.tier);
  const [selectedSubject, setSelectedSubject] = useState<SubjectType>('bug');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const getSubjectLine = (subject: SubjectType): string => {
    const subjectMap: Record<SubjectType, string> = {
      bug: 'Bug Report',
      feature: 'Feature Request',
      subscription: 'Subscription Issue',
      other: 'General Inquiry',
    };
    return `[Manifest the Unseen] ${subjectMap[subject]}`;
  };

  const handleSendEmail = async () => {
    if (!message.trim()) {
      Alert.alert('Missing Information', 'Please enter a message before sending.');
      return;
    }

    setIsSending(true);

    try {
      const isAvailable = await MailComposer.isAvailableAsync();

      if (!isAvailable) {
        Alert.alert('Email Not Available', `Please email us directly at ${SUPPORT_EMAIL}`, [
          { text: 'OK' },
        ]);
        setIsSending(false);
        return;
      }

      const diagnostics = getDiagnosticInfo();

      const body = `${message}

---
Diagnostic Information:
App Version: ${diagnostics.appVersion}
Platform: ${diagnostics.platform}
Device: ${diagnostics.deviceName}
User: ${user?.email || 'Not logged in'}
Subscription: ${tier || 'Free'}
Crash Reporting: ${diagnostics.crashReportingEnabled}`;

      await MailComposer.composeAsync({
        recipients: [SUPPORT_EMAIL],
        subject: getSubjectLine(selectedSubject),
        body,
      });

      // Clear form after opening mail composer
      setMessage('');
    } catch (error) {
      console.error('Error opening mail composer:', error);
      Alert.alert('Error', 'Could not open email. Please try again or email us directly.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>How can we help?</Text>
          <Text style={styles.headerSubtitle}>
            Send us a message and we'll get back to you as soon as possible.
          </Text>
        </View>

        {/* Subject Selection */}
        <SettingsSection title="Subject">
          {subjectOptions.map((option, index) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.subjectOption,
                index !== subjectOptions.length - 1 && styles.subjectOptionBorder,
              ]}
              onPress={() => setSelectedSubject(option.value)}
              activeOpacity={0.7}
            >
              <Text style={styles.subjectLabel}>{option.label}</Text>
              <View
                style={[
                  styles.radioOuter,
                  selectedSubject === option.value && styles.radioOuterSelected,
                ]}
              >
                {selectedSubject === option.value && <View style={styles.radioInner} />}
              </View>
            </TouchableOpacity>
          ))}
        </SettingsSection>

        {/* Message Input */}
        <SettingsSection title="Message">
          <View style={styles.messageContainer}>
            <TextInput
              style={styles.messageInput}
              value={message}
              onChangeText={setMessage}
              placeholder="Describe your issue or feedback..."
              placeholderTextColor={colors.text.tertiary}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>
        </SettingsSection>

        {/* Send Button */}
        <TouchableOpacity
          style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
          onPress={handleSendEmail}
          disabled={!message.trim() || isSending}
        >
          {isSending ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.sendButtonText}>Send Message</Text>
          )}
        </TouchableOpacity>

        {/* Direct Email */}
        <View style={styles.directEmail}>
          <Text style={styles.directEmailText}>Or email us directly at:</Text>
          <Text style={styles.directEmailAddress}>{SUPPORT_EMAIL}</Text>
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
  header: {
    marginBottom: spacing.lg,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: 15,
    color: colors.text.secondary,
    lineHeight: 21,
  },
  subjectOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  subjectOptionBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border.default,
  },
  subjectLabel: {
    fontSize: 16,
    color: colors.text.primary,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.text.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterSelected: {
    borderColor: colors.primary[500],
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary[500],
  },
  messageContainer: {
    padding: spacing.md,
  },
  messageInput: {
    fontSize: 16,
    color: colors.text.primary,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  sendButton: {
    backgroundColor: colors.primary[500],
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  sendButtonDisabled: {
    backgroundColor: colors.border.default,
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  directEmail: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  directEmailText: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  directEmailAddress: {
    fontSize: 15,
    color: colors.primary[500],
    fontWeight: '500',
  },
});

export default HelpCenterScreen;
