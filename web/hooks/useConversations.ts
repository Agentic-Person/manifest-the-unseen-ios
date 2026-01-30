'use client'

import { useState, useEffect, useCallback } from 'react'
import type { GuruConversation } from '@/types/guru'
import { fetchGuruConversations, deleteGuruConversation } from '@/lib/guruService'
import { useAuth } from './useAuth'

export interface UseConversationsReturn {
  conversations: GuruConversation[]
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  filterByPhase: (phaseNumber: number | null) => void
  selectedPhaseFilter: number | null
  deleteConversation: (id: string) => Promise<boolean>
}

/**
 * useConversations manages the list of Guru conversations
 *
 * @example
 * ```tsx
 * const { conversations, filterByPhase, loading } = useConversations()
 *
 * // Filter to Phase 1 conversations
 * filterByPhase(1)
 * ```
 */
export function useConversations(): UseConversationsReturn {
  const { user } = useAuth()
  const [conversations, setConversations] = useState<GuruConversation[]>([])
  const [allConversations, setAllConversations] = useState<GuruConversation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPhaseFilter, setSelectedPhaseFilter] = useState<number | null>(null)

  /**
   * Fetch conversations from the server
   */
  const fetchConversations = useCallback(async () => {
    if (!user) {
      setConversations([])
      setAllConversations([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const result = await fetchGuruConversations()

      if (result.success) {
        setAllConversations(result.data)
        // Apply current filter
        if (selectedPhaseFilter) {
          setConversations(
            result.data.filter((c) => c.guru_phase === selectedPhaseFilter)
          )
        } else {
          setConversations(result.data)
        }
      } else {
        setError(result.error.error)
      }
    } catch (err) {
      console.error('Error fetching conversations:', err)
      setError('Failed to load conversations')
    } finally {
      setLoading(false)
    }
  }, [user, selectedPhaseFilter])

  // Fetch on mount and when user changes
  useEffect(() => {
    fetchConversations()
  }, [user])

  /**
   * Filter conversations by phase number
   */
  const filterByPhase = useCallback(
    (phaseNumber: number | null) => {
      setSelectedPhaseFilter(phaseNumber)
      if (phaseNumber === null) {
        setConversations(allConversations)
      } else {
        setConversations(
          allConversations.filter((c) => c.guru_phase === phaseNumber)
        )
      }
    },
    [allConversations]
  )

  /**
   * Refresh conversations list
   */
  const refresh = useCallback(async () => {
    await fetchConversations()
  }, [fetchConversations])

  /**
   * Delete a conversation
   */
  const deleteConversationHandler = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        const result = await deleteGuruConversation(id)

        if (result.success) {
          // Remove from local state
          setAllConversations((prev) => prev.filter((c) => c.id !== id))
          setConversations((prev) => prev.filter((c) => c.id !== id))
          return true
        } else {
          setError(result.error.error)
          return false
        }
      } catch (err) {
        console.error('Error deleting conversation:', err)
        setError('Failed to delete conversation')
        return false
      }
    },
    []
  )

  return {
    conversations,
    loading,
    error,
    refresh,
    filterByPhase,
    selectedPhaseFilter,
    deleteConversation: deleteConversationHandler,
  }
}
