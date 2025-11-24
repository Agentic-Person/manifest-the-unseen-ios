/**
 * CombinedMissionView Component
 *
 * A beautiful display component that shows all four mission dimensions
 * combined into a unified life mission statement. Used as a summary view
 * and for sharing/reflection purposes.
 *
 * @example
 * ```tsx
 * <CombinedMissionView
 *   personalMission="I am a compassionate leader..."
 *   professionalMission="I create meaningful impact..."
 *   impactMission="I serve by empowering others..."
 *   legacyMission="I will be remembered for..."
 *   visible={showCombined}
 *   onClose={() => setShowCombined(false)}
 * />
 * ```
 */

import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Text } from '../Text';
import { colors, spacing, borderRadius, shadows } from '../../theme';

/**
 * Props for the CombinedMissionView component
 */
export interface CombinedMissionViewProps {
  /** Personal mission text */
  personalMission: string;

  /** Professional mission text */
  professionalMission: string;

  /** Impact mission text */
  impactMission: string;

  /** Legacy mission text */
  legacyMission: string;

  /** Optional combined statement (user-edited) */
  combinedStatement?: string;

  /** Whether the modal is visible */
  visible: boolean;

  /** Callback to close the modal */
  onClose: () => void;

  /** Optional callback when user wants to edit combined statement */
  onEditCombined?: () => void;

  /** Test ID for automation */
  testID?: string;
}

/**
 * Individual mission card within the combined view
 */
interface MissionCardProps {
  title: string;
  icon: string;
  color: string;
  content: string;
}

const MissionCard: React.FC<MissionCardProps> = ({
  title,
  icon,
  color,
  content,
}) => {
  if (!content || content.trim().length === 0) {
    return (
      <View style={[styles.missionCard, styles.emptyCard]}>
        <Text style={styles.emptyIcon}>{icon}</Text>
        <Text style={styles.emptyLabel}>{title}</Text>
        <Text style={styles.emptyHint}>Not yet written</Text>
      </View>
    );
  }

  return (
    <View style={[styles.missionCard, { borderLeftColor: color }]}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardIcon}>{icon}</Text>
        <Text style={[styles.cardTitle, { color }]}>{title}</Text>
      </View>
      <Text style={styles.cardContent}>{content}</Text>
    </View>
  );
};

/**
 * CombinedMissionView Component
 */
export const CombinedMissionView: React.FC<CombinedMissionViewProps> = ({
  personalMission,
  professionalMission,
  impactMission,
  legacyMission,
  combinedStatement,
  visible,
  onClose,
  onEditCombined,
  testID,
}) => {
  // Check completion status
  const sections = [
    { text: personalMission, name: 'Personal' },
    { text: professionalMission, name: 'Professional' },
    { text: impactMission, name: 'Impact' },
    { text: legacyMission, name: 'Legacy' },
  ];

  const completedCount = sections.filter(s => s.text && s.text.trim().length > 0).length;
  const allComplete = completedCount === 4;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
      testID={testID}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
              accessibilityRole="button"
              accessibilityLabel="Close"
              testID={`${testID}-close`}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.headerTitle}>Your Life Mission</Text>
          <Text style={styles.headerSubtitle}>
            {allComplete
              ? 'Your complete mission statement'
              : `${completedCount}/4 dimensions completed`}
          </Text>

          {/* Decorative element */}
          <View style={styles.mandalaDecor}>
            <Text style={styles.mandalaIcon}></Text>
          </View>
        </View>

        {/* Scrollable Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Personal Mission */}
          <MissionCard
            title="Personal"
            icon="star"
            color={colors.dark.accentPurple}
            content={personalMission}
          />

          {/* Connector */}
          <View style={styles.connector}>
            <View style={styles.connectorLine} />
            <Text style={styles.connectorDot}>*</Text>
            <View style={styles.connectorLine} />
          </View>

          {/* Professional Mission */}
          <MissionCard
            title="Professional"
            icon="briefcase"
            color="#1a4a6b"
            content={professionalMission}
          />

          {/* Connector */}
          <View style={styles.connector}>
            <View style={styles.connectorLine} />
            <Text style={styles.connectorDot}>*</Text>
            <View style={styles.connectorLine} />
          </View>

          {/* Impact Mission */}
          <MissionCard
            title="Impact"
            icon="handshake"
            color={colors.dark.accentGreen}
            content={impactMission}
          />

          {/* Connector */}
          <View style={styles.connector}>
            <View style={styles.connectorLine} />
            <Text style={styles.connectorDot}>*</Text>
            <View style={styles.connectorLine} />
          </View>

          {/* Legacy Mission */}
          <MissionCard
            title="Legacy"
            icon="tree"
            color={colors.dark.accentGold}
            content={legacyMission}
          />

          {/* Combined Statement Section - only if all complete */}
          {allComplete && (
            <View style={styles.combinedSection}>
              <View style={styles.combinedDivider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>Your Complete Mission</Text>
                <View style={styles.dividerLine} />
              </View>

              {combinedStatement ? (
                <View style={styles.combinedCard}>
                  <Text style={styles.combinedContent}>{combinedStatement}</Text>
                  {onEditCombined && (
                    <TouchableOpacity
                      onPress={onEditCombined}
                      style={styles.editButton}
                      testID={`${testID}-edit-combined`}
                    >
                      <Text style={styles.editButtonText}>Edit Statement</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ) : (
                <View style={styles.combinedCard}>
                  <Text style={styles.combinedHint}>
                    All four dimensions of your mission are complete!{'\n\n'}
                    Take time to reflect on how they connect and form your complete life mission.
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Inspirational Quote */}
          <View style={styles.quoteContainer}>
            <Text style={styles.quoteText}>
              "The two most important days in your life are the day you are born
              and the day you find out why."
            </Text>
            <Text style={styles.quoteAuthor}>- Mark Twain</Text>
          </View>

          {/* Bottom Spacer */}
          <View style={styles.bottomSpacer} />
        </ScrollView>
      </View>
    </Modal>
  );
};

/**
 * Styles - Dark Spiritual Theme
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.bgPrimary,
  },

  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: `${colors.dark.textTertiary}20`,
    alignItems: 'center',
  },

  headerTop: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: spacing.sm,
  },

  closeButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },

  closeText: {
    fontSize: 16,
    color: colors.dark.accentGold,
    fontWeight: '600',
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.dark.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },

  headerSubtitle: {
    fontSize: 14,
    color: colors.dark.textSecondary,
    textAlign: 'center',
  },

  mandalaDecor: {
    marginTop: spacing.sm,
    opacity: 0.3,
  },

  mandalaIcon: {
    fontSize: 24,
    color: colors.dark.accentGold,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    padding: spacing.md,
  },

  missionCard: {
    backgroundColor: colors.dark.bgElevated,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderLeftWidth: 4,
    ...shadows.sm,
  },

  emptyCard: {
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftColor: colors.dark.textTertiary,
    opacity: 0.6,
  },

  emptyIcon: {
    fontSize: 32,
    marginBottom: spacing.xs,
    opacity: 0.5,
  },

  emptyLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.dark.textTertiary,
    marginBottom: spacing.xs,
  },

  emptyHint: {
    fontSize: 12,
    color: colors.dark.textTertiary,
    fontStyle: 'italic',
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },

  cardIcon: {
    fontSize: 18,
    marginRight: spacing.xs,
  },

  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  cardContent: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.dark.textPrimary,
    fontStyle: 'italic',
  },

  connector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
  },

  connectorLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.dark.textTertiary,
    opacity: 0.2,
    maxWidth: 40,
  },

  connectorDot: {
    fontSize: 14,
    color: colors.dark.textTertiary,
    marginHorizontal: spacing.sm,
    opacity: 0.5,
  },

  combinedSection: {
    marginTop: spacing.lg,
  },

  combinedDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.dark.accentGold,
    opacity: 0.3,
  },

  dividerText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.dark.accentGold,
    marginHorizontal: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  combinedCard: {
    backgroundColor: `${colors.dark.accentGold}10`,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: `${colors.dark.accentGold}30`,
  },

  combinedContent: {
    fontSize: 18,
    lineHeight: 28,
    color: colors.dark.textPrimary,
    textAlign: 'center',
    fontStyle: 'italic',
  },

  combinedHint: {
    fontSize: 15,
    lineHeight: 24,
    color: colors.dark.textSecondary,
    textAlign: 'center',
  },

  editButton: {
    alignSelf: 'center',
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.dark.accentGold,
  },

  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.dark.bgPrimary,
  },

  quoteContainer: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
  },

  quoteText: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.dark.textTertiary,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: spacing.xs,
  },

  quoteAuthor: {
    fontSize: 12,
    color: colors.dark.textTertiary,
    fontWeight: '600',
  },

  bottomSpacer: {
    height: spacing.xl,
  },
});

export default CombinedMissionView;
