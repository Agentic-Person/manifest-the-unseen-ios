/**
 * ABC Model Screen - Phase 1 Self-Evaluation
 *
 * Cognitive behavioral exercise based on the ABC Model:
 * - A = Activating Event (what happened)
 * - B = Belief (what you thought about it)
 * - C = Consequence (how you felt/acted)
 *
 * This helps users identify how their beliefs shape their emotional responses.
 *
 * Features:
 * - Multiple ABC entry cards
 * - Add/edit/delete entries
 * - Pattern recognition insights
 * - Auto-save to Supabase
 */

import React, { useState, useEffect, useCallback } from 'react';
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

interface ABCEntry {
  id: string;
  activatingEvent: string;
  belief: string;
  consequence: string;
  alternativeBelief?: string;
  newConsequence?: string;
  createdAt: string;
}

interface ABCModelData {
  entries: ABCEntry[];
  updatedAt: string;
}

const generateId = (): string => {
  return `abc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const DEFAULT_DATA: ABCModelData = {
  entries: [],
  updatedAt: new Date().toISOString(),
};

type Props = WorkbookStackScreenProps<'AbcModel'>;

/**
 * ABC Model Screen Component
 */
const AbcModelScreen: React.FC<Props> = ({ navigation }) => {
  const [data, setData] = useState<ABCModelData>(DEFAULT_DATA);
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);

  // Load saved data from Supabase
  const { data: savedProgress, isLoading } = useWorkbookProgress(1, WORKSHEET_IDS.ABC_MODEL);

  // Auto-save with debounce
  const { isSaving, isError, lastSaved, saveNow } = useAutoSave({
    data: data as unknown as Record<string, unknown>,
    phaseNumber: 1,
    worksheetId: WORKSHEET_IDS.ABC_MODEL,
    debounceMs: 2000,
  });

  // Load saved data into state when fetched
  useEffect(() => {
    if (savedProgress?.data) {
      const savedData = savedProgress.data as unknown as ABCModelData;
      setData(savedData);
    }
  }, [savedProgress]);

  /**
   * Add a new ABC entry
   */
  const handleAddEntry = useCallback(() => {
    const newEntry: ABCEntry = {
      id: generateId(),
      activatingEvent: '',
      belief: '',
      consequence: '',
      createdAt: new Date().toISOString(),
    };

    setData((prev) => ({
      ...prev,
      entries: [...prev.entries, newEntry],
      updatedAt: new Date().toISOString(),
    }));

    setExpandedEntry(newEntry.id);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  /**
   * Update an entry field
   */
  const handleUpdateEntry = useCallback((
    entryId: string,
    field: keyof ABCEntry,
    value: string
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
   * Delete an entry
   */
  const handleDeleteEntry = useCallback((entryId: string) => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this ABC analysis?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setData((prev) => ({
              ...prev,
              entries: prev.entries.filter((entry) => entry.id !== entryId),
              updatedAt: new Date().toISOString(),
            }));
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          },
        },
      ]
    );
  }, []);

  /**
   * Handle save and continue
   */
  const handleSaveAndContinue = async () => {
    // Validate entries have required fields
    const incompleteEntries = data.entries.filter(
      (e) => !e.activatingEvent.trim() || !e.belief.trim() || !e.consequence.trim()
    );

    if (incompleteEntries.length > 0) {
      Alert.alert(
        'Incomplete Entries',
        'Please complete all A-B-C fields for each entry, or delete incomplete entries.',
        [{ text: 'OK' }]
      );
      return;
    }

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
        image={Phase1ExerciseImages.abcModel}
        title="ABC Model"
        subtitle="Understand how your beliefs shape your emotions. Identify the Activating event, your Beliefs about it, and the emotional Consequences."
        progress={savedProgress?.progress || 0}
      />

      {/* ABC Legend */}
      <View style={styles.legendCard}>
        <View style={styles.legendItem}>
          <View style={[styles.legendBadge, { backgroundColor: DESIGN_COLORS.accentTeal }]}>
            <Text style={styles.legendLetter}>A</Text>
          </View>
          <View style={styles.legendTextContainer}>
            <Text style={styles.legendTitle}>Activating Event</Text>
            <Text style={styles.legendDesc}>What happened? The situation or trigger.</Text>
          </View>
        </View>

        <View style={styles.legendItem}>
          <View style={[styles.legendBadge, { backgroundColor: DESIGN_COLORS.accentPurple }]}>
            <Text style={styles.legendLetter}>B</Text>
          </View>
          <View style={styles.legendTextContainer}>
            <Text style={styles.legendTitle}>Belief</Text>
            <Text style={styles.legendDesc}>What did you think? Your interpretation.</Text>
          </View>
        </View>

        <View style={styles.legendItem}>
          <View style={[styles.legendBadge, { backgroundColor: DESIGN_COLORS.accentRose }]}>
            <Text style={styles.legendLetter}>C</Text>
          </View>
          <View style={styles.legendTextContainer}>
            <Text style={styles.legendTitle}>Consequence</Text>
            <Text style={styles.legendDesc}>How did you feel/act? The emotional result.</Text>
          </View>
        </View>
      </View>

      {/* Entries */}
      <View style={styles.entriesSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Analyses</Text>
          <Text style={styles.entryCount}>{data.entries.length} entries</Text>
        </View>

        {data.entries.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyText}>
              No analyses yet. Add your first ABC entry to start understanding your thought patterns.
            </Text>
          </View>
        ) : (
          data.entries.map((entry, index) => (
            <View key={entry.id} style={styles.entryCard}>
              <Pressable
                style={styles.entryHeader}
                onPress={() => setExpandedEntry(
                  expandedEntry === entry.id ? null : entry.id
                )}
              >
                <Text style={styles.entryNumber}>#{index + 1}</Text>
                <Text style={styles.entryPreview} numberOfLines={1}>
                  {entry.activatingEvent || 'New entry...'}
                </Text>
                <Text style={styles.expandIcon}>
                  {expandedEntry === entry.id ? '▼' : '▶'}
                </Text>
              </Pressable>

              {expandedEntry === entry.id && (
                <View style={styles.entryContent}>
                  {/* Activating Event */}
                  <View style={styles.fieldContainer}>
                    <View style={styles.fieldHeader}>
                      <View style={[styles.fieldBadge, { backgroundColor: DESIGN_COLORS.accentTeal }]}>
                        <Text style={styles.fieldBadgeText}>A</Text>
                      </View>
                      <Text style={styles.fieldLabel}>Activating Event</Text>
                    </View>
                    <TextInput
                      style={styles.textInput}
                      value={entry.activatingEvent}
                      onChangeText={(text) => handleUpdateEntry(entry.id, 'activatingEvent', text)}
                      placeholder="What happened? Describe the situation..."
                      placeholderTextColor={DESIGN_COLORS.textTertiary}
                      multiline
                      numberOfLines={3}
                    />
                  </View>

                  {/* Belief */}
                  <View style={styles.fieldContainer}>
                    <View style={styles.fieldHeader}>
                      <View style={[styles.fieldBadge, { backgroundColor: DESIGN_COLORS.accentPurple }]}>
                        <Text style={styles.fieldBadgeText}>B</Text>
                      </View>
                      <Text style={styles.fieldLabel}>Belief</Text>
                    </View>
                    <TextInput
                      style={styles.textInput}
                      value={entry.belief}
                      onChangeText={(text) => handleUpdateEntry(entry.id, 'belief', text)}
                      placeholder="What did you think about it?"
                      placeholderTextColor={DESIGN_COLORS.textTertiary}
                      multiline
                      numberOfLines={3}
                    />
                  </View>

                  {/* Consequence */}
                  <View style={styles.fieldContainer}>
                    <View style={styles.fieldHeader}>
                      <View style={[styles.fieldBadge, { backgroundColor: DESIGN_COLORS.accentRose }]}>
                        <Text style={styles.fieldBadgeText}>C</Text>
                      </View>
                      <Text style={styles.fieldLabel}>Consequence</Text>
                    </View>
                    <TextInput
                      style={styles.textInput}
                      value={entry.consequence}
                      onChangeText={(text) => handleUpdateEntry(entry.id, 'consequence', text)}
                      placeholder="How did you feel or act?"
                      placeholderTextColor={DESIGN_COLORS.textTertiary}
                      multiline
                      numberOfLines={3}
                    />
                  </View>

                  {/* Optional: Alternative Belief */}
                  <View style={styles.fieldContainer}>
                    <View style={styles.fieldHeader}>
                      <View style={[styles.fieldBadge, { backgroundColor: DESIGN_COLORS.accentGreen }]}>
                        <Text style={styles.fieldBadgeText}>B+</Text>
                      </View>
                      <Text style={styles.fieldLabel}>Alternative Belief (Optional)</Text>
                    </View>
                    <TextInput
                      style={styles.textInput}
                      value={entry.alternativeBelief || ''}
                      onChangeText={(text) => handleUpdateEntry(entry.id, 'alternativeBelief', text)}
                      placeholder="What's a healthier way to think about this?"
                      placeholderTextColor={DESIGN_COLORS.textTertiary}
                      multiline
                      numberOfLines={2}
                    />
                  </View>

                  {/* Delete button */}
                  <Pressable
                    style={styles.deleteButton}
                    onPress={() => handleDeleteEntry(entry.id)}
                  >
                    <Text style={styles.deleteButtonText}>Delete Entry</Text>
                  </Pressable>
                </View>
              )}
            </View>
          ))
        )}

        {/* Add Entry Button */}
        <Pressable
          style={({ pressed }) => [
            styles.addButton,
            pressed && styles.addButtonPressed,
          ]}
          onPress={handleAddEntry}
        >
          <Text style={styles.addButtonText}>+ Add ABC Analysis</Text>
        </Pressable>
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
  legendCard: {
    backgroundColor: DESIGN_COLORS.bgSecondary,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  legendBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  legendLetter: {
    fontSize: 16,
    fontWeight: '700',
    color: DESIGN_COLORS.textPrimary,
  },
  legendTextContainer: {
    flex: 1,
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: DESIGN_COLORS.textPrimary,
    marginBottom: 2,
  },
  legendDesc: {
    fontSize: 12,
    color: DESIGN_COLORS.textSecondary,
  },
  entriesSection: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: DESIGN_COLORS.textPrimary,
  },
  entryCount: {
    fontSize: 14,
    color: DESIGN_COLORS.textTertiary,
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
    marginBottom: 12,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
    overflow: 'hidden',
  },
  entryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  entryNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: DESIGN_COLORS.accentGold,
    marginRight: 12,
  },
  entryPreview: {
    flex: 1,
    fontSize: 14,
    color: DESIGN_COLORS.textPrimary,
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
  fieldContainer: {
    marginBottom: 16,
  },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  fieldBadge: {
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  fieldBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: DESIGN_COLORS.textPrimary,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: DESIGN_COLORS.textPrimary,
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
  deleteButton: {
    alignSelf: 'flex-end',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  deleteButtonText: {
    fontSize: 14,
    color: DESIGN_COLORS.error,
    fontWeight: '500',
  },
  addButton: {
    backgroundColor: DESIGN_COLORS.bgElevated,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: DESIGN_COLORS.accentPurple,
    borderStyle: 'dashed',
  },
  addButtonPressed: {
    opacity: 0.8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: DESIGN_COLORS.accentPurple,
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

export default AbcModelScreen;
