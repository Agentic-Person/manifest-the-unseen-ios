'use client'

import { useState } from 'react'
import { CardList } from '@/components/ui/CardList'

export interface StrengthsWeaknessesData {
  strengths: string[]
  weaknesses: string[]
}

export interface StrengthsWeaknessesEditorProps {
  data: StrengthsWeaknessesData
  onChange: (data: StrengthsWeaknessesData) => void
  className?: string
}

interface ListItem {
  id: string
  text: string
}

/**
 * Strengths & Weaknesses Editor - Two-column layout for identifying strengths and weaknesses.
 *
 * Helps users identify their personal strengths (skills, talents, traits) and weaknesses
 * (areas for improvement) as part of self-evaluation in Phase 1.
 *
 * @example
 * ```tsx
 * <StrengthsWeaknessesEditor
 *   data={data}
 *   onChange={(newData) => setData(newData)}
 * />
 * ```
 */
export function StrengthsWeaknessesEditor({ data, onChange, className = '' }: StrengthsWeaknessesEditorProps) {
  const [strengthInput, setStrengthInput] = useState('')
  const [weaknessInput, setWeaknessInput] = useState('')
  const [showStrengthInput, setShowStrengthInput] = useState(false)
  const [showWeaknessInput, setShowWeaknessInput] = useState(false)

  // Convert arrays to item objects for CardList
  const strengthItems: ListItem[] = data.strengths.map((text, index) => ({
    id: `strength-${index}`,
    text,
  }))

  const weaknessItems: ListItem[] = data.weaknesses.map((text, index) => ({
    id: `weakness-${index}`,
    text,
  }))

  const handleAddStrength = () => {
    if (strengthInput.trim()) {
      onChange({
        ...data,
        strengths: [...data.strengths, strengthInput.trim()],
      })
      setStrengthInput('')
      setShowStrengthInput(false)
    }
  }

  const handleRemoveStrength = (id: string) => {
    const index = parseInt(id.replace('strength-', ''))
    const newStrengths = data.strengths.filter((_, i) => i !== index)
    onChange({ ...data, strengths: newStrengths })
  }

  const handleAddWeakness = () => {
    if (weaknessInput.trim()) {
      onChange({
        ...data,
        weaknesses: [...data.weaknesses, weaknessInput.trim()],
      })
      setWeaknessInput('')
      setShowWeaknessInput(false)
    }
  }

  const handleRemoveWeakness = (id: string) => {
    const index = parseInt(id.replace('weakness-', ''))
    const newWeaknesses = data.weaknesses.filter((_, i) => i !== index)
    onChange({ ...data, weaknesses: newWeaknesses })
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Summary Count */}
      <div className="bg-gradient-to-r from-[rgba(45,90,74,0.1)] to-orange-50 rounded-xl p-6 border border-[rgba(196,160,82,0.15)]">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-3xl font-bold text-heart-emerald">{data.strengths.length}</p>
            <p className="text-sm text-muted-wisdom mt-1">Strengths</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-deep-amber">{data.weaknesses.length}</p>
            <p className="text-sm text-muted-wisdom mt-1">Weaknesses</p>
          </div>
        </div>
      </div>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b-2 border-green-500">
            <svg
              className="w-6 h-6 text-heart-emerald"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-enlightened">Strengths</h3>
          </div>
          <p className="text-sm text-muted-wisdom">
            What are you naturally good at? What skills, talents, or positive traits do you possess?
          </p>

          {/* Strength Items */}
          <div className="space-y-2">
            {strengthItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 bg-[rgba(45,90,74,0.1)] rounded-lg border border-heart-emerald shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
              >
                <div className="flex-1 text-enlightened">{item.text}</div>
                <button
                  type="button"
                  onClick={() => handleRemoveStrength(item.id)}
                  className="flex-shrink-0 text-burgundy hover:text-burgundy hover:brightness-110 hover:bg-[rgba(107,45,61,0.2)] p-2 rounded-md transition-colors"
                  aria-label={`Remove strength ${item.id}`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  <span className="sr-only">Remove</span>
                </button>
              </div>
            ))}

            {/* Empty State */}
            {strengthItems.length === 0 && (
              <div className="text-center py-8 text-tertiary-text bg-elevated rounded-lg border-2 border-dashed border-[rgba(196,160,82,0.15)]">
                No strengths added yet. Click below to add one!
              </div>
            )}
          </div>

          {/* Add Input */}
          {showStrengthInput ? (
            <div className="space-y-2">
              <input
                type="text"
                value={strengthInput}
                onChange={(e) => setStrengthInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddStrength()
                  if (e.key === 'Escape') {
                    setShowStrengthInput(false)
                    setStrengthInput('')
                  }
                }}
                placeholder="e.g., Good communicator, Creative problem solver..."
                className="w-full px-4 py-3 border border-[rgba(196,160,82,0.15)] rounded-lg focus:ring-2 focus:ring-heart-emerald focus:border-heart-emerald"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleAddStrength}
                  className="flex-1 py-2 px-4 bg-heart-emerald text-white rounded-lg hover:brightness-110 transition-colors font-medium"
                >
                  Add Strength
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowStrengthInput(false)
                    setStrengthInput('')
                  }}
                  className="px-4 py-2 bg-elevated text-muted-wisdom rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowStrengthInput(true)}
              className="w-full py-3 px-4 bg-heart-emerald text-white rounded-lg hover:brightness-110 transition-colors font-medium shadow-sm hover:shadow-[0_4px_24px_rgba(0,0,0,0.4)] focus:outline-none focus:ring-2 focus:ring-heart-emerald focus:ring-offset-0"
            >
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Strength
              </span>
            </button>
          )}
        </div>

        {/* Weaknesses Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b-2 border-orange-500">
            <svg
              className="w-6 h-6 text-deep-amber"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-enlightened">Weaknesses</h3>
          </div>
          <p className="text-sm text-muted-wisdom">
            What areas could you improve? What skills or traits hold you back?
          </p>

          {/* Weakness Items */}
          <div className="space-y-2">
            {weaknessItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 bg-[rgba(139,105,20,0.1)] rounded-lg border border-deep-amber shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
              >
                <div className="flex-1 text-enlightened">{item.text}</div>
                <button
                  type="button"
                  onClick={() => handleRemoveWeakness(item.id)}
                  className="flex-shrink-0 text-burgundy hover:text-burgundy hover:brightness-110 hover:bg-[rgba(107,45,61,0.2)] p-2 rounded-md transition-colors"
                  aria-label={`Remove weakness ${item.id}`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  <span className="sr-only">Remove</span>
                </button>
              </div>
            ))}

            {/* Empty State */}
            {weaknessItems.length === 0 && (
              <div className="text-center py-8 text-tertiary-text bg-elevated rounded-lg border-2 border-dashed border-[rgba(196,160,82,0.15)]">
                No weaknesses added yet. Click below to add one!
              </div>
            )}
          </div>

          {/* Add Input */}
          {showWeaknessInput ? (
            <div className="space-y-2">
              <input
                type="text"
                value={weaknessInput}
                onChange={(e) => setWeaknessInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddWeakness()
                  if (e.key === 'Escape') {
                    setShowWeaknessInput(false)
                    setWeaknessInput('')
                  }
                }}
                placeholder="e.g., Procrastination, Impatient, Fear of public speaking..."
                className="w-full px-4 py-3 border border-[rgba(196,160,82,0.15)] rounded-lg focus:ring-2 focus:ring-deep-amber focus:border-orange-500"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleAddWeakness}
                  className="flex-1 py-2 px-4 bg-deep-amber text-white rounded-lg hover:brightness-110 transition-colors font-medium"
                >
                  Add Weakness
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowWeaknessInput(false)
                    setWeaknessInput('')
                  }}
                  className="px-4 py-2 bg-elevated text-muted-wisdom rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowWeaknessInput(true)}
              className="w-full py-3 px-4 bg-deep-amber text-white rounded-lg hover:brightness-110 transition-colors font-medium shadow-sm hover:shadow-[0_4px_24px_rgba(0,0,0,0.4)] focus:outline-none focus:ring-2 focus:ring-deep-amber focus:ring-offset-0"
            >
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Weakness
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Insight Box */}
      <div className="bg-elevated border border-[rgba(196,160,82,0.15)] rounded-lg p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-deep-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-enlightened mb-1">
              Tip: Be honest and specific
            </h4>
            <p className="text-sm text-muted-wisdom">
              Self-awareness is the foundation of growth. Your weaknesses are simply areas with potential for improvement.
              Identifying them is the first step toward transformation.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
