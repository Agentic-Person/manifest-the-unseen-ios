/**
 * SWOTQuadrant Component
 *
 * Organic flower petal-shaped quadrant for SWOT Analysis.
 * NOT a corporate grid - uses curved, flowing shapes inspired by nature.
 *
 * Layout positions:
 * - Strengths: Top-left petal
 * - Weaknesses: Top-right petal
 * - Opportunities: Bottom-left petal
 * - Threats: Bottom-right petal
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ViewStyle,
  Dimensions,
} from 'react-native';
import { colors, spacing, borderRadius } from '../../theme';
import { SWOTTag, SWOTQuadrantType } from './SWOTTag';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PETAL_SIZE = (SCREEN_WIDTH - spacing.md * 3) / 2; // Two petals per row with gaps

export interface SWOTQuadrantProps {
  /** Quadrant type */
  type: SWOTQuadrantType;

  /** Position in the flower layout */
  position: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';

  /** Current items in this quadrant */
  items: string[];

  /** Callback when items change */
  onItemsChange: (items: string[]) => void;

  /** Custom style */
  style?: ViewStyle;
}

/**
 * Quadrant configuration with titles and prompts
 */
const QUADRANT_CONFIG = {
  strengths: {
    title: 'Strengths',
    subtitle: 'Internal Powers',
    icon: '\u2618', // Shamrock
    prompt: 'What makes you strong?',
    color: colors.swot.strengths,
  },
  weaknesses: {
    title: 'Weaknesses',
    subtitle: 'Areas to Grow',
    icon: '\u25C6', // Diamond
    prompt: 'What holds you back?',
    color: colors.swot.weaknesses,
  },
  opportunities: {
    title: 'Opportunities',
    subtitle: 'External Possibilities',
    icon: '\u223F', // Wave
    prompt: 'What awaits you?',
    color: colors.swot.opportunities,
  },
  threats: {
    title: 'Threats',
    subtitle: 'External Challenges',
    icon: '\u2731', // Asterisk
    prompt: 'What to be aware of?',
    color: colors.swot.threats,
  },
};

/**
 * Get petal border radius based on position for organic flower shape
 */
const getPetalStyle = (position: string): ViewStyle => {
  // Each petal curves outward from the center
  const baseRadius = 60;
  const innerRadius = 12;

  switch (position) {
    case 'topLeft':
      return {
        borderTopLeftRadius: baseRadius,
        borderTopRightRadius: innerRadius,
        borderBottomRightRadius: innerRadius,
        borderBottomLeftRadius: innerRadius,
      };
    case 'topRight':
      return {
        borderTopLeftRadius: innerRadius,
        borderTopRightRadius: baseRadius,
        borderBottomRightRadius: innerRadius,
        borderBottomLeftRadius: innerRadius,
      };
    case 'bottomLeft':
      return {
        borderTopLeftRadius: innerRadius,
        borderTopRightRadius: innerRadius,
        borderBottomRightRadius: innerRadius,
        borderBottomLeftRadius: baseRadius,
      };
    case 'bottomRight':
      return {
        borderTopLeftRadius: innerRadius,
        borderTopRightRadius: innerRadius,
        borderBottomRightRadius: baseRadius,
        borderBottomLeftRadius: innerRadius,
      };
    default:
      return {};
  }
};

export const SWOTQuadrant: React.FC<SWOTQuadrantProps> = ({
  type,
  position,
  items,
  onItemsChange,
  style,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const config = QUADRANT_CONFIG[type];
  const petalStyle = getPetalStyle(position);

  const handleAddItem = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !items.includes(trimmed)) {
      onItemsChange([...items, trimmed]);
      setInputValue('');
    }
  };

  const handleRemoveItem = (index: number) => {
    onItemsChange(items.filter((_, i) => i !== index));
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => setIsExpanded(!isExpanded)}
      style={[
        styles.container,
        petalStyle,
        {
          backgroundColor: config.color.light,
          borderColor: config.color.border,
        },
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`${config.title} quadrant with ${items.length} items`}
      accessibilityHint={isExpanded ? 'Tap to collapse' : 'Tap to expand and add items'}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.icon, { color: config.color.primary }]}>
          {config.icon}
        </Text>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: config.color.primary }]}>
            {config.title}
          </Text>
          <Text style={[styles.subtitle, { color: config.color.primary }]}>
            {config.subtitle}
          </Text>
        </View>
        <View style={[styles.countBadge, { backgroundColor: config.color.primary }]}>
          <Text style={styles.countText}>{items.length}</Text>
        </View>
      </View>

      {/* Collapsed: Show preview of items */}
      {!isExpanded && items.length > 0 && (
        <View style={styles.preview}>
          {items.slice(0, 3).map((item, index) => (
            <Text
              key={index}
              style={[styles.previewItem, { color: config.color.primary }]}
              numberOfLines={1}
            >
              {'\u2022'} {item}
            </Text>
          ))}
          {items.length > 3 && (
            <Text style={[styles.moreText, { color: config.color.primary }]}>
              +{items.length - 3} more...
            </Text>
          )}
        </View>
      )}

      {/* Expanded: Full editing mode */}
      {isExpanded && (
        <View style={styles.expandedContent}>
          {/* Prompt */}
          <Text style={[styles.prompt, { color: config.color.primary }]}>
            {config.prompt}
          </Text>

          {/* Items list */}
          <ScrollView
            style={styles.itemsScroll}
            contentContainerStyle={styles.itemsContainer}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled
          >
            {items.map((item, index) => (
              <SWOTTag
                key={`${item}-${index}`}
                text={item}
                quadrant={type}
                onRemove={() => handleRemoveItem(index)}
                removable
                style={styles.tag}
              />
            ))}
          </ScrollView>

          {/* Add new item input */}
          <View style={styles.inputRow}>
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: config.color.border,
                  color: colors.dark.textPrimary,
                },
              ]}
              placeholder={`Add ${type.slice(0, -1)}...`}
              placeholderTextColor={colors.dark.textTertiary}
              value={inputValue}
              onChangeText={setInputValue}
              onSubmitEditing={handleAddItem}
              returnKeyType="done"
              blurOnSubmit={false}
            />
            <TouchableOpacity
              style={[
                styles.addButton,
                { backgroundColor: config.color.primary },
              ]}
              onPress={handleAddItem}
              disabled={!inputValue.trim()}
              accessibilityRole="button"
              accessibilityLabel="Add item"
            >
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Tap hint when collapsed and empty */}
      {!isExpanded && items.length === 0 && (
        <Text style={[styles.tapHint, { color: config.color.primary }]}>
          Tap to add
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: PETAL_SIZE,
    minHeight: PETAL_SIZE * 0.9,
    padding: spacing.md,
    borderWidth: 2,
    // Subtle inner glow effect
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },

  icon: {
    fontSize: 20,
    marginRight: spacing.xs,
  },

  titleContainer: {
    flex: 1,
  },

  title: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  subtitle: {
    fontSize: 10,
    fontWeight: '500',
    opacity: 0.7,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  countBadge: {
    width: 24,
    height: 24,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },

  countText: {
    color: colors.dark.textPrimary,
    fontSize: 12,
    fontWeight: '700',
  },

  preview: {
    flex: 1,
    justifyContent: 'center',
  },

  previewItem: {
    fontSize: 12,
    lineHeight: 18,
    opacity: 0.8,
  },

  moreText: {
    fontSize: 11,
    fontStyle: 'italic',
    opacity: 0.6,
    marginTop: spacing.xs,
  },

  expandedContent: {
    flex: 1,
  },

  prompt: {
    fontSize: 12,
    fontStyle: 'italic',
    opacity: 0.7,
    marginBottom: spacing.sm,
  },

  itemsScroll: {
    flex: 1,
    maxHeight: 120,
  },

  itemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },

  tag: {
    marginBottom: spacing.xs,
  },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    gap: spacing.xs,
  },

  input: {
    flex: 1,
    height: 36,
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    fontSize: 13,
  },

  addButton: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },

  addButtonText: {
    color: colors.dark.textPrimary,
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 22,
  },

  tapHint: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 13,
    fontStyle: 'italic',
    opacity: 0.5,
  },
});

export default SWOTQuadrant;
