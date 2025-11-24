/**
 * ThreeSixNineScreen - 369 Manifestation Method
 *
 * Phase 6 screen implementing Nikola Tesla's 3-6-9 manifestation technique.
 * Users write their manifestation 3 times in morning, 6 times in afternoon,
 * and 9 times in evening for a 21 or 33 day cycle.
 *
 * Features:
 * - Enter manifestation/desire statement
 * - Morning (3x), Afternoon (6x), Evening (9x) repetition tracking
 * - 21-day or 33-day cycle options
 * - Progress calendar view
 * - Tesla's 3-6-9 significance explanation
 * - Auto-save functionality
 * - Dark spiritual theme
 *
 * @example
 * Navigation: WorkbookNavigator -> ThreeSixNine
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  ScrollView,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Text } from '../../../components';
import RepetitionTracker, { RepetitionPeriod } from '../../../components/workbook/RepetitionTracker';
import { colors, spacing, borderRadius, shadows } from '../../../theme';
import type { WorkbookStackScreenProps } from '../../../types/navigation';

/**
 * Cycle duration options
 */
type CycleDuration = 21 | 33;

/**
 * Daily progress data
 */
interface DailyProgress {
  date: string;
  morning: number;
  afternoon: number;
  evening: number;
}

/**
 * 369 Practice data structure
 */
interface ThreeSixNineData {
  id: string;
  manifestation: string;
  cycleDuration: CycleDuration;
  startDate: string;
  dailyProgress: DailyProgress[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Generate unique ID
 */
const generateId = (): string => {
  return `369_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Get today's date string (YYYY-MM-DD)
 */
const getTodayString = (): string => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Initial empty practice
 */
const createEmptyPractice = (): ThreeSixNineData => ({
  id: generateId(),
  manifestation: '',
  cycleDuration: 21,
  startDate: getTodayString(),
  dailyProgress: [],
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

type Props = WorkbookStackScreenProps<'ThreeSixNine'>;

/**
 * ThreeSixNineScreen Component
 */
const ThreeSixNineScreen: React.FC<Props> = ({ navigation: _navigation }) => {
  // State
  const [practice, setPractice] = useState<ThreeSixNineData>(createEmptyPractice());
  const [todayProgress, setTodayProgress] = useState<DailyProgress>({
    date: getTodayString(),
    morning: 0,
    afternoon: 0,
    evening: 0,
  });
  const [showExplanation, setShowExplanation] = useState(false);

  // Animation refs
  const _cardScale = useRef(new Animated.Value(1)).current;
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Trigger auto-save (stubbed)
   */
  const triggerAutoSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      console.log('[369Method] Auto-saving practice...', {
        manifestation: practice.manifestation,
        progress: todayProgress,
        timestamp: new Date().toISOString(),
      });
    }, 2000);
  }, [practice.manifestation, todayProgress]);

  /**
   * Handle manifestation text change
   */
  const handleManifestationChange = useCallback((text: string) => {
    setPractice(prev => ({
      ...prev,
      manifestation: text,
      updatedAt: new Date().toISOString(),
    }));
    triggerAutoSave();
  }, [triggerAutoSave]);

  /**
   * Handle cycle duration change
   */
  const handleCycleDurationChange = useCallback((duration: CycleDuration) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setPractice(prev => ({
      ...prev,
      cycleDuration: duration,
      updatedAt: new Date().toISOString(),
    }));
    triggerAutoSave();
  }, [triggerAutoSave]);

  /**
   * Handle repetition toggle
   */
  const handleRepetitionToggle = useCallback((period: RepetitionPeriod, index: number) => {
    const maxCounts = { morning: 3, afternoon: 6, evening: 9 };
    const currentCount = todayProgress[period];

    // Toggle logic: if clicking completed circle, decrease; otherwise increase
    let newCount: number;
    if (index < currentCount) {
      // Clicking a completed circle - set count to that index
      newCount = index;
    } else {
      // Clicking an incomplete circle - set count to index + 1
      newCount = Math.min(index + 1, maxCounts[period]);
    }

    setTodayProgress(prev => ({
      ...prev,
      [period]: newCount,
    }));

    // Check if all complete for celebration
    const allComplete =
      (period === 'morning' ? newCount : todayProgress.morning) >= 3 &&
      (period === 'afternoon' ? newCount : todayProgress.afternoon) >= 6 &&
      (period === 'evening' ? newCount : todayProgress.evening) >= 9;

    if (allComplete) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    triggerAutoSave();
  }, [todayProgress, triggerAutoSave]);

  /**
   * Toggle explanation card
   */
  const handleToggleExplanation = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowExplanation(prev => !prev);
  }, []);

  /**
   * Calculate overall progress
   */
  const calculateProgress = (): { day: number; percentage: number } => {
    const startDate = new Date(practice.startDate);
    const today = new Date(getTodayString());
    const daysDiff = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const day = Math.min(daysDiff + 1, practice.cycleDuration);
    const percentage = Math.round((day / practice.cycleDuration) * 100);
    return { day, percentage };
  };

  const { day: currentDay, percentage: overallProgress } = calculateProgress();

  /**
   * Check if today's practice is complete
   */
  const isTodayComplete =
    todayProgress.morning >= 3 &&
    todayProgress.afternoon >= 6 &&
    todayProgress.evening >= 9;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.phaseLabel}>Phase 6</Text>
          <Text style={styles.title}>369 Method</Text>
          <Text style={styles.subtitle}>
            Nikola Tesla's sacred manifestation technique
          </Text>

          {/* Decorative Divider */}
          <View style={styles.headerDivider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerSymbol}>{'\u2726'}</Text>
            <View style={styles.dividerLine} />
          </View>
        </View>

        {/* Progress Card */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Cycle Progress</Text>
            <Text style={styles.progressDay}>Day {currentDay} of {practice.cycleDuration}</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${overallProgress}%` }]} />
          </View>
          <View style={styles.progressFooter}>
            <Text style={styles.progressPercent}>{overallProgress}% Complete</Text>
            {isTodayComplete && (
              <Text style={styles.todayComplete}>{'\u2713'} Today Complete!</Text>
            )}
          </View>
        </View>

        {/* Cycle Duration Selector */}
        <View style={styles.durationSelector}>
          <Text style={styles.durationLabel}>Cycle Duration</Text>
          <View style={styles.durationOptions}>
            {([21, 33] as CycleDuration[]).map(duration => (
              <TouchableOpacity
                key={duration}
                style={[
                  styles.durationOption,
                  practice.cycleDuration === duration && styles.durationOptionActive,
                ]}
                onPress={() => handleCycleDurationChange(duration)}
                accessibilityRole="radio"
                accessibilityState={{ selected: practice.cycleDuration === duration }}
                accessibilityLabel={`${duration} day cycle`}
                testID={`cycle-duration-${duration}`}
              >
                <Text style={[
                  styles.durationNumber,
                  practice.cycleDuration === duration && styles.durationNumberActive,
                ]}>
                  {duration}
                </Text>
                <Text style={[
                  styles.durationText,
                  practice.cycleDuration === duration && styles.durationTextActive,
                ]}>
                  days
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Manifestation Input */}
        <View style={styles.manifestationCard}>
          <Text style={styles.manifestationLabel}>Your Manifestation</Text>
          <Text style={styles.manifestationHint}>
            Write a clear, specific statement of what you want to manifest
          </Text>
          <TextInput
            value={practice.manifestation}
            onChangeText={handleManifestationChange}
            placeholder="I am grateful for... / I attract..."
            placeholderTextColor={colors.dark.textTertiary}
            multiline
            numberOfLines={3}
            maxLength={280}
            style={styles.manifestationInput}
            accessibilityLabel="Manifestation statement"
            accessibilityHint="Enter what you want to manifest"
            testID="manifestation-input"
          />
          <Text style={styles.charCount}>
            {practice.manifestation.length}/280
          </Text>
        </View>

        {/* Repetition Trackers */}
        <View style={styles.trackersContainer}>
          <RepetitionTracker
            period="morning"
            completed={todayProgress.morning}
            onToggle={(index) => handleRepetitionToggle('morning', index)}
            disabled={!practice.manifestation.trim()}
            style={styles.tracker}
            testID="tracker-morning"
          />
          <RepetitionTracker
            period="afternoon"
            completed={todayProgress.afternoon}
            onToggle={(index) => handleRepetitionToggle('afternoon', index)}
            disabled={!practice.manifestation.trim()}
            style={styles.tracker}
            testID="tracker-afternoon"
          />
          <RepetitionTracker
            period="evening"
            completed={todayProgress.evening}
            onToggle={(index) => handleRepetitionToggle('evening', index)}
            disabled={!practice.manifestation.trim()}
            style={styles.tracker}
            testID="tracker-evening"
          />
        </View>

        {/* Explanation Card */}
        <TouchableOpacity
          onPress={handleToggleExplanation}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityState={{ expanded: showExplanation }}
          accessibilityLabel="Learn about the 369 method"
          testID="explanation-toggle"
        >
          <View style={styles.explanationCard}>
            <View style={styles.explanationHeader}>
              <Text style={styles.explanationIcon}>{'\u26A1'}</Text>
              <Text style={styles.explanationTitle}>
                Why 3, 6, and 9?
              </Text>
              <Text style={styles.expandIcon}>
                {showExplanation ? '\u25B2' : '\u25BC'}
              </Text>
            </View>

            {showExplanation && (
              <View style={styles.explanationContent}>
                <Text style={styles.explanationQuote}>
                  "If you only knew the magnificence of the 3, 6, and 9,
                  then you would have the key to the universe."
                </Text>
                <Text style={styles.explanationAuthor}>- Nikola Tesla</Text>

                <View style={styles.numberExplanations}>
                  {[
                    { num: '3', meaning: 'The creative force - mind, body, spirit unified' },
                    { num: '6', meaning: 'The nurturing force - harmony and balance' },
                    { num: '9', meaning: 'The completion force - enlightenment and fulfillment' },
                  ].map(item => (
                    <View key={item.num} style={styles.numberRow}>
                      <View style={styles.numberBadge}>
                        <Text style={styles.numberText}>{item.num}</Text>
                      </View>
                      <Text style={styles.numberMeaning}>{item.meaning}</Text>
                    </View>
                  ))}
                </View>

                <Text style={styles.explanationNote}>
                  By writing your manifestation 3+6+9 times daily, you align with
                  these universal frequencies and amplify your intention.
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>

        {/* Inspirational Quote */}
        <View style={styles.quoteContainer}>
          <Text style={styles.quoteText}>
            "Everything is energy. Match the frequency of the reality you want."
          </Text>
          <Text style={styles.quoteAuthor}>- Albert Einstein</Text>
        </View>

        {/* Bottom Spacer */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
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
    alignItems: 'center',
    marginBottom: spacing.lg,
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

  dividerSymbol: {
    fontSize: 14,
    color: colors.dark.accentGold,
    marginHorizontal: spacing.sm,
  },

  progressCard: {
    backgroundColor: colors.dark.bgElevated,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.sm,
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
    color: colors.dark.textPrimary,
  },

  progressDay: {
    fontSize: 13,
    color: colors.dark.accentGold,
    fontWeight: '600',
  },

  progressBarContainer: {
    height: 8,
    backgroundColor: `${colors.dark.textTertiary}30`,
    borderRadius: 4,
    overflow: 'hidden',
  },

  progressBar: {
    height: '100%',
    backgroundColor: colors.dark.accentGold,
    borderRadius: 4,
  },

  progressFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },

  progressPercent: {
    fontSize: 12,
    color: colors.dark.textSecondary,
  },

  todayComplete: {
    fontSize: 12,
    color: colors.dark.accentGreen,
    fontWeight: '600',
  },

  durationSelector: {
    marginBottom: spacing.md,
  },

  durationLabel: {
    fontSize: 13,
    color: colors.dark.textSecondary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },

  durationOptions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.md,
  },

  durationOption: {
    backgroundColor: colors.dark.bgElevated,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    minWidth: 80,
  },

  durationOptionActive: {
    borderColor: colors.dark.accentGold,
    backgroundColor: `${colors.dark.accentGold}15`,
  },

  durationNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.dark.textSecondary,
  },

  durationNumberActive: {
    color: colors.dark.accentGold,
  },

  durationText: {
    fontSize: 12,
    color: colors.dark.textTertiary,
    marginTop: -2,
  },

  durationTextActive: {
    color: colors.dark.textSecondary,
  },

  manifestationCard: {
    backgroundColor: colors.dark.bgElevated,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.sm,
  },

  manifestationLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.dark.textPrimary,
    marginBottom: spacing.xs / 2,
  },

  manifestationHint: {
    fontSize: 13,
    color: colors.dark.textSecondary,
    marginBottom: spacing.sm,
  },

  manifestationInput: {
    backgroundColor: colors.dark.bgPrimary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    color: colors.dark.textPrimary,
    fontSize: 16,
    lineHeight: 24,
    minHeight: 80,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: `${colors.dark.accentGold}30`,
  },

  charCount: {
    fontSize: 11,
    color: colors.dark.textTertiary,
    textAlign: 'right',
    marginTop: spacing.xs,
  },

  trackersContainer: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },

  tracker: {
    // Additional styling if needed
  },

  explanationCard: {
    backgroundColor: colors.dark.bgElevated,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: `${colors.dark.accentPurple}30`,
    ...shadows.sm,
  },

  explanationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  explanationIcon: {
    fontSize: 20,
    marginRight: spacing.sm,
  },

  explanationTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: colors.dark.textPrimary,
  },

  expandIcon: {
    fontSize: 12,
    color: colors.dark.textTertiary,
  },

  explanationContent: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: `${colors.dark.textTertiary}20`,
  },

  explanationQuote: {
    fontSize: 14,
    color: colors.dark.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 22,
  },

  explanationAuthor: {
    fontSize: 12,
    color: colors.dark.accentGold,
    textAlign: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },

  numberExplanations: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },

  numberRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  numberBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.dark.accentPurple,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },

  numberText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.dark.textPrimary,
  },

  numberMeaning: {
    flex: 1,
    fontSize: 13,
    color: colors.dark.textSecondary,
    lineHeight: 18,
  },

  explanationNote: {
    fontSize: 13,
    color: colors.dark.textTertiary,
    textAlign: 'center',
    lineHeight: 20,
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
    height: 40,
  },
});

export default ThreeSixNineScreen;
