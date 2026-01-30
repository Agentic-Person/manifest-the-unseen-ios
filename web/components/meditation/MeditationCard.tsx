'use client'

import { useCallback } from 'react'
import Link from 'next/link'
import { Meditation } from '@/types/database'
import { formatDuration } from '@/types/database'
import { SubscriptionTier, getTierDisplayName } from '@/types/subscription'

export interface MeditationCardProps {
  meditation: Meditation
  isLocked: boolean
  onLockedClick?: (meditation: Meditation) => void
  className?: string
}

/**
 * MeditationCard component displays a meditation in a card format.
 * Shows title, duration, description, tier badge, and play/lock state.
 *
 * @example
 * ```tsx
 * <MeditationCard
 *   meditation={meditation}
 *   isLocked={!canAccessMeditation(userTier, meditation.tier_required)}
 *   onLockedClick={(med) => setLockedMeditation(med)}
 * />
 * ```
 */
export function MeditationCard({
  meditation,
  isLocked,
  onLockedClick,
  className = '',
}: MeditationCardProps) {
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (isLocked) {
        e.preventDefault()
        onLockedClick?.(meditation)
      }
    },
    [isLocked, meditation, onLockedClick]
  )

  // Get type-specific styling
  const typeStyles = getTypeStyles(meditation.type)

  return (
    <Link
      href={isLocked ? '#' : `/app/meditations/${meditation.id}`}
      onClick={handleClick}
      className={`block group ${className}`}
    >
      <div
        className={`relative overflow-hidden rounded-xl border transition-all duration-300 ${
          isLocked
            ? 'border-temple-stone bg-temple-stone/50 cursor-not-allowed'
            : 'border-temple-stone bg-temple-stone hover:border-aged-gold/50 hover:bg-elevated'
        }`}
      >
        {/* Gradient accent based on type */}
        <div
          className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${typeStyles.gradient}`}
        />

        <div className="p-4">
          {/* Header with type and duration */}
          <div className="flex items-center justify-between mb-3">
            {/* Type badge */}
            <span
              className={`text-xs uppercase tracking-wider font-medium ${typeStyles.color}`}
            >
              {getTypeLabel(meditation.type)}
            </span>

            {/* Duration */}
            <span className="text-xs text-muted-wisdom">
              {formatDuration(meditation.duration_seconds)}
            </span>
          </div>

          {/* Title */}
          <h3
            className={`font-heading text-lg mb-2 transition-colors ${
              isLocked ? 'text-muted-wisdom' : 'text-enlightened group-hover:text-aged-gold'
            }`}
          >
            {meditation.title}
          </h3>

          {/* Description */}
          {meditation.description && (
            <p className="text-sm text-muted-wisdom line-clamp-2 mb-3">
              {meditation.description}
            </p>
          )}

          {/* Footer with tier badge and action */}
          <div className="flex items-center justify-between mt-4">
            {/* Tier badge */}
            <TierBadge tier={meditation.tier_required} isLocked={isLocked} />

            {/* Play/Lock icon */}
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                isLocked
                  ? 'bg-temple-stone text-muted-wisdom'
                  : 'bg-aged-gold/10 text-aged-gold group-hover:bg-aged-gold group-hover:text-deep-void'
              }`}
            >
              {isLocked ? (
                <LockIcon className="w-4 h-4" />
              ) : (
                <PlayIcon className="w-4 h-4 ml-0.5" />
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

/**
 * Tier badge component
 */
function TierBadge({ tier, isLocked }: { tier: SubscriptionTier; isLocked: boolean }) {
  const tierColors: Record<SubscriptionTier, string> = {
    novice: 'bg-heart-emerald/20 text-heart-emerald border-heart-emerald/30',
    awakening: 'bg-crown-purple/20 text-crown-purple border-crown-purple/30',
    enlightenment: 'bg-aged-gold/20 text-aged-gold border-aged-gold/30',
  }

  return (
    <span
      className={`text-xs px-2 py-1 rounded-full border ${
        isLocked ? 'bg-temple-stone text-muted-wisdom border-muted-wisdom/20' : tierColors[tier]
      }`}
    >
      {getTierDisplayName(tier)}
    </span>
  )
}

/**
 * Get type-specific styles
 */
function getTypeStyles(type: Meditation['type']): { gradient: string; color: string } {
  switch (type) {
    case 'guided':
      return {
        gradient: 'from-aged-gold to-amber-glow',
        color: 'text-aged-gold',
      }
    case 'breathing':
      return {
        gradient: 'from-deep-teal to-heart-emerald',
        color: 'text-deep-teal',
      }
    case 'music':
      return {
        gradient: 'from-crown-purple to-deep-purple',
        color: 'text-crown-purple',
      }
    case 'prayer':
      return {
        gradient: 'from-sacral-orange to-deep-amber',
        color: 'text-sacral-orange',
      }
    default:
      return {
        gradient: 'from-aged-gold to-amber-glow',
        color: 'text-aged-gold',
      }
  }
}

/**
 * Get type display label
 */
function getTypeLabel(type: Meditation['type']): string {
  const labels: Record<string, string> = {
    guided: 'Guided',
    breathing: 'Breathing',
    music: 'Music',
    prayer: 'Prayer',
  }
  return type ? labels[type] || 'Meditation' : 'Meditation'
}

// Icon components
function PlayIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}

function LockIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  )
}
