import React from 'react';
import { View, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
  if (isCompleted) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={['#22c55e', '#16a34a']} style={styles.completedButton}>
          <Text style={styles.completedText}>✓ Completed</Text>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, !canComplete && styles.buttonDisabled]}
        onPress={onPress}
        disabled={!canComplete || isSaving}
        activeOpacity={0.8}
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
              <Text style={styles.text}>
                {isAutoCompleted ? 'Mark as Complete' : 'Complete Exercise'}
              </Text>
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
      {isAutoCompleted && (
        <Text style={styles.hint}>All required fields filled!</Text>
      )}
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
    opacity: 0.6,
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
});
