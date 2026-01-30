'use client'

import Link from 'next/link'
import { usePlatform } from '@/hooks/usePlatform'
import { useSubscription } from '@/hooks/useSubscription'
import { SubscriptionTier, getTierDisplayName, PRICING_TIERS } from '@/types/subscription'

export interface UpgradePromptProps {
  /**
   * The tier required to access this feature
   */
  requiredTier?: SubscriptionTier

  /**
   * Custom reason/message to display
   */
  reason?: string

  /**
   * The feature that is locked
   */
  feature?: string

  /**
   * Compact mode for inline display
   */
  compact?: boolean

  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * Reusable upgrade CTA component.
 * Shows current tier and upgrade benefits, with link to pricing.
 *
 * @example
 * ```tsx
 * <UpgradePrompt
 *   requiredTier="awakening"
 *   feature="Guru AI"
 *   reason="Unlock AI-guided wisdom with Awakening tier"
 * />
 * ```
 */
export function UpgradePrompt({
  requiredTier,
  reason,
  feature,
  compact = false,
  className = '',
}: UpgradePromptProps) {
  const { tier } = useSubscription()
  const { isCompanion } = usePlatform()

  // Determine pricing URL based on platform
  const pricingUrl = isCompanion ? '/ios-pricing' : '/pricing'

  // Get tier display info
  const currentTierName = tier ? getTierDisplayName(tier) : 'Free'
  const requiredTierName = requiredTier ? getTierDisplayName(requiredTier) : null
  const requiredTierInfo = requiredTier
    ? PRICING_TIERS.find((t) => t.id === requiredTier)
    : null

  // Benefits of upgrading
  const upgradeBenefits = getUpgradeBenefits(tier, requiredTier)

  if (compact) {
    return (
      <div
        className={`flex items-center justify-between p-3 bg-temple-stone border border-gold-border rounded-lg ${className}`}
      >
        <div className="flex items-center gap-2">
          <span className="text-aged-gold">
            <LockIcon />
          </span>
          <span className="text-sm text-muted-wisdom">
            {reason || `Requires ${requiredTierName || 'upgrade'}`}
          </span>
        </div>
        <Link
          href={pricingUrl}
          className="text-sm font-medium text-aged-gold hover:text-amber-glow transition-colors"
        >
          Upgrade
        </Link>
      </div>
    )
  }

  return (
    <div
      className={`p-6 bg-temple-stone border border-gold-border rounded-xl ${className}`}
    >
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className="p-3 bg-elevated rounded-lg">
          <span className="text-aged-gold">
            <LockIcon className="w-6 h-6" />
          </span>
        </div>
        <div>
          <h3 className="text-lg font-serif text-enlightened mb-1">
            {feature ? `Unlock ${feature}` : 'Upgrade Required'}
          </h3>
          <p className="text-sm text-muted-wisdom">
            {reason ||
              (requiredTierName
                ? `This feature requires ${requiredTierName} tier or higher`
                : 'Upgrade your subscription to access this feature')}
          </p>
        </div>
      </div>

      {/* Current tier */}
      <div className="flex items-center gap-2 mb-4 text-sm">
        <span className="text-tertiary-text">Current tier:</span>
        <span className="px-2 py-0.5 bg-elevated rounded text-muted-wisdom">
          {currentTierName}
        </span>
        {requiredTierName && (
          <>
            <span className="text-tertiary-text">-&gt;</span>
            <span className="px-2 py-0.5 bg-aged-gold/20 rounded text-aged-gold">
              {requiredTierName}
            </span>
          </>
        )}
      </div>

      {/* Benefits */}
      {upgradeBenefits.length > 0 && (
        <div className="mb-5">
          <p className="text-sm text-muted-wisdom mb-2">What you'll get:</p>
          <ul className="space-y-1.5">
            {upgradeBenefits.map((benefit, index) => (
              <li
                key={index}
                className="flex items-center gap-2 text-sm text-enlightened"
              >
                <CheckIcon className="w-4 h-4 text-aged-gold flex-shrink-0" />
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Pricing info */}
      {requiredTierInfo && (
        <div className="flex items-baseline gap-2 mb-5">
          <span className="text-2xl font-serif text-enlightened">
            ${requiredTierInfo.monthlyPrice}
          </span>
          <span className="text-sm text-muted-wisdom">/month</span>
          <span className="text-xs text-tertiary-text">
            or ${requiredTierInfo.yearlyPrice}/year (save{' '}
            {requiredTierInfo.yearlyDiscount}%)
          </span>
        </div>
      )}

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href={pricingUrl}
          className="flex-1 inline-flex items-center justify-center px-5 py-2.5 bg-aged-gold text-deep-void font-medium rounded-lg hover:bg-amber-glow transition-colors"
        >
          View Pricing
        </Link>
        {isCompanion && (
          <a
            href="https://apps.apple.com/app/manifest-the-unseen"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center px-5 py-2.5 border border-aged-gold text-aged-gold font-medium rounded-lg hover:bg-aged-gold/10 transition-colors"
          >
            Upgrade in iOS App
          </a>
        )}
      </div>
    </div>
  )
}

/**
 * Get benefits of upgrading to a higher tier
 */
function getUpgradeBenefits(
  currentTier: SubscriptionTier | null,
  targetTier?: SubscriptionTier
): string[] {
  const benefits: string[] = []

  if (!targetTier) {
    // Generic benefits
    return [
      'Access more workbook phases',
      'Unlock AI-guided wisdom',
      'More journal entries',
      'Premium meditations',
    ]
  }

  const targetTierInfo = PRICING_TIERS.find((t) => t.id === targetTier)
  if (!targetTierInfo) return benefits

  // Return features of target tier
  return targetTierInfo.features.slice(0, 4) // Show first 4 features
}

// Icon components
function LockIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
      />
    </svg>
  )
}

function CheckIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
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

export default UpgradePrompt
