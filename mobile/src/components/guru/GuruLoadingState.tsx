/**
 * GuruLoadingState Component
 *
 * Displayed while connecting with Guru or loading analysis.
 * Shows calming animation with encouraging message.
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../../theme';

interface GuruLoadingStateProps {
  message?: string;
}

/**
 * Guru Loading State Component
 *
 * Shows a calming loading animation while Guru is analyzing or connecting.
 * Includes animated dots and pulsing icon.
 *
 * @example
 * ```tsx
 * {isLoading && <GuruLoadingState message="Analyzing your journey..." />}
 * ```
 */
export const GuruLoadingState: React.FC<GuruLoadingStateProps> = ({
  message = 'Connecting with your Guru...',
}) => {
  // Animated values
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const dot1Opacity = useRef(new Animated.Value(0)).current;
  const dot2Opacity = useRef(new Animated.Value(0)).current;
  const dot3Opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pulsing animation for icon
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
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

    // Animated dots sequence
    const dotsAnimation = Animated.loop(
      Animated.sequence([
        // Dot 1
        Animated.timing(dot1Opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        // Dot 2
        Animated.timing(dot2Opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        // Dot 3
        Animated.timing(dot3Opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        // Pause
        Animated.delay(300),
        // Reset all
        Animated.parallel([
          Animated.timing(dot1Opacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(dot2Opacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(dot3Opacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
        // Pause before loop
        Animated.delay(300),
      ])
    );

    pulseAnimation.start();
    dotsAnimation.start();

    return () => {
      pulseAnimation.stop();
      dotsAnimation.stop();
    };
  }, [pulseAnim, dot1Opacity, dot2Opacity, dot3Opacity]);

  return (
    <View style={styles.container}>
      {/* Pulsing Icon */}
      <Animated.View
        style={[
          styles.iconContainer,
          {
            transform: [{ scale: pulseAnim }],
          },
        ]}
      >
        <Ionicons name="person-outline" size={40} color={colors.dark.accentGold} />
      </Animated.View>

      {/* Loading Message */}
      <View style={styles.messageContainer}>
        <Text style={styles.message}>{message}</Text>
        <View style={styles.dotsContainer}>
          <Animated.View style={[styles.dot, { opacity: dot1Opacity }]} />
          <Animated.View style={[styles.dot, { opacity: dot2Opacity }]} />
          <Animated.View style={[styles.dot, { opacity: dot3Opacity }]} />
        </View>
      </View>

      {/* Subtle hint */}
      <Text style={styles.hint}>
        Your Guru is reviewing your unique journey
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${colors.dark.accentGold}20`,
    borderWidth: 2,
    borderColor: colors.dark.accentGold,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  message: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginLeft: spacing.xs,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.dark.accentGold,
  },
  hint: {
    fontSize: 14,
    color: colors.text.secondary,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});

export default GuruLoadingState;
