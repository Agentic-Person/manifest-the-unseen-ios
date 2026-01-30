'use client'

import { useCallback, useEffect } from 'react'
import Link from 'next/link'
import { SubscriptionTier, getTierDisplayName } from '@/types/subscription'

export interface UpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  requiredTier: SubscriptionTier
  featureName?: string
  className?: string
}

/**
 * UpgradeModal component shown when user tries to access locked content.
 * Prompts user to upgrade their subscription tier.
 *
 * @example
 * ```tsx
 * <UpgradeModal
 *   isOpen={showUpgradeModal}
 *   onClose={() => setShowUpgradeModal(false)}
 *   requiredTier="awakening"
 *   featureName="this meditation"
 * />
 * ```
 */
export function UpgradeModal({
  isOpen,
  onClose,
  requiredTier,
  featureName = 'this content',
  className = '',
}: UpgradeModalProps) {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        onClose()
      }
    },
    [onClose]
  )

  if (!isOpen) return null

  const tierName = getTierDisplayName(requiredTier)

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${className}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="upgrade-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-deep-void/80 backdrop-blur-sm"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* Modal content */}
      <div className="relative w-full max-w-md bg-temple-stone border border-aged-gold/20 rounded-2xl shadow-2xl p-6 animate-in fade-in zoom-in duration-200">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-muted-wisdom hover:text-enlightened transition-colors"
          aria-label="Close modal"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Lock icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-aged-gold/10 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-aged-gold"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2
          id="upgrade-modal-title"
          className="text-xl font-heading text-enlightened text-center mb-2"
        >
          Unlock {featureName}
        </h2>

        {/* Description */}
        <p className="text-muted-wisdom text-center mb-6">
          Upgrade to the <span className="text-aged-gold font-medium">{tierName}</span> plan to
          access {featureName} and unlock even more transformative content.
        </p>

        {/* Features list */}
        <div className="bg-elevated/50 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-medium text-enlightened mb-3">
            {tierName} plan includes:
          </h3>
          <ul className="space-y-2">
            {getTierFeatures(requiredTier).map((feature, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-muted-wisdom">
                <svg
                  className="w-5 h-5 text-aged-gold flex-shrink-0 mt-0.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-3">
          <Link
            href="/pricing"
            className="w-full py-3 px-4 bg-gradient-to-r from-aged-gold to-amber-glow text-deep-void font-medium rounded-lg text-center hover:opacity-90 transition-opacity"
          >
            View Plans
          </Link>
          <button
            onClick={onClose}
            className="w-full py-3 px-4 border border-muted-wisdom/30 text-muted-wisdom rounded-lg hover:border-enlightened hover:text-enlightened transition-colors"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * Get feature list for a tier
 */
function getTierFeatures(tier: SubscriptionTier): string[] {
  switch (tier) {
    case 'novice':
      return [
        'Phases 1-5 of the workbook',
        '3 guided meditations',
        '50 journal entries per month',
        'Basic progress tracking',
      ]
    case 'awakening':
      return [
        'Phases 1-8 of the workbook',
        '6 guided meditations',
        '200 journal entries per month',
        'Guru AI phase analysis',
        'All breathing exercises',
      ]
    case 'enlightenment':
      return [
        'All 10 workbook phases',
        'All meditations & prayers',
        'Unlimited journal entries',
        'Unlimited Guru AI guidance',
        'Priority support',
      ]
    default:
      return []
  }
}
