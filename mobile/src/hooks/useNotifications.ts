/**
 * useNotifications Hook
 *
 * Manages push notification permissions and scheduling.
 *
 * NOTE: This is a MOCK implementation. Push notifications are temporarily disabled
 * because the Apple provisioning profile needs to be regenerated with Push Notification
 * capability. Once the provisioning profile is updated, restore the real implementation
 * by uncommenting the expo-notifications imports and functionality.
 *
 * To enable notifications:
 * 1. Go to Expo dashboard > Credentials > iOS > Delete provisioning profile
 * 2. Run `eas credentials` and regenerate with Push Notifications enabled
 * 3. Restore the real implementation of this hook
 */

import { useCallback, useState } from 'react';
// TODO: Uncomment when provisioning profile supports Push Notifications
// import * as Notifications from 'expo-notifications';

// TODO: Restore when notifications are enabled
// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: true,
//     shouldSetBadge: false,
//     shouldShowBanner: true,
//     shouldShowList: true,
//   }),
// });

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

/**
 * useNotifications (MOCK VERSION)
 *
 * Hook for managing push notifications.
 * Currently returns mock data - notifications are disabled until
 * Apple provisioning profile is updated.
 */
export function useNotifications(): UseNotificationsReturn {
  // Always return false for permissions in mock mode
  const [hasPermission] = useState(false);
  const [isLoading] = useState(false);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    console.log('[Notifications] MOCK: requestPermission called - notifications disabled');
    console.log('[Notifications] To enable: regenerate provisioning profile with Push Notification capability');
    // Return false - notifications not available
    return false;
  }, []);

  const scheduleReminder = useCallback(
    async (
      type: 'meditation' | 'journal',
      _hour: number,
      _minute: number
    ): Promise<string | null> => {
      console.log(`[Notifications] MOCK: scheduleReminder(${type}) - notifications disabled`);
      return null;
    },
    []
  );

  const cancelNotification = useCallback(async (_identifier: string) => {
    console.log('[Notifications] MOCK: cancelNotification - notifications disabled');
  }, []);

  const cancelAllReminders = useCallback(async (_type: 'meditation' | 'journal') => {
    console.log('[Notifications] MOCK: cancelAllReminders - notifications disabled');
  }, []);

  const scheduleDailyInspiration = useCallback(
    async (_hour: number, _minute: number): Promise<string | null> => {
      console.log('[Notifications] MOCK: scheduleDailyInspiration - notifications disabled');
      return null;
    },
    []
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
