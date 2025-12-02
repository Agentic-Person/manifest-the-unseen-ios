/**
 * BreathingAnimation Component
 *
 * Animated breathing guide with expanding/contracting circle.
 * Supports multiple breathing patterns (5-2-5-2 default for Deep Calm).
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Pressable,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, spacing, shadows, borderRadius } from '../../theme';
import {
  BREATHING_PATTERNS,
  BREATHING_PHASE_LABELS,
  type BreathingPattern,
  type BreathingPhase,
} from '../../types/meditation';

// Animation sizing
const MIN_SIZE = 120;
const MAX_SIZE = 220;
const CONTAINER_SIZE = 280;

export type BreathingPatternType = keyof typeof BREATHING_PATTERNS;

interface BreathingAnimationProps {
  /** Breathing pattern to use */
  pattern?: BreathingPatternType;
  /** Custom pattern timing */
  customPattern?: BreathingPattern;
  /** Callback when cycle completes */
  onCycleComplete?: (cycleCount: number) => void;
  /** Auto-start animation */
  autoStart?: boolean;
  /** Enable haptic feedback */
  hapticEnabled?: boolean;
}

type AnimationState = 'idle' | 'running' | 'paused';

/**
 * BreathingAnimation Component
 */
export const BreathingAnimation: React.FC<BreathingAnimationProps> = ({
  pattern = 'deepCalm',
  customPattern,
  onCycleComplete,
  autoStart = false,
  hapticEnabled = true,
}) => {
  const breathingPattern = customPattern || BREATHING_PATTERNS[pattern];

  const [animationState, setAnimationState] = useState<AnimationState>(
    autoStart ? 'running' : 'idle'
  );
  const [currentPhase, setCurrentPhase] = useState<BreathingPhase>('inhale');
  const [cycleCount, setCycleCount] = useState(0);
  const [phaseTimeRemaining, setPhaseTimeRemaining] = useState(breathingPattern.inhale);

  // Animation values
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const phaseTimerRef = useRef<NodeJS.Timeout | null>(null);
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  /**
   * Get phase duration in seconds
   */
  const getPhaseDuration = useCallback(
    (phase: BreathingPhase): number => {
      switch (phase) {
        case 'inhale':
          return breathingPattern.inhale;
        case 'holdIn':
          return breathingPattern.holdIn;
        case 'exhale':
          return breathingPattern.exhale;
        case 'holdOut':
          return breathingPattern.holdOut;
      }
    },
    [breathingPattern]
  );

  /**
   * Get next phase
   */
  const getNextPhase = useCallback(
    (current: BreathingPhase): BreathingPhase => {
      switch (current) {
        case 'inhale':
          return breathingPattern.holdIn > 0 ? 'holdIn' : 'exhale';
        case 'holdIn':
          return 'exhale';
        case 'exhale':
          return breathingPattern.holdOut > 0 ? 'holdOut' : 'inhale';
        case 'holdOut':
          return 'inhale';
      }
    },
    [breathingPattern]
  );

  /**
   * Animate a single phase
   */
  const animatePhase = useCallback(
    (phase: BreathingPhase) => {
      const duration = getPhaseDuration(phase) * 1000;

      if (duration === 0) {
        // Skip phases with 0 duration
        const nextPhase = getNextPhase(phase);
        setCurrentPhase(nextPhase);
        setPhaseTimeRemaining(getPhaseDuration(nextPhase));
        return;
      }

      setCurrentPhase(phase);
      setPhaseTimeRemaining(getPhaseDuration(phase));

      // Haptic feedback at phase start
      if (hapticEnabled) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }

      // Determine target scale
      let targetScale: number;
      switch (phase) {
        case 'inhale':
          targetScale = 1; // Expand to max
          break;
        case 'holdIn':
          targetScale = 1; // Stay expanded
          break;
        case 'exhale':
          targetScale = 0; // Contract to min
          break;
        case 'holdOut':
          targetScale = 0; // Stay contracted
          break;
      }

      // Run scale animation
      animationRef.current = Animated.timing(scaleAnim, {
        toValue: targetScale,
        duration: duration,
        easing:
          phase === 'inhale' || phase === 'exhale'
            ? Easing.inOut(Easing.ease)
            : Easing.linear,
        useNativeDriver: true,
      });

      // Glow animation for holds
      if (phase === 'holdIn' || phase === 'holdOut') {
        Animated.loop(
          Animated.sequence([
            Animated.timing(glowAnim, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(glowAnim, {
              toValue: 0.5,
              duration: 500,
              useNativeDriver: true,
            }),
          ])
        ).start();
      } else {
        glowAnim.setValue(0);
      }

      animationRef.current.start(({ finished }) => {
        if (finished) {
          const nextPhase = getNextPhase(phase);

          // Check if completing a cycle
          if (phase === 'exhale' && breathingPattern.holdOut === 0) {
            const newCycleCount = cycleCount + 1;
            setCycleCount(newCycleCount);
            onCycleComplete?.(newCycleCount);
          } else if (phase === 'holdOut') {
            const newCycleCount = cycleCount + 1;
            setCycleCount(newCycleCount);
            onCycleComplete?.(newCycleCount);
          }

          animatePhase(nextPhase);
        }
      });

      // Countdown timer
      if (phaseTimerRef.current) {
        clearInterval(phaseTimerRef.current);
      }
      phaseTimerRef.current = setInterval(() => {
        setPhaseTimeRemaining((prev) => Math.max(0, prev - 1));
      }, 1000);
    },
    [
      getPhaseDuration,
      getNextPhase,
      hapticEnabled,
      scaleAnim,
      glowAnim,
      cycleCount,
      onCycleComplete,
      breathingPattern.holdOut,
    ]
  );

  /**
   * Start animation
   */
  const start = useCallback(() => {
    setAnimationState('running');
    animatePhase('inhale');
  }, [animatePhase]);

  /**
   * Pause animation
   */
  const pause = useCallback(() => {
    setAnimationState('paused');
    animationRef.current?.stop();
    if (phaseTimerRef.current) {
      clearInterval(phaseTimerRef.current);
    }
    glowAnim.stopAnimation();
  }, [glowAnim]);

  /**
   * Reset animation
   */
  const reset = useCallback(() => {
    setAnimationState('idle');
    animationRef.current?.stop();
    if (phaseTimerRef.current) {
      clearInterval(phaseTimerRef.current);
    }
    scaleAnim.setValue(0);
    glowAnim.setValue(0);
    setCurrentPhase('inhale');
    setCycleCount(0);
    setPhaseTimeRemaining(breathingPattern.inhale);
  }, [scaleAnim, glowAnim, breathingPattern.inhale]);

  /**
   * Handle play/pause toggle
   */
  const handleToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (animationState === 'running') {
      pause();
    } else {
      start();
    }
  };

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      if (phaseTimerRef.current) {
        clearInterval(phaseTimerRef.current);
      }
      animationRef.current?.stop();
    };
  }, []);

  /**
   * Auto-start if enabled
   */
  useEffect(() => {
    if (autoStart && animationState === 'idle') {
      start();
    }
  }, [autoStart, animationState, start]);

  // Interpolate scale for circle size
  const circleScale = scaleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [MIN_SIZE / MAX_SIZE, 1],
  });

  // Interpolate glow opacity
  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.6],
  });

  return (
    <View style={styles.container}>
      {/* Breathing Circle */}
      <View style={styles.circleContainer}>
        {/* Glow effect */}
        <Animated.View
          style={[
            styles.glow,
            {
              opacity: glowOpacity,
              transform: [{ scale: circleScale }],
            },
          ]}
        />

        {/* Main circle */}
        <Animated.View
          style={[
            styles.circle,
            {
              transform: [{ scale: circleScale }],
            },
          ]}
        >
          <Text style={styles.phaseText}>
            {BREATHING_PHASE_LABELS[currentPhase]}
          </Text>
          {animationState === 'running' && (
            <Text style={styles.countdownText}>{phaseTimeRemaining}</Text>
          )}
        </Animated.View>
      </View>

      {/* Cycle Counter */}
      <View style={styles.statsContainer}>
        <Text style={styles.cycleText}>
          {cycleCount} {cycleCount === 1 ? 'cycle' : 'cycles'}
        </Text>
        <Text style={styles.patternText}>
          {breathingPattern.inhale}-{breathingPattern.holdIn}-
          {breathingPattern.exhale}-{breathingPattern.holdOut}
        </Text>
      </View>

      {/* Controls */}
      <Pressable
        style={[
          styles.controlButton,
          animationState === 'running' && styles.controlButtonActive,
        ]}
        onPress={handleToggle}
        accessibilityRole="button"
        accessibilityLabel={animationState === 'running' ? 'Pause breathing' : 'Start breathing'}
      >
        <Text style={styles.controlButtonText}>
          {animationState === 'running' ? 'Pause' : 'Start'}
        </Text>
      </Pressable>

      {animationState !== 'idle' && (
        <Pressable
          style={styles.resetButton}
          onPress={reset}
          accessibilityRole="button"
          accessibilityLabel="Reset breathing exercise"
        >
          <Text style={styles.resetButtonText}>Reset</Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  circleContainer: {
    width: CONTAINER_SIZE,
    height: CONTAINER_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  glow: {
    position: 'absolute',
    width: MAX_SIZE + 40,
    height: MAX_SIZE + 40,
    borderRadius: (MAX_SIZE + 40) / 2,
    backgroundColor: colors.dark.accentTeal,
  },
  circle: {
    width: MAX_SIZE,
    height: MAX_SIZE,
    borderRadius: MAX_SIZE / 2,
    backgroundColor: colors.dark.accentTeal,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
  },
  phaseText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.primary,
    textAlign: 'center',
  },
  countdownText: {
    fontSize: 48,
    fontWeight: '300',
    color: colors.text.primary,
    fontVariant: ['tabular-nums'],
    marginTop: spacing.xs,
  },
  statsContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  cycleText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  patternText: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  controlButton: {
    backgroundColor: colors.dark.accentTeal,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl * 2,
    borderRadius: borderRadius.full,
    ...shadows.md,
  },
  controlButtonActive: {
    backgroundColor: colors.background.elevated,
    borderWidth: 2,
    borderColor: colors.dark.accentTeal,
  },
  controlButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  resetButton: {
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  resetButtonText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
});

export default BreathingAnimation;
