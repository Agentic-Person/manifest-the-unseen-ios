'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

export interface UseMeditationPlayerReturn {
  // State
  isPlaying: boolean
  currentTime: number
  duration: number
  buffered: number
  volume: number
  isMuted: boolean
  isLoading: boolean
  error: Error | null

  // Controls
  play: () => Promise<void>
  pause: () => void
  togglePlayPause: () => Promise<void>
  seek: (time: number) => void
  seekRelative: (delta: number) => void
  setVolume: (volume: number) => void
  toggleMute: () => void

  // Audio element ref (for advanced use)
  audioRef: React.RefObject<HTMLAudioElement | null>
}

/**
 * useMeditationPlayer hook wraps HTML5 Audio API for meditation playback.
 * Provides play/pause, seeking, volume control, and time tracking.
 *
 * @param audioUrl - URL of the audio file to play
 * @param onEnded - Callback when audio playback finishes
 * @param onTimeUpdate - Callback when currentTime changes (for session tracking)
 *
 * @example
 * ```tsx
 * const {
 *   isPlaying,
 *   currentTime,
 *   duration,
 *   togglePlayPause,
 *   seek,
 *   seekRelative,
 * } = useMeditationPlayer(meditation.audio_url, handleEnded)
 *
 * return (
 *   <div>
 *     <ProgressSlider
 *       currentTime={currentTime}
 *       duration={duration}
 *       onSeek={seek}
 *     />
 *     <button onClick={togglePlayPause}>
 *       {isPlaying ? 'Pause' : 'Play'}
 *     </button>
 *     <button onClick={() => seekRelative(-15)}>-15s</button>
 *     <button onClick={() => seekRelative(15)}>+15s</button>
 *   </div>
 * )
 * ```
 */
export function useMeditationPlayer(
  audioUrl: string | null,
  onEnded?: () => void,
  onTimeUpdate?: (currentTime: number) => void
): UseMeditationPlayerReturn {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [buffered, setBuffered] = useState(0)
  const [volume, setVolumeState] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // Initialize audio element
  useEffect(() => {
    if (!audioUrl) {
      setIsLoading(false)
      return
    }

    // Create audio element
    const audio = new Audio()
    audioRef.current = audio

    // Set up event listeners
    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
      setIsLoading(false)
    }

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
      onTimeUpdate?.(audio.currentTime)

      // Update buffered progress
      if (audio.buffered.length > 0) {
        const bufferedEnd = audio.buffered.end(audio.buffered.length - 1)
        setBuffered(bufferedEnd)
      }
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
      onEnded?.()
    }

    const handlePlay = () => {
      setIsPlaying(true)
    }

    const handlePause = () => {
      setIsPlaying(false)
    }

    const handleError = () => {
      setError(new Error('Failed to load audio file'))
      setIsLoading(false)
    }

    const handleWaiting = () => {
      setIsLoading(true)
    }

    const handleCanPlay = () => {
      setIsLoading(false)
    }

    // Add event listeners
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('error', handleError)
    audio.addEventListener('waiting', handleWaiting)
    audio.addEventListener('canplay', handleCanPlay)

    // Set source and start loading
    audio.src = audioUrl
    audio.preload = 'metadata'
    audio.load()

    // Cleanup
    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('error', handleError)
      audio.removeEventListener('waiting', handleWaiting)
      audio.removeEventListener('canplay', handleCanPlay)

      audio.pause()
      audio.src = ''
      audioRef.current = null
    }
  }, [audioUrl, onEnded, onTimeUpdate])

  /**
   * Play audio
   */
  const play = useCallback(async () => {
    const audio = audioRef.current
    if (!audio) return

    try {
      await audio.play()
    } catch (err) {
      console.error('Play failed:', err)
      setError(err instanceof Error ? err : new Error('Failed to play audio'))
    }
  }, [])

  /**
   * Pause audio
   */
  const pause = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.pause()
  }, [])

  /**
   * Toggle play/pause
   */
  const togglePlayPause = useCallback(async () => {
    if (isPlaying) {
      pause()
    } else {
      await play()
    }
  }, [isPlaying, play, pause])

  /**
   * Seek to specific time
   */
  const seek = useCallback((time: number) => {
    const audio = audioRef.current
    if (!audio) return

    const clampedTime = Math.max(0, Math.min(time, audio.duration || 0))
    audio.currentTime = clampedTime
    setCurrentTime(clampedTime)
  }, [])

  /**
   * Seek relative to current time (e.g., -15 for rewind 15s)
   */
  const seekRelative = useCallback(
    (delta: number) => {
      const audio = audioRef.current
      if (!audio) return

      seek(audio.currentTime + delta)
    },
    [seek]
  )

  /**
   * Set volume (0 to 1)
   */
  const setVolume = useCallback((newVolume: number) => {
    const audio = audioRef.current
    if (!audio) return

    const clampedVolume = Math.max(0, Math.min(1, newVolume))
    audio.volume = clampedVolume
    setVolumeState(clampedVolume)

    if (clampedVolume > 0 && audio.muted) {
      audio.muted = false
      setIsMuted(false)
    }
  }, [])

  /**
   * Toggle mute
   */
  const toggleMute = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.muted = !audio.muted
    setIsMuted(audio.muted)
  }, [])

  return {
    isPlaying,
    currentTime,
    duration,
    buffered,
    volume,
    isMuted,
    isLoading,
    error,
    play,
    pause,
    togglePlayPause,
    seek,
    seekRelative,
    setVolume,
    toggleMute,
    audioRef,
  }
}

/**
 * Format seconds to mm:ss display
 */
export function formatTime(seconds: number): string {
  if (!isFinite(seconds) || isNaN(seconds)) return '0:00'

  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
