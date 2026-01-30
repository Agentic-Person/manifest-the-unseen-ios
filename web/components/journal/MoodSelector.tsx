'use client'

import { MOOD_OPTIONS, MoodValue, getMoodInfo } from '@/types/database'

export interface MoodSelectorProps {
  value: MoodValue | null
  onChange: (mood: MoodValue | null) => void
  disabled?: boolean
  className?: string
}

/**
 * MoodSelector component for selecting mood with emoji options.
 *
 * @example
 * ```tsx
 * <MoodSelector
 *   value={mood}
 *   onChange={setMood}
 * />
 * ```
 */
export function MoodSelector({
  value,
  onChange,
  disabled = false,
  className = '',
}: MoodSelectorProps) {
  const handleSelect = (mood: MoodValue) => {
    if (disabled) return
    // Toggle off if same mood is clicked
    onChange(value === mood ? null : mood)
  }

  return (
    <div className={`${className}`}>
      <label className="block text-sm font-medium text-muted-wisdom mb-2">
        How are you feeling?
      </label>
      <div className="flex flex-wrap gap-2">
        {MOOD_OPTIONS.map((mood) => {
          const isSelected = value === mood.value
          const emoji = mood.label.split(' ')[0]

          return (
            <button
              key={mood.value}
              type="button"
              onClick={() => handleSelect(mood.value)}
              disabled={disabled}
              className={`
                px-3 py-2 rounded-lg text-sm font-medium
                transition-all duration-200 ease-in-out
                border
                ${isSelected
                  ? 'bg-aged-gold/20 border-aged-gold text-aged-gold shadow-[0_0_12px_rgba(196,160,82,0.3)]'
                  : 'bg-elevated border-[rgba(196,160,82,0.2)] text-muted-wisdom hover:border-aged-gold/50 hover:bg-temple-stone'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
              title={mood.label.split(' ').slice(1).join(' ')}
            >
              <span className="text-lg mr-1">{emoji}</span>
              <span className="hidden sm:inline">{mood.label.split(' ').slice(1).join(' ')}</span>
            </button>
          )
        })}
      </div>
      {value && (
        <p className="mt-2 text-sm text-muted-wisdom">
          Selected: <span className="text-aged-gold">{getMoodInfo(value)?.label}</span>
        </p>
      )}
    </div>
  )
}
