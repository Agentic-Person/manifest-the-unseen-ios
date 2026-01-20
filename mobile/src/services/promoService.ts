/**
 * Promo Code Service
 *
 * Handles promo code validation and redemption tracking.
 * Works with the validate-promo Edge Function and Apple Offer Codes.
 */

import { supabase } from './supabase';
import { logger } from '../utils/logger';

// =============================================================================
// Types
// =============================================================================

export interface PromoValidationResult {
  valid: boolean;
  code?: string;
  description?: string;
  discountPercentage?: number;
  discountDurationMonths?: number;
  remainingSlots?: number;
  eligibleTiers?: string[];
  appleOfferId?: string | null;
  error?: string;
  redeemed?: boolean;
}

interface ValidatePromoRequest {
  code: string;
  tier?: string;
  checkOnly?: boolean;
}

// =============================================================================
// Promo Code Functions
// =============================================================================

/**
 * Validate a promo code
 *
 * @param code - The promo code to validate (e.g., "EARLY50")
 * @param tier - Optional: Check if code is valid for a specific tier
 * @param checkOnly - If true, just validate without recording redemption (default: true)
 * @returns Validation result with discount info or error
 *
 * @example
 * // Check if code is valid
 * const result = await validatePromoCode('EARLY50');
 * if (result.valid) {
 *   console.log(`${result.discountPercentage}% off for ${result.discountDurationMonths} months`);
 * }
 */
export async function validatePromoCode(
  code: string,
  tier?: string,
  checkOnly = true
): Promise<PromoValidationResult> {
  try {
    logger.debug('[promoService] Validating promo code:', code);

    const { data, error } = await supabase.functions.invoke('validate-promo', {
      body: {
        code,
        tier,
        checkOnly,
      } as ValidatePromoRequest,
    });

    if (error) {
      logger.error('[promoService] Edge function error:', error);
      return {
        valid: false,
        error: error.message || 'Failed to validate promo code',
      };
    }

    if (!data) {
      return {
        valid: false,
        error: 'No response from server',
      };
    }

    logger.debug('[promoService] Validation result:', data);
    return data as PromoValidationResult;
  } catch (error: any) {
    logger.error('[promoService] Validation error:', error);
    return {
      valid: false,
      error: error.message || 'Failed to validate promo code',
    };
  }
}

/**
 * Record promo code redemption after successful purchase
 *
 * Call this after a successful subscription purchase to record
 * that the user has used the promo code.
 *
 * @param code - The promo code that was used
 * @param tier - The subscription tier that was purchased
 * @returns Updated validation result with redeemed: true
 *
 * @example
 * // After successful purchase
 * if (purchaseResult.success && appliedPromoCode) {
 *   await recordPromoRedemption(appliedPromoCode, 'awakening');
 * }
 */
export async function recordPromoRedemption(
  code: string,
  tier: string
): Promise<PromoValidationResult> {
  logger.debug('[promoService] Recording promo redemption:', code, tier);

  // Call validate with checkOnly = false to record the redemption
  return validatePromoCode(code, tier, false);
}

/**
 * Get remaining promo code slots
 *
 * Quick check for how many redemptions are left for a promo code.
 * Useful for displaying "X spots remaining" messaging.
 *
 * @param code - The promo code to check
 * @returns Number of remaining slots, or null if code is invalid
 *
 * @example
 * const remaining = await getPromoCodeSlots('EARLY50');
 * if (remaining !== null && remaining < 10) {
 *   showUrgencyMessage(`Only ${remaining} spots left!`);
 * }
 */
export async function getPromoCodeSlots(code: string): Promise<number | null> {
  const result = await validatePromoCode(code, undefined, true);
  return result.valid ? result.remainingSlots ?? null : null;
}

/**
 * Check if a promo code is valid for a specific tier
 *
 * @param code - The promo code to check
 * @param tier - The subscription tier to check against
 * @returns true if code is valid for the tier
 */
export async function isPromoValidForTier(
  code: string,
  tier: string
): Promise<boolean> {
  const result = await validatePromoCode(code, tier, true);
  return result.valid;
}

/**
 * Format discount for display
 *
 * @param result - Validation result from validatePromoCode
 * @returns Human-readable discount string
 *
 * @example
 * const result = await validatePromoCode('EARLY50');
 * if (result.valid) {
 *   const text = formatDiscountText(result); // "50% off for 3 months"
 * }
 */
export function formatDiscountText(result: PromoValidationResult): string {
  if (!result.valid || !result.discountPercentage) {
    return '';
  }

  const duration = result.discountDurationMonths || 1;
  const monthText = duration === 1 ? 'month' : 'months';

  return `${result.discountPercentage}% off for ${duration} ${monthText}`;
}

/**
 * Calculate discounted price
 *
 * @param originalPrice - Original subscription price
 * @param discountPercentage - Discount percentage (e.g., 50 for 50%)
 * @returns Discounted price formatted as string
 */
export function calculateDiscountedPrice(
  originalPrice: number,
  discountPercentage: number
): string {
  const discounted = originalPrice * (1 - discountPercentage / 100);
  return discounted.toFixed(2);
}
