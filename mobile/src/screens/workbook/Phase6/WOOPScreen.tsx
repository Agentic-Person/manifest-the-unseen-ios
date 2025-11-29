/**
 * WOOPScreen - WOOP Manifestation Method
 *
 * Phase 6 screen implementing the WOOP (Wish, Outcome, Obstacle, Plan)
 * mental contrasting technique for goal achievement.
 *
 * Features:
 * - Step-by-step guided flow
 * - Wish: What do you want?
 * - Outcome: Best possible result
 * - Obstacle: Internal barriers
 * - Plan: If-then implementation
 * - Save multiple WOOP plans
 * - Review past WOOPs
 * - Dark spiritual theme
 *
 * @example
 * Navigation: WorkbookNavigator -> WOOP
 */

import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Text } from '../../../components';
import WOOPSection, { WOOPSectionType, WOOP_CONFIG } from '../../../components/workbook/WOOPSection';
import { colors, spacing, borderRadius, shadows } from '../../../theme';
import type { WorkbookStackScreenProps } from '../../../types/navigation';
import { useWorkbookProgress } from '../../../hooks/useWorkbook';
import { useAutoSave } from '../../../hooks/useAutoSave';
import { WORKSHEET_IDS } from '../../../types/workbook';
import { SaveIndicator } from '../../../components/workbook';

/**
 * WOOP Plan data structure
 */
interface WOOPPlan {
  id: string;
  wish: string;
  outcome: string;
  obstacle: string;
  plan: string;
  status: 'active' | 'completed' | 'archived';
  createdAt: string;
  updatedAt: string;
}

/**
 * Generate unique ID
 */
const generateId = (): string => {
  return `woop_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Create empty WOOP plan
 */
const createEmptyWOOP = (): WOOPPlan => ({
  id: generateId(),
  wish: '',
  outcome: '',
  obstacle: '',
  plan: '',
  status: 'active',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

type Props = WorkbookStackScreenProps<'WOOP'>;

/**
 * WOOPScreen Component
 */
/**
 * Interface for form data to save
 */
interface WOOPFormData {
  currentWOOP: WOOPPlan;
  savedWOOPs: WOOPPlan[];
}

const WOOPScreen: React.FC<Props> = ({ navigation: _navigation }) => {
  // State
  const [currentWOOP, setCurrentWOOP] = useState<WOOPPlan>(createEmptyWOOP());
  const [savedWOOPs, setSavedWOOPs] = useState<WOOPPlan[]>([]);
  const [activeSection, setActiveSection] = useState<WOOPSectionType>('wish');
  const [showSavedWOOPs, setShowSavedWOOPs] = useState(false);
  const [editingWOOPId, setEditingWOOPId] = useState<string | null>(null);

  // Refs
  const scrollViewRef = useRef<ScrollView>(null);

  // Supabase hooks
  const { data: savedProgress, isLoading: _isLoading } = useWorkbookProgress(6, WORKSHEET_IDS.WOOP);

  // Prepare form data for auto-save
  const formData: WOOPFormData = useMemo(() => ({
    currentWOOP,
    savedWOOPs,
  }), [currentWOOP, savedWOOPs]);

  const { isSaving, isError, lastSaved, saveNow } = useAutoSave({
    data: formData as unknown as Record<string, unknown>,
    phaseNumber: 6,
    worksheetId: WORKSHEET_IDS.WOOP,
    debounceMs: 2000,
  });

  /**
   * Load saved progress
   */
  useEffect(() => {
    if (savedProgress?.data) {
      const data = savedProgress.data as unknown as WOOPFormData;
      if (data.currentWOOP) setCurrentWOOP(data.currentWOOP);
      if (data.savedWOOPs) setSavedWOOPs(data.savedWOOPs);
    }
  }, [savedProgress]);

  /**
   * Handle section value change
   */
  const handleSectionChange = useCallback((section: WOOPSectionType, value: string) => {
    setCurrentWOOP(prev => ({
      ...prev,
      [section]: value,
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  /**
   * Handle section press (expand/collapse)
   */
  const handleSectionPress = useCallback((section: WOOPSectionType) => {
    setActiveSection(prev => prev === section ? section : section);
  }, []);

  /**
   * Navigate to next section
   */
  const handleNextSection = useCallback(() => {
    const sections: WOOPSectionType[] = ['wish', 'outcome', 'obstacle', 'plan'];
    const currentIndex = sections.indexOf(activeSection);
    if (currentIndex < sections.length - 1) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setActiveSection(sections[currentIndex + 1]);
      // Scroll to next section
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ y: (currentIndex + 1) * 200, animated: true });
      }, 100);
    }
  }, [activeSection]);

  /**
   * Navigate to previous section
   */
  const handlePrevSection = useCallback(() => {
    const sections: WOOPSectionType[] = ['wish', 'outcome', 'obstacle', 'plan'];
    const currentIndex = sections.indexOf(activeSection);
    if (currentIndex > 0) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setActiveSection(sections[currentIndex - 1]);
    }
  }, [activeSection]);

  /**
   * Save WOOP plan
   */
  const handleSaveWOOP = useCallback(() => {
    const isComplete = currentWOOP.wish && currentWOOP.outcome &&
                       currentWOOP.obstacle && currentWOOP.plan;

    if (!isComplete) {
      Alert.alert(
        'Incomplete WOOP',
        'Please complete all four sections before saving.',
        [{ text: 'OK' }]
      );
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    if (editingWOOPId) {
      // Update existing
      setSavedWOOPs(prev => prev.map(w =>
        w.id === editingWOOPId ? currentWOOP : w
      ));
    } else {
      // Save new
      setSavedWOOPs(prev => [currentWOOP, ...prev]);
    }

    // Reset form
    setCurrentWOOP(createEmptyWOOP());
    setActiveSection('wish');
    setEditingWOOPId(null);

    Alert.alert(
      'WOOP Saved!',
      'Your WOOP plan has been saved successfully.',
      [{ text: 'Great!' }]
    );
  }, [currentWOOP, editingWOOPId]);

  /**
   * Load WOOP for editing
   */
  const handleEditWOOP = useCallback((woop: WOOPPlan) => {
    setCurrentWOOP(woop);
    setEditingWOOPId(woop.id);
    setActiveSection('wish');
    setShowSavedWOOPs(false);
  }, []);

  /**
   * Delete WOOP plan
   */
  const handleDeleteWOOP = useCallback((woopId: string) => {
    Alert.alert(
      'Delete WOOP',
      'Are you sure you want to delete this WOOP plan?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            setSavedWOOPs(prev => prev.filter(w => w.id !== woopId));
          },
        },
      ]
    );
  }, []);

  /**
   * Mark WOOP as completed
   */
  const handleCompleteWOOP = useCallback((woopId: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setSavedWOOPs(prev => prev.map(w =>
      w.id === woopId
        ? { ...w, status: 'completed' as const, updatedAt: new Date().toISOString() }
        : w
    ));
  }, []);

  /**
   * Clear current WOOP
   */
  const handleClearWOOP = useCallback(() => {
    const hasContent = currentWOOP.wish || currentWOOP.outcome ||
                      currentWOOP.obstacle || currentWOOP.plan;

    if (hasContent) {
      Alert.alert(
        'Clear WOOP?',
        'This will clear all your current entries. Continue?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Clear',
            style: 'destructive',
            onPress: () => {
              setCurrentWOOP(createEmptyWOOP());
              setActiveSection('wish');
              setEditingWOOPId(null);
            },
          },
        ]
      );
    }
  }, [currentWOOP]);

  /**
   * Calculate progress
   */
  const calculateProgress = (): number => {
    let completed = 0;
    if (currentWOOP.wish.trim().length > 10) completed++;
    if (currentWOOP.outcome.trim().length > 10) completed++;
    if (currentWOOP.obstacle.trim().length > 10) completed++;
    if (currentWOOP.plan.trim().length > 10) completed++;
    return completed;
  };

  const progress = calculateProgress();
  const isComplete = progress === 4;
  const sections: WOOPSectionType[] = ['wish', 'outcome', 'obstacle', 'plan'];
  const currentSectionIndex = sections.indexOf(activeSection);

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.phaseLabel}>Phase 6</Text>
          <Text style={styles.title}>WOOP Method</Text>
          <Text style={styles.subtitle}>
            Turn your wishes into reality with mental contrasting
          </Text>

          {/* Decorative Divider */}
          <View style={styles.headerDivider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerSymbol}>{'\u2728'}</Text>
            <View style={styles.dividerLine} />
          </View>
        </View>

        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressDots}>
            {sections.map((section, _index) => {
              const config = WOOP_CONFIG[section];
              const isFilled = currentWOOP[section].trim().length > 10;
              const isActive = activeSection === section;
              return (
                <TouchableOpacity
                  key={section}
                  onPress={() => setActiveSection(section)}
                  style={styles.progressDotContainer}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: isActive }}
                  accessibilityLabel={`${config.title} section`}
                >
                  <View
                    style={[
                      styles.progressDot,
                      isFilled && { backgroundColor: config.color },
                      isActive && styles.progressDotActive,
                      isActive && { borderColor: config.color },
                    ]}
                  >
                    <Text style={[
                      styles.progressDotLetter,
                      isFilled && { color: colors.dark.bgPrimary },
                    ]}>
                      {config.letter}
                    </Text>
                  </View>
                  <Text style={[
                    styles.progressDotLabel,
                    isActive && { color: colors.dark.textPrimary },
                  ]}>
                    {config.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${(progress / 4) * 100}%` }]} />
          </View>
        </View>

        {/* Saved WOOPs Button */}
        {savedWOOPs.length > 0 && (
          <TouchableOpacity
            style={styles.savedButton}
            onPress={() => setShowSavedWOOPs(true)}
            accessibilityRole="button"
            accessibilityLabel={`View ${savedWOOPs.length} saved WOOP plans`}
            testID="saved-woops-button"
          >
            <Text style={styles.savedButtonIcon}>{'\uD83D\uDCCB'}</Text>
            <Text style={styles.savedButtonText}>
              My WOOPs ({savedWOOPs.length})
            </Text>
            <Text style={styles.chevron}>{'\u203A'}</Text>
          </TouchableOpacity>
        )}

        {/* WOOP Sections */}
        <View style={styles.sectionsContainer}>
          {sections.map(section => (
            <WOOPSection
              key={section}
              section={section}
              value={currentWOOP[section]}
              onChange={(value) => handleSectionChange(section, value)}
              isActive={activeSection === section}
              onPress={() => handleSectionPress(section)}
              style={styles.section}
              testID={`woop-section-${section}`}
            />
          ))}
        </View>

        {/* Navigation Buttons */}
        <View style={styles.navigationContainer}>
          {currentSectionIndex > 0 && (
            <TouchableOpacity
              style={styles.navButton}
              onPress={handlePrevSection}
              accessibilityRole="button"
              accessibilityLabel="Previous section"
              testID="prev-section"
            >
              <Text style={styles.navButtonText}>{'\u2190'} Previous</Text>
            </TouchableOpacity>
          )}

          <View style={{ flex: 1 }} />

          {currentSectionIndex < sections.length - 1 ? (
            <TouchableOpacity
              style={[styles.navButton, styles.navButtonPrimary]}
              onPress={handleNextSection}
              accessibilityRole="button"
              accessibilityLabel="Next section"
              testID="next-section"
            >
              <Text style={styles.navButtonPrimaryText}>Next {'\u2192'}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[
                styles.navButton,
                styles.navButtonPrimary,
                !isComplete && styles.navButtonDisabled,
              ]}
              onPress={handleSaveWOOP}
              disabled={!isComplete}
              accessibilityRole="button"
              accessibilityLabel="Save WOOP plan"
              accessibilityState={{ disabled: !isComplete }}
              testID="save-woop"
            >
              <Text style={[
                styles.navButtonPrimaryText,
                !isComplete && styles.navButtonTextDisabled,
              ]}>
                Save WOOP {'\u2713'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClearWOOP}
            accessibilityRole="button"
            accessibilityLabel="Clear current WOOP"
            testID="clear-woop"
          >
            <Text style={styles.clearButtonText}>Clear & Start New</Text>
          </TouchableOpacity>
        </View>

        {/* Explanation Card */}
        <View style={styles.explanationCard}>
          <Text style={styles.explanationTitle}>How WOOP Works</Text>
          <Text style={styles.explanationText}>
            WOOP combines positive thinking (Wish + Outcome) with realistic planning
            (Obstacle + Plan) to dramatically increase your chances of success.
          </Text>
          <View style={styles.explanationSteps}>
            {[
              { letter: 'W', text: 'Identify your heartfelt Wish' },
              { letter: 'O', text: 'Imagine the best possible Outcome' },
              { letter: 'O', text: 'Find your main inner Obstacle' },
              { letter: 'P', text: 'Make an if-then Plan to overcome it' },
            ].map((step, index) => (
              <View key={index} style={styles.stepRow}>
                <View style={[
                  styles.stepBadge,
                  { backgroundColor: Object.values(WOOP_CONFIG)[index].color },
                ]}>
                  <Text style={styles.stepLetter}>{step.letter}</Text>
                </View>
                <Text style={styles.stepText}>{step.text}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Inspirational Quote */}
        <View style={styles.quoteContainer}>
          <Text style={styles.quoteText}>
            "The obstacle is the way."
          </Text>
          <Text style={styles.quoteAuthor}>- Marcus Aurelius</Text>
        </View>

        {/* Bottom Spacer */}
        {/* Save Status */}
        <SaveIndicator isSaving={isSaving} lastSaved={lastSaved} isError={false} onRetry={saveNow} />

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Saved WOOPs Modal */}
      <Modal
        visible={showSavedWOOPs}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowSavedWOOPs(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => setShowSavedWOOPs(false)}
              accessibilityRole="button"
              accessibilityLabel="Close"
            >
              <Text style={styles.closeButton}>{'\u2715'}</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>My WOOPs</Text>
            <View style={{ width: 40 }} />
          </View>

          <ScrollView style={styles.savedList}>
            {savedWOOPs.map(woop => (
              <View
                key={woop.id}
                style={[
                  styles.savedCard,
                  woop.status === 'completed' && styles.savedCardCompleted,
                ]}
              >
                <TouchableOpacity
                  onPress={() => handleEditWOOP(woop)}
                  style={styles.savedCardContent}
                  accessibilityRole="button"
                  accessibilityLabel={`WOOP: ${woop.wish}`}
                >
                  <View style={styles.savedCardHeader}>
                    <Text style={styles.savedCardWish} numberOfLines={2}>
                      {woop.wish}
                    </Text>
                    {woop.status === 'completed' && (
                      <Text style={styles.completedBadge}>{'\u2713'}</Text>
                    )}
                  </View>
                  <Text style={styles.savedCardMeta}>
                    {new Date(woop.updatedAt).toLocaleDateString()}
                  </Text>

                  {/* WOOP Preview */}
                  <View style={styles.savedCardPreview}>
                    {(['wish', 'outcome', 'obstacle', 'plan'] as WOOPSectionType[]).map(section => {
                      const config = WOOP_CONFIG[section];
                      return (
                        <View key={section} style={styles.previewItem}>
                          <View style={[styles.previewDot, { backgroundColor: config.color }]} />
                          <Text style={styles.previewText} numberOfLines={1}>
                            {woop[section] || 'Not filled'}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                </TouchableOpacity>

                {/* Actions */}
                <View style={styles.savedCardActions}>
                  {woop.status !== 'completed' && (
                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={() => handleCompleteWOOP(woop.id)}
                      accessibilityRole="button"
                      accessibilityLabel="Mark as completed"
                    >
                      <Text style={styles.actionBtnText}>{'\u2713'} Complete</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.deleteBtn]}
                    onPress={() => handleDeleteWOOP(woop.id)}
                    accessibilityRole="button"
                    accessibilityLabel="Delete WOOP"
                  >
                    <Text style={styles.deleteBtnText}>{'\u2717'} Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {savedWOOPs.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>{'\uD83D\uDCCB'}</Text>
                <Text style={styles.emptyTitle}>No saved WOOPs yet</Text>
                <Text style={styles.emptySubtitle}>
                  Complete a WOOP plan and save it to see it here
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </Modal>
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
    alignItems: 'center',
    marginBottom: spacing.lg,
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

  dividerSymbol: {
    fontSize: 14,
    color: colors.dark.accentGold,
    marginHorizontal: spacing.sm,
  },

  progressContainer: {
    marginBottom: spacing.lg,
  },

  progressDots: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },

  progressDotContainer: {
    alignItems: 'center',
    flex: 1,
  },

  progressDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.dark.bgElevated,
    borderWidth: 2,
    borderColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs / 2,
  },

  progressDotActive: {
    borderWidth: 2,
    transform: [{ scale: 1.1 }],
  },

  progressDotLetter: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.dark.textSecondary,
  },

  progressDotLabel: {
    fontSize: 10,
    color: colors.dark.textTertiary,
    textAlign: 'center',
  },

  progressBarContainer: {
    height: 4,
    backgroundColor: `${colors.dark.textTertiary}30`,
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: spacing.sm,
  },

  progressBar: {
    height: '100%',
    backgroundColor: colors.dark.accentGold,
    borderRadius: 2,
  },

  savedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark.bgElevated,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.sm,
  },

  savedButtonIcon: {
    fontSize: 20,
    marginRight: spacing.sm,
  },

  savedButtonText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: colors.dark.textPrimary,
  },

  chevron: {
    fontSize: 24,
    color: colors.dark.textTertiary,
  },

  sectionsContainer: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },

  section: {
    // Additional styling if needed
  },

  navigationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },

  navButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.dark.bgElevated,
  },

  navButtonPrimary: {
    backgroundColor: colors.dark.accentGold,
  },

  navButtonDisabled: {
    backgroundColor: `${colors.dark.accentGold}50`,
  },

  navButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.dark.textSecondary,
  },

  navButtonPrimaryText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.dark.bgPrimary,
  },

  navButtonTextDisabled: {
    color: colors.dark.bgPrimary,
    opacity: 0.5,
  },

  actionButtons: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },

  clearButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },

  clearButtonText: {
    fontSize: 13,
    color: colors.dark.textTertiary,
  },

  explanationCard: {
    backgroundColor: colors.dark.bgElevated,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },

  explanationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.dark.textPrimary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },

  explanationText: {
    fontSize: 13,
    color: colors.dark.textSecondary,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: spacing.md,
  },

  explanationSteps: {
    gap: spacing.sm,
  },

  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },

  stepLetter: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.dark.bgPrimary,
  },

  stepText: {
    flex: 1,
    fontSize: 13,
    color: colors.dark.textSecondary,
  },

  quoteContainer: {
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.md,
  },

  quoteText: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.dark.textTertiary,
    textAlign: 'center',
    fontStyle: 'italic',
  },

  quoteAuthor: {
    fontSize: 12,
    color: colors.dark.textTertiary,
    marginTop: spacing.xs,
  },

  bottomSpacer: {
    height: 40,
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: colors.dark.bgPrimary,
  },

  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: `${colors.dark.textTertiary}20`,
  },

  closeButton: {
    fontSize: 20,
    color: colors.dark.textSecondary,
    padding: spacing.sm,
  },

  modalTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: colors.dark.textPrimary,
    textAlign: 'center',
  },

  savedList: {
    flex: 1,
    padding: spacing.md,
  },

  savedCard: {
    backgroundColor: colors.dark.bgElevated,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    overflow: 'hidden',
    ...shadows.sm,
  },

  savedCardCompleted: {
    borderLeftWidth: 3,
    borderLeftColor: colors.dark.accentGreen,
  },

  savedCardContent: {
    padding: spacing.md,
  },

  savedCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },

  savedCardWish: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: colors.dark.textPrimary,
    lineHeight: 20,
  },

  completedBadge: {
    fontSize: 16,
    color: colors.dark.accentGreen,
    marginLeft: spacing.sm,
  },

  savedCardMeta: {
    fontSize: 12,
    color: colors.dark.textTertiary,
    marginBottom: spacing.sm,
  },

  savedCardPreview: {
    gap: spacing.xs / 2,
  },

  previewItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  previewDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.sm,
  },

  previewText: {
    flex: 1,
    fontSize: 12,
    color: colors.dark.textSecondary,
  },

  savedCardActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: `${colors.dark.textTertiary}20`,
  },

  actionBtn: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: `${colors.dark.textTertiary}20`,
  },

  actionBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.dark.accentGreen,
  },

  deleteBtn: {
    borderRightWidth: 0,
  },

  deleteBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.dark.accentBurgundy,
  },

  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl * 2,
  },

  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.dark.textPrimary,
    marginBottom: spacing.xs,
  },

  emptySubtitle: {
    fontSize: 14,
    color: colors.dark.textSecondary,
    textAlign: 'center',
    maxWidth: 250,
  },
});

export default WOOPScreen;
