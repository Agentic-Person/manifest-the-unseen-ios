/**
 * SaveIndicator Component
 *
 * Visual indicator for save status (saving, saved, error).
 * Displays in a pill/badge format, suitable for header or content areas.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { colors } from '../../theme/colors';

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
  // Saving state
  if (isSaving) {
    return (
      <View style={styles.container}>
        <ActivityIndicator
          size="small"
          color={colors.dark.textSecondary}
          style={styles.icon}
        />
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
        <Text style={[styles.text, styles.errorText]}>
          Error saving. Tap to retry.
        </Text>
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
  errorText: {
    color: colors.error[400],
  },
});

export default SaveIndicator;
