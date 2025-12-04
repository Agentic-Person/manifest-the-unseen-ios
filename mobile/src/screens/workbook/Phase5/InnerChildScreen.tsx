/**
 * InnerChildScreen
 *
 * Phase 5 screen for inner child healing work.
 * Features letter writing to younger self, guided prompts,
 * letter timeline viewing, and gentle nurturing design.
 *
 * Design: Dark spiritual theme with softer, more nurturing colors
 */

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import type { WorkbookStackScreenProps } from '../../../types/navigation';
import { useWorkbookProgress } from '../../../hooks/useWorkbook';
import { useAutoSave } from '../../../hooks/useAutoSave';
import { WORKSHEET_IDS } from '../../../types/workbook';
import { SaveIndicator, ExerciseHeader } from '../../../components/workbook';
import { Phase5ExerciseImages } from '../../../assets';

// Design system colors - softer variant for nurturing feel
const DESIGN_COLORS = {
  bgPrimary: '#1a1a2e',
  bgSecondary: '#16213e',
  bgElevated: '#252547',
  // Softer text colors for inner child work
  textPrimary: '#e8e8e8',
  textSecondary: '#a0a0b0',
  textTertiary: '#6b6b80',
  // Warmer, nurturing accent colors
  accentPurple: '#4a1a6b',
  accentGold: '#c9a227',
  accentTeal: '#1a5f5f',
  accentGreen: '#2d5a4a',
  accentRose: '#8b3a5f',
  accentLavender: '#6b5b8a', // Softer purple
  accentPeach: '#c4846d',    // Warm peach
  border: '#3a3a5a',
  borderSoft: '#2d2d4a',     // Softer border
};

/**
 * Letter data interface
 */
interface InnerChildLetter {
  id: string;
  title: string;
  content: string;
  ageAddressed: number | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Guided prompt data
 */
interface GuidedPrompt {
  id: string;
  title: string;
  prompt: string;
  icon: string;
}

const GUIDED_PROMPTS: GuidedPrompt[] = [
  {
    id: 'comfort',
    title: 'Comfort & Safety',
    prompt: 'Tell your younger self what you wish someone had told you when you felt scared or alone. What comfort would have helped?',
    icon: '\u{1F49C}', // Purple heart
  },
  {
    id: 'validation',
    title: 'Validation',
    prompt: 'Your younger self needs to hear that their feelings mattered. Write about a time you felt unheard, and validate those feelings now.',
    icon: '\u{2728}', // Sparkles
  },
  {
    id: 'apology',
    title: 'Gentle Apology',
    prompt: 'Is there anything you need to apologize to your younger self for? Self-criticism, neglect, or harsh words you\'ve said to yourself?',
    icon: '\u{1F338}', // Cherry blossom
  },
  {
    id: 'protection',
    title: 'Protection',
    prompt: 'What would you protect your younger self from if you could go back? Write about becoming your own guardian.',
    icon: '\u{1F6E1}', // Shield
  },
  {
    id: 'celebration',
    title: 'Celebration',
    prompt: 'Write about something your younger self did that deserves celebration - a strength, a kindness, a moment of bravery.',
    icon: '\u{1F31F}', // Glowing star
  },
  {
    id: 'dreams',
    title: 'Dreams & Wishes',
    prompt: 'What dreams did your younger self have? Which ones have you fulfilled, and which ones still matter to you?',
    icon: '\u{1F308}', // Rainbow
  },
];

/**
 * Generate unique ID
 */
const generateId = (): string => {
  return `letter_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

type Props = WorkbookStackScreenProps<'InnerChild'>;

/**
 * InnerChildScreen Component
 */
/**
 * Interface for form data to save
 */
interface InnerChildFormData {
  letters: InnerChildLetter[];
}

const InnerChildScreen: React.FC<Props> = ({ navigation: _navigation }) => {
  // State
  const [letters, setLetters] = useState<InnerChildLetter[]>([]);
  const [currentLetter, setCurrentLetter] = useState<InnerChildLetter | null>(null);
  const [showPromptsModal, setShowPromptsModal] = useState(false);
  const [showTimelineModal, setShowTimelineModal] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<GuidedPrompt | null>(null);
  const [letterTitle, setLetterTitle] = useState('');
  const [letterContent, setLetterContent] = useState('');
  const [letterAge, setLetterAge] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Animation
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Supabase hooks
  const { data: savedProgress, isLoading, isError: isLoadError, error: loadError } = useWorkbookProgress(5, WORKSHEET_IDS.INNER_CHILD);

  // Prepare form data for auto-save
  const formData: InnerChildFormData = useMemo(() => ({
    letters,
  }), [letters]);

  const { isSaving, lastSaved, saveNow } = useAutoSave({
    data: formData as unknown as Record<string, unknown>,
    phaseNumber: 5,
    worksheetId: WORKSHEET_IDS.INNER_CHILD,
    debounceMs: 2000,
  });

  /**
   * Load saved progress and animate on mount
   */
  useEffect(() => {
    // Error state
    if (isLoadError) {
      console.error('[InnerChildScreen] Failed to load progress:', loadError);
      // Continue with default data instead of blocking the UI
    }

    // Only initialize once when loading completes
    if (isLoading) return;

    if (savedProgress?.data) {
      const data = savedProgress.data as unknown as InnerChildFormData;
      setLetters(data.letters || []);
    }
  }, [savedProgress, isLoading]);

  /**
   * Animation on mount
   */
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  /**
   * Save current letter to letters array
   */
  const saveCurrentLetter = useCallback(() => {
    if (!letterContent.trim()) return;

    const now = new Date().toISOString();
    const age = letterAge ? parseInt(letterAge, 10) : null;

    if (currentLetter) {
      // Update existing letter
      const updated: InnerChildLetter = {
        ...currentLetter,
        title: letterTitle || 'Untitled Letter',
        content: letterContent,
        ageAddressed: age,
        updatedAt: now,
      };
      setLetters((prev) =>
        prev.map((l) => (l.id === updated.id ? updated : l))
      );
      setCurrentLetter(updated);
    } else {
      // Create new letter
      const newLetter: InnerChildLetter = {
        id: generateId(),
        title: letterTitle || 'Untitled Letter',
        content: letterContent,
        ageAddressed: age,
        createdAt: now,
        updatedAt: now,
      };
      setLetters((prev) => [newLetter, ...prev]);
      setCurrentLetter(newLetter);
    }
  }, [letterContent, letterTitle, letterAge, currentLetter]);

  /**
   * Start new letter
   */
  const handleNewLetter = () => {
    if (isEditing && letterContent.trim()) {
      Alert.alert(
        'Save Current Letter?',
        'You have unsaved changes. Would you like to save before starting a new letter?',
        [
          { text: 'Discard', style: 'destructive', onPress: startFreshLetter },
          {
            text: 'Save First',
            onPress: () => {
              saveCurrentLetter();
              startFreshLetter();
            },
          },
        ]
      );
    } else {
      startFreshLetter();
    }
  };

  const startFreshLetter = () => {
    setCurrentLetter(null);
    setLetterTitle('');
    setLetterContent('');
    setLetterAge('');
    setSelectedPrompt(null);
    setIsEditing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  /**
   * Select guided prompt
   */
  const handleSelectPrompt = (prompt: GuidedPrompt) => {
    setSelectedPrompt(prompt);
    setLetterTitle(`Letter: ${prompt.title}`);
    setShowPromptsModal(false);
    setIsEditing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  /**
   * View letter from timeline
   */
  const handleViewLetter = (letter: InnerChildLetter) => {
    setCurrentLetter(letter);
    setLetterTitle(letter.title);
    setLetterContent(letter.content);
    setLetterAge(letter.ageAddressed?.toString() || '');
    setShowTimelineModal(false);
    setIsEditing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  /**
   * Delete letter
   */
  const handleDeleteLetter = (id: string) => {
    Alert.alert(
      'Delete Letter',
      'Are you sure you want to delete this letter? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setLetters((prev) => prev.filter((l) => l.id !== id));
            if (currentLetter?.id === id) {
              startFreshLetter();
            }
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          },
        },
      ]
    );
  };

  /**
   * Save and close editing
   */
  const handleSaveAndClose = () => {
    saveCurrentLetter();
    setIsEditing(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  /**
   * Format date for display
   */
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={50} color={DESIGN_COLORS.accentLavender} />
        <Text style={styles.loadingText}>Preparing a safe space...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      testID="inner-child-screen"
    >
      <Animated.ScrollView
        style={[styles.scrollView, { opacity: fadeAnim }]}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <ExerciseHeader
          image={Phase5ExerciseImages.innerChild}
          title="Inner Child Healing"
          subtitle="A safe space to reconnect with and nurture your younger self. Write letters of love, comfort, and understanding."
          progress={savedProgress?.completed ? 100 : 0}
        />

        {/* Action Buttons */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleNewLetter}
            accessibilityRole="button"
            accessibilityLabel="Start new letter"
            testID="new-letter-button"
          >
            <Text style={styles.actionIcon}>{'\u{270F}'}</Text>
            <Text style={styles.actionText}>New Letter</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setShowPromptsModal(true)}
            accessibilityRole="button"
            accessibilityLabel="View guided prompts"
            testID="prompts-button"
          >
            <Text style={styles.actionIcon}>{'\u{1F4AC}'}</Text>
            <Text style={styles.actionText}>Prompts</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setShowTimelineModal(true)}
            accessibilityRole="button"
            accessibilityLabel="View past letters"
            testID="timeline-button"
          >
            <Text style={styles.actionIcon}>{'\u{1F4DA}'}</Text>
            <Text style={styles.actionText}>Past Letters</Text>
            {letters.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{letters.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Selected Prompt Display */}
        {selectedPrompt && (
          <View style={styles.promptCard}>
            <View style={styles.promptHeader}>
              <Text style={styles.promptIcon}>{selectedPrompt.icon}</Text>
              <Text style={styles.promptTitle}>{selectedPrompt.title}</Text>
            </View>
            <Text style={styles.promptText}>{selectedPrompt.prompt}</Text>
          </View>
        )}

        {/* Letter Editor */}
        {isEditing && (
          <View style={styles.editorContainer}>
            {/* Letter Title */}
            <TextInput
              style={styles.titleInput}
              value={letterTitle}
              onChangeText={setLetterTitle}
              placeholder="Give your letter a title..."
              placeholderTextColor={DESIGN_COLORS.textTertiary}
              maxLength={100}
              accessibilityLabel="Letter title"
              testID="letter-title-input"
            />

            {/* Age Addressed */}
            <View style={styles.ageRow}>
              <Text style={styles.ageLabel}>To my</Text>
              <TextInput
                style={styles.ageInput}
                value={letterAge}
                onChangeText={setLetterAge}
                placeholder="?"
                placeholderTextColor={DESIGN_COLORS.textTertiary}
                keyboardType="number-pad"
                maxLength={2}
                accessibilityLabel="Age addressed"
                testID="letter-age-input"
              />
              <Text style={styles.ageLabel}>year old self</Text>
            </View>

            {/* Letter Content */}
            <View style={styles.letterPaper}>
              <Text style={styles.letterGreeting}>Dear little one,</Text>
              <TextInput
                style={styles.letterInput}
                value={letterContent}
                onChangeText={setLetterContent}
                placeholder="Write your heart here... This is a safe space. Say what you need to say, with all the love and compassion you would give to a child."
                placeholderTextColor={DESIGN_COLORS.textTertiary}
                multiline
                textAlignVertical="top"
                accessibilityLabel="Letter content"
                testID="letter-content-input"
              />
              <Text style={styles.letterClosing}>With love,{'\n'}Your grown-up self</Text>
            </View>

            {/* Save Button */}
            <Pressable
              style={({ pressed }) => [
                styles.saveButton,
                pressed && styles.saveButtonPressed,
              ]}
              onPress={handleSaveAndClose}
              accessibilityRole="button"
              accessibilityLabel="Save letter"
              testID="save-letter-button"
            >
              <Text style={styles.saveButtonText}>Save Letter</Text>
            </Pressable>
          </View>
        )}

        {/* Welcome Message (when not editing) */}
        {!isEditing && letters.length === 0 && (
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeIcon}>{'\u{1F49C}'}</Text>
            <Text style={styles.welcomeTitle}>Welcome to Inner Child Work</Text>
            <Text style={styles.welcomeText}>
              This is a gentle practice of connecting with the younger parts of yourself
              that may still carry old wounds. Through letters of love and understanding,
              you can begin to heal, comfort, and reparent yourself.
            </Text>
            <TouchableOpacity
              style={styles.startButton}
              onPress={() => {
                setIsEditing(true);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              }}
              testID="start-writing-button"
            >
              <Text style={styles.startButtonText}>Begin Writing</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Quick View of Recent Letters (when not editing) */}
        {!isEditing && letters.length > 0 && (
          <View style={styles.recentContainer}>
            <Text style={styles.recentTitle}>Recent Letters</Text>
            {letters.slice(0, 3).map((letter) => (
              <TouchableOpacity
                key={letter.id}
                style={styles.recentLetter}
                onPress={() => handleViewLetter(letter)}
                accessibilityRole="button"
                accessibilityLabel={`View letter: ${letter.title}`}
              >
                <View style={styles.recentLetterHeader}>
                  <Text style={styles.recentLetterTitle} numberOfLines={1}>
                    {letter.title}
                  </Text>
                  <Text style={styles.recentLetterDate}>
                    {formatDate(letter.createdAt)}
                  </Text>
                </View>
                <Text style={styles.recentLetterPreview} numberOfLines={2}>
                  {letter.content}
                </Text>
                {letter.ageAddressed && (
                  <Text style={styles.recentLetterAge}>
                    To {letter.ageAddressed} year old self
                  </Text>
                )}
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={styles.viewAllButton}
              onPress={() => setShowTimelineModal(true)}
            >
              <Text style={styles.viewAllText}>View All Letters</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Save Status */}
        {isEditing && (
          <SaveIndicator isSaving={isSaving} lastSaved={lastSaved} isError={isLoadError} onRetry={saveNow} />
        )}

        <View style={styles.bottomSpacer} />
      </Animated.ScrollView>

      {/* Guided Prompts Modal */}
      <Modal
        visible={showPromptsModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPromptsModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowPromptsModal(false)}
        >
          <Pressable
            style={styles.modalContent}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={styles.modalTitle}>Guided Prompts</Text>
            <Text style={styles.modalSubtitle}>
              Choose a prompt to guide your inner child letter
            </Text>

            <ScrollView style={styles.promptsList} showsVerticalScrollIndicator={false}>
              {GUIDED_PROMPTS.map((prompt) => (
                <TouchableOpacity
                  key={prompt.id}
                  style={styles.promptOption}
                  onPress={() => handleSelectPrompt(prompt)}
                  accessibilityRole="button"
                  accessibilityLabel={prompt.title}
                  testID={`prompt-${prompt.id}`}
                >
                  <Text style={styles.promptOptionIcon}>{prompt.icon}</Text>
                  <View style={styles.promptOptionContent}>
                    <Text style={styles.promptOptionTitle}>{prompt.title}</Text>
                    <Text style={styles.promptOptionText} numberOfLines={2}>
                      {prompt.prompt}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowPromptsModal(false)}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Timeline Modal */}
      <Modal
        visible={showTimelineModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowTimelineModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowTimelineModal(false)}
        >
          <Pressable
            style={styles.modalContent}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={styles.modalTitle}>Your Letters</Text>
            <Text style={styles.modalSubtitle}>
              A timeline of letters to your inner child
            </Text>

            {letters.length === 0 ? (
              <View style={styles.emptyTimeline}>
                <Text style={styles.emptyTimelineIcon}>{'\u{1F4DD}'}</Text>
                <Text style={styles.emptyTimelineText}>
                  No letters yet. Start writing to create your healing journey.
                </Text>
              </View>
            ) : (
              <ScrollView style={styles.timelineList} showsVerticalScrollIndicator={false}>
                {letters.map((letter, index) => (
                  <View key={letter.id} style={styles.timelineItem}>
                    {/* Timeline connector */}
                    {index < letters.length - 1 && (
                      <View style={styles.timelineConnector} />
                    )}
                    <View style={styles.timelineDot} />
                    <TouchableOpacity
                      style={styles.timelineCard}
                      onPress={() => handleViewLetter(letter)}
                      accessibilityRole="button"
                      accessibilityLabel={`View ${letter.title}`}
                    >
                      <View style={styles.timelineCardHeader}>
                        <Text style={styles.timelineDate}>
                          {formatDate(letter.createdAt)}
                        </Text>
                        <TouchableOpacity
                          style={styles.deleteButton}
                          onPress={() => handleDeleteLetter(letter.id)}
                          accessibilityRole="button"
                          accessibilityLabel="Delete letter"
                          testID={`delete-letter-${letter.id}`}
                        >
                          <Text style={styles.deleteButtonText}>{'\u00D7'}</Text>
                        </TouchableOpacity>
                      </View>
                      <Text style={styles.timelineTitle} numberOfLines={1}>
                        {letter.title}
                      </Text>
                      <Text style={styles.timelinePreview} numberOfLines={2}>
                        {letter.content}
                      </Text>
                      {letter.ageAddressed && (
                        <Text style={styles.timelineAge}>
                          {'\u{1F476}'} To {letter.ageAddressed} year old self
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            )}

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowTimelineModal(false)}
            >
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DESIGN_COLORS.bgPrimary,
  },
  scrollView: {
    flex: 1,
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
    fontStyle: 'italic',
  },

  // Header
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

  // Actions
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    backgroundColor: DESIGN_COLORS.bgElevated,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: DESIGN_COLORS.borderSoft,
    position: 'relative',
  },
  actionIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: DESIGN_COLORS.textSecondary,
  },
  badge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: DESIGN_COLORS.accentLavender,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: DESIGN_COLORS.textPrimary,
  },

  // Prompt Card
  promptCard: {
    backgroundColor: 'rgba(107, 91, 138, 0.15)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.accentLavender,
  },
  promptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  promptIcon: {
    fontSize: 24,
  },
  promptTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: DESIGN_COLORS.textPrimary,
  },
  promptText: {
    fontSize: 14,
    color: DESIGN_COLORS.textSecondary,
    lineHeight: 22,
    fontStyle: 'italic',
  },

  // Editor
  editorContainer: {
    marginBottom: 20,
  },
  titleInput: {
    backgroundColor: DESIGN_COLORS.bgElevated,
    borderRadius: 12,
    padding: 14,
    fontSize: 18,
    fontWeight: '600',
    color: DESIGN_COLORS.textPrimary,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.borderSoft,
    marginBottom: 12,
  },
  ageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  ageLabel: {
    fontSize: 15,
    color: DESIGN_COLORS.textSecondary,
  },
  ageInput: {
    backgroundColor: DESIGN_COLORS.bgElevated,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
    fontSize: 16,
    fontWeight: '600',
    color: DESIGN_COLORS.accentPeach,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.borderSoft,
    textAlign: 'center',
    minWidth: 50,
  },

  // Letter paper
  letterPaper: {
    backgroundColor: DESIGN_COLORS.bgElevated,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.borderSoft,
    marginBottom: 16,
  },
  letterGreeting: {
    fontSize: 16,
    fontStyle: 'italic',
    color: DESIGN_COLORS.accentPeach,
    marginBottom: 16,
  },
  letterInput: {
    fontSize: 16,
    color: DESIGN_COLORS.textPrimary,
    lineHeight: 26,
    minHeight: 200,
  },
  letterClosing: {
    fontSize: 15,
    fontStyle: 'italic',
    color: DESIGN_COLORS.accentPeach,
    marginTop: 20,
    textAlign: 'right',
    lineHeight: 24,
  },

  // Save button
  saveButton: {
    backgroundColor: DESIGN_COLORS.accentLavender,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonPressed: {
    opacity: 0.9,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: DESIGN_COLORS.textPrimary,
  },

  // Welcome
  welcomeContainer: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: DESIGN_COLORS.bgElevated,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.borderSoft,
  },
  welcomeIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: DESIGN_COLORS.textPrimary,
    marginBottom: 12,
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: 15,
    color: DESIGN_COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  startButton: {
    backgroundColor: DESIGN_COLORS.accentLavender,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: DESIGN_COLORS.textPrimary,
  },

  // Recent letters
  recentContainer: {
    marginTop: 8,
  },
  recentTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: DESIGN_COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  recentLetter: {
    backgroundColor: DESIGN_COLORS.bgElevated,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.borderSoft,
  },
  recentLetterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  recentLetterTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: DESIGN_COLORS.textPrimary,
    flex: 1,
  },
  recentLetterDate: {
    fontSize: 12,
    color: DESIGN_COLORS.textTertiary,
    marginLeft: 8,
  },
  recentLetterPreview: {
    fontSize: 13,
    color: DESIGN_COLORS.textSecondary,
    lineHeight: 20,
  },
  recentLetterAge: {
    fontSize: 11,
    color: DESIGN_COLORS.accentPeach,
    marginTop: 8,
    fontStyle: 'italic',
  },
  viewAllButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: DESIGN_COLORS.accentLavender,
  },

  bottomSpacer: {
    height: 40,
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: DESIGN_COLORS.bgElevated,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: DESIGN_COLORS.borderSoft,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: DESIGN_COLORS.textPrimary,
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: DESIGN_COLORS.textSecondary,
    marginBottom: 20,
  },
  promptsList: {
    maxHeight: 350,
  },
  promptOption: {
    flexDirection: 'row',
    backgroundColor: DESIGN_COLORS.bgSecondary,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.borderSoft,
  },
  promptOptionIcon: {
    fontSize: 24,
    marginRight: 14,
  },
  promptOptionContent: {
    flex: 1,
  },
  promptOptionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: DESIGN_COLORS.textPrimary,
    marginBottom: 4,
  },
  promptOptionText: {
    fontSize: 13,
    color: DESIGN_COLORS.textSecondary,
    lineHeight: 19,
  },
  modalCloseButton: {
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  modalCloseText: {
    fontSize: 15,
    fontWeight: '600',
    color: DESIGN_COLORS.textSecondary,
  },

  // Timeline
  emptyTimeline: {
    alignItems: 'center',
    padding: 32,
  },
  emptyTimelineIcon: {
    fontSize: 40,
    opacity: 0.5,
    marginBottom: 12,
  },
  emptyTimelineText: {
    fontSize: 14,
    color: DESIGN_COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  timelineList: {
    maxHeight: 350,
  },
  timelineItem: {
    flexDirection: 'row',
    paddingLeft: 20,
    position: 'relative',
  },
  timelineConnector: {
    position: 'absolute',
    left: 6,
    top: 16,
    width: 2,
    height: '100%',
    backgroundColor: DESIGN_COLORS.accentLavender,
    opacity: 0.3,
  },
  timelineDot: {
    position: 'absolute',
    left: 0,
    top: 8,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: DESIGN_COLORS.accentLavender,
  },
  timelineCard: {
    flex: 1,
    backgroundColor: DESIGN_COLORS.bgSecondary,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.borderSoft,
  },
  timelineCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  timelineDate: {
    fontSize: 12,
    color: DESIGN_COLORS.textTertiary,
  },
  deleteButton: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(220, 38, 38, 0.2)',
    borderRadius: 6,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#dc2626',
  },
  timelineTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: DESIGN_COLORS.textPrimary,
    marginBottom: 4,
  },
  timelinePreview: {
    fontSize: 13,
    color: DESIGN_COLORS.textSecondary,
    lineHeight: 19,
  },
  timelineAge: {
    fontSize: 11,
    color: DESIGN_COLORS.accentPeach,
    marginTop: 8,
  },
});

export default InnerChildScreen;
