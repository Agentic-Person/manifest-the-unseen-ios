/**
 * InspirationReframeScreen
 *
 * Phase 8: Turning Envy Into Inspiration - Exercise 2
 *
 * This screen transforms envy items from the inventory into sources
 * of inspiration through a three-step reframing process.
 *
 * Features:
 * - Visual three-column transformation flow
 * - Auto-populated from Envy Inventory
 * - Edit value and action steps
 * - Celebrate completed transformations
 * - Progress tracking
 * - Dark spiritual theme
 */

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Text } from '../../../components/Text';
import { ReframeCard, ReframeData } from '../../../components/workbook/ReframeCard';
import { EnvyItem } from '../../../components/workbook/EnvyCard';
import { colors, spacing, borderRadius } from '../../../theme';
import type { WorkbookStackScreenProps } from '../../../types/navigation';

type Props = WorkbookStackScreenProps<'InspirationReframe'>;

/**
 * Generate a unique ID
 */
const generateId = (): string => {
  return `reframe_${Date.now()}_${Math.random().toString(36).substring(7)}`;
};

/**
 * Sample envy items (in real app, would come from shared state/database)
 * This simulates data that would be passed from EnvyInventoryScreen
 */
const SAMPLE_ENVY_ITEMS: EnvyItem[] = [
  {
    id: 'envy_1',
    whoWhat: "My colleague's promotion",
    trigger: 'Seeing their announcement on LinkedIn',
    category: 'success',
    intensity: 7,
    reflection: 'I value recognition and career growth',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'envy_2',
    whoWhat: "Friend's new house",
    trigger: 'Visiting their housewarming party',
    category: 'wealth',
    intensity: 5,
    reflection: 'I want stability and a place to call home',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

/**
 * InspirationReframeScreen Component
 */
const InspirationReframeScreen: React.FC<Props> = ({ navigation }) => {
  // State
  const [envyItems] = useState<EnvyItem[]>(SAMPLE_ENVY_ITEMS);
  const [reframes, setReframes] = useState<ReframeData[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'complete'>('all');

  /**
   * Initialize reframes from envy items
   */
  useEffect(() => {
    // In real app, check if reframe already exists for each envy item
    const initialReframes: ReframeData[] = envyItems.map((envy) => ({
      id: generateId(),
      envyId: envy.id,
      envyText: envy.whoWhat,
      valueText: '',
      actionText: '',
      isComplete: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    setReframes(initialReframes);
  }, [envyItems]);

  /**
   * Calculate progress
   */
  const progress = useMemo(() => {
    if (reframes.length === 0) return { completed: 0, total: 0, percentage: 0 };
    const completed = reframes.filter((r) => r.isComplete).length;
    return {
      completed,
      total: reframes.length,
      percentage: Math.round((completed / reframes.length) * 100),
    };
  }, [reframes]);

  /**
   * Filter reframes
   */
  const filteredReframes = useMemo(() => {
    switch (filter) {
      case 'pending':
        return reframes.filter((r) => !r.isComplete);
      case 'complete':
        return reframes.filter((r) => r.isComplete);
      default:
        return reframes;
    }
  }, [reframes, filter]);

  /**
   * Update value text
   */
  const handleValueChange = useCallback((id: string, value: string) => {
    setReframes((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, valueText: value, updatedAt: new Date().toISOString() } : r
      )
    );
    console.log('[InspirationReframe] Value updated, auto-save triggered');
  }, []);

  /**
   * Update action text
   */
  const handleActionChange = useCallback((id: string, action: string) => {
    setReframes((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, actionText: action, updatedAt: new Date().toISOString() } : r
      )
    );
    console.log('[InspirationReframe] Action updated, auto-save triggered');
  }, []);

  /**
   * Mark reframe as complete
   */
  const handleComplete = useCallback((id: string) => {
    setReframes((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, isComplete: true, updatedAt: new Date().toISOString() } : r
      )
    );
    console.log('[InspirationReframe] Reframe completed, auto-save triggered');
  }, []);

  /**
   * Render filter tabs
   */
  const renderFilterTab = (key: 'all' | 'pending' | 'complete', label: string, count: number) => {
    const isSelected = filter === key;
    return (
      <TouchableOpacity
        key={key}
        style={[styles.filterTab, isSelected && styles.filterTabSelected]}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          setFilter(key);
        }}
        accessibilityRole="tab"
        accessibilityState={{ selected: isSelected }}
        testID={`filter-${key}`}
      >
        <Text style={[styles.filterTabText, isSelected && styles.filterTabTextSelected]}>
          {label} ({count})
        </Text>
      </TouchableOpacity>
    );
  };

  /**
   * Render progress bar
   */
  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressHeader}>
        <Text style={styles.progressLabel}>{'\u{1F31F}'} Transformation Progress</Text>
        <Text style={styles.progressText}>
          {progress.completed} of {progress.total}
        </Text>
      </View>
      <View style={styles.progressBar}>
        <View
          style={[styles.progressFill, { width: `${progress.percentage}%` }]}
        />
      </View>
      {progress.percentage === 100 && (
        <Text style={styles.progressComplete}>
          {'\u{1F389}'} Amazing! All envies transformed into inspiration!
        </Text>
      )}
    </View>
  );

  /**
   * Render empty state
   */
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateIcon}>{'\u{1F52E}'}</Text>
      <Text style={styles.emptyStateTitle}>No Items to Transform</Text>
      <Text style={styles.emptyStateText}>
        {filter === 'pending'
          ? "Great work! You've transformed all your envies into inspiration."
          : filter === 'complete'
          ? "No transformations completed yet. Start by filling in what you value and how you can achieve it."
          : "Add items to your Envy Inventory first, then return here to transform them into inspiration."}
      </Text>
      {filter === 'all' && (
        <TouchableOpacity
          style={styles.emptyStateButton}
          onPress={() => navigation.navigate('EnvyInventory')}
          testID="go-to-inventory"
        >
          <Text style={styles.emptyStateButtonText}>Go to Envy Inventory</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  /**
   * Render item
   */
  const renderItem = ({ item }: { item: ReframeData }) => (
    <ReframeCard
      reframe={item}
      onValueChange={(value) => handleValueChange(item.id, value)}
      onActionChange={(action) => handleActionChange(item.id, action)}
      onComplete={() => handleComplete(item.id)}
      testID={`reframe-card-${item.id}`}
    />
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {/* Header Info */}
      <View style={styles.headerInfo}>
        <Text style={styles.headerTitle}>{'\u{2728}'} Transform Envy to Inspiration</Text>
        <Text style={styles.headerSubtitle}>
          Reframe each source of envy by discovering what you truly value and how you can achieve it.
        </Text>
      </View>

      {/* Progress Bar */}
      {renderProgressBar()}

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        {renderFilterTab('all', 'All', reframes.length)}
        {renderFilterTab('pending', 'Pending', reframes.filter((r) => !r.isComplete).length)}
        {renderFilterTab('complete', 'Complete', reframes.filter((r) => r.isComplete).length)}
      </View>

      {/* Reframe Cards */}
      <FlatList
        data={filteredReframes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
        testID="reframe-list"
      />
    </SafeAreaView>
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

  headerInfo: {
    padding: spacing.md,
    paddingBottom: spacing.sm,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.dark.textPrimary,
    marginBottom: spacing.xs,
  },

  headerSubtitle: {
    fontSize: 14,
    color: colors.dark.textSecondary,
    lineHeight: 20,
  },

  progressContainer: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.dark.bgElevated,
    borderRadius: borderRadius.lg,
  },

  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },

  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.dark.textPrimary,
  },

  progressText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.dark.accentGold,
  },

  progressBar: {
    height: 8,
    backgroundColor: `${colors.dark.textTertiary}30`,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: colors.dark.accentGold,
    borderRadius: borderRadius.full,
  },

  progressComplete: {
    fontSize: 13,
    color: colors.dark.accentGold,
    textAlign: 'center',
    marginTop: spacing.sm,
    fontWeight: '600',
  },

  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },

  filterTab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: `${colors.dark.textTertiary}30`,
  },

  filterTabSelected: {
    backgroundColor: colors.dark.accentPurple,
    borderColor: colors.dark.accentPurple,
  },

  filterTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.dark.textSecondary,
  },

  filterTabTextSelected: {
    color: colors.dark.textPrimary,
  },

  listContent: {
    padding: spacing.md,
    paddingBottom: 96,
  },

  emptyState: {
    alignItems: 'center',
    paddingVertical: 96,
    paddingHorizontal: spacing.xl,
  },

  emptyStateIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },

  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.dark.textPrimary,
    marginBottom: spacing.sm,
  },

  emptyStateText: {
    fontSize: 14,
    color: colors.dark.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.lg,
  },

  emptyStateButton: {
    backgroundColor: colors.dark.accentGold,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
  },

  emptyStateButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.dark.bgPrimary,
  },
});

export default InspirationReframeScreen;
