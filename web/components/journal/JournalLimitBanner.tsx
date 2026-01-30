'use client'

import Link from 'next/link'
import { useJournalLimit } from '@/hooks/useJournalLimit'
import { useSubscription } from '@/hooks/useSubscription'
import { getJournalLimitDisplayText, getUpgradeSuggestion } from '@/lib/shared/journalLimits'

export interface JournalLimitBannerProps {
  className?: string
}

/**
 * JournalLimitBanner component displays the user's journal entry limit status.
 * Shows remaining entries, warnings when low, and upgrade prompts when at limit.
 *
 * @example
 * ```tsx
 * <JournalLimitBanner />
 * ```
 */
export function JournalLimitBanner({ className = '' }: JournalLimitBannerProps) {
  const { limitInfo, loading } = useJournalLimit()
  const { tier } = useSubscription()

  if (loading) {
    return (
      <div className={`bg-elevated border border-[rgba(196,160,82,0.2)] rounded-lg p-4 ${className}`}>
        <div className="flex items-center gap-3">
          <div className="animate-pulse w-4 h-4 bg-muted-wisdom/20 rounded"></div>
          <div className="animate-pulse h-4 w-48 bg-muted-wisdom/20 rounded"></div>
        </div>
      </div>
    )
  }

  // Don't show anything for unlimited tier
  if (limitInfo.isUnlimited) {
    return (
      <div className={`bg-elevated border border-green-500/20 rounded-lg p-4 ${className}`}>
        <div className="flex items-center gap-3">
          <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-green-400 text-sm font-medium">
            Unlimited journal entries with your Enlightenment plan
          </span>
        </div>
      </div>
    )
  }

  const displayText = getJournalLimitDisplayText(limitInfo)
  const upgradeSuggestion = getUpgradeSuggestion(tier, limitInfo)

  // Determine banner style based on status
  let bannerStyle = 'border-[rgba(196,160,82,0.2)]'
  let iconColor = 'text-aged-gold'
  let textColor = 'text-muted-wisdom'

  if (limitInfo.hasReachedLimit) {
    bannerStyle = 'border-red-500/30 bg-red-500/5'
    iconColor = 'text-red-400'
    textColor = 'text-red-300'
  } else if (limitInfo.isWarning) {
    bannerStyle = 'border-orange-500/30 bg-orange-500/5'
    iconColor = 'text-orange-400'
    textColor = 'text-orange-300'
  } else if (limitInfo.isLow) {
    bannerStyle = 'border-yellow-500/30 bg-yellow-500/5'
    iconColor = 'text-yellow-400'
    textColor = 'text-yellow-300'
  }

  const progressPercent = limitInfo.percentUsed

  return (
    <div className={`bg-elevated border ${bannerStyle} rounded-lg p-4 ${className}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            {limitInfo.hasReachedLimit ? (
              <svg className={`w-5 h-5 ${iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            ) : (
              <svg className={`w-5 h-5 ${iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            )}
            <span className={`${textColor} text-sm font-medium`}>
              {displayText}
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 bg-temple-stone rounded-full overflow-hidden mb-2">
            <div
              className={`h-full transition-all duration-300 ${
                limitInfo.hasReachedLimit
                  ? 'bg-red-500'
                  : limitInfo.isWarning
                    ? 'bg-orange-500'
                    : limitInfo.isLow
                      ? 'bg-yellow-500'
                      : 'bg-aged-gold'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <p className="text-xs text-muted-wisdom/60">
            {limitInfo.usedEntries} of {limitInfo.maxEntries} entries used this month
          </p>
        </div>

        {/* Upgrade button */}
        {upgradeSuggestion && (
          <Link
            href="/pricing"
            className="
              shrink-0 px-4 py-2 text-sm font-medium
              bg-aged-gold text-deep-void rounded-lg
              hover:bg-aged-gold/90 transition-all duration-200
              shadow-[0_0_12px_rgba(196,160,82,0.3)]
            "
          >
            Upgrade
          </Link>
        )}
      </div>

      {/* Upgrade suggestion text */}
      {upgradeSuggestion && (
        <p className="mt-3 text-xs text-muted-wisdom/60">
          {upgradeSuggestion}
        </p>
      )}
    </div>
  )
}
