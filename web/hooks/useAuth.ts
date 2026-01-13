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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      setSession(data.session)
      setUser(data.user)

      return { error: null }
    } catch (error) {
      console.error('Sign in error:', error)
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
