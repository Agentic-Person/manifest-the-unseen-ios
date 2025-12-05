/**
 * Journal Screen
 *
 * Main journal screen showing recent entries with voice recording option.
 * Features:
 * - Beautiful header with journal image (matching workbook style)
 * - List of journal entries with preview
 * - Pull-to-refresh
 * - Empty state
 * - Navigate to new entry screen
 * - Delete entries with confirmation
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import type { MainTabScreenProps } from '@/types/navigation';
import { colors, spacing, typography, shadows, borderRadius } from '@/theme';
import { BackgroundImages } from '@/assets';
import {
  useJournalEntries,
  useDeleteJournalEntry,
} from '@/hooks';
import { JournalEntryCard } from '@/components/journal';
import type { JournalEntry } from '@/types';
import * as Haptics from 'expo-haptics';

type Props = MainTabScreenProps<'Journal'>;

/**
 * Journal Screen Component
 */
const JournalScreen = ({ navigation }: Props) => {
  const { data: entries, isLoading, refetch } = useJournalEntries();
  const deleteEntry = useDeleteJournalEntry();

  // Navigate to new entry screen
  const handleNewEntry = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate('NewJournalEntry' as any);
  };

  // Handle entry tap (for now, just provide feedback - can implement detail view later)
  const handleEntryPress = async (entry: JournalEntry) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // TODO: Navigate to detail view or expand inline
    console.log('Entry tapped:', entry.id);
  };

  // Handle delete with confirmation
  const handleDelete = async (id: string) => {
    try {
      await deleteEntry.mutateAsync(id);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Failed to delete entry:', error);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  // Empty state component
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Image
        source={BackgroundImages.scroll}
        style={styles.emptyImage}
        resizeMode="contain"
      />
      <Text style={styles.emptyTitle}>No journal entries yet</Text>
      <Text style={styles.emptySubtitle}>
        Tap the button above to create your first entry
      </Text>
      <Text style={styles.emptyHint}>
        Use voice recording or type your thoughts
      </Text>
    </View>
  );

  // Loading state
  if (isLoading && !entries) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
        <Text style={styles.loadingText}>Loading your journal...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Beautiful Header with Journal Image */}
      <View style={styles.headerSection}>
        {/* Image Container with Golden Border */}
        <View style={styles.headerImageContainer}>
          <Image
            source={BackgroundImages.journal}
            style={styles.headerImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(10, 10, 15, 0.9)']}
            style={styles.headerGradient}
          />
        </View>

        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Journal</Text>
          <Text style={styles.subtitle}>
            {entries && entries.length > 0
              ? `${entries.length} ${entries.length === 1 ? 'entry' : 'entries'} written`
              : 'Capture your thoughts and reflections'}
          </Text>
        </View>

        {/* Add New Entry Button */}
        <Pressable
          style={({ pressed }) => [
            styles.newEntryButton,
            pressed && styles.newEntryButtonPressed,
          ]}
          onPress={handleNewEntry}
          accessibilityRole="button"
          accessibilityLabel="Create new journal entry"
        >
          <Ionicons name="add" size={20} color={colors.white} />
          <Text style={styles.newEntryButtonText}>Add New Entry</Text>
        </Pressable>
      </View>

      {/* Journal Entries List */}
      <FlatList
        data={entries || []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <JournalEntryCard
            entry={item}
            onPress={() => handleEntryPress(item)}
            onDelete={() => handleDelete(item.id)}
          />
        )}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshing={isLoading}
        onRefresh={refetch}
      />

      {/* Floating Action Button (visible when scrolling through entries) */}
      {entries && entries.length > 0 && (
        <Pressable
          style={({ pressed }) => [
            styles.fab,
            pressed && styles.fabPressed,
          ]}
          onPress={handleNewEntry}
          accessibilityRole="button"
          accessibilityLabel="Create new journal entry"
        >
          <Ionicons name="add" size={28} color={colors.white} />
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: typography.body.fontSize,
    color: colors.text.secondary,
    marginTop: spacing.md,
  },

  // New Header Section
  headerSection: {
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  headerImageContainer: {
    width: '100%',
    height: 180,
    borderRadius: borderRadius.xl,
    borderWidth: 2,
    borderColor: colors.brand.gold,
    overflow: 'hidden',
    marginBottom: spacing.md,
    ...shadows.md,
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  headerGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: colors.text.secondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  newEntryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.brand.gold,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.full,
    gap: spacing.xs,
    ...shadows.md,
  },
  newEntryButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  newEntryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },

  // List Content
  listContent: {
    padding: spacing.md,
    paddingBottom: spacing.xl * 2,
  },

  // Empty State
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  emptyImage: {
    width: 140,
    height: 140,
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: typography.body.fontSize,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptyHint: {
    fontSize: typography.caption.fontSize,
    color: colors.text.tertiary,
    textAlign: 'center',
  },

  // Floating Action Button (kept as secondary option)
  fab: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.md,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.brand.gold,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
  },
  fabPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },
  fabText: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.white,
    lineHeight: 32,
  },
});

export default JournalScreen;
