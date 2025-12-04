/**
 * Purpose Statement Screen
 *
 * Phase 2 exercise - A guided questionnaire that helps users discover and
 * articulate their life purpose through 7 reflective questions.
 *
 * Features:
 * - One question per page for focused reflection
 * - Progress indicator showing current position
 * - Statement generation from answers
 * - Editable final statement
 * - Beautiful dark spiritual theme
 *
 * Design follows APP-DESIGN.md specifications:
 * - Background: #1a1a2e (deep charcoal)
 * - Cards: #252547 (elevated surface)
 * - Progress: #c9a227 (muted gold)
 * - Question text: #e8e8e8 (off-white), larger font
 */

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Text } from '../../../components';
import { GuidedQuestion, GuidedQuestionData } from '../../../components/workbook/GuidedQuestion';
import { StatementDisplay } from '../../../components/workbook/StatementDisplay';
import { QuestionProgress } from '../../../components/workbook/QuestionProgress';
import { SaveIndicator, ExerciseHeader } from '../../../components/workbook';
import { colors, spacing, borderRadius, typography, fontWeights } from '../../../theme';
import type { WorkbookStackScreenProps } from '../../../types/navigation';
import { useWorkbookProgress, useSaveWorkbook } from '../../../hooks/useWorkbook';
import { WORKSHEET_IDS } from '../../../types/workbook';
import { Phase2ExerciseImages } from '../../../assets';

/**
 * The 7 guided questions for purpose discovery
 */
const GUIDED_QUESTIONS: GuidedQuestionData[] = [
  {
    id: 'q1',
    question: 'What activities make you lose track of time?',
    placeholder: 'Describe the activities that absorb you completely, where hours feel like minutes...',
    inspirationalQuote: '"The soul becomes dyed with the color of its thoughts." - Marcus Aurelius',
  },
  {
    id: 'q2',
    question: 'What would you do if money was not a concern?',
    placeholder: 'Imagine unlimited resources. What would you dedicate your life to?',
    inspirationalQuote: '"Your work is to discover your work and then give your whole heart to it." - Buddha',
  },
  {
    id: 'q3',
    question: 'What problems do you want to solve in the world?',
    placeholder: 'What issues stir your heart? What change do you wish to see?',
    inspirationalQuote: '"Be the change you wish to see in the world." - Mahatma Gandhi',
  },
  {
    id: 'q4',
    question: 'What are you naturally good at that others appreciate?',
    placeholder: 'What talents come easily to you? What do people often thank you for?',
    inspirationalQuote: '"Your talent is God\'s gift to you. What you do with it is your gift back." - Leo Buscaglia',
  },
  {
    id: 'q5',
    question: 'What legacy do you want to leave behind?',
    placeholder: 'How do you want to be remembered? What impact will outlast you?',
    inspirationalQuote: '"The meaning of life is to find your gift. The purpose is to give it away." - Pablo Picasso',
  },
  {
    id: 'q6',
    question: 'When do you feel most alive and fulfilled?',
    placeholder: 'Describe the moments when you feel complete joy and alignment...',
    inspirationalQuote: '"Life is not about finding yourself. Life is about creating yourself." - George Bernard Shaw',
  },
  {
    id: 'q7',
    question: 'What values are non-negotiable in your life?',
    placeholder: 'What principles guide your decisions? What would you never compromise on?',
    inspirationalQuote: '"When your values are clear to you, making decisions becomes easier." - Roy E. Disney',
  },
];

/**
 * Data schema for purpose statement
 */
interface PurposeStatementData {
  answers: Record<string, string>;
  generatedStatement: string | null;
  finalStatement: string;
  updatedAt: string;
}

type Props = WorkbookStackScreenProps<'ExerciseDetail'>;

/**
 * Generate purpose statement from answers using template
 */
const generateStatement = (answers: Record<string, string>): string => {
  // q1 captures flow activities but is used indirectly through q6 (fulfillment)
  const q3 = answers.q3 || 'make a positive impact';
  const q4 = answers.q4 || 'my unique abilities';
  const q5 = answers.q5 || 'lasting change';
  const q6 = answers.q6 || 'following my passion';
  const q7 = answers.q7 || 'integrity and compassion';

  // Extract key phrases (simplified - take first sentence or phrase)
  const extractEssence = (text: string) => {
    const firstSentence = text.split(/[.!?]/)[0].trim().toLowerCase();
    return firstSentence.length > 60 ? firstSentence.substring(0, 60) + '...' : firstSentence;
  };

  return `My purpose is to ${extractEssence(q3)} by using my natural gift of ${extractEssence(q4)}. ` +
    `I find deep fulfillment when ${extractEssence(q6)}, and I aspire to leave a legacy of ${extractEssence(q5)}. ` +
    `My life is guided by ${extractEssence(q7)}.`;
};

/**
 * Purpose Statement Screen Component
 */
const PurposeStatementScreen: React.FC<Props> = ({ navigation }) => {
  // Fetch saved progress from Supabase
  const { data: savedProgress } = useWorkbookProgress(2, WORKSHEET_IDS.PURPOSE_STATEMENT);
  const { mutate: saveWorkbook, isPending: isSaving } = useSaveWorkbook();
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saveError, setSaveError] = useState(false);

  // Current question index
  const [currentIndex, setCurrentIndex] = useState(0);
  // User answers
  const [answers, setAnswers] = useState<Record<string, string>>({});
  // Whether showing the final statement
  const [showStatement, setShowStatement] = useState(false);
  // Final statement (can be edited)
  const [finalStatement, setFinalStatement] = useState('');
  // Whether statement is in edit mode
  const [isEditingStatement, setIsEditingStatement] = useState(false);

  // Load saved data on mount
  useEffect(() => {
    if (savedProgress?.data) {
      const data = savedProgress.data as unknown as PurposeStatementData;
      if (data.answers) setAnswers(data.answers);
      if (data.finalStatement) setFinalStatement(data.finalStatement);
    }
  }, [savedProgress]);

  const currentQuestion = GUIDED_QUESTIONS[currentIndex];
  const isLastQuestion = currentIndex === GUIDED_QUESTIONS.length - 1;
  const isFirstQuestion = currentIndex === 0;

  /**
   * Get indices of answered questions
   */
  const answeredQuestions = useMemo(() => {
    return GUIDED_QUESTIONS
      .map((q, index) => (answers[q.id]?.trim() ? index : -1))
      .filter((index) => index !== -1);
  }, [answers]);

  /**
   * Handle answer change
   */
  const handleAnswerChange = useCallback((text: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: text,
    }));
  }, [currentQuestion.id]);

  /**
   * Navigate to next question
   */
  const handleNext = useCallback(() => {
    if (isLastQuestion) {
      // Generate statement and show final screen
      const generated = generateStatement(answers);
      setFinalStatement(generated);
      setShowStatement(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      setCurrentIndex((prev) => prev + 1);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [isLastQuestion, answers]);

  /**
   * Navigate to previous question
   */
  const handlePrevious = useCallback(() => {
    if (showStatement) {
      setShowStatement(false);
    } else if (!isFirstQuestion) {
      setCurrentIndex((prev) => prev - 1);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [isFirstQuestion, showStatement]);

  /**
   * Navigate to specific question
   */
  const handleDotPress = useCallback((index: number) => {
    if (index <= currentIndex || answeredQuestions.includes(index - 1) || index === 0) {
      setCurrentIndex(index);
      setShowStatement(false);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [currentIndex, answeredQuestions]);

  /**
   * Toggle statement edit mode
   */
  const handleEditToggle = useCallback(() => {
    setIsEditingStatement((prev) => !prev);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  /**
   * Save the purpose statement
   */
  const handleSave = useCallback(async () => {
    if (!finalStatement.trim()) {
      Alert.alert(
        'Empty Statement',
        'Please complete the questions to generate your purpose statement.',
        [{ text: 'OK' }]
      );
      return;
    }

    setSaveError(false);

    const data: PurposeStatementData = {
      answers,
      generatedStatement: generateStatement(answers),
      finalStatement,
      updatedAt: new Date().toISOString(),
    };

    saveWorkbook(
      {
        phaseNumber: 2,
        worksheetId: WORKSHEET_IDS.PURPOSE_STATEMENT,
        data: data as unknown as Record<string, unknown>,
        completed: true,
      },
      {
        onSuccess: () => {
          setLastSaved(new Date());
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          Alert.alert(
            'Purpose Statement Saved!',
            'Your purpose statement has been saved. Return to it whenever you need guidance.',
            [
              {
                text: 'Continue',
                onPress: () => navigation.goBack(),
              },
            ]
          );
        },
        onError: (error) => {
          console.error('Failed to save purpose statement:', error);
          setSaveError(true);
          Alert.alert(
            'Save Failed',
            'Unable to save your purpose statement. Please try again.',
            [{ text: 'OK' }]
          );
        },
      }
    );
  }, [answers, finalStatement, navigation, saveWorkbook]);

  /**
   * Regenerate the statement
   */
  const handleRegenerate = useCallback(() => {
    const generated = generateStatement(answers);
    setFinalStatement(generated);
    setIsEditingStatement(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, [answers]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        {/* Exercise Header */}
        <ExerciseHeader
          image={Phase2ExerciseImages.lifeMission}
          title="Purpose Statement"
          subtitle={showStatement
            ? 'Your purpose, revealed'
            : 'Discover what drives your soul'}
          progress={savedProgress?.progress || 0}
        />

        {/* Progress Indicator */}
        {!showStatement && (
          <QuestionProgress
            currentIndex={currentIndex}
            totalQuestions={GUIDED_QUESTIONS.length}
            answeredQuestions={answeredQuestions}
            onDotPress={handleDotPress}
            testID="purpose-progress"
          />
        )}

        {/* Save Status Indicator */}
        <SaveIndicator isSaving={isSaving} lastSaved={lastSaved} isError={saveError} onRetry={handleSave} />

        {/* Main Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {showStatement ? (
            <StatementDisplay
              statement={finalStatement}
              isEditing={isEditingStatement}
              onStatementChange={setFinalStatement}
              onEditToggle={handleEditToggle}
              testID="purpose-statement-display"
            />
          ) : (
            <GuidedQuestion
              question={currentQuestion}
              value={answers[currentQuestion.id] || ''}
              onChangeText={handleAnswerChange}
              testID={`question-${currentQuestion.id}`}
            />
          )}
        </ScrollView>

        {/* Navigation Buttons */}
        <View style={styles.buttonContainer}>
          {/* Back Button */}
          <TouchableOpacity
            style={[
              styles.navButton,
              styles.backButton,
              isFirstQuestion && !showStatement && styles.buttonHidden,
            ]}
            onPress={handlePrevious}
            disabled={isFirstQuestion && !showStatement}
            accessibilityRole="button"
            accessibilityLabel="Previous question"
            testID="purpose-back-button"
          >
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>

          {/* Next/Generate/Save Button */}
          {showStatement ? (
            <View style={styles.statementButtons}>
              <TouchableOpacity
                style={[styles.navButton, styles.regenerateButton]}
                onPress={handleRegenerate}
                accessibilityRole="button"
                accessibilityLabel="Regenerate statement"
                testID="purpose-regenerate-button"
              >
                <Text style={styles.regenerateButtonText}>Regenerate</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.navButton, styles.primaryButton]}
                onPress={handleSave}
                disabled={isSaving}
                accessibilityRole="button"
                accessibilityLabel="Save purpose statement"
                testID="purpose-save-button"
              >
                <Text style={styles.primaryButtonText}>
                  {isSaving ? 'Saving...' : 'Save Statement'}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.navButton, styles.primaryButton]}
              onPress={handleNext}
              accessibilityRole="button"
              accessibilityLabel={isLastQuestion ? 'Generate statement' : 'Next question'}
              testID="purpose-next-button"
            >
              <Text style={styles.primaryButtonText}>
                {isLastQuestion ? 'Reveal My Purpose' : 'Continue'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

/**
 * Styles following APP-DESIGN.md dark spiritual theme
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.bgPrimary,
  },

  keyboardAvoid: {
    flex: 1,
  },

  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    alignItems: 'center',
  },

  title: {
    ...typography.h1,
    fontSize: 28,
    fontWeight: fontWeights.bold as any,
    color: colors.dark.textPrimary,
    marginBottom: spacing.xs,
  },

  subtitle: {
    ...typography.body,
    fontSize: 15,
    color: colors.dark.textSecondary,
    fontStyle: 'italic',
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    paddingBottom: spacing.xl,
    backgroundColor: colors.dark.bgPrimary,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },

  navButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    minWidth: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },

  backButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.dark.textTertiary,
  },

  backButtonText: {
    ...typography.body,
    fontSize: 16,
    fontWeight: fontWeights.medium as any,
    color: colors.dark.textSecondary,
  },

  buttonHidden: {
    opacity: 0,
  },

  primaryButton: {
    backgroundColor: colors.dark.accentPurple,
    shadowColor: colors.dark.accentPurple,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },

  primaryButtonText: {
    ...typography.body,
    fontSize: 16,
    fontWeight: fontWeights.semibold as any,
    color: colors.dark.textPrimary,
  },

  statementButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },

  regenerateButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.dark.accentGold,
    minWidth: 100,
  },

  regenerateButtonText: {
    ...typography.body,
    fontSize: 14,
    fontWeight: fontWeights.medium as any,
    color: colors.dark.accentGold,
  },
});

export default PurposeStatementScreen;
