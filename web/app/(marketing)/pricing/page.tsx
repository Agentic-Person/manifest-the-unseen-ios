'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { PricingTiers } from '@/components/subscription/PricingTiers'
import { useAuth } from '@/hooks/useAuth'
import { useSubscription } from '@/hooks/useSubscription'
import type { BillingInterval } from '@/types/subscription'

// =============================================================================
// Icons
// =============================================================================

function ShieldIcon({ className = 'w-6 h-6' }: { className?: string }) {
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
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    </svg>
  )
}

function CreditCardIcon({ className = 'w-6 h-6' }: { className?: string }) {
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
        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
      />
    </svg>
  )
}

function RefreshIcon({ className = 'w-6 h-6' }: { className?: string }) {
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
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    </svg>
  )
}

// =============================================================================
// Trust Badges
// =============================================================================

function TrustBadges() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto mb-16">
      <div className="flex items-center gap-3 justify-center text-center">
        <ShieldIcon className="w-8 h-8 text-aged-gold flex-shrink-0" />
        <div className="text-left">
          <p className="text-sm font-medium text-enlightened">Secure Checkout</p>
          <p className="text-xs text-muted-wisdom">256-bit SSL encryption</p>
        </div>
      </div>
      <div className="flex items-center gap-3 justify-center text-center">
        <CreditCardIcon className="w-8 h-8 text-aged-gold flex-shrink-0" />
        <div className="text-left">
          <p className="text-sm font-medium text-enlightened">7-Day Free Trial</p>
          <p className="text-xs text-muted-wisdom">No charge until trial ends</p>
        </div>
      </div>
      <div className="flex items-center gap-3 justify-center text-center">
        <RefreshIcon className="w-8 h-8 text-aged-gold flex-shrink-0" />
        <div className="text-left">
          <p className="text-sm font-medium text-enlightened">Cancel Anytime</p>
          <p className="text-xs text-muted-wisdom">No questions asked</p>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// Already Subscribed Banner
// =============================================================================

function AlreadySubscribedBanner({ tier }: { tier: string }) {
  return (
    <div className="max-w-2xl mx-auto mb-12 p-6 bg-heart-emerald/20 border border-heart-emerald/40 rounded-2xl">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-heart-emerald/30 flex items-center justify-center flex-shrink-0">
          <svg
            className="w-6 h-6 text-heart-emerald"
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
        </div>
        <div>
          <h3 className="text-lg font-medium text-enlightened">
            You are already subscribed
          </h3>
          <p className="text-sm text-muted-wisdom">
            You have an active <span className="text-aged-gold capitalize">{tier}</span> subscription.
            Visit your dashboard to manage your subscription.
          </p>
        </div>
      </div>
      <div className="mt-4 flex gap-4">
        <Link
          href="/app/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-primary text-enlightened rounded-full text-sm font-medium hover:brightness-110 transition-all"
        >
          Go to Dashboard
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  )
}

// =============================================================================
// Loading Fallback
// =============================================================================

function PricingLoadingFallback() {
  return (
    <div className="text-center py-16">
      <div className="w-16 h-16 mx-auto mb-4 relative">
        <div className="absolute inset-0 rounded-full border-4 border-aged-gold/20" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-aged-gold animate-spin" />
      </div>
      <p className="text-muted-wisdom">Loading pricing...</p>
    </div>
  )
}

// =============================================================================
// Inner Component (uses useSearchParams)
// =============================================================================

function PricingContent() {
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const { isSubscribed, tier: currentTier } = useSubscription({ platform: 'web' })

  // Get default interval from URL params (for returning from login)
  const intervalParam = searchParams.get('interval') as BillingInterval | null
  const defaultInterval: BillingInterval = intervalParam === 'year' ? 'year' : 'month'

  return (
    <>
      {/* Header */}
      <div className="text-center mb-12">
        <p className="text-aged-gold/80 text-sm uppercase tracking-widest mb-3">
          Pricing
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl font-light text-enlightened mb-4">
          Choose Your Path
        </h1>
        <p className="text-muted-wisdom text-lg max-w-2xl mx-auto">
          Start your 7-day free trial today. No commitment, cancel anytime.
          Choose the plan that fits your manifestation journey.
        </p>
      </div>

      {/* Already Subscribed Banner */}
      {isSubscribed && currentTier && (
        <AlreadySubscribedBanner tier={currentTier} />
      )}

      {/* Trust Badges */}
      <TrustBadges />

      {/* Pricing Tiers */}
      <PricingTiers defaultInterval={defaultInterval} />

      {/* FAQ Link */}
      <div className="text-center mt-16">
        <p className="text-muted-wisdom mb-4">
          Have questions about our pricing or features?
        </p>
        <Link
          href="/#faq"
          className="inline-flex items-center gap-2 text-aged-gold hover:text-amber-glow transition-colors"
        >
          View Frequently Asked Questions
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Enterprise Section */}
      <div className="mt-16 p-8 bg-temple-stone/30 border border-elevated rounded-2xl text-center">
        <h3 className="font-serif text-2xl text-enlightened mb-3">
          Need a Custom Solution?
        </h3>
        <p className="text-muted-wisdom mb-6 max-w-xl mx-auto">
          Looking for team access, custom integrations, or enterprise features?
          We would love to hear from you.
        </p>
        <a
          href="mailto:enterprise@manifesttheunseen.app"
          className="inline-flex items-center gap-2 px-6 py-3 bg-transparent border border-aged-gold/60 text-aged-gold rounded-full text-sm font-medium hover:bg-aged-gold/10 hover:border-aged-gold transition-all"
        >
          Contact Us
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </a>
      </div>
    </>
  )
}

// =============================================================================
// Main Component (wrapped in Suspense)
// =============================================================================

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-deep-void pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<PricingLoadingFallback />}>
          <PricingContent />
        </Suspense>
      </div>
    </main>
  )
}
