'use client'

const features = [
  {
    title: 'Digital Workbook',
    description: '10 phases of transformation with interactive exercises',
  },
  {
    title: 'Guided Meditations',
    description: 'Expert-led sessions with breathing exercises',
  },
  {
    title: 'The Guru',
    description: 'AI wisdom trained on ancient teachings',
  },
  {
    title: 'Voice Journaling',
    description: 'Speak your thoughts, we transcribe privately',
  },
]

export default function Features() {
  return (
    <section id="features" className="py-24 bg-deep-void">
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

        {/* Features - minimal grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 max-w-3xl mx-auto">
          {features.map((feature) => (
            <div key={feature.title} className="text-center">
              <h3 className="font-serif text-xl text-enlightened mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-wisdom text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
