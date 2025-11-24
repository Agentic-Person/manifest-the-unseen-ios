/**
 * TimelineChart Component
 *
 * Gantt-style horizontal timeline chart for visualizing goals.
 * Built using React Native's built-in View positioning (no SVG needed).
 *
 * Features:
 * - Horizontal scrollable timeline
 * - Goals displayed as horizontal bars
 * - "Today" vertical line indicator
 * - Time scale header (days/weeks/months)
 * - Category color-coded bars
 */

import React, { useMemo, useRef, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Dimensions,
} from 'react-native';
import { TimelineBar } from './TimelineBar';
import type { TimelineGoal, TimelineView } from '../../screens/workbook/Phase3/TimelineScreen';

// Design colors
const COLORS = {
  bgPrimary: '#1a1a2e',
  bgElevated: '#252547',
  textPrimary: '#e8e8e8',
  textSecondary: '#a0a0b0',
  textTertiary: '#6b6b80',
  border: '#3a3a5a',
  todayLine: '#c9a227',
  gridLine: 'rgba(58, 58, 90, 0.5)',
};

// Timeline configuration
const CONFIG = {
  rowHeight: 60,
  headerHeight: 50,
  labelWidth: 100,
  dayWidth: {
    week: 40,
    month: 14,
    quarter: 5,
  },
  barHeight: 32,
  barVerticalPadding: 14,
};

interface TimelineChartProps {
  goals: TimelineGoal[];
  viewType: TimelineView;
  onGoalPress: (goal: TimelineGoal) => void;
}

/**
 * Calculate timeline bounds based on goals
 */
const calculateTimelineBounds = (
  goals: TimelineGoal[],
  viewType: TimelineView
): { start: Date; end: Date; days: number } => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Find min/max dates from goals
  let minDate = new Date(today);
  let maxDate = new Date(today);

  goals.forEach((goal) => {
    const startDate = new Date(goal.startDate);
    const endDate = new Date(goal.endDate);

    if (startDate < minDate) minDate = new Date(startDate);
    if (endDate > maxDate) maxDate = new Date(endDate);
  });

  // Add padding based on view type
  const paddingDays = viewType === 'week' ? 3 : viewType === 'month' ? 7 : 14;

  minDate.setDate(minDate.getDate() - paddingDays);
  maxDate.setDate(maxDate.getDate() + paddingDays);

  // Calculate total days
  const days = Math.ceil(
    (maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  return { start: minDate, end: maxDate, days: Math.max(days, 30) };
};

/**
 * Generate time scale labels
 */
const generateTimeLabels = (
  startDate: Date,
  days: number,
  viewType: TimelineView
): { date: Date; label: string; isFirstOfMonth: boolean }[] => {
  const labels: { date: Date; label: string; isFirstOfMonth: boolean }[] = [];
  const intervalDays = viewType === 'week' ? 1 : viewType === 'month' ? 7 : 14;

  for (let i = 0; i < days; i += intervalDays) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);

    const isFirstOfMonth = date.getDate() <= intervalDays;
    let label: string;

    if (viewType === 'week') {
      label = date.getDate().toString();
    } else if (viewType === 'month') {
      label = date.getDate().toString();
    } else {
      label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    labels.push({ date, label, isFirstOfMonth });
  }

  return labels;
};

/**
 * Get position for a date on the timeline
 */
const getDatePosition = (
  date: Date,
  startDate: Date,
  dayWidth: number
): number => {
  const diffDays = Math.floor(
    (date.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  return diffDays * dayWidth;
};

/**
 * TimelineChart Component
 */
export const TimelineChart: React.FC<TimelineChartProps> = ({
  goals,
  viewType,
  onGoalPress,
}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const dayWidth = CONFIG.dayWidth[viewType];

  // Calculate timeline bounds
  const { start: timelineStart, days: totalDays } = useMemo(
    () => calculateTimelineBounds(goals, viewType),
    [goals, viewType]
  );

  // Generate time labels
  const timeLabels = useMemo(
    () => generateTimeLabels(timelineStart, totalDays, viewType),
    [timelineStart, totalDays, viewType]
  );

  // Calculate total width
  const timelineWidth = totalDays * dayWidth;
  const totalWidth = CONFIG.labelWidth + timelineWidth;

  // Calculate today's position
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayPosition = getDatePosition(today, timelineStart, dayWidth);

  // Scroll to today on mount
  useEffect(() => {
    if (scrollViewRef.current && todayPosition > 0) {
      const screenWidth = Dimensions.get('window').width;
      const scrollTo = Math.max(
        0,
        todayPosition + CONFIG.labelWidth - screenWidth / 2
      );
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ x: scrollTo, animated: true });
      }, 300);
    }
  }, [todayPosition, viewType]);

  // Calculate total height
  const totalHeight = CONFIG.headerHeight + goals.length * CONFIG.rowHeight + 20;

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={[styles.scrollContent, { width: totalWidth }]}
      >
        <View style={[styles.chartContainer, { height: totalHeight }]}>
          {/* Header Row - Time Scale */}
          <View style={[styles.headerRow, { width: totalWidth }]}>
            {/* Label Column Header */}
            <View style={[styles.labelHeader, { width: CONFIG.labelWidth }]}>
              <Text style={styles.labelHeaderText}>Goals</Text>
            </View>

            {/* Time Scale */}
            <View style={[styles.timeScale, { width: timelineWidth }]}>
              {timeLabels.map((item, index) => {
                const position = getDatePosition(item.date, timelineStart, dayWidth);
                const intervalWidth =
                  viewType === 'week' ? dayWidth : viewType === 'month' ? dayWidth * 7 : dayWidth * 14;

                return (
                  <View
                    key={index}
                    style={[
                      styles.timeLabel,
                      {
                        left: position,
                        width: intervalWidth,
                      },
                    ]}
                  >
                    {item.isFirstOfMonth && viewType !== 'quarter' && (
                      <Text style={styles.monthLabel}>
                        {item.date.toLocaleDateString('en-US', { month: 'short' })}
                      </Text>
                    )}
                    <Text style={styles.dayLabel}>{item.label}</Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Grid Lines */}
          <View style={[styles.gridContainer, { left: CONFIG.labelWidth, width: timelineWidth }]}>
            {timeLabels.map((item, index) => {
              const position = getDatePosition(item.date, timelineStart, dayWidth);
              return (
                <View
                  key={index}
                  style={[
                    styles.gridLine,
                    {
                      left: position,
                      height: goals.length * CONFIG.rowHeight,
                    },
                    item.isFirstOfMonth && styles.gridLineMonth,
                  ]}
                />
              );
            })}
          </View>

          {/* Goal Rows */}
          {goals.map((goal, index) => {
            const rowTop = CONFIG.headerHeight + index * CONFIG.rowHeight;
            const startPos = getDatePosition(
              new Date(goal.startDate),
              timelineStart,
              dayWidth
            );
            const endPos = getDatePosition(
              new Date(goal.endDate),
              timelineStart,
              dayWidth
            );
            const barWidth = Math.max(endPos - startPos, dayWidth);

            return (
              <View key={goal.id}>
                {/* Row Background */}
                <View
                  style={[
                    styles.rowBackground,
                    {
                      top: rowTop,
                      width: totalWidth,
                    },
                    index % 2 === 0 && styles.rowBackgroundAlt,
                  ]}
                />

                {/* Goal Label */}
                <View
                  style={[
                    styles.goalLabel,
                    {
                      top: rowTop,
                      width: CONFIG.labelWidth,
                      height: CONFIG.rowHeight,
                    },
                  ]}
                >
                  <Text style={styles.goalLabelText} numberOfLines={2}>
                    {goal.title}
                  </Text>
                </View>

                {/* Goal Bar */}
                <View
                  style={[
                    styles.barContainer,
                    {
                      top: rowTop + CONFIG.barVerticalPadding,
                      left: CONFIG.labelWidth + startPos,
                    },
                  ]}
                >
                  <TimelineBar
                    goal={goal}
                    width={barWidth}
                    height={CONFIG.barHeight}
                    onPress={() => onGoalPress(goal)}
                  />
                </View>
              </View>
            );
          })}

          {/* Today Line */}
          {todayPosition >= 0 && todayPosition <= timelineWidth && (
            <View
              style={[
                styles.todayLine,
                {
                  left: CONFIG.labelWidth + todayPosition,
                  height: totalHeight - 10,
                },
              ]}
            >
              <View style={styles.todayDot} />
              <View style={styles.todayLineInner} />
              <Text style={styles.todayLabel}>Today</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.bgElevated,
    borderRadius: 16,
    overflow: 'hidden',
  },
  scrollContent: {
    flexGrow: 1,
  },
  chartContainer: {
    position: 'relative',
  },

  // Header
  headerRow: {
    flexDirection: 'row',
    height: CONFIG.headerHeight,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  labelHeader: {
    height: CONFIG.headerHeight,
    justifyContent: 'flex-end',
    paddingBottom: 8,
    paddingHorizontal: 12,
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
    backgroundColor: COLORS.bgElevated,
  },
  labelHeaderText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Time Scale
  timeScale: {
    position: 'relative',
    height: CONFIG.headerHeight,
  },
  timeLabel: {
    position: 'absolute',
    height: CONFIG.headerHeight,
    justifyContent: 'flex-end',
    paddingBottom: 8,
    paddingHorizontal: 4,
    alignItems: 'center',
  },
  monthLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  dayLabel: {
    fontSize: 11,
    color: COLORS.textTertiary,
  },

  // Grid
  gridContainer: {
    position: 'absolute',
    top: CONFIG.headerHeight,
  },
  gridLine: {
    position: 'absolute',
    width: 1,
    backgroundColor: COLORS.gridLine,
  },
  gridLineMonth: {
    backgroundColor: COLORS.border,
  },

  // Rows
  rowBackground: {
    position: 'absolute',
    height: CONFIG.rowHeight,
    backgroundColor: 'transparent',
  },
  rowBackgroundAlt: {
    backgroundColor: 'rgba(26, 26, 46, 0.3)',
  },

  // Goal Labels
  goalLabel: {
    position: 'absolute',
    justifyContent: 'center',
    paddingHorizontal: 12,
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
    backgroundColor: COLORS.bgElevated,
    zIndex: 10,
  },
  goalLabelText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.textSecondary,
    lineHeight: 16,
  },

  // Bar Container
  barContainer: {
    position: 'absolute',
    zIndex: 5,
  },

  // Today Line
  todayLine: {
    position: 'absolute',
    top: 5,
    width: 2,
    zIndex: 20,
    alignItems: 'center',
  },
  todayDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.todayLine,
    marginBottom: -4,
  },
  todayLineInner: {
    flex: 1,
    width: 2,
    backgroundColor: COLORS.todayLine,
  },
  todayLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: COLORS.todayLine,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 4,
  },
});

export default TimelineChart;
