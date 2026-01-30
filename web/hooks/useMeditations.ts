'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import { Meditation } from '@/types/database'
import { SubscriptionTier } from '@/types/subscription'
import { canAccessMeditation } from '@/types/platform'

export type MeditationType = 'all' | 'guided' | 'breathing' | 'music' | 'prayer'

export interface UseMeditationsReturn {
  meditations: Meditation[]
  filteredMeditations: Meditation[]
  loading: boolean
  error: Error | null
  filter: MeditationType
  setFilter: (filter: MeditationType) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  canAccess: (meditation: Meditation) => boolean
  refresh: () => Promise<void>
}

/**
 * useMeditations hook fetches and filters meditations from Supabase.
 * Provides filtering by type and search functionality.
 *
 * @param userTier - Current user's subscription tier for access checks
 *
 * @example
 * ```tsx
 * const { filteredMeditations, filter, setFilter, canAccess, loading } = useMeditations('awakening')
 *
 * if (loading) return <Spinner />
 *
 * return (
 *   <div>
 *     <Tabs value={filter} onChange={setFilter}>...</Tabs>
 *     {filteredMeditations.map(med => (
 *       <MeditationCard
 *         key={med.id}
 *         meditation={med}
 *         locked={!canAccess(med)}
 *       />
 *     ))}
 *   </div>
 * )
 * ```
 */
export function useMeditations(userTier: SubscriptionTier | null): UseMeditationsReturn {
  const [meditations, setMeditations] = useState<Meditation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [filter, setFilter] = useState<MeditationType>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const fetchMeditations = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: queryError } = await supabase
        .from('meditations')
        .select('*')
        .order('order_index', { ascending: true })

      if (queryError) throw queryError

      setMeditations(data as Meditation[])
    } catch (err) {
      console.error('Failed to fetch meditations:', err)
      setError(err instanceof Error ? err : new Error('Failed to fetch meditations'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMeditations()
  }, [fetchMeditations])

  /**
   * Check if user can access a meditation based on their tier
   */
  const canAccess = useCallback(
    (meditation: Meditation): boolean => {
      return canAccessMeditation(userTier, meditation.tier_required)
    },
    [userTier]
  )

  /**
   * Filter meditations by type and search query
   */
  const filteredMeditations = useMemo(() => {
    let filtered = meditations

    // Filter by type
    if (filter !== 'all') {
      filtered = filtered.filter((med) => med.type === filter)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter(
        (med) =>
          med.title.toLowerCase().includes(query) ||
          (med.description?.toLowerCase().includes(query) ?? false) ||
          med.tags.some((tag) => tag.toLowerCase().includes(query))
      )
    }

    return filtered
  }, [meditations, filter, searchQuery])

  return {
    meditations,
    filteredMeditations,
    loading,
    error,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    canAccess,
    refresh: fetchMeditations,
  }
}

/**
 * Fetch a single meditation by ID
 */
export async function getMeditationById(id: string): Promise<Meditation | null> {
  try {
    const { data, error } = await supabase
      .from('meditations')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error

    return data as Meditation
  } catch (err) {
    console.error('Failed to fetch meditation:', err)
    return null
  }
}
