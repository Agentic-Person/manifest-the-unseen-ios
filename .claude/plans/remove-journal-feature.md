# Plan: Remove Journal Feature from App

## Overview
Remove the journal/voice journaling feature entirely from the Manifest the Unseen app. This will simplify the app and reduce maintenance burden.

## Files to DELETE (12 files)

### Core Screens & Components
1. `mobile/src/screens/JournalScreen.tsx`
2. `mobile/src/screens/NewJournalEntryScreen.tsx`
3. `mobile/src/components/journal/` (entire folder)
   - `index.ts`
   - `JournalEntryCard.tsx`
   - `VoiceRecorder.tsx`
   - `ImagePicker.tsx`

### Types
4. `mobile/src/types/journal.ts`

### Services
5. `mobile/src/services/journalService.ts`

### Hooks
6. `mobile/src/hooks/useJournal.ts`
7. `mobile/src/hooks/useWhisper.ts`
8. `mobile/src/hooks/useAudioRecorder.ts`

### Documentation (optional - can keep for reference)
9. `docs/Voice-Journal-MVP.md`
10. `VOICE-JOURNAL-AUDIO-SUMMARY.md`
11. `agent-orchestration/orchestrator/voice-journal-orchestrator.md`

### Test Assets
12. `.playwright-mcp/journal-test.png`
13. `.playwright-mcp/journal-new-entry-test.png`

---

## Files to MODIFY (8 files)

### 1. Navigation - Remove Journal Tab
**File:** `mobile/src/navigation/MainTabNavigator.tsx`
- Remove import of `JournalScreen`
- Remove import of `NewJournalEntryScreen`
- Remove `Journal` tab screen (~lines 141-158)
- Remove `NewJournalEntry` screen (~lines 190-212)

### 2. Navigation Types - Remove Journal Types
**File:** `mobile/src/types/navigation.ts`
- Remove `Journal` from `MainTabParamList` (line 42)
- Remove `NewJournalEntry` from `MainTabParamList` (line 45)
- Remove `JournalStackParamList` type definition (lines 124-128)
- Remove `JournalStackScreenProps` type (lines 196-200)

### 3. Types Index - Remove Journal Exports
**File:** `mobile/src/types/index.ts`
- Remove journal type exports (lines 28-34)

### 4. Services Index - Remove Journal Service Exports
**File:** `mobile/src/services/index.ts`
- Remove journalService import (line 31)
- Remove journal function exports (lines 50-59)

### 5. Hooks Index - Remove Journal Hook Exports
**File:** `mobile/src/hooks/index.ts`
- Remove useJournal exports (lines 21-30)
- Remove useWhisper export
- Remove useAudioRecorder export

### 6. Query Client - Remove Journal Query Keys
**File:** `mobile/src/services/queryClient.ts`
- Remove journal query keys (lines 145-150)
- Remove `invalidateJournalQueries` function (lines 213-219)

### 7. Assets Index - Remove Journal Image References
**File:** `mobile/src/assets/index.ts`
- Remove `BackgroundImages.journal` (line 211)
- Keep `Phase7ExerciseImages.gratitudeJournal` (this is for workbook, not journal feature)

### 8. Subscription Types - Remove Journal Quota References
**File:** `mobile/src/types/subscription.ts`
- Remove `maxJournalsPerMonth` from `FEATURE_LIMITS`
- Update quota-related types if needed

---

## Files to CHECK (may need updates)

### Subscription/Gating
- `mobile/src/hooks/useSubscription.ts` - Remove `useJournalQuota` hook
- `mobile/src/utils/subscriptionGating.ts` - Remove journal quota logic
- `mobile/src/components/QuotaExceededPrompt.tsx` - Remove journal quota type

### Components Index
- `mobile/src/components/index.ts` - Remove journal component exports if any

---

## Database Considerations

### Supabase Migration
- `supabase/migrations/20251127000000_add_journal_images.sql` - Keep for now (don't delete data)
- Consider creating a new migration to drop the `journal_entries` table and `journal-images` storage bucket in the future

---

## Execution Order

1. **Remove from Navigation first** (breaks the entry point)
2. **Delete screen files**
3. **Delete component files**
4. **Delete service and hook files**
5. **Delete type files**
6. **Clean up index.ts exports**
7. **Remove subscription quota references**
8. **Run TypeScript check** to find any remaining references
9. **Test the app** to ensure no crashes

---

## Post-Removal Cleanup

- [ ] Run `npx tsc --noEmit` to verify no TypeScript errors
- [ ] Test app navigation (ensure no dead links)
- [ ] Update any marketing/documentation that mentions journaling
- [ ] Consider keeping database tables for now (data preservation)

---

## Estimated Impact

- **Lines of code removed:** ~2,000+
- **Features affected:** Voice journaling, journal entries, journal quota tracking
- **Tab bar:** Will have 4 tabs instead of 5 (Home, Workbook, Meditate, Profile)
- **Subscription value:** May need to update tier features to remove journal mentions

---

## Rollback Plan

If needed, revert via git:
```bash
git checkout HEAD -- mobile/src/screens/JournalScreen.tsx
git checkout HEAD -- mobile/src/screens/NewJournalEntryScreen.tsx
# ... etc for all files
```
