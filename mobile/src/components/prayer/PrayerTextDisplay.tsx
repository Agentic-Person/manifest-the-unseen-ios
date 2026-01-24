/**
 * Prayer Text Display Component
 *
 * Displays synchronized prayer text line-by-line as the audio plays.
 * Shows one line at a time with smooth fade transitions.
 * Designed for users to read and speak prayers aloud with the narrator.
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';

import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { useCurrentPrayerLine } from '../../hooks/usePrayerTiming';
import type { PrayerLineTiming } from '../../types/guru';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface PrayerTextDisplayProps {
  /** Full prayer text content with lines separated by \n */
  prayerContent: string;
  /** Total audio duration in milliseconds */
  audioDurationMs: number;
  /** Current playback position in milliseconds */
  currentPositionMs: number;
  /** Whether audio is currently playing */
  isPlaying: boolean;
  /** Pre-generated line timings from Whisper (for accurate sync) */
  lineTimings?: PrayerLineTiming[] | null;
}

/**
 * PrayerTextDisplay
 *
 * Shows the current line of prayer text synchronized with audio playback.
 * Features smooth fade transitions between lines and progress indicators.
 */
export function PrayerTextDisplay({
  prayerContent,
  audioDurationMs,
  currentPositionMs,
  isPlaying,
  lineTimings,
}: PrayerTextDisplayProps): React.JSX.Element {
  // Get current line based on playback position
  // Uses Whisper-generated timestamps when available for accurate sync
  const { currentLine, totalLines, currentIndex } = useCurrentPrayerLine(
    prayerContent,
    audioDurationMs,
    currentPositionMs,
    lineTimings
  );

  // Animation values - use two animated values for cross-fade effect
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const prevLineIndexRef = useRef<number>(-1);
  const prevTextRef = useRef<string>('');

  // Smooth pulse animation when line changes (no flicker)
  useEffect(() => {
    const lineIndex = currentLine?.index ?? -1;

    // Only animate if the line actually changed
    if (lineIndex !== prevLineIndexRef.current && lineIndex >= 0) {
      // Store previous text for potential cross-fade
      prevTextRef.current = currentLine?.text || '';

      // Simple fade-in from slightly dim to full brightness
      // This avoids the flicker of fade-out-then-in
      fadeAnim.setValue(0.7);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start();

      prevLineIndexRef.current = lineIndex;
    }
  }, [currentLine?.index, currentLine?.text, fadeAnim]);

  // Render progress dots
  const renderProgressDots = () => {
    if (totalLines <= 1) {
      return null;
    }

    return (
      <View style={styles.progressDots}>
        {Array.from({ length: totalLines }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === currentIndex && styles.dotActive,
              index < currentIndex && styles.dotCompleted,
            ]}
          />
        ))}
      </View>
    );
  };

  // Show waiting state before first line
  if (!currentLine && currentPositionMs < 100) {
    return (
      <View style={styles.container}>
        <Text style={styles.waitingText}>
          {isPlaying ? 'Listen and follow along...' : 'Press play to begin'}
        </Text>
        {renderProgressDots()}
      </View>
    );
  }

  // Show completion state after last line
  if (!currentLine && currentIndex === totalLines - 1) {
    return (
      <View style={styles.container}>
        <Text style={styles.completionText}>Amen</Text>
        {renderProgressDots()}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Current prayer line with fade animation */}
      <Animated.View style={[styles.textContainer, { opacity: fadeAnim }]}>
        <Text style={styles.prayerText}>{currentLine?.text || ''}</Text>
      </Animated.View>

      {/* Line counter */}
      <Text style={styles.lineCounter}>
        {currentIndex >= 0 ? currentIndex + 1 : 0} / {totalLines}
      </Text>

      {/* Progress dots */}
      {renderProgressDots()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing['2xl'],
  },

  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: SCREEN_WIDTH - spacing.xl * 2,
  },

  prayerText: {
    fontSize: 28,
    fontWeight: '300',
    color: colors.text.primary, // #F5F0E6 - Enlightened White
    textAlign: 'center',
    lineHeight: 42,
    letterSpacing: 0.5,
    // Subtle gold glow effect
    textShadowColor: 'rgba(196, 160, 82, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },

  waitingText: {
    fontSize: 20,
    fontWeight: '300',
    color: colors.text.secondary, // #A09080 - Muted Wisdom
    textAlign: 'center',
    fontStyle: 'italic',
  },

  completionText: {
    fontSize: 32,
    fontWeight: '400',
    color: colors.brand.gold, // #C4A052 - Aged Gold
    textAlign: 'center',
    letterSpacing: 2,
    // Golden glow
    textShadowColor: 'rgba(196, 160, 82, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },

  lineCounter: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.text.tertiary, // #6B6B6B
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },

  progressDots: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.xl,
    maxWidth: SCREEN_WIDTH - spacing.xl * 2,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border.default, // Subtle gold border
  },

  dotActive: {
    backgroundColor: colors.brand.gold, // #C4A052 - Aged Gold
    // Glow effect for active dot
    shadowColor: colors.brand.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 3,
  },

  dotCompleted: {
    backgroundColor: colors.brand.bronze, // #8B6914 - Burnished Bronze
  },
});

export default PrayerTextDisplay;
