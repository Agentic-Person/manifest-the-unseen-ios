/**
 * SWOTTag Component
 *
 * Natural-styled tag component for SWOT Analysis.
 * Designed to look like organic elements (leaves, stones, waves, embers)
 * NOT corporate tech chips - follows the app's spiritual/earthy aesthetic.
 *
 * Each quadrant has a unique natural metaphor:
 * - Strengths: Leaves (growth, natural strength)
 * - Weaknesses: Stones (grounding, areas to work on)
 * - Opportunities: Waves (flow, possibility)
 * - Threats: Embers (awareness, transformation)
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { colors, spacing, borderRadius } from '../../theme';

export type SWOTQuadrantType = 'strengths' | 'weaknesses' | 'opportunities' | 'threats';

export interface SWOTTagProps {
  /** The text content of the tag */
  text: string;

  /** Which SWOT quadrant this tag belongs to */
  quadrant: SWOTQuadrantType;

  /** Callback when remove button is pressed */
  onRemove?: () => void;

  /** Whether the tag can be removed */
  removable?: boolean;

  /** Custom style override */
  style?: ViewStyle;
}

/**
 * Get quadrant-specific styling and natural element characteristics
 */
const getQuadrantStyle = (quadrant: SWOTQuadrantType) => {
  const styles = {
    strengths: {
      // Leaf-like: soft curves, organic shape
      backgroundColor: colors.swot.strengths.light,
      borderColor: colors.swot.strengths.border,
      textColor: colors.swot.strengths.primary,
      iconSymbol: '\u2618', // Shamrock/leaf
      borderRadius: { topLeft: 20, topRight: 8, bottomRight: 20, bottomLeft: 8 },
    },
    weaknesses: {
      // Stone-like: more rounded, solid feel
      backgroundColor: colors.swot.weaknesses.light,
      borderColor: colors.swot.weaknesses.border,
      textColor: colors.swot.weaknesses.primary,
      iconSymbol: '\u25C6', // Diamond (stone)
      borderRadius: { topLeft: 14, topRight: 14, bottomRight: 14, bottomLeft: 14 },
    },
    opportunities: {
      // Wave-like: flowing, asymmetric curves
      backgroundColor: colors.swot.opportunities.light,
      borderColor: colors.swot.opportunities.border,
      textColor: colors.swot.opportunities.primary,
      iconSymbol: '\u223F', // Sine wave
      borderRadius: { topLeft: 8, topRight: 20, bottomRight: 8, bottomLeft: 20 },
    },
    threats: {
      // Ember-like: pointed, flame-inspired
      backgroundColor: colors.swot.threats.light,
      borderColor: colors.swot.threats.border,
      textColor: colors.swot.threats.primary,
      iconSymbol: '\u2731', // Heavy asterisk (ember)
      borderRadius: { topLeft: 4, topRight: 18, bottomRight: 4, bottomLeft: 18 },
    },
  };

  return styles[quadrant];
};

export const SWOTTag: React.FC<SWOTTagProps> = ({
  text,
  quadrant,
  onRemove,
  removable = true,
  style,
}) => {
  const quadrantStyle = getQuadrantStyle(quadrant);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: quadrantStyle.backgroundColor,
          borderColor: quadrantStyle.borderColor,
          borderTopLeftRadius: quadrantStyle.borderRadius.topLeft,
          borderTopRightRadius: quadrantStyle.borderRadius.topRight,
          borderBottomLeftRadius: quadrantStyle.borderRadius.bottomLeft,
          borderBottomRightRadius: quadrantStyle.borderRadius.bottomRight,
        },
        style,
      ]}
      accessibilityRole="text"
      accessibilityLabel={`${quadrant} item: ${text}`}
    >
      {/* Natural element icon */}
      <Text style={[styles.icon, { color: quadrantStyle.textColor }]}>
        {quadrantStyle.iconSymbol}
      </Text>

      {/* Tag text */}
      <Text
        style={[styles.text, { color: quadrantStyle.textColor }]}
        numberOfLines={2}
      >
        {text}
      </Text>

      {/* Remove button */}
      {removable && onRemove && (
        <TouchableOpacity
          onPress={onRemove}
          style={[
            styles.removeButton,
            { backgroundColor: quadrantStyle.borderColor },
          ]}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityRole="button"
          accessibilityLabel={`Remove ${text}`}
        >
          <Text style={[styles.removeIcon, { color: colors.dark.textPrimary }]}>
            {'\u00D7'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingLeft: spacing.sm,
    paddingRight: spacing.xs,
    borderWidth: 1.5,
    minHeight: 36,
    maxWidth: '100%',
    // Subtle hand-drawn feel with slight rotation variation
    // (In production, could randomize slightly per tag)
  },

  icon: {
    fontSize: 14,
    marginRight: spacing.xs,
    opacity: 0.7,
  },

  text: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.2,
    lineHeight: 18,
  },

  removeButton: {
    width: 22,
    height: 22,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.xs,
    opacity: 0.8,
  },

  removeIcon: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 18,
  },
});

export default SWOTTag;
