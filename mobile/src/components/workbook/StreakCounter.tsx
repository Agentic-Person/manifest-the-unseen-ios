/**
 * StreakCounter Component
 *
 * Visual streak display with flame icon for tracking consistency.
 * Shows current streak, best streak, and provides motivational feedback.
 *
 * Design: Dark spiritual theme with warm, encouraging colors
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';

// Design system colors from APP-DESIGN.md
const DESIGN_COLORS = {
  bgPrimary: '#1a1a2e',
  bgSecondary: '#16213e',
  bgElevated: '#252547',
  textPrimary: '#e8e8e8',
  textSecondary: '#a0a0b0',
  textTertiary: '#6b6b80',
  accentPurple: '#4a1a6b',
  accentGold: '#c9a227',
  accentTeal: '#1a5f5f',
  accentGreen: '#2d5a4a',
  accentRose: '#8b3a5f',
  accentAmber: '#8b6914',
  border: '#3a3a5a',
};

/**
 * Streak thresholds for visual feedback
 */
const STREAK_THRESHOLDS = {
  starting: 0,      // 0 days
  building: 3,      // 3+ days
  growing: 7,       // 7+ days (1 week)
  strong: 14,       // 14+ days (2 weeks)
  powerful: 30,     // 30+ days (1 month)
  legendary: 100,   // 100+ days
};

/**
 * Get streak level and colors based on current streak
 */
const getStreakLevel = (days: number): {
  level: string;
  color: string;
  glowColor: string;
  message: string;
  flameCount: number;
} => {
  if (days >= STREAK_THRESHOLDS.legendary) {
    return {
      level: 'Legendary',
      color: '#FFD700',
      glowColor: 'rgba(255, 215, 0, 0.4)',
      message: 'You are unstoppable!',
      flameCount: 5,
    };
  }
  if (days >= STREAK_THRESHOLDS.powerful) {
    return {
      level: 'Powerful',
      color: DESIGN_COLORS.accentGold,
      glowColor: 'rgba(201, 162, 39, 0.3)',
      message: 'Incredible dedication!',
      flameCount: 4,
    };
  }
  if (days >= STREAK_THRESHOLDS.strong) {
    return {
      level: 'Strong',
      color: '#E87D0D',
      glowColor: 'rgba(232, 125, 13, 0.3)',
      message: 'Keep the momentum!',
      flameCount: 3,
    };
  }
  if (days >= STREAK_THRESHOLDS.growing) {
    return {
      level: 'Growing',
      color: '#F59E0B',
      glowColor: 'rgba(245, 158, 11, 0.25)',
      message: 'One week strong!',
      flameCount: 2,
    };
  }
  if (days >= STREAK_THRESHOLDS.building) {
    return {
      level: 'Building',
      color: DESIGN_COLORS.accentAmber,
      glowColor: 'rgba(139, 105, 20, 0.2)',
      message: 'Great start!',
      flameCount: 1,
    };
  }
  return {
    level: 'Starting',
    color: DESIGN_COLORS.textSecondary,
    glowColor: 'transparent',
    message: 'Begin your journey today',
    flameCount: 0,
  };
};

/**
 * StreakCounter component props
 */
export interface StreakCounterProps {
  currentStreak: number;
  bestStreak: number;
  routineType?: 'morning' | 'evening' | 'overall';
  showBestStreak?: boolean;
  size?: 'compact' | 'normal' | 'large';
  animated?: boolean;
}

/**
 * StreakCounter Component
 */
const StreakCounter: React.FC<StreakCounterProps> = ({
  currentStreak,
  bestStreak,
  routineType = 'overall',
  showBestStreak = true,
  size = 'normal',
  animated = true,
}) => {
  const streakInfo = getStreakLevel(currentStreak);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.5)).current;

  /**
   * Pulse animation for flames
   */
  useEffect(() => {
    if (!animated || currentStreak === 0) return;

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );

    const glow = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.5,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );

    pulse.start();
    glow.start();

    return () => {
      pulse.stop();
      glow.stop();
    };
  }, [animated, currentStreak, pulseAnim, glowAnim]);

  // Size configurations
  const sizeConfig = {
    compact: {
      containerPadding: 12,
      flameSize: 28,
      numberSize: 24,
      labelSize: 10,
      messageSize: 11,
    },
    normal: {
      containerPadding: 16,
      flameSize: 40,
      numberSize: 36,
      labelSize: 12,
      messageSize: 13,
    },
    large: {
      containerPadding: 24,
      flameSize: 56,
      numberSize: 48,
      labelSize: 14,
      messageSize: 15,
    },
  };

  const config = sizeConfig[size];

  // Routine type label
  const routineLabel = {
    morning: 'Morning Routine',
    evening: 'Evening Routine',
    overall: 'Self-Care Streak',
  };

  // Render flames based on streak level
  const renderFlames = () => {
    if (streakInfo.flameCount === 0) {
      return (
        <Text style={[styles.flameEmpty, { fontSize: config.flameSize }]}>
          {'\u{1F525}'}
        </Text>
      );
    }

    return (
      <View style={styles.flameContainer}>
        {Array.from({ length: streakInfo.flameCount }).map((_, index) => (
          <Animated.Text
            key={index}
            style={[
              styles.flame,
              {
                fontSize: config.flameSize - index * 4,
                transform: [{ scale: index === 0 ? pulseAnim : 1 }],
                marginLeft: index > 0 ? -config.flameSize * 0.3 : 0,
                zIndex: streakInfo.flameCount - index,
              },
            ]}
          >
            {'\u{1F525}'}
          </Animated.Text>
        ))}
      </View>
    );
  };

  return (
    <View
      style={[
        styles.container,
        { padding: config.containerPadding },
      ]}
      testID="streak-counter"
      accessibilityRole="text"
      accessibilityLabel={`${routineLabel[routineType]}: ${currentStreak} day streak, ${streakInfo.level} level. ${streakInfo.message}`}
    >
      {/* Glow Effect Background */}
      {currentStreak > 0 && (
        <Animated.View
          style={[
            styles.glowBackground,
            {
              backgroundColor: streakInfo.glowColor,
              opacity: glowAnim,
            },
          ]}
        />
      )}

      {/* Header Label */}
      <Text style={[styles.routineLabel, { fontSize: config.labelSize }]}>
        {routineLabel[routineType]}
      </Text>

      {/* Main Streak Display */}
      <View style={styles.mainDisplay}>
        {/* Flames */}
        {renderFlames()}

        {/* Streak Number */}
        <View style={styles.numberContainer}>
          <Text
            style={[
              styles.streakNumber,
              { fontSize: config.numberSize, color: streakInfo.color },
            ]}
          >
            {currentStreak}
          </Text>
          <Text style={[styles.daysLabel, { fontSize: config.labelSize }]}>
            {currentStreak === 1 ? 'day' : 'days'}
          </Text>
        </View>
      </View>

      {/* Streak Level Badge */}
      <View
        style={[styles.levelBadge, { borderColor: streakInfo.color }]}
        accessibilityLabel={`Level: ${streakInfo.level}`}
      >
        <Text style={[styles.levelText, { color: streakInfo.color }]}>
          {streakInfo.level}
        </Text>
      </View>

      {/* Motivational Message */}
      <Text style={[styles.message, { fontSize: config.messageSize }]}>
        {streakInfo.message}
      </Text>

      {/* Best Streak */}
      {showBestStreak && (
        <View style={styles.bestStreakContainer}>
          <Text style={[styles.bestStreakLabel, { fontSize: config.labelSize - 2 }]}>
            Best Streak
          </Text>
          <Text style={[styles.bestStreakValue, { fontSize: config.labelSize }]}>
            {'\u{1F3C6}'} {bestStreak} days
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: DESIGN_COLORS.bgElevated,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },

  // Glow background
  glowBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
  },

  // Routine label
  routineLabel: {
    fontWeight: '600',
    color: DESIGN_COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 12,
  },

  // Main display
  mainDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  // Flames
  flameContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginRight: 12,
  },
  flame: {
    textShadowColor: 'rgba(255, 100, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  flameEmpty: {
    opacity: 0.3,
    marginRight: 12,
  },

  // Number
  numberContainer: {
    alignItems: 'center',
  },
  streakNumber: {
    fontWeight: '700',
    letterSpacing: -1,
  },
  daysLabel: {
    color: DESIGN_COLORS.textSecondary,
    fontWeight: '500',
    marginTop: -4,
  },

  // Level badge
  levelBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 8,
  },
  levelText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  // Message
  message: {
    color: DESIGN_COLORS.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 12,
  },

  // Best streak
  bestStreakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: DESIGN_COLORS.border,
    width: '100%',
    justifyContent: 'center',
  },
  bestStreakLabel: {
    color: DESIGN_COLORS.textTertiary,
    fontWeight: '500',
  },
  bestStreakValue: {
    color: DESIGN_COLORS.accentGold,
    fontWeight: '600',
  },
});

export default StreakCounter;

export { STREAK_THRESHOLDS, getStreakLevel };
