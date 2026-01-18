'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Background image - fixed for parallax effect, constrained to viewport height */}
      <div className="fixed top-0 left-0 right-0 z-0 h-screen">
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
        <p className="font-body text-lg sm:text-xl text-enlightened/80 font-light tracking-wide mb-8">
          Your journey from belief to realization begins here
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/auth/signup"
            className="px-8 py-3 bg-aged-gold text-deep-void font-medium rounded-lg hover:bg-aged-gold/90 transition-colors shadow-lg hover:shadow-xl w-full sm:w-auto text-center"
          >
            Get Started
          </Link>
          <Link
            href="/auth/login"
            className="px-8 py-3 bg-transparent border-2 border-enlightened text-enlightened font-medium rounded-lg hover:bg-enlightened/10 transition-colors w-full sm:w-auto text-center"
          >
            Sign In
          </Link>
        </div>
      </div>

      {/* The Path section - bottom of hero */}
      <div id="path" className="relative z-10 mt-auto pb-24 text-center">
        <p className="font-body text-aged-gold/80 text-sm uppercase tracking-widest mb-3">
          The Path
        </p>
        <h2 className="font-heading text-2xl sm:text-3xl font-light text-enlightened mb-10">
          Begin · Transform · Manifest
        </h2>

        <div className="flex flex-col md:flex-row justify-center items-start gap-10 md:gap-8 text-muted-wisdom px-6 max-w-5xl mx-auto">
          <div className="flex flex-col items-center flex-1 max-w-xs">
            <span className="text-aged-gold font-heading text-2xl mb-2">01</span>
            <span className="font-body text-base font-medium text-enlightened mb-2">Start Digital Workbook</span>
            <span className="font-body text-sm text-enlightened/90 leading-relaxed">
              The digital 202-page workbook guides you through 10 phases of transformation to become the version of yourself your dreams already belong to.
            </span>
          </div>
          <div className="hidden md:block w-12 h-px bg-aged-gold/30 mt-4" />
          <div className="flex flex-col items-center flex-1 max-w-xs">
            <span className="text-aged-gold font-heading text-2xl mb-2">02</span>
            <span className="font-body text-base font-medium text-enlightened mb-2">Engage with the Guru</span>
            <span className="font-body text-sm text-enlightened/90 leading-relaxed">
              Converse during every phase of the workbook for deeper experience. AI wisdom trained on ancient teachings.
            </span>
          </div>
          <div className="hidden md:block w-12 h-px bg-aged-gold/30 mt-4" />
          <div className="flex flex-col items-center flex-1 max-w-xs">
            <span className="text-aged-gold font-heading text-2xl mb-2">03</span>
            <span className="font-body text-base font-medium text-enlightened mb-2">Manifest Daily</span>
            <span className="font-body text-sm text-enlightened/90 leading-relaxed">
              Exercise guided meditations and prayers of action to see daily manifestations!
            </span>
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
