'use client'

import { useCallback, useRef, useState, MouseEvent, TouchEvent } from 'react'
import { formatTime } from '@/hooks/useMeditationPlayer'

export interface ProgressSliderProps {
  currentTime: number
  duration: number
  buffered: number
  onSeek: (time: number) => void
  disabled?: boolean
  className?: string
}

/**
 * ProgressSlider component for audio playback.
 * Shows played, buffered, and remaining portions.
 * Supports click and drag to seek.
 *
 * @example
 * ```tsx
 * <ProgressSlider
 *   currentTime={player.currentTime}
 *   duration={player.duration}
 *   buffered={player.buffered}
 *   onSeek={player.seek}
 * />
 * ```
 */
export function ProgressSlider({
  currentTime,
  duration,
  buffered,
  onSeek,
  disabled = false,
  className = '',
}: ProgressSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [hoverTime, setHoverTime] = useState<number | null>(null)
  const [hoverPosition, setHoverPosition] = useState(0)

  /**
   * Calculate time from position
   */
  const getTimeFromPosition = useCallback(
    (clientX: number): number => {
      if (!sliderRef.current || duration === 0) return 0

      const rect = sliderRef.current.getBoundingClientRect()
      const position = (clientX - rect.left) / rect.width
      const clampedPosition = Math.max(0, Math.min(1, position))

      return clampedPosition * duration
    },
    [duration]
  )

  /**
   * Handle click on slider
   */
  const handleClick = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (disabled) return

      const time = getTimeFromPosition(e.clientX)
      onSeek(time)
    },
    [disabled, getTimeFromPosition, onSeek]
  )

  /**
   * Handle mouse down for dragging
   */
  const handleMouseDown = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (disabled) return

      e.preventDefault()
      setIsDragging(true)

      const handleMouseMove = (moveEvent: globalThis.MouseEvent) => {
        const time = getTimeFromPosition(moveEvent.clientX)
        onSeek(time)
      }

      const handleMouseUp = () => {
        setIsDragging(false)
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }

      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    },
    [disabled, getTimeFromPosition, onSeek]
  )

  /**
   * Handle touch events for mobile
   */
  const handleTouchStart = useCallback(
    (e: TouchEvent<HTMLDivElement>) => {
      if (disabled) return

      setIsDragging(true)

      const handleTouchMove = (moveEvent: globalThis.TouchEvent) => {
        const touch = moveEvent.touches[0]
        const time = getTimeFromPosition(touch.clientX)
        onSeek(time)
      }

      const handleTouchEnd = () => {
        setIsDragging(false)
        document.removeEventListener('touchmove', handleTouchMove)
        document.removeEventListener('touchend', handleTouchEnd)
      }

      document.addEventListener('touchmove', handleTouchMove)
      document.addEventListener('touchend', handleTouchEnd)
    },
    [disabled, getTimeFromPosition, onSeek]
  )

  /**
   * Handle hover for time preview
   */
  const handleMouseMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (!sliderRef.current || disabled) return

      const rect = sliderRef.current.getBoundingClientRect()
      const position = (e.clientX - rect.left) / rect.width
      const clampedPosition = Math.max(0, Math.min(1, position))

      setHoverPosition(clampedPosition * 100)
      setHoverTime(clampedPosition * duration)
    },
    [disabled, duration]
  )

  const handleMouseLeave = useCallback(() => {
    setHoverTime(null)
  }, [])

  // Calculate percentages
  const playedPercent = duration > 0 ? (currentTime / duration) * 100 : 0
  const bufferedPercent = duration > 0 ? (buffered / duration) * 100 : 0

  return (
    <div className={`w-full ${className}`}>
      {/* Time display */}
      <div className="flex justify-between text-xs text-muted-wisdom mb-2">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      {/* Slider track */}
      <div
        ref={sliderRef}
        className={`relative h-2 rounded-full cursor-pointer ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        role="slider"
        aria-valuemin={0}
        aria-valuemax={duration}
        aria-valuenow={currentTime}
        aria-label="Audio progress"
        tabIndex={disabled ? -1 : 0}
      >
        {/* Background track */}
        <div className="absolute inset-0 bg-temple-stone rounded-full" />

        {/* Buffered track */}
        <div
          className="absolute inset-y-0 left-0 bg-muted-wisdom/30 rounded-full transition-[width]"
          style={{ width: `${bufferedPercent}%` }}
        />

        {/* Played track */}
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-aged-gold to-amber-glow rounded-full transition-[width]"
          style={{ width: `${playedPercent}%` }}
        />

        {/* Thumb */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-enlightened rounded-full shadow-lg transition-transform ${
            isDragging ? 'scale-125' : 'scale-100'
          } ${disabled ? 'hidden' : ''}`}
          style={{ left: `calc(${playedPercent}% - 8px)` }}
        />

        {/* Hover time tooltip */}
        {hoverTime !== null && !disabled && (
          <div
            className="absolute -top-8 px-2 py-1 bg-elevated rounded text-xs text-enlightened transform -translate-x-1/2 pointer-events-none"
            style={{ left: `${hoverPosition}%` }}
          >
            {formatTime(hoverTime)}
          </div>
        )}
      </div>
    </div>
  )
}
