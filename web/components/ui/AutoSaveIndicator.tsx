'use client'

export interface AutoSaveIndicatorProps {
  status: 'idle' | 'saving' | 'saved' | 'error'
  errorMessage?: string
  lastSaved?: Date
  className?: string
}

/**
 * AutoSaveIndicator component for displaying auto-save status.
 *
 * @example
 * ```tsx
 * <AutoSaveIndicator status="saved" lastSaved={new Date()} />
 * <AutoSaveIndicator status="error" errorMessage="Connection failed" />
 * ```
 */
export function AutoSaveIndicator({
  status,
  errorMessage = 'Error saving',
  lastSaved,
  className = '',
}: AutoSaveIndicatorProps) {
  if (status === 'idle') {
    return null
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'saving':
        return (
          <svg
            className="animate-spin h-4 w-4 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )
      case 'saved':
        return (
          <svg
            className="h-4 w-4 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        )
      case 'error':
        return (
          <svg
            className="h-4 w-4 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )
    }
  }

  const getStatusText = () => {
    switch (status) {
      case 'saving':
        return 'Saving...'
      case 'saved':
        if (lastSaved) {
          const now = new Date()
          const diffMs = now.getTime() - lastSaved.getTime()
          const diffSecs = Math.floor(diffMs / 1000)

          if (diffSecs < 60) {
            return 'Saved just now'
          } else if (diffSecs < 3600) {
            const mins = Math.floor(diffSecs / 60)
            return `Saved ${mins}m ago`
          } else {
            return 'Saved'
          }
        }
        return 'Saved'
      case 'error':
        return errorMessage
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'saving':
        return 'text-gray-600'
      case 'saved':
        return 'text-green-600'
      case 'error':
        return 'text-red-600'
    }
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex items-center gap-2 text-sm ${getStatusColor()} ${className}`}
    >
      {getStatusIcon()}
      <span>{getStatusText()}</span>
    </div>
  )
}
