'use client'

export interface ProgressBarProps {
  current: number
  total: number
  label?: string
  className?: string
  showCount?: boolean
}

/**
 * ProgressBar component for displaying completion progress.
 *
 * @example
 * ```tsx
 * <ProgressBar
 *   current={7}
 *   total={11}
 *   label="Phase 1: Self-Evaluation"
 *   showCount={true}
 * />
 * ```
 */
export function ProgressBar({
  current,
  total,
  label,
  className = '',
  showCount = true,
}: ProgressBarProps) {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0
  const clampedPercentage = Math.min(percentage, 100)

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Header with label and percentage */}
      {label && (
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-muted-wisdom">{label}</span>
          <div className="flex items-center gap-2">
            {showCount && (
              <span className="text-xs text-tertiary-text">
                {current} / {total}
              </span>
            )}
            <span className="text-sm font-semibold text-aged-gold">
              {percentage}%
            </span>
          </div>
        </div>
      )}

      {/* Progress bar */}
      <div className="relative w-full h-3 bg-[rgba(196,160,82,0.15)] rounded-full overflow-hidden">
        <div
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={label || 'Progress'}
          className="absolute top-0 left-0 h-full bg-gradient-gold rounded-full transition-all duration-300 ease-out shadow-[0_0_8px_rgba(196,160,82,0.3)]"
          style={{ width: `${clampedPercentage}%` }}
        />
      </div>

      {/* Show count below if no label */}
      {!label && showCount && (
        <div className="flex justify-between items-center text-xs text-tertiary-text">
          <span>
            {current} / {total}
          </span>
          <span className="font-semibold text-aged-gold">{percentage}%</span>
        </div>
      )}
    </div>
  )
}
