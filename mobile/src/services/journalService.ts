/**
 * Journal Service
 *
 * Supabase CRUD operations for journal entries.
 * Handles text entries, image uploads, and storage management.
 */

import { supabase } from './supabase';
import type { JournalEntry, CreateJournalEntry, UpdateJournalEntry } from '../types/journal';

/**
 * Create a new journal entry
 */
export async function createJournalEntry(
  userId: string,
  entry: CreateJournalEntry
): Promise<JournalEntry> {
  // @ts-ignore - images column not yet in generated types, will be added by migration
  const { data, error } = await supabase
    .from('journal_entries')
    .insert({
      user_id: userId,
      content: entry.content,
      images: entry.images || [],
      tags: entry.tags || [],
      mood: entry.mood || null,
    } as any)
    .select()
    .single();

  if (error) throw error;
  return data as JournalEntry;
}

/**
 * Get all journal entries for user (newest first)
 */
export async function getJournalEntries(
  userId: string,
  limit: number = 50,
  offset: number = 0
): Promise<JournalEntry[]> {
  const { data, error } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return (data as JournalEntry[]) || [];
}

/**
 * Get a single journal entry by ID
 */
export async function getJournalEntry(id: string): Promise<JournalEntry | null> {
  const { data, error } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('id', id)
    .single();

  // PGRST116 = no rows returned
  if (error && error.code !== 'PGRST116') throw error;
  return data as JournalEntry | null;
}

/**
 * Update a journal entry
 */
export async function updateJournalEntry(
  id: string,
  updates: Omit<UpdateJournalEntry, 'id'>
): Promise<JournalEntry> {
  const payload: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (updates.content !== undefined) payload.content = updates.content;
  if (updates.images !== undefined) payload.images = updates.images;
  if (updates.tags !== undefined) payload.tags = updates.tags;
  if (updates.mood !== undefined) payload.mood = updates.mood;

  // @ts-ignore - images column not yet in generated types, will be added by migration
  const { data, error } = await (supabase
    .from('journal_entries') as any)
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as JournalEntry;
}

/**
 * Delete a journal entry (and its images)
 */
export async function deleteJournalEntry(id: string): Promise<void> {
  // First, fetch the entry to get its images
  const entry = await getJournalEntry(id);

  if (entry && entry.images.length > 0) {
    // Delete all associated images from storage
    for (const imageUrl of entry.images) {
      try {
        await deleteJournalImage(imageUrl);
      } catch (error) {
        console.error('Failed to delete image:', imageUrl, error);
        // Continue deleting other images even if one fails
      }
    }
  }

  // Delete the journal entry
  const { error } = await supabase
    .from('journal_entries')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

/**
 * Upload an image to journal storage bucket
 * @param userId - User ID for folder organization
 * @param localUri - Local file URI (e.g., file:///path/to/image.jpg)
 * @returns Public URL of uploaded image
 */
export async function uploadJournalImage(
  userId: string,
  localUri: string
): Promise<string> {
  // Generate unique filename with timestamp and random string
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 9);
  const extension = localUri.split('.').pop() || 'jpg';
  const filename = `${userId}/${timestamp}-${randomStr}.${extension}`;

  // For React Native, we need to handle file upload differently
  // Fetch the file as blob
  const response = await fetch(localUri);
  const blob = await response.blob();

  // Upload to Supabase Storage
  const { error } = await supabase.storage
    .from('journal-images')
    .upload(filename, blob, {
      contentType: `image/${extension}`,
      upsert: false,
    });

  if (error) throw error;

  // Get public URL
  const { data: urlData } = supabase.storage
    .from('journal-images')
    .getPublicUrl(filename);

  return urlData.publicUrl;
}

/**
 * Delete an image from storage
 * @param imageUrl - Full public URL of the image
 */
export async function deleteJournalImage(imageUrl: string): Promise<void> {
  // Extract the path from the public URL
  // URL format: https://[project].supabase.co/storage/v1/object/public/journal-images/userId/filename.jpg
  const urlParts = imageUrl.split('/journal-images/');
  if (urlParts.length !== 2) {
    throw new Error('Invalid image URL format');
  }
  const path = urlParts[1];

  const { error } = await supabase.storage
    .from('journal-images')
    .remove([path]);

  if (error) throw error;
}
