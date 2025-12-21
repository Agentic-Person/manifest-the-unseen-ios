'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function Navbar() {
  const [isVisible, setIsVisible] = useState(false)
  const [isHoveringTop, setIsHoveringTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Show navbar after scrolling down 100px
      setIsVisible(window.scrollY > 100)
    }

    const handleMouseMove = (e: MouseEvent) => {
      // Show navbar when mouse is near top of screen (within 50px)
      setIsHoveringTop(e.clientY < 50)
    }

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  // Show navbar if scrolled OR hovering near top
  const showNavbar = isVisible || isHoveringTop

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        showNavbar
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 -translate-y-full pointer-events-none'
      }`}
    >
      {/* Background with blur effect */}
      <div className="absolute inset-0 bg-deep-void/90 backdrop-blur-md border-b border-elevated/30" />

      {/* Content */}
      <div className="relative max-w-6xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo - Left */}
          <button
            onClick={scrollToTop}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <Image
              src="/images/logo-mandala.png"
              alt="Manifest the Unseen"
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="font-serif text-lg text-enlightened hidden sm:inline">
              Manifest the Unseen
            </span>
          </button>

          {/* Nav Links - Center */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection('path')}
              className="text-sm text-muted-wisdom hover:text-enlightened transition-colors"
            >
              Path
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="text-sm text-muted-wisdom hover:text-enlightened transition-colors"
            >
              Tools
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="text-sm text-muted-wisdom hover:text-enlightened transition-colors"
            >
              Join
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="text-sm text-muted-wisdom hover:text-enlightened transition-colors"
            >
              FAQ
            </button>
          </div>

          {/* CTA - Right */}
          <button
            onClick={() => scrollToSection('pricing')}
            className="px-5 py-2 text-sm font-medium text-deep-void bg-aged-gold rounded-full hover:bg-amber-glow transition-colors"
          >
            Start Free Trial
          </button>
        </div>
      </div>
    </nav>
  )
}
