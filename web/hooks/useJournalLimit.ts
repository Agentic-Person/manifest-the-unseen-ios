'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'
import { useSubscription } from './useSubscription'
import {
  getMonthRange,
  getJournalLimitInfo,
  JournalLimitInfo,
} from '@/lib/shared/journalLimits'

export interface UseJournalLimitReturn {
  limitInfo: JournalLimitInfo
  loading: boolean
  error: Error | null
  refresh: () => Promise<void>
  canCreateEntry: boolean
}

/**
 * useJournalLimit hook tracks monthly journal entry usage against tier limits.
 *
 * @example
 * ```tsx
 * const { limitInfo, canCreateEntry, loading } = useJournalLimit()
 *
 * if (!canCreateEntry) {
 *   return <UpgradePrompt remaining={limitInfo.remainingEntries} />
 * }
 * ```
 */
export function useJournalLimit(): UseJournalLimitReturn {
  const { user } = useAuth()
  const { tier, loading: subLoading } = useSubscription()

  const [entriesUsed, setEntriesUsed] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  /**
   * Fetch the count of entries created this month
   */
  const fetchEntriesCount = useCallback(async () => {
    if (!user) {
      setEntriesUsed(0)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const { start, end } = getMonthRange()

      const { count, error: countError } = await supabase
        .from('journal_entries')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', start)
        .lte('created_at', end)

      if (countError) throw countError

      setEntriesUsed(count || 0)
    } catch (err) {
      console.error('Error fetching journal count:', err)
      setError(err instanceof Error ? err : new Error('Failed to fetch journal count'))
    } finally {
      setLoading(false)
    }
  }, [user])

  // Initial fetch and re-fetch when user changes
  useEffect(() => {
    fetchEntriesCount()
  }, [user])

  // Set up real-time subscription for journal entries
  useEffect(() => {
    if (!user) return

    const channel = supabase
      .channel(`journal-count-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all changes (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'journal_entries',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          // Re-fetch count when entries change
          fetchEntriesCount()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, fetchEntriesCount])

  const limitInfo = getJournalLimitInfo(tier, entriesUsed)

  return {
    limitInfo,
    loading: loading || subLoading,
    error,
    refresh: fetchEntriesCount,
    canCreateEntry: !limitInfo.hasReachedLimit,
  }
}
