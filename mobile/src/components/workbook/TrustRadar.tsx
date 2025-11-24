/**
 * TrustRadar Component
 *
 * A spider/radar chart visualization for Phase 9: Trust & Surrender.
 * Displays 5 dimensions of trust as a radar chart with interactive points.
 *
 * Features:
 * - SVG-based radar chart with 5 axes
 * - Animated polygon showing trust profile
 * - Interactive tapping on dimensions (optional)
 * - Accessible labels on all elements
 *
 * Design (from APP-DESIGN.md):
 * - Background: #1a1a2e (deep charcoal)
 * - Elevated surfaces: #252547
 * - Accent gold: #c9a227 for highlight polygon
 * - Accent purple: #4a1a6b for grid lines
 */

import React, { useMemo } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  Dimensions,
} from 'react-native';
import Svg, {
  Polygon,
  Circle,
  Line,
  Text as SvgText,
  G,
} from 'react-native-svg';
import * as Haptics from 'expo-haptics';

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
  border: '#3a3a5a',
};

/**
 * Trust Dimension Configuration
 */
export type TrustDimension =
  | 'self'
  | 'others'
  | 'universe'
  | 'process'
  | 'timing';

export interface TrustDimensionConfig {
  key: TrustDimension;
  label: string;
  shortLabel: string;
  description: string;
}

export const TRUST_DIMENSIONS: TrustDimensionConfig[] = [
  {
    key: 'self',
    label: 'Trust in Self',
    shortLabel: 'Self',
    description: 'Confidence in your own abilities, intuition, and decisions',
  },
  {
    key: 'others',
    label: 'Trust in Others',
    shortLabel: 'Others',
    description: 'Faith in people, relationships, and community support',
  },
  {
    key: 'universe',
    label: 'Trust in Universe',
    shortLabel: 'Universe',
    description: 'Belief in a higher power, divine guidance, or cosmic order',
  },
  {
    key: 'process',
    label: 'Trust in Process',
    shortLabel: 'Process',
    description: 'Faith that the journey matters and growth happens in stages',
  },
  {
    key: 'timing',
    label: 'Trust in Timing',
    shortLabel: 'Timing',
    description: 'Acceptance that things happen when they are meant to',
  },
];

/**
 * Trust Values Interface
 */
export interface TrustValues {
  self: number;
  others: number;
  universe: number;
  process: number;
  timing: number;
}

/**
 * Component Props
 */
export interface TrustRadarProps {
  values: TrustValues;
  size?: number;
  onDimensionTap?: (dimension: TrustDimension) => void;
  showLabels?: boolean;
  showValues?: boolean;
  animated?: boolean;
}

/**
 * Calculate point position on radar
 */
const getPointPosition = (
  centerX: number,
  centerY: number,
  radius: number,
  angle: number,
  value: number,
  maxValue: number = 10
): { x: number; y: number } => {
  const normalizedValue = value / maxValue;
  const adjustedRadius = radius * normalizedValue;
  const x = centerX + adjustedRadius * Math.cos(angle - Math.PI / 2);
  const y = centerY + adjustedRadius * Math.sin(angle - Math.PI / 2);
  return { x, y };
};

/**
 * TrustRadar Component
 */
export const TrustRadar: React.FC<TrustRadarProps> = ({
  values,
  size = Math.min(Dimensions.get('window').width - 48, 300),
  onDimensionTap,
  showLabels = true,
  showValues = true,
  animated: _animated = true,
}) => {
  const centerX = size / 2;
  const centerY = size / 2;
  const maxRadius = size / 2 - 40; // Leave space for labels
  const numDimensions = TRUST_DIMENSIONS.length;
  const angleStep = (2 * Math.PI) / numDimensions;

  /**
   * Calculate polygon points for the value shape
   */
  const valuePolygonPoints = useMemo(() => {
    return TRUST_DIMENSIONS.map((dim, index) => {
      const angle = index * angleStep;
      const value = values[dim.key];
      const { x, y } = getPointPosition(centerX, centerY, maxRadius, angle, value);
      return `${x},${y}`;
    }).join(' ');
  }, [values, centerX, centerY, maxRadius, angleStep]);

  /**
   * Calculate grid circles
   */
  const gridCircles = useMemo(() => {
    const circles = [];
    for (let i = 2; i <= 10; i += 2) {
      circles.push({
        level: i,
        radius: maxRadius * (i / 10),
      });
    }
    return circles;
  }, [maxRadius]);

  /**
   * Handle dimension tap
   */
  const handleDimensionTap = (dimension: TrustDimension) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (onDimensionTap) {
      onDimensionTap(dimension);
    }
  };

  /**
   * Calculate average trust score
   */
  const averageScore = useMemo(() => {
    const total = Object.values(values).reduce((sum, val) => sum + val, 0);
    return (total / numDimensions).toFixed(1);
  }, [values, numDimensions]);

  /**
   * Get trust level message
   */
  const getTrustLevelMessage = (avg: number): string => {
    if (avg >= 8) return 'Strong Foundation of Trust';
    if (avg >= 6) return 'Growing Trust';
    if (avg >= 4) return 'Building Trust';
    return 'Room for Growth';
  };

  return (
    <View style={styles.container}>
      {/* Average Score Display */}
      <View style={styles.scoreContainer}>
        <Text
          style={styles.scoreLabel}
          accessibilityRole="text"
          accessibilityLabel={`Average trust score: ${averageScore} out of 10`}
        >
          Trust Profile
        </Text>
        <Text style={styles.scoreValue}>{averageScore}</Text>
        <Text style={styles.scoreMax}>/10</Text>
      </View>
      <Text style={styles.trustLevel}>
        {getTrustLevelMessage(parseFloat(averageScore))}
      </Text>

      {/* SVG Radar Chart */}
      <View
        style={[styles.chartContainer, { width: size, height: size }]}
        accessibilityRole="image"
        accessibilityLabel="Trust radar chart showing your trust profile across 5 dimensions"
      >
        <Svg width={size} height={size}>
          {/* Grid Circles */}
          {gridCircles.map((circle) => (
            <Circle
              key={`grid-${circle.level}`}
              cx={centerX}
              cy={centerY}
              r={circle.radius}
              fill="none"
              stroke={DESIGN_COLORS.border}
              strokeWidth={1}
              strokeDasharray="4,4"
              opacity={0.5}
            />
          ))}

          {/* Axis Lines */}
          {TRUST_DIMENSIONS.map((dim, index) => {
            const angle = index * angleStep;
            const endPoint = getPointPosition(centerX, centerY, maxRadius, angle, 10);
            return (
              <Line
                key={`axis-${dim.key}`}
                x1={centerX}
                y1={centerY}
                x2={endPoint.x}
                y2={endPoint.y}
                stroke={DESIGN_COLORS.border}
                strokeWidth={1}
                opacity={0.6}
              />
            );
          })}

          {/* Value Polygon */}
          <Polygon
            points={valuePolygonPoints}
            fill={`${DESIGN_COLORS.accentGold}40`}
            stroke={DESIGN_COLORS.accentGold}
            strokeWidth={2}
            strokeLinejoin="round"
          />

          {/* Data Points */}
          {TRUST_DIMENSIONS.map((dim, index) => {
            const angle = index * angleStep;
            const value = values[dim.key];
            const { x, y } = getPointPosition(centerX, centerY, maxRadius, angle, value);
            return (
              <G key={`point-${dim.key}`}>
                <Circle
                  cx={x}
                  cy={y}
                  r={8}
                  fill={DESIGN_COLORS.bgElevated}
                  stroke={DESIGN_COLORS.accentGold}
                  strokeWidth={2}
                />
                {showValues && (
                  <SvgText
                    x={x}
                    y={y + 4}
                    fontSize={10}
                    fontWeight="bold"
                    fill={DESIGN_COLORS.textPrimary}
                    textAnchor="middle"
                  >
                    {value}
                  </SvgText>
                )}
              </G>
            );
          })}

          {/* Axis Labels */}
          {showLabels &&
            TRUST_DIMENSIONS.map((dim, index) => {
              const angle = index * angleStep;
              const labelDistance = maxRadius + 25;
              const { x, y } = getPointPosition(centerX, centerY, labelDistance, angle, 10);

              // Adjust text anchor based on position
              let textAnchor: 'start' | 'middle' | 'end' = 'middle';
              if (x < centerX - 20) textAnchor = 'end';
              else if (x > centerX + 20) textAnchor = 'start';

              return (
                <SvgText
                  key={`label-${dim.key}`}
                  x={x}
                  y={y + 4}
                  fontSize={11}
                  fontWeight="600"
                  fill={DESIGN_COLORS.textSecondary}
                  textAnchor={textAnchor}
                >
                  {dim.shortLabel}
                </SvgText>
              );
            })}

          {/* Center Point */}
          <Circle
            cx={centerX}
            cy={centerY}
            r={4}
            fill={DESIGN_COLORS.accentPurple}
          />
        </Svg>
      </View>

      {/* Dimension Legend */}
      <View style={styles.legend}>
        {TRUST_DIMENSIONS.map((dim) => {
          const value = values[dim.key];
          return (
            <Pressable
              key={dim.key}
              style={({ pressed }) => [
                styles.legendItem,
                pressed && styles.legendItemPressed,
              ]}
              onPress={() => handleDimensionTap(dim.key)}
              accessibilityRole="button"
              accessibilityLabel={`${dim.label}: ${value} out of 10. ${dim.description}`}
              accessibilityHint="Tap to view details about this trust dimension"
            >
              <View style={styles.legendDot} />
              <View style={styles.legendContent}>
                <Text style={styles.legendLabel}>{dim.label}</Text>
                <Text style={styles.legendValue}>{value}/10</Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  scoreLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: DESIGN_COLORS.textSecondary,
    marginRight: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  scoreValue: {
    fontSize: 36,
    fontWeight: '700',
    color: DESIGN_COLORS.accentGold,
  },
  scoreMax: {
    fontSize: 16,
    color: DESIGN_COLORS.textTertiary,
    marginLeft: 2,
  },
  trustLevel: {
    fontSize: 14,
    color: DESIGN_COLORS.textSecondary,
    fontStyle: 'italic',
    marginBottom: 16,
  },
  chartContainer: {
    backgroundColor: DESIGN_COLORS.bgElevated,
    borderRadius: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
  },
  legend: {
    width: '100%',
    marginTop: 20,
    paddingHorizontal: 4,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: DESIGN_COLORS.bgElevated,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
  },
  legendItemPressed: {
    opacity: 0.8,
    borderColor: DESIGN_COLORS.accentGold,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: DESIGN_COLORS.accentGold,
    marginRight: 12,
  },
  legendContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  legendLabel: {
    fontSize: 14,
    color: DESIGN_COLORS.textPrimary,
    fontWeight: '500',
  },
  legendValue: {
    fontSize: 14,
    color: DESIGN_COLORS.accentGold,
    fontWeight: '600',
  },
});

export default TrustRadar;
