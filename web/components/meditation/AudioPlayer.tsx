'use client'

import { useEffect, useCallback, useRef } from 'react'
import { Meditation } from '@/types/database'
import { formatDuration } from '@/types/database'
import { useMeditationPlayer } from '@/hooks/useMeditationPlayer'
import { ProgressSlider } from './ProgressSlider'
import { PlayerControls } from './PlayerControls'

export interface AudioPlayerProps {
  meditation: Meditation
  onEnded?: () => void
  onPlay?: () => void
  onTimeUpdate?: (currentTime: number) => void
  autoPlay?: boolean
  className?: string
}

/**
 * AudioPlayer component for meditation playback.
 * Full-featured player with visualization area, progress bar, and controls.
 *
 * @example
 * ```tsx
 * <AudioPlayer
 *   meditation={meditation}
 *   onEnded={handleCompleteSession}
 *   onPlay={handleStartSession}
 *   onTimeUpdate={handleTimeUpdate}
 * />
 * ```
 */
export function AudioPlayer({
  meditation,
  onEnded,
  onPlay,
  onTimeUpdate,
  autoPlay = false,
  className = '',
}: AudioPlayerProps) {
  const hasStartedRef = useRef(false)

  const player = useMeditationPlayer(meditation.audio_url, onEnded, onTimeUpdate)

  // Handle auto-play
  useEffect(() => {
    if (autoPlay && !hasStartedRef.current && !player.isLoading) {
      hasStartedRef.current = true
      player.play()
    }
  }, [autoPlay, player])

  // Notify when playback starts
  const handlePlayPause = useCallback(async () => {
    const wasPlaying = player.isPlaying

    await player.togglePlayPause()

    // If we're starting playback, notify parent
    if (!wasPlaying && onPlay && !hasStartedRef.current) {
      hasStartedRef.current = true
      onPlay()
    }
  }, [player, onPlay])

  // Get meditation type display name
  const getTypeLabel = (type: string | null | undefined): string => {
    const typeMap: Record<string, string> = {
      guided: 'Guided Meditation',
      breathing: 'Breathing Exercise',
      music: 'Meditation Music',
      prayer: 'Prayer',
    }
    return type ? typeMap[type] || 'Meditation' : 'Meditation'
  }

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Visualization Area / Album Art */}
      <div className="relative w-full max-w-sm aspect-square mb-8">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-radial from-crown-purple/30 via-deep-purple/20 to-transparent rounded-full" />

        {/* Animated rings */}
        <div
          className={`absolute inset-4 rounded-full border border-aged-gold/20 ${
            player.isPlaying ? 'animate-pulse' : ''
          }`}
        />
        <div
          className={`absolute inset-8 rounded-full border border-aged-gold/30 ${
            player.isPlaying ? 'animate-pulse delay-75' : ''
          }`}
        />
        <div
          className={`absolute inset-12 rounded-full border border-aged-gold/40 ${
            player.isPlaying ? 'animate-pulse delay-150' : ''
          }`}
        />

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
          {/* Meditation icon based on type */}
          <div className="w-20 h-20 mb-4 flex items-center justify-center">
            <MeditationTypeIcon type={meditation.type} isPlaying={player.isPlaying} />
          </div>

          {/* Type label */}
          <span className="text-xs uppercase tracking-wider text-aged-gold/80 mb-2">
            {getTypeLabel(meditation.type)}
          </span>

          {/* Title */}
          <h2 className="text-xl font-heading text-enlightened text-center mb-2">
            {meditation.title}
          </h2>

          {/* Duration */}
          <span className="text-sm text-muted-wisdom">
            {formatDuration(meditation.duration_seconds)}
          </span>
        </div>
      </div>

      {/* Progress Slider */}
      <div className="w-full max-w-md mb-8 px-4">
        <ProgressSlider
          currentTime={player.currentTime}
          duration={player.duration}
          buffered={player.buffered}
          onSeek={player.seek}
          disabled={player.isLoading && player.duration === 0}
        />
      </div>

      {/* Player Controls */}
      <PlayerControls
        isPlaying={player.isPlaying}
        isLoading={player.isLoading}
        onPlayPause={handlePlayPause}
        onSkipBack={() => player.seekRelative(-15)}
        onSkipForward={() => player.seekRelative(15)}
        volume={player.volume}
        isMuted={player.isMuted}
        onVolumeChange={player.setVolume}
        onMuteToggle={player.toggleMute}
        showVolume={true}
      />

      {/* Error message */}
      {player.error && (
        <div className="mt-4 p-3 bg-root-crimson/20 border border-root-crimson/50 rounded-lg text-sm text-enlightened">
          {player.error.message}
        </div>
      )}

      {/* Description */}
      {meditation.description && (
        <div className="mt-8 max-w-md px-4">
          <p className="text-sm text-muted-wisdom text-center leading-relaxed">
            {meditation.description}
          </p>
        </div>
      )}
    </div>
  )
}

/**
 * Icon component based on meditation type
 */
function MeditationTypeIcon({
  type,
  isPlaying,
}: {
  type: Meditation['type']
  isPlaying: boolean
}) {
  const baseClass = `w-full h-full transition-transform ${isPlaying ? 'scale-110' : ''}`

  switch (type) {
    case 'guided':
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-aged-gold"
            d="M12 4.5v15m7.5-7.5h-15"
          />
          <circle cx="12" cy="12" r="9" className="text-aged-gold/50" />
          <circle cx="12" cy="12" r="3" className="text-aged-gold" fill="currentColor" fillOpacity="0.3" />
        </svg>
      )

    case 'breathing':
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-deep-teal"
            d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`text-deep-teal ${isPlaying ? 'animate-ping' : ''}`}
            d="M12 8v8m-4-4h8"
          />
        </svg>
      )

    case 'music':
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-crown-purple"
            d="M9 19V6l12-3v13"
          />
          <circle cx="6" cy="19" r="3" className="text-crown-purple" fill="currentColor" fillOpacity="0.3" />
          <circle cx="18" cy="16" r="3" className="text-crown-purple" fill="currentColor" fillOpacity="0.3" />
        </svg>
      )

    case 'prayer':
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-sacral-orange"
            d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"
          />
          <circle cx="12" cy="12" r="5" className="text-sacral-orange" fill="currentColor" fillOpacity="0.2" />
        </svg>
      )

    default:
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="9" className="text-aged-gold" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-aged-gold"
            d="M12 8v4l3 3"
          />
        </svg>
      )
  }
}
