/**
 * Supabase Edge Function: Validate Promo Code
 *
 * Validates promotional codes, checks remaining slots, and records redemptions.
 * Works in conjunction with Apple Offer Codes for actual discount application.
 *
 * Flow:
 * 1. Receive promo code from app or landing page
 * 2. Validate code exists and is active
 * 3. Check remaining redemption slots
 * 4. Check if user already redeemed (if authenticated)
 * 5. Return discount info or error
 * 6. Optionally record redemption (when checkOnly: false)
 *
 * Environment Variables Required:
 * - SUPABASE_URL
 * - SUPABASE_ANON_KEY
 * - SUPABASE_SERVICE_ROLE_KEY (for recording redemptions)
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// =============================================================================
// CORS Headers
// =============================================================================

// CORS Headers - Restrict to known origins for security
// See SecurityAudit.md H4: Overly permissive CORS
const ALLOWED_ORIGINS = [
  'https://manifesttheunseen.com',
  'https://www.manifesttheunseen.com',
  'https://zbyszxtwzoylyygtexdr.supabase.co', // Supabase project
];

function getCorsHeaders(req: Request) {
  const origin = req.headers.get('origin') || '';
  // Allow the origin if it's in our list, otherwise use first allowed origin
  // For mobile apps, origin may be null/empty - allow those requests
  const allowedOrigin = !origin || ALLOWED_ORIGINS.includes(origin)
    ? (origin || '*')
    : ALLOWED_ORIGINS[0];

  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };
}

// =============================================================================
// Types
// =============================================================================

interface ValidateRequest {
  code: string;
  tier?: string;
  checkOnly?: boolean;
}

interface PromoCode {
  id: string;
  code: string;
  description: string;
  discount_percentage: number;
  discount_duration_months: number;
  max_redemptions: number;
  current_redemptions: number;
  eligible_tiers: string[];
  apple_offer_id: string | null;
  is_active: boolean;
  starts_at: string | null;
  expires_at: string | null;
}

interface ValidationResponse {
  valid: boolean;
  code?: string;
  description?: string;
  discountPercentage?: number;
  discountDurationMonths?: number;
  remainingSlots?: number;
  eligibleTiers?: string[];
  appleOfferId?: string | null;
  error?: string;
  redeemed?: boolean;
}

// =============================================================================
// Main Handler
// =============================================================================

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Parse request body
    const { code, tier, checkOnly = true }: ValidateRequest = await req.json();

    if (!code) {
      return new Response(
        JSON.stringify({ valid: false, error: 'Promo code is required' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const normalizedCode = code.toUpperCase().trim();
    console.log(`Validating promo code: ${normalizedCode}`);

    // Initialize Supabase clients
    // SECURITY FIX (SecurityAudit.md C4): Use anon+JWT for most operations
    // Service role only needed for updating promo_codes counter

    // Anon client for public promo code lookups (RLS allows public SELECT on active codes)
    const supabaseAnon = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // User client with JWT for authenticated operations
    const supabaseUser = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization') || '' },
        },
      }
    );

    // Admin client ONLY for counter updates (requires service role)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get user ID if authenticated
    const { data: { user } } = await supabaseUser.auth.getUser();
    const userId = user?.id;

    // Look up promo code (uses anon client - RLS allows public SELECT on active codes)
    const { data: promoCode, error: fetchError } = await supabaseAnon
      .from('promo_codes')
      .select('*')
      .eq('code', normalizedCode)
      .eq('is_active', true)
      .single();

    if (fetchError || !promoCode) {
      console.log(`Promo code not found: ${normalizedCode}`);
      return new Response(
        JSON.stringify({ valid: false, error: 'Invalid promo code' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const promo = promoCode as PromoCode;

    // Check if code has started
    if (promo.starts_at && new Date(promo.starts_at) > new Date()) {
      return new Response(
        JSON.stringify({ valid: false, error: 'This promo code is not yet active' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if code has expired
    if (promo.expires_at && new Date(promo.expires_at) < new Date()) {
      return new Response(
        JSON.stringify({ valid: false, error: 'This promo code has expired' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check remaining slots
    const remainingSlots = promo.max_redemptions - promo.current_redemptions;
    if (remainingSlots <= 0) {
      return new Response(
        JSON.stringify({
          valid: false,
          error: 'This promo code has reached its redemption limit',
          remainingSlots: 0,
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check tier eligibility
    if (tier && !promo.eligible_tiers.includes(tier.toLowerCase())) {
      return new Response(
        JSON.stringify({
          valid: false,
          error: `This promo code is not valid for the ${tier} tier`,
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user already redeemed (if authenticated)
    // Uses user client with JWT - RLS allows users to read own redemptions
    if (userId) {
      const { data: existingRedemption } = await supabaseUser
        .from('promo_code_redemptions')
        .select('id')
        .eq('promo_code_id', promo.id)
        .eq('user_id', userId)
        .single();

      if (existingRedemption) {
        return new Response(
          JSON.stringify({ valid: false, error: 'You have already used this promo code' }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Build success response
    const response: ValidationResponse = {
      valid: true,
      code: promo.code,
      description: promo.description,
      discountPercentage: promo.discount_percentage,
      discountDurationMonths: promo.discount_duration_months,
      remainingSlots,
      eligibleTiers: promo.eligible_tiers,
      appleOfferId: promo.apple_offer_id,
    };

    // If checkOnly, return validation result without recording redemption
    if (checkOnly) {
      console.log(`Promo code valid (check only): ${normalizedCode}`);
      return new Response(
        JSON.stringify(response),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Record redemption (requires authenticated user)
    if (!userId) {
      console.log(`Promo code valid but user not authenticated: ${normalizedCode}`);
      return new Response(
        JSON.stringify({
          ...response,
          note: 'Redemption not recorded - user not authenticated',
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Insert redemption record
    // Uses user client with JWT - RLS policy "Users can insert own redemptions" allows this
    const { error: redemptionError } = await supabaseUser
      .from('promo_code_redemptions')
      .insert({
        promo_code_id: promo.id,
        user_id: userId,
        subscription_tier: tier || null,
      });

    if (redemptionError) {
      console.error('Redemption insert error:', redemptionError);
      // Check if it's a unique constraint violation (already redeemed)
      if (redemptionError.code === '23505') {
        return new Response(
          JSON.stringify({ valid: false, error: 'You have already used this promo code' }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      throw new Error('Failed to record redemption');
    }

    // Increment redemption count
    const { error: updateError } = await supabaseAdmin
      .from('promo_codes')
      .update({ current_redemptions: promo.current_redemptions + 1 })
      .eq('id', promo.id);

    if (updateError) {
      console.error('Update redemption count error:', updateError);
      // Don't throw - redemption was recorded, counter is secondary
    }

    // H3 Security Fix: Don't log full user ID
    console.log(`Promo code redeemed: ${normalizedCode}`);

    return new Response(
      JSON.stringify({
        ...response,
        remainingSlots: remainingSlots - 1,
        redeemed: true,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Validate promo error:', error);

    return new Response(
      JSON.stringify({
        valid: false,
        error: error.message || 'An error occurred',
      }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

/**
 * To deploy this function:
 *
 * 1. Deploy function:
 *    npx supabase functions deploy validate-promo
 *
 * 2. Test locally:
 *    npx supabase functions serve validate-promo
 *    curl -i --location --request POST 'http://localhost:54321/functions/v1/validate-promo' \
 *      --header 'Content-Type: application/json' \
 *      --data '{"code":"EARLY50","checkOnly":true}'
 *
 * 3. Call from React Native:
 *    const { data, error } = await supabase.functions.invoke('validate-promo', {
 *      body: { code: 'EARLY50', tier: 'novice', checkOnly: true }
 *    });
 *
 * 4. Call from landing page (unauthenticated):
 *    fetch(`${SUPABASE_URL}/functions/v1/validate-promo`, {
 *      method: 'POST',
 *      headers: {
 *        'Content-Type': 'application/json',
 *        'apikey': SUPABASE_ANON_KEY,
 *      },
 *      body: JSON.stringify({ code: 'EARLY50', checkOnly: true }),
 *    });
 */
