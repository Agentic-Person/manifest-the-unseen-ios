/**
 * Strengths & Weaknesses Screen - Phase 1 Self-Evaluation
 *
 * A personal analysis screen for identifying and reflecting on
 * individual strengths and weaknesses (simplified SWOT for self).
 *
 * Features:
 * - Two-column layout for strengths and weaknesses
 * - Add/edit/delete items
 * - Rating importance of each item
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
  border: '#3a3a5a',
  error: '#ef4444',
};

interface Item {
  id: string;
  text: string;
  importance: number; // 1-5 stars
}

interface StrengthsWeaknessesData {
  strengths: Item[];
  weaknesses: Item[];
  reflections: string;
  updatedAt: string;
}

const generateId = (): string => {
  return `sw-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const DEFAULT_DATA: StrengthsWeaknessesData = {
  strengths: [],
  weaknesses: [],
  reflections: '',
  updatedAt: new Date().toISOString(),
};

type Props = WorkbookStackScreenProps<'StrengthsWeaknesses'>;

/**
 * Item Card Component
 */
const ItemCard: React.FC<{
  item: Item;
  type: 'strength' | 'weakness';
  onTextChange: (text: string) => void;
  onImportanceChange: (importance: number) => void;
  onDelete: () => void;
}> = ({ item, type, onTextChange, onImportanceChange, onDelete }) => {
  const accentColor = type === 'strength' ? DESIGN_COLORS.accentGreen : DESIGN_COLORS.accentRose;

  return (
    <View style={[styles.itemCard, { borderLeftColor: accentColor }]}>
      <TextInput
        style={styles.itemInput}
        value={item.text}
        onChangeText={onTextChange}
        placeholder={type === 'strength' ? 'Enter a strength...' : 'Enter a weakness...'}
        placeholderTextColor={DESIGN_COLORS.textTertiary}
        multiline
      />
      <View style={styles.itemFooter}>
        <View style={styles.starContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Pressable
              key={star}
              onPress={() => onImportanceChange(star)}
              style={styles.starButton}
            >
              <Text style={[
                styles.star,
                star <= item.importance && { color: DESIGN_COLORS.accentGold }
              ]}>
                ★
              </Text>
            </Pressable>
          ))}
        </View>
        <Pressable onPress={onDelete} style={styles.deleteBtn}>
          <Text style={styles.deleteBtnText}>✕</Text>
        </Pressable>
      </View>
    </View>
  );
};

/**
 * Strengths & Weaknesses Screen Component
 */
const StrengthsWeaknessesScreen: React.FC<Props> = ({ navigation }) => {
  const [data, setData] = useState<StrengthsWeaknessesData>(DEFAULT_DATA);

  // Load saved data from Supabase
  const { data: savedProgress, isLoading } = useWorkbookProgress(1, WORKSHEET_IDS.STRENGTHS_WEAKNESSES);

  // Auto-save with debounce
  const { isSaving, isError, lastSaved, saveNow } = useAutoSave({
    data: data as unknown as Record<string, unknown>,
    phaseNumber: 1,
    worksheetId: WORKSHEET_IDS.STRENGTHS_WEAKNESSES,
    debounceMs: 2000,
  });

  // Load saved data into state when fetched
  useEffect(() => {
    if (savedProgress?.data) {
      const savedData = savedProgress.data as unknown as StrengthsWeaknessesData;
      setData(savedData);
    }
  }, [savedProgress]);

  /**
   * Add a new item
   */
  const handleAddItem = useCallback((type: 'strengths' | 'weaknesses') => {
    const newItem: Item = {
      id: generateId(),
      text: '',
      importance: 3,
    };

    setData((prev) => ({
      ...prev,
      [type]: [...prev[type], newItem],
      updatedAt: new Date().toISOString(),
    }));

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  /**
   * Update item text
   */
  const handleUpdateText = useCallback((
    type: 'strengths' | 'weaknesses',
    itemId: string,
    text: string
  ) => {
    setData((prev) => ({
      ...prev,
      [type]: prev[type].map((item) =>
        item.id === itemId ? { ...item, text } : item
      ),
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  /**
   * Update item importance
   */
  const handleUpdateImportance = useCallback((
    type: 'strengths' | 'weaknesses',
    itemId: string,
    importance: number
  ) => {
    setData((prev) => ({
      ...prev,
      [type]: prev[type].map((item) =>
        item.id === itemId ? { ...item, importance } : item
      ),
      updatedAt: new Date().toISOString(),
    }));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  /**
   * Delete an item
   */
  const handleDeleteItem = useCallback((type: 'strengths' | 'weaknesses', itemId: string) => {
    setData((prev) => ({
      ...prev,
      [type]: prev[type].filter((item) => item.id !== itemId),
      updatedAt: new Date().toISOString(),
    }));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, []);

  /**
   * Update reflections
   */
  const handleReflectionsChange = useCallback((text: string) => {
    setData((prev) => ({
      ...prev,
      reflections: text,
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  /**
   * Handle save and continue
   */
  const handleSaveAndContinue = async () => {
    // Validate at least one strength and one weakness
    if (data.strengths.length === 0 || data.weaknesses.length === 0) {
      Alert.alert(
        'Incomplete Analysis',
        'Please add at least one strength and one weakness before saving.',
        [{ text: 'OK' }]
      );
      return;
    }

    // Validate all items have text
    const emptyItems = [...data.strengths, ...data.weaknesses].filter(
      (item) => !item.text.trim()
    );

    if (emptyItems.length > 0) {
      Alert.alert(
        'Empty Items',
        'Please fill in all items or delete empty ones.',
        [{ text: 'OK' }]
      );
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    saveNow({ completed: true });
    navigation.goBack();
  };

  /**
   * Get insights based on data
   */
  const getInsights = () => {
    const totalStrengths = data.strengths.length;
    const totalWeaknesses = data.weaknesses.length;

    if (totalStrengths === 0 && totalWeaknesses === 0) {
      return { message: 'Start by adding your strengths and weaknesses.', type: 'neutral' };
    }

    if (totalStrengths > totalWeaknesses * 2) {
      return { message: 'You have many strengths identified! Consider if there are weaknesses you might be overlooking.', type: 'strength' };
    }

    if (totalWeaknesses > totalStrengths * 2) {
      return { message: 'You\'ve identified many areas for growth. Remember to also acknowledge your strengths!', type: 'weakness' };
    }

    return { message: 'Good balance! Self-awareness is the foundation of growth.', type: 'balanced' };
  };

  const insights = getInsights();

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
        image={Phase1ExerciseImages.strengthsWeaknesses}
        title="Strengths & Weaknesses"
        subtitle="Honest self-assessment is the foundation of personal growth. Identify what makes you strong and where you can improve."
        progress={savedProgress?.progress || 0}
      />

      {/* Insights Card */}
      <View style={[
        styles.insightCard,
        insights.type === 'strength' && styles.insightStrength,
        insights.type === 'weakness' && styles.insightWeakness,
        insights.type === 'balanced' && styles.insightBalanced,
        insights.type === 'neutral' && styles.insightNeutral,
      ]}>
        <Text style={styles.insightText}>{insights.message}</Text>
      </View>

      {/* Summary Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: DESIGN_COLORS.accentGreen }]}>
            {data.strengths.length}
          </Text>
          <Text style={styles.statLabel}>Strengths</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: DESIGN_COLORS.accentRose }]}>
            {data.weaknesses.length}
          </Text>
          <Text style={styles.statLabel}>Weaknesses</Text>
        </View>
      </View>

      {/* Strengths Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={[styles.sectionBadge, { backgroundColor: DESIGN_COLORS.accentGreen }]}>
            <Text style={styles.sectionBadgeText}>💪</Text>
          </View>
          <Text style={styles.sectionTitle}>Strengths</Text>
        </View>
        <Text style={styles.sectionHint}>
          What are you naturally good at? What do others compliment you on?
        </Text>

        {data.strengths.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            type="strength"
            onTextChange={(text) => handleUpdateText('strengths', item.id, text)}
            onImportanceChange={(imp) => handleUpdateImportance('strengths', item.id, imp)}
            onDelete={() => handleDeleteItem('strengths', item.id)}
          />
        ))}

        <Pressable
          style={[styles.addButton, { borderColor: DESIGN_COLORS.accentGreen }]}
          onPress={() => handleAddItem('strengths')}
        >
          <Text style={[styles.addButtonText, { color: DESIGN_COLORS.accentGreen }]}>
            + Add Strength
          </Text>
        </Pressable>
      </View>

      {/* Weaknesses Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={[styles.sectionBadge, { backgroundColor: DESIGN_COLORS.accentRose }]}>
            <Text style={styles.sectionBadgeText}>🎯</Text>
          </View>
          <Text style={styles.sectionTitle}>Weaknesses</Text>
        </View>
        <Text style={styles.sectionHint}>
          What areas do you struggle with? Where would you like to improve?
        </Text>

        {data.weaknesses.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            type="weakness"
            onTextChange={(text) => handleUpdateText('weaknesses', item.id, text)}
            onImportanceChange={(imp) => handleUpdateImportance('weaknesses', item.id, imp)}
            onDelete={() => handleDeleteItem('weaknesses', item.id)}
          />
        ))}

        <Pressable
          style={[styles.addButton, { borderColor: DESIGN_COLORS.accentRose }]}
          onPress={() => handleAddItem('weaknesses')}
        >
          <Text style={[styles.addButtonText, { color: DESIGN_COLORS.accentRose }]}>
            + Add Weakness
          </Text>
        </Pressable>
      </View>

      {/* Reflections Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Reflections</Text>
        <Text style={styles.sectionHint}>
          How can your strengths help you address your weaknesses?
        </Text>
        <TextInput
          style={styles.reflectionsInput}
          value={data.reflections}
          onChangeText={handleReflectionsChange}
          placeholder="Write your thoughts here..."
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
  insightCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
  },
  insightStrength: {
    backgroundColor: 'rgba(45, 90, 74, 0.2)',
    borderColor: DESIGN_COLORS.accentGreen,
  },
  insightWeakness: {
    backgroundColor: 'rgba(139, 58, 95, 0.2)',
    borderColor: DESIGN_COLORS.accentRose,
  },
  insightBalanced: {
    backgroundColor: 'rgba(201, 162, 39, 0.15)',
    borderColor: DESIGN_COLORS.accentGold,
  },
  insightNeutral: {
    backgroundColor: DESIGN_COLORS.bgSecondary,
    borderColor: DESIGN_COLORS.border,
  },
  insightText: {
    fontSize: 14,
    color: DESIGN_COLORS.textPrimary,
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: DESIGN_COLORS.bgSecondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 14,
    color: DESIGN_COLORS.textSecondary,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: DESIGN_COLORS.border,
    marginHorizontal: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  sectionBadgeText: {
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: DESIGN_COLORS.textPrimary,
  },
  sectionHint: {
    fontSize: 14,
    color: DESIGN_COLORS.textTertiary,
    marginBottom: 12,
  },
  itemCard: {
    backgroundColor: DESIGN_COLORS.bgSecondary,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
  },
  itemInput: {
    color: DESIGN_COLORS.textPrimary,
    fontSize: 14,
    lineHeight: 20,
    minHeight: 40,
    textAlignVertical: 'top',
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: DESIGN_COLORS.border,
  },
  starContainer: {
    flexDirection: 'row',
  },
  starButton: {
    padding: 4,
  },
  star: {
    fontSize: 18,
    color: DESIGN_COLORS.textTertiary,
  },
  deleteBtn: {
    padding: 4,
  },
  deleteBtnText: {
    fontSize: 16,
    color: DESIGN_COLORS.error,
  },
  addButton: {
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    backgroundColor: 'transparent',
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  reflectionsInput: {
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

export default StrengthsWeaknessesScreen;
