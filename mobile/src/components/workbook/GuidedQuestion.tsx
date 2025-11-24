/**
 * GuidedQuestion Component
 *
 * A beautifully styled question card for the Purpose Statement questionnaire.
 * Displays one reflective question at a time with a text input for the user's answer.
 *
 * Design follows APP-DESIGN.md specifications:
 * - Dark spiritual theme with muted jewel tones
 * - Large, elegant typography for questions
 * - Inspirational quotes in italic
 * - Smooth, calming transitions
 *
 * @example
 * ```tsx
 * <GuidedQuestion
 *   question={{
 *     id: 'q1',
 *     question: 'What activities make you lose track of time?',
 *     placeholder: 'Describe the activities that absorb you completely...',
 *     inspirationalQuote: '"Time flies when you are aligned with your purpose."'
 *   }}
 *   value={answers.q1}
 *   onChangeText={(text) => setAnswer('q1', text)}
 * />
 * ```
 */

import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
} from 'react-native';
import { Text } from '../Text';
import { colors, spacing, borderRadius, typography, fontWeights } from '../../theme';

/**
 * Interface for a guided question
 */
export interface GuidedQuestionData {
  /** Unique identifier for the question */
  id: string;
  /** The reflective question text */
  question: string;
  /** Placeholder text for the input */
  placeholder: string;
  /** Optional inspirational quote to display */
  inspirationalQuote?: string;
}

/**
 * Props for the GuidedQuestion component
 */
export interface GuidedQuestionProps {
  /** The question data to display */
  question: GuidedQuestionData;
  /** Current answer value */
  value: string;
  /** Callback when answer changes */
  onChangeText: (text: string) => void;
  /** Test ID for automation */
  testID?: string;
}

/**
 * GuidedQuestion Component
 */
export const GuidedQuestion: React.FC<GuidedQuestionProps> = ({
  question,
  value,
  onChangeText,
  testID,
}) => {
  return (
    <View style={styles.container} testID={testID}>
      {/* Inspirational Quote */}
      {question.inspirationalQuote && (
        <View style={styles.quoteContainer}>
          <Text style={styles.quoteText}>{question.inspirationalQuote}</Text>
        </View>
      )}

      {/* Main Question */}
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{question.question}</Text>
      </View>

      {/* Answer Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={question.placeholder}
          placeholderTextColor={colors.dark.textTertiary}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
          accessibilityLabel={question.question}
          accessibilityHint="Enter your answer to this reflective question"
          testID={`${testID}-input`}
        />
      </View>

      {/* Decorative Element */}
      <View style={styles.decorativeContainer}>
        <View style={styles.decorativeLine} />
        <View style={styles.decorativeDot} />
        <View style={styles.decorativeLine} />
      </View>
    </View>
  );
};

/**
 * Styles following APP-DESIGN.md dark spiritual theme
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },

  quoteContainer: {
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.md,
  },

  quoteText: {
    ...typography.body,
    fontSize: 15,
    fontStyle: 'italic',
    color: colors.dark.accentGold,
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.9,
  },

  questionContainer: {
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.sm,
  },

  questionText: {
    ...typography.h2,
    fontSize: 24,
    fontWeight: fontWeights.semibold as any,
    color: colors.dark.textPrimary,
    textAlign: 'center',
    lineHeight: 34,
    letterSpacing: 0.3,
  },

  inputContainer: {
    backgroundColor: colors.dark.bgElevated,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(74, 26, 107, 0.3)',
    shadowColor: colors.dark.accentPurple,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: spacing.xl,
  },

  input: {
    ...typography.body,
    color: colors.dark.textPrimary,
    padding: spacing.lg,
    minHeight: 160,
    fontSize: 16,
    lineHeight: 26,
  },

  decorativeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
    opacity: 0.4,
  },

  decorativeLine: {
    width: 40,
    height: 1,
    backgroundColor: colors.dark.accentGold,
  },

  decorativeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.dark.accentGold,
    marginHorizontal: spacing.sm,
  },
});

export default GuidedQuestion;
