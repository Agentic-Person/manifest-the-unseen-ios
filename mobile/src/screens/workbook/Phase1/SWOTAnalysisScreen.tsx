/**
 * SWOT Analysis Screen - Organic Flower Petal Layout
 *
 * Spiritual/meditative design with:
 * - Organic flower petal quadrants (NOT corporate grid)
 * - Central mandala/lotus connecting element
 * - Natural-styled tags (leaves, stones, waves, embers)
 * - Dark theme following APP-DESIGN.md specifications
 *
 * Design philosophy: Ancient wisdom fusion, hand-drawn aesthetic,
 * earth connection, sacred geometry.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Animated,
} from 'react-native';
import { Text, Button } from '../../../components';
import { SWOTQuadrant } from '../../../components/workbook/SWOTQuadrant';
import { SaveIndicator } from '../../../components/workbook';
import { colors, spacing, borderRadius } from '../../../theme';
import type { WorkbookStackScreenProps } from '../../../types/navigation';
import { useWorkbookProgress } from '../../../hooks/useWorkbook';
import { useAutoSave } from '../../../hooks/useAutoSave';
import { WORKSHEET_IDS } from '../../../types/workbook';

/**
 * SWOT Data Interface
 */
export interface SWOTData {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  updatedAt: string;
}

/**
 * Default empty SWOT data
 */
const getDefaultSWOTData = (): SWOTData => ({
  strengths: [],
  weaknesses: [],
  opportunities: [],
  threats: [],
  updatedAt: new Date().toISOString(),
});

type Props = WorkbookStackScreenProps<'SWOT'>;

/**
 * Central Mandala Component
 * Connects all four quadrants with sacred geometry
 */
const CentralMandala: React.FC<{ totalItems: number }> = ({ totalItems }) => {
  const [rotation] = useState(new Animated.Value(0));

  useEffect(() => {
    // Subtle continuous rotation animation
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 60000, // Very slow rotation
        useNativeDriver: true,
      })
    ).start();
  }, [rotation]);

  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={mandalaStyles.container}>
      <Animated.View
        style={[
          mandalaStyles.outerRing,
          { transform: [{ rotate: rotateInterpolate }] },
        ]}
      >
        {/* Sacred geometry pattern */}
        <View style={mandalaStyles.petal1} />
        <View style={mandalaStyles.petal2} />
        <View style={mandalaStyles.petal3} />
        <View style={mandalaStyles.petal4} />
      </Animated.View>

      {/* Inner lotus/flower */}
      <View style={mandalaStyles.innerCircle}>
        <View style={mandalaStyles.lotus}>
          <Text style={mandalaStyles.lotusSymbol}>{'\u2740'}</Text>
        </View>
      </View>

      {/* Item count */}
      <View style={mandalaStyles.countContainer}>
        <Text style={mandalaStyles.countText}>{totalItems}</Text>
        <Text style={mandalaStyles.countLabel}>items</Text>
      </View>
    </View>
  );
};

/**
 * SWOT Analysis Screen Component
 */
const SWOTAnalysisScreen: React.FC<Props> = ({ navigation }) => {
  const [swotData, setSWOTData] = useState<SWOTData>(getDefaultSWOTData());

  // Load saved data from Supabase
  const { data: savedProgress } = useWorkbookProgress(1, WORKSHEET_IDS.SWOT_ANALYSIS);

  // Auto-save with debounce
  const { isSaving, isError, lastSaved, saveNow } = useAutoSave({
    data: swotData as unknown as Record<string, unknown>,
    phaseNumber: 1,
    worksheetId: WORKSHEET_IDS.SWOT_ANALYSIS,
    debounceMs: 2000,
  });

  // Load saved data into state when fetched
  useEffect(() => {
    if (savedProgress?.data) {
      const saved = savedProgress.data as unknown as SWOTData;
      setSWOTData(saved);
    }
  }, [savedProgress]);

  /**
   * Update handler for each quadrant
   */
  const updateQuadrant = (
    quadrant: keyof Pick<SWOTData, 'strengths' | 'weaknesses' | 'opportunities' | 'threats'>,
    items: string[]
  ) => {
    setSWOTData((prev) => ({
      ...prev,
      [quadrant]: items,
      updatedAt: new Date().toISOString(),
    }));
  };

  /**
   * Calculate total items across all quadrants
   */
  const totalItems =
    swotData.strengths.length +
    swotData.weaknesses.length +
    swotData.opportunities.length +
    swotData.threats.length;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header with hand-drawn style */}
      <View style={styles.header}>
        <Text style={styles.title}>SWOT Analysis</Text>
        <Text style={styles.subtitle}>
          Explore your inner landscape through the four petals of self-discovery
        </Text>
      </View>

      {/* Flower Petal Layout */}
      <View style={styles.flowerContainer}>
        {/* Top Row: Strengths & Weaknesses */}
        <View style={styles.petalRow}>
          <SWOTQuadrant
            type="strengths"
            position="topLeft"
            items={swotData.strengths}
            onItemsChange={(items) => updateQuadrant('strengths', items)}
          />
          <SWOTQuadrant
            type="weaknesses"
            position="topRight"
            items={swotData.weaknesses}
            onItemsChange={(items) => updateQuadrant('weaknesses', items)}
          />
        </View>

        {/* Central Mandala */}
        <View style={styles.mandalaWrapper}>
          <CentralMandala totalItems={totalItems} />
        </View>

        {/* Bottom Row: Opportunities & Threats */}
        <View style={styles.petalRow}>
          <SWOTQuadrant
            type="opportunities"
            position="bottomLeft"
            items={swotData.opportunities}
            onItemsChange={(items) => updateQuadrant('opportunities', items)}
          />
          <SWOTQuadrant
            type="threats"
            position="bottomRight"
            items={swotData.threats}
            onItemsChange={(items) => updateQuadrant('threats', items)}
          />
        </View>
      </View>

      {/* Connection lines hint */}
      <View style={styles.insightHint}>
        <Text style={styles.insightIcon}>{'\u2728'}</Text>
        <Text style={styles.insightText}>
          Tap each petal to add your insights. Your strengths can help overcome
          threats, and opportunities can address weaknesses.
        </Text>
      </View>

      {/* Save status */}
      <SaveIndicator
        isSaving={isSaving}
        lastSaved={lastSaved}
        isError={isError}
        onRetry={saveNow}
      />

      {/* Actions */}
      <View style={styles.actions}>
        <Button
          title="Save & Continue"
          onPress={() => {
            saveNow();
            navigation.goBack();
          }}
          variant="primary"
          fullWidth
          style={styles.saveButton}
        />
      </View>

      {/* Bottom spacing */}
      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

/**
 * Mandala specific styles
 */
const mandalaStyles = StyleSheet.create({
  container: {
    width: 90,
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },

  outerRing: {
    position: 'absolute',
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },

  petal1: {
    position: 'absolute',
    width: 30,
    height: 30,
    backgroundColor: colors.swot.strengths.glow,
    borderRadius: 15,
    top: 0,
    left: 10,
  },

  petal2: {
    position: 'absolute',
    width: 30,
    height: 30,
    backgroundColor: colors.swot.weaknesses.glow,
    borderRadius: 15,
    top: 0,
    right: 10,
  },

  petal3: {
    position: 'absolute',
    width: 30,
    height: 30,
    backgroundColor: colors.swot.opportunities.glow,
    borderRadius: 15,
    bottom: 0,
    left: 10,
  },

  petal4: {
    position: 'absolute',
    width: 30,
    height: 30,
    backgroundColor: colors.swot.threats.glow,
    borderRadius: 15,
    bottom: 0,
    right: 10,
  },

  innerCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.dark.bgElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.dark.accentGold,
  },

  lotus: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  lotusSymbol: {
    fontSize: 24,
    color: colors.dark.accentGold,
  },

  countContainer: {
    position: 'absolute',
    bottom: -5,
    alignItems: 'center',
  },

  countText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.dark.textPrimary,
  },

  countLabel: {
    fontSize: 9,
    color: colors.dark.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

/**
 * Main screen styles
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.bgPrimary,
  },

  content: {
    padding: spacing.md,
  },

  header: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.dark.textPrimary,
    marginBottom: spacing.xs,
    // In production, use a Sanskrit-inspired font
    letterSpacing: 1,
  },

  subtitle: {
    fontSize: 14,
    color: colors.dark.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 20,
    paddingHorizontal: spacing.lg,
  },

  flowerContainer: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },

  petalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: spacing.md,
  },

  mandalaWrapper: {
    marginVertical: -30, // Overlap with petals for connected look
    zIndex: 10,
  },

  insightHint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.dark.bgElevated,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(201, 162, 39, 0.2)', // Subtle gold border
  },

  insightIcon: {
    fontSize: 18,
    marginRight: spacing.sm,
  },

  insightText: {
    flex: 1,
    fontSize: 13,
    color: colors.dark.textSecondary,
    lineHeight: 20,
    fontStyle: 'italic',
  },

  saveStatus: {
    fontSize: 12,
    color: colors.dark.textTertiary,
    textAlign: 'center',
    marginVertical: spacing.sm,
  },

  actions: {
    marginTop: spacing.md,
  },

  saveButton: {
    // Override button to match dark theme
    backgroundColor: colors.dark.accentPurple,
  },

  bottomSpacer: {
    height: spacing['2xl'],
  },
});

export default SWOTAnalysisScreen;
