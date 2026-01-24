/**
 * Workbook Service
 *
 * Supabase CRUD operations for the workbook_progress table.
 * Provides functions for saving, loading, and managing worksheet data.
 */

import { supabase } from './supabase';
import { invalidateGuruQueries } from './queryClient';
import { logger } from '../utils/logger';
import type { WorkbookProgress, WorkbookProgressInsert } from '../types/workbook';

/**
 * Check if the Supabase client session is valid
 * This helps catch auth issues before they cause hanging mutations
 *
 * Uses retry logic with exponential backoff to handle token refresh timing issues
 */
const ensureValidSession = async (): Promise<void> => {
  const MAX_RETRIES = 3;
  const RETRY_DELAYS = [200, 400, 800]; // Exponential backoff in milliseconds

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      // Use a shorter timeout for session check (5 seconds)
      const sessionPromise = supabase.auth.getSession();
      const {
        data: { session },
        error,
      } = await withTimeout(sessionPromise, 5000, 'Session validation');

      if (error) {
        lastError = new Error('Authentication session invalid');
        logger.error(
          `[workbook.service] Session check failed (attempt ${attempt + 1}/${MAX_RETRIES}):`,
          error
        );

        // If this is not the last attempt, wait before retrying
        if (attempt < MAX_RETRIES - 1) {
          await new Promise((resolve) => setTimeout(resolve, RETRY_DELAYS[attempt]));
          continue; // Retry
        }
        throw lastError;
      }

      if (!session) {
        lastError = new Error('No active authentication session');
        logger.error(
          `[workbook.service] No active session found (attempt ${attempt + 1}/${MAX_RETRIES})`
        );

        // If this is not the last attempt, wait before retrying
        if (attempt < MAX_RETRIES - 1) {
          await new Promise((resolve) => setTimeout(resolve, RETRY_DELAYS[attempt]));
          continue; // Retry
        }
        throw lastError;
      }

      // Check if session is expired
      if (session.expires_at) {
        const expiresAt = session.expires_at * 1000; // Convert to milliseconds
        const now = Date.now();
        if (expiresAt < now) {
          lastError = new Error('Session expired - please sign in again');
          logger.error(
            `[workbook.service] Session expired (attempt ${attempt + 1}/${MAX_RETRIES})`
          );

          // If this is not the last attempt, wait before retrying
          if (attempt < MAX_RETRIES - 1) {
            await new Promise((resolve) => setTimeout(resolve, RETRY_DELAYS[attempt]));
            continue; // Retry
          }
          throw lastError;
        }
      }

      // Session is valid - success!
      if (attempt > 0) {
        logger.debug(`[workbook.service] Session valid on attempt ${attempt + 1}/${MAX_RETRIES}`);
      }
      logger.debug(
        '[workbook.service] Session is valid, expires in',
        session.expires_at ? Math.round((session.expires_at * 1000 - Date.now()) / 1000 / 60) : '?',
        'minutes'
      );
      return; // Success - exit the function
    } catch (err) {
      lastError = err as Error;
      logger.error(
        `[workbook.service] Session validation error (attempt ${attempt + 1}/${MAX_RETRIES}):`,
        err
      );

      // If this is not the last attempt, wait before retrying
      if (attempt < MAX_RETRIES - 1) {
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAYS[attempt]));
        continue; // Retry
      }
      throw err; // Last attempt failed - throw the error
    }
  }

  // If we get here, all retries failed
  throw lastError || new Error('Session validation failed after retries');
};

/**
 * Timeout helper that rejects instead of resolving with fallback
 * This ensures mutations actually fail instead of returning fake data
 */
const withTimeout = <T>(
  promise: PromiseLike<T>,
  ms: number,
  operationName: string = 'Query'
): Promise<T> => {
  let timeoutId: NodeJS.Timeout;

  const timeoutPromise = new Promise<T>((_, reject) => {
    timeoutId = setTimeout(() => {
      logger.error(`[workbook.service] ${operationName} timed out after ${ms}ms`);
      reject(new Error(`${operationName} timed out after ${ms}ms`));
    }, ms);
  });

  return Promise.race([
    promise.then((result) => {
      clearTimeout(timeoutId);
      return result;
    }),
    timeoutPromise,
  ]);
};

/**
 * Get single worksheet progress
 */
export const getWorkbookProgress = async (
  userId: string,
  phaseNumber: number,
  worksheetId: string
): Promise<WorkbookProgress | null> => {
  // H3 Security Fix: Only log in development, exclude userId
  logger.debug('[workbook.service] Starting query:', { phaseNumber, worksheetId });

  try {
    const queryPromise = supabase
      .from('workbook_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('phase_number', phaseNumber)
      .eq('worksheet_id', worksheetId)
      .single();

    // Add timeout to prevent hanging (15 seconds for mobile networks)
    const { data, error } = await withTimeout(queryPromise, 15000, 'getWorkbookProgress');

    logger.debug('[workbook.service] Query completed:', { hasData: !!data, error });

    // PGRST116 = no rows returned, which is fine for new worksheets
    if (error && error.code !== 'PGRST116') {
      logger.error('[workbook.service] Query error:', error);
      throw error;
    }

    logger.debug('[workbook.service] Returning data:', !!data);
    return data as WorkbookProgress | null;
  } catch (err) {
    logger.error('[workbook.service] Exception in getWorkbookProgress:', err);
    throw err;
  }
};

/**
 * Get all progress for a user
 */
export const getAllWorkbookProgress = async (userId: string): Promise<WorkbookProgress[]> => {
  logger.debug('[workbook.service] Starting getAllWorkbookProgress query');

  try {
    const queryPromise = supabase
      .from('workbook_progress')
      .select('*')
      .eq('user_id', userId)
      .order('phase_number', { ascending: true });

    // Add timeout to prevent hanging (15 seconds for mobile networks)
    const { data, error } = await withTimeout(queryPromise, 15000, 'getAllWorkbookProgress');

    logger.debug('[workbook.service] getAllWorkbookProgress completed:', {
      hasData: !!data,
      count: data?.length,
      error,
    });

    if (error) {
      throw error;
    }
    return (data as WorkbookProgress[]) || [];
  } catch (err) {
    logger.error('[workbook.service] Exception in getAllWorkbookProgress:', err);
    throw err;
  }
};

/**
 * Get progress summary for a phase
 */
export const getPhaseProgress = async (
  userId: string,
  phaseNumber: number
): Promise<{ completed: number; total: number; worksheets: WorkbookProgress[] }> => {
  logger.debug('[workbook.service] Starting getPhaseProgress query:', { phaseNumber });

  // Total worksheets per phase (must match exercise counts in each Phase Dashboard)
  const totalPerPhase: Record<number, number> = {
    1: 11, // 11 exercises in Phase1Dashboard
    2: 2, // 2 exercises in Phase2Dashboard (life-mission, vision-board)
    3: 3,
    4: 3,
    5: 3,
    6: 3,
    7: 3,
    8: 3,
    9: 3,
    10: 3,
  };

  try {
    const queryPromise = supabase
      .from('workbook_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('phase_number', phaseNumber);

    // Add timeout to prevent hanging (15 seconds for mobile networks)
    const { data, error } = await withTimeout(queryPromise, 15000, 'getPhaseProgress');

    logger.debug('[workbook.service] getPhaseProgress completed:', {
      phaseNumber,
      hasData: !!data,
      count: data?.length,
      error,
    });

    if (error) {
      throw error;
    }

    const worksheets = (data as WorkbookProgress[]) || [];
    const completed = worksheets.filter((w) => w.completed).length;

    return {
      completed,
      total: totalPerPhase[phaseNumber] || 3,
      worksheets,
    };
  } catch (err) {
    logger.error('[workbook.service] Exception in getPhaseProgress:', err);
    throw err;
  }
};

/**
 * Retry helper with exponential backoff
 */
const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelayMs: number = 1000
): Promise<T> => {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      // Don't retry on certain errors
      if (error && typeof error === 'object' && 'code' in error) {
        const code = (error as any).code;
        // Don't retry on auth errors or validation errors
        if (code === 'PGRST301' || code === '23505' || code?.startsWith('42')) {
          throw error;
        }
      }

      // Last attempt - throw the error
      if (attempt === maxRetries - 1) {
        break;
      }

      // Calculate delay with exponential backoff
      const delayMs = initialDelayMs * Math.pow(2, attempt);
      logger.debug(
        `[workbook.service] Retry attempt ${attempt + 1}/${maxRetries} after ${delayMs}ms`
      );

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  throw lastError || new Error('Operation failed after retries');
};

/**
 * Upsert (create or update) worksheet progress
 */
export const upsertWorkbookProgress = async (
  userId: string,
  phaseNumber: number,
  worksheetId: string,
  data: Record<string, unknown>,
  completed: boolean = false
): Promise<WorkbookProgress> => {
  const payload: WorkbookProgressInsert = {
    user_id: userId,
    phase_number: phaseNumber,
    worksheet_id: worksheetId,
    data,
    completed,
    completed_at: completed ? new Date().toISOString() : null,
    updated_at: new Date().toISOString(),
  };

  logger.debug('[workbook.service] Starting upsert:', { phaseNumber, worksheetId, completed });

  try {
    // Verify session is valid before attempting save
    // This catches auth issues early instead of letting the mutation hang
    await ensureValidSession();

    // Wrap the upsert in retry logic
    const result = await retryWithBackoff(async () => {
      // @ts-ignore - Supabase types not yet generated, but table exists
      const upsertPromise = supabase
        .from('workbook_progress')
        .upsert(payload as any, {
          onConflict: 'user_id,phase_number,worksheet_id',
        })
        .select()
        .single();

      // Add timeout to prevent hanging (20 seconds for write operations on mobile)
      const { data: result, error } = await withTimeout(
        upsertPromise,
        20000,
        'upsertWorkbookProgress'
      );

      logger.debug('[workbook.service] Upsert completed:', {
        result: result ? 'success' : 'null',
        error,
      });

      if (error) {
        // H3 Security Fix: Don't log userId in production
        logger.error(
          `[workbook.service] Upsert failed for phase ${phaseNumber}, worksheet ${worksheetId}:`,
          { error }
        );
        throw error;
      }

      return result as WorkbookProgress;
    }, 3); // Retry up to 3 times

    // Invalidate Guru queries so it fetches fresh workbook data for re-assessment
    // This ensures the Guru AI sees the latest workbook responses
    invalidateGuruQueries(userId);
    logger.debug('[workbook.service] Invalidated Guru queries');

    return result;
  } catch (err) {
    logger.error('[workbook.service] Exception in upsertWorkbookProgress after retries:', err);
    throw err;
  }
};

/**
 * Mark worksheet as complete
 */
export const markWorksheetComplete = async (
  userId: string,
  phaseNumber: number,
  worksheetId: string
): Promise<WorkbookProgress> => {
  try {
    // @ts-ignore - Supabase types not yet generated, but table exists
    const updatePromise = supabase
      .from('workbook_progress')
      // @ts-ignore
      .update({
        completed: true,
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as any)
      .eq('user_id', userId)
      .eq('phase_number', phaseNumber)
      .eq('worksheet_id', worksheetId)
      .select()
      .single();

    const { data, error } = await withTimeout(updatePromise, 20000, 'markWorksheetComplete');

    if (error) {
      throw error;
    }
    return data as WorkbookProgress;
  } catch (err) {
    logger.error('[workbook.service] Exception in markWorksheetComplete:', err);
    throw err;
  }
};

/**
 * Delete worksheet progress (for reset functionality)
 */
export const deleteWorkbookProgress = async (
  userId: string,
  phaseNumber: number,
  worksheetId: string
): Promise<void> => {
  const { error } = await supabase
    .from('workbook_progress')
    .delete()
    .eq('user_id', userId)
    .eq('phase_number', phaseNumber)
    .eq('worksheet_id', worksheetId);

  if (error) {
    throw error;
  }
};

/**
 * Reset all progress for a phase
 */
export const resetPhaseProgress = async (userId: string, phaseNumber: number): Promise<void> => {
  const { error } = await supabase
    .from('workbook_progress')
    .delete()
    .eq('user_id', userId)
    .eq('phase_number', phaseNumber);

  if (error) {
    throw error;
  }
};

/**
 * Reset all workbook progress for a user
 */
export const resetAllProgress = async (userId: string): Promise<void> => {
  const { error } = await supabase.from('workbook_progress').delete().eq('user_id', userId);

  if (error) {
    throw error;
  }
};
