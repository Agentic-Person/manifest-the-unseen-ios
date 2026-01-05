/**
 * Prayer Timing Hook
 *
 * Calculates synchronized line timing for prayer text display.
 * Lines are timed proportionally based on word count relative to audio duration.
 */

import { useMemo } from 'react';

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

  // Build timing array
  let currentTimeMs = 0;
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
 * @returns Current line info, next line, progress, and total lines
 *
 * @example
 * ```tsx
 * const { currentLine, lineProgress, totalLines } = useCurrentPrayerLine(
 *   prayer.content,
 *   progress.duration,
 *   progress.position
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
  currentPositionMs: number
): CurrentPrayerLineResult {
  // Memoize line timing calculation (only recalculates if content or duration changes)
  const lines = useMemo(
    () => calculateLineTiming(prayerContent, audioDurationMs),
    [prayerContent, audioDurationMs]
  );

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
