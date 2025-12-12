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
import { JournalEncryption } from '../utils/secureStorage';

/**
 * Timeout helper for web platform where Supabase queries can hang
 */
const withTimeout = <T>(promise: PromiseLike<T>, ms: number, fallback: T): Promise<T> => {
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
      .single().then(r => r);

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
      .single().then(r => r);

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
    .single().then(r => r);

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

/**
 * ========================================
 * JOURNAL ENTRY ENCRYPTION HELPERS
 * ========================================
 * These functions help encrypt/decrypt sensitive journal entries
 * before storing them in the database.
 */

/**
 * Identify fields that should be encrypted in worksheet data
 */
const ENCRYPTED_FIELD_PATTERNS = [
  'journal',
  'reflection',
  'thoughts',
  'notes',
  'entry',
  'answer',
  'response',
  'description',
  'story',
  'experience',
];

/**
 * Check if a field name indicates sensitive content
 */
const isSensitiveField = (fieldName: string): boolean => {
  const lowerFieldName = fieldName.toLowerCase();
  return ENCRYPTED_FIELD_PATTERNS.some(pattern => lowerFieldName.includes(pattern));
};

/**
 * Recursively encrypt sensitive fields in worksheet data
 *
 * @param data - Worksheet data object
 * @returns Data with sensitive fields encrypted
 */
export const encryptWorksheetData = async (
  data: Record<string, unknown>
): Promise<Record<string, unknown>> => {
  const encrypted: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data)) {
    // Skip null/undefined values
    if (value === null || value === undefined) {
      encrypted[key] = value;
      continue;
    }

    // Encrypt string fields that match sensitive patterns
    if (typeof value === 'string' && isSensitiveField(key)) {
      try {
        encrypted[key] = await JournalEncryption.encrypt(value);
        console.log(`[workbook.service] Encrypted field: ${key}`);
      } catch (error) {
        console.error(`[workbook.service] Failed to encrypt field ${key}:`, error);
        // Fall back to unencrypted if encryption fails
        encrypted[key] = value;
      }
      continue;
    }

    // Recursively handle nested objects
    if (typeof value === 'object' && !Array.isArray(value)) {
      encrypted[key] = await encryptWorksheetData(value as Record<string, unknown>);
      continue;
    }

    // Handle arrays of objects
    if (Array.isArray(value)) {
      encrypted[key] = await Promise.all(
        value.map(async (item) => {
          if (typeof item === 'object' && item !== null) {
            return await encryptWorksheetData(item as Record<string, unknown>);
          }
          return item;
        })
      );
      continue;
    }

    // Pass through other types unchanged
    encrypted[key] = value;
  }

  return encrypted;
};

/**
 * Recursively decrypt sensitive fields in worksheet data
 *
 * @param data - Worksheet data object (with encrypted fields)
 * @returns Data with sensitive fields decrypted
 */
export const decryptWorksheetData = async (
  data: Record<string, unknown>
): Promise<Record<string, unknown>> => {
  const decrypted: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data)) {
    // Skip null/undefined values
    if (value === null || value === undefined) {
      decrypted[key] = value;
      continue;
    }

    // Decrypt string fields that match sensitive patterns
    if (typeof value === 'string' && isSensitiveField(key)) {
      try {
        decrypted[key] = await JournalEncryption.decrypt(value);
        console.log(`[workbook.service] Decrypted field: ${key}`);
      } catch (error) {
        console.error(`[workbook.service] Failed to decrypt field ${key}:`, error);
        // Fall back to raw value if decryption fails (might not be encrypted)
        decrypted[key] = value;
      }
      continue;
    }

    // Recursively handle nested objects
    if (typeof value === 'object' && !Array.isArray(value)) {
      decrypted[key] = await decryptWorksheetData(value as Record<string, unknown>);
      continue;
    }

    // Handle arrays of objects
    if (Array.isArray(value)) {
      decrypted[key] = await Promise.all(
        value.map(async (item) => {
          if (typeof item === 'object' && item !== null) {
            return await decryptWorksheetData(item as Record<string, unknown>);
          }
          return item;
        })
      );
      continue;
    }

    // Pass through other types unchanged
    decrypted[key] = value;
  }

  return decrypted;
};

/**
 * Upsert worksheet progress WITH encryption for sensitive fields
 *
 * This is a wrapper around upsertWorkbookProgress that automatically
 * encrypts sensitive journal/reflection fields before saving.
 *
 * @param userId - User ID
 * @param phaseNumber - Phase number (1-10)
 * @param worksheetId - Worksheet identifier
 * @param data - Worksheet data (will be encrypted)
 * @param completed - Whether worksheet is completed
 * @returns Saved progress with decrypted data
 */
export const upsertWorkbookProgressEncrypted = async (
  userId: string,
  phaseNumber: number,
  worksheetId: string,
  data: Record<string, unknown>,
  completed: boolean = false
): Promise<WorkbookProgress> => {
  // Encrypt sensitive fields before saving
  const encryptedData = await encryptWorksheetData(data);

  // Save to database with encrypted data
  const savedProgress = await upsertWorkbookProgress(
    userId,
    phaseNumber,
    worksheetId,
    encryptedData,
    completed
  );

  // Return with decrypted data for immediate use
  return {
    ...savedProgress,
    data: await decryptWorksheetData(savedProgress.data as Record<string, unknown>),
  };
};

/**
 * Get worksheet progress WITH decryption for sensitive fields
 *
 * This is a wrapper around getWorkbookProgress that automatically
 * decrypts sensitive journal/reflection fields after loading.
 *
 * @param userId - User ID
 * @param phaseNumber - Phase number (1-10)
 * @param worksheetId - Worksheet identifier
 * @returns Progress with decrypted data, or null if not found
 */
export const getWorkbookProgressDecrypted = async (
  userId: string,
  phaseNumber: number,
  worksheetId: string
): Promise<WorkbookProgress | null> => {
  const progress = await getWorkbookProgress(userId, phaseNumber, worksheetId);

  if (!progress) {
    return null;
  }

  // Decrypt sensitive fields
  return {
    ...progress,
    data: await decryptWorksheetData(progress.data as Record<string, unknown>),
  };
};
