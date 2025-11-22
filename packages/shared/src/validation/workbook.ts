/**
 * Workbook Phase 1 - Self-Evaluation Exercise Schemas
 *
 * These schemas validate user input for the workbook exercises:
 * - Wheel of Life (8 life areas rated 0-10)
 * - SWOT Analysis (strengths, weaknesses, opportunities, threats)
 * - Personal Values (top 5 ranked values)
 * - Habit Tracking (morning, afternoon, evening routines)
 * - ABC Model (cognitive restructuring)
 * - Abilities Rating (professional, personal, interpersonal skills)
 * - Generic Journal Entries (Comfort Zone, Know Yourself, Thought Awareness)
 */

import { z } from 'zod';

// =============================================================================
// Wheel of Life - 8 life areas rated 0-10
// =============================================================================

export const wheelOfLifeSchema = z.object({
  career: z.number().min(0).max(10),
  health: z.number().min(0).max(10),
  relationships: z.number().min(0).max(10),
  finance: z.number().min(0).max(10),
  personalGrowth: z.number().min(0).max(10),
  family: z.number().min(0).max(10),
  recreation: z.number().min(0).max(10),
  spirituality: z.number().min(0).max(10),
});

// =============================================================================
// SWOT Analysis
// =============================================================================

export const swotSchema = z.object({
  strengths: z.array(z.string().min(1).max(500)),
  weaknesses: z.array(z.string().min(1).max(500)),
  opportunities: z.array(z.string().min(1).max(500)),
  threats: z.array(z.string().min(1).max(500)),
});

// =============================================================================
// Personal Values - top 5 ranked
// =============================================================================

export const personalValuesSchema = z.object({
  values: z.array(z.object({
    value: z.string().min(1).max(100),
    rank: z.number().min(1).max(5),
  })).min(1).max(5),
  customValues: z.array(z.string().min(1).max(100)).optional(),
});

// =============================================================================
// Habit Tracking
// =============================================================================

export const habitTrackingSchema = z.object({
  morningRoutines: z.array(z.string().min(1).max(200)),
  afternoonRoutines: z.array(z.string().min(1).max(200)),
  eveningRoutines: z.array(z.string().min(1).max(200)),
});

// =============================================================================
// ABC Model (cognitive restructuring)
// =============================================================================

export const abcModelSchema = z.object({
  antecedent: z.string().min(1).max(1000),
  belief: z.string().min(1).max(1000),
  consequence: z.string().min(1).max(1000),
});

// =============================================================================
// Abilities Rating
// =============================================================================

export const abilitiesRatingSchema = z.object({
  abilities: z.array(z.object({
    name: z.string().min(1).max(100),
    rating: z.number().min(0).max(10),
    category: z.enum(['professional', 'personal', 'interpersonal']).optional(),
  })),
});

// =============================================================================
// Generic text journal entry (for Comfort Zone, Know Yourself, Thought Awareness)
// =============================================================================

export const workbookJournalEntrySchema = z.object({
  content: z.string().min(1).max(5000),
  prompts: z.array(z.object({
    question: z.string(),
    answer: z.string().max(2000),
  })).optional(),
});

// =============================================================================
// Workbook progress wrapper for storing exercise data
// =============================================================================

export const phase1WorkbookProgressSchema = z.object({
  phaseNumber: z.number().min(1).max(10),
  worksheetId: z.string(),
  data: z.record(z.unknown()), // Flexible JSON data
  completed: z.boolean().default(false),
  completedAt: z.string().datetime().optional(),
});

// =============================================================================
// Type inference from schemas
// =============================================================================

export type WheelOfLife = z.infer<typeof wheelOfLifeSchema>;
export type SWOT = z.infer<typeof swotSchema>;
export type PersonalValues = z.infer<typeof personalValuesSchema>;
export type HabitTracking = z.infer<typeof habitTrackingSchema>;
export type ABCModel = z.infer<typeof abcModelSchema>;
export type AbilitiesRating = z.infer<typeof abilitiesRatingSchema>;
export type WorkbookJournalEntry = z.infer<typeof workbookJournalEntrySchema>;
export type Phase1WorkbookProgress = z.infer<typeof phase1WorkbookProgressSchema>;
