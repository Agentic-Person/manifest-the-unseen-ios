/**
 * Phase Locked Prompt Component
 *
 * Specialized upgrade prompt for locked workbook phases.
 * Shows phase-specific messaging and benefits.
 */

import React from 'react';
import { UpgradePrompt } from './UpgradePrompt';
import { getUpgradeMessage } from '../utils/subscriptionGating';
import type { SubscriptionTier } from '../types/subscription';

/**
 * Phase Locked Prompt Props
 */
export interface PhaseLockedPromptProps {
  visible: boolean;
  onClose: () => void;
  phaseNumber: number;
  currentTier: SubscriptionTier;
  onUpgrade?: () => void;
}

/**
 * Phase Locked Prompt Component
 *
 * Displays an upgrade prompt when user tries to access a locked phase.
 *
 * @example
 * ```tsx
 * <PhaseLockedPrompt
 *   visible={showPrompt}
 *   onClose={() => setShowPrompt(false)}
 *   phaseNumber={6}
 *   currentTier={tier}
 * />
 * ```
 */
export const PhaseLockedPrompt: React.FC<PhaseLockedPromptProps> = ({
  visible,
  onClose,
  phaseNumber,
  currentTier,
  onUpgrade,
}) => {
  const upgradeMessage = getUpgradeMessage('phase', currentTier, {
    phaseNumber,
  });

  return (
    <UpgradePrompt
      visible={visible}
      onClose={onClose}
      title={upgradeMessage.title}
      description={upgradeMessage.description}
      requiredTier={upgradeMessage.requiredTier}
      benefits={upgradeMessage.benefits}
      onUpgrade={onUpgrade}
    />
  );
};

export default PhaseLockedPrompt;
