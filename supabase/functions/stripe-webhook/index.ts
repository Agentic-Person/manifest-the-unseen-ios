/**
 * Supabase Edge Function: Stripe Webhook
 *
 * Handles Stripe webhook events for subscription lifecycle management.
 *
 * Handled Events:
 * - checkout.session.completed: New subscription created
 * - customer.subscription.updated: Subscription changed (upgrade/downgrade, renewal)
 * - customer.subscription.deleted: Subscription canceled
 * - invoice.payment_failed: Payment failed
 *
 * Environment Variables Required:
 * - SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY (for admin access to update subscriptions)
 * - STRIPE_SECRET_KEY
 * - STRIPE_WEBHOOK_SIGNING_SECRET
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@14.14.0?target=deno';

// =============================================================================
// Types
// =============================================================================

interface SubscriptionRecord {
  id?: string;
  user_id: string;
  platform: 'web';
  tier: 'novice' | 'awakening' | 'enlightenment';
  status: 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete' | 'incomplete_expired' | 'unpaid' | 'paused';
  provider: 'stripe';
  stripe_customer_id: string;
  stripe_subscription_id: string;
  stripe_price_id: string;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  billing_interval: 'month' | 'year';
}

// =============================================================================
// Tier Mapping
// =============================================================================

// Map price IDs or metadata to tiers (will be populated from metadata)
const DEFAULT_TIER = 'novice';

/**
 * Extract tier from subscription metadata or price metadata
 */
function extractTier(
  subscription: Stripe.Subscription
): 'novice' | 'awakening' | 'enlightenment' {
  // First check subscription metadata
  const subTier = subscription.metadata?.tier;
  if (subTier && ['novice', 'awakening', 'enlightenment'].includes(subTier)) {
    return subTier as 'novice' | 'awakening' | 'enlightenment';
  }

  // Check price metadata
  const priceItem = subscription.items.data[0];
  if (priceItem?.price?.metadata?.tier) {
    const priceTier = priceItem.price.metadata.tier;
    if (['novice', 'awakening', 'enlightenment'].includes(priceTier)) {
      return priceTier as 'novice' | 'awakening' | 'enlightenment';
    }
  }

  // Check product metadata
  const product = priceItem?.price?.product;
  if (typeof product === 'object' && product?.metadata?.tier) {
    const productTier = product.metadata.tier;
    if (['novice', 'awakening', 'enlightenment'].includes(productTier)) {
      return productTier as 'novice' | 'awakening' | 'enlightenment';
    }
  }

  console.warn('Could not determine tier from subscription, defaulting to novice');
  return DEFAULT_TIER;
}

/**
 * Extract billing interval from subscription
 */
function extractBillingInterval(
  subscription: Stripe.Subscription
): 'month' | 'year' {
  // Check metadata first
  const metaInterval = subscription.metadata?.billing_interval;
  if (metaInterval && ['month', 'year'].includes(metaInterval)) {
    return metaInterval as 'month' | 'year';
  }

  // Get from price interval
  const priceItem = subscription.items.data[0];
  const interval = priceItem?.price?.recurring?.interval;

  if (interval === 'year') {
    return 'year';
  }
  return 'month';
}

/**
 * Map Stripe subscription status to our status
 */
function mapStripeStatus(
  stripeStatus: Stripe.Subscription.Status
): SubscriptionRecord['status'] {
  const statusMap: Record<string, SubscriptionRecord['status']> = {
    active: 'active',
    canceled: 'canceled',
    past_due: 'past_due',
    trialing: 'trialing',
    incomplete: 'incomplete',
    incomplete_expired: 'incomplete_expired',
    unpaid: 'unpaid',
    paused: 'paused',
  };
  return statusMap[stripeStatus] || 'incomplete';
}

// =============================================================================
// Handler Functions
// =============================================================================

/**
 * Handle checkout.session.completed - New subscription created
 */
async function handleCheckoutCompleted(
  supabase: any,
  stripe: Stripe,
  session: Stripe.Checkout.Session
) {
  console.log('Processing checkout.session.completed');

  // Get user ID from session metadata
  const userId = session.metadata?.supabase_user_id;
  if (!userId) {
    console.error('No user ID in session metadata');
    return;
  }

  // Get the subscription
  if (!session.subscription) {
    console.error('No subscription in checkout session');
    return;
  }

  const subscription = await stripe.subscriptions.retrieve(
    session.subscription as string,
    { expand: ['items.data.price.product'] }
  );

  const tier = extractTier(subscription);
  const billingInterval = extractBillingInterval(subscription);

  // Build subscription record
  const subscriptionRecord: SubscriptionRecord = {
    user_id: userId,
    platform: 'web',
    tier,
    status: mapStripeStatus(subscription.status),
    provider: 'stripe',
    stripe_customer_id: subscription.customer as string,
    stripe_subscription_id: subscription.id,
    stripe_price_id: subscription.items.data[0]?.price?.id || '',
    current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
    current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    cancel_at_period_end: subscription.cancel_at_period_end,
    billing_interval: billingInterval,
  };

  // Check if subscription already exists for this user on web platform
  const { data: existing } = await supabase
    .from('subscriptions')
    .select('id')
    .eq('user_id', userId)
    .eq('platform', 'web')
    .single();

  if (existing) {
    // Update existing subscription
    const { error } = await supabase
      .from('subscriptions')
      .update(subscriptionRecord)
      .eq('id', existing.id);

    if (error) {
      console.error('Failed to update subscription:', error);
      throw error;
    }
    console.log(`Updated subscription for user ${userId.substring(0, 8)}...`);
  } else {
    // Insert new subscription
    const { error } = await supabase
      .from('subscriptions')
      .insert(subscriptionRecord);

    if (error) {
      console.error('Failed to insert subscription:', error);
      throw error;
    }
    console.log(`Created subscription for user ${userId.substring(0, 8)}...`);
  }

  // Update user's subscription tier in users table
  await supabase
    .from('users')
    .update({
      subscription_tier: tier,
      subscription_status: subscriptionRecord.status,
    })
    .eq('id', userId);

  console.log(`Checkout completed: tier=${tier}, interval=${billingInterval}`);
}

/**
 * Handle customer.subscription.updated - Subscription changed
 */
async function handleSubscriptionUpdated(
  supabase: any,
  subscription: Stripe.Subscription
) {
  console.log('Processing customer.subscription.updated');

  const userId = subscription.metadata?.supabase_user_id;

  // If no user ID in metadata, try to find by stripe_subscription_id
  let targetUserId = userId;
  if (!targetUserId) {
    const { data: existing } = await supabase
      .from('subscriptions')
      .select('user_id')
      .eq('stripe_subscription_id', subscription.id)
      .single();

    if (existing?.user_id) {
      targetUserId = existing.user_id;
    }
  }

  if (!targetUserId) {
    console.error('Could not find user for subscription:', subscription.id);
    return;
  }

  const tier = extractTier(subscription);
  const billingInterval = extractBillingInterval(subscription);

  // Update subscription record
  const updateData = {
    tier,
    status: mapStripeStatus(subscription.status),
    stripe_price_id: subscription.items.data[0]?.price?.id || '',
    current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
    current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    cancel_at_period_end: subscription.cancel_at_period_end,
    billing_interval: billingInterval,
  };

  const { error } = await supabase
    .from('subscriptions')
    .update(updateData)
    .eq('stripe_subscription_id', subscription.id);

  if (error) {
    console.error('Failed to update subscription:', error);
    throw error;
  }

  // Update user's subscription tier
  await supabase
    .from('users')
    .update({
      subscription_tier: tier,
      subscription_status: updateData.status,
    })
    .eq('id', targetUserId);

  console.log(`Subscription updated: tier=${tier}, status=${updateData.status}`);
}

/**
 * Handle customer.subscription.deleted - Subscription canceled
 */
async function handleSubscriptionDeleted(
  supabase: any,
  subscription: Stripe.Subscription
) {
  console.log('Processing customer.subscription.deleted');

  // Find the subscription in our database
  const { data: existing } = await supabase
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_subscription_id', subscription.id)
    .single();

  if (!existing) {
    console.warn('Subscription not found in database:', subscription.id);
    return;
  }

  // Update subscription status to canceled
  const { error } = await supabase
    .from('subscriptions')
    .update({
      status: 'canceled',
      cancel_at_period_end: true,
    })
    .eq('stripe_subscription_id', subscription.id);

  if (error) {
    console.error('Failed to update subscription:', error);
    throw error;
  }

  // Downgrade user to free tier
  await supabase
    .from('users')
    .update({
      subscription_tier: 'free',
      subscription_status: 'canceled',
    })
    .eq('id', existing.user_id);

  console.log(`Subscription canceled for user ${existing.user_id.substring(0, 8)}...`);
}

/**
 * Handle invoice.payment_failed - Payment failed
 */
async function handlePaymentFailed(
  supabase: any,
  invoice: Stripe.Invoice
) {
  console.log('Processing invoice.payment_failed');

  const subscriptionId = invoice.subscription as string;
  if (!subscriptionId) {
    console.warn('No subscription ID in failed invoice');
    return;
  }

  // Find the subscription
  const { data: existing } = await supabase
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_subscription_id', subscriptionId)
    .single();

  if (!existing) {
    console.warn('Subscription not found for failed payment');
    return;
  }

  // Update subscription status to past_due
  const { error } = await supabase
    .from('subscriptions')
    .update({ status: 'past_due' })
    .eq('stripe_subscription_id', subscriptionId);

  if (error) {
    console.error('Failed to update subscription status:', error);
  }

  // Update user's subscription status
  await supabase
    .from('users')
    .update({ subscription_status: 'past_due' })
    .eq('id', existing.user_id);

  console.log(`Payment failed for subscription ${subscriptionId}`);

  // TODO: Send email notification to user about failed payment
}

// =============================================================================
// Main Handler
// =============================================================================

serve(async (req) => {
  // Webhooks don't need CORS but must be POST
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    // Initialize Stripe
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SIGNING_SECRET');

    if (!stripeSecretKey || !webhookSecret) {
      throw new Error('Stripe configuration error');
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });

    // Get the signature from headers
    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      throw new Error('No Stripe signature found');
    }

    // Get the raw body
    const body = await req.text();

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = await stripe.webhooks.constructEventAsync(
        body,
        signature,
        webhookSecret
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return new Response(
        JSON.stringify({ error: 'Invalid signature' }),
        { status: 400 }
      );
    }

    console.log(`Received webhook event: ${event.type}`);

    // Initialize Supabase with service role key for admin access
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(supabase, stripe, session);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(supabase, subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(supabase, subscription);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(supabase, invoice);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Return success
    return new Response(
      JSON.stringify({ received: true }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Webhook error:', error);

    return new Response(
      JSON.stringify({ error: error.message || 'Webhook handler failed' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
});

/**
 * To deploy this function:
 *
 * 1. Set environment variables:
 *    npx supabase secrets set STRIPE_SECRET_KEY=sk_live_...
 *    npx supabase secrets set STRIPE_WEBHOOK_SIGNING_SECRET=whsec_...
 *    npx supabase secrets set SUPABASE_SERVICE_ROLE_KEY=eyJ... (from Supabase dashboard)
 *
 * 2. Deploy function:
 *    npx supabase functions deploy stripe-webhook
 *
 * 3. Configure webhook in Stripe Dashboard:
 *    - URL: https://[project-ref].supabase.co/functions/v1/stripe-webhook
 *    - Events:
 *      - checkout.session.completed
 *      - customer.subscription.updated
 *      - customer.subscription.deleted
 *      - invoice.payment_failed
 *
 * 4. Test with Stripe CLI:
 *    stripe listen --forward-to localhost:54321/functions/v1/stripe-webhook
 *    stripe trigger checkout.session.completed
 *
 * Pricing Tiers (set in Stripe product/price metadata):
 * - novice = Seeker ($7.99/mo, $69.99/yr)
 * - awakening = Awakening ($18.99/mo, $189.99/yr)
 * - enlightenment = Enlightenment ($29.99/mo, $279.99/yr)
 */
