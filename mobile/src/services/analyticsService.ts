/**
 * Analytics Service
 *
 * TelemetryDeck wrapper for privacy-focused analytics.
 * Tracks feature usage, conversion funnels, and retention.
 *
 * Features:
 * - Respects user's analyticsEnabled setting
 * - Privacy-first (no PII collected)
 * - Tracks key app events for insights
 */

import TelemetryDeck from '@telemetrydeck/sdk';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { useSettingsStore } from '../stores/settingsStore';

/**
 * TelemetryDeck client instance
 */
let tdClient: TelemetryDeck | null = null;

/**
 * Check if analytics is enabled
 */
const isAnalyticsEnabled = (): boolean => {
  return useSettingsStore.getState().analyticsEnabled;
};

/**
 * Initialize TelemetryDeck
 *
 * Call this early in app startup.
 * Will only initialize if app ID is configured and analytics is enabled.
 */
export const initializeAnalytics = (): void => {
  const appId = process.env.EXPO_PUBLIC_TELEMETRYDECK_APP_ID;

  if (!appId) {
    if (__DEV__) {
      console.log('[Analytics] No TelemetryDeck App ID configured, skipping initialization');
    }
    return;
  }

  if (!isAnalyticsEnabled()) {
    if (__DEV__) {
      console.log('[Analytics] Analytics disabled by user');
    }
    return;
  }

  tdClient = new TelemetryDeck({
    appID: appId,
    clientUser: 'anonymous', // Anonymous tracking - TelemetryDeck hashes this
    testMode: __DEV__,
  });

  if (__DEV__) {
    console.log('[Analytics] TelemetryDeck initialized');
  }

  // Track app launch
  trackEvent('app_launched');
};

/**
 * Track an analytics event
 *
 * @param eventName - Name of the event
 * @param additionalPayload - Additional data to include (non-PII only)
 */
export const trackEvent = (
  eventName: string,
  additionalPayload?: Record<string, string | number | boolean>
): void => {
  if (!isAnalyticsEnabled()) {
    if (__DEV__) {
      console.log('[Analytics] (Not sent - disabled)', eventName, additionalPayload);
    }
    return;
  }

  if (!tdClient) {
    if (__DEV__) {
      console.log('[Analytics] Client not initialized');
    }
    return;
  }

  const appVersion = Constants.expoConfig?.version || '1.0.0';
  const buildNumber = Constants.expoConfig?.ios?.buildNumber || '1';

  // Create payload with app metadata
  const payload: Record<string, string> = {
    appVersion: `${appVersion}`,
    buildNumber: `${buildNumber}`,
    platform: Platform.OS,
    platformVersion: String(Platform.Version),
  };

  // Add any additional payload (convert to strings for TelemetryDeck)
  if (additionalPayload) {
    for (const [key, value] of Object.entries(additionalPayload)) {
      payload[key] = String(value);
    }
  }

  tdClient.signal(eventName, payload);

  if (__DEV__) {
    console.log('[Analytics] Event tracked:', eventName, payload);
  }
};

/**
 * Set user identifier for analytics
 * Uses a hashed/anonymous identifier, NOT the actual user ID
 *
 * @param userId - User ID to hash
 */
export const setAnalyticsUser = (userId: string | null): void => {
  // TelemetryDeck automatically generates anonymous user identifiers
  // We don't need to set an explicit user ID
  // This function is here for API consistency with crash reporting
  if (__DEV__ && userId) {
    console.log('[Analytics] User set (anonymous tracking)');
  }
};

/**
 * Clear analytics user
 * Call this on logout
 */
export const clearAnalyticsUser = (): void => {
  // TelemetryDeck handles this automatically
  if (__DEV__) {
    console.log('[Analytics] User cleared');
  }
};

// ============================================
// Pre-defined Event Helpers
// ============================================

/**
 * Track screen view
 */
export const trackScreenView = (screenName: string): void => {
  trackEvent('screen_viewed', { screen: screenName });
};

/**
 * Track feature usage
 */
export const trackFeatureUsed = (
  featureName: string,
  details?: Record<string, string | number | boolean>
): void => {
  trackEvent('feature_used', { feature: featureName, ...details });
};

// ---- Onboarding Events ----

export const trackOnboardingStarted = (): void => {
  trackEvent('onboarding_started');
};

export const trackOnboardingCompleted = (): void => {
  trackEvent('onboarding_completed');
};

export const trackDisclaimerAccepted = (): void => {
  trackEvent('disclaimer_accepted');
};

// ---- Authentication Events ----

export const trackSignUpStarted = (method: 'apple' | 'email'): void => {
  trackEvent('signup_started', { method });
};

export const trackSignUpCompleted = (method: 'apple' | 'email'): void => {
  trackEvent('signup_completed', { method });
};

export const trackSignInCompleted = (method: 'apple' | 'email'): void => {
  trackEvent('signin_completed', { method });
};

export const trackSignOut = (): void => {
  trackEvent('signout');
};

// ---- Workbook Events ----

export const trackPhaseStarted = (phaseNumber: number): void => {
  trackEvent('phase_started', { phase: phaseNumber });
};

export const trackPhaseCompleted = (phaseNumber: number): void => {
  trackEvent('phase_completed', { phase: phaseNumber });
};

export const trackExerciseCompleted = (phaseNumber: number, exerciseId: string): void => {
  trackEvent('exercise_completed', { phase: phaseNumber, exercise: exerciseId });
};

// ---- Journal Events ----

export const trackJournalCreated = (type: 'text' | 'voice'): void => {
  trackEvent('journal_created', { type });
};

export const trackVoiceRecordingStarted = (): void => {
  trackEvent('voice_recording_started');
};

export const trackVoiceTranscriptionCompleted = (): void => {
  trackEvent('voice_transcription_completed');
};

// ---- Meditation Events ----

export const trackMeditationStarted = (meditationId: string, duration: number): void => {
  trackEvent('meditation_started', { meditationId, duration });
};

export const trackMeditationCompleted = (meditationId: string, duration: number): void => {
  trackEvent('meditation_completed', { meditationId, duration });
};

export const trackMeditationAbandoned = (meditationId: string, listenedSeconds: number): void => {
  trackEvent('meditation_abandoned', { meditationId, listenedSeconds });
};

// ---- AI Chat Events ----

export const trackGuruChatStarted = (): void => {
  trackEvent('guru_chat_started');
};

export const trackGuruMessageSent = (): void => {
  trackEvent('guru_message_sent');
};

export const trackGuruConversationCompleted = (): void => {
  trackEvent('guru_conversation_completed');
};

// ---- Subscription Events ----

export const trackSubscriptionViewed = (): void => {
  trackEvent('subscription_viewed');
};

export const trackTrialStarted = (tier: string): void => {
  trackEvent('trial_started', { tier });
};

export const trackSubscriptionStarted = (tier: string, period: 'monthly' | 'yearly'): void => {
  trackEvent('subscription_started', { tier, period });
};

export const trackSubscriptionCancelled = (tier: string): void => {
  trackEvent('subscription_cancelled', { tier });
};

export const trackPaywallDismissed = (reason?: string): void => {
  trackEvent('paywall_dismissed', { reason: reason || 'unknown' });
};

// ---- Vision Board Events ----

export const trackVisionBoardCreated = (): void => {
  trackEvent('vision_board_created');
};

export const trackVisionBoardImageAdded = (): void => {
  trackEvent('vision_board_image_added');
};

// ---- Error Events ----

export const trackError = (errorType: string, errorMessage: string): void => {
  // Only track non-sensitive error info
  trackEvent('error_occurred', {
    errorType,
    // Truncate message to avoid sensitive data
    errorMessage: errorMessage.substring(0, 100),
  });
};

// ---- Settings Events ----

export const trackSettingChanged = (setting: string, value: string | boolean): void => {
  trackEvent('setting_changed', { setting, value: String(value) });
};
