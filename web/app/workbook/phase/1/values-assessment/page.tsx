'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { WorksheetLayout } from '@/components/workbook/WorksheetLayout'
import { ValuesEditor, ValuesData } from '@/components/workbook/Phase1/ValuesEditor'
import { useAuth } from '@/hooks/useAuth'
import { useAutoSave } from '@/hooks/useAutoSave'
import { supabase } from '@/lib/supabase'
import { getWorksheetImage } from '@/lib/worksheetImages'

const DEFAULT_DATA: ValuesData = {
  values: [], // Will be populated with defaults in the editor
}

export default function ValuesAssessmentPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [data, setData] = useState<ValuesData>(DEFAULT_DATA)
  const [loading, setLoading] = useState(true)

  // Load existing data on mount
  useEffect(() => {
    if (!user) return

    const loadData = async () => {
      try {
        const { data: existing, error } = await supabase
          .from('workbook_progress')
          .select('data')
          .eq('user_id', user.id)
          .eq('worksheet_id', 'values-assessment')
          .eq('phase_number', 1)
          .single()

        if (error && error.code !== 'PGRST116') {
          // PGRST116 = not found, which is OK
          console.error('Error loading data:', error)
        } else if (existing?.data) {
          setData(existing.data as ValuesData)
        }
      } catch (err) {
        console.error('Unexpected error loading data:', err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [user])

  // Auto-save functionality
  const { status, lastSaved } = useAutoSave({
    data,
    onSave: async (currentData) => {
      if (!user) throw new Error('User not authenticated')

      const { error } = await supabase
        .from('workbook_progress')
        .upsert({
          user_id: user.id,
          worksheet_id: 'values-assessment',
          phase_number: 1,
          data: currentData,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,worksheet_id',
        })

      if (error) throw error
    },
    delay: 30000, // 30 seconds
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
      title="Values Assessment"
      description="Identify and rank your core personal values. Understanding what matters most to you is essential for setting aligned goals and making authentic decisions."
      headerImage={getWorksheetImage('values-assessment')}
      saveStatus={status}
      lastSaved={lastSaved}
      onNext={() => router.push('/workbook/phase/1/abc-model')}
      onPrevious={() => router.push('/workbook/phase/1/habits-audit')}
      previousLabel="Back to Habits Audit"
      nextLabel="Continue to ABC Model"
    >
      <ValuesEditor data={data} onChange={setData} />
    </WorksheetLayout>
  )
}
