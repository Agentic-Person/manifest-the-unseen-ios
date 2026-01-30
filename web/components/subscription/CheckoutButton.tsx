'use client'

import { useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { createCheckoutSession } from '@/lib/stripe'
import type { SubscriptionTier, BillingInterval } from '@/types/subscription'

// =============================================================================
// Loading Spinner
// =============================================================================

function LoadingSpinner({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      className={`animate-spin ${className}`}
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}

// =============================================================================
// Types
// =============================================================================

export type CheckoutButtonVariant = 'primary' | 'secondary' | 'outline'

export interface CheckoutButtonProps {
  /**
   * Stripe price ID for the subscription
   */
  priceId: string
  /**
   * Subscription tier
   */
  tier: SubscriptionTier
  /**
   * Billing interval (month or year)
   */
  billingInterval: BillingInterval
  /**
   * Button variant
   * @default 'primary'
   */
  variant?: CheckoutButtonVariant
  /**
   * Custom URL to redirect to after successful checkout
   */
  successUrl?: string
  /**
   * Custom URL to redirect to if checkout is canceled
   */
  cancelUrl?: string
  /**
   * Custom CSS class
   */
  className?: string
  /**
   * Button children
   */
  children: ReactNode
  /**
   * Disable the button
   */
  disabled?: boolean
}

// =============================================================================
// Component
// =============================================================================

/**
 * CheckoutButton handles Stripe checkout flow.
 * Shows loading state and handles errors gracefully.
 *
 * If user is not authenticated, redirects to login page first.
 *
 * @example
 * ```tsx
 * <CheckoutButton
 *   priceId="price_awakening_monthly"
 *   tier="awakening"
 *   billingInterval="month"
 *   variant="primary"
 * >
 *   Start Free Trial
 * </CheckoutButton>
 * ```
 */
export function CheckoutButton({
  priceId,
  tier,
  billingInterval,
  variant = 'primary',
  successUrl,
  cancelUrl,
  className = '',
  children,
  disabled = false,
}: CheckoutButtonProps) {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Variant styles
  const variantStyles: Record<CheckoutButtonVariant, string> = {
    primary:
      'bg-gradient-to-r from-aged-gold to-amber-glow text-deep-void font-semibold hover:brightness-110 shadow-[0_4px_16px_rgba(196,160,82,0.3)] hover:shadow-[0_6px_20px_rgba(196,160,82,0.4)]',
    secondary:
      'bg-gradient-primary text-enlightened font-medium hover:brightness-110 shadow-[0_4px_16px_rgba(107,76,154,0.3)] hover:shadow-[0_6px_20px_rgba(107,76,154,0.4)]',
    outline:
      'bg-transparent border-2 border-aged-gold/60 text-aged-gold font-medium hover:bg-aged-gold/10 hover:border-aged-gold',
  }

  const handleCheckout = async () => {
    setError(null)

    // If not logged in, redirect to login with return URL
    if (!user) {
      const returnUrl = `/pricing?checkout=${tier}&interval=${billingInterval}`
      router.push(`/auth/login?returnUrl=${encodeURIComponent(returnUrl)}`)
      return
    }

    setIsLoading(true)

    try {
      const { checkoutUrl } = await createCheckoutSession({
        priceId,
        tier,
        billingInterval,
        successUrl,
        cancelUrl,
      })

      // Redirect to Stripe Checkout
      window.location.href = checkoutUrl
    } catch (err) {
      console.error('Checkout error:', err)
      setError(err instanceof Error ? err.message : 'Failed to start checkout')
      setIsLoading(false)
    }
  }

  const isDisabled = disabled || isLoading || authLoading

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleCheckout}
        disabled={isDisabled}
        className={`
          flex items-center justify-center gap-2
          px-6 py-3 rounded-full
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-aged-gold focus:ring-offset-2 focus:ring-offset-deep-void
          disabled:opacity-50 disabled:cursor-not-allowed
          ${variantStyles[variant]}
          ${className}
        `}
      >
        {isLoading ? (
          <>
            <LoadingSpinner className="w-5 h-5" />
            <span>Processing...</span>
          </>
        ) : (
          children
        )}
      </button>

      {/* Error Message */}
      {error && (
        <div className="absolute top-full left-0 right-0 mt-2">
          <div className="bg-root-crimson/20 border border-root-crimson/50 rounded-lg px-3 py-2 text-sm text-enlightened">
            <p className="flex items-start gap-2">
              <svg
                className="w-4 h-4 text-root-crimson flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{error}</span>
            </p>
            <button
              type="button"
              onClick={() => setError(null)}
              className="text-xs text-muted-wisdom hover:text-enlightened mt-1 underline"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default CheckoutButton
