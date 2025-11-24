/**
 * Fear Facing Plan Screen
 *
 * Phase 4 screen for creating step-by-step exposure plans to face fears.
 * Implements systematic desensitization approach.
 *
 * Features:
 * - Select fear from inventory
 * - Create gradual exposure steps
 * - Checkbox completion tracking
 * - Courage meter showing progress
 * - Celebration animation on plan completion
 * - Tips on systematic desensitization
 * - Auto-save with debounce (stubbed for Supabase)
 * - Dark spiritual theme
 *
 * @example
 * Navigation: WorkbookNavigator -> FearFacingPlan
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
import { Fear, FEAR_CATEGORIES, FearCategory } from '../../../components/workbook/FearCard';
import { colors, spacing, borderRadius, shadows } from '../../../theme';
import type { WorkbookStackScreenProps } from '../../../types/navigation';

/**
 * Generate unique ID
 */
const generateId = (): string => {
  return `step_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Exposure step data structure
 */
interface ExposureStep {
  id: string;
  description: string;
  isCompleted: boolean;
  completedAt?: string;
}

/**
 * Fear facing plan data structure
 */
interface FearFacingPlan {
  id: string;
  fearId: string;
  fearText: string;
  fearCategory: FearCategory;
  steps: ExposureStep[];
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Sample fears for selection (would come from FearInventory in real app)
 */
const SAMPLE_FEARS: Fear[] = [
  {
    id: 'fear_1',
    text: 'Fear of public speaking',
    category: 'career',
    intensity: 8,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'fear_2',
    text: 'Fear of rejection in relationships',
    category: 'relationships',
    intensity: 7,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'fear_3',
    text: 'Fear of financial instability',
    category: 'financial',
    intensity: 6,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

/**
 * Sample plan for demonstration
 */
const SAMPLE_PLANS: FearFacingPlan[] = [
  {
    id: 'plan_1',
    fearId: 'fear_1',
    fearText: 'Fear of public speaking',
    fearCategory: 'career',
    steps: [
      { id: 'step_1', description: 'Practice speaking in front of a mirror for 5 minutes', isCompleted: true, completedAt: new Date().toISOString() },
      { id: 'step_2', description: 'Record yourself speaking and watch it back', isCompleted: true, completedAt: new Date().toISOString() },
      { id: 'step_3', description: 'Present to one trusted friend or family member', isCompleted: false },
      { id: 'step_4', description: 'Lead a small team meeting at work', isCompleted: false },
      { id: 'step_5', description: 'Give a presentation to a larger group', isCompleted: false },
    ],
    isCompleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

type Props = WorkbookStackScreenProps<'FearFacingPlan'>;

/**
 * Fear Facing Plan Screen Component
 */
const FearFacingPlanScreen: React.FC<Props> = ({ navigation: _navigation }) => {
  // State
  const [plans, setPlans] = useState<FearFacingPlan[]>(SAMPLE_PLANS);
  const [availableFears] = useState<Fear[]>(SAMPLE_FEARS);
  const [showFearModal, setShowFearModal] = useState(false);
  const [showStepModal, setShowStepModal] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [newStepText, setNewStepText] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);

  // Animation refs
  const fabScale = useRef(new Animated.Value(1)).current;
  const celebrationScale = useRef(new Animated.Value(0)).current;
  const celebrationOpacity = useRef(new Animated.Value(0)).current;

  // Auto-save debounce timer
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Trigger auto-save (stubbed for Supabase)
   */
  const triggerAutoSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      console.log('[FearFacingPlan] Auto-saving plans...', new Date().toISOString());
    }, 2000);
  }, []);

  /**
   * Show celebration animation
   */
  const triggerCelebration = useCallback(() => {
    setShowCelebration(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    Animated.parallel([
      Animated.spring(celebrationScale, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 5,
      }),
      Animated.timing(celebrationOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      Animated.parallel([
        Animated.timing(celebrationScale, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(celebrationOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowCelebration(false);
      });
    }, 2500);
  }, [celebrationScale, celebrationOpacity]);

  /**
   * Handle creating a new plan
   */
  const handleCreatePlan = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

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

    setShowFearModal(true);
  }, [fabScale]);

  /**
   * Handle selecting a fear to create plan
   */
  const handleSelectFear = useCallback((fear: Fear) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const newPlan: FearFacingPlan = {
      id: generateId(),
      fearId: fear.id,
      fearText: fear.text,
      fearCategory: fear.category,
      steps: [],
      isCompleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setPlans(prev => [newPlan, ...prev]);
    setShowFearModal(false);
    setSelectedPlanId(newPlan.id);
    triggerAutoSave();
  }, [triggerAutoSave]);

  /**
   * Handle adding a step to a plan
   */
  const handleAddStep = useCallback(() => {
    if (!newStepText.trim() || !selectedPlanId) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const newStep: ExposureStep = {
      id: generateId(),
      description: newStepText.trim(),
      isCompleted: false,
    };

    setPlans(prev => prev.map(plan =>
      plan.id === selectedPlanId
        ? {
            ...plan,
            steps: [...plan.steps, newStep],
            updatedAt: new Date().toISOString(),
          }
        : plan
    ));

    setNewStepText('');
    setShowStepModal(false);
    triggerAutoSave();
  }, [newStepText, selectedPlanId, triggerAutoSave]);

  /**
   * Handle toggling step completion
   */
  const handleToggleStep = useCallback((planId: string, stepId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    setPlans(prev => {
      const updated = prev.map(plan => {
        if (plan.id !== planId) return plan;

        const updatedSteps = plan.steps.map(step =>
          step.id === stepId
            ? {
                ...step,
                isCompleted: !step.isCompleted,
                completedAt: !step.isCompleted ? new Date().toISOString() : undefined,
              }
            : step
        );

        const allCompleted = updatedSteps.length > 0 && updatedSteps.every(s => s.isCompleted);

        return {
          ...plan,
          steps: updatedSteps,
          isCompleted: allCompleted,
          updatedAt: new Date().toISOString(),
        };
      });

      // Check if plan just completed
      const plan = updated.find(p => p.id === planId);
      const prevPlan = prev.find(p => p.id === planId);
      if (plan?.isCompleted && !prevPlan?.isCompleted) {
        triggerCelebration();
      }

      return updated;
    });

    triggerAutoSave();
  }, [triggerAutoSave, triggerCelebration]);

  /**
   * Handle deleting a plan
   */
  const handleDeletePlan = useCallback((planId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setPlans(prev => prev.filter(p => p.id !== planId));
    if (selectedPlanId === planId) {
      setSelectedPlanId(null);
    }
    triggerAutoSave();
  }, [selectedPlanId, triggerAutoSave]);

  /**
   * Get the selected plan
   */
  const selectedPlan = plans.find(p => p.id === selectedPlanId);

  /**
   * Calculate courage meter
   */
  const getCourageMeter = (plan: FearFacingPlan): number => {
    if (plan.steps.length === 0) return 0;
    return Math.round((plan.steps.filter(s => s.isCompleted).length / plan.steps.length) * 100);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.phaseLabel}>Phase 4</Text>
          <Text style={styles.title}>Fear Facing Plan</Text>
          <Text style={styles.subtitle}>
            Create step-by-step plans to gradually overcome your fears
          </Text>

          <View style={styles.headerDivider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerStar}>{'\u2726'}</Text>
            <View style={styles.dividerLine} />
          </View>
        </View>

        {/* Plans List */}
        <View style={styles.plansSection}>
          <Text style={styles.sectionTitle}>Your Plans</Text>

          {plans.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>{'\uD83D\uDCAA'}</Text>
              <Text style={styles.emptyTitle}>No plans yet</Text>
              <Text style={styles.emptySubtitle}>
                Tap the + button to create your first fear facing plan
              </Text>
            </View>
          ) : (
            plans.map(plan => (
              <TouchableOpacity
                key={plan.id}
                style={[
                  styles.planCard,
                  selectedPlanId === plan.id && styles.planCardSelected,
                  plan.isCompleted && styles.planCardCompleted,
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setSelectedPlanId(plan.id === selectedPlanId ? null : plan.id);
                }}
                onLongPress={() => handleDeletePlan(plan.id)}
                accessibilityRole="button"
                accessibilityLabel={`Fear facing plan: ${plan.fearText}`}
                accessibilityHint="Tap to expand, long press to delete"
                testID={`plan-card-${plan.id}`}
              >
                {/* Plan Header */}
                <View style={styles.planHeader}>
                  <View style={[
                    styles.categoryBadge,
                    { backgroundColor: `${FEAR_CATEGORIES[plan.fearCategory].color}25` },
                  ]}>
                    <Text style={styles.categoryIcon}>
                      {FEAR_CATEGORIES[plan.fearCategory].icon}
                    </Text>
                    <Text style={[
                      styles.categoryText,
                      { color: FEAR_CATEGORIES[plan.fearCategory].color },
                    ]}>
                      {FEAR_CATEGORIES[plan.fearCategory].label}
                    </Text>
                  </View>
                  {plan.isCompleted && (
                    <View style={styles.completedBadge}>
                      <Text style={styles.completedText}>{'\u2713'} Conquered</Text>
                    </View>
                  )}
                </View>

                <Text style={styles.planFearText}>{plan.fearText}</Text>

                {/* Courage Meter */}
                <View style={styles.courageMeter}>
                  <View style={styles.courageMeterHeader}>
                    <Text style={styles.courageMeterLabel}>Courage Meter</Text>
                    <Text style={styles.courageMeterPercent}>{getCourageMeter(plan)}%</Text>
                  </View>
                  <View style={styles.courageMeterTrack}>
                    <View
                      style={[
                        styles.courageMeterFill,
                        { width: `${getCourageMeter(plan)}%` },
                        plan.isCompleted && styles.courageMeterComplete,
                      ]}
                    />
                  </View>
                </View>

                <Text style={styles.stepCount}>
                  {plan.steps.filter(s => s.isCompleted).length} / {plan.steps.length} steps completed
                </Text>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Selected Plan Steps */}
        {selectedPlan && (
          <View style={styles.stepsSection}>
            <View style={styles.stepsSectionHeader}>
              <Text style={styles.sectionTitle}>Exposure Steps</Text>
              <TouchableOpacity
                style={styles.addStepButton}
                onPress={() => setShowStepModal(true)}
                accessibilityRole="button"
                accessibilityLabel="Add step"
                testID="add-step-button"
              >
                <Text style={styles.addStepButtonText}>+ Add Step</Text>
              </TouchableOpacity>
            </View>

            {selectedPlan.steps.length === 0 ? (
              <View style={styles.noStepsState}>
                <Text style={styles.noStepsText}>
                  Add gradual steps to face this fear. Start with the easiest and work your way up.
                </Text>
              </View>
            ) : (
              selectedPlan.steps.map((step, index) => (
                <TouchableOpacity
                  key={step.id}
                  style={styles.stepItem}
                  onPress={() => handleToggleStep(selectedPlan.id, step.id)}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: step.isCompleted }}
                  accessibilityLabel={`Step ${index + 1}: ${step.description}`}
                  testID={`step-${step.id}`}
                >
                  <View style={[
                    styles.stepCheckbox,
                    step.isCompleted && styles.stepCheckboxChecked,
                  ]}>
                    {step.isCompleted && (
                      <Text style={styles.stepCheckmark}>{'\u2713'}</Text>
                    )}
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepNumber}>Step {index + 1}</Text>
                    <Text style={[
                      styles.stepDescription,
                      step.isCompleted && styles.stepDescriptionComplete,
                    ]}>
                      {step.description}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        )}

        {/* Tips Card */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>{'\uD83C\uDFAF'} Systematic Desensitization Tips</Text>
          <View style={styles.tipsList}>
            {[
              'Start with the least scary step and gradually increase difficulty',
              'Practice relaxation techniques before each step',
              'Repeat each step until anxiety decreases by 50%',
              'Celebrate every small victory along the way',
              'It\'s okay to take breaks - consistency is more important than speed',
            ].map((tip, index) => (
              <View key={index} style={styles.tipRow}>
                <Text style={styles.tipBullet}>{index + 1}.</Text>
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Inspirational Quote */}
        <View style={styles.quoteContainer}>
          <Text style={styles.quoteText}>
            "Courage is not the absence of fear, but rather the judgment that something else is more important than fear."
          </Text>
          <Text style={styles.quoteAuthor}>- Ambrose Redmoon</Text>
        </View>

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
          onPress={handleCreatePlan}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Create new plan"
          accessibilityHint="Opens fear selection to create a new facing plan"
          testID="create-plan-fab"
        >
          <Text style={styles.fabIcon}>+</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Celebration Overlay */}
      {showCelebration && (
        <Animated.View
          style={[
            styles.celebrationOverlay,
            {
              transform: [{ scale: celebrationScale }],
              opacity: celebrationOpacity,
            },
          ]}
        >
          <Text style={styles.celebrationEmoji}>{'\uD83C\uDF89'}</Text>
          <Text style={styles.celebrationTitle}>Congratulations!</Text>
          <Text style={styles.celebrationText}>
            You've conquered your fear! Your courage has grown immensely.
          </Text>
        </Animated.View>
      )}

      {/* Fear Selection Modal */}
      <Modal
        visible={showFearModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFearModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select a Fear</Text>
              <TouchableOpacity
                onPress={() => setShowFearModal(false)}
                accessibilityRole="button"
                accessibilityLabel="Close"
                testID="fear-modal-close"
              >
                <Text style={styles.modalClose}>{'\u00D7'}</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              Choose a fear from your inventory to create a facing plan
            </Text>

            <ScrollView style={styles.fearList}>
              {availableFears
                .filter(fear => !plans.some(p => p.fearId === fear.id))
                .map(fear => (
                  <TouchableOpacity
                    key={fear.id}
                    style={styles.fearOption}
                    onPress={() => handleSelectFear(fear)}
                    accessibilityRole="button"
                    accessibilityLabel={`Select: ${fear.text}`}
                    testID={`fear-option-${fear.id}`}
                  >
                    <Text style={styles.fearOptionIcon}>
                      {FEAR_CATEGORIES[fear.category].icon}
                    </Text>
                    <View style={styles.fearOptionContent}>
                      <Text style={styles.fearOptionText}>{fear.text}</Text>
                      <Text style={styles.fearOptionCategory}>
                        {FEAR_CATEGORIES[fear.category].label} - Intensity: {fear.intensity}/10
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Add Step Modal */}
      <Modal
        visible={showStepModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowStepModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Exposure Step</Text>
              <TouchableOpacity
                onPress={() => setShowStepModal(false)}
                accessibilityRole="button"
                accessibilityLabel="Close"
                testID="step-modal-close"
              >
                <Text style={styles.modalClose}>{'\u00D7'}</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Describe the step</Text>
            <TextInput
              style={styles.textInput}
              value={newStepText}
              onChangeText={setNewStepText}
              placeholder="e.g., Practice in front of a mirror for 5 minutes..."
              placeholderTextColor={colors.dark.textTertiary}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              accessibilityLabel="Step description"
              testID="step-text-input"
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowStepModal(false)}
                accessibilityRole="button"
                accessibilityLabel="Cancel"
                testID="step-modal-cancel"
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveButton, !newStepText.trim() && styles.saveButtonDisabled]}
                onPress={handleAddStep}
                disabled={!newStepText.trim()}
                accessibilityRole="button"
                accessibilityLabel="Add step"
                testID="step-modal-save"
              >
                <Text style={styles.saveButtonText}>Add Step</Text>
              </TouchableOpacity>
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

  plansSection: {
    marginBottom: spacing.lg,
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
    maxWidth: 250,
  },

  planCard: {
    backgroundColor: colors.dark.bgElevated,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: 'transparent',
    ...shadows.sm,
  },

  planCardSelected: {
    borderColor: colors.dark.accentGold,
  },

  planCardCompleted: {
    borderColor: colors.dark.accentGreen,
  },

  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },

  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    gap: spacing.xs,
  },

  categoryIcon: {
    fontSize: 12,
  },

  categoryText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  completedBadge: {
    backgroundColor: `${colors.dark.accentGreen}30`,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },

  completedText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.dark.accentGreen,
  },

  planFearText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.dark.textPrimary,
    marginBottom: spacing.md,
  },

  courageMeter: {
    marginBottom: spacing.sm,
  },

  courageMeterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },

  courageMeterLabel: {
    fontSize: 12,
    color: colors.dark.textSecondary,
  },

  courageMeterPercent: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.dark.accentGold,
  },

  courageMeterTrack: {
    height: 8,
    backgroundColor: `${colors.dark.textTertiary}30`,
    borderRadius: 4,
    overflow: 'hidden',
  },

  courageMeterFill: {
    height: '100%',
    backgroundColor: colors.dark.accentGold,
    borderRadius: 4,
  },

  courageMeterComplete: {
    backgroundColor: colors.dark.accentGreen,
  },

  stepCount: {
    fontSize: 12,
    color: colors.dark.textTertiary,
  },

  stepsSection: {
    backgroundColor: colors.dark.bgElevated,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },

  stepsSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },

  addStepButton: {
    backgroundColor: `${colors.dark.accentGold}20`,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },

  addStepButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.dark.accentGold,
  },

  noStepsState: {
    padding: spacing.lg,
    alignItems: 'center',
  },

  noStepsText: {
    fontSize: 14,
    color: colors.dark.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },

  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: `${colors.dark.textTertiary}20`,
  },

  stepCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.dark.textTertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
    marginTop: 2,
  },

  stepCheckboxChecked: {
    backgroundColor: colors.dark.accentGreen,
    borderColor: colors.dark.accentGreen,
  },

  stepCheckmark: {
    fontSize: 14,
    color: colors.dark.bgPrimary,
    fontWeight: '700',
  },

  stepContent: {
    flex: 1,
  },

  stepNumber: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.dark.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },

  stepDescription: {
    fontSize: 14,
    color: colors.dark.textPrimary,
    lineHeight: 20,
  },

  stepDescriptionComplete: {
    textDecorationLine: 'line-through',
    color: colors.dark.textTertiary,
  },

  tipsCard: {
    backgroundColor: colors.dark.bgElevated,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },

  tipsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.dark.textPrimary,
    marginBottom: spacing.md,
  },

  tipsList: {
    gap: spacing.sm,
  },

  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  tipBullet: {
    fontSize: 14,
    color: colors.dark.accentGold,
    marginRight: spacing.sm,
    fontWeight: '600',
    width: 20,
  },

  tipText: {
    flex: 1,
    fontSize: 14,
    color: colors.dark.textSecondary,
    lineHeight: 20,
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

  // Celebration Overlay
  celebrationOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(26, 26, 46, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },

  celebrationEmoji: {
    fontSize: 80,
    marginBottom: spacing.lg,
  },

  celebrationTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.dark.accentGold,
    marginBottom: spacing.sm,
  },

  celebrationText: {
    fontSize: 16,
    color: colors.dark.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
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
    maxHeight: '80%',
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
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

  modalSubtitle: {
    fontSize: 14,
    color: colors.dark.textSecondary,
    marginBottom: spacing.lg,
  },

  fearList: {
    maxHeight: 300,
  },

  fearOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.dark.bgPrimary,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },

  fearOptionIcon: {
    fontSize: 24,
    marginRight: spacing.md,
  },

  fearOptionContent: {
    flex: 1,
  },

  fearOptionText: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.dark.textPrimary,
    marginBottom: 2,
  },

  fearOptionCategory: {
    fontSize: 12,
    color: colors.dark.textSecondary,
  },

  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.dark.textPrimary,
    marginBottom: spacing.sm,
  },

  textInput: {
    backgroundColor: colors.dark.bgPrimary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: 16,
    color: colors.dark.textPrimary,
    minHeight: 100,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: `${colors.dark.textTertiary}30`,
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

  saveButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.dark.accentGold,
    alignItems: 'center',
  },

  saveButtonDisabled: {
    opacity: 0.5,
  },

  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark.bgPrimary,
  },
});

export default FearFacingPlanScreen;
