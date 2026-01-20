'use client'

import { useState } from 'react'

export interface SWOTData {
  strengths: string[]
  weaknesses: string[]
  opportunities: string[]
  threats: string[]
}

export interface SWOTEditorProps {
  data: SWOTData
  onChange: (data: SWOTData) => void
  className?: string
}

/**
 * SWOT Analysis Editor - 4-quadrant grid for Strengths, Weaknesses, Opportunities, and Threats.
 *
 * Helps users identify internal strengths/weaknesses and external opportunities/threats
 * to create a comprehensive self-assessment for personal growth planning.
 *
 * @example
 * ```tsx
 * <SWOTEditor
 *   data={swotData}
 *   onChange={(newData) => setSwotData(newData)}
 * />
 * ```
 */
export function SWOTEditor({ data, onChange, className = '' }: SWOTEditorProps) {
  const [newStrength, setNewStrength] = useState('')
  const [newWeakness, setNewWeakness] = useState('')
  const [newOpportunity, setNewOpportunity] = useState('')
  const [newThreat, setNewThreat] = useState('')

  const addItem = (quadrant: keyof SWOTData, value: string) => {
    if (!value.trim()) return

    onChange({
      ...data,
      [quadrant]: [...data[quadrant], value.trim()],
    })

    // Clear the input after adding
    switch (quadrant) {
      case 'strengths':
        setNewStrength('')
        break
      case 'weaknesses':
        setNewWeakness('')
        break
      case 'opportunities':
        setNewOpportunity('')
        break
      case 'threats':
        setNewThreat('')
        break
    }
  }

  const removeItem = (quadrant: keyof SWOTData, index: number) => {
    onChange({
      ...data,
      [quadrant]: data[quadrant].filter((_, i) => i !== index),
    })
  }

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>,
    quadrant: keyof SWOTData,
    value: string
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addItem(quadrant, value)
    }
  }

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Introduction */}
      <div className="bg-elevated border border-[rgba(196,160,82,0.15)] rounded-lg p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-deep-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-enlightened mb-1">
              About SWOT Analysis
            </h4>
            <p className="text-sm text-muted-wisdom">
              SWOT stands for <strong>Strengths</strong>, <strong>Weaknesses</strong>, <strong>Opportunities</strong>, and <strong>Threats</strong>.
              This strategic planning tool helps you understand your current position and plan for growth.
              Internal factors (strengths/weaknesses) are within your control, while external factors (opportunities/threats) are influenced by your environment.
            </p>
          </div>
        </div>
      </div>

      {/* 4-Quadrant Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths Quadrant */}
        <div className="bg-gradient-to-br from-[rgba(45,90,74,0.1)] to-elevated rounded-xl border-2 border-heart-emerald p-6 shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-heart-emerald rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-enlightened">Strengths</h3>
          </div>
          <p className="text-sm text-tertiary-text mb-4">
            What are your positive attributes, skills, and advantages?
          </p>

          {/* Items List */}
          <div className="space-y-2 mb-4">
            {data.strengths.length === 0 ? (
              <div className="text-center py-4 text-heart-emerald bg-elevated rounded-lg border border-heart-emerald">
                <p className="text-sm text-muted-wisdom">Add your first strength</p>
              </div>
            ) : (
              data.strengths.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 p-3 bg-temple-stone rounded-lg border border-heart-emerald shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
                >
                  <div className="flex-1">
                    <p className="text-enlightened">{item}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem('strengths', index)}
                    className="flex-shrink-0 text-burgundy hover:text-burgundy hover:brightness-110 hover:bg-[rgba(107,45,61,0.2)] p-1 rounded transition-colors"
                    aria-label="Remove strength"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Add Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newStrength}
              onChange={(e) => setNewStrength(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, 'strengths', newStrength)}
              placeholder="e.g., Good communicator"
              className="flex-1 px-3 py-2 border border-heart-emerald rounded-lg focus:outline-none focus:ring-2 focus:ring-heart-emerald text-sm"
            />
            <button
              type="button"
              onClick={() => addItem('strengths', newStrength)}
              className="px-4 py-2 bg-heart-emerald text-white rounded-lg hover:brightness-110 transition-colors text-sm font-medium"
            >
              Add
            </button>
          </div>
        </div>

        {/* Weaknesses Quadrant */}
        <div className="bg-gradient-to-br from-[rgba(107,45,61,0.1)] to-elevated rounded-xl border-2 border-burgundy p-6 shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-burgundy rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-enlightened">Weaknesses</h3>
          </div>
          <p className="text-sm text-tertiary-text mb-4">
            What areas need improvement or hold you back?
          </p>

          {/* Items List */}
          <div className="space-y-2 mb-4">
            {data.weaknesses.length === 0 ? (
              <div className="text-center py-4 text-burgundy bg-elevated rounded-lg border border-burgundy">
                <p className="text-sm text-muted-wisdom">Add your first weakness</p>
              </div>
            ) : (
              data.weaknesses.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 p-3 bg-temple-stone rounded-lg border border-burgundy shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
                >
                  <div className="flex-1">
                    <p className="text-enlightened">{item}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem('weaknesses', index)}
                    className="flex-shrink-0 text-burgundy hover:text-burgundy hover:brightness-110 hover:bg-[rgba(107,45,61,0.2)] p-1 rounded transition-colors"
                    aria-label="Remove weakness"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Add Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newWeakness}
              onChange={(e) => setNewWeakness(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, 'weaknesses', newWeakness)}
              placeholder="e.g., Procrastination"
              className="flex-1 px-3 py-2 border border-burgundy rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy text-sm"
            />
            <button
              type="button"
              onClick={() => addItem('weaknesses', newWeakness)}
              className="px-4 py-2 bg-burgundy text-white rounded-lg hover:brightness-110 transition-colors text-sm font-medium"
            >
              Add
            </button>
          </div>
        </div>

        {/* Opportunities Quadrant */}
        <div className="bg-gradient-to-br from-elevated to-elevated rounded-xl border-2 border-[rgba(196,160,82,0.15)] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-deep-teal rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-enlightened">Opportunities</h3>
          </div>
          <p className="text-sm text-tertiary-text mb-4">
            What external factors could help you grow?
          </p>

          {/* Items List */}
          <div className="space-y-2 mb-4">
            {data.opportunities.length === 0 ? (
              <div className="text-center py-4 text-deep-teal bg-elevated rounded-lg border border-[rgba(196,160,82,0.15)]">
                <p className="text-sm">Add your first opportunity</p>
              </div>
            ) : (
              data.opportunities.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 p-3 bg-temple-stone rounded-lg border border-[rgba(196,160,82,0.15)] shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
                >
                  <div className="flex-1">
                    <p className="text-enlightened">{item}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem('opportunities', index)}
                    className="flex-shrink-0 text-burgundy hover:text-burgundy hover:brightness-110 hover:bg-[rgba(107,45,61,0.2)] p-1 rounded transition-colors"
                    aria-label="Remove opportunity"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Add Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newOpportunity}
              onChange={(e) => setNewOpportunity(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, 'opportunities', newOpportunity)}
              placeholder="e.g., New job opening"
              className="flex-1 px-3 py-2 border border-[rgba(196,160,82,0.15)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <button
              type="button"
              onClick={() => addItem('opportunities', newOpportunity)}
              className="px-4 py-2 bg-deep-teal text-white rounded-lg hover:brightness-110 transition-colors text-sm font-medium"
            >
              Add
            </button>
          </div>
        </div>

        {/* Threats Quadrant */}
        <div className="bg-gradient-to-br from-[rgba(139,105,20,0.1)] to-elevated rounded-xl border-2 border-deep-amber p-6 shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-deep-amber rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-enlightened">Threats</h3>
          </div>
          <p className="text-sm text-tertiary-text mb-4">
            What external challenges could hinder your progress?
          </p>

          {/* Items List */}
          <div className="space-y-2 mb-4">
            {data.threats.length === 0 ? (
              <div className="text-center py-4 text-deep-amber bg-[rgba(139,105,20,0.1)] rounded-lg border border-deep-amber">
                <p className="text-sm">Add your first threat</p>
              </div>
            ) : (
              data.threats.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 p-3 bg-temple-stone rounded-lg border border-deep-amber shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
                >
                  <div className="flex-1">
                    <p className="text-enlightened">{item}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem('threats', index)}
                    className="flex-shrink-0 text-burgundy hover:text-burgundy hover:brightness-110 hover:bg-[rgba(107,45,61,0.2)] p-1 rounded transition-colors"
                    aria-label="Remove threat"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Add Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newThreat}
              onChange={(e) => setNewThreat(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, 'threats', newThreat)}
              placeholder="e.g., Economic uncertainty"
              className="flex-1 px-3 py-2 border border-deep-amber rounded-lg focus:outline-none focus:ring-2 focus:ring-deep-amber text-sm"
            />
            <button
              type="button"
              onClick={() => addItem('threats', newThreat)}
              className="px-4 py-2 bg-deep-amber text-white rounded-lg hover:brightness-110 transition-colors text-sm font-medium"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Summary Insights */}
      <div className="bg-elevated border border-[rgba(196,160,82,0.15)] rounded-xl p-6">
        <h3 className="text-lg font-semibold text-enlightened mb-3">
          Your SWOT Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-heart-emerald">
              {data.strengths.length}
            </p>
            <p className="text-sm text-muted-wisdom">Strengths</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-burgundy">
              {data.weaknesses.length}
            </p>
            <p className="text-sm text-muted-wisdom">Weaknesses</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-deep-teal">
              {data.opportunities.length}
            </p>
            <p className="text-sm text-muted-wisdom">Opportunities</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-deep-amber">
              {data.threats.length}
            </p>
            <p className="text-sm text-muted-wisdom">Threats</p>
          </div>
        </div>
      </div>

      {/* Strategic Insight */}
      <div className="bg-gradient-to-r from-elevated to-blue-50 border border-[rgba(196,160,82,0.15)] rounded-lg p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-aged-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-enlightened mb-1">
              Strategic Thinking
            </h4>
            <p className="text-sm text-muted-wisdom">
              Use your strengths to leverage opportunities. Address weaknesses to minimize threats.
              This analysis will guide your goal-setting in the next phases of the workbook.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
