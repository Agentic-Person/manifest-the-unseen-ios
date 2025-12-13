/**
 * Manuscript Screen
 *
 * Placeholder screen for the "Manifest the Unseen" manuscript content.
 * This screen will eventually contain the full book/manuscript for reading.
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { colors, spacing, borderRadius } from '../theme';
import { fontFamilies } from '../theme/typography';

type Props = NativeStackScreenProps<RootStackParamList, 'Manuscript'>;

/**
 * Manuscript Screen Component
 */
const ManuscriptScreen = ({ navigation }: Props) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header with back button */}
      <View style={styles.header}>
        <Pressable
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.backButtonPressed,
          ]}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Manifest the Unseen</Text>
        <Text style={styles.subtitle}>Manuscript</Text>

        <View style={styles.comingSoonCard}>
          <Text style={styles.comingSoonText}>Coming Soon</Text>
          <Text style={styles.descriptionText}>
            The complete manuscript of "Manifest the Unseen" will be available here for reading and study.
          </Text>
        </View>
      </View>
    </View>
  );
};

/**
 * Styles
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0F',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  backButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  backButtonPressed: {
    opacity: 0.7,
  },
  backButtonText: {
    color: colors.text.golden,
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  title: {
    fontFamily: fontFamilies.primary,
    fontSize: 28,
    fontWeight: '400',
    color: '#E8D5A3',
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontFamily: fontFamilies.primary,
    fontSize: 20,
    fontWeight: '400',
    color: colors.text.golden,
    letterSpacing: 4,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  comingSoonCard: {
    backgroundColor: 'rgba(10, 10, 15, 0.8)',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(196, 160, 82, 0.3)',
    alignItems: 'center',
    maxWidth: 300,
  },
  comingSoonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.golden,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: spacing.sm,
  },
  descriptionText: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default ManuscriptScreen;
