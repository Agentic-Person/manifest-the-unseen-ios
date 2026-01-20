/**
 * Prayer Timing Hook
 *
 * Provides synchronized line timing for prayer text display.
 * Prefers pre-generated Whisper timestamps when available,
 * falls back to proportional word-count timing otherwise.
 */

import { useMemo } from 'react';

import type { PrayerLineTiming } from '../types/guru';

/**
 * Represents a single line of prayer text with timing information
 */
export interface PrayerLine {
  /** Zero-based index of the line */
  index: number;
  /** The text content of this line */
  text: string;
  /** Number of words in this line */
  wordCount: number;
  /** Start time in milliseconds */
  startTimeMs: number;
  /** End time in milliseconds */
  endTimeMs: number;
}

/**
 * Result from the current prayer line calculation
 */
export interface CurrentPrayerLineResult {
  /** The currently active line (null if before first line or after last) */
  currentLine: PrayerLine | null;
  /** The next line coming up (null if no more lines) */
  nextLine: PrayerLine | null;
  /** Progress within the current line (0-1) */
  lineProgress: number;
  /** Total number of lines */
  totalLines: number;
  /** Current line index (0-based, -1 if no current line) */
  currentIndex: number;
}

/** Pause duration between lines in milliseconds (for natural breathing rhythm) */
const LINE_PAUSE_MS = 300;

/**
 * Audio offset in milliseconds for CALCULATED timings (word-count based).
 * This offset is only used when Whisper timestamps are NOT available.
 * Whisper timestamps already account for intro/silence, so they don't need offset.
 * Positive value = delay the text display to account for intro music/silence.
 */
const AUDIO_OFFSET_MS = 5000; // 5 seconds - only used for calculated timing fallback

/**
 * Convert pre-generated Whisper line timings to PrayerLine format
 * Note: Whisper timestamps already account for intro silence, so no offset needed
 *
 * @param lineTimings - Pre-generated timings from database (Whisper output)
 * @returns Array of PrayerLine objects with timing data
 */
function convertWhisperTimings(lineTimings: PrayerLineTiming[]): PrayerLine[] {
  return lineTimings.map((timing) => ({
    index: timing.line,
    text: timing.text,
    wordCount: timing.text.split(/\s+/).filter((w) => w.length > 0).length,
    // Whisper timestamps already account for intro, use as-is
    startTimeMs: timing.startMs,
    endTimeMs: timing.endMs,
  }));
}

/**
 * Calculate timing for each line of prayer text based on word count distribution
 *
 * Algorithm:
 * 1. Split content by newlines into lines (filtering empty lines)
 * 2. Count words per line
 * 3. Calculate total words across all lines
 * 4. Distribute audio duration proportionally based on word count
 * 5. Add pause buffer between lines for natural speech rhythm
 *
 * @param prayerContent - Full prayer text with lines separated by \n
 * @param audioDurationMs - Total audio duration in milliseconds
 * @returns Array of PrayerLine objects with timing data
 */
export function calculateLineTiming(
  prayerContent: string,
  audioDurationMs: number
): PrayerLine[] {
  // Split content into lines, trim whitespace, filter empty lines
  const lines = prayerContent
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length === 0) {
    return [];
  }

  // Count words per line (split by whitespace, filter empty strings)
  const lineWordCounts = lines.map(
    (line) => line.split(/\s+/).filter((word) => word.length > 0).length
  );

  // Calculate total words
  const totalWords = lineWordCounts.reduce((sum, count) => sum + count, 0);

  if (totalWords === 0) {
    return [];
  }

  // Calculate effective duration (total minus pauses between lines)
  const totalPauseTime = (lines.length - 1) * LINE_PAUSE_MS;
  const effectiveDuration = Math.max(audioDurationMs - totalPauseTime, 1000);

  // Calculate milliseconds per word
  const msPerWord = effectiveDuration / totalWords;

  // Build timing array (apply AUDIO_OFFSET_MS to compensate for intro/silence)
  let currentTimeMs = AUDIO_OFFSET_MS;
  const prayerLines: PrayerLine[] = lines.map((text, index) => {
    const wordCount = lineWordCounts[index];
    const lineDurationMs = wordCount * msPerWord;
    const startTimeMs = currentTimeMs;
    const endTimeMs = startTimeMs + lineDurationMs;

    // Move current time forward (include pause except after last line)
    currentTimeMs = endTimeMs + (index < lines.length - 1 ? LINE_PAUSE_MS : 0);

    return {
      index,
      text,
      wordCount,
      startTimeMs,
      endTimeMs,
    };
  });

  return prayerLines;
}

/**
 * Find the current line based on playback position
 *
 * @param lines - Array of PrayerLine objects with timing
 * @param positionMs - Current playback position in milliseconds
 * @returns The current line or null if position is outside all lines
 */
function findCurrentLine(
  lines: PrayerLine[],
  positionMs: number
): PrayerLine | null {
  // Find line where position falls within start and end time
  return (
    lines.find(
      (line) => positionMs >= line.startTimeMs && positionMs < line.endTimeMs
    ) || null
  );
}

/**
 * Hook to calculate and track the current prayer line based on audio position
 *
 * @param prayerContent - Full prayer text with lines separated by \n
 * @param audioDurationMs - Total audio duration in milliseconds
 * @param currentPositionMs - Current playback position in milliseconds
 * @param lineTimings - Optional pre-generated line timings from Whisper
 * @returns Current line info, next line, progress, and total lines
 *
 * @example
 * ```tsx
 * const { currentLine, lineProgress, totalLines } = useCurrentPrayerLine(
 *   prayer.content,
 *   progress.duration,
 *   progress.position,
 *   prayer.line_timings  // Use Whisper timings when available
 * );
 *
 * return (
 *   <Text style={styles.prayerText}>
 *     {currentLine?.text || ''}
 *   </Text>
 * );
 * ```
 */
export function useCurrentPrayerLine(
  prayerContent: string,
  audioDurationMs: number,
  currentPositionMs: number,
  lineTimings?: PrayerLineTiming[] | null
): CurrentPrayerLineResult {
  // Parse content lines (source of truth for display text)
  const contentLines = useMemo(
    () => prayerContent.split('\n').map((l) => l.trim()).filter((l) => l.length > 0),
    [prayerContent]
  );

  // Use Whisper timings for timing only, but use content for display text
  const lines = useMemo(() => {
    if (lineTimings && lineTimings.length > 0) {
      console.log('[usePrayerTiming] Using Whisper timings for timing, content for text');
      console.log('[usePrayerTiming] Timings:', lineTimings.length, 'lines, Content:', contentLines.length, 'lines');

      // Use content lines for text, line_timings for timing
      // If counts don't match, fall back to calculated timing
      if (contentLines.length !== lineTimings.length) {
        console.warn('[usePrayerTiming] Line count mismatch! Content:', contentLines.length, 'Timings:', lineTimings.length);
        console.log('[usePrayerTiming] Falling back to calculated timing');
        return calculateLineTiming(prayerContent, audioDurationMs);
      }

      // Whisper timestamps already account for intro silence, so don't add offset
      return lineTimings.map((timing, idx) => ({
        index: timing.line,
        text: contentLines[idx] || timing.text, // Prefer content, fallback to timing text
        wordCount: (contentLines[idx] || timing.text).split(/\s+/).filter((w) => w.length > 0).length,
        startTimeMs: timing.startMs, // Use Whisper timestamp as-is
        endTimeMs: timing.endMs, // Use Whisper timestamp as-is
      }));
    } else {
      console.log('[usePrayerTiming] Using calculated timing (no Whisper data)');
      return calculateLineTiming(prayerContent, audioDurationMs);
    }
  }, [prayerContent, audioDurationMs, lineTimings, contentLines]);

  // Find current line based on position
  const currentLine = findCurrentLine(lines, currentPositionMs);

  // Find next line (for preparation/preview if needed)
  const nextLine = currentLine
    ? lines[currentLine.index + 1] || null
    : lines[0] || null;

  // Calculate progress within current line (0-1)
  const lineProgress = currentLine
    ? Math.min(
        1,
        Math.max(
          0,
          (currentPositionMs - currentLine.startTimeMs) /
            (currentLine.endTimeMs - currentLine.startTimeMs)
        )
      )
    : 0;

  return {
    currentLine,
    nextLine,
    lineProgress,
    totalLines: lines.length,
    currentIndex: currentLine?.index ?? -1,
  };
}

export default useCurrentPrayerLine;
