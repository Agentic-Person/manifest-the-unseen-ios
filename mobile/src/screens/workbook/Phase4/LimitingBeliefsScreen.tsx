/**
 * Limiting Beliefs Screen
 *
 * Phase 4 screen for cognitive restructuring exercises.
 * Three-column approach: Limiting Belief -> Evidence Against -> New Empowering Belief
 *
 * Features:
 * - List of belief restructuring cards
 * - Add belief modal with three-step form
 * - Progress indicator (beliefs restructured count)
 * - Inspirational quote about mindset
 * - Auto-save with debounce (stubbed for Supabase)
 * - Dark spiritual theme
 *
 * @example
 * Navigation: WorkbookNavigator -> LimitingBeliefs
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Text } from '../../../components';
import BeliefCard, { LimitingBelief } from '../../../components/workbook/BeliefCard';
import { SaveIndicator, ExerciseHeader } from '../../../components/workbook';
import { colors, spacing, borderRadius, shadows } from '../../../theme';
import type { WorkbookStackScreenProps } from '../../../types/navigation';
import { useWorkbookProgress } from '../../../hooks/useWorkbook';
import { useAutoSave } from '../../../hooks/useAutoSave';
import { WORKSHEET_IDS } from '../../../types/workbook';
import { Phase4ExerciseImages } from '../../../assets';

/**
 * Generate unique ID
 */
const generateId = (): string => {
  return `belief_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Sample beliefs for demonstration
 */
const SAMPLE_BELIEFS: LimitingBelief[] = [
  {
    id: 'sample_1',
    limitingBelief: 'I am not smart enough to succeed in my career',
    evidenceAgainst: 'I have completed challenging projects successfully. Colleagues often ask for my advice.',
    newBelief: 'I have unique skills and knowledge that contribute to my success',
    isComplete: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'sample_2',
    limitingBelief: 'People will judge me if I fail',
    evidenceAgainst: '',
    newBelief: '',
    isComplete: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

type Props = WorkbookStackScreenProps<'LimitingBeliefs'>;

/**
 * Form step type
 */
type FormStep = 'limiting' | 'evidence' | 'new';

/** Data structure for storing limiting beliefs data */
interface LimitingBeliefsData {
  beliefs: LimitingBelief[];
  updatedAt: string;
}

/**
 * Limiting Beliefs Screen Component
 */
const LimitingBeliefsScreen: React.FC<Props> = ({ navigation: _navigation }) => {
  // Fetch saved progress from Supabase
  const { data: savedProgress } = useWorkbookProgress(4, WORKSHEET_IDS.LIMITING_BELIEFS);

  // State
  const [beliefs, setBeliefs] = useState<LimitingBelief[]>(SAMPLE_BELIEFS);
  const [showModal, setShowModal] = useState(false);
  const [editingBelief, setEditingBelief] = useState<LimitingBelief | null>(null);
  const [currentStep, setCurrentStep] = useState<FormStep>('limiting');
  const [limitingBeliefText, setLimitingBeliefText] = useState('');
  const [evidenceText, setEvidenceText] = useState('');
  const [newBeliefText, setNewBeliefText] = useState('');

  // Animation refs
  const fabScale = useRef(new Animated.Value(1)).current;

  // Auto-save hook
  const { isSaving, isError, lastSaved, saveNow } = useAutoSave({
    data: { beliefs, updatedAt: new Date().toISOString() } as unknown as Record<string, unknown>,
    phaseNumber: 4,
    worksheetId: WORKSHEET_IDS.LIMITING_BELIEFS,
    debounceMs: 1500,
  });

  // Load saved data on mount
  useEffect(() => {
    if (savedProgress?.data) {
      const data = savedProgress.data as unknown as LimitingBeliefsData;
      if (data.beliefs) setBeliefs(data.beliefs);
    }
  }, [savedProgress]);

  /**
   * Handle adding a new belief
   */
  const handleAddBelief = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // FAB animation
    Animated.sequence([
      Animated.timing(fabScale, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(fabScale, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 5,
      }),
    ]).start();

    setEditingBelief(null);
    setLimitingBeliefText('');
    setEvidenceText('');
    setNewBeliefText('');
    setCurrentStep('limiting');
    setShowModal(true);
  }, [fabScale]);

  /**
   * Handle editing an existing belief
   */
  const handleEditBelief = useCallback((belief: LimitingBelief) => {
    setEditingBelief(belief);
    setLimitingBeliefText(belief.limitingBelief);
    setEvidenceText(belief.evidenceAgainst);
    setNewBeliefText(belief.newBelief);
    setCurrentStep('limiting');
    setShowModal(true);
  }, []);

  /**
   * Handle next step
   */
  const handleNextStep = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (currentStep === 'limiting') {
      setCurrentStep('evidence');
    } else if (currentStep === 'evidence') {
      setCurrentStep('new');
    }
  }, [currentStep]);

  /**
   * Handle previous step
   */
  const handlePrevStep = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (currentStep === 'evidence') {
      setCurrentStep('limiting');
    } else if (currentStep === 'new') {
      setCurrentStep('evidence');
    }
  }, [currentStep]);

  /**
   * Handle saving a belief
   */
  const handleSaveBelief = useCallback(() => {
    if (!limitingBeliefText.trim()) {
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const now = new Date().toISOString();
    const isComplete = Boolean(limitingBeliefText.trim() && evidenceText.trim() && newBeliefText.trim());

    if (editingBelief) {
      // Update existing belief
      setBeliefs(prev => prev.map(b =>
        b.id === editingBelief.id
          ? {
              ...b,
              limitingBelief: limitingBeliefText.trim(),
              evidenceAgainst: evidenceText.trim(),
              newBelief: newBeliefText.trim(),
              isComplete,
              updatedAt: now,
            }
          : b
      ));
    } else {
      // Create new belief
      const newBelief: LimitingBelief = {
        id: generateId(),
        limitingBelief: limitingBeliefText.trim(),
        evidenceAgainst: evidenceText.trim(),
        newBelief: newBeliefText.trim(),
        isComplete,
        createdAt: now,
        updatedAt: now,
      };
      setBeliefs(prev => [newBelief, ...prev]);
    }

    setShowModal(false);
    setEditingBelief(null);
  }, [limitingBeliefText, evidenceText, newBeliefText, editingBelief]);

  /**
   * Handle delete
   */
  const handleDeleteBelief = useCallback((beliefId: string) => {
    setBeliefs(prev => prev.filter(b => b.id !== beliefId));
  }, []);

  /**
   * Calculate stats
   */
  const stats = {
    total: beliefs.length,
    restructured: beliefs.filter(b => b.isComplete).length,
    inProgress: beliefs.filter(b => !b.isComplete).length,
  };

  /**
   * Get step configuration
   */
  const getStepConfig = () => {
    switch (currentStep) {
      case 'limiting':
        return {
          title: 'Step 1: Limiting Belief',
          icon: '\uD83D\uDEAB',
          description: 'What negative belief is holding you back?',
          placeholder: 'e.g., "I am not good enough to..."',
          value: limitingBeliefText,
          setValue: setLimitingBeliefText,
          color: colors.error[500],
        };
      case 'evidence':
        return {
          title: 'Step 2: Evidence Against',
          icon: '\uD83D\uDD0D',
          description: 'What facts or experiences contradict this belief?',
          placeholder: 'e.g., "I successfully completed..."',
          value: evidenceText,
          setValue: setEvidenceText,
          color: colors.dark.accentTeal,
        };
      case 'new':
        return {
          title: 'Step 3: New Empowering Belief',
          icon: '\u2728',
          description: 'Reframe this into a positive, empowering belief',
          placeholder: 'e.g., "I am capable of..."',
          value: newBeliefText,
          setValue: setNewBeliefText,
          color: colors.dark.accentGreen,
        };
    }
  };

  const stepConfig = getStepConfig();

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <ExerciseHeader
          image={Phase4ExerciseImages.limitingBeliefs}
          title="Limiting Beliefs"
          subtitle="Transform negative thought patterns into empowering beliefs"
          progress={savedProgress?.completed ? 100 : 0}
        />

        {/* Progress Stats Card */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total Beliefs</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.dark.accentGreen }]}>
              {stats.restructured}
            </Text>
            <Text style={styles.statLabel}>Restructured</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.dark.accentGold }]}>
              {stats.inProgress}
            </Text>
            <Text style={styles.statLabel}>In Progress</Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Transformation Progress</Text>
            <Text style={styles.progressPercent}>
              {stats.total > 0 ? Math.round((stats.restructured / stats.total) * 100) : 0}%
            </Text>
          </View>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${stats.total > 0 ? (stats.restructured / stats.total) * 100 : 0}%` },
              ]}
            />
          </View>
        </View>

        {/* Save Status Indicator */}
        <SaveIndicator isSaving={isSaving} lastSaved={lastSaved} isError={isError} onRetry={saveNow} />

        {/* How It Works Card */}
        <View style={styles.howItWorksCard}>
          <Text style={styles.howItWorksTitle}>How Cognitive Restructuring Works</Text>
          <View style={styles.processFlow}>
            <View style={styles.processStep}>
              <View style={[styles.processIcon, { backgroundColor: `${colors.error[500]}30` }]}>
                <Text style={styles.processEmoji}>{'\uD83D\uDEAB'}</Text>
              </View>
              <Text style={styles.processLabel}>Identify</Text>
            </View>
            <Text style={styles.processArrow}>{'\u2192'}</Text>
            <View style={styles.processStep}>
              <View style={[styles.processIcon, { backgroundColor: `${colors.dark.accentTeal}30` }]}>
                <Text style={styles.processEmoji}>{'\uD83D\uDD0D'}</Text>
              </View>
              <Text style={styles.processLabel}>Challenge</Text>
            </View>
            <Text style={styles.processArrow}>{'\u2192'}</Text>
            <View style={styles.processStep}>
              <View style={[styles.processIcon, { backgroundColor: `${colors.dark.accentGreen}30` }]}>
                <Text style={styles.processEmoji}>{'\u2728'}</Text>
              </View>
              <Text style={styles.processLabel}>Reframe</Text>
            </View>
          </View>
        </View>

        {/* Beliefs List */}
        <View style={styles.beliefsContainer}>
          <Text style={styles.sectionTitle}>Your Beliefs</Text>
          {beliefs.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>{'\uD83E\uDDE0'}</Text>
              <Text style={styles.emptyTitle}>No beliefs recorded</Text>
              <Text style={styles.emptySubtitle}>
                Tap the + button to start restructuring your first limiting belief
              </Text>
            </View>
          ) : (
            beliefs.map(belief => (
              <BeliefCard
                key={belief.id}
                belief={belief}
                onEdit={() => handleEditBelief(belief)}
                onDelete={() => handleDeleteBelief(belief.id)}
                testID={`belief-card-${belief.id}`}
              />
            ))
          )}
        </View>

        {/* Inspirational Quote */}
        <View style={styles.quoteContainer}>
          <Text style={styles.quoteText}>
            "Whether you think you can or you think you can't, you're right."
          </Text>
          <Text style={styles.quoteAuthor}>- Henry Ford</Text>
        </View>

        {/* Bottom Spacer for FAB */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Floating Action Button */}
      <Animated.View
        style={[
          styles.fabContainer,
          { transform: [{ scale: fabScale }] },
        ]}
      >
        <TouchableOpacity
          style={styles.fab}
          onPress={handleAddBelief}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Add new belief"
          accessibilityHint="Opens form to restructure a limiting belief"
          testID="add-belief-fab"
        >
          <Text style={styles.fabIcon}>+</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Add/Edit Belief Modal */}
      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingBelief ? 'Edit Belief' : 'Restructure Belief'}
              </Text>
              <TouchableOpacity
                onPress={() => setShowModal(false)}
                accessibilityRole="button"
                accessibilityLabel="Close"
                testID="modal-close"
              >
                <Text style={styles.modalClose}>{'\u00D7'}</Text>
              </TouchableOpacity>
            </View>

            {/* Step Indicator */}
            <View style={styles.stepIndicator}>
              {['limiting', 'evidence', 'new'].map((step, index) => (
                <View key={step} style={styles.stepDot}>
                  <View
                    style={[
                      styles.stepDotInner,
                      currentStep === step && styles.stepDotActive,
                      (currentStep === 'evidence' && index === 0) ||
                      (currentStep === 'new' && index <= 1)
                        ? styles.stepDotComplete
                        : null,
                    ]}
                  />
                  {index < 2 && (
                    <View
                      style={[
                        styles.stepLine,
                        (currentStep === 'evidence' && index === 0) ||
                        (currentStep === 'new')
                          ? styles.stepLineActive
                          : null,
                      ]}
                    />
                  )}
                </View>
              ))}
            </View>

            {/* Step Content */}
            <View style={styles.stepContent}>
              <View style={styles.stepHeader}>
                <Text style={styles.stepIcon}>{stepConfig.icon}</Text>
                <Text style={[styles.stepTitle, { color: stepConfig.color }]}>
                  {stepConfig.title}
                </Text>
              </View>
              <Text style={styles.stepDescription}>{stepConfig.description}</Text>

              <TextInput
                style={[styles.textInput, { borderColor: `${stepConfig.color}50` }]}
                value={stepConfig.value}
                onChangeText={stepConfig.setValue}
                placeholder={stepConfig.placeholder}
                placeholderTextColor={colors.dark.textTertiary}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                accessibilityLabel={stepConfig.title}
                testID={`belief-${currentStep}-input`}
              />
            </View>

            {/* Action Buttons */}
            <View style={styles.modalActions}>
              {currentStep !== 'limiting' && (
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={handlePrevStep}
                  accessibilityRole="button"
                  accessibilityLabel="Previous step"
                  testID="modal-back"
                >
                  <Text style={styles.backButtonText}>{'\u2190'} Back</Text>
                </TouchableOpacity>
              )}

              {currentStep === 'limiting' && (
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setShowModal(false)}
                  accessibilityRole="button"
                  accessibilityLabel="Cancel"
                  testID="modal-cancel"
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              )}

              {currentStep !== 'new' ? (
                <TouchableOpacity
                  style={[styles.nextButton, !stepConfig.value.trim() && styles.buttonDisabled]}
                  onPress={handleNextStep}
                  disabled={!stepConfig.value.trim() && currentStep === 'limiting'}
                  accessibilityRole="button"
                  accessibilityLabel="Next step"
                  testID="modal-next"
                >
                  <Text style={styles.nextButtonText}>Next {'\u2192'}</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.saveButton, !limitingBeliefText.trim() && styles.buttonDisabled]}
                  onPress={handleSaveBelief}
                  disabled={!limitingBeliefText.trim()}
                  accessibilityRole="button"
                  accessibilityLabel="Save belief"
                  testID="modal-save"
                >
                  <Text style={styles.saveButtonText}>
                    {editingBelief ? 'Update' : 'Save'} {'\u2713'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </KeyboardAvoidingView>
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
    paddingHorizontal: spacing.md,
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

  statsCard: {
    backgroundColor: colors.dark.bgElevated,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: spacing.md,
    ...shadows.sm,
  },

  statItem: {
    alignItems: 'center',
    flex: 1,
  },

  statNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.dark.textPrimary,
  },

  statLabel: {
    fontSize: 11,
    color: colors.dark.textSecondary,
    marginTop: 2,
    textAlign: 'center',
  },

  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: `${colors.dark.textTertiary}30`,
  },

  progressContainer: {
    backgroundColor: colors.dark.bgElevated,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.sm,
  },

  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },

  progressTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.dark.textPrimary,
  },

  progressPercent: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.dark.accentGold,
  },

  progressTrack: {
    height: 8,
    backgroundColor: `${colors.dark.textTertiary}30`,
    borderRadius: 4,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: colors.dark.accentGreen,
    borderRadius: 4,
  },

  howItWorksCard: {
    backgroundColor: colors.dark.bgElevated,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },

  howItWorksTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.dark.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },

  processFlow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  processStep: {
    alignItems: 'center',
  },

  processIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },

  processEmoji: {
    fontSize: 20,
  },

  processLabel: {
    fontSize: 11,
    color: colors.dark.textSecondary,
    fontWeight: '600',
  },

  processArrow: {
    fontSize: 20,
    color: colors.dark.accentGold,
    marginHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },

  beliefsContainer: {
    marginBottom: spacing.md,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.dark.textPrimary,
    marginBottom: spacing.md,
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
    fontSize: 20,
    fontWeight: '700',
    color: colors.dark.textPrimary,
    marginBottom: spacing.xs,
  },

  emptySubtitle: {
    fontSize: 14,
    color: colors.dark.textSecondary,
    textAlign: 'center',
    maxWidth: 280,
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
    height: 100,
  },

  fabContainer: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.lg,
    ...shadows.lg,
  },

  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.dark.accentGold,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.md,
  },

  fabIcon: {
    fontSize: 32,
    fontWeight: '300',
    color: colors.dark.bgPrimary,
    lineHeight: 34,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },

  modalContent: {
    backgroundColor: colors.dark.bgElevated,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.lg,
    maxHeight: '85%',
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.dark.textPrimary,
  },

  modalClose: {
    fontSize: 28,
    color: colors.dark.textTertiary,
    fontWeight: '300',
    lineHeight: 28,
  },

  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },

  stepDot: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  stepDotInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: `${colors.dark.textTertiary}50`,
  },

  stepDotActive: {
    backgroundColor: colors.dark.accentGold,
    transform: [{ scale: 1.2 }],
  },

  stepDotComplete: {
    backgroundColor: colors.dark.accentGreen,
  },

  stepLine: {
    width: 60,
    height: 2,
    backgroundColor: `${colors.dark.textTertiary}30`,
    marginHorizontal: spacing.xs,
  },

  stepLineActive: {
    backgroundColor: colors.dark.accentGreen,
  },

  stepContent: {
    marginBottom: spacing.lg,
  },

  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
    gap: spacing.sm,
  },

  stepIcon: {
    fontSize: 20,
  },

  stepTitle: {
    fontSize: 16,
    fontWeight: '700',
  },

  stepDescription: {
    fontSize: 14,
    color: colors.dark.textSecondary,
    marginBottom: spacing.md,
  },

  textInput: {
    backgroundColor: colors.dark.bgPrimary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: 16,
    color: colors.dark.textPrimary,
    minHeight: 120,
    borderWidth: 1,
  },

  modalActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },

  cancelButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: `${colors.dark.textTertiary}20`,
    alignItems: 'center',
  },

  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark.textSecondary,
  },

  backButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: `${colors.dark.textTertiary}20`,
    alignItems: 'center',
  },

  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark.textSecondary,
  },

  nextButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.dark.accentTeal,
    alignItems: 'center',
  },

  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark.textPrimary,
  },

  saveButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.dark.accentGold,
    alignItems: 'center',
  },

  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark.bgPrimary,
  },

  buttonDisabled: {
    opacity: 0.5,
  },
});

export default LimitingBeliefsScreen;
