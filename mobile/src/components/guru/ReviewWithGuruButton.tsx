/**
 * ReviewWithGuruButton Component
 *
 * Displays a prominent call-to-action button for users to review completed phases
 * with the Guru AI. Only shown when the phase is 100% complete and user has access.
 *
 * Features:
 * - Gold-accented styling with sparkles icon
 * - Checks subscription tier (Awakening+ required)
 * - Shows lock icon for Novice/Free users
 * - Navigates to Guru tab with pre-selected phase
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, shadows, borderRadius } from '../../theme';
import { useGuruAccess } from '../../hooks/useSubscription';
import type { MainTabScreenProps } from '../../types/navigation';

interface ReviewWithGuruButtonProps {
  phaseNumber: number;
  phaseName: string;
  isPhaseComplete: boolean;
}

/**
 * Review with Guru Button Component
 *
 * Shows a gold-accented button that navigates to the Guru screen with
 * the current phase pre-selected for analysis.
 *
 * @example
 * ```tsx
 * <ReviewWithGuruButton
 *   phaseNumber={1}
 *   phaseName="Self-Evaluation"
 *   isPhaseComplete={overallProgress === 100}
 * />
 * ```
 */
export const ReviewWithGuruButton: React.FC<ReviewWithGuruButtonProps> = ({
  phaseNumber,
  phaseName,
  isPhaseComplete,
}) => {
  const navigation = useNavigation<MainTabScreenProps<'Workbook'>['navigation']>();
  const hasGuruAccess = useGuruAccess();

  // Only render if phase is complete
  if (!isPhaseComplete) {
    return null;
  }

  const handlePress = () => {
    if (!hasGuruAccess) {
      // Navigate to paywall with locked feature
      navigation.navigate('Paywall', { lockedFeature: 'guru' });
      return;
    }

    // Navigate to Guru tab with pre-selected phase
    navigation.navigate('Guru', { preSelectedPhase: phaseNumber });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          !hasGuruAccess && styles.buttonLocked,
        ]}
        onPress={handlePress}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={
          hasGuruAccess
            ? `Review ${phaseName} with Guru AI`
            : `Upgrade to review ${phaseName} with Guru AI`
        }
        accessibilityHint={
          hasGuruAccess
            ? 'Opens Guru AI chat with personalized insights'
            : 'Shows subscription options'
        }
      >
        {/* Icon */}
        <View style={styles.iconContainer}>
          <Ionicons
            name={hasGuruAccess ? 'sparkles' : 'lock-closed'}
            size={24}
            color={hasGuruAccess ? colors.dark.accentGold : colors.text.tertiary}
          />
        </View>

        {/* Text Content */}
        <View style={styles.textContainer}>
          <Text style={[
            styles.title,
            !hasGuruAccess && styles.titleLocked,
          ]}>
            Review with Guru
          </Text>
          <Text style={[
            styles.subtitle,
            !hasGuruAccess && styles.subtitleLocked,
          ]}>
            {hasGuruAccess
              ? 'Get personalized insights on your journey'
              : 'Upgrade to Awakening+ for AI-guided wisdom'}
          </Text>
        </View>

        {/* Arrow */}
        <View style={styles.arrowContainer}>
          <Ionicons
            name="chevron-forward"
            size={24}
            color={hasGuruAccess ? colors.dark.accentGold : colors.text.tertiary}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.elevated,
    borderWidth: 2,
    borderColor: colors.dark.accentGold,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    ...shadows.md,
    shadowColor: colors.dark.accentGold,
    shadowOpacity: 0.3,
    elevation: 6,
  },
  buttonLocked: {
    borderColor: colors.border.disabled,
    shadowColor: colors.gray[700],
    shadowOpacity: 0.2,
    opacity: 0.8,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    backgroundColor: `${colors.dark.accentGold}20`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.dark.accentGold,
    marginBottom: 4,
  },
  titleLocked: {
    color: colors.text.secondary,
  },
  subtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 18,
  },
  subtitleLocked: {
    color: colors.text.tertiary,
  },
  arrowContainer: {
    marginLeft: spacing.sm,
  },
});

export default ReviewWithGuruButton;
