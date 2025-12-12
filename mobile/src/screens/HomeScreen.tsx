/**
 * Home Screen
 *
 * Landing page with "Manifest the Unseen" title,
 * navigation buttons, and daily inspiration.
 * Features mystical forest background.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ImageBackground,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { MainTabScreenProps } from '../types/navigation';
import { colors, spacing, borderRadius } from '../theme';
import { fontFamilies } from '../theme/typography';
import { BackgroundImages } from '../assets';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

type Props = MainTabScreenProps<'Home'>;

/**
 * Home Screen Component
 */
const HomeScreen = ({ navigation }: Props) => {
  const insets = useSafeAreaInsets();

  /**
   * Handle button press - navigate to the selected section
   */
  const handleNavPress = (route: 'Workbook' | 'Meditate') => {
    navigation.navigate(route);
  };

  /**
   * Handle navigation to root stack screens (Manuscript, ObservableScience)
   */
  const handleRootNavPress = (route: 'Manuscript' | 'ObservableScience') => {
    navigation.navigate(route);
  };

  // Calculate spacer height to position Row 1 buttons just above bottom tab bar
  // Title area (~120px) + spacer + Row 1 buttons (~120px) + bottom margin (~70px + insets)
  // Should equal screen height minus tab bar
  const TAB_BAR_HEIGHT = 70;
  const TITLE_AREA_HEIGHT = 120;
  const NAV_CARDS_HEIGHT = 120;
  const BOTTOM_MARGIN = 70 + insets.bottom;
  const spacerHeight = SCREEN_HEIGHT - TITLE_AREA_HEIGHT - NAV_CARDS_HEIGHT - BOTTOM_MARGIN - TAB_BAR_HEIGHT - insets.top;

  return (
    <ImageBackground
      source={BackgroundImages.mysticalForest}
      style={styles.container}
      resizeMode="contain"
      imageStyle={styles.backgroundImage}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Title Section - "MANIFEST THE UNSEEN" in 3 rows */}
        <View style={styles.titleContainer}>
          <Text style={styles.titleLine}>MANIFEST</Text>
          <Text style={styles.titleLine}>THE</Text>
          <Text style={styles.titleLine}>UNSEEN</Text>
        </View>

        {/* Spacer to show monk image - fills screen to push Row 1 to bottom */}
        <View style={{ height: Math.max(spacerHeight, 200) }} />

        {/* Row 1: Navigation Cards - Workbook & Meditate (visible above fold) */}
        <View style={styles.navCardsContainer}>
          {/* Workbook Card */}
          <Pressable
            style={({ pressed }) => [
              styles.navCard,
              pressed && styles.navCardPressed,
            ]}
            onPress={() => handleNavPress('Workbook')}
            accessibilityRole="button"
            accessibilityLabel="Go to Workbook"
          >
            <Image
              source={BackgroundImages.workbook2}
              style={styles.navCardImage}
              resizeMode="cover"
            />
            <View style={styles.navCardContent}>
              <Text style={styles.navCardTitle}>Workbook</Text>
              <Text style={styles.navCardSubtitle}>Your transformation journey</Text>
            </View>
          </Pressable>

          {/* Meditate Card */}
          <Pressable
            style={({ pressed }) => [
              styles.navCard,
              pressed && styles.navCardPressed,
            ]}
            onPress={() => handleNavPress('Meditate')}
            accessibilityRole="button"
            accessibilityLabel="Go to Meditate"
          >
            <Image
              source={BackgroundImages.meditate}
              style={styles.navCardImage}
              resizeMode="cover"
            />
            <View style={styles.navCardContent}>
              <Text style={styles.navCardTitle}>Meditate</Text>
              <Text style={styles.navCardSubtitle}>Find peace and clarity</Text>
            </View>
          </Pressable>
        </View>

        {/* Row 2: Navigation Cards - Manuscript & Observable Science (scroll to see) */}
        <View style={styles.navCardsContainer}>
          {/* Manuscript Card */}
          <Pressable
            style={({ pressed }) => [
              styles.navCard,
              pressed && styles.navCardPressed,
            ]}
            onPress={() => handleRootNavPress('Manuscript')}
            accessibilityRole="button"
            accessibilityLabel="Go to Manuscript"
          >
            <View style={styles.navCardPlaceholder}>
              <View style={styles.navCardContent}>
                <Text style={styles.navCardTitleSmall}>Manifest the Unseen</Text>
                <Text style={styles.navCardSubtitleSmall}>Manuscript</Text>
              </View>
            </View>
          </Pressable>

          {/* Observable Science Card */}
          <Pressable
            style={({ pressed }) => [
              styles.navCard,
              pressed && styles.navCardPressed,
            ]}
            onPress={() => handleRootNavPress('ObservableScience')}
            accessibilityRole="button"
            accessibilityLabel="Go to Observable Science"
          >
            <View style={styles.navCardPlaceholder}>
              <View style={styles.navCardContent}>
                <Text style={styles.navCardTitleSmall}>Observable</Text>
                <Text style={styles.navCardSubtitleSmall}>Science</Text>
              </View>
            </View>
          </Pressable>
        </View>

        {/* Daily Inspiration - below all buttons (scroll to see) */}
        <View style={styles.inspirationCard}>
          <Text style={styles.inspirationLabel}>Daily Inspiration</Text>
          <Text style={styles.quote}>
            "If you want to find the secrets of the universe, think in terms of energy, frequency and vibration."
          </Text>
          <Text style={styles.quoteAuthor}>- Nikola Tesla</Text>
        </View>

        {/* Bottom padding for safe area and future content */}
        <View style={{ height: 100 + insets.bottom }} />
      </ScrollView>
    </ImageBackground>
  );
};

/**
 * Styles
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0F', // Deep void behind image
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 50, // Safe area + some breathing room
  },

  // Title Section - Baskerville serif font for classical mystical aesthetic
  titleContainer: {
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  titleLine: {
    fontFamily: fontFamilies.heading, // Baskerville on iOS
    fontSize: 32,
    fontWeight: '400', // Regular weight works better with Baskerville
    color: '#E8D5A3', // Warmer, softer gold
    letterSpacing: 8, // Slightly reduced for serif
    textTransform: 'uppercase',
    lineHeight: 42,
    textShadowColor: 'rgba(232, 213, 163, 0.3)', // Subtle glow
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },

  // Daily Inspiration - positioned below all nav cards
  inspirationCard: {
    backgroundColor: 'rgba(10, 10, 15, 0.7)', // Semi-transparent
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginHorizontal: spacing.md,
    marginTop: spacing.lg, // Space above the card
    borderWidth: 1,
    borderColor: 'rgba(196, 160, 82, 0.3)',
  },
  inspirationLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.text.golden,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: spacing.xs,
  },
  quote: {
    fontSize: 15,
    fontStyle: 'italic',
    color: colors.text.primary,
    marginBottom: spacing.xs,
    lineHeight: 22,
  },
  quoteAuthor: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: 'right',
  },

  // Navigation Cards - Graphical card buttons
  navCardsContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    marginTop: spacing.lg,
  },
  navCard: {
    flex: 1,
    height: 120,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(196, 160, 82, 0.4)',
  },
  navCardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  navCardImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  navCardContent: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: spacing.sm,
    backgroundColor: 'rgba(10, 10, 15, 0.5)',
  },
  navCardTitle: {
    color: '#E8D5A3',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  navCardSubtitle: {
    color: colors.text.secondary,
    fontSize: 11,
    marginTop: 2,
    textAlign: 'center',
  },
  // Placeholder cards (no image background)
  navCardPlaceholder: {
    flex: 1,
    backgroundColor: 'rgba(10, 10, 15, 0.85)',
  },
  // Smaller title for secondary cards
  navCardTitleSmall: {
    color: '#E8D5A3',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  navCardSubtitleSmall: {
    color: colors.text.golden,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 2,
    textAlign: 'center',
    letterSpacing: 1,
  },
});

export default HomeScreen;
