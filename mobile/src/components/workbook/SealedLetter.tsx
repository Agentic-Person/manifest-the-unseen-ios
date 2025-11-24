/**
 * SealedLetter
 *
 * Visual envelope component for the Future Self Letter feature.
 * Shows a sealed envelope that can be "opened" on a future date.
 *
 * Design (from APP-DESIGN.md):
 * - Background: #252547 (elevated)
 * - Accent gold: #c9a227 (seal/stamp)
 * - Deep purple: #4a1a6b (envelope accents)
 * - Dark spiritual theme
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  Animated,
} from 'react-native';
import * as Haptics from 'expo-haptics';

// Design system colors
const DESIGN_COLORS = {
  bgPrimary: '#1a1a2e',
  bgElevated: '#252547',
  textPrimary: '#e8e8e8',
  textSecondary: '#a0a0b0',
  textTertiary: '#6b6b80',
  accentPurple: '#4a1a6b',
  accentGold: '#c9a227',
  accentTeal: '#1a5f5f',
  border: '#3a3a5a',
};

export interface SealedLetterProps {
  isSealed: boolean;
  openDate: Date;
  letterContent?: string;
  createdDate: Date;
  onOpen?: () => void;
  onPreview?: () => void;
}

/**
 * Calculate time remaining until open date
 */
const getTimeRemaining = (openDate: Date): { days: number; hours: number; canOpen: boolean } => {
  const now = new Date();
  const diff = openDate.getTime() - now.getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, canOpen: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  return { days, hours, canOpen: false };
};

/**
 * Format date for display
 */
const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * SealedLetter Component
 */
export const SealedLetter: React.FC<SealedLetterProps> = ({
  isSealed,
  openDate,
  letterContent,
  createdDate,
  onOpen,
  onPreview,
}) => {
  const [timeRemaining, setTimeRemaining] = useState(getTimeRemaining(openDate));
  const flapAnimation = useRef(new Animated.Value(isSealed ? 0 : 1)).current;
  const pulseAnimation = useRef(new Animated.Value(1)).current;

  // Update countdown every hour
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(getTimeRemaining(openDate));
    }, 1000 * 60 * 60); // Update every hour

    return () => clearInterval(interval);
  }, [openDate]);

  // Pulse animation for ready-to-open state
  useEffect(() => {
    if (timeRemaining.canOpen && isSealed) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnimation, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnimation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => {
        pulse.stop();
        return;
      };
    }
    return;
  }, [timeRemaining.canOpen, isSealed, pulseAnimation]);

  const handleOpen = () => {
    if (!timeRemaining.canOpen) return;

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Animate envelope opening
    Animated.timing(flapAnimation, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start(() => {
      onOpen?.();
    });
  };

  const handleSealedTap = () => {
    if (!timeRemaining.canOpen) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  };

  // Interpolate flap rotation
  const flapRotate = flapAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-180deg'],
  });

  if (!isSealed) {
    // Show opened letter
    return (
      <View style={styles.openedContainer}>
        <View style={styles.openedEnvelope}>
          {/* Envelope Back */}
          <View style={styles.envelopeBack}>
            <View style={styles.envelopeBackPattern} />
          </View>

          {/* Letter Paper */}
          <View style={styles.letterPaper}>
            <View style={styles.letterHeader}>
              <Text style={styles.letterTo}>Dear Future Self,</Text>
              <Text style={styles.letterDate}>Written on {formatDate(createdDate)}</Text>
            </View>

            <Text style={styles.letterContent}>{letterContent}</Text>

            <View style={styles.letterFooter}>
              <Text style={styles.letterSignature}>With love from your past self</Text>
            </View>
          </View>
        </View>

        {onPreview && (
          <Pressable
            style={styles.previewButton}
            onPress={onPreview}
            accessibilityRole="button"
            accessibilityLabel="Preview letter"
          >
            <Text style={styles.previewButtonText}>View Full Letter</Text>
          </Pressable>
        )}
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: pulseAnimation }] }]}>
      <Pressable
        style={styles.envelopeContainer}
        onPress={timeRemaining.canOpen ? handleOpen : handleSealedTap}
        accessibilityRole="button"
        accessibilityLabel={
          timeRemaining.canOpen
            ? 'Tap to open your letter from the past'
            : `Letter sealed until ${formatDate(openDate)}. ${timeRemaining.days} days remaining.`
        }
      >
        {/* Envelope Body */}
        <View style={styles.envelopeBody}>
          {/* Inner Pattern */}
          <View style={styles.envelopePattern}>
            <View style={styles.patternLine} />
            <View style={styles.patternLine} />
            <View style={styles.patternLine} />
          </View>

          {/* Envelope Flap */}
          <Animated.View
            style={[
              styles.envelopeFlap,
              { transform: [{ rotateX: flapRotate }] },
            ]}
          >
            <View style={styles.flapInner} />
          </Animated.View>

          {/* Wax Seal */}
          <View style={[styles.waxSeal, timeRemaining.canOpen && styles.waxSealReady]}>
            <Text style={styles.sealSymbol}>{'\u2600'}</Text>
          </View>
        </View>
      </Pressable>

      {/* Info Section */}
      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>
          {timeRemaining.canOpen ? 'Ready to Open!' : 'Letter to Your Future Self'}
        </Text>

        {timeRemaining.canOpen ? (
          <View style={styles.readyContainer}>
            <Text style={styles.readyText}>
              Your letter has arrived! Tap the envelope to read your message from the past.
            </Text>
            <View style={styles.openPrompt}>
              <Text style={styles.openPromptText}>Tap to Open</Text>
            </View>
          </View>
        ) : (
          <View style={styles.countdownContainer}>
            <Text style={styles.countdownLabel}>Opens on</Text>
            <Text style={styles.countdownDate}>{formatDate(openDate)}</Text>

            <View style={styles.timeRemaining}>
              <View style={styles.timeBlock}>
                <Text style={styles.timeValue}>{timeRemaining.days}</Text>
                <Text style={styles.timeUnit}>days</Text>
              </View>
              <Text style={styles.timeSeparator}>:</Text>
              <View style={styles.timeBlock}>
                <Text style={styles.timeValue}>{timeRemaining.hours}</Text>
                <Text style={styles.timeUnit}>hours</Text>
              </View>
            </View>

            <Text style={styles.patience}>
              Trust the timing. Your future self will receive this at the perfect moment.
            </Text>
          </View>
        )}

        <Text style={styles.createdOn}>
          Sealed on {formatDate(createdDate)}
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  envelopeContainer: {
    marginBottom: 24,
  },
  envelopeBody: {
    width: 260,
    height: 160,
    backgroundColor: '#3a3a5a',
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 2,
    borderColor: DESIGN_COLORS.accentPurple,
    shadowColor: DESIGN_COLORS.accentGold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  envelopePattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  patternLine: {
    width: '80%',
    height: 2,
    backgroundColor: DESIGN_COLORS.border,
    marginVertical: 12,
    borderRadius: 1,
  },
  envelopeFlap: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    height: 80,
    backgroundColor: '#3a3a5a',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderWidth: 2,
    borderColor: DESIGN_COLORS.accentPurple,
    borderBottomWidth: 0,
    transformOrigin: 'top',
  },
  flapInner: {
    position: 'absolute',
    bottom: 0,
    left: 10,
    right: 10,
    height: 60,
    backgroundColor: DESIGN_COLORS.bgElevated,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  waxSeal: {
    position: 'absolute',
    top: 45,
    alignSelf: 'center',
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#8b3a3a',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#6b2222',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 6,
  },
  waxSealReady: {
    backgroundColor: DESIGN_COLORS.accentGold,
    borderColor: '#a68b1e',
  },
  sealSymbol: {
    fontSize: 24,
    color: '#ffd700',
  },

  // Info Section
  infoSection: {
    alignItems: 'center',
    paddingHorizontal: 24,
    width: '100%',
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: DESIGN_COLORS.textPrimary,
    marginBottom: 16,
    textAlign: 'center',
  },
  countdownContainer: {
    alignItems: 'center',
  },
  countdownLabel: {
    fontSize: 12,
    color: DESIGN_COLORS.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  countdownDate: {
    fontSize: 16,
    fontWeight: '600',
    color: DESIGN_COLORS.accentGold,
    marginBottom: 16,
  },
  timeRemaining: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  timeBlock: {
    alignItems: 'center',
    backgroundColor: DESIGN_COLORS.bgElevated,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 80,
  },
  timeValue: {
    fontSize: 32,
    fontWeight: '700',
    color: DESIGN_COLORS.textPrimary,
  },
  timeUnit: {
    fontSize: 11,
    color: DESIGN_COLORS.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  timeSeparator: {
    fontSize: 28,
    fontWeight: '700',
    color: DESIGN_COLORS.textTertiary,
    marginHorizontal: 8,
  },
  patience: {
    fontSize: 13,
    color: DESIGN_COLORS.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 20,
    paddingHorizontal: 16,
  },
  readyContainer: {
    alignItems: 'center',
  },
  readyText: {
    fontSize: 14,
    color: DESIGN_COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 22,
  },
  openPrompt: {
    backgroundColor: DESIGN_COLORS.accentGold,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  openPromptText: {
    fontSize: 14,
    fontWeight: '700',
    color: DESIGN_COLORS.bgPrimary,
  },
  createdOn: {
    fontSize: 11,
    color: DESIGN_COLORS.textTertiary,
    marginTop: 24,
  },

  // Opened Letter Styles
  openedContainer: {
    alignItems: 'center',
    paddingVertical: 16,
    width: '100%',
  },
  openedEnvelope: {
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
  },
  envelopeBack: {
    width: 260,
    height: 40,
    backgroundColor: '#3a3a5a',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    overflow: 'hidden',
  },
  envelopeBackPattern: {
    position: 'absolute',
    top: 10,
    left: 20,
    right: 20,
    height: 2,
    backgroundColor: DESIGN_COLORS.border,
  },
  letterPaper: {
    width: 280,
    backgroundColor: '#f5f0e6',
    borderRadius: 4,
    padding: 20,
    marginTop: -20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  letterHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd5c5',
    paddingBottom: 12,
    marginBottom: 16,
  },
  letterTo: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3a3a3a',
    fontStyle: 'italic',
  },
  letterDate: {
    fontSize: 11,
    color: '#888',
    marginTop: 4,
  },
  letterContent: {
    fontSize: 14,
    color: '#4a4a4a',
    lineHeight: 22,
    minHeight: 80,
  },
  letterFooter: {
    borderTopWidth: 1,
    borderTopColor: '#ddd5c5',
    paddingTop: 12,
    marginTop: 16,
    alignItems: 'flex-end',
  },
  letterSignature: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#5a5a5a',
  },
  previewButton: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 24,
    backgroundColor: DESIGN_COLORS.accentPurple,
    borderRadius: 20,
  },
  previewButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: DESIGN_COLORS.textPrimary,
  },
});

export default SealedLetter;
