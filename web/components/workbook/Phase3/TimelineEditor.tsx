'use client'

import { useState } from 'react'

export interface Milestone {
  id: string
  title: string
  date: string
  description: string
  completed: boolean
}

export interface TimelineData {
  milestones: Milestone[]
}

export interface TimelineEditorProps {
  data: TimelineData
  onChange: (data: TimelineData) => void
  className?: string
}

/**
 * Timeline Editor - Visual timeline with milestones for goal tracking.
 *
 * @example
 * ```tsx
 * <TimelineEditor
 *   data={timelineData}
 *   onChange={(newData) => setTimelineData(newData)}
 * />
 * ```
 */
export function TimelineEditor({ data, onChange, className = '' }: TimelineEditorProps) {
  const [newMilestone, setNewMilestone] = useState({
    title: '',
    date: '',
    description: '',
  })

  const addMilestone = () => {
    if (!newMilestone.title || !newMilestone.date) return

    const milestone: Milestone = {
      id: `milestone-${Date.now()}`,
      ...newMilestone,
      completed: false,
    }

    const updatedMilestones = [...data.milestones, milestone].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    )

    onChange({ milestones: updatedMilestones })
    setNewMilestone({ title: '', date: '', description: '' })
  }

  const removeMilestone = (id: string) => {
    onChange({
      milestones: data.milestones.filter(m => m.id !== id),
    })
  }

  const toggleComplete = (id: string) => {
    onChange({
      milestones: data.milestones.map(m =>
        m.id === id ? { ...m, completed: !m.completed } : m
      ),
    })
  }

  const sortedMilestones = [...data.milestones].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Introduction */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-blue-900 mb-1">
              Map Your Journey
            </h4>
            <p className="text-sm text-blue-800">
              Create a visual timeline of milestones to track your progress toward your goals.
              Breaking big goals into smaller milestones makes them more achievable and helps maintain momentum.
            </p>
          </div>
        </div>
      </div>

      {/* Add Milestone Form */}
      <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl border-2 border-purple-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Milestone
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Milestone Title*
            </label>
            <input
              type="text"
              value={newMilestone.title}
              onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
              placeholder="e.g., Complete first 5K run"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Date*
            </label>
            <input
              type="date"
              value={newMilestone.date}
              onChange={(e) => setNewMilestone({ ...newMilestone, date: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description (optional)
          </label>
          <textarea
            value={newMilestone.description}
            onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
            placeholder="What does achieving this milestone look like?"
            rows={2}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <button
          type="button"
          onClick={addMilestone}
          disabled={!newMilestone.title || !newMilestone.date}
          className="mt-4 w-full py-3 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
        >
          Add Milestone
        </button>
      </div>

      {/* Timeline Visualization */}
      {sortedMilestones.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          <p className="text-gray-500">No milestones yet. Add your first milestone above!</p>
        </div>
      ) : (
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-purple-200" />

          {/* Milestones */}
          <div className="space-y-6">
            {sortedMilestones.map((milestone, index) => {
              const isPast = new Date(milestone.date) < new Date()
              const isCompleted = milestone.completed

              return (
                <div key={milestone.id} className="relative pl-16">
                  {/* Timeline Dot */}
                  <div
                    className={`absolute left-3 w-6 h-6 rounded-full border-4 ${
                      isCompleted
                        ? 'bg-green-500 border-green-200'
                        : isPast
                        ? 'bg-orange-400 border-orange-200'
                        : 'bg-purple-600 border-purple-200'
                    } flex items-center justify-center`}
                  >
                    {isCompleted && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>

                  {/* Milestone Card */}
                  <div
                    className={`bg-white rounded-lg border-2 p-4 shadow-sm ${
                      isCompleted
                        ? 'border-green-200 bg-green-50'
                        : isPast
                        ? 'border-orange-200'
                        : 'border-purple-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className={`font-semibold text-lg ${isCompleted ? 'text-green-900 line-through' : 'text-gray-900'}`}>
                            {milestone.title}
                          </h4>
                          {isPast && !isCompleted && (
                            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-medium">
                              Overdue
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {new Date(milestone.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                        {milestone.description && (
                          <p className="text-sm text-gray-700">{milestone.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => toggleComplete(milestone.id)}
                          className={`p-2 rounded transition-colors ${
                            isCompleted
                              ? 'text-green-600 hover:bg-green-100'
                              : 'text-gray-400 hover:bg-gray-100'
                          }`}
                          aria-label={isCompleted ? 'Mark incomplete' : 'Mark complete'}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => removeMilestone(milestone.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                          aria-label="Remove milestone"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Progress Summary */}
      {sortedMilestones.length > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-green-900 mb-4">Timeline Progress</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">{sortedMilestones.length}</p>
              <p className="text-sm text-gray-600">Total Milestones</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {sortedMilestones.filter(m => m.completed).length}
              </p>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-orange-600">
                {sortedMilestones.filter(m => new Date(m.date) < new Date() && !m.completed).length}
              </p>
              <p className="text-sm text-gray-600">Overdue</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">
                {sortedMilestones.length > 0
                  ? Math.round((sortedMilestones.filter(m => m.completed).length / sortedMilestones.length) * 100)
                  : 0}
                %
              </p>
              <p className="text-sm text-gray-600">Complete</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
