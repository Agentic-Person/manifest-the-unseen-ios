'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

export default function SignupPage() {
  const router = useRouter()
  const { signUp } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    // Validation
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      const { error: signUpError } = await signUp(email, password)

      if (signUpError) {
        setError(signUpError.message)
        setLoading(false)
        return
      }

      // Redirect to workbook (or show email confirmation message)
      router.push('/workbook')
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-deep-void px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-enlightened mb-2">
            Create Account
          </h1>
          <p className="text-muted-wisdom">
            Start your manifestation journey today
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
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-aged-gold focus:border-transparent transition-colors"
                placeholder="••••••••"
              />
              <p className="text-xs text-tertiary-text mt-1">
                At least 6 characters
              </p>
            </div>

            {/* Confirm password field */}
            <div>
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-muted-wisdom mb-2"
              >
                Confirm Password
              </label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6 mb-6 border-t border-[var(--gold-divider)]" />

          {/* Sign in link */}
          <p className="text-center text-sm text-muted-wisdom">
            Already have an account?{' '}
            <Link
              href="/auth/login"
              className="text-aged-gold hover:text-amber-glow font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Footer note */}
        <p className="text-center text-sm text-muted-wisdom mt-8">
          After signing up, download the mobile app to subscribe and
          <br />
          unlock access to all workbook phases.
        </p>
      </div>
    </div>
  )
}
