# Session-Tracking-Agent

**Task ID:** meditation-session-tracking
**Parent:** meditation-breathing-orchestrator.md
**Priority:** Second (runs parallel with UI-Components-Agent)
**Dependencies:** Audio-Service-Agent must be complete
**Status:** Pending

---

## Overview

This agent implements session statistics tracking, streak calculation, and the breathing circle animation. It runs in parallel with UI-Components-Agent.

---

## Prerequisites

Before starting, verify:
- [ ] Audio-Service-Agent completed successfully
- [ ] Types in `types/meditation.ts` available
- [ ] Service in `services/meditationService.ts` working
- [ ] `meditation_sessions` table accessible

---

## Tasks

### 1. Session Stats Hook

**File:** `mobile/src/hooks/useSessionStats.ts`

```typescript
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../stores/authStore';
import { getSessionStats } from '../services/meditationService';
import { queryKeys } from '../services/queryClient';
import { SessionStats } from '../types/meditation';

export function useSessionStats() {
  const { user } = useAuth();

  return useQuery<SessionStats>({
    queryKey: queryKeys.meditations.sessions(user?.id),
    queryFn: () => getSessionStats(user?.id ?? ''),
    enabled: !!user?.id,
    // Refetch when returning to screen
    refetchOnWindowFocus: true,
  });
}
```

**Stats Calculation Logic (in meditationService.ts):**

```typescript
export async function getSessionStats(userId: string): Promise<SessionStats> {
  // 1. Get all completed sessions for user
  const { data: sessions } = await supabase
    .from('meditation_sessions')
    .select('duration_seconds, completed_at')
    .eq('user_id', userId)
    .eq('completed', true)
    .order('completed_at', { ascending: false });

  if (!sessions || sessions.length === 0) {
    return {
      totalMinutes: 0,
      sessionCount: 0,
      currentStreak: 0,
      longestStreak: 0,
    };
  }

  // 2. Calculate total minutes
  const totalSeconds = sessions.reduce((sum, s) => sum + (s.duration_seconds || 0), 0);
  const totalMinutes = Math.round(totalSeconds / 60);

  // 3. Calculate session count
  const sessionCount = sessions.length;

  // 4. Calculate streaks
  const { currentStreak, longestStreak } = calculateStreaks(sessions);

  return { totalMinutes, sessionCount, currentStreak, longestStreak };
}
```

---

### 2. Streak Calculation Algorithm

**Implementation in `meditationService.ts`:**

```typescript
interface SessionForStreak {
  completed_at: string | null;
}

function calculateStreaks(sessions: SessionForStreak[]): {
  currentStreak: number;
  longestStreak: number;
} {
  if (sessions.length === 0) return { currentStreak: 0, longestStreak: 0 };

  // Get unique dates (YYYY-MM-DD format)
  const uniqueDates = new Set<string>();
  sessions.forEach(session => {
    if (session.completed_at) {
      const date = new Date(session.completed_at).toISOString().split('T')[0];
      uniqueDates.add(date);
    }
  });

  // Sort dates descending (most recent first)
  const sortedDates = Array.from(uniqueDates).sort().reverse();

  if (sortedDates.length === 0) return { currentStreak: 0, longestStreak: 0 };

  // Check if today or yesterday has a session (for current streak)
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  // Calculate streaks by checking consecutive days
  for (let i = 0; i < sortedDates.length; i++) {
    const currentDate = new Date(sortedDates[i]);

    if (i === 0) {
      // First date - start streak if it's today or yesterday
      if (sortedDates[i] === today || sortedDates[i] === yesterday) {
        tempStreak = 1;
      } else {
        // Current streak is 0 (no recent activity)
        tempStreak = 0;
      }
    }

    if (i > 0) {
      const prevDate = new Date(sortedDates[i - 1]);
      const dayDiff = Math.round(
        (prevDate.getTime() - currentDate.getTime()) / 86400000
      );

      if (dayDiff === 1) {
        // Consecutive day
        tempStreak++;
      } else {
        // Streak broken - update longest and reset
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
  }

  // Final update for longest streak
  longestStreak = Math.max(longestStreak, tempStreak);

  // Current streak is tempStreak only if most recent date is today/yesterday
  if (sortedDates[0] === today || sortedDates[0] === yesterday) {
    currentStreak = tempStreak;
  }

  return { currentStreak, longestStreak };
}
```

---

### 3. Session Stats Component

**File:** `mobile/src/components/meditation/SessionStats.tsx`

```typescript
interface SessionStatsProps {
  // Optional: pass stats directly or use hook internally
}

export function SessionStats() {
  const { data: stats, isLoading } = useSessionStats();

  if (isLoading) {
    return <StatsLoadingSkeleton />;
  }

  return (
    <View style={styles.container}>
      <StatItem
        icon="clock"
        value={stats?.totalMinutes ?? 0}
        label="minutes"
      />
      <StatItem
        icon="check-circle"
        value={stats?.sessionCount ?? 0}
        label="sessions"
      />
      <StatItem
        icon="flame"
        value={stats?.currentStreak ?? 0}
        label="day streak"
      />
    </View>
  );
}

interface StatItemProps {
  icon: string;
  value: number;
  label: string;
}

function StatItem({ icon, value, label }: StatItemProps) {
  return (
    <View style={styles.statItem}>
      <Icon name={icon} size={20} color={colors.gold} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});
```

---

### 4. Breathing Animation Hook

**File:** `mobile/src/hooks/useBreathingAnimation.ts`

```typescript
import { useState, useEffect, useCallback, useRef } from 'react';
import { BreathingPattern, BREATHING_PATTERNS } from '../types/meditation';

export type BreathingPhase = 'inhale' | 'holdIn' | 'exhale' | 'holdOut';

interface UseBreathingAnimationOptions {
  pattern?: BreathingPattern;
  totalCycles?: number;
  onPhaseChange?: (phase: BreathingPhase) => void;
  onComplete?: () => void;
}

interface UseBreathingAnimationReturn {
  phase: BreathingPhase;
  phaseTimeRemaining: number;  // seconds remaining in current phase
  currentCycle: number;
  totalCycles: number;
  isRunning: boolean;
  progress: number;  // 0-1 for animation scale

  start: () => void;
  pause: () => void;
  reset: () => void;
}

export function useBreathingAnimation(
  options: UseBreathingAnimationOptions = {}
): UseBreathingAnimationReturn {
  const {
    pattern = BREATHING_PATTERNS.deepCalm,
    totalCycles = 8,
    onPhaseChange,
    onComplete,
  } = options;

  const [phase, setPhase] = useState<BreathingPhase>('inhale');
  const [phaseTimeRemaining, setPhaseTimeRemaining] = useState(pattern.inhale);
  const [currentCycle, setCurrentCycle] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout>();

  const getPhaseOrder = (): BreathingPhase[] => {
    const phases: BreathingPhase[] = ['inhale'];
    if (pattern.holdIn > 0) phases.push('holdIn');
    phases.push('exhale');
    if (pattern.holdOut > 0) phases.push('holdOut');
    return phases;
  };

  const getPhaseDuration = (p: BreathingPhase): number => {
    switch (p) {
      case 'inhale': return pattern.inhale;
      case 'holdIn': return pattern.holdIn;
      case 'exhale': return pattern.exhale;
      case 'holdOut': return pattern.holdOut;
    }
  };

  const getNextPhase = (current: BreathingPhase): { phase: BreathingPhase; newCycle: boolean } => {
    const order = getPhaseOrder();
    const idx = order.indexOf(current);
    if (idx === order.length - 1) {
      return { phase: order[0], newCycle: true };
    }
    return { phase: order[idx + 1], newCycle: false };
  };

  // Calculate animation progress (0-1)
  // Inhale: 0 -> 1, Exhale: 1 -> 0, Hold: constant
  const calculateProgress = (p: BreathingPhase, remaining: number): number => {
    const duration = getPhaseDuration(p);
    const elapsed = duration - remaining;
    const ratio = elapsed / duration;

    switch (p) {
      case 'inhale':
        return ratio; // 0 -> 1
      case 'holdIn':
        return 1; // stay expanded
      case 'exhale':
        return 1 - ratio; // 1 -> 0
      case 'holdOut':
        return 0; // stay contracted
    }
  };

  const tick = useCallback(() => {
    setPhaseTimeRemaining(prev => {
      const newTime = prev - 1;

      if (newTime <= 0) {
        // Move to next phase
        const { phase: nextPhase, newCycle } = getNextPhase(phase);

        if (newCycle) {
          if (currentCycle >= totalCycles) {
            // Complete!
            setIsRunning(false);
            onComplete?.();
            return 0;
          }
          setCurrentCycle(c => c + 1);
        }

        setPhase(nextPhase);
        onPhaseChange?.(nextPhase);
        return getPhaseDuration(nextPhase);
      }

      setProgress(calculateProgress(phase, newTime));
      return newTime;
    });
  }, [phase, currentCycle, totalCycles, onPhaseChange, onComplete]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(tick, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, tick]);

  const start = useCallback(() => setIsRunning(true), []);
  const pause = useCallback(() => setIsRunning(false), []);
  const reset = useCallback(() => {
    setIsRunning(false);
    setPhase('inhale');
    setPhaseTimeRemaining(pattern.inhale);
    setCurrentCycle(1);
    setProgress(0);
  }, [pattern]);

  return {
    phase,
    phaseTimeRemaining,
    currentCycle,
    totalCycles,
    isRunning,
    progress,
    start,
    pause,
    reset,
  };
}
```

---

### 5. Breathing Circle Animation Component

**File:** `mobile/src/components/meditation/BreathingCircle.tsx`

```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useAccessibilityInfo } from 'react-native';
import { colors, spacing } from '../../theme';
import { BreathingPhase } from '../../hooks/useBreathingAnimation';

interface BreathingCircleProps {
  progress: number;  // 0-1
  phase: BreathingPhase;
  size?: number;
}

const PHASE_LABELS: Record<BreathingPhase, string> = {
  inhale: 'Breathe In',
  holdIn: 'Hold',
  exhale: 'Breathe Out',
  holdOut: 'Hold',
};

export function BreathingCircle({
  progress,
  phase,
  size = 200,
}: BreathingCircleProps) {
  const { reduceMotionEnabled } = useAccessibilityInfo();

  // Scale from 1.0 to 1.5 based on progress
  const scale = 1 + progress * 0.5;

  const animatedStyle = useAnimatedStyle(() => {
    if (reduceMotionEnabled) {
      // Fallback: just show phase label, no animation
      return {};
    }

    return {
      transform: [
        {
          scale: withTiming(scale, {
            duration: 100,
            easing: Easing.out(Easing.ease),
          }),
        },
      ],
    };
  }, [scale, reduceMotionEnabled]);

  return (
    <View style={[styles.container, { width: size * 1.6, height: size * 1.6 }]}>
      {/* Outer glow ring */}
      <Animated.View
        style={[
          styles.outerRing,
          { width: size * 1.4, height: size * 1.4 },
          animatedStyle,
        ]}
      />

      {/* Middle ring */}
      <Animated.View
        style={[
          styles.middleRing,
          { width: size * 1.2, height: size * 1.2 },
          animatedStyle,
        ]}
      />

      {/* Inner circle */}
      <Animated.View
        style={[
          styles.innerCircle,
          { width: size, height: size },
          animatedStyle,
        ]}
      >
        <Text style={styles.phaseLabel}>{PHASE_LABELS[phase]}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  outerRing: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: `${colors.gold}10`,
    borderWidth: 1,
    borderColor: `${colors.gold}30`,
  },
  middleRing: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: `${colors.gold}20`,
    borderWidth: 1,
    borderColor: `${colors.gold}50`,
  },
  innerCircle: {
    borderRadius: 999,
    backgroundColor: `${colors.gold}40`,
    borderWidth: 2,
    borderColor: colors.gold,
    justifyContent: 'center',
    alignItems: 'center',
  },
  phaseLabel: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
});
```

---

### 6. Export Components

**Update:** `mobile/src/components/meditation/index.ts`

Add exports:
```typescript
export { SessionStats } from './SessionStats';
export { BreathingCircle } from './BreathingCircle';
```

---

## Validation Checklist

Before marking complete:

- [ ] Stats hook returns correct data
- [ ] Streak calculation handles edge cases:
  - [ ] No sessions → 0 streak
  - [ ] Only today → 1 streak
  - [ ] Yesterday + today → 2 streak
  - [ ] Gap in days → streak breaks
- [ ] SessionStats component displays correctly
- [ ] BreathingCircle animates at 60fps
- [ ] Breathing animation respects reducedMotion setting
- [ ] Phase labels change correctly
- [ ] Animation timing matches pattern (5-2-5-2)
- [ ] No TypeScript errors
- [ ] No console warnings

---

## Edge Cases to Test

**Streak Calculation:**
1. User has no sessions → streak = 0
2. User meditated only today → streak = 1
3. User meditated yesterday and today → streak = 2
4. User meditated 3 days ago, 2 days ago, yesterday → streak = 0 (no today)
5. User meditated 5 consecutive days ending yesterday → streak = 5
6. Multiple sessions same day → count as 1 day

**Animation:**
1. Pattern with no hold phases (2-0-2-0) → skip hold phases
2. Reduced motion enabled → no scale animation, just labels
3. Component unmounts mid-animation → clean up interval

---

## Output

When complete, these files should exist:
1. `mobile/src/hooks/useSessionStats.ts`
2. `mobile/src/hooks/useBreathingAnimation.ts`
3. `mobile/src/components/meditation/SessionStats.tsx`
4. `mobile/src/components/meditation/BreathingCircle.tsx`
5. `mobile/src/components/meditation/index.ts` (updated)
6. `mobile/src/services/meditationService.ts` (streak logic added)

**Report:** "Session-Tracking-Agent complete - Stats and animation ready"
