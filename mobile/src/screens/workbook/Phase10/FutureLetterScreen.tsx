/**
 * FutureLetterScreen
 *
 * Phase 10: Trust & Letting Go - Letter to Future Self
 * Write a letter to your future self (1 year from now).
 *
 * Features:
 * - Write a letter with guided prompts
 * - Date stamp with "Open on" date
 * - "Seal" the letter (lock until date)
 * - Beautiful envelope/letter visual
 * - Option to schedule email reminder (placeholder)
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
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import type { WorkbookStackScreenProps } from '../../../types/navigation';
import { SealedLetter } from '../../../components/workbook/SealedLetter';
import { SaveIndicator } from '../../../components/workbook';
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

// Guided prompts for letter writing
const WRITING_PROMPTS = [
  {
    id: 'achievements',
    title: 'What have you achieved?',
    placeholder: 'By now, I have accomplished...',
    hint: 'Describe the goals you\'ve reached, both big and small.',
  },
  {
    id: 'feelings',
    title: 'How do you feel?',
    placeholder: 'I feel...',
    hint: 'Express the emotions and state of being you imagine.',
  },
  {
    id: 'gratitude',
    title: 'What are you grateful for?',
    placeholder: 'I\'m grateful for...',
    hint: 'List the blessings and growth you\'ve experienced.',
  },
  {
    id: 'wisdom',
    title: 'What wisdom do you have?',
    placeholder: 'Remember this...',
    hint: 'What advice would you give to your past self reading this?',
  },
];

// Letter data interface
interface FutureLetter {
  id: string;
  content: string;
  createdAt: Date;
  openDate: Date;
  isSealed: boolean;
  reminderEmail?: string;
}

type Props = WorkbookStackScreenProps<'FutureLetter'>;

// Data type for persistence
interface FutureLetterData {
  letterContent: string;
  promptResponses: Record<string, string>;
  existingLetter: FutureLetter | null;
}

const PHASE_NUMBER = 10;

/**
 * FutureLetterScreen Component
 */
const FutureLetterScreen: React.FC<Props> = ({ navigation }) => {
  // Supabase data fetching
  const { data: savedProgress, isLoading, isError: isLoadError, error: loadError } = useWorkbookProgress(
    PHASE_NUMBER,
    WORKSHEET_IDS.FUTURE_LETTER
  );

  const [existingLetter, setExistingLetter] = useState<FutureLetter | null>(null);
  const [letterContent, setLetterContent] = useState('');
  const [promptResponses, setPromptResponses] = useState<Record<string, string>>({});
  const [showPrompts, setShowPrompts] = useState(true);

  // Calculate open date (1 year from now)
  const openDate = new Date();
  openDate.setFullYear(openDate.getFullYear() + 1);

  // Auto-save hook
  const formData: FutureLetterData = useMemo(() => ({
    letterContent,
    promptResponses,
    existingLetter
  }), [letterContent, promptResponses, existingLetter]);

  const { isSaving, lastSaved, saveNow } = useAutoSave({
    data: formData as unknown as Record<string, unknown>,
    phaseNumber: PHASE_NUMBER,
    worksheetId: WORKSHEET_IDS.FUTURE_LETTER,
    debounceMs: 1500,
  });

  // Load saved data
  useEffect(() => {
    // Error state
    if (isLoadError) {
      console.error('[FutureLetterScreen] Failed to load progress:', loadError);
      // Continue with default data instead of blocking the UI
    }

    if (savedProgress?.data) {
      const data = savedProgress.data as unknown as FutureLetterData;
      if (data.letterContent) {
        setLetterContent(data.letterContent);
      }
      if (data.promptResponses) {
        setPromptResponses(data.promptResponses);
      }
      if (data.existingLetter) {
        setExistingLetter(data.existingLetter);
      }
    }
  }, [savedProgress, isError, error]);

  /**
   * Handle content change
   */
  const handleContentChange = (text: string) => {
    setLetterContent(text);
  };

  /**
   * Handle prompt response change
   */
  const handlePromptChange = (promptId: string, text: string) => {
    setPromptResponses((prev) => ({
      ...prev,
      [promptId]: text,
    }));
  };

  /**
   * Compile prompts into full letter
   */
  const compileLetterFromPrompts = (): string => {
    const parts: string[] = [];

    WRITING_PROMPTS.forEach((prompt) => {
      const response = promptResponses[prompt.id];
      if (response?.trim()) {
        parts.push(response.trim());
      }
    });

    return parts.join('\n\n');
  };

  /**
   * Toggle between prompts and free-form
   */
  const handleToggleMode = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (showPrompts) {
      // Switching to free-form - compile prompts
      const compiled = compileLetterFromPrompts();
      if (compiled) {
        setLetterContent(compiled);
      }
    }

    setShowPrompts(!showPrompts);
  };

  /**
   * Seal the letter
   */
  const handleSealLetter = () => {
    const finalContent = showPrompts ? compileLetterFromPrompts() : letterContent;

    if (!finalContent.trim()) {
      Alert.alert(
        'Empty Letter',
        'Please write something before sealing your letter.',
        [{ text: 'OK' }]
      );
      return;
    }

    Alert.alert(
      'Seal Your Letter',
      `Your letter will be sealed until ${openDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}. You won't be able to edit it after sealing.\n\nAre you ready to seal this message to your future self?`,
      [
        { text: 'Not Yet', style: 'cancel' },
        {
          text: 'Seal Letter',
          style: 'destructive',
          onPress: async () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

            const newLetter: FutureLetter = {
              id: Date.now().toString(),
              content: finalContent,
              createdAt: new Date(),
              openDate,
              isSealed: true,
            };

            setExistingLetter(newLetter);
            saveNow();
          },
        },
      ]
    );
  };

  /**
   * Handle opening sealed letter
   */
  const handleOpenLetter = () => {
    if (!existingLetter) return;

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setExistingLetter({
      ...existingLetter,
      isSealed: false,
    });
  };

  /**
   * Set up email reminder (placeholder)
   */
  const handleSetReminder = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'Email Reminder',
      'This feature will send you an email when your letter is ready to open. Coming soon!',
      [{ text: 'OK' }]
    );
  };

  /**
   * Continue to graduation
   */
  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate('Graduation');
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={50} color={DESIGN_COLORS.accentGold} />
        <Text style={styles.loadingText}>Loading your letter...</Text>
      </View>
    );
  }

  // Show sealed letter view if exists
  if (existingLetter) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.phaseLabel}>PHASE 10</Text>
          <Text style={styles.title}>Letter to Future Self</Text>
          <Text style={styles.subtitle}>
            {existingLetter.isSealed
              ? 'Your letter is safely sealed, waiting for the perfect moment.'
              : 'Your letter has arrived. Read the message from your past self.'}
          </Text>
        </View>

        <SealedLetter
          isSealed={existingLetter.isSealed}
          openDate={existingLetter.openDate}
          letterContent={existingLetter.content}
          createdDate={existingLetter.createdAt}
          onOpen={handleOpenLetter}
        />

        {existingLetter.isSealed && (
          <Pressable
            style={({ pressed }) => [
              styles.reminderButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleSetReminder}
            accessibilityRole="button"
            accessibilityLabel="Set email reminder"
          >
            <Text style={styles.reminderButtonText}>Set Email Reminder</Text>
          </Pressable>
        )}

        <Pressable
          style={({ pressed }) => [
            styles.continueButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleContinue}
          accessibilityRole="button"
          accessibilityLabel="Continue to graduation"
        >
          <Text style={styles.continueButtonText}>Continue to Graduation</Text>
        </Pressable>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    );
  }

  // Show letter writing view
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.phaseLabel}>PHASE 10</Text>
          <Text style={styles.title}>Letter to Future Self</Text>
          <Text style={styles.subtitle}>
            Write a letter to yourself, one year from today. Express your hopes,
            dreams, and the person you're becoming.
          </Text>
        </View>

        {/* Open Date Display */}
        <View style={styles.openDateCard}>
          <Text style={styles.openDateLabel}>Your letter will open on</Text>
          <Text style={styles.openDateText}>
            {openDate.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
          <Text style={styles.openDateHint}>365 days of transformation</Text>
        </View>

        {/* Mode Toggle */}
        <View style={styles.modeToggle}>
          <Pressable
            style={[styles.modeButton, showPrompts && styles.modeButtonActive]}
            onPress={() => !showPrompts && handleToggleMode()}
            accessibilityRole="button"
            accessibilityLabel="Guided prompts mode"
          >
            <Text style={[styles.modeButtonText, showPrompts && styles.modeButtonTextActive]}>
              Guided Prompts
            </Text>
          </Pressable>
          <Pressable
            style={[styles.modeButton, !showPrompts && styles.modeButtonActive]}
            onPress={() => showPrompts && handleToggleMode()}
            accessibilityRole="button"
            accessibilityLabel="Free writing mode"
          >
            <Text style={[styles.modeButtonText, !showPrompts && styles.modeButtonTextActive]}>
              Free Writing
            </Text>
          </Pressable>
        </View>

        {/* Writing Area */}
        {showPrompts ? (
          <View style={styles.promptsContainer}>
            <Text style={styles.promptsIntro}>Dear Future Self,</Text>

            {WRITING_PROMPTS.map((prompt) => (
              <View key={prompt.id} style={styles.promptCard}>
                <Text style={styles.promptTitle}>{prompt.title}</Text>
                <Text style={styles.promptHint}>{prompt.hint}</Text>
                <TextInput
                  style={styles.promptInput}
                  placeholder={prompt.placeholder}
                  placeholderTextColor={DESIGN_COLORS.textTertiary}
                  value={promptResponses[prompt.id] || ''}
                  onChangeText={(text) => handlePromptChange(prompt.id, text)}
                  multiline
                  textAlignVertical="top"
                  accessibilityLabel={prompt.title}
                />
              </View>
            ))}

            <Text style={styles.promptsOutro}>With love, your past self</Text>
          </View>
        ) : (
          <View style={styles.freeWriteContainer}>
            <View style={styles.letterPaper}>
              <Text style={styles.letterDate}>
                {new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
              <Text style={styles.letterSalutation}>Dear Future Self,</Text>
              <TextInput
                style={styles.letterInput}
                placeholder="Write your letter here. What do you hope to achieve? How do you want to feel? What wisdom do you want to remember?"
                placeholderTextColor={DESIGN_COLORS.textTertiary}
                value={letterContent}
                onChangeText={handleContentChange}
                multiline
                textAlignVertical="top"
                accessibilityLabel="Letter to future self"
              />
              <Text style={styles.letterSignature}>With love, your past self</Text>
            </View>
          </View>
        )}

        {/* Save Status */}
        <View style={styles.saveStatusContainer}>
          <SaveIndicator isSaving={isSaving} lastSaved={lastSaved} isError={false} onRetry={saveNow} />
        </View>

        {/* Seal Button */}
        <Pressable
          style={({ pressed }) => [
            styles.sealButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleSealLetter}
          accessibilityRole="button"
          accessibilityLabel="Seal letter"
        >
          <Text style={styles.sealButtonIcon}>{'\u2709'}</Text>
          <Text style={styles.sealButtonText}>Seal My Letter</Text>
        </Pressable>

        <Text style={styles.sealWarning}>
          Once sealed, your letter cannot be edited until the open date.
        </Text>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </KeyboardAvoidingView>
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

  // Open Date Card
  openDateCard: {
    backgroundColor: DESIGN_COLORS.bgElevated,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.accentGold,
  },
  openDateLabel: {
    fontSize: 12,
    color: DESIGN_COLORS.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  openDateText: {
    fontSize: 18,
    fontWeight: '700',
    color: DESIGN_COLORS.accentGold,
    textAlign: 'center',
  },
  openDateHint: {
    fontSize: 12,
    color: DESIGN_COLORS.textSecondary,
    marginTop: 8,
    fontStyle: 'italic',
  },

  // Mode Toggle
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: DESIGN_COLORS.bgElevated,
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  modeButtonActive: {
    backgroundColor: DESIGN_COLORS.accentPurple,
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: DESIGN_COLORS.textSecondary,
  },
  modeButtonTextActive: {
    color: DESIGN_COLORS.textPrimary,
  },

  // Prompts
  promptsContainer: {
    marginBottom: 24,
  },
  promptsIntro: {
    fontSize: 18,
    fontStyle: 'italic',
    color: DESIGN_COLORS.textPrimary,
    marginBottom: 20,
    textAlign: 'center',
  },
  promptCard: {
    backgroundColor: DESIGN_COLORS.bgElevated,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
  },
  promptTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: DESIGN_COLORS.textPrimary,
    marginBottom: 4,
  },
  promptHint: {
    fontSize: 12,
    color: DESIGN_COLORS.textTertiary,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  promptInput: {
    backgroundColor: DESIGN_COLORS.bgPrimary,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: DESIGN_COLORS.textPrimary,
    minHeight: 80,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
  },
  promptsOutro: {
    fontSize: 16,
    fontStyle: 'italic',
    color: DESIGN_COLORS.textPrimary,
    marginTop: 16,
    textAlign: 'right',
  },

  // Free Writing
  freeWriteContainer: {
    marginBottom: 24,
  },
  letterPaper: {
    backgroundColor: '#2a2a3d', // Dark parchment
    borderRadius: 8,
    padding: 20,
    minHeight: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
  },
  letterDate: {
    fontSize: 12,
    color: DESIGN_COLORS.textTertiary,
    marginBottom: 16,
    textAlign: 'right',
  },
  letterSalutation: {
    fontSize: 18,
    fontStyle: 'italic',
    color: DESIGN_COLORS.textPrimary,
    marginBottom: 16,
  },
  letterInput: {
    fontSize: 15,
    color: DESIGN_COLORS.textPrimary,
    lineHeight: 24,
    minHeight: 250,
  },
  letterSignature: {
    fontSize: 16,
    fontStyle: 'italic',
    color: DESIGN_COLORS.textSecondary,
    marginTop: 24,
    textAlign: 'right',
  },

  // Save Status
  saveStatusContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  saveStatus: {
    fontSize: 12,
    color: DESIGN_COLORS.textTertiary,
  },

  // Buttons
  sealButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: DESIGN_COLORS.accentGold,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    shadowColor: DESIGN_COLORS.accentGold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  sealButtonIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  sealButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: DESIGN_COLORS.bgPrimary,
    letterSpacing: 0.5,
  },
  sealWarning: {
    fontSize: 12,
    color: DESIGN_COLORS.textTertiary,
    textAlign: 'center',
    marginTop: 12,
    fontStyle: 'italic',
  },
  reminderButton: {
    backgroundColor: DESIGN_COLORS.bgElevated,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
    marginBottom: 12,
  },
  reminderButtonText: {
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

export default FutureLetterScreen;
