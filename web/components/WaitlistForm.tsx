'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

interface WaitlistFormProps {
  source?: string
}

export default function WaitlistForm({ source = 'hero_section' }: WaitlistFormProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')

    // Validate email
    if (!email.trim()) {
      setErrorMessage('Please enter your email address')
      setStatus('error')
      return
    }

    if (!validateEmail(email)) {
      setErrorMessage('Please enter a valid email address')
      setStatus('error')
      return
    }

    setStatus('loading')

    try {
      const { error } = await supabase
        .from('waitlist')
        .insert([{ email: email.toLowerCase().trim(), source }])

      if (error) {
        // Handle duplicate email gracefully
        if (error.code === '23505') {
          setStatus('success') // Treat as success - they're already on the list
          return
        }
        throw error
      }

      setStatus('success')
    } catch (err) {
      console.error('Waitlist signup error:', err)
      setErrorMessage('Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-temple-stone/60 backdrop-blur-sm border border-aged-gold/40 rounded-xl p-6 text-center">
          {/* Success checkmark */}
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-aged-gold to-amber-glow flex items-center justify-center">
            <svg
              className="w-8 h-8 text-deep-void"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h3 className="text-xl font-heading text-enlightened mb-2">
            You&apos;re on the list!
          </h3>
          <p className="text-muted-wisdom text-sm mb-4">
            We&apos;ll notify you when we launch. Use this code at checkout:
          </p>

          {/* Promo code */}
          <div className="inline-block bg-deep-void/60 border border-aged-gold/30 rounded-lg px-4 py-2">
            <span className="text-aged-gold font-mono font-bold text-lg tracking-widest">
              EARLY50
            </span>
          </div>
          <p className="text-muted-wisdom text-xs mt-2">
            50% off your first year
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Badge */}
      <div className="text-center mb-4">
        <span className="inline-block px-4 py-1.5 text-xs font-medium text-aged-gold bg-aged-gold/10 border border-aged-gold/30 rounded-full animate-pulse">
          Limited Time: Save 50% with early access
        </span>
      </div>

      {/* Form container */}
      <div className="bg-temple-stone/60 backdrop-blur-sm border border-aged-gold/20 hover:border-aged-gold/40 transition-colors rounded-xl p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email input */}
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (status === 'error') {
                  setStatus('idle')
                  setErrorMessage('')
                }
              }}
              placeholder="Enter your email"
              className="w-full px-4 py-3 bg-deep-void/60 border border-aged-gold/20 focus:border-aged-gold rounded-lg text-enlightened placeholder:text-tertiary-text outline-none transition-colors"
              disabled={status === 'loading'}
            />
            {status === 'error' && errorMessage && (
              <p className="mt-2 text-sm text-root-crimson">{errorMessage}</p>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full py-3 px-6 bg-gradient-to-r from-aged-gold to-amber-glow text-deep-void font-medium rounded-lg hover:from-amber-glow hover:to-aged-gold transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {status === 'loading' ? (
              <>
                <svg
                  className="animate-spin h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Joining...</span>
              </>
            ) : (
              'Join Waitlist & Save 50%'
            )}
          </button>
        </form>

        {/* Promo code hint */}
        <p className="text-center text-xs text-muted-wisdom mt-4">
          Get code <span className="text-aged-gold font-mono">EARLY50</span> for 50% off your first year
        </p>
      </div>
    </div>
  )
}
