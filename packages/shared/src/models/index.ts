/**
 * Core data models
 *
 * These TypeScript interfaces define the shape of our data.
 * They should match the Supabase database schema.
 */

export interface User {
  id: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface WorkbookProgress {
  id: string;
  userId: string;
  phase: number; // 1-10
  completionPercentage: number;
  data: Record<string, unknown>; // JSONB data - flexible worksheet storage
  lastUpdated: string;
}

export interface JournalEntry {
  id: string;
  userId: string;
  content: string; // Transcribed text
  transcribedAt: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface MeditationSession {
  id: string;
  userId: string;
  meditationId: string;
  durationSeconds: number;
  completedAt: string;
}

export interface Meditation {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  audioUrlMale: string;
  audioUrlFemale: string;
  tier: SubscriptionTier;
  order: number;
  category?: string;
}

export interface VisionBoard {
  id: string;
  userId: string;
  title: string;
  images: VisionBoardImage[];
  createdAt: string;
  updatedAt: string;
}

export interface VisionBoardImage {
  url: string;
  caption: string | null;
  order: number;
}

export interface AIConversation {
  id: string;
  userId: string;
  messages: AIMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface KnowledgeEmbedding {
  id: string;
  content: string;
  source: string; // 'lunar-rivers' | 'shi-heng-yi' | 'tesla' | 'book-essence'
  embedding: number[]; // Vector embedding
  metadata: Record<string, unknown>;
}

export type SubscriptionTier = 'free' | 'novice' | 'awakening' | 'enlightenment';

export interface Subscription {
  tier: SubscriptionTier;
  isActive: boolean;
  expiresAt: string | null;
  isTrial: boolean;
  trialEndsAt: string | null;
}

export interface UserProfile {
  user: User;
  subscription: Subscription;
}

/**
 * Subscription tier limits
 */
export interface TierLimits {
  phases: number; // Max workbook phases (1-10)
  meditations: number; // Number of meditations available
  journalEntriesPerMonth: number;
  aiMessagesPerDay: number;
  visionBoards: number;
  hasAdvancedAnalytics: boolean;
  hasPrioritySupport: boolean;
}

/**
 * Workbook phase metadata
 */
export interface WorkbookPhase {
  id: number; // 1-10
  title: string;
  description: string;
  worksheets: string[]; // List of worksheet IDs in this phase
  estimatedMinutes: number;
  requiredTier: SubscriptionTier;
}

/**
 * Achievement/Badge
 */
export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconUrl: string;
  unlockedAt: string | null;
  progress: number; // 0-100
}

export interface UserAchievements {
  userId: string;
  achievements: Achievement[];
}
