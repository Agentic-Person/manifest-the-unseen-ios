# Task: Voice Journal - Backend Services

**Task ID**: VOICE-JOURNAL-BACKEND
**Agent**: Backend Services Specialist
**Orchestrator**: Voice Journal Orchestrator
**Status**: 🔄 Ready to Start
**Priority**: P0 - Critical Path
**Dependencies**: None (can start immediately, parallel with Audio Agent)

---

## Objective

Implement the journal service layer, React Query hooks, TypeScript types, and database migration for Voice Journal MVP.

---

## Deliverables

### 1. Create TypeScript Types

**Path**: `mobile/src/types/journal.ts`

```typescript
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
```

### 2. Create journalService.ts

**Path**: `mobile/src/services/journalService.ts`

**Functions to implement**:

```typescript
import { supabase } from './supabase';
import type { JournalEntry, CreateJournalEntry, UpdateJournalEntry } from '@/types/journal';

/**
 * Create a new journal entry
 */
export async function createJournalEntry(
  userId: string,
  entry: CreateJournalEntry
): Promise<JournalEntry>

/**
 * Get all journal entries for user (newest first)
 */
export async function getJournalEntries(
  userId: string,
  limit?: number,
  offset?: number
): Promise<JournalEntry[]>

/**
 * Get a single journal entry by ID
 */
export async function getJournalEntry(id: string): Promise<JournalEntry | null>

/**
 * Update a journal entry
 */
export async function updateJournalEntry(
  id: string,
  updates: Omit<UpdateJournalEntry, 'id'>
): Promise<JournalEntry>

/**
 * Delete a journal entry (and its images)
 */
export async function deleteJournalEntry(id: string): Promise<void>

/**
 * Upload an image to journal storage bucket
 * @returns Public URL of uploaded image
 */
export async function uploadJournalImage(
  userId: string,
  localUri: string
): Promise<string>

/**
 * Delete an image from storage
 */
export async function deleteJournalImage(imageUrl: string): Promise<void>
```

**Implementation Notes**:
- Use `supabase.from('journal_entries')` for queries
- Order by `created_at DESC` for newest first
- Upload images to `journal-images/{userId}/{filename}`
- Generate unique filenames with timestamps
- Handle errors with try/catch and meaningful messages

### 3. Create useJournal.ts Hooks

**Path**: `mobile/src/hooks/useJournal.ts`

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as journalService from '@/services/journalService';
import { useAuth } from '@/stores/authStore';
import type { CreateJournalEntry, UpdateJournalEntry } from '@/types/journal';

// Query Keys
export const journalKeys = {
  all: ['journal'] as const,
  entries: () => [...journalKeys.all, 'entries'] as const,
  entry: (id: string) => [...journalKeys.all, 'entry', id] as const,
};

/**
 * Fetch all journal entries
 */
export function useJournalEntries(limit?: number) {
  const { user } = useAuth();

  return useQuery({
    queryKey: journalKeys.entries(),
    queryFn: () => journalService.getJournalEntries(user!.id, limit),
    enabled: !!user,
  });
}

/**
 * Fetch single journal entry
 */
export function useJournalEntry(id: string) {
  return useQuery({
    queryKey: journalKeys.entry(id),
    queryFn: () => journalService.getJournalEntry(id),
    enabled: !!id,
  });
}

/**
 * Create journal entry mutation
 */
export function useCreateJournalEntry() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (entry: CreateJournalEntry) =>
      journalService.createJournalEntry(user!.id, entry),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: journalKeys.entries() });
    },
  });
}

/**
 * Update journal entry mutation
 */
export function useUpdateJournalEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...updates }: UpdateJournalEntry) =>
      journalService.updateJournalEntry(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: journalKeys.entries() });
      queryClient.invalidateQueries({ queryKey: journalKeys.entry(data.id) });
    },
  });
}

/**
 * Delete journal entry mutation
 */
export function useDeleteJournalEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: journalService.deleteJournalEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: journalKeys.entries() });
    },
  });
}

/**
 * Upload journal image mutation
 */
export function useUploadJournalImage() {
  const { user } = useAuth();

  return useMutation({
    mutationFn: (localUri: string) =>
      journalService.uploadJournalImage(user!.id, localUri),
  });
}
```

### 4. Create Database Migration

**Path**: `supabase/migrations/20251127000000_add_journal_images.sql`

```sql
-- Migration: Add images column to journal_entries
-- Created: 2025-11-27
-- Feature: Voice Journal MVP

-- Add images array column
ALTER TABLE journal_entries
ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';

-- Create storage bucket for journal images (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('journal-images', 'journal-images', false)
ON CONFLICT (id) DO NOTHING;

-- RLS Policy: Users can upload to their own folder
CREATE POLICY "Users upload own journal images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'journal-images'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- RLS Policy: Users can view their own images
CREATE POLICY "Users view own journal images"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'journal-images'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- RLS Policy: Users can delete their own images
CREATE POLICY "Users delete own journal images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'journal-images'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Update RLS Policy: Users can update their own images
CREATE POLICY "Users update own journal images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'journal-images'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```

### 5. Update Exports

**Path**: `mobile/src/hooks/index.ts`

Add exports:
```typescript
export * from './useJournal';
```

**Path**: `mobile/src/services/index.ts`

Add exports:
```typescript
export * from './journalService';
```

**Path**: `mobile/src/types/index.ts`

Add exports (create if doesn't exist):
```typescript
export * from './journal';
```

---

## Technical Requirements

### Supabase Query Patterns

```typescript
// Create
const { data, error } = await supabase
  .from('journal_entries')
  .insert({ user_id, content, images, tags, mood })
  .select()
  .single();

// Read (list)
const { data, error } = await supabase
  .from('journal_entries')
  .select('*')
  .eq('user_id', userId)
  .order('created_at', { ascending: false })
  .limit(limit);

// Update
const { data, error } = await supabase
  .from('journal_entries')
  .update({ content, images, tags, mood })
  .eq('id', id)
  .select()
  .single();

// Delete
const { error } = await supabase
  .from('journal_entries')
  .delete()
  .eq('id', id);
```

### Image Upload Pattern

```typescript
// Generate unique filename
const filename = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;

// Upload to storage
const { data, error } = await supabase.storage
  .from('journal-images')
  .upload(filename, file, {
    contentType: 'image/jpeg',
    upsert: false,
  });

// Get public URL
const { data: { publicUrl } } = supabase.storage
  .from('journal-images')
  .getPublicUrl(filename);
```

---

## Acceptance Criteria

- [ ] Types defined and exportable
- [ ] journalService creates entries correctly
- [ ] journalService fetches entries newest-first
- [ ] journalService updates entries
- [ ] journalService deletes entries (and associated images)
- [ ] Image upload works to correct bucket/folder
- [ ] React Query hooks work with caching
- [ ] Migration file is valid SQL
- [ ] All exports added to index files
- [ ] TypeScript compiles with 0 errors

---

## Testing Commands

```bash
# TypeScript check
cd mobile && npm run type-check

# Run migration (local Supabase)
npx supabase db push

# Verify migration
npx supabase db diff

# Check tables in Studio
# http://localhost:54323 → Table Editor → journal_entries
```

---

## Report Template

When complete, report to orchestrator:

```markdown
## Agent Report: Backend Services

### Status: [✅ Complete / ❌ Blocked / 🔄 In Progress]

### Files Created:
- `mobile/src/types/journal.ts`
- `mobile/src/services/journalService.ts`
- `mobile/src/hooks/useJournal.ts`
- `supabase/migrations/20251127000000_add_journal_images.sql`

### Files Modified:
- `mobile/src/hooks/index.ts` - Added useJournal exports
- `mobile/src/services/index.ts` - Added journalService exports
- `mobile/src/types/index.ts` - Added journal types exports

### Exports Added:
- `useJournalEntries` from `@/hooks`
- `useCreateJournalEntry` from `@/hooks`
- `useUpdateJournalEntry` from `@/hooks`
- `useDeleteJournalEntry` from `@/hooks`
- `useUploadJournalImage` from `@/hooks`
- `journalService.*` from `@/services`
- `JournalEntry`, `CreateJournalEntry` etc from `@/types`

### Tests:
- [ ] Create entry works
- [ ] Fetch entries returns newest first
- [ ] Update entry works
- [ ] Delete entry removes from DB
- [ ] Image upload stores in correct path

### Issues:
- (Any blockers or concerns)

### Handoff Notes:
- UI Agent can now use all journal hooks
- Migration needs to run: `npx supabase db push`
- Images stored at: journal-images/{userId}/{filename}
```

---

## Reference Files

- Existing service pattern: `mobile/src/services/workbook.ts`
- Existing hooks pattern: `mobile/src/hooks/useWorkbook.ts`
- Existing types pattern: `mobile/src/types/workbook.ts`
- Database schema: `supabase/migrations/20250101000000_initial_schema.sql`
- Feature Spec: `docs/Voice-Journal-MVP.md`

---

**Estimated Effort**: 2-3 hours
**Blocking**: UI Agent (cannot start until this completes)
**Parallel With**: Audio Agent (no dependencies)
