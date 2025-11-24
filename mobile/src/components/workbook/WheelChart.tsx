/**
 * WheelChart Component
 *
 * Target/bullseye style visualization for the Wheel of Life assessment.
 * Displays concentric rings (1-10) with a connected polygon showing user ratings.
 *
 * Design Requirements:
 * - Concentric rings representing levels 1-10 (center = 1, outer = 10)
 * - User ratings connected with a polygon line (muted gold #c9a227)
 * - Dark background theme (#1a1a2e)
 * - Hand-drawn style icons for each life area around the wheel
 * - Sacred geometry inspired design
 *
 * @example
 * ```tsx
 * <WheelChart
 *   values={{
 *     career: 7,
 *     health: 5,
 *     relationships: 8,
 *     ...
 *   }}
 *   onAreaPress={(area) => console.log(area)}
 * />
 * ```
 */

import React, { useMemo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, {
  Circle,
  Line,
  Path,
  Text as SvgText,
  G,
  Defs,
  LinearGradient,
  Stop,
  RadialGradient,
} from 'react-native-svg';

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
  accentRose: '#8b3a5f',
  accentGreen: '#2d5a4a',
  accentAmber: '#8b6914',
  ringLine: '#3a3a5a',
  ringLineSubtle: '#2a2a4a',
};

export interface WheelOfLifeValues {
  career: number;
  health: number;
  relationships: number;
  finance: number;
  personalGrowth: number;
  family: number;
  recreation: number;
  spirituality: number;
}

export type LifeAreaKey = keyof WheelOfLifeValues;

interface LifeAreaConfig {
  key: LifeAreaKey;
  label: string;
  color: string;
  icon: string; // Placeholder for future icon implementation
}

export const LIFE_AREAS: LifeAreaConfig[] = [
  { key: 'career', label: 'Career', color: DESIGN_COLORS.accentPurple, icon: 'scroll' },
  { key: 'health', label: 'Health', color: DESIGN_COLORS.accentGreen, icon: 'lotus' },
  { key: 'relationships', label: 'Relationships', color: DESIGN_COLORS.accentRose, icon: 'rings' },
  { key: 'finance', label: 'Finance', color: DESIGN_COLORS.accentAmber, icon: 'coins' },
  { key: 'personalGrowth', label: 'Growth', color: DESIGN_COLORS.accentTeal, icon: 'sun' },
  { key: 'family', label: 'Family', color: DESIGN_COLORS.accentGreen, icon: 'tree' },
  { key: 'recreation', label: 'Recreation', color: DESIGN_COLORS.accentTeal, icon: 'waves' },
  { key: 'spirituality', label: 'Spirit', color: DESIGN_COLORS.accentPurple, icon: 'eye' },
];

interface WheelChartProps {
  /** Current values for each life area (1-10) */
  values: WheelOfLifeValues;
  /** Size of the chart (defaults to screen width - padding) */
  size?: number;
  /** Callback when an area is pressed */
  onAreaPress?: (area: LifeAreaKey) => void;
  /** Whether to show the area labels */
  showLabels?: boolean;
  /** Whether to show the value dots on the polygon */
  showDots?: boolean;
}

/**
 * Calculate point coordinates for a given angle and radius
 */
const polarToCartesian = (
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
): { x: number; y: number } => {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
};

export const WheelChart: React.FC<WheelChartProps> = ({
  values,
  size: propSize,
  onAreaPress,
  showLabels = true,
  showDots = true,
}) => {
  const screenWidth = Dimensions.get('window').width;
  const size = propSize || Math.min(screenWidth - 48, 340);
  const center = size / 2;
  const maxRadius = center - 40; // Leave space for labels
  const ringCount = 10;

  /**
   * Generate the polygon path connecting all values
   */
  const polygonPath = useMemo(() => {
    const points = LIFE_AREAS.map((area, index) => {
      const angle = (index * 360) / LIFE_AREAS.length;
      const value = values[area.key] || 1;
      const radius = (value / 10) * maxRadius;
      return polarToCartesian(center, center, radius, angle);
    });

    const pathData = points
      .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
      .join(' ');

    return `${pathData} Z`;
  }, [values, center, maxRadius]);

  /**
   * Generate points for value dots
   */
  const valueDots = useMemo(() => {
    return LIFE_AREAS.map((area, index) => {
      const angle = (index * 360) / LIFE_AREAS.length;
      const value = values[area.key] || 1;
      const radius = (value / 10) * maxRadius;
      return {
        ...polarToCartesian(center, center, radius, angle),
        value,
        area,
      };
    });
  }, [values, center, maxRadius]);

  /**
   * Generate label positions
   */
  const labelPositions = useMemo(() => {
    return LIFE_AREAS.map((area, index) => {
      const angle = (index * 360) / LIFE_AREAS.length;
      const labelRadius = maxRadius + 28;
      return {
        ...polarToCartesian(center, center, labelRadius, angle),
        area,
        angle,
      };
    });
  }, [center, maxRadius]);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Defs>
          {/* Radial gradient for center glow */}
          <RadialGradient
            id="centerGlow"
            cx="50%"
            cy="50%"
            rx="50%"
            ry="50%"
            fx="50%"
            fy="50%"
          >
            <Stop offset="0%" stopColor={DESIGN_COLORS.accentPurple} stopOpacity="0.3" />
            <Stop offset="100%" stopColor={DESIGN_COLORS.bgPrimary} stopOpacity="0" />
          </RadialGradient>

          {/* Gradient for polygon fill */}
          <LinearGradient id="polygonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={DESIGN_COLORS.accentGold} stopOpacity="0.4" />
            <Stop offset="100%" stopColor={DESIGN_COLORS.accentAmber} stopOpacity="0.2" />
          </LinearGradient>
        </Defs>

        {/* Background circle with subtle glow */}
        <Circle
          cx={center}
          cy={center}
          r={maxRadius + 5}
          fill="url(#centerGlow)"
        />

        {/* Concentric rings (1-10) */}
        {Array.from({ length: ringCount }, (_, i) => i + 1).map((level) => {
          const radius = (level / 10) * maxRadius;
          const isMainRing = level === 5 || level === 10;
          return (
            <Circle
              key={`ring-${level}`}
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={isMainRing ? DESIGN_COLORS.ringLine : DESIGN_COLORS.ringLineSubtle}
              strokeWidth={isMainRing ? 1.5 : 0.5}
              strokeDasharray={level === 10 ? undefined : '4,4'}
              opacity={isMainRing ? 0.8 : 0.4}
            />
          );
        })}

        {/* Radial divider lines for each life area */}
        {LIFE_AREAS.map((area, index) => {
          const angle = (index * 360) / LIFE_AREAS.length;
          const endPoint = polarToCartesian(center, center, maxRadius, angle);
          return (
            <Line
              key={`line-${area.key}`}
              x1={center}
              y1={center}
              x2={endPoint.x}
              y2={endPoint.y}
              stroke={DESIGN_COLORS.ringLine}
              strokeWidth={0.5}
              opacity={0.6}
            />
          );
        })}

        {/* User's rating polygon */}
        <Path
          d={polygonPath}
          fill="url(#polygonGradient)"
          stroke={DESIGN_COLORS.accentGold}
          strokeWidth={2.5}
          strokeLinejoin="round"
        />

        {/* Value dots on the polygon */}
        {showDots &&
          valueDots.map((dot) => (
            <G key={`dot-${dot.area.key}`}>
              {/* Outer glow */}
              <Circle
                cx={dot.x}
                cy={dot.y}
                r={10}
                fill={DESIGN_COLORS.accentGold}
                opacity={0.3}
              />
              {/* Main dot */}
              <Circle
                cx={dot.x}
                cy={dot.y}
                r={6}
                fill={DESIGN_COLORS.bgElevated}
                stroke={DESIGN_COLORS.accentGold}
                strokeWidth={2}
                onPress={() => onAreaPress?.(dot.area.key)}
              />
              {/* Value number */}
              <SvgText
                x={dot.x}
                y={dot.y + 3}
                fontSize={8}
                fontWeight="700"
                fill={DESIGN_COLORS.textPrimary}
                textAnchor="middle"
              >
                {dot.value}
              </SvgText>
            </G>
          ))}

        {/* Life area labels around the wheel */}
        {showLabels &&
          labelPositions.map((pos) => {
            // Adjust text anchor based on position
            let textAnchor: 'start' | 'middle' | 'end' = 'middle';
            if (pos.angle > 45 && pos.angle < 135) textAnchor = 'start';
            if (pos.angle > 225 && pos.angle < 315) textAnchor = 'end';

            return (
              <SvgText
                key={`label-${pos.area.key}`}
                x={pos.x}
                y={pos.y + 4}
                fontSize={11}
                fontWeight="600"
                fill={DESIGN_COLORS.textSecondary}
                textAnchor={textAnchor}
                onPress={() => onAreaPress?.(pos.area.key)}
              >
                {pos.area.label}
              </SvgText>
            );
          })}

        {/* Center element - Average score */}
        <G>
          <Circle
            cx={center}
            cy={center}
            r={25}
            fill={DESIGN_COLORS.bgElevated}
            stroke={DESIGN_COLORS.accentPurple}
            strokeWidth={2}
          />
          <SvgText
            x={center}
            y={center - 3}
            fontSize={14}
            fontWeight="700"
            fill={DESIGN_COLORS.accentGold}
            textAnchor="middle"
          >
            {(
              Object.values(values).reduce((a, b) => a + b, 0) /
              Object.values(values).length
            ).toFixed(1)}
          </SvgText>
          <SvgText
            x={center}
            y={center + 10}
            fontSize={8}
            fontWeight="500"
            fill={DESIGN_COLORS.textTertiary}
            textAnchor="middle"
          >
            AVG
          </SvgText>
        </G>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default WheelChart;
