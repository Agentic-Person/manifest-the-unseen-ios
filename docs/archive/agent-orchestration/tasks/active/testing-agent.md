# Testing-Agent

**Task ID:** meditation-testing
**Parent:** meditation-breathing-orchestrator.md
**Priority:** Last
**Dependencies:** All other agents must be complete
**Status:** Pending

---

## Overview

This agent creates comprehensive tests for the meditation feature and performs final polish. It runs after all other agents complete.

---

## Prerequisites

Before starting, verify:
- [ ] Audio-Service-Agent completed successfully
- [ ] UI-Components-Agent completed successfully
- [ ] Session-Tracking-Agent completed successfully
- [ ] All screens render without errors
- [ ] Navigation flow works

---

## Tasks

### 1. Unit Tests - Meditation Service

**File:** `mobile/src/services/__tests__/meditationService.test.ts`

```typescript
import {
  getMeditations,
  getMeditationById,
  getSessionStats,
} from '../meditationService';

// Mock Supabase client
jest.mock('../supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({ data: [], error: null }),
    })),
  },
}));

describe('meditationService', () => {
  describe('getMeditations', () => {
    it('returns empty array when no meditations', async () => {
      const result = await getMeditations();
      expect(result).toEqual([]);
    });

    it('filters by type when provided', async () => {
      // Test implementation
    });

    it('filters by narrator when provided', async () => {
      // Test implementation
    });
  });

  describe('getMeditationById', () => {
    it('returns null when meditation not found', async () => {
      const result = await getMeditationById('nonexistent');
      expect(result).toBeNull();
    });
  });

  describe('getSessionStats', () => {
    it('returns zero stats for user with no sessions', async () => {
      const result = await getSessionStats('user-123');
      expect(result).toEqual({
        totalMinutes: 0,
        sessionCount: 0,
        currentStreak: 0,
        longestStreak: 0,
      });
    });
  });
});
```

---

### 2. Unit Tests - Streak Calculation

**File:** `mobile/src/services/__tests__/streakCalculation.test.ts`

```typescript
import { calculateStreaks } from '../meditationService';

describe('calculateStreaks', () => {
  const today = new Date().toISOString();
  const yesterday = new Date(Date.now() - 86400000).toISOString();
  const twoDaysAgo = new Date(Date.now() - 86400000 * 2).toISOString();
  const threeDaysAgo = new Date(Date.now() - 86400000 * 3).toISOString();

  it('returns 0 streak for empty sessions', () => {
    const result = calculateStreaks([]);
    expect(result.currentStreak).toBe(0);
    expect(result.longestStreak).toBe(0);
  });

  it('returns 1 streak for session only today', () => {
    const result = calculateStreaks([{ completed_at: today }]);
    expect(result.currentStreak).toBe(1);
  });

  it('returns 2 streak for today and yesterday', () => {
    const result = calculateStreaks([
      { completed_at: today },
      { completed_at: yesterday },
    ]);
    expect(result.currentStreak).toBe(2);
  });

  it('returns 0 current streak when no recent activity', () => {
    const result = calculateStreaks([
      { completed_at: threeDaysAgo },
    ]);
    expect(result.currentStreak).toBe(0);
    expect(result.longestStreak).toBe(1);
  });

  it('counts multiple sessions on same day as 1', () => {
    const result = calculateStreaks([
      { completed_at: today },
      { completed_at: today },
      { completed_at: today },
    ]);
    expect(result.currentStreak).toBe(1);
  });

  it('correctly calculates longest streak', () => {
    const result = calculateStreaks([
      { completed_at: today },
      // Gap here
      { completed_at: new Date(Date.now() - 86400000 * 5).toISOString() },
      { completed_at: new Date(Date.now() - 86400000 * 6).toISOString() },
      { completed_at: new Date(Date.now() - 86400000 * 7).toISOString() },
    ]);
    expect(result.currentStreak).toBe(1);
    expect(result.longestStreak).toBe(3);
  });
});
```

---

### 3. Unit Tests - Audio Player Hook

**File:** `mobile/src/hooks/__tests__/useAudioPlayer.test.ts`

```typescript
import { renderHook, act } from '@testing-library/react-hooks';
import { useAudioPlayer } from '../useAudioPlayer';

// Mock expo-av
jest.mock('expo-av', () => ({
  Audio: {
    Sound: {
      createAsync: jest.fn().mockResolvedValue({
        sound: {
          setOnPlaybackStatusUpdate: jest.fn(),
          playAsync: jest.fn(),
          pauseAsync: jest.fn(),
          setPositionAsync: jest.fn(),
          stopAsync: jest.fn(),
          unloadAsync: jest.fn(),
        },
        status: { isLoaded: true },
      }),
    },
    setAudioModeAsync: jest.fn(),
  },
}));

describe('useAudioPlayer', () => {
  it('initializes with idle state', () => {
    const { result } = renderHook(() => useAudioPlayer());
    expect(result.current.state).toBe('idle');
  });

  it('loads audio and changes to loading state', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useAudioPlayer());

    act(() => {
      result.current.load('https://example.com/audio.mp3');
    });

    expect(result.current.state).toBe('loading');
  });

  it('cleans up on unmount', () => {
    const { unmount } = renderHook(() => useAudioPlayer());
    unmount();
    // Verify unloadAsync was called
  });
});
```

---

### 4. Unit Tests - Breathing Animation Hook

**File:** `mobile/src/hooks/__tests__/useBreathingAnimation.test.ts`

```typescript
import { renderHook, act } from '@testing-library/react-hooks';
import { useBreathingAnimation } from '../useBreathingAnimation';
import { BREATHING_PATTERNS } from '../../types/meditation';

describe('useBreathingAnimation', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('initializes with inhale phase', () => {
    const { result } = renderHook(() => useBreathingAnimation());
    expect(result.current.phase).toBe('inhale');
    expect(result.current.isRunning).toBe(false);
  });

  it('starts running when start() called', () => {
    const { result } = renderHook(() => useBreathingAnimation());

    act(() => {
      result.current.start();
    });

    expect(result.current.isRunning).toBe(true);
  });

  it('transitions phases correctly', () => {
    const { result } = renderHook(() =>
      useBreathingAnimation({
        pattern: { inhale: 2, holdIn: 1, exhale: 2, holdOut: 1 },
      })
    );

    act(() => {
      result.current.start();
    });

    // After 2 seconds: inhale -> holdIn
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    expect(result.current.phase).toBe('holdIn');

    // After 1 more second: holdIn -> exhale
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(result.current.phase).toBe('exhale');
  });

  it('calls onComplete after all cycles', () => {
    const onComplete = jest.fn();
    const { result } = renderHook(() =>
      useBreathingAnimation({
        pattern: { inhale: 1, holdIn: 0, exhale: 1, holdOut: 0 },
        totalCycles: 2,
        onComplete,
      })
    );

    act(() => {
      result.current.start();
    });

    // 2 cycles * (1 + 1) seconds = 4 seconds
    act(() => {
      jest.advanceTimersByTime(4000);
    });

    expect(onComplete).toHaveBeenCalled();
  });

  it('resets state correctly', () => {
    const { result } = renderHook(() => useBreathingAnimation());

    act(() => {
      result.current.start();
      jest.advanceTimersByTime(3000);
      result.current.reset();
    });

    expect(result.current.phase).toBe('inhale');
    expect(result.current.currentCycle).toBe(1);
    expect(result.current.isRunning).toBe(false);
  });
});
```

---

### 5. Component Tests

**File:** `mobile/src/components/meditation/__tests__/MeditationCard.test.tsx`

```typescript
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { MeditationCard } from '../MeditationCard';

const mockMeditation = {
  id: 'test-1',
  title: 'Test Meditation',
  description: 'A test meditation',
  duration_seconds: 600,
  audio_url: 'test.mp3',
  narrator_gender: 'female' as const,
  tier_required: 'novice' as const,
  type: 'guided' as const,
  tags: ['test'],
  order_index: 1,
  created_at: new Date().toISOString(),
};

describe('MeditationCard', () => {
  it('renders title correctly', () => {
    const { getByText } = render(
      <MeditationCard meditation={mockMeditation} onPress={jest.fn()} />
    );
    expect(getByText('Test Meditation')).toBeTruthy();
  });

  it('displays formatted duration', () => {
    const { getByText } = render(
      <MeditationCard meditation={mockMeditation} onPress={jest.fn()} />
    );
    expect(getByText('10 min')).toBeTruthy();
  });

  it('calls onPress when tapped', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <MeditationCard meditation={mockMeditation} onPress={onPress} />
    );

    fireEvent.press(getByText('Test Meditation'));
    expect(onPress).toHaveBeenCalled();
  });
});
```

**File:** `mobile/src/components/meditation/__tests__/SessionStats.test.tsx`

```typescript
import React from 'react';
import { render } from '@testing-library/react-native';
import { SessionStats } from '../SessionStats';
import { useSessionStats } from '../../../hooks/useSessionStats';

jest.mock('../../../hooks/useSessionStats');

describe('SessionStats', () => {
  it('renders loading state', () => {
    (useSessionStats as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
    });

    const { getByTestId } = render(<SessionStats />);
    expect(getByTestId('stats-loading')).toBeTruthy();
  });

  it('renders stats correctly', () => {
    (useSessionStats as jest.Mock).mockReturnValue({
      data: {
        totalMinutes: 120,
        sessionCount: 15,
        currentStreak: 5,
        longestStreak: 10,
      },
      isLoading: false,
    });

    const { getByText } = render(<SessionStats />);
    expect(getByText('120')).toBeTruthy();
    expect(getByText('15')).toBeTruthy();
    expect(getByText('5')).toBeTruthy();
  });
});
```

---

### 6. E2E Tests with Playwright MCP

**File:** `mobile/e2e/meditation.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Meditation Feature', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to app and sign in if needed
    await page.goto('/');
  });

  test('user can browse meditation categories', async ({ page }) => {
    // Navigate to Meditate tab
    await page.tap('[data-testid="tab-meditate"]');

    // Verify category tabs are visible
    await expect(page.locator('[data-testid="category-tabs"]')).toBeVisible();

    // Tap on Breathing tab
    await page.tap('[data-testid="tab-breathing"]');

    // Verify breathing content is shown
    await expect(page.locator('text=Box Breathing')).toBeVisible();

    // Tap on Music tab
    await page.tap('[data-testid="tab-music"]');

    // Verify music content is shown
    await expect(page.locator('text=Tibetan Singing Bowls')).toBeVisible();
  });

  test('user can play meditation audio', async ({ page }) => {
    await page.tap('[data-testid="tab-meditate"]');

    // Select first meditation card
    await page.tap('[data-testid="meditation-card-0"]');

    // Verify player screen opens
    await expect(page.locator('[data-testid="meditation-player"]')).toBeVisible();

    // Tap play button
    await page.tap('[data-testid="play-button"]');

    // Verify playing state
    await expect(page.locator('[data-testid="pause-button"]')).toBeVisible();

    // Tap pause
    await page.tap('[data-testid="pause-button"]');

    // Verify paused state
    await expect(page.locator('[data-testid="play-button"]')).toBeVisible();
  });

  test('narrator preference filters guided meditations', async ({ page }) => {
    await page.tap('[data-testid="tab-meditate"]');

    // Tap male narrator selector
    await page.tap('[data-testid="narrator-male"]');

    // Verify only male narrated meditations shown
    const cards = page.locator('[data-testid^="meditation-card"]');
    const count = await cards.count();

    for (let i = 0; i < count; i++) {
      const narrator = await cards.nth(i).getAttribute('data-narrator');
      expect(narrator).toBe('male');
    }
  });

  test('session stats update after completion', async ({ page }) => {
    await page.tap('[data-testid="tab-meditate"]');

    // Get initial session count
    const initialCount = await page
      .locator('[data-testid="session-count"]')
      .textContent();

    // Play and complete a short meditation (simulated)
    await page.tap('[data-testid="meditation-card-0"]');
    await page.tap('[data-testid="play-button"]');

    // Wait for completion (or simulate with time skip)
    // In real test: await page.waitForSelector('[data-testid="session-complete"]');

    // Go back and check stats
    await page.tap('[data-testid="back-button"]');

    // Verify session count increased
    // await expect(page.locator('[data-testid="session-count"]'))
    //   .not.toHaveText(initialCount);
  });

  test('breathing exercise shows animation', async ({ page }) => {
    await page.tap('[data-testid="tab-meditate"]');
    await page.tap('[data-testid="tab-breathing"]');

    // Select breathing exercise
    await page.tap('[data-testid="meditation-card-0"]');

    // Verify breathing circle is visible
    await expect(page.locator('[data-testid="breathing-circle"]')).toBeVisible();

    // Verify phase label changes
    await expect(page.locator('text=Breathe In')).toBeVisible();

    // Wait for phase transition
    await page.waitForTimeout(5000);

    // Verify phase changed (either Hold or Breathe Out)
    const phaseText = await page.locator('[data-testid="phase-label"]').textContent();
    expect(['Hold', 'Breathe Out']).toContain(phaseText);
  });
});
```

---

### 7. Performance Tests

**File:** `mobile/e2e/performance.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Performance', () => {
  test('meditation list renders within 1 second', async ({ page }) => {
    const startTime = Date.now();

    await page.tap('[data-testid="tab-meditate"]');
    await page.waitForSelector('[data-testid="meditation-card-0"]');

    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(1000);
  });

  test('audio loads within 2 seconds', async ({ page }) => {
    await page.tap('[data-testid="tab-meditate"]');
    await page.tap('[data-testid="meditation-card-0"]');

    const startTime = Date.now();
    await page.tap('[data-testid="play-button"]');
    await page.waitForSelector('[data-testid="audio-loaded"]');

    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(2000);
  });

  // Note: FPS testing requires native profiling tools
  // This is a placeholder for manual verification
  test.skip('breathing animation runs at 60fps', async ({ page }) => {
    // Manual verification required using React Native performance monitor
  });
});
```

---

### 8. Polish & Error Handling

**Tasks:**

1. **Loading States:**
   - Add loading skeletons to MeditateScreen
   - Add loading indicator to AudioPlayer
   - Add loading state to SessionStats

2. **Error States:**
   - Add error boundary to meditation screens
   - Add retry button for failed audio load
   - Add "No meditations available" empty state
   - Add network error message

3. **Edge Cases:**
   - Handle null/undefined meditation gracefully
   - Handle audio URL not found
   - Handle session creation failure
   - Handle stats calculation with corrupted data

4. **Accessibility:**
   - Add accessibilityLabel to all interactive elements
   - Add accessibilityHint for complex actions
   - Ensure touch targets are at least 44x44
   - Test with VoiceOver

5. **Haptic Feedback:**
   - Add haptic on play/pause
   - Add haptic on breathing phase transition
   - Add haptic on session complete

---

## Validation Checklist

Before marking complete:

**Unit Tests:**
- [ ] meditationService tests pass
- [ ] Streak calculation tests pass
- [ ] useAudioPlayer tests pass
- [ ] useBreathingAnimation tests pass

**Component Tests:**
- [ ] MeditationCard tests pass
- [ ] SessionStats tests pass
- [ ] AudioPlayer tests pass (if created)

**E2E Tests:**
- [ ] Category browsing test passes
- [ ] Audio playback test passes
- [ ] Narrator filtering test passes
- [ ] Breathing animation test passes

**Performance:**
- [ ] List renders under 1 second
- [ ] Audio loads under 2 seconds
- [ ] Animations run at 60fps (manual check)

**Polish:**
- [ ] Loading states implemented
- [ ] Error states implemented
- [ ] Empty states implemented
- [ ] Accessibility labels added
- [ ] Haptic feedback working

---

## Test Commands

```bash
# Run unit tests
npm test

# Run specific test file
npm test -- meditationService.test.ts

# Run with coverage
npm test -- --coverage

# Run E2E tests (requires Playwright MCP setup)
npx playwright test
```

---

## Output

When complete:
1. All unit test files created and passing
2. All component test files created and passing
3. E2E test file created
4. Polish tasks completed
5. No console errors/warnings in app

**Report:** "Testing-Agent complete - All tests passing, feature polished"
