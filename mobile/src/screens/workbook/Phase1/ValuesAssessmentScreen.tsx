/**
 * Values Assessment Screen
 *
 * Phase 1 exercise where users select their top 5 core values from 20+ options.
 * Users can also reorder their selections by priority.
 *
 * Design follows APP-DESIGN.md specifications:
 * - Dark theme with spiritual aesthetic (uses light theme currently for consistency)
 * - Grid/list layout with value cards
 * - Accent color (#4a1a6b / primary[600]) for selected values
 * - Hand-drawn decorative elements
 */

import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Card, Text } from '../../../components';
import { ValueCard } from '../../../components/workbook/ValueCard';
import { ExerciseHeader } from '../../../components/workbook';
import { Phase1ExerciseImages } from '../../../assets';
import { colors, spacing, borderRadius, shadows } from '../../../theme';
import type { WorkbookStackScreenProps } from '../../../types/navigation';
import { useWorkbookProgress } from '../../../hooks/useWorkbook';
import { useAutoSave } from '../../../hooks/useAutoSave';
import { WORKSHEET_IDS } from '../../../types/workbook';

/**
 * Core values list - 20 foundational values for self-discovery
 */
const CORE_VALUES = [
  'Integrity',
  'Authenticity',
  'Growth',
  'Freedom',
  'Love',
  'Family',
  'Health',
  'Wealth',
  'Creativity',
  'Adventure',
  'Security',
  'Peace',
  'Knowledge',
  'Impact',
  'Joy',
  'Connection',
  'Excellence',
  'Balance',
  'Spirituality',
  'Service',
] as const;

// Type assertion ensures CORE_VALUES only contains valid values

/**
 * Data schema for values assessment
 */
interface ValuesData {
  selectedValues: string[]; // Top 5, ordered by priority
  allValuesViewed: boolean;
  updatedAt: string;
}

/**
 * Maximum number of values a user can select
 */
const MAX_SELECTIONS = 5;

type Props = WorkbookStackScreenProps<'PersonalValues'>;

/**
 * Values Assessment Screen Component
 */
const ValuesAssessmentScreen: React.FC<Props> = ({ navigation }) => {
  // State for selected values (ordered list)
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  // Load saved data from Supabase
  const { data: savedProgress } = useWorkbookProgress(1, WORKSHEET_IDS.VALUES_ASSESSMENT);

  // Auto-save with debounce
  const { isSaving, saveNow } = useAutoSave({
    data: { selectedValues, allValuesViewed: true, updatedAt: new Date().toISOString() },
    phaseNumber: 1,
    worksheetId: WORKSHEET_IDS.VALUES_ASSESSMENT,
    debounceMs: 1500,
  });

  // Load saved data into state when fetched
  useEffect(() => {
    if (savedProgress?.data) {
      const saved = savedProgress.data as unknown as ValuesData;
      if (saved.selectedValues) {
        setSelectedValues(saved.selectedValues);
      }
    }
  }, [savedProgress]);

  /**
   * Check if selection limit is reached
   */
  const isMaxReached = selectedValues.length >= MAX_SELECTIONS;

  /**
   * Handle value selection toggle
   */
  const handleValueToggle = useCallback((value: string) => {
    setSelectedValues((prev) => {
      const isCurrentlySelected = prev.includes(value);

      if (isCurrentlySelected) {
        // Remove the value
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        return prev.filter((v) => v !== value);
      } else {
        // Add the value if not at max
        if (prev.length >= MAX_SELECTIONS) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          Alert.alert(
            'Maximum Reached',
            `You can only select ${MAX_SELECTIONS} core values. Remove one to add another.`,
            [{ text: 'OK' }]
          );
          return prev;
        }
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        return [...prev, value];
      }
    });
  }, []);

  /**
   * Move a selected value up in priority
   */
  const moveValueUp = useCallback((index: number) => {
    if (index <= 0) return;

    setSelectedValues((prev) => {
      const newValues = [...prev];
      [newValues[index - 1], newValues[index]] = [newValues[index], newValues[index - 1]];
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      return newValues;
    });
  }, []);

  /**
   * Move a selected value down in priority
   */
  const moveValueDown = useCallback((index: number) => {
    setSelectedValues((prev) => {
      if (index >= prev.length - 1) return prev;

      const newValues = [...prev];
      [newValues[index], newValues[index + 1]] = [newValues[index + 1], newValues[index]];
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      return newValues;
    });
  }, []);

  /**
   * Save values to Supabase
   */
  const handleSave = useCallback(async () => {
    if (selectedValues.length === 0) {
      Alert.alert(
        'No Values Selected',
        'Please select at least one value before saving.',
        [{ text: 'OK' }]
      );
      return;
    }

    if (selectedValues.length < MAX_SELECTIONS) {
      Alert.alert(
        'Incomplete Selection',
        `You have selected ${selectedValues.length} of ${MAX_SELECTIONS} values. Are you sure you want to continue?`,
        [
          { text: 'Continue Selecting', style: 'cancel' },
          { text: 'Save Anyway', onPress: performSave },
        ]
      );
      return;
    }

    performSave();
  }, [selectedValues]);

  /**
   * Perform the actual save operation
   */
  const performSave = async () => {
    saveNow({ completed: true });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert(
      'Values Saved!',
      'Your core values have been saved successfully.',
      [
        {
          text: 'Continue',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  /**
   * Calculate progress percentage
   */
  const progressPercentage = (selectedValues.length / MAX_SELECTIONS) * 100;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <ExerciseHeader
          image={Phase1ExerciseImages.personalValues}
          title="Personal Values"
          subtitle={`Select your top ${MAX_SELECTIONS} core values that define who you are and what matters most to you.`}
          progress={savedProgress?.progress || 0}
        />

        {/* Progress Card */}
        <Card elevation="raised" style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Selection Progress</Text>
            <Text style={styles.progressCount}>
              {selectedValues.length}/{MAX_SELECTIONS}
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${progressPercentage}%` },
                selectedValues.length === MAX_SELECTIONS && styles.progressFillComplete,
              ]}
            />
          </View>
          <Text style={styles.progressHint}>
            {selectedValues.length === 0
              ? 'Tap a value to select it'
              : selectedValues.length < MAX_SELECTIONS
              ? `Select ${MAX_SELECTIONS - selectedValues.length} more value${MAX_SELECTIONS - selectedValues.length > 1 ? 's' : ''}`
              : 'Selection complete! You can reorder below.'}
          </Text>
        </Card>

        {/* Selected Values (for reordering) */}
        {selectedValues.length > 0 && (
          <View style={styles.selectedSection}>
            <Text style={styles.sectionTitle}>Your Top Values (Ordered by Priority)</Text>
            <Text style={styles.sectionHint}>
              Use the arrows to reorder your values by importance
            </Text>
            <View style={styles.selectedList}>
              {selectedValues.map((value, index) => (
                <View key={value} style={styles.selectedItem}>
                  <View style={styles.priorityBadge}>
                    <Text style={styles.priorityText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.selectedValueName}>{value}</Text>
                  <View style={styles.reorderButtons}>
                    <TouchableOpacity
                      style={[
                        styles.reorderButton,
                        index === 0 && styles.reorderButtonDisabled,
                      ]}
                      onPress={() => moveValueUp(index)}
                      disabled={index === 0}
                      accessibilityLabel={`Move ${value} up`}
                      accessibilityHint="Increases priority of this value"
                    >
                      <Text style={[
                        styles.reorderButtonText,
                        index === 0 && styles.reorderButtonTextDisabled,
                      ]}>
                        ▲
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.reorderButton,
                        index === selectedValues.length - 1 && styles.reorderButtonDisabled,
                      ]}
                      onPress={() => moveValueDown(index)}
                      disabled={index === selectedValues.length - 1}
                      accessibilityLabel={`Move ${value} down`}
                      accessibilityHint="Decreases priority of this value"
                    >
                      <Text style={[
                        styles.reorderButtonText,
                        index === selectedValues.length - 1 && styles.reorderButtonTextDisabled,
                      ]}>
                        ▼
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Values Grid */}
        <View style={styles.valuesSection}>
          <Text style={styles.sectionTitle}>Core Values</Text>
          <Text style={styles.sectionHint}>
            Tap to select values that resonate with you
          </Text>
          <View style={styles.valuesGrid}>
            {CORE_VALUES.map((value) => {
              const isSelected = selectedValues.includes(value);
              const selectionOrder = isSelected
                ? selectedValues.indexOf(value) + 1
                : undefined;
              const isDisabled = !isSelected && isMaxReached;

              return (
                <View key={value} style={styles.valueCardWrapper}>
                  <ValueCard
                    value={value}
                    isSelected={isSelected}
                    onPress={() => handleValueToggle(value)}
                    selectionOrder={selectionOrder}
                    disabled={isDisabled}
                    testID={`value-card-${value.toLowerCase().replace(/\s+/g, '-')}`}
                  />
                </View>
              );
            })}
          </View>
        </View>

        {/* Bottom Spacer for button */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Save Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.saveButton,
            (selectedValues.length === 0 || isSaving) && styles.saveButtonDisabled,
          ]}
          onPress={handleSave}
          disabled={selectedValues.length === 0 || isSaving}
          accessibilityRole="button"
          accessibilityLabel="Save your values"
          accessibilityHint={
            selectedValues.length === 0
              ? 'Select at least one value to save'
              : 'Saves your selected values'
          }
        >
          <Text style={styles.saveButtonText}>
            {isSaving ? 'Saving...' : 'Save Values'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

/**
 * Styles
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
  },
  progressCard: {
    marginBottom: spacing.lg,
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
    color: colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  progressCount: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary[600],
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.gray[200],
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary[400],
    borderRadius: borderRadius.full,
  },
  progressFillComplete: {
    backgroundColor: colors.success[500],
  },
  progressHint: {
    fontSize: 14,
    color: colors.text.tertiary,
  },
  selectedSection: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  sectionHint: {
    fontSize: 14,
    color: colors.text.tertiary,
    marginBottom: spacing.md,
  },
  selectedList: {
    gap: spacing.sm,
  },
  selectedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.primary[200],
    ...shadows.sm,
  },
  priorityBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary[600],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  priorityText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
  },
  selectedValueName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  reorderButtons: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  reorderButton: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  reorderButtonDisabled: {
    backgroundColor: colors.gray[50],
  },
  reorderButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary[600],
  },
  reorderButtonTextDisabled: {
    color: colors.gray[300],
  },
  valuesSection: {
    marginBottom: spacing.lg,
  },
  valuesGrid: {
    gap: spacing.sm,
  },
  valueCardWrapper: {
    marginBottom: spacing.xs,
  },
  bottomSpacer: {
    height: 100, // Space for the fixed button
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.md,
    paddingBottom: spacing.xl,
    backgroundColor: colors.background.secondary,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
  saveButton: {
    backgroundColor: colors.primary[600],
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  saveButtonDisabled: {
    backgroundColor: colors.gray[300],
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },
});

export default ValuesAssessmentScreen;
