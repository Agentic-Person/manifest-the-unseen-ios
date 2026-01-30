'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useSubscription } from '@/hooks/useSubscription'
import { MeditationLibrary } from '@/components/meditation/MeditationLibrary'
import Link from 'next/link'

/**
 * Meditation Library Page
 *
 * Displays a filterable grid of all available meditations.
 * Requires authentication and respects subscription tier for content access.
 */
export default function MeditationsPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { tier, loading: subLoading } = useSubscription()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login?redirect=/app/meditations')
    }
  }, [authLoading, user, router])

  // Show loading state
  if (authLoading || subLoading) {
    return (
      <div className="min-h-screen bg-deep-void flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <LoadingSpinner className="w-10 h-10 text-aged-gold" />
          <p className="text-muted-wisdom">Loading meditations...</p>
        </div>
      </div>
    )
  }

  // Don't render if not authenticated (will redirect)
  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-deep-void">
      {/* Navigation header */}
      <header className="sticky top-0 z-40 bg-deep-void/95 backdrop-blur-sm border-b border-temple-stone">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Back link */}
            <Link
              href="/app"
              className="flex items-center gap-2 text-muted-wisdom hover:text-enlightened transition-colors"
            >
              <BackIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Back to App</span>
            </Link>

            {/* User info */}
            <div className="flex items-center gap-4">
              {tier && (
                <span className="text-xs px-2 py-1 rounded-full bg-aged-gold/20 text-aged-gold border border-aged-gold/30">
                  {tier.charAt(0).toUpperCase() + tier.slice(1)}
                </span>
              )}
              <span className="text-sm text-muted-wisdom">{user.email}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <MeditationLibrary userTier={tier} />
      </main>
    </div>
  )
}

// Icon components
function BackIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  )
}

function LoadingSpinner({ className = '' }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none">
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
