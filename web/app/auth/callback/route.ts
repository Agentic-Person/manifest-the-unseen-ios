import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

/**
 * Auth callback route handler for Supabase authentication.
 * Handles OAuth redirects and email confirmation links.
 *
 * When Supabase completes authentication (email confirmation, OAuth, etc.),
 * it redirects to this endpoint with a code parameter.
 * This route exchanges the code for a session and redirects the user.
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/workbook'

  if (code) {
    try {
      // Exchange code for session
      const { error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        console.error('Auth callback error:', error)
        // Redirect to login with error
        return NextResponse.redirect(
          new URL(`/auth/login?error=${encodeURIComponent(error.message)}`, requestUrl.origin)
        )
      }

      // Successful authentication - redirect to workbook or specified page
      return NextResponse.redirect(new URL(next, requestUrl.origin))
    } catch (error) {
      console.error('Unexpected auth callback error:', error)
      return NextResponse.redirect(
        new URL('/auth/login?error=Authentication failed', requestUrl.origin)
      )
    }
  }

  // No code provided - redirect to login
  return NextResponse.redirect(new URL('/auth/login', requestUrl.origin))
}
