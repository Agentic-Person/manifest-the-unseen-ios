/**
 * SMARTGoalForm Component
 *
 * Form for creating and editing SMART goals with all 5 criteria:
 * Specific, Measurable, Achievable, Relevant, Time-bound.
 *
 * Features:
 * - Title and category inputs
 * - Expandable sections for each SMART criterion
 * - Date picker for Time-bound deadline
 * - Auto-save debounce
 * - Haptic feedback
 *
 * @example
 * ```tsx
 * <SMARTGoalForm
 *   goal={existingGoal}
 *   onSave={(goal) => saveGoal(goal)}
 *   onCancel={() => closeModal()}
 * />
 * ```
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput as RNTextInput,
  Platform,
  Modal,
  Animated,
  KeyboardAvoidingView,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Text } from '../Text';
import { colors, spacing, borderRadius, shadows } from '../../theme';
import {
  SMARTGoal,
  GoalCategory,
  GoalStatus,
  CATEGORY_COLORS,
  CATEGORY_NAMES,
} from './GoalCard';

/**
 * SMART criteria configuration
 */
const SMART_CRITERIA = [
  {
    key: 'specific' as const,
    letter: 'S',
    title: 'Specific',
    prompt: 'What exactly do you want to accomplish? Be clear and detailed.',
    placeholder: 'I want to...',
  },
  {
    key: 'measurable' as const,
    letter: 'M',
    title: 'Measurable',
    prompt: 'How will you track progress? What metrics will you use?',
    placeholder: 'I will measure success by...',
  },
  {
    key: 'achievable' as const,
    letter: 'A',
    title: 'Achievable',
    prompt: 'Is this goal realistic? What resources do you need?',
    placeholder: 'I will achieve this by...',
  },
  {
    key: 'relevant' as const,
    letter: 'R',
    title: 'Relevant',
    prompt: 'Why does this goal matter to you? How does it align with your values?',
    placeholder: 'This matters because...',
  },
  {
    key: 'timeBound' as const,
    letter: 'T',
    title: 'Time-bound',
    prompt: 'When will you achieve this goal? Set a deadline.',
    placeholder: 'Select a deadline date',
    isDate: true,
  },
];

/**
 * Category options for dropdown
 */
const CATEGORY_OPTIONS: GoalCategory[] = [
  'personal',
  'professional',
  'health',
  'financial',
  'relationship',
];

/**
 * Props for SMARTGoalForm component
 */
export interface SMARTGoalFormProps {
  /** Existing goal to edit (optional) */
  goal?: SMARTGoal | null;

  /** Whether the form is visible */
  visible: boolean;

  /** Called when goal is saved */
  onSave: (goal: Omit<SMARTGoal, 'id' | 'createdAt' | 'updatedAt'>) => void;

  /** Called when form is closed */
  onCancel: () => void;

  /** Test ID for automation */
  testID?: string;
}

/**
 * Generate a new goal with default values
 */
const createDefaultGoal = (): Omit<SMARTGoal, 'id' | 'createdAt' | 'updatedAt'> => ({
  title: '',
  category: 'personal',
  specific: '',
  measurable: '',
  achievable: '',
  relevant: '',
  timeBound: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
  status: 'not_started' as GoalStatus,
});

/**
 * SMARTGoalForm Component
 */
export const SMARTGoalForm: React.FC<SMARTGoalFormProps> = ({
  goal,
  visible,
  onSave,
  onCancel,
  testID,
}) => {
  // Form state
  const [formData, setFormData] = useState(goal || createDefaultGoal());
  const [expandedCriterion, setExpandedCriterion] = useState<string | null>('specific');
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Animation refs
  const slideAnim = useRef(new Animated.Value(0)).current;

  // Reset form when goal changes
  useEffect(() => {
    if (visible) {
      setFormData(goal || createDefaultGoal());
      setExpandedCriterion('specific');
      Animated.spring(slideAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    }
  }, [visible, goal, slideAnim]);

  /**
   * Update form field
   */
  const updateField = useCallback(<K extends keyof typeof formData>(
    key: K,
    value: (typeof formData)[K]
  ) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  }, []);

  /**
   * Toggle criterion expansion
   */
  const toggleCriterion = useCallback((key: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setExpandedCriterion(prev => prev === key ? null : key);
  }, []);

  /**
   * Handle save
   */
  const handleSave = useCallback(() => {
    if (!formData.title.trim()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onSave(formData);
  }, [formData, onSave]);

  /**
   * Handle cancel
   */
  const handleCancel = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => onCancel());
  }, [slideAnim, onCancel]);

  /**
   * Format date for display
   */
  const formatDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return 'Select date';
    }
  };

  /**
   * Calculate completion percentage
   */
  const calculateCompletion = (): number => {
    const fields = ['title', 'specific', 'measurable', 'achievable', 'relevant', 'timeBound'];
    const filled = fields.filter(f => {
      const value = formData[f as keyof typeof formData];
      return typeof value === 'string' && value.trim().length > 0;
    }).length;
    return Math.round((filled / fields.length) * 100);
  };

  const completion = calculateCompletion();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleCancel}
      testID={testID}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleCancel}
            style={styles.headerButton}
            accessibilityRole="button"
            accessibilityLabel="Cancel"
            testID={`${testID}-cancel`}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            {goal ? 'Edit Goal' : 'New SMART Goal'}
          </Text>

          <TouchableOpacity
            onPress={handleSave}
            style={[styles.headerButton, styles.saveButton]}
            disabled={!formData.title.trim()}
            accessibilityRole="button"
            accessibilityLabel="Save goal"
            testID={`${testID}-save`}
          >
            <Text style={[
              styles.saveText,
              !formData.title.trim() && styles.saveTextDisabled,
            ]}>
              Save
            </Text>
          </TouchableOpacity>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${completion}%` }]} />
          </View>
          <Text style={styles.progressText}>{completion}% complete</Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Title Input */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Goal Title *</Text>
            <RNTextInput
              style={styles.titleInput}
              value={formData.title}
              onChangeText={(text) => updateField('title', text)}
              placeholder="What's your goal?"
              placeholderTextColor={colors.dark.textTertiary}
              maxLength={100}
              testID={`${testID}-title`}
            />
          </View>

          {/* Category Picker */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Category</Text>
            <TouchableOpacity
              style={styles.categorySelector}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setShowCategoryPicker(true);
              }}
              accessibilityRole="button"
              accessibilityLabel={`Category: ${CATEGORY_NAMES[formData.category]}`}
              testID={`${testID}-category`}
            >
              <View style={[
                styles.categoryBadge,
                { backgroundColor: `${CATEGORY_COLORS[formData.category]}30` },
              ]}>
                <Text style={[
                  styles.categoryText,
                  { color: CATEGORY_COLORS[formData.category] },
                ]}>
                  {CATEGORY_NAMES[formData.category]}
                </Text>
              </View>
              <Text style={styles.chevron}>{'\u25BC'}</Text>
            </TouchableOpacity>
          </View>

          {/* SMART Criteria Sections */}
          <View style={styles.criteriaContainer}>
            <Text style={styles.sectionLabel}>SMART Criteria</Text>

            {SMART_CRITERIA.map((criterion) => {
              const isExpanded = expandedCriterion === criterion.key;
              const value = formData[criterion.key];
              const isFilled = typeof value === 'string' && value.trim().length > 0;

              return (
                <View key={criterion.key} style={styles.criterionCard}>
                  {/* Criterion Header */}
                  <TouchableOpacity
                    style={styles.criterionHeader}
                    onPress={() => toggleCriterion(criterion.key)}
                    accessibilityRole="button"
                    accessibilityState={{ expanded: isExpanded }}
                    testID={`${testID}-${criterion.key}-header`}
                  >
                    <View style={styles.criterionLeft}>
                      <View style={[
                        styles.letterBadge,
                        isFilled && styles.letterBadgeFilled,
                      ]}>
                        <Text style={[
                          styles.letterText,
                          isFilled && styles.letterTextFilled,
                        ]}>
                          {criterion.letter}
                        </Text>
                      </View>
                      <View>
                        <Text style={styles.criterionTitle}>{criterion.title}</Text>
                        {!isExpanded && isFilled && (
                          <Text style={styles.criterionPreview} numberOfLines={1}>
                            {value}
                          </Text>
                        )}
                      </View>
                    </View>
                    <Text style={[styles.expandIcon, isExpanded && styles.expandIconRotated]}>
                      {'\u25B6'}
                    </Text>
                  </TouchableOpacity>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <View style={styles.criterionContent}>
                      <Text style={styles.criterionPrompt}>{criterion.prompt}</Text>

                      {criterion.isDate ? (
                        <TouchableOpacity
                          style={styles.dateButton}
                          onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            setShowDatePicker(true);
                          }}
                          testID={`${testID}-${criterion.key}-input`}
                        >
                          <Text style={styles.dateIcon}>{'\uD83D\uDCC5'}</Text>
                          <Text style={styles.dateText}>
                            {formatDate(formData.timeBound)}
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        <RNTextInput
                          style={styles.criterionInput}
                          value={formData[criterion.key]}
                          onChangeText={(text) => updateField(criterion.key, text)}
                          placeholder={criterion.placeholder}
                          placeholderTextColor={colors.dark.textTertiary}
                          multiline
                          numberOfLines={4}
                          textAlignVertical="top"
                          maxLength={500}
                          testID={`${testID}-${criterion.key}-input`}
                        />
                      )}
                    </View>
                  )}
                </View>
              );
            })}
          </View>

          {/* Bottom Spacer */}
          <View style={styles.bottomSpacer} />
        </ScrollView>

        {/* Category Picker Modal */}
        <Modal
          visible={showCategoryPicker}
          transparent
          animationType="fade"
          onRequestClose={() => setShowCategoryPicker(false)}
        >
          <TouchableOpacity
            style={styles.pickerOverlay}
            activeOpacity={1}
            onPress={() => setShowCategoryPicker(false)}
          >
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerTitle}>Select Category</Text>
              {CATEGORY_OPTIONS.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.pickerOption,
                    formData.category === cat && styles.pickerOptionSelected,
                  ]}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    updateField('category', cat);
                    setShowCategoryPicker(false);
                  }}
                  testID={`${testID}-category-${cat}`}
                >
                  <View style={[
                    styles.pickerDot,
                    { backgroundColor: CATEGORY_COLORS[cat] },
                  ]} />
                  <Text style={styles.pickerOptionText}>{CATEGORY_NAMES[cat]}</Text>
                  {formData.category === cat && (
                    <Text style={styles.checkmark}>{'\u2713'}</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Simple Date Picker Modal */}
        <Modal
          visible={showDatePicker}
          transparent
          animationType="fade"
          onRequestClose={() => setShowDatePicker(false)}
        >
          <TouchableOpacity
            style={styles.pickerOverlay}
            activeOpacity={1}
            onPress={() => setShowDatePicker(false)}
          >
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerTitle}>Select Deadline</Text>
              {/* Quick date options */}
              {[
                { label: '1 Week', days: 7 },
                { label: '2 Weeks', days: 14 },
                { label: '1 Month', days: 30 },
                { label: '3 Months', days: 90 },
                { label: '6 Months', days: 180 },
                { label: '1 Year', days: 365 },
              ].map((option) => {
                const date = new Date(Date.now() + option.days * 24 * 60 * 60 * 1000);
                return (
                  <TouchableOpacity
                    key={option.days}
                    style={styles.pickerOption}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      updateField('timeBound', date.toISOString());
                      setShowDatePicker(false);
                    }}
                    testID={`${testID}-date-${option.days}`}
                  >
                    <Text style={styles.pickerOptionText}>{option.label}</Text>
                    <Text style={styles.datePreview}>
                      {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </TouchableOpacity>
        </Modal>
      </KeyboardAvoidingView>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: `${colors.dark.textTertiary}20`,
  },

  headerButton: {
    padding: spacing.xs,
    minWidth: 60,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.dark.textPrimary,
  },

  cancelText: {
    fontSize: 16,
    color: colors.dark.textSecondary,
  },

  saveButton: {
    alignItems: 'flex-end',
  },

  saveText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark.accentGold,
  },

  saveTextDisabled: {
    color: colors.dark.textTertiary,
  },

  progressContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },

  progressBar: {
    height: 4,
    backgroundColor: `${colors.dark.textTertiary}30`,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },

  progressFill: {
    height: '100%',
    backgroundColor: colors.dark.accentGold,
    borderRadius: borderRadius.full,
  },

  progressText: {
    fontSize: 12,
    color: colors.dark.textTertiary,
    textAlign: 'right',
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    padding: spacing.md,
  },

  section: {
    marginBottom: spacing.lg,
  },

  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.dark.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },

  titleInput: {
    backgroundColor: colors.dark.bgElevated,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: 18,
    fontWeight: '600',
    color: colors.dark.textPrimary,
    borderWidth: 1,
    borderColor: `${colors.dark.textTertiary}30`,
  },

  categorySelector: {
    backgroundColor: colors.dark.bgElevated,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: `${colors.dark.textTertiary}30`,
  },

  categoryBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },

  categoryText: {
    fontSize: 14,
    fontWeight: '600',
  },

  chevron: {
    fontSize: 12,
    color: colors.dark.textTertiary,
  },

  criteriaContainer: {
    marginBottom: spacing.lg,
  },

  criterionCard: {
    backgroundColor: colors.dark.bgElevated,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    overflow: 'hidden',
    ...shadows.sm,
  },

  criterionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
  },

  criterionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  letterBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${colors.dark.textTertiary}30`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },

  letterBadgeFilled: {
    backgroundColor: colors.dark.accentGold,
  },

  letterText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.dark.textTertiary,
  },

  letterTextFilled: {
    color: colors.dark.bgPrimary,
  },

  criterionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark.textPrimary,
  },

  criterionPreview: {
    fontSize: 13,
    color: colors.dark.textSecondary,
    marginTop: 2,
    maxWidth: 200,
  },

  expandIcon: {
    fontSize: 12,
    color: colors.dark.textTertiary,
    transform: [{ rotate: '0deg' }],
  },

  expandIconRotated: {
    transform: [{ rotate: '90deg' }],
  },

  criterionContent: {
    padding: spacing.md,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: `${colors.dark.textTertiary}15`,
  },

  criterionPrompt: {
    fontSize: 14,
    color: colors.dark.textSecondary,
    fontStyle: 'italic',
    marginBottom: spacing.sm,
    lineHeight: 20,
  },

  criterionInput: {
    backgroundColor: colors.dark.bgPrimary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: 15,
    color: colors.dark.textPrimary,
    minHeight: 100,
    borderWidth: 1,
    borderColor: `${colors.dark.textTertiary}30`,
    textAlignVertical: 'top',
  },

  dateButton: {
    backgroundColor: colors.dark.bgPrimary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: `${colors.dark.textTertiary}30`,
  },

  dateIcon: {
    fontSize: 20,
    marginRight: spacing.sm,
  },

  dateText: {
    fontSize: 16,
    color: colors.dark.textPrimary,
    fontWeight: '500',
  },

  bottomSpacer: {
    height: spacing.xl * 2,
  },

  // Picker Modal Styles
  pickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },

  pickerContainer: {
    backgroundColor: colors.dark.bgElevated,
    borderRadius: borderRadius.lg,
    width: '100%',
    maxWidth: 320,
    padding: spacing.md,
    ...shadows.lg,
  },

  pickerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.dark.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: `${colors.dark.textTertiary}20`,
  },

  pickerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },

  pickerOptionSelected: {
    backgroundColor: `${colors.dark.accentGold}15`,
  },

  pickerDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: spacing.sm,
  },

  pickerOptionText: {
    fontSize: 16,
    color: colors.dark.textPrimary,
    flex: 1,
  },

  checkmark: {
    fontSize: 16,
    color: colors.dark.accentGold,
    fontWeight: '700',
  },

  datePreview: {
    fontSize: 14,
    color: colors.dark.textSecondary,
  },
});

export default SMARTGoalForm;
