/**
 * Upgrade Prompt Component
 *
 * Reusable modal component that prompts users to upgrade their subscription
 * when they try to access locked features. Beautiful dark purple design with
 * golden CTA button.
 */

import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { SubscriptionTier } from '../types/subscription';
import type { RootStackParamList } from '../types/navigation';

/**
 * Upgrade Prompt Props
 */
export interface UpgradePromptProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  description: string;
  requiredTier: SubscriptionTier;
  benefits: readonly string[];
  onUpgrade?: () => void;
}

/**
 * Upgrade Prompt Component
 *
 * Shows a modal with upgrade information and CTA button.
 *
 * @example
 * ```tsx
 * <UpgradePrompt
 *   visible={showUpgrade}
 *   onClose={() => setShowUpgrade(false)}
 *   title="Unlock Phase 6"
 *   description="Phase 6 is part of your deeper manifestation journey..."
 *   requiredTier="awakening"
 *   benefits={TIER_PRICING.awakening.features}
 * />
 * ```
 */
export const UpgradePrompt: React.FC<UpgradePromptProps> = ({
  visible,
  onClose,
  title,
  description,
  requiredTier,
  benefits,
  onUpgrade,
}) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const tierDisplayNames = {
    free: 'Free',
    novice: 'Novice Path',
    awakening: 'Awakening Path',
    enlightenment: 'Enlightenment Path',
  };

  const handleUpgrade = () => {
    onClose();

    if (onUpgrade) {
      onUpgrade();
    } else {
      // Navigate to Paywall modal
      navigation.navigate('Paywall', { lockedFeature: title });
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.modal} onPress={(e) => e.stopPropagation()}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.lockIcon}>🔒</Text>
            <Text style={styles.title}>{title}</Text>
          </View>

          {/* Content */}
          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.description}>{description}</Text>

            {/* Required Tier Badge */}
            <View style={styles.tierBadge}>
              <Text style={styles.tierBadgeText}>
                {tierDisplayNames[requiredTier]}
              </Text>
            </View>

            {/* Benefits List */}
            <View style={styles.benefitsContainer}>
              <Text style={styles.benefitsTitle}>What you'll unlock:</Text>
              {benefits.map((benefit, index) => (
                <View key={index} style={styles.benefitItem}>
                  <Text style={styles.benefitIcon}>✨</Text>
                  <Text style={styles.benefitText}>{benefit}</Text>
                </View>
              ))}
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.upgradeButton}
              onPress={handleUpgrade}
              activeOpacity={0.8}
            >
              <Text style={styles.upgradeButtonText}>Upgrade Now</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.laterButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={styles.laterButtonText}>Maybe Later</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: '#1F1B2E',
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    overflow: 'hidden',
    shadowColor: '#9333EA',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  header: {
    backgroundColor: '#9333EA',
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  lockIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  content: {
    padding: 20,
    maxHeight: 400,
  },
  description: {
    fontSize: 16,
    color: '#D1D5DB',
    lineHeight: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  tierBadge: {
    backgroundColor: '#9333EA',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 24,
  },
  tierBadgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  benefitsContainer: {
    marginBottom: 8,
  },
  benefitsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  benefitIcon: {
    fontSize: 16,
    marginRight: 12,
    marginTop: 2,
  },
  benefitText: {
    fontSize: 15,
    color: '#D1D5DB',
    flex: 1,
    lineHeight: 22,
  },
  actions: {
    padding: 20,
    gap: 12,
  },
  upgradeButton: {
    backgroundColor: '#C9A227',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#C9A227',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  upgradeButtonText: {
    color: '#1F1B2E',
    fontSize: 18,
    fontWeight: 'bold',
  },
  laterButton: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  laterButtonText: {
    color: '#9CA3AF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default UpgradePrompt;
