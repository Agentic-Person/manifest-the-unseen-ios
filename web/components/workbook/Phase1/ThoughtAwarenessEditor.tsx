'use client'

import { useState } from 'react'
import { CardList } from '@/components/ui/CardList'

export interface ThoughtEntry {
  id: string
  thought: string
  emotion: string
  timestamp: string
  category: 'positive' | 'negative' | 'neutral'
}

export interface ThoughtAwarenessData {
  entries: ThoughtEntry[]
}

export interface ThoughtAwarenessEditorProps {
  data: ThoughtAwarenessData
  onChange: (data: ThoughtAwarenessData) => void
  className?: string
}

const EMOTION_OPTIONS = [
  'Happy',
  'Sad',
  'Anxious',
  'Angry',
  'Peaceful',
  'Excited',
  'Frustrated',
  'Grateful',
  'Worried',
  'Content',
  'Confused',
  'Hopeful',
  'Fearful',
  'Neutral',
]

/**
 * Thought Awareness Editor - Journal and track your thought patterns.
 *
 * Helps users build awareness of their thinking habits by logging thoughts,
 * associated emotions, and categorizing them as positive, negative, or neutral.
 * This practice develops mindfulness and helps identify patterns in thinking.
 *
 * @example
 * ```tsx
 * <ThoughtAwarenessEditor
 *   data={thoughtData}
 *   onChange={(newData) => setThoughtData(newData)}
 * />
 * ```
 */
export function ThoughtAwarenessEditor({ data, onChange, className = '' }: ThoughtAwarenessEditorProps) {
  const [newEntry, setNewEntry] = useState({
    thought: '',
    emotion: 'Neutral',
    category: 'neutral' as 'positive' | 'negative' | 'neutral',
  })
  const [showForm, setShowForm] = useState(false)
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({})

  const handleAddEntry = () => {
    // Validate form
    const errors: { [key: string]: string } = {}
    if (!newEntry.thought.trim()) {
      errors.thought = 'Please describe your thought'
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    // Add entry
    const entry: ThoughtEntry = {
      id: `thought_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      thought: newEntry.thought.trim(),
      emotion: newEntry.emotion,
      timestamp: new Date().toISOString(),
      category: newEntry.category,
    }

    onChange({
      entries: [entry, ...data.entries], // Add to beginning (newest first)
    })

    // Reset form
    setNewEntry({
      thought: '',
      emotion: 'Neutral',
      category: 'neutral',
    })
    setFormErrors({})
    setShowForm(false)
  }

  const handleRemoveEntry = (id: string) => {
    onChange({
      entries: data.entries.filter((e) => e.id !== id),
    })
  }

  // Calculate statistics
  const positiveCount = data.entries.filter((e) => e.category === 'positive').length
  const negativeCount = data.entries.filter((e) => e.category === 'negative').length
  const neutralCount = data.entries.filter((e) => e.category === 'neutral').length

  // Helper to format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    })
  }

  // Get category color classes
  const getCategoryColors = (category: string) => {
    switch (category) {
      case 'positive':
        return {
          border: 'border-heart-emerald',
          bg: 'bg-[rgba(45,90,74,0.1)]',
          text: 'text-enlightened',
          badge: 'bg-[rgba(45,90,74,0.2)] text-enlightened',
        }
      case 'negative':
        return {
          border: 'border-burgundy',
          bg: 'bg-[rgba(107,45,61,0.1)]',
          text: 'text-enlightened',
          badge: 'bg-[rgba(107,45,61,0.2)] text-enlightened',
        }
      default:
        return {
          border: 'border-[rgba(196,160,82,0.4)]',
          bg: 'bg-elevated',
          text: 'text-enlightened',
          badge: 'bg-temple-stone text-muted-wisdom',
        }
    }
  }

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Summary Statistics */}
      <div className="bg-elevated rounded-xl p-6 border border-[rgba(196,160,82,0.2)]">
        <h3 className="text-xl font-semibold text-enlightened mb-4">
          Thought Journal Overview
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-temple-stone rounded-lg border border-[rgba(196,160,82,0.15)]">
            <p className="text-3xl font-bold text-crown-purple">
              {data.entries.length}
            </p>
            <p className="text-sm text-muted-wisdom mt-1">Total Entries</p>
          </div>
          <div className="text-center p-4 bg-temple-stone rounded-lg border border-heart-emerald">
            <p className="text-3xl font-bold text-heart-emerald">
              {positiveCount}
            </p>
            <p className="text-sm text-muted-wisdom mt-1">Positive</p>
          </div>
          <div className="text-center p-4 bg-temple-stone rounded-lg border border-burgundy">
            <p className="text-3xl font-bold text-burgundy">
              {negativeCount}
            </p>
            <p className="text-sm text-muted-wisdom mt-1">Negative</p>
          </div>
          <div className="text-center p-4 bg-temple-stone rounded-lg border border-[rgba(196,160,82,0.15)]">
            <p className="text-3xl font-bold text-muted-wisdom">
              {neutralCount}
            </p>
            <p className="text-sm text-muted-wisdom mt-1">Neutral</p>
          </div>
        </div>
      </div>

      {/* Add Entry Form */}
      {!showForm ? (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="w-full py-3 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
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
            Log a Thought
          </span>
        </button>
      ) : (
        <div className="bg-elevated border border-[rgba(196,160,82,0.2)] rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-enlightened mb-4">
            Log New Thought
          </h3>
          <div className="space-y-4">
            {/* Thought */}
            <div>
              <label className="block text-sm font-medium text-muted-wisdom mb-2">
                What are you thinking? *
              </label>
              <textarea
                value={newEntry.thought}
                onChange={(e) => {
                  setNewEntry({ ...newEntry, thought: e.target.value })
                  setFormErrors({ ...formErrors, thought: '' })
                }}
                placeholder="Describe your thought in detail... What's going through your mind right now?"
                rows={4}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none ${
                  formErrors.thought ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {formErrors.thought && (
                <p className="text-red-600 text-sm mt-1">{formErrors.thought}</p>
              )}
            </div>

            {/* Emotion */}
            <div>
              <label className="block text-sm font-medium text-muted-wisdom mb-2">
                How do you feel? *
              </label>
              <select
                value={newEntry.emotion}
                onChange={(e) => setNewEntry({ ...newEntry, emotion: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {EMOTION_OPTIONS.map((emotion) => (
                  <option key={emotion} value={emotion}>
                    {emotion}
                  </option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-muted-wisdom mb-2">
                Is this thought helpful or harmful? *
              </label>
              <div className="flex gap-4">
                <label className="flex-1 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    value="positive"
                    checked={newEntry.category === 'positive'}
                    onChange={(e) => setNewEntry({ ...newEntry, category: e.target.value as 'positive' })}
                    className="sr-only"
                  />
                  <div
                    className={`p-4 border-2 rounded-lg text-center transition-all ${
                      newEntry.category === 'positive'
                        ? 'border-heart-emerald bg-[rgba(45,90,74,0.1)]'
                        : 'border-[rgba(196,160,82,0.15)] hover:border-heart-emerald'
                    }`}
                  >
                    <div className="text-2xl mb-1">😊</div>
                    <div className="font-medium text-enlightened">Positive</div>
                    <div className="text-xs text-muted-wisdom mt-1">Helpful, empowering</div>
                  </div>
                </label>

                <label className="flex-1 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    value="neutral"
                    checked={newEntry.category === 'neutral'}
                    onChange={(e) => setNewEntry({ ...newEntry, category: e.target.value as 'neutral' })}
                    className="sr-only"
                  />
                  <div
                    className={`p-4 border-2 rounded-lg text-center transition-all ${
                      newEntry.category === 'neutral'
                        ? 'border-[rgba(196,160,82,0.4)] bg-elevated'
                        : 'border-[rgba(196,160,82,0.15)] hover:border-[rgba(196,160,82,0.3)]'
                    }`}
                  >
                    <div className="text-2xl mb-1">😐</div>
                    <div className="font-medium text-enlightened">Neutral</div>
                    <div className="text-xs text-muted-wisdom mt-1">Observational</div>
                  </div>
                </label>

                <label className="flex-1 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    value="negative"
                    checked={newEntry.category === 'negative'}
                    onChange={(e) => setNewEntry({ ...newEntry, category: e.target.value as 'negative' })}
                    className="sr-only"
                  />
                  <div
                    className={`p-4 border-2 rounded-lg text-center transition-all ${
                      newEntry.category === 'negative'
                        ? 'border-burgundy bg-[rgba(107,45,61,0.1)]'
                        : 'border-[rgba(196,160,82,0.15)] hover:border-burgundy'
                    }`}
                  >
                    <div className="text-2xl mb-1">😟</div>
                    <div className="font-medium text-enlightened">Negative</div>
                    <div className="text-xs text-muted-wisdom mt-1">Limiting, harmful</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleAddEntry}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                Save Entry
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setNewEntry({ thought: '', emotion: 'Neutral', category: 'neutral' })
                  setFormErrors({})
                }}
                className="flex-1 px-4 py-2 bg-temple-stone text-muted-wisdom rounded-lg hover:bg-elevated transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Entries List */}
      {data.entries.length > 0 ? (
        <div>
          <h3 className="text-lg font-semibold text-enlightened mb-4 flex items-center gap-2">
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
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            Your Thought Journal ({data.entries.length} entries)
          </h3>
          <CardList
            items={data.entries}
            onRemove={handleRemoveEntry}
            renderItem={(entry) => {
              const colors = getCategoryColors(entry.category)
              return (
                <div className={`border-l-4 ${colors.border} pl-4`}>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${colors.badge}`}>
                        {entry.category.charAt(0).toUpperCase() + entry.category.slice(1)}
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full font-medium bg-[rgba(28,85,104,0.2)] text-deep-teal">
                        {entry.emotion}
                      </span>
                    </div>
                    <span className="text-xs text-tertiary-text whitespace-nowrap">
                      {formatTimestamp(entry.timestamp)}
                    </span>
                  </div>
                  <p className="text-enlightened leading-relaxed whitespace-pre-wrap">
                    {entry.thought}
                  </p>
                </div>
              )
            }}
          />
        </div>
      ) : (
        <div className="text-center py-12 text-tertiary-text bg-elevated rounded-lg border-2 border-dashed border-aged-gold">
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
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-lg font-medium mb-1">No thoughts logged yet</p>
          <p className="text-sm">
            Click "Log a Thought" to start tracking your thought patterns
          </p>
        </div>
      )}

      {/* Insights */}
      {data.entries.length > 0 && (
        <div className="bg-elevated border border-[rgba(196,160,82,0.2)] rounded-lg p-4">
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
                {getInsight(positiveCount, negativeCount, neutralCount, data.entries.length)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Helper function to generate insights
function getInsight(
  positiveCount: number,
  negativeCount: number,
  neutralCount: number,
  total: number
): string {
  const positiveRatio = positiveCount / total
  const negativeRatio = negativeCount / total

  if (total < 5) {
    return `Keep logging your thoughts! The more entries you record, the clearer your thinking patterns will become. Aim for at least 5-10 entries to identify meaningful trends.`
  } else if (positiveRatio >= 0.6) {
    return `Excellent! ${Math.round(positiveRatio * 100)}% of your thoughts are positive. This optimistic mindset is a powerful foundation for manifestation. Keep nurturing these empowering thought patterns.`
  } else if (negativeRatio >= 0.5) {
    return `You've logged ${negativeCount} negative thoughts out of ${total} entries. This awareness is the first step to change. Consider: How can you reframe these thoughts more positively?`
  } else if (neutralCount >= total / 2) {
    return `Many of your thoughts are neutral observations. Try to dig deeper - what emotions or judgments lie beneath these observations? This awareness can unlock deeper self-understanding.`
  } else {
    return `You're developing a balanced awareness of your thinking. Notice any patterns in when positive vs. negative thoughts arise. What triggers each type?`
  }
}
