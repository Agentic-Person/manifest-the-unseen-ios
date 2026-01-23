/**
 * Sticky Completion Button
 *
 * A completion button that stays fixed at the bottom of the screen,
 * always visible regardless of scroll position. This ensures users
 * can always see and access the completion action.
 *
 * Features:
 * - Glowing green effect when exercise can be completed
 * - Pulsing animation to draw attention
 * - Clear visual states for disabled/ready/completed
 */

import React, { useEffect, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, ActivityIndicator, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Text } from '../Text';
import { colors, spacing, borderRadius, shadows } from '../../theme';

interface StickyCompletionButtonProps {
  isCompleted: boolean;
  canComplete: boolean;
  isAutoCompleted: boolean;
  isSaving: boolean;
  onPress: () => void;
  /** Optional callback to trigger navigation after completion */
  onComplete?: () => void;
}

export const StickyCompletionButton: React.FC<StickyCompletionButtonProps> = ({
  isCompleted,
  canComplete,
  isAutoCompleted: _isAutoCompleted,
  isSaving,
  onPress,
  onComplete,
}) => {
  const insets = useSafeAreaInsets();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  // Pulse animation when button becomes ready
  useEffect(() => {
    if (canComplete && !isCompleted && !isSaving) {
      // Start pulsing animation
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.02,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );

      // Glow fade in
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();

      pulse.start();
      return () => pulse.stop();
    } else {
      // Reset animations
      pulseAnim.setValue(1);
      Animated.timing(glowAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
      return undefined;
    }
  }, [canComplete, isCompleted, isSaving, pulseAnim, glowAnim]);

  const handlePress = () => {
    if (canComplete && !isSaving) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {
        // Haptic feedback is optional, ignore errors
      });
      onPress();
      // Trigger navigation callback after completion
      if (onComplete) {
        // Small delay to allow save to start before navigating
        setTimeout(() => {
          onComplete();
        }, 100);
      }
    } else {
      // Provide haptic feedback when user tries to tap disabled button
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {
        // Haptic feedback is optional, ignore errors
      });
    }
  };

  const isDisabled = !canComplete || isSaving;
  const isReady = canComplete && !isCompleted && !isSaving;

  // Interpolate glow opacity for shadow effect
  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.6],
  });

  // Add extra padding to lift button above the tab bar (approx 60px on web/mobile)
  const tabBarHeight = 60;
  const bottomPadding = Math.max(insets.bottom, spacing.md) + tabBarHeight;

  return (
    <View style={[styles.stickyContainer, { paddingBottom: bottomPadding }]}>
      {/* Gradient fade effect at the top of the sticky area */}
      <LinearGradient
        colors={['transparent', 'rgba(26, 26, 46, 0.95)', '#1a1a2e']}
        style={styles.fadeGradient}
        pointerEvents="none"
      />

      <View style={styles.buttonWrapper}>
        {/* Status hint above button */}
        {!isCompleted && (
          <View style={styles.hintContainer}>
            {isReady && (
              <Text style={styles.hintReady}>✨ Ready to complete! Tap below</Text>
            )}
            {!canComplete && !isSaving && (
              <Text style={styles.hintDisabled}>
                📝 Fill in all required fields to complete
              </Text>
            )}
            {isSaving && <Text style={styles.hintSaving}>Saving your progress...</Text>}
          </View>
        )}

        {isCompleted ? (
          <LinearGradient colors={['#22c55e', '#16a34a']} style={styles.completedButton}>
            <Text style={styles.completedText}>✓ Completed</Text>
          </LinearGradient>
        ) : (
          <Animated.View
            style={[
              styles.buttonContainer,
              {
                transform: [{ scale: pulseAnim }],
              },
            ]}
          >
            {/* Glow effect behind button when ready */}
            {isReady && (
              <Animated.View
                style={[
                  styles.glowEffect,
                  {
                    opacity: glowOpacity,
                  },
                ]}
              />
            )}

            <TouchableOpacity
              style={[
                styles.button,
                isDisabled && styles.buttonDisabled,
                isReady && styles.buttonReady,
              ]}
              onPress={handlePress}
              disabled={false}
              activeOpacity={isDisabled ? 1 : 0.8}
            >
              <LinearGradient
                colors={
                  isReady
                    ? ['#22c55e', '#16a34a'] // Green when ready
                    : ['#3a3a5a', '#2a2a4a'] // Gray when disabled
                }
                style={styles.gradient}
              >
                {isSaving ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <View style={styles.content}>
                    {isReady && <Text style={styles.icon}>✓</Text>}
                    <Text style={[styles.text, isDisabled && styles.textDisabled]}>
                      {isReady ? 'Complete & Continue' : 'Complete Exercise'}
                    </Text>
                  </View>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  stickyContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  fadeGradient: {
    position: 'absolute',
    top: -30,
    left: 0,
    right: 0,
    height: 30,
  },
  buttonWrapper: {
    backgroundColor: '#1a1a2e',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  hintContainer: {
    marginBottom: spacing.xs,
  },
  buttonContainer: {
    position: 'relative',
  },
  glowEffect: {
    position: 'absolute',
    top: -8,
    left: -8,
    right: -8,
    bottom: -8,
    borderRadius: borderRadius.lg + 8,
    backgroundColor: '#22c55e',
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
  button: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.md,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonReady: {
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  gradient: {
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 18,
    marginRight: spacing.sm,
    color: colors.white,
    fontWeight: '700',
  },
  text: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: 0.5,
  },
  textDisabled: {
    opacity: 0.7,
  },
  completedButton: {
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    ...shadows.md,
  },
  completedText: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: 0.5,
  },
  hintReady: {
    fontSize: 14,
    color: '#22c55e',
    textAlign: 'center',
    fontWeight: '600',
  },
  hintDisabled: {
    fontSize: 13,
    color: '#9ca3af',
    textAlign: 'center',
    fontWeight: '500',
  },
  hintSaving: {
    fontSize: 13,
    color: '#fbbf24',
    textAlign: 'center',
    fontWeight: '500',
  },
});
