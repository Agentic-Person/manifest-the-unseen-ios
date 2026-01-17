'use client'

import { useState } from 'react'

export interface LifeMissionData {
  mission: string
}

export interface LifeMissionEditorProps {
  data: LifeMissionData
  onChange: (data: LifeMissionData) => void
  className?: string
}

const GUIDANCE_PROMPTS = [
  "What do you want to be remembered for?",
  "What impact do you want to have on the world?",
  "What values guide your most important decisions?",
  "What makes you feel most alive and fulfilled?",
  "How do you want to serve others?",
]

/**
 * Life Mission Editor - Rich text editor for crafting a personal life mission statement.
 *
 * Helps users articulate their core purpose and values through guided reflection.
 *
 * @example
 * ```tsx
 * <LifeMissionEditor
 *   data={missionData}
 *   onChange={(newData) => setMissionData(newData)}
 * />
 * ```
 */
export function LifeMissionEditor({ data, onChange, className = '' }: LifeMissionEditorProps) {
  const [wordCount, setWordCount] = useState(countWords(data.mission))

  const handleChange = (value: string) => {
    onChange({ mission: value })
    setWordCount(countWords(value))
  }

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Introduction */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-purple-900 mb-1">
              About Your Life Mission
            </h4>
            <p className="text-sm text-purple-800">
              Your life mission is a clear, inspiring statement that captures your core purpose and values.
              It serves as a compass for major decisions and keeps you aligned with what matters most.
              Take your time to reflect deeply - this is the foundation of your vision.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Guidance Prompts Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-4 bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-200 p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Reflection Questions
            </h3>
            <div className="space-y-3">
              {GUIDANCE_PROMPTS.map((prompt, index) => (
                <div key={index} className="bg-white rounded-lg p-3 border border-blue-100 shadow-sm">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold text-blue-600">{index + 1}.</span> {prompt}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mission Statement Editor */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border-2 border-purple-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                My Life Mission Statement
              </h3>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>{wordCount} words</span>
              </div>
            </div>

            <textarea
              value={data.mission}
              onChange={(e) => handleChange(e.target.value)}
              placeholder="Write your life mission statement here... Take your time to articulate what truly matters to you and how you want to live your life. There's no perfect answer - just your authentic truth."
              className="w-full min-h-[400px] p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none text-gray-900 leading-relaxed"
              style={{ fontFamily: 'Georgia, serif', fontSize: '16px', lineHeight: '1.8' }}
            />

            {/* Tips */}
            <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-green-900 mb-2">
                Tips for Writing Your Mission
              </h4>
              <ul className="text-sm text-green-800 space-y-1 list-disc list-inside">
                <li>Write in the present tense (e.g., "I am..." or "I help...")</li>
                <li>Be specific about your values and the impact you want to make</li>
                <li>Keep it authentic - this is for you, not for others</li>
                <li>Aim for 50-200 words - concise but meaningful</li>
                <li>Revisit and refine it over time as you grow</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Example Missions */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-purple-900 mb-4">
          Example Mission Statements
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 border border-purple-100">
            <p className="text-sm text-gray-700 italic">
              "I am dedicated to living with integrity, compassion, and purpose.
              I strive to help others discover their potential while continuously
              growing myself. I create beauty and meaning through my work and
              relationships."
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-purple-100">
            <p className="text-sm text-gray-700 italic">
              "My mission is to empower others through education and mentorship,
              while maintaining balance in all areas of my life. I lead by example,
              showing that success and fulfillment can coexist with kindness and
              authenticity."
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length
}
