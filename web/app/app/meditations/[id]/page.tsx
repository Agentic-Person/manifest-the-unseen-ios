'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useSubscription } from '@/hooks/useSubscription'
import { getMeditationById } from '@/hooks/useMeditations'
import { useMeditationSession } from '@/hooks/useMeditationSession'
import { canAccessMeditation } from '@/types/platform'
import { Meditation } from '@/types/database'
import { AudioPlayer } from '@/components/meditation/AudioPlayer'
import { UpgradeModal } from '@/components/meditation/UpgradeModal'

/**
 * Individual Meditation Player Page
 *
 * Full-screen player view for a single meditation.
 * Tracks session progress to the database.
 */
export default function MeditationPlayerPage() {
  const router = useRouter()
  const params = useParams()
  const meditationId = params.id as string

  const { user, loading: authLoading } = useAuth()
  const { tier, loading: subLoading } = useSubscription()
  const { startSession, updateSession, completeSession, endSession } = useMeditationSession()

  const [meditation, setMeditation] = useState<Meditation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  // Track session updates (throttle to every 10 seconds)
  const lastUpdateRef = useRef(0)

  // Fetch meditation data
  useEffect(() => {
    const fetchMeditation = async () => {
      if (!meditationId) return

      try {
        setLoading(true)
        setError(null)

        const data = await getMeditationById(meditationId)

        if (!data) {
          setError('Meditation not found')
          return
        }

        setMeditation(data)
      } catch (err) {
        console.error('Failed to fetch meditation:', err)
        setError('Failed to load meditation')
      } finally {
        setLoading(false)
      }
    }

    fetchMeditation()
  }, [meditationId])

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/auth/login?redirect=/app/meditations/${meditationId}`)
    }
  }, [authLoading, user, router, meditationId])

  // Check access and show upgrade modal if needed
  useEffect(() => {
    if (meditation && !subLoading) {
      const hasAccess = canAccessMeditation(tier, meditation.tier_required)
      if (!hasAccess) {
        setShowUpgradeModal(true)
      }
    }
  }, [meditation, tier, subLoading])

  // Clean up session on unmount
  useEffect(() => {
    return () => {
      endSession()
    }
  }, [endSession])

  /**
   * Handle play start - create session
   */
  const handlePlay = useCallback(async () => {
    if (!user || !meditation) return
    await startSession(meditation.id, user.id)
  }, [user, meditation, startSession])

  /**
   * Handle time update - update session duration (throttled)
   */
  const handleTimeUpdate = useCallback(
    (currentTime: number) => {
      const now = Date.now()
      // Throttle updates to every 10 seconds
      if (now - lastUpdateRef.current > 10000) {
        lastUpdateRef.current = now
        updateSession(currentTime)
      }
    },
    [updateSession]
  )

  /**
   * Handle meditation ended - mark session as complete
   */
  const handleEnded = useCallback(async () => {
    if (!meditation) return
    await completeSession(meditation.duration_seconds)
  }, [meditation, completeSession])

  /**
   * Handle upgrade modal close - redirect back if no access
   */
  const handleUpgradeModalClose = useCallback(() => {
    setShowUpgradeModal(false)
    // Redirect back to library if user doesn't have access
    if (meditation && !canAccessMeditation(tier, meditation.tier_required)) {
      router.push('/app/meditations')
    }
  }, [meditation, tier, router])

  // Loading state
  if (authLoading || subLoading || loading) {
    return (
      <div className="min-h-screen bg-deep-void flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <LoadingSpinner className="w-10 h-10 text-aged-gold" />
          <p className="text-muted-wisdom">Loading meditation...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !meditation) {
    return (
      <div className="min-h-screen bg-deep-void flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-temple-stone flex items-center justify-center">
            <ErrorIcon className="w-8 h-8 text-root-crimson" />
          </div>
          <h2 className="text-xl font-heading text-enlightened mb-2">
            {error || 'Meditation not found'}
          </h2>
          <p className="text-muted-wisdom mb-6">
            The meditation you're looking for doesn't exist or couldn't be loaded.
          </p>
          <Link
            href="/app/meditations"
            className="inline-flex items-center gap-2 px-4 py-2 bg-aged-gold text-deep-void rounded-lg hover:opacity-90 transition-opacity"
          >
            <BackIcon className="w-4 h-4" />
            Back to Library
          </Link>
        </div>
      </div>
    )
  }

  // Don't render if not authenticated (will redirect)
  if (!user) {
    return null
  }

  // Check access
  const hasAccess = canAccessMeditation(tier, meditation.tier_required)

  return (
    <div className="min-h-screen bg-deep-void flex flex-col">
      {/* Navigation header */}
      <header className="sticky top-0 z-40 bg-deep-void/95 backdrop-blur-sm border-b border-temple-stone">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Back link */}
            <Link
              href="/app/meditations"
              className="flex items-center gap-2 text-muted-wisdom hover:text-enlightened transition-colors"
            >
              <BackIcon className="w-5 h-5" />
              <span>Library</span>
            </Link>

            {/* Meditation info */}
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-aged-gold">
                {meditation.type || 'Meditation'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        {hasAccess ? (
          <AudioPlayer
            meditation={meditation}
            onPlay={handlePlay}
            onEnded={handleEnded}
            onTimeUpdate={handleTimeUpdate}
            className="w-full max-w-lg"
          />
        ) : (
          <div className="text-center">
            <LockIcon className="w-16 h-16 mx-auto mb-4 text-muted-wisdom" />
            <h2 className="text-xl font-heading text-enlightened mb-2">Content Locked</h2>
            <p className="text-muted-wisdom mb-6">
              Upgrade your subscription to access this meditation.
            </p>
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-aged-gold to-amber-glow text-deep-void font-medium rounded-lg hover:opacity-90 transition-opacity"
            >
              View Upgrade Options
            </button>
          </div>
        )}
      </main>

      {/* Upgrade modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={handleUpgradeModalClose}
        requiredTier={meditation.tier_required}
        featureName={`"${meditation.title}"`}
      />
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

function LockIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  )
}

function ErrorIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4M12 16h.01" />
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
