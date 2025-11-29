# Voice Journal MVP - Feature Specification

**Document Version**: 1.0
**Created**: 2025-11-27
**Status**: Ready for Implementation
**Orchestrator**: Voice Journal Orchestrator

---

## Executive Summary

Build the Voice Journal feature for Manifest the Unseen with privacy-first on-device speech transcription, text entry support, and image attachments.

### MVP Scope
| Feature | Included | Notes |
|---------|----------|-------|
| Voice Recording | ✅ | Tap/hold to record |
| On-Device Whisper | ✅ | Privacy-first, works offline |
| Text Entry | ✅ | Alternative to voice |
| Image Attachments | ✅ | Up to 5 from gallery |
| Journal Entry List | ✅ | Chronological display |
| Search | ❌ | Future enhancement |
| Tags | ❌ | Future enhancement |
| Mood Tracking | ❌ | Future enhancement |

---

## Architecture Overview

### Agent Structure
```
┌─────────────────────────────────────────────────────────────┐
│                 VOICE JOURNAL ORCHESTRATOR                   │
│         Coordinates all agents, tracks progress              │
│         Reports: docs/Voice-Journal-MVP.md                   │
└──────────────────────┬──────────────────────────────────────┘
                       │
       ┌───────────────┼───────────────┐
       │               │               │
       ▼               ▼               ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│    AUDIO     │ │   BACKEND    │ │     UI       │
│ INFRASTRUCTURE│ │   SERVICES   │ │  COMPONENTS  │
├──────────────┤ ├──────────────┤ ├──────────────┤
│ • whisper.rn │ │ • journalSvc │ │ • VoiceRec   │
│ • expo-av    │ │ • useJournal │ │ • ImagePick  │
│ • recording  │ │ • DB migrate │ │ • Screens    │
│ • model mgmt │ │ • storage    │ │ • EntryCard  │
└──────────────┘ └──────────────┘ └──────────────┘
     AGENT 1          AGENT 2          AGENT 3
```

### Parallel Execution Strategy
- **Agent 1** and **Agent 2** can work simultaneously (no dependencies)
- **Agent 3** starts after Agent 2 completes service layer (needs hooks)
- Orchestrator coordinates handoffs and validates integration points

---

## Technical Specifications

### 1. Whisper Model Strategy

**Approach**: Download on First Use (not bundled)

| Aspect | Specification |
|--------|---------------|
| Model | whisper-tiny or whisper-base |
| Size | ~40MB download |
| Trigger | First tap on Record button |
| Storage | App's document directory |
| Offline | Works after initial download |

**User Flow**:
```
First Use:
[Record] → "Downloading speech model..." → [Progress Bar 0-100%] → Ready!

Subsequent Use:
[Record] → Recording immediately (model cached)
```

### 2. Package Requirements

| Package | Version | Purpose | Agent |
|---------|---------|---------|-------|
| `whisper.rn` | latest | On-device transcription | Audio Agent |
| `expo-av` | ~15.0.x | Audio recording | Audio Agent |
| `expo-file-system` | ~18.0.x | Model storage, audio cleanup | Audio Agent |
| `expo-image-picker` | ~17.0.8 | Gallery access | Already installed ✅ |

### 3. Database Schema Changes

```sql
-- Migration: add_journal_images_column.sql

-- Add images column to journal_entries
ALTER TABLE journal_entries
ADD COLUMN images TEXT[] DEFAULT '{}';

-- Create storage bucket for journal images
INSERT INTO storage.buckets (id, name, public)
VALUES ('journal-images', 'journal-images', false);

-- RLS: Users upload to their own folder
CREATE POLICY "Users upload own journal images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'journal-images'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- RLS: Users view their own images
CREATE POLICY "Users view own journal images"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'journal-images'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- RLS: Users delete their own images
CREATE POLICY "Users delete own journal images"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'journal-images'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```

---

## File Manifest

### New Files to Create

```
mobile/src/
├── services/
│   ├── whisperService.ts       # [Audio Agent] Model download + transcription
│   └── journalService.ts       # [Backend Agent] CRUD operations
├── hooks/
│   ├── useWhisper.ts           # [Audio Agent] Transcription hook
│   ├── useAudioRecorder.ts     # [Audio Agent] Recording hook
│   └── useJournal.ts           # [Backend Agent] React Query hooks
├── components/journal/
│   ├── VoiceRecorder.tsx       # [UI Agent] Recording component
│   ├── ImagePicker.tsx         # [UI Agent] Gallery picker
│   └── JournalEntryCard.tsx    # [UI Agent] List item
├── screens/
│   └── NewJournalEntryScreen.tsx  # [UI Agent] Entry creation
└── types/
    └── journal.ts              # [Backend Agent] TypeScript types

supabase/migrations/
└── 20251127000000_add_journal_images.sql  # [Backend Agent]
```

### Files to Modify

```
mobile/package.json                         # [Audio Agent] Add dependencies
mobile/src/screens/JournalScreen.tsx        # [UI Agent] Replace placeholder
mobile/src/navigation/MainTabNavigator.tsx  # [UI Agent] Add NewEntry route
mobile/src/hooks/index.ts                   # [Backend Agent] Export hooks
mobile/src/services/index.ts                # [Backend Agent] Export services
```

---

## Component Specifications

### VoiceRecorder Component

```
┌─────────────────────────────────────────┐
│                                         │
│            ⏺ 00:00:00                  │
│            Recording...                 │
│                                         │
│                                         │
│       ┌───────────────────┐            │
│       │                   │            │
│       │    🎤 RECORD      │            │
│       │                   │            │
│       └───────────────────┘            │
│                                         │
│         Tap to start/stop               │
│                                         │
│   [Cancel]              [Transcribe]    │
│                                         │
└─────────────────────────────────────────┘
```

**States**:
- `idle` - Ready to record
- `recording` - Audio being captured
- `transcribing` - Whisper processing
- `complete` - Text ready

**Props**:
```typescript
interface VoiceRecorderProps {
  onTranscriptionComplete: (text: string) => void;
  onCancel: () => void;
  maxDuration?: number; // Default 15 minutes
}
```

### ImagePicker Component

```
┌───────────────────────────────────────────────────┐
│ 📷 Add Images (3/5)                               │
│                                                   │
│ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐│
│ │   +   │ │ img1  │ │ img2  │ │ img3  │ │       ││
│ │       │ │   ✕   │ │   ✕   │ │   ✕   │ │       ││
│ └───────┘ └───────┘ └───────┘ └───────┘ └───────┘│
└───────────────────────────────────────────────────┘
```

**Props**:
```typescript
interface ImagePickerProps {
  images: string[];  // URIs
  onImagesChange: (images: string[]) => void;
  maxImages?: number; // Default 5
}
```

### JournalScreen Layout

```
┌─────────────────────────────────────────┐
│  📔 Journal                        [+]  │
├─────────────────────────────────────────┤
│                                         │
│  ┌───────────────────────────────────┐  │
│  │ Nov 27, 2025 • 2:30 PM            │  │
│  │                                   │  │
│  │ Today I reflected on my morning   │  │
│  │ meditation and felt grateful...   │  │
│  │                                   │  │
│  │ [🖼️] [🖼️]                          │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │ Nov 26, 2025 • 9:15 AM            │  │
│  │                                   │  │
│  │ Gratitude entry for the week...   │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │ Nov 25, 2025 • 11:45 PM           │  │
│  │                                   │  │
│  │ Late night thoughts about my      │  │
│  │ manifestation journey...          │  │
│  └───────────────────────────────────┘  │
│                                         │
└─────────────────────────────────────────┘
```

### NewJournalEntryScreen Layout

```
┌─────────────────────────────────────────┐
│  ← New Entry                    [Save]  │
├─────────────────────────────────────────┤
│                                         │
│  ┌───────────────────────────────────┐  │
│  │         🎤 Voice Record           │  │
│  │                                   │  │
│  │         Tap to start              │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ─────────── or type below ───────────  │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │                                   │  │
│  │ Write your thoughts...            │  │
│  │                                   │  │
│  │                                   │  │
│  │                                   │  │
│  └───────────────────────────────────┘  │
│                                         │
│  📷 Add Images                          │
│  ┌──────┐ ┌──────┐ ┌──────┐            │
│  │  +   │ │      │ │      │            │
│  └──────┘ └──────┘ └──────┘            │
│                                         │
└─────────────────────────────────────────┘
```

---

## Service Layer Specifications

### whisperService.ts

```typescript
// Key Functions
downloadModel(onProgress: (progress: number) => void): Promise<void>
isModelDownloaded(): Promise<boolean>
transcribe(audioUri: string): Promise<string>
deleteAudioFile(uri: string): Promise<void>
```

### journalService.ts

```typescript
// Key Functions
createJournalEntry(entry: CreateJournalEntry): Promise<JournalEntry>
getJournalEntries(userId: string, limit?: number): Promise<JournalEntry[]>
getJournalEntry(id: string): Promise<JournalEntry>
updateJournalEntry(id: string, updates: Partial<JournalEntry>): Promise<JournalEntry>
deleteJournalEntry(id: string): Promise<void>
uploadJournalImage(userId: string, uri: string): Promise<string>
deleteJournalImage(url: string): Promise<void>
```

### useJournal.ts Hooks

```typescript
// Query Hooks
useJournalEntries(limit?: number): UseQueryResult<JournalEntry[]>
useJournalEntry(id: string): UseQueryResult<JournalEntry>

// Mutation Hooks
useCreateJournalEntry(): UseMutationResult<JournalEntry, Error, CreateJournalEntry>
useUpdateJournalEntry(): UseMutationResult<JournalEntry, Error, UpdateJournalEntry>
useDeleteJournalEntry(): UseMutationResult<void, Error, string>
```

---

## Type Definitions

```typescript
// types/journal.ts

export interface JournalEntry {
  id: string;
  user_id: string;
  content: string;
  encrypted_content?: string;
  images: string[];
  tags: string[];
  mood?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateJournalEntry {
  content: string;
  images?: string[];
  tags?: string[];
  mood?: string;
}

export interface UpdateJournalEntry {
  id: string;
  content?: string;
  images?: string[];
  tags?: string[];
  mood?: string;
}

export type RecordingState = 'idle' | 'recording' | 'transcribing' | 'complete' | 'error';

export interface WhisperModelStatus {
  downloaded: boolean;
  downloading: boolean;
  progress: number;
  error?: string;
}
```

---

## Privacy & Security

### Audio Handling
- ✅ Audio recorded locally only
- ✅ Audio NEVER sent to cloud
- ✅ Audio file deleted immediately after transcription
- ✅ Only transcribed text stored in database

### Image Handling
- ✅ Images stored in user-specific folder (`{user_id}/`)
- ✅ RLS policies enforce user-only access
- ✅ Images served via signed URLs (not public)

### Data Storage
- ✅ `encrypted_content` field available for future encryption
- ✅ All journal queries filtered by `user_id`
- ✅ RLS policies on all operations

---

## Testing Checklist

### Audio Infrastructure (Agent 1)
- [ ] Whisper model downloads with progress indicator
- [ ] Model persists after app restart
- [ ] Recording starts/stops correctly
- [ ] Recording timer displays accurately
- [ ] Transcription produces text (accuracy test)
- [ ] Audio file deleted after transcription
- [ ] Works offline after model downloaded
- [ ] Error handling for failed downloads
- [ ] Error handling for failed transcription

### Backend Services (Agent 2)
- [ ] Journal entry creates successfully
- [ ] Journal entries fetch in chronological order
- [ ] Journal entry updates correctly
- [ ] Journal entry deletes correctly
- [ ] Image uploads to correct bucket/folder
- [ ] Image URLs save to entry
- [ ] Image deletes when entry deleted
- [ ] React Query cache invalidates properly

### UI Components (Agent 3)
- [ ] VoiceRecorder states display correctly
- [ ] ImagePicker opens gallery
- [ ] ImagePicker shows thumbnails with remove
- [ ] ImagePicker enforces max limit
- [ ] JournalScreen shows entries
- [ ] JournalScreen handles empty state
- [ ] NewJournalEntryScreen saves entry
- [ ] Navigation works correctly
- [ ] Dark mode colors consistent
- [ ] Haptic feedback on key actions

---

## Integration Points

### Agent Handoffs

| From | To | What | When |
|------|-----|------|------|
| Audio Agent | UI Agent | `useWhisper` hook | After transcription works |
| Backend Agent | UI Agent | `useJournal` hooks | After CRUD implemented |
| Backend Agent | Audio Agent | None | Independent |

### Shared Dependencies

```
Audio Agent needs: expo-av, expo-file-system, whisper.rn
Backend Agent needs: @supabase/supabase-js (already installed)
UI Agent needs: Outputs from Audio + Backend agents
```

---

## Execution Timeline

### Phase 1: Setup (Parallel)
- **Audio Agent**: Install packages, create whisperService scaffold
- **Backend Agent**: Create migration, journalService scaffold, types

### Phase 2: Core Implementation (Parallel)
- **Audio Agent**: Implement model download, recording, transcription
- **Backend Agent**: Implement CRUD, image upload, React Query hooks

### Phase 3: UI Implementation (Sequential)
- **UI Agent**: Build components using hooks from Phase 2
- **UI Agent**: Update screens, integrate navigation

### Phase 4: Integration & Testing
- **All Agents**: Integration testing
- **Orchestrator**: Final validation, documentation update

---

## Success Criteria

| Metric | Target |
|--------|--------|
| Whisper transcription time | < 5 seconds for 1-minute audio |
| Model download | Shows progress, completes reliably |
| Entry creation | < 2 seconds (excluding upload) |
| Image upload | < 3 seconds per image |
| Offline voice journal | Works after model downloaded |
| Privacy | Zero audio leaves device |

---

## Future Enhancements (Post-MVP)

1. **Search** - Full-text search on content
2. **Tags** - Categorize entries
3. **Mood Tracking** - Emoji mood selector
4. **Waveform Visualization** - Real-time audio visualization
5. **Entry Encryption** - End-to-end encryption option
6. **Export** - Export entries to PDF/text
7. **Prompts** - Daily journaling prompts

---

## References

- [TDD Voice Journaling Section](./manifest-the-unseen-tdd.md#voice-journaling)
- [Audio Specialist Agent Prompt](../agent-orchestration/prompts/system-prompts/audio-specialist.md)
- [Supabase Journal Schema](../supabase/migrations/20250101000000_initial_schema.sql)
- [whisper.rn Documentation](https://github.com/whisper-rn/whisper.rn)

---

**Document Owner**: Voice Journal Orchestrator
**Last Updated**: 2025-11-27
**Next Review**: After MVP completion
