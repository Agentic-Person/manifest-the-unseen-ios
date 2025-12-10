/**
 * GuruChatHeader Component
 *
 * Header displayed during Guru chat session.
 * Shows selected phase badge and navigation controls.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, shadows, borderRadius } from '../../theme';

/**
 * Phase names mapping
 */
const PHASE_NAMES: { [key: number]: string } = {
  1: 'Self-Evaluation',
  2: 'Values & Vision',
  3: 'Goal Setting',
  4: 'Facing Fears',
  5: 'Self-Love & Care',
  6: 'Manifestation Techniques',
  7: 'Practicing Gratitude',
  8: 'Envy to Inspiration',
  9: 'Trust & Surrender',
  10: 'Letting Go',
};

interface GuruChatHeaderProps {
  phaseNumber: number;
  onBack: () => void;
  onNewConversation?: () => void;
}

/**
 * Guru Chat Header Component
 *
 * Displays phase badge and navigation controls in chat view.
 *
 * @example
 * ```tsx
 * <GuruChatHeader
 *   phaseNumber={1}
 *   onBack={() => navigation.goBack()}
 *   onNewConversation={() => handleNewChat()}
 * />
 * ```
 */
export const GuruChatHeader: React.FC<GuruChatHeaderProps> = ({
  phaseNumber,
  onBack,
  onNewConversation,
}) => {
  const phaseName = PHASE_NAMES[phaseNumber] || 'Unknown Phase';

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Go back to phase selection"
        >
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.title}>Your Guru</Text>

        {/* New Conversation Button (optional) */}
        {onNewConversation ? (
          <TouchableOpacity
            style={styles.newButton}
            onPress={onNewConversation}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Start new conversation"
          >
            <Ionicons
              name="add-circle-outline"
              size={24}
              color={colors.dark.accentGold}
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.spacer} />
        )}
      </View>

      {/* Phase Badge */}
      <View style={styles.phaseBadge}>
        <View style={styles.badgeIcon}>
          <Text style={styles.badgeNumber}>{phaseNumber}</Text>
        </View>
        <View style={styles.badgeTextContainer}>
          <Text style={styles.badgeLabel}>Analyzing Phase {phaseNumber}</Text>
          <Text style={styles.badgePhaseName} numberOfLines={1}>
            {phaseName}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.primary,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.default,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  newButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spacer: {
    width: 40,
  },
  phaseBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.elevated,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.dark.accentGold,
    ...shadows.sm,
  },
  badgeIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${colors.dark.accentGold}20`,
    borderWidth: 2,
    borderColor: colors.dark.accentGold,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  badgeNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.dark.accentGold,
  },
  badgeTextContainer: {
    flex: 1,
  },
  badgeLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  badgePhaseName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.primary,
  },
});

export default GuruChatHeader;
