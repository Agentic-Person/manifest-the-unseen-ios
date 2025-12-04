/**
 * SelfLoveAffirmationsScreen
 *
 * Phase 5 screen for daily affirmation practice and self-love cultivation.
 * Features beautiful affirmation display, favorites, custom affirmations,
 * mirror practice timer, and category filtering.
 *
 * Design: Dark spiritual theme with nurturing, warm accents
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
  Dimensions,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import type { WorkbookStackScreenProps } from '../../../types/navigation';
import AffirmationCard, {
  AffirmationData,
  AffirmationCategory,
} from '../../../components/workbook/AffirmationCard';
import { useWorkbookProgress } from '../../../hooks/useWorkbook';
import { useAutoSave } from '../../../hooks/useAutoSave';
import { WORKSHEET_IDS } from '../../../types/workbook';
import { SaveIndicator, ExerciseHeader } from '../../../components/workbook';
import { Phase5ExerciseImages } from '../../../assets';

const { width: _SCREEN_WIDTH } = Dimensions.get('window');

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
  accentRose: '#8b3a5f',
  border: '#3a3a5a',
};

/**
 * Category filter options
 */
const CATEGORIES: { key: AffirmationCategory | 'all' | 'favorites'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'favorites', label: 'Favorites' },
  { key: 'self-worth', label: 'Self-Worth' },
  { key: 'body-love', label: 'Body Love' },
  { key: 'inner-peace', label: 'Inner Peace' },
  { key: 'confidence', label: 'Confidence' },
  { key: 'abundance', label: 'Abundance' },
];

/**
 * Default affirmations library
 */
const DEFAULT_AFFIRMATIONS: Omit<AffirmationData, 'isFavorite'>[] = [
  // Self-Worth
  { id: 'sw1', text: 'I am worthy of love and belonging exactly as I am.', category: 'self-worth', isCustom: false, createdAt: '' },
  { id: 'sw2', text: 'My worth is not determined by my productivity or achievements.', category: 'self-worth', isCustom: false, createdAt: '' },
  { id: 'sw3', text: 'I deserve respect, kindness, and compassion from myself and others.', category: 'self-worth', isCustom: false, createdAt: '' },
  { id: 'sw4', text: 'I am enough, just as I am, in this very moment.', category: 'self-worth', isCustom: false, createdAt: '' },

  // Body Love
  { id: 'bl1', text: 'My body is my home, and I treat it with love and gratitude.', category: 'body-love', isCustom: false, createdAt: '' },
  { id: 'bl2', text: 'I am grateful for all that my body does for me every day.', category: 'body-love', isCustom: false, createdAt: '' },
  { id: 'bl3', text: 'I release all negative thoughts about my body and embrace my unique beauty.', category: 'body-love', isCustom: false, createdAt: '' },
  { id: 'bl4', text: 'My body deserves nourishment, rest, and gentle care.', category: 'body-love', isCustom: false, createdAt: '' },

  // Inner Peace
  { id: 'ip1', text: 'I release what I cannot control and find peace in this moment.', category: 'inner-peace', isCustom: false, createdAt: '' },
  { id: 'ip2', text: 'My inner calm is stronger than any external chaos.', category: 'inner-peace', isCustom: false, createdAt: '' },
  { id: 'ip3', text: 'I breathe in peace, I breathe out tension.', category: 'inner-peace', isCustom: false, createdAt: '' },
  { id: 'ip4', text: 'I choose serenity over stress, love over fear, peace over anxiety.', category: 'inner-peace', isCustom: false, createdAt: '' },

  // Confidence
  { id: 'cf1', text: 'I trust myself to make the right decisions for my life.', category: 'confidence', isCustom: false, createdAt: '' },
  { id: 'cf2', text: 'My voice matters, and I speak my truth with confidence.', category: 'confidence', isCustom: false, createdAt: '' },
  { id: 'cf3', text: 'I am capable of achieving everything I set my mind to.', category: 'confidence', isCustom: false, createdAt: '' },
  { id: 'cf4', text: 'Every challenge I face is an opportunity to grow stronger.', category: 'confidence', isCustom: false, createdAt: '' },

  // Abundance
  { id: 'ab1', text: 'I am open to receiving abundance in all forms.', category: 'abundance', isCustom: false, createdAt: '' },
  { id: 'ab2', text: 'The universe supports my dreams and provides for my needs.', category: 'abundance', isCustom: false, createdAt: '' },
  { id: 'ab3', text: 'I attract positive energy, opportunities, and loving people.', category: 'abundance', isCustom: false, createdAt: '' },
  { id: 'ab4', text: 'Abundance flows freely to me and through me.', category: 'abundance', isCustom: false, createdAt: '' },
];

/**
 * Generate unique ID
 */
const generateId = (): string => {
  return `aff_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

type Props = WorkbookStackScreenProps<'SelfLoveAffirmations'>;

/**
 * SelfLoveAffirmationsScreen Component
 */
/**
 * Interface for form data to save
 */
interface AffirmationsFormData {
  affirmations: AffirmationData[];
  favorites: string[];
  customAffirmations: AffirmationData[];
}

const SelfLoveAffirmationsScreen: React.FC<Props> = ({ navigation: _navigation }) => {
  // State
  const [affirmations, setAffirmations] = useState<AffirmationData[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<AffirmationCategory | 'all' | 'favorites'>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAffirmationText, setNewAffirmationText] = useState('');
  const [newAffirmationCategory, setNewAffirmationCategory] = useState<AffirmationCategory>('self-worth');
  const [showMirrorTimer, setShowMirrorTimer] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [timerRunning, setTimerRunning] = useState(false);

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Supabase hooks
  const { data: savedProgress, isLoading, isError: isLoadError, error: loadError } = useWorkbookProgress(5, WORKSHEET_IDS.SELF_LOVE_AFFIRMATIONS);

  // Prepare form data for auto-save
  const formData: AffirmationsFormData = useMemo(() => ({
    affirmations: affirmations,
    favorites: affirmations.filter(a => a.isFavorite).map(a => a.id),
    customAffirmations: affirmations.filter(a => a.isCustom),
  }), [affirmations]);

  const { isSaving, lastSaved, saveNow } = useAutoSave({
    data: formData as unknown as Record<string, unknown>,
    phaseNumber: 5,
    worksheetId: WORKSHEET_IDS.SELF_LOVE_AFFIRMATIONS,
    debounceMs: 1500,
  });

  /**
   * Load saved progress
   */
  useEffect(() => {
    // Only initialize once when loading completes
    if (isLoading) return;

    if (savedProgress?.data) {
      const data = savedProgress.data as unknown as AffirmationsFormData;
      // Merge saved data with defaults
      const favoriteIds = new Set(data.favorites || []);
      const customAffs = data.customAffirmations || [];

      const initialized: AffirmationData[] = DEFAULT_AFFIRMATIONS.map((a) => ({
        ...a,
        isFavorite: favoriteIds.has(a.id),
        createdAt: new Date().toISOString(),
      }));

      // Add custom affirmations
      const customWithFavorites = customAffs.map(ca => ({
        ...ca,
        isFavorite: favoriteIds.has(ca.id),
      }));

      setAffirmations([...customWithFavorites, ...initialized]);
    } else {
      // Initialize with defaults if no saved data
      const initialized: AffirmationData[] = DEFAULT_AFFIRMATIONS.map((a) => ({
        ...a,
        isFavorite: false,
        createdAt: new Date().toISOString(),
      }));
      setAffirmations(initialized);
    }
  }, [savedProgress, isLoading]);

  /**
   * Cleanup timer on unmount
   */
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

  /**
   * Filter affirmations based on selected category
   */
  const filteredAffirmations = useMemo(() => {
    if (selectedCategory === 'all') {
      return affirmations;
    }
    if (selectedCategory === 'favorites') {
      return affirmations.filter((a) => a.isFavorite);
    }
    return affirmations.filter((a) => a.category === selectedCategory);
  }, [affirmations, selectedCategory]);

  /**
   * Current affirmation to display
   */
  const currentAffirmation = filteredAffirmations[currentIndex] || null;


  /**
   * Handle category change
   */
  const handleCategoryChange = (category: AffirmationCategory | 'all' | 'favorites') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedCategory(category);
    setCurrentIndex(0);
  };

  /**
   * Navigate to next affirmation with animation
   */
  const handleNext = useCallback(() => {
    if (filteredAffirmations.length <= 1) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -50,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrentIndex((prev) => (prev + 1) % filteredAffirmations.length);
      slideAnim.setValue(50);

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }, [filteredAffirmations.length, fadeAnim, slideAnim]);

  /**
   * Navigate to previous affirmation
   */
  const handlePrevious = useCallback(() => {
    if (filteredAffirmations.length <= 1) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 50,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrentIndex((prev) =>
        prev === 0 ? filteredAffirmations.length - 1 : prev - 1
      );
      slideAnim.setValue(-50);

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }, [filteredAffirmations.length, fadeAnim, slideAnim]);

  /**
   * Toggle favorite status
   */
  const handleToggleFavorite = useCallback((id: string) => {
    setAffirmations((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, isFavorite: !a.isFavorite } : a
      )
    );
  }, []);

  /**
   * Add custom affirmation
   */
  const handleAddAffirmation = () => {
    if (!newAffirmationText.trim()) {
      Alert.alert('Empty Affirmation', 'Please enter your affirmation.');
      return;
    }

    const newAffirmation: AffirmationData = {
      id: generateId(),
      text: newAffirmationText.trim(),
      category: newAffirmationCategory,
      isFavorite: false,
      isCustom: true,
      createdAt: new Date().toISOString(),
    };

    setAffirmations((prev) => [newAffirmation, ...prev]);
    setShowAddModal(false);
    setNewAffirmationText('');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  /**
   * Start mirror practice timer
   */
  const handleStartMirrorTimer = () => {
    setShowMirrorTimer(true);
    setTimerSeconds(60);
    setTimerRunning(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    timerIntervalRef.current = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
          }
          setTimerRunning(false);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  /**
   * Stop mirror timer
   */
  const handleStopTimer = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    setTimerRunning(false);
    setShowMirrorTimer(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  /**
   * Format timer display
   */
  const formatTimer = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Error state
  if (isLoadError) {
    console.error('[SelfLoveAffirmationsScreen] Failed to load progress:', loadError);
    // Continue with default data instead of blocking the UI
  }

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={50} color={DESIGN_COLORS.accentGold} />
        <Text style={styles.loadingText}>Loading affirmations...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      testID="self-love-affirmations-screen"
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <ExerciseHeader
          image={Phase5ExerciseImages.affirmations}
          title="Self-Love Affirmations"
          subtitle="Speak kindness to yourself. These words have the power to transform your inner dialogue."
          progress={savedProgress?.completed ? 100 : 0}
        />

        {/* Category Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryContainer}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.key}
              style={[
                styles.categoryChip,
                selectedCategory === cat.key && styles.categoryChipActive,
              ]}
              onPress={() => handleCategoryChange(cat.key)}
              accessibilityRole="button"
              accessibilityState={{ selected: selectedCategory === cat.key }}
              accessibilityLabel={`Filter by ${cat.label}`}
              testID={`category-${cat.key}`}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  selectedCategory === cat.key && styles.categoryChipTextActive,
                ]}
              >
                {cat.key === 'favorites' ? '\u2665 ' : ''}{cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Current Affirmation Card */}
        {currentAffirmation ? (
          <Animated.View
            style={[
              styles.affirmationContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateX: slideAnim }],
              },
            ]}
          >
            <AffirmationCard
              affirmation={currentAffirmation}
              onToggleFavorite={handleToggleFavorite}
              size="medium"
            />
          </Animated.View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>{'\u2764'}</Text>
            <Text style={styles.emptyText}>
              {selectedCategory === 'favorites'
                ? 'No favorites yet. Tap the heart on affirmations you love.'
                : 'No affirmations in this category.'}
            </Text>
          </View>
        )}

        {/* Navigation Arrows */}
        {filteredAffirmations.length > 1 && (
          <View style={styles.navigationContainer}>
            <TouchableOpacity
              style={styles.navButton}
              onPress={handlePrevious}
              accessibilityRole="button"
              accessibilityLabel="Previous affirmation"
              testID="prev-affirmation"
            >
              <Text style={styles.navButtonText}>{'\u2190'}</Text>
            </TouchableOpacity>

            <Text style={styles.counterText}>
              {currentIndex + 1} / {filteredAffirmations.length}
            </Text>

            <TouchableOpacity
              style={styles.navButton}
              onPress={handleNext}
              accessibilityRole="button"
              accessibilityLabel="Next affirmation"
              testID="next-affirmation"
            >
              <Text style={styles.navButtonText}>{'\u2192'}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleStartMirrorTimer}
            accessibilityRole="button"
            accessibilityLabel="Start mirror practice timer"
            testID="mirror-timer-button"
          >
            <Text style={styles.actionButtonIcon}>{'\u{1F4AB}'}</Text>
            <Text style={styles.actionButtonText}>Mirror Practice</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.actionButtonSecondary]}
            onPress={() => setShowAddModal(true)}
            accessibilityRole="button"
            accessibilityLabel="Add custom affirmation"
            testID="add-affirmation-button"
          >
            <Text style={styles.actionButtonIcon}>+</Text>
            <Text style={styles.actionButtonText}>Add Your Own</Text>
          </TouchableOpacity>
        </View>

        {/* Tips Card */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>Mirror Practice Guide</Text>
          <Text style={styles.tipItem}>{'\u2022'} Stand before a mirror and look into your eyes</Text>
          <Text style={styles.tipItem}>{'\u2022'} Speak the affirmation slowly and with feeling</Text>
          <Text style={styles.tipItem}>{'\u2022'} Repeat 3-5 times, letting the words sink in</Text>
          <Text style={styles.tipItem}>{'\u2022'} Practice daily for best results</Text>
        </View>

        {/* Save Status */}
        <SaveIndicator isSaving={isSaving} lastSaved={lastSaved} isError={isLoadError} onRetry={saveNow} />

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Add Affirmation Modal */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAddModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowAddModal(false)}
        >
          <Pressable
            style={styles.modalContent}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={styles.modalTitle}>Create Your Affirmation</Text>
            <Text style={styles.modalSubtitle}>
              Write an affirmation that speaks to your heart
            </Text>

            <TextInput
              style={styles.affirmationInput}
              value={newAffirmationText}
              onChangeText={setNewAffirmationText}
              placeholder="I am..."
              placeholderTextColor={DESIGN_COLORS.textTertiary}
              multiline
              numberOfLines={3}
              maxLength={200}
              autoFocus
              accessibilityLabel="Affirmation text input"
              testID="new-affirmation-input"
            />

            <Text style={styles.categoryLabel}>Category</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categorySelectScroll}
            >
              {CATEGORIES.filter((c) => c.key !== 'all' && c.key !== 'favorites').map((cat) => (
                <TouchableOpacity
                  key={cat.key}
                  style={[
                    styles.categorySelectChip,
                    newAffirmationCategory === cat.key && styles.categorySelectChipActive,
                  ]}
                  onPress={() => setNewAffirmationCategory(cat.key as AffirmationCategory)}
                  testID={`select-category-${cat.key}`}
                >
                  <Text
                    style={[
                      styles.categorySelectText,
                      newAffirmationCategory === cat.key && styles.categorySelectTextActive,
                    ]}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => {
                  setShowAddModal(false);
                  setNewAffirmationText('');
                }}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalAddButton}
                onPress={handleAddAffirmation}
                testID="confirm-add-affirmation"
              >
                <Text style={styles.modalAddText}>Add Affirmation</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Mirror Timer Modal */}
      <Modal
        visible={showMirrorTimer}
        transparent
        animationType="fade"
        onRequestClose={handleStopTimer}
      >
        <View style={styles.timerOverlay}>
          <View style={styles.timerContent}>
            <Text style={styles.timerTitle}>Mirror Practice</Text>

            {currentAffirmation && (
              <Text style={styles.timerAffirmation}>
                "{currentAffirmation.text}"
              </Text>
            )}

            <Text style={styles.timerDisplay}>
              {formatTimer(timerSeconds)}
            </Text>

            <Text style={styles.timerInstruction}>
              {timerRunning
                ? 'Look into your eyes and repeat the affirmation...'
                : 'Well done! Take a deep breath.'}
            </Text>

            <TouchableOpacity
              style={styles.timerStopButton}
              onPress={handleStopTimer}
              accessibilityRole="button"
              accessibilityLabel={timerRunning ? 'Stop timer' : 'Close'}
              testID="stop-timer-button"
            >
              <Text style={styles.timerStopText}>
                {timerRunning ? 'Stop' : 'Close'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
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
    marginBottom: 20,
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

  // Category filter
  categoryScroll: {
    marginBottom: 20,
  },
  categoryContainer: {
    paddingHorizontal: 4,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: DESIGN_COLORS.bgElevated,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: DESIGN_COLORS.accentPurple,
    borderColor: DESIGN_COLORS.accentPurple,
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: DESIGN_COLORS.textSecondary,
  },
  categoryChipTextActive: {
    color: DESIGN_COLORS.textPrimary,
  },

  // Affirmation display
  affirmationContainer: {
    marginBottom: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
    marginBottom: 20,
  },
  emptyIcon: {
    fontSize: 48,
    opacity: 0.5,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: DESIGN_COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },

  // Navigation
  navigationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    gap: 24,
  },
  navButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: DESIGN_COLORS.bgElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
  },
  navButtonText: {
    fontSize: 20,
    color: DESIGN_COLORS.accentGold,
    fontWeight: '600',
  },
  counterText: {
    fontSize: 14,
    color: DESIGN_COLORS.textSecondary,
    fontWeight: '500',
  },

  // Actions
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: DESIGN_COLORS.accentRose,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  actionButtonSecondary: {
    backgroundColor: DESIGN_COLORS.accentTeal,
  },
  actionButtonIcon: {
    fontSize: 18,
    color: DESIGN_COLORS.textPrimary,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: DESIGN_COLORS.textPrimary,
  },

  // Tips
  tipsCard: {
    backgroundColor: DESIGN_COLORS.bgSecondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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
  affirmationInput: {
    backgroundColor: DESIGN_COLORS.bgPrimary,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: DESIGN_COLORS.textPrimary,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: DESIGN_COLORS.textSecondary,
    marginBottom: 8,
  },
  categorySelectScroll: {
    marginBottom: 20,
  },
  categorySelectChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: DESIGN_COLORS.bgSecondary,
    marginRight: 8,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
  },
  categorySelectChipActive: {
    backgroundColor: DESIGN_COLORS.accentPurple,
    borderColor: DESIGN_COLORS.accentPurple,
  },
  categorySelectText: {
    fontSize: 12,
    fontWeight: '600',
    color: DESIGN_COLORS.textSecondary,
  },
  categorySelectTextActive: {
    color: DESIGN_COLORS.textPrimary,
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

  // Timer modal
  timerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(26, 26, 46, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  timerContent: {
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
  },
  timerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: DESIGN_COLORS.accentGold,
    marginBottom: 24,
    letterSpacing: 1,
  },
  timerAffirmation: {
    fontSize: 20,
    fontWeight: '500',
    color: DESIGN_COLORS.textPrimary,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 30,
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  timerDisplay: {
    fontSize: 72,
    fontWeight: '700',
    color: DESIGN_COLORS.textPrimary,
    marginBottom: 24,
    fontVariant: ['tabular-nums'],
  },
  timerInstruction: {
    fontSize: 16,
    color: DESIGN_COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  timerStopButton: {
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 12,
    backgroundColor: DESIGN_COLORS.accentRose,
  },
  timerStopText: {
    fontSize: 16,
    fontWeight: '600',
    color: DESIGN_COLORS.textPrimary,
  },
});

export default SelfLoveAffirmationsScreen;
