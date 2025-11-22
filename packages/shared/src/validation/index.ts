/**
 * Validation schemas using Zod
 *
 * These schemas provide runtime validation and type inference.
 * Use with react-hook-form in the mobile app.
 */

import { z } from 'zod';

// Export workbook Phase 1 exercise schemas
export * from './workbook';

/**
 * User validation schemas
 */
export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  displayName: z.string().nullable(),
  avatarUrl: z.string().url().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  displayName: z.string().min(2, 'Name must be at least 2 characters').optional(),
});

export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

/**
 * Journal entry validation
 */
export const journalEntrySchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  content: z.string().min(1, 'Journal entry cannot be empty'),
  transcribedAt: z.string().datetime().nullable(),
  tags: z.array(z.string()),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const createJournalEntrySchema = z.object({
  content: z.string().min(1, 'Journal entry cannot be empty').max(10000, 'Entry too long'),
  tags: z.array(z.string()).optional(),
});

/**
 * Vision board validation
 */
export const visionBoardImageSchema = z.object({
  url: z.string().url(),
  caption: z.string().nullable(),
  order: z.number().int().min(0),
});

export const visionBoardSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  title: z.string().min(1, 'Title is required'),
  images: z.array(visionBoardImageSchema),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const createVisionBoardSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  images: z.array(visionBoardImageSchema).max(20, 'Maximum 20 images per board'),
});

/**
 * Workbook validation
 */
export const workbookProgressSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  phase: z.number().int().min(1).max(10),
  completionPercentage: z.number().min(0).max(100),
  data: z.record(z.unknown()),
  lastUpdated: z.string().datetime(),
});

export const updateWorkbookProgressSchema = z.object({
  phase: z.number().int().min(1).max(10),
  data: z.record(z.unknown()),
});

/**
 * Meditation validation
 */
export const meditationSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  durationMinutes: z.number().int().min(1).max(60),
  audioUrlMale: z.string().url(),
  audioUrlFemale: z.string().url(),
  tier: z.enum(['free', 'novice', 'awakening', 'enlightenment']),
  order: z.number().int().min(0),
  category: z.string().optional(),
});

export const createMeditationSessionSchema = z.object({
  meditationId: z.string().uuid(),
  durationSeconds: z.number().int().min(0),
});

/**
 * AI Chat validation
 */
export const aiMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().min(1),
  timestamp: z.string().datetime(),
});

export const createAIMessageSchema = z.object({
  content: z.string().min(1, 'Message cannot be empty').max(1000, 'Message too long'),
});

/**
 * Subscription validation
 */
export const subscriptionTierSchema = z.enum(['free', 'novice', 'awakening', 'enlightenment']);

export const subscriptionSchema = z.object({
  tier: subscriptionTierSchema,
  isActive: z.boolean(),
  expiresAt: z.string().datetime().nullable(),
  isTrial: z.boolean(),
  trialEndsAt: z.string().datetime().nullable(),
});

/**
 * Type inference from schemas
 */
export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type CreateJournalEntryInput = z.infer<typeof createJournalEntrySchema>;
export type CreateVisionBoardInput = z.infer<typeof createVisionBoardSchema>;
export type UpdateWorkbookProgressInput = z.infer<typeof updateWorkbookProgressSchema>;
export type CreateMeditationSessionInput = z.infer<typeof createMeditationSessionSchema>;
export type CreateAIMessageInput = z.infer<typeof createAIMessageSchema>;
