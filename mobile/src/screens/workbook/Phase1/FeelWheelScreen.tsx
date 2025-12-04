/**
 * Feel Wheel Screen - Phase 1 Self-Evaluation
 *
 * An emotion identification wheel where users identify and rate their current
 * emotional state across multiple dimensions.
 *
 * Features:
 * - Visual emotion wheel with 8 primary emotions
 * - Intensity rating (1-10) for each emotion
 * - Current emotional state summary
 * - Auto-save to Supabase
 */

import React, { useState, useEffect, useCallback } from 'react';
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
};

// Emotion definitions with colors
const EMOTIONS = [
  { key: 'joy', label: 'Joy', color: '#FFD700', emoji: '😊' },
  { key: 'trust', label: 'Trust', color: '#98FB98', emoji: '🤝' },
  { key: 'fear', label: 'Fear', color: '#4a1a6b', emoji: '😨' },
  { key: 'surprise', label: 'Surprise', color: '#FF69B4', emoji: '😮' },
  { key: 'sadness', label: 'Sadness', color: '#4169E1', emoji: '😢' },
  { key: 'disgust', label: 'Disgust', color: '#556B2F', emoji: '🤢' },
  { key: 'anger', label: 'Anger', color: '#DC143C', emoji: '😠' },
  { key: 'anticipation', label: 'Anticipation', color: '#FFA500', emoji: '🤔' },
] as const;

type EmotionKey = (typeof EMOTIONS)[number]['key'];

interface FeelWheelValues {
  joy: number;
  trust: number;
  fear: number;
  surprise: number;
  sadness: number;
  disgust: number;
  anger: number;
  anticipation: number;
}

// Default values
const DEFAULT_VALUES: FeelWheelValues = {
  joy: 5,
  trust: 5,
  fear: 5,
  surprise: 5,
  sadness: 5,
  disgust: 5,
  anger: 5,
  anticipation: 5,
};

type Props = WorkbookStackScreenProps<'FeelWheel'>;

/**
 * Feel Wheel Screen Component
 */
const FeelWheelScreen: React.FC<Props> = ({ navigation }) => {
  const [values, setValues] = useState<FeelWheelValues>(DEFAULT_VALUES);
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionKey | null>(null);

  // Load saved data from Supabase
  const { data: savedProgress, isLoading } = useWorkbookProgress(1, WORKSHEET_IDS.FEEL_WHEEL);

  // Auto-save with debounce
  const { isSaving, isError, lastSaved, saveNow } = useAutoSave({
    data: values as unknown as Record<string, unknown>,
    phaseNumber: 1,
    worksheetId: WORKSHEET_IDS.FEEL_WHEEL,
    debounceMs: 1500,
  });

  // Load saved data into state when fetched
  useEffect(() => {
    if (savedProgress?.data) {
      const savedData = savedProgress.data as unknown as FeelWheelValues;
      setValues(savedData);
    }
  }, [savedProgress]);

  /**
   * Handle value change for an emotion
   */
  const handleValueChange = useCallback((emotion: EmotionKey, value: number) => {
    setValues((prev) => ({
      ...prev,
      [emotion]: Math.round(value),
    }));
  }, []);

  /**
   * Get dominant emotion
   */
  const getDominantEmotion = () => {
    const entries = Object.entries(values) as [EmotionKey, number][];
    const sorted = entries.sort((a, b) => b[1] - a[1]);
    const highest = sorted[0];
    const emotion = EMOTIONS.find(e => e.key === highest[0]);
    return emotion;
  };

  /**
   * Get emotional balance insight
   */
  const getEmotionalInsight = () => {
    const positiveEmotions = values.joy + values.trust + values.anticipation;
    const challengingEmotions = values.fear + values.sadness + values.disgust + values.anger;

    if (positiveEmotions > challengingEmotions + 10) {
      return { message: 'You\'re experiencing predominantly positive emotions. Wonderful!', type: 'positive' };
    }
    if (challengingEmotions > positiveEmotions + 10) {
      return { message: 'You\'re experiencing some challenging emotions. That\'s okay—awareness is the first step.', type: 'challenging' };
    }
    return { message: 'Your emotions are balanced. You\'re aware of the full spectrum of your feelings.', type: 'balanced' };
  };

  /**
   * Handle save and continue
   */
  const handleSaveAndContinue = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    saveNow({ completed: true });
    navigation.goBack();
  };

  const dominantEmotion = getDominantEmotion();
  const insight = getEmotionalInsight();

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
      <ExerciseHeader
        image={Phase1ExerciseImages.feelWheel}
        title="Feel Wheel"
        subtitle="Identify and rate the intensity of your current emotions. Understanding your emotional state is key to self-awareness."
        progress={savedProgress?.progress || 0}
      />

      {/* Dominant Emotion Card */}
      {dominantEmotion && (
        <View style={[styles.dominantCard, { borderColor: dominantEmotion.color }]}>
          <Text style={styles.dominantEmoji}>{dominantEmotion.emoji}</Text>
          <View style={styles.dominantTextContainer}>
            <Text style={styles.dominantLabel}>Dominant Emotion</Text>
            <Text style={[styles.dominantName, { color: dominantEmotion.color }]}>
              {dominantEmotion.label}
            </Text>
          </View>
          <Text style={styles.dominantValue}>{values[dominantEmotion.key]}/10</Text>
        </View>
      )}

      {/* Insight Card */}
      <View style={[
        styles.insightCard,
        insight.type === 'positive' && styles.insightPositive,
        insight.type === 'challenging' && styles.insightChallenging,
        insight.type === 'balanced' && styles.insightBalanced,
      ]}>
        <Text style={styles.insightText}>{insight.message}</Text>
      </View>

      {/* Emotion Sliders */}
      <View style={styles.slidersSection}>
        <Text style={styles.sectionTitle}>Rate Your Emotions</Text>
        <Text style={styles.sectionSubtitle}>
          1 = Not feeling this at all, 10 = Feeling very strongly
        </Text>

        {EMOTIONS.map((emotion) => (
          <Pressable
            key={emotion.key}
            style={[
              styles.emotionCard,
              selectedEmotion === emotion.key && styles.emotionCardSelected,
            ]}
            onPress={() => setSelectedEmotion(emotion.key)}
          >
            <View style={styles.emotionHeader}>
              <Text style={styles.emotionEmoji}>{emotion.emoji}</Text>
              <Text style={styles.emotionLabel}>{emotion.label}</Text>
              <Text style={[styles.emotionValue, { color: emotion.color }]}>
                {values[emotion.key]}
              </Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={10}
              step={1}
              value={values[emotion.key]}
              onValueChange={(value) => handleValueChange(emotion.key, value)}
              minimumTrackTintColor={emotion.color}
              maximumTrackTintColor={DESIGN_COLORS.border}
              thumbTintColor={emotion.color}
            />
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderLabel}>Not at all</Text>
              <Text style={styles.sliderLabel}>Very strong</Text>
            </View>
          </Pressable>
        ))}
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
  dominantCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DESIGN_COLORS.bgSecondary,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
  },
  dominantEmoji: {
    fontSize: 40,
    marginRight: 12,
  },
  dominantTextContainer: {
    flex: 1,
  },
  dominantLabel: {
    fontSize: 12,
    color: DESIGN_COLORS.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dominantName: {
    fontSize: 20,
    fontWeight: '700',
  },
  dominantValue: {
    fontSize: 24,
    fontWeight: '700',
    color: DESIGN_COLORS.textPrimary,
  },
  insightCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
  },
  insightPositive: {
    backgroundColor: 'rgba(45, 90, 74, 0.2)',
    borderColor: DESIGN_COLORS.accentGreen,
  },
  insightChallenging: {
    backgroundColor: 'rgba(139, 58, 95, 0.2)',
    borderColor: DESIGN_COLORS.accentRose,
  },
  insightBalanced: {
    backgroundColor: 'rgba(201, 162, 39, 0.15)',
    borderColor: DESIGN_COLORS.accentGold,
  },
  insightText: {
    fontSize: 14,
    color: DESIGN_COLORS.textPrimary,
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: '500',
  },
  slidersSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: DESIGN_COLORS.textPrimary,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: DESIGN_COLORS.textTertiary,
    marginBottom: 16,
  },
  emotionCard: {
    backgroundColor: DESIGN_COLORS.bgSecondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
  },
  emotionCardSelected: {
    borderColor: DESIGN_COLORS.accentGold,
  },
  emotionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  emotionEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  emotionLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: DESIGN_COLORS.textPrimary,
  },
  emotionValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderLabel: {
    fontSize: 11,
    color: DESIGN_COLORS.textTertiary,
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

export default FeelWheelScreen;
