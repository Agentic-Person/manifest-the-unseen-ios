/**
 * Meditate Screen
 *
 * Main meditation screen showing available meditations and breathing exercises.
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import type { MainTabScreenProps } from '../types/navigation';

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
    backgroundColor: '#F9FAFB',
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
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  placeholder: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 48,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  placeholderEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  placeholderSubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});

export default MeditateScreen;
