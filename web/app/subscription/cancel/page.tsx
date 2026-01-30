'use client'

import Link from 'next/link'

// =============================================================================
// Icons
// =============================================================================

function XCircleIcon({ className = 'w-16 h-16' }: { className?: string }) {
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
        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  )
}

function HeartIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
    </svg>
  )
}

// =============================================================================
// Reasons Section
// =============================================================================

function ReasonsSection() {
  const reasons = [
    {
      title: 'No commitment required',
      description: 'Start with a 7-day free trial. Cancel anytime before it ends.',
    },
    {
      title: 'Transform at your pace',
      description: 'Work through the 10 phases on your own schedule.',
    },
    {
      title: 'AI-powered guidance',
      description: 'Get personalized wisdom from the Guru when you need it.',
    },
  ]

  return (
    <div className="bg-temple-stone/30 border border-elevated rounded-2xl p-6 mt-8 text-left">
      <h3 className="font-serif text-lg text-enlightened mb-4 flex items-center gap-2">
        <HeartIcon className="text-aged-gold" />
        Why Manifest the Unseen?
      </h3>
      <ul className="space-y-3">
        {reasons.map((reason) => (
          <li key={reason.title} className="flex items-start gap-3">
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
            <div>
              <p className="text-enlightened font-medium text-sm">{reason.title}</p>
              <p className="text-xs text-muted-wisdom">{reason.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

// =============================================================================
// Main Component
// =============================================================================

export default function SubscriptionCancelPage() {
  return (
    <main className="min-h-screen bg-deep-void flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full text-center">
        {/* Icon */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-temple-stone/50 flex items-center justify-center">
          <XCircleIcon className="w-12 h-12 text-muted-wisdom" />
        </div>

        {/* Header */}
        <h1 className="font-serif text-3xl sm:text-4xl font-light text-enlightened mb-4">
          Checkout Canceled
        </h1>
        <p className="text-muted-wisdom mb-6">
          No worries! Your checkout was canceled and you were not charged.
          Take your time - your transformation journey will be here when you are ready.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-aged-gold to-amber-glow text-deep-void rounded-full font-semibold hover:brightness-110 transition-all shadow-[0_4px_16px_rgba(196,160,82,0.3)]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Pricing
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-transparent border border-elevated text-muted-wisdom rounded-full font-medium hover:text-enlightened hover:border-aged-gold/50 transition-all"
          >
            Go Home
          </Link>
        </div>

        {/* Reasons Section */}
        <ReasonsSection />

        {/* Help Link */}
        <p className="mt-8 text-sm text-muted-wisdom">
          Have questions?{' '}
          <a
            href="mailto:support@manifesttheunseen.app"
            className="text-aged-gold hover:text-amber-glow transition-colors underline"
          >
            Contact our support team
          </a>
        </p>
      </div>
    </main>
  )
}
