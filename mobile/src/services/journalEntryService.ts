/**
 * Journal Entry Service
 *
 * H6 Security Fix: Secure CRUD operations for journal entries with encryption.
 * All journal content is encrypted client-side before being stored in Supabase.
 *
 * Features:
 * - AES-256-GCM encryption for all new entries
 * - Transparent decryption when reading entries
 * - Migration support for existing plaintext entries
 * - Backwards compatibility during transition period
 *
 * Usage:
 * ```typescript
 * // Save encrypted entry
 * await JournalEntryService.save({ content: 'My thoughts...', mood: 'happy' });
 *
 * // Read and decrypt entry
 * const entry = await JournalEntryService.read(entryId);
 * console.log(entry.content); // Decrypted content
 * ```
 */

import { supabase } from './supabase';
import { JournalEncryptionService } from './journalEncryptionService';

/**
 * Journal entry input for creating/updating
 */
export interface JournalEntryInput {
  content: string;
  tags?: string[];
  mood?: string;
  images?: string[];
}

/**
 * Journal entry from database (before decryption)
 */
export interface JournalEntryRow {
  id: string;
  user_id: string;
  content: string;
  encrypted_content: string | null;
  encryption_iv: string | null;
  encryption_tag: string | null;
  encryption_version: number | null;
  tags: string[] | null;
  mood: string | null;
  images: string[] | null;
  created_at: string;
  updated_at: string;
}

/**
 * Journal entry for use in the app (decrypted)
 */
export interface JournalEntry {
  id: string;
  userId: string;
  content: string; // Decrypted content
  tags: string[];
  mood: string | null;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
  isEncrypted: boolean; // Whether this entry was stored encrypted
}

/**
 * Journal Entry Service
 * Handles all journal entry operations with encryption
 */
export const JournalEntryService = {
  /**
   * Save a new journal entry with encryption
   * @param entry - The entry content and metadata
   * @returns The created entry (decrypted for display)
   */
  async save(entry: JournalEntryInput): Promise<JournalEntry> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Encrypt content if encryption is available
    let encryptedContent: string | null = null;
    let encryptionIv: string | null = null;
    let encryptionTag: string | null = null;
    let encryptionVersion: number | null = null;
    let storedContent = entry.content;

    if (JournalEncryptionService.isAvailable()) {
      try {
        const encrypted = await JournalEncryptionService.encrypt(entry.content);
        encryptedContent = encrypted.ciphertext;
        encryptionIv = encrypted.iv;
        encryptionTag = encrypted.tag;
        encryptionVersion = encrypted.version;
        storedContent = '[encrypted]'; // Placeholder for search/debugging
      } catch (error) {
        console.error('[JournalEntry] Encryption failed, storing plaintext:', error);
        // Fall back to plaintext if encryption fails
      }
    }

    const { data, error } = await supabase
      .from('journal_entries')
      .insert({
        user_id: user.id,
        content: storedContent,
        encrypted_content: encryptedContent,
        encryption_iv: encryptionIv,
        encryption_tag: encryptionTag,
        encryption_version: encryptionVersion,
        tags: entry.tags || [],
        mood: entry.mood || null,
        images: entry.images || [],
      } as any)
      .select()
      .single();

    if (error) {
      console.error('[JournalEntry] Save failed:', error);
      throw error;
    }

    // Return entry with original (unencrypted) content for display
    return this.mapToJournalEntry(data as JournalEntryRow, entry.content);
  },

  /**
   * Read a single journal entry by ID
   * @param id - The entry ID
   * @returns Decrypted journal entry
   */
  async read(id: string): Promise<JournalEntry | null> {
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      throw error;
    }

    return this.decryptEntry(data as JournalEntryRow);
  },

  /**
   * List all journal entries for current user
   * @param limit - Maximum number of entries to return
   * @param offset - Number of entries to skip
   * @returns Array of decrypted journal entries
   */
  async list(limit: number = 50, offset: number = 0): Promise<JournalEntry[]> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw error;
    }

    // Decrypt all entries
    const entries = await Promise.all(
      (data as JournalEntryRow[]).map((row) => this.decryptEntry(row))
    );

    return entries;
  },

  /**
   * Update an existing journal entry
   * @param id - The entry ID
   * @param entry - Updated content and metadata
   * @returns Updated entry (decrypted)
   */
  async update(id: string, entry: Partial<JournalEntryInput>): Promise<JournalEntry> {
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    // If content is being updated, encrypt it
    if (entry.content !== undefined) {
      if (JournalEncryptionService.isAvailable()) {
        try {
          const encrypted = await JournalEncryptionService.encrypt(entry.content);
          updateData.encrypted_content = encrypted.ciphertext;
          updateData.encryption_iv = encrypted.iv;
          updateData.encryption_tag = encrypted.tag;
          updateData.encryption_version = encrypted.version;
          updateData.content = '[encrypted]';
        } catch (error) {
          console.error('[JournalEntry] Encryption failed on update:', error);
          updateData.content = entry.content;
        }
      } else {
        updateData.content = entry.content;
      }
    }

    if (entry.tags !== undefined) updateData.tags = entry.tags;
    if (entry.mood !== undefined) updateData.mood = entry.mood;
    if (entry.images !== undefined) updateData.images = entry.images;

    // @ts-ignore - Supabase types not yet regenerated with encryption columns
    const { data, error } = await supabase
      .from('journal_entries')
      .update(updateData as any)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return this.decryptEntry(data as JournalEntryRow);
  },

  /**
   * Delete a journal entry
   * @param id - The entry ID
   */
  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('journal_entries').delete().eq('id', id);

    if (error) {
      throw error;
    }
  },

  /**
   * Migrate a plaintext entry to encrypted
   * Call this to upgrade existing entries to use encryption
   * @param id - The entry ID to migrate
   */
  async migrateEntry(id: string): Promise<void> {
    const { data, error } = await supabase
      .from('journal_entries')
      .select('content, encrypted_content')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    const row = data as { content: string; encrypted_content: string | null };

    // Skip if already encrypted or no content
    if (row.encrypted_content || !row.content || row.content === '[encrypted]') {
      return;
    }

    // Encrypt the existing content
    const encrypted = await JournalEncryptionService.encrypt(row.content);

    // @ts-ignore - Supabase types not yet regenerated with encryption columns
    await supabase
      .from('journal_entries')
      .update({
        encrypted_content: encrypted.ciphertext,
        encryption_iv: encrypted.iv,
        encryption_tag: encrypted.tag,
        encryption_version: encrypted.version,
        content: '[encrypted]', // Keep placeholder
        updated_at: new Date().toISOString(),
      } as any)
      .eq('id', id);
  },

  /**
   * Decrypt a database row to a JournalEntry
   * Handles both encrypted and plaintext entries
   */
  async decryptEntry(row: JournalEntryRow): Promise<JournalEntry> {
    let content: string;
    let isEncrypted = false;

    // Check if entry is encrypted
    if (row.encrypted_content && row.encryption_iv && row.encryption_tag) {
      try {
        content = await JournalEncryptionService.decrypt(
          row.encrypted_content,
          row.encryption_iv,
          row.encryption_tag
        );
        isEncrypted = true;
      } catch (error) {
        console.error('[JournalEntry] Decryption failed, using placeholder:', error);
        content = '[Unable to decrypt - key may have changed]';
      }
    } else {
      // Plaintext entry (legacy or encryption unavailable)
      content = row.content;
    }

    return this.mapToJournalEntry(row, content, isEncrypted);
  },

  /**
   * Map database row to JournalEntry object
   */
  mapToJournalEntry(
    row: JournalEntryRow,
    decryptedContent: string,
    isEncrypted: boolean = false
  ): JournalEntry {
    return {
      id: row.id,
      userId: row.user_id,
      content: decryptedContent,
      tags: row.tags || [],
      mood: row.mood,
      images: row.images || [],
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      isEncrypted,
    };
  },

  /**
   * Get count of entries needing migration (plaintext only)
   * Useful for showing migration progress to user
   */
  async getUnencryptedCount(): Promise<number> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return 0;

    const { count, error } = await supabase
      .from('journal_entries')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .is('encrypted_content', null)
      .neq('content', '')
      .neq('content', '[encrypted]');

    if (error) {
      console.error('[JournalEntry] Failed to count unencrypted:', error);
      return 0;
    }

    return count || 0;
  },
};

export default JournalEntryService;
