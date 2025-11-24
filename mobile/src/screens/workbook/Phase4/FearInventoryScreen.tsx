/**
 * Fear Inventory Screen
 *
 * Phase 4 screen for identifying and cataloging fears.
 * Helps users recognize patterns and rate intensity of their fears.
 *
 * Features:
 * - List view of fears with category badges
 * - Add fear modal with text input and category picker
 * - Intensity slider (1-10) per fear
 * - Tips card about facing fears
 * - Auto-save with debounce (stubbed for Supabase)
 * - Dark spiritual theme
 *
 * @example
 * Navigation: WorkbookNavigator -> FearInventory
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Text } from '../../../components';
import FearCard, { Fear, FearCategory, FEAR_CATEGORIES } from '../../../components/workbook/FearCard';
import { colors, spacing, borderRadius, shadows } from '../../../theme';
import type { WorkbookStackScreenProps } from '../../../types/navigation';

/**
 * Generate unique ID
 */
const generateId = (): string => {
  return `fear_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Sample fears for demonstration
 */
const SAMPLE_FEARS: Fear[] = [
  {
    id: 'sample_1',
    text: 'Fear of not being financially secure in retirement',
    category: 'financial',
    intensity: 7,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'sample_2',
    text: 'Fear of being rejected by people I care about',
    category: 'relationships',
    intensity: 6,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

type Props = WorkbookStackScreenProps<'FearInventory'>;

/**
 * Fear Inventory Screen Component
 */
const FearInventoryScreen: React.FC<Props> = ({ navigation: _navigation }) => {
  // State
  const [fears, setFears] = useState<Fear[]>(SAMPLE_FEARS);
  const [showModal, setShowModal] = useState(false);
  const [editingFear, setEditingFear] = useState<Fear | null>(null);
  const [fearText, setFearText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FearCategory>('selfWorth');
  const [filterCategory, setFilterCategory] = useState<FearCategory | 'all'>('all');

  // Animation refs
  const fabScale = useRef(new Animated.Value(1)).current;

  // Auto-save debounce timer
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Trigger auto-save (stubbed for Supabase)
   */
  const triggerAutoSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      // TODO: Save to Supabase
      console.log('[FearInventory] Auto-saving fears...', new Date().toISOString());
    }, 2000);
  }, []);

  /**
   * Handle adding a new fear
   */
  const handleAddFear = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // FAB animation
    Animated.sequence([
      Animated.timing(fabScale, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(fabScale, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 5,
      }),
    ]).start();

    setEditingFear(null);
    setFearText('');
    setSelectedCategory('selfWorth');
    setShowModal(true);
  }, [fabScale]);

  /**
   * Handle editing an existing fear
   */
  const handleEditFear = useCallback((fear: Fear) => {
    setEditingFear(fear);
    setFearText(fear.text);
    setSelectedCategory(fear.category);
    setShowModal(true);
  }, []);

  /**
   * Handle saving a fear
   */
  const handleSaveFear = useCallback(() => {
    if (!fearText.trim()) {
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const now = new Date().toISOString();

    if (editingFear) {
      // Update existing fear
      setFears(prev => prev.map(f =>
        f.id === editingFear.id
          ? { ...f, text: fearText.trim(), category: selectedCategory, updatedAt: now }
          : f
      ));
    } else {
      // Create new fear
      const newFear: Fear = {
        id: generateId(),
        text: fearText.trim(),
        category: selectedCategory,
        intensity: 5,
        createdAt: now,
        updatedAt: now,
      };
      setFears(prev => [newFear, ...prev]);
    }

    setShowModal(false);
    setEditingFear(null);
    setFearText('');
    triggerAutoSave();
  }, [fearText, selectedCategory, editingFear, triggerAutoSave]);

  /**
   * Handle intensity change
   */
  const handleIntensityChange = useCallback((fearId: string, intensity: number) => {
    setFears(prev => prev.map(f =>
      f.id === fearId
        ? { ...f, intensity, updatedAt: new Date().toISOString() }
        : f
    ));
    triggerAutoSave();
  }, [triggerAutoSave]);

  /**
   * Handle delete
   */
  const handleDeleteFear = useCallback((fearId: string) => {
    setFears(prev => prev.filter(f => f.id !== fearId));
    triggerAutoSave();
  }, [triggerAutoSave]);

  /**
   * Filter fears by category
   */
  const filteredFears = filterCategory === 'all'
    ? fears
    : fears.filter(f => f.category === filterCategory);

  /**
   * Calculate stats
   */
  const stats = {
    total: fears.length,
    highIntensity: fears.filter(f => f.intensity >= 7).length,
    avgIntensity: fears.length > 0
      ? Math.round(fears.reduce((sum, f) => sum + f.intensity, 0) / fears.length)
      : 0,
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.phaseLabel}>Phase 4</Text>
          <Text style={styles.title}>Fear Inventory</Text>
          <Text style={styles.subtitle}>
            Identify and acknowledge your fears to begin the process of overcoming them
          </Text>

          {/* Decorative divider */}
          <View style={styles.headerDivider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerStar}>{'\u2726'}</Text>
            <View style={styles.dividerLine} />
          </View>
        </View>

        {/* Stats Card */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total Fears</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.error[500] }]}>
              {stats.highIntensity}
            </Text>
            <Text style={styles.statLabel}>High Intensity</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.dark.accentGold }]}>
              {stats.avgIntensity}
            </Text>
            <Text style={styles.statLabel}>Avg Intensity</Text>
          </View>
        </View>

        {/* Category Filter */}
        <View style={styles.filterContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
          >
            <TouchableOpacity
              style={[
                styles.filterChip,
                filterCategory === 'all' && styles.filterChipActive,
              ]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setFilterCategory('all');
              }}
              accessibilityRole="button"
              accessibilityState={{ selected: filterCategory === 'all' }}
              testID="filter-all"
            >
              <Text style={[
                styles.filterText,
                filterCategory === 'all' && styles.filterTextActive,
              ]}>
                All
              </Text>
            </TouchableOpacity>

            {(Object.keys(FEAR_CATEGORIES) as FearCategory[]).map(cat => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.filterChip,
                  filterCategory === cat && styles.filterChipActive,
                  filterCategory === cat && { borderColor: FEAR_CATEGORIES[cat].color },
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setFilterCategory(cat);
                }}
                accessibilityRole="button"
                accessibilityState={{ selected: filterCategory === cat }}
                testID={`filter-${cat}`}
              >
                <Text style={styles.filterIcon}>{FEAR_CATEGORIES[cat].icon}</Text>
                <Text style={[
                  styles.filterText,
                  filterCategory === cat && styles.filterTextActive,
                ]}>
                  {FEAR_CATEGORIES[cat].label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Fears List */}
        <View style={styles.fearsContainer}>
          {filteredFears.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>{'\uD83D\uDC99'}</Text>
              <Text style={styles.emptyTitle}>No fears recorded</Text>
              <Text style={styles.emptySubtitle}>
                {filterCategory === 'all'
                  ? 'Tap the + button to add your first fear'
                  : `No fears in ${FEAR_CATEGORIES[filterCategory as FearCategory].label} category`}
              </Text>
            </View>
          ) : (
            filteredFears.map(fear => (
              <FearCard
                key={fear.id}
                fear={fear}
                onIntensityChange={(intensity) => handleIntensityChange(fear.id, intensity)}
                onEdit={() => handleEditFear(fear)}
                onDelete={() => handleDeleteFear(fear.id)}
                testID={`fear-card-${fear.id}`}
              />
            ))
          )}
        </View>

        {/* Tips Card */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>{'\uD83D\uDCA1'} Tips for Facing Fears</Text>
          <View style={styles.tipsList}>
            {[
              'Acknowledge your fears without judgment',
              'Break down overwhelming fears into smaller parts',
              'Use gradual exposure to build tolerance',
              'Practice self-compassion when facing difficult emotions',
              'Celebrate small victories along the way',
            ].map((tip, index) => (
              <View key={index} style={styles.tipRow}>
                <Text style={styles.tipBullet}>{'\u2022'}</Text>
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Inspirational Quote */}
        <View style={styles.quoteContainer}>
          <Text style={styles.quoteText}>
            "Everything you want is on the other side of fear."
          </Text>
          <Text style={styles.quoteAuthor}>- Jack Canfield</Text>
        </View>

        {/* Bottom Spacer for FAB */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Floating Action Button */}
      <Animated.View
        style={[
          styles.fabContainer,
          { transform: [{ scale: fabScale }] },
        ]}
      >
        <TouchableOpacity
          style={styles.fab}
          onPress={handleAddFear}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Add new fear"
          accessibilityHint="Opens form to add a new fear to your inventory"
          testID="add-fear-fab"
        >
          <Text style={styles.fabIcon}>+</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Add/Edit Fear Modal */}
      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingFear ? 'Edit Fear' : 'Add Fear'}
              </Text>
              <TouchableOpacity
                onPress={() => setShowModal(false)}
                accessibilityRole="button"
                accessibilityLabel="Close"
                testID="modal-close"
              >
                <Text style={styles.modalClose}>{'\u00D7'}</Text>
              </TouchableOpacity>
            </View>

            {/* Fear Text Input */}
            <Text style={styles.inputLabel}>What fear are you facing?</Text>
            <TextInput
              style={styles.textInput}
              value={fearText}
              onChangeText={setFearText}
              placeholder="Describe your fear..."
              placeholderTextColor={colors.dark.textTertiary}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              accessibilityLabel="Fear description"
              testID="fear-text-input"
            />

            {/* Category Picker */}
            <Text style={styles.inputLabel}>Category</Text>
            <View style={styles.categoryPicker}>
              {(Object.keys(FEAR_CATEGORIES) as FearCategory[]).map(cat => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryOption,
                    selectedCategory === cat && styles.categoryOptionActive,
                    selectedCategory === cat && { borderColor: FEAR_CATEGORIES[cat].color },
                  ]}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setSelectedCategory(cat);
                  }}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: selectedCategory === cat }}
                  testID={`category-${cat}`}
                >
                  <Text style={styles.categoryOptionIcon}>{FEAR_CATEGORIES[cat].icon}</Text>
                  <Text style={[
                    styles.categoryOptionText,
                    selectedCategory === cat && { color: FEAR_CATEGORIES[cat].color },
                  ]}>
                    {FEAR_CATEGORIES[cat].label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Action Buttons */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowModal(false)}
                accessibilityRole="button"
                accessibilityLabel="Cancel"
                testID="modal-cancel"
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveButton, !fearText.trim() && styles.saveButtonDisabled]}
                onPress={handleSaveFear}
                disabled={!fearText.trim()}
                accessibilityRole="button"
                accessibilityLabel="Save fear"
                testID="modal-save"
              >
                <Text style={styles.saveButtonText}>
                  {editingFear ? 'Update' : 'Add Fear'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
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
    marginBottom: spacing.lg,
    alignItems: 'center',
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
    lineHeight: 22,
    paddingHorizontal: spacing.md,
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

  dividerStar: {
    fontSize: 14,
    color: colors.dark.accentGold,
    marginHorizontal: spacing.sm,
  },

  statsCard: {
    backgroundColor: colors.dark.bgElevated,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: spacing.md,
    ...shadows.sm,
  },

  statItem: {
    alignItems: 'center',
    flex: 1,
  },

  statNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.dark.textPrimary,
  },

  statLabel: {
    fontSize: 11,
    color: colors.dark.textSecondary,
    marginTop: 2,
    textAlign: 'center',
  },

  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: `${colors.dark.textTertiary}30`,
  },

  filterContainer: {
    marginBottom: spacing.md,
  },

  filterScroll: {
    paddingVertical: spacing.xs,
    gap: spacing.sm,
    flexDirection: 'row',
  },

  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.dark.bgElevated,
    borderWidth: 1,
    borderColor: 'transparent',
    gap: spacing.xs,
  },

  filterChipActive: {
    borderColor: colors.dark.accentGold,
    backgroundColor: `${colors.dark.accentGold}15`,
  },

  filterIcon: {
    fontSize: 14,
  },

  filterText: {
    fontSize: 13,
    color: colors.dark.textSecondary,
    fontWeight: '500',
  },

  filterTextActive: {
    color: colors.dark.textPrimary,
    fontWeight: '600',
  },

  fearsContainer: {
    marginBottom: spacing.md,
  },

  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl * 2,
  },

  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.dark.textPrimary,
    marginBottom: spacing.xs,
  },

  emptySubtitle: {
    fontSize: 14,
    color: colors.dark.textSecondary,
    textAlign: 'center',
    maxWidth: 250,
  },

  tipsCard: {
    backgroundColor: colors.dark.bgElevated,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },

  tipsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.dark.textPrimary,
    marginBottom: spacing.md,
  },

  tipsList: {
    gap: spacing.sm,
  },

  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  tipBullet: {
    fontSize: 14,
    color: colors.dark.accentGold,
    marginRight: spacing.sm,
    lineHeight: 20,
  },

  tipText: {
    flex: 1,
    fontSize: 14,
    color: colors.dark.textSecondary,
    lineHeight: 20,
  },

  quoteContainer: {
    paddingHorizontal: spacing.lg,
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

  quoteAuthor: {
    fontSize: 12,
    color: colors.dark.textTertiary,
    marginTop: spacing.xs,
  },

  bottomSpacer: {
    height: 100,
  },

  fabContainer: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.lg,
    ...shadows.lg,
  },

  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.dark.accentGold,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.md,
  },

  fabIcon: {
    fontSize: 32,
    fontWeight: '300',
    color: colors.dark.bgPrimary,
    lineHeight: 34,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },

  modalContent: {
    backgroundColor: colors.dark.bgElevated,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.lg,
    maxHeight: '80%',
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.dark.textPrimary,
  },

  modalClose: {
    fontSize: 28,
    color: colors.dark.textTertiary,
    fontWeight: '300',
    lineHeight: 28,
  },

  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.dark.textPrimary,
    marginBottom: spacing.sm,
  },

  textInput: {
    backgroundColor: colors.dark.bgPrimary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: 16,
    color: colors.dark.textPrimary,
    minHeight: 100,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: `${colors.dark.textTertiary}30`,
  },

  categoryPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },

  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.dark.bgPrimary,
    borderWidth: 1,
    borderColor: `${colors.dark.textTertiary}30`,
    gap: spacing.xs,
  },

  categoryOptionActive: {
    backgroundColor: `${colors.dark.accentGold}15`,
  },

  categoryOptionIcon: {
    fontSize: 14,
  },

  categoryOptionText: {
    fontSize: 13,
    color: colors.dark.textSecondary,
    fontWeight: '500',
  },

  modalActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },

  cancelButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: `${colors.dark.textTertiary}20`,
    alignItems: 'center',
  },

  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark.textSecondary,
  },

  saveButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.dark.accentGold,
    alignItems: 'center',
  },

  saveButtonDisabled: {
    opacity: 0.5,
  },

  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark.bgPrimary,
  },
});

export default FearInventoryScreen;
