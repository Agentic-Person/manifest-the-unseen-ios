/**
 * Guru Service - API client for the guru-analysis Edge Function
 *
 * Provides type-safe methods to interact with the Guru AI feature.
 */

import { supabase } from '@/lib/supabase'
import type {
  GuruAnalysisRequest,
  GuruAnalysisResponse,
  GuruAnalysisError,
  GuruConversation,
} from '@/types/guru'

/**
 * Response from guru service
 */
export type GuruServiceResult<T> =
  | { success: true; data: T }
  | { success: false; error: GuruAnalysisError }

/**
 * Send a message to the Guru AI for phase analysis
 *
 * @param request - The analysis request containing message, phase number, etc.
 * @returns The Guru's response or an error
 *
 * @example
 * ```ts
 * const result = await sendGuruMessage({
 *   message: 'Analyze my Phase 1 journey',
 *   phaseNumber: 1,
 *   isInitialAnalysis: true
 * })
 *
 * if (result.success) {
 *   console.log(result.data.reply)
 * } else {
 *   console.error(result.error)
 * }
 * ```
 */
export async function sendGuruMessage(
  request: GuruAnalysisRequest
): Promise<GuruServiceResult<GuruAnalysisResponse>> {
  try {
    const { data, error } = await supabase.functions.invoke<GuruAnalysisResponse>(
      'guru-analysis',
      {
        body: request,
      }
    )

    if (error) {
      // Handle Supabase function error
      const parsedError: GuruAnalysisError = {
        error: error.message || 'Failed to connect to Guru',
      }
      return { success: false, error: parsedError }
    }

    if (!data) {
      return {
        success: false,
        error: { error: 'No response from Guru' },
      }
    }

    // Check if response contains an error field (from edge function)
    if ('error' in data && typeof (data as any).error === 'string') {
      return {
        success: false,
        error: data as unknown as GuruAnalysisError,
      }
    }

    return { success: true, data }
  } catch (err) {
    console.error('Guru service error:', err)
    return {
      success: false,
      error: {
        error: err instanceof Error ? err.message : 'Unknown error occurred',
      },
    }
  }
}

/**
 * Fetch all Guru conversations for the current user
 *
 * @param phaseNumber - Optional phase filter
 * @returns List of conversations
 */
export async function fetchGuruConversations(
  phaseNumber?: number
): Promise<GuruServiceResult<GuruConversation[]>> {
  try {
    let query = supabase
      .from('ai_conversations')
      .select('*')
      .eq('conversation_type', 'guru')
      .order('updated_at', { ascending: false })

    if (phaseNumber) {
      query = query.eq('guru_phase', phaseNumber)
    }

    const { data, error } = await query

    if (error) {
      return {
        success: false,
        error: { error: error.message },
      }
    }

    return {
      success: true,
      data: (data || []) as GuruConversation[],
    }
  } catch (err) {
    console.error('Error fetching conversations:', err)
    return {
      success: false,
      error: {
        error: err instanceof Error ? err.message : 'Failed to fetch conversations',
      },
    }
  }
}

/**
 * Fetch a single Guru conversation by ID
 *
 * @param conversationId - The conversation ID
 * @returns The conversation or error
 */
export async function fetchGuruConversation(
  conversationId: string
): Promise<GuruServiceResult<GuruConversation>> {
  try {
    const { data, error } = await supabase
      .from('ai_conversations')
      .select('*')
      .eq('id', conversationId)
      .eq('conversation_type', 'guru')
      .single()

    if (error) {
      return {
        success: false,
        error: { error: error.message },
      }
    }

    if (!data) {
      return {
        success: false,
        error: { error: 'Conversation not found' },
      }
    }

    return {
      success: true,
      data: data as GuruConversation,
    }
  } catch (err) {
    console.error('Error fetching conversation:', err)
    return {
      success: false,
      error: {
        error: err instanceof Error ? err.message : 'Failed to fetch conversation',
      },
    }
  }
}

/**
 * Delete a Guru conversation
 *
 * @param conversationId - The conversation ID to delete
 * @returns Success or error
 */
export async function deleteGuruConversation(
  conversationId: string
): Promise<GuruServiceResult<void>> {
  try {
    const { error } = await supabase
      .from('ai_conversations')
      .delete()
      .eq('id', conversationId)
      .eq('conversation_type', 'guru')

    if (error) {
      return {
        success: false,
        error: { error: error.message },
      }
    }

    return { success: true, data: undefined }
  } catch (err) {
    console.error('Error deleting conversation:', err)
    return {
      success: false,
      error: {
        error: err instanceof Error ? err.message : 'Failed to delete conversation',
      },
    }
  }
}
