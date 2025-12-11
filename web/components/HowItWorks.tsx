'use client'

export default function HowItWorks() {
  return (
    <section className="py-20 bg-temple-stone/20">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <p className="text-aged-gold/80 text-sm uppercase tracking-widest mb-3">
          The Path
        </p>
        <h2 className="font-serif text-3xl sm:text-4xl font-light text-enlightened mb-12">
          Begin · Transform · Manifest
        </h2>

        <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16 text-muted-wisdom">
          <div className="flex flex-col items-center">
            <span className="text-aged-gold font-serif text-2xl mb-2">01</span>
            <span className="text-sm">Start your free trial</span>
          </div>
          <div className="hidden md:block w-12 h-px bg-aged-gold/30" />
          <div className="flex flex-col items-center">
            <span className="text-aged-gold font-serif text-2xl mb-2">02</span>
            <span className="text-sm">Journey through 10 phases</span>
          </div>
          <div className="hidden md:block w-12 h-px bg-aged-gold/30" />
          <div className="flex flex-col items-center">
            <span className="text-aged-gold font-serif text-2xl mb-2">03</span>
            <span className="text-sm">Manifest daily</span>
          </div>
        </div>
      </div>
    </section>
  )
}
