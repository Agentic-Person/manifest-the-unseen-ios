'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { WorksheetLayout } from '@/components/workbook/WorksheetLayout'
import { FutureLetterEditor, FutureLetterData } from '@/components/workbook/Phase10/FutureLetterEditor'
import { useAuth } from '@/hooks/useAuth'
import { useAutoSave } from '@/hooks/useAutoSave'
import { supabase } from '@/lib/supabase'

const DEFAULT_DATA: FutureLetterData = {
  letter: {
    recipient: 'future_self',
    content: '',
    timeline: '',
    promises: [''],
  },
}

export default function FutureLetterPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [data, setData] = useState<FutureLetterData>(DEFAULT_DATA)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const loadData = async () => {
      try {
        const { data: existing, error } = await supabase
          .from('workbook_progress')
          .select('data')
          .eq('user_id', user.id)
          .eq('worksheet_id', 'future-letter')
          .eq('phase_number', 10)
          .single()

        if (error && error.code !== 'PGRST116') {
          console.error('Error loading data:', error)
        } else if (existing?.data) {
          setData(existing.data as FutureLetterData)
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
          worksheet_id: 'future-letter',
          phase_number: 10,
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
      title="Letter to Your Future Self"
      description="Write a heartfelt letter to your past or future self. Make promises and set intentions for what's to come."
      saveStatus={status}
      lastSaved={lastSaved}
      onNext={() => router.push('/workbook/phase/10/graduation')}
      onPrevious={() => router.push('/workbook/phase/10/journey-review')}
    >
      <FutureLetterEditor data={data} onChange={setData} />
    </WorksheetLayout>
  )
}
