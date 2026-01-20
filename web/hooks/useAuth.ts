'use client'

import { useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

export interface UseAuthReturn {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<{ error: Error | null }>
}

/**
 * useAuth hook provides authentication state and methods.
 * Automatically syncs with Supabase auth state changes.
 *
 * @example
 * ```tsx
 * const { user, loading, signIn, signOut } = useAuth()
 *
 * if (loading) return <div>Loading...</div>
 * if (!user) return <LoginForm onSubmit={signIn} />
 *
 * return (
 *   <>
 *     <p>Welcome, {user.email}</p>
 *     <button onClick={signOut}>Sign Out</button>
 *   </>
 * )
 * ```
 */
export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  /**
   * Sign in with email and password
   */
  const signIn = async (email: string, password: string) => {
    try {
      console.log('[DEBUG] Attempting sign in with:', JSON.stringify({
        email,
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL
      }, null, 2))

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      console.log('[DEBUG] Supabase response:', JSON.stringify({
        hasSession: !!data.session,
        hasUser: !!data.user,
        userId: data.user?.id,
        userEmail: data.user?.email,
        emailConfirmed: data.user?.email_confirmed_at,
        error: error ? {
          name: error.name,
          message: error.message,
          status: error.status,
          code: error.code,
          // Log full error object for debugging
          fullError: JSON.stringify(error, null, 2)
        } : null
      }, null, 2))

      if (error) {
        // Handle specific error codes with user-friendly messages
        let userMessage = error.message

        // Check for email confirmation errors
        if (error.code === 'email_not_confirmed') {
          userMessage = 'Please confirm your email address before signing in. Check your inbox for a confirmation link.'
        } else if (error.status === 400 && error.message.toLowerCase().includes('email')) {
          userMessage = 'Please verify your email address. Check your inbox for a confirmation link.'
        } else if (error.message === 'Invalid login credentials') {
          userMessage = 'Invalid email or password. Please try again.'
        } else if (error.message.toLowerCase().includes('confirm') ||
                   error.message.toLowerCase().includes('verify')) {
          userMessage = 'Please confirm your email address. Check your inbox for a verification link.'
        }

        throw new Error(userMessage)
      }

      setSession(data.session)
      setUser(data.user)

      return { error: null }
    } catch (error) {
      console.error('[SIGN IN ERROR] Full details:', JSON.stringify({
        message: error instanceof Error ? error.message : 'Unknown error',
        name: error instanceof Error ? error.name : 'Error',
        stack: error instanceof Error ? error.stack : undefined,
        fullError: error
      }, null, 2))
      return {
        error: error instanceof Error ? error : new Error('Failed to sign in'),
      }
    }
  }

  /**
   * Sign up with email and password
   */
  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) throw error

      // Note: Depending on email confirmation settings,
      // user might need to confirm email before signing in
      setSession(data.session)
      setUser(data.user)

      return { error: null }
    } catch (error) {
      console.error('Sign up error:', error)
      return {
        error: error instanceof Error ? error : new Error('Failed to sign up'),
      }
    }
  }

  /**
   * Sign out current user
   */
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()

      if (error) throw error

      setSession(null)
      setUser(null)

      return { error: null }
    } catch (error) {
      console.error('Sign out error:', error)
      return {
        error: error instanceof Error ? error : new Error('Failed to sign out'),
      }
    }
  }

  return {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  }
}
