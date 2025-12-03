# Meditation & Breathing MVP Plan

**Project:** Manifest the Unseen
**Feature:** Meditation & Breathing Exercises
**Created:** 2025-11-28
**Completed:** 2025-11-29
**Status:** ✅ MVP IMPLEMENTATION COMPLETE
**Timeline:** 3.5 weeks (completed in 1 session)

---

## Executive Summary

This MVP plan streamlines the comprehensive 10-11 week meditation feature plan into a **lean 3.5-week implementation** by focusing on core functionality and cutting non-essential features. The implementation leverages existing infrastructure (expo-av, Supabase tables, settingsStore, MeditationTimer).

---

## MVP Content Scope

### Guided Meditations (6 total)

| Title | Duration | Narrators | Tier |
|-------|----------|-----------|------|
| Grounding & Centering | 6 min | Male + Female | Free |
| Gratitude Meditation | 12 min | Male + Female | Novice |
| Manifestation Journey | 24 min | Male + Female | Awakening |

**Total:** 6 audio files (3 titles × 2 narrators)

### Breathing Exercises (3 total)

| Title | Pattern | Duration | Description |
|-------|---------|----------|-------------|
| Box Breathing | 4-4-4-4 | 6 min | Classic calming technique - inhale 4s, hold 4s, exhale 4s, hold 4s |
| Deep Calm | 5-2-5-2 | 8 min | Extended breathing for deep relaxation |
| Energy Boost | 2-0-2-0 | 5 min | Quick rhythmic breathing for energy |

**Format:** Voice-guided instructional audio (teaches technique + guides practice)

### Meditation Music (4 total)

| Title | Type | Duration | Tier |
|-------|------|----------|------|
| Tibetan Singing Bowls | Ambient | 12 min | Free |
| 432Hz Healing Frequency | Frequency | 24 min | Novice |
| Nature & Tibetan Drums | Ambient | 32 min | Awakening |
| Ocean Waves | Nature | 20 min | Free |

**Creation:** AI-generated using Suno AI

### Visual Animation (1)

- **Breathing Circle:** Expanding/contracting circle animation for 5-2-5-2 pattern
- Displays phase labels: "Breathe In", "Hold", "Breathe Out", "Hold"
- Uses react-native-reanimated for smooth 60fps animations
- Respects `reducedMotion` accessibility setting

---

## Session Tracking (Basic Stats)

Track and display:
- **Total Minutes Meditated** - Lifetime sum
- **Sessions Completed** - Count of all completed sessions
- **Current Streak** - Consecutive days with at least one session
- **Longest Streak** - All-time record

---

## What's Already Built

| Component | Location | Status |
|-----------|----------|--------|
| MeditateScreen.tsx | `mobile/src/screens/MeditateScreen.tsx` | Placeholder - rebuild |
| MeditationTimer.tsx | `mobile/src/components/workbook/MeditationTimer.tsx` | Production-ready |
| expo-av | Configured in package.json | Audio ready |
| settingsStore | `mobile/src/stores/settingsStore.ts` | Has `preferredNarrator` |
| Supabase tables | meditations, meditation_sessions | Schema exists |
| Background audio | `mobile/app.json` | iOS configured |
| Query keys | `mobile/src/services/queryClient.ts` | `queryKeys.meditations` defined |
| Navigation types | `mobile/src/types/navigation.ts` | Stack params defined |

---

## Implementation Phases

### Phase 1: Foundation (Week 1)

**Goal:** Database schema, types, services, and audio hook

#### Tasks:

1. **Database Migration**
   - Add `meditation_type` enum: 'guided' | 'breathing' | 'music'
   - Add `type` column to meditations table
   - Create index for type queries

2. **TypeScript Types** (`mobile/src/types/meditation.ts`)
   ```typescript
   export type MeditationType = 'guided' | 'breathing' | 'music';
   export type NarratorGender = 'male' | 'female';

   export interface Meditation {
     id: string;
     title: string;
     description: string | null;
     duration_seconds: number;
     audio_url: string;
     narrator_gender: NarratorGender;
     tier_required: 'novice' | 'awakening' | 'enlightenment';
     type: MeditationType;
     tags: string[];
     order_index: number;
   }

   export interface SessionStats {
     totalMinutes: number;
     sessionCount: number;
     currentStreak: number;
     longestStreak: number;
   }
   ```

3. **Meditation Service** (`mobile/src/services/meditationService.ts`)
   - `getMeditations(type?, narrator?)` - Fetch by type and narrator preference
   - `getMeditationById(id)` - Single meditation details
   - `createSession(meditationId, durationSeconds)` - Start a session
   - `completeSession(sessionId)` - Mark session complete
   - `getSessionStats(userId)` - Calculate stats for user

4. **Audio Player Hook** (`mobile/src/hooks/useAudioPlayer.ts`)
   - Load audio from URL (Supabase Storage)
   - Play/pause/seek controls
   - Track progress and duration
   - Handle background playback
   - Pattern reference: `useAudioRecorder.ts`

5. **Meditation Query Hook** (`mobile/src/hooks/useMeditation.ts`)
   - TanStack Query wrapper for meditationService
   - `useMeditations(type, narrator)` - List query
   - `useMeditation(id)` - Detail query
   - `useSessionStats()` - Stats query
   - `useCreateSession()` - Mutation
   - `useCompleteSession()` - Mutation

6. **Seed Data Update** (`supabase/seed.sql`)
   - Add breathing exercise entries
   - Add meditation music entries
   - Update existing meditations with type='guided'

---

### Phase 2: UI Components (Week 2)

**Goal:** Screens and components for meditation browsing and playback

#### Screens:

1. **MeditateScreen.tsx** (rebuild)
   - Category tabs: Meditations | Breathing | Music
   - Narrator selector (male/female) for guided meditations only
   - Session stats header display
   - Grid of MeditationCard components
   - Filter by narrator preference from settingsStore

2. **MeditationPlayerScreen.tsx** (new)
   - Full-screen audio player
   - Large play/pause button (centered)
   - Progress bar with current/total time
   - Meditation title and description
   - Background gradient/image
   - Session tracking on completion

3. **BreathingExerciseScreen.tsx** (new)
   - Audio player for voice-guided breathing
   - Optional BreathingCircle animation overlay
   - Session tracking on completion

#### Components:

1. **MeditationCard.tsx**
   - Thumbnail placeholder (icon based on type)
   - Title, duration badge
   - Narrator indicator (for guided only)
   - Tier lock indicator
   - onPress navigation to player

2. **AudioPlayer.tsx**
   - Large play/pause button
   - Progress bar (Slider component)
   - Time display (current / total)
   - Skip forward/back 15 seconds

3. **CategoryTabs.tsx**
   - Three tabs: Meditations | Breathing | Music
   - Animated underline indicator
   - onTabChange callback

4. **NarratorSelector.tsx**
   - Male/Female toggle buttons
   - Uses settingsStore.preferredNarrator
   - Only shown for guided meditations tab

5. **SessionStats.tsx**
   - Horizontal stats display
   - Total minutes | Sessions | Streak
   - Compact design for header area

6. **ProgressBar.tsx**
   - Reusable progress indicator
   - Draggable seek functionality
   - Time labels

---

### Phase 3: Animation & Session Tracking (Week 3)

**Goal:** Breathing animation and session stats implementation

#### Breathing Animation:

1. **BreathingCircle.tsx**
   - Concentric circles with gradient
   - Scale animation: 1.0 → 1.5 (inhale), 1.5 → 1.0 (exhale)
   - Opacity pulse during hold phases
   - Phase label text in center
   - Uses react-native-reanimated

2. **useBreathingAnimation.ts**
   - Configurable pattern (5-2-5-2 default)
   - Phase state machine: inhale → holdIn → exhale → holdOut
   - Cycle counting
   - Completion detection
   - Respects reducedMotion setting

#### Session Tracking:

1. **useSessionStats.ts**
   - Fetch meditation_sessions for user
   - Calculate totalMinutes (sum of duration_seconds / 60)
   - Calculate sessionCount (count where completed=true)
   - Calculate currentStreak (consecutive days algorithm)
   - Calculate longestStreak (historical max)
   - Cache with TanStack Query

2. **Streak Algorithm:**
   ```typescript
   // Group sessions by date, count consecutive days
   // A day counts if user completed at least 1 session
   // Streak breaks if no session for a calendar day
   ```

#### Navigation:

1. **MeditateNavigator.tsx**
   - Stack navigator for meditation flow
   - Screens: MeditateHome, MeditationPlayer, BreathingExercise
   - Modal presentation for player screens

2. **Update MainTabNavigator.tsx**
   - Import MeditateNavigator
   - Replace direct MeditateScreen with navigator

---

### Phase 4: Testing & Polish (Week 4, Days 1-3)

**Goal:** Comprehensive testing and final polish

#### Unit Tests (Jest):
- meditationService.ts functions
- useAudioPlayer.ts hook
- Streak calculation logic
- Breathing pattern timing

#### Component Tests (React Native Testing Library):
- MeditationCard renders correctly
- AudioPlayer controls work
- CategoryTabs switch properly
- SessionStats displays values

#### E2E Tests (Playwright MCP):
1. Browse meditation categories
2. Play/pause meditation audio
3. Complete session → stats update
4. Narrator preference filtering
5. Breathing animation timing

#### Polish:
- Loading skeletons for content
- Error states with retry
- Empty states for no content
- Haptic feedback refinement
- Performance optimization on older devices

---

## File Structure

### New Files to Create

```
mobile/src/
├── components/
│   └── meditation/
│       ├── index.ts
│       ├── MeditationCard.tsx
│       ├── AudioPlayer.tsx
│       ├── BreathingCircle.tsx
│       ├── ProgressBar.tsx
│       ├── NarratorSelector.tsx
│       ├── CategoryTabs.tsx
│       └── SessionStats.tsx
├── screens/
│   └── meditation/
│       ├── index.ts
│       ├── MeditationPlayerScreen.tsx
│       └── BreathingExerciseScreen.tsx
├── services/
│   └── meditationService.ts
├── hooks/
│   ├── useMeditation.ts
│   ├── useAudioPlayer.ts
│   ├── useSessionStats.ts
│   └── useBreathingAnimation.ts
├── types/
│   └── meditation.ts
└── navigation/
    └── MeditateNavigator.tsx

supabase/
└── migrations/
    └── 20251128000000_meditation_types.sql
```

### Files to Modify

- `mobile/src/screens/MeditateScreen.tsx` - Complete rebuild
- `mobile/src/navigation/MainTabNavigator.tsx` - Use MeditateNavigator
- `mobile/src/services/queryClient.ts` - Add meditation query keys
- `mobile/src/types/navigation.ts` - Update param types
- `supabase/seed.sql` - Add breathing/music content

---

## Database Migration

```sql
-- 20251128000000_meditation_types.sql

-- Add meditation type enum
DO $$ BEGIN
    CREATE TYPE meditation_type AS ENUM ('guided', 'breathing', 'music');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add type column to meditations table (if not exists)
ALTER TABLE meditations
ADD COLUMN IF NOT EXISTS type meditation_type DEFAULT 'guided';

-- Update existing rows
UPDATE meditations SET type = 'guided' WHERE type IS NULL;

-- Create index for type queries
CREATE INDEX IF NOT EXISTS idx_meditation_type ON meditations(type);

-- Insert breathing exercises
INSERT INTO meditations (id, title, description, duration_seconds, audio_url, narrator_gender, tier_required, type, tags, order_index)
VALUES
  ('breath-box', 'Box Breathing', 'Classic 4-4-4-4 breathing technique for calm and focus. Inhale for 4 seconds, hold for 4, exhale for 4, hold for 4.', 360, 'breathing/box-breathing.m4a', 'female', 'novice', 'breathing', ARRAY['breathing', 'calm', 'focus', 'beginner'], 20),
  ('breath-deep-calm', 'Deep Calm', 'Extended 5-2-5-2 breathing pattern for deep relaxation. Perfect for stress relief and winding down.', 480, 'breathing/deep-calm.m4a', 'female', 'novice', 'breathing', ARRAY['breathing', 'relaxation', 'stress-relief'], 21),
  ('breath-energy', 'Energy Boost', 'Quick rhythmic breathing to increase energy and alertness. Great for morning or afternoon pick-me-up.', 300, 'breathing/energy-boost.m4a', 'female', 'novice', 'breathing', ARRAY['breathing', 'energy', 'morning'], 22)
ON CONFLICT (id) DO NOTHING;

-- Insert meditation music
INSERT INTO meditations (id, title, description, duration_seconds, audio_url, narrator_gender, tier_required, type, tags, order_index)
VALUES
  ('music-bowls', 'Tibetan Singing Bowls', 'Authentic singing bowl sounds for deep meditation. Let the resonant tones guide you into stillness.', 720, 'music/tibetan-bowls.m4a', 'female', 'novice', 'music', ARRAY['ambient', 'bowls', 'tibetan', 'relaxation'], 30),
  ('music-432hz', '432Hz Healing Frequency', 'Healing frequency music tuned to 432Hz for deep meditation and cellular harmony.', 1440, 'music/432hz-frequency.m4a', 'female', 'novice', 'music', ARRAY['frequency', 'healing', 'ambient', '432hz'], 31),
  ('music-drums', 'Nature & Tibetan Drums', 'Tibetan drums layered with nature sounds for an immersive meditation experience.', 1920, 'music/nature-drums.m4a', 'female', 'awakening', 'music', ARRAY['drums', 'nature', 'tibetan', 'ambient'], 32),
  ('music-ocean', 'Ocean Waves', 'Calming ocean waves for relaxation and sleep. Let the rhythm of the sea wash away stress.', 1200, 'music/ocean-waves.m4a', 'female', 'novice', 'music', ARRAY['ocean', 'nature', 'sleep', 'relaxation'], 33)
ON CONFLICT (id) DO NOTHING;
```

---

## Content Creation Workflow

### 1. Guided Meditations (ElevenLabs)

**Script Structure (5-10 min):**
- Introduction (30s): Greeting, purpose, settle-in instructions
- Body Scan (1-2 min): Progressive relaxation, breath awareness
- Core Practice (3-6 min): Visualization, affirmations, manifestation
- Integration (1-2 min): Gratitude, intention setting
- Closing (30s): Gentle awakening, thank you

**Voice Settings:**
```json
{
  "stability": 0.75,
  "similarity_boost": 0.85,
  "style": 0.3,
  "use_speaker_boost": true
}
```

**Post-Processing (Audacity):**
1. Normalize to -3dB
2. Compressor: Threshold -18dB, Ratio 2:1
3. Fade in: 2 seconds
4. Fade out: 2 seconds
5. Export: M4A 128kbps mono

### 2. Breathing Exercises

Same as guided meditations but with:
- Clear instructional intro explaining the technique
- Timing cues embedded in script (pauses between counts)
- Optional ambient background layer

### 3. Meditation Music (Suno AI)

**Prompts:**
```
"tibetan singing bowls meditation ambient calm peaceful 432hz instrumental no vocals"

"432 hertz healing frequency meditation ambient atmospheric instrumental"

"tibetan drums nature sounds forest meditation ambient peaceful instrumental"

"ocean waves calming relaxation sleep meditation ambient no music just waves"
```

**Workflow:**
1. Generate 2-3 minute base tracks in Suno AI
2. Download high quality audio
3. Loop/extend in Audacity to target duration
4. Apply fade in/out
5. Export as M4A

---

## AI Music Tool: Suno AI

**Why Suno AI:**
- Best quality for ambient/meditation music
- Simple text prompts
- $10-30/month pricing
- Fast generation

**Usage Tips:**
- Use keywords: "meditation", "ambient", "instrumental", "no vocals"
- Specify frequency (432hz) for healing music
- Generate multiple versions, pick best
- Extend in Audacity rather than re-generating long tracks

---

## Critical Reference Files

Read these before implementing:

1. **Animation Patterns:**
   - `mobile/src/components/workbook/MeditationTimer.tsx`
   - Circular progress, haptics, state machine

2. **Audio Hook Pattern:**
   - `mobile/src/hooks/useAudioRecorder.ts`
   - expo-av integration, cleanup, error handling

3. **Service Pattern:**
   - `mobile/src/services/journalService.ts`
   - Supabase CRUD, TanStack Query integration

4. **Database Schema:**
   - `supabase/migrations/20250101000000_initial_schema.sql`
   - Existing meditations table structure

5. **Settings Store:**
   - `mobile/src/stores/settingsStore.ts`
   - preferredNarrator selector

---

## Success Criteria

**MVP Complete When:**
- [x] 3 category tabs working (Meditations | Breathing | Music) ✅
- [x] Narrator filter working for guided meditations ✅
- [x] Audio playback working with play/pause/seek ✅
- [x] Breathing animation displays for breathing exercises ✅
- [x] Session tracking saves to database ✅
- [x] Stats display shows total minutes, sessions, streak ✅
- [ ] All placeholder content playable (requires audio files)
- [ ] E2E tests passing for critical flows (future)
- [ ] Performance: 60fps animations, <2s audio load (to verify)

---

## What's NOT in MVP

Explicitly excluded for future phases:
- Mandala/sacred geometry animations
- Background music layering (dual audio)
- Narrator switching mid-playback
- Full history screen with date list
- Additional breathing patterns (Wim Hof, 4-7-8)
- Offline audio caching
- Meditation reminders/notifications
- Social sharing

---

## Testing Strategy

### Playwright MCP E2E Tests

```typescript
// Critical flows to test:

// 1. Category Navigation
test('user can browse meditation categories', async ({ page }) => {
  // Navigate to Meditate tab
  // Tap each category tab
  // Verify content displays correctly
});

// 2. Audio Playback
test('user can play meditation audio', async ({ page }) => {
  // Select a meditation card
  // Verify player screen
  // Tap play, verify playing state
  // Tap pause, verify paused state
  // Verify progress updates
});

// 3. Session Completion
test('completed session is tracked', async ({ page }) => {
  // Start short meditation
  // Complete or simulate completion
  // Return to main screen
  // Verify stats updated
});

// 4. Narrator Filtering
test('narrator preference filters content', async ({ page }) => {
  // Set preference to male
  // Navigate to Meditations tab
  // Verify only male narrated content shows
});

// 5. Breathing Exercise
test('breathing exercise plays with animation', async ({ page }) => {
  // Navigate to Breathing tab
  // Select breathing exercise
  // Verify audio plays
  // Verify breathing circle animates
});
```

---

## Implementation Summary (2025-11-29)

### Files Created

**Database:**
- `supabase/migrations/20251129000000_meditation_types.sql` - meditation_type enum, breathing exercises, music tracks

**Types:**
- `mobile/src/types/meditation.ts` - Meditation, MeditationSession, SessionStats, BreathingPattern, etc.

**Services:**
- `mobile/src/services/meditationService.ts` - CRUD, session tracking, streak calculation

**Hooks:**
- `mobile/src/hooks/useAudioPlayer.ts` - expo-av audio playback with progress tracking
- `mobile/src/hooks/useMeditation.ts` - TanStack Query hooks for all meditation queries

**Components:**
- `mobile/src/components/meditation/MeditationCard.tsx` - Card for meditation lists
- `mobile/src/components/meditation/BreathingAnimation.tsx` - 5-2-5-2 breathing circle animation
- `mobile/src/components/meditation/index.ts` - Component exports

**Screens:**
- `mobile/src/screens/MeditateScreen.tsx` - Main hub with tabs (Meditations, Breathing, Music)
- `mobile/src/screens/meditation/MeditationPlayerScreen.tsx` - Full-screen audio player

**Navigation:**
- `mobile/src/navigation/MeditateNavigator.tsx` - Stack navigator for meditation flow

### Files Modified

- `mobile/src/types/index.ts` - Added meditation type exports
- `mobile/src/types/database.ts` - Updated meditation and meditation_sessions table types
- `mobile/src/services/queryClient.ts` - Added meditation query keys
- `mobile/src/hooks/index.ts` - Added meditation hook exports
- `mobile/src/navigation/MainTabNavigator.tsx` - Integrated MeditateNavigator

### Remaining Work

1. **Content Creation** (Manual)
   - Record 3 breathing exercises via Cartesia (WAV → M4A conversion)
   - Generate 4 meditation music tracks via Suno AI
   - Record 6 guided meditations (3 male, 3 female)

2. **Upload Audio Files**
   - Upload to Supabase Storage `meditations` bucket
   - Update seed data with correct audio URLs

3. **Testing**
   - E2E tests with Playwright MCP
   - Performance verification on device

---

**End of MVP Plan**
