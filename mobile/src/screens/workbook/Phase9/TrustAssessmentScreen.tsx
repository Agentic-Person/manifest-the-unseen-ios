/**
 * TrustAssessmentScreen
 *
 * Assessment screen for Phase 9: Trust & Surrender.
 * Users rate their trust levels across 5 dimensions and receive
 * personalized insights and journal prompts based on results.
 *
 * Features:
 * - Series of reflective questions about trust levels
 * - Scale responses (1-10) for each dimension
 * - Visual radar chart showing trust profile
 * - Journal prompts based on lowest scores
 * - Auto-save functionality
 *
 * Design (from APP-DESIGN.md):
 * - Background: #1a1a2e (deep charcoal)
 * - Elevated surfaces: #252547
 * - Accent gold: #c9a227
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
} from 'react-native';
import * as Haptics from 'expo-haptics';
import Slider from '@react-native-community/slider';
import type { WorkbookStackScreenProps } from '../../../types/navigation';
import {
  TrustRadar,
  TRUST_DIMENSIONS,
  TrustValues,
  TrustDimension,
} from '../../../components/workbook/TrustRadar';
import { SaveIndicator, ExerciseHeader } from '../../../components/workbook';
import { Phase9ExerciseImages } from '../../../assets';
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
  accentGreen: '#2d5a4a',
  border: '#3a3a5a',
};

/**
 * Trust Questions for Assessment
 */
const TRUST_QUESTIONS: Record<TrustDimension, string[]> = {
  self: [
    'I trust my own judgment and decisions.',
    'I believe in my ability to handle challenges.',
    'I listen to and follow my intuition.',
  ],
  others: [
    'I feel comfortable relying on others for support.',
    'I believe people generally have good intentions.',
    'I can be vulnerable with those close to me.',
  ],
  universe: [
    'I believe there is a greater purpose to life.',
    'I feel connected to something larger than myself.',
    'I trust that things happen for a reason.',
  ],
  process: [
    'I understand that growth takes time.',
    'I value the journey as much as the destination.',
    'I accept that setbacks are part of progress.',
  ],
  timing: [
    'I believe things happen when they are meant to.',
    'I can wait patiently for what I want.',
    'I trust that the right opportunities will come.',
  ],
};

/**
 * Journal Prompts based on low scores
 */
const JOURNAL_PROMPTS: Record<TrustDimension, string[]> = {
  self: [
    'Recall a time when you trusted yourself and it worked out. What did that feel like?',
    'What would you do differently if you fully trusted yourself?',
    'What inner voice do you often ignore? What is it trying to tell you?',
  ],
  others: [
    'Who in your life has earned your trust? What makes them trustworthy?',
    'What past experience makes it hard to trust others? How can you heal from it?',
    'Imagine letting go of the fear of being hurt. What relationships would you pursue?',
  ],
  universe: [
    'Think of a difficult situation that later revealed a hidden blessing. What was it?',
    'What signs or synchronicities have you noticed recently?',
    'If you believed the universe was supporting you, how would you act differently?',
  ],
  process: [
    'What is something valuable you learned from a struggle or failure?',
    'How can you find more joy in the journey rather than focusing only on results?',
    'What small progress have you made that you haven\'t acknowledged?',
  ],
  timing: [
    'When has waiting for something led to a better outcome than you expected?',
    'What are you rushing that might benefit from patience?',
    'How can you trust that what is meant for you will not pass you by?',
  ],
};

type Props = WorkbookStackScreenProps<'TrustAssessment'>;

// Data type for persistence
interface TrustAssessmentData {
  trustValues: TrustValues;
}

const PHASE_NUMBER = 9;

/**
 * TrustAssessmentScreen Component
 */
const TrustAssessmentScreen: React.FC<Props> = ({ navigation }) => {
  // Supabase data fetching
  const { data: savedProgress, isLoading, isError: isLoadError, error: loadError } = useWorkbookProgress(
    PHASE_NUMBER,
    WORKSHEET_IDS.TRUST_ASSESSMENT
  );

  const [trustValues, setTrustValues] = useState<TrustValues>({
    self: 5,
    others: 5,
    universe: 5,
    process: 5,
    timing: 5,
  });
  const [selectedDimension, setSelectedDimension] = useState<TrustDimension | null>(null);
  const [showInsights, setShowInsights] = useState(false);

  // Auto-save hook
  const formData: TrustAssessmentData = useMemo(() => ({ trustValues }), [trustValues]);
  const { isSaving, lastSaved, saveNow } = useAutoSave({
    data: formData as unknown as Record<string, unknown>,
    phaseNumber: PHASE_NUMBER,
    worksheetId: WORKSHEET_IDS.TRUST_ASSESSMENT,
    debounceMs: 1500,
  });

  // Load saved data
  useEffect(() => {
    // Error state
    if (isLoadError) {
      console.error('[TrustAssessmentScreen] Failed to load progress:', loadError);
      // Continue with default data instead of blocking the UI
    }

    // Only initialize once when loading completes
    if (isLoading) return;

    if (savedProgress?.data) {
      const data = savedProgress.data as unknown as TrustAssessmentData;
      if (data.trustValues) {
        setTrustValues(data.trustValues);
      }
    }
  }, [savedProgress, isLoading]);

  /**
   * Handle slider value change
   */
  const handleValueChange = (dimension: TrustDimension, value: number) => {
    const roundedValue = Math.round(value);
    setTrustValues((prev) => ({
      ...prev,
      [dimension]: roundedValue,
    }));
  };

  /**
   * Handle slider end
   */
  const handleSlidingComplete = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  /**
   * Handle dimension tap from radar chart
   */
  const handleDimensionTap = (dimension: TrustDimension) => {
    setSelectedDimension(dimension === selectedDimension ? null : dimension);
  };

  /**
   * Get lowest scoring dimensions for prompts
   */
  const getLowestDimensions = (): TrustDimension[] => {
    const sorted = Object.entries(trustValues)
      .sort(([, a], [, b]) => a - b)
      .slice(0, 2)
      .map(([key]) => key as TrustDimension);
    return sorted;
  };

  /**
   * Save and continue
   */
  const handleSaveAndContinue = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    saveNow();
    navigation.goBack();
  };

  /**
   * Toggle insights view
   */
  const handleToggleInsights = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowInsights(!showInsights);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={50} color={DESIGN_COLORS.accentGold} />
        <Text style={styles.loadingText}>Loading your trust assessment...</Text>
      </View>
    );
  }

  const lowestDimensions = getLowestDimensions();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <ExerciseHeader
        image={Phase9ExerciseImages.trustAssessment}
        title="Trust Assessment"
        subtitle="Explore your relationship with trust across different dimensions of life. Rate how much you agree with each area on a scale of 1-10."
        progress={savedProgress?.progress || 0}
      />

      {/* Trust Radar Chart */}
      <TrustRadar
        values={trustValues}
        onDimensionTap={handleDimensionTap}
        showLabels={true}
        showValues={true}
      />

      {/* Dimension Sliders */}
      <View style={styles.slidersContainer}>
        <Text style={styles.sectionTitle}>Rate Your Trust</Text>
        {TRUST_DIMENSIONS.map((dim) => {
          const isSelected = selectedDimension === dim.key;
          return (
            <View
              key={dim.key}
              style={[
                styles.sliderCard,
                isSelected && styles.sliderCardSelected,
              ]}
            >
              <View style={styles.sliderHeader}>
                <Text style={styles.sliderLabel}>{dim.label}</Text>
                <Text style={styles.sliderValue}>{trustValues[dim.key]}</Text>
              </View>
              <Text style={styles.sliderDescription}>{dim.description}</Text>
              <View style={styles.sliderRow}>
                <Text style={styles.sliderMin}>1</Text>
                <Slider
                  style={styles.slider}
                  value={trustValues[dim.key]}
                  onValueChange={(val) => handleValueChange(dim.key, val)}
                  onSlidingComplete={handleSlidingComplete}
                  minimumValue={1}
                  maximumValue={10}
                  step={1}
                  minimumTrackTintColor={DESIGN_COLORS.accentGold}
                  maximumTrackTintColor={DESIGN_COLORS.border}
                  thumbTintColor={DESIGN_COLORS.accentGold}
                  accessibilityLabel={`${dim.label} slider`}
                  accessibilityValue={{
                    min: 1,
                    max: 10,
                    now: trustValues[dim.key],
                  }}
                />
                <Text style={styles.sliderMax}>10</Text>
              </View>

              {/* Questions for selected dimension */}
              {isSelected && (
                <View style={styles.questionsContainer}>
                  <Text style={styles.questionsTitle}>Reflect on these questions:</Text>
                  {TRUST_QUESTIONS[dim.key].map((question, idx) => (
                    <View key={idx} style={styles.questionItem}>
                      <Text style={styles.questionBullet}>{'\u2022'}</Text>
                      <Text style={styles.questionText}>{question}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          );
        })}
      </View>

      {/* Insights & Prompts Toggle */}
      <Pressable
        style={styles.insightsToggle}
        onPress={handleToggleInsights}
        accessibilityRole="button"
        accessibilityLabel={showInsights ? 'Hide insights' : 'Show personalized insights'}
      >
        <Text style={styles.insightsToggleIcon}>{showInsights ? '\u25bc' : '\u25b6'}</Text>
        <Text style={styles.insightsToggleText}>
          {showInsights ? 'Hide Personalized Insights' : 'View Personalized Insights & Journal Prompts'}
        </Text>
      </Pressable>

      {/* Insights Section */}
      {showInsights && (
        <View style={styles.insightsContainer}>
          <Text style={styles.insightsTitle}>Areas for Growth</Text>
          <Text style={styles.insightsSubtitle}>
            Based on your lowest scores, here are some areas to explore:
          </Text>

          {lowestDimensions.map((dim) => {
            const dimension = TRUST_DIMENSIONS.find((d) => d.key === dim);
            if (!dimension) return null;

            return (
              <View key={dim} style={styles.insightCard}>
                <View style={styles.insightHeader}>
                  <View style={styles.insightDot} />
                  <Text style={styles.insightTitle}>
                    {dimension.label} ({trustValues[dim]}/10)
                  </Text>
                </View>
                <Text style={styles.promptsLabel}>Journal Prompts:</Text>
                {JOURNAL_PROMPTS[dim].map((prompt, idx) => (
                  <View key={idx} style={styles.promptItem}>
                    <Text style={styles.promptNumber}>{idx + 1}.</Text>
                    <Text style={styles.promptText}>{prompt}</Text>
                  </View>
                ))}
              </View>
            );
          })}
        </View>
      )}

      {/* Save Status */}
      <View style={styles.saveStatusContainer}>
        <SaveIndicator isSaving={isSaving} lastSaved={lastSaved} isError={isLoadError} onRetry={saveNow} />
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

  // Sliders Section
  slidersContainer: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: DESIGN_COLORS.textPrimary,
    marginBottom: 16,
  },
  sliderCard: {
    backgroundColor: DESIGN_COLORS.bgElevated,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
  },
  sliderCardSelected: {
    borderColor: DESIGN_COLORS.accentGold,
    backgroundColor: `${DESIGN_COLORS.accentGold}10`,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  sliderLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: DESIGN_COLORS.textPrimary,
  },
  sliderValue: {
    fontSize: 20,
    fontWeight: '700',
    color: DESIGN_COLORS.accentGold,
  },
  sliderDescription: {
    fontSize: 13,
    color: DESIGN_COLORS.textSecondary,
    marginBottom: 12,
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  slider: {
    flex: 1,
    height: 40,
    marginHorizontal: 8,
  },
  sliderMin: {
    fontSize: 12,
    color: DESIGN_COLORS.textTertiary,
    width: 20,
    textAlign: 'center',
  },
  sliderMax: {
    fontSize: 12,
    color: DESIGN_COLORS.textTertiary,
    width: 20,
    textAlign: 'center',
  },

  // Questions
  questionsContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: DESIGN_COLORS.border,
  },
  questionsTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: DESIGN_COLORS.accentGold,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  questionItem: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingLeft: 4,
  },
  questionBullet: {
    fontSize: 14,
    color: DESIGN_COLORS.accentTeal,
    marginRight: 8,
  },
  questionText: {
    flex: 1,
    fontSize: 14,
    color: DESIGN_COLORS.textSecondary,
    lineHeight: 20,
  },

  // Insights Toggle
  insightsToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DESIGN_COLORS.bgElevated,
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.accentTeal,
  },
  insightsToggleIcon: {
    fontSize: 12,
    color: DESIGN_COLORS.accentTeal,
    marginRight: 12,
  },
  insightsToggleText: {
    fontSize: 15,
    fontWeight: '600',
    color: DESIGN_COLORS.accentTeal,
  },

  // Insights Section
  insightsContainer: {
    marginTop: 16,
    backgroundColor: DESIGN_COLORS.bgSecondary,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
  },
  insightsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: DESIGN_COLORS.textPrimary,
    marginBottom: 4,
  },
  insightsSubtitle: {
    fontSize: 14,
    color: DESIGN_COLORS.textSecondary,
    marginBottom: 16,
  },
  insightCard: {
    backgroundColor: DESIGN_COLORS.bgElevated,
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  insightDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: DESIGN_COLORS.accentGold,
    marginRight: 10,
  },
  insightTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: DESIGN_COLORS.textPrimary,
  },
  promptsLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: DESIGN_COLORS.textTertiary,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  promptItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  promptNumber: {
    fontSize: 13,
    color: DESIGN_COLORS.accentGold,
    fontWeight: '600',
    marginRight: 8,
    width: 18,
  },
  promptText: {
    flex: 1,
    fontSize: 13,
    color: DESIGN_COLORS.textSecondary,
    lineHeight: 19,
  },

  // Save Status
  saveStatusContainer: {
    alignItems: 'center',
    marginTop: 24,
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

export default TrustAssessmentScreen;
