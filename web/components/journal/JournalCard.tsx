'use client'

import { JournalEntry, getMoodInfo, formatRelativeDate } from '@/types/database'

export interface JournalCardProps {
  entry: JournalEntry
  onClick?: (entry: JournalEntry) => void
  className?: string
}

/**
 * Extract the first line of content as a title
 */
function getTitle(content: string): string {
  const firstLine = content.split('\n')[0].trim()
  if (firstLine.length > 60) {
    return firstLine.substring(0, 60) + '...'
  }
  return firstLine || 'Untitled'
}

/**
 * Get a preview of the content (excluding the first line if it's short)
 */
function getPreview(content: string): string {
  const lines = content.split('\n')
  const firstLine = lines[0].trim()

  // If first line is short, include it in preview
  let previewText = firstLine.length > 60 ? lines.slice(1).join(' ') : content
  previewText = previewText.trim()

  if (previewText.length > 150) {
    return previewText.substring(0, 150) + '...'
  }
  return previewText
}

/**
 * JournalCard component displays a preview of a journal entry.
 *
 * @example
 * ```tsx
 * <JournalCard
 *   entry={journalEntry}
 *   onClick={(entry) => router.push(`/app/journal/${entry.id}`)}
 * />
 * ```
 */
export function JournalCard({
  entry,
  onClick,
  className = '',
}: JournalCardProps) {
  const moodInfo = entry.mood ? getMoodInfo(entry.mood) : null
  const title = getTitle(entry.content)
  const preview = getPreview(entry.content)
  const relativeDate = formatRelativeDate(entry.created_at)

  const handleClick = () => {
    if (onClick) {
      onClick(entry)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && onClick) {
      e.preventDefault()
      onClick(entry)
    }
  }

  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`
        bg-elevated border border-[rgba(196,160,82,0.2)] rounded-lg p-4
        transition-all duration-200
        ${onClick
          ? 'cursor-pointer hover:border-aged-gold/50 hover:shadow-[0_4px_24px_rgba(0,0,0,0.3)] hover:bg-temple-stone'
          : ''
        }
        ${className}
      `}
    >
      {/* Header with mood and date */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {moodInfo && (
            <span
              className="text-lg"
              title={moodInfo.label}
            >
              {moodInfo.label.split(' ')[0]}
            </span>
          )}
          <span className="text-xs text-muted-wisdom/60">
            {relativeDate}
          </span>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-ancient-script font-medium mb-1 line-clamp-1">
        {title}
      </h3>

      {/* Preview */}
      {preview && preview !== title && (
        <p className="text-sm text-muted-wisdom line-clamp-2 mb-3">
          {preview}
        </p>
      )}

      {/* Tags */}
      {entry.tags && entry.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {entry.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="
                px-2 py-0.5 text-xs rounded
                bg-aged-gold/10 text-aged-gold/80
                border border-aged-gold/20
              "
            >
              #{tag}
            </span>
          ))}
          {entry.tags.length > 4 && (
            <span className="text-xs text-muted-wisdom/60">
              +{entry.tags.length - 4} more
            </span>
          )}
        </div>
      )}
    </div>
  )
}
