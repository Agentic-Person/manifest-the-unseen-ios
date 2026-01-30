/**
 * Supabase Edge Function: Stripe Customer Portal
 *
 * Creates Stripe Customer Portal sessions for subscription management.
 * Allows users to manage their subscription, update payment methods,
 * view invoices, and cancel subscriptions.
 *
 * Flow:
 * 1. Authenticate user via JWT
 * 2. Retrieve user's Stripe customer ID
 * 3. Create Customer Portal session
 * 4. Return portal URL
 *
 * Environment Variables Required:
 * - SUPABASE_URL
 * - SUPABASE_ANON_KEY
 * - STRIPE_SECRET_KEY
 * - WEB_APP_URL (for return URL)
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@14.14.0?target=deno';

// =============================================================================
// CORS Headers - Restrict to known origins for security
// =============================================================================

const ALLOWED_ORIGINS = [
  'https://manifesttheunseen.com',
  'https://www.manifesttheunseen.com',
  'https://zbyszxtwzoylyygtexdr.supabase.co', // Supabase project
  'http://localhost:3000', // Local development
  'http://localhost:3001',
];

function getCorsHeaders(req: Request) {
  const origin = req.headers.get('origin') || '';
  const allowedOrigin = !origin || ALLOWED_ORIGINS.includes(origin)
    ? (origin || ALLOWED_ORIGINS[0])
    : ALLOWED_ORIGINS[0];

  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
}

// Legacy corsHeaders for backwards compatibility
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// =============================================================================
// Types
// =============================================================================

interface PortalRequest {
  returnUrl?: string;
}

interface PortalResponse {
  portalUrl: string;
}

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Get Stripe customer ID for the authenticated user
 */
async function getStripeCustomerId(
  supabase: any,
  userId: string
): Promise<string | null> {
  // First check subscriptions table
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', userId)
    .eq('platform', 'web')
    .eq('provider', 'stripe')
    .single();

  if (subscription?.stripe_customer_id) {
    return subscription.stripe_customer_id;
  }

  // Fallback to users table
  const { data: userData } = await supabase
    .from('users')
    .select('stripe_customer_id')
    .eq('id', userId)
    .single();

  return userData?.stripe_customer_id || null;
}

// =============================================================================
// Main Handler
// =============================================================================

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      throw new Error('Method not allowed');
    }

    // Parse request body (may be empty)
    let returnUrl: string | undefined;
    try {
      const body = await req.json();
      returnUrl = body?.returnUrl;
    } catch {
      // Empty body is ok
    }

    // Initialize Stripe
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      throw new Error('Stripe configuration error');
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });

    // Initialize Supabase client with user's JWT
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Authenticate user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    console.log('Stripe Portal request received');

    // Get Stripe customer ID
    const customerId = await getStripeCustomerId(supabase, user.id);
    if (!customerId) {
      throw new Error('No subscription found. Please subscribe first.');
    }

    // Verify customer exists in Stripe
    try {
      await stripe.customers.retrieve(customerId);
    } catch {
      throw new Error('Stripe customer not found. Please contact support.');
    }

    // Build return URL
    const webAppUrl = Deno.env.get('WEB_APP_URL') || 'https://manifesttheunseen.com';
    const finalReturnUrl = returnUrl || `${webAppUrl}/account`;

    // Create Customer Portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: finalReturnUrl,
    });

    if (!session.url) {
      throw new Error('Failed to create portal session');
    }

    // Return portal URL
    const response: PortalResponse = {
      portalUrl: session.url,
    };

    return new Response(
      JSON.stringify(response),
      {
        headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Stripe Portal error:', error);

    // Determine appropriate status code
    let statusCode = 400;
    if (error.message === 'Unauthorized') {
      statusCode = 401;
    } else if (error.message.includes('No subscription found')) {
      statusCode = 404;
    }

    return new Response(
      JSON.stringify({
        error: error.message || 'An error occurred creating portal session',
      }),
      {
        status: statusCode,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

/**
 * To deploy this function:
 *
 * 1. Set environment variables:
 *    npx supabase secrets set STRIPE_SECRET_KEY=sk_live_...
 *    npx supabase secrets set WEB_APP_URL=https://manifesttheunseen.com
 *
 * 2. Configure Customer Portal in Stripe Dashboard:
 *    - Go to Settings > Billing > Customer Portal
 *    - Enable features you want users to access:
 *      - Update payment methods
 *      - View invoices/billing history
 *      - Cancel subscription
 *      - Switch plans (upgrade/downgrade)
 *    - Add your products/prices
 *    - Customize branding
 *
 * 3. Deploy function:
 *    npx supabase functions deploy stripe-portal
 *
 * 4. Test locally:
 *    npx supabase functions serve stripe-portal
 *    curl -i --location --request POST 'http://localhost:54321/functions/v1/stripe-portal' \
 *      --header 'Authorization: Bearer YOUR_USER_JWT' \
 *      --header 'Content-Type: application/json' \
 *      --data '{}'
 *
 * 5. Call from web app:
 *    const { data, error } = await supabase.functions.invoke('stripe-portal', {
 *      body: { returnUrl: '/account' }  // optional
 *    });
 *    if (data?.portalUrl) {
 *      window.location.href = data.portalUrl;
 *    }
 *
 * Customer Portal Features:
 * - Update payment method
 * - View and download invoices
 * - Cancel subscription (with confirmation)
 * - Upgrade/downgrade between tiers
 * - Update billing information
 */
