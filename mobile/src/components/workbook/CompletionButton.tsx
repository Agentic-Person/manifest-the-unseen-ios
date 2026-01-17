import React from 'react';
import { View, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Text } from '../Text';
import { colors, spacing, borderRadius, shadows } from '../../theme';

interface CompletionButtonProps {
  isCompleted: boolean;
  canComplete: boolean;
  isAutoCompleted: boolean;
  isSaving: boolean;
  onPress: () => void;
}

export const CompletionButton: React.FC<CompletionButtonProps> = ({
  isCompleted,
  canComplete,
  isAutoCompleted,
  isSaving,
  onPress,
}) => {
  const handlePress = () => {
    if (canComplete && !isSaving) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {
        // Haptic feedback is optional, ignore errors
      });
      onPress();
    } else {
      // Provide haptic feedback when user tries to tap disabled button
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {
        // Haptic feedback is optional, ignore errors
      });
    }
  };

  if (isCompleted) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={['#22c55e', '#16a34a']} style={styles.completedButton}>
          <Text style={styles.completedText}>✓ Completed</Text>
        </LinearGradient>
      </View>
    );
  }

  const isDisabled = !canComplete || isSaving;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, isDisabled && styles.buttonDisabled]}
        onPress={handlePress}
        disabled={false} // Allow TouchableOpacity to always fire onPress for haptic feedback
        activeOpacity={isDisabled ? 1 : 0.8}
      >
        <LinearGradient
          colors={canComplete ? ['#c9a227', '#8b6914'] : ['#3a3a5a', '#2a2a4a']}
          style={styles.gradient}
        >
          {isSaving ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <View style={styles.content}>
              {isAutoCompleted && <Text style={styles.icon}>✨</Text>}
              <Text style={[styles.text, isDisabled && styles.textDisabled]}>
                {isAutoCompleted ? 'Mark as Complete' : 'Complete Exercise'}
              </Text>
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>

      {/* Show helpful hint based on state */}
      {isAutoCompleted && !isDisabled && (
        <Text style={styles.hint}>All required fields filled!</Text>
      )}
      {!canComplete && !isSaving && (
        <Text style={styles.hintDisabled}>
          📝 Fill in all required fields to complete this exercise
        </Text>
      )}
      {isSaving && <Text style={styles.hint}>Saving your progress...</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  button: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.md,
  },
  buttonDisabled: {
    opacity: 0.5,
    transform: [{ scale: 0.98 }],
  },
  gradient: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 18,
    marginRight: spacing.xs,
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: 0.5,
  },
  textDisabled: {
    opacity: 0.7,
  },
  completedButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    ...shadows.md,
  },
  completedText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: 0.5,
  },
  hint: {
    fontSize: 13,
    color: colors.text.tertiary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  hintDisabled: {
    fontSize: 13,
    color: '#ef4444', // Red color for warning
    textAlign: 'center',
    marginTop: spacing.xs,
    fontWeight: '500',
  },
});
