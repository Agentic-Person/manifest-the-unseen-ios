/**
 * Habits Audit Screen - Phase 1 Self-Evaluation
 *
 * A comprehensive habits tracking screen that allows users to audit their
 * daily routines by time of day (Morning, Afternoon, Evening).
 * Each habit can be categorized as Positive, Negative, or Neutral.
 *
 * Features:
 * - Three collapsible sections for different times of day
 * - Add/edit/delete habits with category selection
 * - Summary showing habit balance (positive vs negative)
 * - Auto-save to Supabase
 * - Progress tracking integration
 */

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { Card, Text, Button } from '../../../components';
import HabitSection, { TimeOfDay, Habit } from '../../../components/workbook/HabitSection';
import { HabitCategory } from '../../../components/workbook/HabitEntry';
import { SaveIndicator } from '../../../components/workbook';
import { colors, spacing, borderRadius } from '../../../theme';
import type { WorkbookStackScreenProps } from '../../../types/navigation';
import { useWorkbookProgress } from '../../../hooks/useWorkbook';
import { useAutoSave } from '../../../hooks/useAutoSave';
import { WORKSHEET_IDS } from '../../../types/workbook';

/**
 * Habits data structure for storage
 */
interface HabitsData {
  morning: Habit[];
  afternoon: Habit[];
  evening: Habit[];
  updatedAt: string;
}

/**
 * Generate unique ID for habits
 */
const generateId = (): string => {
  return `habit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Initial empty habits data
 */
const INITIAL_DATA: HabitsData = {
  morning: [],
  afternoon: [],
  evening: [],
  updatedAt: new Date().toISOString(),
};

type Props = WorkbookStackScreenProps<'HabitTracking'>;

/**
 * Habits Audit Screen Component
 */
const HabitsAuditScreen: React.FC<Props> = ({ navigation: _navigation }) => {
  // State for habits data
  const [habitsData, setHabitsData] = useState<HabitsData>(INITIAL_DATA);

  // Load saved data from Supabase
  const { data: savedProgress } = useWorkbookProgress(1, WORKSHEET_IDS.HABITS_AUDIT);

  // Auto-save with debounce
  const { isSaving, isError, lastSaved, saveNow } = useAutoSave({
    data: habitsData as unknown as Record<string, unknown>,
    phaseNumber: 1,
    worksheetId: WORKSHEET_IDS.HABITS_AUDIT,
    debounceMs: 1500,
  });

  // Load saved data into state when fetched
  useEffect(() => {
    if (savedProgress?.data) {
      const saved = savedProgress.data as unknown as HabitsData;
      setHabitsData(saved);
    }
  }, [savedProgress]);

  /**
   * Calculate summary statistics
   */
  const summary = useMemo(() => {
    const allHabits = [
      ...habitsData.morning,
      ...habitsData.afternoon,
      ...habitsData.evening,
    ];

    const positive = allHabits.filter(h => h.category === 'positive').length;
    const negative = allHabits.filter(h => h.category === 'negative').length;
    const neutral = allHabits.filter(h => h.category === 'neutral').length;
    const total = allHabits.length;

    // Calculate balance score (-100 to +100)
    let balanceScore = 0;
    if (total > 0) {
      balanceScore = Math.round(((positive - negative) / total) * 100);
    }

    return {
      total,
      positive,
      negative,
      neutral,
      balanceScore,
    };
  }, [habitsData]);

  /**
   * Add a new habit to a time period
   */
  const handleAddHabit = useCallback((timeOfDay: TimeOfDay) => {
    const newHabit: Habit = {
      id: generateId(),
      habit: '',
      category: 'neutral',
    };

    setHabitsData(prev => ({
      ...prev,
      [timeOfDay]: [...prev[timeOfDay], newHabit],
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  /**
   * Edit habit text
   */
  const handleEditHabit = useCallback((
    timeOfDay: TimeOfDay,
    habitId: string,
    newText: string
  ) => {
    setHabitsData(prev => ({
      ...prev,
      [timeOfDay]: prev[timeOfDay].map(h =>
        h.id === habitId ? { ...h, habit: newText } : h
      ),
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  /**
   * Remove a habit
   */
  const handleRemoveHabit = useCallback((timeOfDay: TimeOfDay, habitId: string) => {
    setHabitsData(prev => ({
      ...prev,
      [timeOfDay]: prev[timeOfDay].filter(h => h.id !== habitId),
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  /**
   * Change habit category
   */
  const handleCategoryChange = useCallback((
    timeOfDay: TimeOfDay,
    habitId: string,
    category: HabitCategory
  ) => {
    setHabitsData(prev => ({
      ...prev,
      [timeOfDay]: prev[timeOfDay].map(h =>
        h.id === habitId ? { ...h, category } : h
      ),
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  /**
   * Save habits manually
   */
  const handleSave = useCallback(async () => {
    // Validate: ensure all habits have text
    const allHabits = [
      ...habitsData.morning,
      ...habitsData.afternoon,
      ...habitsData.evening,
    ];

    const emptyHabits = allHabits.filter(h => !h.habit.trim());
    if (emptyHabits.length > 0) {
      Alert.alert(
        'Incomplete Habits',
        'Please fill in all habit descriptions or delete empty habits before saving.',
        [{ text: 'OK' }]
      );
      return;
    }

    saveNow();
    Alert.alert(
      'Saved!',
      'Your habits audit has been saved successfully.',
      [{ text: 'OK' }]
    );
  }, [habitsData, saveNow]);

  /**
   * Get balance status text and color
   */
  const getBalanceStatus = () => {
    const { balanceScore, total } = summary;

    if (total === 0) {
      return { text: 'No habits yet', color: colors.text.tertiary };
    }

    if (balanceScore >= 50) {
      return { text: 'Excellent balance!', color: '#2d5a4a' };
    }
    if (balanceScore >= 20) {
      return { text: 'Good progress', color: '#1a5f5f' };
    }
    if (balanceScore >= 0) {
      return { text: 'Balanced', color: colors.text.secondary };
    }
    if (balanceScore >= -30) {
      return { text: 'Needs attention', color: '#8b6914' };
    }
    return { text: 'Focus on positive habits', color: '#6b2d3d' };
  };

  const balanceStatus = getBalanceStatus();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.title}>Current Habits Audit</Text>
        <Text style={styles.subtitle}>
          Review your daily routines and identify which habits serve you well
          and which ones might need changing.
        </Text>
      </View>

      {/* Summary Card */}
      <Card elevation="raised" style={styles.summaryCard}>
        <View style={styles.summaryHeader}>
          <Text style={styles.summaryTitle}>Habit Balance</Text>
          <View style={[
            styles.balanceIndicator,
            { backgroundColor: balanceStatus.color + '20' }
          ]}>
            <Text style={[styles.balanceText, { color: balanceStatus.color }]}>
              {balanceStatus.text}
            </Text>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <View style={[styles.statDot, styles.statPositive]} />
            <Text style={styles.statNumber}>{summary.positive}</Text>
            <Text style={styles.statLabel}>Positive</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <View style={[styles.statDot, styles.statNegative]} />
            <Text style={styles.statNumber}>{summary.negative}</Text>
            <Text style={styles.statLabel}>Negative</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <View style={[styles.statDot, styles.statNeutral]} />
            <Text style={styles.statNumber}>{summary.neutral}</Text>
            <Text style={styles.statLabel}>Neutral</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <View style={[styles.statDot, styles.statTotal]} />
            <Text style={styles.statNumber}>{summary.total}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
        </View>

        {/* Balance Bar */}
        {summary.total > 0 && (
          <View style={styles.balanceBarContainer}>
            <View style={styles.balanceBar}>
              <View
                style={[
                  styles.balanceBarFill,
                  styles.balanceBarPositive,
                  { width: `${(summary.positive / summary.total) * 100}%` },
                ]}
              />
              <View
                style={[
                  styles.balanceBarFill,
                  styles.balanceBarNeutral,
                  { width: `${(summary.neutral / summary.total) * 100}%` },
                ]}
              />
              <View
                style={[
                  styles.balanceBarFill,
                  styles.balanceBarNegative,
                  { width: `${(summary.negative / summary.total) * 100}%` },
                ]}
              />
            </View>
          </View>
        )}
      </Card>

      {/* Instructions */}
      <View style={styles.instructions}>
        <Text style={styles.instructionsText}>
          Add your daily habits below, then categorize each as positive, negative, or neutral.
        </Text>
      </View>

      {/* Habit Sections */}
      <View style={styles.sectionsContainer}>
        <HabitSection
          timeOfDay="morning"
          habits={habitsData.morning}
          onAddHabit={handleAddHabit}
          onEditHabit={handleEditHabit}
          onRemoveHabit={handleRemoveHabit}
          onCategoryChange={handleCategoryChange}
          initialExpanded={true}
          testID="morning-section"
        />

        <HabitSection
          timeOfDay="afternoon"
          habits={habitsData.afternoon}
          onAddHabit={handleAddHabit}
          onEditHabit={handleEditHabit}
          onRemoveHabit={handleRemoveHabit}
          onCategoryChange={handleCategoryChange}
          initialExpanded={true}
          testID="afternoon-section"
        />

        <HabitSection
          timeOfDay="evening"
          habits={habitsData.evening}
          onAddHabit={handleAddHabit}
          onEditHabit={handleEditHabit}
          onRemoveHabit={handleRemoveHabit}
          onCategoryChange={handleCategoryChange}
          initialExpanded={true}
          testID="evening-section"
        />
      </View>

      {/* Tips Card */}
      <Card elevation="flat" style={styles.tipsCard}>
        <Text style={styles.tipsTitle}>Tips for Success</Text>
        <View style={styles.tipItem}>
          <Text style={styles.tipBullet}>-</Text>
          <Text style={styles.tipText}>
            Be honest about your habits - awareness is the first step to change
          </Text>
        </View>
        <View style={styles.tipItem}>
          <Text style={styles.tipBullet}>-</Text>
          <Text style={styles.tipText}>
            Look for patterns - do negative habits cluster at certain times?
          </Text>
        </View>
        <View style={styles.tipItem}>
          <Text style={styles.tipBullet}>-</Text>
          <Text style={styles.tipText}>
            Start small - focus on replacing one negative habit at a time
          </Text>
        </View>
      </Card>

      {/* Save Status */}
      <SaveIndicator
        isSaving={isSaving}
        lastSaved={lastSaved}
        isError={isError}
        onRetry={saveNow}
      />

      {/* Save Button */}
      <View style={styles.saveContainer}>
        <Button
          title={isSaving ? 'Saving...' : 'Save & Continue'}
          onPress={handleSave}
          variant="primary"
          size="lg"
          fullWidth
          loading={isSaving}
          disabled={isSaving}
          accessibilityLabel="Save habits audit"
          accessibilityHint="Saves your current habits to your profile"
        />
      </View>

      {/* Bottom Spacing */}
      <View style={styles.bottomSpacer} />
    </ScrollView>
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
  content: {
    padding: spacing.md,
  },
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 15,
    color: colors.text.secondary,
    lineHeight: 22,
  },
  summaryCard: {
    marginBottom: spacing.md,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  balanceIndicator: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  balanceText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.gray[200],
  },
  statDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: spacing.xs,
  },
  statPositive: {
    backgroundColor: '#2d5a4a',
  },
  statNegative: {
    backgroundColor: '#6b2d3d',
  },
  statNeutral: {
    backgroundColor: '#a0a0b0',
  },
  statTotal: {
    backgroundColor: colors.primary[600],
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
  },
  statLabel: {
    fontSize: 11,
    color: colors.text.tertiary,
    marginTop: 2,
  },
  balanceBarContainer: {
    marginTop: spacing.xs,
  },
  balanceBar: {
    height: 8,
    borderRadius: borderRadius.full,
    backgroundColor: colors.gray[200],
    flexDirection: 'row',
    overflow: 'hidden',
  },
  balanceBarFill: {
    height: '100%',
  },
  balanceBarPositive: {
    backgroundColor: '#2d5a4a',
  },
  balanceBarNeutral: {
    backgroundColor: '#a0a0b0',
  },
  balanceBarNegative: {
    backgroundColor: '#6b2d3d',
  },
  instructions: {
    marginBottom: spacing.md,
    paddingHorizontal: spacing.xs,
  },
  instructionsText: {
    fontSize: 14,
    color: colors.text.secondary,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  sectionsContainer: {
    marginBottom: spacing.md,
  },
  tipsCard: {
    marginBottom: spacing.lg,
    backgroundColor: colors.primary[50],
    borderColor: colors.primary[100],
    borderWidth: 1,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary[700],
    marginBottom: spacing.sm,
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
  },
  tipBullet: {
    fontSize: 14,
    color: colors.primary[600],
    marginRight: spacing.sm,
    fontWeight: '600',
  },
  tipText: {
    fontSize: 13,
    color: colors.primary[800],
    flex: 1,
    lineHeight: 18,
  },
  saveContainer: {
    marginBottom: spacing.md,
  },
  bottomSpacer: {
    height: spacing.xl,
  },
});

export default HabitsAuditScreen;
