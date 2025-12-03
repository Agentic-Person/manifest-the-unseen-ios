/**
 * EmptyChatState Component
 *
 * Welcoming message shown when starting a new conversation
 * Ancient mystical design with gold accents and sacred wisdom
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/theme';

export function EmptyChatState() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* Monk icon/emoji */}
        <Text style={styles.icon}>🧘</Text>
        <Text style={styles.title}>Welcome, Seeker</Text>
        <Text style={styles.subtitle}>
          I am your guide on the path of manifestation and self-discovery.
        </Text>
      </View>

      <View style={styles.suggestionsContainer}>
        <View style={styles.suggestionCard}>
          <Text style={styles.suggestionTitle}>Ask me about manifestation</Text>
          <Text style={styles.suggestionExample}>
            "How do I start my manifestation journey?"
          </Text>
        </View>

        <View style={styles.suggestionCard}>
          <Text style={styles.suggestionTitle}>Explore limiting beliefs</Text>
          <Text style={styles.suggestionExample}>
            "Help me identify my limiting beliefs"
          </Text>
        </View>

        <View style={styles.suggestionCard}>
          <Text style={styles.suggestionTitle}>Learn techniques</Text>
          <Text style={styles.suggestionExample}>
            "Tell me about the 3-6-9 manifestation method"
          </Text>
        </View>
      </View>

      <Text style={styles.footer}>
        Ask me anything about your spiritual journey, manifestation practices,
        or the workbook exercises
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  icon: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: colors.text.primary,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    color: colors.text.secondary,
  },
  suggestionsContainer: {
    width: '100%',
    gap: 12,
  },
  suggestionCard: {
    backgroundColor: 'rgba(196, 160, 82, 0.1)',
    borderColor: colors.border.default,
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
  },
  suggestionTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
    color: colors.text.primary,
  },
  suggestionExample: {
    fontSize: 12,
    fontStyle: 'italic',
    color: colors.brand.amber,
  },
  footer: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 32,
    paddingHorizontal: 16,
    color: colors.text.tertiary,
  },
});
