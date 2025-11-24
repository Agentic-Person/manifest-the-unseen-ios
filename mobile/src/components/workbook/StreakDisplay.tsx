/**
 * StreakDisplay Component
 *
 * Visual streak counter with calendar dots showing completed days.
 * Used to track consistency in daily gratitude practice.
 *
 * Features:
 * - Current streak count with animated display
 * - 7-day mini calendar showing recent activity
 * - Monthly calendar overlay option
 * - Celebration effect on milestone streaks
 * - Haptic feedback
 *
 * Design (from APP-DESIGN.md):
 * - Background: #252547 (elevated surface)
 * - Accent gold: #c9a227 for active days
 * - Accent green: #2d5a4a for completed
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  ScrollView,
} from 'react-native';
import * as Haptics from 'expo-haptics';

// Design system colors
const DESIGN_COLORS = {
  bgPrimary: '#1a1a2e',
  bgElevated: '#252547',
  textPrimary: '#e8e8e8',
  textSecondary: '#a0a0b0',
  textTertiary: '#6b6b80',
  accentGold: '#c9a227',
  accentPurple: '#4a1a6b',
  accentGreen: '#2d5a4a',
  accentTeal: '#1a5f5f',
  border: '#3a3a5a',
};

// Day names for calendar
const DAY_NAMES = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export interface StreakData {
  /** Current consecutive days streak */
  currentStreak: number;
  /** Longest streak ever achieved */
  longestStreak: number;
  /** Array of ISO date strings for completed days */
  completedDates: string[];
  /** Last completed date ISO string */
  lastCompletedDate: string | null;
}

export interface StreakDisplayProps {
  /** Streak data */
  data: StreakData;
  /** Optional callback when calendar day is tapped */
  onDayTap?: (date: string) => void;
}

/**
 * Check if two dates are the same day
 */
const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

/**
 * Get date string in YYYY-MM-DD format
 */
const formatDateKey = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

/**
 * Get last 7 days including today
 */
const getLast7Days = (): Date[] => {
  const days: Date[] = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    days.push(date);
  }
  return days;
};

/**
 * Get days in month for calendar
 */
const getDaysInMonth = (year: number, month: number): Date[] => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days: Date[] = [];

  // Add empty slots for days before first day of month
  const startPadding = firstDay.getDay();
  for (let i = 0; i < startPadding; i++) {
    const paddingDate = new Date(year, month, 1 - (startPadding - i));
    days.push(paddingDate);
  }

  // Add all days in month
  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push(new Date(year, month, d));
  }

  return days;
};

/**
 * StreakDisplay Component
 */
export const StreakDisplay: React.FC<StreakDisplayProps> = ({
  data,
  onDayTap,
}) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [viewDate, setViewDate] = useState(new Date());

  const completedSet = new Set(data.completedDates.map((d) => d.split('T')[0]));
  const last7Days = getLast7Days();
  const today = new Date();
  const todayKey = formatDateKey(today);
  const todayCompleted = completedSet.has(todayKey);

  /**
   * Check if a date is completed
   */
  const isCompleted = (date: Date): boolean => {
    return completedSet.has(formatDateKey(date));
  };

  /**
   * Handle opening calendar modal
   */
  const handleOpenCalendar = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowCalendar(true);
  };

  /**
   * Navigate to previous month
   */
  const handlePrevMonth = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  /**
   * Navigate to next month
   */
  const handleNextMonth = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  /**
   * Get milestone message
   */
  const getMilestoneMessage = (): string | null => {
    const milestones = [7, 14, 21, 30, 60, 90, 100, 180, 365];
    if (milestones.includes(data.currentStreak)) {
      return `${data.currentStreak} days! Amazing!`;
    }
    return null;
  };

  const milestone = getMilestoneMessage();
  const monthDays = getDaysInMonth(viewDate.getFullYear(), viewDate.getMonth());

  return (
    <View style={styles.container}>
      {/* Main Streak Display */}
      <View style={styles.streakCard}>
        {/* Flame Icon and Count */}
        <View style={styles.streakMain}>
          <Text style={styles.flameIcon}>{'\uD83D\uDD25'}</Text>
          <View style={styles.streakInfo}>
            <Text style={styles.streakCount}>{data.currentStreak}</Text>
            <Text style={styles.streakLabel}>
              day{data.currentStreak !== 1 ? 's' : ''} streak
            </Text>
          </View>
        </View>

        {/* Milestone Badge */}
        {milestone && (
          <View style={styles.milestoneBadge}>
            <Text style={styles.milestoneText}>{milestone}</Text>
          </View>
        )}

        {/* Today Status */}
        <View
          style={[
            styles.todayBadge,
            todayCompleted && styles.todayBadgeCompleted,
          ]}
        >
          <Text style={styles.todayText}>
            {todayCompleted ? 'Today Completed' : 'Complete Today'}
          </Text>
        </View>

        {/* Best Streak */}
        <Text style={styles.bestStreak}>
          Best streak: {data.longestStreak} days
        </Text>
      </View>

      {/* 7-Day Mini Calendar */}
      <View style={styles.weekView}>
        <Text style={styles.weekLabel}>Last 7 Days</Text>
        <View style={styles.weekDays}>
          {last7Days.map((date, index) => {
            const isToday = isSameDay(date, today);
            const completed = isCompleted(date);
            return (
              <View key={index} style={styles.dayColumn}>
                <Text style={styles.dayName}>
                  {DAY_NAMES[date.getDay()]}
                </Text>
                <View
                  style={[
                    styles.dayDot,
                    completed && styles.dayDotCompleted,
                    isToday && !completed && styles.dayDotToday,
                  ]}
                >
                  {completed && (
                    <Text style={styles.dayDotCheck}>{'\u2713'}</Text>
                  )}
                </View>
                <Text style={styles.dayNumber}>{date.getDate()}</Text>
              </View>
            );
          })}
        </View>

        {/* View Full Calendar Button */}
        <Pressable
          style={styles.viewCalendarButton}
          onPress={handleOpenCalendar}
          accessibilityRole="button"
          accessibilityLabel="View full calendar"
        >
          <Text style={styles.viewCalendarText}>View Full Calendar</Text>
          <Text style={styles.viewCalendarArrow}>{'\u2192'}</Text>
        </Pressable>
      </View>

      {/* Full Calendar Modal */}
      <Modal
        visible={showCalendar}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCalendar(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowCalendar(false)}
        >
          <Pressable
            style={styles.modalContent}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Month Header */}
            <View style={styles.calendarHeader}>
              <Pressable
                onPress={handlePrevMonth}
                style={styles.navButton}
                accessibilityRole="button"
                accessibilityLabel="Previous month"
              >
                <Text style={styles.navText}>{'\u2190'}</Text>
              </Pressable>
              <Text style={styles.monthTitle}>
                {MONTH_NAMES[viewDate.getMonth()]} {viewDate.getFullYear()}
              </Text>
              <Pressable
                onPress={handleNextMonth}
                style={styles.navButton}
                accessibilityRole="button"
                accessibilityLabel="Next month"
              >
                <Text style={styles.navText}>{'\u2192'}</Text>
              </Pressable>
            </View>

            {/* Day Names Header */}
            <View style={styles.dayNamesRow}>
              {DAY_NAMES.map((name, index) => (
                <Text key={index} style={styles.dayNameHeader}>
                  {name}
                </Text>
              ))}
            </View>

            {/* Calendar Grid */}
            <ScrollView
              style={styles.calendarGrid}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.daysGrid}>
                {monthDays.map((date, index) => {
                  const isCurrentMonth = date.getMonth() === viewDate.getMonth();
                  const isToday = isSameDay(date, today);
                  const completed = isCompleted(date);

                  return (
                    <Pressable
                      key={index}
                      style={[
                        styles.calendarDay,
                        !isCurrentMonth && styles.calendarDayOtherMonth,
                        isToday && styles.calendarDayToday,
                        completed && styles.calendarDayCompleted,
                      ]}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        onDayTap?.(formatDateKey(date));
                      }}
                      accessibilityRole="button"
                      accessibilityLabel={`${date.toDateString()}${completed ? ', completed' : ''}`}
                    >
                      <Text
                        style={[
                          styles.calendarDayText,
                          !isCurrentMonth && styles.calendarDayTextOtherMonth,
                          completed && styles.calendarDayTextCompleted,
                        ]}
                      >
                        {date.getDate()}
                      </Text>
                      {completed && (
                        <View style={styles.completedDot} />
                      )}
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>

            {/* Close Button */}
            <Pressable
              style={styles.closeButton}
              onPress={() => setShowCalendar(false)}
              accessibilityRole="button"
              accessibilityLabel="Close calendar"
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },

  // Streak Card
  streakCard: {
    backgroundColor: DESIGN_COLORS.bgElevated,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
    alignItems: 'center',
  },
  streakMain: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  flameIcon: {
    fontSize: 40,
    marginRight: 12,
  },
  streakInfo: {
    alignItems: 'flex-start',
  },
  streakCount: {
    fontSize: 48,
    fontWeight: '700',
    color: DESIGN_COLORS.accentGold,
    lineHeight: 52,
  },
  streakLabel: {
    fontSize: 14,
    color: DESIGN_COLORS.textSecondary,
    marginTop: -4,
  },
  milestoneBadge: {
    backgroundColor: DESIGN_COLORS.accentGold,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginBottom: 12,
  },
  milestoneText: {
    fontSize: 13,
    fontWeight: '600',
    color: DESIGN_COLORS.bgPrimary,
  },
  todayBadge: {
    backgroundColor: DESIGN_COLORS.bgPrimary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
    marginBottom: 12,
  },
  todayBadgeCompleted: {
    backgroundColor: DESIGN_COLORS.accentGreen,
    borderColor: DESIGN_COLORS.accentGreen,
  },
  todayText: {
    fontSize: 13,
    fontWeight: '600',
    color: DESIGN_COLORS.textPrimary,
  },
  bestStreak: {
    fontSize: 12,
    color: DESIGN_COLORS.textTertiary,
  },

  // Week View
  weekView: {
    backgroundColor: DESIGN_COLORS.bgElevated,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
  },
  weekLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: DESIGN_COLORS.textSecondary,
    marginBottom: 12,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  dayColumn: {
    alignItems: 'center',
  },
  dayName: {
    fontSize: 11,
    color: DESIGN_COLORS.textTertiary,
    marginBottom: 6,
  },
  dayDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: DESIGN_COLORS.bgPrimary,
    borderWidth: 2,
    borderColor: DESIGN_COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  dayDotCompleted: {
    backgroundColor: DESIGN_COLORS.accentGreen,
    borderColor: DESIGN_COLORS.accentGreen,
  },
  dayDotToday: {
    borderColor: DESIGN_COLORS.accentGold,
  },
  dayDotCheck: {
    fontSize: 14,
    fontWeight: '600',
    color: DESIGN_COLORS.textPrimary,
  },
  dayNumber: {
    fontSize: 11,
    color: DESIGN_COLORS.textSecondary,
  },
  viewCalendarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  viewCalendarText: {
    fontSize: 13,
    color: DESIGN_COLORS.accentGold,
    fontWeight: '500',
    marginRight: 4,
  },
  viewCalendarArrow: {
    fontSize: 13,
    color: DESIGN_COLORS.accentGold,
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
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
  },

  // Calendar Header
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  navButton: {
    padding: 10,
  },
  navText: {
    fontSize: 20,
    color: DESIGN_COLORS.accentGold,
    fontWeight: '600',
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: DESIGN_COLORS.textPrimary,
  },

  // Day Names Row
  dayNamesRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  dayNameHeader: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: DESIGN_COLORS.textTertiary,
    paddingVertical: 8,
  },

  // Calendar Grid
  calendarGrid: {
    maxHeight: 300,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDay: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  calendarDayOtherMonth: {
    opacity: 0.3,
  },
  calendarDayToday: {
    backgroundColor: 'rgba(201, 162, 39, 0.2)',
    borderRadius: 8,
  },
  calendarDayCompleted: {
    backgroundColor: DESIGN_COLORS.accentGreen,
    borderRadius: 8,
  },
  calendarDayText: {
    fontSize: 14,
    color: DESIGN_COLORS.textPrimary,
  },
  calendarDayTextOtherMonth: {
    color: DESIGN_COLORS.textTertiary,
  },
  calendarDayTextCompleted: {
    fontWeight: '600',
    color: DESIGN_COLORS.textPrimary,
  },
  completedDot: {
    position: 'absolute',
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: DESIGN_COLORS.textPrimary,
  },

  // Close Button
  closeButton: {
    backgroundColor: DESIGN_COLORS.accentPurple,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  closeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: DESIGN_COLORS.textPrimary,
  },
});

export default StreakDisplay;
