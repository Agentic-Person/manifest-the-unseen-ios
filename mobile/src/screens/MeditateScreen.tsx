/**
 * Meditate Screen
 *
 * Main meditation hub showing guided meditations, breathing exercises,
 * and ambient music with tab-based navigation.
 *
 * Design matches the workbook exercise cards with golden borders and full-width images.
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  RefreshControl,
  ImageSourcePropType,
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
import { usePrayersWithAudio } from '../hooks/usePrayer';
import type { Prayer } from '../types/guru';
import { MeditationCard } from '../components/meditation/MeditationCard';
import { Loading } from '../components/Loading';
import type { Meditation } from '../types/meditation';
import { useSettingsStore } from '../stores/settingsStore';
import {
  GuidedMeditationImages,
  BreathingImages,
  InstrumentalImages,
} from '../assets';
import { useEffectiveAccess } from '../hooks/useSubscription';
import { UpgradePrompt } from '../components/UpgradePrompt';
import { TIER_PRICING } from '../types/subscription';

type MeditateNavProp = NativeStackNavigationProp<MeditateStackParamList>;

type TabType = 'guided' | 'breathing' | 'music' | 'prayers';

interface TabConfig {
  key: TabType;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const TABS: TabConfig[] = [
  { key: 'guided', label: 'Meditations', icon: 'person-outline' },
  { key: 'breathing', label: 'Breathing', icon: 'leaf-outline' },
  { key: 'music', label: 'Music', icon: 'musical-notes-outline' },
  { key: 'prayers', label: 'Prayers', icon: 'sparkles-outline' },
];

// Image arrays for each category (ordered to match content)
const GUIDED_IMAGES = [
  GuidedMeditationImages.morningAwakening,
  GuidedMeditationImages.mindBody,
  GuidedMeditationImages.innerPeace,
];

const BREATHING_IMAGES = [
  BreathingImages.boxBreathing,
  BreathingImages.deepCalm,
  BreathingImages.energyBoost,
];

const INSTRUMENTAL_IMAGES = [
  InstrumentalImages.track01,
  InstrumentalImages.track02,
  InstrumentalImages.track03,
  InstrumentalImages.track04,
  InstrumentalImages.track05,
  InstrumentalImages.track06,
  InstrumentalImages.track07,
  InstrumentalImages.track08,
  InstrumentalImages.track09,
  InstrumentalImages.track10,
  InstrumentalImages.track11,
  InstrumentalImages.track12,
  InstrumentalImages.track13,
];

/**
 * Get image for a meditation based on type and index
 */
const getMeditationImage = (
  type: TabType,
  index: number
): ImageSourcePropType | undefined => {
  switch (type) {
    case 'guided':
      return GUIDED_IMAGES[index % GUIDED_IMAGES.length];
    case 'breathing':
      return BREATHING_IMAGES[index % BREATHING_IMAGES.length];
    case 'music':
      return INSTRUMENTAL_IMAGES[index % INSTRUMENTAL_IMAGES.length];
    case 'prayers':
      // Prayers use text display instead of images
      return undefined;
    default:
      return undefined;
  }
};

/**
 * Meditate Screen Component
 */
const MeditateScreen = () => {
  const navigation = useNavigation<MeditateNavProp>();
  const [activeTab, setActiveTab] = useState<TabType>('guided');
  const [refreshing, setRefreshing] = useState(false);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);

  // Get preferred narrator from settings
  const preferredNarrator = useSettingsStore((state) => state.preferredNarrator);

  // Subscription access (combines trial + subscription)
  const { effectiveTier, isTrialUser, maxMeditations } = useEffectiveAccess();

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

  // Prayers with audio
  const {
    data: prayers,
    isLoading: isLoadingPrayers,
    refetch: refetchPrayers,
  } = usePrayersWithAudio();

  // User stats
  const { data: stats } = useMeditationStats();

  /**
   * Handle refresh
   */
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refetchGuided(), refetchBreathing(), refetchMusic(), refetchPrayers()]);
    setRefreshing(false);
  }, [refetchGuided, refetchBreathing, refetchMusic, refetchPrayers]);

  /**
   * Check if meditation is accessible based on subscription
   * Trial users and any subscriber have access to meditations
   */
  const isMeditationAccessible = useCallback(
    (): boolean => {
      // Trial users have full access
      if (isTrialUser) return true;
      // Paid subscribers have access based on tier
      return effectiveTier !== 'free';
    },
    [effectiveTier, isTrialUser]
  );

  /**
   * Get required tier for locked meditation
   * Simplified: All meditations unlocked with Novice
   */
  const getRequiredTier = useCallback(
    (): 'novice' | 'enlightenment' => {
      return 'novice';
    },
    []
  );

  /**
   * Handle meditation press
   */
  const handleMeditationPress = useCallback(
    (meditation: Meditation, index: number) => {
      // Check subscription access - any subscription gives full access
      if (!isMeditationAccessible()) {
        setShowUpgradePrompt(true);
        return;
      }

      navigation.navigate('MeditationPlayer', {
        meditationId: meditation.id,
        title: meditation.title,
        duration: meditation.duration_seconds,
        imageIndex: index,
        meditationType: activeTab as 'guided' | 'breathing' | 'music',
      });
    },
    [navigation, activeTab, isMeditationAccessible]
  );

  /**
   * Handle prayer press
   */
  const handlePrayerPress = useCallback(
    (prayer: Prayer) => {
      // Check subscription access
      if (!isMeditationAccessible()) {
        setShowUpgradePrompt(true);
        return;
      }

      // Prayers require audio_url to play
      if (!prayer.audio_url) {
        return;
      }

      navigation.navigate('MeditationPlayer', {
        meditationId: prayer.id,
        title: prayer.title,
        duration: prayer.duration_seconds,
        meditationType: 'prayer',
        prayerContent: prayer.content,
      });
    },
    [navigation, isMeditationAccessible]
  );

  /**
   * Get current tab data (meditations only - prayers handled separately)
   */
  const getCurrentData = (): Meditation[] => {
    switch (activeTab) {
      case 'guided':
        return guidedMeditations || [];
      case 'breathing':
        return breathingExercises || [];
      case 'music':
        return musicTracks || [];
      case 'prayers':
        return []; // Prayers handled separately
      default:
        return [];
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
      case 'prayers':
        return isLoadingPrayers;
      default:
        return false;
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
      case 'prayers':
        return 'No prayers with audio available yet';
      default:
        return 'No content available';
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
      ) : activeTab === 'prayers' ? (
        // Prayers tab - uses Prayer type instead of Meditation
        (prayers?.length || 0) === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="sparkles-outline" size={48} color={colors.text.tertiary} />
            <Text style={styles.emptyText}>{getEmptyMessage()}</Text>
          </View>
        ) : (
          <FlatList
            data={prayers}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Pressable
                style={styles.prayerCard}
                onPress={() => handlePrayerPress(item)}
                accessibilityLabel={`Play ${item.title}`}
              >
                <View style={styles.prayerIconContainer}>
                  <Ionicons name="sparkles" size={32} color={colors.brand.gold} />
                </View>
                <View style={styles.prayerContent}>
                  <Text style={styles.prayerTitle}>{item.title}</Text>
                  <Text style={styles.prayerDescription} numberOfLines={2}>
                    {item.description}
                  </Text>
                  <View style={styles.prayerMeta}>
                    <Ionicons name="time-outline" size={14} color={colors.text.tertiary} />
                    <Text style={styles.prayerDuration}>
                      {Math.ceil(item.duration_seconds / 60)} min
                    </Text>
                  </View>
                </View>
                <Ionicons name="play-circle" size={36} color={colors.brand.gold} />
              </Pressable>
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
        )
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
          renderItem={({ item, index }) => (
            <MeditationCard
              meditation={item}
              onPress={(meditation) => handleMeditationPress(meditation, index)}
              image={getMeditationImage(activeTab, index)}
              index={index}
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

      {/* Upgrade Prompt Modal */}
      <UpgradePrompt
        visible={showUpgradePrompt}
        onClose={() => setShowUpgradePrompt(false)}
        title="Unlock Meditations"
        description="Subscribe to access all guided meditations, breathing exercises, and ambient music for your practice."
        requiredTier={getRequiredTier()}
        benefits={TIER_PRICING[getRequiredTier()].features}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary, // Deep Void (#0A0A0F)
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text.primary, // Enlightened White (#F5F0E6)
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary, // Muted Wisdom (#A09080)
    fontStyle: 'italic',
  },
  statsBanner: {
    flexDirection: 'row',
    backgroundColor: colors.background.elevated, // Temple Stone (#1A1A24)
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border.default, // Subtle gold border
    ...shadows.sm,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.dark.accentGold, // Aged Gold (#C4A052)
  },
  statLabel: {
    fontSize: 12,
    color: colors.text.tertiary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border.gold, // Stronger gold divider
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
    backgroundColor: colors.background.elevated, // Temple Stone (#1A1A24)
    borderWidth: 1,
    borderColor: colors.border.disabled, // Very subtle border
    gap: spacing.xs,
  },
  tabActive: {
    backgroundColor: `${colors.dark.accentGold}20`, // Gold tint
    borderColor: colors.dark.accentGold, // Aged Gold border (#C4A052)
  },
  tabText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.text.tertiary,
  },
  tabTextActive: {
    color: colors.dark.accentGold, // Aged Gold (#C4A052)
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
    color: colors.text.secondary, // Muted Wisdom (#A09080)
    textAlign: 'center',
    marginTop: spacing.md,
    fontStyle: 'italic',
  },
  // Prayer card styles
  prayerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.elevated, // Temple Stone (#1A1A24)
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border.default,
    padding: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.md,
    ...shadows.sm,
  },
  prayerIconContainer: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.md,
    backgroundColor: `${colors.brand.gold}15`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  prayerContent: {
    flex: 1,
  },
  prayerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  prayerDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
    marginBottom: 8,
  },
  prayerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  prayerDuration: {
    fontSize: 12,
    color: colors.text.tertiary,
  },
});

export default MeditateScreen;
