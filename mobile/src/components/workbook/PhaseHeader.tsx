/**
 * Phase Header Component
 *
 * Displays a beautiful header with phase image for workbook phase dashboards.
 */

import React from 'react';
import { View, Image, ImageSourcePropType, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from '../Text';
import { colors, spacing } from '../../theme';

interface PhaseHeaderProps {
  phaseNumber: number;
  title: string;
  subtitle: string;
  image: ImageSourcePropType;
}

export const PhaseHeader: React.FC<PhaseHeaderProps> = ({
  phaseNumber,
  title,
  subtitle,
  image,
}) => {
  return (
    <View style={styles.container}>
      {/* Background Image */}
      <View style={styles.imageContainer}>
        <Image source={image} style={styles.image} resizeMode="cover" />
        <LinearGradient
          colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.8)']}
          style={styles.gradient}
        />
      </View>

      {/* Text Overlay */}
      <View style={styles.textOverlay}>
        <View style={styles.phaseBadge}>
          <Text style={styles.phaseLabel}>Phase {phaseNumber}</Text>
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 200,
    marginHorizontal: -spacing.md,
    marginTop: -spacing.md,
    marginBottom: spacing.lg,
    position: 'relative',
  },
  imageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  textOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.md,
  },
  phaseBadge: {
    backgroundColor: colors.primary[500],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: spacing.xs,
  },
  phaseLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.white,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.white,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 22,
  },
});

export default PhaseHeader;
