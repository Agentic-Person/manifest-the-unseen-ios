'use client'

import Image from 'next/image'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-deep-void via-deep-void/90 to-temple-stone z-0" />

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-aged-gold/5 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-crown-purple/5 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1.5s' }} />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        {/* Logo/Brand mark */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-gold glow-gold mb-6">
            <svg className="w-10 h-10 text-deep-void" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* Main headline */}
        <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-bold mb-6 tracking-tight">
          <span className="text-gradient-gold">MANIFEST</span>
          <br />
          <span className="text-enlightened">THE UNSEEN</span>
        </h1>

        {/* Tagline */}
        <p className="text-xl sm:text-2xl text-aged-gold font-serif mb-4">
          Your Personal Manifestation Companion
        </p>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-muted-wisdom max-w-2xl mx-auto mb-10">
          Transform a 202-page manifestation workbook into your daily practice.
          AI-guided wisdom, voice journaling, and guided meditations—all in one beautiful app.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <a
            href="#pricing"
            className="group inline-flex items-center px-8 py-4 bg-gradient-gold text-deep-void font-semibold rounded-full hover:opacity-90 transition-all duration-300 glow-gold-hover"
          >
            <span>Coming Soon to App Store</span>
            <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
          <a
            href="#features"
            className="inline-flex items-center px-8 py-4 border border-aged-gold/50 text-aged-gold font-semibold rounded-full hover:bg-aged-gold/10 transition-all duration-300"
          >
            Explore Features
          </a>
        </div>

        {/* Feature badges */}
        <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-wisdom">
          <div className="flex items-center gap-2 px-4 py-2 bg-temple-stone/50 rounded-full">
            <svg className="w-4 h-4 text-heart-emerald" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Privacy First</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-temple-stone/50 rounded-full">
            <svg className="w-4 h-4 text-aged-gold" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>7-Day Free Trial</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-temple-stone/50 rounded-full">
            <svg className="w-4 h-4 text-crown-purple" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
            <span>Offline Capable</span>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-muted-wisdom" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  )
}
