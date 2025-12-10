/**
 * Feature Locked Prompt Component
 *
 * Generic upgrade prompt for locked features like voice transcription,
 * vision boards, or any other premium features.
 */

import React from 'react';
import { UpgradePrompt } from './UpgradePrompt';
import { getUpgradeMessage } from '../utils/subscriptionGating';
import type { SubscriptionTier } from '../types/subscription';
import type { FeatureType } from '../utils/subscriptionGating';

/**
 * Feature Locked Prompt Props
 */
export interface FeatureLockedPromptProps {
  visible: boolean;
  onClose: () => void;
  feature: FeatureType;
  currentTier: SubscriptionTier;
  customTitle?: string;
  customDescription?: string;
  onUpgrade?: () => void;
}

/**
 * Feature Locked Prompt Component
 *
 * Displays a generic upgrade prompt for any locked feature.
 * Supports custom title and description overrides.
 *
 * @example
 * ```tsx
 * <FeatureLockedPrompt
 *   visible={showPrompt}
 *   onClose={() => setShowPrompt(false)}
 *   feature="voice_transcription"
 *   currentTier={tier}
 * />
 * ```
 *
 * @example With custom messaging
 * ```tsx
 * <FeatureLockedPrompt
 *   visible={showPrompt}
 *   onClose={() => setShowPrompt(false)}
 *   feature="vision_board"
 *   currentTier={tier}
 *   customTitle="Create Your Dream Board"
 *   customDescription="Visualize your goals with our powerful vision board tool..."
 * />
 * ```
 */
export const FeatureLockedPrompt: React.FC<FeatureLockedPromptProps> = ({
  visible,
  onClose,
  feature,
  currentTier,
  customTitle,
  customDescription,
  onUpgrade,
}) => {
  const upgradeMessage = getUpgradeMessage(feature, currentTier);

  return (
    <UpgradePrompt
      visible={visible}
      onClose={onClose}
      title={customTitle ?? upgradeMessage.title}
      description={customDescription ?? upgradeMessage.description}
      requiredTier={upgradeMessage.requiredTier}
      benefits={upgradeMessage.benefits}
      onUpgrade={onUpgrade}
    />
  );
};

export default FeatureLockedPrompt;
