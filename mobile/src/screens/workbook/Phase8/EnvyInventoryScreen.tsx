/**
 * EnvyInventoryScreen
 *
 * Phase 8: Turning Envy Into Inspiration - Exercise 1
 *
 * This screen allows users to create an inventory of things they feel
 * envious about, categorize them, rate their intensity, and reflect
 * on what these envies reveal about their deeper desires.
 *
 * Features:
 * - Add/edit/delete envy items
 * - Category filtering
 * - Intensity slider (1-10)
 * - Reflection prompts
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Text } from '../../../components/Text';
import { EnvyCard, ENVY_CATEGORIES, EnvyItem, EnvyCategory } from '../../../components/workbook/EnvyCard';
import { IntensitySlider } from '../../../components/workbook/IntensitySlider';
import { colors, spacing, borderRadius, shadows } from '../../../theme';
import type { WorkbookStackScreenProps } from '../../../types/navigation';

type Props = WorkbookStackScreenProps<'EnvyInventory'>;

/**
 * Generate a unique ID
 */
const generateId = (): string => {
  return `envy_${Date.now()}_${Math.random().toString(36).substring(7)}`;
};

/**
 * EnvyInventoryScreen Component
 */
const EnvyInventoryScreen: React.FC<Props> = ({ navigation }) => {
  // State
  const [envyItems, setEnvyItems] = useState<EnvyItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<EnvyCategory | 'all'>('all');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<EnvyItem | null>(null);

  // Form state
  const [formWhoWhat, setFormWhoWhat] = useState('');
  const [formTrigger, setFormTrigger] = useState('');
  const [formCategory, setFormCategory] = useState<EnvyCategory>('success');
  const [formIntensity, setFormIntensity] = useState(5);
  const [formReflection, setFormReflection] = useState('');

  /**
   * Filter items by category
   */
  const filteredItems = useMemo(() => {
    if (selectedCategory === 'all') {
      return envyItems;
    }
    return envyItems.filter((item) => item.category === selectedCategory);
  }, [envyItems, selectedCategory]);

  /**
   * Get count per category
   */
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: envyItems.length };
    Object.keys(ENVY_CATEGORIES).forEach((cat) => {
      counts[cat] = envyItems.filter((item) => item.category === cat).length;
    });
    return counts;
  }, [envyItems]);

  /**
   * Open modal for new item
   */
  const handleAddNew = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setEditingItem(null);
    setFormWhoWhat('');
    setFormTrigger('');
    setFormCategory('success');
    setFormIntensity(5);
    setFormReflection('');
    setIsModalVisible(true);
  }, []);

  /**
   * Open modal for editing
   */
  const handleEdit = useCallback((item: EnvyItem) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setEditingItem(item);
    setFormWhoWhat(item.whoWhat);
    setFormTrigger(item.trigger);
    setFormCategory(item.category);
    setFormIntensity(item.intensity);
    setFormReflection(item.reflection || '');
    setIsModalVisible(true);
  }, []);

  /**
   * Save item (create or update)
   */
  const handleSave = useCallback(() => {
    if (!formWhoWhat.trim() || !formTrigger.trim()) {
      Alert.alert('Required Fields', 'Please fill in who/what and trigger fields.');
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    const now = new Date().toISOString();
    if (editingItem) {
      // Update existing
      setEnvyItems((prev) =>
        prev.map((item) =>
          item.id === editingItem.id
            ? {
                ...item,
                whoWhat: formWhoWhat.trim(),
                trigger: formTrigger.trim(),
                category: formCategory,
                intensity: formIntensity,
                reflection: formReflection.trim() || undefined,
                updatedAt: now,
              }
            : item
        )
      );
    } else {
      // Create new
      const newItem: EnvyItem = {
        id: generateId(),
        whoWhat: formWhoWhat.trim(),
        trigger: formTrigger.trim(),
        category: formCategory,
        intensity: formIntensity,
        reflection: formReflection.trim() || undefined,
        createdAt: now,
        updatedAt: now,
      };
      setEnvyItems((prev) => [newItem, ...prev]);
    }

    // Auto-save stub
    console.log('[EnvyInventory] Auto-save triggered:', { itemCount: envyItems.length + 1 });

    setIsModalVisible(false);
  }, [editingItem, formWhoWhat, formTrigger, formCategory, formIntensity, formReflection, envyItems.length]);

  /**
   * Delete item
   */
  const handleDelete = useCallback((id: string) => {
    setEnvyItems((prev) => prev.filter((item) => item.id !== id));
    console.log('[EnvyInventory] Item deleted, auto-save triggered');
  }, []);

  /**
   * Update intensity inline
   */
  const handleIntensityChange = useCallback((id: string, intensity: number) => {
    setEnvyItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, intensity, updatedAt: new Date().toISOString() }
          : item
      )
    );
    console.log('[EnvyInventory] Intensity updated, auto-save triggered');
  }, []);

  /**
   * Render category filter chip
   */
  const renderCategoryChip = (key: EnvyCategory | 'all', label: string, color: string) => {
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
      <Text style={styles.emptyStateIcon}>{'\u{1F50D}'}</Text>
      <Text style={styles.emptyStateTitle}>Begin Your Inventory</Text>
      <Text style={styles.emptyStateText}>
        Identifying what triggers envy is the first step to transforming it into inspiration.
        {'\n\n'}
        Tap the + button to add your first entry.
      </Text>
    </View>
  );

  /**
   * Render item
   */
  const renderItem = ({ item }: { item: EnvyItem }) => (
    <EnvyCard
      envy={item}
      onIntensityChange={(intensity) => handleIntensityChange(item.id, intensity)}
      onEdit={() => handleEdit(item)}
      onDelete={() => handleDelete(item.id)}
      testID={`envy-card-${item.id}`}
    />
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {/* Header Info */}
      <View style={styles.headerInfo}>
        <Text style={styles.headerTitle}>{'\u{1F52E}'} Envy Inventory</Text>
        <Text style={styles.headerSubtitle}>
          What do you find yourself envious of? Awareness is the first step to transformation.
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
        {Object.entries(ENVY_CATEGORIES).map(([key, value]) =>
          renderCategoryChip(key as EnvyCategory, value.label, value.color)
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
        testID="envy-list"
      />

      {/* Add Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={handleAddNew}
        accessibilityRole="button"
        accessibilityLabel="Add new envy item"
        testID="add-envy-button"
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
                {editingItem ? 'Edit Entry' : 'New Entry'}
              </Text>
              <TouchableOpacity onPress={handleSave} testID="modal-save">
                <Text style={styles.modalSave}>Save</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              {/* Who/What Field */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Who or what are you envious of? *</Text>
                <TextInput
                  style={styles.textInput}
                  value={formWhoWhat}
                  onChangeText={setFormWhoWhat}
                  placeholder="e.g., My colleague's promotion"
                  placeholderTextColor={colors.dark.textTertiary}
                  accessibilityLabel="Who or what you're envious of"
                  testID="form-who-what"
                />
              </View>

              {/* Trigger Field */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>What specifically triggers this envy? *</Text>
                <TextInput
                  style={[styles.textInput, styles.textInputMultiline]}
                  value={formTrigger}
                  onChangeText={setFormTrigger}
                  placeholder="e.g., Seeing their success on social media"
                  placeholderTextColor={colors.dark.textTertiary}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  accessibilityLabel="What triggers your envy"
                  testID="form-trigger"
                />
              </View>

              {/* Category Selector */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Category</Text>
                <View style={styles.categorySelector}>
                  {Object.entries(ENVY_CATEGORIES).map(([key, value]) => (
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
                        setFormCategory(key as EnvyCategory);
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

              {/* Intensity Slider */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>How intense is this envy?</Text>
                <IntensitySlider
                  value={formIntensity}
                  onValueChange={setFormIntensity}
                  label="Intensity"
                  testID="form-intensity"
                />
              </View>

              {/* Reflection Field */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>
                  {'\u{1F4A1}'} What does this envy reveal about your desires?
                </Text>
                <TextInput
                  style={[styles.textInput, styles.textInputMultiline]}
                  value={formReflection}
                  onChangeText={setFormReflection}
                  placeholder="Take a moment to reflect... What deeper need or value is this envy pointing to?"
                  placeholderTextColor={colors.dark.textTertiary}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  accessibilityLabel="Reflection on what this envy reveals"
                  testID="form-reflection"
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
    paddingVertical: spacing.xxl,
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
    minHeight: 100,
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
});

export default EnvyInventoryScreen;
