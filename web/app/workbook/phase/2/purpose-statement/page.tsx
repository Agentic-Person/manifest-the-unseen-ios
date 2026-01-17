'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { WorksheetLayout } from '@/components/workbook/WorksheetLayout'
import { PurposeStatementEditor, PurposeStatementData } from '@/components/workbook/Phase2/PurposeStatementEditor'
import { useAuth } from '@/hooks/useAuth'
import { useAutoSave } from '@/hooks/useAutoSave'
import { supabase } from '@/lib/supabase'

const DEFAULT_DATA: PurposeStatementData = {
  statement: '',
}

export default function PurposeStatementPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [data, setData] = useState<PurposeStatementData>(DEFAULT_DATA)
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
          .eq('worksheet_id', 'purpose-statement')
          .eq('phase_number', 2)
          .single()

        if (error && error.code !== 'PGRST116') {
          console.error('Error loading data:', error)
        } else if (existing?.data) {
          setData(existing.data as PurposeStatementData)
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
          worksheet_id: 'purpose-statement',
          phase_number: 2,
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
      title="Purpose Statement"
      description="Distill your life mission into a concise, actionable purpose statement that you can reference daily."
      saveStatus={status}
      lastSaved={lastSaved}
      onNext={() => router.push('/workbook/phase/3')}
      onPrevious={() => router.push('/workbook/phase/2/life-mission')}
    >
      <PurposeStatementEditor data={data} onChange={setData} />
    </WorksheetLayout>
  )
}
