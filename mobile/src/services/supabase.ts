/**
 * Supabase Client Configuration
 *
 * Configures and exports the Supabase client for use throughout the app.
 * Integrates with React Native AsyncStorage for session persistence.
 */

import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Database } from '../types/database';

/**
 * Environment Variables
 * These should be set in your .env file
 */
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

/**
 * Validate Environment Variables
 */
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file.'
  );
}

/**
 * Supabase Client
 *
 * Configured with:
 * - AsyncStorage for session persistence
 * - Auto refresh tokens
 * - Detect session in URL (for magic links)
 *
 * @example
 * ```tsx
 * import { supabase } from '@/services/supabase';
 *
 * // Query data
 * const { data, error } = await supabase
 *   .from('journal_entries')
 *   .select('*')
 *   .order('created_at', { ascending: false });
 *
 * // Real-time subscription
 * const subscription = supabase
 *   .channel('journal_changes')
 *   .on('postgres_changes', {
 *     event: '*',
 *     schema: 'public',
 *     table: 'journal_entries'
 *   }, payload => {
 *     console.log('Change received!', payload);
 *   })
 *   .subscribe();
 * ```
 */
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // Not needed for mobile
  },
});

/**
 * Auth Helpers
 */

/**
 * Sign In with Email
 */
export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
};

/**
 * Sign Up with Email
 */
export const signUpWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;
  return data;
};

/**
 * Sign In with Apple
 */
export const signInWithApple = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'apple',
  });

  if (error) throw error;
  return data;
};

/**
 * Sign Out
 */
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

/**
 * Get Current Session
 */
export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
};

/**
 * Get Current User
 */
export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data.user;
};

/**
 * Reset Password
 */
export const resetPassword = async (email: string) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'manifesttheunseen://reset-password',
  });

  if (error) throw error;
  return data;
};

/**
 * Update User Password
 */
export const updatePassword = async (newPassword: string) => {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) throw error;
  return data;
};

/**
 * Database Helpers
 */

/**
 * Get User Profile
 */
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
};

/**
 * Update User Profile
 */
export const updateUserProfile = async (
  userId: string,
  updates: Partial<Database['public']['Tables']['users']['Update']>
) => {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Storage Helpers
 */

/**
 * Upload File to Storage
 */
export const uploadFile = async (
  bucket: string,
  path: string,
  file: File | Blob
) => {
  const { data, error } = await supabase.storage.from(bucket).upload(path, file);

  if (error) throw error;
  return data;
};

/**
 * Get Public URL for File
 */
export const getPublicUrl = (bucket: string, path: string) => {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
};

/**
 * Delete File from Storage
 */
export const deleteFile = async (bucket: string, path: string) => {
  const { data, error } = await supabase.storage.from(bucket).remove([path]);

  if (error) throw error;
  return data;
};

/**
 * Real-time Helpers
 */

/**
 * Subscribe to Table Changes
 */
export const subscribeToTable = (
  table: string,
  callback: (payload: any) => void
) => {
  const subscription = supabase
    .channel(`${table}_changes`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: table,
      },
      callback
    )
    .subscribe();

  return subscription;
};

/**
 * Unsubscribe from Channel
 */
export const unsubscribe = async (subscription: any) => {
  await supabase.removeChannel(subscription);
};

/**
 * Type Exports
 * Export database types for use throughout the app
 */
export type { Database } from '../types/database';
