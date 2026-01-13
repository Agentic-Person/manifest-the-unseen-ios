'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { WorksheetLayout } from '@/components/workbook/WorksheetLayout'
import { AbilitiesRatingEditor, AbilitiesRatingData } from '@/components/workbook/Phase1/AbilitiesRatingEditor'
import { useAuth } from '@/hooks/useAuth'
import { useAutoSave } from '@/hooks/useAutoSave'
import { supabase } from '@/lib/supabase'

const DEFAULT_DATA: AbilitiesRatingData = {
  abilities: [
    { name: 'Communication', rating: 5 },
    { name: 'Problem Solving', rating: 5 },
    { name: 'Leadership', rating: 5 },
    { name: 'Creativity', rating: 5 },
    { name: 'Technical Skills', rating: 5 },
    { name: 'Time Management', rating: 5 },
    { name: 'Emotional Intelligence', rating: 5 },
    { name: 'Physical Fitness', rating: 5 },
    { name: 'Financial Management', rating: 5 },
    { name: 'Learning Ability', rating: 5 },
    { name: 'Adaptability', rating: 5 },
    { name: 'Organization', rating: 5 },
  ],
}

export default function AbilitiesRatingPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [data, setData] = useState<AbilitiesRatingData>(DEFAULT_DATA)
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
          .eq('worksheet_id', 'abilities-rating')
          .eq('phase_number', 1)
          .single()

        if (error && error.code !== 'PGRST116') {
          // PGRST116 = not found, which is OK
          console.error('Error loading data:', error)
        } else if (existing?.data) {
          setData(existing.data as AbilitiesRatingData)
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
          worksheet_id: 'abilities-rating',
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
      title="Abilities Rating"
      description="Assess your current abilities across key areas that impact personal and professional success. Rate yourself honestly from 1-10 to identify strengths and growth opportunities."
      saveStatus={status}
      lastSaved={lastSaved}
      onNext={() => router.push('/workbook/phase/1/thought-awareness')}
      onPrevious={() => router.push('/workbook/phase/1/know-yourself')}
      previousLabel="Back to Know Yourself"
    >
      <AbilitiesRatingEditor data={data} onChange={setData} />
    </WorksheetLayout>
  )
}
