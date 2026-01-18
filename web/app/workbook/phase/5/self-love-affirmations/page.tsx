'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { WorksheetLayout } from '@/components/workbook/WorksheetLayout'
import { SelfLoveAffirmationsEditor, SelfLoveAffirmationsData } from '@/components/workbook/Phase5/SelfLoveAffirmationsEditor'
import { useAuth } from '@/hooks/useAuth'
import { useAutoSave } from '@/hooks/useAutoSave'
import { supabase } from '@/lib/supabase'
import { getWorksheetImage } from '@/lib/worksheetImages'

const DEFAULT_DATA: SelfLoveAffirmationsData = { affirmations: [] }
{ activities: [] }

export default function Page() {
  const router = useRouter()
  const { user } = useAuth()
  const [data, setData] = useState<SelfLoveAffirmationsData>(DEFAULT_DATA)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const loadData = async () => {
      try {
        const { data: existing, error } = await supabase.from('workbook_progress').select('data').eq('user_id', user.id).eq('worksheet_id', 'self-love-affirmations').eq('phase_number', 5).single()
        if (error && error.code !== 'PGRST116') console.error('Error:', error)
        else if (existing?.data) setData(existing.data as SelfLoveAffirmationsData)
      } finally { setLoading(false) }
    }
    loadData()
  }, [user])

  const { status, lastSaved } = useAutoSave({
    data,
    onSave: async (currentData) => {
      if (!user) throw new Error('Not authenticated')
      const { error } = await supabase.from('workbook_progress').upsert({ user_id: user.id, worksheet_id: 'self-love-affirmations', phase_number: 5, data: currentData, updated_at: new Date().toISOString() }, { onConflict: 'user_id,worksheet_id' })
      if (error) throw error
    },
    delay: 30000,
    enabled: !loading && !!user,
  })

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div></div>

  return (
    <WorksheetLayout
      title="Self Love Affirmations"
      headerImage={getWorksheetImage('self-love-affirmations')}
      saveStatus={status}
      lastSaved={lastSaved}
      onNext={() => router.push('/workbook/phase/5/self-care-routine')}
      onPrevious={() => router.push('/workbook/phase/5')}
    >
      <SelfLoveAffirmationsEditor data={data} onChange={setData} />
    </WorksheetLayout>
  )
}
