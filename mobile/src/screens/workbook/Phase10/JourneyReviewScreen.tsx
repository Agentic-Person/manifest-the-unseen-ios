/**
 * JourneyReviewScreen
 *
 * Phase 10: Trust & Letting Go - Journey Review
 * Summary of the entire 10-phase transformation journey.
 *
 * Features:
 * - Progress cards for each phase (1-10) showing completion status
 * - Key insights collected from each phase
 * - "My Transformation" before/after reflection
 * - Milestone timeline visualization
 * - Export/share journey summary button (placeholder)
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
  Alert,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import type { WorkbookStackScreenProps } from '../../../types/navigation';
import { PhaseProgressCard } from '../../../components/workbook/PhaseProgressCard';
import type { PhaseProgressData } from '../../../components/workbook/PhaseProgressCard';
import { SaveIndicator, ExerciseHeader } from '../../../components/workbook';
import { Phase10ExerciseImages } from '../../../assets';
import { useAllWorkbookProgress, useWorkbookProgress } from '../../../hooks/useWorkbook';
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

// Journey started date (mock - would come from user data)
const JOURNEY_START_DATE = new Date('2024-06-01');

// Phase metadata
interface PhaseInfo {
  number: number;
  name: string;
  exercises: number;
  description: string;
}

const PHASES: PhaseInfo[] = [
  { number: 1, name: 'Self-Evaluation', exercises: 11, description: 'Discover who you truly are' },
  { number: 2, name: 'Values & Vision', exercises: 3, description: 'Define your vision for life' },
  { number: 3, name: 'Goal Setting', exercises: 3, description: 'Set SMART goals and action plans' },
  { number: 4, name: 'Facing Fears', exercises: 3, description: 'Confront and transform fears' },
  { number: 5, name: 'Self-Love', exercises: 3, description: 'Cultivate self-compassion' },
  { number: 6, name: 'Manifestation', exercises: 3, description: 'Master manifestation techniques' },
  { number: 7, name: 'Gratitude', exercises: 3, description: 'Practice daily gratitude' },
  { number: 8, name: 'Envy to Inspiration', exercises: 2, description: 'Transform envy into motivation' },
  { number: 9, name: 'Trust & Surrender', exercises: 2, description: 'Release control and trust' },
  { number: 10, name: 'Trust & Letting Go', exercises: 3, description: 'Complete your transformation' },
];

// Transformation reflection interface
interface TransformationReflection {
  beforeState: string;
  afterState: string;
  biggestLesson: string;
  gratefulFor: string;
}

type Props = WorkbookStackScreenProps<'JourneyReview'>;

// Data type for persistence
interface JourneyReviewData {
  transformation: TransformationReflection;
}

const PHASE_NUMBER = 10;

/**
 * JourneyReviewScreen Component
 */
const JourneyReviewScreen: React.FC<Props> = ({ navigation }) => {
  // Fetch all workbook progress (for showing phase summary)
  const { data: allProgress, isLoading: isLoadingAll } = useAllWorkbookProgress();

  // Fetch this worksheet's data
  const { data: savedProgress, isLoading, isError: isLoadError, error: loadError } = useWorkbookProgress(
    PHASE_NUMBER,
    WORKSHEET_IDS.JOURNEY_REVIEW
  );

  const [transformation, setTransformation] = useState<TransformationReflection>({
    beforeState: '',
    afterState: '',
    biggestLesson: '',
    gratefulFor: '',
  });

  // Auto-save hook
  const formData: JourneyReviewData = useMemo(() => ({ transformation }), [transformation]);
  const { isSaving, lastSaved, saveNow } = useAutoSave({
    data: formData as unknown as Record<string, unknown>,
    phaseNumber: PHASE_NUMBER,
    worksheetId: WORKSHEET_IDS.JOURNEY_REVIEW,
    debounceMs: 1500,
  });

  // Load saved data
  useEffect(() => {
    // Error state
    if (isLoadError) {
      console.error('[JourneyReviewScreen] Failed to load progress:', loadError);
      // Continue with default data instead of blocking the UI
    }

    if (savedProgress?.data) {
      const data = savedProgress.data as unknown as JourneyReviewData;
      if (data.transformation) {
        setTransformation(data.transformation);
      }
    }
  }, [savedProgress, isLoadError, loadError]);

  // Calculate journey stats from all progress data
  const journeyStats = useMemo(() => {
    if (!allProgress) {
      return {
        totalDays: 0,
        exercisesCompleted: 0,
        journalEntries: 0,
        meditationMinutes: 0,
      };
    }

    const now = new Date();
    const daysDiff = Math.floor(
      (now.getTime() - JOURNEY_START_DATE.getTime()) / (1000 * 60 * 60 * 24)
    );

    return {
      totalDays: daysDiff,
      exercisesCompleted: allProgress.filter(p => p.completed).length,
      journalEntries: 45, // Would come from separate journal table
      meditationMinutes: 360, // Would come from meditation_sessions table
    };
  }, [allProgress]);

  // Generate phase progress data from all progress
  const phaseProgress = useMemo(() => {
    const progressByPhase: PhaseProgressData[] = PHASES.map((phase) => {
      const phaseItems = allProgress?.filter(p => p.phase_number === phase.number) || [];
      const completed = phaseItems.filter(p => p.completed).length;
      const percentage = phase.exercises > 0 ? Math.round((completed / phase.exercises) * 100) : 0;

      // Get key insight from phase data if available
      const keyInsight = phaseItems.length > 0 ? `Completed ${completed} of ${phase.exercises} exercises` : undefined;

      return {
        phaseNumber: phase.number,
        completionPercentage: percentage,
        exercisesCompleted: completed,
        totalExercises: phase.exercises,
        keyInsight,
        lastUpdated: phaseItems.length > 0 ? new Date(phaseItems[0].updated_at).toLocaleDateString() : undefined,
      };
    });

    return progressByPhase;
  }, [allProgress]);

  /**
   * Calculate overall completion
   */
  const overallCompletion = phaseProgress.length > 0
    ? Math.round(
        phaseProgress.reduce((sum, p) => sum + p.completionPercentage, 0) /
          phaseProgress.length
      )
    : 0;

  /**
   * Handle phase card press
   */
  const handlePhasePress = (phaseNumber: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Navigate to phase dashboard
    // Screen name prepared for navigation (to be implemented)
    // const screenName = `Phase${phaseNumber}Dashboard` as keyof typeof navigation.navigate;
    // For now, just log - would navigate to phase
    console.log(`Navigate to Phase ${phaseNumber}`);
  };

  /**
   * Handle export/share
   */
  const handleExportJourney = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'Export Journey',
      'This feature will allow you to export or share your journey summary. Coming soon!',
      [{ text: 'OK' }]
    );
  };

  /**
   * Navigate to next screen
   */
  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate('FutureLetter');
  };

  if (isLoading || isLoadingAll) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={50} color={DESIGN_COLORS.accentGold} />
        <Text style={styles.loadingText}>Loading your journey...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <ExerciseHeader
        image={Phase10ExerciseImages.journeyReview}
        title="Your Transformation Journey"
        subtitle="Reflect on how far you've come. Every step has shaped who you're becoming."
        progress={savedProgress?.progress || 0}
      />

      {/* Overall Progress Card */}
      <View style={styles.overallCard}>
        <View style={styles.overallHeader}>
          <Text style={styles.overallTitle}>Journey Progress</Text>
          <Text style={styles.overallPercentage}>{overallCompletion}%</Text>
        </View>

        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${overallCompletion}%` },
              ]}
            />
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{journeyStats.totalDays}</Text>
            <Text style={styles.statLabel}>Days</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{journeyStats.exercisesCompleted}</Text>
            <Text style={styles.statLabel}>Exercises</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{journeyStats.journalEntries}</Text>
            <Text style={styles.statLabel}>Journals</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{journeyStats.meditationMinutes}m</Text>
            <Text style={styles.statLabel}>Meditation</Text>
          </View>
        </View>
      </View>

      {/* Phase Progress Cards */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Phase-by-Phase Progress</Text>
        <Text style={styles.sectionSubtitle}>Tap any phase to review</Text>
      </View>

      <View style={styles.phasesContainer}>
        {phaseProgress.map((phase) => (
          <PhaseProgressCard
            key={phase.phaseNumber}
            data={phase}
            onPress={handlePhasePress}
            isCompact={false}
          />
        ))}
      </View>

      {/* Transformation Reflection */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>My Transformation</Text>
        <Text style={styles.sectionSubtitle}>Before and after this journey</Text>
        <SaveIndicator isSaving={isSaving} lastSaved={lastSaved} isError={isLoadError} onRetry={saveNow} />
      </View>

      <View style={styles.transformationCard}>
        <View style={styles.transformationRow}>
          <View style={styles.transformationColumn}>
            <Text style={styles.transformationLabel}>BEFORE</Text>
            <View style={styles.transformationBox}>
              <Text style={styles.transformationText}>
                {transformation.beforeState || 'Reflect on who you were...'}
              </Text>
            </View>
          </View>
          <View style={styles.transformationArrow}>
            <Text style={styles.arrowText}>{'\u2192'}</Text>
          </View>
          <View style={styles.transformationColumn}>
            <Text style={styles.transformationLabel}>AFTER</Text>
            <View style={[styles.transformationBox, styles.transformationBoxAfter]}>
              <Text style={styles.transformationText}>
                {transformation.afterState || 'Who are you becoming...'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.lessonContainer}>
          <Text style={styles.lessonLabel}>Biggest Lesson</Text>
          <Text style={styles.lessonText}>
            {transformation.biggestLesson || 'What was your greatest takeaway?'}
          </Text>
        </View>

        <View style={styles.gratefulContainer}>
          <Text style={styles.gratefulLabel}>Grateful For</Text>
          <Text style={styles.gratefulText}>
            {transformation.gratefulFor || 'What are you most grateful for from this journey?'}
          </Text>
        </View>
      </View>

      {/* Timeline Visual */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Journey Timeline</Text>
      </View>

      <View style={styles.timeline}>
        {PHASES.map((phase, index) => {
          const progress = phaseProgress[index];
          const isComplete = progress?.completionPercentage >= 100;
          const isStarted = progress?.completionPercentage > 0;

          return (
            <View key={phase.number} style={styles.timelineItem}>
              <View style={styles.timelineLeft}>
                <View
                  style={[
                    styles.timelineDot,
                    isComplete && styles.timelineDotComplete,
                    !isStarted && !isComplete && styles.timelineDotPending,
                  ]}
                >
                  {isComplete && <Text style={styles.timelineCheck}>{'\u2713'}</Text>}
                </View>
                {index < PHASES.length - 1 && (
                  <View
                    style={[
                      styles.timelineLine,
                      isComplete && styles.timelineLineComplete,
                    ]}
                  />
                )}
              </View>
              <View style={styles.timelineContent}>
                <Text style={styles.timelinePhase}>Phase {phase.number}</Text>
                <Text style={styles.timelineName}>{phase.name}</Text>
                <Text style={styles.timelineDesc}>{phase.description}</Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* Export Button */}
      <Pressable
        style={({ pressed }) => [
          styles.exportButton,
          pressed && styles.buttonPressed,
        ]}
        onPress={handleExportJourney}
        accessibilityRole="button"
        accessibilityLabel="Export journey summary"
      >
        <Text style={styles.exportButtonText}>Export Journey Summary</Text>
      </Pressable>

      {/* Continue Button */}
      <Pressable
        style={({ pressed }) => [
          styles.continueButton,
          pressed && styles.buttonPressed,
        ]}
        onPress={handleContinue}
        accessibilityRole="button"
        accessibilityLabel="Continue to write a letter to your future self"
      >
        <Text style={styles.continueButtonText}>Continue: Letter to Future Self</Text>
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
  phaseLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: DESIGN_COLORS.accentGold,
    letterSpacing: 2,
    marginBottom: 4,
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

  // Overall Card
  overallCard: {
    backgroundColor: DESIGN_COLORS.bgElevated,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.accentGold,
  },
  overallHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  overallTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: DESIGN_COLORS.textPrimary,
  },
  overallPercentage: {
    fontSize: 32,
    fontWeight: '700',
    color: DESIGN_COLORS.accentGold,
  },
  progressBarContainer: {
    marginBottom: 16,
  },
  progressBarBackground: {
    height: 12,
    backgroundColor: DESIGN_COLORS.bgPrimary,
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: DESIGN_COLORS.accentGold,
    borderRadius: 6,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: DESIGN_COLORS.textPrimary,
  },
  statLabel: {
    fontSize: 11,
    color: DESIGN_COLORS.textTertiary,
    textTransform: 'uppercase',
    marginTop: 2,
  },

  // Section Headers
  sectionHeader: {
    marginBottom: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: DESIGN_COLORS.textPrimary,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: DESIGN_COLORS.textSecondary,
    marginTop: 4,
  },

  // Phases Container
  phasesContainer: {
    marginBottom: 24,
  },

  // Transformation Card
  transformationCard: {
    backgroundColor: DESIGN_COLORS.bgElevated,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
  },
  transformationRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginBottom: 16,
  },
  transformationColumn: {
    flex: 1,
  },
  transformationLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: DESIGN_COLORS.textTertiary,
    letterSpacing: 1,
    marginBottom: 6,
    textAlign: 'center',
  },
  transformationBox: {
    backgroundColor: DESIGN_COLORS.bgPrimary,
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
  },
  transformationBoxAfter: {
    borderColor: DESIGN_COLORS.accentGold,
  },
  transformationText: {
    fontSize: 13,
    color: DESIGN_COLORS.textSecondary,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  transformationArrow: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowText: {
    fontSize: 24,
    color: DESIGN_COLORS.accentGold,
  },
  lessonContainer: {
    backgroundColor: DESIGN_COLORS.bgPrimary,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  lessonLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: DESIGN_COLORS.accentGold,
    letterSpacing: 0.5,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  lessonText: {
    fontSize: 14,
    color: DESIGN_COLORS.textPrimary,
    lineHeight: 20,
  },
  gratefulContainer: {
    backgroundColor: DESIGN_COLORS.bgPrimary,
    borderRadius: 8,
    padding: 12,
  },
  gratefulLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: DESIGN_COLORS.accentTeal,
    letterSpacing: 0.5,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  gratefulText: {
    fontSize: 14,
    color: DESIGN_COLORS.textPrimary,
    lineHeight: 20,
  },

  // Timeline
  timeline: {
    marginBottom: 24,
  },
  timelineItem: {
    flexDirection: 'row',
  },
  timelineLeft: {
    width: 40,
    alignItems: 'center',
  },
  timelineDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: DESIGN_COLORS.accentPurple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineDotComplete: {
    backgroundColor: DESIGN_COLORS.accentGold,
  },
  timelineDotPending: {
    backgroundColor: DESIGN_COLORS.border,
  },
  timelineCheck: {
    fontSize: 12,
    color: DESIGN_COLORS.bgPrimary,
    fontWeight: '700',
  },
  timelineLine: {
    flex: 1,
    width: 2,
    backgroundColor: DESIGN_COLORS.border,
    marginVertical: 4,
  },
  timelineLineComplete: {
    backgroundColor: DESIGN_COLORS.accentGold,
  },
  timelineContent: {
    flex: 1,
    paddingLeft: 12,
    paddingBottom: 20,
  },
  timelinePhase: {
    fontSize: 10,
    fontWeight: '600',
    color: DESIGN_COLORS.textTertiary,
    textTransform: 'uppercase',
  },
  timelineName: {
    fontSize: 15,
    fontWeight: '600',
    color: DESIGN_COLORS.textPrimary,
    marginTop: 2,
  },
  timelineDesc: {
    fontSize: 12,
    color: DESIGN_COLORS.textSecondary,
    marginTop: 2,
  },

  // Buttons
  exportButton: {
    backgroundColor: DESIGN_COLORS.bgElevated,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
    marginBottom: 12,
  },
  exportButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: DESIGN_COLORS.textSecondary,
  },
  continueButton: {
    backgroundColor: DESIGN_COLORS.accentGold,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: DESIGN_COLORS.accentGold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: DESIGN_COLORS.bgPrimary,
    letterSpacing: 0.5,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },

  bottomSpacer: {
    height: 40,
  },
});

export default JourneyReviewScreen;
