'use client'

/**
 * TypingIndicator shows animated dots while the AI is responding
 */
export function TypingIndicator() {
  return (
    <div className="flex justify-start mb-4">
      <div className="bg-temple-stone border border-[rgba(196,160,82,0.2)] rounded-2xl rounded-bl-md px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-aged-gold font-medium text-sm">Guru</span>
          <span className="text-xs text-muted-wisdom">is thinking</span>
        </div>
        <div className="flex items-center gap-1 mt-2">
          <span
            className="w-2 h-2 bg-aged-gold rounded-full animate-bounce"
            style={{ animationDelay: '0ms', animationDuration: '600ms' }}
          />
          <span
            className="w-2 h-2 bg-aged-gold rounded-full animate-bounce"
            style={{ animationDelay: '150ms', animationDuration: '600ms' }}
          />
          <span
            className="w-2 h-2 bg-aged-gold rounded-full animate-bounce"
            style={{ animationDelay: '300ms', animationDuration: '600ms' }}
          />
        </div>
      </div>
    </div>
  )
}
