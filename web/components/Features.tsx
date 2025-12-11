'use client'

const features = [
  {
    title: 'Digital Workbook',
    description: '10 phases of transformation. All 202 pages digitized into interactive exercises with auto-save and progress tracking.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    color: 'aged-gold',
  },
  {
    title: 'Voice Journaling',
    description: 'Talk, we transcribe. On-device processing means your voice never leaves your phone. Privacy-first journaling.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
    ),
    color: 'crown-purple',
  },
  {
    title: 'Guided Meditations',
    description: '6 expert-led sessions with male and female narrators, plus animated breathing exercises with haptic feedback.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    color: 'heart-emerald',
  },
  {
    title: 'AI Monk Companion',
    description: 'Wisdom trained on manifestation principles and ancient teachings. Context-aware guidance for your journey.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    color: 'sacral-orange',
  },
  {
    title: 'Vision Boards',
    description: 'Create and maintain visual manifestation boards. Daily reminders to visualize your goals and dreams.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    color: 'deep-teal',
  },
  {
    title: 'Progress Tracking',
    description: 'Comprehensive analytics and streak tracking. See your transformation unfold with detailed insights.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    color: 'root-crimson',
  },
]

const colorMap: Record<string, string> = {
  'aged-gold': 'border-aged-gold/30 bg-aged-gold/5 text-aged-gold',
  'crown-purple': 'border-crown-purple/30 bg-crown-purple/5 text-crown-purple',
  'heart-emerald': 'border-heart-emerald/30 bg-heart-emerald/5 text-heart-emerald',
  'sacral-orange': 'border-sacral-orange/30 bg-sacral-orange/5 text-sacral-orange',
  'deep-teal': 'border-deep-teal/30 bg-deep-teal/5 text-deep-teal',
  'root-crimson': 'border-root-crimson/30 bg-root-crimson/5 text-root-crimson',
}

export default function Features() {
  return (
    <section id="features" className="py-24 bg-temple-stone/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl sm:text-5xl font-bold mb-4">
            <span className="text-gradient-gold">Everything You Need</span>
          </h2>
          <p className="text-xl text-muted-wisdom max-w-2xl mx-auto">
            A complete manifestation ecosystem designed to guide your transformation journey
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative p-8 bg-deep-void/50 rounded-2xl border border-elevated hover:border-aged-gold/30 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl border ${colorMap[feature.color]} mb-6`}>
                {feature.icon}
              </div>

              {/* Content */}
              <h3 className="font-serif text-xl font-semibold text-enlightened mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-wisdom leading-relaxed">
                {feature.description}
              </p>

              {/* Hover glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-aged-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
