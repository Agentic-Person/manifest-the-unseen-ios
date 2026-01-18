'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { WorksheetLayout } from '@/components/workbook/WorksheetLayout'
import { ComfortZoneEditor, ComfortZoneData } from '@/components/workbook/Phase1/ComfortZoneEditor'
import { useAuth } from '@/hooks/useAuth'
import { useAutoSave } from '@/hooks/useAutoSave'
import { supabase } from '@/lib/supabase'
import { getWorksheetImage } from '@/lib/worksheetImages'

const DEFAULT_DATA: ComfortZoneData = {
  comfortZone: [],
  stretchZone: [],
  panicZone: [],
}

export default function ComfortZonePage() {
  const router = useRouter()
  const { user } = useAuth()
  const [data, setData] = useState<ComfortZoneData>(DEFAULT_DATA)
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
          .eq('worksheet_id', 'comfort-zone')
          .eq('phase_number', 1)
          .single()

        if (error && error.code !== 'PGRST116') {
          // PGRST116 = not found, which is OK
          console.error('Error loading data:', error)
        } else if (existing?.data) {
          setData(existing.data as ComfortZoneData)
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
          worksheet_id: 'comfort-zone',
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
      title="Comfort Zone Map"
      description="Identify activities in your comfort, stretch, and panic zones. Understanding these zones helps you find opportunities for growth without overwhelming yourself."
      headerImage={getWorksheetImage('comfort-zone')}
      saveStatus={status}
      lastSaved={lastSaved}
      onNext={() => router.push('/workbook/phase/1/know-yourself')}
      onPrevious={() => router.push('/workbook/phase/1/strengths-weaknesses')}
      previousLabel="Strengths & Weaknesses"
      nextLabel="Know Yourself"
    >
      <ComfortZoneEditor data={data} onChange={setData} />
    </WorksheetLayout>
  )
}
