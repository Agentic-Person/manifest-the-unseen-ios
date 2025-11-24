/**
 * FearCard Component
 *
 * Displays a fear entry with category badge, intensity slider, and actions.
 * Used in Phase 4 Fear Inventory exercise.
 *
 * Features:
 * - Category badge with color coding
 * - Integrated intensity slider (1-10)
 * - Edit and delete actions
 * - Haptic feedback on interactions
 * - Dark spiritual theme
 *
 * @example
 * ```tsx
 * <FearCard
 *   fear={fear}
 *   onIntensityChange={(intensity) => updateFear(fear.id, intensity)}
 *   onEdit={() => editFear(fear.id)}
 *   onDelete={() => deleteFear(fear.id)}
 * />
 * ```
 */

import React, { useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Text } from '../Text';
import { IntensitySlider } from './IntensitySlider';
import { colors, spacing, borderRadius, shadows } from '../../theme';

/**
 * Fear categories with their colors
 */
export const FEAR_CATEGORIES = {
  financial: {
    label: 'Financial',
    color: '#d97706',
    icon: '\uD83D\uDCB0',
  },
  relationships: {
    label: 'Relationships',
    color: '#db2777',
    icon: '\u2764\uFE0F',
  },
  career: {
    label: 'Career',
    color: '#2563eb',
    icon: '\uD83D\uDCBC',
  },
  health: {
    label: 'Health',
    color: '#16a34a',
    icon: '\uD83C\uDFE5',
  },
  selfWorth: {
    label: 'Self-Worth',
    color: '#9333ea',
    icon: '\u2728',
  },
} as const;

export type FearCategory = keyof typeof FEAR_CATEGORIES;

/**
 * Fear data structure
 */
export interface Fear {
  id: string;
  text: string;
  category: FearCategory;
  intensity: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Props for FearCard component
 */
export interface FearCardProps {
  /** The fear to display */
  fear: Fear;

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
 * FearCard Component
 */
export const FearCard: React.FC<FearCardProps> = ({
  fear,
  onIntensityChange,
  onEdit,
  onDelete,
  testID,
}) => {
  const category = FEAR_CATEGORIES[fear.category];

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
      'Delete Fear',
      'Are you sure you want to remove this fear from your inventory?',
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
      accessibilityLabel={`Fear: ${fear.text}, Category: ${category.label}, Intensity: ${fear.intensity} out of 10`}
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
            onPress={handleEdit}
            accessibilityRole="button"
            accessibilityLabel="Edit fear"
            testID={`${testID}-edit`}
          >
            <Text style={styles.actionIcon}>{'\u270F\uFE0F'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleDelete}
            accessibilityRole="button"
            accessibilityLabel="Delete fear"
            testID={`${testID}-delete`}
          >
            <Text style={styles.actionIcon}>{'\uD83D\uDDD1\uFE0F'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Fear Text */}
      <Text style={styles.fearText}>{fear.text}</Text>

      {/* Intensity Slider */}
      <View style={styles.sliderContainer}>
        <IntensitySlider
          value={fear.intensity}
          onValueChange={onIntensityChange}
          label="Fear Intensity"
          testID={`${testID}-intensity`}
        />
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.dateText}>
          Added {formatDate(fear.createdAt)}
        </Text>
      </View>
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

  fearText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.dark.textPrimary,
    lineHeight: 24,
    marginBottom: spacing.md,
  },

  sliderContainer: {
    marginBottom: spacing.sm,
  },

  footer: {
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: `${colors.dark.textTertiary}20`,
  },

  dateText: {
    fontSize: 11,
    color: colors.dark.textTertiary,
  },
});

export default FearCard;
