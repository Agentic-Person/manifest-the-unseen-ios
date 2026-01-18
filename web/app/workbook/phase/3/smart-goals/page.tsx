'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { WorksheetLayout } from '@/components/workbook/WorksheetLayout'
import { SMARTGoalEditor, SMARTGoalData } from '@/components/workbook/Phase3/SMARTGoalEditor'
import { useAuth } from '@/hooks/useAuth'
import { useAutoSave } from '@/hooks/useAutoSave'
import { supabase } from '@/lib/supabase'
import { getWorksheetImage } from '@/lib/worksheetImages'

const DEFAULT_DATA: SMARTGoalData = {
  goals: [],
}

export default function SMARTGoalsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [data, setData] = useState<SMARTGoalData>(DEFAULT_DATA)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const loadData = async () => {
      try {
        const { data: existing, error } = await supabase
          .from('workbook_progress')
          .select('data')
          .eq('user_id', user.id)
          .eq('worksheet_id', 'smart-goals')
          .eq('phase_number', 3)
          .single()

        if (error && error.code !== 'PGRST116') {
          console.error('Error loading data:', error)
        } else if (existing?.data) {
          setData(existing.data as SMARTGoalData)
        }
      } catch (err) {
        console.error('Unexpected error loading data:', err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [user])

  const { status, lastSaved } = useAutoSave({
    data,
    onSave: async (currentData) => {
      if (!user) throw new Error('User not authenticated')

      const { error } = await supabase
        .from('workbook_progress')
        .upsert({
          user_id: user.id,
          worksheet_id: 'smart-goals',
          phase_number: 3,
          data: currentData,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,worksheet_id',
        })

      if (error) throw error
    },
    delay: 30000,
    enabled: !loading && !!user,
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading worksheet...</p>
        </div>
      </div>
    )
  }

  return (
    <WorksheetLayout
      title="SMART Goals"
      description="Create specific, measurable, achievable, relevant, and time-bound goals that transform your vision into reality."
      headerImage={getWorksheetImage('smart-goals')}
      saveStatus={status}
      lastSaved={lastSaved}
      onNext={() => router.push('/workbook/phase/3/timeline')}
      onPrevious={() => router.push('/workbook/phase/3')}
      previousLabel="Back to Phase 3"
    >
      <SMARTGoalEditor data={data} onChange={setData} />
    </WorksheetLayout>
  )
}
