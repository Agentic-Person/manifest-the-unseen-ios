'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { WorksheetLayout } from '@/components/workbook/WorksheetLayout'
import { ABCModelEditor, ABCModelData } from '@/components/workbook/Phase1/ABCModelEditor'
import { useAuth } from '@/hooks/useAuth'
import { useAutoSave } from '@/hooks/useAutoSave'
import { supabase } from '@/lib/supabase'

const DEFAULT_DATA: ABCModelData = {
  activatingEvent: '',
  belief: '',
  consequence: '',
}

export default function ABCModelPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [data, setData] = useState<ABCModelData>(DEFAULT_DATA)
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
          .eq('worksheet_id', 'abc-model')
          .eq('phase_number', 1)
          .single()

        if (error && error.code !== 'PGRST116') {
          // PGRST116 = not found, which is OK
          console.error('Error loading data:', error)
        } else if (existing?.data) {
          setData(existing.data as ABCModelData)
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
          worksheet_id: 'abc-model',
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
      title="ABC Model"
      description="Understand how your thoughts shape your emotions and behaviors. Use this cognitive behavioral tool to analyze your patterns and create positive change."
      saveStatus={status}
      lastSaved={lastSaved}
      onNext={() => router.push('/workbook/phase/1/strengths-weaknesses')}
      onPrevious={() => router.push('/workbook/phase/1/values-assessment')}
      previousLabel="Previous Worksheet"
    >
      <ABCModelEditor data={data} onChange={setData} />
    </WorksheetLayout>
  )
}
