/**
 * Workbook Store
 *
 * Zustand store for local workbook state management.
 * Manages current navigation, save status, and UI state.
 */

import { create } from 'zustand';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface WorkbookState {
  // Current navigation state
  currentPhase: number;
  currentWorksheet: string | null;

  // Save status
  saveStatus: SaveStatus;
  lastSavedAt: Date | null;
  saveError: string | null;

  // Actions
  setCurrentPhase: (phase: number) => void;
  setCurrentWorksheet: (worksheet: string | null) => void;
  setSaveStatus: (status: SaveStatus) => void;
  setLastSavedAt: (date: Date | null) => void;
  setSaveError: (error: string | null) => void;
  resetWorkbookState: () => void;
}

const initialState = {
  currentPhase: 1,
  currentWorksheet: null,
  saveStatus: 'idle' as SaveStatus,
  lastSavedAt: null,
  saveError: null,
};

/**
 * Workbook Store
 *
 * @example
 * ```tsx
 * import { useWorkbookStore } from '@/stores/workbookStore';
 *
 * function WorkbookScreen() {
 *   const { currentPhase, setCurrentPhase } = useWorkbookStore();
 *
 *   return (
 *     <PhaseSelector
 *       value={currentPhase}
 *       onChange={setCurrentPhase}
 *     />
 *   );
 * }
 * ```
 */
export const useWorkbookStore = create<WorkbookState>((set) => ({
  ...initialState,

  setCurrentPhase: (phase) => set({ currentPhase: phase }),

  setCurrentWorksheet: (worksheet) => set({ currentWorksheet: worksheet }),

  setSaveStatus: (status) => set({ saveStatus: status }),

  setLastSavedAt: (date) => set({ lastSavedAt: date }),

  setSaveError: (error) => set({ saveError: error }),

  resetWorkbookState: () => set(initialState),
}));

/**
 * Selector hooks for optimized re-renders
 */
export const useCurrentPhase = () =>
  useWorkbookStore((state) => state.currentPhase);

export const useCurrentWorksheet = () =>
  useWorkbookStore((state) => state.currentWorksheet);

export const useSaveStatus = () =>
  useWorkbookStore((state) => state.saveStatus);

export const useLastSavedAt = () =>
  useWorkbookStore((state) => state.lastSavedAt);

export const useSaveError = () =>
  useWorkbookStore((state) => state.saveError);
