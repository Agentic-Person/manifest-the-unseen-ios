/**
 * EnvyCard Component
 *
 * Displays an envy inventory item with category, intensity slider, and expand/collapse.
 * Used in Phase 8 Envy Inventory exercise.
 *
 * Features:
 * - Category badge with color coding
 * - Integrated intensity slider (1-10)
 * - Expandable details section
 * - Edit and delete actions
 * - Haptic feedback on interactions
 * - Dark spiritual theme
 *
 * @example
 * ```tsx
 * <EnvyCard
 *   envy={envyItem}
 *   onIntensityChange={(intensity) => updateEnvy(envyItem.id, intensity)}
 *   onEdit={() => editEnvy(envyItem.id)}
 *   onDelete={() => deleteEnvy(envyItem.id)}
 * />
 * ```
 */

import React, { useCallback, useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Text } from '../Text';
import { IntensitySlider } from './IntensitySlider';
import { colors, spacing, borderRadius, shadows } from '../../theme';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

/**
 * Envy categories with their colors and icons
 */
export const ENVY_CATEGORIES = {
  success: {
    label: 'Success',
    color: '#16a34a',
    icon: '\u{1F3C6}', // Trophy
  },
  relationships: {
    label: 'Relationships',
    color: '#db2777',
    icon: '\u{1F491}', // Couple with heart
  },
  wealth: {
    label: 'Wealth',
    color: '#d97706',
    icon: '\u{1F4B0}', // Money bag
  },
  appearance: {
    label: 'Appearance',
    color: '#9333ea',
    icon: '\u{2728}', // Sparkles
  },
  lifestyle: {
    label: 'Lifestyle',
    color: '#2563eb',
    icon: '\u{1F3DD}', // Island
  },
  talent: {
    label: 'Talent',
    color: '#1a5f5f',
    icon: '\u{1F3A8}', // Artist palette
  },
} as const;

export type EnvyCategory = keyof typeof ENVY_CATEGORIES;

/**
 * Envy item data structure
 */
export interface EnvyItem {
  id: string;
  whoWhat: string;
  trigger: string;
  category: EnvyCategory;
  intensity: number;
  reflection?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Props for EnvyCard component
 */
export interface EnvyCardProps {
  /** The envy item to display */
  envy: EnvyItem;

  /** Called when intensity is changed */
  onIntensityChange: (intensity: number) => void;

  /** Called when edit is pressed */
  onEdit: () => void;

  /** Called when delete is confirmed */
  onDelete: () => void;

  /** Test ID for automation */
  testID?: string;
}

/**
 * EnvyCard Component
 */
export const EnvyCard: React.FC<EnvyCardProps> = ({
  envy,
  onIntensityChange,
  onEdit,
  onDelete,
  testID,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const category = ENVY_CATEGORIES[envy.category];

  /**
   * Toggle expanded state with animation
   */
  const toggleExpanded = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsExpanded((prev) => !prev);
  }, []);

  /**
   * Handle edit press with haptic feedback
   */
  const handleEdit = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onEdit();
  }, [onEdit]);

  /**
   * Handle delete with confirmation
   */
  const handleDelete = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'Delete Envy Item',
      'Are you sure you want to remove this from your inventory?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            onDelete();
          },
        },
      ]
    );
  }, [onDelete]);

  /**
   * Format the created date
   */
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return '';
    }
  };

  return (
    <View
      style={[styles.container, { borderLeftColor: category.color }]}
      testID={testID}
      accessible
      accessibilityRole="button"
      accessibilityLabel={`Envy: ${envy.whoWhat}, Category: ${category.label}, Intensity: ${envy.intensity} out of 10`}
    >
      {/* Header Row */}
      <View style={styles.header}>
        {/* Category Badge */}
        <View style={[styles.categoryBadge, { backgroundColor: `${category.color}25` }]}>
          <Text style={styles.categoryIcon}>{category.icon}</Text>
          <Text style={[styles.categoryText, { color: category.color }]}>
            {category.label}
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={toggleExpanded}
            accessibilityRole="button"
            accessibilityLabel={isExpanded ? 'Collapse details' : 'Expand details'}
            testID={`${testID}-expand`}
          >
            <Text style={styles.actionIcon}>{isExpanded ? '\u{1F53C}' : '\u{1F53D}'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleEdit}
            accessibilityRole="button"
            accessibilityLabel="Edit envy item"
            testID={`${testID}-edit`}
          >
            <Text style={styles.actionIcon}>{'\u270F\uFE0F'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleDelete}
            accessibilityRole="button"
            accessibilityLabel="Delete envy item"
            testID={`${testID}-delete`}
          >
            <Text style={styles.actionIcon}>{'\uD83D\uDDD1\uFE0F'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Who/What */}
      <Text style={styles.whoWhatText}>
        I'm envious of: <Text style={styles.highlight}>{envy.whoWhat}</Text>
      </Text>

      {/* Trigger */}
      <Text style={styles.triggerText}>
        What triggers it: {envy.trigger}
      </Text>

      {/* Intensity Slider */}
      <View style={styles.sliderContainer}>
        <IntensitySlider
          value={envy.intensity}
          onValueChange={onIntensityChange}
          label="Envy Intensity"
          testID={`${testID}-intensity`}
        />
      </View>

      {/* Expanded Content */}
      {isExpanded && (
        <View style={styles.expandedContent}>
          {/* Reflection */}
          {envy.reflection && (
            <View style={styles.reflectionContainer}>
              <Text style={styles.reflectionLabel}>
                What does this reveal about my desires?
              </Text>
              <Text style={styles.reflectionText}>{envy.reflection}</Text>
            </View>
          )}

          {/* Date */}
          <View style={styles.footer}>
            <Text style={styles.dateText}>Added {formatDate(envy.createdAt)}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

/**
 * Styles - Dark Spiritual Theme
 */
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.dark.bgElevated,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderLeftWidth: 4,
    ...shadows.sm,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },

  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    gap: spacing.xs,
  },

  categoryIcon: {
    fontSize: 12,
  },

  categoryText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  actions: {
    flexDirection: 'row',
    gap: spacing.xs,
  },

  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: `${colors.dark.textTertiary}20`,
    justifyContent: 'center',
    alignItems: 'center',
  },

  actionIcon: {
    fontSize: 14,
  },

  whoWhatText: {
    fontSize: 15,
    color: colors.dark.textSecondary,
    marginBottom: spacing.xs,
    lineHeight: 22,
  },

  highlight: {
    color: colors.dark.textPrimary,
    fontWeight: '600',
  },

  triggerText: {
    fontSize: 14,
    color: colors.dark.textSecondary,
    marginBottom: spacing.md,
    lineHeight: 20,
  },

  sliderContainer: {
    marginBottom: spacing.sm,
  },

  expandedContent: {
    marginTop: spacing.sm,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: `${colors.dark.textTertiary}20`,
  },

  reflectionContainer: {
    backgroundColor: `${colors.dark.accentPurple}15`,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },

  reflectionLabel: {
    fontSize: 12,
    color: colors.dark.accentGold,
    fontWeight: '600',
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  reflectionText: {
    fontSize: 14,
    color: colors.dark.textPrimary,
    lineHeight: 20,
    fontStyle: 'italic',
  },

  footer: {
    paddingTop: spacing.xs,
  },

  dateText: {
    fontSize: 11,
    color: colors.dark.textTertiary,
  },
});

export default EnvyCard;
