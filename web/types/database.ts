/**
 * Database Types
 *
 * TypeScript interfaces matching the Supabase database schema
 */

import { SubscriptionTier, SubscriptionStatus as SubStatus } from './subscription'

/**
 * User profile from users table
 */
export interface User {
  id: string
  email: string
  full_name?: string | null
  avatar_url?: string | null
  subscription_tier: SubscriptionTier | null
  subscription_status: 'none' | 'trialing' | 'active' | 'canceled' | 'expired' | 'billing_issue' | null
  subscription_expires_at?: string | null
  trial_end_date?: string | null
  stripe_customer_id?: string | null
  created_at: string
  updated_at: string
}

/**
 * Workbook progress entry
 */
export interface WorkbookProgress {
  id: string
  user_id: string
  phase_number: number
  worksheet_id: string
  data: Record<string, unknown>
  completed: boolean
  completed_at?: string | null
  created_at: string
  updated_at: string
}

/**
 * Journal entry
 */
export interface JournalEntry {
  id: string
  user_id: string
  content: string
  encrypted_content?: string | null
  tags: string[]
  mood?: string | null
  created_at: string
  updated_at: string
}

/**
 * Meditation from meditations table
 */
export interface Meditation {
  id: string
  title: string
  description?: string | null
  duration_seconds: number
  audio_url: string
  narrator_gender: 'male' | 'female'
  tier_required: SubscriptionTier
  type?: 'guided' | 'breathing' | 'music' | 'prayer' | null
  tags: string[]
  life_areas?: string[] | null
  order_index: number
  created_at: string
}

/**
 * Meditation session tracking
 */
export interface MeditationSession {
  id: string
  user_id: string
  meditation_id: string
  completed: boolean
  duration_seconds?: number | null
  completed_at?: string | null
  created_at: string
}

/**
 * AI conversation
 */
export interface AIConversation {
  id: string
  user_id: string
  title?: string | null
  messages: Array<{
    role: 'user' | 'assistant'
    content: string
    timestamp: string
  }>
  conversation_type?: 'chat' | 'guru' | null
  guru_phase?: number | null
  created_at: string
  updated_at: string
}

/**
 * Vision board
 */
export interface VisionBoard {
  id: string
  user_id: string
  title: string
  images: Array<{
    url: string
    caption?: string
    position?: { x: number; y: number }
  }>
  created_at: string
  updated_at: string
}

/**
 * API usage tracking for rate limiting
 */
export interface APIUsage {
  id: string
  user_id: string
  endpoint: string
  created_at: string
}

/**
 * Guru session tracking
 */
export interface GuruSession {
  id: string
  user_id: string
  conversation_id: string
  phase_number: number
  created_at: string
}

/**
 * Prayer content
 */
export interface Prayer {
  id: string
  title: string
  description?: string | null
  content: string
  audio_url?: string | null
  duration_seconds?: number | null
  tier_required: SubscriptionTier
  life_areas?: string[] | null
  created_at: string
}

/**
 * Database subscription (from subscriptions table)
 */
export interface DBSubscription {
  id: string
  user_id: string
  platform: 'ios' | 'web'
  tier: SubscriptionTier
  status: 'active' | 'trialing' | 'canceled' | 'past_due' | 'expired'
  provider: 'revenuecat' | 'stripe'
  stripe_customer_id?: string | null
  stripe_subscription_id?: string | null
  stripe_price_id?: string | null
  revenuecat_app_user_id?: string | null
  current_period_start?: string | null
  current_period_end?: string | null
  cancel_at_period_end: boolean
  trial_end?: string | null
  billing_interval?: 'month' | 'year' | null
  created_at: string
  updated_at: string
}

/**
 * Mood options for journal entries
 */
export const MOOD_OPTIONS = [
  { value: 'joyful', label: '😊 Joyful', color: '#FFD700' },
  { value: 'peaceful', label: '😌 Peaceful', color: '#87CEEB' },
  { value: 'grateful', label: '🙏 Grateful', color: '#98FB98' },
  { value: 'hopeful', label: '✨ Hopeful', color: '#DDA0DD' },
  { value: 'neutral', label: '😐 Neutral', color: '#D3D3D3' },
  { value: 'anxious', label: '😰 Anxious', color: '#FFA07A' },
  { value: 'sad', label: '😢 Sad', color: '#4682B4' },
  { value: 'frustrated', label: '😤 Frustrated', color: '#FF6B6B' },
  { value: 'inspired', label: '💡 Inspired', color: '#FFE4B5' },
  { value: 'reflective', label: '🤔 Reflective', color: '#B0C4DE' },
] as const

export type MoodValue = typeof MOOD_OPTIONS[number]['value']

/**
 * Get mood display info
 */
export function getMoodInfo(mood: string): { label: string; color: string } | null {
  const found = MOOD_OPTIONS.find(m => m.value === mood)
  return found ? { label: found.label, color: found.color } : null
}

/**
 * Format duration in seconds to display string
 */
export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  if (remainingSeconds === 0) {
    return `${minutes} min`
  }
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

/**
 * Format date for display
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Format relative date
 */
export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
  return `${Math.floor(diffDays / 365)} years ago`
}
