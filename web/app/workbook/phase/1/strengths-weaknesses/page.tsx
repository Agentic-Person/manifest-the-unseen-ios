'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { WorksheetLayout } from '@/components/workbook/WorksheetLayout'
import { StrengthsWeaknessesEditor, StrengthsWeaknessesData } from '@/components/workbook/Phase1/StrengthsWeaknessesEditor'
import { useAuth } from '@/hooks/useAuth'
import { useAutoSave } from '@/hooks/useAutoSave'
import { supabase } from '@/lib/supabase'

const DEFAULT_DATA: StrengthsWeaknessesData = {
  strengths: [],
  weaknesses: [],
}

export default function StrengthsWeaknessesPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [data, setData] = useState<StrengthsWeaknessesData>(DEFAULT_DATA)
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
          .eq('worksheet_id', 'strengths-weaknesses')
          .eq('phase_number', 1)
          .single()

        if (error && error.code !== 'PGRST116') {
          // PGRST116 = not found, which is OK
          console.error('Error loading data:', error)
        } else if (existing?.data) {
          setData(existing.data as StrengthsWeaknessesData)
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
          worksheet_id: 'strengths-weaknesses',
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
      title="Strengths & Weaknesses"
      description="Identify your personal strengths (skills, talents, positive traits) and weaknesses (areas for improvement). This honest self-assessment is crucial for personal growth."
      saveStatus={status}
      lastSaved={lastSaved}
      onNext={() => router.push('/workbook/phase/1/comfort-zone')}
      onPrevious={() => router.push('/workbook/phase/1/abc-model')}
      previousLabel="Back to ABC Model"
      nextLabel="Continue to Comfort Zone"
    >
      <StrengthsWeaknessesEditor data={data} onChange={setData} />
    </WorksheetLayout>
  )
}
