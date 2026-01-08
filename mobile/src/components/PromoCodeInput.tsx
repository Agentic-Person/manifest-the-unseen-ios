/**
 * Promo Code Input Component
 *
 * Allows users to enter and validate promo codes on the paywall screen.
 * Shows discount information when a valid code is applied.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { colors, spacing } from '../theme';
import { usePromoCodeState, usePromoActions } from '../stores/subscriptionStore';
import { formatDiscountText } from '../services/promoService';

interface PromoCodeInputProps {
  /** Callback when a promo code is successfully applied */
  onApplied?: (code: string, discount: number) => void;
}

/**
 * PromoCodeInput Component
 *
 * Expandable promo code input with validation and success states.
 *
 * @example
 * <PromoCodeInput
 *   onApplied={(code, discount) => {
 *     console.log(`Applied ${code}: ${discount}% off`);
 *   }}
 * />
 */
export const PromoCodeInput: React.FC<PromoCodeInputProps> = ({ onApplied }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showInput, setShowInput] = useState(false);

  const {
    appliedPromoCode,
    promoCodeDiscount: _promoCodeDiscount,
    promoCodeValidation,
    isValidatingPromo,
  } = usePromoCodeState();

  const { validatePromo, clearPromo } = usePromoActions();

  const handleApply = async () => {
    if (!code.trim()) return;

    setError(null);
    const result = await validatePromo(code.trim());

    if (result.valid) {
      onApplied?.(code.trim().toUpperCase(), result.discountPercentage ?? 0);
    } else {
      setError(result.error ?? 'Invalid promo code');
    }
  };

  const handleClear = () => {
    clearPromo();
    setCode('');
    setError(null);
  };

  // Show applied promo code state
  if (appliedPromoCode && promoCodeValidation) {
    return (
      <View style={styles.appliedContainer}>
        <View style={styles.appliedBadge}>
          <Text style={styles.appliedIcon}>🎉</Text>
          <View style={styles.appliedInfo}>
            <Text style={styles.appliedCode}>{appliedPromoCode}</Text>
            <Text style={styles.appliedDiscount}>
              {formatDiscountText(promoCodeValidation)}
            </Text>
          </View>
          <Pressable onPress={handleClear} hitSlop={8}>
            <Text style={styles.removeText}>Remove</Text>
          </Pressable>
        </View>
        {promoCodeValidation.remainingSlots !== undefined &&
          promoCodeValidation.remainingSlots < 10 && (
            <Text style={styles.urgencyText}>
              Only {promoCodeValidation.remainingSlots} spots left!
            </Text>
          )}
      </View>
    );
  }

  // Show expandable promo code input
  if (!showInput) {
    return (
      <Pressable style={styles.toggleButton} onPress={() => setShowInput(true)}>
        <Text style={styles.toggleButtonText}>Have a promo code?</Text>
      </Pressable>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Enter promo code"
          placeholderTextColor={colors.text.tertiary}
          value={code}
          onChangeText={(text) => {
            setCode(text.toUpperCase());
            setError(null);
          }}
          autoCapitalize="characters"
          autoCorrect={false}
          returnKeyType="done"
          onSubmitEditing={handleApply}
          editable={!isValidatingPromo}
        />
        <Pressable
          style={[
            styles.applyButton,
            (!code.trim() || isValidatingPromo) && styles.applyButtonDisabled,
          ]}
          onPress={handleApply}
          disabled={isValidatingPromo || !code.trim()}
        >
          {isValidatingPromo ? (
            <ActivityIndicator size="small" color={colors.background.primary} />
          ) : (
            <Text style={styles.applyButtonText}>Apply</Text>
          )}
        </Pressable>
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
      <Pressable
        style={styles.cancelButton}
        onPress={() => {
          setShowInput(false);
          setCode('');
          setError(null);
        }}
      >
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  toggleButton: {
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  toggleButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.link,
    textDecorationLine: 'underline',
  },
  inputRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    height: 44,
    paddingHorizontal: spacing.md,
    backgroundColor: 'rgba(26, 26, 36, 0.8)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border.default,
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1,
  },
  applyButton: {
    height: 44,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.brand.gold,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButtonDisabled: {
    opacity: 0.5,
  },
  applyButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.background.primary,
  },
  errorText: {
    marginTop: spacing.xs,
    fontSize: 13,
    color: '#EF4444',
    textAlign: 'center',
  },
  cancelButton: {
    marginTop: spacing.sm,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.text.tertiary,
  },
  appliedContainer: {
    marginVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  appliedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
  appliedIcon: {
    fontSize: 24,
    marginRight: spacing.sm,
  },
  appliedInfo: {
    flex: 1,
  },
  appliedCode: {
    fontSize: 16,
    fontWeight: '700',
    color: '#22C55E',
  },
  appliedDiscount: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.text.secondary,
  },
  removeText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.text.tertiary,
    textDecorationLine: 'underline',
  },
  urgencyText: {
    marginTop: spacing.xs,
    fontSize: 12,
    fontWeight: '600',
    color: '#F97316',
    textAlign: 'center',
  },
});

export default PromoCodeInput;
