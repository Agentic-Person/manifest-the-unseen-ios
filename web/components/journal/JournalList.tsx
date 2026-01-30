'use client'

import { useState, useMemo, useEffect } from 'react'
import { JournalEntry, formatDate } from '@/types/database'
import { JournalCard } from './JournalCard'

export interface JournalListProps {
  entries: JournalEntry[]
  loading?: boolean
  hasMore?: boolean
  onLoadMore?: () => void
  onEntryClick?: (entry: JournalEntry) => void
  searchQuery?: string
  onSearchChange?: (query: string) => void
  tagFilter?: string[]
  onTagFilterChange?: (tags: string[]) => void
  availableTags?: string[]
  className?: string
}

/**
 * Group entries by date for display
 */
function groupEntriesByDate(entries: JournalEntry[]): Map<string, JournalEntry[]> {
  const groups = new Map<string, JournalEntry[]>()

  entries.forEach((entry) => {
    const date = new Date(entry.created_at)
    const dateKey = date.toISOString().split('T')[0] // YYYY-MM-DD

    if (!groups.has(dateKey)) {
      groups.set(dateKey, [])
    }
    groups.get(dateKey)!.push(entry)
  })

  return groups
}

/**
 * Format date key to display string
 */
function formatDateHeader(dateKey: string): string {
  const date = new Date(dateKey + 'T00:00:00')
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const dateOnlyToday = today.toISOString().split('T')[0]
  const dateOnlyYesterday = yesterday.toISOString().split('T')[0]

  if (dateKey === dateOnlyToday) {
    return 'Today'
  }
  if (dateKey === dateOnlyYesterday) {
    return 'Yesterday'
  }

  return formatDate(dateKey)
}

/**
 * JournalList component displays a list of journal entries grouped by date.
 * Supports search, tag filtering, and infinite scroll.
 *
 * @example
 * ```tsx
 * <JournalList
 *   entries={entries}
 *   loading={loading}
 *   hasMore={hasMore}
 *   onLoadMore={loadMore}
 *   onEntryClick={(entry) => router.push(`/app/journal/${entry.id}`)}
 * />
 * ```
 */
export function JournalList({
  entries,
  loading = false,
  hasMore = false,
  onLoadMore,
  onEntryClick,
  searchQuery = '',
  onSearchChange,
  tagFilter = [],
  onTagFilterChange,
  availableTags = [],
  className = '',
}: JournalListProps) {
  const [localSearch, setLocalSearch] = useState(searchQuery)
  const [showTagFilter, setShowTagFilter] = useState(false)

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onSearchChange && localSearch !== searchQuery) {
        onSearchChange(localSearch)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [localSearch, searchQuery, onSearchChange])

  // Group entries by date
  const groupedEntries = useMemo(() => groupEntriesByDate(entries), [entries])

  // Get sorted date keys (most recent first)
  const sortedDates = useMemo(
    () => Array.from(groupedEntries.keys()).sort((a, b) => b.localeCompare(a)),
    [groupedEntries]
  )

  // Extract all unique tags from entries for filter suggestions
  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    entries.forEach((entry) => {
      entry.tags?.forEach((tag) => tagSet.add(tag))
    })
    return Array.from(tagSet).sort()
  }, [entries])

  const displayTags = availableTags.length > 0 ? availableTags : allTags

  const toggleTagFilter = (tag: string) => {
    if (!onTagFilterChange) return

    if (tagFilter.includes(tag)) {
      onTagFilterChange(tagFilter.filter((t) => t !== tag))
    } else {
      onTagFilterChange([...tagFilter, tag])
    }
  }

  const clearFilters = () => {
    setLocalSearch('')
    onSearchChange?.('')
    onTagFilterChange?.([])
  }

  const hasFilters = searchQuery || tagFilter.length > 0

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search and Filter Bar */}
      <div className="space-y-3">
        {/* Search input */}
        <div className="relative">
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search your journal..."
            className="
              w-full px-4 py-2.5 pl-10 rounded-lg
              bg-elevated border border-[rgba(196,160,82,0.2)]
              text-ancient-script placeholder-muted-wisdom/50
              focus:border-aged-gold focus:ring-1 focus:ring-aged-gold/30
              transition-all duration-200
            "
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-wisdom/50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {localSearch && (
            <button
              type="button"
              onClick={() => {
                setLocalSearch('')
                onSearchChange?.('')
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-wisdom/50 hover:text-aged-gold"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Tag filter toggle */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowTagFilter(!showTagFilter)}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg
              border transition-all duration-200
              ${showTagFilter || tagFilter.length > 0
                ? 'bg-aged-gold/20 border-aged-gold text-aged-gold'
                : 'bg-elevated border-[rgba(196,160,82,0.2)] text-muted-wisdom hover:border-aged-gold/50'
              }
            `}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            Filter by tags
            {tagFilter.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs bg-aged-gold text-deep-void rounded-full">
                {tagFilter.length}
              </span>
            )}
          </button>

          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-sm text-muted-wisdom/60 hover:text-aged-gold transition-colors"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Tag filter panel */}
        {showTagFilter && displayTags.length > 0 && (
          <div className="p-3 bg-elevated border border-[rgba(196,160,82,0.2)] rounded-lg">
            <div className="flex flex-wrap gap-1.5">
              {displayTags.map((tag) => {
                const isSelected = tagFilter.includes(tag)
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTagFilter(tag)}
                    className={`
                      px-2 py-1 text-xs rounded
                      border transition-all duration-150
                      ${isSelected
                        ? 'bg-aged-gold/20 text-aged-gold border-aged-gold'
                        : 'bg-temple-stone text-muted-wisdom border-[rgba(196,160,82,0.2)] hover:border-aged-gold/50'
                      }
                    `}
                  >
                    #{tag}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Results count */}
      {entries.length > 0 && (
        <p className="text-sm text-muted-wisdom/60">
          {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
          {hasFilters && ' found'}
        </p>
      )}

      {/* Entries grouped by date */}
      {sortedDates.length > 0 ? (
        <div className="space-y-6">
          {sortedDates.map((dateKey) => (
            <div key={dateKey}>
              <h3 className="text-sm font-medium text-aged-gold mb-3">
                {formatDateHeader(dateKey)}
              </h3>
              <div className="space-y-3">
                {groupedEntries.get(dateKey)!.map((entry) => (
                  <JournalCard
                    key={entry.id}
                    entry={entry}
                    onClick={onEntryClick}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        !loading && (
          <div className="text-center py-12">
            <svg
              className="w-16 h-16 mx-auto mb-4 text-muted-wisdom/30"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <p className="text-muted-wisdom">
              {hasFilters
                ? 'No entries match your search'
                : 'No journal entries yet'}
            </p>
            {!hasFilters && (
              <p className="text-sm text-muted-wisdom/60 mt-1">
                Start writing to capture your thoughts and manifest your dreams
              </p>
            )}
          </div>
        )
      )}

      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-aged-gold"></div>
        </div>
      )}

      {/* Load more button */}
      {!loading && hasMore && onLoadMore && (
        <div className="text-center pt-4">
          <button
            type="button"
            onClick={onLoadMore}
            className="
              px-6 py-2 text-sm font-medium
              bg-elevated border border-[rgba(196,160,82,0.2)]
              text-muted-wisdom rounded-lg
              hover:border-aged-gold/50 hover:text-aged-gold
              transition-all duration-200
            "
          >
            Load more entries
          </button>
        </div>
      )}
    </div>
  )
}
