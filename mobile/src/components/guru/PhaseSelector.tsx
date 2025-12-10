/**
 * PhaseSelector Component
 *
 * Horizontal scrollable list of phase cards.
 * Shows all 10 phases with their completion status.
 * Users can select completed phases to get personalized Guru insights.
 */

import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { colors, spacing } from '../../theme';
import { PhaseCard } from './PhaseCard';

/**
 * Phase names for each of the 10 phases
 */
const PHASE_NAMES = [
  'Self-Evaluation',
  'Values & Vision',
  'Goal Setting',
  'Facing Fears',
  'Self-Love & Care',
  'Manifestation Techniques',
  'Practicing Gratitude',
  'Envy to Inspiration',
  'Trust & Surrender',
  'Letting Go',
];

interface PhaseSelectorProps {
  completedPhases: number[];
  onSelectPhase: (phaseNumber: number) => void;
}

interface PhaseItem {
  phaseNumber: number;
  phaseName: string;
  isCompleted: boolean;
}

/**
 * Phase Selector Component
 *
 * Displays a horizontal scrollable list of all 10 phases.
 * Completed phases are interactive and can be selected for analysis.
 * Locked phases show disabled state.
 *
 * @example
 * ```tsx
 * <PhaseSelector
 *   completedPhases={[1, 2, 3]}
 *   onSelectPhase={(phaseNum) => handlePhaseSelect(phaseNum)}
 * />
 * ```
 */
export const PhaseSelector: React.FC<PhaseSelectorProps> = ({
  completedPhases,
  onSelectPhase,
}) => {
  // Build phase items array (1-10)
  const phases: PhaseItem[] = PHASE_NAMES.map((name, index) => ({
    phaseNumber: index + 1,
    phaseName: name,
    isCompleted: completedPhases.includes(index + 1),
  }));

  const completedCount = completedPhases.length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Select a Phase to Analyze</Text>
        <Text style={styles.subtitle}>
          {completedCount} of {PHASE_NAMES.length} phases completed
        </Text>
      </View>

      {/* Phase Cards List */}
      <FlatList
        data={phases}
        keyExtractor={(item) => `phase-${item.phaseNumber}`}
        renderItem={({ item }) => (
          <PhaseCard
            phaseNumber={item.phaseNumber}
            phaseName={item.phaseName}
            isCompleted={item.isCompleted}
            onPress={() => onSelectPhase(item.phaseNumber)}
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        snapToInterval={140 + spacing.sm} // Card width + margin
        decelerationRate="fast"
        accessibilityRole="list"
        accessibilityLabel={`Phase selector. ${completedCount} of ${PHASE_NAMES.length} phases completed.`}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  header: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    fontStyle: 'italic',
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
});

export default PhaseSelector;
