/**
 * Workbook Screen
 *
 * Main workbook screen showing all 10 phases and user progress.
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image, ImageSourcePropType } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import type { WorkbookStackScreenProps, WorkbookStackParamList } from '../types/navigation';
import { useProfile } from '../stores/authStore';
import { colors } from '../theme';
import { PhaseImages } from '../assets';

type Props = WorkbookStackScreenProps<'WorkbookHome'>;

interface Phase {
  id: number;
  name: string;
  description: string;
  image: ImageSourcePropType;
}

const PHASES: Phase[] = [
  { id: 1, name: 'Self-Evaluation', description: 'Assess your current state', image: PhaseImages.phase1 },
  { id: 2, name: 'Values & Vision', description: 'Define your core values', image: PhaseImages.phase2 },
  { id: 3, name: 'Goal Setting', description: 'Set SMART goals', image: PhaseImages.phase3 },
  { id: 4, name: 'Facing Fears', description: 'Overcome limiting beliefs', image: PhaseImages.phase4 },
  { id: 5, name: 'Self-Love & Care', description: 'Cultivate self-compassion', image: PhaseImages.phase5 },
  { id: 6, name: 'Manifestation', description: 'Learn manifestation techniques', image: PhaseImages.phase6 },
  { id: 7, name: 'Gratitude', description: 'Practice daily gratitude', image: PhaseImages.phase7 },
  { id: 8, name: 'Envy to Inspiration', description: 'Transform envy positively', image: PhaseImages.phase8 },
  { id: 9, name: 'Trust & Surrender', description: 'Let go of control', image: PhaseImages.phase9 },
  { id: 10, name: 'Letting Go', description: 'Release what no longer serves', image: PhaseImages.phase10 },
];

const WorkbookScreen = ({ navigation }: Props) => {
  const profile = useProfile();
  const currentPhase = profile?.currentPhase || 1;
  const allPhasesUnlocked = true;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Workbook Journey</Text>
        <Text style={styles.subtitle}>
          Your transformation through 10 powerful phases
        </Text>
      </View>

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
                  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                  Alert.alert(
                    'Phase Locked',
                    `Complete Phase ${phase.id - 1} first to unlock this phase.`
                  );
                  return;
                }
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
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
                if (screenName) (navigation.navigate as any)(screenName);
              }}
              disabled={!isUnlocked}
              activeOpacity={0.8}
            >
              <View style={styles.imageContainer}>
                <Image source={phase.image} style={styles.phaseImage} resizeMode="cover" />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.7)']}
                  style={styles.imageGradient}
                />
                <View style={styles.imageOverlay}>
                  <View
                    style={[
                      styles.phaseNumber,
                      isCurrent && styles.phaseNumberCurrent,
                      isCompleted && styles.phaseNumberCompleted,
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
                  {!isUnlocked && (
                    <View style={styles.lockOverlay}>
                      <Text style={styles.lockIcon}>🔒</Text>
                    </View>
                  )}
                </View>
              </View>

              <View style={styles.phaseContent}>
                <View style={styles.phaseInfo}>
                  <Text style={[styles.phaseName, !isUnlocked && styles.phaseNameLocked]}>
                    {phase.name}
                  </Text>
                  <Text style={[styles.phaseDescription, !isUnlocked && styles.phaseDescriptionLocked]}>
                    {phase.description}
                  </Text>
                </View>
                <Text style={styles.phaseArrow}>›</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
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
    gap: 16,
  },
  phaseCard: {
    backgroundColor: colors.background.elevated,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  phaseCardCurrent: {
    borderWidth: 2,
    borderColor: colors.primary[500],
  },
  phaseCardLocked: {
    opacity: 0.6,
  },
  imageContainer: {
    height: 140,
    position: 'relative',
  },
  phaseImage: {
    width: '100%',
    height: '100%',
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  imageOverlay: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  lockOverlay: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 20,
    padding: 8,
  },
  lockIcon: {
    fontSize: 20,
  },
  phaseNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  phaseNumberCurrent: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[400],
  },
  phaseNumberCompleted: {
    backgroundColor: colors.success[500],
    borderColor: colors.success[400],
  },
  phaseNumberText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },
  phaseNumberTextActive: {
    color: colors.white,
  },
  phaseContent: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  phaseInfo: {
    flex: 1,
  },
  phaseName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
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
    fontSize: 28,
    color: colors.text.tertiary,
    marginLeft: 12,
  },
  currentBadge: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border.default,
    paddingTop: 12,
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
