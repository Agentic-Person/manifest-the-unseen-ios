/**
 * useAudioPlayer Hook
 *
 * React hook for audio playback using expo-av.
 * Handles meditation audio playback with progress tracking,
 * seek functionality, and background playback support.
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { Audio, AVPlaybackStatus } from 'expo-av';
import type { PlaybackState, AudioProgress } from '../types/meditation';

/**
 * Hook options
 */
interface UseAudioPlayerOptions {
  /**
   * Auto-play when loaded
   * @default false
   */
  autoPlay?: boolean;

  /**
   * Loop playback
   * @default false
   */
  loop?: boolean;

  /**
   * Progress update interval in milliseconds
   * @default 250
   */
  progressInterval?: number;

  /**
   * Callback when playback ends
   */
  onPlaybackEnd?: () => void;

  /**
   * Callback on error
   */
  onError?: (error: string) => void;
}

/**
 * Hook return interface
 */
interface UseAudioPlayerReturn {
  // State
  state: PlaybackState;
  progress: AudioProgress;
  isLoaded: boolean;
  error: string | null;

  // Actions
  load: (uri: string) => Promise<void>;
  play: () => Promise<void>;
  pause: () => Promise<void>;
  stop: () => Promise<void>;
  seek: (positionMs: number) => Promise<void>;
  seekRelative: (deltaMs: number) => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
  unload: () => Promise<void>;
}

/**
 * Custom hook for audio playback
 *
 * Manages audio playback with expo-av Sound API.
 * Supports meditation audio with progress tracking and seek.
 *
 * @param options - Optional configuration
 *
 * @example
 * ```tsx
 * function MeditationPlayer({ audioUrl }: { audioUrl: string }) {
 *   const {
 *     state,
 *     progress,
 *     load,
 *     play,
 *     pause,
 *     seek,
 *   } = useAudioPlayer({
 *     onPlaybackEnd: () => console.log('Meditation complete!'),
 *   });
 *
 *   useEffect(() => {
 *     load(audioUrl);
 *   }, [audioUrl]);
 *
 *   return (
 *     <View>
 *       <Text>State: {state}</Text>
 *       <Slider
 *         value={progress.progress}
 *         onSlidingComplete={(value) => seek(value * progress.duration)}
 *       />
 *       <Button
 *         title={state === 'playing' ? 'Pause' : 'Play'}
 *         onPress={state === 'playing' ? pause : play}
 *       />
 *     </View>
 *   );
 * }
 * ```
 */
export function useAudioPlayer(
  options: UseAudioPlayerOptions = {}
): UseAudioPlayerReturn {
  const {
    autoPlay = false,
    loop = false,
    progressInterval = 250,
    onPlaybackEnd,
    onError,
  } = options;

  // State
  const [state, setState] = useState<PlaybackState>('idle');
  const [progress, setProgress] = useState<AudioProgress>({
    position: 0,
    duration: 0,
    progress: 0,
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refs
  const soundRef = useRef<Audio.Sound | null>(null);
  const isMountedRef = useRef(true);

  /**
   * Configure audio session for playback
   */
  const configureAudioSession = useCallback(async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true, // Allow background playback
        shouldDuckAndroid: true,
      });
    } catch (err) {
      const errorMsg = `Failed to configure audio session: ${
        err instanceof Error ? err.message : 'Unknown error'
      }`;
      setError(errorMsg);
      onError?.(errorMsg);
    }
  }, [onError]);

  /**
   * Handle playback status updates
   */
  const onPlaybackStatusUpdate = useCallback(
    (status: AVPlaybackStatus) => {
      if (!isMountedRef.current) return;

      if (!status.isLoaded) {
        // Handle error state
        if (status.error) {
          const errorMsg = `Playback error: ${status.error}`;
          setError(errorMsg);
          setState('error');
          onError?.(errorMsg);
        }
        return;
      }

      // Update progress
      const position = status.positionMillis || 0;
      const duration = status.durationMillis || 0;
      setProgress({
        position,
        duration,
        progress: duration > 0 ? position / duration : 0,
      });

      // Update state based on playback status
      if (status.didJustFinish && !status.isLooping) {
        setState('ended');
        onPlaybackEnd?.();
      } else if (status.isPlaying) {
        setState('playing');
      } else if (status.isBuffering) {
        setState('loading');
      } else {
        setState('paused');
      }
    },
    [onPlaybackEnd, onError]
  );

  /**
   * Load audio from URI
   */
  const load = useCallback(
    async (uri: string): Promise<void> => {
      setError(null);
      setState('loading');

      try {
        // Unload existing sound if any
        if (soundRef.current) {
          await soundRef.current.unloadAsync();
          soundRef.current = null;
        }

        // Configure audio session
        await configureAudioSession();

        // Create and load sound
        const { sound } = await Audio.Sound.createAsync(
          { uri },
          {
            shouldPlay: autoPlay,
            isLooping: loop,
            progressUpdateIntervalMillis: progressInterval,
          },
          onPlaybackStatusUpdate
        );

        soundRef.current = sound;
        setIsLoaded(true);
        setState(autoPlay ? 'playing' : 'paused');
      } catch (err) {
        const errorMsg = `Failed to load audio: ${
          err instanceof Error ? err.message : 'Unknown error'
        }`;
        console.error('[useAudioPlayer] Audio load failed:', { uri, error: err });
        setError(errorMsg);
        setState('error');
        setIsLoaded(false);
        onError?.(errorMsg);
        throw new Error(errorMsg);
      }
    },
    [autoPlay, loop, progressInterval, configureAudioSession, onPlaybackStatusUpdate, onError]
  );

  /**
   * Play audio
   */
  const play = useCallback(async (): Promise<void> => {
    if (!soundRef.current) {
      throw new Error('No audio loaded');
    }

    try {
      const status = await soundRef.current.getStatusAsync();

      // If playback ended, seek to beginning first
      if (status.isLoaded && status.didJustFinish) {
        await soundRef.current.setPositionAsync(0);
      }

      await soundRef.current.playAsync();
      setState('playing');
    } catch (err) {
      const errorMsg = `Failed to play: ${
        err instanceof Error ? err.message : 'Unknown error'
      }`;
      setError(errorMsg);
      onError?.(errorMsg);
      throw new Error(errorMsg);
    }
  }, [onError]);

  /**
   * Pause audio
   */
  const pause = useCallback(async (): Promise<void> => {
    if (!soundRef.current) {
      throw new Error('No audio loaded');
    }

    try {
      await soundRef.current.pauseAsync();
      setState('paused');
    } catch (err) {
      const errorMsg = `Failed to pause: ${
        err instanceof Error ? err.message : 'Unknown error'
      }`;
      setError(errorMsg);
      onError?.(errorMsg);
      throw new Error(errorMsg);
    }
  }, [onError]);

  /**
   * Stop audio (pause and seek to beginning)
   */
  const stop = useCallback(async (): Promise<void> => {
    if (!soundRef.current) {
      throw new Error('No audio loaded');
    }

    try {
      await soundRef.current.stopAsync();
      setProgress((prev) => ({ ...prev, position: 0, progress: 0 }));
      setState('paused');
    } catch (err) {
      const errorMsg = `Failed to stop: ${
        err instanceof Error ? err.message : 'Unknown error'
      }`;
      setError(errorMsg);
      onError?.(errorMsg);
      throw new Error(errorMsg);
    }
  }, [onError]);

  /**
   * Seek to position in milliseconds
   */
  const seek = useCallback(
    async (positionMs: number): Promise<void> => {
      if (!soundRef.current) {
        throw new Error('No audio loaded');
      }

      try {
        // Clamp position to valid range
        const clampedPosition = Math.max(0, Math.min(positionMs, progress.duration));
        await soundRef.current.setPositionAsync(clampedPosition);
      } catch (err) {
        const errorMsg = `Failed to seek: ${
          err instanceof Error ? err.message : 'Unknown error'
        }`;
        setError(errorMsg);
        onError?.(errorMsg);
        throw new Error(errorMsg);
      }
    },
    [progress.duration, onError]
  );

  /**
   * Seek relative to current position
   */
  const seekRelative = useCallback(
    async (deltaMs: number): Promise<void> => {
      const newPosition = progress.position + deltaMs;
      await seek(newPosition);
    },
    [progress.position, seek]
  );

  /**
   * Set volume (0.0 to 1.0)
   */
  const setVolume = useCallback(
    async (volume: number): Promise<void> => {
      if (!soundRef.current) {
        throw new Error('No audio loaded');
      }

      try {
        const clampedVolume = Math.max(0, Math.min(1, volume));
        await soundRef.current.setVolumeAsync(clampedVolume);
      } catch (err) {
        const errorMsg = `Failed to set volume: ${
          err instanceof Error ? err.message : 'Unknown error'
        }`;
        setError(errorMsg);
        onError?.(errorMsg);
        throw new Error(errorMsg);
      }
    },
    [onError]
  );

  /**
   * Unload audio
   */
  const unload = useCallback(async (): Promise<void> => {
    if (!soundRef.current) {
      return;
    }

    try {
      await soundRef.current.unloadAsync();
      soundRef.current = null;
      setIsLoaded(false);
      setState('idle');
      setProgress({ position: 0, duration: 0, progress: 0 });
    } catch (err) {
      console.error('Error unloading audio:', err);
      // Best effort cleanup
      soundRef.current = null;
      setIsLoaded(false);
      setState('idle');
    }
  }, []);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch((err) => {
          console.error('Error cleaning up audio on unmount:', err);
        });
      }
    };
  }, []);

  return {
    // State
    state,
    progress,
    isLoaded,
    error,

    // Actions
    load,
    play,
    pause,
    stop,
    seek,
    seekRelative,
    setVolume,
    unload,
  };
}
