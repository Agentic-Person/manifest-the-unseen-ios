/**
 * RoleModelsScreen
 *
 * Phase 8: Turning Envy Into Inspiration - Exercise 3
 *
 * This screen allows users to create a board of role models and
 * inspirations, documenting what they admire and lessons learned.
 *
 * Features:
 * - Add/edit/delete role models
 * - Photo picker integration (expo-image-picker)
 * - Category filtering
 * - Lessons learned tracking
 * - Optional quotes
 * - Auto-save functionality
 * - Dark spiritual theme
 */

import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { Text } from '../../../components/Text';
import { RoleModelCard, ROLE_MODEL_CATEGORIES, RoleModel, RoleModelCategory } from '../../../components/workbook/RoleModelCard';
import { colors, spacing, borderRadius, shadows } from '../../../theme';
import type { WorkbookStackScreenProps } from '../../../types/navigation';

type Props = WorkbookStackScreenProps<'RoleModels'>;

/**
 * Generate a unique ID
 */
const generateId = (): string => {
  return `rolemodel_${Date.now()}_${Math.random().toString(36).substring(7)}`;
};

/**
 * RoleModelsScreen Component
 */
const RoleModelsScreen: React.FC<Props> = ({ navigation: _navigation }) => {
  // State
  const [roleModels, setRoleModels] = useState<RoleModel[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<RoleModelCategory | 'all'>('all');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<RoleModel | null>(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formPhotoUri, setFormPhotoUri] = useState<string | undefined>(undefined);
  const [formCategory, setFormCategory] = useState<RoleModelCategory>('personalGrowth');
  const [formInspiration, setFormInspiration] = useState('');
  const [formLessons, setFormLessons] = useState<string[]>([]);
  const [formNewLesson, setFormNewLesson] = useState('');
  const [formQuote, setFormQuote] = useState('');

  /**
   * Filter items by category
   */
  const filteredItems = useMemo(() => {
    if (selectedCategory === 'all') {
      return roleModels;
    }
    return roleModels.filter((item) => item.category === selectedCategory);
  }, [roleModels, selectedCategory]);

  /**
   * Get count per category
   */
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: roleModels.length };
    Object.keys(ROLE_MODEL_CATEGORIES).forEach((cat) => {
      counts[cat] = roleModels.filter((item) => item.category === cat).length;
    });
    return counts;
  }, [roleModels]);

  /**
   * Request camera permissions and pick image
   */
  const pickImage = useCallback(async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please grant camera roll permissions to add photos.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setFormPhotoUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  }, []);

  /**
   * Open modal for new item
   */
  const handleAddNew = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setEditingItem(null);
    setFormName('');
    setFormPhotoUri(undefined);
    setFormCategory('personalGrowth');
    setFormInspiration('');
    setFormLessons([]);
    setFormNewLesson('');
    setFormQuote('');
    setIsModalVisible(true);
  }, []);

  /**
   * Open modal for editing
   */
  const handleEdit = useCallback((item: RoleModel) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setEditingItem(item);
    setFormName(item.name);
    setFormPhotoUri(item.photoUri);
    setFormCategory(item.category);
    setFormInspiration(item.inspiration);
    setFormLessons([...item.lessons]);
    setFormNewLesson('');
    setFormQuote(item.quote || '');
    setIsModalVisible(true);
  }, []);

  /**
   * Handle photo pick for existing item
   */
  const handlePickPhoto = useCallback((id: string) => {
    // Find the item and open modal for editing
    const item = roleModels.find((rm) => rm.id === id);
    if (item) {
      handleEdit(item);
      // Auto-trigger photo picker after modal opens
      setTimeout(pickImage, 500);
    }
  }, [roleModels, handleEdit, pickImage]);

  /**
   * Add lesson to form
   */
  const handleAddLesson = useCallback(() => {
    if (!formNewLesson.trim()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFormLessons((prev) => [...prev, formNewLesson.trim()]);
    setFormNewLesson('');
  }, [formNewLesson]);

  /**
   * Remove lesson from form
   */
  const handleRemoveLesson = useCallback((index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFormLessons((prev) => prev.filter((_, i) => i !== index));
  }, []);

  /**
   * Save item (create or update)
   */
  const handleSave = useCallback(() => {
    if (!formName.trim() || !formInspiration.trim()) {
      Alert.alert('Required Fields', 'Please fill in the name and what inspires you fields.');
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    const now = new Date().toISOString();
    if (editingItem) {
      // Update existing
      setRoleModels((prev) =>
        prev.map((item) =>
          item.id === editingItem.id
            ? {
                ...item,
                name: formName.trim(),
                photoUri: formPhotoUri,
                category: formCategory,
                inspiration: formInspiration.trim(),
                lessons: formLessons,
                quote: formQuote.trim() || undefined,
                updatedAt: now,
              }
            : item
        )
      );
    } else {
      // Create new
      const newItem: RoleModel = {
        id: generateId(),
        name: formName.trim(),
        photoUri: formPhotoUri,
        category: formCategory,
        inspiration: formInspiration.trim(),
        lessons: formLessons,
        quote: formQuote.trim() || undefined,
        createdAt: now,
        updatedAt: now,
      };
      setRoleModels((prev) => [newItem, ...prev]);
    }

    // Auto-save stub
    console.log('[RoleModels] Auto-save triggered:', { itemCount: roleModels.length + 1 });

    setIsModalVisible(false);
  }, [editingItem, formName, formPhotoUri, formCategory, formInspiration, formLessons, formQuote, roleModels.length]);

  /**
   * Delete item
   */
  const handleDelete = useCallback((id: string) => {
    setRoleModels((prev) => prev.filter((item) => item.id !== id));
    console.log('[RoleModels] Item deleted, auto-save triggered');
  }, []);

  /**
   * Render category filter chip
   */
  const renderCategoryChip = (key: RoleModelCategory | 'all', label: string, color: string) => {
    const isSelected = selectedCategory === key;
    return (
      <TouchableOpacity
        key={key}
        style={[
          styles.categoryChip,
          isSelected && { backgroundColor: color, borderColor: color },
        ]}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          setSelectedCategory(key);
        }}
        accessibilityRole="button"
        accessibilityLabel={`Filter by ${label}`}
        accessibilityState={{ selected: isSelected }}
        testID={`category-filter-${key}`}
      >
        <Text style={[styles.categoryChipText, isSelected && styles.categoryChipTextSelected]}>
          {label} ({categoryCounts[key] || 0})
        </Text>
      </TouchableOpacity>
    );
  };

  /**
   * Render empty state
   */
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateIcon}>{'\u{1F31F}'}</Text>
      <Text style={styles.emptyStateTitle}>Build Your Role Model Board</Text>
      <Text style={styles.emptyStateText}>
        Who inspires you? Document the people whose qualities you admire and
        what you can learn from them.
        {'\n\n'}
        Tap the + button to add your first role model.
      </Text>
    </View>
  );

  /**
   * Render item
   */
  const renderItem = ({ item }: { item: RoleModel }) => (
    <RoleModelCard
      roleModel={item}
      onEdit={() => handleEdit(item)}
      onDelete={() => handleDelete(item.id)}
      onPickPhoto={() => handlePickPhoto(item.id)}
      testID={`rolemodel-card-${item.id}`}
    />
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {/* Header Info */}
      <View style={styles.headerInfo}>
        <Text style={styles.headerTitle}>{'\u{1F31F}'} Role Models & Inspirations</Text>
        <Text style={styles.headerSubtitle}>
          Create a board of people who inspire you. Document what you admire and the lessons you can learn.
        </Text>
      </View>

      {/* Category Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContent}
      >
        {renderCategoryChip('all', 'All', colors.dark.accentPurple)}
        {Object.entries(ROLE_MODEL_CATEGORIES).map(([key, value]) =>
          renderCategoryChip(key as RoleModelCategory, value.label, value.color)
        )}
      </ScrollView>

      {/* Items List */}
      <FlatList
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
        testID="rolemodels-list"
      />

      {/* Add Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={handleAddNew}
        accessibilityRole="button"
        accessibilityLabel="Add new role model"
        testID="add-rolemodel-button"
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      {/* Add/Edit Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <SafeAreaView style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setIsModalVisible(false);
                }}
                testID="modal-cancel"
              >
                <Text style={styles.modalCancel}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>
                {editingItem ? 'Edit Role Model' : 'New Role Model'}
              </Text>
              <TouchableOpacity onPress={handleSave} testID="modal-save">
                <Text style={styles.modalSave}>Save</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              {/* Photo Picker */}
              <View style={styles.photoPickerContainer}>
                <TouchableOpacity
                  style={styles.photoPicker}
                  onPress={pickImage}
                  accessibilityRole="button"
                  accessibilityLabel="Pick a photo"
                  testID="form-photo-picker"
                >
                  {formPhotoUri ? (
                    <Image source={{ uri: formPhotoUri }} style={styles.photoPreview} />
                  ) : (
                    <View style={styles.photoPlaceholder}>
                      <Text style={styles.photoPlaceholderIcon}>{'\u{1F4F7}'}</Text>
                      <Text style={styles.photoPlaceholderText}>Add Photo</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>

              {/* Name Field */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Name *</Text>
                <TextInput
                  style={styles.textInput}
                  value={formName}
                  onChangeText={setFormName}
                  placeholder="e.g., Oprah Winfrey"
                  placeholderTextColor={colors.dark.textTertiary}
                  accessibilityLabel="Role model name"
                  testID="form-name"
                />
              </View>

              {/* Category Selector */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Category</Text>
                <View style={styles.categorySelector}>
                  {Object.entries(ROLE_MODEL_CATEGORIES).map(([key, value]) => (
                    <TouchableOpacity
                      key={key}
                      style={[
                        styles.categorySelectorItem,
                        formCategory === key && {
                          backgroundColor: `${value.color}30`,
                          borderColor: value.color,
                        },
                      ]}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setFormCategory(key as RoleModelCategory);
                      }}
                      testID={`form-category-${key}`}
                    >
                      <Text style={styles.categorySelectorIcon}>{value.icon}</Text>
                      <Text
                        style={[
                          styles.categorySelectorText,
                          formCategory === key && { color: value.color },
                        ]}
                      >
                        {value.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* What Inspires You Field */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>What inspires you about them? *</Text>
                <TextInput
                  style={[styles.textInput, styles.textInputMultiline]}
                  value={formInspiration}
                  onChangeText={setFormInspiration}
                  placeholder="What qualities do you admire? What have they achieved that inspires you?"
                  placeholderTextColor={colors.dark.textTertiary}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  accessibilityLabel="What inspires you"
                  testID="form-inspiration"
                />
              </View>

              {/* Lessons Learned */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Lessons Learned</Text>
                <View style={styles.lessonsContainer}>
                  {formLessons.map((lesson, index) => (
                    <View key={index} style={styles.lessonTag}>
                      <Text style={styles.lessonTagText}>{lesson}</Text>
                      <TouchableOpacity
                        onPress={() => handleRemoveLesson(index)}
                        style={styles.lessonRemove}
                        accessibilityLabel={`Remove lesson: ${lesson}`}
                      >
                        <Text style={styles.lessonRemoveText}>x</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
                <View style={styles.addLessonRow}>
                  <TextInput
                    style={[styles.textInput, styles.addLessonInput]}
                    value={formNewLesson}
                    onChangeText={setFormNewLesson}
                    placeholder="Add a lesson..."
                    placeholderTextColor={colors.dark.textTertiary}
                    onSubmitEditing={handleAddLesson}
                    returnKeyType="done"
                    testID="form-new-lesson"
                  />
                  <TouchableOpacity
                    style={styles.addLessonButton}
                    onPress={handleAddLesson}
                    disabled={!formNewLesson.trim()}
                    testID="form-add-lesson"
                  >
                    <Text style={styles.addLessonButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Quote Field */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Favorite Quote (Optional)</Text>
                <TextInput
                  style={[styles.textInput, styles.textInputMultiline]}
                  value={formQuote}
                  onChangeText={setFormQuote}
                  placeholder="A memorable quote from them..."
                  placeholderTextColor={colors.dark.textTertiary}
                  multiline
                  numberOfLines={2}
                  textAlignVertical="top"
                  accessibilityLabel="Favorite quote"
                  testID="form-quote"
                />
              </View>
            </ScrollView>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
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

  headerInfo: {
    padding: spacing.md,
    paddingBottom: spacing.sm,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.dark.textPrimary,
    marginBottom: spacing.xs,
  },

  headerSubtitle: {
    fontSize: 14,
    color: colors.dark.textSecondary,
    lineHeight: 20,
  },

  filtersContainer: {
    maxHeight: 50,
    marginBottom: spacing.sm,
  },

  filtersContent: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    flexDirection: 'row',
  },

  categoryChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.dark.textTertiary,
    backgroundColor: 'transparent',
  },

  categoryChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.dark.textSecondary,
  },

  categoryChipTextSelected: {
    color: colors.dark.bgPrimary,
  },

  listContent: {
    padding: spacing.md,
    paddingBottom: 100,
  },

  emptyState: {
    alignItems: 'center',
    paddingVertical: 96,
    paddingHorizontal: spacing.xl,
  },

  emptyStateIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },

  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.dark.textPrimary,
    marginBottom: spacing.sm,
  },

  emptyStateText: {
    fontSize: 14,
    color: colors.dark.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },

  addButton: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.md,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.dark.accentGold,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.lg,
  },

  addButtonText: {
    fontSize: 28,
    fontWeight: '400',
    color: colors.dark.bgPrimary,
    marginTop: -2,
  },

  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: colors.dark.bgPrimary,
  },

  modalContent: {
    flex: 1,
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: `${colors.dark.textTertiary}20`,
  },

  modalCancel: {
    fontSize: 16,
    color: colors.dark.textSecondary,
  },

  modalTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.dark.textPrimary,
  },

  modalSave: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark.accentGold,
  },

  modalScroll: {
    flex: 1,
    padding: spacing.md,
  },

  photoPickerContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },

  photoPicker: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
  },

  photoPreview: {
    width: '100%',
    height: '100%',
  },

  photoPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.dark.bgElevated,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.dark.textTertiary,
    borderRadius: 50,
  },

  photoPlaceholderIcon: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },

  photoPlaceholderText: {
    fontSize: 11,
    color: colors.dark.textTertiary,
  },

  formGroup: {
    marginBottom: spacing.lg,
  },

  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.dark.textPrimary,
    marginBottom: spacing.sm,
  },

  textInput: {
    backgroundColor: colors.dark.bgElevated,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: 15,
    color: colors.dark.textPrimary,
    borderWidth: 1,
    borderColor: `${colors.dark.textTertiary}30`,
  },

  textInputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },

  categorySelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },

  categorySelectorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: `${colors.dark.textTertiary}30`,
    gap: spacing.xs,
  },

  categorySelectorIcon: {
    fontSize: 16,
  },

  categorySelectorText: {
    fontSize: 13,
    color: colors.dark.textSecondary,
  },

  lessonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },

  lessonTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.dark.accentGold}20`,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    gap: spacing.xs,
  },

  lessonTagText: {
    fontSize: 13,
    color: colors.dark.textPrimary,
  },

  lessonRemove: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: `${colors.dark.textTertiary}40`,
    justifyContent: 'center',
    alignItems: 'center',
  },

  lessonRemoveText: {
    fontSize: 12,
    color: colors.dark.textPrimary,
    fontWeight: '600',
  },

  addLessonRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },

  addLessonInput: {
    flex: 1,
  },

  addLessonButton: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.dark.accentGold,
    justifyContent: 'center',
    alignItems: 'center',
  },

  addLessonButtonText: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.dark.bgPrimary,
  },
});

export default RoleModelsScreen;
