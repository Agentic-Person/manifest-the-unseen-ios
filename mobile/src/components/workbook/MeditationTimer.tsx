/**
 * MeditationTimer Component
 *
 * Circular timer with progress indicator for guided gratitude meditations.
 * Features animated progress ring, time display, and playback controls.
 *
 * Features:
 * - Circular progress indicator
 * - Duration options (5, 10, 15 minutes)
 * - Play/Pause/Reset controls
 * - Visual bell indicator for start/end
 * - Haptic feedback
 *
 * Design (from APP-DESIGN.md):
 * - Background: #1a1a2e (deep charcoal)
 * - Progress ring: #c9a227 (muted gold)
 * - Track: #252547 (elevated surface)
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Easing,
} from 'react-native';
import * as Haptics from 'expo-haptics';

// Design system colors
const DESIGN_COLORS = {
  bgPrimary: '#1a1a2e',
  bgElevated: '#252547',
  textPrimary: '#e8e8e8',
  textSecondary: '#a0a0b0',
  textTertiary: '#6b6b80',
  accentGold: '#c9a227',
  accentPurple: '#4a1a6b',
  accentGreen: '#2d5a4a',
  accentTeal: '#1a5f5f',
  border: '#3a3a5a',
};

// Timer size configuration
const TIMER_SIZE = 260;
const STROKE_WIDTH = 12;
const RADIUS = (TIMER_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// Duration options in seconds
export const DURATION_OPTIONS = [
  { label: '5 min', value: 5 * 60 },
  { label: '10 min', value: 10 * 60 },
  { label: '15 min', value: 15 * 60 },
] as const;

export type TimerState = 'idle' | 'running' | 'paused' | 'completed';

export interface MeditationTimerProps {
  /** Callback when meditation is completed */
  onComplete?: (duration: number) => void;
  /** Callback when timer state changes */
  onStateChange?: (state: TimerState) => void;
  /** Initial duration in seconds */
  initialDuration?: number;
}

/**
 * Format seconds to MM:SS display
 */
const formatTime = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * MeditationTimer Component
 */
export const MeditationTimer: React.FC<MeditationTimerProps> = ({
  onComplete,
  onStateChange,
  initialDuration = 5 * 60,
}) => {
  const [selectedDuration, setSelectedDuration] = useState(initialDuration);
  const [timeRemaining, setTimeRemaining] = useState(initialDuration);
  const [timerState, setTimerState] = useState<TimerState>('idle');
  const [showBell, setShowBell] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const bellAnimValue = useRef(new Animated.Value(0)).current;
  const pulseAnimValue = useRef(new Animated.Value(1)).current;

  /**
   * Calculate progress percentage
   */
  const progress = timerState === 'idle'
    ? 0
    : 1 - (timeRemaining / selectedDuration);

  const _strokeDashoffset = CIRCUMFERENCE * (1 - progress);

  /**
   * Update timer state and notify parent
   */
  const updateTimerState = useCallback((newState: TimerState) => {
    setTimerState(newState);
    onStateChange?.(newState);
  }, [onStateChange]);

  /**
   * Animate bell icon
   */
  const animateBell = useCallback(() => {
    setShowBell(true);
    Animated.sequence([
      Animated.timing(bellAnimValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(bellAnimValue, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(bellAnimValue, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.delay(1000),
      Animated.timing(bellAnimValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => setShowBell(false));
  }, [bellAnimValue]);

  /**
   * Start pulse animation for running state
   */
  const startPulseAnimation = useCallback(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimValue, {
          toValue: 1.05,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimValue, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnimValue]);

  /**
   * Stop pulse animation
   */
  const stopPulseAnimation = useCallback(() => {
    pulseAnimValue.stopAnimation();
    pulseAnimValue.setValue(1);
  }, [pulseAnimValue]);

  /**
   * Handle timer completion
   */
  const handleCompletion = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    stopPulseAnimation();
    updateTimerState('completed');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    animateBell();
    onComplete?.(selectedDuration);
    console.log('Meditation completed:', { duration: selectedDuration });
  }, [selectedDuration, onComplete, updateTimerState, animateBell, stopPulseAnimation]);

  /**
   * Timer tick effect
   */
  useEffect(() => {
    if (timerState === 'running' && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleCompletion();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [timerState, handleCompletion]);

  /**
   * Handle start button
   */
  const handleStart = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    animateBell(); // Bell at start
    startPulseAnimation();
    updateTimerState('running');
    console.log('Meditation started:', { duration: selectedDuration });
  };

  /**
   * Handle pause button
   */
  const handlePause = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    stopPulseAnimation();
    updateTimerState('paused');
  };

  /**
   * Handle resume button
   */
  const handleResume = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    startPulseAnimation();
    updateTimerState('running');
  };

  /**
   * Handle reset button
   */
  const handleReset = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    stopPulseAnimation();
    setTimeRemaining(selectedDuration);
    updateTimerState('idle');
  };

  /**
   * Handle duration selection
   */
  const handleDurationSelect = (duration: number) => {
    if (timerState !== 'idle') return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedDuration(duration);
    setTimeRemaining(duration);
  };

  /**
   * Get state message
   */
  const getStateMessage = (): string => {
    switch (timerState) {
      case 'idle':
        return 'Ready to begin';
      case 'running':
        return 'Focus on gratitude';
      case 'paused':
        return 'Paused';
      case 'completed':
        return 'Meditation complete';
    }
  };

  return (
    <View style={styles.container}>
      {/* Duration Selector */}
      <View style={styles.durationSelector}>
        {DURATION_OPTIONS.map((option) => (
          <Pressable
            key={option.value}
            style={[
              styles.durationOption,
              selectedDuration === option.value && styles.durationOptionSelected,
              timerState !== 'idle' && styles.durationOptionDisabled,
            ]}
            onPress={() => handleDurationSelect(option.value)}
            disabled={timerState !== 'idle'}
            accessibilityRole="button"
            accessibilityLabel={`Select ${option.label} meditation`}
            accessibilityState={{ selected: selectedDuration === option.value }}
          >
            <Text
              style={[
                styles.durationText,
                selectedDuration === option.value && styles.durationTextSelected,
              ]}
            >
              {option.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Timer Display */}
      <Animated.View
        style={[
          styles.timerContainer,
          { transform: [{ scale: pulseAnimValue }] },
        ]}
      >
        {/* SVG-like Progress Ring using Views */}
        <View style={styles.progressRing}>
          {/* Background Track */}
          <View style={styles.trackCircle} />

          {/* Progress Indicator */}
          <View
            style={[
              styles.progressCircle,
              {
                transform: [{ rotate: '-90deg' }],
              },
            ]}
          >
            <View
              style={[
                styles.progressArc,
                {
                  borderColor: DESIGN_COLORS.accentGold,
                  borderTopColor: progress > 0.25 ? DESIGN_COLORS.accentGold : 'transparent',
                  borderRightColor: progress > 0.5 ? DESIGN_COLORS.accentGold : 'transparent',
                  borderBottomColor: progress > 0.75 ? DESIGN_COLORS.accentGold : 'transparent',
                  borderLeftColor: progress > 0 ? DESIGN_COLORS.accentGold : 'transparent',
                  transform: [{ rotate: `${progress * 360}deg` }],
                },
              ]}
            />
          </View>

          {/* Center Content */}
          <View style={styles.timerCenter}>
            <Text style={styles.timeDisplay}>{formatTime(timeRemaining)}</Text>
            <Text style={styles.stateMessage}>{getStateMessage()}</Text>
          </View>
        </View>

        {/* Bell Indicator */}
        {showBell && (
          <Animated.View
            style={[
              styles.bellIndicator,
              {
                opacity: bellAnimValue,
                transform: [{ scale: bellAnimValue }],
              },
            ]}
          >
            <Text style={styles.bellIcon}>{'\uD83D\uDD14'}</Text>
          </Animated.View>
        )}
      </Animated.View>

      {/* Control Buttons */}
      <View style={styles.controls}>
        {timerState === 'idle' && (
          <Pressable
            style={styles.startButton}
            onPress={handleStart}
            accessibilityRole="button"
            accessibilityLabel="Start meditation"
          >
            <Text style={styles.startButtonIcon}>{'\u25B6'}</Text>
            <Text style={styles.startButtonText}>Begin</Text>
          </Pressable>
        )}

        {timerState === 'running' && (
          <View style={styles.runningControls}>
            <Pressable
              style={styles.pauseButton}
              onPress={handlePause}
              accessibilityRole="button"
              accessibilityLabel="Pause meditation"
            >
              <Text style={styles.controlButtonIcon}>{'\u23F8'}</Text>
            </Pressable>
            <Pressable
              style={styles.stopButton}
              onPress={handleReset}
              accessibilityRole="button"
              accessibilityLabel="Stop meditation"
            >
              <Text style={styles.controlButtonIcon}>{'\u23F9'}</Text>
            </Pressable>
          </View>
        )}

        {timerState === 'paused' && (
          <View style={styles.runningControls}>
            <Pressable
              style={styles.resumeButton}
              onPress={handleResume}
              accessibilityRole="button"
              accessibilityLabel="Resume meditation"
            >
              <Text style={styles.controlButtonIcon}>{'\u25B6'}</Text>
            </Pressable>
            <Pressable
              style={styles.stopButton}
              onPress={handleReset}
              accessibilityRole="button"
              accessibilityLabel="Stop meditation"
            >
              <Text style={styles.controlButtonIcon}>{'\u23F9'}</Text>
            </Pressable>
          </View>
        )}

        {timerState === 'completed' && (
          <Pressable
            style={styles.restartButton}
            onPress={handleReset}
            accessibilityRole="button"
            accessibilityLabel="Start new meditation"
          >
            <Text style={styles.restartButtonIcon}>{'\u21BB'}</Text>
            <Text style={styles.restartButtonText}>Meditate Again</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 20,
  },

  // Duration Selector
  durationSelector: {
    flexDirection: 'row',
    marginBottom: 32,
    backgroundColor: DESIGN_COLORS.bgElevated,
    borderRadius: 12,
    padding: 4,
  },
  durationOption: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  durationOptionSelected: {
    backgroundColor: DESIGN_COLORS.accentPurple,
  },
  durationOptionDisabled: {
    opacity: 0.5,
  },
  durationText: {
    fontSize: 14,
    fontWeight: '600',
    color: DESIGN_COLORS.textSecondary,
  },
  durationTextSelected: {
    color: DESIGN_COLORS.textPrimary,
  },

  // Timer Container
  timerContainer: {
    width: TIMER_SIZE,
    height: TIMER_SIZE,
    marginBottom: 32,
    position: 'relative',
  },

  // Progress Ring
  progressRing: {
    width: TIMER_SIZE,
    height: TIMER_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  trackCircle: {
    position: 'absolute',
    width: TIMER_SIZE,
    height: TIMER_SIZE,
    borderRadius: TIMER_SIZE / 2,
    borderWidth: STROKE_WIDTH,
    borderColor: DESIGN_COLORS.bgElevated,
  },
  progressCircle: {
    position: 'absolute',
    width: TIMER_SIZE,
    height: TIMER_SIZE,
  },
  progressArc: {
    width: TIMER_SIZE,
    height: TIMER_SIZE,
    borderRadius: TIMER_SIZE / 2,
    borderWidth: STROKE_WIDTH,
  },

  // Timer Center
  timerCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeDisplay: {
    fontSize: 52,
    fontWeight: '300',
    color: DESIGN_COLORS.textPrimary,
    fontVariant: ['tabular-nums'],
    letterSpacing: 2,
  },
  stateMessage: {
    fontSize: 14,
    color: DESIGN_COLORS.textSecondary,
    marginTop: 4,
  },

  // Bell Indicator
  bellIndicator: {
    position: 'absolute',
    top: -20,
    alignSelf: 'center',
    backgroundColor: DESIGN_COLORS.accentGold,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: DESIGN_COLORS.accentGold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  bellIcon: {
    fontSize: 22,
  },

  // Controls
  controls: {
    alignItems: 'center',
    minHeight: 60,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DESIGN_COLORS.accentGold,
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
    shadowColor: DESIGN_COLORS.accentGold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  startButtonIcon: {
    fontSize: 16,
    color: DESIGN_COLORS.bgPrimary,
    marginRight: 8,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: DESIGN_COLORS.bgPrimary,
  },
  runningControls: {
    flexDirection: 'row',
    gap: 20,
  },
  pauseButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: DESIGN_COLORS.accentTeal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resumeButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: DESIGN_COLORS.accentGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: DESIGN_COLORS.bgElevated,
    borderWidth: 2,
    borderColor: DESIGN_COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlButtonIcon: {
    fontSize: 24,
    color: DESIGN_COLORS.textPrimary,
  },
  restartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DESIGN_COLORS.accentPurple,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
  },
  restartButtonIcon: {
    fontSize: 18,
    color: DESIGN_COLORS.textPrimary,
    marginRight: 8,
  },
  restartButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: DESIGN_COLORS.textPrimary,
  },
});

export default MeditationTimer;
