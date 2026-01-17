'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { WorksheetLayout } from '@/components/workbook/WorksheetLayout'
import { LimitingBeliefsEditor, LimitingBeliefsData } from '@/components/workbook/Phase4/LimitingBeliefsEditor'
import { useAuth } from '@/hooks/useAuth'
import { useAutoSave } from '@/hooks/useAutoSave'
import { supabase } from '@/lib/supabase'

const DEFAULT_DATA: LimitingBeliefsData = { beliefs: [] }

export default function LimitingBeliefsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [data, setData] = useState<LimitingBeliefsData>(DEFAULT_DATA)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const loadData = async () => {
      try {
        const { data: existing, error } = await supabase.from('workbook_progress').select('data').eq('user_id', user.id).eq('worksheet_id', 'limiting-beliefs').eq('phase_number', 4).single()
        if (error && error.code !== 'PGRST116') console.error('Error loading data:', error)
        else if (existing?.data) setData(existing.data as LimitingBeliefsData)
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
      const { error } = await supabase.from('workbook_progress').upsert({ user_id: user.id, worksheet_id: 'limiting-beliefs', phase_number: 4, data: currentData, updated_at: new Date().toISOString() }, { onConflict: 'user_id,worksheet_id' })
      if (error) throw error
    },
    delay: 30000,
    enabled: !loading && !!user,
  })

  if (loading) return (<div className="min-h-screen flex items-center justify-center"><div className="text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div><p className="text-gray-600">Loading worksheet...</p></div></div>)

  return (<WorksheetLayout title="Limiting Beliefs" description="Identify limiting beliefs and reframe them into empowering truths." saveStatus={status} lastSaved={lastSaved} onNext={() => router.push('/workbook/phase/4/fear-facing-plan')} onPrevious={() => router.push('/workbook/phase/4/fear-inventory')}><LimitingBeliefsEditor data={data} onChange={setData} /></WorksheetLayout>)
}
