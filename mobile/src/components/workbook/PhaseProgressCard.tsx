/**
 * PhaseProgressCard
 *
 * Mini card showing phase completion status for Phase 10 Journey Review.
 * Displays phase number, name, completion percentage, and key insights.
 *
 * Design (from APP-DESIGN.md):
 * - Background: #252547 (elevated)
 * - Border: #3a3a5a
 * - Accent gold: #c9a227 (for completed phases)
 * - Dark spiritual theme
 */

import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Pressable,
} from 'react-native';
import * as Haptics from 'expo-haptics';

// Design system colors from APP-DESIGN.md
const DESIGN_COLORS = {
  bgPrimary: '#1a1a2e',
  bgElevated: '#252547',
  textPrimary: '#e8e8e8',
  textSecondary: '#a0a0b0',
  textTertiary: '#6b6b80',
  accentPurple: '#4a1a6b',
  accentGold: '#c9a227',
  accentTeal: '#1a5f5f',
  accentGreen: '#2d5a4a',
  border: '#3a3a5a',
};

// Phase icon symbols (spiritual/mystical theme)
const PHASE_ICONS: Record<number, string> = {
  1: '\u2299', // Circled dot (self-evaluation)
  2: '\u2606', // Star (vision)
  3: '\u2192', // Arrow (goals)
  4: '\u2620', // Skull (fears - facing death of old self)
  5: '\u2661', // Heart (self-love)
  6: '\u2728', // Sparkles (manifestation)
  7: '\u2618', // Clover (gratitude)
  8: '\u2194', // Double arrow (envy to inspiration)
  9: '\u2693', // Anchor (trust)
  10: '\u2740', // Flower (letting go)
};

// Phase names
const PHASE_NAMES: Record<number, string> = {
  1: 'Self-Evaluation',
  2: 'Values & Vision',
  3: 'Goal Setting',
  4: 'Facing Fears',
  5: 'Self-Love',
  6: 'Manifestation',
  7: 'Gratitude',
  8: 'Envy to Inspiration',
  9: 'Trust & Surrender',
  10: 'Trust & Letting Go',
};

export interface PhaseProgressData {
  phaseNumber: number;
  completionPercentage: number;
  exercisesCompleted: number;
  totalExercises: number;
  keyInsight?: string;
  lastUpdated?: string;
}

export interface PhaseProgressCardProps {
  data: PhaseProgressData;
  onPress?: (phaseNumber: number) => void;
  isCompact?: boolean;
}

/**
 * PhaseProgressCard Component
 */
export const PhaseProgressCard: React.FC<PhaseProgressCardProps> = ({
  data,
  onPress,
  isCompact = false,
}) => {
  const {
    phaseNumber,
    completionPercentage,
    exercisesCompleted,
    totalExercises,
    keyInsight,
    lastUpdated,
  } = data;

  const isComplete = completionPercentage >= 100;
  const icon = PHASE_ICONS[phaseNumber] || '\u2022';
  const phaseName = PHASE_NAMES[phaseNumber] || `Phase ${phaseNumber}`;

  const handlePress = () => {
    if (onPress) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress(phaseNumber);
    }
  };

  if (isCompact) {
    return (
      <Pressable
        style={({ pressed }) => [
          styles.compactContainer,
          isComplete && styles.completedBorder,
          pressed && styles.pressed,
        ]}
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityLabel={`Phase ${phaseNumber}: ${phaseName}, ${completionPercentage}% complete`}
      >
        <View style={[styles.compactIconContainer, isComplete && styles.completedIcon]}>
          <Text style={styles.compactIcon}>{icon}</Text>
        </View>
        <View style={styles.compactContent}>
          <Text style={styles.compactPhaseNumber}>Phase {phaseNumber}</Text>
          <Text style={styles.compactPhaseName} numberOfLines={1}>{phaseName}</Text>
        </View>
        <View style={styles.compactProgressContainer}>
          <Text style={[styles.compactPercentage, isComplete && styles.completedText]}>
            {completionPercentage}%
          </Text>
          {isComplete && <Text style={styles.checkmark}>{'\u2713'}</Text>}
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        isComplete && styles.completedBorder,
        pressed && styles.pressed,
      ]}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={`Phase ${phaseNumber}: ${phaseName}, ${completionPercentage}% complete. ${exercisesCompleted} of ${totalExercises} exercises completed`}
    >
      {/* Header Row */}
      <View style={styles.header}>
        <View style={[styles.iconContainer, isComplete && styles.completedIcon]}>
          <Text style={styles.icon}>{icon}</Text>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.phaseNumber}>Phase {phaseNumber}</Text>
          <Text style={styles.phaseName}>{phaseName}</Text>
        </View>
        {isComplete && (
          <View style={styles.completedBadge}>
            <Text style={styles.completedBadgeText}>{'\u2713'} Complete</Text>
          </View>
        )}
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${Math.min(completionPercentage, 100)}%` },
              isComplete && styles.completedProgressBar,
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {exercisesCompleted}/{totalExercises} exercises
        </Text>
      </View>

      {/* Key Insight */}
      {keyInsight && (
        <View style={styles.insightContainer}>
          <Text style={styles.insightLabel}>Key Insight:</Text>
          <Text style={styles.insightText} numberOfLines={2}>"{keyInsight}"</Text>
        </View>
      )}

      {/* Last Updated */}
      {lastUpdated && (
        <Text style={styles.lastUpdated}>Last updated: {lastUpdated}</Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  // Full Card Styles
  container: {
    backgroundColor: DESIGN_COLORS.bgElevated,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
  },
  completedBorder: {
    borderColor: DESIGN_COLORS.accentGold,
    borderWidth: 1.5,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: DESIGN_COLORS.accentPurple,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  completedIcon: {
    backgroundColor: DESIGN_COLORS.accentGold,
  },
  icon: {
    fontSize: 22,
    color: DESIGN_COLORS.textPrimary,
  },
  titleContainer: {
    flex: 1,
  },
  phaseNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: DESIGN_COLORS.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  phaseName: {
    fontSize: 17,
    fontWeight: '700',
    color: DESIGN_COLORS.textPrimary,
    marginTop: 2,
  },
  completedBadge: {
    backgroundColor: DESIGN_COLORS.accentGreen,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  completedBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: DESIGN_COLORS.textPrimary,
  },

  // Progress Bar
  progressBarContainer: {
    marginBottom: 12,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: DESIGN_COLORS.bgPrimary,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: DESIGN_COLORS.accentPurple,
    borderRadius: 4,
  },
  completedProgressBar: {
    backgroundColor: DESIGN_COLORS.accentGold,
  },
  progressText: {
    fontSize: 12,
    color: DESIGN_COLORS.textSecondary,
  },

  // Insight
  insightContainer: {
    backgroundColor: DESIGN_COLORS.bgPrimary,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  insightLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: DESIGN_COLORS.accentGold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  insightText: {
    fontSize: 13,
    color: DESIGN_COLORS.textSecondary,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  lastUpdated: {
    fontSize: 11,
    color: DESIGN_COLORS.textTertiary,
    textAlign: 'right',
  },

  // Compact Card Styles
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DESIGN_COLORS.bgElevated,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
  },
  compactIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: DESIGN_COLORS.accentPurple,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  compactIcon: {
    fontSize: 18,
    color: DESIGN_COLORS.textPrimary,
  },
  compactContent: {
    flex: 1,
  },
  compactPhaseNumber: {
    fontSize: 10,
    fontWeight: '600',
    color: DESIGN_COLORS.textTertiary,
    textTransform: 'uppercase',
  },
  compactPhaseName: {
    fontSize: 14,
    fontWeight: '600',
    color: DESIGN_COLORS.textPrimary,
  },
  compactProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  compactPercentage: {
    fontSize: 14,
    fontWeight: '700',
    color: DESIGN_COLORS.textSecondary,
    marginRight: 4,
  },
  completedText: {
    color: DESIGN_COLORS.accentGold,
  },
  checkmark: {
    fontSize: 14,
    color: DESIGN_COLORS.accentGold,
    fontWeight: '700',
  },
});

export default PhaseProgressCard;
