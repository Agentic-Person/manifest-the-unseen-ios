import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'
import { WORKBOOK_PHASES, PHASE_WORKSHEETS, getTotalWorksheets, WorkbookPhase } from '@manifest/shared'

interface PhaseProgress {
  phaseNumber: number
  completedWorksheets: number
  totalWorksheets: number
  percentComplete: number
}

interface WorkbookProgressData {
  phases: PhaseProgress[]
  overallCompleted: number
  overallTotal: number
  overallPercent: number
  loading: boolean
  error: Error | null
}

export function useWorkbookProgress(): WorkbookProgressData {
  const { user } = useAuth()
  const [phases, setPhases] = useState<PhaseProgress[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchProgress = async () => {
    if (!user) {
      setPhases([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Single query to fetch all progress records
      const { data: progressRecords, error: queryError } = await supabase
        .from('workbook_progress')
        .select('phase_number, worksheet_id, completed')
        .eq('user_id', user.id)

      if (queryError) throw queryError

      // Calculate progress per phase
      const phaseProgress = WORKBOOK_PHASES.map((phase: WorkbookPhase) => {
        const phaseWorksheets = PHASE_WORKSHEETS[phase.id]
        const completedInPhase = progressRecords?.filter(
          record => record.phase_number === phase.id && record.completed
        ).length ?? 0

        return {
          phaseNumber: phase.id,
          completedWorksheets: completedInPhase,
          totalWorksheets: phaseWorksheets.length,
          percentComplete: phaseWorksheets.length > 0
            ? Math.round((completedInPhase / phaseWorksheets.length) * 100)
            : 0
        }
      })

      setPhases(phaseProgress)
    } catch (err) {
      console.error('Error fetching workbook progress:', err)
      setError(err instanceof Error ? err : new Error('Failed to fetch progress'))
      setPhases([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProgress()
  }, [user])

  // Real-time subscription to workbook_progress changes
  useEffect(() => {
    if (!user) return

    const channel = supabase
      .channel(`workbook-progress-${user.id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'workbook_progress',
        filter: `user_id=eq.${user.id}`
      }, () => {
        setTimeout(() => fetchProgress(), 500) // Debounce refetch
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])

  // Calculate overall stats
  const overallCompleted = phases.reduce((sum, p) => sum + p.completedWorksheets, 0)
  const overallTotal = getTotalWorksheets()
  const overallPercent = overallTotal > 0
    ? Math.round((overallCompleted / overallTotal) * 100)
    : 0

  return {
    phases,
    overallCompleted,
    overallTotal,
    overallPercent,
    loading,
    error
  }
}
