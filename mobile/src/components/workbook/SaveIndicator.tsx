/**
 * SaveIndicator Component
 *
 * Visual indicator for save status (saving, saved, error).
 * Displays in a pill/badge format, suitable for header or content areas.
 */

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/colors';

// Maximum time to show "Saving..." before considering it stuck (15 seconds)
// With retry logic (3 retries with exponential backoff), saves should complete within 15s
const MAX_SAVING_DISPLAY_MS = 15000;
// If lastSaved is within this time, consider it "just saved" even if isSaving is stuck
const RECENT_SAVE_THRESHOLD_MS = 5000;

interface SaveIndicatorProps {
  /** Whether a save is currently in progress */
  isSaving: boolean;
  /** Timestamp of the last successful save */
  lastSaved: Date | null;
  /** Whether the last save failed */
  isError: boolean;
  /** Callback to retry the save on error */
  onRetry?: () => void;
}

/**
 * Format time for display (HH:MM format)
 */
const formatTime = (date: Date): string => {
  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * SaveIndicator
 *
 * Shows the current save status:
 * - Saving: Shows spinner with "Saving..."
 * - Saved: Shows checkmark with "Saved at HH:MM"
 * - Error: Shows warning with "Error saving. Tap to retry."
 *
 * @example
 * ```tsx
 * <SaveIndicator
 *   isSaving={isSaving}
 *   lastSaved={lastSaved}
 *   isError={isError}
 *   onRetry={saveNow}
 * />
 * ```
 */
export const SaveIndicator: React.FC<SaveIndicatorProps> = ({
  isSaving,
  lastSaved,
  isError,
  onRetry,
}) => {
  // Track how long we've been showing "Saving..."
  const [savingDuration, setSavingDuration] = useState(0);
  const savingStartRef = useRef<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Track saving duration with an interval
  useEffect(() => {
    if (isSaving) {
      // Start tracking when saving begins
      if (savingStartRef.current === null) {
        savingStartRef.current = Date.now();
      }

      // Update duration every second
      intervalRef.current = setInterval(() => {
        if (savingStartRef.current !== null) {
          setSavingDuration(Date.now() - savingStartRef.current);
        }
      }, 1000);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    } else {
      // Reset when saving stops
      savingStartRef.current = null;
      setSavingDuration(0);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return undefined;
    }
  }, [isSaving]);

  // Check if lastSaved is recent (within 5 seconds)
  const isRecentlySaved = lastSaved
    ? Date.now() - lastSaved.getTime() < RECENT_SAVE_THRESHOLD_MS
    : false;

  // Determine if the saving indicator is stuck
  const isSavingStuck = isSaving && savingDuration > MAX_SAVING_DISPLAY_MS;

  // Fallback: if lastSaved is very recent and isSaving is stuck, show "Saved" instead
  if (isSaving && isRecentlySaved && savingDuration > 3000) {
    // isSaving is stuck but we have a recent save - show saved state
    return (
      <View style={styles.container}>
        <Text style={styles.checkIcon}>✓</Text>
        <Text style={styles.text}>Saved at {formatTime(lastSaved!)}</Text>
      </View>
    );
  }

  // If saving is stuck for too long, show error/retry state
  if (isSavingStuck) {
    return (
      <TouchableOpacity
        style={[styles.container, styles.warningContainer]}
        onPress={onRetry}
        activeOpacity={0.7}
      >
        <Text style={styles.warningIcon}>⏳</Text>
        <Text style={[styles.text, styles.warningText]}>Save may have failed. Tap to retry.</Text>
      </TouchableOpacity>
    );
  }

  // Normal saving state
  if (isSaving) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="small" color={colors.dark.textSecondary} style={styles.icon} />
        <Text style={styles.text}>Saving...</Text>
      </View>
    );
  }

  // Error state
  if (isError) {
    return (
      <TouchableOpacity
        style={[styles.container, styles.errorContainer]}
        onPress={onRetry}
        activeOpacity={0.7}
      >
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={[styles.text, styles.errorText]}>Error saving. Tap to retry.</Text>
      </TouchableOpacity>
    );
  }

  // Saved state
  if (lastSaved) {
    return (
      <View style={styles.container}>
        <Text style={styles.checkIcon}>✓</Text>
        <Text style={styles.text}>Saved at {formatTime(lastSaved)}</Text>
      </View>
    );
  }

  // No state to show
  return null;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 16,
    alignSelf: 'center',
    marginVertical: 8,
  },
  errorContainer: {
    backgroundColor: 'rgba(220, 38, 38, 0.2)',
  },
  warningContainer: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
  },
  icon: {
    marginRight: 6,
  },
  text: {
    fontSize: 12,
    color: colors.dark.textSecondary,
    marginLeft: 4,
  },
  checkIcon: {
    fontSize: 14,
    color: colors.success[500],
  },
  errorIcon: {
    fontSize: 14,
  },
  warningIcon: {
    fontSize: 14,
  },
  errorText: {
    color: colors.error[400],
  },
  warningText: {
    color: '#F59E0B', // Amber/warning color
  },
});

export default SaveIndicator;
