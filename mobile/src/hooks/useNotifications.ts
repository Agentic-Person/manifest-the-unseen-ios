/**
 * useNotifications Hook
 *
 * Manages push notification permissions and scheduling.
 */

import { useCallback, useEffect, useState } from 'react';
import * as Notifications from 'expo-notifications';

// Configure how notifications are handled when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

interface UseNotificationsReturn {
  /** Whether push notification permissions are granted */
  hasPermission: boolean;
  /** Whether permission status is still loading */
  isLoading: boolean;
  /** Request push notification permissions */
  requestPermission: () => Promise<boolean>;
  /** Schedule a daily reminder notification */
  scheduleReminder: (
    type: 'meditation' | 'journal',
    hour: number,
    minute: number
  ) => Promise<string | null>;
  /** Cancel a specific notification by identifier */
  cancelNotification: (identifier: string) => Promise<void>;
  /** Cancel all scheduled notifications of a specific type */
  cancelAllReminders: (type: 'meditation' | 'journal') => Promise<void>;
  /** Schedule a daily inspiration notification */
  scheduleDailyInspiration: (hour: number, minute: number) => Promise<string | null>;
}

// Notification identifiers for tracking
const NOTIFICATION_IDS = {
  MEDITATION_REMINDER: 'meditation-daily-reminder',
  JOURNAL_REMINDER: 'journal-daily-reminder',
  DAILY_INSPIRATION: 'daily-inspiration',
};

/**
 * useNotifications
 *
 * Hook for managing push notifications.
 *
 * @example
 * ```tsx
 * const { hasPermission, requestPermission, scheduleReminder } = useNotifications();
 *
 * const enableReminders = async () => {
 *   const granted = await requestPermission();
 *   if (granted) {
 *     await scheduleReminder('meditation', 9, 0); // 9:00 AM
 *   }
 * };
 * ```
 */
export function useNotifications(): UseNotificationsReturn {
  const [hasPermission, setHasPermission] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check initial permission status
  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async () => {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      setHasPermission(status === 'granted');
    } catch (error) {
      console.error('Error checking notification permission:', error);
      setHasPermission(false);
    } finally {
      setIsLoading(false);
    }
  };

  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();

      if (existingStatus === 'granted') {
        setHasPermission(true);
        return true;
      }

      const { status } = await Notifications.requestPermissionsAsync();
      const granted = status === 'granted';
      setHasPermission(granted);
      return granted;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }, []);

  const scheduleReminder = useCallback(
    async (
      type: 'meditation' | 'journal',
      hour: number,
      minute: number
    ): Promise<string | null> => {
      if (!hasPermission) {
        console.warn('Cannot schedule notification: permission not granted');
        return null;
      }

      try {
        // Cancel existing reminder of this type first
        const identifier =
          type === 'meditation'
            ? NOTIFICATION_IDS.MEDITATION_REMINDER
            : NOTIFICATION_IDS.JOURNAL_REMINDER;

        await Notifications.cancelScheduledNotificationAsync(identifier);

        // Schedule new daily notification
        const notificationId = await Notifications.scheduleNotificationAsync({
          identifier,
          content: {
            title:
              type === 'meditation'
                ? 'Time to Meditate'
                : 'Journal Reminder',
            body:
              type === 'meditation'
                ? 'Take a moment to center yourself and find inner peace.'
                : 'Reflect on your day and capture your thoughts.',
            sound: true,
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DAILY,
            hour,
            minute,
          },
        });

        return notificationId;
      } catch (error) {
        console.error(`Error scheduling ${type} reminder:`, error);
        return null;
      }
    },
    [hasPermission]
  );

  const cancelNotification = useCallback(async (identifier: string) => {
    try {
      await Notifications.cancelScheduledNotificationAsync(identifier);
    } catch (error) {
      console.error('Error canceling notification:', error);
    }
  }, []);

  const cancelAllReminders = useCallback(async (type: 'meditation' | 'journal') => {
    const identifier =
      type === 'meditation'
        ? NOTIFICATION_IDS.MEDITATION_REMINDER
        : NOTIFICATION_IDS.JOURNAL_REMINDER;

    await cancelNotification(identifier);
  }, [cancelNotification]);

  const scheduleDailyInspiration = useCallback(
    async (hour: number, minute: number): Promise<string | null> => {
      if (!hasPermission) {
        console.warn('Cannot schedule notification: permission not granted');
        return null;
      }

      try {
        // Cancel existing daily inspiration first
        await Notifications.cancelScheduledNotificationAsync(
          NOTIFICATION_IDS.DAILY_INSPIRATION
        );

        // Sample inspirational messages
        const inspirations = [
          'Your thoughts create your reality. Choose them wisely.',
          'Every day is a new opportunity to manifest your dreams.',
          'Trust the process. The universe is working in your favor.',
          'You are worthy of all the abundance life has to offer.',
          'Gratitude opens the door to more blessings.',
        ];

        const randomInspiration =
          inspirations[Math.floor(Math.random() * inspirations.length)];

        const notificationId = await Notifications.scheduleNotificationAsync({
          identifier: NOTIFICATION_IDS.DAILY_INSPIRATION,
          content: {
            title: 'Daily Inspiration',
            body: randomInspiration,
            sound: true,
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DAILY,
            hour,
            minute,
          },
        });

        return notificationId;
      } catch (error) {
        console.error('Error scheduling daily inspiration:', error);
        return null;
      }
    },
    [hasPermission]
  );

  return {
    hasPermission,
    isLoading,
    requestPermission,
    scheduleReminder,
    cancelNotification,
    cancelAllReminders,
    scheduleDailyInspiration,
  };
}

export default useNotifications;
