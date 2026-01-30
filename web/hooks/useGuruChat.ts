'use client'

import { useState, useCallback, useEffect } from 'react'
import type {
  GuruMessage,
  GuruConversation,
  GuruAnalysisError,
} from '@/types/guru'
import {
  sendGuruMessage,
  fetchGuruConversation,
} from '@/lib/guruService'

export interface UseGuruChatReturn {
  messages: GuruMessage[]
  conversationId: string | null
  isLoading: boolean
  isSending: boolean
  error: string | null
  sendMessage: (message: string, phaseNumber: number) => Promise<void>
  loadConversation: (conversationId: string) => Promise<void>
  startNewConversation: () => void
  clearError: () => void
}

/**
 * useGuruChat manages the state and operations for Guru AI chat
 *
 * @example
 * ```tsx
 * const { messages, sendMessage, isLoading } = useGuruChat()
 *
 * const handleSend = async (text: string) => {
 *   await sendMessage(text, selectedPhase)
 * }
 * ```
 */
export function useGuruChat(): UseGuruChatReturn {
  const [messages, setMessages] = useState<GuruMessage[]>([])
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Send a message to the Guru
   */
  const sendMessage = useCallback(
    async (message: string, phaseNumber: number) => {
      if (!message.trim()) return

      setIsSending(true)
      setError(null)

      // Optimistically add user message
      const userMessage: GuruMessage = {
        role: 'user',
        content: message,
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, userMessage])

      try {
        const result = await sendGuruMessage({
          message,
          phaseNumber,
          conversationId: conversationId || undefined,
          isInitialAnalysis: !conversationId,
        })

        if (result.success) {
          // Add assistant message
          const assistantMessage: GuruMessage = {
            role: 'assistant',
            content: result.data.reply,
            timestamp: new Date().toISOString(),
          }
          setMessages((prev) => [...prev, assistantMessage])

          // Update conversation ID if new conversation
          if (!conversationId) {
            setConversationId(result.data.conversationId)
          }
        } else {
          // Handle error
          const errorData = result.error as GuruAnalysisError
          let errorMessage = errorData.error

          // Provide user-friendly error messages
          switch (errorData.code) {
            case 'SUBSCRIPTION_REQUIRED':
              errorMessage = 'Guru feature requires an Awakening or Enlightenment subscription.'
              break
            case 'PHASE_INCOMPLETE':
              errorMessage = errorData.error || 'Please complete this phase before consulting the Guru.'
              break
            case 'RATE_LIMIT_EXCEEDED':
              errorMessage = 'Daily Guru limit reached. Please try again tomorrow.'
              break
          }

          setError(errorMessage)
          // Remove optimistic user message on error
          setMessages((prev) => prev.slice(0, -1))
        }
      } catch (err) {
        console.error('Send message error:', err)
        setError('Failed to send message. Please try again.')
        // Remove optimistic user message on error
        setMessages((prev) => prev.slice(0, -1))
      } finally {
        setIsSending(false)
      }
    },
    [conversationId]
  )

  /**
   * Load an existing conversation
   */
  const loadConversation = useCallback(async (id: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await fetchGuruConversation(id)

      if (result.success) {
        setConversationId(result.data.id)
        setMessages(result.data.messages || [])
      } else {
        setError(result.error.error)
      }
    } catch (err) {
      console.error('Load conversation error:', err)
      setError('Failed to load conversation.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * Start a new conversation
   */
  const startNewConversation = useCallback(() => {
    setMessages([])
    setConversationId(null)
    setError(null)
  }, [])

  /**
   * Clear current error
   */
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    messages,
    conversationId,
    isLoading,
    isSending,
    error,
    sendMessage,
    loadConversation,
    startNewConversation,
    clearError,
  }
}
