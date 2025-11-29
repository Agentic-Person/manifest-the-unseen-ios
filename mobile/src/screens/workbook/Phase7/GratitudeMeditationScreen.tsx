/**
 * GratitudeMeditationScreen
 *
 * Guided gratitude visualization and meditation screen.
 * Part of Phase 7: Practicing Gratitude.
 *
 * Features:
 * - Guided gratitude visualization prompts
 * - Timer (5, 10, 15 minute options)
 * - Ambient background with subtle animated gradient
 * - Bell sound indicators (visual in this version)
 * - Session completion tracker
 * - Reflection input after meditation
 *
 * Design (from APP-DESIGN.md):
 * - Background: #1a1a2e (deep charcoal)
 * - Animated gradient overlays
 * - Accent gold: #c9a227
 * - Calming, meditative feel
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Animated,
  Easing,
  ActivityIndicator,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import type { WorkbookStackScreenProps } from '../../../types/navigation';
import {
  MeditationTimer,
} from '../../../components/workbook/MeditationTimer';
import type { TimerState } from '../../../components/workbook/MeditationTimer';
import { useWorkbookProgress } from '../../../hooks/useWorkbook';
import { useAutoSave } from '../../../hooks/useAutoSave';
import { WORKSHEET_IDS } from '../../../types/workbook';
import { SaveIndicator } from '../../../components/workbook';

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
  accentIndigo: '#2d1b4e',
  border: '#3a3a5a',
};

// Gratitude visualization prompts
const GRATITUDE_PROMPTS = [
  {
    title: 'Morning Blessings',
    prompt: 'As you breathe deeply, think of three things you\'re grateful for this morning. Visualize each one surrounded by warm, golden light.',
  },
  {
    title: 'People in Your Life',
    prompt: 'Bring to mind someone who has shown you kindness. See their face clearly. Feel gratitude for their presence in your life.',
  },
  {
    title: 'Simple Pleasures',
    prompt: 'Think of a simple pleasure you experienced recently - a warm drink, a smile from a stranger, sunshine on your face. Let gratitude fill your heart.',
  },
  {
    title: 'Your Body',
    prompt: 'Feel gratitude for your body. Thank your heart for beating, your lungs for breathing, your senses for experiencing the world.',
  },
  {
    title: 'Growth & Challenges',
    prompt: 'Consider a challenge you\'ve overcome. Feel gratitude for the strength it revealed in you, for the lessons learned.',
  },
  {
    title: 'Abundance',
    prompt: 'Visualize all the abundance in your life - love, opportunities, connections, experiences. Let gratitude for this abundance expand in your heart.',
  },
];

// Session Interface
interface MeditationSession {
  id: string;
  duration: number;
  completedAt: string;
  reflection: string;
  promptUsed: string;
}

// Session Stats
interface SessionStats {
  totalSessions: number;
  totalMinutes: number;
  currentWeekSessions: number;
  longestSession: number;
}

// Generate unique ID
const generateId = (): string => {
  return `meditation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

type Props = WorkbookStackScreenProps<'GratitudeMeditation'>;

/**
 * GratitudeMeditationScreen Component
 */
const GratitudeMeditationScreen: React.FC<Props> = ({ navigation: _navigation }) => {
  const [timerState, setTimerState] = useState<TimerState>('idle');
  const [sessions, setSessions] = useState<MeditationSession[]>([]);
  const [stats, setStats] = useState<SessionStats>({
    totalSessions: 0,
    totalMinutes: 0,
    currentWeekSessions: 0,
    longestSession: 0,
  });
  const [currentPrompt, setCurrentPrompt] = useState(GRATITUDE_PROMPTS[0]);
  const [showReflection, setShowReflection] = useState(false);
  const [reflectionText, setReflectionText] = useState('');
  const [lastDuration, setLastDuration] = useState(0);

  // Animation values
  const gradientAnim = useRef(new Animated.Value(0)).current;
  const breatheAnim = useRef(new Animated.Value(1)).current;

  // Supabase integration hooks
  const { data: savedProgress, isLoading, isError: isLoadError, error: loadError } = useWorkbookProgress(7, WORKSHEET_IDS.GRATITUDE_MEDITATION);

  const { isSaving, lastSaved, saveNow } = useAutoSave({
    data: { sessions, stats } as Record<string, unknown>,
    phaseNumber: 7,
    worksheetId: WORKSHEET_IDS.GRATITUDE_MEDITATION,
    debounceMs: 1500,
  });

  /**
   * Load saved data from Supabase
   */
  useEffect(() => {
    // Error state
    if (isLoadError) {
      console.error('[GratitudeMeditationScreen] Failed to load progress:', loadError);
      // Continue with default data instead of blocking the UI
    }

    // Only initialize once when loading completes
    if (isLoading) return;

    if (savedProgress?.data) {
      const loadedData = savedProgress.data as { sessions: MeditationSession[]; stats: SessionStats };
      if (loadedData.sessions) {
        setSessions(loadedData.sessions);
      }
      if (loadedData.stats) {
        setStats(loadedData.stats);
      }
    }
  }, [savedProgress, isLoading]);

  /**
   * Initialize prompt on mount
   */
  useEffect(() => {
    selectRandomPrompt();
  }, []);

  /**
   * Start ambient animation when timer running
   */
  useEffect(() => {
    if (timerState === 'running') {
      startAmbientAnimation();
    } else {
      stopAmbientAnimation();
    }
  }, [timerState]);

  /**
   * Start ambient gradient animation
   */
  const startAmbientAnimation = useCallback(() => {
    // Slow gradient shift
    Animated.loop(
      Animated.sequence([
        Animated.timing(gradientAnim, {
          toValue: 1,
          duration: 10000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(gradientAnim, {
          toValue: 0,
          duration: 10000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ])
    ).start();

    // Breathing animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(breatheAnim, {
          toValue: 1.1,
          duration: 4000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(breatheAnim, {
          toValue: 1,
          duration: 4000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [gradientAnim, breatheAnim]);

  /**
   * Stop ambient animation
   */
  const stopAmbientAnimation = useCallback(() => {
    gradientAnim.stopAnimation();
    breatheAnim.stopAnimation();
    gradientAnim.setValue(0);
    breatheAnim.setValue(1);
  }, [gradientAnim, breatheAnim]);

  /**
   * Calculate stats from sessions
   */
  const calculateStats = (allSessions: MeditationSession[]) => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const weekSessions = allSessions.filter(
      (s) => new Date(s.completedAt) >= weekAgo
    );

    const totalMinutes = allSessions.reduce(
      (sum, s) => sum + Math.floor(s.duration / 60),
      0
    );

    const longestSession = allSessions.reduce(
      (max, s) => Math.max(max, s.duration),
      0
    );

    setStats({
      totalSessions: allSessions.length,
      totalMinutes,
      currentWeekSessions: weekSessions.length,
      longestSession: Math.floor(longestSession / 60),
    });
  };

  /**
   * Select random prompt
   */
  const selectRandomPrompt = () => {
    const randomIndex = Math.floor(Math.random() * GRATITUDE_PROMPTS.length);
    setCurrentPrompt(GRATITUDE_PROMPTS[randomIndex]);
  };

  /**
   * Handle timer state change
   */
  const handleTimerStateChange = (state: TimerState) => {
    setTimerState(state);
    if (state === 'idle') {
      selectRandomPrompt();
    }
  };

  /**
   * Handle meditation completion
   */
  const handleMeditationComplete = (duration: number) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setLastDuration(duration);
    setShowReflection(true);
  };

  /**
   * Save reflection and session
   */
  const handleSaveReflection = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const newSession: MeditationSession = {
      id: generateId(),
      duration: lastDuration,
      completedAt: new Date().toISOString(),
      reflection: reflectionText.trim(),
      promptUsed: currentPrompt.title,
    };

    // Update local state
    const updatedSessions = [newSession, ...sessions];
    setSessions(updatedSessions);
    calculateStats(updatedSessions);

    await saveNow();

    setShowReflection(false);
    setReflectionText('');
  };

  /**
   * Skip reflection
   */
  const handleSkipReflection = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowReflection(false);
    setReflectionText('');
  };

  /**
   * Interpolate gradient color
   */
  const gradientColor = gradientAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [
      DESIGN_COLORS.accentPurple,
      DESIGN_COLORS.accentIndigo,
      DESIGN_COLORS.accentTeal,
    ],
  });

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={50} color={DESIGN_COLORS.accentGold} />
        <Text style={styles.loadingText}>Preparing your meditation space...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Animated Gradient Overlay */}
      <Animated.View
        style={[
          styles.gradientOverlay,
          {
            backgroundColor: timerState === 'running' ? gradientColor : 'transparent',
            opacity: timerState === 'running' ? 0.15 : 0,
          },
        ]}
        pointerEvents="none"
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Gratitude Meditation</Text>
          <Text style={styles.subtitle}>
            Center yourself in gratitude through guided visualization and mindful breathing.
          </Text>
        </View>

        {/* Stats Summary */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.totalSessions}</Text>
            <Text style={styles.statLabel}>Sessions</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.totalMinutes}</Text>
            <Text style={styles.statLabel}>Minutes</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.currentWeekSessions}</Text>
            <Text style={styles.statLabel}>This Week</Text>
          </View>
        </View>

        {/* Meditation Timer */}
        <View style={styles.timerSection}>
          <MeditationTimer
            initialDuration={5 * 60}
            onComplete={handleMeditationComplete}
            onStateChange={handleTimerStateChange}
          />
        </View>

        {/* Visualization Prompt */}
        <Animated.View
          style={[
            styles.promptCard,
            timerState === 'running' && {
              transform: [{ scale: breatheAnim }],
            },
          ]}
        >
          <Text style={styles.promptTitle}>{currentPrompt.title}</Text>
          <Text style={styles.promptText}>{currentPrompt.prompt}</Text>
          {timerState === 'idle' && (
            <TouchableOpacity
              style={styles.shuffleButton}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                selectRandomPrompt();
              }}
              accessibilityRole="button"
              accessibilityLabel="Get new visualization prompt"
            >
              <Text style={styles.shuffleButtonText}>{'\u21BB'} New Prompt</Text>
            </TouchableOpacity>
          )}
        </Animated.View>

        {/* Breathing Guide (visible during meditation) */}
        {timerState === 'running' && (
          <View style={styles.breathingGuide}>
            <Animated.View
              style={[
                styles.breathingCircle,
                { transform: [{ scale: breatheAnim }] },
              ]}
            >
              <Text style={styles.breathingText}>Breathe</Text>
            </Animated.View>
            <Text style={styles.breathingInstruction}>
              Let your breath flow naturally as you focus on gratitude
            </Text>
          </View>
        )}

        {/* Recent Sessions */}
        {sessions.length > 0 && timerState === 'idle' && (
          <View style={styles.recentSection}>
            <Text style={styles.sectionTitle}>Recent Sessions</Text>
            {sessions.slice(0, 3).map((session) => {
              const date = new Date(session.completedAt);
              return (
                <View key={session.id} style={styles.sessionCard}>
                  <View style={styles.sessionHeader}>
                    <Text style={styles.sessionDate}>
                      {date.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </Text>
                    <Text style={styles.sessionDuration}>
                      {Math.floor(session.duration / 60)} min
                    </Text>
                  </View>
                  {session.reflection && (
                    <Text style={styles.sessionReflection} numberOfLines={2}>
                      "{session.reflection}"
                    </Text>
                  )}
                  <Text style={styles.sessionPrompt}>
                    Focus: {session.promptUsed}
                  </Text>
                </View>
              );
            })}
          </View>
        )}

        {/* Tips (only when idle) */}
        {timerState === 'idle' && (
          <View style={styles.tipsCard}>
            <Text style={styles.tipsTitle}>Meditation Tips</Text>
            <Text style={styles.tipItem}>- Find a quiet, comfortable space</Text>
            <Text style={styles.tipItem}>- Close your eyes and relax your body</Text>
            <Text style={styles.tipItem}>- Let go of judgment, just observe</Text>
            <Text style={styles.tipItem}>- Focus on feeling, not just thinking</Text>
          </View>
        )}

        {/* Save Indicator */}
        <SaveIndicator isSaving={isSaving} lastSaved={lastSaved} isError={false} onRetry={saveNow} />

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Reflection Modal */}
      <Modal
        visible={showReflection}
        transparent
        animationType="fade"
        onRequestClose={handleSkipReflection}
      >
        <View style={styles.reflectionOverlay}>
          <View style={styles.reflectionModal}>
            <Text style={styles.reflectionTitle}>Session Complete</Text>
            <Text style={styles.reflectionCelebration}>
              {'\u2728'} Beautiful work! You meditated for {Math.floor(lastDuration / 60)} minutes.
            </Text>

            <Text style={styles.reflectionLabel}>
              How do you feel? (Optional)
            </Text>
            <TextInput
              style={styles.reflectionInput}
              value={reflectionText}
              onChangeText={setReflectionText}
              placeholder="Write a brief reflection on your meditation..."
              placeholderTextColor={DESIGN_COLORS.textTertiary}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              accessibilityLabel="Meditation reflection"
            />

            <View style={styles.reflectionActions}>
              <TouchableOpacity
                style={styles.skipButton}
                onPress={handleSkipReflection}
              >
                <Text style={styles.skipButtonText}>Skip</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveReflectionButton}
                onPress={handleSaveReflection}
              >
                <Text style={styles.saveReflectionText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
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

  // Gradient Overlay
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },

  // Header
  header: {
    marginBottom: 24,
    zIndex: 2,
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

  // Stats Row
  statsRow: {
    flexDirection: 'row',
    backgroundColor: DESIGN_COLORS.bgElevated,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
    zIndex: 2,
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

  // Timer Section
  timerSection: {
    marginBottom: 24,
    zIndex: 2,
  },

  // Prompt Card
  promptCard: {
    backgroundColor: DESIGN_COLORS.bgElevated,
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
    alignItems: 'center',
    zIndex: 2,
  },
  promptTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: DESIGN_COLORS.accentGold,
    marginBottom: 12,
    textAlign: 'center',
  },
  promptText: {
    fontSize: 16,
    color: DESIGN_COLORS.textPrimary,
    lineHeight: 26,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  shuffleButton: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: DESIGN_COLORS.bgPrimary,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
  },
  shuffleButtonText: {
    fontSize: 13,
    color: DESIGN_COLORS.textSecondary,
    fontWeight: '500',
  },

  // Breathing Guide
  breathingGuide: {
    alignItems: 'center',
    marginBottom: 24,
    zIndex: 2,
  },
  breathingCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(201, 162, 39, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: DESIGN_COLORS.accentGold,
  },
  breathingText: {
    fontSize: 16,
    color: DESIGN_COLORS.accentGold,
    fontWeight: '500',
  },
  breathingInstruction: {
    fontSize: 14,
    color: DESIGN_COLORS.textSecondary,
    textAlign: 'center',
  },

  // Recent Section
  recentSection: {
    marginBottom: 24,
    zIndex: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: DESIGN_COLORS.textSecondary,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sessionCard: {
    backgroundColor: DESIGN_COLORS.bgElevated,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sessionDate: {
    fontSize: 14,
    fontWeight: '600',
    color: DESIGN_COLORS.textPrimary,
  },
  sessionDuration: {
    fontSize: 13,
    color: DESIGN_COLORS.accentGold,
    fontWeight: '500',
  },
  sessionReflection: {
    fontSize: 13,
    color: DESIGN_COLORS.textSecondary,
    fontStyle: 'italic',
    marginBottom: 6,
    lineHeight: 20,
  },
  sessionPrompt: {
    fontSize: 11,
    color: DESIGN_COLORS.textTertiary,
  },

  // Tips Card
  tipsCard: {
    backgroundColor: DESIGN_COLORS.bgSecondary,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
    zIndex: 2,
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

  // Reflection Modal
  reflectionOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  reflectionModal: {
    backgroundColor: DESIGN_COLORS.bgElevated,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
  },
  reflectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: DESIGN_COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  reflectionCelebration: {
    fontSize: 16,
    color: DESIGN_COLORS.accentGold,
    textAlign: 'center',
    marginBottom: 20,
  },
  reflectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: DESIGN_COLORS.textSecondary,
    marginBottom: 10,
  },
  reflectionInput: {
    backgroundColor: DESIGN_COLORS.bgPrimary,
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: DESIGN_COLORS.textPrimary,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
    minHeight: 100,
    lineHeight: 22,
    marginBottom: 20,
  },
  reflectionActions: {
    flexDirection: 'row',
    gap: 12,
  },
  skipButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: DESIGN_COLORS.bgPrimary,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
  },
  skipButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: DESIGN_COLORS.textSecondary,
  },
  saveReflectionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: DESIGN_COLORS.accentGold,
  },
  saveReflectionText: {
    fontSize: 14,
    fontWeight: '600',
    color: DESIGN_COLORS.bgPrimary,
  },
});

export default GratitudeMeditationScreen;
