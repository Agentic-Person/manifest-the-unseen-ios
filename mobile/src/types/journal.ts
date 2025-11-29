/**
 * Journal Types
 *
 * Type definitions for journal entries and voice journaling.
 * Used across services, hooks, and components.
 */

/**
 * Journal Entry from database
 */
export interface JournalEntry {
  id: string;
  user_id: string;
  content: string;
  encrypted_content?: string | null;
  images: string[];
  tags: string[];
  mood?: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Create journal entry payload
 */
export interface CreateJournalEntry {
  content: string;
  images?: string[];
  tags?: string[];
  mood?: string;
}

/**
 * Update journal entry payload
 */
export interface UpdateJournalEntry {
  id: string;
  content?: string;
  images?: string[];
  tags?: string[];
  mood?: string;
}

/**
 * Journal entry for display (with computed fields)
 */
export interface JournalEntryDisplay extends JournalEntry {
  formattedDate: string;
  previewText: string;
}
