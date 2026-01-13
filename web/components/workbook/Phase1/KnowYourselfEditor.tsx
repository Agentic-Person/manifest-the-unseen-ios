'use client'

import { useState } from 'react'

export interface KnowYourselfData {
  questions: Array<{
    question: string
    answer: string
  }>
}

export interface KnowYourselfEditorProps {
  data: KnowYourselfData
  onChange: (data: KnowYourselfData) => void
  className?: string
}

const DEFAULT_QUESTIONS = [
  "What makes you unique?",
  "What are you most proud of?",
  "What do you value most in life?",
  "What are your biggest fears?",
  "What brings you joy?",
  "What are your biggest regrets?",
  "What would you do if you couldn't fail?",
  "Who are your role models and why?",
  "What legacy do you want to leave?",
  "What does success mean to you?"
]

/**
 * Know Yourself Q&A Editor - Deep self-reflection questionnaire.
 *
 * 10 powerful questions to help users explore their identity, values, fears, and aspirations.
 * Part of Phase 1: Self-Evaluation.
 *
 * @example
 * ```tsx
 * <KnowYourselfEditor
 *   data={knowYourselfData}
 *   onChange={(newData) => setKnowYourselfData(newData)}
 * />
 * ```
 */
export function KnowYourselfEditor({ data, onChange, className = '' }: KnowYourselfEditorProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0)

  // Initialize questions if empty
  const questions = data.questions.length === 0
    ? DEFAULT_QUESTIONS.map(q => ({ question: q, answer: '' }))
    : data.questions

  const handleAnswerChange = (index: number, answer: string) => {
    const newQuestions = [...questions]
    newQuestions[index] = { ...newQuestions[index], answer }
    onChange({ questions: newQuestions })
  }

  const answeredCount = questions.filter(q => q.answer.trim().length > 0).length
  const progressPercentage = (answeredCount / questions.length) * 100

  const toggleExpanded = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index)
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Info Box - Introduction */}
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-purple-900 mb-2">
              Know Yourself Deeply
            </h3>
            <p className="text-sm text-purple-800 mb-2">
              Self-awareness is the foundation of personal growth and manifestation. These questions will help you explore your identity, values, fears, and aspirations.
            </p>
            <p className="text-sm text-purple-800">
              Take your time with each question. There are no right or wrong answers - only honest reflections that will guide your journey.
            </p>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium text-gray-700">
              Progress: {answeredCount} of {questions.length} questions answered
            </span>
          </div>
          <span className="text-sm font-semibold text-indigo-600">
            {Math.round(progressPercentage)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Questions Accordion */}
      <div className="space-y-4">
        {questions.map((q, index) => {
          const isExpanded = expandedIndex === index
          const isAnswered = q.answer.trim().length > 0

          return (
            <div
              key={index}
              className={`border-2 rounded-xl transition-all duration-200 ${
                isAnswered
                  ? 'border-green-300 bg-green-50/50'
                  : 'border-gray-200 bg-white'
              } ${isExpanded ? 'shadow-md' : 'shadow-sm'}`}
            >
              {/* Question Header */}
              <button
                type="button"
                onClick={() => toggleExpanded(index)}
                className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-gray-50/50 transition-colors rounded-t-xl"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                    isAnswered
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-300 text-gray-700'
                  }`}>
                    {isAnswered ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </div>
                  <h3 className={`text-base font-semibold ${
                    isAnswered ? 'text-green-900' : 'text-gray-900'
                  }`}>
                    {q.question}
                  </h3>
                </div>
                <svg
                  className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                    isExpanded ? 'transform rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Answer Section */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-gray-200">
                  <textarea
                    value={q.answer}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                    placeholder="Share your thoughts here... Be honest and specific. This is for your eyes only."
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none text-gray-900 placeholder-gray-400"
                    style={{
                      minHeight: '150px',
                    }}
                  />
                  <div className="flex items-start gap-2 mt-3 text-xs text-gray-500">
                    <svg className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>
                      {index === 0 && "Think about your unique talents, perspectives, and experiences that make you different from everyone else."}
                      {index === 1 && "Consider your accomplishments, personal growth, qualities, or moments when you overcame challenges."}
                      {index === 2 && "Reflect on what truly matters to you - relationships, personal growth, freedom, security, creativity, etc."}
                      {index === 3 && "Be honest about what scares you. Naming your fears is the first step to overcoming them."}
                      {index === 4 && "What activities, people, or experiences light you up? What makes you feel most alive?"}
                      {index === 5 && "Regrets can be teachers. What would you do differently? How can you learn from these experiences?"}
                      {index === 6 && "If there were no limits or fear of failure, what would you pursue? What dreams would you chase?"}
                      {index === 7 && "Who inspires you and why? What qualities do they embody that you admire or aspire to develop?"}
                      {index === 8 && "How do you want to be remembered? What impact do you want to have on the world or the people around you?"}
                      {index === 9 && "Success is personal. Define it on your own terms - what would a truly successful life look like for you?"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Completion Message */}
      {answeredCount === questions.length && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div>
              <h4 className="text-base font-semibold text-green-900 mb-1">
                Excellent Work!
              </h4>
              <p className="text-sm text-green-800">
                You've completed all 10 questions. This deep self-reflection is a powerful foundation for your manifestation journey.
                Revisit these answers as you grow - your responses may evolve, and that's a sign of personal development.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Reflection Prompt */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-indigo-900 mb-1">
              Reflection Tip
            </h4>
            <p className="text-sm text-indigo-800">
              After completing all questions, take a moment to read through your answers. Look for patterns, recurring themes, or insights about yourself.
              These self-discoveries will guide your goal-setting and manifestation practices in the phases ahead.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
