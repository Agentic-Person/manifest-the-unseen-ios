'use client'

import { useCallback, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { MeditationSession } from '@/types/database'

export interface UseMeditationSessionReturn {
  session: MeditationSession | null
  isTracking: boolean
  error: Error | null
  startSession: (meditationId: string, userId: string) => Promise<MeditationSession | null>
  updateSession: (durationSeconds: number) => Promise<void>
  completeSession: (durationSeconds: number) => Promise<void>
  endSession: () => void
}

/**
 * useMeditationSession hook tracks meditation sessions to the database.
 * Creates a session when playback starts and marks it complete when finished.
 *
 * @example
 * ```tsx
 * const { startSession, completeSession, isTracking } = useMeditationSession()
 *
 * const handlePlay = async () => {
 *   if (!isTracking) {
 *     await startSession(meditation.id, user.id)
 *   }
 *   player.play()
 * }
 *
 * const handleEnded = async () => {
 *   await completeSession(player.duration)
 * }
 * ```
 */
export function useMeditationSession(): UseMeditationSessionReturn {
  const [session, setSession] = useState<MeditationSession | null>(null)
  const [isTracking, setIsTracking] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // Track session ID for updates
  const sessionIdRef = useRef<string | null>(null)

  /**
   * Start a new meditation session
   */
  const startSession = useCallback(
    async (meditationId: string, userId: string): Promise<MeditationSession | null> => {
      // Don't create duplicate sessions
      if (isTracking && sessionIdRef.current) {
        return session
      }

      try {
        setError(null)

        const newSession = {
          user_id: userId,
          meditation_id: meditationId,
          completed: false,
          duration_seconds: 0,
        }

        const { data, error: insertError } = await supabase
          .from('meditation_sessions')
          .insert(newSession)
          .select()
          .single()

        if (insertError) throw insertError

        const createdSession = data as MeditationSession
        sessionIdRef.current = createdSession.id
        setSession(createdSession)
        setIsTracking(true)

        return createdSession
      } catch (err) {
        console.error('Failed to start meditation session:', err)
        setError(err instanceof Error ? err : new Error('Failed to start session'))
        return null
      }
    },
    [isTracking, session]
  )

  /**
   * Update session duration (call periodically during playback)
   */
  const updateSession = useCallback(async (durationSeconds: number) => {
    const sessionId = sessionIdRef.current
    if (!sessionId) return

    try {
      const { error: updateError } = await supabase
        .from('meditation_sessions')
        .update({ duration_seconds: Math.floor(durationSeconds) })
        .eq('id', sessionId)

      if (updateError) throw updateError

      setSession((prev) =>
        prev
          ? {
              ...prev,
              duration_seconds: Math.floor(durationSeconds),
            }
          : null
      )
    } catch (err) {
      console.error('Failed to update session duration:', err)
      // Don't set error state for updates - non-critical
    }
  }, [])

  /**
   * Mark session as completed
   */
  const completeSession = useCallback(async (durationSeconds: number) => {
    const sessionId = sessionIdRef.current
    if (!sessionId) return

    try {
      const { data, error: updateError } = await supabase
        .from('meditation_sessions')
        .update({
          completed: true,
          duration_seconds: Math.floor(durationSeconds),
          completed_at: new Date().toISOString(),
        })
        .eq('id', sessionId)
        .select()
        .single()

      if (updateError) throw updateError

      const completedSession = data as MeditationSession
      setSession(completedSession)
      setIsTracking(false)
      sessionIdRef.current = null
    } catch (err) {
      console.error('Failed to complete session:', err)
      setError(err instanceof Error ? err : new Error('Failed to complete session'))
    }
  }, [])

  /**
   * End session without marking as complete (user navigated away)
   */
  const endSession = useCallback(() => {
    sessionIdRef.current = null
    setSession(null)
    setIsTracking(false)
  }, [])

  return {
    session,
    isTracking,
    error,
    startSession,
    updateSession,
    completeSession,
    endSession,
  }
}

/**
 * Fetch meditation sessions for a user
 */
export async function getUserMeditationSessions(
  userId: string,
  limit = 50
): Promise<MeditationSession[]> {
  try {
    const { data, error } = await supabase
      .from('meditation_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error

    return data as MeditationSession[]
  } catch (err) {
    console.error('Failed to fetch meditation sessions:', err)
    return []
  }
}

/**
 * Get user's meditation stats
 */
export async function getMeditationStats(
  userId: string
): Promise<{
  totalSessions: number
  completedSessions: number
  totalMinutes: number
}> {
  try {
    const { data, error } = await supabase
      .from('meditation_sessions')
      .select('completed, duration_seconds')
      .eq('user_id', userId)

    if (error) throw error

    const sessions = data as Pick<MeditationSession, 'completed' | 'duration_seconds'>[]

    const totalSessions = sessions.length
    const completedSessions = sessions.filter((s) => s.completed).length
    const totalSeconds = sessions.reduce((sum, s) => sum + (s.duration_seconds || 0), 0)
    const totalMinutes = Math.round(totalSeconds / 60)

    return { totalSessions, completedSessions, totalMinutes }
  } catch (err) {
    console.error('Failed to fetch meditation stats:', err)
    return { totalSessions: 0, completedSessions: 0, totalMinutes: 0 }
  }
}
