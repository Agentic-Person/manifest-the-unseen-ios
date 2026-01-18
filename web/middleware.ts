import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

/**
 * Middleware to protect routes and check subscription status.
 *
 * Protects:
 * - /workbook/* - Requires authentication (subscription check optional for testing)
 *
 * Flow:
 * 1. Check if user is authenticated
 * 2. If not authenticated -> redirect to /auth/login
 * 3. If authenticated, optionally check subscription_status in users table
 * 4. If all checks pass -> allow access
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only protect /workbook/* routes
  if (!pathname.startsWith('/workbook')) {
    return NextResponse.next()
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('[MIDDLEWARE] Missing Supabase environment variables')
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // Create response object that we'll use to set/update cookies
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Create Supabase server client with cookie handlers
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          request.cookies.set(name, value)
        )
        response = NextResponse.next({
          request,
        })
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        )
      },
    },
  })

  // Get the user session
  const {
    data: { user },
  } = await supabase.auth.getUser()

  console.log('[MIDDLEWARE] Auth check:', {
    pathname,
    hasUser: !!user,
    userEmail: user?.email,
  })

  // Check 1: User must be authenticated
  if (!user) {
    console.log('[MIDDLEWARE] No user found, redirecting to login')
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Check 2: OPTIONAL - User must have active subscription
  // TODO: Enable this check when subscription system is fully implemented
  const REQUIRE_SUBSCRIPTION = false // Set to true when ready for production

  if (REQUIRE_SUBSCRIPTION) {
    try {
      const { data: userData, error } = await supabase
        .from('users')
        .select('subscription_status')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error('[MIDDLEWARE] Error fetching user subscription:', error)
        // Allow access even on error during testing
        return response
      }

      // Check if subscription is active
      if (userData?.subscription_status !== 'active') {
        console.log('[MIDDLEWARE] User does not have active subscription')
        // Redirect to landing page or subscription page
        return NextResponse.redirect(new URL('/', request.url))
      }
    } catch (error) {
      console.error('[MIDDLEWARE] Subscription check error:', error)
      // Allow access even on error during testing
      return response
    }
  }

  // All checks passed - allow access
  console.log('[MIDDLEWARE] Access granted to:', pathname)
  return response
}

/**
 * Configure which routes this middleware runs on
 */
export const config = {
  matcher: [
    '/workbook/:path*', // Protect all workbook routes
  ],
}
