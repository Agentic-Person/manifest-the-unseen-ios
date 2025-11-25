/**
 * Phase Card Component
 *
 * Reusable phase card showing phase info, progress, and state (locked/current/completed).
 */

import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors } from '../../theme';

interface PhaseCardProps {
  phaseNumber: number;
  phaseName: string;
  description: string;
  progress?: number; // 0-100
  isLocked: boolean;
  isCurrent: boolean;
  isCompleted: boolean;
  exerciseCount?: number;
  completedExercises?: number;
  onPress: () => void;
}

export const PhaseCard: React.FC<PhaseCardProps> = ({
  phaseNumber,
  phaseName,
  description,
  progress = 0,
  isLocked,
  isCurrent,
  isCompleted,
  exerciseCount,
  completedExercises,
  onPress,
}) => {
  const handlePress = () => {
    if (isLocked) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onPress();
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        isLocked && styles.cardLocked,
        isCurrent && styles.cardCurrent,
        isCompleted && styles.cardCompleted,
      ]}
      onPress={handlePress}
      activeOpacity={isLocked ? 1 : 0.7}
      disabled={isLocked}
      accessibilityRole="button"
      accessibilityLabel={`Phase ${phaseNumber}: ${phaseName}. ${
        isLocked ? 'Locked' : `${progress}% complete`
      }`}
    >
      <View style={styles.header}>
        <View
          style={[
            styles.phaseNumber,
            isCurrent && styles.phaseNumberCurrent,
            isCompleted && styles.phaseNumberCompleted,
            isLocked && styles.phaseNumberLocked,
          ]}
        >
          <Text
            style={[
              styles.phaseNumberText,
              (isCurrent || isCompleted) && styles.phaseNumberTextActive,
            ]}
          >
            {isCompleted ? '✓' : phaseNumber}
          </Text>
        </View>

        <View style={styles.phaseInfo}>
          <Text style={[styles.phaseName, isLocked && styles.textLocked]}>
            {phaseName}
          </Text>
          <Text style={[styles.description, isLocked && styles.descriptionLocked]}>
            {description}
          </Text>
        </View>

        <Text style={styles.arrow}>{isLocked ? '🔒' : '›'}</Text>
      </View>

      {isCurrent && (
        <View style={styles.currentBadge}>
          <Text style={styles.currentBadgeText}>Current Phase</Text>
        </View>
      )}

      {!isLocked && exerciseCount && (
        <View style={styles.progressSection}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {completedExercises || 0}/{exerciseCount} exercises • {Math.round(progress)}%
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardLocked: {
    opacity: 0.5,
  },
  cardCurrent: {
    borderWidth: 2,
    borderColor: colors.primary[600],
  },
  cardCompleted: {
    borderColor: colors.success[500],
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  phaseNumber: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.gray[200],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  phaseNumberCurrent: {
    backgroundColor: colors.primary[600],
  },
  phaseNumberCompleted: {
    backgroundColor: colors.success[500],
  },
  phaseNumberLocked: {
    backgroundColor: colors.gray[300],
  },
  phaseNumberText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.gray[600],
  },
  phaseNumberTextActive: {
    color: colors.white,
  },
  phaseInfo: {
    flex: 1,
  },
  phaseName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 2,
  },
  description: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  textLocked: {
    color: colors.gray[500],
  },
  descriptionLocked: {
    color: colors.gray[400],
  },
  arrow: {
    fontSize: 24,
    color: colors.gray[400],
  },
  currentBadge: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
  currentBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary[600],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  progressSection: {
    marginTop: 12,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.gray[200],
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary[600],
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: colors.text.tertiary,
  },
});
