/**
 * TimelineScreen
 *
 * Gantt-style timeline visualization for Phase 3: Goal Setting.
 * Shows goals as horizontal bars based on start date to deadline.
 *
 * Features:
 * - Horizontal Gantt-style timeline
 * - Goals as horizontal bars from start date to deadline
 * - Color-coded by category
 * - "Today" vertical line indicator
 * - View toggle: Week, Month, Quarter
 * - Horizontal ScrollView for panning
 * - Empty state when no goals with deadlines
 * - Tap goal bar for details modal
 *
 * Design (dark spiritual theme):
 * - Background: #1a1a2e (deep charcoal)
 * - Elevated: #252547 (cards)
 * - Accent: #c9a227 (muted gold)
 */

import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import type { WorkbookStackScreenProps } from '../../../types/navigation';
import { TimelineChart } from '../../../components/workbook/TimelineChart';

// Design system colors
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
  accentGreen: '#2d5a4a',
  border: '#3a3a5a',
  todayLine: '#c9a227',
};

// Category colors for timeline bars
export const CATEGORY_COLORS: Record<string, string> = {
  Personal: '#4a1a6b',      // Purple
  Professional: '#1a4a6b',  // Blue
  Health: '#2d5a4a',        // Green
  Financial: '#6b5a1a',     // Gold
  Relationship: '#6b1a4a',  // Rose
};

/**
 * Timeline Goal interface
 */
export interface TimelineGoal {
  id: string;
  title: string;
  category: string;
  startDate: string;
  endDate: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'overdue';
  color: string;
  description?: string;
}

/**
 * Timeline view type
 */
export type TimelineView = 'week' | 'month' | 'quarter';

/**
 * Mock goals data for demonstration
 * In production, this would come from Supabase
 */
const MOCK_GOALS: TimelineGoal[] = [
  {
    id: '1',
    title: 'Complete meditation course',
    category: 'Personal',
    startDate: '2025-11-15',
    endDate: '2025-12-15',
    status: 'in_progress',
    color: CATEGORY_COLORS.Personal,
    description: 'Finish the 30-day meditation journey to deepen mindfulness practice.',
  },
  {
    id: '2',
    title: 'Launch new project',
    category: 'Professional',
    startDate: '2025-11-20',
    endDate: '2025-12-31',
    status: 'not_started',
    color: CATEGORY_COLORS.Professional,
    description: 'Launch the MVP of the new wellness app.',
  },
  {
    id: '3',
    title: 'Run 5K consistently',
    category: 'Health',
    startDate: '2025-11-01',
    endDate: '2025-12-01',
    status: 'in_progress',
    color: CATEGORY_COLORS.Health,
    description: 'Build up to running 5K three times per week.',
  },
  {
    id: '4',
    title: 'Build emergency fund',
    category: 'Financial',
    startDate: '2025-11-01',
    endDate: '2026-02-28',
    status: 'in_progress',
    color: CATEGORY_COLORS.Financial,
    description: 'Save 3 months of expenses in emergency fund.',
  },
  {
    id: '5',
    title: 'Weekly date nights',
    category: 'Relationship',
    startDate: '2025-11-01',
    endDate: '2025-12-31',
    status: 'in_progress',
    color: CATEGORY_COLORS.Relationship,
    description: 'Schedule and maintain weekly quality time with partner.',
  },
];

type Props = WorkbookStackScreenProps<'Timeline'>;

/**
 * Get status badge style
 */
const getStatusStyle = (status: TimelineGoal['status']) => {
  switch (status) {
    case 'completed':
      return { bg: '#2d5a4a', text: 'Completed' };
    case 'in_progress':
      return { bg: '#1a4a6b', text: 'In Progress' };
    case 'overdue':
      return { bg: '#6b2d3d', text: 'Overdue' };
    default:
      return { bg: DESIGN_COLORS.bgElevated, text: 'Not Started' };
  }
};

/**
 * TimelineScreen Component
 */
const TimelineScreen: React.FC<Props> = ({ navigation: _navigation }) => {
  const [selectedView, setSelectedView] = useState<TimelineView>('month');
  const [selectedGoal, setSelectedGoal] = useState<TimelineGoal | null>(null);
  const [goals] = useState<TimelineGoal[]>(MOCK_GOALS);

  /**
   * Filter goals that have valid dates
   */
  const validGoals = useMemo(() => {
    return goals.filter((goal) => goal.startDate && goal.endDate);
  }, [goals]);

  /**
   * Handle view change
   */
  const handleViewChange = useCallback((view: TimelineView) => {
    setSelectedView(view);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  /**
   * Handle goal bar tap
   */
  const handleGoalPress = useCallback((goal: TimelineGoal) => {
    setSelectedGoal(goal);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, []);

  /**
   * Close details modal
   */
  const handleCloseModal = useCallback(() => {
    setSelectedGoal(null);
  }, []);

  /**
   * Format date for display
   */
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  /**
   * Calculate days remaining
   */
  const getDaysRemaining = (endDate: string): number => {
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Goal Timeline</Text>
          <Text style={styles.subtitle}>
            Visualize your journey toward achieving your goals
          </Text>
        </View>

        {/* View Toggle */}
        <View style={styles.viewToggleContainer}>
          <View style={styles.viewToggle}>
            {(['week', 'month', 'quarter'] as TimelineView[]).map((view) => (
              <TouchableOpacity
                key={view}
                style={[
                  styles.viewToggleButton,
                  selectedView === view && styles.viewToggleButtonActive,
                ]}
                onPress={() => handleViewChange(view)}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={`View by ${view}`}
                accessibilityState={{ selected: selectedView === view }}
              >
                <Text
                  style={[
                    styles.viewToggleText,
                    selectedView === view && styles.viewToggleTextActive,
                  ]}
                >
                  {view.charAt(0).toUpperCase() + view.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          {Object.entries(CATEGORY_COLORS).map(([category, color]) => (
            <View key={category} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: color }]} />
              <Text style={styles.legendText}>{category}</Text>
            </View>
          ))}
        </View>

        {/* Timeline Chart */}
        {validGoals.length > 0 ? (
          <TimelineChart
            goals={validGoals}
            viewType={selectedView}
            onGoalPress={handleGoalPress}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>📅</Text>
            <Text style={styles.emptyStateTitle}>No Goals With Deadlines</Text>
            <Text style={styles.emptyStateText}>
              Add goals with start dates and deadlines in the SMART Goals screen
              to see them visualized here.
            </Text>
          </View>
        )}

        {/* Tips Card */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>Timeline Tips</Text>
          <Text style={styles.tipItem}>
            - Scroll horizontally to view different time periods
          </Text>
          <Text style={styles.tipItem}>
            - The gold line indicates today's date
          </Text>
          <Text style={styles.tipItem}>
            - Tap a goal bar to see detailed information
          </Text>
          <Text style={styles.tipItem}>
            - Switch views to see week, month, or quarter perspective
          </Text>
        </View>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Goal Details Modal */}
      <Modal
        visible={selectedGoal !== null}
        transparent
        animationType="fade"
        onRequestClose={handleCloseModal}
      >
        <Pressable style={styles.modalOverlay} onPress={handleCloseModal}>
          <Pressable
            style={styles.modalContent}
            onPress={(e) => e.stopPropagation()}
          >
            {selectedGoal && (
              <>
                {/* Goal Header */}
                <View style={styles.modalHeader}>
                  <View
                    style={[
                      styles.modalCategoryBadge,
                      { backgroundColor: selectedGoal.color },
                    ]}
                  >
                    <Text style={styles.modalCategoryText}>
                      {selectedGoal.category}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={handleCloseModal}
                    style={styles.modalCloseButton}
                    accessibilityLabel="Close modal"
                  >
                    <Text style={styles.modalCloseText}>×</Text>
                  </TouchableOpacity>
                </View>

                {/* Goal Title */}
                <Text style={styles.modalTitle}>{selectedGoal.title}</Text>

                {/* Description */}
                {selectedGoal.description && (
                  <Text style={styles.modalDescription}>
                    {selectedGoal.description}
                  </Text>
                )}

                {/* Date Range */}
                <View style={styles.modalDates}>
                  <View style={styles.modalDateItem}>
                    <Text style={styles.modalDateLabel}>Start Date</Text>
                    <Text style={styles.modalDateValue}>
                      {formatDate(selectedGoal.startDate)}
                    </Text>
                  </View>
                  <View style={styles.modalDateSeparator}>
                    <Text style={styles.modalDateArrow}>→</Text>
                  </View>
                  <View style={styles.modalDateItem}>
                    <Text style={styles.modalDateLabel}>Deadline</Text>
                    <Text style={styles.modalDateValue}>
                      {formatDate(selectedGoal.endDate)}
                    </Text>
                  </View>
                </View>

                {/* Status and Days Remaining */}
                <View style={styles.modalStats}>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor:
                          getStatusStyle(selectedGoal.status).bg,
                      },
                    ]}
                  >
                    <Text style={styles.statusText}>
                      {getStatusStyle(selectedGoal.status).text}
                    </Text>
                  </View>
                  <View style={styles.daysRemaining}>
                    <Text style={styles.daysRemainingValue}>
                      {getDaysRemaining(selectedGoal.endDate)}
                    </Text>
                    <Text style={styles.daysRemainingLabel}>days left</Text>
                  </View>
                </View>
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
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

  // View Toggle
  viewToggleContainer: {
    marginBottom: 20,
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: DESIGN_COLORS.bgSecondary,
    borderRadius: 12,
    padding: 4,
  },
  viewToggleButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewToggleButtonActive: {
    backgroundColor: DESIGN_COLORS.accentPurple,
  },
  viewToggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: DESIGN_COLORS.textTertiary,
  },
  viewToggleTextActive: {
    color: DESIGN_COLORS.textPrimary,
  },

  // Legend
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 12,
    color: DESIGN_COLORS.textSecondary,
  },

  // Empty State
  emptyState: {
    backgroundColor: DESIGN_COLORS.bgElevated,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: DESIGN_COLORS.textPrimary,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: DESIGN_COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },

  // Tips Card
  tipsCard: {
    backgroundColor: DESIGN_COLORS.bgSecondary,
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
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

  bottomSpacer: {
    height: 40,
  },

  // Modal
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
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalCategoryBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  modalCategoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: DESIGN_COLORS.textPrimary,
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: DESIGN_COLORS.bgPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseText: {
    fontSize: 24,
    color: DESIGN_COLORS.textSecondary,
    lineHeight: 26,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: DESIGN_COLORS.textPrimary,
    marginBottom: 12,
  },
  modalDescription: {
    fontSize: 14,
    color: DESIGN_COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 20,
  },
  modalDates: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DESIGN_COLORS.bgPrimary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  modalDateItem: {
    flex: 1,
    alignItems: 'center',
  },
  modalDateLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: DESIGN_COLORS.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  modalDateValue: {
    fontSize: 14,
    fontWeight: '600',
    color: DESIGN_COLORS.textPrimary,
  },
  modalDateSeparator: {
    paddingHorizontal: 12,
  },
  modalDateArrow: {
    fontSize: 18,
    color: DESIGN_COLORS.accentGold,
  },
  modalStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
    color: DESIGN_COLORS.textPrimary,
  },
  daysRemaining: {
    alignItems: 'flex-end',
  },
  daysRemainingValue: {
    fontSize: 24,
    fontWeight: '700',
    color: DESIGN_COLORS.accentGold,
  },
  daysRemainingLabel: {
    fontSize: 11,
    color: DESIGN_COLORS.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

export default TimelineScreen;
