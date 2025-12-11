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
import { MeditationCard } from '../components/meditation/MeditationCard';
import { Loading } from '../components/Loading';
import type { Meditation } from '../types/meditation';
import { useSettingsStore } from '../stores/settingsStore';
import {
  GuidedMeditationImages,
  BreathingImages,
  InstrumentalImages,
} from '../assets';
import { useFeatureAccess } from '../hooks/useSubscription';
import { UpgradePrompt } from '../components/UpgradePrompt';
import { TIER_PRICING } from '../types/subscription';

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

  // Subscription access - simplified: tier is all we need
  const { tier } = useFeatureAccess();

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
   * Check if meditation is accessible based on subscription
   * Simplified: Any subscriber (Novice or Enlightenment) has access to all meditations
   */
  const isMeditationAccessible = useCallback(
    (): boolean => {
      // Free tier has no meditation access
      // Both Novice and Enlightenment have full access
      return tier !== 'free';
    },
    [tier]
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
        meditationType: activeTab,
      });
    },
    [navigation, activeTab, isMeditationAccessible]
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
});

export default MeditateScreen;
