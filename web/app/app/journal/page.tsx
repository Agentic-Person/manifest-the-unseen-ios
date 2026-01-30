'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useSubscription } from '@/hooks/useSubscription'
import { useJournal } from '@/hooks/useJournal'
import { useJournalLimit } from '@/hooks/useJournalLimit'
import { JournalList } from '@/components/journal/JournalList'
import { JournalLimitBanner } from '@/components/journal/JournalLimitBanner'
import { JournalEntry } from '@/types/database'

export default function JournalPage() {
  const router = useRouter()
  const { user, loading: authLoading, signOut } = useAuth()
  const { tier, loading: subLoading } = useSubscription()
  const { canCreateEntry, loading: limitLoading } = useJournalLimit()

  const [searchQuery, setSearchQuery] = useState('')
  const [tagFilter, setTagFilter] = useState<string[]>([])

  const {
    entries,
    loading: entriesLoading,
    hasMore,
    loadMore,
  } = useJournal({
    pageSize: 20,
    searchQuery,
    tagFilter,
  })

  const handleEntryClick = useCallback((entry: JournalEntry) => {
    router.push(`/app/journal/${entry.id}`)
  }, [router])

  const handleNewEntry = () => {
    if (!canCreateEntry) {
      router.push('/pricing')
      return
    }
    router.push('/app/journal/new')
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  if (authLoading || subLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-deep-void">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-aged-gold mx-auto mb-4"></div>
          <p className="text-muted-wisdom">Loading your journal...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-deep-void">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-aged-gold mb-4">Please sign in</h1>
          <p className="text-muted-wisdom mb-6">You need to be signed in to access your journal.</p>
          <Link
            href="/auth/login"
            className="px-6 py-3 bg-aged-gold text-deep-void rounded-lg font-medium hover:bg-aged-gold/90 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-deep-void">
      {/* Header */}
      <header className="bg-temple-stone shadow-[0_4px_24px_rgba(0,0,0,0.4)] border-b border-[rgba(196,160,82,0.2)]">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/app"
              className="text-muted-wisdom hover:text-aged-gold transition-colors"
              title="Back to Dashboard"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-2xl font-bold text-aged-gold">
              Journal
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm text-muted-wisdom">{user?.email}</p>
              <p className="text-xs text-aged-gold font-medium">
                {tier ? `${tier} tier` : 'Free tier'}
              </p>
            </div>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 text-sm text-muted-wisdom bg-elevated border border-[rgba(196,160,82,0.2)] rounded-lg hover:bg-temple-stone hover:border-aged-gold transition-all duration-200"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Limit banner */}
        <JournalLimitBanner className="mb-6" />

        {/* New entry button */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-ancient-script">Your Entries</h2>
            <p className="text-sm text-muted-wisdom">
              Capture your thoughts, track your growth
            </p>
          </div>
          <button
            onClick={handleNewEntry}
            disabled={!canCreateEntry && !limitLoading}
            className={`
              flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium
              transition-all duration-200
              ${canCreateEntry || limitLoading
                ? 'bg-aged-gold text-deep-void hover:bg-aged-gold/90 shadow-[0_0_12px_rgba(196,160,82,0.3)]'
                : 'bg-elevated text-muted-wisdom/50 cursor-not-allowed border border-[rgba(196,160,82,0.2)]'
              }
            `}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Entry
          </button>
        </div>

        {/* Journal list */}
        <JournalList
          entries={entries}
          loading={entriesLoading}
          hasMore={hasMore}
          onLoadMore={loadMore}
          onEntryClick={handleEntryClick}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          tagFilter={tagFilter}
          onTagFilterChange={setTagFilter}
        />
      </main>
    </div>
  )
}
