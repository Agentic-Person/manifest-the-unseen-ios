'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { WorksheetLayout } from '@/components/workbook/WorksheetLayout'
import { RoleModelsEditor, RoleModelsData } from '@/components/workbook/Phase8/RoleModelsEditor'
import { useAuth } from '@/hooks/useAuth'
import { useAutoSave } from '@/hooks/useAutoSave'
import { supabase } from '@/lib/supabase'
import { getWorksheetImage } from '@/lib/worksheetImages'

const DEFAULT_DATA: RoleModelsData = {
  models: [],
}

export default function RoleModelsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [data, setData] = useState<RoleModelsData>(DEFAULT_DATA)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const loadData = async () => {
      try {
        const { data: existing, error } = await supabase
          .from('workbook_progress')
          .select('data')
          .eq('user_id', user.id)
          .eq('worksheet_id', 'role-models')
          .eq('phase_number', 8)
          .single()

        if (error && error.code !== 'PGRST116') {
          console.error('Error loading data:', error)
        } else if (existing?.data) {
          setData(existing.data as RoleModelsData)
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
          worksheet_id: 'role-models',
          phase_number: 8,
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
      title="Role Models"
      description="Identify inspiring role models and extract actionable lessons. Study the qualities you admire and how to apply them."
      headerImage={getWorksheetImage('role-models')}
      saveStatus={status}
      lastSaved={lastSaved}
      onNext={() => router.push('/workbook')}
      onPrevious={() => router.push('/workbook/phase/8/inspiration-reframe')}
      nextLabel="Complete Phase 8"
    >
      <RoleModelsEditor data={data} onChange={setData} />
    </WorksheetLayout>
  )
}
