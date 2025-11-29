/**
 * useAudioRecorder Hook
 *
 * React hook for managing audio recording using expo-av.
 * Handles recording lifecycle, duration tracking, and file management.
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { Audio } from 'expo-av';

/**
 * Recording status enum
 */
export type RecordingStatus = 'idle' | 'recording' | 'paused' | 'stopped';

/**
 * Hook options
 */
interface UseAudioRecorderOptions {
  /**
   * Maximum recording duration in seconds
   * @default 900 (15 minutes)
   */
  maxDuration?: number;
}

/**
 * Hook return interface
 */
interface UseAudioRecorderReturn {
  // Status
  status: RecordingStatus;
  duration: number; // seconds
  error: string | null;

  // Recording URI (available after stopped)
  recordingUri: string | null;

  // Actions
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<string>; // Returns URI
  pauseRecording: () => Promise<void>;
  resumeRecording: () => Promise<void>;
  cancelRecording: () => Promise<void>;
}

/**
 * Audio recording configuration
 * Optimized for voice recording with mono channel, high quality
 */
const recordingOptions: Audio.RecordingOptions = {
  isMeteringEnabled: true,
  android: {
    extension: '.m4a',
    outputFormat: Audio.AndroidOutputFormat.MPEG_4,
    audioEncoder: Audio.AndroidAudioEncoder.AAC,
    sampleRate: 44100,
    numberOfChannels: 1,
    bitRate: 128000,
  },
  ios: {
    extension: '.m4a',
    outputFormat: Audio.IOSOutputFormat.MPEG4AAC,
    audioQuality: Audio.IOSAudioQuality.HIGH,
    sampleRate: 44100,
    numberOfChannels: 1,
    bitRate: 128000,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },
  web: {
    mimeType: 'audio/webm',
    bitsPerSecond: 128000,
  },
};

/**
 * Custom hook for audio recording
 *
 * Manages audio recording with expo-av, including state tracking,
 * duration monitoring, and file URI management.
 *
 * @param options - Optional configuration
 *
 * @example
 * ```tsx
 * function VoiceRecorder() {
 *   const {
 *     status,
 *     duration,
 *     recordingUri,
 *     startRecording,
 *     stopRecording,
 *     pauseRecording,
 *     cancelRecording,
 *   } = useAudioRecorder({ maxDuration: 600 }); // 10 min max
 *
 *   const handleRecord = async () => {
 *     if (status === 'idle') {
 *       await startRecording();
 *     } else if (status === 'recording') {
 *       const uri = await stopRecording();
 *       console.log('Recording saved:', uri);
 *     }
 *   };
 *
 *   return (
 *     <View>
 *       <Text>Status: {status}</Text>
 *       <Text>Duration: {Math.floor(duration)}s</Text>
 *       <Button onPress={handleRecord} title={status === 'recording' ? 'Stop' : 'Record'} />
 *     </View>
 *   );
 * }
 * ```
 */
export function useAudioRecorder(
  options: UseAudioRecorderOptions = {}
): UseAudioRecorderReturn {
  const { maxDuration = 900 } = options; // Default: 15 minutes

  // State
  const [status, setStatus] = useState<RecordingStatus>('idle');
  const [duration, setDuration] = useState(0);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Refs
  const recordingRef = useRef<Audio.Recording | null>(null);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedDurationRef = useRef<number>(0);

  /**
   * Configure audio session for recording
   */
  const configureAudioSession = useCallback(async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });
    } catch (err) {
      throw new Error(
        `Failed to configure audio session: ${
          err instanceof Error ? err.message : 'Unknown error'
        }`
      );
    }
  }, []);

  /**
   * Start duration tracking
   */
  const startDurationTracking = useCallback(() => {
    startTimeRef.current = Date.now();

    durationIntervalRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const totalDuration = pausedDurationRef.current + elapsed;

      setDuration(totalDuration);

      // Auto-stop if max duration reached
      if (totalDuration >= maxDuration) {
        stopRecording();
      }
    }, 100); // Update every 100ms for smooth UI
  }, [maxDuration]);

  /**
   * Stop duration tracking
   */
  const stopDurationTracking = useCallback(() => {
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
      durationIntervalRef.current = null;
    }
  }, []);

  /**
   * Start recording
   */
  const startRecording = useCallback(async (): Promise<void> => {
    if (status !== 'idle') {
      throw new Error('Recording already in progress');
    }

    setError(null);

    try {
      // Request permissions
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) {
        throw new Error('Microphone permission not granted');
      }

      // Configure audio session
      await configureAudioSession();

      // Create and start recording
      const { recording } = await Audio.Recording.createAsync(recordingOptions);
      recordingRef.current = recording;

      setStatus('recording');
      setDuration(0);
      pausedDurationRef.current = 0;
      startDurationTracking();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to start recording';
      setError(errorMessage);
      setStatus('idle');
      throw new Error(errorMessage);
    }
  }, [status, configureAudioSession, startDurationTracking]);

  /**
   * Stop recording
   */
  const stopRecording = useCallback(async (): Promise<string> => {
    if (status !== 'recording' && status !== 'paused') {
      throw new Error('No recording in progress');
    }

    if (!recordingRef.current) {
      throw new Error('Recording object not found');
    }

    try {
      stopDurationTracking();

      // Stop recording
      await recordingRef.current.stopAndUnloadAsync();

      // Get the URI
      const uri = recordingRef.current.getURI();
      if (!uri) {
        throw new Error('Failed to get recording URI');
      }

      setRecordingUri(uri);
      setStatus('stopped');

      // Clean up
      recordingRef.current = null;

      // Reset audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
      });

      return uri;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to stop recording';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [status, stopDurationTracking]);

  /**
   * Pause recording
   */
  const pauseRecording = useCallback(async (): Promise<void> => {
    if (status !== 'recording') {
      throw new Error('No active recording to pause');
    }

    if (!recordingRef.current) {
      throw new Error('Recording object not found');
    }

    try {
      await recordingRef.current.pauseAsync();

      // Update paused duration
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      pausedDurationRef.current += elapsed;

      stopDurationTracking();
      setStatus('paused');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to pause recording';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [status, stopDurationTracking]);

  /**
   * Resume recording
   */
  const resumeRecording = useCallback(async (): Promise<void> => {
    if (status !== 'paused') {
      throw new Error('No paused recording to resume');
    }

    if (!recordingRef.current) {
      throw new Error('Recording object not found');
    }

    try {
      await recordingRef.current.startAsync();
      setStatus('recording');
      startDurationTracking();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to resume recording';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [status, startDurationTracking]);

  /**
   * Cancel recording
   */
  const cancelRecording = useCallback(async (): Promise<void> => {
    if (status === 'idle' || status === 'stopped') {
      return;
    }

    if (!recordingRef.current) {
      return;
    }

    try {
      stopDurationTracking();

      // Stop and unload
      await recordingRef.current.stopAndUnloadAsync();

      // Clean up
      recordingRef.current = null;
      setStatus('idle');
      setDuration(0);
      setRecordingUri(null);
      pausedDurationRef.current = 0;

      // Reset audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
      });
    } catch (err) {
      console.error('Error canceling recording:', err);
      // Don't throw - best effort cleanup
      setStatus('idle');
      setDuration(0);
      setRecordingUri(null);
    }
  }, [status, stopDurationTracking]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      stopDurationTracking();
      if (recordingRef.current) {
        recordingRef.current.stopAndUnloadAsync().catch((err) => {
          console.error('Error cleaning up recording on unmount:', err);
        });
      }
    };
  }, [stopDurationTracking]);

  return {
    // Status
    status,
    duration,
    error,

    // Recording URI
    recordingUri,

    // Actions
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    cancelRecording,
  };
}
