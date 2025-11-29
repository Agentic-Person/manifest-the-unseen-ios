/**
 * ActionPlanScreen
 *
 * Phase 3 screen for breaking down SMART goals into actionable steps.
 * Users can create, complete, reorder, and delete action steps for each goal.
 *
 * Features:
 * - Goal selector dropdown
 * - Add step with text input
 * - Checkbox to mark steps complete
 * - Reorder steps via up/down arrows
 * - Progress bar showing completion percentage
 * - Celebration animation when 100% complete
 * - Delete step with confirmation
 * - Auto-save with debounce (Supabase stubbed)
 *
 * Design: Dark spiritual theme (#1a1a2e background, #c9a227 gold accent)
 */

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import type { WorkbookStackScreenProps } from '../../../types/navigation';
import StepList from '../../../components/workbook/StepList';
import type { ActionStepData } from '../../../components/workbook/StepList';
import { SaveIndicator } from '../../../components/workbook';
import { useWorkbookProgress, useSaveWorkbook } from '../../../hooks/useWorkbook';
import { WORKSHEET_IDS } from '../../../types/workbook';

// Design system colors from APP-DESIGN.md
const DESIGN_COLORS = {
  bgPrimary: '#1a1a2e',
  bgSecondary: '#16213e',
  bgElevated: '#252547',
  textPrimary: '#e8e8e8',
  textSecondary: '#a0a0b0',
  textTertiary: '#6b6b80',
  accentPurple: '#4a1a6b',
  accentPurpleLight: '#6b2d8b',
  accentGold: '#c9a227',
  accentTeal: '#1a5f5f',
  accentGreen: '#2d5a4a',
  border: '#3a3a5a',
  success: '#2d5a4a',
  error: '#dc2626',
};

/**
 * SMART Goal interface (simplified for demo)
 */
interface SMARTGoal {
  id: string;
  title: string;
  category: string;
  createdAt: string;
}

/**
 * Generate unique ID helper
 */
const generateId = (): string => {
  return `step_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

// Mock goals for demo (in real app, would load from Supabase)
const MOCK_GOALS: SMARTGoal[] = [
  {
    id: 'goal_1',
    title: 'Learn to meditate daily for 20 minutes',
    category: 'Health',
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'goal_2',
    title: 'Read 24 books this year',
    category: 'Personal',
    createdAt: '2024-01-10T08:00:00Z',
  },
  {
    id: 'goal_3',
    title: 'Save $10,000 for emergency fund',
    category: 'Financial',
    createdAt: '2024-01-01T09:00:00Z',
  },
];

type Props = WorkbookStackScreenProps<'ActionPlan'>;

/** Data structure for storing action plan data */
interface ActionPlanData {
  selectedGoalId: string | null;
  steps: ActionStepData[];
  updatedAt: string;
}

/**
 * ActionPlanScreen Component
 */
const ActionPlanScreen: React.FC<Props> = ({ navigation }) => {
  // Fetch saved progress from Supabase
  const { data: savedProgress, } = useWorkbookProgress(3, WORKSHEET_IDS.ACTION_PLAN);
  const { mutate: saveWorkbook, isPending: isSavingWorkbook } = useSaveWorkbook();

  // State
  const [goals, setGoals] = useState<SMARTGoal[]>([]);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [steps, setSteps] = useState<ActionStepData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saveError, setSaveError] = useState(false);
  const [showGoalPicker, setShowGoalPicker] = useState(false);
  const [showAddStepModal, setShowAddStepModal] = useState(false);
  const [newStepText, setNewStepText] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);

  // Animation refs
  const celebrationOpacity = useRef(new Animated.Value(0)).current;
  const celebrationScale = useRef(new Animated.Value(0.5)).current;
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate completion
  const completedCount = useMemo(() => {
    return steps.filter((step) => step.completed).length;
  }, [steps]);

  const isAllComplete = steps.length > 0 && completedCount === steps.length;

  /**
   * Load goals and action plan data on mount
   */
  useEffect(() => {
    loadData();
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // Load saved data from Supabase
  useEffect(() => {
    if (savedProgress?.data) {
      const data = savedProgress.data as unknown as ActionPlanData;
      if (data.selectedGoalId) setSelectedGoalId(data.selectedGoalId);
      if (data.steps) setSteps(data.steps);
    }
  }, [savedProgress]);

  /**
   * Auto-save when steps change (debounced)
   */
  useEffect(() => {
    if (!isLoading && selectedGoalId) {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      saveTimeoutRef.current = setTimeout(() => {
        autoSave();
      }, 1500); // 1.5 second debounce
    }
  }, [steps, isLoading, selectedGoalId]);

  /**
   * Check for completion celebration
   */
  useEffect(() => {
    if (isAllComplete && steps.length > 0) {
      triggerCelebration();
    }
  }, [isAllComplete, steps.length]);

  /**
   * Load initial data
   */
  const loadData = async () => {
    setIsLoading(true);
    try {
      // TODO: Load from Supabase
      // const { data: goalsData } = await supabase.from('smart_goals').select('*');
      // setGoals(goalsData);

      // Simulate loading delay
      await new Promise((resolve) => setTimeout(resolve, 300));
      setGoals(MOCK_GOALS);
      console.log('Loaded goals data');
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Load steps for selected goal
   */
  const loadStepsForGoal = async (goalId: string) => {
    try {
      // TODO: Load from Supabase
      // const { data } = await supabase
      //   .from('action_steps')
      //   .select('*')
      //   .eq('goal_id', goalId)
      //   .order('order');
      // setSteps(data || []);

      // For demo, start with empty steps
      setSteps([]);
      console.log('Loaded steps for goal:', goalId);
    } catch (error) {
      console.error('Failed to load steps:', error);
    }
  };

  /**
   * Auto-save action plan to Supabase
   */
  const autoSave = useCallback(async () => {
    setSaveError(false);
    const data: ActionPlanData = {
      selectedGoalId,
      steps,
      updatedAt: new Date().toISOString(),
    };

    saveWorkbook(
      {
        phaseNumber: 3,
        worksheetId: WORKSHEET_IDS.ACTION_PLAN,
        data: data as unknown as Record<string, unknown>,
      },
      {
        onSuccess: () => {
          setLastSaved(new Date());
        },
        onError: (error) => {
          console.error('Failed to save:', error);
          setSaveError(true);
        },
      }
    );
  }, [selectedGoalId, steps, saveWorkbook]);

  /**
   * Trigger celebration animation
   */
  const triggerCelebration = () => {
    setShowCelebration(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    Animated.parallel([
      Animated.timing(celebrationOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(celebrationScale, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();

    // Hide celebration after delay
    setTimeout(() => {
      Animated.timing(celebrationOpacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setShowCelebration(false);
        celebrationScale.setValue(0.5);
      });
    }, 3000);
  };

  /**
   * Handle goal selection
   */
  const handleSelectGoal = (goalId: string) => {
    setSelectedGoalId(goalId);
    setShowGoalPicker(false);
    loadStepsForGoal(goalId);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  /**
   * Add a new step
   */
  const handleAddStep = () => {
    if (!newStepText.trim()) {
      Alert.alert('Empty Step', 'Please enter a description for this step.');
      return;
    }

    if (!selectedGoalId) {
      Alert.alert('No Goal Selected', 'Please select a goal first.');
      return;
    }

    const newStep: ActionStepData = {
      id: generateId(),
      goalId: selectedGoalId,
      text: newStepText.trim(),
      completed: false,
      order: steps.length,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setSteps((prev) => [...prev, newStep]);
    setShowAddStepModal(false);
    setNewStepText('');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  /**
   * Toggle step completion
   */
  const handleToggleComplete = useCallback((id: string) => {
    setSteps((prev) =>
      prev.map((step) =>
        step.id === id
          ? {
              ...step,
              completed: !step.completed,
              updatedAt: new Date().toISOString(),
            }
          : step
      )
    );
  }, []);

  /**
   * Move step up in order
   */
  const handleMoveUp = useCallback((id: string) => {
    setSteps((prev) => {
      const sorted = [...prev].sort((a, b) => a.order - b.order);
      const index = sorted.findIndex((s) => s.id === id);
      if (index <= 0) return prev;

      const newSteps = [...sorted];
      // Swap orders
      const temp = newSteps[index].order;
      newSteps[index] = { ...newSteps[index], order: newSteps[index - 1].order };
      newSteps[index - 1] = { ...newSteps[index - 1], order: temp };

      return newSteps;
    });
  }, []);

  /**
   * Move step down in order
   */
  const handleMoveDown = useCallback((id: string) => {
    setSteps((prev) => {
      const sorted = [...prev].sort((a, b) => a.order - b.order);
      const index = sorted.findIndex((s) => s.id === id);
      if (index < 0 || index >= sorted.length - 1) return prev;

      const newSteps = [...sorted];
      // Swap orders
      const temp = newSteps[index].order;
      newSteps[index] = { ...newSteps[index], order: newSteps[index + 1].order };
      newSteps[index + 1] = { ...newSteps[index + 1], order: temp };

      return newSteps;
    });
  }, []);

  /**
   * Delete a step
   */
  const handleDeleteStep = useCallback((id: string) => {
    Alert.alert(
      'Delete Step',
      'Are you sure you want to remove this step from your action plan?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setSteps((prev) => {
              const filtered = prev.filter((step) => step.id !== id);
              // Reorder remaining steps
              return filtered.map((step, index) => ({
                ...step,
                order: index,
                updatedAt: new Date().toISOString(),
              }));
            });
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          },
        },
      ]
    );
  }, []);

  /**
   * Save and navigate back
   */
  const handleSaveAndContinue = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await autoSave();
    navigation.goBack();
  };

  // Get selected goal
  const selectedGoal = goals.find((g) => g.id === selectedGoalId);

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={50} color={DESIGN_COLORS.accentGold} />
        <Text style={styles.loadingText}>Loading your goals...</Text>
      </View>
    );
  }

  // Empty goals state
  if (goals.length === 0) {
    return (
      <View style={styles.emptyGoalsContainer}>
        <Text style={styles.emptyGoalsIcon}>🎯</Text>
        <Text style={styles.emptyGoalsTitle}>No Goals Yet</Text>
        <Text style={styles.emptyGoalsMessage}>
          Create SMART goals first to build your action plan.
          Go to SMART Goals to get started.
        </Text>
        <TouchableOpacity
          style={styles.createGoalButton}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Go back to create goals"
        >
          <Text style={styles.createGoalButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      testID="action-plan-screen"
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Action Plan</Text>
          <Text style={styles.subtitle}>
            Break down your goals into actionable steps.
            Check off each step as you complete it.
          </Text>
        </View>

        {/* Goal Selector */}
        <View style={styles.goalSelectorContainer}>
          <Text style={styles.sectionLabel}>Select Goal</Text>
          <TouchableOpacity
            style={styles.goalSelector}
            onPress={() => setShowGoalPicker(true)}
            accessibilityRole="button"
            accessibilityLabel="Select a goal"
            accessibilityHint="Opens goal picker"
            testID="goal-selector"
          >
            {selectedGoal ? (
              <>
                <View style={styles.goalSelectorContent}>
                  <Text style={styles.goalCategory}>{selectedGoal.category}</Text>
                  <Text style={styles.goalTitle} numberOfLines={2}>
                    {selectedGoal.title}
                  </Text>
                </View>
                <Text style={styles.goalSelectorArrow}>▼</Text>
              </>
            ) : (
              <>
                <Text style={styles.goalSelectorPlaceholder}>
                  Choose a goal to plan...
                </Text>
                <Text style={styles.goalSelectorArrow}>▼</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Steps List */}
        {selectedGoalId && (
          <View style={styles.stepsContainer}>
            <View style={styles.stepsHeader}>
              <Text style={styles.sectionLabel}>Action Steps</Text>
              <TouchableOpacity
                style={styles.addStepButton}
                onPress={() => setShowAddStepModal(true)}
                accessibilityRole="button"
                accessibilityLabel="Add new step"
                testID="add-step-button"
              >
                <Text style={styles.addStepButtonIcon}>+</Text>
                <Text style={styles.addStepButtonText}>Add Step</Text>
              </TouchableOpacity>
            </View>

            <StepList
              steps={steps}
              onToggleComplete={handleToggleComplete}
              onMoveUp={handleMoveUp}
              onMoveDown={handleMoveDown}
              onDelete={handleDeleteStep}
              emptyMessage="Break your goal into small, manageable steps. Tap 'Add Step' to begin."
            />
          </View>
        )}

        {/* Tips Card */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>Tips for Action Planning</Text>
          <Text style={styles.tipItem}>- Start with the first small action you can take today</Text>
          <Text style={styles.tipItem}>- Break complex tasks into simpler sub-steps</Text>
          <Text style={styles.tipItem}>- Set realistic timeframes for each step</Text>
          <Text style={styles.tipItem}>- Celebrate each completed step!</Text>
        </View>

        {/* Save Status */}
        <SaveIndicator isSaving={isSavingWorkbook} lastSaved={lastSaved} isError={saveError} onRetry={autoSave} />

        {/* Save Button */}
        <Pressable
          style={({ pressed }) => [
            styles.saveButton,
            pressed && styles.saveButtonPressed,
          ]}
          onPress={handleSaveAndContinue}
          accessibilityRole="button"
          accessibilityLabel="Save and continue"
          testID="save-continue-button"
        >
          <Text style={styles.saveButtonText}>Save & Continue</Text>
        </Pressable>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Goal Picker Modal */}
      <Modal
        visible={showGoalPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowGoalPicker(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowGoalPicker(false)}
        >
          <Pressable
            style={styles.modalContent}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={styles.modalTitle}>Select a Goal</Text>
            <Text style={styles.modalSubtitle}>
              Choose a SMART goal to create an action plan for
            </Text>

            <ScrollView style={styles.goalList}>
              {goals.map((goal) => (
                <TouchableOpacity
                  key={goal.id}
                  style={[
                    styles.goalOption,
                    goal.id === selectedGoalId && styles.goalOptionSelected,
                  ]}
                  onPress={() => handleSelectGoal(goal.id)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: goal.id === selectedGoalId }}
                  testID={`goal-option-${goal.id}`}
                >
                  <Text style={styles.goalOptionCategory}>{goal.category}</Text>
                  <Text style={styles.goalOptionTitle}>{goal.title}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowGoalPicker(false)}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Add Step Modal */}
      <Modal
        visible={showAddStepModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAddStepModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowAddStepModal(false)}
        >
          <Pressable
            style={styles.modalContent}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={styles.modalTitle}>Add Action Step</Text>
            <Text style={styles.modalSubtitle}>
              What specific action will move you closer to your goal?
            </Text>

            <TextInput
              style={styles.stepInput}
              value={newStepText}
              onChangeText={setNewStepText}
              placeholder="e.g., Research meditation apps..."
              placeholderTextColor={DESIGN_COLORS.textTertiary}
              multiline
              numberOfLines={3}
              maxLength={200}
              autoFocus
              accessibilityLabel="Step description input"
              testID="new-step-input"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => {
                  setShowAddStepModal(false);
                  setNewStepText('');
                }}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalAddButton}
                onPress={handleAddStep}
                testID="confirm-add-step"
              >
                <Text style={styles.modalAddText}>Add Step</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Celebration Overlay */}
      {showCelebration && (
        <Animated.View
          style={[
            styles.celebrationOverlay,
            {
              opacity: celebrationOpacity,
              transform: [{ scale: celebrationScale }],
            },
          ]}
          testID="celebration-overlay"
        >
          <Text style={styles.celebrationEmoji}>🎉</Text>
          <Text style={styles.celebrationTitle}>Amazing!</Text>
          <Text style={styles.celebrationMessage}>
            You completed all steps for this goal!
          </Text>
        </Animated.View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DESIGN_COLORS.bgPrimary,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: DESIGN_COLORS.bgPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: DESIGN_COLORS.textSecondary,
  },

  // Empty goals state
  emptyGoalsContainer: {
    flex: 1,
    backgroundColor: DESIGN_COLORS.bgPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyGoalsIcon: {
    fontSize: 64,
    marginBottom: 24,
  },
  emptyGoalsTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: DESIGN_COLORS.textPrimary,
    marginBottom: 12,
  },
  emptyGoalsMessage: {
    fontSize: 16,
    color: DESIGN_COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  createGoalButton: {
    backgroundColor: DESIGN_COLORS.accentPurple,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  createGoalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: DESIGN_COLORS.textPrimary,
  },

  // Header
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: DESIGN_COLORS.textPrimary,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 15,
    color: DESIGN_COLORS.textSecondary,
    lineHeight: 22,
  },

  // Section label
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: DESIGN_COLORS.textSecondary,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  // Goal selector
  goalSelectorContainer: {
    marginBottom: 24,
  },
  goalSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DESIGN_COLORS.bgElevated,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
  },
  goalSelectorContent: {
    flex: 1,
  },
  goalCategory: {
    fontSize: 12,
    fontWeight: '600',
    color: DESIGN_COLORS.accentGold,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: DESIGN_COLORS.textPrimary,
    lineHeight: 22,
  },
  goalSelectorPlaceholder: {
    flex: 1,
    fontSize: 16,
    color: DESIGN_COLORS.textTertiary,
  },
  goalSelectorArrow: {
    fontSize: 12,
    color: DESIGN_COLORS.textTertiary,
    marginLeft: 8,
  },

  // Steps container
  stepsContainer: {
    marginBottom: 24,
  },
  stepsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addStepButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DESIGN_COLORS.accentTeal,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  addStepButtonIcon: {
    fontSize: 18,
    fontWeight: '700',
    color: DESIGN_COLORS.textPrimary,
    marginRight: 6,
  },
  addStepButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: DESIGN_COLORS.textPrimary,
  },

  // Tips Card
  tipsCard: {
    backgroundColor: DESIGN_COLORS.bgSecondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: DESIGN_COLORS.accentGold,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tipItem: {
    fontSize: 13,
    color: DESIGN_COLORS.textSecondary,
    marginBottom: 6,
    lineHeight: 20,
  },

  // Save Status
  saveStatusContainer: {
    alignItems: 'center',
    marginBottom: 16,
    minHeight: 20,
  },
  saveStatus: {
    fontSize: 12,
    color: DESIGN_COLORS.textTertiary,
  },

  // Save Button
  saveButton: {
    backgroundColor: DESIGN_COLORS.accentPurple,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: DESIGN_COLORS.accentPurple,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  saveButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: DESIGN_COLORS.textPrimary,
    letterSpacing: 0.5,
  },

  bottomSpacer: {
    height: 40,
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: DESIGN_COLORS.bgElevated,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: DESIGN_COLORS.textPrimary,
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: DESIGN_COLORS.textSecondary,
    marginBottom: 20,
  },
  goalList: {
    maxHeight: 300,
    marginBottom: 16,
  },
  goalOption: {
    backgroundColor: DESIGN_COLORS.bgSecondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
  },
  goalOptionSelected: {
    borderColor: DESIGN_COLORS.accentGold,
    backgroundColor: 'rgba(201, 162, 39, 0.1)',
  },
  goalOptionCategory: {
    fontSize: 11,
    fontWeight: '600',
    color: DESIGN_COLORS.accentTeal,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  goalOptionTitle: {
    fontSize: 15,
    color: DESIGN_COLORS.textPrimary,
    lineHeight: 22,
  },
  modalCloseButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 14,
    fontWeight: '600',
    color: DESIGN_COLORS.textSecondary,
  },
  stepInput: {
    backgroundColor: DESIGN_COLORS.bgPrimary,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: DESIGN_COLORS.textPrimary,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  modalCancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
  },
  modalCancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: DESIGN_COLORS.textSecondary,
  },
  modalAddButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: DESIGN_COLORS.accentPurple,
  },
  modalAddText: {
    fontSize: 14,
    fontWeight: '600',
    color: DESIGN_COLORS.textPrimary,
  },

  // Celebration overlay
  celebrationOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(26, 26, 46, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  celebrationEmoji: {
    fontSize: 80,
    marginBottom: 24,
  },
  celebrationTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: DESIGN_COLORS.accentGold,
    marginBottom: 12,
  },
  celebrationMessage: {
    fontSize: 18,
    color: DESIGN_COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 26,
  },
});

export default ActionPlanScreen;
