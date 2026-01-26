/**
 * SyncToGuruButton Component
 *
 * A button that allows users to explicitly sync their workbook data to Guru AI.
 * This gives users explicit control to ensure Guru has their latest updates.
 *
 * Features:
 * - Gold-themed button matching app style
 * - Shows "Save & Sync to Guru" text with sync icon
 * - On press: forces immediate save, invalidates Guru cache
 * - Shows "Syncing..." with spinner, then "Guru Updated" confirmation
 * - Haptic feedback on success
 */

import React, { useState, useCallback } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useQueryClient } from '@tanstack/react-query';
import { colors } from '../../theme/colors';

// Design system colors from APP-DESIGN.md
const DESIGN_COLORS = {
  bgPrimary: '#1a1a2e',
  bgElevated: '#252547',
  textPrimary: '#e8e8e8',
  textSecondary: '#a0a0b0',
  accentGold: '#c9a227',
  accentGoldDark: '#9a7a1f',
  border: '#3a3a5a',
  success: '#2d5a4a',
};

type SyncState = 'idle' | 'syncing' | 'success' | 'error';

interface SyncToGuruButtonProps {
  /** Callback to trigger immediate save */
  onSave?: () => Promise<void> | void;
  /** Whether the button should be disabled */
  disabled?: boolean;
  /** Optional custom style */
  style?: object;
  /** Compact mode - smaller button */
  compact?: boolean;
}

/**
 * SyncToGuruButton
 *
 * Provides users with explicit control to sync their workbook data to Guru AI.
 *
 * @example
 * ```tsx
 * <SyncToGuruButton
 *   onSave={saveNow}
 *   disabled={isSaving}
 * />
 * ```
 */
export const SyncToGuruButton: React.FC<SyncToGuruButtonProps> = ({
  onSave,
  disabled = false,
  style,
  compact = false,
}) => {
  const [syncState, setSyncState] = useState<SyncState>('idle');
  const queryClient = useQueryClient();

  const handleSync = useCallback(async () => {
    if (disabled || syncState === 'syncing') return;

    try {
      setSyncState('syncing');
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // 1. Trigger immediate save if callback provided
      if (onSave) {
        await onSave();
      }

      // 2. Invalidate Guru-related queries to force refresh
      // This ensures Guru will fetch fresh data on next interaction
      await queryClient.invalidateQueries({ queryKey: ['workbook'] });
      await queryClient.invalidateQueries({ queryKey: ['guruContext'] });
      await queryClient.invalidateQueries({ queryKey: ['phaseProgress'] });

      // 3. Show success state
      setSyncState('success');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // 4. Reset to idle after showing success
      setTimeout(() => {
        setSyncState('idle');
      }, 2000);
    } catch (error) {
      console.error('[SyncToGuruButton] Sync failed:', error);
      setSyncState('error');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

      // Reset to idle after showing error
      setTimeout(() => {
        setSyncState('idle');
      }, 3000);
    }
  }, [disabled, syncState, onSave, queryClient]);

  const getButtonContent = () => {
    switch (syncState) {
      case 'syncing':
        return (
          <View style={styles.contentRow}>
            <ActivityIndicator
              size="small"
              color={DESIGN_COLORS.bgPrimary}
              style={styles.icon}
            />
            <Text style={[styles.buttonText, compact && styles.buttonTextCompact]}>
              Syncing...
            </Text>
          </View>
        );
      case 'success':
        return (
          <View style={styles.contentRow}>
            <Text style={styles.successIcon}>✓</Text>
            <Text style={[styles.buttonText, compact && styles.buttonTextCompact]}>
              Guru Updated
            </Text>
          </View>
        );
      case 'error':
        return (
          <View style={styles.contentRow}>
            <Text style={styles.errorIcon}>!</Text>
            <Text style={[styles.buttonText, compact && styles.buttonTextCompact]}>
              Sync Failed - Tap to Retry
            </Text>
          </View>
        );
      default:
        return (
          <View style={styles.contentRow}>
            <Text style={styles.syncIcon}>↻</Text>
            <Text style={[styles.buttonText, compact && styles.buttonTextCompact]}>
              Save & Sync to Guru
            </Text>
          </View>
        );
    }
  };

  const getButtonStyle = () => {
    const baseStyle = [
      styles.button,
      compact && styles.buttonCompact,
      style,
    ];

    switch (syncState) {
      case 'success':
        return [...baseStyle, styles.buttonSuccess];
      case 'error':
        return [...baseStyle, styles.buttonError];
      default:
        return baseStyle;
    }
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={handleSync}
      disabled={disabled || syncState === 'syncing'}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel="Save and sync data to Guru AI"
      accessibilityState={{ disabled: disabled || syncState === 'syncing' }}
    >
      {getButtonContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: DESIGN_COLORS.accentGold,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginVertical: 8,
    shadowColor: DESIGN_COLORS.accentGold,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonCompact: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  buttonSuccess: {
    backgroundColor: DESIGN_COLORS.success,
  },
  buttonError: {
    backgroundColor: colors.error[500],
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 8,
  },
  syncIcon: {
    fontSize: 18,
    fontWeight: '700',
    color: DESIGN_COLORS.bgPrimary,
    marginRight: 8,
  },
  successIcon: {
    fontSize: 16,
    fontWeight: '700',
    color: DESIGN_COLORS.textPrimary,
    marginRight: 8,
  },
  errorIcon: {
    fontSize: 16,
    fontWeight: '700',
    color: DESIGN_COLORS.textPrimary,
    marginRight: 8,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: DESIGN_COLORS.bgPrimary,
  },
  buttonTextCompact: {
    fontSize: 13,
  },
});

export default SyncToGuruButton;
