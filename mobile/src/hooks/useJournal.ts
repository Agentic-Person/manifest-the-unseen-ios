/**
 * Journal Hooks
 *
 * TanStack Query hooks for fetching and mutating journal data.
 * Provides caching, optimistic updates, and automatic refetching.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../stores/authStore';
import {
  createJournalEntry,
  getJournalEntries,
  getJournalEntry,
  updateJournalEntry,
  deleteJournalEntry,
  uploadJournalImage,
} from '../services/journalService';
import type { CreateJournalEntry, UpdateJournalEntry } from '../types/journal';

/**
 * Query keys for cache management
 */
export const journalKeys = {
  all: ['journal'] as const,
  entries: (userId: string) => [...journalKeys.all, 'entries', userId] as const,
  entry: (id: string) => [...journalKeys.all, 'entry', id] as const,
};

/**
 * Fetch all journal entries
 *
 * @param limit - Maximum number of entries to fetch (default: 50)
 *
 * @example
 * ```tsx
 * const { data: entries, isLoading } = useJournalEntries();
 * ```
 */
export function useJournalEntries(limit: number = 50) {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: journalKeys.entries(user?.id || ''),
    queryFn: () => getJournalEntries(user!.id, limit),
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Fetch single journal entry
 *
 * @param id - Journal entry ID
 *
 * @example
 * ```tsx
 * const { data: entry, isLoading } = useJournalEntry(entryId);
 * ```
 */
export function useJournalEntry(id: string) {
  return useQuery({
    queryKey: journalKeys.entry(id),
    queryFn: () => getJournalEntry(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Create journal entry mutation
 *
 * @example
 * ```tsx
 * const { mutate: createEntry, isPending } = useCreateJournalEntry();
 *
 * createEntry({
 *   content: 'Today was amazing...',
 *   images: ['https://...'],
 *   tags: ['gratitude', 'progress'],
 *   mood: 'happy',
 * });
 * ```
 */
export function useCreateJournalEntry() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: (entry: CreateJournalEntry) => {
      if (!user?.id) throw new Error('User not authenticated');
      return createJournalEntry(user.id, entry);
    },
    onSuccess: () => {
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: journalKeys.entries(user.id) });
      }
    },
  });
}

/**
 * Update journal entry mutation
 *
 * @example
 * ```tsx
 * const { mutate: updateEntry, isPending } = useUpdateJournalEntry();
 *
 * updateEntry({
 *   id: 'entry-id',
 *   content: 'Updated content...',
 *   tags: ['new-tag'],
 * });
 * ```
 */
export function useUpdateJournalEntry() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: ({ id, ...updates }: UpdateJournalEntry) =>
      updateJournalEntry(id, updates),
    onSuccess: (data) => {
      // Invalidate both the single entry and the list
      queryClient.invalidateQueries({ queryKey: journalKeys.entry(data.id) });
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: journalKeys.entries(user.id) });
      }
    },
  });
}

/**
 * Delete journal entry mutation
 *
 * @example
 * ```tsx
 * const { mutate: deleteEntry, isPending } = useDeleteJournalEntry();
 *
 * deleteEntry('entry-id');
 * ```
 */
export function useDeleteJournalEntry() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: deleteJournalEntry,
    onSuccess: () => {
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: journalKeys.entries(user.id) });
      }
    },
  });
}

/**
 * Upload journal image mutation
 *
 * @example
 * ```tsx
 * const { mutate: uploadImage, isPending } = useUploadJournalImage();
 *
 * uploadImage('file:///path/to/image.jpg', {
 *   onSuccess: (url) => {
 *     console.log('Image uploaded:', url);
 *   },
 * });
 * ```
 */
export function useUploadJournalImage() {
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: (localUri: string) => {
      if (!user?.id) throw new Error('User not authenticated');
      return uploadJournalImage(user.id, localUri);
    },
  });
}
