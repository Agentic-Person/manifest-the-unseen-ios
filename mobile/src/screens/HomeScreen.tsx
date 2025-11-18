/**
 * Home Screen
 *
 * Main dashboard showing user progress, daily inspiration, and quick actions.
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import type { MainTabScreenProps } from '../types/navigation';
import { useUser } from '../stores/authStore';
import { useUserProfile } from '../hooks/useUser';

type Props = MainTabScreenProps<'Home'>;

/**
 * Home Screen Component
 */
const HomeScreen = ({ navigation }: Props) => {
  const user = useUser();
  const { data: profile, isLoading } = useUserProfile();

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome back!</Text>
        {user && (
          <Text style={styles.userName}>{user.email}</Text>
        )}
      </View>

      {/* Subscription Tier Badge */}
      {profile && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Subscription</Text>
          <Text style={styles.tier}>
            {profile.subscriptionTier.charAt(0).toUpperCase() +
             profile.subscriptionTier.slice(1)} Path
          </Text>
          <Text style={styles.status}>{profile.subscriptionStatus}</Text>
        </View>
      )}

      {/* Current Phase */}
      {profile && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Current Phase</Text>
          <Text style={styles.phaseNumber}>Phase {profile.currentPhase}</Text>
          <Text style={styles.phaseDescription}>
            {getPhaseDescription(profile.currentPhase)}
          </Text>
        </View>
      )}

      {/* Daily Inspiration */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Daily Inspiration</Text>
        <Text style={styles.quote}>
          "The energy you put out is the energy you get back. Stay positive."
        </Text>
        <Text style={styles.quoteAuthor}>- Manifest the Unseen</Text>
      </View>

      {/* Quick Actions */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Quick Actions</Text>
        <Text style={styles.action} onPress={() => navigation.navigate('Journal')}>
          📝 Start Journal Entry
        </Text>
        <Text style={styles.action} onPress={() => navigation.navigate('Meditate')}>
          🧘 Begin Meditation
        </Text>
        <Text style={styles.action} onPress={() => navigation.navigate('Workbook')}>
          📖 Continue Workbook
        </Text>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Journal Entries</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Meditations</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Days Streak</Text>
        </View>
      </View>
    </ScrollView>
  );
};

/**
 * Helper: Get Phase Description
 */
const getPhaseDescription = (phase: number): string => {
  const descriptions: Record<number, string> = {
    1: 'Self-Evaluation',
    2: 'Values & Vision',
    3: 'Goal Setting',
    4: 'Facing Fears & Limiting Beliefs',
    5: 'Cultivating Self-Love & Self-Care',
    6: 'Manifestation Techniques',
    7: 'Practicing Gratitude',
    8: 'Turning Envy Into Inspiration',
    9: 'Trust & Surrender',
    10: 'Trust & Letting Go',
  };
  return descriptions[phase] || 'Unknown Phase';
};

/**
 * Styles
 */
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
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    color: '#6B7280',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tier: {
    fontSize: 24,
    fontWeight: '700',
    color: '#8B5CF6',
    marginBottom: 4,
  },
  status: {
    fontSize: 14,
    color: '#10B981',
    textTransform: 'capitalize',
  },
  phaseNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: '#8B5CF6',
    marginBottom: 4,
  },
  phaseDescription: {
    fontSize: 16,
    color: '#4B5563',
  },
  quote: {
    fontSize: 18,
    fontStyle: 'italic',
    color: '#374151',
    marginBottom: 8,
    lineHeight: 28,
  },
  quoteAuthor: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'right',
  },
  action: {
    fontSize: 16,
    color: '#8B5CF6',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: '#8B5CF6',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    color: '#374151',
  },
});

export default HomeScreen;
