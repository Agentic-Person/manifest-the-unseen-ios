/**
 * SignsScreen
 *
 * Synchronicity and signs logging screen for Phase 9: Trust & Surrender.
 * Users document meaningful coincidences and patterns they notice.
 *
 * Features:
 * - Log synchronicities and meaningful coincidences
 * - Entry fields: Date, What happened, What it might mean, How it felt
 * - Categories: Numbers, Animals, People, Events, Dreams, Other
 * - Photo attachment option
 * - Pattern recognition section (recurring signs)
 *
 * Design (from APP-DESIGN.md):
 * - Background: #1a1a2e (deep charcoal)
 * - Elevated surfaces: #252547
 * - Accent gold: #c9a227
 * - Dark spiritual theme
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import type { WorkbookStackScreenProps } from '../../../types/navigation';
import {
  SignCard,
  SignEntryData,
  SignCategory,
  SIGN_CATEGORIES,
} from '../../../components/workbook/SignCard';

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
};

// Generate unique ID
const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Get today's date
const getTodayDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

type Props = WorkbookStackScreenProps<'Signs'>;

/**
 * SignsScreen Component
 */
const SignsScreen: React.FC<Props> = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [entries, setEntries] = useState<SignEntryData[]>([]);
  const [expandedEntryId, setExpandedEntryId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<SignCategory | 'all'>('all');

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Load saved data on mount
   */
  useEffect(() => {
    loadData();
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  /**
   * Auto-save when entries change
   */
  useEffect(() => {
    if (!isLoading) {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      saveTimeoutRef.current = setTimeout(() => {
        autoSave();
      }, 2000);
    }
  }, [entries, isLoading]);

  /**
   * Load data from storage (stubbed)
   */
  const loadData = async () => {
    setIsLoading(true);
    try {
      // TODO: Load from Supabase
      await new Promise((resolve) => setTimeout(resolve, 300));
      console.log('Loaded signs data');
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Auto-save to storage (stubbed)
   */
  const autoSave = useCallback(async () => {
    setIsSaving(true);
    try {
      // TODO: Save to Supabase
      console.log('Auto-saving signs entries:', entries);
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setIsSaving(false);
    }
  }, [entries]);

  /**
   * Add new sign entry
   */
  const handleAddEntry = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const newEntry: SignEntryData = {
      id: generateId(),
      date: getTodayDate(),
      category: 'events',
      whatHappened: '',
      possibleMeaning: '',
      howItFelt: '',
      isRecurring: false,
      createdAt: new Date().toISOString(),
    };

    setEntries((prev) => [newEntry, ...prev]);
    setExpandedEntryId(newEntry.id);
  };

  /**
   * Update category
   */
  const handleCategoryChange = (id: string, category: SignCategory) => {
    setEntries((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, category } : entry))
    );
  };

  /**
   * Update what happened text
   */
  const handleWhatHappenedChange = (id: string, text: string) => {
    setEntries((prev) =>
      prev.map((entry) =>
        entry.id === id ? { ...entry, whatHappened: text } : entry
      )
    );
  };

  /**
   * Update meaning text
   */
  const handleMeaningChange = (id: string, text: string) => {
    setEntries((prev) =>
      prev.map((entry) =>
        entry.id === id ? { ...entry, possibleMeaning: text } : entry
      )
    );
  };

  /**
   * Update feeling text
   */
  const handleFeelingChange = (id: string, text: string) => {
    setEntries((prev) =>
      prev.map((entry) =>
        entry.id === id ? { ...entry, howItFelt: text } : entry
      )
    );
  };

  /**
   * Update photo
   */
  const handlePhotoChange = (id: string, uri: string | undefined) => {
    setEntries((prev) =>
      prev.map((entry) =>
        entry.id === id ? { ...entry, photoUri: uri } : entry
      )
    );
  };

  /**
   * Toggle recurring status
   */
  const handleRecurringToggle = (id: string) => {
    setEntries((prev) =>
      prev.map((entry) =>
        entry.id === id ? { ...entry, isRecurring: !entry.isRecurring } : entry
      )
    );
  };

  /**
   * Delete entry
   */
  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete Sign Entry',
      'Are you sure you want to delete this synchronicity entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            setEntries((prev) => prev.filter((entry) => entry.id !== id));
            if (expandedEntryId === id) {
              setExpandedEntryId(null);
            }
          },
        },
      ]
    );
  };

  /**
   * Toggle entry expansion
   */
  const handleToggleExpand = (id: string) => {
    setExpandedEntryId(expandedEntryId === id ? null : id);
  };

  /**
   * Filter entries by category
   */
  const filteredEntries =
    filterCategory === 'all'
      ? entries
      : entries.filter((e) => e.category === filterCategory);

  /**
   * Get recurring signs
   */
  const recurringSigns = entries.filter((e) => e.isRecurring);

  /**
   * Get category stats
   */
  const getCategoryStats = () => {
    const stats: Record<SignCategory, number> = {
      numbers: 0,
      animals: 0,
      people: 0,
      events: 0,
      dreams: 0,
      other: 0,
    };
    entries.forEach((e) => {
      stats[e.category]++;
    });
    return stats;
  };

  /**
   * Save and continue
   */
  const handleSaveAndContinue = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await autoSave();
    navigation.goBack();
  };

  const categoryStats = getCategoryStats();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={DESIGN_COLORS.accentGold} />
        <Text style={styles.loadingText}>Loading your signs journal...</Text>
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
        <Text style={styles.title}>Signs & Synchronicities</Text>
        <Text style={styles.subtitle}>
          Document the meaningful coincidences and signs you notice.
          The universe is always communicating - learn to listen.
        </Text>
      </View>

      {/* Stats */}
      <View style={styles.statsCard}>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{entries.length}</Text>
            <Text style={styles.statLabel}>Total Signs</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{recurringSigns.length}</Text>
            <Text style={styles.statLabel}>Recurring</Text>
          </View>
        </View>
      </View>

      {/* Category Filter */}
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Filter by Category</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
        >
          <Pressable
            style={[
              styles.filterChip,
              filterCategory === 'all' && styles.filterChipActive,
            ]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setFilterCategory('all');
            }}
            accessibilityRole="button"
            accessibilityLabel="Show all categories"
            accessibilityState={{ selected: filterCategory === 'all' }}
          >
            <Text
              style={[
                styles.filterChipText,
                filterCategory === 'all' && styles.filterChipTextActive,
              ]}
            >
              All ({entries.length})
            </Text>
          </Pressable>
          {SIGN_CATEGORIES.map((cat) => (
            <Pressable
              key={cat.key}
              style={[
                styles.filterChip,
                filterCategory === cat.key && styles.filterChipActive,
                { borderColor: cat.color },
              ]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setFilterCategory(cat.key);
              }}
              accessibilityRole="button"
              accessibilityLabel={`Filter by ${cat.label}`}
              accessibilityState={{ selected: filterCategory === cat.key }}
            >
              <Text style={styles.filterChipIcon}>{cat.icon}</Text>
              <Text
                style={[
                  styles.filterChipText,
                  filterCategory === cat.key && styles.filterChipTextActive,
                ]}
              >
                {categoryStats[cat.key]}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Add Entry Button */}
      <Pressable
        style={({ pressed }) => [
          styles.addButton,
          pressed && styles.addButtonPressed,
        ]}
        onPress={handleAddEntry}
        accessibilityRole="button"
        accessibilityLabel="Log a new sign or synchronicity"
      >
        <Text style={styles.addButtonIcon}>{'\u2728'}</Text>
        <Text style={styles.addButtonText}>Log a Sign or Synchronicity</Text>
      </Pressable>

      {/* Empty State */}
      {entries.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>{'\u{1f52e}'}</Text>
          <Text style={styles.emptyTitle}>No Signs Recorded Yet</Text>
          <Text style={styles.emptyText}>
            Start noticing the synchronicities in your life.{'\n'}
            Repeating numbers, chance encounters, meaningful dreams...{'\n'}
            The universe speaks in mysterious ways.
          </Text>
        </View>
      )}

      {/* Entries */}
      {filteredEntries.length > 0 && (
        <View style={styles.entriesSection}>
          <Text style={styles.sectionTitle}>
            {filterCategory === 'all'
              ? 'All Signs'
              : SIGN_CATEGORIES.find((c) => c.key === filterCategory)?.label}
          </Text>
          <Text style={styles.sectionSubtitle}>
            {filteredEntries.length}{' '}
            {filteredEntries.length === 1 ? 'entry' : 'entries'}
          </Text>
          {filteredEntries.map((entry) => (
            <SignCard
              key={entry.id}
              entry={entry}
              onCategoryChange={handleCategoryChange}
              onWhatHappenedChange={handleWhatHappenedChange}
              onMeaningChange={handleMeaningChange}
              onFeelingChange={handleFeelingChange}
              onPhotoChange={handlePhotoChange}
              onRecurringToggle={handleRecurringToggle}
              onDelete={handleDelete}
              isExpanded={expandedEntryId === entry.id}
              onToggleExpand={() => handleToggleExpand(entry.id)}
            />
          ))}
        </View>
      )}

      {/* Recurring Patterns Section */}
      {recurringSigns.length > 0 && filterCategory === 'all' && (
        <View style={styles.patternsSection}>
          <Text style={styles.sectionTitle}>Recurring Patterns</Text>
          <Text style={styles.sectionSubtitle}>
            Signs that keep showing up in your life
          </Text>
          <View style={styles.patternsGrid}>
            {recurringSigns.slice(0, 6).map((sign) => {
              const cat = SIGN_CATEGORIES.find((c) => c.key === sign.category);
              return (
                <View
                  key={sign.id}
                  style={[
                    styles.patternCard,
                    { borderColor: `${cat?.color || DESIGN_COLORS.accentGold}50` },
                  ]}
                >
                  <Text style={styles.patternIcon}>{cat?.icon}</Text>
                  <Text style={styles.patternText} numberOfLines={2}>
                    {sign.whatHappened || 'Unnamed sign'}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      )}

      {/* Tips Card */}
      <View style={styles.tipsCard}>
        <Text style={styles.tipsTitle}>Signs to Watch For</Text>
        <Text style={styles.tipItem}>
          - Repeating numbers (11:11, 222, 333) - angel numbers
        </Text>
        <Text style={styles.tipItem}>
          - Animals that appear at significant moments
        </Text>
        <Text style={styles.tipItem}>
          - Songs or quotes that answer your questions
        </Text>
        <Text style={styles.tipItem}>
          - People who show up right when you need them
        </Text>
        <Text style={styles.tipItem}>
          - Vivid dreams with recurring themes or messages
        </Text>
      </View>

      {/* Save Status */}
      <View style={styles.saveStatusContainer}>
        {isSaving ? (
          <Text style={styles.saveStatus}>Saving...</Text>
        ) : (
          <Text style={styles.saveStatus}>Changes auto-save</Text>
        )}
      </View>

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
    marginBottom: 20,
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

  // Stats
  statsCard: {
    backgroundColor: DESIGN_COLORS.bgElevated,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: DESIGN_COLORS.accentGold,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: DESIGN_COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: DESIGN_COLORS.border,
    marginHorizontal: 24,
  },

  // Filter
  filterContainer: {
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: DESIGN_COLORS.textSecondary,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  filterScroll: {
    marginHorizontal: -4,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DESIGN_COLORS.bgElevated,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
  },
  filterChipActive: {
    backgroundColor: `${DESIGN_COLORS.accentGold}20`,
    borderColor: DESIGN_COLORS.accentGold,
  },
  filterChipIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  filterChipText: {
    fontSize: 13,
    color: DESIGN_COLORS.textSecondary,
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: DESIGN_COLORS.accentGold,
  },

  // Add Button
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: DESIGN_COLORS.accentGold,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  addButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  addButtonIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: DESIGN_COLORS.bgPrimary,
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
    marginBottom: 24,
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
    lineHeight: 22,
  },

  // Entries Section
  entriesSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: DESIGN_COLORS.textPrimary,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: DESIGN_COLORS.textSecondary,
    marginBottom: 16,
  },

  // Patterns Section
  patternsSection: {
    marginBottom: 24,
  },
  patternsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  patternCard: {
    width: '48%',
    backgroundColor: DESIGN_COLORS.bgElevated,
    borderRadius: 12,
    padding: 12,
    margin: '1%',
    borderWidth: 1,
    alignItems: 'center',
  },
  patternIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  patternText: {
    fontSize: 12,
    color: DESIGN_COLORS.textSecondary,
    textAlign: 'center',
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

  // Save Status
  saveStatusContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  saveStatus: {
    fontSize: 12,
    color: DESIGN_COLORS.textTertiary,
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

export default SignsScreen;
