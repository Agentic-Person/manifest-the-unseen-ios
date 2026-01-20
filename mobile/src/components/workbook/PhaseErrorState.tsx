/**
 * PhaseErrorState Component
 *
 * Reusable error state UI for Phase Dashboards.
 * Shows a friendly error message with a retry button.
 */
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from '../Text';
import { colors, spacing, borderRadius } from '../../theme';

interface PhaseErrorStateProps {
  /**
   * The error object or message
   */
  error: Error | unknown;
  /**
   * Callback to retry loading the data
   */
  onRetry: () => void;
}

/**
 * Error state component for Phase Dashboards
 */
export const PhaseErrorState: React.FC<PhaseErrorStateProps> = ({ error, onRetry }) => {
  const errorMessage =
    error instanceof Error ? error.message : 'Something went wrong while loading your progress.';

  return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorTitle}>Unable to Load Exercises</Text>
      <Text style={styles.errorMessage}>{errorMessage}</Text>
      <TouchableOpacity
        style={styles.retryButton}
        onPress={onRetry}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="Retry loading exercises"
      >
        <Text style={styles.retryButtonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    padding: spacing.xl,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 15,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: colors.primary[600],
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
});
