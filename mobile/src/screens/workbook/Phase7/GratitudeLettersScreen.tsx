/**
 * GratitudeLettersScreen
 *
 * Write gratitude letters to people in your life.
 * Part of Phase 7: Practicing Gratitude.
 *
 * Features:
 * - Write gratitude letters to people
 * - Recipient name input
 * - Rich text letter body
 * - Save as draft or mark as "sent" (symbolic)
 * - View all letters in list
 * - Letter templates: Thank You, Appreciation, Forgiveness
 *
 * Design (from APP-DESIGN.md):
 * - Background: #1a1a2e (deep charcoal)
 * - Elevated surfaces: #252547
 * - Accent gold: #c9a227
 * - Dark spiritual theme
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  TouchableOpacity,
  Modal,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import type { WorkbookStackScreenProps } from '../../../types/navigation';
import { useWorkbookProgress } from '../../../hooks/useWorkbook';
import { useAutoSave } from '../../../hooks/useAutoSave';
import { WORKSHEET_IDS } from '../../../types/workbook';
import { SaveIndicator, ExerciseHeader } from '../../../components/workbook';
import { Phase7ExerciseImages } from '../../../assets';

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
  accentRose: '#8b3a5f',
  border: '#3a3a5a',
  success: '#2d5a4a',
  error: '#dc2626',
};

// Letter Templates
const LETTER_TEMPLATES = {
  thankYou: {
    label: 'Thank You',
    icon: '\uD83D\uDE4F',
    color: DESIGN_COLORS.accentGold,
    prompt: 'Dear [Name],\n\nI want to take a moment to thank you for...\n\n',
    description: 'Express thanks for specific actions or gifts',
  },
  appreciation: {
    label: 'Appreciation',
    icon: '\u2764\uFE0F',
    color: DESIGN_COLORS.accentRose,
    prompt: 'Dear [Name],\n\nI deeply appreciate you for being in my life because...\n\n',
    description: 'Show appreciation for who someone is',
  },
  forgiveness: {
    label: 'Forgiveness',
    icon: '\uD83D\uDD4A\uFE0F',
    color: DESIGN_COLORS.accentTeal,
    prompt: 'Dear [Name],\n\nI have been holding onto some feelings, and I want to let them go...\n\n',
    description: 'Release and forgive (for your own healing)',
  },
} as const;

type TemplateType = keyof typeof LETTER_TEMPLATES;

// Letter Status
type LetterStatus = 'draft' | 'completed' | 'sent';

// Letter Interface
interface GratitudeLetter {
  id: string;
  recipientName: string;
  templateType: TemplateType;
  content: string;
  status: LetterStatus;
  createdAt: string;
  updatedAt: string;
}

// Generate unique ID
const generateId = (): string => {
  return `letter-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

type Props = WorkbookStackScreenProps<'GratitudeLetters'>;

/**
 * GratitudeLettersScreen Component
 */
const GratitudeLettersScreen: React.FC<Props> = ({ navigation: _navigation }) => {
  const [letters, setLetters] = useState<GratitudeLetter[]>([]);
  const [selectedLetter, setSelectedLetter] = useState<GratitudeLetter | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  // Editor state
  const [editRecipient, setEditRecipient] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editTemplate, setEditTemplate] = useState<TemplateType>('thankYou');

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Supabase integration hooks
  const { data: savedProgress, isLoading, isError: isLoadError, error: loadError } = useWorkbookProgress(7, WORKSHEET_IDS.GRATITUDE_LETTERS);

  const { isSaving, lastSaved, saveNow } = useAutoSave({
    data: letters as unknown as Record<string, unknown>,
    phaseNumber: 7,
    worksheetId: WORKSHEET_IDS.GRATITUDE_LETTERS,
    debounceMs: 1500,
  });

  /**
   * Load saved data from Supabase
   */
  useEffect(() => {
    // Error state
    if (isLoadError) {
      console.error('[GratitudeLettersScreen] Failed to load progress:', loadError);
      // Continue with default data instead of blocking the UI
    }

    // Only initialize once when loading completes
    if (isLoading) return;

    if (savedProgress?.data) {
      setLetters(savedProgress.data as unknown as GratitudeLetter[]);
    }
  }, [savedProgress, isLoading]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  /**
   * Start new letter
   */
  const handleStartNewLetter = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowTemplateModal(true);
  };

  /**
   * Select template and start editing
   */
  const handleSelectTemplate = (templateType: TemplateType) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setEditTemplate(templateType);
    setEditRecipient('');
    setEditContent(LETTER_TEMPLATES[templateType].prompt);
    setSelectedLetter(null);
    setShowTemplateModal(false);
    setShowEditor(true);
  };

  /**
   * Open existing letter
   */
  const handleOpenLetter = (letter: GratitudeLetter) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedLetter(letter);
    setEditRecipient(letter.recipientName);
    setEditContent(letter.content);
    setEditTemplate(letter.templateType);
    setShowEditor(true);
  };

  /**
   * Save current letter
   */
  const handleSaveLetter = async (status: LetterStatus = 'draft') => {
    if (!editRecipient.trim()) {
      Alert.alert('Missing Recipient', 'Please enter the name of the person you\'re writing to.');
      return;
    }

    if (!editContent.trim()) {
      Alert.alert('Empty Letter', 'Please write something in your letter.');
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    const letter: GratitudeLetter = {
      id: selectedLetter?.id || generateId(),
      recipientName: editRecipient.trim(),
      templateType: editTemplate,
      content: editContent.trim(),
      status,
      createdAt: selectedLetter?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Update local state
    setLetters((prev) => {
      const existing = prev.findIndex((l) => l.id === letter.id);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = letter;
        return updated;
      }
      return [letter, ...prev];
    });

    await saveNow();
    setShowEditor(false);
  };

  /**
   * Mark letter as sent (symbolic)
   */
  const handleMarkAsSent = () => {
    Alert.alert(
      'Mark as Sent',
      'This is a symbolic action to acknowledge you\'ve shared your gratitude. Have you sent or shared this letter?',
      [
        { text: 'Not Yet', style: 'cancel' },
        {
          text: 'Yes, I\'ve Shared It',
          onPress: () => handleSaveLetter('sent'),
        },
      ]
    );
  };

  /**
   * Delete letter
   */
  const handleDeleteLetter = (letter: GratitudeLetter) => {
    Alert.alert(
      'Delete Letter',
      `Are you sure you want to delete your letter to ${letter.recipientName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            setLetters((prev) => prev.filter((l) => l.id !== letter.id));
            await saveNow();
          },
        },
      ]
    );
  };

  /**
   * Get status badge style
   */
  const getStatusBadge = (status: LetterStatus) => {
    switch (status) {
      case 'sent':
        return { bg: DESIGN_COLORS.accentGreen, text: 'Sent', icon: '\u2713' };
      case 'completed':
        return { bg: DESIGN_COLORS.accentGold, text: 'Completed', icon: '\u2605' };
      default:
        return { bg: DESIGN_COLORS.bgPrimary, text: 'Draft', icon: '\u270D' };
    }
  };

  /**
   * Render letter item
   */
  const renderLetterItem = ({ item }: { item: GratitudeLetter }) => {
    const template = LETTER_TEMPLATES[item.templateType];
    const statusBadge = getStatusBadge(item.status);
    const updatedDate = new Date(item.updatedAt).toLocaleDateString();

    return (
      <Pressable
        style={styles.letterCard}
        onPress={() => handleOpenLetter(item)}
        accessibilityRole="button"
        accessibilityLabel={`Letter to ${item.recipientName}, ${statusBadge.text}`}
      >
        <View style={styles.letterHeader}>
          <View style={[styles.templateIcon, { backgroundColor: template.color }]}>
            <Text style={styles.templateIconText}>{template.icon}</Text>
          </View>
          <View style={styles.letterInfo}>
            <Text style={styles.letterRecipient}>To: {item.recipientName}</Text>
            <Text style={styles.letterType}>{template.label}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusBadge.bg }]}>
            <Text style={styles.statusText}>{statusBadge.icon} {statusBadge.text}</Text>
          </View>
        </View>
        <Text style={styles.letterPreview} numberOfLines={2}>
          {item.content.replace(/^Dear \[Name\],\n\n/, '').substring(0, 100)}...
        </Text>
        <View style={styles.letterFooter}>
          <Text style={styles.letterDate}>Updated: {updatedDate}</Text>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteLetter(item)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityRole="button"
            accessibilityLabel={`Delete letter to ${item.recipientName}`}
          >
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={50} color={DESIGN_COLORS.accentGold} />
        <Text style={styles.loadingText}>Loading your letters...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <ExerciseHeader
          image={Phase7ExerciseImages.gratitudeLetters}
          title="Gratitude Letters"
          subtitle="Write heartfelt letters to express gratitude to important people"
          progress={savedProgress?.progress || 0}
        />

        {/* Stats Summary */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{letters.length}</Text>
            <Text style={styles.statLabel}>Total Letters</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {letters.filter((l) => l.status === 'sent').length}
            </Text>
            <Text style={styles.statLabel}>Shared</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {letters.filter((l) => l.status === 'draft').length}
            </Text>
            <Text style={styles.statLabel}>Drafts</Text>
          </View>
        </View>

        {/* New Letter Button */}
        <Pressable
          style={styles.newLetterButton}
          onPress={handleStartNewLetter}
          accessibilityRole="button"
          accessibilityLabel="Write new gratitude letter"
        >
          <Text style={styles.newLetterIcon}>{'\u270D'}</Text>
          <Text style={styles.newLetterText}>Write New Letter</Text>
        </Pressable>

        {/* Letters List */}
        {letters.length > 0 ? (
          <View style={styles.lettersSection}>
            <Text style={styles.sectionTitle}>Your Letters</Text>
            {letters.map((letter) => (
              <View key={letter.id}>
                {renderLetterItem({ item: letter })}
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>{'\uD83D\uDCDD'}</Text>
            <Text style={styles.emptyTitle}>No Letters Yet</Text>
            <Text style={styles.emptyText}>
              Start your gratitude practice by writing a letter to someone special.
              It could be a friend, family member, mentor, or even yourself.
            </Text>
          </View>
        )}

        {/* Tips Card */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>Writing Tips</Text>
          <Text style={styles.tipItem}>- Be specific about what they did and how it affected you</Text>
          <Text style={styles.tipItem}>- Share how their actions made you feel</Text>
          <Text style={styles.tipItem}>- Writing heals, even if you never send the letter</Text>
          <Text style={styles.tipItem}>- Consider writing to yourself for self-compassion</Text>
        </View>

        {/* Save Indicator */}
        <SaveIndicator isSaving={isSaving} lastSaved={lastSaved} isError={isLoadError} onRetry={saveNow} />

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Template Selection Modal */}
      <Modal
        visible={showTemplateModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowTemplateModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowTemplateModal(false)}
        >
          <Pressable
            style={styles.templateModalContent}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={styles.modalTitle}>Choose Letter Type</Text>
            <Text style={styles.modalSubtitle}>
              Select the type of gratitude you want to express
            </Text>

            {(Object.keys(LETTER_TEMPLATES) as TemplateType[]).map((templateKey) => {
              const template = LETTER_TEMPLATES[templateKey];
              return (
                <TouchableOpacity
                  key={templateKey}
                  style={[styles.templateOption, { borderColor: template.color }]}
                  onPress={() => handleSelectTemplate(templateKey)}
                  accessibilityRole="button"
                  accessibilityLabel={`${template.label} letter template`}
                >
                  <View style={[styles.templateOptionIcon, { backgroundColor: template.color }]}>
                    <Text style={styles.templateOptionIconText}>{template.icon}</Text>
                  </View>
                  <View style={styles.templateOptionInfo}>
                    <Text style={styles.templateOptionLabel}>{template.label}</Text>
                    <Text style={styles.templateOptionDesc}>{template.description}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowTemplateModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Letter Editor Modal */}
      <Modal
        visible={showEditor}
        animationType="slide"
        onRequestClose={() => setShowEditor(false)}
      >
        <KeyboardAvoidingView
          style={styles.editorContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          {/* Editor Header */}
          <View style={styles.editorHeader}>
            <TouchableOpacity
              onPress={() => setShowEditor(false)}
              style={styles.editorBackButton}
            >
              <Text style={styles.editorBackText}>{'\u2190'} Back</Text>
            </TouchableOpacity>
            <Text style={styles.editorTitle}>
              {LETTER_TEMPLATES[editTemplate].icon} {LETTER_TEMPLATES[editTemplate].label}
            </Text>
            <View style={styles.editorSaveIndicator}>
              {isSaving && <Text style={styles.savingText}>Saving...</Text>}
            </View>
          </View>

          <ScrollView
            style={styles.editorScrollView}
            contentContainerStyle={styles.editorContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* Recipient Input */}
            <View style={styles.editorField}>
              <Text style={styles.editorLabel}>To:</Text>
              <TextInput
                style={styles.recipientInput}
                value={editRecipient}
                onChangeText={setEditRecipient}
                placeholder="Enter recipient's name"
                placeholderTextColor={DESIGN_COLORS.textTertiary}
                accessibilityLabel="Recipient name"
              />
            </View>

            {/* Letter Content */}
            <View style={styles.editorField}>
              <Text style={styles.editorLabel}>Your Letter:</Text>
              <TextInput
                style={styles.letterInput}
                value={editContent}
                onChangeText={setEditContent}
                placeholder="Write your heartfelt message..."
                placeholderTextColor={DESIGN_COLORS.textTertiary}
                multiline
                textAlignVertical="top"
                accessibilityLabel="Letter content"
              />
            </View>

            {/* Character Count */}
            <Text style={styles.charCount}>{editContent.length} characters</Text>
          </ScrollView>

          {/* Editor Actions */}
          <View style={styles.editorActions}>
            <TouchableOpacity
              style={styles.saveDraftButton}
              onPress={() => handleSaveLetter('draft')}
            >
              <Text style={styles.saveDraftText}>Save Draft</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.completeButton}
              onPress={() => handleSaveLetter('completed')}
            >
              <Text style={styles.completeText}>Complete</Text>
            </TouchableOpacity>
            {selectedLetter && selectedLetter.status !== 'sent' && (
              <TouchableOpacity
                style={styles.sentButton}
                onPress={handleMarkAsSent}
              >
                <Text style={styles.sentText}>Mark as Sent</Text>
              </TouchableOpacity>
            )}
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
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
  },

  // Stats Row
  statsRow: {
    flexDirection: 'row',
    backgroundColor: DESIGN_COLORS.bgElevated,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: DESIGN_COLORS.accentGold,
  },
  statLabel: {
    fontSize: 12,
    color: DESIGN_COLORS.textSecondary,
    marginTop: 4,
  },

  // New Letter Button
  newLetterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: DESIGN_COLORS.accentGold,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: DESIGN_COLORS.accentGold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  newLetterIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  newLetterText: {
    fontSize: 16,
    fontWeight: '600',
    color: DESIGN_COLORS.bgPrimary,
  },

  // Letters Section
  lettersSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: DESIGN_COLORS.textSecondary,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  // Letter Card
  letterCard: {
    backgroundColor: DESIGN_COLORS.bgElevated,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
  },
  letterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  templateIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  templateIconText: {
    fontSize: 18,
  },
  letterInfo: {
    flex: 1,
  },
  letterRecipient: {
    fontSize: 16,
    fontWeight: '600',
    color: DESIGN_COLORS.textPrimary,
  },
  letterType: {
    fontSize: 12,
    color: DESIGN_COLORS.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: DESIGN_COLORS.textPrimary,
  },
  letterPreview: {
    fontSize: 14,
    color: DESIGN_COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  letterFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  letterDate: {
    fontSize: 12,
    color: DESIGN_COLORS.textTertiary,
  },
  deleteButton: {
    padding: 4,
  },
  deleteButtonText: {
    fontSize: 12,
    color: DESIGN_COLORS.error,
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 24,
    backgroundColor: DESIGN_COLORS.bgElevated,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
    marginBottom: 24,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: DESIGN_COLORS.textPrimary,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: DESIGN_COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },

  // Tips Card
  tipsCard: {
    backgroundColor: DESIGN_COLORS.bgSecondary,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: DESIGN_COLORS.accentGold,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tipItem: {
    fontSize: 13,
    color: DESIGN_COLORS.textSecondary,
    marginBottom: 6,
    lineHeight: 20,
  },

  bottomSpacer: {
    height: 40,
  },

  // Modal Overlay
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },

  // Template Modal
  templateModalContent: {
    backgroundColor: DESIGN_COLORS.bgElevated,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: DESIGN_COLORS.textPrimary,
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: DESIGN_COLORS.textSecondary,
    marginBottom: 20,
  },
  templateOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DESIGN_COLORS.bgPrimary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  templateOptionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  templateOptionIconText: {
    fontSize: 22,
  },
  templateOptionInfo: {
    flex: 1,
  },
  templateOptionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: DESIGN_COLORS.textPrimary,
    marginBottom: 4,
  },
  templateOptionDesc: {
    fontSize: 13,
    color: DESIGN_COLORS.textSecondary,
  },
  cancelButton: {
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelButtonText: {
    fontSize: 14,
    color: DESIGN_COLORS.textTertiary,
  },

  // Editor
  editorContainer: {
    flex: 1,
    backgroundColor: DESIGN_COLORS.bgPrimary,
  },
  editorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: DESIGN_COLORS.border,
    backgroundColor: DESIGN_COLORS.bgElevated,
  },
  editorBackButton: {
    padding: 8,
  },
  editorBackText: {
    fontSize: 16,
    color: DESIGN_COLORS.accentGold,
    fontWeight: '500',
  },
  editorTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: DESIGN_COLORS.textPrimary,
  },
  editorSaveIndicator: {
    width: 60,
    alignItems: 'flex-end',
  },
  savingText: {
    fontSize: 12,
    color: DESIGN_COLORS.textTertiary,
  },
  editorScrollView: {
    flex: 1,
  },
  editorContent: {
    padding: 16,
  },
  editorField: {
    marginBottom: 16,
  },
  editorLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: DESIGN_COLORS.textSecondary,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  recipientInput: {
    backgroundColor: DESIGN_COLORS.bgElevated,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: DESIGN_COLORS.textPrimary,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
  },
  letterInput: {
    backgroundColor: DESIGN_COLORS.bgElevated,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: DESIGN_COLORS.textPrimary,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
    minHeight: 300,
    lineHeight: 24,
  },
  charCount: {
    fontSize: 12,
    color: DESIGN_COLORS.textTertiary,
    textAlign: 'right',
    marginTop: 4,
  },

  // Editor Actions
  editorActions: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: DESIGN_COLORS.border,
    backgroundColor: DESIGN_COLORS.bgElevated,
  },
  saveDraftButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: DESIGN_COLORS.bgPrimary,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
  },
  saveDraftText: {
    fontSize: 14,
    fontWeight: '600',
    color: DESIGN_COLORS.textSecondary,
  },
  completeButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: DESIGN_COLORS.accentPurple,
  },
  completeText: {
    fontSize: 14,
    fontWeight: '600',
    color: DESIGN_COLORS.textPrimary,
  },
  sentButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: DESIGN_COLORS.accentGreen,
  },
  sentText: {
    fontSize: 14,
    fontWeight: '600',
    color: DESIGN_COLORS.textPrimary,
  },
});

export default GratitudeLettersScreen;
