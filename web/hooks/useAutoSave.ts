import { useEffect, useRef, useState, useCallback } from 'react'

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

export interface UseAutoSaveOptions<T> {
  data: T
  onSave: (data: T) => Promise<void>
  delay?: number // milliseconds to wait before saving (default: 30000 = 30 seconds)
  enabled?: boolean
}

export interface UseAutoSaveReturn {
  status: SaveStatus
  lastSaved: Date | null
  error: Error | null
  saveNow: () => Promise<void>
}

/**
 * useAutoSave hook provides automatic debounced saving of data.
 * Saves after specified delay (default 30s) of inactivity.
 *
 * @example
 * ```tsx
 * const { status, lastSaved, saveNow } = useAutoSave({
 *   data: formData,
 *   onSave: async (data) => {
 *     await supabase
 *       .from('workbook_progress')
 *       .upsert({ ...data, user_id: userId })
 *   },
 *   delay: 30000, // 30 seconds
 * })
 *
 * return (
 *   <>
 *     <AutoSaveIndicator status={status} lastSaved={lastSaved} />
 *     <button onClick={saveNow}>Save Now</button>
 *   </>
 * )
 * ```
 */
export function useAutoSave<T>({
  data,
  onSave,
  delay = 30000,
  enabled = true,
}: UseAutoSaveOptions<T>): UseAutoSaveReturn {
  const [status, setStatus] = useState<SaveStatus>('idle')
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isSavingRef = useRef(false)
  const dataRef = useRef<T>(data)

  // Update data ref on every render
  dataRef.current = data

  /**
   * Save function that handles the actual save operation
   */
  const save = useCallback(async () => {
    if (isSavingRef.current || !enabled) return

    isSavingRef.current = true
    setStatus('saving')
    setError(null)

    try {
      await onSave(dataRef.current)
      setStatus('saved')
      setLastSaved(new Date())

      // Reset to idle after 3 seconds
      setTimeout(() => {
        setStatus('idle')
      }, 3000)
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err : new Error('Save failed'))
      console.error('Auto-save error:', err)
    } finally {
      isSavingRef.current = false
    }
  }, [onSave, enabled])

  /**
   * Save immediately (bypasses debounce)
   */
  const saveNow = useCallback(async () => {
    // Clear any pending auto-save
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    await save()
  }, [save])

  /**
   * Set up auto-save debounce whenever data changes
   */
  useEffect(() => {
    if (!enabled) return

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Set new timeout for auto-save
    timeoutRef.current = setTimeout(() => {
      save()
    }, delay)

    // Cleanup on unmount or data change
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [data, delay, enabled, save])

  /**
   * Save on unmount (page navigation)
   */
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      // Note: This won't work reliably for unmount saves in some cases
      // Consider using beforeunload event if critical
    }
  }, [])

  return {
    status,
    lastSaved,
    error,
    saveNow,
  }
}
