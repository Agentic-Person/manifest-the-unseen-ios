'use client'

import { useState } from 'react'

export interface BeliefPair {
  id: string
  belief: string
  reframe: string
}

export interface LimitingBeliefsData {
  beliefs: BeliefPair[]
}

export interface LimitingBeliefsEditorProps {
  data: LimitingBeliefsData
  onChange: (data: LimitingBeliefsData) => void
  className?: string
}

export function LimitingBeliefsEditor({ data, onChange, className = '' }: LimitingBeliefsEditorProps) {
  const addBelief = () => {
    const belief: BeliefPair = {
      id: `belief-${Date.now()}`,
      belief: '',
      reframe: '',
    }
    onChange({ beliefs: [...data.beliefs, belief] })
  }

  const updateBelief = (id: string, updates: Partial<BeliefPair>) => {
    onChange({
      beliefs: data.beliefs.map(b => (b.id === id ? { ...b, ...updates } : b)),
    })
  }

  const removeBelief = (id: string) => {
    onChange({ beliefs: data.beliefs.filter(b => b.id !== id) })
  }

  return (
    <div className={`space-y-8 ${className}`}>
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-sm text-red-800">
          Identify limiting beliefs and reframe them into empowering truths. Transform "I can't" into "I can learn."
        </p>
      </div>

      {data.beliefs.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <button
            onClick={addBelief}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Add First Belief
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {data.beliefs.map((pair) => (
            <div key={pair.id} className="bg-white rounded-xl border-2 border-red-200 p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold text-gray-900">Belief Reframing</h4>
                <button
                  onClick={() => removeBelief(pair.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-red-900 mb-2">
                    Limiting Belief
                  </label>
                  <textarea
                    value={pair.belief}
                    onChange={(e) => updateBelief(pair.id, { belief: e.target.value })}
                    placeholder="e.g., I&apos;m not smart enough to succeed"
                    rows={2}
                    className="w-full p-3 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div className="flex justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>

                <div>
                  <label className="block text-sm font-medium text-green-900 mb-2">
                    Empowering Reframe
                  </label>
                  <textarea
                    value={pair.reframe}
                    onChange={(e) => updateBelief(pair.id, { reframe: e.target.value })}
                    placeholder="e.g., I am capable of learning and growing every day"
                    rows={2}
                    className="w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={addBelief}
            className="w-full py-3 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-50"
          >
            + Add Another Belief
          </button>
        </div>
      )}
    </div>
  )
}
