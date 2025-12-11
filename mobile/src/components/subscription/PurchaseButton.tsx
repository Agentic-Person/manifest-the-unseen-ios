/**
 * Purchase Button Component
 *
 * CTA button for subscription purchase with loading states
 */

import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing } from '../../theme';

interface PurchaseButtonProps {
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  isCurrentTier?: boolean;
  inTrial?: boolean;
  label?: string;
}

export const PurchaseButton: React.FC<PurchaseButtonProps> = ({
  onPress,
  isLoading = false,
  disabled = false,
  isCurrentTier = false,
  inTrial = false,
  label,
}) => {
  const getButtonLabel = (): string => {
    if (label) return label;
    if (isCurrentTier && inTrial) return 'Current Trial';
    if (isCurrentTier) return 'Current Plan';
    return 'Start Free Trial';
  };

  const isDisabled = disabled || isCurrentTier;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled || isLoading}
      style={({ pressed }) => [
        styles.container,
        pressed && !isDisabled && styles.pressed,
      ]}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: isLoading }}
    >
      <LinearGradient
        colors={
          isDisabled
            ? [colors.gray[700], colors.gray[800]]
            : [colors.brand.amber, colors.brand.bronze]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {isLoading ? (
          <ActivityIndicator color={colors.background.primary} size="small" />
        ) : (
          <Text
            style={[
              styles.text,
              isDisabled && styles.textDisabled,
            ]}
          >
            {getButtonLabel()}
          </Text>
        )}
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: colors.brand.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  gradient: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  text: {
    color: colors.background.primary,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  textDisabled: {
    color: colors.text.disabled,
  },
});
