# Voice Journaling Workstream

**Status**: Not Started
**Timeline**: Weeks 7-8 (Phase 1)
**Priority**: P0 - Key Differentiator

---

## Overview

Voice journaling allows users to quickly capture thoughts by speaking, with on-device Whisper transcription converting speech to text. Audio is immediately deleted after transcription (privacy-first), and only text is stored. Users can search, tag, and categorize journal entries.

## Timeline

- **Planning**: Weeks 5-6
- **Implementation**: Weeks 7-8
- **Testing**: Week 8
- **Polish**: Week 23

## Key Agents Involved

- **Primary**: Audio/Voice Specialist (Whisper, recording)
- **Support**: Backend Specialist (database, encryption), Frontend Specialist (UI)
- **Review**: Security Auditor (encryption), Performance Review Agent (transcription speed)

## Key Tasks

1. **OpenAI Whisper Integration** (Audio/Voice Specialist)
   - Install react-native-whisper
   - Configure Whisper model (tiny or base)
   - Test transcription accuracy
   - Optimize for speed (< 5 seconds target)

2. **Audio Recording** (Audio/Voice Specialist)
   - Install react-native-audio-recorder-player
   - Configure iOS audio session
   - Build recording UI (waveform, timer)
   - Max recording: 15 minutes

3. **Journal Database** (Backend Specialist)
   - journal_entries table
   - Full-text search (tsvector)
   - RLS policies
   - Encryption (optional encrypted_content field)

4. **Journal Entry CRUD** (Frontend Specialist)
   - Create entry (voice or text)
   - Edit transcription
   - Delete entry
   - List view (FlatList)
   - Detail view

5. **Search & Filtering** (Frontend Specialist)
   - Full-text search
   - Filter by tags
   - Filter by date range
   - Filter by mood

6. **Tags & Mood** (Frontend Specialist)
   - Tag management
   - Mood selection (happy, calm, anxious, sad, grateful)
   - Pre-defined tag suggestions

## Dependencies

**Blocks**:
- None (standalone feature)

**Blocked By**:
- Authentication (user must be logged in)
- Database setup

## Success Metrics

- Transcription accuracy > 90% (clear speech)
- Transcription time < 5 seconds
- No audio files stored (privacy audit passes)
- Search returns results in < 1 second
- Users create > 3 journal entries per week (avg)

## Testing Checklist

- [ ] Recording works on device
- [ ] Whisper transcribes accurately
- [ ] Transcription completes in < 5 seconds
- [ ] Audio files deleted after transcription
- [ ] Text saves to Supabase
- [ ] Entries encrypted at rest
- [ ] Search works (full-text)
- [ ] Tags and mood save correctly
- [ ] Offline recording queues for sync

## Technical Details

**Privacy-First Design**:
1. User taps record
2. Audio saved locally (temporary)
3. Whisper transcribes on-device
4. Text saved to Supabase
5. **Audio file deleted immediately**
6. No audio ever leaves device

**Whisper Model**:
- **Model**: tiny or base (balance speed vs. accuracy)
- **Language**: English
- **Runtime**: whisper.cpp via react-native-whisper
- **Speed**: ~1-2 seconds for 1-minute audio

**Database Schema**:
```sql
CREATE TABLE journal_entries (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  content TEXT NOT NULL,
  encrypted_content TEXT, -- Optional
  tags TEXT[],
  mood TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Full-text search
ALTER TABLE journal_entries ADD COLUMN content_search tsvector
  GENERATED ALWAYS AS (to_tsvector('english', content)) STORED;
CREATE INDEX idx_journal_search ON journal_entries USING GIN(content_search);
```

**Subscription Tier Limits**:
- **Novice**: 50 entries/month
- **Awakening**: 200 entries/month
- **Enlightenment**: Unlimited

## Resources

- **PRD**: Section 3.1.2 - Voice-to-Text Journaling
- **TDD**: Section 6 - Voice Journaling Flow
- **react-native-whisper**: https://github.com/mybigday/whisper.rn

## Current Status

**Not Started**

## Notes

(Add notes on Whisper integration challenges, accuracy improvements, etc.)
