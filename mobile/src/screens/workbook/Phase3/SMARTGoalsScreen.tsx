/**
 * SMART Goals Screen
 *
 * Phase 3 screen for creating and managing SMART goals.
 * SMART = Specific, Measurable, Achievable, Relevant, Time-bound.
 *
 * Features:
 * - List view of all goals with status badges
 * - Category-based color coding
 * - Floating action button to add new goals
 * - Modal form for creating/editing goals
 * - Auto-save with debounce to Supabase (stubbed)
 * - Delete with confirmation
 * - Dark spiritual theme
 *
 * @example
 * Navigation: WorkbookNavigator -> SMARTGoals
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Text } from '../../../components';
import GoalCard, {
  SMARTGoal,
  GoalStatus,
  GoalCategory,
  CATEGORY_COLORS,
  CATEGORY_NAMES,
} from '../../../components/workbook/GoalCard';
import SMARTGoalForm from '../../../components/workbook/SMARTGoalForm';
import { SaveIndicator } from '../../../components/workbook';
import { colors, spacing, borderRadius, shadows } from '../../../theme';
import type { WorkbookStackScreenProps } from '../../../types/navigation';
import { useWorkbookProgress } from '../../../hooks/useWorkbook';
import { useAutoSave } from '../../../hooks/useAutoSave';
import { WORKSHEET_IDS } from '../../../types/workbook';

/**
 * Generate unique ID
 */
const generateId = (): string => {
  return `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Sample goals for demonstration
 */
const SAMPLE_GOALS: SMARTGoal[] = [
  {
    id: 'sample_1',
    title: 'Complete daily meditation practice',
    category: 'personal',
    specific: 'Meditate for 20 minutes every morning before work',
    measurable: 'Track daily completions in the app, aim for 30 days streak',
    achievable: 'Start with guided meditations and use reminders',
    relevant: 'Supports my goal of reducing stress and improving focus',
    timeBound: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'in_progress',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

type Props = WorkbookStackScreenProps<'SMARTGoals'>;

/**
 * SMART Goals Screen Component
 */
/** Data structure for storing goals */
interface SMARTGoalsData {
  goals: SMARTGoal[];
  updatedAt: string;
}

const SMARTGoalsScreen: React.FC<Props> = ({ navigation: _navigation }) => {
  // Fetch saved progress from Supabase
  const { data: savedProgress } = useWorkbookProgress(3, WORKSHEET_IDS.SMART_GOALS);

  // State
  const [goals, setGoals] = useState<SMARTGoal[]>(SAMPLE_GOALS);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SMARTGoal | null>(null);
  const [filterCategory, setFilterCategory] = useState<GoalCategory | 'all'>('all');

  // Animation refs
  const fabScale = useRef(new Animated.Value(1)).current;

  // Auto-save hook
  const { isSaving, isError, lastSaved, saveNow } = useAutoSave({
    data: { goals, updatedAt: new Date().toISOString() } as unknown as Record<string, unknown>,
    phaseNumber: 3,
    worksheetId: WORKSHEET_IDS.SMART_GOALS,
    debounceMs: 1500,
  });

  // Load saved data on mount
  useEffect(() => {
    if (savedProgress?.data) {
      const data = savedProgress.data as unknown as SMARTGoalsData;
      if (data.goals) setGoals(data.goals);
    }
  }, [savedProgress]);

  /**
   * Handle adding a new goal
   */
  const handleAddGoal = useCallback(() => {
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

    setEditingGoal(null);
    setShowForm(true);
  }, [fabScale]);

  /**
   * Handle editing an existing goal
   */
  const handleEditGoal = useCallback((goal: SMARTGoal) => {
    setEditingGoal(goal);
    setShowForm(true);
  }, []);

  /**
   * Handle saving a goal (create or update)
   */
  const handleSaveGoal = useCallback((goalData: Omit<SMARTGoal, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();

    if (editingGoal) {
      // Update existing goal
      setGoals(prev => prev.map(g =>
        g.id === editingGoal.id
          ? { ...g, ...goalData, updatedAt: now }
          : g
      ));
    } else {
      // Create new goal
      const newGoal: SMARTGoal = {
        ...goalData,
        id: generateId(),
        createdAt: now,
        updatedAt: now,
      };
      setGoals(prev => [newGoal, ...prev]);
    }

    setShowForm(false);
    setEditingGoal(null);
  }, [editingGoal]);

  /**
   * Handle deleting a goal
   */
  const handleDeleteGoal = useCallback((goalId: string) => {
    setGoals(prev => prev.filter(g => g.id !== goalId));
  }, []);

  /**
   * Handle status change
   */
  const handleStatusChange = useCallback((goalId: string, status: GoalStatus) => {
    setGoals(prev => prev.map(g =>
      g.id === goalId
        ? { ...g, status, updatedAt: new Date().toISOString() }
        : g
    ));

    // Celebration haptic for completed goals
    if (status === 'completed') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, []);

  /**
   * Filter goals by category
   */
  const filteredGoals = filterCategory === 'all'
    ? goals
    : goals.filter(g => g.category === filterCategory);

  /**
   * Calculate stats
   */
  const stats = {
    total: goals.length,
    completed: goals.filter(g => g.status === 'completed').length,
    inProgress: goals.filter(g => g.status === 'in_progress').length,
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.phaseLabel}>Phase 3</Text>
          <Text style={styles.title}>SMART Goals</Text>
          <Text style={styles.subtitle}>
            Define clear, actionable goals using the SMART framework
          </Text>

          {/* Hand-drawn decorative divider */}
          <View style={styles.headerDivider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerStar}>{'\u2726'}</Text>
            <View style={styles.dividerLine} />
          </View>
        </View>

        {/* Stats Card */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.dark.accentTeal }]}>
              {stats.inProgress}
            </Text>
            <Text style={styles.statLabel}>In Progress</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.dark.accentGreen }]}>
              {stats.completed}
            </Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </View>

        {/* Save Status Indicator */}
        <SaveIndicator isSaving={isSaving} lastSaved={lastSaved} isError={isError} onRetry={saveNow} />

        {/* Category Filter */}
        <View style={styles.filterContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
          >
            <TouchableOpacity
              style={[
                styles.filterChip,
                filterCategory === 'all' && styles.filterChipActive,
              ]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setFilterCategory('all');
              }}
              accessibilityRole="button"
              accessibilityState={{ selected: filterCategory === 'all' }}
              testID="filter-all"
            >
              <Text style={[
                styles.filterText,
                filterCategory === 'all' && styles.filterTextActive,
              ]}>
                All
              </Text>
            </TouchableOpacity>

            {(Object.keys(CATEGORY_NAMES) as GoalCategory[]).map(cat => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.filterChip,
                  filterCategory === cat && styles.filterChipActive,
                  filterCategory === cat && { borderColor: CATEGORY_COLORS[cat] },
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setFilterCategory(cat);
                }}
                accessibilityRole="button"
                accessibilityState={{ selected: filterCategory === cat }}
                testID={`filter-${cat}`}
              >
                <View style={[
                  styles.filterDot,
                  { backgroundColor: CATEGORY_COLORS[cat] },
                ]} />
                <Text style={[
                  styles.filterText,
                  filterCategory === cat && styles.filterTextActive,
                ]}>
                  {CATEGORY_NAMES[cat]}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Goals List */}
        <View style={styles.goalsContainer}>
          {filteredGoals.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>{'\uD83C\uDFAF'}</Text>
              <Text style={styles.emptyTitle}>No goals yet</Text>
              <Text style={styles.emptySubtitle}>
                {filterCategory === 'all'
                  ? 'Tap the + button to create your first SMART goal'
                  : `No ${CATEGORY_NAMES[filterCategory as GoalCategory].toLowerCase()} goals`}
              </Text>
            </View>
          ) : (
            filteredGoals.map(goal => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onPress={() => handleEditGoal(goal)}
                onDelete={() => handleDeleteGoal(goal.id)}
                onStatusChange={(status) => handleStatusChange(goal.id, status)}
                testID={`goal-card-${goal.id}`}
              />
            ))
          )}
        </View>

        {/* SMART Explanation Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>What makes a goal SMART?</Text>
          <View style={styles.infoList}>
            {[
              { letter: 'S', word: 'Specific', desc: 'Clear and well-defined' },
              { letter: 'M', word: 'Measurable', desc: 'Trackable progress' },
              { letter: 'A', word: 'Achievable', desc: 'Realistic and attainable' },
              { letter: 'R', word: 'Relevant', desc: 'Aligned with your values' },
              { letter: 'T', word: 'Time-bound', desc: 'Has a deadline' },
            ].map(item => (
              <View key={item.letter} style={styles.infoRow}>
                <View style={styles.infoLetterBadge}>
                  <Text style={styles.infoLetter}>{item.letter}</Text>
                </View>
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoWord}>{item.word}</Text>
                  <Text style={styles.infoDesc}>{item.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Inspirational Quote */}
        <View style={styles.quoteContainer}>
          <Text style={styles.quoteText}>
            "A goal without a plan is just a wish."
          </Text>
          <Text style={styles.quoteAuthor}>- Antoine de Saint-Exupery</Text>
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
          onPress={handleAddGoal}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Add new goal"
          accessibilityHint="Opens form to create a new SMART goal"
          testID="add-goal-fab"
        >
          <Text style={styles.fabIcon}>+</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Goal Form Modal */}
      <SMARTGoalForm
        goal={editingGoal}
        visible={showForm}
        onSave={handleSaveGoal}
        onCancel={() => {
          setShowForm(false);
          setEditingGoal(null);
        }}
        testID="smart-goal-form"
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
    fontSize: 12,
    color: colors.dark.textSecondary,
    marginTop: 2,
  },

  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: `${colors.dark.textTertiary}30`,
  },

  filterContainer: {
    marginBottom: spacing.md,
  },

  filterScroll: {
    paddingVertical: spacing.xs,
    gap: spacing.sm,
    flexDirection: 'row',
  },

  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.dark.bgElevated,
    borderWidth: 1,
    borderColor: 'transparent',
  },

  filterChipActive: {
    borderColor: colors.dark.accentGold,
    backgroundColor: `${colors.dark.accentGold}15`,
  },

  filterDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.xs,
  },

  filterText: {
    fontSize: 13,
    color: colors.dark.textSecondary,
    fontWeight: '500',
  },

  filterTextActive: {
    color: colors.dark.textPrimary,
    fontWeight: '600',
  },

  goalsContainer: {
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

  infoCard: {
    backgroundColor: colors.dark.bgElevated,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },

  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.dark.textPrimary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },

  infoList: {
    gap: spacing.sm,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  infoLetterBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.dark.accentGold,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },

  infoLetter: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.dark.bgPrimary,
  },

  infoTextContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'baseline',
  },

  infoWord: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.dark.textPrimary,
    marginRight: spacing.xs,
  },

  infoDesc: {
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
});

export default SMARTGoalsScreen;
