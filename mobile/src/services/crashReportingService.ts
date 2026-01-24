/**
 * Crash Reporting Service
 *
 * Sentry wrapper that respects user privacy settings.
 * Provides crash reporting, error tracking, and performance monitoring.
 *
 * Features:
 * - Respects user's crashReportingEnabled setting
 * - Sanitizes sensitive data before sending
 * - Adds breadcrumbs for debugging context
 * - Supports user identification for tracking
 */

import * as Sentry from '@sentry/react-native';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { useSettingsStore } from '../stores/settingsStore';

/**
 * Sensitive fields to scrub from error reports
 */
const SENSITIVE_FIELDS = [
  'password',
  'token',
  'access_token',
  'refresh_token',
  'accessToken',
  'refreshToken',
  'api_key',
  'apiKey',
  'secret',
  'authorization',
  'cookie',
  'session',
  'identityToken',
  'credential',
  'jwt',
  'bearer',
  'journal', // Don't send journal content
  'journalEntry',
  'journalContent',
  'content', // Generic content field
];

/**
 * Check if crash reporting is enabled
 */
const isCrashReportingEnabled = (): boolean => {
  return useSettingsStore.getState().crashReportingEnabled;
};

/**
 * Initialize Sentry
 *
 * Call this early in app startup.
 * Will only initialize if DSN is configured and crash reporting is enabled.
 */
export const initializeCrashReporting = (): void => {
  const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN;

  if (!dsn) {
    if (__DEV__) {
      console.log('[CrashReporting] No Sentry DSN configured, skipping initialization');
    }
    return;
  }

  if (!isCrashReportingEnabled()) {
    if (__DEV__) {
      console.log('[CrashReporting] Crash reporting disabled by user');
    }
    return;
  }

  const appVersion = Constants.expoConfig?.version || '1.0.0';
  const buildNumber = Constants.expoConfig?.ios?.buildNumber || '1';

  Sentry.init({
    dsn,
    debug: __DEV__,
    environment: __DEV__ ? 'development' : 'production',
    release: `com.manifesttheunseen.app@${appVersion}+${buildNumber}`,

    // Performance monitoring
    tracesSampleRate: __DEV__ ? 1.0 : 0.2,

    // Session tracking
    enableAutoSessionTracking: true,
    sessionTrackingIntervalMillis: 30000,

    // Scrub sensitive data
    beforeSend: (event) => {
      // Re-check user preference at send time
      if (!isCrashReportingEnabled()) {
        return null;
      }

      // Scrub sensitive fields from event data
      if (event.extra) {
        event.extra = scrubSensitiveData(event.extra);
      }

      if (event.contexts) {
        event.contexts = scrubSensitiveData(event.contexts);
      }

      return event;
    },

    // Scrub sensitive data from breadcrumbs
    beforeBreadcrumb: (breadcrumb) => {
      if (!isCrashReportingEnabled()) {
        return null;
      }

      if (breadcrumb.data) {
        breadcrumb.data = scrubSensitiveData(breadcrumb.data);
      }

      return breadcrumb;
    },

    // Attach stack traces
    attachStacktrace: true,

    // Don't send default PII
    sendDefaultPii: false,
  });

  if (__DEV__) {
    console.log('[CrashReporting] Sentry initialized');
  }
};

/**
 * Scrub sensitive data from an object
 */
const scrubSensitiveData = (obj: Record<string, any>): Record<string, any> => {
  const scrubbed: Record<string, any> = {};

  for (const [key, value] of Object.entries(obj)) {
    const isFieldSensitive = SENSITIVE_FIELDS.some((field) =>
      key.toLowerCase().includes(field.toLowerCase())
    );

    if (isFieldSensitive) {
      scrubbed[key] = '[REDACTED]';
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      scrubbed[key] = scrubSensitiveData(value);
    } else {
      scrubbed[key] = value;
    }
  }

  return scrubbed;
};

/**
 * Capture an exception
 *
 * @param error - The error to capture
 * @param context - Additional context data
 */
export const captureException = (error: Error | unknown, context?: Record<string, any>): void => {
  if (!isCrashReportingEnabled()) {
    if (__DEV__) {
      console.error('[CrashReporting] (Not sent - disabled)', error);
    }
    return;
  }

  const scope = new Sentry.Scope();

  if (context) {
    scope.setExtras(scrubSensitiveData(context));
  }

  Sentry.captureException(error, scope);

  if (__DEV__) {
    console.log('[CrashReporting] Exception captured', error);
  }
};

/**
 * Capture a message
 *
 * @param message - The message to capture
 * @param level - Severity level
 * @param context - Additional context data
 */
export const captureMessage = (
  message: string,
  level: Sentry.SeverityLevel = 'info',
  context?: Record<string, any>
): void => {
  if (!isCrashReportingEnabled()) {
    return;
  }

  const scope = new Sentry.Scope();
  scope.setLevel(level);

  if (context) {
    scope.setExtras(scrubSensitiveData(context));
  }

  Sentry.captureMessage(message, scope);
};

/**
 * Add a breadcrumb for debugging context
 *
 * @param breadcrumb - Breadcrumb data
 */
export const addBreadcrumb = (breadcrumb: {
  category: string;
  message: string;
  level?: Sentry.SeverityLevel;
  data?: Record<string, any>;
}): void => {
  if (!isCrashReportingEnabled()) {
    return;
  }

  Sentry.addBreadcrumb({
    ...breadcrumb,
    data: breadcrumb.data ? scrubSensitiveData(breadcrumb.data) : undefined,
  });
};

/**
 * Set user context for error tracking
 *
 * @param userId - User ID (or null to clear)
 * @param email - User email (optional, will be redacted for privacy)
 */
export const setUser = (userId: string | null, email?: string): void => {
  if (!isCrashReportingEnabled()) {
    return;
  }

  if (userId) {
    Sentry.setUser({
      id: userId,
      // Only include email domain for privacy
      email: email ? `***@${email.split('@')[1] || 'unknown'}` : undefined,
    });
  } else {
    Sentry.setUser(null);
  }
};

/**
 * Set a tag on all future events
 *
 * @param key - Tag key
 * @param value - Tag value
 */
export const setTag = (key: string, value: string): void => {
  if (!isCrashReportingEnabled()) {
    return;
  }

  Sentry.setTag(key, value);
};

/**
 * Clear user context
 * Call this on logout
 */
export const clearUser = (): void => {
  Sentry.setUser(null);
};

/**
 * Get device and app info for diagnostics
 * Used in bug reports and support requests
 */
export const getDiagnosticInfo = (): Record<string, string> => {
  const appVersion = Constants.expoConfig?.version || '1.0.0';
  const buildNumber = Constants.expoConfig?.ios?.buildNumber || '1';

  return {
    appVersion: `${appVersion} (${buildNumber})`,
    platform: `${Platform.OS} ${Platform.Version}`,
    deviceName: Constants.deviceName || 'Unknown',
    expoVersion: Constants.expoVersion || 'Unknown',
    crashReportingEnabled: isCrashReportingEnabled() ? 'Yes' : 'No',
  };
};

/**
 * Test crash (development only)
 * Useful for verifying Sentry integration
 */
export const testCrash = (): void => {
  if (!__DEV__) {
    console.warn('[CrashReporting] testCrash is only available in development');
    return;
  }

  throw new Error('Test crash from Manifest the Unseen');
};
