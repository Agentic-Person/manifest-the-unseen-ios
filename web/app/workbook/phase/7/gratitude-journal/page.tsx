'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { WorksheetLayout } from '@/components/workbook/WorksheetLayout'
import { GratitudeJournalEditor, GratitudeJournalData } from '@/components/workbook/Phase7/GratitudeJournalEditor'
import { useAuth } from '@/hooks/useAuth'
import { useAutoSave } from '@/hooks/useAutoSave'
import { supabase } from '@/lib/supabase'

const DEFAULT_DATA: GratitudeJournalData = {
  entries: {},
}

export default function GratitudeJournalPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [data, setData] = useState<GratitudeJournalData>(DEFAULT_DATA)
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
          .eq('worksheet_id', 'gratitude-journal')
          .eq('phase_number', 7)
          .single()

        if (error && error.code !== 'PGRST116') {
          console.error('Error loading data:', error)
        } else if (existing?.data) {
          setData(existing.data as GratitudeJournalData)
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
          worksheet_id: 'gratitude-journal',
          phase_number: 7,
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
      title="Gratitude Journal"
      description="Practice daily gratitude by recording 3-5 things you're grateful for each day. Build a powerful habit for increased happiness and well-being."
      saveStatus={status}
      lastSaved={lastSaved}
      onNext={() => router.push('/workbook/phase/7/gratitude-letters')}
      onPrevious={() => router.push('/workbook/phase/6')}
    >
      <GratitudeJournalEditor data={data} onChange={setData} />
    </WorksheetLayout>
  )
}
