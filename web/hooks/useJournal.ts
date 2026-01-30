'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'
import { JournalEntry, MoodValue } from '@/types/database'

export interface CreateJournalEntryInput {
  content: string
  mood?: MoodValue | null
  tags?: string[]
}

export interface UpdateJournalEntryInput {
  content?: string
  mood?: MoodValue | null
  tags?: string[]
}

export interface UseJournalOptions {
  pageSize?: number
  searchQuery?: string
  tagFilter?: string[]
}

export interface UseJournalReturn {
  entries: JournalEntry[]
  loading: boolean
  error: Error | null
  hasMore: boolean
  loadMore: () => Promise<void>
  refresh: () => Promise<void>
  createEntry: (input: CreateJournalEntryInput) => Promise<JournalEntry | null>
  updateEntry: (id: string, input: UpdateJournalEntryInput) => Promise<JournalEntry | null>
  deleteEntry: (id: string) => Promise<boolean>
  getEntry: (id: string) => Promise<JournalEntry | null>
}

/**
 * useJournal hook provides CRUD operations for journal entries.
 * Supports pagination, search, and tag filtering.
 *
 * @example
 * ```tsx
 * const { entries, loading, createEntry, loadMore } = useJournal({
 *   pageSize: 10,
 *   searchQuery: 'gratitude',
 * })
 * ```
 */
export function useJournal(options: UseJournalOptions = {}): UseJournalReturn {
  const { pageSize = 20, searchQuery, tagFilter } = options
  const { user } = useAuth()

  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [offset, setOffset] = useState(0)

  /**
   * Fetch journal entries with pagination and filters
   */
  const fetchEntries = useCallback(async (reset: boolean = false) => {
    if (!user) {
      setEntries([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const currentOffset = reset ? 0 : offset

      let query = supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .range(currentOffset, currentOffset + pageSize - 1)

      // Apply search filter
      if (searchQuery && searchQuery.trim()) {
        query = query.ilike('content', `%${searchQuery.trim()}%`)
      }

      // Apply tag filter
      if (tagFilter && tagFilter.length > 0) {
        query = query.contains('tags', tagFilter)
      }

      const { data, error: queryError } = await query

      if (queryError) throw queryError

      const fetchedEntries = (data || []) as JournalEntry[]

      if (reset) {
        setEntries(fetchedEntries)
        setOffset(pageSize)
      } else {
        setEntries(prev => [...prev, ...fetchedEntries])
        setOffset(prev => prev + pageSize)
      }

      setHasMore(fetchedEntries.length === pageSize)
    } catch (err) {
      console.error('Error fetching journal entries:', err)
      setError(err instanceof Error ? err : new Error('Failed to fetch entries'))
    } finally {
      setLoading(false)
    }
  }, [user, offset, pageSize, searchQuery, tagFilter])

  /**
   * Load more entries (pagination)
   */
  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return
    await fetchEntries(false)
  }, [fetchEntries, hasMore, loading])

  /**
   * Refresh entries (reset pagination)
   */
  const refresh = useCallback(async () => {
    setOffset(0)
    setHasMore(true)
    await fetchEntries(true)
  }, [fetchEntries])

  /**
   * Create a new journal entry
   */
  const createEntry = useCallback(async (input: CreateJournalEntryInput): Promise<JournalEntry | null> => {
    if (!user) {
      setError(new Error('Must be logged in to create entries'))
      return null
    }

    try {
      setError(null)

      const { data, error: insertError } = await supabase
        .from('journal_entries')
        .insert({
          user_id: user.id,
          content: input.content,
          mood: input.mood || null,
          tags: input.tags || [],
        })
        .select()
        .single()

      if (insertError) throw insertError

      const newEntry = data as JournalEntry

      // Add to beginning of entries list
      setEntries(prev => [newEntry, ...prev])

      return newEntry
    } catch (err) {
      console.error('Error creating journal entry:', err)
      setError(err instanceof Error ? err : new Error('Failed to create entry'))
      return null
    }
  }, [user])

  /**
   * Update an existing journal entry
   */
  const updateEntry = useCallback(async (
    id: string,
    input: UpdateJournalEntryInput
  ): Promise<JournalEntry | null> => {
    if (!user) {
      setError(new Error('Must be logged in to update entries'))
      return null
    }

    try {
      setError(null)

      const updateData: Record<string, unknown> = {
        updated_at: new Date().toISOString(),
      }

      if (input.content !== undefined) {
        updateData.content = input.content
      }
      if (input.mood !== undefined) {
        updateData.mood = input.mood
      }
      if (input.tags !== undefined) {
        updateData.tags = input.tags
      }

      const { data, error: updateError } = await supabase
        .from('journal_entries')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single()

      if (updateError) throw updateError

      const updatedEntry = data as JournalEntry

      // Update in entries list
      setEntries(prev => prev.map(entry =>
        entry.id === id ? updatedEntry : entry
      ))

      return updatedEntry
    } catch (err) {
      console.error('Error updating journal entry:', err)
      setError(err instanceof Error ? err : new Error('Failed to update entry'))
      return null
    }
  }, [user])

  /**
   * Delete a journal entry
   */
  const deleteEntry = useCallback(async (id: string): Promise<boolean> => {
    if (!user) {
      setError(new Error('Must be logged in to delete entries'))
      return false
    }

    try {
      setError(null)

      const { error: deleteError } = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (deleteError) throw deleteError

      // Remove from entries list
      setEntries(prev => prev.filter(entry => entry.id !== id))

      return true
    } catch (err) {
      console.error('Error deleting journal entry:', err)
      setError(err instanceof Error ? err : new Error('Failed to delete entry'))
      return false
    }
  }, [user])

  /**
   * Get a single entry by ID
   */
  const getEntry = useCallback(async (id: string): Promise<JournalEntry | null> => {
    if (!user) {
      return null
    }

    try {
      const { data, error: queryError } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single()

      if (queryError) {
        if (queryError.code === 'PGRST116') {
          // Entry not found
          return null
        }
        throw queryError
      }

      return data as JournalEntry
    } catch (err) {
      console.error('Error fetching journal entry:', err)
      return null
    }
  }, [user])

  // Initial fetch
  useEffect(() => {
    fetchEntries(true)
  }, [user, searchQuery, tagFilter])

  return {
    entries,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
    createEntry,
    updateEntry,
    deleteEntry,
    getEntry,
  }
}
