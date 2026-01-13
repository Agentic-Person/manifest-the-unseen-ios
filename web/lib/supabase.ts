import { createClient } from '@supabase/supabase-js'

// Validate required environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env.local file.'
  )
}

/**
 * Supabase client for browser-side operations.
 * Uses the publishable anon key which is safe to expose in the browser.
 * Row Level Security (RLS) policies protect data access.
 *
 * @example
 * ```ts
 * import { supabase } from '@/lib/supabase'
 *
 * const { data, error } = await supabase
 *   .from('workbook_progress')
 *   .select('*')
 *   .eq('user_id', userId)
 * ```
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

/**
 * Type-safe helper for workbook progress queries
 */
export interface WorkbookProgress {
  id: string
  user_id: string
  phase_number: number
  worksheet_id: string
  data: Record<string, any>
  completed: boolean
  completed_at: string | null
  created_at: string
  updated_at: string
}

/**
 * Type-safe helper for user profiles
 */
export interface UserProfile {
  id: string
  email: string
  subscription_tier: 'novice' | 'awakening' | 'enlightenment' | null
  subscription_status: 'active' | 'canceled' | 'expired' | 'billing_issue' | null
  subscription_expires_at: string | null
  created_at: string
  updated_at: string
}
