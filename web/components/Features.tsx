'use client'

const features = [
  {
    title: 'Digital Workbook',
    description: 'Journey from self-evaluation to surrender through 202 pages of guided exercises—including vision boards, SMART goal frameworks, the 3-6-9 method, and scripting techniques. Each phase builds on the last, creating a complete framework for lasting transformation.',
  },
  {
    title: 'Guided Meditations',
    description: 'Immersive sessions featuring Tibetan singing bowls, chakra activation, and frequency-based healing designed to raise your vibration and anchor you in your desired state. Each meditation meets you where you are—whether you have five minutes or thirty.',
  },
  {
    title: 'The Guru',
    description: 'Ancient wisdom meets modern guidance. Trained on energy principles, manifestation teachings, and spiritual frameworks, The Guru offers personalized insight whenever you need direction, encouragement, or a deeper understanding of the work.',
  },
  {
    title: 'Voice Journaling',
    description: 'Speak freely and watch your reflections transform into searchable journal entries—all processed privately on your device. No cloud uploads, no third-party access. Your innermost thoughts stay yours alone.',
  },
]

export default function Features() {
  return (
    <section id="features" className="relative z-10 py-32 bg-deep-void">
      <div className="max-w-5xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-aged-gold/80 text-sm uppercase tracking-widest mb-3">
            What Awaits You
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-light text-enlightened">
            Tools for Transformation
          </h2>
        </div>

        {/* Features - card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="relative p-6 rounded-xl bg-gradient-to-br from-aged-gold/10 via-temple-stone/30 to-deep-void/50 border border-aged-gold/40 shadow-[0_0_20px_rgba(196,160,82,0.15)] hover:shadow-[0_0_25px_rgba(196,160,82,0.25)] hover:border-aged-gold/60 transition-all duration-300"
            >
              <h3 className="font-serif text-xl text-enlightened mb-3 text-center">
                {feature.title}
              </h3>
              <p className="text-gray-400 text-base leading-loose text-center">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
