'use client'

import { useState } from 'react'

export interface SMARTGoal {
  id: string
  title: string
  specific: string
  measurable: string
  achievable: string
  relevant: string
  timeBound: string
  deadline: string
}

export interface SMARTGoalData {
  goals: SMARTGoal[]
}

export interface SMARTGoalEditorProps {
  data: SMARTGoalData
  onChange: (data: SMARTGoalData) => void
  className?: string
}

/**
 * SMART Goal Editor - Form for creating goals using the SMART criteria.
 *
 * SMART = Specific, Measurable, Achievable, Relevant, Time-bound
 *
 * @example
 * ```tsx
 * <SMARTGoalEditor
 *   data={goalsData}
 *   onChange={(newData) => setGoalsData(newData)}
 * />
 * ```
 */
export function SMARTGoalEditor({ data, onChange, className = '' }: SMARTGoalEditorProps) {
  const [editingId, setEditingId] = useState<string | null>(null)

  const createNewGoal = (): SMARTGoal => ({
    id: `goal-${Date.now()}`,
    title: '',
    specific: '',
    measurable: '',
    achievable: '',
    relevant: '',
    timeBound: '',
    deadline: '',
  })

  const addGoal = () => {
    const newGoal = createNewGoal()
    onChange({ goals: [...data.goals, newGoal] })
    setEditingId(newGoal.id)
  }

  const updateGoal = (id: string, updates: Partial<SMARTGoal>) => {
    onChange({
      goals: data.goals.map(goal =>
        goal.id === id ? { ...goal, ...updates } : goal
      ),
    })
  }

  const removeGoal = (id: string) => {
    onChange({ goals: data.goals.filter(goal => goal.id !== id) })
    if (editingId === id) setEditingId(null)
  }

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Introduction */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-purple-900 mb-1">
              About SMART Goals
            </h4>
            <p className="text-sm text-purple-800">
              SMART goals are Specific, Measurable, Achievable, Relevant, and Time-bound.
              This framework transforms vague aspirations into concrete action plans that you can track and achieve.
            </p>
          </div>
        </div>
      </div>

      {/* SMART Framework Reference */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl border border-blue-200 p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">The SMART Framework</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {[
            { letter: 'S', word: 'Specific', desc: 'Clearly defined and unambiguous', color: 'blue' },
            { letter: 'M', word: 'Measurable', desc: 'Quantifiable with clear metrics', color: 'green' },
            { letter: 'A', word: 'Achievable', desc: 'Realistic and attainable', color: 'yellow' },
            { letter: 'R', word: 'Relevant', desc: 'Aligned with your values', color: 'orange' },
            { letter: 'T', word: 'Time-bound', desc: 'Has a clear deadline', color: 'red' },
          ].map((item) => (
            <div key={item.letter} className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm text-center">
              <div className={`w-10 h-10 bg-${item.color}-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-2`}>
                {item.letter}
              </div>
              <p className="font-semibold text-gray-900 text-sm">{item.word}</p>
              <p className="text-xs text-gray-600 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Goals List */}
      {data.goals.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          <p className="text-gray-500 mb-4">No goals yet. Create your first SMART goal!</p>
          <button
            type="button"
            onClick={addGoal}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            Create First Goal
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {data.goals.map((goal, index) => (
            <div
              key={goal.id}
              className="bg-white rounded-xl border-2 border-purple-200 p-6 shadow-sm"
            >
              {/* Goal Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  {editingId === goal.id ? (
                    <input
                      type="text"
                      value={goal.title}
                      onChange={(e) => updateGoal(goal.id, { title: e.target.value })}
                      placeholder="Goal Title (e.g., Run a Marathon)"
                      className="text-xl font-semibold text-gray-900 border-b-2 border-purple-300 focus:outline-none focus:border-purple-600 px-2 py-1"
                    />
                  ) : (
                    <h3 className="text-xl font-semibold text-gray-900">
                      {goal.title || 'Untitled Goal'}
                    </h3>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingId(editingId === goal.id ? null : goal.id)}
                    className="px-3 py-1 text-sm text-purple-600 hover:bg-purple-50 rounded transition-colors"
                  >
                    {editingId === goal.id ? 'Done' : 'Edit'}
                  </button>
                  <button
                    type="button"
                    onClick={() => removeGoal(goal.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                    aria-label="Remove goal"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* SMART Fields */}
              {editingId === goal.id && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-blue-900 mb-2">
                      Specific - What exactly will you accomplish?
                    </label>
                    <textarea
                      value={goal.specific}
                      onChange={(e) => updateGoal(goal.id, { specific: e.target.value })}
                      placeholder="Be specific about what, why, and how..."
                      rows={2}
                      className="w-full p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-green-900 mb-2">
                      Measurable - How will you track progress?
                    </label>
                    <textarea
                      value={goal.measurable}
                      onChange={(e) => updateGoal(goal.id, { measurable: e.target.value })}
                      placeholder="What metrics will you use? How will you know you've succeeded?"
                      rows={2}
                      className="w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-yellow-900 mb-2">
                      Achievable - Is this realistic? What resources do you need?
                    </label>
                    <textarea
                      value={goal.achievable}
                      onChange={(e) => updateGoal(goal.id, { achievable: e.target.value })}
                      placeholder="What skills, resources, or support do you need?"
                      rows={2}
                      className="w-full p-3 border border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-orange-900 mb-2">
                      Relevant - Why does this matter? How does it align with your values?
                    </label>
                    <textarea
                      value={goal.relevant}
                      onChange={(e) => updateGoal(goal.id, { relevant: e.target.value })}
                      placeholder="Why is this important to you right now?"
                      rows={2}
                      className="w-full p-3 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-red-900 mb-2">
                      Time-bound - What is your deadline?
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        type="date"
                        value={goal.deadline}
                        onChange={(e) => updateGoal(goal.id, { deadline: e.target.value })}
                        className="p-3 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                      />
                      <textarea
                        value={goal.timeBound}
                        onChange={(e) => updateGoal(goal.id, { timeBound: e.target.value })}
                        placeholder="Any milestones or interim deadlines?"
                        rows={1}
                        className="p-3 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Summary View */}
              {editingId !== goal.id && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  {goal.specific && (
                    <div className="bg-blue-50 rounded p-2 border border-blue-200">
                      <span className="font-semibold text-blue-900">Specific:</span>{' '}
                      <span className="text-gray-700">{goal.specific}</span>
                    </div>
                  )}
                  {goal.measurable && (
                    <div className="bg-green-50 rounded p-2 border border-green-200">
                      <span className="font-semibold text-green-900">Measurable:</span>{' '}
                      <span className="text-gray-700">{goal.measurable}</span>
                    </div>
                  )}
                  {goal.deadline && (
                    <div className="bg-red-50 rounded p-2 border border-red-200">
                      <span className="font-semibold text-red-900">Deadline:</span>{' '}
                      <span className="text-gray-700">{new Date(goal.deadline).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Add Another Goal Button */}
          <button
            type="button"
            onClick={addGoal}
            className="w-full py-3 px-4 bg-white border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors font-medium"
          >
            + Add Another Goal
          </button>
        </div>
      )}
    </div>
  )
}
