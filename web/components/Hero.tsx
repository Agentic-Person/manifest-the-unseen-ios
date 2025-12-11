'use client'

import Image from 'next/image'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-bg.png"
          alt="Mystical forest meditation"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-deep-void via-deep-void/40 to-transparent" />
      </div>

      {/* Content - top aligned with padding */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-24 sm:pt-32 text-center">
        {/* Main headline */}
        <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-light mb-8 tracking-wide">
          <span className="text-enlightened">MANIFEST THE UNSEEN</span>
        </h1>

        {/* Tagline */}
        <p className="font-body text-lg sm:text-xl text-enlightened/80 font-light tracking-wide">
          Your journey from belief to realization begins here
        </p>
      </div>

      {/* The Path section - bottom of hero */}
      <div className="relative z-10 mt-auto pb-24 text-center">
        <p className="font-body text-aged-gold/80 text-sm uppercase tracking-widest mb-3">
          The Path
        </p>
        <h2 className="font-heading text-2xl sm:text-3xl font-light text-enlightened mb-10">
          Begin · Transform · Manifest
        </h2>

        <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16 text-muted-wisdom px-6">
          <div className="flex flex-col items-center">
            <span className="text-aged-gold font-heading text-2xl mb-2">01</span>
            <span className="font-body text-sm">Start your free trial</span>
          </div>
          <div className="hidden md:block w-12 h-px bg-aged-gold/30" />
          <div className="flex flex-col items-center">
            <span className="text-aged-gold font-heading text-2xl mb-2">02</span>
            <span className="font-body text-sm">Journey through 10 phases</span>
          </div>
          <div className="hidden md:block w-12 h-px bg-aged-gold/30" />
          <div className="flex flex-col items-center">
            <span className="text-aged-gold font-heading text-2xl mb-2">03</span>
            <span className="font-body text-sm">Manifest daily</span>
          </div>
        </div>
      </div>

      {/* Scroll wheel indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
        <div className="w-6 h-10 border-2 border-enlightened/30 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-enlightened/50 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  )
}
