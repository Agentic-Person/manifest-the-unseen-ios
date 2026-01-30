'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

export default function LoginPage() {
  const router = useRouter()
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    // Validation
    if (!email || !password) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address')
      setLoading(false)
      return
    }

    try {
      const { error: signInError } = await signIn(email, password)

      if (signInError) {
        // Log full error details for debugging
        console.error('[LOGIN ERROR] Full details:', JSON.stringify({
          message: signInError.message,
          name: signInError.name,
          stack: signInError.stack,
          // Log all enumerable properties
          allProps: Object.keys(signInError),
          // Check for common Supabase error properties
          status: (signInError as any).status,
          code: (signInError as any).code,
        }, null, 2))

        setError(signInError.message || 'Failed to sign in. Please try again.')
        return
      }

      // Redirect to workbook on successful login
      router.push('/workbook')
    } catch (err) {
      console.error('[LOGIN EXCEPTION] Unexpected error:', JSON.stringify({
        message: err instanceof Error ? err.message : 'Unknown error',
        name: err instanceof Error ? err.name : 'Error',
        stack: err instanceof Error ? err.stack : undefined,
        type: typeof err,
        fullError: err
      }, null, 2))
      setError('An unexpected error occurred. Please try again.')
    } finally {
      // Always reset loading state, even if error occurs
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-deep-void px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-enlightened mb-2">
            Welcome Back
          </h1>
          <p className="text-muted-wisdom">
            Sign in to continue your manifestation journey
          </p>
        </div>

        {/* Card */}
        <div className="bg-temple-stone rounded-2xl shadow-xl p-8 border border-[var(--gold-border)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error message */}
            {error && (
              <div
                className="bg-root-crimson/20 border border-root-crimson/40 text-enlightened px-4 py-3 rounded-lg"
                role="alert"
              >
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Email field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-muted-wisdom mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-aged-gold focus:border-transparent transition-colors"
                placeholder="you@example.com"
              />
            </div>

            {/* Password field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-muted-wisdom mb-2"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-aged-gold focus:border-transparent transition-colors"
                placeholder="••••••••"
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-aged-gold text-deep-void py-3 px-4 rounded-lg hover:bg-amber-glow transition-colors font-medium shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-aged-gold focus:ring-offset-2 focus:ring-offset-temple-stone disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6 mb-6 border-t border-[var(--gold-divider)]" />

          {/* Sign up link */}
          <p className="text-center text-sm text-muted-wisdom">
            Don&apos;t have an account?{' '}
            <Link
              href="/auth/signup"
              className="text-aged-gold hover:text-amber-glow font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>

        {/* Footer note */}
        <div className="mt-8 space-y-3">
          <p className="text-center text-sm text-muted-wisdom">
            <strong className="text-enlightened">Existing mobile app users:</strong> Use the same email and password from your mobile app.
          </p>
          <p className="text-center text-sm text-muted-wisdom">
            <strong className="text-enlightened">New users:</strong> Create an account to access the web workbook. Download the mobile app to unlock all features and subscribe.
          </p>
        </div>
      </div>
    </div>
  )
}
