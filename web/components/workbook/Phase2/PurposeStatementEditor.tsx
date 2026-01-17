'use client'

import { useState } from 'react'

export interface PurposeStatementData {
  statement: string
}

export interface PurposeStatementEditorProps {
  data: PurposeStatementData
  onChange: (data: PurposeStatementData) => void
  className?: string
}

const GUIDING_QUESTIONS = [
  {
    question: "What unique gifts and talents do I bring to the world?",
    category: "Strengths",
  },
  {
    question: "What activities make me lose track of time?",
    category: "Passion",
  },
  {
    question: "What problems do I feel called to solve?",
    category: "Purpose",
  },
  {
    question: "Who do I want to help or serve?",
    category: "Impact",
  },
  {
    question: "What legacy do I want to leave?",
    category: "Vision",
  },
]

/**
 * Purpose Statement Editor - Text area with character count for crafting a personal purpose statement.
 *
 * Helps users distill their life mission into a concise, actionable purpose statement.
 *
 * @example
 * ```tsx
 * <PurposeStatementEditor
 *   data={purposeData}
 *   onChange={(newData) => setPurposeData(newData)}
 * />
 * ```
 */
export function PurposeStatementEditor({ data, onChange, className = '' }: PurposeStatementEditorProps) {
  const [charCount, setCharCount] = useState(data.statement.length)
  const maxChars = 500
  const recommendedMin = 100

  const handleChange = (value: string) => {
    if (value.length <= maxChars) {
      onChange({ statement: value })
      setCharCount(value.length)
    }
  }

  const getCharCountColor = () => {
    if (charCount === 0) return 'text-gray-400'
    if (charCount < recommendedMin) return 'text-orange-500'
    if (charCount > maxChars * 0.9) return 'text-red-500'
    return 'text-green-600'
  }

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Introduction */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-purple-900 mb-1">
              Craft Your Purpose Statement
            </h4>
            <p className="text-sm text-purple-800">
              Your purpose statement is a clear, concise declaration of why you exist and what you're here to do.
              Unlike your broader life mission, this should be specific and actionable - a statement you can
              reference daily to stay aligned with your calling.
            </p>
          </div>
        </div>
      </div>

      {/* Guiding Questions */}
      <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-200 p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Reflect on These Questions First
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {GUIDING_QUESTIONS.map((item, index) => (
            <div key={index} className="bg-white rounded-lg p-4 border border-blue-100 shadow-sm">
              <div className="flex items-start gap-2">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-blue-600 mb-1">{item.category}</p>
                  <p className="text-sm text-gray-700">{item.question}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Purpose Statement Input */}
      <div className="bg-white rounded-xl border-2 border-purple-200 p-6 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">
            My Purpose Statement
          </h3>
          <div className={`text-sm font-semibold ${getCharCountColor()}`}>
            {charCount} / {maxChars} characters
          </div>
        </div>

        <textarea
          value={data.statement}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Example: My purpose is to inspire and empower others to pursue their dreams with courage and authenticity, creating a ripple effect of positive change in the world."
          className="w-full min-h-[250px] p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-y text-gray-900 leading-relaxed"
          style={{ fontFamily: 'system-ui, sans-serif', fontSize: '16px' }}
        />

        {/* Progress Indicator */}
        <div className="mt-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Progress</span>
            <span>
              {charCount < recommendedMin
                ? `${recommendedMin - charCount} more characters recommended`
                : 'Looking good!'}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                charCount >= recommendedMin ? 'bg-green-500' : 'bg-orange-500'
              }`}
              style={{ width: `${Math.min((charCount / maxChars) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Framework & Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Formula */}
        <div className="bg-gradient-to-br from-green-50 to-white rounded-xl border border-green-200 p-6">
          <h4 className="text-lg font-semibold text-green-900 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Purpose Formula
          </h4>
          <div className="space-y-3">
            <div className="bg-white rounded-lg p-3 border border-green-100">
              <p className="text-sm text-gray-700">
                <span className="font-semibold text-green-600">Action Verb</span>
                <br />
                <span className="text-xs text-gray-500">inspire, empower, create, teach, heal, build...</span>
              </p>
            </div>
            <div className="text-center text-green-600 font-bold">+</div>
            <div className="bg-white rounded-lg p-3 border border-green-100">
              <p className="text-sm text-gray-700">
                <span className="font-semibold text-green-600">Who You Serve</span>
                <br />
                <span className="text-xs text-gray-500">others, my community, future generations...</span>
              </p>
            </div>
            <div className="text-center text-green-600 font-bold">+</div>
            <div className="bg-white rounded-lg p-3 border border-green-100">
              <p className="text-sm text-gray-700">
                <span className="font-semibold text-green-600">Desired Outcome</span>
                <br />
                <span className="text-xs text-gray-500">to live authentically, find peace, create change...</span>
              </p>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-gradient-to-br from-orange-50 to-white rounded-xl border border-orange-200 p-6">
          <h4 className="text-lg font-semibold text-orange-900 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Writing Tips
          </h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-orange-600 font-bold">•</span>
              <span>Keep it to 1-3 sentences (100-500 characters)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-600 font-bold">•</span>
              <span>Start with "My purpose is..." or "I exist to..."</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-600 font-bold">•</span>
              <span>Be specific and personal - avoid generic phrases</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-600 font-bold">•</span>
              <span>Focus on contribution, not accomplishment</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-600 font-bold">•</span>
              <span>Make it memorable enough to recite from memory</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-600 font-bold">•</span>
              <span>Test it: Does it inspire you when you read it?</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Examples */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-purple-900 mb-4">
          Example Purpose Statements
        </h3>
        <div className="space-y-3">
          <div className="bg-white rounded-lg p-4 border border-purple-100">
            <p className="text-sm text-gray-700">
              <span className="font-semibold text-purple-600">Maya Angelou:</span>{' '}
              <em>"My mission in life is not merely to survive, but to thrive; and to do so with some passion, some compassion, some humor, and some style."</em>
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-purple-100">
            <p className="text-sm text-gray-700">
              <span className="font-semibold text-purple-600">Example:</span>{' '}
              <em>"My purpose is to help others discover their creative potential and live authentically, one conversation at a time."</em>
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-purple-100">
            <p className="text-sm text-gray-700">
              <span className="font-semibold text-purple-600">Example:</span>{' '}
              <em>"I exist to create spaces where people feel seen, heard, and valued, fostering genuine human connection in an increasingly digital world."</em>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
