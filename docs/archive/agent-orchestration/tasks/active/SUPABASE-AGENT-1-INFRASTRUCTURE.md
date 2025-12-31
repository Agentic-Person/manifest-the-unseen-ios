# Supabase Agent 1: Core Infrastructure

> **Agent Role**: Build core Supabase infrastructure (hooks, services, types)
> **Reports To**: `SUPABASE-ORCHESTRATOR.md`
> **Status**: `pending`
> **Playwright Tested**: `not_tested`
> **Est. Time**: 3-4 hours
> **Priority**: BLOCKING (Agents 2-4 depend on this)

---

## Task Summary

Create the foundational infrastructure that all workbook screens will use to save/load data from Supabase. This includes:
- Supabase service layer (CRUD operations)
- TanStack Query hooks
- Auto-save hook with debounce
- Zustand store for local state
- TypeScript types
- SaveIndicator UI component

---

## Status Tracking

| Task | Status | Notes |
|------|--------|-------|
| Create `services/workbook.ts` | `pending` | |
| Create `hooks/useWorkbook.ts` | `pending` | |
| Create `hooks/useAutoSave.ts` | `pending` | |
| Create `stores/workbookStore.ts` | `pending` | |
| Create `types/workbook.ts` | `pending` | |
| Create `components/workbook/SaveIndicator.tsx` | `pending` | |
| Update exports in index files | `pending` | |
| TypeScript check passes | `pending` | |

---

## Files to Create

### 1. `mobile/src/services/workbook.ts`

**Purpose**: Supabase CRUD operations for workbook_progress table

```typescript
/**
 * Workbook Service - Supabase CRUD operations
 *
 * Functions to create:
 * - getWorkbookProgress(userId, phaseNumber, worksheetId)
 * - getAllWorkbookProgress(userId)
 * - getPhaseProgress(userId, phaseNumber)
 * - upsertWorkbookProgress(userId, phaseNumber, worksheetId, data, completed?)
 * - markWorksheetComplete(userId, phaseNumber, worksheetId)
 * - deleteWorkbookProgress(userId, phaseNumber, worksheetId)
 */

import { supabase } from './supabase';
import type { WorkbookProgress, WorkbookProgressInsert } from '../types/workbook';

// Get single worksheet progress
export const getWorkbookProgress = async (
  userId: string,
  phaseNumber: number,
  worksheetId: string
): Promise<WorkbookProgress | null> => {
  const { data, error } = await supabase
    .from('workbook_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('phase_number', phaseNumber)
    .eq('worksheet_id', worksheetId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
};

// Get all progress for a user
export const getAllWorkbookProgress = async (
  userId: string
): Promise<WorkbookProgress[]> => {
  const { data, error } = await supabase
    .from('workbook_progress')
    .select('*')
    .eq('user_id', userId)
    .order('phase_number', { ascending: true });

  if (error) throw error;
  return data || [];
};

// Get progress summary for a phase
export const getPhaseProgress = async (
  userId: string,
  phaseNumber: number
): Promise<{ completed: number; total: number; worksheets: WorkbookProgress[] }> => {
  const { data, error } = await supabase
    .from('workbook_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('phase_number', phaseNumber);

  if (error) throw error;

  const worksheets = data || [];
  const completed = worksheets.filter(w => w.completed).length;

  // Total worksheets per phase (from PRD)
  const totalPerPhase: Record<number, number> = {
    1: 4, 2: 3, 3: 3, 4: 3, 5: 3, 6: 3, 7: 3, 8: 3, 9: 3, 10: 3
  };

  return {
    completed,
    total: totalPerPhase[phaseNumber] || 3,
    worksheets
  };
};

// Upsert (create or update) worksheet progress
export const upsertWorkbookProgress = async (
  userId: string,
  phaseNumber: number,
  worksheetId: string,
  data: Record<string, unknown>,
  completed: boolean = false
): Promise<WorkbookProgress> => {
  const payload: WorkbookProgressInsert = {
    user_id: userId,
    phase_number: phaseNumber,
    worksheet_id: worksheetId,
    data,
    completed,
    completed_at: completed ? new Date().toISOString() : null,
    updated_at: new Date().toISOString(),
  };

  const { data: result, error } = await supabase
    .from('workbook_progress')
    .upsert(payload, {
      onConflict: 'user_id,phase_number,worksheet_id',
    })
    .select()
    .single();

  if (error) throw error;
  return result;
};

// Mark worksheet as complete
export const markWorksheetComplete = async (
  userId: string,
  phaseNumber: number,
  worksheetId: string
): Promise<WorkbookProgress> => {
  const { data, error } = await supabase
    .from('workbook_progress')
    .update({
      completed: true,
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .eq('phase_number', phaseNumber)
    .eq('worksheet_id', worksheetId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Delete worksheet progress (for reset functionality)
export const deleteWorkbookProgress = async (
  userId: string,
  phaseNumber: number,
  worksheetId: string
): Promise<void> => {
  const { error } = await supabase
    .from('workbook_progress')
    .delete()
    .eq('user_id', userId)
    .eq('phase_number', phaseNumber)
    .eq('worksheet_id', worksheetId);

  if (error) throw error;
};
```

---

### 2. `mobile/src/hooks/useWorkbook.ts`

**Purpose**: TanStack Query hooks for data fetching and mutations

```typescript
/**
 * Workbook Hooks - TanStack Query integration
 *
 * Hooks to create:
 * - useWorkbookProgress(phaseNumber, worksheetId)
 * - useAllWorkbookProgress()
 * - usePhaseProgress(phaseNumber)
 * - useSaveWorkbook()
 * - useMarkComplete()
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../stores/authStore';
import {
  getWorkbookProgress,
  getAllWorkbookProgress,
  getPhaseProgress,
  upsertWorkbookProgress,
  markWorksheetComplete,
} from '../services/workbook';
import type { WorkbookProgress } from '../types/workbook';

// Query keys for cache management
export const workbookKeys = {
  all: ['workbook'] as const,
  progress: (userId: string) => [...workbookKeys.all, 'progress', userId] as const,
  worksheet: (userId: string, phase: number, worksheet: string) =>
    [...workbookKeys.progress(userId), phase, worksheet] as const,
  phase: (userId: string, phase: number) =>
    [...workbookKeys.progress(userId), 'phase', phase] as const,
};

// Fetch single worksheet progress
export function useWorkbookProgress(phaseNumber: number, worksheetId: string) {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: workbookKeys.worksheet(user?.id || '', phaseNumber, worksheetId),
    queryFn: () => getWorkbookProgress(user!.id, phaseNumber, worksheetId),
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Fetch all progress for user
export function useAllWorkbookProgress() {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: workbookKeys.progress(user?.id || ''),
    queryFn: () => getAllWorkbookProgress(user!.id),
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5,
  });
}

// Fetch phase progress summary
export function usePhaseProgress(phaseNumber: number) {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: workbookKeys.phase(user?.id || '', phaseNumber),
    queryFn: () => getPhaseProgress(user!.id, phaseNumber),
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5,
  });
}

// Save workbook progress mutation
export function useSaveWorkbook() {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      phaseNumber,
      worksheetId,
      data,
      completed = false,
    }: {
      phaseNumber: number;
      worksheetId: string;
      data: Record<string, unknown>;
      completed?: boolean;
    }) => {
      if (!user?.id) throw new Error('User not authenticated');
      return upsertWorkbookProgress(user.id, phaseNumber, worksheetId, data, completed);
    },
    onSuccess: (result) => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({
        queryKey: workbookKeys.worksheet(user!.id, result.phase_number, result.worksheet_id),
      });
      queryClient.invalidateQueries({
        queryKey: workbookKeys.phase(user!.id, result.phase_number),
      });
    },
  });
}

// Mark worksheet complete mutation
export function useMarkComplete() {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      phaseNumber,
      worksheetId,
    }: {
      phaseNumber: number;
      worksheetId: string;
    }) => {
      if (!user?.id) throw new Error('User not authenticated');
      return markWorksheetComplete(user.id, phaseNumber, worksheetId);
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({
        queryKey: workbookKeys.worksheet(user!.id, result.phase_number, result.worksheet_id),
      });
      queryClient.invalidateQueries({
        queryKey: workbookKeys.phase(user!.id, result.phase_number),
      });
      queryClient.invalidateQueries({
        queryKey: workbookKeys.progress(user!.id),
      });
    },
  });
}
```

---

### 3. `mobile/src/hooks/useAutoSave.ts`

**Purpose**: Reusable auto-save hook with debounce

```typescript
/**
 * Auto-Save Hook - Debounced save with status tracking
 *
 * Features:
 * - Configurable debounce timing (default 1500ms)
 * - Skips first render (initial data load)
 * - Provides saving state and last saved timestamp
 * - Error callback for toast notifications
 */

import { useRef, useEffect, useCallback, useState } from 'react';
import { useSaveWorkbook } from './useWorkbook';

interface UseAutoSaveOptions<T> {
  data: T;
  phaseNumber: number;
  worksheetId: string;
  debounceMs?: number;
  enabled?: boolean;
  onSaveStart?: () => void;
  onSaveSuccess?: (timestamp: Date) => void;
  onSaveError?: (error: Error) => void;
}

interface UseAutoSaveReturn {
  isSaving: boolean;
  isError: boolean;
  error: Error | null;
  lastSaved: Date | null;
  saveNow: () => void;
}

export function useAutoSave<T extends Record<string, unknown>>({
  data,
  phaseNumber,
  worksheetId,
  debounceMs = 1500,
  enabled = true,
  onSaveStart,
  onSaveSuccess,
  onSaveError,
}: UseAutoSaveOptions<T>): UseAutoSaveReturn {
  const { mutate: save, isPending, isError, error } = useSaveWorkbook();
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstRender = useRef(true);
  const dataRef = useRef(data);

  // Keep data ref updated
  dataRef.current = data;

  const performSave = useCallback(() => {
    onSaveStart?.();
    save(
      { phaseNumber, worksheetId, data: dataRef.current },
      {
        onSuccess: () => {
          const now = new Date();
          setLastSaved(now);
          onSaveSuccess?.(now);
        },
        onError: (err) => onSaveError?.(err as Error),
      }
    );
  }, [phaseNumber, worksheetId, save, onSaveStart, onSaveSuccess, onSaveError]);

  const debouncedSave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(performSave, debounceMs);
  }, [performSave, debounceMs]);

  // Trigger debounced save on data changes
  useEffect(() => {
    // Skip auto-save on first render (initial load)
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (enabled) {
      debouncedSave();
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, enabled, debouncedSave]);

  // Manual save function
  const saveNow = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    performSave();
  }, [performSave]);

  return {
    isSaving: isPending,
    isError,
    error: error as Error | null,
    lastSaved,
    saveNow,
  };
}
```

---

### 4. `mobile/src/stores/workbookStore.ts`

**Purpose**: Zustand store for local workbook state

```typescript
/**
 * Workbook Store - Local state management
 *
 * Manages:
 * - Current phase being viewed
 * - Draft data before save
 * - Save status indicators
 */

import { create } from 'zustand';

interface WorkbookState {
  // Current navigation state
  currentPhase: number;
  currentWorksheet: string | null;

  // Save status
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
  lastSavedAt: Date | null;
  saveError: string | null;

  // Actions
  setCurrentPhase: (phase: number) => void;
  setCurrentWorksheet: (worksheet: string | null) => void;
  setSaveStatus: (status: 'idle' | 'saving' | 'saved' | 'error') => void;
  setLastSavedAt: (date: Date | null) => void;
  setSaveError: (error: string | null) => void;
  resetWorkbookState: () => void;
}

const initialState = {
  currentPhase: 1,
  currentWorksheet: null,
  saveStatus: 'idle' as const,
  lastSavedAt: null,
  saveError: null,
};

export const useWorkbookStore = create<WorkbookState>((set) => ({
  ...initialState,

  setCurrentPhase: (phase) => set({ currentPhase: phase }),
  setCurrentWorksheet: (worksheet) => set({ currentWorksheet: worksheet }),
  setSaveStatus: (status) => set({ saveStatus: status }),
  setLastSavedAt: (date) => set({ lastSavedAt: date }),
  setSaveError: (error) => set({ saveError: error }),
  resetWorkbookState: () => set(initialState),
}));
```

---

### 5. `mobile/src/types/workbook.ts`

**Purpose**: TypeScript types for workbook data

```typescript
/**
 * Workbook Types - Type definitions for all workbook data
 */

// Database row type (matches Supabase schema)
export interface WorkbookProgress {
  id: string;
  user_id: string;
  phase_number: number;
  worksheet_id: string;
  data: Record<string, unknown>;
  completed: boolean;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

// Insert type (for creating/updating)
export interface WorkbookProgressInsert {
  user_id: string;
  phase_number: number;
  worksheet_id: string;
  data: Record<string, unknown>;
  completed?: boolean;
  completed_at?: string | null;
  updated_at?: string;
}

// Phase progress summary
export interface PhaseProgress {
  phaseNumber: number;
  completed: number;
  total: number;
  percentage: number;
  worksheets: WorkbookProgress[];
}

// Specific worksheet data types (add as needed by other agents)

export interface WheelOfLifeData {
  career: number;
  health: number;
  relationships: number;
  finance: number;
  personalGrowth: number;
  family: number;
  recreation: number;
  spirituality: number;
}

export interface SWOTData {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface GoalData {
  id: string;
  title: string;
  description: string;
  specific: string;
  measurable: string;
  achievable: string;
  relevant: string;
  timeBound: string;
  deadline: string;
  status: 'not_started' | 'in_progress' | 'completed';
}

export interface FearData {
  id: string;
  description: string;
  intensity: number; // 1-10
  reframe: string;
  actionPlan: string;
}

export interface AffirmationData {
  id: string;
  text: string;
  category: string;
  createdAt: string;
}

export interface GratitudeEntry {
  id: string;
  date: string;
  items: string[];
  reflection: string;
}

// Add more specific types as other agents integrate screens
```

---

### 6. `mobile/src/components/workbook/SaveIndicator.tsx`

**Purpose**: Visual indicator for save status

```typescript
/**
 * SaveIndicator - Shows save status (saving, saved, error)
 */

import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/colors';

interface SaveIndicatorProps {
  isSaving: boolean;
  lastSaved: Date | null;
  isError: boolean;
  onRetry?: () => void;
}

export const SaveIndicator: React.FC<SaveIndicatorProps> = ({
  isSaving,
  lastSaved,
  isError,
  onRetry,
}) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (isSaving) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="small" color={colors.dark?.textSecondary} />
        <Text style={styles.text}>Saving...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <TouchableOpacity style={styles.container} onPress={onRetry}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={[styles.text, styles.errorText]}>
          Error saving. Tap to retry.
        </Text>
      </TouchableOpacity>
    );
  }

  if (lastSaved) {
    return (
      <View style={styles.container}>
        <Text style={styles.checkIcon}>✓</Text>
        <Text style={styles.text}>Saved at {formatTime(lastSaved)}</Text>
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 16,
    alignSelf: 'center',
    marginVertical: 8,
  },
  text: {
    fontSize: 12,
    color: colors.dark?.textSecondary || '#a0a0b0',
    marginLeft: 6,
  },
  checkIcon: {
    fontSize: 14,
    color: '#4CAF50',
  },
  errorIcon: {
    fontSize: 14,
  },
  errorText: {
    color: '#FF6B6B',
  },
});
```

---

## Files to Modify

### 1. `mobile/src/services/index.ts`
Add export:
```typescript
export * from './workbook';
```

### 2. `mobile/src/hooks/index.ts`
Create if doesn't exist, add exports:
```typescript
export * from './useWorkbook';
export * from './useAutoSave';
```

### 3. `mobile/src/stores/index.ts`
Add export:
```typescript
export * from './workbookStore';
```

### 4. `mobile/src/components/workbook/index.ts`
Add export:
```typescript
export * from './SaveIndicator';
```

---

## Verification Checklist

Before marking complete:

- [ ] All 6 files created with full implementation
- [ ] All exports added to index files
- [ ] TypeScript compiles: `cd mobile && npm run type-check`
- [ ] No console errors on import
- [ ] Hooks can be imported in a test component

---

## Report to Orchestrator

When complete, add this entry to `SUPABASE-ORCHESTRATOR.md` Progress Log:

```
### [DATE TIME] - Agent 1 (Infrastructure)
**Status**: completed
**Summary**: Created core Supabase infrastructure (6 files)
**Files Created**:
- services/workbook.ts
- hooks/useWorkbook.ts
- hooks/useAutoSave.ts
- stores/workbookStore.ts
- types/workbook.ts
- components/workbook/SaveIndicator.tsx
**Files Modified**: 4 index.ts exports
**Blockers**: None
**Next**: Agents 2, 3, 4 can now start parallel screen integration
```

Then update your status above to `completed`.

---

*Agent Document Version: 1.0*
