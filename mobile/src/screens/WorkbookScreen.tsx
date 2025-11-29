/**
 * Workbook Screen
 *
 * Main workbook screen showing all 10 phases and user progress.
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import * as Haptics from 'expo-haptics';
import type { WorkbookStackScreenProps, WorkbookStackParamList } from '../types/navigation';
import { useProfile } from '../stores/authStore';
import { colors } from '../theme';

type Props = WorkbookStackScreenProps<'WorkbookHome'>;

/**
 * Workbook Phase Data
 */
const PHASES = [
  { id: 1, name: 'Self-Evaluation', description: 'Assess your current state' },
  { id: 2, name: 'Values & Vision', description: 'Define your core values' },
  { id: 3, name: 'Goal Setting', description: 'Set SMART goals' },
  { id: 4, name: 'Facing Fears', description: 'Overcome limiting beliefs' },
  { id: 5, name: 'Self-Love & Care', description: 'Cultivate self-compassion' },
  { id: 6, name: 'Manifestation', description: 'Learn manifestation techniques' },
  { id: 7, name: 'Gratitude', description: 'Practice daily gratitude' },
  { id: 8, name: 'Envy to Inspiration', description: 'Transform envy positively' },
  { id: 9, name: 'Trust & Surrender', description: 'Let go of control' },
  { id: 10, name: 'Letting Go', description: 'Release what no longer serves' },
];

/**
 * Workbook Screen Component
 */
const WorkbookScreen = ({ navigation }: Props) => {
  const profile = useProfile();
  // All phases are always unlocked - users can explore freely
  // Progress tracking is separate from access control
  const currentPhase = profile?.currentPhase || 1;
  const allPhasesUnlocked = true; // Set to false to enable progressive unlocking

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Workbook Journey</Text>
        <Text style={styles.subtitle}>
          Your transformation through 10 powerful phases
        </Text>
      </View>

      {/* Progress Overview */}
      <View style={styles.progressCard}>
        <Text style={styles.progressTitle}>Your Progress</Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${(currentPhase / 10) * 100}%` },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          Phase {currentPhase} of 10 • {Math.round((currentPhase / 10) * 100)}% Complete
        </Text>
      </View>

      {/* Phases List */}
      <View style={styles.phasesList}>
        {PHASES.map((phase) => {
          const isUnlocked = allPhasesUnlocked || phase.id <= currentPhase;
          const isCurrent = phase.id === currentPhase;
          const isCompleted = phase.id < currentPhase;

          return (
            <TouchableOpacity
              key={phase.id}
              style={[
                styles.phaseCard,
                isCurrent && styles.phaseCardCurrent,
                !isUnlocked && styles.phaseCardLocked,
              ]}
              onPress={() => {
                if (!isUnlocked) {
                  // Phase is locked
                  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                  Alert.alert(
                    'Phase Locked',
                    `Complete Phase ${phase.id - 1} first to unlock this phase.`
                  );
                  return;
                }

                // Haptic feedback for unlocked phase
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

                // Navigate to the corresponding Phase Dashboard
                const dashboardMap: Record<number, keyof WorkbookStackParamList> = {
                  1: 'Phase1Dashboard',
                  2: 'Phase2Dashboard',
                  3: 'Phase3Dashboard',
                  4: 'Phase4Dashboard',
                  5: 'Phase5Dashboard',
                  6: 'Phase6Dashboard',
                  7: 'Phase7Dashboard',
                  8: 'Phase8Dashboard',
                  9: 'Phase9Dashboard',
                  10: 'Phase10Dashboard',
                };

                const screenName = dashboardMap[phase.id];
                if (screenName) {
                  (navigation.navigate as any)(screenName);
                }
              }}
              disabled={!isUnlocked}
            >
              <View style={styles.phaseHeader}>
                <View
                  style={[
                    styles.phaseNumber,
                    isCurrent && styles.phaseNumberCurrent,
                    isCompleted && styles.phaseNumberCompleted,
                    !isUnlocked && styles.phaseNumberLocked,
                  ]}
                >
                  <Text
                    style={[
                      styles.phaseNumberText,
                      (isCurrent || isCompleted) && styles.phaseNumberTextActive,
                    ]}
                  >
                    {isCompleted ? '✓' : phase.id}
                  </Text>
                </View>

                <View style={styles.phaseInfo}>
                  <Text
                    style={[
                      styles.phaseName,
                      !isUnlocked && styles.phaseNameLocked,
                    ]}
                  >
                    {phase.name}
                  </Text>
                  <Text
                    style={[
                      styles.phaseDescription,
                      !isUnlocked && styles.phaseDescriptionLocked,
                    ]}
                  >
                    {phase.description}
                  </Text>
                </View>

                <Text style={styles.phaseArrow}>
                  {isUnlocked ? '›' : '🔒'}
                </Text>
              </View>

              {isCurrent && (
                <View style={styles.currentBadge}>
                  <Text style={styles.currentBadgeText}>Current Phase</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
};

/**
 * Styles
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  progressCard: {
    backgroundColor: colors.background.elevated,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.secondary,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.border.default,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary[500],
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  phasesList: {
    gap: 12,
  },
  phaseCard: {
    backgroundColor: colors.background.elevated,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  phaseCardCurrent: {
    borderWidth: 2,
    borderColor: colors.primary[500],
  },
  phaseCardLocked: {
    opacity: 0.5,
  },
  phaseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  phaseNumber: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  phaseNumberCurrent: {
    backgroundColor: colors.primary[500],
  },
  phaseNumberCompleted: {
    backgroundColor: colors.success[500],
  },
  phaseNumberLocked: {
    backgroundColor: colors.border.default,
  },
  phaseNumberText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.secondary,
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
  phaseNameLocked: {
    color: colors.text.tertiary,
  },
  phaseDescription: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  phaseDescriptionLocked: {
    color: colors.text.disabled,
  },
  phaseArrow: {
    fontSize: 24,
    color: colors.text.tertiary,
  },
  currentBadge: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border.default,
  },
  currentBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary[400],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

export default WorkbookScreen;
