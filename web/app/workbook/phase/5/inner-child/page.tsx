'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { WorksheetLayout } from '@/components/workbook/WorksheetLayout'
import { InnerChildEditor, InnerChildData } from '@/components/workbook/Phase5/InnerChildEditor'
import { useAuth } from '@/hooks/useAuth'
import { useAutoSave } from '@/hooks/useAutoSave'
import { supabase } from '@/lib/supabase'
import { getWorksheetImage } from '@/lib/worksheetImages'

const DEFAULT_DATA: InnerChildData = { memories: '', needs: '', message: '', healing: '' }

export default function Page() {
  const router = useRouter()
  const { user } = useAuth()
  const [data, setData] = useState<InnerChildData>(DEFAULT_DATA)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const loadData = async () => {
      try {
        const { data: existing, error } = await supabase.from('workbook_progress').select('data').eq('user_id', user.id).eq('worksheet_id', 'inner-child').eq('phase_number', 5).single()
        if (error && error.code !== 'PGRST116') console.error('Error:', error)
        else if (existing?.data) setData(existing.data as InnerChildData)
      } finally { setLoading(false) }
    }
    loadData()
  }, [user])

  const { status, lastSaved } = useAutoSave({
    data,
    onSave: async (currentData) => {
      if (!user) throw new Error('Not authenticated')
      const { error } = await supabase.from('workbook_progress').upsert({ user_id: user.id, worksheet_id: 'inner-child', phase_number: 5, data: currentData, updated_at: new Date().toISOString() }, { onConflict: 'user_id,worksheet_id' })
      if (error) throw error
    },
    delay: 30000,
    enabled: !loading && !!user,
  })

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div></div>

  return (
    <WorksheetLayout
      title="Inner Child"
      headerImage={getWorksheetImage('inner-child')}
      saveStatus={status}
      lastSaved={lastSaved}
      onNext={() => router.push('/workbook')}
      onPrevious={() => router.push('/workbook/phase/5/self-care-routine')}
      nextLabel="Complete Phase 5"
    >
      <InnerChildEditor data={data} onChange={setData} />
    </WorksheetLayout>
  )
}
