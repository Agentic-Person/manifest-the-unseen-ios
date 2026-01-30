'use client'

import { useState, useRef, useEffect, KeyboardEvent } from 'react'

export interface TagInputProps {
  value: string[]
  onChange: (tags: string[]) => void
  suggestions?: string[]
  placeholder?: string
  maxTags?: number
  disabled?: boolean
  className?: string
}

/**
 * TagInput component for adding and removing tags with chip display.
 *
 * @example
 * ```tsx
 * <TagInput
 *   value={tags}
 *   onChange={setTags}
 *   suggestions={['gratitude', 'manifestation', 'goals']}
 *   placeholder="Add a tag..."
 * />
 * ```
 */
export function TagInput({
  value,
  onChange,
  suggestions = [],
  placeholder = 'Add a tag...',
  maxTags = 10,
  disabled = false,
  className = '',
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Filter suggestions based on input and already selected tags
  const filteredSuggestions = suggestions.filter(
    (s) =>
      s.toLowerCase().includes(inputValue.toLowerCase()) &&
      !value.includes(s)
  )

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const addTag = (tag: string) => {
    const normalizedTag = tag.trim().toLowerCase()
    if (
      normalizedTag &&
      !value.includes(normalizedTag) &&
      value.length < maxTags
    ) {
      onChange([...value, normalizedTag])
      setInputValue('')
      setShowSuggestions(false)
    }
  }

  const removeTag = (tagToRemove: string) => {
    if (disabled) return
    onChange(value.filter((tag) => tag !== tagToRemove))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag(inputValue)
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      // Remove last tag when backspace is pressed with empty input
      removeTag(value[value.length - 1])
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    // Remove commas as they are used as delimiters
    setInputValue(newValue.replace(/,/g, ''))
    setShowSuggestions(true)
  }

  const handleFocus = () => {
    if (filteredSuggestions.length > 0) {
      setShowSuggestions(true)
    }
  }

  return (
    <div className={`${className}`} ref={containerRef}>
      <label className="block text-sm font-medium text-muted-wisdom mb-2">
        Tags
      </label>
      <div
        className={`
          bg-elevated border border-[rgba(196,160,82,0.2)] rounded-lg
          p-2 focus-within:border-aged-gold focus-within:ring-1 focus-within:ring-aged-gold/30
          transition-all duration-200
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onClick={() => inputRef.current?.focus()}
      >
        <div className="flex flex-wrap gap-2">
          {/* Tag chips */}
          {value.map((tag) => (
            <span
              key={tag}
              className={`
                inline-flex items-center gap-1 px-2 py-1
                bg-aged-gold/20 text-aged-gold text-sm rounded-md
                ${disabled ? '' : 'group'}
              `}
            >
              #{tag}
              {!disabled && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeTag(tag)
                  }}
                  className="
                    ml-1 w-4 h-4 flex items-center justify-center
                    text-aged-gold/60 hover:text-aged-gold
                    rounded-full hover:bg-aged-gold/20
                    transition-colors duration-150
                  "
                  aria-label={`Remove ${tag} tag`}
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </span>
          ))}

          {/* Input field */}
          {!disabled && value.length < maxTags && (
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={handleFocus}
              placeholder={value.length === 0 ? placeholder : ''}
              className="
                flex-1 min-w-[100px] bg-transparent
                text-ancient-script placeholder-muted-wisdom/50
                outline-none text-sm py-1
              "
            />
          )}
        </div>

        {/* Suggestions dropdown */}
        {showSuggestions && filteredSuggestions.length > 0 && !disabled && (
          <div className="
            mt-2 pt-2 border-t border-[rgba(196,160,82,0.1)]
          ">
            <p className="text-xs text-muted-wisdom mb-1">Suggestions:</p>
            <div className="flex flex-wrap gap-1">
              {filteredSuggestions.slice(0, 5).map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => addTag(suggestion)}
                  className="
                    px-2 py-1 text-xs
                    bg-temple-stone text-muted-wisdom
                    border border-[rgba(196,160,82,0.2)]
                    rounded hover:border-aged-gold/50 hover:text-aged-gold
                    transition-all duration-150
                  "
                >
                  #{suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Helper text */}
      <p className="mt-1 text-xs text-muted-wisdom/60">
        Press Enter or comma to add a tag. {value.length}/{maxTags} tags.
      </p>
    </div>
  )
}
