/**
 * Prayer Time Picker Component
 *
 * Allows users to add, remove, and manage multiple prayer reminder times.
 */

import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextStyle } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors, spacing } from '../../theme';
import { useFontSizeContext } from '../../contexts/FontSizeContext';

interface PrayerTimePickerProps {
  times: string[];
  onTimesChange: (times: string[]) => void;
  disabled?: boolean;
  maxTimes?: number;
}

/**
 * Format time string for display (HH:mm -> h:mm AM/PM)
 */
const formatTimeDisplay = (timeString: string): string => {
  const [hours, minutes] = timeString.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
};

/**
 * Parse time string to Date
 */
const parseTimeToDate = (timeString: string): Date => {
  const now = new Date();
  const [hours, minutes] = timeString.split(':').map(Number);
  now.setHours(hours, minutes, 0, 0);
  return now;
};

/**
 * Format Date to time string (HH:mm)
 */
const formatTimeString = (date: Date): string => {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

/**
 * Prayer Time Picker Component
 *
 * @example
 * ```tsx
 * <PrayerTimePicker
 *   times={['08:00', '12:00', '18:00']}
 *   onTimesChange={(times) => setSpokenPrayer(true, times)}
 *   maxTimes={6}
 * />
 * ```
 */
export const PrayerTimePicker: React.FC<PrayerTimePickerProps> = ({
  times,
  onTimesChange,
  disabled = false,
  maxTimes = 6,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const { scaleFont } = useFontSizeContext();

  const scaledStyles = useMemo(
    () => ({
      timeText: {
        ...styles.timeText,
        fontSize: scaleFont(15),
      } as TextStyle,
      removeText: {
        ...styles.removeText,
        fontSize: scaleFont(18),
      } as TextStyle,
      addText: {
        ...styles.addText,
        fontSize: scaleFont(14),
      } as TextStyle,
      noteText: {
        ...styles.noteText,
        fontSize: scaleFont(12),
      } as TextStyle,
    }),
    [scaleFont]
  );

  const handleAddTime = () => {
    if (times.length >= maxTimes) {
      return;
    }
    setEditingIndex(null);
    setShowPicker(true);
  };

  const handleEditTime = (index: number) => {
    if (disabled) {
      return;
    }
    setEditingIndex(index);
    setShowPicker(true);
  };

  const handleRemoveTime = (index: number) => {
    if (disabled) {
      return;
    }
    const newTimes = times.filter((_, i) => i !== index);
    onTimesChange(newTimes);
  };

  const handleTimeChange = (event: any, date?: Date) => {
    setShowPicker(false);
    if (date && event.type !== 'dismissed') {
      const timeString = formatTimeString(date);

      if (editingIndex !== null) {
        // Editing existing time
        const newTimes = [...times];
        newTimes[editingIndex] = timeString;
        // Sort times chronologically
        newTimes.sort((a, b) => {
          const [aH, aM] = a.split(':').map(Number);
          const [bH, bM] = b.split(':').map(Number);
          return aH * 60 + aM - (bH * 60 + bM);
        });
        onTimesChange(newTimes);
      } else {
        // Adding new time
        const newTimes = [...times, timeString];
        // Sort times chronologically
        newTimes.sort((a, b) => {
          const [aH, aM] = a.split(':').map(Number);
          const [bH, bM] = b.split(':').map(Number);
          return aH * 60 + aM - (bH * 60 + bM);
        });
        onTimesChange(newTimes);
      }
    }
    setEditingIndex(null);
  };

  const currentPickerValue =
    editingIndex !== null ? parseTimeToDate(times[editingIndex]) : new Date();

  return (
    <View style={[styles.container, disabled && styles.disabled]}>
      {/* Time List */}
      {times.map((time, index) => (
        <View key={`${time}-${index}`} style={styles.timeRow}>
          <TouchableOpacity
            style={styles.timeButton}
            onPress={() => handleEditTime(index)}
            disabled={disabled}
            activeOpacity={0.7}
          >
            <Text style={scaledStyles.timeText}>{formatTimeDisplay(time)}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => handleRemoveTime(index)}
            disabled={disabled}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={scaledStyles.removeText}>×</Text>
          </TouchableOpacity>
        </View>
      ))}

      {/* Add Time Button */}
      {times.length < maxTimes && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddTime}
          disabled={disabled}
          activeOpacity={0.7}
        >
          <Text style={scaledStyles.addText}>+ Add Time</Text>
        </TouchableOpacity>
      )}

      {/* Note */}
      <Text style={scaledStyles.noteText}>
        Tap a time to edit. Maximum {maxTimes} reminder times.
      </Text>

      {/* Time Picker */}
      {showPicker && (
        <DateTimePicker
          value={currentPickerValue}
          mode="time"
          is24Hour={false}
          display="spinner"
          onChange={handleTimeChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  disabled: {
    opacity: 0.5,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background.primary,
    borderRadius: 8,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xs,
  },
  timeButton: {
    flex: 1,
  },
  timeText: {
    fontSize: 15,
    color: colors.text.primary,
    fontWeight: '500',
  },
  removeButton: {
    padding: spacing.xs,
  },
  removeText: {
    fontSize: 18,
    color: colors.error[500],
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: colors.primary[500],
    borderRadius: 8,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  addText: {
    fontSize: 14,
    color: colors.white,
    fontWeight: '600',
  },
  noteText: {
    fontSize: 12,
    color: colors.text.tertiary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});

export default PrayerTimePicker;
