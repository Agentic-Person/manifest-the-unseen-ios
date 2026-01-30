'use client'

import Link from 'next/link'

interface GuruLockedScreenProps {
  currentTier: string | null
}

/**
 * GuruLockedScreen shows when user doesn't have Awakening+ tier subscription
 * Displays upgrade prompt with feature highlights
 */
export function GuruLockedScreen({ currentTier }: GuruLockedScreenProps) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      {/* Lock Icon */}
      <div className="w-24 h-24 rounded-full bg-elevated border-2 border-[rgba(196,160,82,0.3)] flex items-center justify-center mb-6">
        <svg
          className="w-12 h-12 text-aged-gold"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      </div>

      {/* Title */}
      <h1 className="text-3xl font-heading font-light text-aged-gold mb-4">
        Guru Analysis
      </h1>
      <p className="text-lg text-muted-wisdom mb-8 max-w-lg">
        Unlock personalized AI-guided wisdom and deep analysis of your manifestation journey.
      </p>

      {/* Feature Highlights */}
      <div className="bg-temple-stone rounded-xl border border-[rgba(196,160,82,0.2)] p-6 mb-8 max-w-md w-full">
        <h3 className="text-enlightened font-medium mb-4">
          Premium Feature Includes:
        </h3>
        <ul className="space-y-3 text-left">
          <li className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-aged-gold flex-shrink-0 mt-0.5"
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
            <span className="text-enlightened/90 text-sm">
              AI analysis of your completed workbook phases
            </span>
          </li>
          <li className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-aged-gold flex-shrink-0 mt-0.5"
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
            <span className="text-enlightened/90 text-sm">
              Personalized insights based on your journey
            </span>
          </li>
          <li className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-aged-gold flex-shrink-0 mt-0.5"
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
            <span className="text-enlightened/90 text-sm">
              Wisdom from ancient teachings and manifestation principles
            </span>
          </li>
          <li className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-aged-gold flex-shrink-0 mt-0.5"
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
            <span className="text-enlightened/90 text-sm">
              Meditation and practice recommendations
            </span>
          </li>
        </ul>
      </div>

      {/* Subscription Info */}
      <div className="text-sm text-muted-wisdom mb-6">
        {currentTier ? (
          <p>
            Your current plan: <span className="text-enlightened capitalize">{currentTier}</span>
          </p>
        ) : (
          <p>You need an active subscription to access the Guru.</p>
        )}
      </div>

      {/* Upgrade Button */}
      <Link
        href="/#pricing"
        className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-gold text-deep-void font-medium rounded-xl hover:brightness-110 transition-all duration-200 shadow-lg shadow-aged-gold/20"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
        Upgrade to Awakening
      </Link>

      {/* Tier Requirements */}
      <p className="text-xs text-muted-wisdom mt-4">
        Available with Awakening ($12.99/mo) or Enlightenment ($19.99/mo) plans
      </p>
    </div>
  )
}
