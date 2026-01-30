'use client'

import Link from 'next/link'
import { useSubscription } from '@/hooks/useSubscription'
import { useFeatureAccess } from '@/hooks/useFeatureAccess'
import { getTierDisplayName } from '@/types/subscription'

/**
 * iOS Companion Dashboard
 * Shows workbook phases with links and iOS app download CTA.
 */
export default function CompanionDashboardPage() {
  const { tier, isSubscribed } = useSubscription()
  const { getAccessiblePhases } = useFeatureAccess()

  const accessiblePhases = getAccessiblePhases()

  const phases = [
    {
      number: 1,
      title: 'Self-Evaluation',
      description: 'Understand where you are with the Wheel of Life, SWOT analysis, and more.',
    },
    {
      number: 2,
      title: 'Values & Vision',
      description: 'Define your core values and create your vision for the future.',
    },
    {
      number: 3,
      title: 'Goal Setting',
      description: 'Set SMART goals and create actionable plans.',
    },
    {
      number: 4,
      title: 'Facing Fears',
      description: 'Identify and overcome limiting beliefs that hold you back.',
    },
    {
      number: 5,
      title: 'Self-Love & Care',
      description: 'Cultivate self-compassion and healthy habits.',
    },
    {
      number: 6,
      title: 'Manifestation',
      description: 'Learn powerful techniques like 3-6-9 Method, scripting, and WOOP.',
    },
    {
      number: 7,
      title: 'Gratitude',
      description: 'Develop a gratitude practice to attract more abundance.',
    },
    {
      number: 8,
      title: 'Transform Envy',
      description: 'Turn comparison into inspiration and motivation.',
    },
    {
      number: 9,
      title: 'Trust & Surrender',
      description: 'Release control and trust the process.',
    },
    {
      number: 10,
      title: 'Letting Go',
      description: 'Master the art of detachment and flow.',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="text-center space-y-4 py-6">
        <h1 className="text-3xl md:text-4xl font-serif text-enlightened">
          Welcome to Your Journey
        </h1>
        <p className="text-muted-wisdom max-w-2xl mx-auto">
          Access your workbook phases from any device. Your progress syncs
          automatically with the iOS app.
        </p>
        {tier && (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-aged-gold/10 border border-aged-gold/30 rounded-full">
            <span className="text-sm text-muted-wisdom">Current tier:</span>
            <span className="text-sm font-medium text-aged-gold">
              {getTierDisplayName(tier)}
            </span>
          </div>
        )}
      </div>

      {/* iOS App Banner */}
      <div className="bg-gradient-to-r from-deep-teal/20 to-heart-emerald/20 border border-deep-teal/30 rounded-xl p-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-xl font-serif text-enlightened mb-2">
              Full Experience on iOS
            </h2>
            <p className="text-sm text-muted-wisdom mb-4">
              Access Guru AI, guided meditations, voice journaling, and more
              features in the iOS app.
            </p>
            <a
              href="https://apps.apple.com/app/manifest-the-unseen"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-enlightened text-deep-void font-medium rounded-lg hover:bg-muted-wisdom transition-colors"
            >
              <AppleIcon className="w-5 h-5" />
              Download iOS App
            </a>
          </div>
          <div className="hidden md:block w-32 h-32 bg-elevated rounded-2xl flex items-center justify-center">
            <PhoneIcon className="w-16 h-16 text-muted-wisdom" />
          </div>
        </div>
      </div>

      {/* Workbook Phases Grid */}
      <div>
        <h2 className="text-xl font-serif text-enlightened mb-4">
          Workbook Phases
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {phases.map((phase) => {
            const isAccessible = accessiblePhases.includes(phase.number)

            return (
              <div
                key={phase.number}
                className={`relative p-5 bg-temple-stone border rounded-xl transition-all ${
                  isAccessible
                    ? 'border-gold-border hover:border-aged-gold cursor-pointer'
                    : 'border-elevated opacity-60'
                }`}
              >
                {isAccessible ? (
                  <Link
                    href={`/companion/workbook/phase/${phase.number}`}
                    className="block"
                  >
                    <PhaseContent phase={phase} isAccessible={isAccessible} />
                  </Link>
                ) : (
                  <div>
                    <PhaseContent phase={phase} isAccessible={isAccessible} />
                    <div className="absolute inset-0 flex items-center justify-center bg-deep-void/50 rounded-xl">
                      <div className="text-center">
                        <LockIcon className="w-6 h-6 text-muted-wisdom mx-auto mb-2" />
                        <span className="text-xs text-muted-wisdom">
                          Upgrade to unlock
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Phases Accessible"
          value={`${accessiblePhases.length} / 10`}
          icon={<BookIcon className="w-5 h-5" />}
        />
        <StatCard
          title="Subscription"
          value={tier ? getTierDisplayName(tier) : 'Free Preview'}
          icon={<StarIcon className="w-5 h-5" />}
        />
        <StatCard
          title="Platform"
          value="iOS Subscriber"
          icon={<AppleIcon className="w-5 h-5" />}
        />
      </div>
    </div>
  )
}

function PhaseContent({
  phase,
  isAccessible,
}: {
  phase: { number: number; title: string; description: string }
  isAccessible: boolean
}) {
  return (
    <>
      <div className="flex items-center gap-3 mb-3">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg font-serif ${
            isAccessible
              ? 'bg-aged-gold/10 text-aged-gold'
              : 'bg-elevated text-tertiary-text'
          }`}
        >
          {phase.number}
        </div>
        <h3
          className={`font-medium ${
            isAccessible ? 'text-enlightened' : 'text-muted-wisdom'
          }`}
        >
          {phase.title}
        </h3>
      </div>
      <p className="text-sm text-muted-wisdom line-clamp-2">{phase.description}</p>
    </>
  )
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string
  value: string
  icon: React.ReactNode
}) {
  return (
    <div className="p-4 bg-temple-stone border border-gold-border rounded-xl">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-elevated rounded-lg text-aged-gold">{icon}</div>
        <div>
          <p className="text-xs text-muted-wisdom">{title}</p>
          <p className="text-sm font-medium text-enlightened">{value}</p>
        </div>
      </div>
    </div>
  )
}

// Icon components
function AppleIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  )
}

function PhoneIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
      />
    </svg>
  )
}

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
