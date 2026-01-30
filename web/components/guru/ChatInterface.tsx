'use client'

import { useRef, useEffect } from 'react'
import type { GuruMessage } from '@/types/guru'
import { MessageBubble } from './MessageBubble'
import { ChatInput } from './ChatInput'
import { TypingIndicator } from './TypingIndicator'
import { GuruEmptyState } from './GuruEmptyState'

interface ChatInterfaceProps {
  messages: GuruMessage[]
  selectedPhase: number | null
  isSending: boolean
  onSendMessage: (message: string) => void
  error?: string | null
  onClearError?: () => void
}

/**
 * ChatInterface is the main chat container
 * Contains message list with scroll and input area at bottom
 */
export function ChatInterface({
  messages,
  selectedPhase,
  isSending,
  onSendMessage,
  error,
  onClearError,
}: ChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isSending])

  const hasMessages = messages.length > 0

  return (
    <div className="flex flex-col h-full bg-deep-void rounded-xl border border-[rgba(196,160,82,0.2)] overflow-hidden">
      {/* Messages Area */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4"
        style={{ minHeight: '400px' }}
      >
        {hasMessages ? (
          <>
            {messages.map((message, index) => (
              <MessageBubble key={index} message={message} />
            ))}
            {isSending && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </>
        ) : (
          <GuruEmptyState
            selectedPhase={selectedPhase}
            onSelectPrompt={onSendMessage}
          />
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="px-4 py-3 bg-root-crimson/20 border-t border-root-crimson/30">
          <div className="flex items-center justify-between">
            <p className="text-sm text-enlightened">{error}</p>
            {onClearError && (
              <button
                onClick={onClearError}
                className="text-xs text-muted-wisdom hover:text-enlightened transition-colors"
              >
                Dismiss
              </button>
            )}
          </div>
        </div>
      )}

      {/* Input Area */}
      <ChatInput
        onSend={onSendMessage}
        disabled={isSending || !selectedPhase}
        placeholder={
          selectedPhase
            ? 'Ask the Guru about your journey...'
            : 'Select a completed phase to start'
        }
      />
    </div>
  )
}
