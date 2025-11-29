/**
 * VoiceRecorder Component
 *
 * Voice recording component with transcription using Whisper AI.
 * Handles all recording states, model download progress, and transcription.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, spacing, typography, shadows } from '@/theme';
import { useWhisper } from '@/hooks/useWhisper';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';

export interface VoiceRecorderProps {
  /** Callback when transcription completes successfully */
  onTranscriptionComplete: (text: string) => void;

  /** Callback when user cancels recording */
  onCancel: () => void;

  /** Maximum recording duration in seconds (default: 900 = 15 minutes) */
  maxDuration?: number;
}

type RecorderState = 'idle' | 'downloading' | 'recording' | 'transcribing' | 'complete' | 'error';

/**
 * VoiceRecorder Component
 */
export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onTranscriptionComplete,
  onCancel,
  maxDuration = 900,
}) => {
  const [state, setState] = useState<RecorderState>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const {
    modelDownloaded,
    downloadProgress,
    isTranscribing,
    transcribe,
    downloadModel,
  } = useWhisper();

  const {
    status,
    duration,
    recordingUri,
    startRecording,
    stopRecording,
    cancelRecording,
  } = useAudioRecorder({ maxDuration });

  // Check if model is downloaded on mount
  useEffect(() => {
    if (!modelDownloaded && state === 'idle') {
      setState('downloading');
      downloadModel();
    }
  }, [modelDownloaded]);

  // Update state based on recording status
  useEffect(() => {
    if (status === 'recording') {
      setState('recording');
    } else if (status === 'idle' && state === 'recording') {
      setState('idle');
    }
  }, [status]);

  // Update state based on transcription status
  useEffect(() => {
    if (isTranscribing) {
      setState('transcribing');
    }
  }, [isTranscribing]);

  // Format duration as MM:SS or HH:MM:SS
  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle record button press
  const handleRecordPress = async () => {
    try {
      if (status === 'idle') {
        // Start recording
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        await startRecording();
      } else if (status === 'recording') {
        // Stop recording
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        await stopRecording();
      }
    } catch (error) {
      console.error('Recording error:', error);
      setState('error');
      setErrorMessage('Failed to record audio. Please try again.');
    }
  };

  // Handle cancel button
  const handleCancel = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (status === 'recording') {
      await cancelRecording();
    }
    setState('idle');
    onCancel();
  };

  // Handle transcribe button
  const handleTranscribe = async () => {
    if (!modelDownloaded) {
      setState('error');
      setErrorMessage('Whisper model not downloaded. Please wait...');
      return;
    }

    if (!recordingUri) {
      setState('error');
      setErrorMessage('No recording available to transcribe.');
      return;
    }

    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setState('transcribing');

      const text = await transcribe(recordingUri);

      setState('complete');
      onTranscriptionComplete(text);
    } catch (error) {
      console.error('Transcription error:', error);
      setState('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to transcribe audio. Please try again.');
    }
  };

  // Get status text
  const getStatusText = (): string => {
    switch (state) {
      case 'downloading':
        return `Downloading Whisper model... ${Math.round(downloadProgress * 100)}%`;
      case 'recording':
        return 'Recording...';
      case 'transcribing':
        return 'Transcribing...';
      case 'complete':
        return 'Transcription complete!';
      case 'error':
        return errorMessage;
      default:
        return 'Tap to start recording';
    }
  };

  // Get button text
  const getButtonText = (): string => {
    if (status === 'recording') {
      return 'Stop Recording';
    }
    return 'Record';
  };

  // Check if transcribe button should be enabled
  const canTranscribe = status === 'stopped' && modelDownloaded && !isTranscribing && recordingUri !== null;

  return (
    <View style={styles.container}>
      {/* Duration Timer */}
      {status === 'recording' && (
        <Text style={styles.duration}>{formatDuration(duration)}</Text>
      )}

      {/* Status Text */}
      <Text style={[
        styles.status,
        state === 'error' && styles.statusError,
        state === 'complete' && styles.statusSuccess,
      ]}>
        {getStatusText()}
      </Text>

      {/* Download Progress Bar */}
      {state === 'downloading' && (
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${downloadProgress * 100}%` }]} />
        </View>
      )}

      {/* Record Button */}
      <Pressable
        style={({ pressed }) => [
          styles.recordButton,
          status === 'recording' && styles.recordButtonActive,
          pressed && styles.recordButtonPressed,
          state === 'downloading' && styles.recordButtonDisabled,
        ]}
        onPress={handleRecordPress}
        disabled={state === 'downloading' || state === 'transcribing'}
      >
        {state === 'transcribing' ? (
          <ActivityIndicator color={colors.white} size="large" />
        ) : (
          <>
            <Text style={styles.recordIcon}>
              {status === 'recording' ? '⏹' : '🎤'}
            </Text>
            <Text style={styles.recordButtonText}>{getButtonText()}</Text>
          </>
        )}
      </Pressable>

      <Text style={styles.hint}>
        {status === 'idle' ? 'Tap to start/stop' : 'Recording in progress'}
      </Text>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            styles.cancelButton,
            pressed && styles.actionButtonPressed,
          ]}
          onPress={handleCancel}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            styles.transcribeButton,
            pressed && styles.actionButtonPressed,
            !canTranscribe && styles.actionButtonDisabled,
          ]}
          onPress={handleTranscribe}
          disabled={!canTranscribe}
        >
          <Text style={[
            styles.transcribeButtonText,
            !canTranscribe && styles.transcribeButtonTextDisabled,
          ]}>
            Transcribe
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.elevated,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  duration: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.primary[400],
    textAlign: 'center',
    marginBottom: spacing.sm,
    fontVariant: ['tabular-nums'],
  },
  status: {
    fontSize: typography.body.fontSize,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.md,
    minHeight: 24,
  },
  statusError: {
    color: colors.error[400],
  },
  statusSuccess: {
    color: colors.success[400],
  },
  progressContainer: {
    height: 4,
    backgroundColor: colors.background.secondary,
    borderRadius: 2,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary[500],
    borderRadius: 2,
  },
  recordButton: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: colors.primary[600],
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    ...shadows.md,
  },
  recordButtonActive: {
    backgroundColor: colors.error[600],
  },
  recordButtonPressed: {
    transform: [{ scale: 0.95 }],
    ...shadows.sm,
  },
  recordButtonDisabled: {
    opacity: 0.5,
  },
  recordIcon: {
    fontSize: 48,
    marginBottom: spacing.xs,
  },
  recordButtonText: {
    fontSize: typography.button.fontSize,
    fontWeight: '700',
    color: colors.white,
  },
  hint: {
    fontSize: typography.caption.fontSize,
    color: colors.text.tertiary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  actionButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  actionButtonPressed: {
    opacity: 0.7,
  },
  actionButtonDisabled: {
    opacity: 0.5,
  },
  cancelButton: {
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  cancelButtonText: {
    fontSize: typography.button.fontSize,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  transcribeButton: {
    backgroundColor: colors.primary[600],
    ...shadows.sm,
  },
  transcribeButtonText: {
    fontSize: typography.button.fontSize,
    fontWeight: '700',
    color: colors.white,
  },
  transcribeButtonTextDisabled: {
    opacity: 0.7,
  },
});

export default VoiceRecorder;
