/**
 * Wheel of Life Screen
 *
 * Interactive target/bullseye visualization where users rate 8 life areas on a 1-10 scale.
 * Features the dark spiritual theme from APP-DESIGN.md.
 *
 * Design Requirements (from APP-DESIGN.md):
 * - Layout: Target/bullseye style (NOT pie chart)
 * - Concentric rings (1 = center, 10 = outer edge)
 * - User's ratings connected by a gold polygon line
 * - Dark background #1a1a2e
 * - Muted gold #c9a227 for the connected polygon
 * - Hand-drawn style icons for each life area
 *
 * Data persists to Supabase workbook_progress table.
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  Text,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { WheelChart, LifeAreaSlider, LIFE_AREAS, SaveIndicator } from '../../../components/workbook';
import type { WheelOfLifeValues, LifeAreaKey } from '../../../components/workbook';
import type { WorkbookStackScreenProps } from '../../../types/navigation';
import { useWorkbookProgress } from '../../../hooks/useWorkbook';
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
  accentPurpleLight: '#6b2d8b',
  accentGold: '#c9a227',
  accentTeal: '#1a5f5f',
  accentGreen: '#2d5a4a',
  accentRose: '#8b3a5f',
  accentAmber: '#8b6914',
  border: '#3a3a5a',
  success: '#2d5a4a',
};

// Default initial values for all life areas
const DEFAULT_VALUES: WheelOfLifeValues = {
  career: 5,
  health: 5,
  relationships: 5,
  finance: 5,
  personalGrowth: 5,
  family: 5,
  recreation: 5,
  spirituality: 5,
};

// Life area descriptions for the sliders
const LIFE_AREA_DESCRIPTIONS: Record<LifeAreaKey, string> = {
  career: 'Your professional life, job satisfaction, and career growth',
  health: 'Physical health, fitness, energy, and wellness',
  relationships: 'Romantic relationships, friendships, and connections',
  finance: 'Financial security, income, savings, and wealth',
  personalGrowth: 'Learning, self-improvement, and personal development',
  family: 'Family relationships and your support system',
  recreation: 'Hobbies, fun, leisure, and creative activities',
  spirituality: 'Inner peace, purpose, and spiritual practice',
};

// Colors for each life area
const LIFE_AREA_COLORS: Record<LifeAreaKey, string> = {
  career: DESIGN_COLORS.accentPurple,
  health: DESIGN_COLORS.accentGreen,
  relationships: DESIGN_COLORS.accentRose,
  finance: DESIGN_COLORS.accentAmber,
  personalGrowth: DESIGN_COLORS.accentTeal,
  family: DESIGN_COLORS.accentGreen,
  recreation: DESIGN_COLORS.accentTeal,
  spirituality: DESIGN_COLORS.accentPurple,
};

type Props = WorkbookStackScreenProps<'WheelOfLife'>;

/**
 * Wheel of Life Screen Component
 */
const WheelOfLifeScreen: React.FC<Props> = ({ navigation }) => {
  const [values, setValues] = useState<WheelOfLifeValues>(DEFAULT_VALUES);
  const [selectedArea, setSelectedArea] = useState<LifeAreaKey | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  // Screen dimensions
  const screenWidth = Dimensions.get('window').width;
  const chartSize = Math.min(screenWidth - 32, 340);

  // Load saved data from Supabase
  const { data: savedProgress, isLoading } = useWorkbookProgress(1, WORKSHEET_IDS.WHEEL_OF_LIFE);

  // Auto-save with debounce
  const { isSaving, isError, lastSaved, saveNow } = useAutoSave({
    data: values as unknown as Record<string, unknown>,
    phaseNumber: 1,
    worksheetId: WORKSHEET_IDS.WHEEL_OF_LIFE,
    debounceMs: 1500,
  });

  // Load saved data into state when fetched
  useEffect(() => {
    if (savedProgress?.data) {
      const savedData = savedProgress.data as unknown as WheelOfLifeValues;
      setValues(savedData);
    }
  }, [savedProgress]);

  /**
   * Handle value change for a life area
   */
  const handleValueChange = useCallback((area: LifeAreaKey, value: number) => {
    setValues((prev) => ({
      ...prev,
      [area]: value,
    }));
  }, []);

  /**
   * Handle area selection from the chart
   */
  const handleAreaPress = useCallback((area: LifeAreaKey) => {
    setSelectedArea(area);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Could scroll to the relevant slider here
  }, []);

  /**
   * Calculate overall balance status
   */
  const getBalanceStatus = (): { message: string; type: 'balanced' | 'moderate' | 'unbalanced' } => {
    const vals = Object.values(values);
    const max = Math.max(...vals);
    const min = Math.min(...vals);
    const diff = max - min;
    const avg = vals.reduce((a, b) => a + b, 0) / vals.length;

    if (diff <= 2 && avg >= 6) {
      return { message: 'Beautifully balanced! You are living in harmony.', type: 'balanced' };
    }
    if (diff <= 3) {
      return { message: 'Well balanced. Small adjustments will bring greater harmony.', type: 'balanced' };
    }
    if (diff <= 5) {
      return { message: 'Moderately balanced. Some areas need more attention.', type: 'moderate' };
    }
    return { message: 'Imbalanced. Focus on the lower-rated areas for growth.', type: 'unbalanced' };
  };

  /**
   * Handle save and continue
   */
  const handleSaveAndContinue = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    saveNow({ completed: true });
    navigation.goBack();
  };

  const balanceStatus = getBalanceStatus();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={50} color={DESIGN_COLORS.accentGold} />
        <Text style={styles.loadingText}>Loading your progress...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      ref={scrollViewRef}
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.title}>Wheel of Life</Text>
        <Text style={styles.subtitle}>
          Rate each area of your life from 1-10 to visualize your current balance.
          A perfect circle represents a balanced life.
        </Text>
      </View>

      {/* Wheel Chart Visualization */}
      <View style={styles.chartContainer}>
        <WheelChart
          values={values}
          size={chartSize}
          onAreaPress={handleAreaPress}
          showLabels={true}
          showDots={true}
        />
      </View>

      {/* Balance Status Card */}
      <View
        style={[
          styles.statusCard,
          balanceStatus.type === 'balanced' && styles.statusCardBalanced,
          balanceStatus.type === 'moderate' && styles.statusCardModerate,
          balanceStatus.type === 'unbalanced' && styles.statusCardUnbalanced,
        ]}
      >
        <Text style={styles.statusText}>{balanceStatus.message}</Text>
      </View>

      {/* Sliders Section */}
      <View style={styles.slidersSection}>
        <Text style={styles.sectionTitle}>Adjust Your Ratings</Text>
        <Text style={styles.sectionSubtitle}>
          Tap and drag each slider to rate your satisfaction level
        </Text>

        {LIFE_AREAS.map((area) => (
          <LifeAreaSlider
            key={area.key}
            label={area.label}
            description={LIFE_AREA_DESCRIPTIONS[area.key]}
            value={values[area.key]}
            onValueChange={(value) => handleValueChange(area.key, value)}
            accentColor={LIFE_AREA_COLORS[area.key]}
            isSelected={selectedArea === area.key}
            onPress={() => setSelectedArea(area.key)}
          />
        ))}
      </View>

      {/* Save Status */}
      <View style={styles.saveStatusContainer}>
        <SaveIndicator
          isSaving={isSaving}
          lastSaved={lastSaved}
          isError={isError}
          onRetry={saveNow}
        />
      </View>

      {/* Action Button */}
      <Pressable
        style={({ pressed }) => [
          styles.saveButton,
          pressed && styles.saveButtonPressed,
        ]}
        onPress={handleSaveAndContinue}
      >
        <Text style={styles.saveButtonText}>Save & Continue</Text>
      </Pressable>

      {/* Bottom spacing */}
      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DESIGN_COLORS.bgPrimary,
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
  chartContainer: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 16,
    backgroundColor: DESIGN_COLORS.bgSecondary,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
  },
  statusCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
  },
  statusCardBalanced: {
    backgroundColor: 'rgba(45, 90, 74, 0.2)',
    borderColor: DESIGN_COLORS.accentGreen,
  },
  statusCardModerate: {
    backgroundColor: 'rgba(201, 162, 39, 0.15)',
    borderColor: DESIGN_COLORS.accentGold,
  },
  statusCardUnbalanced: {
    backgroundColor: 'rgba(139, 58, 95, 0.2)',
    borderColor: DESIGN_COLORS.accentRose,
  },
  statusText: {
    fontSize: 14,
    color: DESIGN_COLORS.textPrimary,
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: '500',
  },
  slidersSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: DESIGN_COLORS.textPrimary,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: DESIGN_COLORS.textTertiary,
    marginBottom: 16,
  },
  saveStatusContainer: {
    alignItems: 'center',
    marginBottom: 16,
    minHeight: 20,
  },
  saveStatus: {
    fontSize: 12,
    color: DESIGN_COLORS.textTertiary,
  },
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
});

export default WheelOfLifeScreen;
