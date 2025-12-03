# Audio-Service-Agent

**Task ID:** meditation-audio-service
**Parent:** meditation-breathing-orchestrator.md
**Priority:** First (Foundation)
**Status:** Pending

---

## Overview

This agent creates the foundation layer for the meditation feature: database schema, TypeScript types, Supabase service, and audio playback hook.

---

## Tasks

### 1. Database Migration

**File:** `supabase/migrations/20251128000000_meditation_types.sql`

Create migration that:
- Adds `meditation_type` enum ('guided' | 'breathing' | 'music')
- Adds `type` column to meditations table
- Updates existing rows to type='guided'
- Inserts breathing exercise seed data (3 entries)
- Inserts meditation music seed data (4 entries)
- Creates index on type column

**Reference SQL in MVP Plan document.**

**Validation:**
```bash
npx supabase db push
# Should complete without errors
```

---

### 2. TypeScript Types

**File:** `mobile/src/types/meditation.ts`

Create types:
```typescript
export type MeditationType = 'guided' | 'breathing' | 'music';
export type NarratorGender = 'male' | 'female';
export type SubscriptionTier = 'novice' | 'awakening' | 'enlightenment';

export interface Meditation {
  id: string;
  title: string;
  description: string | null;
  duration_seconds: number;
  audio_url: string;
  narrator_gender: NarratorGender;
  tier_required: SubscriptionTier;
  type: MeditationType;
  tags: string[];
  order_index: number;
  created_at: string;
}

export interface MeditationSession {
  id: string;
  user_id: string;
  meditation_id: string;
  completed: boolean;
  duration_seconds: number | null;
  completed_at: string | null;
  created_at: string;
}

export interface SessionStats {
  totalMinutes: number;
  sessionCount: number;
  currentStreak: number;
  longestStreak: number;
}

export interface BreathingPattern {
  inhale: number;
  holdIn: number;
  exhale: number;
  holdOut: number;
}

export const BREATHING_PATTERNS: Record<string, BreathingPattern> = {
  box: { inhale: 4, holdIn: 4, exhale: 4, holdOut: 4 },
  deepCalm: { inhale: 5, holdIn: 2, exhale: 5, holdOut: 2 },
  energyBoost: { inhale: 2, holdIn: 0, exhale: 2, holdOut: 0 },
};
```

---

### 3. Meditation Service

**File:** `mobile/src/services/meditationService.ts`

**Pattern Reference:** `mobile/src/services/journalService.ts`

Functions to implement:

```typescript
// Fetch meditations by type and optional narrator
export async function getMeditations(
  type?: MeditationType,
  narrator?: NarratorGender
): Promise<Meditation[]>

// Fetch single meditation by ID
export async function getMeditationById(id: string): Promise<Meditation | null>

// Create a new meditation session
export async function createSession(
  userId: string,
  meditationId: string
): Promise<MeditationSession>

// Mark session as complete
export async function completeSession(
  sessionId: string,
  durationSeconds: number
): Promise<MeditationSession>

// Get user's session statistics
export async function getSessionStats(userId: string): Promise<SessionStats>

// Get audio URL from Supabase Storage
export function getMeditationAudioUrl(audioPath: string): string
```

**Implementation Notes:**
- Use `supabase` client from `services/supabase.ts`
- Handle errors gracefully with try/catch
- Return null/empty arrays on not found
- Stats calculation should use SQL aggregation where possible

---

### 4. Audio Player Hook

**File:** `mobile/src/hooks/useAudioPlayer.ts`

**Pattern Reference:** `mobile/src/hooks/useAudioRecorder.ts`

```typescript
import { useState, useCallback, useRef, useEffect } from 'react';
import { Audio, AVPlaybackStatus } from 'expo-av';

export type PlaybackState = 'idle' | 'loading' | 'playing' | 'paused' | 'ended' | 'error';

export interface UseAudioPlayerOptions {
  onComplete?: () => void;
  onError?: (error: string) => void;
}

export interface UseAudioPlayerReturn {
  // State
  state: PlaybackState;
  duration: number;         // total duration in ms
  position: number;         // current position in ms
  progress: number;         // 0-1 progress ratio
  error: string | null;

  // Controls
  load: (uri: string) => Promise<void>;
  play: () => Promise<void>;
  pause: () => Promise<void>;
  seek: (positionMs: number) => Promise<void>;
  seekRelative: (deltaMs: number) => Promise<void>;  // +/- 15000 for skip
  stop: () => Promise<void>;
  unload: () => Promise<void>;
}

export function useAudioPlayer(options?: UseAudioPlayerOptions): UseAudioPlayerReturn {
  // Implementation:
  // 1. Create Audio.Sound ref
  // 2. Set up audio mode for background playback
  // 3. Implement load() - create sound, set up status callback
  // 4. Status callback updates position/duration/state
  // 5. Implement play/pause/seek/stop
  // 6. Clean up on unmount
  // 7. Handle errors gracefully
}
```

**Key Implementation Details:**
- Configure audio mode: `{ playsInSilentModeIOS: true, staysActiveInBackground: true }`
- Use `setOnPlaybackStatusUpdate` for progress tracking
- Calculate progress as `position / duration`
- Handle `didJustFinish` for completion
- Call `onComplete` callback when audio ends
- Clean up sound on unmount with `unloadAsync()`

---

### 5. Meditation Query Hook

**File:** `mobile/src/hooks/useMeditation.ts`

**Pattern Reference:** See existing hooks using TanStack Query

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../services/queryClient';
import * as meditationService from '../services/meditationService';

// List meditations by type
export function useMeditations(type?: MeditationType, narrator?: NarratorGender) {
  return useQuery({
    queryKey: queryKeys.meditations.list(type, narrator),
    queryFn: () => meditationService.getMeditations(type, narrator),
  });
}

// Single meditation
export function useMeditation(id: string) {
  return useQuery({
    queryKey: queryKeys.meditations.detail(id),
    queryFn: () => meditationService.getMeditationById(id),
    enabled: !!id,
  });
}

// Session stats
export function useSessionStats(userId: string) {
  return useQuery({
    queryKey: queryKeys.meditations.sessions(userId),
    queryFn: () => meditationService.getSessionStats(userId),
    enabled: !!userId,
  });
}

// Create session mutation
export function useCreateSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, meditationId }: { userId: string; meditationId: string }) =>
      meditationService.createSession(userId, meditationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.meditations.sessions() });
    },
  });
}

// Complete session mutation
export function useCompleteSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ sessionId, durationSeconds }: { sessionId: string; durationSeconds: number }) =>
      meditationService.completeSession(sessionId, durationSeconds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.meditations.sessions() });
    },
  });
}
```

---

### 6. Update Query Client

**File:** `mobile/src/services/queryClient.ts`

Add meditation query keys if not complete:

```typescript
meditations: {
  all: ['meditations'] as const,
  list: (type?: string, narrator?: string) =>
    [...queryKeys.meditations.all, 'list', type, narrator] as const,
  detail: (id: string) =>
    [...queryKeys.meditations.all, 'detail', id] as const,
  sessions: (userId?: string) =>
    [...queryKeys.meditations.all, 'sessions', userId] as const,
},
```

---

## Validation Checklist

Before marking complete:

- [ ] Migration runs: `npx supabase db push` succeeds
- [ ] Types compile: No TypeScript errors
- [ ] Service works: Manual test of getMeditations() returns data
- [ ] Audio hook works: Load and play test audio URL
- [ ] Query hooks work: useMeditations() returns data in component

---

## Dependencies

**Required Packages (already installed):**
- expo-av
- @supabase/supabase-js
- @tanstack/react-query
- zustand

---

## Output

When complete, these files should exist and be functional:
1. `supabase/migrations/20251128000000_meditation_types.sql` (applied)
2. `mobile/src/types/meditation.ts`
3. `mobile/src/services/meditationService.ts`
4. `mobile/src/hooks/useAudioPlayer.ts`
5. `mobile/src/hooks/useMeditation.ts`
6. `mobile/src/services/queryClient.ts` (updated)

**Report:** "Audio-Service-Agent complete - Foundation layer ready"
