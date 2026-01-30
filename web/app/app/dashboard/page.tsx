'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useSubscription } from '@/hooks/useSubscription'
import { useFeatureAccess } from '@/hooks/useFeatureAccess'
import { getTierDisplayName } from '@/types/subscription'

/**
 * Full Web App Dashboard
 * Quick links to all features, recent activity, and progress summary.
 */
export default function AppDashboardPage() {
  const { user } = useAuth()
  const { tier, isSubscribed, expiresAt, status } = useSubscription()
  const { getAccessiblePhases, canAccessGuru, canAccessJournal, canAccessMeditations } =
    useFeatureAccess()

  const accessiblePhases = getAccessiblePhases()
  const guruAccess = canAccessGuru()
  const journalAccess = canAccessJournal()
  const meditationAccess = canAccessMeditations()

  const userName = user?.email?.split('@')[0] || 'Seeker'

  const quickActions = [
    {
      title: 'Continue Workbook',
      description: 'Pick up where you left off',
      href: '/app/workbook',
      icon: BookIcon,
      color: 'from-aged-gold/20 to-burnished-bronze/20',
      borderColor: 'border-aged-gold/30',
      available: true,
    },
    {
      title: 'Ask Guru',
      description: 'Get AI-guided wisdom',
      href: '/app/guru',
      icon: SparklesIcon,
      color: 'from-crown-purple/20 to-deep-purple/20',
      borderColor: 'border-crown-purple/30',
      available: guruAccess.canAccess,
    },
    {
      title: 'Meditate',
      description: 'Start a guided session',
      href: '/app/meditations',
      icon: HeartIcon,
      color: 'from-deep-teal/20 to-heart-emerald/20',
      borderColor: 'border-deep-teal/30',
      available: meditationAccess.canAccess,
    },
    {
      title: 'Journal',
      description: 'Reflect on your journey',
      href: '/app/journal',
      icon: PenIcon,
      color: 'from-sacral-orange/20 to-deep-amber/20',
      borderColor: 'border-sacral-orange/30',
      available: journalAccess.canAccess,
    },
  ]

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif text-enlightened">
            Welcome back, {userName}
          </h1>
          <p className="text-muted-wisdom mt-1">
            Continue your manifestation journey
          </p>
        </div>
        <div className="flex items-center gap-3">
          {tier && (
            <div className="flex items-center gap-2 px-4 py-2 bg-aged-gold/10 border border-aged-gold/30 rounded-full">
              <StarIcon className="w-4 h-4 text-aged-gold" />
              <span className="text-sm font-medium text-aged-gold">
                {getTierDisplayName(tier)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {quickActions.map((action) => (
          <QuickActionCard key={action.title} action={action} />
        ))}
      </div>

      {/* Progress Overview */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Workbook Progress */}
        <div className="lg:col-span-2 p-6 bg-temple-stone border border-gold-border rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-serif text-enlightened">
              Workbook Progress
            </h2>
            <Link
              href="/app/workbook"
              className="text-sm text-aged-gold hover:text-amber-glow transition-colors"
            >
              View All
            </Link>
          </div>

          {/* Phase Progress */}
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((phase) => (
              <PhaseProgressRow
                key={phase}
                phase={phase}
                isAccessible={accessiblePhases.includes(phase)}
                progress={Math.floor(Math.random() * 100)} // Placeholder - would come from actual data
              />
            ))}
          </div>

          {accessiblePhases.length < 10 && (
            <div className="mt-4 pt-4 border-t border-gold-border">
              <p className="text-sm text-muted-wisdom">
                Upgrade to unlock{' '}
                {tier === 'novice' ? 'phases 6-8' : 'all 10 phases'}
              </p>
            </div>
          )}
        </div>

        {/* Subscription Card */}
        <div className="p-6 bg-temple-stone border border-gold-border rounded-xl">
          <h2 className="text-lg font-serif text-enlightened mb-4">
            Subscription
          </h2>

          <div className="space-y-4">
            <div className="p-4 bg-elevated rounded-lg">
              <p className="text-sm text-muted-wisdom">Current Plan</p>
              <p className="text-lg font-medium text-enlightened mt-1">
                {tier ? getTierDisplayName(tier) : 'Free Preview'}
              </p>
              {status && (
                <span
                  className={`inline-block mt-2 px-2 py-0.5 text-xs rounded ${
                    status === 'active'
                      ? 'bg-heart-emerald/20 text-heart-emerald'
                      : status === 'trialing'
                      ? 'bg-aged-gold/20 text-aged-gold'
                      : 'bg-burgundy/20 text-burgundy'
                  }`}
                >
                  {status === 'trialing' ? 'Trial' : status}
                </span>
              )}
            </div>

            {expiresAt && (
              <div className="text-sm text-muted-wisdom">
                <p>
                  {status === 'trialing' ? 'Trial ends' : 'Renews'}:{' '}
                  {new Date(expiresAt).toLocaleDateString()}
                </p>
              </div>
            )}

            <Link
              href="/app/billing"
              className="block w-full text-center px-4 py-2 bg-aged-gold text-deep-void font-medium rounded-lg hover:bg-amber-glow transition-colors"
            >
              {tier ? 'Manage Subscription' : 'Upgrade Now'}
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="p-6 bg-temple-stone border border-gold-border rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-serif text-enlightened">
            Recent Activity
          </h2>
        </div>

        {/* Placeholder for recent activity */}
        <div className="space-y-3">
          <ActivityItem
            icon={<BookIcon className="w-4 h-4" />}
            title="Completed Phase 2 worksheet"
            time="2 hours ago"
          />
          <ActivityItem
            icon={<HeartIcon className="w-4 h-4" />}
            title="Morning meditation - 15 min"
            time="Yesterday"
          />
          <ActivityItem
            icon={<PenIcon className="w-4 h-4" />}
            title="New journal entry"
            time="2 days ago"
          />
        </div>
      </div>

      {/* Daily Inspiration */}
      <div className="p-6 bg-gradient-to-br from-crown-purple/10 to-deep-purple/10 border border-crown-purple/20 rounded-xl">
        <p className="text-sm text-crown-purple mb-2">Daily Inspiration</p>
        <blockquote className="text-lg font-serif text-enlightened italic">
          "The only way to do great work is to love what you do. If you haven't
          found it yet, keep looking. Don't settle."
        </blockquote>
        <p className="text-sm text-muted-wisdom mt-3">- Steve Jobs</p>
      </div>
    </div>
  )
}

function QuickActionCard({
  action,
}: {
  action: {
    title: string
    description: string
    href: string
    icon: React.FC<{ className?: string }>
    color: string
    borderColor: string
    available: boolean
  }
}) {
  const Icon = action.icon

  if (!action.available) {
    return (
      <div
        className={`relative p-5 bg-gradient-to-br ${action.color} border ${action.borderColor} rounded-xl opacity-60`}
      >
        <div className="absolute top-3 right-3">
          <LockIcon className="w-4 h-4 text-muted-wisdom" />
        </div>
        <Icon className="w-8 h-8 text-muted-wisdom mb-3" />
        <h3 className="font-medium text-muted-wisdom">{action.title}</h3>
        <p className="text-sm text-tertiary-text mt-1">{action.description}</p>
      </div>
    )
  }

  return (
    <Link
      href={action.href}
      className={`block p-5 bg-gradient-to-br ${action.color} border ${action.borderColor} rounded-xl hover:scale-[1.02] transition-transform`}
    >
      <Icon className="w-8 h-8 text-enlightened mb-3" />
      <h3 className="font-medium text-enlightened">{action.title}</h3>
      <p className="text-sm text-muted-wisdom mt-1">{action.description}</p>
    </Link>
  )
}

function PhaseProgressRow({
  phase,
  isAccessible,
  progress,
}: {
  phase: number
  isAccessible: boolean
  progress: number
}) {
  const phaseNames = [
    'Self-Evaluation',
    'Values & Vision',
    'Goal Setting',
    'Facing Fears',
    'Self-Love & Care',
  ]

  return (
    <div className="flex items-center gap-4">
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium ${
          isAccessible
            ? 'bg-aged-gold/10 text-aged-gold'
            : 'bg-elevated text-tertiary-text'
        }`}
      >
        {phase}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span
            className={`text-sm ${
              isAccessible ? 'text-enlightened' : 'text-muted-wisdom'
            }`}
          >
            {phaseNames[phase - 1]}
          </span>
          <span className="text-xs text-tertiary-text">{progress}%</span>
        </div>
        <div className="h-1.5 bg-elevated rounded-full overflow-hidden">
          <div
            className="h-full bg-aged-gold rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}

function ActivityItem({
  icon,
  title,
  time,
}: {
  icon: React.ReactNode
  title: string
  time: string
}) {
  return (
    <div className="flex items-center gap-3 p-3 bg-elevated rounded-lg">
      <div className="p-2 bg-temple-stone rounded-lg text-aged-gold">{icon}</div>
      <div className="flex-1">
        <p className="text-sm text-enlightened">{title}</p>
        <p className="text-xs text-tertiary-text">{time}</p>
      </div>
    </div>
  )
}

// Icon components
function BookIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
      />
    </svg>
  )
}

function SparklesIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
      />
    </svg>
  )
}

function HeartIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      />
    </svg>
  )
}

function PenIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
      />
    </svg>
  )
}

function StarIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
      />
    </svg>
  )
}

function LockIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
      />
    </svg>
  )
}
