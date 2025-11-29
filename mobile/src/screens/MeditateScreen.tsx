/**
 * Meditate Screen
 *
 * Main meditation screen showing available meditations and breathing exercises.
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import type { MainTabScreenProps } from '../types/navigation';
import { colors } from '../theme';

type Props = MainTabScreenProps<'Meditate'>;

/**
 * Meditate Screen Component
 */
const MeditateScreen = (_props: Props) => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Meditate</Text>
        <Text style={styles.subtitle}>
          Find peace and clarity through guided meditation
        </Text>
      </View>

      <View style={styles.placeholder}>
        <Text style={styles.placeholderEmoji}>🧘</Text>
        <Text style={styles.placeholderText}>Meditation Player Coming Soon</Text>
        <Text style={styles.placeholderSubtext}>
          Guided meditations with male and female narrators
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  placeholder: {
    backgroundColor: colors.background.elevated,
    borderRadius: 12,
    padding: 48,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  placeholderEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
  },
  placeholderSubtext: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
  },
});

export default MeditateScreen;
