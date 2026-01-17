'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { WorksheetLayout } from '@/components/workbook/WorksheetLayout'
import { TrustAssessmentEditor, TrustAssessmentData } from '@/components/workbook/Phase9/TrustAssessmentEditor'
import { useAuth } from '@/hooks/useAuth'
import { useAutoSave } from '@/hooks/useAutoSave'
import { supabase } from '@/lib/supabase'

const DEFAULT_DATA: TrustAssessmentData = {
  trust_levels: {
    self: 5,
    universe: 5,
    process: 5,
    timing: 5,
  },
  reflections: {
    where_I_resist: '',
    where_I_control: '',
    what_I_fear_letting_go: '',
  },
}

export default function TrustAssessmentPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [data, setData] = useState<TrustAssessmentData>(DEFAULT_DATA)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const loadData = async () => {
      try {
        const { data: existing, error } = await supabase
          .from('workbook_progress')
          .select('data')
          .eq('user_id', user.id)
          .eq('worksheet_id', 'trust-assessment')
          .eq('phase_number', 9)
          .single()

        if (error && error.code !== 'PGRST116') {
          console.error('Error loading data:', error)
        } else if (existing?.data) {
          setData(existing.data as TrustAssessmentData)
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
          worksheet_id: 'trust-assessment',
          phase_number: 9,
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
      title="Trust Assessment"
      description="Assess your trust levels across key areas and explore what holds you back from deeper trust."
      saveStatus={status}
      lastSaved={lastSaved}
      onNext={() => router.push('/workbook/phase/9/surrender-practice')}
      onPrevious={() => router.push('/workbook/phase/8')}
    >
      <TrustAssessmentEditor data={data} onChange={setData} />
    </WorksheetLayout>
  )
}
