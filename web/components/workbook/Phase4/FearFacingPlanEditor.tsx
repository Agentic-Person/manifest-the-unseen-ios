'use client'

import { useState } from 'react'

export interface FearAction {
  id: string
  fear: string
  action: string
  support: string
  deadline: string
  completed: boolean
}

export interface FearFacingPlanData {
  actions: FearAction[]
}

export interface FearFacingPlanEditorProps {
  data: FearFacingPlanData
  onChange: (data: FearFacingPlanData) => void
  className?: string
}

export function FearFacingPlanEditor({ data, onChange, className = '' }: FearFacingPlanEditorProps) {
  const addAction = () => {
    const action: FearAction = {
      id: `action-${Date.now()}`,
      fear: '',
      action: '',
      support: '',
      deadline: '',
      completed: false,
    }
    onChange({ actions: [...data.actions, action] })
  }

  const updateAction = (id: string, updates: Partial<FearAction>) => {
    onChange({
      actions: data.actions.map(a => (a.id === id ? { ...a, ...updates } : a)),
    })
  }

  const removeAction = (id: string) => {
    onChange({ actions: data.actions.filter(a => a.id !== id) })
  }

  return (
    <div className={`space-y-8 ${className}`}>
      <div className="bg-elevated border border-[rgba(196,160,82,0.15)] rounded-lg p-4">
        <p className="text-sm text-muted-wisdom">
          Create concrete action plans to face your fears. Courage is not the absence of fear, but action despite it.
        </p>
      </div>

      {data.actions.length === 0 ? (
        <div className="text-center py-12 bg-elevated rounded-xl border-2 border-dashed border-[rgba(196,160,82,0.15)]">
          <button
            onClick={addAction}
            className="px-6 py-3 bg-gradient-primary text-white rounded-lg hover:brightness-110 shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
          >
            Create First Action Plan
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {data.actions.map((action, index) => (
            <div key={action.id} className={`bg-elevated rounded-xl border-2 p-6 shadow-[0_4px_24px_rgba(0,0,0,0.4)] ${action.completed ? 'border-green-500/30 bg-green-900/10' : 'border-[rgba(196,160,82,0.15)]'}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 bg-aged-gold text-temple-stone rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </span>
                  <h4 className="font-semibold text-enlightened">Fear-Facing Action Plan</h4>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateAction(action.id, { completed: !action.completed })}
                    className={`p-2 rounded ${action.completed ? 'text-green-500 hover:bg-green-900/20' : 'text-tertiary-text hover:bg-elevated'}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => removeAction(action.id)}
                    className="p-2 text-red-500 hover:bg-red-900/20 rounded"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-aged-gold">Fear to Face</label>
                  <input
                    type="text"
                    value={action.fear}
                    onChange={(e) => updateAction(action.id, { fear: e.target.value })}
                    placeholder="What fear will you face?"
                    className="w-full p-3 bg-[rgba(26,26,36,0.8)] border border-[rgba(196,160,82,0.15)] rounded-lg focus:outline-none focus:ring-2 focus:ring-aged-gold text-enlightened"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-aged-gold">Action Steps</label>
                  <textarea
                    value={action.action}
                    onChange={(e) => updateAction(action.id, { action: e.target.value })}
                    placeholder="What specific actions will you take?"
                    rows={3}
                    className="w-full p-3 bg-[rgba(26,26,36,0.8)] border border-[rgba(196,160,82,0.15)] rounded-lg focus:outline-none focus:ring-2 focus:ring-aged-gold text-enlightened"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-aged-gold">Support System</label>
                    <input
                      type="text"
                      value={action.support}
                      onChange={(e) => updateAction(action.id, { support: e.target.value })}
                      placeholder="Who can support you?"
                      className="w-full p-3 bg-[rgba(26,26,36,0.8)] border border-[rgba(196,160,82,0.15)] rounded-lg focus:outline-none focus:ring-2 focus:ring-aged-gold text-enlightened"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-aged-gold">Target Date</label>
                    <input
                      type="date"
                      value={action.deadline}
                      onChange={(e) => updateAction(action.id, { deadline: e.target.value })}
                      className="w-full p-3 bg-[rgba(26,26,36,0.8)] border border-[rgba(196,160,82,0.15)] rounded-lg focus:outline-none focus:ring-2 focus:ring-aged-gold text-enlightened"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={addAction}
            className="w-full py-3 border-2 border-aged-gold text-aged-gold rounded-lg hover:brightness-110"
          >
            + Add Another Plan
          </button>
        </div>
      )}
    </div>
  )
}
