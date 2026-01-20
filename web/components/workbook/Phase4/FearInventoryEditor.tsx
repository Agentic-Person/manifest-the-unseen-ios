'use client'

import { useState } from 'react'
import { Slider } from '@/components/ui/Slider'

export interface Fear {
  id: string
  description: string
  intensity: number
}

export interface FearInventoryData {
  fears: Fear[]
}

export interface FearInventoryEditorProps {
  data: FearInventoryData
  onChange: (data: FearInventoryData) => void
  className?: string
}

export function FearInventoryEditor({ data, onChange, className = '' }: FearInventoryEditorProps) {
  const [newFear, setNewFear] = useState('')

  const addFear = () => {
    if (!newFear.trim()) return

    const fear: Fear = {
      id: `fear-${Date.now()}`,
      description: newFear.trim(),
      intensity: 5,
    }

    onChange({ fears: [...data.fears, fear] })
    setNewFear('')
  }

  const updateFear = (id: string, updates: Partial<Fear>) => {
    onChange({
      fears: data.fears.map(fear => (fear.id === id ? { ...fear, ...updates } : fear)),
    })
  }

  const removeFear = (id: string) => {
    onChange({ fears: data.fears.filter(fear => fear.id !== id) })
  }

  return (
    <div className={`space-y-8 ${className}`}>
      <div className="bg-elevated border border-[rgba(196,160,82,0.15)] rounded-lg p-4">
        <p className="text-sm text-muted-wisdom">
          Identify your fears and rate their intensity. Acknowledging fears is the first step to overcoming them.
        </p>
      </div>

      <div className="bg-elevated rounded-xl border-2 border-[rgba(196,160,82,0.15)] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
        <h3 className="text-lg font-semibold mb-4 text-enlightened">Add New Fear</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={newFear}
            onChange={(e) => setNewFear(e.target.value)}
            placeholder="What are you afraid of?"
            className="flex-1 p-3 bg-[rgba(26,26,36,0.8)] border border-[rgba(196,160,82,0.15)] rounded-lg focus:outline-none focus:ring-2 focus:ring-aged-gold text-enlightened"
            onKeyPress={(e) => e.key === 'Enter' && addFear()}
          />
          <button
            onClick={addFear}
            className="px-6 py-3 bg-aged-gold text-temple-stone rounded-lg hover:brightness-110 shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
          >
            Add
          </button>
        </div>
      </div>

      {data.fears.length === 0 ? (
        <div className="text-center py-12 bg-elevated rounded-xl border-2 border-dashed border-[rgba(196,160,82,0.15)]">
          <p className="text-tertiary-text">No fears listed yet. Be brave and name your first fear.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.fears.map((fear) => (
            <div key={fear.id} className="bg-elevated rounded-lg border-2 border-[rgba(196,160,82,0.15)] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
              <div className="flex justify-between items-start mb-4">
                <input
                  type="text"
                  value={fear.description}
                  onChange={(e) => updateFear(fear.id, { description: e.target.value })}
                  className="flex-1 text-lg font-medium border-b-2 border-transparent hover:border-aged-gold/50 focus:border-aged-gold focus:outline-none px-2 py-1 bg-transparent text-enlightened"
                />
                <button
                  onClick={() => removeFear(fear.id)}
                  className="p-2 text-red-500 hover:bg-red-900/20 rounded"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <Slider
                value={fear.intensity}
                onChange={(val) => updateFear(fear.id, { intensity: val })}
                label="Intensity Level"
                min={1}
                max={10}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
