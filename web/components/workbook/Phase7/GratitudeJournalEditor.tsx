'use client'

import { useState } from 'react'

export interface GratitudeItemData {
  id: string
  text: string
  category: 'people' | 'experiences' | 'things' | 'opportunities' | 'growth'
}

export interface DailyEntry {
  dateKey: string
  items: GratitudeItemData[]
  createdAt: string
  updatedAt: string
}

export interface GratitudeJournalData {
  entries: Record<string, DailyEntry> // key: YYYY-MM-DD
}

export interface GratitudeJournalEditorProps {
  data: GratitudeJournalData
  onChange: (data: GratitudeJournalData) => void
  className?: string
}

const CATEGORIES = [
  { value: 'people', label: 'People', emoji: '👥', color: 'bg-pink-100 text-muted-wisdom' },
  { value: 'experiences', label: 'Experiences', emoji: '✨', color: 'bg-blue-100 text-muted-wisdom' },
  { value: 'things', label: 'Things', emoji: '🎁', color: 'bg-green-100 text-muted-wisdom' },
  { value: 'opportunities', label: 'Opportunities', emoji: '🚪', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'growth', label: 'Personal Growth', emoji: '🌱', color: 'bg-purple-100 text-muted-wisdom' },
] as const

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0] // YYYY-MM-DD
}

function formatDisplayDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

function calculateStreak(entries: Record<string, DailyEntry>): number {
  const sortedDates = Object.keys(entries).sort().reverse()
  if (sortedDates.length === 0) return 0

  let streak = 0
  const today = new Date()
  let checkDate = new Date(today)

  for (let i = 0; i < 365; i++) {
    const dateKey = formatDate(checkDate)
    if (entries[dateKey] && entries[dateKey].items.length > 0) {
      streak++
      checkDate.setDate(checkDate.getDate() - 1)
    } else {
      break
    }
  }

  return streak
}

/**
 * Gratitude Journal Editor - Daily gratitude practice tracker
 *
 * Features:
 * - Daily entries with 3-5 items
 * - Category selection
 * - Date navigation
 * - Streak counter
 *
 * @example
 * ```tsx
 * <GratitudeJournalEditor
 *   data={journalData}
 *   onChange={(newData) => setJournalData(newData)}
 * />
 * ```
 */
export function GratitudeJournalEditor({ data, onChange, className = '' }: GratitudeJournalEditorProps) {
  const [currentDate, setCurrentDate] = useState<string>(formatDate(new Date()))

  const currentEntry = data.entries[currentDate] || {
    dateKey: currentDate,
    items: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  const streak = calculateStreak(data.entries)

  const handleAddItem = () => {
    const newItem: GratitudeItemData = {
      id: generateId(),
      text: '',
      category: 'experiences',
    }

    const updatedEntry: DailyEntry = {
      ...currentEntry,
      items: [...currentEntry.items, newItem],
      updatedAt: new Date().toISOString(),
    }

    onChange({
      ...data,
      entries: {
        ...data.entries,
        [currentDate]: updatedEntry,
      },
    })
  }

  const handleUpdateItem = (id: string, field: keyof GratitudeItemData, value: string) => {
    const updatedEntry: DailyEntry = {
      ...currentEntry,
      items: currentEntry.items.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      ),
      updatedAt: new Date().toISOString(),
    }

    onChange({
      ...data,
      entries: {
        ...data.entries,
        [currentDate]: updatedEntry,
      },
    })
  }

  const handleRemoveItem = (id: string) => {
    const updatedEntry: DailyEntry = {
      ...currentEntry,
      items: currentEntry.items.filter(item => item.id !== id),
      updatedAt: new Date().toISOString(),
    }

    onChange({
      ...data,
      entries: {
        ...data.entries,
        [currentDate]: updatedEntry,
      },
    })
  }

  const handlePreviousDay = () => {
    const date = new Date(currentDate + 'T00:00:00')
    date.setDate(date.getDate() - 1)
    setCurrentDate(formatDate(date))
  }

  const handleNextDay = () => {
    const date = new Date(currentDate + 'T00:00:00')
    const today = new Date()
    if (date < today) {
      date.setDate(date.getDate() + 1)
      setCurrentDate(formatDate(date))
    }
  }

  const handleToday = () => {
    setCurrentDate(formatDate(new Date()))
  }

  const isToday = currentDate === formatDate(new Date())

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Introduction */}
      <div className="bg-elevated border border-[rgba(196,160,82,0.2)] rounded-lg p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-enlightened mb-1">
              Daily Gratitude Practice
            </h4>
            <p className="text-sm text-muted-wisdom">
              List 3-5 things you&apos;re grateful for each day. Regular gratitude practice has been scientifically proven
              to increase happiness, reduce stress, and improve overall well-being.
            </p>
          </div>
        </div>
      </div>

      {/* Streak Counter */}
      {streak > 0 && (
        <div className="bg-elevated border-2 border-yellow-300 rounded-xl p-6 text-center">
          <div className="text-5xl font-bold text-orange-600 mb-2">{streak} 🔥</div>
          <p className="text-lg font-semibold text-enlightened">Day Streak!</p>
          <p className="text-sm text-orange-700 mt-1">Keep going! You're building a powerful habit.</p>
        </div>
      )}

      {/* Date Navigation */}
      <div className="bg-elevated rounded-xl border-2 border-[rgba(196,160,82,0.2)] p-6 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handlePreviousDay}
            className="p-2 hover:bg-temple-stone rounded-lg transition-colors"
            aria-label="Previous day"
          >
            <svg className="w-6 h-6 text-muted-wisdom" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="text-center">
            <h3 className="text-2xl font-bold text-enlightened">{formatDisplayDate(currentDate)}</h3>
            {!isToday && (
              <button
                onClick={handleToday}
                className="text-sm text-purple-600 hover:text-purple-700 font-semibold mt-1"
              >
                Jump to Today
              </button>
            )}
          </div>

          <button
            onClick={handleNextDay}
            disabled={isToday}
            className={`p-2 rounded-lg transition-colors ${
              isToday ? 'opacity-30 cursor-not-allowed' : 'hover:bg-temple-stone'
            }`}
            aria-label="Next day"
          >
            <svg className="w-6 h-6 text-muted-wisdom" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Gratitude Items */}
        <div className="space-y-4">
          {currentEntry.items.map((item, index) => (
            <div key={item.id} className="bg-elevated border-2 border-[rgba(196,160,82,0.2)] rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </div>

                <div className="flex-1 space-y-3">
                  <textarea
                    value={item.text}
                    onChange={(e) => handleUpdateItem(item.id, 'text', e.target.value)}
                    placeholder="What are you grateful for today?"
                    rows={2}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none resize-none"
                  />

                  <div className="flex items-center gap-2 flex-wrap">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.value}
                        onClick={() => handleUpdateItem(item.id, 'category', cat.value)}
                        className={`px-3 py-1 rounded-full text-sm font-semibold transition-all ${
                          item.category === cat.value
                            ? cat.color
                            : 'bg-temple-stone text-muted-wisdom hover:bg-temple-stone'
                        }`}
                      >
                        {cat.emoji} {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="flex-shrink-0 text-red-600 hover:text-red-700 p-1"
                  aria-label="Remove item"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ))}

          {/* Add Item Button */}
          {currentEntry.items.length < 10 && (
            <button
              onClick={handleAddItem}
              className="w-full py-4 border-2 border-dashed border-purple-300 rounded-xl hover:border-purple-500 hover:bg-elevated transition-all flex items-center justify-center gap-2 text-purple-600 font-semibold"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Gratitude Item
            </button>
          )}
        </div>
      </div>

      {/* Summary Statistics */}
      {Object.keys(data.entries).length > 0 && (
        <div className="bg-elevated border border-[rgba(196,160,82,0.2)] rounded-xl p-6">
          <h3 className="text-lg font-semibold text-enlightened mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Your Gratitude Journey
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{Object.keys(data.entries).length}</div>
              <div className="text-sm text-muted-wisdom">Days Recorded</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {Object.values(data.entries).reduce((sum, entry) => sum + entry.items.length, 0)}
              </div>
              <div className="text-sm text-muted-wisdom">Total Items</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{streak}</div>
              <div className="text-sm text-muted-wisdom">Current Streak</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {Math.round(Object.values(data.entries).reduce((sum, entry) => sum + entry.items.length, 0) / Object.keys(data.entries).length * 10) / 10}
              </div>
              <div className="text-sm text-muted-wisdom">Avg per Day</div>
            </div>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="bg-elevated border border-heart-emerald rounded-xl p-6">
        <h3 className="text-lg font-semibold text-enlightened mb-4">Gratitude Tips</h3>
        <ul className="space-y-2 text-sm text-muted-wisdom">
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">•</span>
            <span>Be specific - "sunny morning coffee" beats "coffee"</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">•</span>
            <span>Include both big and small things</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">•</span>
            <span>Focus on people more than possessions</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">•</span>
            <span>Savor unexpected moments and surprises</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">•</span>
            <span>Write at the same time each day to build habit</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
