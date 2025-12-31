# Meditation & Breathing Exercise Feature - Implementation Plan

**Project:** Manifest the Unseen - Phase II
**Created:** 2025-11-28
**Status:** In Progress - Planning Complete
**Timeline:** 10-11 weeks | **Effort:** 174-220 hours

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Current State Assessment](#current-state-assessment)
3. [Architecture Overview](#architecture-overview)
4. [Key Implementation Decisions](#key-implementation-decisions)
5. [Implementation Phases](#implementation-phases)
6. [Critical Files to Create/Modify](#critical-files-to-createmodify)
7. [Dependencies](#dependencies)
8. [AI Voice Generation Workflow](#ai-voice-generation-workflow)
9. [Potential Challenges & Mitigations](#potential-challenges--mitigations)
10. [Testing Strategy](#testing-strategy)
11. [Timeline Summary](#timeline-summary)
12. [Success Criteria](#success-criteria)

---

## Executive Summary

Build a unified meditation and breathing exercise system for Manifest the Unseen that includes:
- Guided meditation player with AI-generated monk narration (male/female)
- 5+ comprehensive breathing exercises with visual animations
- Background music support (Tibetan bells, frequency music)
- Animated visual experiences (breathing circles, mandalas, sacred geometry)
- Session tracking and history
- Seamless integration with existing app infrastructure

**Key Features:**
- 6 guided meditations (both male and female AI-generated narration)
- 5+ breathing patterns (Box, Triangle, 4-7-8, Coherent, Wim Hof)
- Visual breathing animations with reanimated (60fps target)
- Background music layer system (3-5 ambient tracks)
- Session history and statistics with streak tracking

---

## Current State Assessment

### What's Already Built ✅
- All 10 workbook phases complete (42 screen files)
- Audio infrastructure: `expo-av` installed, `VoiceRecorder` component working
- Navigation: 5-tab structure with "Meditate" tab (currently placeholder)
- State management: Zustand stores (auth, settings, workbook, app)
- Supabase integration with `meditations` and `meditation_sessions` tables
- Settings store has `preferredNarrator` (male/female) ready
- `MeditationTimer.tsx` component exists (circular timer with animations, haptics)
- Background audio enabled in `app.json`

### What Needs Building ❌
- Meditation player UI and audio playback logic
- Breathing exercise screen with visual animations
- Meditation library/browser
- Background music layer system
- Session tracking implementation
- Meditation content creation (AI voice generation)

---

## Architecture Overview

### Navigation Structure
```
Meditate Tab (MainTabNavigator)
├── MeditateHomeScreen (main hub)
│   ├── Meditation Library Section
│   └── Breathing Exercises Section
├── MeditationPlayerScreen (audio playback)
├── BreathingExerciseScreen (breathing patterns)
└── MeditationHistoryScreen (stats & history)
```

### State Management
**New Store:** `meditationStore.ts` (Zustand)
- Current meditation/breathing session state
- Playback position, isPlaying status
- Meditation library data
- Background music settings
- Session tracking

**New Service:** `meditationService.ts`
- Fetch meditations from Supabase
- Create/update meditation sessions
- Track completion and history
- Audio URL generation

---

## Key Implementation Decisions

### 1. Audio Library: expo-av (Already Installed)
**Rationale:** Already in package.json, simpler API, Expo integration, supports both playback and recording
- Two `Audio.Sound` instances: meditation voice (85% volume) + background music (30% volume)
- Fade in/out for background music
- Background playback already configured in app.json

### 2. Animation Library: react-native-reanimated 2
**Rationale:** UI thread performance (60fps), best for breathing circle animations
- Primary: Breathing circle (scale/opacity animations)
- Secondary: Lottie for mandalas/sacred geometry (pre-made JSON animations)
- Fallback: Simple fade animations if `reducedMotion` enabled

### 3. AI Voice Generation: ElevenLabs (Recommended)
**Rationale:** Best natural voice quality, emotional control, voice cloning capability
- Generate 4-6 guided meditations (5-10 min each)
- Both male and female narrator versions
- Alternative: Google Cloud TTS (cheaper at scale)
- Post-process with Audacity (normalize, compress, fade)
- Optimize: 128kbps mono MP3 (~1MB per minute)

### 4. Breathing Patterns: 5+ Comprehensive Set
1. Box Breathing (4-4-4-4) - Beginner
2. Triangle Breathing (4-4-4) - Beginner
3. 4-7-8 Breathing - Intermediate
4. Coherent Breathing (5-5) - Beginner
5. Wim Hof Method - Advanced
6. Alternate Nostril (simulation) - Optional

### 5. Visual Animations
- **Breathing Circle:** Expanding/contracting with phase-driven animations
- **Mandalas:** Lottie JSON animations (rotating, pulsing)
- **Backgrounds:** 10 static images (nature, abstract, sacred geometry)
- **Performance Target:** 60fps on iPhone 11+

---

## Implementation Phases

### Phase 1: Foundation (Week 1-2) - 12-16 hours
**Goal:** Set up architecture, navigation, data layer

**Tasks:**
- [ ] Create `meditationStore.ts` with Zustand state management
- [ ] Create `meditationService.ts` with Supabase queries
- [ ] Set up `MeditationNavigator.tsx` stack
- [ ] Update `MainTabNavigator.tsx` to use meditation navigator
- [ ] Define TypeScript types (`meditation.ts`)
- [ ] Seed database with 1 test meditation (both narrators)
- [ ] Define breathing patterns as constants

**Deliverable:** Navigation works, can fetch meditation data, store setup complete

---

### Phase 2: Meditation Player MVP (Week 2-3) - 20-24 hours
**Goal:** Functional audio playback with narrator switching

**Tasks:**
- [ ] Create `MeditationPlayerScreen.tsx` basic layout
- [ ] Implement `MeditationPlayer.tsx` component
  - [ ] Load audio from Supabase Storage URL using expo-av
  - [ ] Play/pause/seek controls
  - [ ] Progress bar with time display
  - [ ] `NarratorSwitcher.tsx` component (male/female toggle)
  - [ ] Preserve playback position when switching narrators
- [ ] Session tracking integration
  - [ ] Create session on play
  - [ ] Update progress every 60 seconds
  - [ ] Mark complete when >80% played
- [ ] Basic `PlayerControls.tsx` (play/pause, skip ±15s)

**Deliverable:** Can play meditation, switch narrators, sessions tracked in Supabase

---

### Phase 3: Breathing Exercises MVP (Week 3-4) - 18-22 hours
**Goal:** Functional breathing exercises with visual animation

**Tasks:**
- [ ] Create `BreathingExerciseScreen.tsx` layout
- [ ] Implement `BreathingCircle.tsx` with react-native-reanimated
  - [ ] Scale animation: 1.0 → 1.5 (inhale), 1.5 → 1.0 (exhale)
  - [ ] Opacity changes for visual depth
  - [ ] Pulsing effect during hold phase
  - [ ] Concentric circles (3 layers) with gradients
- [ ] Implement `BreathingTimer.tsx` timing logic
  - [ ] Phase progression engine (inhale → hold → exhale → rest)
  - [ ] Cycle counting
  - [ ] Completion detection
- [ ] Add haptic feedback on phase transitions (expo-haptics)
- [ ] Display instruction text ("Breathe in", "Hold", "Breathe out")
- [ ] Implement 3 breathing patterns (Box, Triangle, 4-7-8)
- [ ] Session tracking (reuse meditation_sessions table or create breathing_sessions)

**Deliverable:** 3 working breathing exercises with smooth animations, timer, haptics

---

### Phase 4: Background Music & Audio Layers (Week 4-5) - 12-16 hours
**Goal:** Background music support, volume mixing

**Tasks:**
- [ ] Upload 3-5 background music tracks to Supabase Storage
  - Tibetan singing bowls
  - 432Hz frequency music
  - Nature sounds (forest, ocean)
  - Binaural beats
- [ ] Create `BackgroundMusicPicker.tsx` component
- [ ] Implement dual Audio.Sound instances (meditation + music)
- [ ] Volume mixing: meditation 85%, background music 20-40%
- [ ] Fade in/out for background music (start 5s after meditation, end 10s before)
- [ ] Settings persistence in `settingsStore.ts`
- [ ] Preview playback (10 seconds) in picker

**Deliverable:** Background music works, user can select tracks, volume balanced properly

---

### Phase 5: Meditation Library & Home Screen (Week 5-6) - 16-20 hours
**Goal:** Polished home screen with meditation browsing

**Tasks:**
- [ ] Create `MeditateHomeScreen.tsx` with sections
  - Quick start (suggested meditation + breathing)
  - Meditation library grid
  - Breathing exercises list
- [ ] Implement `MeditationLibrary.tsx` component
- [ ] Create `MeditationCard.tsx` with thumbnail, title, duration, narrator badges
- [ ] Implement `BreathingExerciseList.tsx`
- [ ] Create `BreathingPatternCard.tsx` with difficulty indicator
- [ ] "Continue where you left off" feature (resume last session)
- [ ] Optional: Search/filter functionality

**Deliverable:** Beautiful home screen, easy browsing, professional card designs

---

### Phase 6: Visual Enhancements (Week 6-7) - 14-18 hours
**Goal:** Mandala animations, backgrounds, audio cues

**Tasks:**
- [ ] Add `MandalaAnimation.tsx` with Lottie
  - Source/create 2-3 mandala JSON animations
  - Integrate into meditation player background
  - Integrate into breathing screen
- [ ] Add 10 background images to `assets/images/meditation-backgrounds/`
  - Nature: mountains, ocean, forest, sunset, stars
  - Abstract: purple-gold gradients, geometric patterns
  - Sacred: mandalas, yantras, chakra symbols
- [ ] Implement background image selector (swipe to change)
- [ ] Add breathing audio cues (bells, chimes)
  - Session start/end sounds
  - Optional phase transition chimes
  - Toggle in settings
- [ ] Add glow effects and gradients to breathing circle
- [ ] Smooth screen transitions

**Deliverable:** App looks beautiful, calming, meditation-appropriate visuals

---

### Phase 7: History & Stats (Week 7-8) - 12-16 hours
**Goal:** Session tracking, stats, streaks

**Tasks:**
- [ ] Create `MeditationHistoryScreen.tsx`
- [ ] Implement `SessionHistoryList.tsx` with FlatList
  - Fetch sessions from Supabase
  - Display date, meditation name, duration
  - Filter by type (meditation vs. breathing)
- [ ] Create `MeditationStatsCard.tsx` components
  - Total minutes meditated
  - Sessions completed
  - Current streak (consecutive days)
  - Longest streak
- [ ] Calculate stats in `meditationService.ts` (aggregate queries)
- [ ] Streak logic implementation

**Deliverable:** User can see history, stats motivate continued practice

---

### Phase 8: Additional Breathing Patterns (Week 8) - 8-10 hours
**Goal:** Expand to 5+ breathing patterns

**Tasks:**
- [ ] Add Coherent Breathing (5-5)
- [ ] Add Wim Hof Method (with special hold phase UI)
- [ ] Add Alternate Nostril (simulation with visual cues)
- [ ] Update `BreathingTimer.tsx` to handle variable phase counts
- [ ] Test all patterns for timing accuracy
- [ ] Add benefits/description text for each pattern

**Deliverable:** 5-6 comprehensive breathing patterns available

---

### Phase 9: Content Creation (Week 9-10) - 20-30 hours
**Goal:** Create and upload 4-6 meditation audio files

**Meditation Scripts to Write:**
1. Manifestation Basics (5 min)
2. Gratitude Meditation (8 min)
3. Self-Love Affirmation (7 min)
4. Fear Release (10 min)
5. Vision Alignment (10 min)
6. Abundance Mindset (8 min)

**Tasks:**
- [ ] Write meditation scripts (calm, present-tense, 120-140 words/min pacing)
- [ ] Generate AI voices using ElevenLabs
  - Male narrator for all 6 meditations
  - Female narrator for all 6 meditations
  - Voice settings: stability 0.75, similarity_boost 0.85, style 0.3
- [ ] Post-process audio in Audacity
  - Normalize to -3dB
  - Gentle compression (2:1 ratio)
  - 2-second fade in/out
- [ ] Optimize for mobile: 128kbps mono MP3
- [ ] Upload to Supabase Storage bucket (`meditations/`)
- [ ] Seed database with meditation metadata

**Deliverable:** 6 production-ready meditations, both narrators, uploaded and accessible

---

### Phase 10: Polish & Testing (Week 10-11) - 16-20 hours
**Goal:** Bug fixes, performance, edge cases

**Tasks:**
- [ ] Handle edge cases
  - Network failures (retry logic, offline message)
  - App backgrounding during session (resume playback)
  - Phone call interruptions (pause, resume)
  - Low battery mode (disable complex animations)
- [ ] Performance optimization
  - Test on iPhone 11 (older device)
  - Profile memory usage (target: <150MB)
  - Ensure 60fps animations
- [ ] Accessibility
  - VoiceOver support for all interactive elements
  - Reduced motion setting support
  - Touch target sizes (min 44x44pt)
- [ ] Error handling
  - Graceful degradation
  - User-friendly error messages
- [ ] Manual testing
  - All meditation playback scenarios
  - All breathing patterns
  - Narrator switching
  - Background music
  - Session tracking accuracy

**Deliverable:** Stable, polished, production-ready meditation feature

---

## Critical Files to Create/Modify

### New Files to Create

**Stores:**
- `mobile/src/stores/meditationStore.ts` - Core state management

**Services:**
- `mobile/src/services/meditationService.ts` - Supabase integration

**Types:**
- `mobile/src/types/meditation.ts` - TypeScript interfaces
- `mobile/src/constants/breathingPatterns.ts` - Pattern definitions

**Navigation:**
- `mobile/src/navigation/MeditationNavigator.tsx` - Stack navigator

**Screens:**
- `mobile/src/screens/MeditateHomeScreen.tsx` (replaces MeditateScreen.tsx)
- `mobile/src/screens/MeditationPlayerScreen.tsx`
- `mobile/src/screens/BreathingExerciseScreen.tsx`
- `mobile/src/screens/MeditationHistoryScreen.tsx`

**Components - Meditation:**
- `mobile/src/components/meditation/MeditationPlayer.tsx` - Audio playback logic
- `mobile/src/components/meditation/PlayerControls.tsx` - Play/pause/seek UI
- `mobile/src/components/meditation/NarratorSwitcher.tsx` - Male/female toggle
- `mobile/src/components/meditation/BackgroundMusicPicker.tsx` - Music selection
- `mobile/src/components/meditation/MeditationLibrary.tsx` - Grid container
- `mobile/src/components/meditation/MeditationCard.tsx` - Individual card

**Components - Breathing:**
- `mobile/src/components/meditation/BreathingCircle.tsx` - Animated circle (reanimated)
- `mobile/src/components/meditation/BreathingTimer.tsx` - Timing logic
- `mobile/src/components/meditation/BreathingExerciseList.tsx` - Pattern list
- `mobile/src/components/meditation/BreathingPatternCard.tsx` - Pattern card
- `mobile/src/components/meditation/BreathingSettings.tsx` - Settings modal

**Components - Shared:**
- `mobile/src/components/meditation/MandalaAnimation.tsx` - Lottie animations
- `mobile/src/components/meditation/SessionHistoryList.tsx` - History list
- `mobile/src/components/meditation/MeditationStatsCard.tsx` - Stats display
- `mobile/src/components/meditation/ProgressRing.tsx` - Reusable progress indicator

**Assets:**
- `mobile/assets/images/meditation-backgrounds/` - 10 background images
- `mobile/assets/sounds/breathing/` - Bell/chime sounds
- `mobile/assets/animations/` - Lottie JSON files (mandalas)

### Files to Modify

**Navigation:**
- `mobile/src/navigation/MainTabNavigator.tsx` - Import MeditationNavigator, replace MeditateScreen

**Stores:**
- `mobile/src/stores/settingsStore.ts` - Add background music settings
- `mobile/src/stores/index.ts` - Export meditationStore

**Services:**
- `mobile/src/services/index.ts` - Export meditationService

---

## Dependencies

### New Packages to Install

```bash
# Animation (likely already installed)
npm install react-native-reanimated

# Lottie for mandalas
npm install lottie-react-native
cd ios && pod install
```

### Already Installed (Use These)
- `expo-av@~16.0.7` - Audio playback ✅
- `expo-haptics@~15.0.7` - Haptic feedback ✅
- `react-native-svg@15.12.1` - SVG graphics ✅
- `zustand@^4.4.7` - State management ✅
- `@supabase/supabase-js@^2.39.0` - Database ✅

---

## AI Voice Generation Workflow

### Step 1: Write Meditation Scripts
**Script Structure:**
- Introduction (30s): Greeting, purpose, settle-in
- Body Scan (1-2min): Progressive relaxation, breath awareness
- Core Practice (3-6min): Visualization, affirmations, manifestation
- Integration (1-2min): Gratitude, intention setting
- Closing (30s): Thank you, gentle awakening

**Writing Principles:**
- Speak slowly (120-140 words/minute)
- Use ellipses (...) for pauses
- Present tense ("You are calm")
- Inclusive "we" language
- Sensory details ("Feel the warmth of your breath...")

### Step 2: Generate Audio (ElevenLabs)
```python
# Example ElevenLabs API call
import requests

ELEVENLABS_API_KEY = "your_api_key"
VOICE_ID = "Antoni"  # Male monk voice

url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"

payload = {
    "text": meditation_script,
    "model_id": "eleven_monolingual_v1",
    "voice_settings": {
        "stability": 0.75,
        "similarity_boost": 0.85,
        "style": 0.3,
        "use_speaker_boost": True
    }
}

response = requests.post(url, json=payload, headers={
    "xi-api-key": ELEVENLABS_API_KEY,
    "Content-Type": "application/json"
})

with open("manifestation-basics-male.mp3", "wb") as f:
    f.write(response.content)
```

### Step 3: Post-Process (Audacity)
1. Import generated MP3
2. Effect > Normalize (-3dB)
3. Effect > Compressor (Threshold: -18dB, Ratio: 2:1)
4. Effect > Noise Reduction (if needed)
5. Select first 2 seconds > Effect > Fade In
6. Select last 2 seconds > Effect > Fade Out
7. Export as MP3 (128kbps mono)

### Step 4: Upload to Supabase
```javascript
// upload-meditations.js
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function uploadMeditation(filePath, fileName) {
  const fileBuffer = fs.readFileSync(filePath);

  const { data, error } = await supabase.storage
    .from('meditations')
    .upload(fileName, fileBuffer, {
      contentType: 'audio/mpeg',
      cacheControl: '3600'
    });

  const { data: urlData } = supabase.storage
    .from('meditations')
    .getPublicUrl(fileName);

  return urlData.publicUrl;
}
```

### Step 5: Seed Database
```sql
INSERT INTO meditations (
  id, title, description, duration,
  audio_url_male, audio_url_female,
  tier_requirement, order_index
) VALUES (
  'manifestation-basics',
  'Manifestation Basics',
  'Learn to align your energy with your desires.',
  300,
  'https://[project].supabase.co/storage/v1/object/public/meditations/manifestation-basics-male.mp3',
  'https://[project].supabase.co/storage/v1/object/public/meditations/manifestation-basics-female.mp3',
  'free',
  1
);
```

---

## Potential Challenges & Mitigations

### 1. Audio Layering Complexity
**Challenge:** Managing two simultaneous audio streams (meditation + background music)
**Mitigation:**
- Use expo-av's audio mixing mode
- Implement fade in/out transitions
- Test on physical devices
- Allow disabling background music as fallback

### 2. Animation Performance
**Challenge:** Complex animations may cause frame drops on older devices
**Mitigation:**
- Use `useNativeDriver: true` with reanimated
- Test on iPhone X/11
- Implement `reducedMotion` fallback (simple fade)
- Profile with React DevTools

### 3. Session Tracking Accuracy
**Challenge:** Users may close app, lose network, or have interruptions
**Mitigation:**
- Save session checkpoints every 60 seconds to Supabase
- Use optimistic updates (local state immediately, sync later)
- Implement session resume (save playback position)
- Handle app backgrounding gracefully

### 4. AI Voice Quality
**Challenge:** Generated voices may sound robotic
**Mitigation:**
- Use ElevenLabs (best quality)
- Test multiple voices, choose most soothing
- Adjust SSML parameters (rate, pitch)
- Get beta tester feedback
- Budget for professional voice actor as fallback

### 5. Breathing Timer Accuracy
**Challenge:** JavaScript timers can drift, especially when backgrounded
**Mitigation:**
- Use `Date.now()` to calculate elapsed time, not just counter
- Recalibrate on each interval tick
- Pause timer when app backgrounds
- Test extensively

---

## Testing Strategy

### Manual Testing Checklist

**Meditation Player:**
- [ ] Load meditation from Supabase
- [ ] Play, pause, resume audio
- [ ] Seek to different position
- [ ] Switch narrator mid-playback
- [ ] Complete meditation (session tracked)
- [ ] Background app (resumes on foreground)
- [ ] Phone call interruption
- [ ] Network failure handling
- [ ] Background music toggle
- [ ] Volume controls

**Breathing Exercises:**
- [ ] Select pattern, start exercise
- [ ] Animation syncs with timer
- [ ] Haptics fire on phase transitions
- [ ] Complete all cycles
- [ ] Pause/resume mid-exercise
- [ ] Switch background image
- [ ] Sound cues toggle
- [ ] Session tracked correctly
- [ ] Reduced motion fallback

**Session Tracking:**
- [ ] Session created on start
- [ ] Progress updated periodically
- [ ] Session marked complete
- [ ] History shows correct data
- [ ] Stats calculate accurately

### Performance Metrics
- FPS during breathing animation: 60fps ✓
- Memory usage: <150MB ✓
- Audio load time: <2 seconds ✓
- App bundle size increase: <50MB ✓

---

## Timeline Summary

**Total Timeline:** 10-11 weeks (~2.5-3 months)
**Total Effort:** 174-220 hours

**Phase Breakdown:**
1. Foundation: 12-16 hours
2. Meditation Player MVP: 20-24 hours
3. Breathing Exercises MVP: 18-22 hours
4. Background Music: 12-16 hours
5. Library & Home Screen: 16-20 hours
6. Visual Enhancements: 14-18 hours
7. History & Stats: 12-16 hours
8. Additional Breathing Patterns: 8-10 hours
9. Content Creation: 20-30 hours
10. Polish & Testing: 16-20 hours

**Working Schedule:**
- Full-time (40 hrs/week): 4-5 weeks
- Part-time (20 hrs/week): 9-11 weeks
- Nights/weekends (10 hrs/week): 17-22 weeks

---

## Success Criteria

**MVP Launch:**
- ✓ 6 guided meditations (male/female narrators)
- ✓ 5+ breathing exercises with smooth animations
- ✓ Background music support (3-5 tracks)
- ✓ Session tracking and history
- ✓ Beautiful, calming UI
- ✓ 60fps animations on iPhone 11+
- ✓ <2 second meditation load time
- ✓ Background playback works
- ✓ Narrator switching seamless

**Quality Targets:**
- Audio quality: Natural, soothing voices
- Performance: Sustained 60fps, <150MB memory
- Reliability: No crashes, proper session tracking
- UX: Intuitive, minimal cognitive load, calming experience

---

## Next Steps

1. **Review Plan:** Confirm scope and priorities ✅
2. **Set Up Environment:** Install react-native-reanimated, lottie-react-native
3. **Begin Phase 1:** Create meditationStore.ts and meditationService.ts
4. **Parallel Track:** Start writing meditation scripts during development
5. **Iterate:** Test early and often, gather feedback

---

**Plan Version:** 1.0
**Created:** 2025-11-28
**Status:** Ready for Implementation
**Cross-Reference:** See `master-plan.md` for overall project timeline
