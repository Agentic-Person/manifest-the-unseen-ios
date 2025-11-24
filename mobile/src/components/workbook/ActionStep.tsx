/**
 * ActionStep Component
 *
 * Individual action step item for the Action Plan screen.
 * Features checkbox completion, text display, reorder buttons, and delete.
 *
 * Design: Dark spiritual theme (#1a1a2e background, #c9a227 gold accent)
 */

import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from 'react-native';
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
  accentGreen: '#2d5a4a',
  border: '#3a3a5a',
  success: '#2d5a4a',
  error: '#dc2626',
};

/**
 * ActionStep data interface
 */
export interface ActionStepData {
  id: string;
  goalId: string;
  text: string;
  completed: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * ActionStep component props
 */
interface ActionStepProps {
  step: ActionStepData;
  index: number;
  totalSteps: number;
  onToggleComplete: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  onDelete: (id: string) => void;
}

/**
 * ActionStep Component
 */
const ActionStep: React.FC<ActionStepProps> = ({
  step,
  index,
  totalSteps,
  onToggleComplete,
  onMoveUp,
  onMoveDown,
  onDelete,
}) => {
  const isFirst = index === 0;
  const isLast = index === totalSteps - 1;

  /**
   * Handle checkbox toggle
   */
  const handleToggle = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onToggleComplete(step.id);
  }, [step.id, onToggleComplete]);

  /**
   * Handle move up
   */
  const handleMoveUp = useCallback(() => {
    if (!isFirst) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onMoveUp(step.id);
    }
  }, [step.id, isFirst, onMoveUp]);

  /**
   * Handle move down
   */
  const handleMoveDown = useCallback(() => {
    if (!isLast) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onMoveDown(step.id);
    }
  }, [step.id, isLast, onMoveDown]);

  /**
   * Handle delete
   */
  const handleDelete = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    onDelete(step.id);
  }, [step.id, onDelete]);

  return (
    <View
      style={[styles.container, step.completed && styles.containerCompleted]}
      testID={`action-step-${step.id}`}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: step.completed }}
      accessibilityLabel={`Step ${index + 1}: ${step.text}${step.completed ? ', completed' : ''}`}
    >
      {/* Checkbox */}
      <Pressable
        style={({ pressed }) => [
          styles.checkbox,
          step.completed && styles.checkboxChecked,
          pressed && styles.checkboxPressed,
        ]}
        onPress={handleToggle}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: step.completed }}
        accessibilityLabel={step.completed ? 'Mark as incomplete' : 'Mark as complete'}
        testID={`action-step-checkbox-${step.id}`}
      >
        {step.completed && <Text style={styles.checkmark}>✓</Text>}
      </Pressable>

      {/* Step text */}
      <Text
        style={[styles.stepText, step.completed && styles.stepTextCompleted]}
        numberOfLines={3}
        ellipsizeMode="tail"
      >
        {step.text}
      </Text>

      {/* Reorder buttons */}
      <View style={styles.reorderButtons}>
        <TouchableOpacity
          style={[styles.reorderButton, isFirst && styles.reorderButtonDisabled]}
          onPress={handleMoveUp}
          disabled={isFirst}
          accessibilityRole="button"
          accessibilityLabel="Move step up"
          accessibilityHint={isFirst ? 'Cannot move first step up' : 'Moves this step up in the list'}
          testID={`action-step-move-up-${step.id}`}
        >
          <Text
            style={[styles.reorderButtonText, isFirst && styles.reorderButtonTextDisabled]}
          >
            ↑
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.reorderButton, isLast && styles.reorderButtonDisabled]}
          onPress={handleMoveDown}
          disabled={isLast}
          accessibilityRole="button"
          accessibilityLabel="Move step down"
          accessibilityHint={isLast ? 'Cannot move last step down' : 'Moves this step down in the list'}
          testID={`action-step-move-down-${step.id}`}
        >
          <Text
            style={[styles.reorderButtonText, isLast && styles.reorderButtonTextDisabled]}
          >
            ↓
          </Text>
        </TouchableOpacity>
      </View>

      {/* Delete button */}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={handleDelete}
        accessibilityRole="button"
        accessibilityLabel="Delete step"
        accessibilityHint="Removes this step from the action plan"
        testID={`action-step-delete-${step.id}`}
      >
        <Text style={styles.deleteButtonText}>×</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DESIGN_COLORS.bgElevated,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
  },
  containerCompleted: {
    backgroundColor: 'rgba(45, 90, 74, 0.2)', // success with opacity
    borderColor: DESIGN_COLORS.accentGreen,
  },

  // Checkbox
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: DESIGN_COLORS.textTertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: DESIGN_COLORS.accentGreen,
    borderColor: DESIGN_COLORS.accentGreen,
  },
  checkboxPressed: {
    opacity: 0.7,
  },
  checkmark: {
    color: DESIGN_COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },

  // Step text
  stepText: {
    flex: 1,
    fontSize: 15,
    color: DESIGN_COLORS.textPrimary,
    lineHeight: 22,
  },
  stepTextCompleted: {
    textDecorationLine: 'line-through',
    color: DESIGN_COLORS.textSecondary,
  },

  // Reorder buttons
  reorderButtons: {
    flexDirection: 'column',
    marginLeft: 8,
    marginRight: 4,
  },
  reorderButton: {
    width: 28,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: DESIGN_COLORS.bgSecondary,
    borderRadius: 4,
    marginVertical: 2,
  },
  reorderButtonDisabled: {
    opacity: 0.3,
  },
  reorderButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: DESIGN_COLORS.accentGold,
  },
  reorderButtonTextDisabled: {
    color: DESIGN_COLORS.textTertiary,
  },

  // Delete button
  deleteButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(220, 38, 38, 0.2)',
    borderRadius: 8,
    marginLeft: 4,
  },
  deleteButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: DESIGN_COLORS.error,
  },
});

export default ActionStep;
