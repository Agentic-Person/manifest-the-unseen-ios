/**
 * SelfCareRoutineScreen
 *
 * Phase 5 screen for building morning and evening self-care routines.
 * Features routine builders, pre-set activities, custom activities,
 * daily check-ins, and streak tracking for consistency.
 *
 * Design: Dark spiritual theme with nurturing accents
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
} from 'react-native';
import * as Haptics from 'expo-haptics';
import type { WorkbookStackScreenProps } from '../../../types/navigation';
import RoutineItem, {
  RoutineActivityData,
  ACTIVITY_ICONS,
} from '../../../components/workbook/RoutineItem';
import StreakCounter from '../../../components/workbook/StreakCounter';

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
  accentAmber: '#8b6914',
  border: '#3a3a5a',
  success: '#2d5a4a',
};

/**
 * Pre-set activity library
 */
interface PresetActivity {
  id: string;
  name: string;
  icon: string;
  defaultDuration: number;
  description: string;
}

const PRESET_ACTIVITIES: PresetActivity[] = [
  { id: 'meditation', name: 'Meditation', icon: 'meditation', defaultDuration: 10, description: 'Quiet your mind and find inner peace' },
  { id: 'journaling', name: 'Journaling', icon: 'journaling', defaultDuration: 15, description: 'Write your thoughts and feelings' },
  { id: 'exercise', name: 'Exercise', icon: 'exercise', defaultDuration: 30, description: 'Move your body and energize' },
  { id: 'skincare', name: 'Skincare', icon: 'skincare', defaultDuration: 10, description: 'Nourish and care for your skin' },
  { id: 'reading', name: 'Reading', icon: 'reading', defaultDuration: 20, description: 'Feed your mind with knowledge' },
  { id: 'stretching', name: 'Stretching', icon: 'stretching', defaultDuration: 10, description: 'Loosen tension and increase flexibility' },
  { id: 'hydration', name: 'Hydration', icon: 'hydration', defaultDuration: 2, description: 'Drink water to start fresh' },
  { id: 'gratitude', name: 'Gratitude Practice', icon: 'gratitude', defaultDuration: 5, description: 'List things you are grateful for' },
  { id: 'affirmations', name: 'Affirmations', icon: 'affirmations', defaultDuration: 5, description: 'Speak positive words to yourself' },
  { id: 'breathing', name: 'Breathing Exercises', icon: 'breathing', defaultDuration: 5, description: 'Deep breaths to calm your system' },
  { id: 'walking', name: 'Walking', icon: 'walking', defaultDuration: 20, description: 'A mindful stroll in nature' },
  { id: 'tea', name: 'Tea/Coffee Ritual', icon: 'tea', defaultDuration: 10, description: 'Enjoy a warm beverage mindfully' },
  { id: 'music', name: 'Calming Music', icon: 'music', defaultDuration: 15, description: 'Listen to soothing sounds' },
  { id: 'sleep', name: 'Sleep Preparation', icon: 'sleep', defaultDuration: 15, description: 'Wind down for restful sleep' },
];

/**
 * Generate unique ID
 */
const generateId = (): string => {
  return `act_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

type Props = WorkbookStackScreenProps<'SelfCareRoutine'>;

/**
 * SelfCareRoutineScreen Component
 */
const SelfCareRoutineScreen: React.FC<Props> = ({ navigation: _navigation }) => {
  // State
  const [morningActivities, setMorningActivities] = useState<RoutineActivityData[]>([]);
  const [eveningActivities, setEveningActivities] = useState<RoutineActivityData[]>([]);
  const [activeTab, setActiveTab] = useState<'morning' | 'evening'>('morning');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customActivityName, setCustomActivityName] = useState('');
  const [customActivityDuration, setCustomActivityDuration] = useState('10');

  // Streak data
  const [morningStreak, setMorningStreak] = useState(0);
  const [eveningStreak, setEveningStreak] = useState(0);
  const [bestMorningStreak, setBestMorningStreak] = useState(0);
  const [bestEveningStreak, setBestEveningStreak] = useState(0);

  // Refs
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Current activities based on tab
  const currentActivities = activeTab === 'morning' ? morningActivities : eveningActivities;
  const setCurrentActivities = activeTab === 'morning' ? setMorningActivities : setEveningActivities;

  /**
   * Calculate total routine time
   */
  const totalTime = useMemo(() => {
    return currentActivities.reduce((sum, act) => sum + act.duration, 0);
  }, [currentActivities]);

  /**
   * Calculate completion percentage
   */
  const completionPercentage = useMemo(() => {
    if (currentActivities.length === 0) return 0;
    const completed = currentActivities.filter((a) => a.completed).length;
    return Math.round((completed / currentActivities.length) * 100);
  }, [currentActivities]);

  /**
   * Load routine data on mount
   */
  useEffect(() => {
    loadRoutineData();
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  /**
   * Auto-save when activities change
   */
  useEffect(() => {
    if (!isLoading) {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      saveTimeoutRef.current = setTimeout(() => {
        autoSave();
      }, 1500);
    }
  }, [morningActivities, eveningActivities, isLoading]);

  /**
   * Load routine data
   */
  const loadRoutineData = async () => {
    setIsLoading(true);
    try {
      // TODO: Load from Supabase
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Demo data
      setMorningStreak(5);
      setEveningStreak(3);
      setBestMorningStreak(12);
      setBestEveningStreak(8);

      console.log('Loaded routine data');
    } catch (error) {
      console.error('Failed to load routine data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Auto-save routine
   */
  const autoSave = useCallback(async () => {
    setIsSaving(true);
    try {
      // TODO: Save to Supabase
      console.log('Auto-saving routine:', {
        morning: morningActivities.length,
        evening: eveningActivities.length,
      });
      setLastSaved(new Date());
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setIsSaving(false);
    }
  }, [morningActivities, eveningActivities]);

  /**
   * Switch active tab
   */
  const handleTabChange = (tab: 'morning' | 'evening') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActiveTab(tab);
  };

  /**
   * Add preset activity to routine
   */
  const handleAddPreset = (preset: PresetActivity) => {
    const newActivity: RoutineActivityData = {
      id: generateId(),
      name: preset.name,
      duration: preset.defaultDuration,
      icon: preset.icon,
      completed: false,
      order: currentActivities.length,
      isCustom: false,
      routineType: activeTab,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setCurrentActivities((prev) => [...prev, newActivity]);
    setShowAddModal(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  /**
   * Add custom activity
   */
  const handleAddCustom = () => {
    if (!customActivityName.trim()) {
      Alert.alert('Empty Name', 'Please enter a name for your activity.');
      return;
    }

    const duration = parseInt(customActivityDuration, 10) || 10;

    const newActivity: RoutineActivityData = {
      id: generateId(),
      name: customActivityName.trim(),
      duration,
      icon: 'custom',
      completed: false,
      order: currentActivities.length,
      isCustom: true,
      routineType: activeTab,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setCurrentActivities((prev) => [...prev, newActivity]);
    setShowCustomModal(false);
    setCustomActivityName('');
    setCustomActivityDuration('10');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  /**
   * Toggle activity completion
   */
  const handleToggleComplete = useCallback((id: string) => {
    setCurrentActivities((prev) =>
      prev.map((act) =>
        act.id === id
          ? { ...act, completed: !act.completed, updatedAt: new Date().toISOString() }
          : act
      )
    );
  }, [setCurrentActivities]);

  /**
   * Move activity up
   */
  const handleMoveUp = useCallback((id: string) => {
    setCurrentActivities((prev) => {
      const sorted = [...prev].sort((a, b) => a.order - b.order);
      const index = sorted.findIndex((a) => a.id === id);
      if (index <= 0) return prev;

      const newActivities = [...sorted];
      const temp = newActivities[index].order;
      newActivities[index] = { ...newActivities[index], order: newActivities[index - 1].order };
      newActivities[index - 1] = { ...newActivities[index - 1], order: temp };

      return newActivities;
    });
  }, [setCurrentActivities]);

  /**
   * Move activity down
   */
  const handleMoveDown = useCallback((id: string) => {
    setCurrentActivities((prev) => {
      const sorted = [...prev].sort((a, b) => a.order - b.order);
      const index = sorted.findIndex((a) => a.id === id);
      if (index < 0 || index >= sorted.length - 1) return prev;

      const newActivities = [...sorted];
      const temp = newActivities[index].order;
      newActivities[index] = { ...newActivities[index], order: newActivities[index + 1].order };
      newActivities[index + 1] = { ...newActivities[index + 1], order: temp };

      return newActivities;
    });
  }, [setCurrentActivities]);

  /**
   * Delete activity
   */
  const handleDelete = useCallback((id: string) => {
    Alert.alert(
      'Remove Activity',
      'Are you sure you want to remove this activity from your routine?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setCurrentActivities((prev) => {
              const filtered = prev.filter((a) => a.id !== id);
              return filtered.map((a, index) => ({
                ...a,
                order: index,
                updatedAt: new Date().toISOString(),
              }));
            });
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          },
        },
      ]
    );
  }, [setCurrentActivities]);

  /**
   * Complete daily check-in
   */
  const handleDailyCheckIn = () => {
    const allCompleted = currentActivities.length > 0 &&
      currentActivities.every((a) => a.completed);

    if (!allCompleted) {
      Alert.alert(
        'Incomplete Routine',
        'Complete all activities to check in for today!',
        [{ text: 'OK' }]
      );
      return;
    }

    // Update streak
    if (activeTab === 'morning') {
      setMorningStreak((prev) => {
        const newStreak = prev + 1;
        if (newStreak > bestMorningStreak) {
          setBestMorningStreak(newStreak);
        }
        return newStreak;
      });
    } else {
      setEveningStreak((prev) => {
        const newStreak = prev + 1;
        if (newStreak > bestEveningStreak) {
          setBestEveningStreak(newStreak);
        }
        return newStreak;
      });
    }

    // Reset completions for next day
    setCurrentActivities((prev) =>
      prev.map((a) => ({ ...a, completed: false, updatedAt: new Date().toISOString() }))
    );

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert(
      'Great Job!',
      `You completed your ${activeTab} routine! Keep up the amazing work.`,
      [{ text: 'Thank You!' }]
    );
  };

  /**
   * Format time display
   */
  const formatTime = (minutes: number): string => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  // Sorted activities
  const sortedActivities = useMemo(() => {
    return [...currentActivities].sort((a, b) => a.order - b.order);
  }, [currentActivities]);

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={DESIGN_COLORS.accentGold} />
        <Text style={styles.loadingText}>Loading your routines...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      testID="self-care-routine-screen"
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Self-Care Routines</Text>
          <Text style={styles.subtitle}>
            Build nurturing morning and evening rituals that honor your wellbeing.
          </Text>
        </View>

        {/* Streak Counter */}
        <StreakCounter
          currentStreak={activeTab === 'morning' ? morningStreak : eveningStreak}
          bestStreak={activeTab === 'morning' ? bestMorningStreak : bestEveningStreak}
          routineType={activeTab}
          size="normal"
        />

        {/* Tab Switcher */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'morning' && styles.tabActive]}
            onPress={() => handleTabChange('morning')}
            accessibilityRole="tab"
            accessibilityState={{ selected: activeTab === 'morning' }}
            accessibilityLabel="Morning routine"
            testID="tab-morning"
          >
            <Text style={styles.tabIcon}>{'\u2600'}</Text>
            <Text style={[styles.tabText, activeTab === 'morning' && styles.tabTextActive]}>
              Morning
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'evening' && styles.tabActive]}
            onPress={() => handleTabChange('evening')}
            accessibilityRole="tab"
            accessibilityState={{ selected: activeTab === 'evening' }}
            accessibilityLabel="Evening routine"
            testID="tab-evening"
          >
            <Text style={styles.tabIcon}>{'\u{1F319}'}</Text>
            <Text style={[styles.tabText, activeTab === 'evening' && styles.tabTextActive]}>
              Evening
            </Text>
          </TouchableOpacity>
        </View>

        {/* Routine Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{currentActivities.length}</Text>
            <Text style={styles.statLabel}>Activities</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>{formatTime(totalTime)}</Text>
            <Text style={styles.statLabel}>Total Time</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={[styles.statValue, completionPercentage === 100 && styles.statValueComplete]}>
              {completionPercentage}%
            </Text>
            <Text style={styles.statLabel}>Complete</Text>
          </View>
        </View>

        {/* Activities List */}
        <View style={styles.activitiesContainer}>
          <View style={styles.activitiesHeader}>
            <Text style={styles.sectionLabel}>
              {activeTab === 'morning' ? 'Morning' : 'Evening'} Activities
            </Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowAddModal(true)}
              accessibilityRole="button"
              accessibilityLabel="Add activity"
              testID="add-activity-button"
            >
              <Text style={styles.addButtonIcon}>+</Text>
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>

          {sortedActivities.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>{activeTab === 'morning' ? '\u2600' : '\u{1F319}'}</Text>
              <Text style={styles.emptyText}>
                No activities yet. Tap "Add" to build your {activeTab} routine.
              </Text>
            </View>
          ) : (
            sortedActivities.map((activity, index) => (
              <RoutineItem
                key={activity.id}
                activity={activity}
                index={index}
                totalItems={sortedActivities.length}
                onToggleComplete={handleToggleComplete}
                onMoveUp={handleMoveUp}
                onMoveDown={handleMoveDown}
                onDelete={handleDelete}
              />
            ))
          )}
        </View>

        {/* Daily Check-In Button */}
        {currentActivities.length > 0 && (
          <Pressable
            style={({ pressed }) => [
              styles.checkInButton,
              completionPercentage === 100 && styles.checkInButtonReady,
              pressed && styles.checkInButtonPressed,
            ]}
            onPress={handleDailyCheckIn}
            accessibilityRole="button"
            accessibilityLabel="Complete daily check-in"
            testID="daily-checkin-button"
          >
            <Text style={styles.checkInButtonText}>
              {completionPercentage === 100 ? '\u2713 Complete Check-In' : 'Complete All Activities to Check In'}
            </Text>
          </Pressable>
        )}

        {/* Save Status */}
        <View style={styles.saveStatusContainer}>
          {isSaving ? (
            <Text style={styles.saveStatus}>Saving...</Text>
          ) : lastSaved ? (
            <Text style={styles.saveStatus}>
              Last saved: {lastSaved.toLocaleTimeString()}
            </Text>
          ) : null}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Add Activity Modal (Presets) */}
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
            <Text style={styles.modalTitle}>Add Activity</Text>
            <Text style={styles.modalSubtitle}>
              Choose from our library or create your own
            </Text>

            <ScrollView style={styles.presetList} showsVerticalScrollIndicator={false}>
              {PRESET_ACTIVITIES.map((preset) => (
                <TouchableOpacity
                  key={preset.id}
                  style={styles.presetItem}
                  onPress={() => handleAddPreset(preset)}
                  accessibilityRole="button"
                  accessibilityLabel={`Add ${preset.name}`}
                  testID={`preset-${preset.id}`}
                >
                  <Text style={styles.presetIcon}>
                    {ACTIVITY_ICONS[preset.icon] || '\u2B50'}
                  </Text>
                  <View style={styles.presetInfo}>
                    <Text style={styles.presetName}>{preset.name}</Text>
                    <Text style={styles.presetDescription}>{preset.description}</Text>
                  </View>
                  <Text style={styles.presetDuration}>{preset.defaultDuration}m</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.customButton}
              onPress={() => {
                setShowAddModal(false);
                setShowCustomModal(true);
              }}
              testID="create-custom-button"
            >
              <Text style={styles.customButtonIcon}>+</Text>
              <Text style={styles.customButtonText}>Create Custom Activity</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowAddModal(false)}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Custom Activity Modal */}
      <Modal
        visible={showCustomModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCustomModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowCustomModal(false)}
        >
          <Pressable
            style={styles.modalContent}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={styles.modalTitle}>Custom Activity</Text>
            <Text style={styles.modalSubtitle}>
              Create a self-care activity unique to you
            </Text>

            <Text style={styles.inputLabel}>Activity Name</Text>
            <TextInput
              style={styles.textInput}
              value={customActivityName}
              onChangeText={setCustomActivityName}
              placeholder="e.g., Yoga, Art therapy..."
              placeholderTextColor={DESIGN_COLORS.textTertiary}
              maxLength={50}
              accessibilityLabel="Activity name input"
              testID="custom-name-input"
            />

            <Text style={styles.inputLabel}>Duration (minutes)</Text>
            <TextInput
              style={styles.textInput}
              value={customActivityDuration}
              onChangeText={setCustomActivityDuration}
              placeholder="10"
              placeholderTextColor={DESIGN_COLORS.textTertiary}
              keyboardType="number-pad"
              maxLength={3}
              accessibilityLabel="Duration input"
              testID="custom-duration-input"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => {
                  setShowCustomModal(false);
                  setCustomActivityName('');
                  setCustomActivityDuration('10');
                }}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalAddButton}
                onPress={handleAddCustom}
                testID="confirm-custom-activity"
              >
                <Text style={styles.modalAddText}>Add Activity</Text>
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

  // Tab switcher
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: DESIGN_COLORS.bgElevated,
    borderRadius: 12,
    padding: 4,
    marginTop: 20,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  tabActive: {
    backgroundColor: DESIGN_COLORS.accentPurple,
  },
  tabIcon: {
    fontSize: 18,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: DESIGN_COLORS.textSecondary,
  },
  tabTextActive: {
    color: DESIGN_COLORS.textPrimary,
  },

  // Stats
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: DESIGN_COLORS.bgElevated,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: DESIGN_COLORS.textPrimary,
    marginBottom: 4,
  },
  statValueComplete: {
    color: DESIGN_COLORS.accentGreen,
  },
  statLabel: {
    fontSize: 12,
    color: DESIGN_COLORS.textSecondary,
  },
  statDivider: {
    width: 1,
    backgroundColor: DESIGN_COLORS.border,
    marginHorizontal: 8,
  },

  // Activities
  activitiesContainer: {
    marginBottom: 20,
  },
  activitiesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: DESIGN_COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DESIGN_COLORS.accentTeal,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    gap: 4,
  },
  addButtonIcon: {
    fontSize: 16,
    fontWeight: '700',
    color: DESIGN_COLORS.textPrimary,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: DESIGN_COLORS.textPrimary,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: DESIGN_COLORS.bgElevated,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 12,
    opacity: 0.5,
  },
  emptyText: {
    fontSize: 15,
    color: DESIGN_COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },

  // Check-in button
  checkInButton: {
    backgroundColor: DESIGN_COLORS.bgElevated,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
    marginBottom: 16,
  },
  checkInButtonReady: {
    backgroundColor: DESIGN_COLORS.accentGreen,
    borderColor: DESIGN_COLORS.accentGreen,
  },
  checkInButtonPressed: {
    opacity: 0.9,
  },
  checkInButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: DESIGN_COLORS.textPrimary,
  },

  // Save status
  saveStatusContainer: {
    alignItems: 'center',
    minHeight: 20,
  },
  saveStatus: {
    fontSize: 12,
    color: DESIGN_COLORS.textTertiary,
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
    maxHeight: '80%',
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
  presetList: {
    maxHeight: 300,
    marginBottom: 16,
  },
  presetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DESIGN_COLORS.bgSecondary,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
  },
  presetIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  presetInfo: {
    flex: 1,
  },
  presetName: {
    fontSize: 15,
    fontWeight: '600',
    color: DESIGN_COLORS.textPrimary,
    marginBottom: 2,
  },
  presetDescription: {
    fontSize: 12,
    color: DESIGN_COLORS.textSecondary,
  },
  presetDuration: {
    fontSize: 13,
    fontWeight: '600',
    color: DESIGN_COLORS.accentGold,
    marginLeft: 8,
  },
  customButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: DESIGN_COLORS.accentPurple,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 12,
    gap: 8,
  },
  customButtonIcon: {
    fontSize: 18,
    fontWeight: '700',
    color: DESIGN_COLORS.textPrimary,
  },
  customButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: DESIGN_COLORS.textPrimary,
  },
  modalCloseButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 14,
    fontWeight: '600',
    color: DESIGN_COLORS.textSecondary,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: DESIGN_COLORS.textSecondary,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: DESIGN_COLORS.bgPrimary,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: DESIGN_COLORS.textPrimary,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 8,
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

export default SelfCareRoutineScreen;
