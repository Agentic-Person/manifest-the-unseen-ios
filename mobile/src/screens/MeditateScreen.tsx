/**
 * Meditate Screen
 *
 * Main meditation hub showing guided meditations, breathing exercises,
 * and ambient music with tab-based navigation.
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MeditateStackParamList } from '../types/navigation';
import { colors, spacing, shadows, borderRadius } from '../theme';
import {
  useGuidedMeditations,
  useBreathingExercises,
  useMeditationMusic,
  useMeditationStats,
} from '../hooks/useMeditation';
import { MeditationCard } from '../components/meditation/MeditationCard';
import { Loading } from '../components/Loading';
import type { Meditation } from '../types/meditation';
import { useSettingsStore } from '../stores/settingsStore';

type MeditateNavProp = NativeStackNavigationProp<MeditateStackParamList>;

type TabType = 'guided' | 'breathing' | 'music';

interface TabConfig {
  key: TabType;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const TABS: TabConfig[] = [
  { key: 'guided', label: 'Meditations', icon: 'person-outline' },
  { key: 'breathing', label: 'Breathing', icon: 'leaf-outline' },
  { key: 'music', label: 'Music', icon: 'musical-notes-outline' },
];

/**
 * Meditate Screen Component
 */
const MeditateScreen = () => {
  const navigation = useNavigation<MeditateNavProp>();
  const [activeTab, setActiveTab] = useState<TabType>('guided');
  const [refreshing, setRefreshing] = useState(false);

  // Get preferred narrator from settings
  const preferredNarrator = useSettingsStore((state) => state.preferredNarrator);

  // Fetch data for each tab
  const {
    data: guidedMeditations,
    isLoading: isLoadingGuided,
    refetch: refetchGuided,
  } = useGuidedMeditations(preferredNarrator || undefined);

  const {
    data: breathingExercises,
    isLoading: isLoadingBreathing,
    refetch: refetchBreathing,
  } = useBreathingExercises();

  const {
    data: musicTracks,
    isLoading: isLoadingMusic,
    refetch: refetchMusic,
  } = useMeditationMusic();

  // User stats
  const { data: stats } = useMeditationStats();

  /**
   * Handle refresh
   */
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refetchGuided(), refetchBreathing(), refetchMusic()]);
    setRefreshing(false);
  }, [refetchGuided, refetchBreathing, refetchMusic]);

  /**
   * Handle meditation press
   */
  const handleMeditationPress = useCallback(
    (meditation: Meditation) => {
      navigation.navigate('MeditationPlayer', {
        meditationId: meditation.id,
        title: meditation.title,
        duration: meditation.duration_seconds,
      });
    },
    [navigation]
  );

  /**
   * Get current tab data
   */
  const getCurrentData = (): Meditation[] => {
    switch (activeTab) {
      case 'guided':
        return guidedMeditations || [];
      case 'breathing':
        return breathingExercises || [];
      case 'music':
        return musicTracks || [];
    }
  };

  /**
   * Get current loading state
   */
  const isLoading = () => {
    switch (activeTab) {
      case 'guided':
        return isLoadingGuided;
      case 'breathing':
        return isLoadingBreathing;
      case 'music':
        return isLoadingMusic;
    }
  };

  /**
   * Get empty state message
   */
  const getEmptyMessage = () => {
    switch (activeTab) {
      case 'guided':
        return 'No guided meditations available yet';
      case 'breathing':
        return 'No breathing exercises available yet';
      case 'music':
        return 'No meditation music available yet';
    }
  };

  const currentData = getCurrentData();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Meditate</Text>
        <Text style={styles.subtitle}>
          Find peace and clarity through practice
        </Text>
      </View>

      {/* Stats Banner */}
      {stats && stats.sessionCount > 0 && (
        <View style={styles.statsBanner}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.sessionCount}</Text>
            <Text style={styles.statLabel}>Sessions</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.totalMinutes}</Text>
            <Text style={styles.statLabel}>Minutes</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <View style={styles.streakContainer}>
              <Ionicons name="flame" size={16} color={colors.dark.accentGold} />
              <Text style={styles.statValue}>{stats.currentStreak}</Text>
            </View>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
        </View>
      )}

      {/* Tab Bar */}
      <View style={styles.tabBar}>
        {TABS.map((tab) => (
          <Pressable
            key={tab.key}
            style={[
              styles.tab,
              activeTab === tab.key && styles.tabActive,
            ]}
            onPress={() => setActiveTab(tab.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected: activeTab === tab.key }}
          >
            <Ionicons
              name={tab.icon}
              size={20}
              color={activeTab === tab.key ? colors.dark.accentGold : colors.text.tertiary}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === tab.key && styles.tabTextActive,
              ]}
            >
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Content */}
      {isLoading() ? (
        <Loading accessibilityLabel="Loading meditations" />
      ) : currentData.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons
            name={TABS.find((t) => t.key === activeTab)?.icon || 'ellipse-outline'}
            size={48}
            color={colors.text.tertiary}
          />
          <Text style={styles.emptyText}>{getEmptyMessage()}</Text>
        </View>
      ) : (
        <FlatList
          data={currentData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MeditationCard
              meditation={item}
              onPress={handleMeditationPress}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.dark.accentGold}
            />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
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
  statsBanner: {
    flexDirection: 'row',
    backgroundColor: colors.background.elevated,
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.text.tertiary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border.default,
    marginHorizontal: spacing.sm,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.xs,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background.elevated,
    gap: spacing.xs,
  },
  tabActive: {
    backgroundColor: `${colors.dark.accentGold}20`,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.text.tertiary,
  },
  tabTextActive: {
    color: colors.dark.accentGold,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});

export default MeditateScreen;
