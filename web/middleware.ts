import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { getProductConfigFromPath } from '@/types/platform'

/**
 * Middleware to protect routes and check subscription status.
 *
 * Protects:
 * - /workbook/* - Requires authentication (legacy route)
 * - /companion/* - Requires authentication + iOS subscription (platform='ios')
 * - /app/* - Requires authentication + web subscription (platform='web')
 *
 * Flow:
 * 1. Check if user is authenticated
 * 2. If not authenticated -> redirect to appropriate login
 * 3. Check subscription status based on platform
 * 4. If not subscribed -> redirect to pricing page
 * 5. If all checks pass -> allow access
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Get product config if this is a protected route
  const productConfig = getProductConfigFromPath(pathname)

  // Check if this is a protected route
  const isProtectedRoute =
    pathname.startsWith('/workbook') ||
    pathname.startsWith('/companion') ||
    pathname.startsWith('/app')

  if (!isProtectedRoute) {
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
    product: productConfig ? 'configured' : 'legacy',
  })

  // Check 1: User must be authenticated
  if (!user) {
    console.log('[MIDDLEWARE] No user found, redirecting to login')
    const loginUrl = productConfig
      ? new URL(productConfig.loginRedirect, request.url)
      : new URL('/auth/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Check 2: Subscription check for companion and app routes
  const REQUIRE_SUBSCRIPTION = true // Enable subscription checks

  if (REQUIRE_SUBSCRIPTION && productConfig?.requiresSubscription) {
    try {
      // Query subscriptions table for the appropriate platform
      const { data: subscriptionData, error } = await supabase
        .from('subscriptions')
        .select('id, platform, tier, status')
        .eq('user_id', user.id)
        .eq('platform', productConfig.platform)
        .in('status', ['active', 'trialing'])
        .maybeSingle()

      if (error) {
        console.error('[MIDDLEWARE] Error fetching subscription:', error)
        // On error, also check the legacy users table as fallback
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('subscription_status, subscription_tier')
          .eq('id', user.id)
          .single()

        if (userError || userData?.subscription_status !== 'active') {
          console.log('[MIDDLEWARE] No active subscription found (fallback check)')
          return NextResponse.redirect(
            new URL(productConfig.subscriptionRedirect, request.url)
          )
        }

        // Has legacy subscription, allow access
        console.log('[MIDDLEWARE] Access granted via legacy subscription')
        return response
      }

      // Check if user has an active subscription for this platform
      if (!subscriptionData) {
        console.log(
          `[MIDDLEWARE] No active ${productConfig.platform} subscription found`
        )

        // Also check legacy users table
        const { data: userData } = await supabase
          .from('users')
          .select('subscription_status, subscription_tier')
          .eq('id', user.id)
          .single()

        if (userData?.subscription_status !== 'active') {
          return NextResponse.redirect(
            new URL(productConfig.subscriptionRedirect, request.url)
          )
        }
      }

      console.log('[MIDDLEWARE] Subscription check passed:', {
        platform: productConfig.platform,
        tier: subscriptionData?.tier || 'legacy',
      })
    } catch (error) {
      console.error('[MIDDLEWARE] Subscription check error:', error)
      // Allow access on error for better UX during development
      return response
    }
  }

  // Legacy /workbook route - check users table
  if (pathname.startsWith('/workbook') && !productConfig) {
    const REQUIRE_LEGACY_SUBSCRIPTION = false // Set to true when ready

    if (REQUIRE_LEGACY_SUBSCRIPTION) {
      try {
        const { data: userData, error } = await supabase
          .from('users')
          .select('subscription_status')
          .eq('id', user.id)
          .single()

        if (error) {
          console.error('[MIDDLEWARE] Error fetching user subscription:', error)
          return response
        }

        if (userData?.subscription_status !== 'active') {
          console.log('[MIDDLEWARE] User does not have active subscription')
          return NextResponse.redirect(new URL('/', request.url))
        }
      } catch (error) {
        console.error('[MIDDLEWARE] Subscription check error:', error)
        return response
      }
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
    '/workbook/:path*', // Legacy workbook routes
    '/companion/:path*', // iOS Companion routes
    '/app/:path*', // Full Web App routes
  ],
}
