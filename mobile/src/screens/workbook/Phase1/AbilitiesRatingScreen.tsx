/**
 * Abilities Rating Screen - Phase 1 Self-Evaluation
 *
 * A skills self-assessment where users rate their abilities across
 * multiple competency areas on a 1-10 scale.
 *
 * Features:
 * - Categorized skill areas
 * - 1-10 rating sliders
 * - Visual summary of strengths/weaknesses
 * - Auto-save to Supabase
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import Slider from '@react-native-community/slider';
import { SaveIndicator } from '../../../components/workbook';
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
};

// Skill categories and abilities
const SKILL_CATEGORIES = [
  {
    category: 'Communication',
    emoji: '💬',
    color: DESIGN_COLORS.accentTeal,
    skills: [
      { key: 'speaking', label: 'Public Speaking', description: 'Presenting ideas to groups' },
      { key: 'writing', label: 'Written Communication', description: 'Expressing ideas in writing' },
      { key: 'listening', label: 'Active Listening', description: 'Understanding others deeply' },
    ],
  },
  {
    category: 'Leadership',
    emoji: '👑',
    color: DESIGN_COLORS.accentGold,
    skills: [
      { key: 'decisionMaking', label: 'Decision Making', description: 'Making sound choices under pressure' },
      { key: 'teamwork', label: 'Team Collaboration', description: 'Working effectively with others' },
      { key: 'influence', label: 'Influence & Persuasion', description: 'Inspiring others to action' },
    ],
  },
  {
    category: 'Personal',
    emoji: '🧘',
    color: DESIGN_COLORS.accentPurple,
    skills: [
      { key: 'selfDiscipline', label: 'Self-Discipline', description: 'Following through on commitments' },
      { key: 'emotionalIntelligence', label: 'Emotional Intelligence', description: 'Managing emotions wisely' },
      { key: 'adaptability', label: 'Adaptability', description: 'Adjusting to new situations' },
    ],
  },
  {
    category: 'Practical',
    emoji: '🛠️',
    color: DESIGN_COLORS.accentAmber,
    skills: [
      { key: 'problemSolving', label: 'Problem Solving', description: 'Finding solutions to challenges' },
      { key: 'timeManagement', label: 'Time Management', description: 'Using time effectively' },
      { key: 'creativity', label: 'Creativity', description: 'Generating original ideas' },
    ],
  },
] as const;

type SkillKey = (typeof SKILL_CATEGORIES)[number]['skills'][number]['key'];

interface AbilitiesData {
  ratings: Record<SkillKey, number>;
  notes: string;
  updatedAt: string;
}

// Default ratings
const getDefaultRatings = (): Record<SkillKey, number> => {
  const ratings: Record<string, number> = {};
  SKILL_CATEGORIES.forEach((cat) => {
    cat.skills.forEach((skill) => {
      ratings[skill.key] = 5;
    });
  });
  return ratings as Record<SkillKey, number>;
};

const DEFAULT_DATA: AbilitiesData = {
  ratings: getDefaultRatings(),
  notes: '',
  updatedAt: new Date().toISOString(),
};

type Props = WorkbookStackScreenProps<'AbilitiesRating'>;

/**
 * Get rating level text
 */
const getRatingLevel = (value: number): { text: string; color: string } => {
  if (value >= 9) return { text: 'Expert', color: DESIGN_COLORS.accentGold };
  if (value >= 7) return { text: 'Strong', color: DESIGN_COLORS.accentGreen };
  if (value >= 5) return { text: 'Average', color: DESIGN_COLORS.textSecondary };
  if (value >= 3) return { text: 'Developing', color: DESIGN_COLORS.accentAmber };
  return { text: 'Beginner', color: DESIGN_COLORS.accentRose };
};

/**
 * Abilities Rating Screen Component
 */
const AbilitiesRatingScreen: React.FC<Props> = ({ navigation }) => {
  const [data, setData] = useState<AbilitiesData>(DEFAULT_DATA);
  const [expandedCategory, setExpandedCategory] = useState<string | null>('Communication');

  // Load saved data from Supabase
  const { data: savedProgress, isLoading } = useWorkbookProgress(1, WORKSHEET_IDS.ABILITIES_RATING);

  // Auto-save with debounce
  const { isSaving, isError, lastSaved, saveNow } = useAutoSave({
    data: data as unknown as Record<string, unknown>,
    phaseNumber: 1,
    worksheetId: WORKSHEET_IDS.ABILITIES_RATING,
    debounceMs: 1500,
  });

  // Load saved data into state when fetched
  useEffect(() => {
    if (savedProgress?.data) {
      const savedData = savedProgress.data as unknown as AbilitiesData;
      setData(savedData);
    }
  }, [savedProgress]);

  /**
   * Handle rating change
   */
  const handleRatingChange = useCallback((skillKey: SkillKey, value: number) => {
    setData((prev) => ({
      ...prev,
      ratings: {
        ...prev.ratings,
        [skillKey]: Math.round(value),
      },
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  /**
   * Calculate stats
   */
  const stats = useMemo(() => {
    const allRatings = Object.values(data.ratings);
    const avg = allRatings.reduce((sum, r) => sum + r, 0) / allRatings.length;
    const max = Math.max(...allRatings);
    const min = Math.min(...allRatings);

    // Find strongest and weakest skills
    let strongestSkill = { key: '', label: '', rating: 0 };
    let weakestSkill = { key: '', label: '', rating: 10 };

    SKILL_CATEGORIES.forEach((cat) => {
      cat.skills.forEach((skill) => {
        const rating = data.ratings[skill.key as SkillKey];
        if (rating > strongestSkill.rating) {
          strongestSkill = { key: skill.key, label: skill.label, rating };
        }
        if (rating < weakestSkill.rating) {
          weakestSkill = { key: skill.key, label: skill.label, rating };
        }
      });
    });

    return {
      average: avg.toFixed(1),
      max,
      min,
      range: max - min,
      strongestSkill,
      weakestSkill,
    };
  }, [data.ratings]);

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
    >
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.title}>Abilities Rating</Text>
        <Text style={styles.subtitle}>
          Honestly assess your current skill levels. Self-awareness is the foundation
          of targeted personal growth.
        </Text>
      </View>

      {/* Summary Card */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Your Skill Profile</Text>
        <View style={styles.summaryStats}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{stats.average}</Text>
            <Text style={styles.statLabel}>Average</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: DESIGN_COLORS.accentGreen }]}>
              {stats.max}
            </Text>
            <Text style={styles.statLabel}>Highest</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: DESIGN_COLORS.accentRose }]}>
              {stats.min}
            </Text>
            <Text style={styles.statLabel}>Lowest</Text>
          </View>
        </View>

        {/* Strongest/Weakest */}
        <View style={styles.insightRow}>
          <View style={styles.insightItem}>
            <Text style={styles.insightLabel}>💪 Strongest</Text>
            <Text style={styles.insightValue}>{stats.strongestSkill.label}</Text>
          </View>
          <View style={styles.insightItem}>
            <Text style={styles.insightLabel}>🎯 Growth Area</Text>
            <Text style={styles.insightValue}>{stats.weakestSkill.label}</Text>
          </View>
        </View>
      </View>

      {/* Skill Categories */}
      <View style={styles.categoriesSection}>
        {SKILL_CATEGORIES.map((category) => {
          const isExpanded = expandedCategory === category.category;
          const categoryAvg = category.skills.reduce(
            (sum, skill) => sum + data.ratings[skill.key as SkillKey],
            0
          ) / category.skills.length;

          return (
            <View key={category.category} style={styles.categoryCard}>
              <Pressable
                style={[styles.categoryHeader, { borderLeftColor: category.color }]}
                onPress={() => {
                  setExpandedCategory(isExpanded ? null : category.category);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
              >
                <View style={[styles.categoryBadge, { backgroundColor: category.color }]}>
                  <Text style={styles.categoryEmoji}>{category.emoji}</Text>
                </View>
                <View style={styles.categoryTitleContainer}>
                  <Text style={styles.categoryTitle}>{category.category}</Text>
                  <Text style={styles.categoryAvg}>Avg: {categoryAvg.toFixed(1)}</Text>
                </View>
                <Text style={styles.expandIcon}>{isExpanded ? '▼' : '▶'}</Text>
              </Pressable>

              {isExpanded && (
                <View style={styles.skillsList}>
                  {category.skills.map((skill) => {
                    const rating = data.ratings[skill.key as SkillKey];
                    const level = getRatingLevel(rating);

                    return (
                      <View key={skill.key} style={styles.skillItem}>
                        <View style={styles.skillHeader}>
                          <Text style={styles.skillLabel}>{skill.label}</Text>
                          <Text style={[styles.skillValue, { color: level.color }]}>
                            {rating} - {level.text}
                          </Text>
                        </View>
                        <Text style={styles.skillDescription}>{skill.description}</Text>
                        <Slider
                          style={styles.slider}
                          minimumValue={1}
                          maximumValue={10}
                          step={1}
                          value={rating}
                          onValueChange={(value) =>
                            handleRatingChange(skill.key as SkillKey, value)
                          }
                          minimumTrackTintColor={category.color}
                          maximumTrackTintColor={DESIGN_COLORS.border}
                          thumbTintColor={category.color}
                        />
                        <View style={styles.sliderLabels}>
                          <Text style={styles.sliderLabel}>Beginner</Text>
                          <Text style={styles.sliderLabel}>Expert</Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              )}
            </View>
          );
        })}
      </View>

      {/* Tips Card */}
      <View style={styles.tipsCard}>
        <Text style={styles.tipsTitle}>💡 Rating Tips</Text>
        <Text style={styles.tipsText}>
          • Be honest - this is for your eyes only{'\n'}
          • Rate where you are NOW, not where you want to be{'\n'}
          • Consider recent examples when deciding{'\n'}
          • 5 = Average for most people, not below average
        </Text>
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
  summaryCard: {
    backgroundColor: DESIGN_COLORS.bgSecondary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: DESIGN_COLORS.textPrimary,
    marginBottom: 16,
    textAlign: 'center',
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 16,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: DESIGN_COLORS.accentGold,
  },
  statLabel: {
    fontSize: 12,
    color: DESIGN_COLORS.textTertiary,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: DESIGN_COLORS.border,
  },
  insightRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: DESIGN_COLORS.border,
  },
  insightItem: {
    flex: 1,
    alignItems: 'center',
  },
  insightLabel: {
    fontSize: 12,
    color: DESIGN_COLORS.textTertiary,
    marginBottom: 4,
  },
  insightValue: {
    fontSize: 14,
    fontWeight: '600',
    color: DESIGN_COLORS.textPrimary,
    textAlign: 'center',
  },
  categoriesSection: {
    marginBottom: 16,
  },
  categoryCard: {
    backgroundColor: DESIGN_COLORS.bgSecondary,
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderLeftWidth: 4,
  },
  categoryBadge: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  categoryEmoji: {
    fontSize: 20,
  },
  categoryTitleContainer: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: DESIGN_COLORS.textPrimary,
  },
  categoryAvg: {
    fontSize: 12,
    color: DESIGN_COLORS.textTertiary,
    marginTop: 2,
  },
  expandIcon: {
    fontSize: 12,
    color: DESIGN_COLORS.textTertiary,
  },
  skillsList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  skillItem: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: DESIGN_COLORS.border,
  },
  skillHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  skillLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: DESIGN_COLORS.textPrimary,
  },
  skillValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  skillDescription: {
    fontSize: 12,
    color: DESIGN_COLORS.textTertiary,
    marginBottom: 8,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -4,
  },
  sliderLabel: {
    fontSize: 10,
    color: DESIGN_COLORS.textTertiary,
  },
  tipsCard: {
    backgroundColor: 'rgba(201, 162, 39, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(201, 162, 39, 0.3)',
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: DESIGN_COLORS.accentGold,
    marginBottom: 8,
  },
  tipsText: {
    fontSize: 13,
    color: DESIGN_COLORS.textSecondary,
    lineHeight: 20,
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

export default AbilitiesRatingScreen;
