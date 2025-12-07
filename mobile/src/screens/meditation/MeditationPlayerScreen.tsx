/**
 * MeditationPlayerScreen
 *
 * Full-screen audio player for meditations, breathing exercises, and music.
 * Features progress bar, play/pause controls, and session tracking.
 */

import React, { useEffect, useRef, useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors, spacing, shadows, borderRadius } from '../../theme';
import { useAudioPlayer } from '../../hooks/useAudioPlayer';
import {
  useMeditation,
  useStartMeditationSession,
  useCompleteMeditationSession,
  getMeditationAudioUrl,
} from '../../hooks/useMeditation';
import { formatTime, getMeditationIcon, getMeditationTypeLabel } from '../../types/meditation';
import type { MeditateStackScreenProps } from '../../types/navigation';
import { Loading } from '../../components/Loading';

type Props = MeditateStackScreenProps<'MeditationPlayer'>;

/**
 * MeditationPlayerScreen Component
 */
const MeditationPlayerScreen: React.FC<Props> = ({ route, navigation }) => {
  const { meditationId } = route.params;

  // Fetch meditation details
  const { data: meditation, isLoading, error } = useMeditation(meditationId);

  // Session tracking
  const { mutate: startSession } = useStartMeditationSession();
  const { mutate: completeSession } = useCompleteMeditationSession();
  const sessionIdRef = useRef<string | null>(null);
  const startTimeRef = useRef<number>(0);

  // Track if session was completed
  const [sessionCompleted, setSessionCompleted] = useState(false);

  // Audio player
  const {
    state,
    progress,
    isLoaded,
    error: audioError,
    load,
    play,
    pause,
    seekRelative,
    unload,
  } = useAudioPlayer({
    onPlaybackEnd: () => {
      handleSessionComplete();
    },
    onError: (err) => {
      console.error('Audio playback error:', err);
    },
  });

  // Animation values
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  /**
   * Start pulse animation when playing
   */
  useEffect(() => {
    if (state === 'playing') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Slow rotation for music type
      if (meditation?.type === 'music') {
        Animated.loop(
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 30000,
            easing: Easing.linear,
            useNativeDriver: true,
          })
        ).start();
      }
    } else {
      pulseAnim.stopAnimation();
      pulseAnim.setValue(1);
      rotateAnim.stopAnimation();
    }
  }, [state, pulseAnim, rotateAnim, meditation?.type]);

  /**
   * Load audio when meditation data is available
   * Note: Intentionally excluding load/unload from deps to prevent infinite loop
   * The callbacks have unstable references due to inline onPlaybackEnd/onError
   */
  useEffect(() => {
    if (meditation?.audio_url) {
      const audioUrl = getMeditationAudioUrl(meditation.audio_url);
      console.log('[MeditationPlayer] Loading audio:', {
        title: meditation.title,
        rawPath: meditation.audio_url,
        fullUrl: audioUrl,
      });
      load(audioUrl);
    }

    return () => {
      unload();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meditation?.audio_url]);

  /**
   * Handle play/pause toggle
   */
  const handlePlayPause = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (state === 'playing') {
      await pause();
    } else {
      // Start session tracking on first play
      if (!sessionIdRef.current && meditation) {
        startTimeRef.current = Date.now();
        startSession(
          { meditation_id: meditation.id },
          {
            onSuccess: (session) => {
              sessionIdRef.current = session.id;
            },
          }
        );
      }
      await play();
    }
  }, [state, pause, play, meditation, startSession]);

  /**
   * Handle session completion
   */
  const handleSessionComplete = useCallback(() => {
    if (sessionIdRef.current && !sessionCompleted) {
      const durationSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);
      completeSession({
        sessionId: sessionIdRef.current,
        durationSeconds,
      });
      setSessionCompleted(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [completeSession, sessionCompleted]);

  /**
   * Handle skip backward (15 seconds)
   */
  const handleSkipBackward = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await seekRelative(-15000);
  }, [seekRelative]);

  /**
   * Handle skip forward (15 seconds)
   */
  const handleSkipForward = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await seekRelative(15000);
  }, [seekRelative]);

  /**
   * Handle close
   */
  const handleClose = useCallback(() => {
    // Complete session if played for more than 60 seconds
    if (sessionIdRef.current && !sessionCompleted) {
      const durationSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);
      if (durationSeconds > 60) {
        completeSession({
          sessionId: sessionIdRef.current,
          durationSeconds,
        });
      }
    }
    navigation.goBack();
  }, [navigation, completeSession, sessionCompleted]);

  // Loading state
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Loading accessibilityLabel="Loading meditation" />
      </SafeAreaView>
    );
  }

  // Error state
  if (error || !meditation) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Unable to load meditation</Text>
          <Pressable style={styles.errorButton} onPress={() => navigation.goBack()}>
            <Text style={styles.errorButtonText}>Go Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const iconName = getMeditationIcon(meditation.type) as keyof typeof Ionicons.glyphMap;
  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.closeButton}
          onPress={handleClose}
          accessibilityLabel="Close player"
        >
          <Ionicons name="chevron-down" size={28} color={colors.text.primary} />
        </Pressable>
        <Text style={styles.headerType}>
          {getMeditationTypeLabel(meditation.type)}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Album Art / Icon */}
        <Animated.View
          style={[
            styles.artwork,
            {
              transform: [
                { scale: pulseAnim },
                { rotate: meditation.type === 'music' ? rotation : '0deg' },
              ],
            },
          ]}
        >
          <Ionicons name={iconName} size={80} color={colors.dark.accentGold} />
        </Animated.View>

        {/* Title & Description */}
        <Text style={styles.title}>{meditation.title}</Text>
        {meditation.description && (
          <Text style={styles.description} numberOfLines={3}>
            {meditation.description}
          </Text>
        )}

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${progress.progress * 100}%` },
              ]}
            />
            <Pressable
              style={[
                styles.progressThumb,
                { left: `${progress.progress * 100}%` },
              ]}
              onPress={() => {}}
            />
          </View>
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>{formatTime(progress.position)}</Text>
            <Text style={styles.timeText}>{formatTime(progress.duration)}</Text>
          </View>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          {/* Skip Backward */}
          <Pressable
            style={styles.skipButton}
            onPress={handleSkipBackward}
            accessibilityLabel="Skip backward 15 seconds"
          >
            <Ionicons name="play-back" size={28} color={colors.text.secondary} />
            <Text style={styles.skipText}>15</Text>
          </Pressable>

          {/* Play/Pause */}
          <Pressable
            style={styles.playButton}
            onPress={handlePlayPause}
            disabled={!isLoaded && state !== 'loading'}
            accessibilityLabel={state === 'playing' ? 'Pause' : 'Play'}
          >
            {state === 'loading' ? (
              <Ionicons name="hourglass" size={40} color={colors.background.primary} />
            ) : (
              <Ionicons
                name={state === 'playing' ? 'pause' : 'play'}
                size={40}
                color={colors.background.primary}
              />
            )}
          </Pressable>

          {/* Skip Forward */}
          <Pressable
            style={styles.skipButton}
            onPress={handleSkipForward}
            accessibilityLabel="Skip forward 15 seconds"
          >
            <Ionicons name="play-forward" size={28} color={colors.text.secondary} />
            <Text style={styles.skipText}>15</Text>
          </Pressable>
        </View>

        {/* Web Audio Warning */}
        {Platform.OS === 'web' && (
          <View style={styles.webWarningBanner}>
            <Ionicons name="information-circle" size={18} color={colors.warning[400]} />
            <Text style={styles.webWarningText}>
              Audio may not play in web preview. Test on iOS via Expo Go.
            </Text>
          </View>
        )}

        {/* Audio Error Banner */}
        {audioError && (
          <View style={styles.errorBanner}>
            <Ionicons name="alert-circle" size={18} color={colors.error[400]} />
            <Text style={styles.errorBannerText} numberOfLines={3}>
              {audioError}
            </Text>
          </View>
        )}

        {/* Session Complete Message */}
        {sessionCompleted && (
          <View style={styles.completedBanner}>
            <Ionicons name="checkmark-circle" size={20} color={colors.success[500]} />
            <Text style={styles.completedText}>Session Complete!</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  closeButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerType: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  headerSpacer: {
    width: 44,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  artwork: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.background.elevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
    ...shadows.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  progressContainer: {
    width: '100%',
    marginBottom: spacing.xl,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.background.elevated,
    borderRadius: 2,
    overflow: 'visible',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.dark.accentGold,
    borderRadius: 2,
  },
  progressThumb: {
    position: 'absolute',
    top: -6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.dark.accentGold,
    marginLeft: -8,
    ...shadows.sm,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  timeText: {
    fontSize: 12,
    color: colors.text.tertiary,
    fontVariant: ['tabular-nums'],
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xl,
  },
  skipButton: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipText: {
    fontSize: 10,
    color: colors.text.tertiary,
    marginTop: -4,
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.dark.accentGold,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  completedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.success[500]}20`,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.xl,
    gap: spacing.xs,
  },
  completedText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.success[500],
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  errorText: {
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  errorButton: {
    backgroundColor: colors.dark.accentPurple,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
  },
  errorButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  webWarningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.warning[500]}15`,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.lg,
    gap: spacing.xs,
  },
  webWarningText: {
    fontSize: 12,
    color: colors.warning[400],
    flex: 1,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.error[500]}15`,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.lg,
    gap: spacing.xs,
  },
  errorBannerText: {
    fontSize: 12,
    color: colors.error[400],
    flex: 1,
  },
});

export default MeditationPlayerScreen;
