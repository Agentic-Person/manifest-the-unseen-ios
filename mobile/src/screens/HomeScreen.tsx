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
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { MainTabScreenProps } from '../types/navigation';
import { colors, spacing, borderRadius } from '../theme';
import { BackgroundImages } from '../assets';

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

  return (
    <ImageBackground
      source={BackgroundImages.mysticalForest}
      style={styles.container}
      resizeMode="contain"
      imageStyle={styles.backgroundImage}
    >
      <View style={styles.content}>
        {/* Title Section - "MANIFEST THE UNSEEN" in 3 rows */}
        <View style={styles.titleContainer}>
          <Text style={styles.titleLine}>MANIFEST</Text>
          <Text style={styles.titleLine}>THE</Text>
          <Text style={styles.titleLine}>UNSEEN</Text>
        </View>

        {/* Spacer to push content down */}
        <View style={styles.spacer} />

        {/* Daily Inspiration - positioned in middle area */}
        <View style={styles.inspirationCard}>
          <Text style={styles.inspirationLabel}>Daily Inspiration</Text>
          <Text style={styles.quote}>
            "If you want to find the secrets of the universe, think in terms of energy, frequency and vibration."
          </Text>
          <Text style={styles.quoteAuthor}>- Nikola Tesla</Text>
        </View>

        {/* Navigation Cards - graphical card buttons */}
        <View style={[styles.navCardsContainer, { marginBottom: 70 + insets.bottom }]}>
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
      </View>
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
  content: {
    flex: 1,
    paddingTop: 50, // Safe area + some breathing room
  },

  // Title Section - Style Option 1: Ethereal/Mystical
  // Try different styles by uncommenting alternatives below
  titleContainer: {
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  titleLine: {
    // OPTION 1: Ethereal thin (current)
    fontSize: 32,
    fontWeight: '200', // Extra light for ethereal feel
    color: '#E8D5A3', // Warmer, softer gold
    letterSpacing: 12,
    textTransform: 'uppercase',
    lineHeight: 42,
    textShadowColor: 'rgba(232, 213, 163, 0.3)', // Subtle glow
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,

    // OPTION 2: Bold & Mystical - uncomment to try:
    // fontSize: 36,
    // fontWeight: '700',
    // color: '#C4A052',
    // letterSpacing: 6,
    // textShadowColor: 'rgba(0, 0, 0, 0.9)',
    // textShadowOffset: { width: 0, height: 3 },
    // textShadowRadius: 6,

    // OPTION 3: Serif-like elegant - uncomment to try:
    // fontSize: 28,
    // fontWeight: '400',
    // fontStyle: 'italic',
    // color: '#D4B896',
    // letterSpacing: 4,
    // lineHeight: 38,
  },

  // Spacer
  spacer: {
    flex: 1,
  },

  // Daily Inspiration - Reduced padding by 60%
  inspirationCard: {
    backgroundColor: 'rgba(10, 10, 15, 0.7)', // Semi-transparent
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.sm, // Reduced from spacing.lg
    paddingHorizontal: spacing.md, // Reduced from spacing.lg
    marginHorizontal: spacing.md, // Match navCardsContainer paddingHorizontal
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
});

export default HomeScreen;
