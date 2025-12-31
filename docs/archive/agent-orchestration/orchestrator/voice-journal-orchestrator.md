# Voice Journal Orchestrator

**Role**: Coordinate parallel development of Voice Journal MVP feature
**Status**: Active
**Created**: 2025-11-27

---

## Mission

Orchestrate three specialist sub-agents to build the Voice Journal MVP feature with maximum parallelization and clean integration points.

---

## Sub-Agent Roster

| Agent | Task File | Status | Dependency |
|-------|-----------|--------|------------|
| Audio Infrastructure Agent | `VOICE-JOURNAL-AUDIO.md` | 🔄 Ready | None (can start immediately) |
| Backend Services Agent | `VOICE-JOURNAL-BACKEND.md` | 🔄 Ready | None (can start immediately) |
| UI Components Agent | `VOICE-JOURNAL-UI.md` | ⏳ Waiting | Needs Audio + Backend complete |

---

## Coordination Protocol

### Phase 1: Parallel Kickoff
```
┌─────────────────────────────────────────────────────────┐
│                    ORCHESTRATOR                          │
│                                                          │
│  "Starting Voice Journal MVP - Phase 1"                 │
│                                                          │
│          ┌──────────┐    ┌──────────┐                   │
│          │  AUDIO   │    │ BACKEND  │                   │
│          │  AGENT   │    │  AGENT   │                   │
│          │          │    │          │                   │
│          │ START    │    │ START    │  ← PARALLEL       │
│          └──────────┘    └──────────┘                   │
└─────────────────────────────────────────────────────────┘
```

**Audio Agent starts**:
- Install packages (whisper.rn, expo-av, expo-file-system)
- Create whisperService.ts
- Create useWhisper.ts hook
- Create useAudioRecorder.ts hook

**Backend Agent starts** (simultaneously):
- Create types/journal.ts
- Create journalService.ts
- Create useJournal.ts hooks
- Create database migration
- Update service/hook indexes

### Phase 2: Integration Checkpoint

```
┌─────────────────────────────────────────────────────────┐
│                    ORCHESTRATOR                          │
│                                                          │
│  "Phase 1 Complete - Validating Integration Points"     │
│                                                          │
│  ✓ Audio: useWhisper hook exported and functional       │
│  ✓ Backend: useJournal hooks exported and functional    │
│                                                          │
│  "Starting Phase 2 - UI Implementation"                 │
│                                                          │
│                    ┌──────────┐                         │
│                    │    UI    │                         │
│                    │  AGENT   │                         │
│                    │          │                         │
│                    │ START    │  ← SEQUENTIAL           │
│                    └──────────┘                         │
└─────────────────────────────────────────────────────────┘
```

**UI Agent starts** (after Phase 1 complete):
- Create VoiceRecorder.tsx (uses useWhisper, useAudioRecorder)
- Create ImagePicker.tsx
- Create JournalEntryCard.tsx
- Update JournalScreen.tsx (uses useJournalEntries)
- Create NewJournalEntryScreen.tsx (uses all hooks)
- Update navigation

### Phase 3: Integration Testing

```
┌─────────────────────────────────────────────────────────┐
│                    ORCHESTRATOR                          │
│                                                          │
│  "Phase 2 Complete - Running Integration Tests"         │
│                                                          │
│  Testing: Record → Transcribe → Save → Display          │
│                                                          │
│  All agents report back with:                           │
│  - Files created                                        │
│  - Tests passed                                         │
│  - Issues found                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Communication Protocol

### Agent Report Format

Each agent must report completion in this format:

```markdown
## Agent Report: [AGENT NAME]

### Status: ✅ Complete / ❌ Blocked / 🔄 In Progress

### Files Created:
- `path/to/file.ts` - Description

### Files Modified:
- `path/to/file.ts` - What changed

### Exports Added:
- `hookName` from `module`
- `serviceName` from `module`

### Tests:
- [ ] Test 1 description
- [ ] Test 2 description

### Issues:
- Issue description (if any)

### Handoff Notes:
- Notes for the next agent
```

### Escalation Protocol

If an agent is blocked:
1. Report blocker immediately to orchestrator
2. Orchestrator determines if parallel agent can help
3. If not, orchestrator escalates to human

---

## Integration Validation Checklist

### After Audio Agent Complete
- [ ] `npm install` succeeds with new packages
- [ ] `useWhisper` hook can be imported
- [ ] `useAudioRecorder` hook can be imported
- [ ] TypeScript compiles without errors

### After Backend Agent Complete
- [ ] Migration file ready for execution
- [ ] `useJournalEntries` hook can be imported
- [ ] `useCreateJournalEntry` hook can be imported
- [ ] `journalService` functions are typed correctly
- [ ] TypeScript compiles without errors

### After UI Agent Complete
- [ ] JournalScreen renders entry list
- [ ] NewJournalEntryScreen opens from Journal
- [ ] VoiceRecorder captures audio
- [ ] ImagePicker selects images
- [ ] Full flow: Record → Transcribe → Add Images → Save → View

---

## File Ownership Map

```
Audio Agent owns:
├── mobile/src/services/whisperService.ts
├── mobile/src/hooks/useWhisper.ts
├── mobile/src/hooks/useAudioRecorder.ts
└── mobile/package.json (additions only)

Backend Agent owns:
├── mobile/src/services/journalService.ts
├── mobile/src/hooks/useJournal.ts
├── mobile/src/types/journal.ts
├── mobile/src/services/index.ts (additions only)
├── mobile/src/hooks/index.ts (additions only)
└── supabase/migrations/20251127000000_add_journal_images.sql

UI Agent owns:
├── mobile/src/components/journal/VoiceRecorder.tsx
├── mobile/src/components/journal/ImagePicker.tsx
├── mobile/src/components/journal/JournalEntryCard.tsx
├── mobile/src/screens/JournalScreen.tsx
├── mobile/src/screens/NewJournalEntryScreen.tsx
└── mobile/src/navigation/MainTabNavigator.tsx (additions only)
```

---

## Progress Tracking

### Current Status

| Phase | Status | Started | Completed |
|-------|--------|---------|-----------|
| Phase 1: Audio + Backend | ⏳ Pending | - | - |
| Phase 2: UI Components | ⏳ Waiting | - | - |
| Phase 3: Integration | ⏳ Waiting | - | - |

### Completion Log

```
[Date] [Agent] - [Action]
---
2025-11-27 Orchestrator - Created task files
```

---

## Spawn Commands

### To spawn sub-agents, use:

```
Audio Agent:
"Spawn the Audio Infrastructure Agent to implement Whisper transcription
and audio recording. Task file: agent-orchestration/tasks/active/VOICE-JOURNAL-AUDIO.md"

Backend Agent:
"Spawn the Backend Services Agent to implement journal CRUD and database migration.
Task file: agent-orchestration/tasks/active/VOICE-JOURNAL-BACKEND.md"

UI Agent (after Phase 1):
"Spawn the UI Components Agent to build journal screens and components.
Task file: agent-orchestration/tasks/active/VOICE-JOURNAL-UI.md"
```

---

## Success Criteria

Feature is complete when:

1. ✅ User can tap Record and capture voice
2. ✅ Whisper transcribes audio on-device
3. ✅ User can type text manually
4. ✅ User can attach up to 5 images
5. ✅ Entry saves to Supabase
6. ✅ Journal list shows all entries
7. ✅ Audio file deleted after transcription
8. ✅ Works offline (after model download)
9. ✅ Dark mode consistent
10. ✅ TypeScript compiles with 0 errors

---

## Reference Documents

- Feature Spec: `docs/Voice-Journal-MVP.md`
- Master Plan: `agent-orchestration/orchestrator/master-plan.md`
- Project Status: `MTU-PROJECT-STATUS.md`
- Audio Specialist Prompt: `agent-orchestration/prompts/system-prompts/audio-specialist.md`

---

**Orchestrator Status**: Ready to spawn agents
**Last Updated**: 2025-11-27
