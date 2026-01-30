'use client'

import type { GuruMessage, MessageRole } from '@/types/guru'
import { formatMessageTimestamp } from '@/types/guru'

interface MessageBubbleProps {
  message: GuruMessage
}

/**
 * MessageBubble displays a single chat message
 * Different styling for user vs assistant messages
 */
export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div
        className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-gradient-primary text-enlightened rounded-br-md'
            : 'bg-temple-stone border border-[rgba(196,160,82,0.2)] text-enlightened rounded-bl-md'
        }`}
      >
        {/* Message role label */}
        <div className="flex items-center gap-2 mb-1">
          {!isUser && (
            <span className="text-aged-gold font-medium text-sm">Guru</span>
          )}
          <span className="text-xs text-muted-wisdom">
            {formatMessageTimestamp(message.timestamp)}
          </span>
        </div>

        {/* Message content */}
        <div className={`prose prose-sm prose-invert max-w-none ${
          isUser ? 'text-enlightened' : 'text-enlightened/90'
        }`}>
          {message.content.split('\n').map((paragraph, index) => {
            // Handle markdown-style bold
            const formattedParagraph = paragraph.replace(
              /\*\*(.*?)\*\*/g,
              '<strong class="text-aged-gold">$1</strong>'
            )

            return paragraph.trim() ? (
              <p
                key={index}
                className="mb-2 last:mb-0 text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: formattedParagraph }}
              />
            ) : (
              <br key={index} />
            )
          })}
        </div>
      </div>
    </div>
  )
}
