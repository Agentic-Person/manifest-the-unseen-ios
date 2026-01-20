/**
 * Data Export Service
 *
 * Allows users to export all their personal data as JSON.
 * Required for GDPR/Privacy compliance and promised in Privacy Policy.
 */

import { Paths, File } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { supabase } from './supabase';
import { JournalEncryptionService } from './journalEncryptionService';
import { logger } from '../utils/logger';

/**
 * User data structure for export
 */
export interface ExportedUserData {
  exportDate: string;
  appVersion: string;
  profile: {
    email: string;
    fullName: string | null;
    createdAt: string;
    subscriptionTier: string;
    subscriptionStatus: string;
  } | null;
  workbookProgress: Array<{
    phaseNumber: number;
    worksheetId: string;
    data: Record<string, unknown>;
    completed: boolean;
    completedAt: string | null;
    createdAt: string;
    updatedAt: string;
  }>;
  journalEntries: Array<{
    content: string;
    tags: string[];
    mood: string | null;
    createdAt: string;
    updatedAt: string;
  }>;
  meditationSessions: Array<{
    meditationTitle: string;
    completed: boolean;
    durationSeconds: number | null;
    completedAt: string | null;
    createdAt: string;
  }>;
  guruSessions: Array<{
    phaseNumber: number;
    messages: unknown[];
    createdAt: string;
    updatedAt: string;
  }>;
}

/**
 * Export result
 */
export interface ExportResult {
  success: boolean;
  filePath?: string;
  error?: string;
}

/**
 * Fetch all user data from Supabase
 */
export async function fetchUserData(): Promise<ExportedUserData | null> {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      logger.error('[DataExport] No authenticated user');
      return null;
    }

    const userId = user.id;
    logger.debug('[DataExport] Fetching user data');

    // Fetch user profile
    const { data: profileData } = await supabase
      .from('users')
      .select('email, full_name, created_at, subscription_tier, subscription_status')
      .eq('id', userId)
      .single();

    // Fetch workbook progress
    const { data: workbookData } = await supabase
      .from('workbook_progress')
      .select('phase_number, worksheet_id, data, completed, completed_at, created_at, updated_at')
      .eq('user_id', userId)
      .order('phase_number', { ascending: true })
      .order('created_at', { ascending: true });

    // Fetch journal entries (including encryption fields for H6)
    const { data: journalData } = await supabase
      .from('journal_entries')
      .select('content, encrypted_content, encryption_iv, encryption_tag, tags, mood, created_at, updated_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    // Fetch meditation sessions with meditation titles
    const { data: meditationData } = await supabase
      .from('meditation_sessions')
      .select(`
        completed,
        duration_seconds,
        completed_at,
        created_at,
        meditations (title)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    // Fetch guru sessions
    const { data: guruData } = await supabase
      .from('guru_sessions')
      .select('phase_number, messages, created_at, updated_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    // Build export data with proper type handling
    const profile = profileData as {
      email: string;
      full_name: string | null;
      created_at: string;
      subscription_tier: string;
      subscription_status: string;
    } | null;

    const workbook = (workbookData || []) as Array<{
      phase_number: number;
      worksheet_id: string;
      data: Record<string, unknown>;
      completed: boolean;
      completed_at: string | null;
      created_at: string;
      updated_at: string;
    }>;

    const journal = (journalData || []) as Array<{
      content: string;
      encrypted_content: string | null;
      encryption_iv: string | null;
      encryption_tag: string | null;
      tags: string[] | null;
      mood: string | null;
      created_at: string;
      updated_at: string;
    }>;

    // H6 Security Fix: Decrypt journal entries before export
    const decryptedJournal = await Promise.all(
      journal.map(async (item) => {
        let content = item.content;

        // If encrypted, decrypt for export
        if (item.encrypted_content && item.encryption_iv && item.encryption_tag) {
          try {
            content = await JournalEncryptionService.decrypt(
              item.encrypted_content,
              item.encryption_iv,
              item.encryption_tag
            );
          } catch (error) {
            logger.error('[DataExport] Failed to decrypt journal entry:', error);
            content = '[Unable to decrypt - encryption key may have changed]';
          }
        }

        return {
          content,
          tags: item.tags,
          mood: item.mood,
          created_at: item.created_at,
          updated_at: item.updated_at,
        };
      })
    );

    const meditation = (meditationData || []) as Array<{
      completed: boolean;
      duration_seconds: number | null;
      completed_at: string | null;
      created_at: string;
      meditations: { title: string } | null;
    }>;

    const guru = (guruData || []) as Array<{
      phase_number: number;
      messages: unknown[];
      created_at: string;
      updated_at: string;
    }>;

    const exportData: ExportedUserData = {
      exportDate: new Date().toISOString(),
      appVersion: '1.0.0',
      profile: profile ? {
        email: profile.email,
        fullName: profile.full_name,
        createdAt: profile.created_at,
        subscriptionTier: profile.subscription_tier,
        subscriptionStatus: profile.subscription_status,
      } : null,
      workbookProgress: workbook.map((item) => ({
        phaseNumber: item.phase_number,
        worksheetId: item.worksheet_id,
        data: item.data,
        completed: item.completed,
        completedAt: item.completed_at,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      })),
      journalEntries: decryptedJournal.map((item) => ({
        content: item.content,
        tags: item.tags || [],
        mood: item.mood,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      })),
      meditationSessions: meditation.map((item) => ({
        meditationTitle: item.meditations?.title || 'Unknown',
        completed: item.completed,
        durationSeconds: item.duration_seconds,
        completedAt: item.completed_at,
        createdAt: item.created_at,
      })),
      guruSessions: guru.map((item) => ({
        phaseNumber: item.phase_number,
        messages: item.messages,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      })),
    };

    logger.debug('[DataExport] Data fetched successfully');
    return exportData;

  } catch (error) {
    logger.error('[DataExport] Error fetching data:', error);
    return null;
  }
}

/**
 * Export user data to a JSON file and share it
 */
export async function exportUserData(): Promise<ExportResult> {
  try {
    logger.debug('[DataExport] Starting export...');

    // Fetch all user data
    const userData = await fetchUserData();
    if (!userData) {
      return {
        success: false,
        error: 'Failed to fetch your data. Please try again.',
      };
    }

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `manifest-data-export-${timestamp}.json`;
    const exportFile = new File(Paths.cache, fileName);

    // Write data to file
    const jsonString = JSON.stringify(userData, null, 2);
    await exportFile.create();
    await exportFile.write(jsonString);

    const filePath = exportFile.uri;
    logger.debug('[DataExport] File written to:', filePath);

    // Check if sharing is available
    const isSharingAvailable = await Sharing.isAvailableAsync();
    if (!isSharingAvailable) {
      return {
        success: false,
        error: 'Sharing is not available on this device.',
      };
    }

    // Share the file
    await Sharing.shareAsync(filePath, {
      mimeType: 'application/json',
      dialogTitle: 'Export Your Data',
      UTI: 'public.json',
    });

    logger.debug('[DataExport] Export completed successfully');

    return {
      success: true,
      filePath,
    };

  } catch (error) {
    logger.error('[DataExport] Export error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred.',
    };
  }
}

/**
 * Get a summary of user data (counts only, no content)
 */
export async function getDataSummary(): Promise<{
  workbookEntries: number;
  journalEntries: number;
  meditationSessions: number;
  guruSessions: number;
} | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const userId = user.id;

    const [workbook, journal, meditation, guru] = await Promise.all([
      supabase.from('workbook_progress').select('id', { count: 'exact', head: true }).eq('user_id', userId),
      supabase.from('journal_entries').select('id', { count: 'exact', head: true }).eq('user_id', userId),
      supabase.from('meditation_sessions').select('id', { count: 'exact', head: true }).eq('user_id', userId),
      supabase.from('guru_sessions').select('id', { count: 'exact', head: true }).eq('user_id', userId),
    ]);

    return {
      workbookEntries: workbook.count || 0,
      journalEntries: journal.count || 0,
      meditationSessions: meditation.count || 0,
      guruSessions: guru.count || 0,
    };
  } catch (error) {
    logger.error('[DataExport] Error getting data summary:', error);
    return null;
  }
}
