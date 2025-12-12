# Developer Migration Guide: Adding Encryption to Existing Screens

## Overview

This guide helps you update existing worksheet/journal screens to use encryption for sensitive user data.

## Step 1: Identify Files to Update

Search your codebase for direct usage of workbook service functions:

```bash
# Find files using unencrypted functions
cd mobile/src
grep -r "upsertWorkbookProgress" . --include="*.ts" --include="*.tsx"
grep -r "getWorkbookProgress" . --include="*.ts" --include="*.tsx"
```

Common locations:
- `screens/WorksheetScreen.tsx`
- `screens/JournalScreen.tsx`
- `hooks/useWorkbookProgress.ts`
- `hooks/useJournalEntry.ts`

## Step 2: Update Imports

### Before
```typescript
import {
  upsertWorkbookProgress,
  getWorkbookProgress
} from '../services/workbook';
```

### After
```typescript
import {
  upsertWorkbookProgressEncrypted,
  getWorkbookProgressDecrypted
} from '../services/workbook';
```

**Note**: Keep the original imports available for non-sensitive data if needed.

## Step 3: Update Function Calls

### Saving Data (Write Operations)

**Before:**
```typescript
const handleSave = async (data: Record<string, unknown>) => {
  await upsertWorkbookProgress(
    userId,
    phaseNumber,
    worksheetId,
    data,
    isCompleted
  );
};
```

**After:**
```typescript
const handleSave = async (data: Record<string, unknown>) => {
  // Automatically encrypts fields like: journal, reflection, thoughts, etc.
  await upsertWorkbookProgressEncrypted(
    userId,
    phaseNumber,
    worksheetId,
    data,
    isCompleted
  );
};
```

### Loading Data (Read Operations)

**Before:**
```typescript
const loadProgress = async () => {
  const progress = await getWorkbookProgress(
    userId,
    phaseNumber,
    worksheetId
  );
  setData(progress?.data || {});
};
```

**After:**
```typescript
const loadProgress = async () => {
  // Automatically decrypts fields like: journal, reflection, thoughts, etc.
  const progress = await getWorkbookProgressDecrypted(
    userId,
    phaseNumber,
    worksheetId
  );
  setData(progress?.data || {});
};
```

## Step 4: Update React Query Hooks (If Used)

### Before
```typescript
const { data: progress, isLoading } = useQuery({
  queryKey: ['workbook', userId, phaseNumber, worksheetId],
  queryFn: () => getWorkbookProgress(userId, phaseNumber, worksheetId),
});
```

### After
```typescript
const { data: progress, isLoading } = useQuery({
  queryKey: ['workbook', userId, phaseNumber, worksheetId],
  queryFn: () => getWorkbookProgressDecrypted(userId, phaseNumber, worksheetId),
});
```

### Before
```typescript
const mutation = useMutation({
  mutationFn: (data: Record<string, unknown>) =>
    upsertWorkbookProgress(userId, phaseNumber, worksheetId, data),
});
```

### After
```typescript
const mutation = useMutation({
  mutationFn: (data: Record<string, unknown>) =>
    upsertWorkbookProgressEncrypted(userId, phaseNumber, worksheetId, data),
});
```

## Step 5: Understand Field Detection

### Automatically Encrypted Fields

These field name patterns trigger automatic encryption:

```typescript
const ENCRYPTED_FIELD_PATTERNS = [
  'journal',       // journal, journal_entry, daily_journal
  'reflection',    // reflection, daily_reflection, my_reflection
  'thoughts',      // thoughts, my_thoughts, user_thoughts
  'notes',         // notes, private_notes, session_notes
  'entry',         // entry, diary_entry, log_entry
  'answer',        // answer, answer1, user_answer
  'response',      // response, user_response, form_response
  'description',   // description, goal_description
  'story',         // story, my_story, life_story
  'experience',    // experience, past_experience
];
```

### Examples

```typescript
// This data structure:
const worksheetData = {
  worksheet_id: 'wheel_of_life',           // NOT encrypted
  completed: false,                         // NOT encrypted
  timestamp: Date.now(),                    // NOT encrypted
  journal_entry: 'My private thoughts...',  // ENCRYPTED ✓
  reflection: 'I learned that...',          // ENCRYPTED ✓
  goal: 'Improve my health',                // NOT encrypted
  goal_description: 'Detailed plan...',     // ENCRYPTED ✓ (contains 'description')
};

// After encryption, looks like:
{
  worksheet_id: 'wheel_of_life',
  completed: false,
  timestamp: 1735812345678,
  journal_entry: 'ZXlKaGJHY2lPaUo...',      // Encrypted base64
  reflection: 'SGVsbG8gV29ybGQ...',         // Encrypted base64
  goal: 'Improve my health',
  goal_description: 'QWJjZGVmZ2hpam...',    // Encrypted base64
}
```

## Step 6: Handle Mixed Sensitivity Data

If you have worksheets with BOTH sensitive and non-sensitive fields:

### Option A: Use Encrypted Functions (Recommended)
```typescript
// All fields processed, only sensitive ones encrypted
await upsertWorkbookProgressEncrypted(userId, phase, worksheet, {
  question: 'What is your goal?',           // NOT encrypted (safe for queries)
  answer: 'My personal goal is...',         // ENCRYPTED (sensitive)
  timestamp: Date.now(),                    // NOT encrypted (needed for sorting)
});
```

### Option B: Manual Encryption (Advanced)
```typescript
import { encryptWorksheetData } from '../services/workbook';

// Manually encrypt before saving
const encryptedData = await encryptWorksheetData(rawData);
await upsertWorkbookProgress(userId, phase, worksheet, encryptedData);
```

## Step 7: Update Custom Hooks

If you have custom hooks for workbook operations:

### Before: `useWorkbookProgress.ts`
```typescript
export const useWorkbookProgress = (userId: string, phase: number, worksheet: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['workbook', userId, phase, worksheet],
    queryFn: () => getWorkbookProgress(userId, phase, worksheet),
  });

  const saveMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      upsertWorkbookProgress(userId, phase, worksheet, data),
  });

  return { data, isLoading, error, save: saveMutation.mutate };
};
```

### After: `useWorkbookProgress.ts`
```typescript
export const useWorkbookProgress = (userId: string, phase: number, worksheet: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['workbook', userId, phase, worksheet],
    queryFn: () => getWorkbookProgressDecrypted(userId, phase, worksheet), // ← Changed
  });

  const saveMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      upsertWorkbookProgressEncrypted(userId, phase, worksheet, data), // ← Changed
  });

  return { data, isLoading, error, save: saveMutation.mutate };
};
```

## Step 8: Test Your Changes

### Test Checklist

```bash
# 1. Test saving encrypted data
- [ ] Create journal entry with sensitive content
- [ ] Check console: "[workbook.service] Encrypted field: journal_entry"
- [ ] Verify data saved to database

# 2. Test loading encrypted data
- [ ] Kill and restart app
- [ ] Load journal entry
- [ ] Check console: "[workbook.service] Decrypted field: journal_entry"
- [ ] Verify data displays correctly

# 3. Test field detection
- [ ] Save worksheet with mixed fields
- [ ] Verify only sensitive fields encrypted (check console logs)
- [ ] Verify non-sensitive fields remain unencrypted

# 4. Test backward compatibility
- [ ] Load old unencrypted data (if migrating from previous version)
- [ ] Verify old data still loads (encryption gracefully handles this)

# 5. Test edge cases
- [ ] Empty journal entry → should save without error
- [ ] Null/undefined fields → should handle gracefully
- [ ] Special characters (emoji) → should encrypt/decrypt correctly
```

### Debugging Tips

Enable verbose logging:
```typescript
// In secureStorage.ts, all operations already log to console in __DEV__
// Check for these patterns:

"[workbook.service] Encrypted field: X"     // Good: Encryption working
"[workbook.service] Decrypted field: X"     // Good: Decryption working
"[workbook.service] Failed to encrypt"      // Bad: Check error details
"[workbook.service] Failed to decrypt"      // Bad: May be corrupted data
```

## Step 9: Gradual Rollout Strategy

### Phase 1: Add Parallel Functions (No Breaking Changes)
```typescript
// Keep both old and new functions available
import {
  upsertWorkbookProgress,              // Old (unencrypted)
  upsertWorkbookProgressEncrypted,     // New (encrypted)
} from '../services/workbook';

// Use encrypted version for new code
await upsertWorkbookProgressEncrypted(/* ... */);

// Old code still works
await upsertWorkbookProgress(/* ... */);
```

### Phase 2: Update Screen by Screen
1. Start with least critical screens (e.g., vision board)
2. Move to moderately sensitive screens (e.g., goal setting)
3. Finish with most sensitive screens (e.g., journal entries)

### Phase 3: Deprecate Old Functions (Optional)
After all screens updated, mark old functions as deprecated:
```typescript
/**
 * @deprecated Use upsertWorkbookProgressEncrypted instead
 */
export const upsertWorkbookProgress = async (/* ... */) => {
  console.warn('upsertWorkbookProgress is deprecated, use upsertWorkbookProgressEncrypted');
  // ... implementation
};
```

## Step 10: Performance Considerations

### Encryption is Fast (Typical: 10-20ms)
```typescript
// No special handling needed for small journals (<5KB)
await upsertWorkbookProgressEncrypted(userId, phase, worksheet, data);
```

### For Large Journals (>10KB), Consider Caching
```typescript
// Cache decrypted data in memory
const [cachedData, setCachedData] = useState<Record<string, unknown> | null>(null);

const loadData = async () => {
  if (cachedData) return cachedData; // Use cached

  const progress = await getWorkbookProgressDecrypted(userId, phase, worksheet);
  setCachedData(progress?.data || {});
  return progress?.data;
};

// Clear cache after 5 minutes
useEffect(() => {
  const timer = setTimeout(() => setCachedData(null), 5 * 60 * 1000);
  return () => clearTimeout(timer);
}, [cachedData]);
```

## Complete Example: Worksheet Screen Migration

### Before
```typescript
// WorksheetScreen.tsx (before encryption)
import React, { useEffect, useState } from 'react';
import { upsertWorkbookProgress, getWorkbookProgress } from '../services/workbook';

export const WorksheetScreen = ({ userId, phaseNumber, worksheetId }) => {
  const [data, setData] = useState({});

  useEffect(() => {
    const load = async () => {
      const progress = await getWorkbookProgress(userId, phaseNumber, worksheetId);
      setData(progress?.data || {});
    };
    load();
  }, [userId, phaseNumber, worksheetId]);

  const handleSave = async (newData: Record<string, unknown>) => {
    await upsertWorkbookProgress(userId, phaseNumber, worksheetId, newData);
    setData(newData);
  };

  return (
    <View>
      <TextInput
        value={data.journal_entry}
        onChangeText={(text) => handleSave({ ...data, journal_entry: text })}
      />
    </View>
  );
};
```

### After
```typescript
// WorksheetScreen.tsx (with encryption)
import React, { useEffect, useState } from 'react';
import {
  upsertWorkbookProgressEncrypted,
  getWorkbookProgressDecrypted
} from '../services/workbook';

export const WorksheetScreen = ({ userId, phaseNumber, worksheetId }) => {
  const [data, setData] = useState({});

  useEffect(() => {
    const load = async () => {
      // Automatically decrypts sensitive fields
      const progress = await getWorkbookProgressDecrypted(userId, phaseNumber, worksheetId);
      setData(progress?.data || {});
    };
    load();
  }, [userId, phaseNumber, worksheetId]);

  const handleSave = async (newData: Record<string, unknown>) => {
    // Automatically encrypts sensitive fields (like journal_entry)
    await upsertWorkbookProgressEncrypted(userId, phaseNumber, worksheetId, newData);
    setData(newData);
  };

  return (
    <View>
      <TextInput
        value={data.journal_entry} // Decrypted and readable
        onChangeText={(text) => handleSave({ ...data, journal_entry: text })}
      />
    </View>
  );
};
```

### Changes Made
1. ✅ Changed import to use encrypted functions
2. ✅ Updated `load()` to use `getWorkbookProgressDecrypted`
3. ✅ Updated `handleSave()` to use `upsertWorkbookProgressEncrypted`
4. ✅ No changes to UI code (encryption is transparent)

## Summary Checklist

- [ ] Install `expo-secure-store` package
- [ ] Rebuild native code (`npx expo run:ios`)
- [ ] Search codebase for `upsertWorkbookProgress` and `getWorkbookProgress`
- [ ] Update imports to use encrypted versions
- [ ] Update function calls
- [ ] Test encryption (check console logs)
- [ ] Test decryption (restart app and load data)
- [ ] Verify only sensitive fields encrypted
- [ ] Update custom hooks if any
- [ ] Test on physical device (encryption requires real hardware)

## Need Help?

- **Quick Reference**: `ENCRYPTION_QUICK_REFERENCE.md`
- **Full Documentation**: `ENCRYPTION_IMPLEMENTATION.md`
- **Installation Guide**: `INSTALL_ENCRYPTION.md`
- **Code Examples**: `src/utils/secureStorage.ts` (inline comments)

---

**Migration Strategy**: Gradual, non-breaking, screen-by-screen
**Estimated Time**: 5-10 minutes per screen
**Risk Level**: Low (backward compatible, automatic migration)
