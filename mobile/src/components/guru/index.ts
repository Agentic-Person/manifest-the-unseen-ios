/**
 * Guru Components - Barrel Export
 *
 * Centralized export for all Guru feature components.
 * Makes imports cleaner throughout the app.
 *
 * @example
 * ```typescript
 * import { PhaseCard, PhaseSelector, GuruEmptyState } from '@/components/guru';
 * ```
 */

export { PhaseCard } from './PhaseCard';
export { PhaseSelector } from './PhaseSelector';
export { GuruEmptyState } from './GuruEmptyState';
export { GuruLoadingState } from './GuruLoadingState';
export { GuruChatHeader } from './GuruChatHeader';

// Re-export types if needed
export type { default as PhaseCardProps } from './PhaseCard';
export type { default as PhaseSelectorProps } from './PhaseSelector';
export type { default as GuruLoadingStateProps } from './GuruLoadingState';
export type { default as GuruChatHeaderProps } from './GuruChatHeader';
