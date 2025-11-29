/**
 * VisionBoardScreen
 *
 * Main screen for the Vision Board feature in Phase 2.
 * Users can create a visual collage of their goals and dreams.
 *
 * Features:
 * - Add images from device gallery
 * - Add text overlays with motivational quotes
 * - Reposition items on the canvas
 * - Delete items
 * - Save/Load board state
 *
 * Design (from APP-DESIGN.md):
 * - Background: #1a1a2e (deep charcoal)
 * - Canvas: #252547 (slightly elevated)
 * - Accent: #c9a227 (muted gold) for selected items
 * - Dark spiritual theme
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
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
} from 'react-native';
import * as Haptics from 'expo-haptics';
import type { WorkbookStackScreenProps } from '../../../types/navigation';
import {
  VisionCanvas,
  ImagePickerButton,
  generateItemId,
  generateBoardId,
  DEFAULT_IMAGE_SIZE,
  DEFAULT_TEXT_SIZE,
  DEFAULT_TEXT_STYLE,
  DEFAULT_IMAGE_STYLE,
} from '../../../components/vision-board';
import type { VisionBoardItem, VisionBoardData } from '../../../components/vision-board';
import { SaveIndicator } from '../../../components/workbook';
import { useWorkbookProgress, useSaveWorkbook } from '../../../hooks/useWorkbook';
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
  accentPurpleLight: '#6b2d8b',
  accentGold: '#c9a227',
  accentTeal: '#1a5f5f',
  accentGreen: '#2d5a4a',
  border: '#3a3a5a',
  success: '#2d5a4a',
  error: '#dc2626',
};

// Initial empty board
const createEmptyBoard = (): VisionBoardData => ({
  id: generateBoardId(),
  name: 'My Vision Board',
  items: [],
  template: null,
  backgroundColor: DESIGN_COLORS.bgElevated,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

type Props = WorkbookStackScreenProps<'VisionBoard'>;

/**
 * VisionBoardScreen Component
 */
const VisionBoardScreen: React.FC<Props> = ({ navigation, route: _route }) => {
  // Fetch saved progress from Supabase
  const { data: savedProgress, isLoading: isLoadingProgress } = useWorkbookProgress(2, WORKSHEET_IDS.VISION_BOARD);
  const { mutate: saveWorkbook, isPending: isSaving } = useSaveWorkbook();

  const [board, setBoard] = useState<VisionBoardData>(createEmptyBoard());
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saveError, setSaveError] = useState(false);
  const [showTextModal, setShowTextModal] = useState(false);
  const [newText, setNewText] = useState('');

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Load board data on mount
   */
  useEffect(() => {
    // Check if we have saved progress from Supabase
    if (!isLoadingProgress) {
      if (savedProgress?.data) {
        const data = savedProgress.data as unknown as VisionBoardData;
        setBoard(data);
      }
      setIsLoading(false);
    }
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [savedProgress, isLoadingProgress]);

  /**
   * Auto-save when board changes (debounced)
   */
  useEffect(() => {
    if (!isLoading && board.items.length > 0) {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      saveTimeoutRef.current = setTimeout(() => {
        autoSave();
      }, 2000); // 2 second debounce
    }
  }, [board, isLoading]);

  /**
   * Auto-save board to Supabase
   */
  const autoSave = useCallback(async () => {
    setSaveError(false);
    const boardData = {
      ...board,
      updatedAt: new Date().toISOString(),
    };

    saveWorkbook(
      {
        phaseNumber: 2,
        worksheetId: WORKSHEET_IDS.VISION_BOARD,
        data: boardData as unknown as Record<string, unknown>,
      },
      {
        onSuccess: () => {
          setLastSaved(new Date());
        },
        onError: (error) => {
          console.error('Failed to save:', error);
          setSaveError(true);
        },
      }
    );
  }, [board, saveWorkbook]);

  /**
   * Add an image to the board
   */
  const handleAddImage = useCallback((imageUri: string) => {
    const newItem: VisionBoardItem = {
      id: generateItemId(),
      type: 'image',
      content: imageUri,
      position: { x: 50, y: 50 + (board.items.length * 20) % 300 },
      size: DEFAULT_IMAGE_SIZE,
      style: DEFAULT_IMAGE_STYLE,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setBoard((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
      updatedAt: new Date().toISOString(),
    }));

    setSelectedItemId(newItem.id);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [board.items.length]);

  /**
   * Open text input modal
   */
  const handleAddTextPress = () => {
    setNewText('');
    setShowTextModal(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  /**
   * Add text item to the board
   */
  const handleAddText = () => {
    if (!newText.trim()) {
      Alert.alert('Empty Text', 'Please enter some text for your vision board.');
      return;
    }

    const newItem: VisionBoardItem = {
      id: generateItemId(),
      type: 'text',
      content: newText.trim(),
      position: { x: 30, y: 30 + (board.items.length * 30) % 350 },
      size: DEFAULT_TEXT_SIZE,
      style: DEFAULT_TEXT_STYLE,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setBoard((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
      updatedAt: new Date().toISOString(),
    }));

    setSelectedItemId(newItem.id);
    setShowTextModal(false);
    setNewText('');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  /**
   * Delete an item from the board
   */
  const handleDeleteItem = useCallback((id: string) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to remove this item from your vision board?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setBoard((prev) => ({
              ...prev,
              items: prev.items.filter((item) => item.id !== id),
              updatedAt: new Date().toISOString(),
            }));
            setSelectedItemId(null);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          },
        },
      ]
    );
  }, []);

  /**
   * Update item position
   */
  const handleUpdatePosition = useCallback((id: string, position: { x: number; y: number }) => {
    setBoard((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === id
          ? { ...item, position, updatedAt: new Date().toISOString() }
          : item
      ),
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  /**
   * Handle canvas tap (deselect items)
   */
  const handleCanvasTap = useCallback(() => {
    setSelectedItemId(null);
  }, []);

  /**
   * Manual save and navigate back
   */
  const handleSaveAndContinue = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await autoSave();
    navigation.goBack();
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={50} color={DESIGN_COLORS.accentGold} />
        <Text style={styles.loadingText}>Loading your vision board...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Vision Board</Text>
          <Text style={styles.subtitle}>
            Create a visual representation of your dreams and goals.
            Add images and inspiring words to manifest your future.
          </Text>
        </View>

        {/* Vision Canvas */}
        <VisionCanvas
          items={board.items}
          selectedItemId={selectedItemId}
          onSelectItem={setSelectedItemId}
          onDeleteItem={handleDeleteItem}
          onUpdateItemPosition={handleUpdatePosition}
          onCanvasTap={handleCanvasTap}
        />

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <Text style={styles.actionsLabel}>Add to Your Board</Text>
          <View style={styles.actionsRow}>
            <ImagePickerButton onImageSelected={handleAddImage} />

            <TouchableOpacity
              style={styles.textButton}
              onPress={handleAddTextPress}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Add text"
              accessibilityHint="Opens a dialog to add text to your vision board"
            >
              <Text style={styles.textButtonIcon}>Aa</Text>
              <Text style={styles.textButtonText}>Add Text</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tips Card */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>Tips for Your Vision Board</Text>
          <Text style={styles.tipItem}>- Choose images that evoke strong emotions</Text>
          <Text style={styles.tipItem}>- Include specific goals and affirmations</Text>
          <Text style={styles.tipItem}>- Review your board daily for manifestation</Text>
          <Text style={styles.tipItem}>- Update it as your dreams evolve</Text>
        </View>

        {/* Save Status */}
        <SaveIndicator isSaving={isSaving} lastSaved={lastSaved} isError={saveError} onRetry={autoSave} />

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

        {/* Bottom spacing */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Add Text Modal */}
      <Modal
        visible={showTextModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowTextModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowTextModal(false)}
        >
          <Pressable
            style={styles.modalContent}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={styles.modalTitle}>Add Inspirational Text</Text>
            <Text style={styles.modalSubtitle}>
              Enter an affirmation, goal, or motivational quote
            </Text>

            <TextInput
              style={styles.textInput}
              value={newText}
              onChangeText={setNewText}
              placeholder="Enter your text..."
              placeholderTextColor={DESIGN_COLORS.textTertiary}
              multiline
              numberOfLines={3}
              maxLength={200}
              autoFocus
              accessibilityLabel="Text input for vision board"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowTextModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalAddButton}
                onPress={handleAddText}
              >
                <Text style={styles.modalAddText}>Add Text</Text>
              </TouchableOpacity>
            </View>
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
  actionsContainer: {
    marginBottom: 24,
  },
  actionsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: DESIGN_COLORS.textSecondary,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  textButton: {
    backgroundColor: DESIGN_COLORS.accentTeal,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
    shadowColor: DESIGN_COLORS.accentTeal,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  textButtonIcon: {
    fontSize: 16,
    fontWeight: 'bold',
    color: DESIGN_COLORS.accentGold,
    marginRight: 8,
  },
  textButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: DESIGN_COLORS.textPrimary,
    letterSpacing: 0.5,
  },

  // Tips Card
  tipsCard: {
    backgroundColor: DESIGN_COLORS.bgSecondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
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

  // Save Status
  saveStatusContainer: {
    alignItems: 'center',
    marginBottom: 16,
    minHeight: 20,
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

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
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
  textInput: {
    backgroundColor: DESIGN_COLORS.bgPrimary,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: DESIGN_COLORS.textPrimary,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  modalCancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
  },
  modalCancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: DESIGN_COLORS.textSecondary,
  },
  modalAddButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: DESIGN_COLORS.accentPurple,
  },
  modalAddText: {
    fontSize: 14,
    fontWeight: '600',
    color: DESIGN_COLORS.textPrimary,
  },
});

export default VisionBoardScreen;
