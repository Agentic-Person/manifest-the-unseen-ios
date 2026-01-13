import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

/**
 * Middleware to protect routes and check subscription status.
 *
 * Protects:
 * - /workbook/* - Requires authentication AND active subscription
 *
 * Flow:
 * 1. Check if user is authenticated
 * 2. If not authenticated -> redirect to /auth/login
 * 3. If authenticated, check subscription_status in users table
 * 4. If subscription_status !== 'active' -> redirect to / (landing page)
 * 5. If all checks pass -> allow access
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only protect /workbook/* routes
  if (!pathname.startsWith('/workbook')) {
    return NextResponse.next()
  }

  // Create Supabase client for middleware (Edge runtime compatible)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables in middleware')
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // Get the session token from cookies
  const token = request.cookies.get('sb-access-token')?.value
  const refreshToken = request.cookies.get('sb-refresh-token')?.value

  // Create Supabase client with auth token
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
    },
    global: {
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {},
    },
  })

  // Get session (will use the token from headers if available)
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Check 1: User must be authenticated
  if (!session) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Check 2: User must have active subscription
  try {
    const { data: userData, error } = await supabase
      .from('users')
      .select('subscription_status')
      .eq('id', session.user.id)
      .single()

    if (error) {
      console.error('Error fetching user subscription:', error)
      // Redirect to landing page on error
      return NextResponse.redirect(new URL('/', request.url))
    }

    // Check if subscription is active
    if (userData?.subscription_status !== 'active') {
      // Not subscribed - redirect to landing page
      return NextResponse.redirect(new URL('/', request.url))
    }

    // All checks passed - allow access
    return NextResponse.next()
  } catch (error) {
    console.error('Middleware error:', error)
    return NextResponse.redirect(new URL('/', request.url))
  }
}

/**
 * Configure which routes this middleware runs on
 */
export const config = {
  matcher: [
    '/workbook/:path*', // Protect all workbook routes
  ],
}
