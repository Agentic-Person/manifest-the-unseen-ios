/**
 * SurrenderCard Component
 *
 * A card component for the "Letting Go" ritual exercise in Phase 9.
 * Users write what they want to surrender and can trigger a symbolic
 * release animation (paper burning/floating away effect).
 *
 * Features:
 * - Two text areas: what you're controlling & what you're surrendering
 * - Animated "release" effect with fade and float animation
 * - Symbolic transformation visual
 * - Accessible interactions
 *
 * Design (from APP-DESIGN.md):
 * - Background: #1a1a2e (deep charcoal)
 * - Elevated surfaces: #252547
 * - Accent teal: #1a5f5f for surrender/release
 * - Accent purple: #4a1a6b for control
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  Animated,
  Easing,
} from 'react-native';
import * as Haptics from 'expo-haptics';

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
  accentRose: '#8b3a5f',
  border: '#3a3a5a',
};

/**
 * Surrender Entry Data
 */
export interface SurrenderEntryData {
  id: string;
  controllingText: string;
  surrenderText: string;
  affirmation: string;
  isReleased: boolean;
  releasedAt?: string;
  createdAt: string;
}

/**
 * Component Props
 */
export interface SurrenderCardProps {
  entry: SurrenderEntryData;
  index: number;
  onControllingChange: (id: string, text: string) => void;
  onSurrenderChange: (id: string, text: string) => void;
  onAffirmationChange: (id: string, text: string) => void;
  onRelease: (id: string) => void;
  onDelete?: (id: string) => void;
}

/**
 * Surrender Affirmation Prompts
 */
export const SURRENDER_AFFIRMATIONS = [
  'I release this with love and trust the universe will guide me.',
  'I surrender control and embrace what is meant for me.',
  'I let go of what no longer serves my highest good.',
  'I trust that everything is unfolding perfectly.',
  'I release my attachment and open myself to new possibilities.',
  'I surrender my fears and step into faith.',
  'I let go and make room for miracles.',
  'I trust the timing of my life.',
];

/**
 * SurrenderCard Component
 */
export const SurrenderCard: React.FC<SurrenderCardProps> = ({
  entry,
  index,
  onControllingChange,
  onSurrenderChange,
  onAffirmationChange,
  onRelease,
  onDelete,
}) => {
  const [isReleasing, setIsReleasing] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  // Reset animation when entry changes
  useEffect(() => {
    if (!entry.isReleased) {
      fadeAnim.setValue(1);
      translateYAnim.setValue(0);
      scaleAnim.setValue(1);
      rotateAnim.setValue(0);
      glowAnim.setValue(0);
    }
  }, [entry.id, entry.isReleased]);

  /**
   * Handle release animation
   */
  const handleRelease = () => {
    if (!entry.controllingText.trim() || !entry.surrenderText.trim()) {
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setIsReleasing(true);

    // Start glow effect
    Animated.timing(glowAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: false,
    }).start();

    // Main release animation sequence
    Animated.sequence([
      // Initial pause with glow
      Animated.delay(300),
      // Float up and fade
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 1500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: -80,
          duration: 1500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 1500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      setIsReleasing(false);
      onRelease(entry.id);
    });
  };

  /**
   * Handle delete with confirmation
   */
  const handleDelete = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (onDelete) {
      onDelete(entry.id);
    }
  };

  // Calculate rotation interpolation
  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '10deg'],
  });

  // Calculate glow opacity
  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.6],
  });

  // If released, show completion state
  if (entry.isReleased) {
    return (
      <View
        style={styles.releasedContainer}
        accessibilityRole="text"
        accessibilityLabel={`Released surrender: ${entry.controllingText}`}
      >
        <View style={styles.releasedIcon}>
          <Text style={styles.releasedIconText}>{'\u2728'}</Text>
        </View>
        <Text style={styles.releasedTitle}>Released & Surrendered</Text>
        <Text style={styles.releasedText}>
          "{entry.controllingText.substring(0, 50)}..."
        </Text>
        <Text style={styles.releasedDate}>
          Released on {new Date(entry.releasedAt || entry.createdAt).toLocaleDateString()}
        </Text>
      </View>
    );
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [
            { translateY: translateYAnim },
            { scale: scaleAnim },
            { rotate: rotateInterpolate },
          ],
        },
      ]}
      accessibilityRole="article"
      accessibilityLabel={`Surrender card ${index + 1}`}
    >
      {/* Glow Effect Overlay */}
      <Animated.View
        style={[
          styles.glowOverlay,
          { opacity: glowOpacity },
        ]}
        pointerEvents="none"
      />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerNumber}>{index + 1}</Text>
        <Text style={styles.headerTitle}>Surrender Practice</Text>
        {onDelete && (
          <Pressable
            style={styles.deleteButton}
            onPress={handleDelete}
            accessibilityRole="button"
            accessibilityLabel="Delete this surrender entry"
          >
            <Text style={styles.deleteButtonText}>{'\u00d7'}</Text>
          </Pressable>
        )}
      </View>

      {/* What I'm Trying to Control */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={[styles.sectionIcon, styles.controlIcon]}>
            <Text style={styles.sectionIconText}>{'\u270b'}</Text>
          </View>
          <Text style={styles.sectionLabel}>What I'm Trying to Control</Text>
        </View>
        <TextInput
          style={styles.textInput}
          value={entry.controllingText}
          onChangeText={(text) => onControllingChange(entry.id, text)}
          placeholder="Write what you feel you need to control..."
          placeholderTextColor={DESIGN_COLORS.textTertiary}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          editable={!isReleasing}
          accessibilityLabel="What you are trying to control"
          accessibilityHint="Enter what you feel the need to control"
        />
      </View>

      {/* What I'm Surrendering */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={[styles.sectionIcon, styles.surrenderIcon]}>
            <Text style={styles.sectionIconText}>{'\u{1f54a}'}</Text>
          </View>
          <Text style={styles.sectionLabel}>What I Choose to Surrender</Text>
        </View>
        <TextInput
          style={styles.textInput}
          value={entry.surrenderText}
          onChangeText={(text) => onSurrenderChange(entry.id, text)}
          placeholder="Write what you're ready to let go of..."
          placeholderTextColor={DESIGN_COLORS.textTertiary}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          editable={!isReleasing}
          accessibilityLabel="What you are choosing to surrender"
          accessibilityHint="Enter what you are ready to release"
        />
      </View>

      {/* Affirmation */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={[styles.sectionIcon, styles.affirmationIcon]}>
            <Text style={styles.sectionIconText}>{'\u2764'}</Text>
          </View>
          <Text style={styles.sectionLabel}>Release Affirmation</Text>
        </View>
        <TextInput
          style={[styles.textInput, styles.affirmationInput]}
          value={entry.affirmation}
          onChangeText={(text) => onAffirmationChange(entry.id, text)}
          placeholder="I release this with love..."
          placeholderTextColor={DESIGN_COLORS.textTertiary}
          multiline
          numberOfLines={2}
          textAlignVertical="top"
          editable={!isReleasing}
          accessibilityLabel="Release affirmation"
          accessibilityHint="Enter or customize your release affirmation"
        />
      </View>

      {/* Release Button */}
      <Pressable
        style={({ pressed }) => [
          styles.releaseButton,
          (!entry.controllingText.trim() || !entry.surrenderText.trim()) && styles.releaseButtonDisabled,
          pressed && styles.releaseButtonPressed,
          isReleasing && styles.releaseButtonReleasing,
        ]}
        onPress={handleRelease}
        disabled={!entry.controllingText.trim() || !entry.surrenderText.trim() || isReleasing}
        accessibilityRole="button"
        accessibilityLabel="Release and surrender"
        accessibilityHint="Press to symbolically release what you've written"
        accessibilityState={{ disabled: !entry.controllingText.trim() || !entry.surrenderText.trim() }}
      >
        <Text style={styles.releaseButtonIcon}>
          {isReleasing ? '\u2728' : '\u{1f54a}'}
        </Text>
        <Text style={styles.releaseButtonText}>
          {isReleasing ? 'Releasing...' : 'Release & Surrender'}
        </Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: DESIGN_COLORS.bgElevated,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
    overflow: 'hidden',
  },
  glowOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: DESIGN_COLORS.accentTeal,
    borderRadius: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: DESIGN_COLORS.border,
  },
  headerNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: DESIGN_COLORS.accentTeal,
    textAlign: 'center',
    lineHeight: 28,
    fontSize: 14,
    fontWeight: '700',
    color: DESIGN_COLORS.textPrimary,
    marginRight: 12,
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: DESIGN_COLORS.textPrimary,
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: DESIGN_COLORS.bgPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    fontSize: 20,
    color: DESIGN_COLORS.textTertiary,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  controlIcon: {
    backgroundColor: `${DESIGN_COLORS.accentPurple}60`,
  },
  surrenderIcon: {
    backgroundColor: `${DESIGN_COLORS.accentTeal}60`,
  },
  affirmationIcon: {
    backgroundColor: `${DESIGN_COLORS.accentRose}60`,
  },
  sectionIconText: {
    fontSize: 12,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: DESIGN_COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  textInput: {
    backgroundColor: DESIGN_COLORS.bgPrimary,
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    color: DESIGN_COLORS.textPrimary,
    lineHeight: 22,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
    minHeight: 80,
  },
  affirmationInput: {
    minHeight: 60,
    fontStyle: 'italic',
  },
  releaseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: DESIGN_COLORS.accentTeal,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 8,
  },
  releaseButtonDisabled: {
    backgroundColor: DESIGN_COLORS.bgPrimary,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
  },
  releaseButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  releaseButtonReleasing: {
    backgroundColor: DESIGN_COLORS.accentGold,
  },
  releaseButtonIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  releaseButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: DESIGN_COLORS.textPrimary,
  },

  // Released state styles
  releasedContainer: {
    backgroundColor: DESIGN_COLORS.bgElevated,
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: DESIGN_COLORS.accentTeal,
  },
  releasedIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: `${DESIGN_COLORS.accentTeal}30`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  releasedIconText: {
    fontSize: 28,
  },
  releasedTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: DESIGN_COLORS.accentTeal,
    marginBottom: 8,
  },
  releasedText: {
    fontSize: 14,
    color: DESIGN_COLORS.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  releasedDate: {
    fontSize: 12,
    color: DESIGN_COLORS.textTertiary,
  },
});

export default SurrenderCard;
