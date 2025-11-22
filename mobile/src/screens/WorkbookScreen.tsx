/**
 * Workbook Screen
 *
 * Main workbook screen showing all 10 phases and user progress.
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import type { MainTabScreenProps } from '../types/navigation';
import { useProfile } from '../stores/authStore';

type Props = MainTabScreenProps<'Workbook'>;

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
const WorkbookScreen = (_props: Props) => {
  const profile = useProfile();
  const currentPhase = profile?.currentPhase || 1;

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
          const isUnlocked = phase.id <= currentPhase;
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
                if (isUnlocked) {
                  // TODO: Navigate to phase detail screen
                  console.log('Navigate to phase:', phase.id);
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
    backgroundColor: '#F9FAFB',
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
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  progressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#8B5CF6',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#4B5563',
  },
  phasesList: {
    gap: 12,
  },
  phaseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  phaseCardCurrent: {
    borderWidth: 2,
    borderColor: '#8B5CF6',
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
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  phaseNumberCurrent: {
    backgroundColor: '#8B5CF6',
  },
  phaseNumberCompleted: {
    backgroundColor: '#10B981',
  },
  phaseNumberLocked: {
    backgroundColor: '#E5E7EB',
  },
  phaseNumberText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6B7280',
  },
  phaseNumberTextActive: {
    color: '#FFFFFF',
  },
  phaseInfo: {
    flex: 1,
  },
  phaseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  phaseNameLocked: {
    color: '#9CA3AF',
  },
  phaseDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  phaseDescriptionLocked: {
    color: '#D1D5DB',
  },
  phaseArrow: {
    fontSize: 24,
    color: '#D1D5DB',
  },
  currentBadge: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  currentBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8B5CF6',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

export default WorkbookScreen;
