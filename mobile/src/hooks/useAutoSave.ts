/**
 * Auto-Save Hook
 *
 * Debounced auto-save hook with status tracking.
 * Automatically saves workbook data after a configurable delay.
 */

import { useRef, useEffect, useCallback, useState } from 'react';
import { useSaveWorkbook } from './useWorkbook';
import { getWorksheetConfig } from '../config/worksheetConfigs';
import { detectCompletion } from '../utils/completionDetection';
import { logger } from '../utils/logger';

interface UseAutoSaveOptions<T> {
  /** The data to save */
  data: T;
  /** The phase number (1-10) */
  phaseNumber: number;
  /** The worksheet identifier */
  worksheetId: string;
  /** Whether the worksheet is already marked as complete in the database (prevents downgrading from complete to incomplete) */
  isCompleted?: boolean;
  /** Debounce delay in milliseconds (default: 1500ms) */
  debounceMs?: number;
  /** Whether auto-save is enabled (default: true) */
  enabled?: boolean;
  /** Whether to enable auto-completion detection (default: true) */
  enableAutoComplete?: boolean;
  /** Callback when save starts */
  onSaveStart?: () => void;
  /** Callback when save succeeds - wasCompleted indicates if worksheet was marked complete */
  onSaveSuccess?: (timestamp: Date, wasCompleted?: boolean) => void;
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
  /** Manually trigger a save immediately. Pass completed=true to mark worksheet as complete. */
  saveNow: (options?: { completed?: boolean }) => void;
  /** Whether the worksheet was auto-completed on the last save */
  isAutoCompleted: boolean;
  /** Whether the worksheet can be marked as complete (meets completion criteria) */
  canComplete: boolean;
  /** Manually mark the worksheet as complete */
  markComplete: () => void;
}

/**
 * Auto-save hook with debounce and auto-completion detection
 *
 * @example
 * ```tsx
 * const {
 *   isSaving,
 *   lastSaved,
 *   isError,
 *   saveNow,
 *   isAutoCompleted,
 *   canComplete,
 *   markComplete
 * } = useAutoSave({
 *   data: formValues,
 *   phaseNumber: 1,
 *   worksheetId: 'wheel-of-life',
 *   debounceMs: 1500,
 *   enableAutoComplete: true, // Auto-detect completion on save
 *   onSaveSuccess: (time, wasCompleted) => {
 *     console.log('Saved at', time);
 *     if (wasCompleted) console.log('Worksheet auto-completed!');
 *   },
 * });
 *
 * return (
 *   <>
 *     <Form values={formValues} onChange={setFormValues} />
 *     <SaveIndicator isSaving={isSaving} lastSaved={lastSaved} isError={isError} />
 *     {canComplete && <CompleteButton onPress={markComplete} />}
 *     {isAutoCompleted && <Badge text="Completed" />}
 *   </>
 * );
 * ```
 */
// Maximum time to show "saving" state before considering it failed (15 seconds)
// With retry logic (3 retries with exponential backoff), saves should complete within 15s
// If it takes longer than 15s, something is wrong and we should show an error
const SAVE_TIMEOUT_MS = 15000;

export function useAutoSave<T extends Record<string, unknown>>({
  data,
  phaseNumber,
  worksheetId,
  isCompleted = false,
  debounceMs = 1500,
  enabled = true,
  enableAutoComplete = true,
  onSaveStart,
  onSaveSuccess,
  onSaveError,
}: UseAutoSaveOptions<T>): UseAutoSaveReturn {
  const { mutate: save, isPending, isError, error } = useSaveWorkbook();
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  // Local saving state that we control - doesn't rely solely on React Query's isPending
  const [isSavingLocal, setIsSavingLocal] = useState(false);
  // Auto-completion tracking
  const [isAutoCompleted, setIsAutoCompleted] = useState(false);
  const [canComplete, setCanComplete] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstRender = useRef(true);
  const dataRef = useRef(data);

  // Keep data ref updated for use in callbacks
  dataRef.current = data;

  // Check completion status continuously (not just on save)
  useEffect(() => {
    if (!enableAutoComplete) {
      return;
    }

    try {
      const config = getWorksheetConfig(worksheetId);
      if (config && config.completionCriteria) {
        const meetsCompletion = detectCompletion(data, config.completionCriteria);
        setCanComplete(meetsCompletion);
        setIsAutoCompleted(meetsCompletion);

        // Debug logging to help diagnose completion issues
        logger.debug(`[useAutoSave] Completion check for ${worksheetId}:`, {
          meetsCompletion,
          criteria: config.completionCriteria,
          dataKeys: Object.keys(data),
        });
      } else {
        // Config not found - log warning in dev mode
        logger.warn(`[useAutoSave] No completion config found for worksheet: ${worksheetId}`);
        setCanComplete(false);
        setIsAutoCompleted(false);
      }
    } catch (err) {
      // Config not found for this worksheet - proceed with manual completion only
      logger.error(`[useAutoSave] Error checking completion for ${worksheetId}:`, err);
      setCanComplete(false);
      setIsAutoCompleted(false);
    }
  }, [data, worksheetId, enableAutoComplete]);

  // Clear the save timeout
  const clearSaveTimeout = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }
  }, []);

  // Start local saving state with safety timeout
  const startSaving = useCallback(() => {
    setIsSavingLocal(true);
    clearSaveTimeout();

    // Safety timeout: reset saving state if it takes too long
    saveTimeoutRef.current = setTimeout(() => {
      logger.warn(
        '[useAutoSave] Save timeout reached after',
        SAVE_TIMEOUT_MS,
        'ms - resetting saving state'
      );
      setIsSavingLocal(false);
    }, SAVE_TIMEOUT_MS);
  }, [clearSaveTimeout]);

  // End local saving state
  const endSaving = useCallback(() => {
    setIsSavingLocal(false);
    clearSaveTimeout();
  }, [clearSaveTimeout]);

  // Perform the save operation
  const performSave = useCallback(
    (options?: { completed?: boolean }) => {
      startSaving();
      onSaveStart?.();

      // Use explicitly provided completion status, or fall back to auto-detected completion
      // If the user manually marks complete (options.completed = true), honor that
      // Otherwise, use the continuously-tracked canComplete state from auto-detection
      let shouldComplete = options?.completed ?? false;

      // CRITICAL: If worksheet is already completed in the database, preserve that status
      // This prevents auto-save from downgrading completed=true → completed=false
      // Only allow progression from incomplete → complete, never complete → incomplete
      if (isCompleted) {
        shouldComplete = true;
      } else if (enableAutoComplete && !shouldComplete) {
        // Use the already-computed canComplete state (from the continuous useEffect)
        shouldComplete = canComplete;
      }

      save(
        { phaseNumber, worksheetId, data: dataRef.current, completed: shouldComplete },
        {
          onSuccess: () => {
            endSaving();
            const now = new Date();
            setLastSaved(now);
            onSaveSuccess?.(now, shouldComplete);
          },
          onError: (err) => {
            endSaving();
            // Always log errors to console for debugging
            logger.error(
              `[useAutoSave] Failed to save phase ${phaseNumber}, worksheet ${worksheetId}:`,
              err
            );
            onSaveError?.(err as Error);
          },
        }
      );
    },
    [
      phaseNumber,
      worksheetId,
      save,
      startSaving,
      endSaving,
      onSaveStart,
      onSaveSuccess,
      onSaveError,
      enableAutoComplete,
      canComplete,
      isCompleted,
    ]
  );

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
  const saveNow = useCallback(
    (options?: { completed?: boolean }) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      performSave(options);
    },
    [performSave]
  );

  // Convenience method to manually mark worksheet as complete
  const markComplete = useCallback(() => {
    saveNow({ completed: true });
  }, [saveNow]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      clearSaveTimeout();
    };
  }, [clearSaveTimeout]);

  // Use local saving state as primary, with isPending as fallback
  // This ensures we control the state and it can be reset by our safety timeout
  const isSaving = isSavingLocal || isPending;

  return {
    isSaving,
    isError,
    error: error as Error | null,
    lastSaved,
    saveNow,
    isAutoCompleted,
    canComplete,
    markComplete,
  };
}
