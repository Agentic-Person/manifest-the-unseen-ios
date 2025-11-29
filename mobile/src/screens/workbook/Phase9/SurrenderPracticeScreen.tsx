/**
 * SurrenderPracticeScreen
 *
 * "Letting Go" ritual exercise for Phase 9: Trust & Surrender.
 * Users write what they're trying to control, what they're surrendering,
 * and can perform a symbolic release ritual.
 *
 * Features:
 * - Write what you're trying to control
 * - Write what you're surrendering
 * - Symbolic "release" animation
 * - Daily surrender affirmations
 * - Surrender journal entries
 *
 * Design (from APP-DESIGN.md):
 * - Background: #1a1a2e (deep charcoal)
 * - Elevated surfaces: #252547
 * - Accent teal: #1a5f5f for surrender/release
 * - Dark spiritual theme
 */

import React, { useState, useEffect, useMemo } from 'react';
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
  SurrenderCard,
  SurrenderEntryData,
  SURRENDER_AFFIRMATIONS,
} from '../../../components/workbook/SurrenderCard';
import { SaveIndicator } from '../../../components/workbook';
import { useWorkbookProgress } from '../../../hooks/useWorkbook';
import { useAutoSave } from '../../../hooks/useAutoSave';
import { WORKSHEET_IDS } from '../../../types/workbook';

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
  accentRose: '#8b3a5f',
  border: '#3a3a5a',
  success: '#2d5a4a',
};

// Generate unique ID
const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Get random affirmation
const getRandomAffirmation = (): string => {
  return SURRENDER_AFFIRMATIONS[Math.floor(Math.random() * SURRENDER_AFFIRMATIONS.length)];
};

type Props = WorkbookStackScreenProps<'SurrenderPractice'>;

// Data type for persistence
interface SurrenderPracticeData {
  entries: SurrenderEntryData[];
  totalReleased: number;
}

const PHASE_NUMBER = 9;

/**
 * SurrenderPracticeScreen Component
 */
const SurrenderPracticeScreen: React.FC<Props> = ({ navigation }) => {
  // Supabase data fetching
  const { data: savedProgress, isLoading, isError: isLoadError, error: loadError } = useWorkbookProgress(
    PHASE_NUMBER,
    WORKSHEET_IDS.SURRENDER_PRACTICE
  );

  const [entries, setEntries] = useState<SurrenderEntryData[]>([]);
  const [dailyAffirmation, setDailyAffirmation] = useState<string>(getRandomAffirmation());
  const [totalReleased, setTotalReleased] = useState(0);

  // Auto-save hook
  const formData: SurrenderPracticeData = useMemo(() => ({ entries, totalReleased }), [entries, totalReleased]);
  const { isSaving, lastSaved, saveNow } = useAutoSave({
    data: formData as unknown as Record<string, unknown>,
    phaseNumber: PHASE_NUMBER,
    worksheetId: WORKSHEET_IDS.SURRENDER_PRACTICE,
    debounceMs: 1500,
  });

  // Load saved data
  useEffect(() => {
    // Error state
    if (isLoadError) {
      console.error('[SurrenderPracticeScreen] Failed to load progress:', loadError);
      // Continue with default data instead of blocking the UI
    }

    // Only initialize once when loading completes
    if (isLoading) return;

    if (savedProgress?.data) {
      const data = savedProgress.data as unknown as SurrenderPracticeData;
      if (data.entries) {
        setEntries(data.entries);
      }
      if (data.totalReleased !== undefined) {
        setTotalReleased(data.totalReleased);
      }
    }
  }, [savedProgress, isLoading]);

  /**
   * Add new surrender entry
   */
  const handleAddEntry = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const newEntry: SurrenderEntryData = {
      id: generateId(),
      controllingText: '',
      surrenderText: '',
      affirmation: getRandomAffirmation(),
      isReleased: false,
      createdAt: new Date().toISOString(),
    };

    setEntries((prev) => [newEntry, ...prev]);
  };

  /**
   * Update controlling text
   */
  const handleControllingChange = (id: string, text: string) => {
    setEntries((prev) =>
      prev.map((entry) =>
        entry.id === id ? { ...entry, controllingText: text } : entry
      )
    );
  };

  /**
   * Update surrender text
   */
  const handleSurrenderChange = (id: string, text: string) => {
    setEntries((prev) =>
      prev.map((entry) =>
        entry.id === id ? { ...entry, surrenderText: text } : entry
      )
    );
  };

  /**
   * Update affirmation
   */
  const handleAffirmationChange = (id: string, text: string) => {
    setEntries((prev) =>
      prev.map((entry) =>
        entry.id === id ? { ...entry, affirmation: text } : entry
      )
    );
  };

  /**
   * Handle release ritual
   */
  const handleRelease = (id: string) => {
    setEntries((prev) =>
      prev.map((entry) =>
        entry.id === id
          ? { ...entry, isReleased: true, releasedAt: new Date().toISOString() }
          : entry
      )
    );
    setTotalReleased((prev) => prev + 1);

    // Show celebration message
    setTimeout(() => {
      Alert.alert(
        'Released & Surrendered',
        'You have let go. Trust that what is meant for you will find its way.',
        [{ text: 'Continue', style: 'default' }]
      );
    }, 1800);
  };

  /**
   * Delete entry
   */
  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this surrender practice?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            setEntries((prev) => prev.filter((entry) => entry.id !== id));
          },
        },
      ]
    );
  };

  /**
   * Refresh daily affirmation
   */
  const handleRefreshAffirmation = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setDailyAffirmation(getRandomAffirmation());
  };

  /**
   * Save and continue
   */
  const handleSaveAndContinue = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    saveNow();
    navigation.goBack();
  };

  // Count active and released entries
  const activeEntries = entries.filter((e) => !e.isReleased);
  const releasedEntries = entries.filter((e) => e.isReleased);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={50} color={DESIGN_COLORS.accentTeal} />
        <Text style={styles.loadingText}>Loading your surrender practice...</Text>
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
        <Text style={styles.title}>Surrender Practice</Text>
        <Text style={styles.subtitle}>
          Let go of what you cannot control. Write what you're holding onto,
          then release it with intention and trust.
        </Text>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{totalReleased + releasedEntries.length}</Text>
          <Text style={styles.statLabel}>Total Released</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{activeEntries.length}</Text>
          <Text style={styles.statLabel}>In Progress</Text>
        </View>
      </View>

      {/* Daily Affirmation */}
      <View style={styles.affirmationCard}>
        <View style={styles.affirmationHeader}>
          <Text style={styles.affirmationLabel}>Today's Surrender Affirmation</Text>
          <Pressable
            style={styles.refreshButton}
            onPress={handleRefreshAffirmation}
            accessibilityRole="button"
            accessibilityLabel="Get new affirmation"
          >
            <Text style={styles.refreshIcon}>{'\u21bb'}</Text>
          </Pressable>
        </View>
        <Text style={styles.affirmationText}>"{dailyAffirmation}"</Text>
      </View>

      {/* Add Entry Button */}
      <Pressable
        style={({ pressed }) => [
          styles.addButton,
          pressed && styles.addButtonPressed,
        ]}
        onPress={handleAddEntry}
        accessibilityRole="button"
        accessibilityLabel="Start a new surrender practice"
      >
        <Text style={styles.addButtonIcon}>+</Text>
        <Text style={styles.addButtonText}>New Surrender Practice</Text>
      </Pressable>

      {/* Instructions */}
      {activeEntries.length === 0 && releasedEntries.length === 0 && (
        <View style={styles.instructionsCard}>
          <Text style={styles.instructionsTitle}>How It Works</Text>
          <View style={styles.instructionStep}>
            <Text style={styles.stepNumber}>1</Text>
            <Text style={styles.stepText}>
              Write what you're trying to control - a situation, outcome, or person
            </Text>
          </View>
          <View style={styles.instructionStep}>
            <Text style={styles.stepNumber}>2</Text>
            <Text style={styles.stepText}>
              Describe what you choose to surrender and let go of
            </Text>
          </View>
          <View style={styles.instructionStep}>
            <Text style={styles.stepNumber}>3</Text>
            <Text style={styles.stepText}>
              Add or customize a release affirmation that resonates with you
            </Text>
          </View>
          <View style={styles.instructionStep}>
            <Text style={styles.stepNumber}>4</Text>
            <Text style={styles.stepText}>
              Press "Release & Surrender" to symbolically let go
            </Text>
          </View>
        </View>
      )}

      {/* Active Entries */}
      {activeEntries.length > 0 && (
        <View style={styles.entriesSection}>
          <Text style={styles.sectionTitle}>In Progress</Text>
          {activeEntries.map((entry, index) => (
            <SurrenderCard
              key={entry.id}
              entry={entry}
              index={index + 1}
              onControllingChange={handleControllingChange}
              onSurrenderChange={handleSurrenderChange}
              onAffirmationChange={handleAffirmationChange}
              onRelease={handleRelease}
              onDelete={handleDelete}
            />
          ))}
        </View>
      )}

      {/* Released Entries */}
      {releasedEntries.length > 0 && (
        <View style={styles.entriesSection}>
          <Text style={styles.sectionTitle}>Released</Text>
          <Text style={styles.sectionSubtitle}>
            {releasedEntries.length} {releasedEntries.length === 1 ? 'thing' : 'things'} surrendered
          </Text>
          {releasedEntries.map((entry, index) => (
            <SurrenderCard
              key={entry.id}
              entry={entry}
              index={index + 1}
              onControllingChange={handleControllingChange}
              onSurrenderChange={handleSurrenderChange}
              onAffirmationChange={handleAffirmationChange}
              onRelease={handleRelease}
            />
          ))}
        </View>
      )}

      {/* Tips Card */}
      <View style={styles.tipsCard}>
        <Text style={styles.tipsTitle}>Surrender Wisdom</Text>
        <Text style={styles.tipItem}>
          - Surrender is not giving up; it's giving over to trust
        </Text>
        <Text style={styles.tipItem}>
          - You can't control outcomes, only your effort and intentions
        </Text>
        <Text style={styles.tipItem}>
          - What you resist persists; what you accept transforms
        </Text>
        <Text style={styles.tipItem}>
          - Letting go creates space for new blessings to enter
        </Text>
      </View>

      {/* Save Status */}
      <View style={styles.saveStatusContainer}>
        <SaveIndicator isSaving={isSaving} lastSaved={lastSaved} isError={isError} onRetry={saveNow} />
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
  statsRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: DESIGN_COLORS.bgElevated,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: DESIGN_COLORS.accentTeal,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: DESIGN_COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Affirmation Card
  affirmationCard: {
    backgroundColor: DESIGN_COLORS.bgSecondary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.accentTeal,
  },
  affirmationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  affirmationLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: DESIGN_COLORS.accentTeal,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  refreshButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: DESIGN_COLORS.bgPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  refreshIcon: {
    fontSize: 18,
    color: DESIGN_COLORS.accentTeal,
  },
  affirmationText: {
    fontSize: 17,
    fontWeight: '500',
    color: DESIGN_COLORS.textPrimary,
    fontStyle: 'italic',
    lineHeight: 26,
    textAlign: 'center',
  },

  // Add Button
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: DESIGN_COLORS.accentTeal,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  addButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  addButtonIcon: {
    fontSize: 24,
    color: DESIGN_COLORS.textPrimary,
    marginRight: 10,
    fontWeight: '300',
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: DESIGN_COLORS.textPrimary,
  },

  // Instructions Card
  instructionsCard: {
    backgroundColor: DESIGN_COLORS.bgElevated,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: DESIGN_COLORS.textPrimary,
    marginBottom: 16,
  },
  instructionStep: {
    flexDirection: 'row',
    marginBottom: 14,
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: DESIGN_COLORS.accentTeal,
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 13,
    fontWeight: '700',
    color: DESIGN_COLORS.textPrimary,
    marginRight: 12,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: DESIGN_COLORS.textSecondary,
    lineHeight: 20,
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

export default SurrenderPracticeScreen;
