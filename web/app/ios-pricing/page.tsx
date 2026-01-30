'use client'

import Link from 'next/link'

// =============================================================================
// Icons
// =============================================================================

function AppleIcon({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  )
}

function DevicePhoneIcon({ className = 'w-12 h-12' }: { className?: string }) {
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
        d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"
      />
    </svg>
  )
}

// =============================================================================
// Main Component
// =============================================================================

export default function IOSPricingPage() {
  return (
    <main className="min-h-screen bg-deep-void flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full text-center">
        {/* Icon */}
        <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-aged-gold/20 to-amber-glow/10 flex items-center justify-center">
          <DevicePhoneIcon className="w-12 h-12 text-aged-gold" />
        </div>

        {/* Header */}
        <h1 className="font-serif text-3xl sm:text-4xl font-light text-enlightened mb-4">
          Subscribe via the iOS App
        </h1>
        <p className="text-muted-wisdom text-lg mb-8">
          The iOS Companion requires an active subscription purchased through the
          Manifest the Unseen mobile app on the App Store.
        </p>

        {/* Info Card */}
        <div className="bg-temple-stone/50 border border-elevated rounded-2xl p-6 mb-8 text-left">
          <h3 className="font-medium text-enlightened mb-3 flex items-center gap-2">
            <AppleIcon className="w-5 h-5" />
            How to Subscribe
          </h3>
          <ol className="space-y-3 text-sm text-muted-wisdom">
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-aged-gold/20 text-aged-gold flex items-center justify-center text-xs font-medium flex-shrink-0">
                1
              </span>
              <span>Download Manifest the Unseen from the App Store</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-aged-gold/20 text-aged-gold flex items-center justify-center text-xs font-medium flex-shrink-0">
                2
              </span>
              <span>Open the app and tap &quot;Start Free Trial&quot;</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-aged-gold/20 text-aged-gold flex items-center justify-center text-xs font-medium flex-shrink-0">
                3
              </span>
              <span>Choose your plan and complete the purchase via Apple</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-aged-gold/20 text-aged-gold flex items-center justify-center text-xs font-medium flex-shrink-0">
                4
              </span>
              <span>Return here and sign in with the same account</span>
            </li>
          </ol>
        </div>

        {/* App Store Button */}
        <a
          href="https://apps.apple.com/app/manifest-the-unseen/id6740044416"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-8 py-4 bg-black text-white rounded-xl font-medium hover:bg-gray-900 transition-colors mb-6"
        >
          <AppleIcon className="w-7 h-7" />
          <div className="text-left">
            <div className="text-xs text-gray-400">Download on the</div>
            <div className="text-lg font-semibold -mt-1">App Store</div>
          </div>
        </a>

        {/* Alternative Option */}
        <div className="border-t border-elevated pt-6 mt-6">
          <p className="text-muted-wisdom text-sm mb-4">
            Prefer to subscribe via web? Access the full web app instead:
          </p>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 text-aged-gold hover:text-amber-glow transition-colors text-sm"
          >
            View Web App Pricing
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Already Subscribed */}
        <div className="mt-8 p-4 bg-aged-gold/10 border border-aged-gold/30 rounded-xl">
          <p className="text-sm text-muted-wisdom">
            <span className="text-aged-gold font-medium">Already subscribed?</span>{' '}
            Make sure you&apos;re signed in with the same email you used in the iOS app.
          </p>
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-1 text-aged-gold text-sm mt-2 hover:underline"
          >
            Sign in here
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </main>
  )
}
