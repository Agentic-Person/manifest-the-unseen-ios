/**
 * Database Types
 *
 * TypeScript types generated from Supabase schema.
 * These types should be regenerated whenever the database schema changes.
 *
 * To regenerate:
 * npx supabase gen types typescript --local > src/types/database.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

/**
 * Database Schema
 * This is a placeholder structure based on the PRD/TDD.
 * Replace with actual generated types from Supabase.
 */
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          subscription_tier: 'free' | 'novice' | 'awakening' | 'enlightenment'
          subscription_status: 'active' | 'canceled' | 'expired' | 'trial'
          trial_ends_at: string | null
          current_phase: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          subscription_tier?: 'free' | 'novice' | 'awakening' | 'enlightenment'
          subscription_status?: 'active' | 'canceled' | 'expired' | 'trial'
          trial_ends_at?: string | null
          current_phase?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          subscription_tier?: 'free' | 'novice' | 'awakening' | 'enlightenment'
          subscription_status?: 'active' | 'canceled' | 'expired' | 'trial'
          trial_ends_at?: string | null
          current_phase?: number
          created_at?: string
          updated_at?: string
        }
      }
      workbook_progress: {
        Row: {
          id: string
          user_id: string
          phase_id: number
          exercise_id: string
          data: Json
          completed: boolean
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          phase_id: number
          exercise_id: string
          data: Json
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          phase_id?: number
          exercise_id?: string
          data?: Json
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      journal_entries: {
        Row: {
          id: string
          user_id: string
          title: string | null
          content: string
          tags: string[] | null
          mood: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title?: string | null
          content: string
          tags?: string[] | null
          mood?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string | null
          content?: string
          tags?: string[] | null
          mood?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      meditations: {
        Row: {
          id: string
          title: string
          description: string | null
          duration_seconds: number
          audio_url: string
          narrator_gender: 'male' | 'female'
          tier_required: 'novice' | 'awakening' | 'enlightenment'
          type: 'guided' | 'breathing' | 'music'
          tags: string[]
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          duration_seconds: number
          audio_url: string
          narrator_gender: 'male' | 'female'
          tier_required?: 'novice' | 'awakening' | 'enlightenment'
          type?: 'guided' | 'breathing' | 'music'
          tags?: string[]
          order_index: number
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          duration_seconds?: number
          audio_url?: string
          narrator_gender?: 'male' | 'female'
          tier_required?: 'novice' | 'awakening' | 'enlightenment'
          type?: 'guided' | 'breathing' | 'music'
          tags?: string[]
          order_index?: number
          created_at?: string
        }
      }
      meditation_sessions: {
        Row: {
          id: string
          user_id: string
          meditation_id: string
          duration_seconds: number | null
          completed: boolean
          completed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          meditation_id: string
          duration_seconds?: number | null
          completed?: boolean
          completed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          meditation_id?: string
          duration_seconds?: number | null
          completed?: boolean
          completed_at?: string | null
          created_at?: string
        }
      }
      ai_conversations: {
        Row: {
          id: string
          user_id: string
          title: string | null
          messages: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title?: string | null
          messages: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string | null
          messages?: Json
          created_at?: string
          updated_at?: string
        }
      }
      vision_boards: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          images: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          images: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          images?: Json
          created_at?: string
          updated_at?: string
        }
      }
      knowledge_embeddings: {
        Row: {
          id: string
          content: string
          embedding: number[]
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          content: string
          embedding: number[]
          metadata: Json
          created_at?: string
        }
        Update: {
          id?: string
          content?: string
          embedding?: number[]
          metadata?: Json
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
