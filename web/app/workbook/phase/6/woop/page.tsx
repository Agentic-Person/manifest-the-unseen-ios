'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { WorksheetLayout } from '@/components/workbook/WorksheetLayout'
import { WOOPEditor, WOOPData } from '@/components/workbook/Phase6/WOOPEditor'
import { useAuth } from '@/hooks/useAuth'
import { useAutoSave } from '@/hooks/useAutoSave'
import { supabase } from '@/lib/supabase'

const DEFAULT_DATA: WOOPData = {
  wish: '',
  outcome: '',
  obstacle: '',
  plan: '',
}

export default function WOOPPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [data, setData] = useState<WOOPData>(DEFAULT_DATA)
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
          .eq('worksheet_id', 'woop')
          .eq('phase_number', 6)
          .single()

        if (error && error.code !== 'PGRST116') {
          console.error('Error loading data:', error)
        } else if (existing?.data) {
          setData(existing.data as WOOPData)
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
          worksheet_id: 'woop',
          phase_number: 6,
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
      title="WOOP Method"
      description="Wish, Outcome, Obstacle, Plan - A proven mental strategy for achieving your goals."
      saveStatus={status}
      lastSaved={lastSaved}
      onNext={() => router.push('/workbook/phase/6/scripting')}
      onPrevious={() => router.push('/workbook/phase/6/three-six-nine')}
    >
      <WOOPEditor data={data} onChange={setData} />
    </WorksheetLayout>
  )
}
