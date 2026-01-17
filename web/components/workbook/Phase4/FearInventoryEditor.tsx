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
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <p className="text-sm text-orange-800">
          Identify your fears and rate their intensity. Acknowledging fears is the first step to overcoming them.
        </p>
      </div>

      <div className="bg-white rounded-xl border-2 border-orange-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Add New Fear</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={newFear}
            onChange={(e) => setNewFear(e.target.value)}
            placeholder="What are you afraid of?"
            className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            onKeyPress={(e) => e.key === 'Enter' && addFear()}
          />
          <button
            onClick={addFear}
            className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            Add
          </button>
        </div>
      </div>

      {data.fears.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <p className="text-gray-500">No fears listed yet. Be brave and name your first fear.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.fears.map((fear) => (
            <div key={fear.id} className="bg-white rounded-lg border-2 border-orange-100 p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <input
                  type="text"
                  value={fear.description}
                  onChange={(e) => updateFear(fear.id, { description: e.target.value })}
                  className="flex-1 text-lg font-medium border-b-2 border-transparent hover:border-orange-300 focus:border-orange-500 focus:outline-none px-2 py-1"
                />
                <button
                  onClick={() => removeFear(fear.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
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
