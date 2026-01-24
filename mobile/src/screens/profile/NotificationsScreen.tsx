/**
 * Notifications Screen
 *
 * Allows users to manage push notification preferences and reminders.
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import type { ProfileStackScreenProps } from '../../types/navigation';
import { colors, spacing } from '../../theme';
import { useSettingsStore } from '../../stores/settingsStore';
import { useNotifications } from '../../hooks/useNotifications';
import { SettingsSection } from '../../components/settings/SettingsSection';
import { SettingsToggle } from '../../components/settings/SettingsToggle';
import { SettingsRow } from '../../components/settings/SettingsRow';
import { PrayerTimePicker } from '../../components/settings/PrayerTimePicker';

type Props = ProfileStackScreenProps<'Notifications'>;

/**
 * Notifications Screen Component
 *
 * Settings for:
 * - Push notifications (master toggle)
 * - Daily inspirations
 * - Progress milestones
 * - Meditation reminder (with time picker)
 * - Journal reminder (with time picker)
 */
const NotificationsScreen = (_props: Props) => {
  const {
    pushNotificationsEnabled,
    dailyInspirationsEnabled,
    progressMilestonesEnabled,
    meditationReminderEnabled,
    meditationReminderTime,
    journalReminderEnabled,
    journalReminderTime,
    spokenPrayerEnabled,
    spokenPrayerTimes,
    setPushNotifications,
    setDailyInspirations,
    setProgressMilestones,
    setMeditationReminder,
    setJournalReminder,
    setSpokenPrayer,
  } = useSettingsStore();

  const {
    hasPermission,
    requestPermission,
    scheduleReminder,
    cancelAllReminders,
    scheduleDailyInspiration,
  } = useNotifications();

  const [showMeditationPicker, setShowMeditationPicker] = useState(false);
  const [showJournalPicker, setShowJournalPicker] = useState(false);

  // Parse time string to Date
  const parseTimeToDate = (timeString?: string): Date => {
    const now = new Date();
    if (!timeString) {
      now.setHours(9, 0, 0, 0); // Default to 9:00 AM
      return now;
    }
    const [hours, minutes] = timeString.split(':').map(Number);
    now.setHours(hours, minutes, 0, 0);
    return now;
  };

  // Format Date to time string
  const formatTimeString = (date: Date): string => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // Format time for display
  const formatTimeDisplay = (timeString?: string): string => {
    if (!timeString) {
      return 'Not set';
    }
    const [hours, minutes] = timeString.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const handlePushToggle = async (value: boolean) => {
    if (value && !hasPermission) {
      const granted = await requestPermission();
      if (!granted) {
        Alert.alert(
          'Permission Required',
          'Please enable notifications in your device settings to receive reminders.',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Open Settings',
              onPress: () => Linking.openSettings(),
            },
          ]
        );
        return;
      }
    }
    setPushNotifications(value);

    // If disabling, cancel all scheduled notifications
    if (!value) {
      await cancelAllReminders('meditation');
      await cancelAllReminders('journal');
    }
  };

  const handleDailyInspirationsToggle = async (value: boolean) => {
    setDailyInspirations(value);
    if (value && pushNotificationsEnabled) {
      // Schedule for 8:00 AM by default
      await scheduleDailyInspiration(8, 0);
    }
  };

  const handleMeditationReminderToggle = async (value: boolean) => {
    if (value) {
      // Set default time if not set
      const defaultTime = meditationReminderTime || '09:00';
      setMeditationReminder(true, defaultTime);

      if (pushNotificationsEnabled) {
        const [hours, minutes] = defaultTime.split(':').map(Number);
        await scheduleReminder('meditation', hours, minutes);
      }
    } else {
      setMeditationReminder(false, meditationReminderTime);
      await cancelAllReminders('meditation');
    }
  };

  const handleJournalReminderToggle = async (value: boolean) => {
    if (value) {
      // Set default time if not set
      const defaultTime = journalReminderTime || '20:00';
      setJournalReminder(true, defaultTime);

      if (pushNotificationsEnabled) {
        const [hours, minutes] = defaultTime.split(':').map(Number);
        await scheduleReminder('journal', hours, minutes);
      }
    } else {
      setJournalReminder(false, journalReminderTime);
      await cancelAllReminders('journal');
    }
  };

  const handleMeditationTimeChange = async (event: any, date?: Date) => {
    setShowMeditationPicker(false);
    if (date && event.type !== 'dismissed') {
      const timeString = formatTimeString(date);
      setMeditationReminder(true, timeString);

      if (pushNotificationsEnabled && meditationReminderEnabled) {
        await scheduleReminder('meditation', date.getHours(), date.getMinutes());
      }
    }
  };

  const handleJournalTimeChange = async (event: any, date?: Date) => {
    setShowJournalPicker(false);
    if (date && event.type !== 'dismissed') {
      const timeString = formatTimeString(date);
      setJournalReminder(true, timeString);

      if (pushNotificationsEnabled && journalReminderEnabled) {
        await scheduleReminder('journal', date.getHours(), date.getMinutes());
      }
    }
  };

  const handleSpokenPrayerToggle = (value: boolean) => {
    setSpokenPrayer(value, spokenPrayerTimes);
    // TODO: Schedule/cancel spoken prayer notifications
    // This will be implemented when notifications are fully wired up
  };

  const handlePrayerTimesChange = (times: string[]) => {
    setSpokenPrayer(spokenPrayerEnabled, times);
    // TODO: Reschedule spoken prayer notifications with new times
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <SettingsSection title="Push Notifications">
          <SettingsToggle
            label="Enable Notifications"
            description="Receive reminders and updates"
            value={pushNotificationsEnabled}
            onValueChange={handlePushToggle}
            isLast
          />
        </SettingsSection>

        <SettingsSection title="Daily Content">
          <SettingsToggle
            label="Daily Inspirations"
            description="Receive a daily motivational message"
            value={dailyInspirationsEnabled}
            onValueChange={handleDailyInspirationsToggle}
            disabled={!pushNotificationsEnabled}
          />
          <SettingsToggle
            label="Progress Milestones"
            description="Get notified when you reach goals"
            value={progressMilestonesEnabled}
            onValueChange={setProgressMilestones}
            disabled={!pushNotificationsEnabled}
            isLast
          />
        </SettingsSection>

        <SettingsSection title="Reminders">
          <SettingsToggle
            label="Meditation Reminder"
            description="Daily reminder to meditate"
            value={meditationReminderEnabled}
            onValueChange={handleMeditationReminderToggle}
            disabled={!pushNotificationsEnabled}
          />
          {meditationReminderEnabled && (
            <SettingsRow
              label="Reminder Time"
              value={formatTimeDisplay(meditationReminderTime)}
              onPress={() => setShowMeditationPicker(true)}
              showChevron
              disabled={!pushNotificationsEnabled}
            />
          )}
          <SettingsToggle
            label="Journal Reminder"
            description="Daily reminder to journal"
            value={journalReminderEnabled}
            onValueChange={handleJournalReminderToggle}
            disabled={!pushNotificationsEnabled}
          />
          {journalReminderEnabled && (
            <SettingsRow
              label="Reminder Time"
              value={formatTimeDisplay(journalReminderTime)}
              onPress={() => setShowJournalPicker(true)}
              showChevron
              disabled={!pushNotificationsEnabled}
            />
          )}
          <SettingsToggle
            label="Spoken Prayer"
            description="Daily reminders for spoken prayer"
            value={spokenPrayerEnabled}
            onValueChange={handleSpokenPrayerToggle}
            disabled={!pushNotificationsEnabled}
          />
          {spokenPrayerEnabled && (
            <PrayerTimePicker
              times={spokenPrayerTimes}
              onTimesChange={handlePrayerTimesChange}
              disabled={!pushNotificationsEnabled}
              maxTimes={6}
            />
          )}
        </SettingsSection>

        {!pushNotificationsEnabled && (
          <View style={styles.disabledNote}>
            <Text style={styles.disabledNoteText}>
              Enable push notifications to customize reminder settings.
            </Text>
          </View>
        )}

        {/* Time Pickers */}
        {showMeditationPicker && (
          <DateTimePicker
            value={parseTimeToDate(meditationReminderTime)}
            mode="time"
            is24Hour={false}
            display="spinner"
            onChange={handleMeditationTimeChange}
          />
        )}

        {showJournalPicker && (
          <DateTimePicker
            value={parseTimeToDate(journalReminderTime)}
            mode="time"
            is24Hour={false}
            display="spinner"
            onChange={handleJournalTimeChange}
          />
        )}
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
  disabledNote: {
    backgroundColor: colors.background.elevated,
    borderRadius: 8,
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  disabledNoteText: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
  },
});

export default NotificationsScreen;
