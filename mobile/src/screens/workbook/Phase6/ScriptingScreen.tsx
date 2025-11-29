/**
 * ScriptingScreen - Manifestation Scripting
 *
 * Phase 6 screen for writing manifestation scripts - future journaling
 * where users describe their ideal life as if it's already happening.
 *
 * Features:
 * - Multiple script templates
 * - Rich text input area
 * - Word count display
 * - Save multiple scripts
 * - Tips on scripting technique
 * - Auto-save functionality
 * - Dark spiritual theme
 *
 * @example
 * Navigation: WorkbookNavigator -> Scripting
 */

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
  View,
  ScrollView,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Text } from '../../../components';
import ScriptTemplate, {
  ScriptTemplateData,
  SCRIPT_TEMPLATES,
  CATEGORY_COLORS,
} from '../../../components/workbook/ScriptTemplate';
import { colors, spacing, borderRadius, shadows } from '../../../theme';
import type { WorkbookStackScreenProps } from '../../../types/navigation';
import { useWorkbookProgress } from '../../../hooks/useWorkbook';
import { useAutoSave } from '../../../hooks/useAutoSave';
import { WORKSHEET_IDS } from '../../../types/workbook';
import { SaveIndicator } from '../../../components/workbook';

/**
 * Saved script data structure
 */
interface SavedScript {
  id: string;
  templateId: string;
  title: string;
  content: string;
  wordCount: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Generate unique ID
 */
const generateId = (): string => {
  return `script_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Count words in text
 */
const countWords = (text: string): number => {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
};

type Props = WorkbookStackScreenProps<'Scripting'>;

/**
 * ScriptingScreen Component
 */
/**
 * Interface for form data to save
 */
interface ScriptingFormData {
  scripts: SavedScript[];
}

const ScriptingScreen: React.FC<Props> = ({ navigation: _navigation }) => {
  // State
  const [selectedTemplate, setSelectedTemplate] = useState<ScriptTemplateData | null>(null);
  const [scripts, setScripts] = useState<SavedScript[]>([]);
  const [currentScript, setCurrentScript] = useState<string>('');
  const [scriptTitle, setScriptTitle] = useState<string>('');
  const [editingScriptId, setEditingScriptId] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [showSavedScripts, setShowSavedScripts] = useState(false);

  // Refs
  const inputRef = React.useRef<TextInput>(null);

  // Supabase hooks
  const { data: savedProgress, isLoading: _isLoading } = useWorkbookProgress(6, WORKSHEET_IDS.SCRIPTING);

  // Prepare form data for auto-save
  const formData: ScriptingFormData = useMemo(() => ({
    scripts,
  }), [scripts]);

  const { isSaving, isError, lastSaved, saveNow } = useAutoSave({
    data: formData as unknown as Record<string, unknown>,
    phaseNumber: 6,
    worksheetId: WORKSHEET_IDS.SCRIPTING,
    debounceMs: 2000,
  });

  /**
   * Load saved progress
   */
  useEffect(() => {
    if (savedProgress?.data) {
      const data = savedProgress.data as unknown as ScriptingFormData;
      if (data.scripts) setScripts(data.scripts);
    }
  }, [savedProgress]);

  /**
   * Handle template selection
   */
  const handleTemplateSelect = useCallback((template: ScriptTemplateData) => {
    setSelectedTemplate(template);
    setShowEditor(true);
    setEditingScriptId(null);
    setScriptTitle(`My ${template.title}`);
    setCurrentScript(template.exampleOpening || '');
    setTimeout(() => inputRef.current?.focus(), 300);
  }, []);

  /**
   * Handle script content change
   */
  const handleScriptChange = useCallback((text: string) => {
    setCurrentScript(text);
  }, []);

  /**
   * Handle save script
   */
  const handleSaveScript = useCallback(() => {
    if (!currentScript.trim() || !selectedTemplate) return;

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    const now = new Date().toISOString();
    const wordCount = countWords(currentScript);

    if (editingScriptId) {
      // Update existing script
      setScripts(prev => prev.map(s =>
        s.id === editingScriptId
          ? {
              ...s,
              title: scriptTitle || `My ${selectedTemplate.title}`,
              content: currentScript,
              wordCount,
              updatedAt: now,
            }
          : s
      ));
    } else {
      // Create new script
      const newScript: SavedScript = {
        id: generateId(),
        templateId: selectedTemplate.id,
        title: scriptTitle || `My ${selectedTemplate.title}`,
        content: currentScript,
        wordCount,
        createdAt: now,
        updatedAt: now,
      };
      setScripts(prev => [newScript, ...prev]);
    }

    setShowEditor(false);
    setCurrentScript('');
    setScriptTitle('');
    setSelectedTemplate(null);
    setEditingScriptId(null);
  }, [currentScript, selectedTemplate, scriptTitle, editingScriptId]);

  /**
   * Handle edit saved script
   */
  const handleEditScript = useCallback((script: SavedScript) => {
    const template = SCRIPT_TEMPLATES.find(t => t.id === script.templateId);
    if (template) {
      setSelectedTemplate(template);
      setCurrentScript(script.content);
      setScriptTitle(script.title);
      setEditingScriptId(script.id);
      setShowEditor(true);
      setShowSavedScripts(false);
    }
  }, []);

  /**
   * Handle delete script
   */
  const handleDeleteScript = useCallback((scriptId: string) => {
    Alert.alert(
      'Delete Script',
      'Are you sure you want to delete this script?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            setScripts(prev => prev.filter(s => s.id !== scriptId));
          },
        },
      ]
    );
  }, []);

  /**
   * Close editor
   */
  const handleCloseEditor = useCallback(() => {
    if (currentScript.trim() && currentScript !== selectedTemplate?.exampleOpening) {
      Alert.alert(
        'Unsaved Changes',
        'You have unsaved changes. Save before closing?',
        [
          { text: 'Discard', style: 'destructive', onPress: () => {
            setShowEditor(false);
            setCurrentScript('');
            setScriptTitle('');
            setSelectedTemplate(null);
            setEditingScriptId(null);
          }},
          { text: 'Save', onPress: handleSaveScript },
        ]
      );
    } else {
      setShowEditor(false);
      setCurrentScript('');
      setScriptTitle('');
      setSelectedTemplate(null);
      setEditingScriptId(null);
    }
  }, [currentScript, selectedTemplate, handleSaveScript]);

  const wordCount = countWords(currentScript);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.phaseLabel}>Phase 6</Text>
          <Text style={styles.title}>Scripting</Text>
          <Text style={styles.subtitle}>
            Write your future into existence
          </Text>

          {/* Decorative Divider */}
          <View style={styles.headerDivider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerSymbol}>{'\u270F'}</Text>
            <View style={styles.dividerLine} />
          </View>
        </View>

        {/* Saved Scripts Button */}
        {scripts.length > 0 && (
          <TouchableOpacity
            style={styles.savedScriptsButton}
            onPress={() => setShowSavedScripts(true)}
            accessibilityRole="button"
            accessibilityLabel={`View ${scripts.length} saved scripts`}
            testID="saved-scripts-button"
          >
            <Text style={styles.savedScriptsIcon}>{'\uD83D\uDCDD'}</Text>
            <Text style={styles.savedScriptsText}>
              My Scripts ({scripts.length})
            </Text>
            <Text style={styles.chevron}>{'\u203A'}</Text>
          </TouchableOpacity>
        )}

        {/* Tips Card */}
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setShowTips(!showTips);
          }}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityState={{ expanded: showTips }}
          testID="tips-toggle"
        >
          <View style={styles.tipsCard}>
            <View style={styles.tipsHeader}>
              <Text style={styles.tipsIcon}>{'\uD83D\uDCA1'}</Text>
              <Text style={styles.tipsTitle}>Scripting Tips</Text>
              <Text style={styles.expandIcon}>
                {showTips ? '\u25B2' : '\u25BC'}
              </Text>
            </View>

            {showTips && (
              <View style={styles.tipsContent}>
                {[
                  { tip: 'Write in present tense', desc: 'As if it\'s happening now' },
                  { tip: 'Use "I am" statements', desc: 'Claim your reality' },
                  { tip: 'Include emotions', desc: 'How does it feel?' },
                  { tip: 'Be specific', desc: 'Details make it real' },
                  { tip: 'Express gratitude', desc: 'As if you already received it' },
                ].map((item, index) => (
                  <View key={index} style={styles.tipRow}>
                    <Text style={styles.tipBullet}>{'\u2713'}</Text>
                    <View style={styles.tipTextContainer}>
                      <Text style={styles.tipMain}>{item.tip}</Text>
                      <Text style={styles.tipDesc}>{item.desc}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        </TouchableOpacity>

        {/* Template Selection */}
        <Text style={styles.sectionTitle}>Choose a Template</Text>
        <Text style={styles.sectionSubtitle}>
          Select a template to guide your scripting practice
        </Text>

        <View style={styles.templatesContainer}>
          {SCRIPT_TEMPLATES.map(template => (
            <ScriptTemplate
              key={template.id}
              template={template}
              isSelected={selectedTemplate?.id === template.id && showEditor}
              onSelect={() => handleTemplateSelect(template)}
              style={styles.templateCard}
              testID={`template-${template.id}`}
            />
          ))}
        </View>

        {/* Inspirational Quote */}
        <View style={styles.quoteContainer}>
          <Text style={styles.quoteText}>
            "The pen is mightier than the sword, but the pen that scripts your
            destiny is mightier still."
          </Text>
        </View>

        {/* Save Status */}
        <SaveIndicator isSaving={isSaving} lastSaved={lastSaved} isError={isError} onRetry={saveNow} />

        {/* Bottom Spacer */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Editor Modal */}
      <Modal
        visible={showEditor}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleCloseEditor}
      >
        <KeyboardAvoidingView
          style={styles.editorContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          {/* Editor Header */}
          <View style={styles.editorHeader}>
            <TouchableOpacity
              onPress={handleCloseEditor}
              accessibilityRole="button"
              accessibilityLabel="Close editor"
              testID="editor-close"
            >
              <Text style={styles.closeButton}>{'\u2715'}</Text>
            </TouchableOpacity>

            <View style={styles.editorTitleContainer}>
              <TextInput
                value={scriptTitle}
                onChangeText={setScriptTitle}
                placeholder="Script Title"
                placeholderTextColor={colors.dark.textTertiary}
                style={styles.titleInput}
                maxLength={50}
              />
            </View>

            <TouchableOpacity
              onPress={handleSaveScript}
              disabled={!currentScript.trim()}
              accessibilityRole="button"
              accessibilityLabel="Save script"
              accessibilityState={{ disabled: !currentScript.trim() }}
              testID="editor-save"
            >
              <Text style={[
                styles.saveButton,
                !currentScript.trim() && styles.saveButtonDisabled,
              ]}>
                Save
              </Text>
            </TouchableOpacity>
          </View>

          {/* Template Info */}
          {selectedTemplate && (
            <View style={[
              styles.templateInfo,
              { borderLeftColor: CATEGORY_COLORS[selectedTemplate.category] },
            ]}>
              <Text style={styles.templateInfoTitle}>
                {selectedTemplate.icon} {selectedTemplate.title}
              </Text>
              <Text style={styles.templateInfoDesc}>
                {selectedTemplate.description}
              </Text>
            </View>
          )}

          {/* Writing Prompts */}
          {selectedTemplate && (
            <View style={styles.promptsContainer}>
              <Text style={styles.promptsTitle}>Writing Prompts:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.promptsScroll}>
                  {selectedTemplate.prompts.slice(0, 4).map((prompt, index) => (
                    <View key={index} style={styles.promptChip}>
                      <Text style={styles.promptChipText}>{prompt}</Text>
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>
          )}

          {/* Script Input */}
          <View style={styles.inputContainer}>
            <TextInput
              ref={inputRef}
              value={currentScript}
              onChangeText={handleScriptChange}
              placeholder="Begin writing your script... Describe your ideal reality as if it's already true."
              placeholderTextColor={colors.dark.textTertiary}
              multiline
              style={styles.scriptInput}
              textAlignVertical="top"
              accessibilityLabel="Script content"
              testID="script-input"
            />
          </View>

          {/* Footer */}
          <View style={styles.editorFooter}>
            <Text style={styles.wordCount}>
              {wordCount} {wordCount === 1 ? 'word' : 'words'}
            </Text>
            <Text style={styles.autoSaveHint}>
              {'\u2022'} Auto-saving enabled
            </Text>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Saved Scripts Modal */}
      <Modal
        visible={showSavedScripts}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowSavedScripts(false)}
      >
        <View style={styles.savedScriptsModal}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => setShowSavedScripts(false)}
              accessibilityRole="button"
              accessibilityLabel="Close saved scripts"
            >
              <Text style={styles.closeButton}>{'\u2715'}</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>My Scripts</Text>
            <View style={{ width: 40 }} />
          </View>

          <ScrollView style={styles.scriptsList}>
            {scripts.map(script => {
              const template = SCRIPT_TEMPLATES.find(t => t.id === script.templateId);
              return (
                <TouchableOpacity
                  key={script.id}
                  style={styles.scriptCard}
                  onPress={() => handleEditScript(script)}
                  onLongPress={() => handleDeleteScript(script.id)}
                  accessibilityRole="button"
                  accessibilityLabel={`${script.title}, ${script.wordCount} words`}
                  accessibilityHint="Tap to edit, long press to delete"
                >
                  <View style={styles.scriptCardHeader}>
                    <Text style={styles.scriptCardIcon}>
                      {template?.icon || '\uD83D\uDCDD'}
                    </Text>
                    <View style={styles.scriptCardInfo}>
                      <Text style={styles.scriptCardTitle}>{script.title}</Text>
                      <Text style={styles.scriptCardMeta}>
                        {script.wordCount} words {'\u2022'} {new Date(script.updatedAt).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.scriptCardPreview} numberOfLines={2}>
                    {script.content}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

/**
 * Styles - Dark Spiritual Theme
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.bgPrimary,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    padding: spacing.md,
  },

  header: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },

  phaseLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.dark.accentGold,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: spacing.xs,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.dark.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },

  subtitle: {
    fontSize: 15,
    color: colors.dark.textSecondary,
    textAlign: 'center',
  },

  headerDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    width: '60%',
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.dark.textTertiary,
    opacity: 0.3,
  },

  dividerSymbol: {
    fontSize: 14,
    color: colors.dark.accentGold,
    marginHorizontal: spacing.sm,
  },

  savedScriptsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark.bgElevated,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.sm,
  },

  savedScriptsIcon: {
    fontSize: 20,
    marginRight: spacing.sm,
  },

  savedScriptsText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: colors.dark.textPrimary,
  },

  chevron: {
    fontSize: 24,
    color: colors.dark.textTertiary,
  },

  tipsCard: {
    backgroundColor: colors.dark.bgElevated,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: `${colors.dark.accentTeal}30`,
    ...shadows.sm,
  },

  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  tipsIcon: {
    fontSize: 20,
    marginRight: spacing.sm,
  },

  tipsTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: colors.dark.textPrimary,
  },

  expandIcon: {
    fontSize: 12,
    color: colors.dark.textTertiary,
  },

  tipsContent: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: `${colors.dark.textTertiary}20`,
    gap: spacing.sm,
  },

  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  tipBullet: {
    fontSize: 14,
    color: colors.dark.accentTeal,
    marginRight: spacing.sm,
    marginTop: 2,
  },

  tipTextContainer: {
    flex: 1,
  },

  tipMain: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.dark.textPrimary,
  },

  tipDesc: {
    fontSize: 12,
    color: colors.dark.textSecondary,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.dark.textPrimary,
    marginBottom: spacing.xs,
  },

  sectionSubtitle: {
    fontSize: 13,
    color: colors.dark.textSecondary,
    marginBottom: spacing.md,
  },

  templatesContainer: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },

  templateCard: {
    // Additional styling if needed
  },

  quoteContainer: {
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.md,
  },

  quoteText: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.dark.textTertiary,
    textAlign: 'center',
    fontStyle: 'italic',
  },

  bottomSpacer: {
    height: 40,
  },

  // Editor Modal Styles
  editorContainer: {
    flex: 1,
    backgroundColor: colors.dark.bgPrimary,
  },

  editorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: `${colors.dark.textTertiary}20`,
  },

  closeButton: {
    fontSize: 20,
    color: colors.dark.textSecondary,
    padding: spacing.sm,
  },

  editorTitleContainer: {
    flex: 1,
    marginHorizontal: spacing.sm,
  },

  titleInput: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark.textPrimary,
    textAlign: 'center',
  },

  saveButton: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.dark.accentGold,
    padding: spacing.sm,
  },

  saveButtonDisabled: {
    color: colors.dark.textTertiary,
  },

  templateInfo: {
    backgroundColor: colors.dark.bgElevated,
    padding: spacing.md,
    borderLeftWidth: 3,
    margin: spacing.md,
  },

  templateInfoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.dark.textPrimary,
    marginBottom: 2,
  },

  templateInfoDesc: {
    fontSize: 12,
    color: colors.dark.textSecondary,
  },

  promptsContainer: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },

  promptsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.dark.textSecondary,
    marginBottom: spacing.xs,
  },

  promptsScroll: {
    flexDirection: 'row',
    gap: spacing.sm,
  },

  promptChip: {
    backgroundColor: `${colors.dark.accentGold}20`,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },

  promptChipText: {
    fontSize: 11,
    color: colors.dark.accentGold,
  },

  inputContainer: {
    flex: 1,
    padding: spacing.md,
  },

  scriptInput: {
    flex: 1,
    backgroundColor: colors.dark.bgElevated,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    color: colors.dark.textPrimary,
    fontSize: 16,
    lineHeight: 26,
  },

  editorFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: `${colors.dark.textTertiary}20`,
  },

  wordCount: {
    fontSize: 13,
    color: colors.dark.textSecondary,
  },

  autoSaveHint: {
    fontSize: 12,
    color: colors.dark.textTertiary,
  },

  // Saved Scripts Modal
  savedScriptsModal: {
    flex: 1,
    backgroundColor: colors.dark.bgPrimary,
  },

  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: `${colors.dark.textTertiary}20`,
  },

  modalTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: colors.dark.textPrimary,
    textAlign: 'center',
  },

  scriptsList: {
    flex: 1,
    padding: spacing.md,
  },

  scriptCard: {
    backgroundColor: colors.dark.bgElevated,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.sm,
  },

  scriptCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },

  scriptCardIcon: {
    fontSize: 24,
    marginRight: spacing.sm,
  },

  scriptCardInfo: {
    flex: 1,
  },

  scriptCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.dark.textPrimary,
  },

  scriptCardMeta: {
    fontSize: 12,
    color: colors.dark.textSecondary,
  },

  scriptCardPreview: {
    fontSize: 13,
    color: colors.dark.textTertiary,
    lineHeight: 18,
  },
});

export default ScriptingScreen;
