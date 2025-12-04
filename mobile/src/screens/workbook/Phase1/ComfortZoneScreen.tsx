/**
 * Comfort Zone Screen - Phase 1 Self-Evaluation
 *
 * An exercise to help users visualize and understand their comfort zones,
 * identifying areas where they feel safe vs. areas they avoid.
 *
 * Features:
 * - Three-zone model (Comfort, Growth, Panic)
 * - Add items to each zone
 * - Visual representation of zone sizes
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
  // Zone colors
  comfortZone: '#2d5a4a',
  growthZone: '#c9a227',
  panicZone: '#8b3a5f',
};

interface ZoneItem {
  id: string;
  text: string;
  addedAt: string;
}

interface ComfortZoneData {
  comfort: ZoneItem[];
  growth: ZoneItem[];
  panic: ZoneItem[];
  commitments: string;
  updatedAt: string;
}

const generateId = (): string => {
  return `cz-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const DEFAULT_DATA: ComfortZoneData = {
  comfort: [],
  growth: [],
  panic: [],
  commitments: '',
  updatedAt: new Date().toISOString(),
};

type ZoneType = 'comfort' | 'growth' | 'panic';

const ZONE_CONFIG: Record<ZoneType, {
  label: string;
  description: string;
  color: string;
  emoji: string;
  prompt: string;
}> = {
  comfort: {
    label: 'Comfort Zone',
    description: 'Where you feel safe and in control',
    color: DESIGN_COLORS.comfortZone,
    emoji: '🏠',
    prompt: 'Activities, situations, and behaviors where you feel completely comfortable...',
  },
  growth: {
    label: 'Growth Zone',
    description: 'Challenging but achievable',
    color: DESIGN_COLORS.growthZone,
    emoji: '🌱',
    prompt: 'Things that stretch you but are achievable with effort...',
  },
  panic: {
    label: 'Panic Zone',
    description: 'Feels overwhelming right now',
    color: DESIGN_COLORS.panicZone,
    emoji: '⚡',
    prompt: 'Situations that feel too scary or overwhelming currently...',
  },
};

type Props = WorkbookStackScreenProps<'ComfortZone'>;

/**
 * Zone Section Component
 */
const ZoneSection: React.FC<{
  zone: ZoneType;
  items: ZoneItem[];
  onAddItem: () => void;
  onUpdateItem: (id: string, text: string) => void;
  onDeleteItem: (id: string) => void;
}> = ({ zone, items, onAddItem, onUpdateItem, onDeleteItem }) => {
  const config = ZONE_CONFIG[zone];

  return (
    <View style={[styles.zoneSection, { borderColor: config.color }]}>
      <View style={styles.zoneHeader}>
        <View style={[styles.zoneBadge, { backgroundColor: config.color }]}>
          <Text style={styles.zoneEmoji}>{config.emoji}</Text>
        </View>
        <View style={styles.zoneHeaderText}>
          <Text style={[styles.zoneTitle, { color: config.color }]}>{config.label}</Text>
          <Text style={styles.zoneDescription}>{config.description}</Text>
        </View>
        <View style={styles.zoneCount}>
          <Text style={[styles.zoneCountNumber, { color: config.color }]}>{items.length}</Text>
        </View>
      </View>

      <Text style={styles.zonePrompt}>{config.prompt}</Text>

      <View style={styles.zoneItems}>
        {items.map((item) => (
          <View key={item.id} style={[styles.itemChip, { borderColor: config.color }]}>
            <TextInput
              style={styles.itemInput}
              value={item.text}
              onChangeText={(text) => onUpdateItem(item.id, text)}
              placeholder="Type here..."
              placeholderTextColor={DESIGN_COLORS.textTertiary}
            />
            <Pressable
              onPress={() => onDeleteItem(item.id)}
              style={styles.itemDeleteBtn}
            >
              <Text style={styles.itemDeleteText}>✕</Text>
            </Pressable>
          </View>
        ))}

        <Pressable
          style={[styles.addItemBtn, { borderColor: config.color }]}
          onPress={onAddItem}
        >
          <Text style={[styles.addItemText, { color: config.color }]}>+ Add Item</Text>
        </Pressable>
      </View>
    </View>
  );
};

/**
 * Comfort Zone Screen Component
 */
const ComfortZoneScreen: React.FC<Props> = ({ navigation }) => {
  const [data, setData] = useState<ComfortZoneData>(DEFAULT_DATA);

  // Load saved data from Supabase
  const { data: savedProgress, isLoading } = useWorkbookProgress(1, WORKSHEET_IDS.COMFORT_ZONE);

  // Auto-save with debounce
  const { isSaving, isError, lastSaved, saveNow } = useAutoSave({
    data: data as unknown as Record<string, unknown>,
    phaseNumber: 1,
    worksheetId: WORKSHEET_IDS.COMFORT_ZONE,
    debounceMs: 2000,
  });

  // Load saved data into state when fetched
  useEffect(() => {
    if (savedProgress?.data) {
      const savedData = savedProgress.data as unknown as ComfortZoneData;
      setData(savedData);
    }
  }, [savedProgress]);

  /**
   * Add item to a zone
   */
  const handleAddItem = useCallback((zone: ZoneType) => {
    const newItem: ZoneItem = {
      id: generateId(),
      text: '',
      addedAt: new Date().toISOString(),
    };

    setData((prev) => ({
      ...prev,
      [zone]: [...prev[zone], newItem],
      updatedAt: new Date().toISOString(),
    }));

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  /**
   * Update item text
   */
  const handleUpdateItem = useCallback((zone: ZoneType, id: string, text: string) => {
    setData((prev) => ({
      ...prev,
      [zone]: prev[zone].map((item) =>
        item.id === id ? { ...item, text } : item
      ),
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  /**
   * Delete item from zone
   */
  const handleDeleteItem = useCallback((zone: ZoneType, id: string) => {
    setData((prev) => ({
      ...prev,
      [zone]: prev[zone].filter((item) => item.id !== id),
      updatedAt: new Date().toISOString(),
    }));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, []);

  /**
   * Update commitments
   */
  const handleCommitmentsChange = useCallback((text: string) => {
    setData((prev) => ({
      ...prev,
      commitments: text,
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  /**
   * Handle save and continue
   */
  const handleSaveAndContinue = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    saveNow({ completed: true });
    navigation.goBack();
  };

  /**
   * Get insight based on zone distribution
   */
  const getInsight = () => {
    const total = data.comfort.length + data.growth.length + data.panic.length;

    if (total === 0) {
      return {
        message: 'Start mapping your zones by adding items to each area.',
        type: 'neutral',
      };
    }

    const growthRatio = data.growth.length / total;

    if (growthRatio > 0.4) {
      return {
        message: 'You\'ve identified many growth opportunities! Focus on one or two at a time.',
        type: 'growth',
      };
    }

    if (data.comfort.length > total * 0.6) {
      return {
        message: 'Your comfort zone is well-mapped. Consider exploring more growth areas.',
        type: 'comfort',
      };
    }

    if (data.panic.length > data.growth.length) {
      return {
        message: 'Some panic zone items might become growth opportunities with small steps.',
        type: 'panic',
      };
    }

    return {
      message: 'Good balance across zones. Growth happens at the edge of comfort.',
      type: 'balanced',
    };
  };

  const insight = getInsight();

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
        image={Phase1ExerciseImages.comfortZone}
        title="Comfort Zone Map"
        subtitle="Understanding where you feel comfortable, challenged, or overwhelmed helps you plan meaningful growth."
        progress={savedProgress?.progress || 0}
      />

      {/* Visual Zone Diagram */}
      <View style={styles.zoneDiagram}>
        <View style={[styles.outerRing, { borderColor: DESIGN_COLORS.panicZone }]}>
          <Text style={styles.ringLabel}>Panic</Text>
          <View style={[styles.middleRing, { borderColor: DESIGN_COLORS.growthZone }]}>
            <Text style={styles.ringLabel}>Growth</Text>
            <View style={[styles.innerCircle, { backgroundColor: DESIGN_COLORS.comfortZone }]}>
              <Text style={styles.innerLabel}>Comfort</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Insight Card */}
      <View style={[
        styles.insightCard,
        insight.type === 'growth' && { borderColor: DESIGN_COLORS.growthZone },
        insight.type === 'comfort' && { borderColor: DESIGN_COLORS.comfortZone },
        insight.type === 'panic' && { borderColor: DESIGN_COLORS.panicZone },
        insight.type === 'balanced' && { borderColor: DESIGN_COLORS.accentGold },
        insight.type === 'neutral' && { borderColor: DESIGN_COLORS.border },
      ]}>
        <Text style={styles.insightText}>{insight.message}</Text>
      </View>

      {/* Zone Sections */}
      <ZoneSection
        zone="comfort"
        items={data.comfort}
        onAddItem={() => handleAddItem('comfort')}
        onUpdateItem={(id, text) => handleUpdateItem('comfort', id, text)}
        onDeleteItem={(id) => handleDeleteItem('comfort', id)}
      />

      <ZoneSection
        zone="growth"
        items={data.growth}
        onAddItem={() => handleAddItem('growth')}
        onUpdateItem={(id, text) => handleUpdateItem('growth', id, text)}
        onDeleteItem={(id) => handleDeleteItem('growth', id)}
      />

      <ZoneSection
        zone="panic"
        items={data.panic}
        onAddItem={() => handleAddItem('panic')}
        onUpdateItem={(id, text) => handleUpdateItem('panic', id, text)}
        onDeleteItem={(id) => handleDeleteItem('panic', id)}
      />

      {/* Commitments Section */}
      <View style={styles.commitmentsSection}>
        <Text style={styles.sectionTitle}>Your Growth Commitment</Text>
        <Text style={styles.sectionHint}>
          What one item from your growth zone will you commit to exploring this week?
        </Text>
        <TextInput
          style={styles.commitmentsInput}
          value={data.commitments}
          onChangeText={handleCommitmentsChange}
          placeholder="Write your commitment here..."
          placeholderTextColor={DESIGN_COLORS.textTertiary}
          multiline
          numberOfLines={3}
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
  zoneDiagram: {
    alignItems: 'center',
    marginBottom: 24,
  },
  outerRing: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(139, 58, 95, 0.1)',
  },
  middleRing: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(201, 162, 39, 0.15)',
  },
  innerCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringLabel: {
    position: 'absolute',
    top: 8,
    fontSize: 11,
    fontWeight: '600',
    color: DESIGN_COLORS.textSecondary,
  },
  innerLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: DESIGN_COLORS.textPrimary,
  },
  insightCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    backgroundColor: DESIGN_COLORS.bgSecondary,
    borderWidth: 1,
  },
  insightText: {
    fontSize: 14,
    color: DESIGN_COLORS.textPrimary,
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: '500',
  },
  zoneSection: {
    backgroundColor: DESIGN_COLORS.bgSecondary,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderLeftWidth: 4,
  },
  zoneHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  zoneBadge: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  zoneEmoji: {
    fontSize: 20,
  },
  zoneHeaderText: {
    flex: 1,
  },
  zoneTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  zoneDescription: {
    fontSize: 12,
    color: DESIGN_COLORS.textSecondary,
  },
  zoneCount: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: DESIGN_COLORS.bgElevated,
    borderRadius: 8,
  },
  zoneCountNumber: {
    fontSize: 16,
    fontWeight: '700',
  },
  zonePrompt: {
    fontSize: 13,
    color: DESIGN_COLORS.textTertiary,
    fontStyle: 'italic',
    marginBottom: 12,
  },
  zoneItems: {
    gap: 8,
  },
  itemChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DESIGN_COLORS.bgElevated,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
  },
  itemInput: {
    flex: 1,
    color: DESIGN_COLORS.textPrimary,
    fontSize: 14,
  },
  itemDeleteBtn: {
    padding: 4,
    marginLeft: 8,
  },
  itemDeleteText: {
    fontSize: 14,
    color: DESIGN_COLORS.error,
  },
  addItemBtn: {
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    marginTop: 4,
  },
  addItemText: {
    fontSize: 14,
    fontWeight: '600',
  },
  commitmentsSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: DESIGN_COLORS.textPrimary,
    marginBottom: 4,
  },
  sectionHint: {
    fontSize: 14,
    color: DESIGN_COLORS.textTertiary,
    marginBottom: 12,
  },
  commitmentsInput: {
    backgroundColor: DESIGN_COLORS.bgSecondary,
    borderRadius: 12,
    padding: 16,
    color: DESIGN_COLORS.textPrimary,
    fontSize: 14,
    lineHeight: 22,
    minHeight: 80,
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

export default ComfortZoneScreen;
