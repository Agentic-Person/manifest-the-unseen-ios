/**
 * Thought Awareness Screen - Phase 1 Self-Evaluation
 *
 * A cognitive pattern logging exercise where users track their thoughts,
 * identify patterns, and develop awareness of their mental habits.
 *
 * Features:
 * - Log thoughts with emotional context
 * - Categorize thought patterns (negative, neutral, positive)
 * - Identify cognitive distortions
 * - Auto-save to Supabase
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { SaveIndicator, ExerciseHeader } from '../../../components/workbook';
import { Phase1ExerciseImages } from '../../../assets';
import type { WorkbookStackScreenProps } from '../../../types/navigation';
import { useWorkbookProgress } from '../../../hooks/useWorkbook';
import { useAutoSave } from '../../../hooks/useAutoSave';
import { WORKSHEET_IDS } from '../../../types/workbook';

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
  accentRose: '#8b3a5f',
  accentAmber: '#8b6914',
  border: '#3a3a5a',
  error: '#ef4444',
};

// Cognitive distortion types
const DISTORTIONS = [
  { id: 'allOrNothing', label: 'All-or-Nothing', description: 'Black and white thinking, no middle ground' },
  { id: 'overgeneralizing', label: 'Overgeneralizing', description: 'Making broad conclusions from single events' },
  { id: 'catastrophizing', label: 'Catastrophizing', description: 'Expecting the worst possible outcome' },
  { id: 'mindReading', label: 'Mind Reading', description: 'Assuming you know what others think' },
  { id: 'fortuneTelling', label: 'Fortune Telling', description: 'Predicting negative futures without evidence' },
  { id: 'shouldStatements', label: 'Should Statements', description: 'Rigid rules about how things must be' },
  { id: 'labeling', label: 'Labeling', description: 'Attaching negative labels to yourself or others' },
  { id: 'emotionalReasoning', label: 'Emotional Reasoning', description: 'Feeling it, so it must be true' },
] as const;

type DistortionType = (typeof DISTORTIONS)[number]['id'];
type ThoughtCategory = 'negative' | 'neutral' | 'positive';

interface ThoughtEntry {
  id: string;
  thought: string;
  situation: string;
  emotion: string;
  emotionIntensity: number; // 1-10
  category: ThoughtCategory;
  distortions: DistortionType[];
  reframe?: string;
  timestamp: string;
}

interface ThoughtAwarenessData {
  entries: ThoughtEntry[];
  insights: string;
  updatedAt: string;
}

const generateId = (): string => {
  return `thought-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const DEFAULT_DATA: ThoughtAwarenessData = {
  entries: [],
  insights: '',
  updatedAt: new Date().toISOString(),
};

const CATEGORY_CONFIG: Record<ThoughtCategory, { label: string; color: string; emoji: string }> = {
  negative: { label: 'Negative', color: DESIGN_COLORS.accentRose, emoji: '😔' },
  neutral: { label: 'Neutral', color: DESIGN_COLORS.textSecondary, emoji: '😐' },
  positive: { label: 'Positive', color: DESIGN_COLORS.accentGreen, emoji: '😊' },
};

type Props = WorkbookStackScreenProps<'ThoughtAwareness'>;

/**
 * Thought Awareness Screen Component
 */
const ThoughtAwarenessScreen: React.FC<Props> = ({ navigation }) => {
  const [data, setData] = useState<ThoughtAwarenessData>(DEFAULT_DATA);
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);
  const [showDistortionHelper, setShowDistortionHelper] = useState(false);

  // Load saved data from Supabase
  const { data: savedProgress, isLoading } = useWorkbookProgress(1, WORKSHEET_IDS.THOUGHT_AWARENESS);

  // Auto-save with debounce
  const { isSaving, isError, lastSaved, saveNow } = useAutoSave({
    data: data as unknown as Record<string, unknown>,
    phaseNumber: 1,
    worksheetId: WORKSHEET_IDS.THOUGHT_AWARENESS,
    debounceMs: 2000,
  });

  // Load saved data into state when fetched
  useEffect(() => {
    if (savedProgress?.data) {
      const savedData = savedProgress.data as unknown as ThoughtAwarenessData;
      setData(savedData);
    }
  }, [savedProgress]);

  /**
   * Add new thought entry
   */
  const handleAddEntry = useCallback(() => {
    const newEntry: ThoughtEntry = {
      id: generateId(),
      thought: '',
      situation: '',
      emotion: '',
      emotionIntensity: 5,
      category: 'neutral',
      distortions: [],
      timestamp: new Date().toISOString(),
    };

    setData((prev) => ({
      ...prev,
      entries: [newEntry, ...prev.entries],
      updatedAt: new Date().toISOString(),
    }));

    setExpandedEntry(newEntry.id);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  /**
   * Update entry field
   */
  const handleUpdateEntry = useCallback((
    entryId: string,
    field: keyof ThoughtEntry,
    value: unknown
  ) => {
    setData((prev) => ({
      ...prev,
      entries: prev.entries.map((entry) =>
        entry.id === entryId ? { ...entry, [field]: value } : entry
      ),
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  /**
   * Toggle distortion for entry
   */
  const handleToggleDistortion = useCallback((entryId: string, distortionId: DistortionType) => {
    setData((prev) => ({
      ...prev,
      entries: prev.entries.map((entry) => {
        if (entry.id !== entryId) return entry;
        const hasDistortion = entry.distortions.includes(distortionId);
        return {
          ...entry,
          distortions: hasDistortion
            ? entry.distortions.filter((d) => d !== distortionId)
            : [...entry.distortions, distortionId],
        };
      }),
      updatedAt: new Date().toISOString(),
    }));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  /**
   * Delete entry
   */
  const handleDeleteEntry = useCallback((entryId: string) => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this thought entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setData((prev) => ({
              ...prev,
              entries: prev.entries.filter((e) => e.id !== entryId),
              updatedAt: new Date().toISOString(),
            }));
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          },
        },
      ]
    );
  }, []);

  /**
   * Update insights
   */
  const handleInsightsChange = useCallback((text: string) => {
    setData((prev) => ({
      ...prev,
      insights: text,
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  /**
   * Calculate stats
   */
  const stats = useMemo(() => {
    const entries = data.entries;
    const total = entries.length;
    const negative = entries.filter((e) => e.category === 'negative').length;
    const positive = entries.filter((e) => e.category === 'positive').length;
    const neutral = entries.filter((e) => e.category === 'neutral').length;

    // Count distortions
    const distortionCounts: Record<string, number> = {};
    entries.forEach((e) => {
      e.distortions.forEach((d) => {
        distortionCounts[d] = (distortionCounts[d] || 0) + 1;
      });
    });

    const topDistortion = Object.entries(distortionCounts)
      .sort((a, b) => b[1] - a[1])[0];

    return {
      total,
      negative,
      positive,
      neutral,
      topDistortion: topDistortion
        ? DISTORTIONS.find((d) => d.id === topDistortion[0])?.label
        : null,
    };
  }, [data.entries]);

  /**
   * Handle save and continue
   */
  const handleSaveAndContinue = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    saveNow({ completed: true });
    navigation.goBack();
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={50} color={DESIGN_COLORS.accentGold} />
        <Text style={styles.loadingText}>Loading your progress...</Text>
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
      {/* Header Section */}
      <ExerciseHeader
        image={Phase1ExerciseImages.thoughtAwareness}
        title="Thought Awareness"
        subtitle="Track your thoughts to recognize patterns and cognitive habits. Awareness is the first step to change."
        progress={savedProgress?.progress || 0}
      />

      {/* Stats Summary */}
      <View style={styles.statsCard}>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: DESIGN_COLORS.accentRose }]}>
              {stats.negative}
            </Text>
            <Text style={styles.statLabel}>Negative</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: DESIGN_COLORS.textSecondary }]}>
              {stats.neutral}
            </Text>
            <Text style={styles.statLabel}>Neutral</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: DESIGN_COLORS.accentGreen }]}>
              {stats.positive}
            </Text>
            <Text style={styles.statLabel}>Positive</Text>
          </View>
        </View>
        {stats.topDistortion && (
          <View style={styles.patternAlert}>
            <Text style={styles.patternAlertText}>
              🔍 Most common pattern: {stats.topDistortion}
            </Text>
          </View>
        )}
      </View>

      {/* Add Entry Button */}
      <Pressable
        style={({ pressed }) => [
          styles.addButton,
          pressed && styles.addButtonPressed,
        ]}
        onPress={handleAddEntry}
      >
        <Text style={styles.addButtonText}>+ Log a Thought</Text>
      </Pressable>

      {/* Distortion Helper Toggle */}
      <Pressable
        style={styles.helperToggle}
        onPress={() => setShowDistortionHelper(!showDistortionHelper)}
      >
        <Text style={styles.helperToggleText}>
          {showDistortionHelper ? '▼' : '▶'} What are cognitive distortions?
        </Text>
      </Pressable>

      {showDistortionHelper && (
        <View style={styles.helperCard}>
          {DISTORTIONS.map((d) => (
            <View key={d.id} style={styles.helperItem}>
              <Text style={styles.helperLabel}>{d.label}</Text>
              <Text style={styles.helperDesc}>{d.description}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Entries List */}
      <View style={styles.entriesSection}>
        <Text style={styles.sectionTitle}>Thought Log</Text>

        {data.entries.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>💭</Text>
            <Text style={styles.emptyText}>
              No thoughts logged yet. Tap the button above to start tracking.
            </Text>
          </View>
        ) : (
          data.entries.map((entry) => {
            const isExpanded = expandedEntry === entry.id;
            const categoryConfig = CATEGORY_CONFIG[entry.category];

            return (
              <View key={entry.id} style={styles.entryCard}>
                <Pressable
                  style={[styles.entryHeader, { borderLeftColor: categoryConfig.color }]}
                  onPress={() => setExpandedEntry(isExpanded ? null : entry.id)}
                >
                  <Text style={styles.entryEmoji}>{categoryConfig.emoji}</Text>
                  <View style={styles.entryPreview}>
                    <Text style={styles.entryThoughtPreview} numberOfLines={1}>
                      {entry.thought || 'New thought...'}
                    </Text>
                    <Text style={styles.entryTimestamp}>
                      {new Date(entry.timestamp).toLocaleDateString()}
                    </Text>
                  </View>
                  <Text style={styles.expandIcon}>{isExpanded ? '▼' : '▶'}</Text>
                </Pressable>

                {isExpanded && (
                  <View style={styles.entryContent}>
                    {/* Thought */}
                    <View style={styles.fieldGroup}>
                      <Text style={styles.fieldLabel}>The Thought</Text>
                      <TextInput
                        style={styles.textInput}
                        value={entry.thought}
                        onChangeText={(text) => handleUpdateEntry(entry.id, 'thought', text)}
                        placeholder="What was the thought?"
                        placeholderTextColor={DESIGN_COLORS.textTertiary}
                        multiline
                      />
                    </View>

                    {/* Situation */}
                    <View style={styles.fieldGroup}>
                      <Text style={styles.fieldLabel}>Situation</Text>
                      <TextInput
                        style={styles.textInput}
                        value={entry.situation}
                        onChangeText={(text) => handleUpdateEntry(entry.id, 'situation', text)}
                        placeholder="What triggered this thought?"
                        placeholderTextColor={DESIGN_COLORS.textTertiary}
                        multiline
                      />
                    </View>

                    {/* Emotion */}
                    <View style={styles.fieldGroup}>
                      <Text style={styles.fieldLabel}>Emotion</Text>
                      <TextInput
                        style={styles.textInputSmall}
                        value={entry.emotion}
                        onChangeText={(text) => handleUpdateEntry(entry.id, 'emotion', text)}
                        placeholder="How did it make you feel?"
                        placeholderTextColor={DESIGN_COLORS.textTertiary}
                      />
                    </View>

                    {/* Category */}
                    <View style={styles.fieldGroup}>
                      <Text style={styles.fieldLabel}>Category</Text>
                      <View style={styles.categoryButtons}>
                        {(['negative', 'neutral', 'positive'] as ThoughtCategory[]).map((cat) => {
                          const config = CATEGORY_CONFIG[cat];
                          const isSelected = entry.category === cat;
                          return (
                            <Pressable
                              key={cat}
                              style={[
                                styles.categoryButton,
                                isSelected && { backgroundColor: config.color, borderColor: config.color },
                              ]}
                              onPress={() => handleUpdateEntry(entry.id, 'category', cat)}
                            >
                              <Text style={[
                                styles.categoryButtonText,
                                isSelected && styles.categoryButtonTextSelected,
                              ]}>
                                {config.emoji} {config.label}
                              </Text>
                            </Pressable>
                          );
                        })}
                      </View>
                    </View>

                    {/* Distortions */}
                    <View style={styles.fieldGroup}>
                      <Text style={styles.fieldLabel}>Cognitive Distortions (if any)</Text>
                      <View style={styles.distortionChips}>
                        {DISTORTIONS.map((d) => {
                          const isSelected = entry.distortions.includes(d.id);
                          return (
                            <Pressable
                              key={d.id}
                              style={[
                                styles.distortionChip,
                                isSelected && styles.distortionChipSelected,
                              ]}
                              onPress={() => handleToggleDistortion(entry.id, d.id)}
                            >
                              <Text style={[
                                styles.distortionChipText,
                                isSelected && styles.distortionChipTextSelected,
                              ]}>
                                {d.label}
                              </Text>
                            </Pressable>
                          );
                        })}
                      </View>
                    </View>

                    {/* Reframe */}
                    <View style={styles.fieldGroup}>
                      <Text style={styles.fieldLabel}>Reframe (Optional)</Text>
                      <TextInput
                        style={styles.textInput}
                        value={entry.reframe || ''}
                        onChangeText={(text) => handleUpdateEntry(entry.id, 'reframe', text)}
                        placeholder="A more balanced way to think about this..."
                        placeholderTextColor={DESIGN_COLORS.textTertiary}
                        multiline
                      />
                    </View>

                    {/* Delete */}
                    <Pressable
                      style={styles.deleteButton}
                      onPress={() => handleDeleteEntry(entry.id)}
                    >
                      <Text style={styles.deleteButtonText}>Delete Entry</Text>
                    </Pressable>
                  </View>
                )}
              </View>
            );
          })
        )}
      </View>

      {/* Insights Section */}
      <View style={styles.insightsSection}>
        <Text style={styles.sectionTitle}>Your Insights</Text>
        <Text style={styles.sectionHint}>
          What patterns do you notice? What have you learned about your thinking?
        </Text>
        <TextInput
          style={styles.insightsInput}
          value={data.insights}
          onChangeText={handleInsightsChange}
          placeholder="Write your observations here..."
          placeholderTextColor={DESIGN_COLORS.textTertiary}
          multiline
          numberOfLines={4}
        />
      </View>

      {/* Save Status */}
      <View style={styles.saveStatusContainer}>
        <SaveIndicator
          isSaving={isSaving}
          lastSaved={lastSaved}
          isError={isError}
          onRetry={saveNow}
        />
      </View>

      {/* Action Button */}
      <Pressable
        style={({ pressed }) => [
          styles.saveButton,
          pressed && styles.saveButtonPressed,
        ]}
        onPress={handleSaveAndContinue}
      >
        <Text style={styles.saveButtonText}>Save & Continue</Text>
      </Pressable>

      {/* Bottom spacing */}
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
  statsCard: {
    backgroundColor: DESIGN_COLORS.bgSecondary,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: DESIGN_COLORS.accentGold,
  },
  statLabel: {
    fontSize: 11,
    color: DESIGN_COLORS.textTertiary,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: DESIGN_COLORS.border,
  },
  patternAlert: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: DESIGN_COLORS.border,
  },
  patternAlertText: {
    fontSize: 13,
    color: DESIGN_COLORS.accentAmber,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  addButton: {
    backgroundColor: DESIGN_COLORS.accentPurple,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  addButtonPressed: {
    opacity: 0.9,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: DESIGN_COLORS.textPrimary,
  },
  helperToggle: {
    paddingVertical: 8,
    marginBottom: 8,
  },
  helperToggleText: {
    fontSize: 14,
    color: DESIGN_COLORS.accentGold,
    fontWeight: '500',
  },
  helperCard: {
    backgroundColor: DESIGN_COLORS.bgSecondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
  },
  helperItem: {
    marginBottom: 12,
  },
  helperLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: DESIGN_COLORS.textPrimary,
  },
  helperDesc: {
    fontSize: 12,
    color: DESIGN_COLORS.textTertiary,
    marginTop: 2,
  },
  entriesSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: DESIGN_COLORS.textPrimary,
    marginBottom: 12,
  },
  sectionHint: {
    fontSize: 14,
    color: DESIGN_COLORS.textTertiary,
    marginBottom: 12,
  },
  emptyState: {
    backgroundColor: DESIGN_COLORS.bgSecondary,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
    borderStyle: 'dashed',
  },
  emptyEmoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    color: DESIGN_COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  entryCard: {
    backgroundColor: DESIGN_COLORS.bgSecondary,
    borderRadius: 12,
    marginBottom: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
  },
  entryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderLeftWidth: 4,
  },
  entryEmoji: {
    fontSize: 20,
    marginRight: 12,
  },
  entryPreview: {
    flex: 1,
  },
  entryThoughtPreview: {
    fontSize: 14,
    color: DESIGN_COLORS.textPrimary,
  },
  entryTimestamp: {
    fontSize: 11,
    color: DESIGN_COLORS.textTertiary,
    marginTop: 2,
  },
  expandIcon: {
    fontSize: 12,
    color: DESIGN_COLORS.textTertiary,
    marginLeft: 8,
  },
  entryContent: {
    padding: 16,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: DESIGN_COLORS.border,
  },
  fieldGroup: {
    marginTop: 16,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: DESIGN_COLORS.textSecondary,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: DESIGN_COLORS.bgElevated,
    borderRadius: 8,
    padding: 12,
    color: DESIGN_COLORS.textPrimary,
    fontSize: 14,
    lineHeight: 20,
    minHeight: 60,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
  },
  textInputSmall: {
    backgroundColor: DESIGN_COLORS.bgElevated,
    borderRadius: 8,
    padding: 12,
    color: DESIGN_COLORS.textPrimary,
    fontSize: 14,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
  },
  categoryButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
    backgroundColor: DESIGN_COLORS.bgElevated,
  },
  categoryButtonText: {
    fontSize: 12,
    color: DESIGN_COLORS.textSecondary,
    fontWeight: '500',
  },
  categoryButtonTextSelected: {
    color: DESIGN_COLORS.textPrimary,
  },
  distortionChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  distortionChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: DESIGN_COLORS.bgElevated,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
  },
  distortionChipSelected: {
    backgroundColor: DESIGN_COLORS.accentPurple,
    borderColor: DESIGN_COLORS.accentPurple,
  },
  distortionChipText: {
    fontSize: 12,
    color: DESIGN_COLORS.textSecondary,
  },
  distortionChipTextSelected: {
    color: DESIGN_COLORS.textPrimary,
    fontWeight: '500',
  },
  deleteButton: {
    marginTop: 16,
    alignSelf: 'flex-end',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  deleteButtonText: {
    fontSize: 14,
    color: DESIGN_COLORS.error,
    fontWeight: '500',
  },
  insightsSection: {
    marginBottom: 24,
  },
  insightsInput: {
    backgroundColor: DESIGN_COLORS.bgSecondary,
    borderRadius: 12,
    padding: 16,
    color: DESIGN_COLORS.textPrimary,
    fontSize: 14,
    lineHeight: 22,
    minHeight: 100,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
  },
  saveStatusContainer: {
    alignItems: 'center',
    marginBottom: 16,
    minHeight: 20,
  },
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

export default ThoughtAwarenessScreen;
