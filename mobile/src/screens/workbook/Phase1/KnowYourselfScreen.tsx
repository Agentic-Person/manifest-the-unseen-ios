/**
 * Know Yourself Screen - Phase 1 Self-Evaluation
 *
 * A guided self-reflection exercise with thoughtful questions
 * to help users explore their identity, beliefs, and aspirations.
 *
 * Features:
 * - Curated self-reflection questions
 * - Text area responses for each question
 * - Progress through questions
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
};

// Self-reflection questions
const QUESTIONS = [
  {
    id: 'identity',
    category: 'Identity',
    question: 'Who are you at your core, beyond your roles and titles?',
    hint: 'Think about the qualities that define you regardless of your job, relationships, or circumstances.',
    emoji: '🪞',
  },
  {
    id: 'passion',
    category: 'Passion',
    question: 'What activities make you lose track of time?',
    hint: 'Consider moments when you\'re so engaged that hours feel like minutes.',
    emoji: '🔥',
  },
  {
    id: 'childhood',
    category: 'Origins',
    question: 'What did you love doing as a child that you\'ve stopped doing?',
    hint: 'Childhood interests often reveal authentic desires before social conditioning.',
    emoji: '🧒',
  },
  {
    id: 'fear',
    category: 'Fear',
    question: 'What would you do if you knew you couldn\'t fail?',
    hint: 'Remove fear from the equation. What dreams emerge?',
    emoji: '🦁',
  },
  {
    id: 'legacy',
    category: 'Legacy',
    question: 'How do you want to be remembered by those you love?',
    hint: 'Consider the impact you want to have on others.',
    emoji: '⭐',
  },
  {
    id: 'growth',
    category: 'Growth',
    question: 'What mistake taught you the most valuable lesson?',
    hint: 'Reflect on failures that shaped who you are today.',
    emoji: '🌱',
  },
  {
    id: 'values',
    category: 'Values',
    question: 'What principles would you never compromise, even under pressure?',
    hint: 'These are your non-negotiable core values.',
    emoji: '🧭',
  },
  {
    id: 'happiness',
    category: 'Joy',
    question: 'When did you last feel truly at peace with yourself?',
    hint: 'Describe the circumstances and what made that moment special.',
    emoji: '☮️',
  },
] as const;

type QuestionId = (typeof QUESTIONS)[number]['id'];

interface KnowYourselfData {
  responses: Record<QuestionId, string>;
  lastQuestionViewed: number;
  updatedAt: string;
}

const DEFAULT_DATA: KnowYourselfData = {
  responses: {
    identity: '',
    passion: '',
    childhood: '',
    fear: '',
    legacy: '',
    growth: '',
    values: '',
    happiness: '',
  },
  lastQuestionViewed: 0,
  updatedAt: new Date().toISOString(),
};

type Props = WorkbookStackScreenProps<'KnowYourself'>;

/**
 * Know Yourself Screen Component
 */
const KnowYourselfScreen: React.FC<Props> = ({ navigation }) => {
  const [data, setData] = useState<KnowYourselfData>(DEFAULT_DATA);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  // Load saved data from Supabase
  const { data: savedProgress, isLoading } = useWorkbookProgress(1, WORKSHEET_IDS.KNOW_YOURSELF);

  // Auto-save with debounce
  const { isSaving, isError, lastSaved, saveNow } = useAutoSave({
    data: data as unknown as Record<string, unknown>,
    phaseNumber: 1,
    worksheetId: WORKSHEET_IDS.KNOW_YOURSELF,
    debounceMs: 2000,
  });

  // Load saved data into state when fetched
  useEffect(() => {
    if (savedProgress?.data) {
      const savedData = savedProgress.data as unknown as KnowYourselfData;
      setData(savedData);
      setCurrentQuestion(savedData.lastQuestionViewed || 0);
    }
  }, [savedProgress]);

  /**
   * Update response for a question
   */
  const handleResponseChange = useCallback((questionId: QuestionId, text: string) => {
    setData((prev) => ({
      ...prev,
      responses: {
        ...prev.responses,
        [questionId]: text,
      },
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  /**
   * Navigate to next question
   */
  const handleNextQuestion = useCallback(() => {
    if (currentQuestion < QUESTIONS.length - 1) {
      const next = currentQuestion + 1;
      setCurrentQuestion(next);
      setData((prev) => ({
        ...prev,
        lastQuestionViewed: next,
        updatedAt: new Date().toISOString(),
      }));
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [currentQuestion]);

  /**
   * Navigate to previous question
   */
  const handlePreviousQuestion = useCallback(() => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [currentQuestion]);

  /**
   * Calculate completion stats
   */
  const getStats = () => {
    const answered = Object.values(data.responses).filter((r) => r.trim().length > 0).length;
    return {
      answered,
      total: QUESTIONS.length,
      percentage: Math.round((answered / QUESTIONS.length) * 100),
    };
  };

  /**
   * Handle save and continue
   */
  const handleSaveAndContinue = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    saveNow({ completed: true });
    navigation.goBack();
  };

  const stats = getStats();
  const question = QUESTIONS[currentQuestion];

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
        image={Phase1ExerciseImages.knowYourself}
        title="Know Yourself"
        subtitle="Deep self-reflection is the doorway to understanding who you truly are."
        progress={savedProgress?.progress || 0}
      />

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Progress</Text>
          <Text style={styles.progressCount}>
            {stats.answered}/{stats.total} answered
          </Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${stats.percentage}%` }]} />
        </View>
        <View style={styles.questionDots}>
          {QUESTIONS.map((q, index) => (
            <Pressable
              key={q.id}
              style={[
                styles.questionDot,
                index === currentQuestion && styles.questionDotActive,
                data.responses[q.id as QuestionId]?.trim() && styles.questionDotAnswered,
              ]}
              onPress={() => {
                setCurrentQuestion(index);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            />
          ))}
        </View>
      </View>

      {/* Question Card */}
      <View style={styles.questionCard}>
        <View style={styles.questionHeader}>
          <View style={styles.questionBadge}>
            <Text style={styles.questionEmoji}>{question.emoji}</Text>
          </View>
          <View style={styles.questionMeta}>
            <Text style={styles.questionCategory}>{question.category}</Text>
            <Text style={styles.questionNumber}>
              Question {currentQuestion + 1} of {QUESTIONS.length}
            </Text>
          </View>
        </View>

        <Text style={styles.questionText}>{question.question}</Text>
        <Text style={styles.questionHint}>{question.hint}</Text>

        <TextInput
          style={styles.responseInput}
          value={data.responses[question.id as QuestionId]}
          onChangeText={(text) => handleResponseChange(question.id as QuestionId, text)}
          placeholder="Take your time to reflect and write your thoughts..."
          placeholderTextColor={DESIGN_COLORS.textTertiary}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
        />

        {/* Navigation Buttons */}
        <View style={styles.navButtons}>
          <Pressable
            style={[
              styles.navButton,
              currentQuestion === 0 && styles.navButtonDisabled,
            ]}
            onPress={handlePreviousQuestion}
            disabled={currentQuestion === 0}
          >
            <Text style={[
              styles.navButtonText,
              currentQuestion === 0 && styles.navButtonTextDisabled,
            ]}>
              ← Previous
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.navButton,
              styles.navButtonNext,
              currentQuestion === QUESTIONS.length - 1 && styles.navButtonDisabled,
            ]}
            onPress={handleNextQuestion}
            disabled={currentQuestion === QUESTIONS.length - 1}
          >
            <Text style={[
              styles.navButtonText,
              currentQuestion === QUESTIONS.length - 1 && styles.navButtonTextDisabled,
            ]}>
              Next →
            </Text>
          </Pressable>
        </View>
      </View>

      {/* All Questions Preview */}
      <View style={styles.allQuestionsSection}>
        <Text style={styles.sectionTitle}>All Questions</Text>
        {QUESTIONS.map((q, index) => {
          const isAnswered = !!data.responses[q.id as QuestionId]?.trim();
          const isCurrent = index === currentQuestion;

          return (
            <Pressable
              key={q.id}
              style={[
                styles.questionPreviewCard,
                isCurrent && styles.questionPreviewCardActive,
              ]}
              onPress={() => {
                setCurrentQuestion(index);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <Text style={styles.questionPreviewEmoji}>{q.emoji}</Text>
              <View style={styles.questionPreviewText}>
                <Text style={styles.questionPreviewCategory}>{q.category}</Text>
                <Text style={styles.questionPreviewQuestion} numberOfLines={1}>
                  {q.question}
                </Text>
              </View>
              <View style={[
                styles.questionPreviewStatus,
                isAnswered && styles.questionPreviewStatusAnswered,
              ]}>
                <Text style={styles.questionPreviewStatusText}>
                  {isAnswered ? '✓' : '○'}
                </Text>
              </View>
            </Pressable>
          );
        })}
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
  progressContainer: {
    backgroundColor: DESIGN_COLORS.bgSecondary,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: DESIGN_COLORS.textSecondary,
  },
  progressCount: {
    fontSize: 14,
    fontWeight: '600',
    color: DESIGN_COLORS.accentGold,
  },
  progressBar: {
    height: 8,
    backgroundColor: DESIGN_COLORS.bgElevated,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: DESIGN_COLORS.accentGold,
    borderRadius: 4,
  },
  questionDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  questionDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: DESIGN_COLORS.bgElevated,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
  },
  questionDotActive: {
    borderColor: DESIGN_COLORS.accentGold,
    borderWidth: 2,
  },
  questionDotAnswered: {
    backgroundColor: DESIGN_COLORS.accentGreen,
    borderColor: DESIGN_COLORS.accentGreen,
  },
  questionCard: {
    backgroundColor: DESIGN_COLORS.bgSecondary,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.accentPurple,
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  questionBadge: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: DESIGN_COLORS.bgElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  questionEmoji: {
    fontSize: 24,
  },
  questionMeta: {
    flex: 1,
  },
  questionCategory: {
    fontSize: 14,
    fontWeight: '700',
    color: DESIGN_COLORS.accentGold,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  questionNumber: {
    fontSize: 12,
    color: DESIGN_COLORS.textTertiary,
    marginTop: 2,
  },
  questionText: {
    fontSize: 20,
    fontWeight: '600',
    color: DESIGN_COLORS.textPrimary,
    lineHeight: 28,
    marginBottom: 8,
  },
  questionHint: {
    fontSize: 14,
    color: DESIGN_COLORS.textSecondary,
    fontStyle: 'italic',
    marginBottom: 16,
    lineHeight: 20,
  },
  responseInput: {
    backgroundColor: DESIGN_COLORS.bgElevated,
    borderRadius: 12,
    padding: 16,
    color: DESIGN_COLORS.textPrimary,
    fontSize: 15,
    lineHeight: 24,
    minHeight: 140,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
    marginBottom: 16,
  },
  navButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  navButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: DESIGN_COLORS.bgElevated,
  },
  navButtonNext: {
    backgroundColor: DESIGN_COLORS.accentPurple,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: DESIGN_COLORS.textPrimary,
  },
  navButtonTextDisabled: {
    color: DESIGN_COLORS.textTertiary,
  },
  allQuestionsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: DESIGN_COLORS.textPrimary,
    marginBottom: 12,
  },
  questionPreviewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DESIGN_COLORS.bgSecondary,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
  },
  questionPreviewCardActive: {
    borderColor: DESIGN_COLORS.accentGold,
  },
  questionPreviewEmoji: {
    fontSize: 20,
    marginRight: 12,
  },
  questionPreviewText: {
    flex: 1,
  },
  questionPreviewCategory: {
    fontSize: 11,
    fontWeight: '700',
    color: DESIGN_COLORS.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  questionPreviewQuestion: {
    fontSize: 13,
    color: DESIGN_COLORS.textPrimary,
    marginTop: 2,
  },
  questionPreviewStatus: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: DESIGN_COLORS.bgElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  questionPreviewStatusAnswered: {
    backgroundColor: DESIGN_COLORS.accentGreen,
  },
  questionPreviewStatusText: {
    fontSize: 12,
    color: DESIGN_COLORS.textPrimary,
    fontWeight: '600',
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

export default KnowYourselfScreen;
