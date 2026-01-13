'use client'

export interface ValueItem {
  id: string
  name: string
  rank: number
}

export interface ValuesData {
  values: ValueItem[]
}

export interface ValuesEditorProps {
  data: ValuesData
  onChange: (data: ValuesData) => void
  className?: string
}

const DEFAULT_VALUES = [
  { id: 'family', name: 'Family', rank: 1 },
  { id: 'health', name: 'Health & Wellness', rank: 2 },
  { id: 'career', name: 'Career Success', rank: 3 },
  { id: 'freedom', name: 'Freedom & Independence', rank: 4 },
  { id: 'security', name: 'Security & Stability', rank: 5 },
  { id: 'creativity', name: 'Creativity & Self-Expression', rank: 6 },
  { id: 'relationships', name: 'Meaningful Relationships', rank: 7 },
  { id: 'growth', name: 'Personal Growth', rank: 8 },
  { id: 'adventure', name: 'Adventure & Excitement', rank: 9 },
  { id: 'contribution', name: 'Contribution & Service', rank: 10 },
  { id: 'wealth', name: 'Wealth & Prosperity', rank: 11 },
  { id: 'spirituality', name: 'Spirituality & Faith', rank: 12 },
]

/**
 * Values Editor - Ranked list of personal values with up/down controls.
 *
 * Allows users to rank their core values by importance using up/down buttons
 * or manual rank input. Highlights the top 3 values.
 *
 * @example
 * ```tsx
 * <ValuesEditor
 *   data={valuesData}
 *   onChange={(newData) => setValuesData(newData)}
 * />
 * ```
 */
export function ValuesEditor({ data, onChange, className = '' }: ValuesEditorProps) {
  // Initialize with default values if empty
  const values = data.values.length > 0 ? data.values : DEFAULT_VALUES

  const handleMoveUp = (id: string) => {
    const sortedItems = [...values].sort((a, b) => a.rank - b.rank)
    const index = sortedItems.findIndex(v => v.id === id)
    if (index <= 0) return // Already at top

    // Swap with previous item
    const temp = sortedItems[index - 1]
    sortedItems[index - 1] = sortedItems[index]
    sortedItems[index] = temp

    // Update ranks
    const updatedValues = sortedItems.map((item, idx) => ({
      ...item,
      rank: idx + 1,
    }))

    onChange({ values: updatedValues })
  }

  const handleMoveDown = (id: string) => {
    const sortedItems = [...values].sort((a, b) => a.rank - b.rank)
    const index = sortedItems.findIndex(v => v.id === id)
    if (index >= sortedItems.length - 1) return // Already at bottom

    // Swap with next item
    const temp = sortedItems[index + 1]
    sortedItems[index + 1] = sortedItems[index]
    sortedItems[index] = temp

    // Update ranks
    const updatedValues = sortedItems.map((item, idx) => ({
      ...item,
      rank: idx + 1,
    }))

    onChange({ values: updatedValues })
  }

  const handleRankChange = (id: string, newRank: number) => {
    // Clamp rank between 1 and values.length
    const clampedRank = Math.max(1, Math.min(values.length, newRank))

    // Find the item being changed
    const itemIndex = values.findIndex(v => v.id === id)
    if (itemIndex === -1) return

    const items = Array.from(values)
    const [item] = items.splice(itemIndex, 1)

    // Insert at new position (rank - 1 for 0-indexed array)
    const sortedItems = items.sort((a, b) => a.rank - b.rank)
    sortedItems.splice(clampedRank - 1, 0, item)

    // Update all ranks
    const updatedValues = sortedItems.map((item, index) => ({
      ...item,
      rank: index + 1,
    }))

    onChange({ values: updatedValues })
  }

  // Sort values by rank for display
  const sortedValues = [...values].sort((a, b) => a.rank - b.rank)

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Instructions */}
      <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl p-6 border border-purple-100">
        <h3 className="text-xl font-semibold text-gray-900 mb-3">
          Rank Your Core Values
        </h3>
        <p className="text-gray-700 mb-4">
          Use the up/down arrows to reorder your values by importance, or type a new rank number. Your top 3 values are highlighted in gold.
        </p>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
          <span>Use arrows to reorder, or type a new rank number (1 = most important)</span>
        </div>
      </div>

      {/* Values List with Up/Down Controls */}
      <div className="space-y-2">
        {sortedValues.map((value, index) => {
          const isTopThree = value.rank <= 3
          const isFirst = index === 0
          const isLast = index === sortedValues.length - 1

          return (
            <div
              key={value.id}
              className={`
                flex items-center gap-4 p-4 rounded-lg border-2 transition-all
                ${isTopThree
                  ? 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-300 shadow-md'
                  : 'bg-white border-gray-200 hover:border-purple-300 shadow-sm'
                }
              `}
            >
              {/* Up/Down Controls */}
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => handleMoveUp(value.id)}
                  disabled={isFirst}
                  className={`
                    p-1 rounded transition-colors
                    ${isFirst
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                    }
                  `}
                  aria-label="Move up"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <button
                  onClick={() => handleMoveDown(value.id)}
                  disabled={isLast}
                  className={`
                    p-1 rounded transition-colors
                    ${isLast
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                    }
                  `}
                  aria-label="Move down"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              {/* Rank Badge */}
              <div className={`
                flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg
                ${isTopThree
                  ? 'bg-gradient-to-br from-yellow-400 to-amber-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600'
                }
              `}>
                {value.rank}
              </div>

              {/* Value Name */}
              <div className="flex-grow">
                <p className={`font-semibold ${isTopThree ? 'text-amber-900' : 'text-gray-900'}`}>
                  {value.name}
                </p>
                {isTopThree && (
                  <p className="text-xs text-amber-700 mt-1">
                    Top Priority Value
                  </p>
                )}
              </div>

              {/* Rank Input */}
              <div className="flex-shrink-0">
                <label className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Rank:</span>
                  <input
                    type="number"
                    min={1}
                    max={values.length}
                    value={value.rank}
                    onChange={(e) => handleRankChange(value.id, parseInt(e.target.value) || 1)}
                    className="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </label>
              </div>
            </div>
          )
        })}
      </div>

      {/* Top 3 Summary */}
      <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-yellow-300 rounded-xl p-6 shadow-md">
        <h3 className="text-lg font-semibold text-amber-900 mb-4 flex items-center gap-2">
          <span>🏆</span>
          Your Top 3 Core Values
        </h3>
        <div className="space-y-3">
          {sortedValues.slice(0, 3).map((value, index) => (
            <div key={value.id} className="flex items-center gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 text-white font-bold flex items-center justify-center shadow">
                {index + 1}
              </div>
              <p className="text-amber-900 font-semibold text-lg">
                {value.name}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-yellow-300">
          <p className="text-sm text-amber-800">
            <strong>Remember:</strong> These top values should guide your decisions and goals. When facing tough choices, ask yourself which option aligns best with these core values.
          </p>
        </div>
      </div>

      {/* Reflection Prompt */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-blue-900 mb-1">
              Reflection Questions
            </h4>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Are your daily actions aligned with your top 3 values?</li>
              <li>When was the last time you made a decision based on these values?</li>
              <li>What would change if you lived more fully by these values?</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
