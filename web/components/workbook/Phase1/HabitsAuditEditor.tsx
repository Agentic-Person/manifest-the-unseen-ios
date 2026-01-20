'use client'

import { useState } from 'react'
import { CardList } from '@/components/ui/CardList'

export interface Habit {
  id: string
  name: string
  type: 'good' | 'bad'
  frequency: string
}

export interface HabitsAuditData {
  habits: Habit[]
}

export interface HabitsAuditEditorProps {
  data: HabitsAuditData
  onChange: (data: HabitsAuditData) => void
  className?: string
}

/**
 * Habits Audit Editor - Track and analyze your daily habits.
 *
 * Helps users identify good habits to reinforce and bad habits to eliminate.
 * Color-coded cards make it easy to visualize positive and negative patterns.
 *
 * @example
 * ```tsx
 * <HabitsAuditEditor
 *   data={habitsData}
 *   onChange={(newData) => setHabitsData(newData)}
 * />
 * ```
 */
export function HabitsAuditEditor({ data, onChange, className = '' }: HabitsAuditEditorProps) {
  const [newHabit, setNewHabit] = useState({
    name: '',
    type: 'good' as 'good' | 'bad',
    frequency: '',
  })
  const [showForm, setShowForm] = useState(false)
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({})

  const handleAddHabit = () => {
    // Validate form
    const errors: { [key: string]: string } = {}
    if (!newHabit.name.trim()) {
      errors.name = 'Habit name is required'
    }
    if (!newHabit.frequency.trim()) {
      errors.frequency = 'Frequency is required'
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    // Add habit
    const habit: Habit = {
      id: `habit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: newHabit.name.trim(),
      type: newHabit.type,
      frequency: newHabit.frequency.trim(),
    }

    onChange({
      habits: [...data.habits, habit],
    })

    // Reset form
    setNewHabit({
      name: '',
      type: 'good',
      frequency: '',
    })
    setFormErrors({})
    setShowForm(false)
  }

  const handleRemoveHabit = (id: string) => {
    onChange({
      habits: data.habits.filter((h) => h.id !== id),
    })
  }

  const goodHabits = data.habits.filter((h) => h.type === 'good')
  const badHabits = data.habits.filter((h) => h.type === 'bad')

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Summary Statistics */}
      <div className="bg-gradient-to-br from-elevated to-elevated rounded-xl p-6 border border-[rgba(196,160,82,0.15)]">
        <h3 className="text-xl font-semibold text-enlightened mb-4">
          Habits Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-temple-stone rounded-lg border border-[rgba(196,160,82,0.15)]">
            <p className="text-3xl font-bold text-aged-gold">
              {data.habits.length}
            </p>
            <p className="text-sm text-muted-wisdom mt-1">Total Habits</p>
          </div>
          <div className="text-center p-4 bg-temple-stone rounded-lg border border-heart-emerald">
            <p className="text-3xl font-bold text-heart-emerald">
              {goodHabits.length}
            </p>
            <p className="text-sm text-muted-wisdom mt-1">Good Habits</p>
          </div>
          <div className="text-center p-4 bg-temple-stone rounded-lg border border-burgundy">
            <p className="text-3xl font-bold text-burgundy">
              {badHabits.length}
            </p>
            <p className="text-sm text-muted-wisdom mt-1">Bad Habits</p>
          </div>
        </div>
      </div>

      {/* Add Habit Form */}
      {!showForm ? (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="w-full py-3 px-4 bg-gradient-primary text-white rounded-lg hover:brightness-110 transition-colors font-medium shadow-sm hover:shadow-[0_4px_24px_rgba(0,0,0,0.4)] focus:outline-none focus:ring-2 focus:ring-aged-gold focus:ring-offset-0"
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
            Add Habit
          </span>
        </button>
      ) : (
        <div className="bg-temple-stone border border-[rgba(196,160,82,0.15)] rounded-xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
          <h3 className="text-lg font-semibold text-enlightened mb-4">
            Add New Habit
          </h3>
          <div className="space-y-4">
            {/* Habit Name */}
            <div>
              <label className="block text-sm font-medium text-muted-wisdom mb-2">
                Habit Name *
              </label>
              <input
                type="text"
                value={newHabit.name}
                onChange={(e) => {
                  setNewHabit({ ...newHabit, name: e.target.value })
                  setFormErrors({ ...formErrors, name: '' })
                }}
                placeholder="e.g., Morning meditation, Late-night snacking"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-aged-gold focus:border-aged-gold ${
                  formErrors.name ? 'border-red-500' : 'border-[rgba(196,160,82,0.15)]'
                }`}
              />
              {formErrors.name && (
                <p className="text-burgundy text-sm mt-1">{formErrors.name}</p>
              )}
            </div>

            {/* Habit Type */}
            <div>
              <label className="block text-sm font-medium text-muted-wisdom mb-2">
                Type *
              </label>
              <select
                value={newHabit.type}
                onChange={(e) =>
                  setNewHabit({ ...newHabit, type: e.target.value as 'good' | 'bad' })
                }
                className="w-full px-4 py-2 border border-[rgba(196,160,82,0.15)] rounded-lg focus:ring-2 focus:ring-aged-gold focus:border-aged-gold"
              >
                <option value="good">Good Habit</option>
                <option value="bad">Bad Habit</option>
              </select>
            </div>

            {/* Frequency */}
            <div>
              <label className="block text-sm font-medium text-muted-wisdom mb-2">
                Frequency *
              </label>
              <input
                type="text"
                value={newHabit.frequency}
                onChange={(e) => {
                  setNewHabit({ ...newHabit, frequency: e.target.value })
                  setFormErrors({ ...formErrors, frequency: '' })
                }}
                placeholder="e.g., Daily, 3x per week, Occasionally"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-aged-gold focus:border-aged-gold ${
                  formErrors.frequency ? 'border-red-500' : 'border-[rgba(196,160,82,0.15)]'
                }`}
              />
              {formErrors.frequency && (
                <p className="text-burgundy text-sm mt-1">{formErrors.frequency}</p>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleAddHabit}
                className="flex-1 px-4 py-2 bg-gradient-primary text-white rounded-lg hover:brightness-110 transition-colors font-medium"
              >
                Add Habit
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setNewHabit({ name: '', type: 'good', frequency: '' })
                  setFormErrors({})
                }}
                className="flex-1 px-4 py-2 bg-elevated text-muted-wisdom rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Habits List */}
      {data.habits.length > 0 ? (
        <div className="space-y-6">
          {/* Good Habits */}
          {goodHabits.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-tertiary-text mb-3 flex items-center gap-2">
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Good Habits ({goodHabits.length})
              </h3>
              <CardList
                items={goodHabits}
                onRemove={handleRemoveHabit}
                renderItem={(habit) => (
                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-semibold text-enlightened">{habit.name}</h4>
                    <p className="text-sm text-muted-wisdom mt-1">
                      Frequency: <span className="font-medium">{habit.frequency}</span>
                    </p>
                  </div>
                )}
              />
            </div>
          )}

          {/* Bad Habits */}
          {badHabits.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-tertiary-text mb-3 flex items-center gap-2">
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
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Bad Habits to Address ({badHabits.length})
              </h3>
              <CardList
                items={badHabits}
                onRemove={handleRemoveHabit}
                renderItem={(habit) => (
                  <div className="border-l-4 border-red-500 pl-4">
                    <h4 className="font-semibold text-enlightened">{habit.name}</h4>
                    <p className="text-sm text-muted-wisdom mt-1">
                      Frequency: <span className="font-medium">{habit.frequency}</span>
                    </p>
                  </div>
                )}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12 text-tertiary-text bg-elevated rounded-lg border-2 border-dashed border-[rgba(196,160,82,0.15)]">
          <svg
            className="w-12 h-12 mx-auto mb-3 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <p className="text-lg font-medium mb-1">No habits tracked yet</p>
          <p className="text-sm">
            Click "Add Habit" above to start your habits audit
          </p>
        </div>
      )}

      {/* Insights */}
      {data.habits.length > 0 && (
        <div className="bg-elevated border border-[rgba(196,160,82,0.15)] rounded-lg p-4">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <svg
                className="w-6 h-6 text-deep-teal"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-enlightened mb-1">
                Insight
              </h4>
              <p className="text-sm text-muted-wisdom">
                {getInsight(goodHabits.length, badHabits.length)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Helper function to generate insights
function getInsight(goodCount: number, badCount: number): string {
  const ratio = goodCount / (badCount || 1)

  if (goodCount === 0 && badCount === 0) {
    return "Start by listing your daily habits. Awareness is the first step to positive change."
  } else if (goodCount === 0) {
    return "You've identified habits to change. Now, think about positive habits you'd like to build to replace them."
  } else if (badCount === 0) {
    return `Great work! You've listed ${goodCount} positive habit${goodCount > 1 ? 's' : ''}. Keep reinforcing these to make them automatic.`
  } else if (ratio >= 2) {
    return `Excellent balance! You have ${goodCount} good habits outweighing ${badCount} bad habit${badCount > 1 ? 's' : ''}. Focus on reinforcing your strengths while addressing areas for improvement.`
  } else if (ratio >= 1) {
    return `You have an equal number of good and bad habits. Focus on strengthening your good habits to make them dominant in your daily routine.`
  } else {
    return `You've identified more bad habits (${badCount}) than good ones (${goodCount}). This awareness is powerful - now you can create an action plan to replace negative patterns with positive ones.`
  }
}
