/**
 * Supabase Edge Function: Delete Account
 *
 * Permanently deletes a user account and all associated data.
 * Requires password re-authentication for security.
 *
 * This is required for Apple App Store compliance (Guideline 5.1.1).
 *
 * Flow:
 * 1. Verify user is authenticated
 * 2. Re-authenticate with password
 * 3. Delete user files from storage (avatars, images)
 * 4. Delete user from auth.users (cascades to all tables via FK)
 * 5. Return success confirmation
 *
 * Environment Variables Required:
 * - SUPABASE_URL
 * - SUPABASE_ANON_KEY
 * - SUPABASE_SERVICE_ROLE_KEY
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// =============================================================================
// CORS Headers
// =============================================================================

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// =============================================================================
// Types
// =============================================================================

interface DeleteAccountRequest {
  password: string;
}

interface DeleteAccountResponse {
  success: boolean;
  message: string;
  error?: string;
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
    // Parse request body
    const { password }: DeleteAccountRequest = await req.json();

    if (!password) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Password is required to delete your account',
        } as DeleteAccountResponse),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client with user JWT for auth verification
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

    const supabaseUser = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: { Authorization: req.headers.get('Authorization') || '' },
      },
    });

    // Get current user from JWT
    const { data: { user }, error: userError } = await supabaseUser.auth.getUser();

    if (userError || !user) {
      console.log('Delete account: User not authenticated');
      return new Response(
        JSON.stringify({
          success: false,
          error: 'You must be logged in to delete your account',
        } as DeleteAccountResponse),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Delete account: Verifying password for user ${user.id}`);

    // Re-authenticate with password to verify identity
    const { error: signInError } = await supabaseUser.auth.signInWithPassword({
      email: user.email!,
      password: password,
    });

    if (signInError) {
      console.log(`Delete account: Password verification failed for user ${user.id}`);
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Incorrect password. Please try again.',
        } as DeleteAccountResponse),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Delete account: Password verified for user ${user.id}`);

    // Initialize admin client for deletion operations
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Delete user files from storage (avatars bucket)
    try {
      const { data: avatarFiles } = await supabaseAdmin.storage
        .from('avatars')
        .list(user.id);

      if (avatarFiles && avatarFiles.length > 0) {
        const filePaths = avatarFiles.map((file) => `${user.id}/${file.name}`);
        await supabaseAdmin.storage.from('avatars').remove(filePaths);
        console.log(`Delete account: Deleted ${filePaths.length} avatar files for user ${user.id}`);
      }
    } catch (storageError) {
      // Log but don't fail - storage files are not critical
      console.error('Delete account: Storage cleanup failed:', storageError);
    }

    // Delete user files from storage (vision-boards bucket)
    try {
      const { data: visionBoardFiles } = await supabaseAdmin.storage
        .from('vision-boards')
        .list(user.id);

      if (visionBoardFiles && visionBoardFiles.length > 0) {
        const filePaths = visionBoardFiles.map((file) => `${user.id}/${file.name}`);
        await supabaseAdmin.storage.from('vision-boards').remove(filePaths);
        console.log(`Delete account: Deleted ${filePaths.length} vision board files for user ${user.id}`);
      }
    } catch (storageError) {
      // Log but don't fail - storage files are not critical
      console.error('Delete account: Vision board cleanup failed:', storageError);
    }

    // Delete user from auth.users (cascades to all tables via FK ON DELETE CASCADE)
    // Tables that will be cascade deleted:
    // - users (profile)
    // - workbook_progress
    // - journal_entries
    // - meditation_sessions
    // - guru_sessions
    // - promo_code_redemptions
    // - ai_conversations (if exists)
    // - vision_boards (if exists)
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id);

    if (deleteError) {
      console.error(`Delete account: Failed to delete user ${user.id}:`, deleteError);
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Failed to delete account. Please try again or contact support.',
        } as DeleteAccountResponse),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Delete account: Successfully deleted user ${user.id} and all associated data`);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Your account has been permanently deleted.',
      } as DeleteAccountResponse),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Delete account error:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'An unexpected error occurred',
      } as DeleteAccountResponse),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

/**
 * To deploy this function:
 *
 * 1. Deploy function:
 *    npx supabase functions deploy delete-account
 *
 * 2. Test locally:
 *    npx supabase functions serve delete-account
 *    curl -i --location --request POST 'http://localhost:54321/functions/v1/delete-account' \
 *      --header 'Authorization: Bearer <USER_JWT>' \
 *      --header 'Content-Type: application/json' \
 *      --data '{"password":"userpassword"}'
 *
 * 3. Call from React Native:
 *    const { data, error } = await supabase.functions.invoke('delete-account', {
 *      body: { password: 'userpassword' }
 *    });
 */
