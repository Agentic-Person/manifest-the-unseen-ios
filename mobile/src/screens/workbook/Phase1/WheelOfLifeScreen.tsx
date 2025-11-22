/**
 * Wheel of Life Screen
 *
 * Interactive wheel visualization where users rate 8 life areas on a 0-10 scale.
 * Uses react-native-svg for the wheel chart visualization.
 * Auto-saves progress as users adjust their ratings.
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Svg, { Path, Circle, Line, Text as SvgText, G } from 'react-native-svg';
import Slider from '@react-native-community/slider';
import { Button, Card, Text } from '../../../components';
import { colors, spacing, borderRadius, shadows } from '../../../theme';
import type { WorkbookStackScreenProps } from '../../../types/navigation';

/**
 * Life area data structure
 */
interface LifeArea {
  id: string;
  name: string;
  color: string;
  value: number;
  description: string;
}

/**
 * Default life areas for the Wheel of Life
 */
const DEFAULT_LIFE_AREAS: LifeArea[] = [
  {
    id: 'career',
    name: 'Career',
    color: '#8B5CF6', // Primary purple
    value: 5,
    description: 'Your professional life, job satisfaction, and growth',
  },
  {
    id: 'health',
    name: 'Health',
    color: '#10B981', // Success green
    value: 5,
    description: 'Physical health, fitness, and energy levels',
  },
  {
    id: 'relationships',
    name: 'Relationships',
    color: '#F43F5E', // Rose
    value: 5,
    description: 'Romantic relationships and partnerships',
  },
  {
    id: 'finance',
    name: 'Finance',
    color: '#FBBF24', // Gold
    value: 5,
    description: 'Financial security, income, and wealth building',
  },
  {
    id: 'personal-growth',
    name: 'Personal Growth',
    color: '#3B82F6', // Blue
    value: 5,
    description: 'Learning, self-improvement, and development',
  },
  {
    id: 'family',
    name: 'Family',
    color: '#EC4899', // Pink
    value: 5,
    description: 'Family relationships and support system',
  },
  {
    id: 'recreation',
    name: 'Recreation',
    color: '#F97316', // Orange
    value: 5,
    description: 'Hobbies, fun, and leisure activities',
  },
  {
    id: 'spirituality',
    name: 'Spirituality',
    color: '#6366F1', // Indigo
    value: 5,
    description: 'Inner peace, purpose, and spiritual practice',
  },
];

type Props = WorkbookStackScreenProps<'WheelOfLife'>;

/**
 * Wheel of Life Screen Component
 */
const WheelOfLifeScreen: React.FC<Props> = ({ navigation }) => {
  const [lifeAreas, setLifeAreas] = useState<LifeArea[]>(DEFAULT_LIFE_AREAS);
  const [selectedArea, setSelectedArea] = useState<LifeArea | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Screen dimensions for responsive wheel
  const screenWidth = Dimensions.get('window').width;
  const wheelSize = Math.min(screenWidth - spacing.md * 4, 320);
  const centerX = wheelSize / 2;
  const centerY = wheelSize / 2;
  const maxRadius = wheelSize / 2 - 20;

  /**
   * Auto-save functionality
   */
  useEffect(() => {
    const saveTimer = setTimeout(() => {
      autoSave();
    }, 2000); // Save 2 seconds after last change

    return () => clearTimeout(saveTimer);
  }, [lifeAreas]);

  /**
   * Auto-save progress to storage/backend
   */
  const autoSave = useCallback(async () => {
    setIsSaving(true);
    try {
      // TODO: Save to Supabase
      // await supabase.from('workbook_progress').upsert({
      //   exercise_id: 'wheel-of-life',
      //   data: lifeAreas,
      //   updated_at: new Date().toISOString(),
      // });
      console.log('Auto-saving wheel of life data:', lifeAreas);
      setLastSaved(new Date());
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setIsSaving(false);
    }
  }, [lifeAreas]);

  /**
   * Handle slider value change
   */
  const handleValueChange = (areaId: string, value: number) => {
    setLifeAreas(prev =>
      prev.map(area =>
        area.id === areaId ? { ...area, value: Math.round(value) } : area
      )
    );
  };

  /**
   * Calculate path for pie slice
   */
  const getSlicePath = (
    index: number,
    value: number,
    total: number
  ): string => {
    const anglePerSlice = (2 * Math.PI) / total;
    const startAngle = index * anglePerSlice - Math.PI / 2;
    const endAngle = (index + 1) * anglePerSlice - Math.PI / 2;
    const radius = (value / 10) * maxRadius;

    const x1 = centerX + radius * Math.cos(startAngle);
    const y1 = centerY + radius * Math.sin(startAngle);
    const x2 = centerX + radius * Math.cos(endAngle);
    const y2 = centerY + radius * Math.sin(endAngle);

    const largeArc = anglePerSlice > Math.PI ? 1 : 0;

    return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
  };

  /**
   * Calculate average score
   */
  const averageScore = (
    lifeAreas.reduce((sum, area) => sum + area.value, 0) / lifeAreas.length
  ).toFixed(1);

  /**
   * Get balance status message
   */
  const getBalanceMessage = (): string => {
    const values = lifeAreas.map(a => a.value);
    const max = Math.max(...values);
    const min = Math.min(...values);
    const diff = max - min;

    if (diff <= 2) return 'Well balanced! Keep it up.';
    if (diff <= 4) return 'Slightly unbalanced. Consider focusing on lower areas.';
    return 'Unbalanced. Some areas need attention.';
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Wheel of Life</Text>
        <Text style={styles.subtitle}>
          Rate each area of your life from 0-10 to visualize your current balance
        </Text>
      </View>

      {/* Wheel Visualization */}
      <Card elevation="raised" style={styles.wheelCard}>
        <View style={styles.wheelContainer}>
          <Svg width={wheelSize} height={wheelSize}>
            {/* Background circles for scale reference */}
            {[2, 4, 6, 8, 10].map(level => (
              <Circle
                key={`circle-${level}`}
                cx={centerX}
                cy={centerY}
                r={(level / 10) * maxRadius}
                fill="none"
                stroke={colors.gray[200]}
                strokeWidth={1}
                strokeDasharray={level === 10 ? "0" : "4,4"}
              />
            ))}

            {/* Grid lines */}
            {lifeAreas.map((_, index) => {
              const angle = (index * 2 * Math.PI) / lifeAreas.length - Math.PI / 2;
              const x2 = centerX + maxRadius * Math.cos(angle);
              const y2 = centerY + maxRadius * Math.sin(angle);
              return (
                <Line
                  key={`line-${index}`}
                  x1={centerX}
                  y1={centerY}
                  x2={x2}
                  y2={y2}
                  stroke={colors.gray[200]}
                  strokeWidth={1}
                />
              );
            })}

            {/* Pie slices for each life area */}
            {lifeAreas.map((area, index) => (
              <Path
                key={area.id}
                d={getSlicePath(index, area.value, lifeAreas.length)}
                fill={area.color}
                fillOpacity={0.7}
                stroke={area.color}
                strokeWidth={2}
                onPress={() => setSelectedArea(area)}
              />
            ))}

            {/* Labels around the wheel */}
            {lifeAreas.map((area, index) => {
              const angle = ((index + 0.5) * 2 * Math.PI) / lifeAreas.length - Math.PI / 2;
              const labelRadius = maxRadius + 15;
              const x = centerX + labelRadius * Math.cos(angle);
              const y = centerY + labelRadius * Math.sin(angle);

              return (
                <SvgText
                  key={`label-${area.id}`}
                  x={x}
                  y={y}
                  fontSize={10}
                  fontWeight="600"
                  fill={colors.text.primary}
                  textAnchor="middle"
                  alignmentBaseline="middle"
                >
                  {area.value}
                </SvgText>
              );
            })}

            {/* Center score */}
            <G>
              <Circle
                cx={centerX}
                cy={centerY}
                r={30}
                fill={colors.background.primary}
              />
              <SvgText
                x={centerX}
                y={centerY - 5}
                fontSize={16}
                fontWeight="700"
                fill={colors.primary[600]}
                textAnchor="middle"
              >
                {averageScore}
              </SvgText>
              <SvgText
                x={centerX}
                y={centerY + 10}
                fontSize={9}
                fill={colors.text.tertiary}
                textAnchor="middle"
              >
                AVG
              </SvgText>
            </G>
          </Svg>
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          {lifeAreas.map(area => (
            <TouchableArea
              key={area.id}
              area={area}
              isSelected={selectedArea?.id === area.id}
              onPress={() => setSelectedArea(area)}
            />
          ))}
        </View>
      </Card>

      {/* Balance Message */}
      <Card elevation="flat" style={styles.messageCard}>
        <Text style={styles.messageText}>{getBalanceMessage()}</Text>
      </Card>

      {/* Sliders for each area */}
      <View style={styles.slidersSection}>
        <Text style={styles.sectionTitle}>Adjust Your Ratings</Text>
        {lifeAreas.map(area => (
          <SliderCard
            key={area.id}
            area={area}
            onValueChange={(value) => handleValueChange(area.id, value)}
          />
        ))}
      </View>

      {/* Save Status */}
      {lastSaved && (
        <Text style={styles.saveStatus}>
          {isSaving ? 'Saving...' : `Last saved: ${lastSaved.toLocaleTimeString()}`}
        </Text>
      )}

      {/* Action Buttons */}
      <View style={styles.actions}>
        <Button
          title="Save & Continue"
          onPress={() => {
            autoSave();
            navigation.goBack();
          }}
          variant="primary"
          fullWidth
        />
      </View>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

/**
 * TouchableArea Component - Legend item
 */
const TouchableArea: React.FC<{
  area: LifeArea;
  isSelected: boolean;
  onPress: () => void;
}> = ({ area, isSelected, onPress: _onPress }) => (
  <View
    style={[
      styles.legendItem,
      isSelected && styles.legendItemSelected,
    ]}
  >
    <View style={[styles.legendDot, { backgroundColor: area.color }]} />
    <Text style={styles.legendText}>{area.name}</Text>
  </View>
);

/**
 * SliderCard Component - Individual area slider
 */
const SliderCard: React.FC<{
  area: LifeArea;
  onValueChange: (value: number) => void;
}> = ({ area, onValueChange }) => (
  <View style={styles.sliderCard}>
    <View style={styles.sliderHeader}>
      <View style={styles.sliderTitleRow}>
        <View style={[styles.sliderDot, { backgroundColor: area.color }]} />
        <Text style={styles.sliderTitle}>{area.name}</Text>
      </View>
      <Text style={styles.sliderValue}>{area.value}</Text>
    </View>
    <Text style={styles.sliderDescription}>{area.description}</Text>
    <Slider
      style={styles.slider}
      minimumValue={0}
      maximumValue={10}
      step={1}
      value={area.value}
      onValueChange={onValueChange}
      minimumTrackTintColor={area.color}
      maximumTrackTintColor={colors.gray[200]}
      thumbTintColor={area.color}
    />
    <View style={styles.sliderLabels}>
      <Text style={styles.sliderLabel}>0</Text>
      <Text style={styles.sliderLabel}>5</Text>
      <Text style={styles.sliderLabel}>10</Text>
    </View>
  </View>
);

/**
 * Styles
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  content: {
    padding: spacing.md,
  },
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    lineHeight: 24,
  },
  wheelCard: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  wheelContainer: {
    marginBottom: spacing.md,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    backgroundColor: colors.gray[50],
  },
  legendItemSelected: {
    backgroundColor: colors.primary[50],
    borderWidth: 1,
    borderColor: colors.primary[300],
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: borderRadius.full,
    marginRight: spacing.xs,
  },
  legendText: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  messageCard: {
    backgroundColor: colors.primary[50],
    borderColor: colors.primary[200],
    borderWidth: 1,
    marginBottom: spacing.lg,
  },
  messageText: {
    fontSize: 14,
    color: colors.primary[700],
    textAlign: 'center',
  },
  slidersSection: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  sliderCard: {
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  sliderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sliderDot: {
    width: 12,
    height: 12,
    borderRadius: borderRadius.full,
    marginRight: spacing.sm,
  },
  sliderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  sliderValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary[600],
  },
  sliderDescription: {
    fontSize: 14,
    color: colors.text.tertiary,
    marginBottom: spacing.sm,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xs,
  },
  sliderLabel: {
    fontSize: 12,
    color: colors.text.tertiary,
  },
  saveStatus: {
    fontSize: 12,
    color: colors.text.tertiary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  actions: {
    marginTop: spacing.md,
  },
  bottomSpacer: {
    height: spacing.xl,
  },
});

export default WheelOfLifeScreen;
