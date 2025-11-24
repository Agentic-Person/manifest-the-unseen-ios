/**
 * ValueCard Component
 *
 * A selectable card component for displaying core values.
 * Used in the Values Assessment screen for users to select their top 5 values.
 *
 * @example
 * ```tsx
 * <ValueCard
 *   value="Integrity"
 *   isSelected={selectedValues.includes('Integrity')}
 *   onPress={() => handleValueToggle('Integrity')}
 *   selectionOrder={selectedValues.indexOf('Integrity') + 1}
 * />
 * ```
 */

import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  View,
} from 'react-native';
import { Text } from '../Text';
import { colors, spacing, borderRadius, shadows } from '../../theme';

/**
 * Value icons mapping for visual representation
 */
const VALUE_ICONS: Record<string, string> = {
  'Integrity': '🛡️',
  'Authenticity': '✨',
  'Growth': '🌱',
  'Freedom': '🕊️',
  'Love': '💗',
  'Family': '👨‍👩‍👧‍👦',
  'Health': '🍃',
  'Wealth': '💰',
  'Creativity': '🎨',
  'Adventure': '🏔️',
  'Security': '🏠',
  'Peace': '☮️',
  'Knowledge': '📚',
  'Impact': '🌟',
  'Joy': '🌈',
  'Connection': '🤝',
  'Excellence': '🏆',
  'Balance': '☯️',
  'Spirituality': '🧘',
  'Service': '🙏',
};

/**
 * Props for the ValueCard component
 */
export interface ValueCardProps {
  /** The value text to display */
  value: string;

  /** Whether this value is currently selected */
  isSelected: boolean;

  /** Callback when the card is pressed */
  onPress: () => void;

  /** The selection order (1-5) if selected, undefined if not */
  selectionOrder?: number;

  /** Whether selection is disabled (max reached and not selected) */
  disabled?: boolean;

  /** Test ID for automation */
  testID?: string;
}

/**
 * ValueCard Component
 */
export const ValueCard: React.FC<ValueCardProps> = ({
  value,
  isSelected,
  onPress,
  selectionOrder,
  disabled = false,
  testID,
}) => {
  const icon = VALUE_ICONS[value] || '💎';

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isSelected && styles.containerSelected,
        disabled && styles.containerDisabled,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      accessibilityRole="checkbox"
      accessibilityState={{
        checked: isSelected,
        disabled: disabled,
      }}
      accessibilityLabel={`${value}${isSelected ? ', selected' : ''}${selectionOrder ? `, priority ${selectionOrder}` : ''}`}
      accessibilityHint={
        isSelected
          ? 'Double tap to remove from your values'
          : disabled
          ? 'Maximum 5 values selected'
          : 'Double tap to add to your values'
      }
      testID={testID}
    >
      {/* Icon */}
      <View style={[
        styles.iconContainer,
        isSelected && styles.iconContainerSelected,
      ]}>
        <Text style={styles.icon}>{icon}</Text>
      </View>

      {/* Value Name */}
      <Text
        style={[
          styles.valueName,
          isSelected && styles.valueNameSelected,
          disabled && styles.valueNameDisabled,
        ]}
        numberOfLines={1}
      >
        {value}
      </Text>

      {/* Selection Order Badge */}
      {isSelected && selectionOrder !== undefined && (
        <View style={styles.orderBadge}>
          <Text style={styles.orderText}>{selectionOrder}</Text>
        </View>
      )}

      {/* Selection Indicator (Checkmark) */}
      {isSelected && (
        <View style={styles.checkmark}>
          <Text style={styles.checkmarkText}>✓</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

/**
 * Styles
 */
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 2,
    borderColor: colors.gray[200],
    ...shadows.sm,
  },
  containerSelected: {
    backgroundColor: colors.primary[50],
    borderColor: colors.primary[600],
    borderWidth: 2,
  },
  containerDisabled: {
    opacity: 0.5,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  iconContainerSelected: {
    backgroundColor: colors.primary[100],
  },
  icon: {
    fontSize: 22,
  },
  valueName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  valueNameSelected: {
    color: colors.primary[700],
  },
  valueNameDisabled: {
    color: colors.text.tertiary,
  },
  orderBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary[600],
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.xs,
  },
  orderText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.white,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.success[500],
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.xs,
  },
  checkmarkText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
  },
});

export default ValueCard;
