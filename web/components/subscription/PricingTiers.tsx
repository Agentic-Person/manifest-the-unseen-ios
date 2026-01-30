'use client'

import { useState } from 'react'
import { PRICING_TIERS, type PricingTier, type BillingInterval } from '@/types/subscription'
import { CheckoutButton } from './CheckoutButton'

// =============================================================================
// Icons
// =============================================================================

function CheckIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  )
}

function StarIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 20 20"
      aria-hidden="true"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  )
}

// =============================================================================
// Billing Toggle
// =============================================================================

interface BillingToggleProps {
  value: BillingInterval
  onChange: (interval: BillingInterval) => void
}

function BillingToggle({ value, onChange }: BillingToggleProps) {
  return (
    <div className="flex items-center justify-center gap-4 mb-10">
      <button
        type="button"
        onClick={() => onChange('month')}
        className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
          value === 'month'
            ? 'bg-aged-gold text-deep-void shadow-[0_4px_12px_rgba(196,160,82,0.3)]'
            : 'text-muted-wisdom hover:text-enlightened border border-elevated hover:border-aged-gold/50'
        }`}
      >
        Monthly
      </button>
      <button
        type="button"
        onClick={() => onChange('year')}
        className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
          value === 'year'
            ? 'bg-aged-gold text-deep-void shadow-[0_4px_12px_rgba(196,160,82,0.3)]'
            : 'text-muted-wisdom hover:text-enlightened border border-elevated hover:border-aged-gold/50'
        }`}
      >
        Yearly
        <span className="text-xs px-2 py-0.5 rounded-full bg-crown-purple/80 text-enlightened">
          Save up to 27%
        </span>
      </button>
    </div>
  )
}

// =============================================================================
// Pricing Card
// =============================================================================

interface PricingCardProps {
  tier: PricingTier
  billingInterval: BillingInterval
  onCheckout?: (tier: PricingTier, interval: BillingInterval) => void
}

function PricingCard({ tier, billingInterval, onCheckout }: PricingCardProps) {
  const price = billingInterval === 'month' ? tier.monthlyPrice : tier.yearlyPrice
  const priceId = billingInterval === 'month' ? tier.stripeMonthlyPriceId : tier.stripeYearlyPriceId
  const perMonth = billingInterval === 'year' ? (tier.yearlyPrice / 12).toFixed(2) : null

  return (
    <div
      className={`relative flex flex-col p-8 rounded-2xl transition-all duration-300 ${
        tier.highlighted
          ? 'bg-temple-stone border-2 border-aged-gold/60 shadow-[0_8px_32px_rgba(196,160,82,0.2)]'
          : 'bg-temple-stone/50 border border-elevated hover:border-aged-gold/30'
      }`}
    >
      {/* Most Popular Badge */}
      {tier.highlighted && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <div className="flex items-center gap-1.5 px-4 py-1.5 bg-aged-gold text-deep-void rounded-full text-sm font-semibold shadow-[0_4px_12px_rgba(196,160,82,0.4)]">
            <StarIcon />
            Most Popular
          </div>
        </div>
      )}

      {/* Tier Header */}
      <div className={`text-center mb-6 ${tier.highlighted ? 'pt-2' : ''}`}>
        <h3 className="font-serif text-2xl text-enlightened mb-1">{tier.name}</h3>
        <p className="text-sm text-muted-wisdom">{tier.tagline}</p>
      </div>

      {/* Pricing */}
      <div className="text-center mb-6">
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-4xl font-bold text-enlightened">${price.toFixed(2)}</span>
          <span className="text-muted-wisdom text-sm">/{billingInterval === 'month' ? 'mo' : 'yr'}</span>
        </div>
        {perMonth && (
          <p className="text-sm text-aged-gold mt-1">
            Just ${perMonth}/month
          </p>
        )}
        {billingInterval === 'year' && (
          <p className="text-xs text-crown-purple mt-2 font-medium">
            Save {tier.yearlyDiscount}% with yearly billing
          </p>
        )}
      </div>

      {/* Description */}
      <p className="text-center text-sm text-muted-wisdom mb-6">
        {tier.description}
      </p>

      {/* Features */}
      <ul className="space-y-3 mb-8 flex-grow">
        {tier.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3 text-sm">
            <CheckIcon className="w-5 h-5 text-aged-gold flex-shrink-0 mt-0.5" />
            <span className="text-enlightened/90">{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <CheckoutButton
        priceId={priceId}
        tier={tier.id}
        billingInterval={billingInterval}
        variant={tier.highlighted ? 'primary' : 'secondary'}
        className="w-full"
      >
        Start 7-Day Free Trial
      </CheckoutButton>

      {/* Trial Note */}
      <p className="text-center text-xs text-muted-wisdom mt-4">
        No charge during trial. Cancel anytime.
      </p>
    </div>
  )
}

// =============================================================================
// Main Component
// =============================================================================

export interface PricingTiersProps {
  /**
   * Initial billing interval
   * @default 'month'
   */
  defaultInterval?: BillingInterval
  /**
   * Custom CSS class
   */
  className?: string
  /**
   * Hide the billing toggle
   */
  hideToggle?: boolean
}

/**
 * PricingTiers displays the three subscription tiers with monthly/yearly toggle.
 * Uses pricing data from types/subscription.ts PRICING_TIERS.
 *
 * @example
 * ```tsx
 * <PricingTiers defaultInterval="year" />
 * ```
 */
export function PricingTiers({
  defaultInterval = 'month',
  className = '',
  hideToggle = false,
}: PricingTiersProps) {
  const [billingInterval, setBillingInterval] = useState<BillingInterval>(defaultInterval)

  return (
    <div className={className}>
      {/* Billing Toggle */}
      {!hideToggle && (
        <BillingToggle value={billingInterval} onChange={setBillingInterval} />
      )}

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {PRICING_TIERS.map((tier) => (
          <PricingCard
            key={tier.id}
            tier={tier}
            billingInterval={billingInterval}
          />
        ))}
      </div>
    </div>
  )
}

export default PricingTiers
