/**
 * Quota Exceeded Prompt Component
 *
 * Specialized upgrade prompt for when users exceed their journal or AI chat quotas.
 * Shows quota-specific messaging and encourages upgrade for more/unlimited access.
 */

import React from 'react';
import { UpgradePrompt } from './UpgradePrompt';
import { getUpgradeMessage } from '../utils/subscriptionGating';
import type { SubscriptionTier } from '../types/subscription';

/**
 * Quota Type
 */
export type QuotaType = 'journal' | 'ai_chat';

/**
 * Quota Exceeded Prompt Props
 */
export interface QuotaExceededPromptProps {
  visible: boolean;
  onClose: () => void;
  quotaType: QuotaType;
  currentTier: SubscriptionTier;
  currentCount: number;
  limit: number;
  onUpgrade?: () => void;
}

/**
 * Quota Exceeded Prompt Component
 *
 * Displays an upgrade prompt when user exceeds their journal or AI chat quota.
 *
 * @example
 * ```tsx
 * <QuotaExceededPrompt
 *   visible={showPrompt}
 *   onClose={() => setShowPrompt(false)}
 *   quotaType="journal"
 *   currentTier={tier}
 *   currentCount={50}
 *   limit={50}
 * />
 * ```
 */
export const QuotaExceededPrompt: React.FC<QuotaExceededPromptProps> = ({
  visible,
  onClose,
  quotaType,
  currentTier,
  currentCount,
  limit,
  onUpgrade,
}) => {
  const featureType = quotaType === 'journal' ? 'journal_quota' : 'ai_chat_quota';
  const upgradeMessage = getUpgradeMessage(featureType, currentTier);

  // Add quota stats to description
  const quotaStats = `You've used ${currentCount} of your ${limit} ${
    quotaType === 'journal' ? 'monthly journal entries' : 'daily AI chat messages'
  }.`;

  const enhancedDescription = `${quotaStats}\n\n${upgradeMessage.description}`;

  return (
    <UpgradePrompt
      visible={visible}
      onClose={onClose}
      title={upgradeMessage.title}
      description={enhancedDescription}
      requiredTier={upgradeMessage.requiredTier}
      benefits={upgradeMessage.benefits}
      onUpgrade={onUpgrade}
    />
  );
};

export default QuotaExceededPrompt;
