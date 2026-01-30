'use client'

import { useState, useCallback, useEffect } from 'react'
import { useAutoSave, SaveStatus } from '@/hooks/useAutoSave'
import { AutoSaveIndicator } from '@/components/ui/AutoSaveIndicator'
import { MoodSelector } from './MoodSelector'
import { TagInput } from './TagInput'
import { MoodValue } from '@/types/database'

export interface JournalEditorData {
  content: string
  mood: MoodValue | null
  tags: string[]
}

export interface JournalEditorProps {
  initialData?: JournalEditorData
  onSave: (data: JournalEditorData) => Promise<void>
  onCancel?: () => void
  onDelete?: () => void
  isNew?: boolean
  disabled?: boolean
  autoSaveEnabled?: boolean
  autoSaveDelay?: number
  className?: string
  suggestedTags?: string[]
}

const DEFAULT_DATA: JournalEditorData = {
  content: '',
  mood: null,
  tags: [],
}

const JOURNAL_PROMPTS = [
  'What are you grateful for today?',
  'Describe something you want to manifest...',
  'Write about a recent challenge and what you learned...',
  'What does your ideal day look like?',
  'Reflect on a moment that brought you joy...',
  'What fears are you ready to release?',
  'Write a letter to your future self...',
  'What small wins did you have today?',
]

/**
 * JournalEditor component for creating and editing journal entries.
 * Features auto-save, mood selection, and tag management.
 *
 * @example
 * ```tsx
 * <JournalEditor
 *   initialData={{ content: 'My entry...', mood: 'grateful', tags: ['goals'] }}
 *   onSave={async (data) => await saveEntry(data)}
 *   onCancel={() => router.back()}
 * />
 * ```
 */
export function JournalEditor({
  initialData = DEFAULT_DATA,
  onSave,
  onCancel,
  onDelete,
  isNew = false,
  disabled = false,
  autoSaveEnabled = true,
  autoSaveDelay = 5000, // 5 seconds for journals
  className = '',
  suggestedTags = ['gratitude', 'manifestation', 'goals', 'reflection', 'self-love', 'growth', 'dreams', 'affirmation'],
}: JournalEditorProps) {
  const [data, setData] = useState<JournalEditorData>(initialData)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Random prompt for new entries
  const [randomPrompt] = useState(() =>
    JOURNAL_PROMPTS[Math.floor(Math.random() * JOURNAL_PROMPTS.length)]
  )

  // Auto-save hook
  const { status, lastSaved, saveNow } = useAutoSave({
    data,
    onSave: async (data) => {
      if (data.content.trim() || !isNew) {
        await onSave(data)
      }
    },
    delay: autoSaveDelay,
    enabled: autoSaveEnabled && !disabled && hasUnsavedChanges,
  })

  // Track unsaved changes
  useEffect(() => {
    const hasChanges =
      data.content !== initialData.content ||
      data.mood !== initialData.mood ||
      JSON.stringify(data.tags) !== JSON.stringify(initialData.tags)

    setHasUnsavedChanges(hasChanges)
  }, [data, initialData])

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges && data.content.trim()) {
        e.preventDefault()
        e.returnValue = ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasUnsavedChanges, data.content])

  const handleContentChange = useCallback((content: string) => {
    setData((prev) => ({ ...prev, content }))
  }, [])

  const handleMoodChange = useCallback((mood: MoodValue | null) => {
    setData((prev) => ({ ...prev, mood }))
  }, [])

  const handleTagsChange = useCallback((tags: string[]) => {
    setData((prev) => ({ ...prev, tags }))
  }, [])

  const handleManualSave = async () => {
    if (disabled || isSaving) return
    if (!data.content.trim()) {
      return // Don't save empty entries
    }

    setIsSaving(true)
    try {
      await saveNow()
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (disabled || !onDelete) return
    setShowDeleteConfirm(false)
    onDelete()
  }

  // Word count
  const wordCount = data.content.trim() ? data.content.trim().split(/\s+/).length : 0
  const charCount = data.content.length

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with save status */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-aged-gold">
          {isNew ? 'New Journal Entry' : 'Edit Entry'}
        </h2>
        <div className="flex items-center gap-4">
          <AutoSaveIndicator
            status={isSaving ? 'saving' : status}
            lastSaved={lastSaved ?? undefined}
            className="text-sm"
          />
          <button
            type="button"
            onClick={handleManualSave}
            disabled={disabled || isSaving || !data.content.trim()}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium
              transition-all duration-200
              ${disabled || isSaving || !data.content.trim()
                ? 'bg-elevated text-muted-wisdom/50 cursor-not-allowed'
                : 'bg-aged-gold text-deep-void hover:bg-aged-gold/90 shadow-[0_0_12px_rgba(196,160,82,0.3)]'
              }
            `}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* Mood selector */}
      <MoodSelector
        value={data.mood}
        onChange={handleMoodChange}
        disabled={disabled}
      />

      {/* Content editor */}
      <div>
        <label className="block text-sm font-medium text-muted-wisdom mb-2">
          Your Thoughts
        </label>
        <textarea
          value={data.content}
          onChange={(e) => handleContentChange(e.target.value)}
          placeholder={isNew ? randomPrompt : 'Write your thoughts...'}
          disabled={disabled}
          rows={12}
          className={`
            w-full px-4 py-3 rounded-lg
            bg-elevated border border-[rgba(196,160,82,0.2)]
            text-ancient-script placeholder-muted-wisdom/50
            focus:border-aged-gold focus:ring-1 focus:ring-aged-gold/30
            transition-all duration-200
            resize-none
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        />
        <div className="mt-2 flex justify-between text-xs text-muted-wisdom/60">
          <span>{wordCount} words</span>
          <span>{charCount} characters</span>
        </div>
      </div>

      {/* Tags */}
      <TagInput
        value={data.tags}
        onChange={handleTagsChange}
        suggestions={suggestedTags}
        disabled={disabled}
      />

      {/* Action buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-[rgba(196,160,82,0.1)]">
        <div>
          {onDelete && !isNew && (
            <>
              {showDeleteConfirm ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-red-400">Delete this entry?</span>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="px-3 py-1 text-sm bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors"
                  >
                    Yes, delete
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-3 py-1 text-sm text-muted-wisdom hover:text-ancient-script transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={disabled}
                  className={`
                    text-sm text-red-400/70 hover:text-red-400
                    transition-colors duration-200
                    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  Delete Entry
                </button>
              )}
            </>
          )}
        </div>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm text-muted-wisdom hover:text-ancient-script transition-colors"
          >
            {hasUnsavedChanges ? 'Discard Changes' : 'Cancel'}
          </button>
        )}
      </div>
    </div>
  )
}
