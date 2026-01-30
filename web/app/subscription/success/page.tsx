'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useSubscription } from '@/hooks/useSubscription'
import { getTierDisplayName } from '@/types/subscription'

// =============================================================================
// Icons
// =============================================================================

function CheckCircleIcon({ className = 'w-16 h-16' }: { className?: string }) {
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
        strokeWidth={1.5}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  )
}

function SparklesIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
  )
}

// =============================================================================
// Loading State
// =============================================================================

function LoadingState() {
  return (
    <div className="text-center">
      <div className="w-20 h-20 mx-auto mb-6 relative">
        <div className="absolute inset-0 rounded-full border-4 border-aged-gold/20" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-aged-gold animate-spin" />
      </div>
      <h2 className="font-serif text-2xl text-enlightened mb-2">
        Confirming Your Subscription...
      </h2>
      <p className="text-muted-wisdom">
        Please wait while we activate your account.
      </p>
    </div>
  )
}

// =============================================================================
// Success State
// =============================================================================

interface SuccessStateProps {
  tier: string | null
}

function SuccessState({ tier }: SuccessStateProps) {
  const tierName = tier ? getTierDisplayName(tier as any) : 'your plan'

  return (
    <div className="text-center">
      {/* Success Icon */}
      <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-heart-emerald/20 flex items-center justify-center">
        <CheckCircleIcon className="w-16 h-16 text-heart-emerald" />
      </div>

      {/* Header */}
      <h1 className="font-serif text-4xl sm:text-5xl font-light text-enlightened mb-4">
        Welcome to Your Journey
      </h1>
      <p className="text-xl text-aged-gold mb-2 flex items-center justify-center gap-2">
        <SparklesIcon />
        You are now on the {tierName} path
        <SparklesIcon />
      </p>
      <p className="text-muted-wisdom max-w-lg mx-auto mb-8">
        Your 7-day free trial has started. Explore all the features and begin
        your transformation journey today.
      </p>

      {/* What's Next */}
      <div className="bg-temple-stone/50 border border-elevated rounded-2xl p-8 mb-8 max-w-xl mx-auto text-left">
        <h3 className="font-serif text-xl text-enlightened mb-4">
          What&apos;s Next?
        </h3>
        <ul className="space-y-4">
          <li className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-aged-gold/20 text-aged-gold flex items-center justify-center text-sm font-medium flex-shrink-0">
              1
            </span>
            <div>
              <p className="text-enlightened font-medium">Start with Phase 1</p>
              <p className="text-sm text-muted-wisdom">
                Begin your self-evaluation with the Wheel of Life
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-aged-gold/20 text-aged-gold flex items-center justify-center text-sm font-medium flex-shrink-0">
              2
            </span>
            <div>
              <p className="text-enlightened font-medium">Explore Meditations</p>
              <p className="text-sm text-muted-wisdom">
                Access guided meditations for your practice
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-aged-gold/20 text-aged-gold flex items-center justify-center text-sm font-medium flex-shrink-0">
              3
            </span>
            <div>
              <p className="text-enlightened font-medium">Talk to the Guru</p>
              <p className="text-sm text-muted-wisdom">
                Get personalized AI guidance on your journey
              </p>
            </div>
          </li>
        </ul>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href="/app/dashboard"
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-aged-gold to-amber-glow text-deep-void rounded-full font-semibold hover:brightness-110 transition-all shadow-[0_4px_16px_rgba(196,160,82,0.3)]"
        >
          Go to Dashboard
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
        <Link
          href="/workbook"
          className="inline-flex items-center gap-2 px-8 py-4 bg-transparent border border-aged-gold/60 text-aged-gold rounded-full font-medium hover:bg-aged-gold/10 transition-all"
        >
          Start Workbook
        </Link>
      </div>

      {/* Trial Reminder */}
      <p className="mt-8 text-sm text-muted-wisdom">
        Remember: Your card will not be charged until your 7-day trial ends.
        You can cancel anytime from your dashboard.
      </p>
    </div>
  )
}

// =============================================================================
// Inner Component (uses useSearchParams)
// =============================================================================

function SubscriptionSuccessContent() {
  const searchParams = useSearchParams()
  const { tier, loading, refresh } = useSubscription({ platform: 'web' })
  const [isConfirming, setIsConfirming] = useState(true)

  // Stripe session ID from URL (for verification if needed)
  const sessionId = searchParams.get('session_id')

  // Refresh subscription data on mount and after a delay
  useEffect(() => {
    const confirmSubscription = async () => {
      // Initial refresh
      await refresh()

      // Wait a bit for webhook to process, then refresh again
      setTimeout(async () => {
        await refresh()
        setIsConfirming(false)
      }, 2000)
    }

    confirmSubscription()
  }, [])

  return (
    <div className="max-w-2xl w-full">
      {isConfirming || loading ? (
        <LoadingState />
      ) : (
        <SuccessState tier={tier} />
      )}
    </div>
  )
}

// =============================================================================
// Main Component (wrapped in Suspense)
// =============================================================================

export default function SubscriptionSuccessPage() {
  return (
    <main className="min-h-screen bg-deep-void flex items-center justify-center px-4 py-16">
      <Suspense fallback={<LoadingState />}>
        <SubscriptionSuccessContent />
      </Suspense>
    </main>
  )
}
