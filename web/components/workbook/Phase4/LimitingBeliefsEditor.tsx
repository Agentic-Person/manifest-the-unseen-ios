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
      <div className="bg-elevated border border-[rgba(196,160,82,0.15)] rounded-lg p-4">
        <p className="text-sm text-muted-wisdom">
          Identify limiting beliefs and reframe them into empowering truths. Transform "I can't" into "I can learn."
        </p>
      </div>

      {data.beliefs.length === 0 ? (
        <div className="text-center py-12 bg-elevated rounded-xl border-2 border-dashed border-[rgba(196,160,82,0.15)]">
          <button
            onClick={addBelief}
            className="px-6 py-3 bg-aged-gold text-temple-stone rounded-lg hover:brightness-110 shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
          >
            Add First Belief
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {data.beliefs.map((pair) => (
            <div key={pair.id} className="bg-elevated rounded-xl border-2 border-[rgba(196,160,82,0.15)] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold text-enlightened">Belief Reframing</h4>
                <button
                  onClick={() => removeBelief(pair.id)}
                  className="p-2 text-red-500 hover:bg-red-900/20 rounded"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-red-400 mb-2">
                    Limiting Belief
                  </label>
                  <textarea
                    value={pair.belief}
                    onChange={(e) => updateBelief(pair.id, { belief: e.target.value })}
                    placeholder="e.g., I&apos;m not smart enough to succeed"
                    rows={2}
                    className="w-full p-3 bg-[rgba(26,26,36,0.8)] border border-red-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-enlightened"
                  />
                </div>

                <div className="flex justify-center">
                  <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>

                <div>
                  <label className="block text-sm font-medium text-green-400 mb-2">
                    Empowering Reframe
                  </label>
                  <textarea
                    value={pair.reframe}
                    onChange={(e) => updateBelief(pair.id, { reframe: e.target.value })}
                    placeholder="e.g., I am capable of learning and growing every day"
                    rows={2}
                    className="w-full p-3 bg-[rgba(26,26,36,0.8)] border border-green-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-enlightened"
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={addBelief}
            className="w-full py-3 border-2 border-aged-gold text-aged-gold rounded-lg hover:brightness-110"
          >
            + Add Another Belief
          </button>
        </div>
      )}
    </div>
  )
}
