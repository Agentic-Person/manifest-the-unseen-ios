# Meditation Player Workstream

**Status**: Not Started
**Timeline**: Weeks 13-14 (Phase 2)
**Priority**: P0 - Key Wellness Feature

---

## Overview

The meditation player provides 6 guided meditation sessions with male and female narrator options (12 total audio files). Features include background playback, progress tracking, session history, streaks, and breathing exercises with animated visuals and haptic feedback.

## Timeline

- **Planning**: Weeks 11-12
- **Implementation**: Weeks 13-14
- **Testing**: Week 14
- **Content**: Ongoing (monthly new meditations)

## Key Agents Involved

- **Primary**: Audio/Voice Specialist (player, haptics)
- **Support**: Frontend Specialist (UI, animations), Backend Specialist (tracking, storage)
- **Review**: Performance Review Agent (background audio)

## Key Tasks

1. **Audio Player Setup** (Audio/Voice Specialist)
   - Install react-native-track-player
   - Configure background audio
   - iOS audio session management
   - Handle interruptions (calls, alarms)

2. **Meditation Content** (Audio/Voice Specialist + Backend Specialist)
   - Source/record 6 meditations (male + female = 12 files)
   - Upload to Supabase Storage
   - Populate meditations table
   - Test playback

   **6 Meditations**:
   - 5-min Morning Manifestation
   - 5-min Evening Gratitude
   - 10-min Abundance Alignment
   - 10-min Limiting Beliefs Release
   - 5-min Quick Reset
   - 10-min Deep Alignment

3. **Meditation Library UI** (Frontend Specialist)
   - List view (6 sessions)
   - Detail view (artwork, description)
   - Narrator toggle (male/female)
   - Favorite meditations
   - Recently played

4. **Player UI** (Frontend Specialist)
   - Play/pause, skip ±10s
   - Progress bar (seekable)
   - Artwork display
   - Background blur
   - Minimized player (tab bar)

5. **Breathing Exercises** (Frontend Specialist)
   - Triangle Breathing (5-5-5)
   - Box Breathing (4-4-4-4)
   - 5-Finger Breathing (hand trace)
   - Animated visuals
   - Haptic feedback

6. **Session Tracking** (Backend Specialist)
   - meditation_sessions table
   - Track start, duration, completion
   - Calculate stats (total time, streak)

7. **History & Stats** (Frontend Specialist)
   - Session history list
   - Calendar view
   - Total meditation time
   - Streak counter
   - Completion rate

8. **Reminders** (Frontend Specialist)
   - Daily meditation reminder
   - Customizable time
   - Local notifications

## Dependencies

**Blocks**:
- None (standalone feature)

**Blocked By**:
- Authentication
- Audio content acquisition/recording

## Success Metrics

- Audio plays without stuttering
- Background playback works (screen off)
- Session tracking accurate
- Breathing animations smooth
- Users meditate > 2x per week (avg)
- Meditation completion rate > 60%

## Testing Checklist

- [ ] All 12 audio files playable
- [ ] Background playback works
- [ ] Audio session handles interruptions
- [ ] Progress bar seekable
- [ ] Session data saves correctly
- [ ] Breathing animations smooth
- [ ] Haptic feedback synchronized
- [ ] Reminders trigger at set time
- [ ] Offline playback (cached)

## Technical Details

**Audio Files**:
- **Format**: M4A (AAC)
- **Bitrate**: 128kbps
- **Sample Rate**: 44.1kHz
- **Size**: ~5-15MB per file
- **Total**: 12 files (~100-150MB)

**Player**: react-native-track-player
- Background playback
- Lock screen controls
- AirPlay support

**Caching**:
- Download meditations for offline use
- Store in app Documents directory
- ~150MB total cache

**Database**:
```sql
CREATE TABLE meditations (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  duration_seconds INT NOT NULL,
  audio_url TEXT NOT NULL,
  narrator_gender TEXT CHECK (narrator_gender IN ('male', 'female')),
  tier_required TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE meditation_sessions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  meditation_id UUID REFERENCES meditations(id),
  completed BOOLEAN DEFAULT FALSE,
  duration_seconds INT,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Subscription Gating**:
- **Novice**: 3 meditations (female only)
- **Awakening**: 6 meditations (male + female)
- **Enlightenment**: All + early access to new

## Resources

- **PRD**: Section 3.1.3 - Meditation & Breathing Exercises
- **TDD**: Section 6 - Meditation Player
- **react-native-track-player**: https://react-native-track-player.js.org

## Current Status

**Not Started**

## Notes

(Add notes on audio recording, narrator selection, haptic tuning)
