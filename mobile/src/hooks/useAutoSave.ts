/**
 * Auto-Save Hook
 *
 * Debounced auto-save hook with status tracking.
 * Automatically saves workbook data after a configurable delay.
 */

import { useRef, useEffect, useCallback, useState } from 'react';
import { useSaveWorkbook } from './useWorkbook';

interface UseAutoSaveOptions<T> {
  /** The data to save */
  data: T;
  /** The phase number (1-10) */
  phaseNumber: number;
  /** The worksheet identifier */
  worksheetId: string;
  /** Debounce delay in milliseconds (default: 1500ms) */
  debounceMs?: number;
  /** Whether auto-save is enabled (default: true) */
  enabled?: boolean;
  /** Callback when save starts */
  onSaveStart?: () => void;
  /** Callback when save succeeds */
  onSaveSuccess?: (timestamp: Date) => void;
  /** Callback when save fails */
  onSaveError?: (error: Error) => void;
}

interface UseAutoSaveReturn {
  /** Whether a save is currently in progress */
  isSaving: boolean;
  /** Whether the last save failed */
  isError: boolean;
  /** The error from the last save attempt */
  error: Error | null;
  /** Timestamp of the last successful save */
  lastSaved: Date | null;
  /** Manually trigger a save immediately */
  saveNow: () => void;
}

/**
 * Auto-save hook with debounce
 *
 * @example
 * ```tsx
 * const { isSaving, lastSaved, isError, saveNow } = useAutoSave({
 *   data: formValues,
 *   phaseNumber: 1,
 *   worksheetId: 'wheel-of-life',
 *   debounceMs: 1500,
 *   onSaveSuccess: (time) => console.log('Saved at', time),
 * });
 *
 * return (
 *   <>
 *     <Form values={formValues} onChange={setFormValues} />
 *     <SaveIndicator isSaving={isSaving} lastSaved={lastSaved} isError={isError} />
 *   </>
 * );
 * ```
 */
export function useAutoSave<T extends Record<string, unknown>>({
  data,
  phaseNumber,
  worksheetId,
  debounceMs = 1500,
  enabled = true,
  onSaveStart,
  onSaveSuccess,
  onSaveError,
}: UseAutoSaveOptions<T>): UseAutoSaveReturn {
  const { mutate: save, isPending, isError, error } = useSaveWorkbook();
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstRender = useRef(true);
  const dataRef = useRef(data);

  // Keep data ref updated for use in callbacks
  dataRef.current = data;

  // Perform the save operation
  const performSave = useCallback(() => {
    onSaveStart?.();
    save(
      { phaseNumber, worksheetId, data: dataRef.current },
      {
        onSuccess: () => {
          const now = new Date();
          setLastSaved(now);
          onSaveSuccess?.(now);
        },
        onError: (err) => onSaveError?.(err as Error),
      }
    );
  }, [phaseNumber, worksheetId, save, onSaveStart, onSaveSuccess, onSaveError]);

  // Debounced save function
  const debouncedSave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(performSave, debounceMs);
  }, [performSave, debounceMs]);

  // Trigger debounced save on data changes
  useEffect(() => {
    // Skip auto-save on first render (initial data load)
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (enabled) {
      debouncedSave();
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, enabled, debouncedSave]);

  // Manual save function (saves immediately)
  const saveNow = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    performSave();
  }, [performSave]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    isSaving: isPending,
    isError,
    error: error as Error | null,
    lastSaved,
    saveNow,
  };
}
