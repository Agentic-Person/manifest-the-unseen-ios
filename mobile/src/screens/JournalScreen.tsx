/**
 * Journal Screen
 *
 * Main journal screen showing recent entries with voice recording option.
 * Features:
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
} from 'react-native';
import type { MainTabScreenProps } from '@/types/navigation';
import { colors, spacing, typography, shadows } from '@/theme';
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
      <Text style={styles.emptyEmoji}>📝</Text>
      <Text style={styles.emptyTitle}>No journal entries yet</Text>
      <Text style={styles.emptySubtitle}>
        Tap the + button to create your first entry
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
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Journal</Text>
          <Text style={styles.subtitle}>
            {entries && entries.length > 0
              ? `${entries.length} ${entries.length === 1 ? 'entry' : 'entries'}`
              : 'Capture your thoughts'}
          </Text>
        </View>

        {/* Add Button */}
        <Pressable
          style={({ pressed }) => [
            styles.addButton,
            pressed && styles.addButtonPressed,
          ]}
          onPress={handleNewEntry}
          accessibilityRole="button"
          accessibilityLabel="Create new journal entry"
        >
          <Text style={styles.addButtonText}>+</Text>
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

      {/* Floating Action Button (alternative to header button) */}
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
          <Text style={styles.fabText}>+</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.default,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: typography.body.fontSize,
    color: colors.text.secondary,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary[600],
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  addButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },
  addButtonText: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.white,
    lineHeight: 28,
  },
  listContent: {
    padding: spacing.md,
    paddingBottom: spacing.xl * 2, // Extra space for FAB
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl * 2,
    paddingHorizontal: spacing.lg,
  },
  emptyEmoji: {
    fontSize: 72,
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
  fab: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.md,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary[600],
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
