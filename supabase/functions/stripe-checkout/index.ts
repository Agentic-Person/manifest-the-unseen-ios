/**
 * Supabase Edge Function: Stripe Checkout
 *
 * Creates Stripe Checkout sessions for web subscription purchases.
 *
 * Flow:
 * 1. Authenticate user via JWT
 * 2. Create or retrieve Stripe customer
 * 3. Create checkout session with price, tier, and billing interval
 * 4. Return checkout URL and session ID
 *
 * Environment Variables Required:
 * - SUPABASE_URL
 * - SUPABASE_ANON_KEY
 * - STRIPE_SECRET_KEY
 * - WEB_APP_URL (for success/cancel redirects)
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

interface CheckoutRequest {
  priceId: string;
  tier: 'novice' | 'awakening' | 'enlightenment';
  billingInterval: 'month' | 'year';
  successUrl?: string;
  cancelUrl?: string;
}

interface CheckoutResponse {
  checkoutUrl: string;
  sessionId: string;
}

// =============================================================================
// Tier Configuration
// =============================================================================

// Map tier names to display names
const TIER_DISPLAY_NAMES: Record<string, string> = {
  novice: 'Seeker',
  awakening: 'Awakening',
  enlightenment: 'Enlightenment',
};

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Get or create a Stripe customer for the user
 */
async function getOrCreateStripeCustomer(
  stripe: Stripe,
  supabase: any,
  userId: string,
  email: string
): Promise<string> {
  // Check if user already has a Stripe customer ID
  const { data: subscription, error: subError } = await supabase
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', userId)
    .eq('platform', 'web')
    .eq('provider', 'stripe')
    .single();

  if (subscription?.stripe_customer_id) {
    // Verify customer still exists in Stripe
    try {
      await stripe.customers.retrieve(subscription.stripe_customer_id);
      return subscription.stripe_customer_id;
    } catch {
      // Customer was deleted in Stripe, create a new one
      console.log('Stripe customer not found, creating new one');
    }
  }

  // Also check users table for stripe_customer_id
  const { data: userData } = await supabase
    .from('users')
    .select('stripe_customer_id')
    .eq('id', userId)
    .single();

  if (userData?.stripe_customer_id) {
    try {
      await stripe.customers.retrieve(userData.stripe_customer_id);
      return userData.stripe_customer_id;
    } catch {
      console.log('Stripe customer from users table not found, creating new one');
    }
  }

  // Create new Stripe customer
  const customer = await stripe.customers.create({
    email,
    metadata: {
      supabase_user_id: userId,
    },
  });

  // Store customer ID in users table for future reference
  await supabase
    .from('users')
    .update({ stripe_customer_id: customer.id })
    .eq('id', userId);

  return customer.id;
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

    // Parse request body
    const {
      priceId,
      tier,
      billingInterval,
      successUrl,
      cancelUrl,
    }: CheckoutRequest = await req.json();

    // Validate required fields
    if (!priceId) {
      throw new Error('priceId is required');
    }

    if (!tier || !['novice', 'awakening', 'enlightenment'].includes(tier)) {
      throw new Error('Valid tier (novice, awakening, enlightenment) is required');
    }

    if (!billingInterval || !['month', 'year'].includes(billingInterval)) {
      throw new Error('Valid billingInterval (month, year) is required');
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

    console.log(`Stripe Checkout request: tier=${tier}, interval=${billingInterval}`);

    // Get or create Stripe customer
    const customerId = await getOrCreateStripeCustomer(
      stripe,
      supabase,
      user.id,
      user.email || ''
    );

    // Build success and cancel URLs
    const webAppUrl = Deno.env.get('WEB_APP_URL') || 'https://manifesttheunseen.com';
    const finalSuccessUrl = successUrl || `${webAppUrl}/subscription/success?session_id={CHECKOUT_SESSION_ID}`;
    const finalCancelUrl = cancelUrl || `${webAppUrl}/subscription/canceled`;

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: finalSuccessUrl,
      cancel_url: finalCancelUrl,
      subscription_data: {
        metadata: {
          tier,
          billing_interval: billingInterval,
          supabase_user_id: user.id,
          platform: 'web',
        },
      },
      metadata: {
        tier,
        billing_interval: billingInterval,
        supabase_user_id: user.id,
        platform: 'web',
      },
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      customer_update: {
        address: 'auto',
        name: 'auto',
      },
    });

    if (!session.url) {
      throw new Error('Failed to create checkout session');
    }

    // Return checkout URL and session ID
    const response: CheckoutResponse = {
      checkoutUrl: session.url,
      sessionId: session.id,
    };

    return new Response(
      JSON.stringify(response),
      {
        headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Stripe Checkout error:', error);

    return new Response(
      JSON.stringify({
        error: error.message || 'An error occurred creating checkout session',
      }),
      {
        status: 400,
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
 * 2. Deploy function:
 *    npx supabase functions deploy stripe-checkout
 *
 * 3. Test locally:
 *    npx supabase functions serve stripe-checkout
 *    curl -i --location --request POST 'http://localhost:54321/functions/v1/stripe-checkout' \
 *      --header 'Authorization: Bearer YOUR_USER_JWT' \
 *      --header 'Content-Type: application/json' \
 *      --data '{
 *        "priceId": "price_xxx",
 *        "tier": "awakening",
 *        "billingInterval": "month"
 *      }'
 *
 * 4. Call from web app:
 *    const { data, error } = await supabase.functions.invoke('stripe-checkout', {
 *      body: {
 *        priceId: 'price_xxx',
 *        tier: 'awakening',
 *        billingInterval: 'month'
 *      }
 *    });
 *    if (data?.checkoutUrl) {
 *      window.location.href = data.checkoutUrl;
 *    }
 */
