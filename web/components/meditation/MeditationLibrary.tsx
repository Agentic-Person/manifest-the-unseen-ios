'use client'

import { useState, useCallback } from 'react'
import { Meditation } from '@/types/database'
import { SubscriptionTier } from '@/types/subscription'
import { useMeditations, MeditationType } from '@/hooks/useMeditations'
import { MeditationCard } from './MeditationCard'
import { UpgradeModal } from './UpgradeModal'

export interface MeditationLibraryProps {
  userTier: SubscriptionTier | null
  className?: string
}

/**
 * MeditationLibrary component displays a filterable grid of meditations.
 * Includes tab filtering by type and search functionality.
 *
 * @example
 * ```tsx
 * <MeditationLibrary userTier={subscription.tier} />
 * ```
 */
export function MeditationLibrary({ userTier, className = '' }: MeditationLibraryProps) {
  const {
    filteredMeditations,
    loading,
    error,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    canAccess,
  } = useMeditations(userTier)

  const [lockedMeditation, setLockedMeditation] = useState<Meditation | null>(null)

  const handleLockedClick = useCallback((meditation: Meditation) => {
    setLockedMeditation(meditation)
  }, [])

  const handleCloseModal = useCallback(() => {
    setLockedMeditation(null)
  }, [])

  // Filter tabs
  const tabs: { id: MeditationType; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'guided', label: 'Guided' },
    { id: 'breathing', label: 'Breathing' },
    { id: 'music', label: 'Music' },
    { id: 'prayer', label: 'Prayer' },
  ]

  return (
    <div className={className}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-heading text-3xl text-enlightened mb-2">Meditations</h1>
        <p className="text-muted-wisdom">
          Explore guided meditations, breathing exercises, and prayers to deepen your practice.
        </p>
      </div>

      {/* Search and filters */}
      <div className="mb-6 space-y-4">
        {/* Search input */}
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-wisdom" />
          <input
            type="text"
            placeholder="Search meditations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-temple-stone border border-temple-stone rounded-lg text-enlightened placeholder-muted-wisdom focus:outline-none focus:border-aged-gold/50 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-wisdom hover:text-enlightened transition-colors"
              aria-label="Clear search"
            >
              <CloseIcon className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === tab.id
                  ? 'bg-aged-gold text-deep-void'
                  : 'bg-temple-stone text-muted-wisdom hover:text-enlightened hover:bg-elevated'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner className="w-8 h-8 text-aged-gold" />
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="p-4 bg-root-crimson/20 border border-root-crimson/50 rounded-lg text-enlightened">
          <p>Failed to load meditations. Please try again.</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && filteredMeditations.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-temple-stone flex items-center justify-center">
            <SearchIcon className="w-8 h-8 text-muted-wisdom" />
          </div>
          <h3 className="text-lg font-heading text-enlightened mb-2">No meditations found</h3>
          <p className="text-muted-wisdom">
            {searchQuery
              ? 'Try adjusting your search terms'
              : 'No meditations available in this category'}
          </p>
        </div>
      )}

      {/* Meditation grid */}
      {!loading && !error && filteredMeditations.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMeditations.map((meditation) => (
            <MeditationCard
              key={meditation.id}
              meditation={meditation}
              isLocked={!canAccess(meditation)}
              onLockedClick={handleLockedClick}
            />
          ))}
        </div>
      )}

      {/* Upgrade modal */}
      {lockedMeditation && (
        <UpgradeModal
          isOpen={true}
          onClose={handleCloseModal}
          requiredTier={lockedMeditation.tier_required}
          featureName={`"${lockedMeditation.title}"`}
        />
      )}
    </div>
  )
}

// Icon components
function SearchIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  )
}

function CloseIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
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
