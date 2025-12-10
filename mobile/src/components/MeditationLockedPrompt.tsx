/**
 * Meditation Locked Prompt Component
 *
 * Specialized upgrade prompt for locked meditations.
 * Shows meditation-specific messaging and benefits.
 */

import React from 'react';
import { UpgradePrompt } from './UpgradePrompt';
import { getUpgradeMessage } from '../utils/subscriptionGating';
import type { SubscriptionTier } from '../types/subscription';

/**
 * Meditation Locked Prompt Props
 */
export interface MeditationLockedPromptProps {
  visible: boolean;
  onClose: () => void;
  meditationIndex: number;
  meditationTitle?: string;
  currentTier: SubscriptionTier;
  onUpgrade?: () => void;
}

/**
 * Meditation Locked Prompt Component
 *
 * Displays an upgrade prompt when user tries to access a locked meditation.
 *
 * @example
 * ```tsx
 * <MeditationLockedPrompt
 *   visible={showPrompt}
 *   onClose={() => setShowPrompt(false)}
 *   meditationIndex={5}
 *   meditationTitle="Deep Relaxation"
 *   currentTier={tier}
 * />
 * ```
 */
export const MeditationLockedPrompt: React.FC<
  MeditationLockedPromptProps
> = ({ visible, onClose, meditationIndex, meditationTitle, currentTier, onUpgrade }) => {
  const upgradeMessage = getUpgradeMessage('meditation', currentTier, {
    meditationIndex,
  });

  // Customize title if meditation title is provided
  const title = meditationTitle
    ? `Unlock "${meditationTitle}"`
    : upgradeMessage.title;

  return (
    <UpgradePrompt
      visible={visible}
      onClose={onClose}
      title={title}
      description={upgradeMessage.description}
      requiredTier={upgradeMessage.requiredTier}
      benefits={upgradeMessage.benefits}
      onUpgrade={onUpgrade}
    />
  );
};

export default MeditationLockedPrompt;
