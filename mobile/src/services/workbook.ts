/**
 * Workbook Service
 *
 * Supabase CRUD operations for the workbook_progress table.
 * Provides functions for saving, loading, and managing worksheet data.
 */

import { supabase } from './supabase';
import type {
  WorkbookProgress,
  WorkbookProgressInsert,
} from '../types/workbook';

/**
 * Timeout helper for web platform where Supabase queries can hang
 */
const withTimeout = <T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> => {
  const timeout = new Promise<T>((resolve) => {
    setTimeout(() => {
      console.log('[workbook.service] Query timed out after', ms, 'ms');
      resolve(fallback);
    }, ms);
  });
  return Promise.race([promise, timeout]);
};

/**
 * Get single worksheet progress
 */
export const getWorkbookProgress = async (
  userId: string,
  phaseNumber: number,
  worksheetId: string
): Promise<WorkbookProgress | null> => {
  console.log('[workbook.service] Starting query:', { userId, phaseNumber, worksheetId });

  try {
    const queryPromise = supabase
      .from('workbook_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('phase_number', phaseNumber)
      .eq('worksheet_id', worksheetId)
      .single();

    // On web, add a timeout to prevent infinite loading if Supabase SDK hangs
    const { data, error } = await withTimeout(
      queryPromise,
      5000, // 5 second timeout
      { data: null, error: { code: 'TIMEOUT', message: 'Query timed out' } } as any
    );

    console.log('[workbook.service] Query completed:', { data, error });

    // PGRST116 = no rows returned, TIMEOUT = our timeout, both are fine for new worksheets
    if (error && error.code !== 'PGRST116' && error.code !== 'TIMEOUT') {
      console.error('[workbook.service] Query error (not PGRST116/TIMEOUT):', error);
      throw error;
    }

    console.log('[workbook.service] Returning data:', data);
    return data as WorkbookProgress | null;
  } catch (err) {
    console.error('[workbook.service] Exception in getWorkbookProgress:', err);
    throw err;
  }
};

/**
 * Get all progress for a user
 */
export const getAllWorkbookProgress = async (
  userId: string
): Promise<WorkbookProgress[]> => {
  const { data, error } = await supabase
    .from('workbook_progress')
    .select('*')
    .eq('user_id', userId)
    .order('phase_number', { ascending: true });

  if (error) throw error;
  return (data as WorkbookProgress[]) || [];
};

/**
 * Get progress summary for a phase
 */
export const getPhaseProgress = async (
  userId: string,
  phaseNumber: number
): Promise<{ completed: number; total: number; worksheets: WorkbookProgress[] }> => {
  const { data, error } = await supabase
    .from('workbook_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('phase_number', phaseNumber);

  if (error) throw error;

  const worksheets = (data as WorkbookProgress[]) || [];
  const completed = worksheets.filter((w) => w.completed).length;

  // Total worksheets per phase (from PRD)
  const totalPerPhase: Record<number, number> = {
    1: 4,
    2: 3,
    3: 3,
    4: 3,
    5: 3,
    6: 3,
    7: 3,
    8: 3,
    9: 3,
    10: 3,
  };

  return {
    completed,
    total: totalPerPhase[phaseNumber] || 3,
    worksheets,
  };
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

  console.log('[workbook.service] Starting upsert:', { phaseNumber, worksheetId, completed });

  try {
    // @ts-ignore - Supabase types not yet generated, but table exists
    const upsertPromise = supabase
      .from('workbook_progress')
      .upsert(payload as any, {
        onConflict: 'user_id,phase_number,worksheet_id',
      })
      .select()
      .single();

    // On web, add a timeout to prevent UI hanging if Supabase SDK freezes
    const { data: result, error } = await withTimeout(
      upsertPromise,
      8000, // 8 second timeout for writes
      { data: payload, error: { code: 'TIMEOUT', message: 'Upsert timed out' } } as any
    );

    console.log('[workbook.service] Upsert completed:', { result: result ? 'success' : 'null', error });

    // If timeout occurred, return the payload as if it succeeded (optimistic)
    if (error && error.code === 'TIMEOUT') {
      console.warn('[workbook.service] Upsert timed out - returning optimistic result');
      return {
        ...payload,
        id: `temp-${Date.now()}`,
        created_at: new Date().toISOString(),
      } as WorkbookProgress;
    }

    if (error) {
      console.error(
        `[workbook.service] Upsert failed for phase ${phaseNumber}, worksheet ${worksheetId}:`,
        {
          error,
          payload: { ...payload, data: '[omitted for brevity]' },
          userId,
        }
      );
      throw error;
    }
    return result as WorkbookProgress;
  } catch (err) {
    console.error('[workbook.service] Exception in upsertWorkbookProgress:', err);
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
  // @ts-ignore - Supabase types not yet generated, but table exists
  const { data, error } = await supabase
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

  if (error) throw error;
  return data as WorkbookProgress;
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

  if (error) throw error;
};

/**
 * Reset all progress for a phase
 */
export const resetPhaseProgress = async (
  userId: string,
  phaseNumber: number
): Promise<void> => {
  const { error } = await supabase
    .from('workbook_progress')
    .delete()
    .eq('user_id', userId)
    .eq('phase_number', phaseNumber);

  if (error) throw error;
};

/**
 * Reset all workbook progress for a user
 */
export const resetAllProgress = async (userId: string): Promise<void> => {
  const { error } = await supabase
    .from('workbook_progress')
    .delete()
    .eq('user_id', userId);

  if (error) throw error;
};
