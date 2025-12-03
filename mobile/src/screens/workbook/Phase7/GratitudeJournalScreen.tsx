/**
 * GratitudeJournalScreen
 *
 * Daily gratitude journal for Phase 7: Practicing Gratitude.
 * Users can record 3-5 things they're grateful for each day.
 *
 * Features:
 * - Daily entry with 3-5 gratitude items
 * - Date picker to view past entries
 * - Streak counter for consistency
 * - Categories: People, Experiences, Things, Opportunities, Growth
 * - Optional photo attachment per item
 * - Auto-save functionality
 *
 * Design (from APP-DESIGN.md):
 * - Background: #1a1a2e (deep charcoal)
 * - Elevated surfaces: #252547
 * - Accent gold: #c9a227
 * - Dark spiritual theme
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import type { WorkbookStackScreenProps } from '../../../types/navigation';
import {
  GratitudeItem,
} from '../../../components/workbook/GratitudeItem';
import { StreakDisplay } from '../../../components/workbook/StreakDisplay';
import type {
  GratitudeItemData,
  GratitudeCategory,
} from '../../../components/workbook/GratitudeItem';
import type { StreakData } from '../../../components/workbook/StreakDisplay';
import { useWorkbookProgress } from '../../../hooks/useWorkbook';
import { useAutoSave } from '../../../hooks/useAutoSave';
import { WORKSHEET_IDS } from '../../../types/workbook';
import { SaveIndicator } from '../../../components/workbook';

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
  accentGreen: '#2d5a4a',
  border: '#3a3a5a',
  success: '#2d5a4a',
  error: '#dc2626',
};

// Generate unique ID
const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Get today's date key (YYYY-MM-DD)
const getTodayKey = (): string => {
  return new Date().toISOString().split('T')[0];
};

// Format date for display
const formatDisplayDate = (dateKey: string): string => {
  const date = new Date(dateKey + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
};

// Daily Entry Interface
interface DailyEntry {
  dateKey: string;
  items: GratitudeItemData[];
  createdAt: string;
  updatedAt: string;
}

type Props = WorkbookStackScreenProps<'GratitudeJournal'>;

/**
 * GratitudeJournalScreen Component
 */
const GratitudeJournalScreen: React.FC<Props> = ({ navigation: _navigation }) => {
  const [selectedDate, setSelectedDate] = useState<string>(getTodayKey());
  const [entries, setEntries] = useState<Record<string, DailyEntry>>({});
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    completedDates: [],
    lastCompletedDate: null,
  });

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Supabase integration hooks
  const { data: savedProgress, isLoading, isError: isLoadError, error: loadError } = useWorkbookProgress(7, WORKSHEET_IDS.GRATITUDE_JOURNAL);

  const { isSaving, lastSaved, saveNow } = useAutoSave({
    data: entries as Record<string, unknown>,
    phaseNumber: 7,
    worksheetId: WORKSHEET_IDS.GRATITUDE_JOURNAL,
    debounceMs: 1500,
  });

  /**
   * Get current day's items
   */
  const currentItems = entries[selectedDate]?.items || [];
  const isToday = selectedDate === getTodayKey();

  /**
   * Load saved data from Supabase
   */
  useEffect(() => {
    // Error state
    if (isLoadError) {
      console.error('[GratitudeJournalScreen] Failed to load progress:', loadError);
      // Continue with default data instead of blocking the UI
    }

    // Only initialize once when loading completes
    if (isLoading) return;

    if (savedProgress?.data) {
      const loadedEntries = savedProgress.data as Record<string, DailyEntry>;
      setEntries(loadedEntries);
      calculateStreak(loadedEntries);
    }
  }, [savedProgress, isLoading]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  /**
   * Calculate streak from entries
   */
  const calculateStreak = (allEntries: Record<string, DailyEntry>) => {
    const completedDates = Object.keys(allEntries).filter(
      (dateKey) => allEntries[dateKey].items.length >= 3
    );

    // Sort dates descending
    completedDates.sort((a, b) => b.localeCompare(a));

    // Calculate current streak
    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const checkKey = checkDate.toISOString().split('T')[0];

      if (completedDates.includes(checkKey)) {
        currentStreak++;
      } else if (i === 0) {
        // Today not completed yet, continue checking
        continue;
      } else {
        break;
      }
    }

    // For demo, set some reasonable values
    setStreakData({
      currentStreak: currentStreak || 0,
      longestStreak: Math.max(currentStreak, 7), // Demo value
      completedDates,
      lastCompletedDate: completedDates[0] || null,
    });
  };

  /**
   * Add new gratitude item
   */
  const handleAddItem = () => {
    if (currentItems.length >= 5) {
      Alert.alert('Limit Reached', 'You can add up to 5 gratitude items per day.');
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const newItem: GratitudeItemData = {
      id: generateId(),
      text: '',
      category: 'experiences',
      createdAt: new Date().toISOString(),
    };

    setEntries((prev) => ({
      ...prev,
      [selectedDate]: {
        dateKey: selectedDate,
        items: [...(prev[selectedDate]?.items || []), newItem],
        createdAt: prev[selectedDate]?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    }));
  };

  /**
   * Update item text
   */
  const handleTextChange = (id: string, text: string) => {
    setEntries((prev) => ({
      ...prev,
      [selectedDate]: {
        ...prev[selectedDate],
        items: prev[selectedDate].items.map((item) =>
          item.id === id ? { ...item, text } : item
        ),
        updatedAt: new Date().toISOString(),
      },
    }));
  };

  /**
   * Update item category
   */
  const handleCategoryChange = (id: string, category: GratitudeCategory) => {
    setEntries((prev) => ({
      ...prev,
      [selectedDate]: {
        ...prev[selectedDate],
        items: prev[selectedDate].items.map((item) =>
          item.id === id ? { ...item, category } : item
        ),
        updatedAt: new Date().toISOString(),
      },
    }));
  };

  /**
   * Update item photo
   */
  const handlePhotoChange = (id: string, photoUri: string | undefined) => {
    setEntries((prev) => ({
      ...prev,
      [selectedDate]: {
        ...prev[selectedDate],
        items: prev[selectedDate].items.map((item) =>
          item.id === id ? { ...item, photoUri } : item
        ),
        updatedAt: new Date().toISOString(),
      },
    }));
  };

  /**
   * Delete item
   */
  const handleDelete = (id: string) => {
    setEntries((prev) => ({
      ...prev,
      [selectedDate]: {
        ...prev[selectedDate],
        items: prev[selectedDate].items.filter((item) => item.id !== id),
        updatedAt: new Date().toISOString(),
      },
    }));
  };

  /**
   * Navigate days
   */
  const handlePrevDay = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const current = new Date(selectedDate + 'T00:00:00');
    current.setDate(current.getDate() - 1);
    setSelectedDate(current.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const todayKey = getTodayKey();
    if (selectedDate >= todayKey) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const current = new Date(selectedDate + 'T00:00:00');
    current.setDate(current.getDate() + 1);
    setSelectedDate(current.toISOString().split('T')[0]);
  };

  const handleGoToToday = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedDate(getTodayKey());
  };

  /**
   * Save and continue
   */
  const handleSaveAndContinue = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await saveNow();
    _navigation.goBack();
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={50} color={DESIGN_COLORS.accentGold} />
        <Text style={styles.loadingText}>Loading your gratitude journal...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Gratitude Journal</Text>
        <Text style={styles.subtitle}>
          Take a moment to reflect on what you're grateful for today.
          Recording at least 3 gratitudes builds a consistent practice.
        </Text>
      </View>

      {/* Streak Display */}
      <StreakDisplay
        data={streakData}
        onDayTap={(dateKey) => {
          if (dateKey <= getTodayKey()) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setSelectedDate(dateKey);
          }
        }}
      />

      {/* Date Navigation */}
      <View style={styles.dateNavigation}>
        <Pressable
          style={styles.navButton}
          onPress={handlePrevDay}
          accessibilityRole="button"
          accessibilityLabel="Previous day"
        >
          <Text style={styles.navButtonText}>{'\u2190'}</Text>
        </Pressable>

        <Pressable
          style={styles.dateDisplay}
          onPress={handleGoToToday}
          accessibilityRole="button"
          accessibilityLabel="Go to today"
          accessibilityHint="Tap to return to today's entry"
        >
          <Text style={styles.dateText}>{formatDisplayDate(selectedDate)}</Text>
          {!isToday && (
            <Text style={styles.goToTodayText}>Tap to go to today</Text>
          )}
        </Pressable>

        <Pressable
          style={[styles.navButton, !isToday ? {} : styles.navButtonDisabled]}
          onPress={handleNextDay}
          disabled={isToday}
          accessibilityRole="button"
          accessibilityLabel="Next day"
        >
          <Text
            style={[
              styles.navButtonText,
              isToday && styles.navButtonTextDisabled,
            ]}
          >
            {'\u2192'}
          </Text>
        </Pressable>
      </View>

      {/* Entry Count */}
      <View style={styles.entryCount}>
        <Text style={styles.entryCountText}>
          {currentItems.length} of 5 gratitudes
        </Text>
        {currentItems.length >= 3 && (
          <View style={styles.completeBadge}>
            <Text style={styles.completeBadgeText}>{'\u2713'} Day Complete</Text>
          </View>
        )}
      </View>

      {/* Gratitude Items */}
      <View style={styles.itemsContainer}>
        {currentItems.map((item, index) => (
          <GratitudeItem
            key={item.id}
            item={item}
            index={index + 1}
            onTextChange={handleTextChange}
            onCategoryChange={handleCategoryChange}
            onPhotoChange={handlePhotoChange}
            onDelete={handleDelete}
          />
        ))}

        {/* Add Item Button */}
        {currentItems.length < 5 && isToday && (
          <Pressable
            style={styles.addButton}
            onPress={handleAddItem}
            accessibilityRole="button"
            accessibilityLabel="Add gratitude item"
          >
            <Text style={styles.addButtonIcon}>+</Text>
            <Text style={styles.addButtonText}>Add Gratitude</Text>
          </Pressable>
        )}

        {/* Empty State */}
        {currentItems.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>{'\u2728'}</Text>
            <Text style={styles.emptyTitle}>
              {isToday ? 'Start Your Gratitude Practice' : 'No Entry for This Day'}
            </Text>
            <Text style={styles.emptyText}>
              {isToday
                ? 'What are you grateful for today? Tap the button below to begin.'
                : 'You didn\'t record any gratitudes on this day.'}
            </Text>
          </View>
        )}
      </View>

      {/* Tips Card */}
      <View style={styles.tipsCard}>
        <Text style={styles.tipsTitle}>Tips for Gratitude Practice</Text>
        <Text style={styles.tipItem}>- Be specific: "My warm coffee this morning" not just "coffee"</Text>
        <Text style={styles.tipItem}>- Include why you're grateful for each item</Text>
        <Text style={styles.tipItem}>- Notice small blessings you might overlook</Text>
        <Text style={styles.tipItem}>- Review past entries when feeling down</Text>
      </View>

      {/* Save Indicator */}
      <SaveIndicator isSaving={isSaving} lastSaved={lastSaved} isError={isLoadError} onRetry={saveNow} />

      {/* Save Button */}
      <Pressable
        style={({ pressed }) => [
          styles.saveButton,
          pressed && styles.saveButtonPressed,
        ]}
        onPress={handleSaveAndContinue}
        accessibilityRole="button"
        accessibilityLabel="Save and continue"
      >
        <Text style={styles.saveButtonText}>Save & Continue</Text>
      </Pressable>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DESIGN_COLORS.bgPrimary,
  },
  content: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: DESIGN_COLORS.bgPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: DESIGN_COLORS.textSecondary,
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

  // Date Navigation
  dateNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: DESIGN_COLORS.bgElevated,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
  },
  navButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: DESIGN_COLORS.bgPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
  },
  navButtonDisabled: {
    opacity: 0.3,
  },
  navButtonText: {
    fontSize: 20,
    color: DESIGN_COLORS.accentGold,
    fontWeight: '600',
  },
  navButtonTextDisabled: {
    color: DESIGN_COLORS.textTertiary,
  },
  dateDisplay: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: DESIGN_COLORS.textPrimary,
    textAlign: 'center',
  },
  goToTodayText: {
    fontSize: 11,
    color: DESIGN_COLORS.accentGold,
    marginTop: 4,
  },

  // Entry Count
  entryCount: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  entryCountText: {
    fontSize: 14,
    color: DESIGN_COLORS.textSecondary,
  },
  completeBadge: {
    backgroundColor: DESIGN_COLORS.accentGreen,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  completeBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: DESIGN_COLORS.textPrimary,
  },

  // Items Container
  itemsContainer: {
    marginBottom: 24,
  },

  // Add Button
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: DESIGN_COLORS.bgElevated,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: DESIGN_COLORS.accentGold,
    borderStyle: 'dashed',
  },
  addButtonIcon: {
    fontSize: 24,
    color: DESIGN_COLORS.accentGold,
    marginRight: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: DESIGN_COLORS.accentGold,
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 24,
    backgroundColor: DESIGN_COLORS.bgElevated,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
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
    textAlign: 'center',
  },
  emptyText: {
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
    marginBottom: 24,
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

  // Save Button
  saveButton: {
    backgroundColor: DESIGN_COLORS.accentPurple,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: DESIGN_COLORS.accentPurple,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  saveButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: DESIGN_COLORS.textPrimary,
    letterSpacing: 0.5,
  },

  bottomSpacer: {
    height: 40,
  },
});

export default GratitudeJournalScreen;
