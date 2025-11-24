/**
 * ReframeCard Component
 *
 * Three-step transformation card for reframing envy into inspiration.
 * Displays the progression: Envious of -> This shows I value -> I can achieve by
 *
 * Features:
 * - Visual transformation flow with gradients
 * - Editable value and action inputs
 * - Completion celebration with haptic feedback
 * - Arrow indicators between steps
 * - Dark spiritual theme
 *
 * @example
 * ```tsx
 * <ReframeCard
 *   reframe={reframeData}
 *   onValueChange={(value) => updateValue(reframe.id, value)}
 *   onActionChange={(action) => updateAction(reframe.id, action)}
 *   onComplete={() => markComplete(reframe.id)}
 * />
 * ```
 */

import React, { useCallback, useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Text } from '../Text';
import { colors, spacing, borderRadius, shadows } from '../../theme';

/**
 * Reframe data structure
 */
export interface ReframeData {
  id: string;
  envyId: string;
  envyText: string; // Auto-filled from inventory
  valueText: string; // "This shows I value..."
  actionText: string; // "I can achieve this by..."
  isComplete: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Props for ReframeCard component
 */
export interface ReframeCardProps {
  /** The reframe data to display */
  reframe: ReframeData;

  /** Called when value text is changed */
  onValueChange: (value: string) => void;

  /** Called when action text is changed */
  onActionChange: (action: string) => void;

  /** Called when reframe is marked complete */
  onComplete: () => void;

  /** Whether the card is editable */
  editable?: boolean;

  /** Test ID for automation */
  testID?: string;
}

/**
 * Arrow component for visual flow
 */
const TransformArrow: React.FC<{ color: string }> = ({ color }) => (
  <View style={styles.arrowContainer}>
    <View style={[styles.arrowLine, { backgroundColor: color }]} />
    <Text style={[styles.arrowHead, { color }]}>{'\u{25BC}'}</Text>
  </View>
);

/**
 * ReframeCard Component
 */
export const ReframeCard: React.FC<ReframeCardProps> = ({
  reframe,
  onValueChange,
  onActionChange,
  onComplete,
  editable = true,
  testID,
}) => {
  const [localValue, setLocalValue] = useState(reframe.valueText);
  const [localAction, setLocalAction] = useState(reframe.actionText);

  /**
   * Check if reframe can be marked complete
   */
  const canComplete = localValue.trim().length > 0 && localAction.trim().length > 0;

  /**
   * Handle value change with debounce
   */
  const handleValueChange = useCallback((text: string) => {
    setLocalValue(text);
    onValueChange(text);
  }, [onValueChange]);

  /**
   * Handle action change with debounce
   */
  const handleActionChange = useCallback((text: string) => {
    setLocalAction(text);
    onActionChange(text);
  }, [onActionChange]);

  /**
   * Handle completion with celebration
   */
  const handleComplete = useCallback(() => {
    if (!canComplete) return;

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onComplete();
  }, [canComplete, onComplete]);

  /**
   * Handle input focus
   */
  const handleFocus = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  return (
    <View
      style={[styles.container, reframe.isComplete && styles.containerComplete]}
      testID={testID}
      accessible
      accessibilityRole="none"
      accessibilityLabel={`Reframe: ${reframe.envyText}`}
    >
      {/* Completion Badge */}
      {reframe.isComplete && (
        <View style={styles.completeBadge}>
          <Text style={styles.completeBadgeText}>{'\u{2728}'} Transformed</Text>
        </View>
      )}

      {/* Step 1: Envy (Auto-filled) */}
      <View style={styles.stepContainer}>
        <View style={[styles.stepHeader, { backgroundColor: `${colors.dark.accentBurgundy}30` }]}>
          <Text style={styles.stepNumber}>1</Text>
          <Text style={styles.stepLabel}>I'm envious of...</Text>
        </View>
        <View style={[styles.stepContent, { borderColor: colors.dark.accentBurgundy }]}>
          <Text style={styles.envyText}>{reframe.envyText}</Text>
        </View>
      </View>

      <TransformArrow color={colors.dark.accentPurple} />

      {/* Step 2: Value Discovery */}
      <View style={styles.stepContainer}>
        <View style={[styles.stepHeader, { backgroundColor: `${colors.dark.accentGold}30` }]}>
          <Text style={styles.stepNumber}>2</Text>
          <Text style={styles.stepLabel}>This shows I value...</Text>
        </View>
        <View style={[styles.stepContent, { borderColor: colors.dark.accentGold }]}>
          {editable && !reframe.isComplete ? (
            <TextInput
              style={styles.input}
              value={localValue}
              onChangeText={handleValueChange}
              onFocus={handleFocus}
              placeholder="What does this envy reveal about your deeper values?"
              placeholderTextColor={colors.dark.textTertiary}
              multiline
              numberOfLines={2}
              textAlignVertical="top"
              accessibilityLabel="Value discovery input"
              testID={`${testID}-value-input`}
            />
          ) : (
            <Text style={styles.filledText}>
              {localValue || 'Not yet discovered'}
            </Text>
          )}
        </View>
      </View>

      <TransformArrow color={colors.dark.accentTeal} />

      {/* Step 3: Action Plan */}
      <View style={styles.stepContainer}>
        <View style={[styles.stepHeader, { backgroundColor: `${colors.dark.accentTeal}30` }]}>
          <Text style={styles.stepNumber}>3</Text>
          <Text style={styles.stepLabel}>I can achieve this by...</Text>
        </View>
        <View style={[styles.stepContent, { borderColor: colors.dark.accentTeal }]}>
          {editable && !reframe.isComplete ? (
            <TextInput
              style={styles.input}
              value={localAction}
              onChangeText={handleActionChange}
              onFocus={handleFocus}
              placeholder="What steps can you take to achieve what you admire?"
              placeholderTextColor={colors.dark.textTertiary}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              accessibilityLabel="Action plan input"
              testID={`${testID}-action-input`}
            />
          ) : (
            <Text style={styles.filledText}>
              {localAction || 'Action plan pending'}
            </Text>
          )}
        </View>
      </View>

      {/* Complete Button */}
      {!reframe.isComplete && (
        <TouchableOpacity
          style={[
            styles.completeButton,
            !canComplete && styles.completeButtonDisabled,
          ]}
          onPress={handleComplete}
          disabled={!canComplete}
          accessibilityRole="button"
          accessibilityLabel="Complete transformation"
          accessibilityState={{ disabled: !canComplete }}
          testID={`${testID}-complete`}
        >
          <Text style={styles.completeButtonText}>
            {'\u{1F31F}'} Complete Transformation
          </Text>
        </TouchableOpacity>
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
    marginBottom: spacing.lg,
    ...shadows.md,
  },

  containerComplete: {
    borderWidth: 2,
    borderColor: colors.dark.accentGold,
  },

  completeBadge: {
    position: 'absolute',
    top: -10,
    right: spacing.md,
    backgroundColor: colors.dark.accentGold,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    zIndex: 1,
  },

  completeBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.dark.bgPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  stepContainer: {
    marginBottom: spacing.xs,
  },

  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderTopLeftRadius: borderRadius.md,
    borderTopRightRadius: borderRadius.md,
    gap: spacing.sm,
  },

  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.dark.bgPrimary,
    color: colors.dark.textPrimary,
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 24,
  },

  stepLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.dark.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  stepContent: {
    borderWidth: 1,
    borderTopWidth: 0,
    borderBottomLeftRadius: borderRadius.md,
    borderBottomRightRadius: borderRadius.md,
    padding: spacing.md,
    backgroundColor: `${colors.dark.bgPrimary}50`,
  },

  envyText: {
    fontSize: 15,
    color: colors.dark.textPrimary,
    lineHeight: 22,
    fontStyle: 'italic',
  },

  input: {
    fontSize: 14,
    color: colors.dark.textPrimary,
    lineHeight: 20,
    minHeight: 60,
    padding: 0,
  },

  filledText: {
    fontSize: 14,
    color: colors.dark.textPrimary,
    lineHeight: 20,
  },

  arrowContainer: {
    alignItems: 'center',
    marginVertical: spacing.xs,
  },

  arrowLine: {
    width: 2,
    height: 12,
    marginBottom: -4,
  },

  arrowHead: {
    fontSize: 12,
  },

  completeButton: {
    backgroundColor: colors.dark.accentGold,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.md,
  },

  completeButtonDisabled: {
    backgroundColor: colors.dark.textTertiary,
    opacity: 0.5,
  },

  completeButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.dark.bgPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

export default ReframeCard;
