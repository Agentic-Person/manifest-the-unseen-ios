/**
 * Life Mission Screen
 *
 * Phase 2 worksheet for defining the user's life mission across four dimensions:
 * Personal, Professional, Impact, and Legacy.
 *
 * Features:
 * - Four expandable mission sections with guiding prompts
 * - Auto-save with debounce
 * - Combined mission statement view
 * - Dark spiritual theme
 * - Smooth animations
 */

import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Text } from '../../../components';
import MissionSection, { MissionId } from '../../../components/workbook/MissionSection';
import CombinedMissionView from '../../../components/workbook/CombinedMissionView';
import { SaveIndicator } from '../../../components/workbook';
import { colors, spacing, borderRadius, shadows } from '../../../theme';
import type { WorkbookStackScreenProps } from '../../../types/navigation';
import { useWorkbookProgress } from '../../../hooks/useWorkbook';
import { useAutoSave } from '../../../hooks/useAutoSave';
import { WORKSHEET_IDS } from '../../../types/workbook';

/**
 * Life Mission Data Structure
 */
export interface LifeMissionData {
  personalMission: string;
  professionalMission: string;
  impactMission: string;
  legacyMission: string;
  combinedStatement: string;
  updatedAt: string;
}

/**
 * Mission Section Configuration
 */
interface MissionSectionConfig {
  id: MissionId;
  title: string;
  subtitle: string;
  prompt: string;
  icon: string;
  color: string;
}

/**
 * Section configurations for the four mission dimensions
 */
const MISSION_SECTIONS: MissionSectionConfig[] = [
  {
    id: 'personal',
    title: 'Personal Mission',
    subtitle: 'Who I am at my core',
    prompt: 'Describe the person you aspire to be. What character traits define you? What values guide your decisions? Who are you when you are at your best?',
    icon: '\u2B50', // Star
    color: '#4a1a6b', // Deep purple
  },
  {
    id: 'professional',
    title: 'Professional Mission',
    subtitle: 'What I contribute through my work',
    prompt: 'What impact do you want to make through your career or creative work? How do you want to grow professionally? What problems do you want to solve?',
    icon: '\uD83D\uDCBC', // Briefcase
    color: '#1a4a6b', // Deep blue
  },
  {
    id: 'impact',
    title: 'Impact Mission',
    subtitle: 'How I serve others',
    prompt: 'How do you want to help others and contribute to your community? What causes matter most to you? How can you make a difference in the world?',
    icon: '\uD83E\uDD1D', // Handshake
    color: '#2d5a4a', // Forest green
  },
  {
    id: 'legacy',
    title: 'Legacy Mission',
    subtitle: 'What I leave behind',
    prompt: 'When people remember you, what do you want them to say? What lasting impact do you want to have? What wisdom do you want to pass on?',
    icon: '\uD83C\uDF33', // Tree
    color: '#6b5a1a', // Gold tint
  },
];

type Props = WorkbookStackScreenProps<'LifeMission'>;

/**
 * Life Mission Screen Component
 */
const LifeMissionScreen: React.FC<Props> = ({ navigation: _navigation }) => {
  // Fetch saved progress from Supabase
  const { data: savedProgress } = useWorkbookProgress(2, WORKSHEET_IDS.LIFE_MISSION);

  // State for mission data
  const [missionData, setMissionData] = useState<LifeMissionData>({
    personalMission: '',
    professionalMission: '',
    impactMission: '',
    legacyMission: '',
    combinedStatement: '',
    updatedAt: new Date().toISOString(),
  });

  // State for expanded sections (allow only one at a time)
  const [expandedSection, setExpandedSection] = useState<MissionId | null>('personal');

  // State for combined view modal
  const [showCombinedView, setShowCombinedView] = useState(false);

  // Auto-save hook
  const { isSaving, isError, lastSaved, saveNow } = useAutoSave({
    data: missionData as unknown as Record<string, unknown>,
    phaseNumber: 2,
    worksheetId: WORKSHEET_IDS.LIFE_MISSION,
    debounceMs: 1500,
  });

  // Load saved data on mount
  useEffect(() => {
    if (savedProgress?.data) {
      setMissionData(savedProgress.data as unknown as LifeMissionData);
    }
  }, [savedProgress]);

  /**
   * Handle text change for a mission section
   */
  const handleMissionChange = useCallback((sectionId: MissionId, text: string) => {
    setMissionData(prev => {
      const key = `${sectionId}Mission` as keyof LifeMissionData;
      return {
        ...prev,
        [key]: text,
        updatedAt: new Date().toISOString(),
      };
    });
  }, []);

  /**
   * Toggle section expansion
   */
  const handleToggleSection = useCallback((sectionId: MissionId) => {
    setExpandedSection(prev => prev === sectionId ? null : sectionId);
  }, []);

  /**
   * Get mission text by section ID
   */
  const getMissionText = (sectionId: MissionId): string => {
    const key = `${sectionId}Mission` as keyof LifeMissionData;
    return missionData[key] as string;
  };

  /**
   * Calculate completion progress
   */
  const calculateProgress = useCallback(() => {
    const sections = ['personal', 'professional', 'impact', 'legacy'] as const;
    const completed = sections.filter(s => getMissionText(s).trim().length > 50).length;
    return {
      completed,
      total: 4,
      percentage: Math.round((completed / 4) * 100),
    };
  }, [missionData]);

  const progress = calculateProgress();

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.phaseLabel}>Phase 2</Text>
          <Text style={styles.title}>Life Mission</Text>
          <Text style={styles.subtitle}>
            Define your purpose across four dimensions of life
          </Text>

          {/* Hand-drawn decorative divider */}
          <View style={styles.headerDivider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerStar}>\u2726</Text>
            <View style={styles.dividerLine} />
          </View>
        </View>

        {/* Progress Card */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Your Progress</Text>
            <Text style={styles.progressPercentage}>{progress.percentage}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${progress.percentage}%` },
              ]}
            />
          </View>
          <Text style={styles.progressSubtext}>
            {progress.completed} of {progress.total} missions written
          </Text>
        </View>

        {/* Save Status Indicator */}
        <SaveIndicator isSaving={isSaving} lastSaved={lastSaved} isError={isError} onRetry={saveNow} />

        {/* Mission Sections */}
        <View style={styles.sectionsContainer}>
          {MISSION_SECTIONS.map((section) => (
            <MissionSection
              key={section.id}
              id={section.id}
              title={section.title}
              subtitle={section.subtitle}
              prompt={section.prompt}
              icon={section.icon}
              color={section.color}
              value={getMissionText(section.id)}
              onChangeText={(text) => handleMissionChange(section.id, text)}
              isExpanded={expandedSection === section.id}
              onToggle={() => handleToggleSection(section.id)}
              testID={`mission-section-${section.id}`}
            />
          ))}
        </View>

        {/* View Combined Mission Button */}
        <TouchableOpacity
          style={[
            styles.viewCombinedButton,
            progress.completed < 1 && styles.viewCombinedButtonDisabled,
          ]}
          onPress={() => setShowCombinedView(true)}
          disabled={progress.completed < 1}
          accessibilityRole="button"
          accessibilityLabel="View combined mission statement"
          accessibilityHint="Opens a view with all your mission statements combined"
          testID="view-combined-button"
        >
          <Text style={styles.viewCombinedIcon}>\u2728</Text>
          <Text style={styles.viewCombinedText}>
            View Your Complete Mission
          </Text>
        </TouchableOpacity>

        {/* Inspirational Quote */}
        <View style={styles.quoteContainer}>
          <Text style={styles.quoteText}>
            "Your life mission is not something to be created, but something to be discovered."
          </Text>
        </View>

        {/* Bottom Spacer */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Combined Mission View Modal */}
      <CombinedMissionView
        personalMission={missionData.personalMission}
        professionalMission={missionData.professionalMission}
        impactMission={missionData.impactMission}
        legacyMission={missionData.legacyMission}
        combinedStatement={missionData.combinedStatement}
        visible={showCombinedView}
        onClose={() => setShowCombinedView(false)}
        testID="combined-mission-modal"
      />
    </View>
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

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    padding: spacing.md,
  },

  header: {
    marginBottom: spacing.lg,
    alignItems: 'center',
  },

  phaseLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.dark.accentGold,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: spacing.xs,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.dark.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },

  subtitle: {
    fontSize: 15,
    color: colors.dark.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },

  headerDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    width: '60%',
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.dark.textTertiary,
    opacity: 0.3,
  },

  dividerStar: {
    fontSize: 14,
    color: colors.dark.accentGold,
    marginHorizontal: spacing.sm,
  },

  progressCard: {
    backgroundColor: colors.dark.bgElevated,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },

  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },

  progressLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.dark.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  progressPercentage: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.dark.accentGold,
  },

  progressBar: {
    height: 6,
    backgroundColor: `${colors.dark.textTertiary}30`,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },

  progressFill: {
    height: '100%',
    backgroundColor: colors.dark.accentGold,
    borderRadius: borderRadius.full,
  },

  progressSubtext: {
    fontSize: 13,
    color: colors.dark.textTertiary,
  },

  sectionsContainer: {
    marginBottom: spacing.md,
  },

  viewCombinedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.dark.accentPurple,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.md,
  },

  viewCombinedButtonDisabled: {
    backgroundColor: colors.dark.bgElevated,
    opacity: 0.5,
  },

  viewCombinedIcon: {
    fontSize: 20,
    marginRight: spacing.sm,
  },

  viewCombinedText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark.textPrimary,
  },

  quoteContainer: {
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },

  quoteText: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.dark.textTertiary,
    textAlign: 'center',
    fontStyle: 'italic',
  },

  bottomSpacer: {
    height: spacing.xl,
  },
});

export default LifeMissionScreen;
