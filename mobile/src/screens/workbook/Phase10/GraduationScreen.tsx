/**
 * GraduationScreen
 *
 * Phase 10: Trust & Letting Go - Graduation & Commitment
 * Celebration and commitment for completing the 10-phase journey.
 *
 * Features:
 * - Celebration animation on completion
 * - Personal commitment statement builder
 * - Daily practice selection
 * - Digital certificate of completion
 * - Share achievement button (placeholder)
 * - Confetti celebration effect
 *
 * Design (from APP-DESIGN.md):
 * - Background: #1a1a2e (deep charcoal)
 * - Elevated surfaces: #252547
 * - Accent gold: #c9a227 (CELEBRATORY)
 * - Dark spiritual theme
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
  Share,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import type { WorkbookStackScreenProps } from '../../../types/navigation';
import { CertificateView } from '../../../components/workbook/CertificateView';
import { ConfettiCelebration, ConfettiBurst } from '../../../components/workbook/ConfettiCelebration';
import { SaveIndicator, ExerciseHeader } from '../../../components/workbook';
import { Phase10ExerciseImages } from '../../../assets';
import { useWorkbookProgress, useMarkComplete } from '../../../hooks/useWorkbook';
import { useAutoSave } from '../../../hooks/useAutoSave';
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
  accentGold: '#c9a227',
  accentTeal: '#1a5f5f',
  accentGreen: '#2d5a4a',
  border: '#3a3a5a',
};

// Daily practices to choose from
interface DailyPractice {
  id: string;
  name: string;
  description: string;
  duration: string;
  icon: string;
}

const DAILY_PRACTICES: DailyPractice[] = [
  {
    id: 'gratitude',
    name: 'Gratitude Journal',
    description: 'Write 3 things you\'re grateful for',
    duration: '5 min',
    icon: '\u2618',
  },
  {
    id: 'meditation',
    name: 'Morning Meditation',
    description: 'Start your day with stillness',
    duration: '10 min',
    icon: '\u2600',
  },
  {
    id: 'affirmations',
    name: 'Self-Love Affirmations',
    description: 'Speak kindness to yourself',
    duration: '3 min',
    icon: '\u2661',
  },
  {
    id: 'scripting',
    name: 'Manifestation Scripting',
    description: 'Write your ideal reality',
    duration: '10 min',
    icon: '\u270E',
  },
  {
    id: '369',
    name: '3-6-9 Method',
    description: 'Write your intention 3-6-9 times',
    duration: '5 min',
    icon: '\u2728',
  },
  {
    id: 'vision',
    name: 'Vision Board Review',
    description: 'Visualize your dreams coming true',
    duration: '5 min',
    icon: '\u2606',
  },
];

// Commitment data interface (used for Supabase persistence - TODO)
// interface CommitmentData {
//   statement: string;
//   selectedPractices: string[];
//   completedAt: Date | null;
// }

type Props = WorkbookStackScreenProps<'Graduation'>;

// Data type for persistence
interface GraduationData {
  commitmentStatement: string;
  selectedPractices: string[];
  hasGraduated: boolean;
  graduatedAt?: string;
}

const PHASE_NUMBER = 10;

/**
 * GraduationScreen Component
 */
const GraduationScreen: React.FC<Props> = ({ navigation }) => {
  // Supabase data fetching
  const { data: savedProgress, isLoading, isError: isLoadError, error: loadError } = useWorkbookProgress(
    PHASE_NUMBER,
    WORKSHEET_IDS.GRADUATION
  );

  // Mark complete mutation
  const { mutate: markComplete } = useMarkComplete();

  const [showCelebration, setShowCelebration] = useState(false);
  const [showBurst, setShowBurst] = useState(false);
  const [hasGraduated, setHasGraduated] = useState(false);
  const [commitmentStatement, setCommitmentStatement] = useState('');
  const [selectedPractices, setSelectedPractices] = useState<string[]>([]);
  const [showCertificate, setShowCertificate] = useState(false);

  // User data (mock - would come from auth)
  const userName = 'Seeker';
  const journeyStartDate = new Date('2024-06-01');
  const journeyDuration = Math.floor(
    (new Date().getTime() - journeyStartDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Auto-save hook
  const formData: GraduationData = useMemo(() => ({
    commitmentStatement,
    selectedPractices,
    hasGraduated,
    graduatedAt: hasGraduated ? new Date().toISOString() : undefined,
  }), [commitmentStatement, selectedPractices, hasGraduated]);

  const { isSaving, lastSaved, saveNow } = useAutoSave({
    data: formData as unknown as Record<string, unknown>,
    phaseNumber: PHASE_NUMBER,
    worksheetId: WORKSHEET_IDS.GRADUATION,
    debounceMs: 1500,
  });

  // Load saved data
  useEffect(() => {
    // Error state
    if (isLoadError) {
      console.error('[GraduationScreen] Failed to load progress:', loadError);
      // Continue with default data instead of blocking the UI
    }

    if (savedProgress?.data) {
      const data = savedProgress.data as unknown as GraduationData;
      if (data.commitmentStatement) {
        setCommitmentStatement(data.commitmentStatement);
      }
      if (data.selectedPractices) {
        setSelectedPractices(data.selectedPractices);
      }
      if (data.hasGraduated) {
        setHasGraduated(true);
      }
    }
  }, [savedProgress, isLoadError, loadError]);

  /**
   * Toggle practice selection
   */
  const handleTogglePractice = (practiceId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedPractices((prev) =>
      prev.includes(practiceId)
        ? prev.filter((id) => id !== practiceId)
        : [...prev, practiceId]
    );
  };

  /**
   * Complete graduation
   */
  const handleGraduate = () => {
    if (!commitmentStatement.trim()) {
      Alert.alert(
        'Commitment Required',
        'Please write your personal commitment statement before graduating.',
        [{ text: 'OK' }]
      );
      return;
    }

    if (selectedPractices.length === 0) {
      Alert.alert(
        'Select Practices',
        'Please select at least one daily practice to continue.',
        [{ text: 'OK' }]
      );
      return;
    }

    Alert.alert(
      'Complete Your Journey',
      'Congratulations on reaching this milestone! You\'re about to officially complete your 10-phase transformation journey.\n\nAre you ready to graduate?',
      [
        { text: 'Not Yet', style: 'cancel' },
        {
          text: 'Graduate!',
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

            // Start celebration
            setShowCelebration(true);
            setShowBurst(true);
            setHasGraduated(true);

            // Mark worksheet as complete
            markComplete({
              phaseNumber: PHASE_NUMBER,
              worksheetId: WORKSHEET_IDS.GRADUATION,
            });

            // Save graduation data
            saveNow();

            // Show certificate after celebration
            setTimeout(() => {
              setShowCertificate(true);
            }, 2000);
          },
        },
      ]
    );
  };

  /**
   * Handle celebration complete
   */
  const handleCelebrationComplete = () => {
    setShowCelebration(false);
  };

  const handleBurstComplete = () => {
    setShowBurst(false);
  };

  /**
   * Share achievement
   */
  const handleShare = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await Share.share({
        message: `I just completed my 10-phase transformation journey with Manifest the Unseen! ${journeyDuration} days of growth, self-discovery, and spiritual awakening. Ready to manifest my best life!\n\n#ManifestTheUnseen #Transformation #Manifestation`,
      });
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  /**
   * View certificate
   */
  const handleViewCertificate = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowCertificate(true);
  };

  /**
   * Return to workbook home
   */
  const handleFinish = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate('WorkbookHome');
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={50} color={DESIGN_COLORS.accentGold} />
        <Text style={styles.loadingText}>Preparing your graduation...</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      {/* Confetti Effects */}
      <ConfettiCelebration
        isActive={showCelebration}
        duration={4000}
        particleCount={150}
        onComplete={handleCelebrationComplete}
      />
      <ConfettiBurst
        isActive={showBurst}
        particleCount={60}
        onComplete={handleBurstComplete}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <ExerciseHeader
          image={Phase10ExerciseImages.graduation}
          title={hasGraduated ? 'Congratulations!' : 'Graduation & Commitment'}
          subtitle={hasGraduated
            ? "You've completed your transformation journey. Your new life awaits."
            : 'Make a commitment to yourself and celebrate your transformation.'}
          progress={savedProgress?.progress || 0}
        />

        {/* Certificate View (if graduated) */}
        {showCertificate && (
          <View style={styles.certificateSection}>
            <CertificateView
              userName={userName}
              completionDate={new Date()}
              journeyDuration={journeyDuration}
              phasesCompleted={10}
              totalExercises={36}
              journalEntries={45}
              meditationMinutes={360}
            />
          </View>
        )}

        {/* Celebration Message (if graduated) */}
        {hasGraduated && !showCertificate && (
          <View style={styles.celebrationCard}>
            <Text style={styles.celebrationIcon}>{'\u2728'}</Text>
            <Text style={styles.celebrationTitle}>Journey Complete!</Text>
            <Text style={styles.celebrationText}>
              You've transformed through {journeyDuration} days of dedication.
              This is not an ending - it's your new beginning.
            </Text>
            <Pressable
              style={({ pressed }) => [
                styles.viewCertButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={handleViewCertificate}
              accessibilityRole="button"
              accessibilityLabel="View certificate"
            >
              <Text style={styles.viewCertButtonText}>View My Certificate</Text>
            </Pressable>
          </View>
        )}

        {/* Commitment Statement */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Manifestation Commitment</Text>
          <Text style={styles.sectionSubtitle}>
            What do you promise yourself going forward?
          </Text>

          <View style={styles.commitmentCard}>
            <Text style={styles.commitmentPrompt}>I, {userName}, commit to...</Text>
            <TextInput
              style={styles.commitmentInput}
              placeholder="Write your personal commitment statement. What will you do daily? How will you honor your growth? What is your promise to yourself?"
              placeholderTextColor={DESIGN_COLORS.textTertiary}
              value={commitmentStatement}
              onChangeText={setCommitmentStatement}
              multiline
              textAlignVertical="top"
              editable={!hasGraduated}
              accessibilityLabel="Commitment statement"
            />
            {hasGraduated && (
              <View style={styles.signedBadge}>
                <Text style={styles.signedBadgeText}>{'\u2713'} Committed</Text>
              </View>
            )}
          </View>
        </View>

        {/* Daily Practice Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Daily Practices</Text>
          <Text style={styles.sectionSubtitle}>
            Select the exercises you'll continue daily
          </Text>

          <View style={styles.practicesGrid}>
            {DAILY_PRACTICES.map((practice) => {
              const isSelected = selectedPractices.includes(practice.id);
              return (
                <Pressable
                  key={practice.id}
                  style={({ pressed }) => [
                    styles.practiceCard,
                    isSelected && styles.practiceCardSelected,
                    pressed && styles.buttonPressed,
                  ]}
                  onPress={() => !hasGraduated && handleTogglePractice(practice.id)}
                  disabled={hasGraduated}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: isSelected }}
                  accessibilityLabel={`${practice.name}: ${practice.description}`}
                >
                  <View style={styles.practiceHeader}>
                    <Text style={styles.practiceIcon}>{practice.icon}</Text>
                    {isSelected && (
                      <View style={styles.checkCircle}>
                        <Text style={styles.checkMark}>{'\u2713'}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={[styles.practiceName, isSelected && styles.practiceNameSelected]}>
                    {practice.name}
                  </Text>
                  <Text style={styles.practiceDesc}>{practice.description}</Text>
                  <Text style={styles.practiceDuration}>{practice.duration}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Quote */}
        <View style={styles.quoteCard}>
          <Text style={styles.quoteText}>
            "The only impossible journey is the one you never begin."
          </Text>
          <Text style={styles.quoteAuthor}>- Tony Robbins</Text>
        </View>

        {/* Save Indicator */}
        {!hasGraduated && (
          <View style={{ alignItems: 'center', marginVertical: 16 }}>
            <SaveIndicator isSaving={isSaving} lastSaved={lastSaved} isError={isLoadError} onRetry={saveNow} />
          </View>
        )}

        {/* Action Buttons */}
        {hasGraduated ? (
          <View style={styles.buttonsContainer}>
            <Pressable
              style={({ pressed }) => [
                styles.shareButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={handleShare}
              accessibilityRole="button"
              accessibilityLabel="Share achievement"
            >
              <Text style={styles.shareButtonText}>Share Achievement</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.finishButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={handleFinish}
              accessibilityRole="button"
              accessibilityLabel="Return to workbook"
            >
              <Text style={styles.finishButtonText}>Return to Workbook</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable
            style={({ pressed }) => [
              styles.graduateButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleGraduate}
            accessibilityRole="button"
            accessibilityLabel="Complete graduation"
          >
            <Text style={styles.graduateButtonIcon}>{'\u2605'}</Text>
            <Text style={styles.graduateButtonText}>Complete My Journey</Text>
          </Pressable>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: DESIGN_COLORS.bgPrimary,
  },
  container: {
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
    alignItems: 'center',
  },
  phaseLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: DESIGN_COLORS.accentGold,
    letterSpacing: 2,
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: DESIGN_COLORS.textPrimary,
    marginBottom: 8,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: DESIGN_COLORS.textSecondary,
    lineHeight: 22,
    textAlign: 'center',
  },

  // Certificate Section
  certificateSection: {
    marginBottom: 24,
  },

  // Celebration Card
  celebrationCard: {
    backgroundColor: DESIGN_COLORS.bgElevated,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: DESIGN_COLORS.accentGold,
  },
  celebrationIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  celebrationTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: DESIGN_COLORS.accentGold,
    marginBottom: 8,
  },
  celebrationText: {
    fontSize: 15,
    color: DESIGN_COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 16,
  },
  viewCertButton: {
    backgroundColor: DESIGN_COLORS.accentGold,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  viewCertButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: DESIGN_COLORS.bgPrimary,
  },

  // Sections
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: DESIGN_COLORS.textPrimary,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: DESIGN_COLORS.textSecondary,
    marginBottom: 16,
  },

  // Commitment Card
  commitmentCard: {
    backgroundColor: DESIGN_COLORS.bgElevated,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
  },
  commitmentPrompt: {
    fontSize: 14,
    fontWeight: '600',
    color: DESIGN_COLORS.accentGold,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  commitmentInput: {
    backgroundColor: DESIGN_COLORS.bgPrimary,
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: DESIGN_COLORS.textPrimary,
    minHeight: 120,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
    lineHeight: 22,
  },
  signedBadge: {
    backgroundColor: DESIGN_COLORS.accentGreen,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignSelf: 'flex-end',
    marginTop: 12,
  },
  signedBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: DESIGN_COLORS.textPrimary,
  },

  // Practices Grid
  practicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  practiceCard: {
    width: '47%',
    backgroundColor: DESIGN_COLORS.bgElevated,
    borderRadius: 12,
    padding: 14,
    marginHorizontal: '1.5%',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
  },
  practiceCardSelected: {
    borderColor: DESIGN_COLORS.accentGold,
    backgroundColor: 'rgba(201, 162, 39, 0.1)',
  },
  practiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  practiceIcon: {
    fontSize: 24,
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: DESIGN_COLORS.accentGold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: {
    fontSize: 12,
    color: DESIGN_COLORS.bgPrimary,
    fontWeight: '700',
  },
  practiceName: {
    fontSize: 14,
    fontWeight: '600',
    color: DESIGN_COLORS.textPrimary,
    marginBottom: 4,
  },
  practiceNameSelected: {
    color: DESIGN_COLORS.accentGold,
  },
  practiceDesc: {
    fontSize: 11,
    color: DESIGN_COLORS.textSecondary,
    lineHeight: 16,
    marginBottom: 6,
  },
  practiceDuration: {
    fontSize: 10,
    color: DESIGN_COLORS.textTertiary,
    fontWeight: '600',
  },

  // Quote
  quoteCard: {
    backgroundColor: DESIGN_COLORS.bgSecondary,
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderLeftWidth: 3,
    borderLeftColor: DESIGN_COLORS.accentGold,
  },
  quoteText: {
    fontSize: 15,
    fontStyle: 'italic',
    color: DESIGN_COLORS.textPrimary,
    lineHeight: 22,
    marginBottom: 8,
  },
  quoteAuthor: {
    fontSize: 13,
    color: DESIGN_COLORS.textSecondary,
    textAlign: 'right',
  },

  // Buttons
  buttonsContainer: {
    gap: 12,
  },
  graduateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: DESIGN_COLORS.accentGold,
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 16,
    shadowColor: DESIGN_COLORS.accentGold,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
  graduateButtonIcon: {
    fontSize: 22,
    marginRight: 10,
  },
  graduateButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: DESIGN_COLORS.bgPrimary,
    letterSpacing: 0.5,
  },
  shareButton: {
    backgroundColor: DESIGN_COLORS.accentPurple,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: DESIGN_COLORS.textPrimary,
  },
  finishButton: {
    backgroundColor: DESIGN_COLORS.bgElevated,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
  },
  finishButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: DESIGN_COLORS.textSecondary,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },

  bottomSpacer: {
    height: 40,
  },
});

export default GraduationScreen;
