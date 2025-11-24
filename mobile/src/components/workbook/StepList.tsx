/**
 * StepList Component
 *
 * Renders a reorderable list of action steps for the Action Plan screen.
 * Handles reordering via up/down buttons, completion toggling, and deletion.
 *
 * Design: Dark spiritual theme (#1a1a2e background, #c9a227 gold accent)
 */

import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ListRenderItemInfo,
} from 'react-native';
import ActionStep from './ActionStep';
import type { ActionStepData } from './ActionStep';

// Design system colors from APP-DESIGN.md
const DESIGN_COLORS = {
  bgPrimary: '#1a1a2e',
  bgSecondary: '#16213e',
  bgElevated: '#252547',
  textPrimary: '#e8e8e8',
  textSecondary: '#a0a0b0',
  textTertiary: '#6b6b80',
  accentPurple: '#4a1a6b',
  accentGold: '#c9a227',
  accentTeal: '#1a5f5f',
  border: '#3a3a5a',
};

/**
 * StepList component props
 */
interface StepListProps {
  steps: ActionStepData[];
  onToggleComplete: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  onDelete: (id: string) => void;
  emptyMessage?: string;
}

/**
 * Empty state component
 */
const EmptyState: React.FC<{ message: string }> = ({ message }) => (
  <View style={styles.emptyContainer}>
    <Text style={styles.emptyIcon}>📋</Text>
    <Text style={styles.emptyTitle}>No Steps Yet</Text>
    <Text style={styles.emptyMessage}>{message}</Text>
  </View>
);

/**
 * Progress bar component
 */
const ProgressBar: React.FC<{ completed: number; total: number }> = ({
  completed,
  total,
}) => {
  const percentage = total > 0 ? (completed / total) * 100 : 0;
  const isComplete = completed === total && total > 0;

  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressHeader}>
        <Text style={styles.progressLabel}>Progress</Text>
        <Text style={[styles.progressText, isComplete && styles.progressTextComplete]}>
          {completed}/{total} steps ({Math.round(percentage)}%)
        </Text>
      </View>
      <View style={styles.progressBarBackground}>
        <View
          style={[
            styles.progressBarFill,
            { width: `${percentage}%` },
            isComplete && styles.progressBarFillComplete,
          ]}
          accessibilityLabel={`Progress: ${Math.round(percentage)} percent`}
          testID="progress-bar-fill"
        />
      </View>
    </View>
  );
};

/**
 * StepList Component
 */
const StepList: React.FC<StepListProps> = ({
  steps,
  onToggleComplete,
  onMoveUp,
  onMoveDown,
  onDelete,
  emptyMessage = 'Add steps to break down your goal into actionable tasks.',
}) => {
  // Sort steps by order
  const sortedSteps = useMemo(() => {
    return [...steps].sort((a, b) => a.order - b.order);
  }, [steps]);

  // Calculate completion stats
  const completedCount = useMemo(() => {
    return steps.filter((step) => step.completed).length;
  }, [steps]);

  /**
   * Render individual step item
   */
  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<ActionStepData>) => (
      <ActionStep
        step={item}
        index={index}
        totalSteps={sortedSteps.length}
        onToggleComplete={onToggleComplete}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        onDelete={onDelete}
      />
    ),
    [sortedSteps.length, onToggleComplete, onMoveUp, onMoveDown, onDelete]
  );

  /**
   * Key extractor for FlatList
   */
  const keyExtractor = useCallback((item: ActionStepData) => item.id, []);

  /**
   * Empty list component
   */
  const ListEmptyComponent = useCallback(
    () => <EmptyState message={emptyMessage} />,
    [emptyMessage]
  );

  /**
   * Header component showing progress
   */
  const ListHeaderComponent = useCallback(() => {
    if (steps.length === 0) return null;
    return <ProgressBar completed={completedCount} total={steps.length} />;
  }, [completedCount, steps.length]);

  return (
    <View style={styles.container} testID="step-list">
      <FlatList
        data={sortedSteps}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListEmptyComponent={ListEmptyComponent}
        ListHeaderComponent={ListHeaderComponent}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false} // Let parent ScrollView handle scrolling
        accessibilityRole="list"
        accessibilityLabel={`Action steps list with ${steps.length} items, ${completedCount} completed`}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 8,
  },

  // Empty state
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
    backgroundColor: DESIGN_COLORS.bgSecondary,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
    borderStyle: 'dashed',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: DESIGN_COLORS.textPrimary,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    color: DESIGN_COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },

  // Progress bar
  progressContainer: {
    marginBottom: 16,
    backgroundColor: DESIGN_COLORS.bgSecondary,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: DESIGN_COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: DESIGN_COLORS.textPrimary,
  },
  progressTextComplete: {
    color: DESIGN_COLORS.accentGold,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: DESIGN_COLORS.bgElevated,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: DESIGN_COLORS.accentTeal,
    borderRadius: 4,
  },
  progressBarFillComplete: {
    backgroundColor: DESIGN_COLORS.accentGold,
  },
});

export default StepList;
export type { ActionStepData };
