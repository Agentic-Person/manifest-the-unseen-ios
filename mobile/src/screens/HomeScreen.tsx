/**
 * Home Screen
 *
 * Beautiful landing page with three main navigation cards:
 * Workbook, Meditate, and Journal - plus daily inspiration.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { MainTabScreenProps } from '../types/navigation';
import { useUser } from '../stores/authStore';
import { colors, spacing, borderRadius, shadows } from '../theme';
import { BackgroundImages } from '../assets';

type Props = MainTabScreenProps<'Home'>;

/**
 * Navigation card data
 */
const NAVIGATION_CARDS = [
  {
    id: 'workbook',
    title: 'Workbook',
    subtitle: 'Your transformation journey',
    image: BackgroundImages.workbook,
    route: 'Workbook' as const,
  },
  {
    id: 'meditate',
    title: 'Meditate',
    subtitle: 'Find peace and clarity',
    image: BackgroundImages.meditate,
    route: 'Meditate' as const,
  },
  {
    id: 'journal',
    title: 'Journal',
    subtitle: 'Capture your thoughts',
    image: BackgroundImages.journal,
    route: 'Journal' as const,
  },
];

/**
 * Home Screen Component
 */
const HomeScreen = ({ navigation }: Props) => {
  const user = useUser();

  /**
   * Handle card press - navigate to the selected section
   */
  const handleCardPress = (route: 'Workbook' | 'Meditate' | 'Journal') => {
    navigation.navigate(route);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome back!</Text>
        {user && <Text style={styles.userName}>{user.email}</Text>}
      </View>

      {/* Navigation Cards */}
      <View style={styles.cardsContainer}>
        {NAVIGATION_CARDS.map((card) => (
          <Pressable
            key={card.id}
            style={({ pressed }) => [
              styles.navCard,
              pressed && styles.navCardPressed,
            ]}
            onPress={() => handleCardPress(card.route)}
            accessibilityRole="button"
            accessibilityLabel={`Go to ${card.title}`}
          >
            {/* Card Image */}
            <View style={styles.cardImageContainer}>
              <Image
                source={card.image}
                style={styles.cardImage}
                resizeMode="cover"
              />
              <LinearGradient
                colors={['transparent', 'rgba(10, 10, 15, 0.95)']}
                style={styles.cardGradient}
              />
            </View>

            {/* Card Content */}
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{card.title}</Text>
              <Text style={styles.cardSubtitle}>{card.subtitle}</Text>
            </View>
          </Pressable>
        ))}
      </View>

      {/* Daily Inspiration */}
      <View style={styles.inspirationCard}>
        <Text style={styles.inspirationLabel}>Daily Inspiration</Text>
        <Text style={styles.quote}>
          "The energy you put out is the energy you get back. Stay positive."
        </Text>
        <Text style={styles.quoteAuthor}>- Manifest the Unseen</Text>
      </View>

      {/* Bottom Spacing */}
      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

/**
 * Styles
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    padding: spacing.md,
  },
  header: {
    marginBottom: spacing.lg,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text.golden,
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    color: colors.text.secondary,
  },

  // Navigation Cards
  cardsContainer: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  navCard: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.brand.gold,
    backgroundColor: colors.background.elevated,
    ...shadows.lg,
  },
  navCardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  cardImageContainer: {
    height: 140,
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  cardContent: {
    padding: spacing.md,
    paddingTop: spacing.sm,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    fontStyle: 'italic',
  },

  // Daily Inspiration
  inspirationCard: {
    backgroundColor: colors.background.elevated,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.gold,
  },
  inspirationLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text.golden,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  quote: {
    fontSize: 18,
    fontStyle: 'italic',
    color: colors.text.primary,
    marginBottom: spacing.sm,
    lineHeight: 28,
  },
  quoteAuthor: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'right',
  },

  bottomSpacer: {
    height: spacing.xl,
  },
});

export default HomeScreen;
