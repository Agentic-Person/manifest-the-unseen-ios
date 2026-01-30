'use client'

import { useCallback } from 'react'

export interface PlayerControlsProps {
  isPlaying: boolean
  isLoading: boolean
  onPlayPause: () => void
  onSkipBack: () => void
  onSkipForward: () => void
  volume: number
  isMuted: boolean
  onVolumeChange: (volume: number) => void
  onMuteToggle: () => void
  showVolume?: boolean
  disabled?: boolean
  className?: string
}

/**
 * PlayerControls component provides play/pause, skip, and volume controls.
 *
 * @example
 * ```tsx
 * <PlayerControls
 *   isPlaying={player.isPlaying}
 *   isLoading={player.isLoading}
 *   onPlayPause={player.togglePlayPause}
 *   onSkipBack={() => player.seekRelative(-15)}
 *   onSkipForward={() => player.seekRelative(15)}
 *   volume={player.volume}
 *   isMuted={player.isMuted}
 *   onVolumeChange={player.setVolume}
 *   onMuteToggle={player.toggleMute}
 * />
 * ```
 */
export function PlayerControls({
  isPlaying,
  isLoading,
  onPlayPause,
  onSkipBack,
  onSkipForward,
  volume,
  isMuted,
  onVolumeChange,
  onMuteToggle,
  showVolume = true,
  disabled = false,
  className = '',
}: PlayerControlsProps) {
  const handleVolumeSliderChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onVolumeChange(parseFloat(e.target.value))
    },
    [onVolumeChange]
  )

  return (
    <div className={`flex items-center justify-center gap-4 ${className}`}>
      {/* Skip Back Button */}
      <button
        onClick={onSkipBack}
        disabled={disabled}
        className="p-2 text-muted-wisdom hover:text-enlightened transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Skip back 15 seconds"
        title="Skip back 15 seconds"
      >
        <SkipBackIcon className="w-6 h-6" />
      </button>

      {/* Play/Pause Button */}
      <button
        onClick={onPlayPause}
        disabled={disabled || isLoading}
        className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-aged-gold to-amber-glow rounded-full text-deep-void hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isLoading ? (
          <LoadingSpinner className="w-8 h-8" />
        ) : isPlaying ? (
          <PauseIcon className="w-8 h-8" />
        ) : (
          <PlayIcon className="w-8 h-8 ml-1" />
        )}
      </button>

      {/* Skip Forward Button */}
      <button
        onClick={onSkipForward}
        disabled={disabled}
        className="p-2 text-muted-wisdom hover:text-enlightened transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Skip forward 15 seconds"
        title="Skip forward 15 seconds"
      >
        <SkipForwardIcon className="w-6 h-6" />
      </button>

      {/* Volume Control */}
      {showVolume && (
        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={onMuteToggle}
            disabled={disabled}
            className="p-2 text-muted-wisdom hover:text-enlightened transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted || volume === 0 ? (
              <VolumeMutedIcon className="w-5 h-5" />
            ) : volume < 0.5 ? (
              <VolumeLowIcon className="w-5 h-5" />
            ) : (
              <VolumeHighIcon className="w-5 h-5" />
            )}
          </button>

          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeSliderChange}
            disabled={disabled}
            className="w-20 h-1 bg-temple-stone rounded-lg appearance-none cursor-pointer accent-aged-gold disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Volume"
          />
        </div>
      )}
    </div>
  )
}

// Icon Components
function PlayIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}

function PauseIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  )
}

function SkipBackIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
      <text x="12" y="22" fontSize="6" fill="currentColor" textAnchor="middle">
        15
      </text>
    </svg>
  )
}

function SkipForwardIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
      <text x="12" y="22" fontSize="6" fill="currentColor" textAnchor="middle">
        15
      </text>
    </svg>
  )
}

function VolumeMutedIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
    </svg>
  )
}

function VolumeLowIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z" />
    </svg>
  )
}

function VolumeHighIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
    </svg>
  )
}

function LoadingSpinner({ className = '' }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none">
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
}
