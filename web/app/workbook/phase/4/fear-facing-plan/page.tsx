'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { WorksheetLayout } from '@/components/workbook/WorksheetLayout'
import { FearFacingPlanEditor, FearFacingPlanData } from '@/components/workbook/Phase4/FearFacingPlanEditor'
import { useAuth } from '@/hooks/useAuth'
import { useAutoSave } from '@/hooks/useAutoSave'
import { supabase } from '@/lib/supabase'

const DEFAULT_DATA: FearFacingPlanData = { actions: [] }

export default function FearFacingPlanPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [data, setData] = useState<FearFacingPlanData>(DEFAULT_DATA)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const loadData = async () => {
      try {
        const { data: existing, error } = await supabase.from('workbook_progress').select('data').eq('user_id', user.id).eq('worksheet_id', 'fear-facing-plan').eq('phase_number', 4).single()
        if (error && error.code !== 'PGRST116') console.error('Error loading data:', error)
        else if (existing?.data) setData(existing.data as FearFacingPlanData)
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
      const { error } = await supabase.from('workbook_progress').upsert({ user_id: user.id, worksheet_id: 'fear-facing-plan', phase_number: 4, data: currentData, updated_at: new Date().toISOString() }, { onConflict: 'user_id,worksheet_id' })
      if (error) throw error
    },
    delay: 30000,
    enabled: !loading && !!user,
  })

  if (loading) return (<div className="min-h-screen flex items-center justify-center"><div className="text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div><p className="text-gray-600">Loading worksheet...</p></div></div>)

  return (<WorksheetLayout title="Fear-Facing Action Plan" description="Create concrete action plans to face your fears with courage." saveStatus={status} lastSaved={lastSaved} onNext={() => router.push('/workbook/phase/5')} onPrevious={() => router.push('/workbook/phase/4/limiting-beliefs')}><FearFacingPlanEditor data={data} onChange={setData} /></WorksheetLayout>)
}
