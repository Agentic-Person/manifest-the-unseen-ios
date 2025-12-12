/**
 * Secure Storage Utility
 *
 * Encrypted storage operations using expo-secure-store for sensitive data.
 * Provides a consistent API for storing/retrieving encrypted data with fallback to AsyncStorage for non-sensitive data.
 *
 * Security Features:
 * - Uses device hardware encryption (Keychain on iOS, KeyStore on Android)
 * - Automatic encryption/decryption of sensitive data
 * - Backward compatibility during migration from AsyncStorage
 * - Type-safe storage operations
 *
 * Usage:
 * ```typescript
 * // Store sensitive data (encrypted)
 * await SecureStorage.setItem('auth_token', token);
 *
 * // Retrieve sensitive data (decrypted)
 * const token = await SecureStorage.getItem('auth_token');
 *
 * // Remove sensitive data
 * await SecureStorage.removeItem('auth_token');
 * ```
 */

import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

/**
 * Storage keys for sensitive data (stored in SecureStore)
 */
export enum SecureStorageKeys {
  // Authentication tokens (highest security priority)
  AUTH_ACCESS_TOKEN = 'secure_auth_access_token',
  AUTH_REFRESH_TOKEN = 'secure_auth_refresh_token',
  AUTH_SESSION = 'secure_auth_session',

  // User credentials
  USER_ID = 'secure_user_id',

  // Encryption keys for journal entries
  JOURNAL_ENCRYPTION_KEY = 'secure_journal_encryption_key',

  // Biometric/PIN data
  BIOMETRIC_ENABLED = 'secure_biometric_enabled',
}

/**
 * Storage keys for non-sensitive data (stored in AsyncStorage)
 */
export enum AsyncStorageKeys {
  USER_PROFILE = 'user_profile',
  APP_SETTINGS = 'app_settings',
  ONBOARDING_COMPLETE = 'onboarding_complete',
  LAST_SYNC = 'last_sync',
}

/**
 * Secure Storage Options
 */
interface SecureStorageOptions {
  /**
   * Require authentication (biometric/PIN) to access the value
   * iOS: Uses kSecAccessControlBiometryCurrentSet
   * Android: Uses REQUIRE_AUTHENTICATION
   */
  requireAuthentication?: boolean;

  /**
   * Authentication prompt message (iOS only)
   */
  authenticationPrompt?: string;
}

/**
 * SecureStorage Class
 * Handles encrypted storage operations with fallback mechanisms
 */
class SecureStorageManager {
  private isAvailable: boolean = true;

  constructor() {
    this.checkAvailability();
  }

  /**
   * Check if SecureStore is available on this platform
   */
  private async checkAvailability(): Promise<void> {
    try {
      // SecureStore is available on iOS and Android, but not on web
      if (Platform.OS === 'web') {
        this.isAvailable = false;
        console.warn('[SecureStorage] SecureStore not available on web, falling back to AsyncStorage');
      }
    } catch (error) {
      console.error('[SecureStorage] Error checking availability:', error);
      this.isAvailable = false;
    }
  }

  /**
   * Store a value securely with encryption
   *
   * @param key - Storage key (use SecureStorageKeys enum)
   * @param value - Value to store
   * @param options - Storage options
   */
  async setItem(
    key: string,
    value: string,
    options?: SecureStorageOptions
  ): Promise<void> {
    try {
      if (!this.isAvailable) {
        // Fallback to AsyncStorage if SecureStore not available
        console.warn(`[SecureStorage] Using AsyncStorage fallback for key: ${key}`);
        await AsyncStorage.setItem(key, value);
        return;
      }

      const secureStoreOptions: SecureStore.SecureStoreOptions = {};

      // iOS-specific authentication options
      if (Platform.OS === 'ios' && options?.requireAuthentication) {
        secureStoreOptions.requireAuthentication = true;
        secureStoreOptions.authenticationPrompt =
          options.authenticationPrompt || 'Authenticate to access secure data';
      }

      await SecureStore.setItemAsync(key, value, secureStoreOptions);
      console.log(`[SecureStorage] Successfully stored encrypted value for key: ${key}`);
    } catch (error) {
      console.error(`[SecureStorage] Failed to store value for key: ${key}`, error);
      throw new Error(`Failed to securely store ${key}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Retrieve a securely stored value (automatically decrypted)
   *
   * @param key - Storage key (use SecureStorageKeys enum)
   * @param options - Retrieval options
   * @returns The decrypted value, or null if not found
   */
  async getItem(
    key: string,
    options?: SecureStorageOptions
  ): Promise<string | null> {
    try {
      if (!this.isAvailable) {
        // Fallback to AsyncStorage if SecureStore not available
        console.warn(`[SecureStorage] Using AsyncStorage fallback for key: ${key}`);
        return await AsyncStorage.getItem(key);
      }

      const secureStoreOptions: SecureStore.SecureStoreOptions = {};

      // iOS-specific authentication options
      if (Platform.OS === 'ios' && options?.requireAuthentication) {
        secureStoreOptions.requireAuthentication = true;
        secureStoreOptions.authenticationPrompt =
          options.authenticationPrompt || 'Authenticate to access secure data';
      }

      const value = await SecureStore.getItemAsync(key, secureStoreOptions);

      if (value) {
        console.log(`[SecureStorage] Successfully retrieved encrypted value for key: ${key}`);
      } else {
        console.log(`[SecureStorage] No value found for key: ${key}`);
      }

      return value;
    } catch (error) {
      console.error(`[SecureStorage] Failed to retrieve value for key: ${key}`, error);

      // If the error is due to authentication failure, return null
      if (error instanceof Error && error.message.includes('authentication')) {
        console.warn(`[SecureStorage] Authentication failed for key: ${key}`);
        return null;
      }

      throw new Error(`Failed to retrieve ${key}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Remove a securely stored value
   *
   * @param key - Storage key to remove
   */
  async removeItem(key: string): Promise<void> {
    try {
      if (!this.isAvailable) {
        console.warn(`[SecureStorage] Using AsyncStorage fallback for key: ${key}`);
        await AsyncStorage.removeItem(key);
        return;
      }

      await SecureStore.deleteItemAsync(key);
      console.log(`[SecureStorage] Successfully removed encrypted value for key: ${key}`);
    } catch (error) {
      console.error(`[SecureStorage] Failed to remove value for key: ${key}`, error);
      throw new Error(`Failed to remove ${key}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Clear all secure storage keys
   * WARNING: This will remove ALL encrypted data. Use with caution.
   */
  async clearAll(): Promise<void> {
    try {
      const allKeys = Object.values(SecureStorageKeys);

      await Promise.all(
        allKeys.map(key => this.removeItem(key).catch(err => {
          console.warn(`[SecureStorage] Failed to remove ${key}:`, err);
        }))
      );

      console.log('[SecureStorage] Successfully cleared all secure storage');
    } catch (error) {
      console.error('[SecureStorage] Failed to clear secure storage:', error);
      throw error;
    }
  }

  /**
   * Migrate data from AsyncStorage to SecureStore
   * Use this for backward compatibility when adding encryption to existing data
   *
   * @param oldKey - Old AsyncStorage key
   * @param newKey - New SecureStore key
   */
  async migrateFromAsyncStorage(oldKey: string, newKey: string): Promise<boolean> {
    try {
      // Try to get value from old AsyncStorage location
      const oldValue = await AsyncStorage.getItem(oldKey);

      if (oldValue) {
        // Store in new secure location
        await this.setItem(newKey, oldValue);

        // Remove from old location
        await AsyncStorage.removeItem(oldKey);

        console.log(`[SecureStorage] Successfully migrated ${oldKey} -> ${newKey}`);
        return true;
      }

      console.log(`[SecureStorage] No migration needed for ${oldKey} (value not found)`);
      return false;
    } catch (error) {
      console.error(`[SecureStorage] Failed to migrate ${oldKey} -> ${newKey}:`, error);
      return false;
    }
  }

  /**
   * Store object as JSON (with encryption)
   *
   * @param key - Storage key
   * @param value - Object to store
   * @param options - Storage options
   */
  async setObject(
    key: string,
    value: Record<string, unknown>,
    options?: SecureStorageOptions
  ): Promise<void> {
    const jsonString = JSON.stringify(value);
    await this.setItem(key, jsonString, options);
  }

  /**
   * Retrieve object from JSON (automatically decrypted)
   *
   * @param key - Storage key
   * @param options - Retrieval options
   * @returns The parsed object, or null if not found
   */
  async getObject<T = Record<string, unknown>>(
    key: string,
    options?: SecureStorageOptions
  ): Promise<T | null> {
    const jsonString = await this.getItem(key, options);

    if (!jsonString) {
      return null;
    }

    try {
      return JSON.parse(jsonString) as T;
    } catch (error) {
      console.error(`[SecureStorage] Failed to parse JSON for key: ${key}`, error);
      return null;
    }
  }
}

/**
 * Singleton instance
 */
export const SecureStorage = new SecureStorageManager();

/**
 * Helper functions for common auth operations
 */
export const AuthTokenStorage = {
  /**
   * Store auth session data (access token, refresh token, etc.)
   */
  async setSession(session: {
    access_token: string;
    refresh_token: string;
    expires_at?: number;
    user?: { id: string };
  }): Promise<void> {
    await SecureStorage.setObject(SecureStorageKeys.AUTH_SESSION, session);

    // Also store user ID separately for quick access
    if (session.user?.id) {
      await SecureStorage.setItem(SecureStorageKeys.USER_ID, session.user.id);
    }
  },

  /**
   * Retrieve auth session data
   */
  async getSession(): Promise<{
    access_token: string;
    refresh_token: string;
    expires_at?: number;
    user?: { id: string };
  } | null> {
    return await SecureStorage.getObject(SecureStorageKeys.AUTH_SESSION);
  },

  /**
   * Remove auth session data
   */
  async clearSession(): Promise<void> {
    await Promise.all([
      SecureStorage.removeItem(SecureStorageKeys.AUTH_SESSION),
      SecureStorage.removeItem(SecureStorageKeys.USER_ID),
      SecureStorage.removeItem(SecureStorageKeys.AUTH_ACCESS_TOKEN),
      SecureStorage.removeItem(SecureStorageKeys.AUTH_REFRESH_TOKEN),
    ]);
  },

  /**
   * Check if user is authenticated (has valid session)
   */
  async hasValidSession(): Promise<boolean> {
    const session = await this.getSession();

    if (!session) {
      return false;
    }

    // Check if session has expired
    if (session.expires_at) {
      const now = Math.floor(Date.now() / 1000);
      return session.expires_at > now;
    }

    return true;
  },
};

/**
 * Helper functions for journal encryption
 */
export const JournalEncryption = {
  /**
   * Get or generate encryption key for journal entries
   */
  async getEncryptionKey(): Promise<string> {
    let key = await SecureStorage.getItem(SecureStorageKeys.JOURNAL_ENCRYPTION_KEY);

    if (!key) {
      // Generate a new encryption key (in production, use crypto.randomBytes or similar)
      key = this.generateEncryptionKey();
      await SecureStorage.setItem(SecureStorageKeys.JOURNAL_ENCRYPTION_KEY, key);
      console.log('[JournalEncryption] Generated new encryption key');
    }

    return key;
  },

  /**
   * Generate a random encryption key
   * NOTE: This is a simple implementation. For production, use crypto.randomBytes()
   */
  generateEncryptionKey(): string {
    const array = new Uint8Array(32);

    // Use crypto.getRandomValues if available, otherwise fallback
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      crypto.getRandomValues(array);
    } else {
      // Fallback for older environments
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
    }

    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  },

  /**
   * Basic XOR encryption (for demonstration - use AES in production)
   * NOTE: This is NOT secure for production use. Replace with proper AES encryption.
   */
  async encrypt(text: string): Promise<string> {
    const key = await this.getEncryptionKey();

    // Simple XOR encryption (replace with AES-256-GCM in production)
    let encrypted = '';
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i) ^ key.charCodeAt(i % key.length);
      encrypted += String.fromCharCode(charCode);
    }

    // Base64 encode to make it safe for storage
    return btoa(encrypted);
  },

  /**
   * Basic XOR decryption (for demonstration - use AES in production)
   * NOTE: This is NOT secure for production use. Replace with proper AES decryption.
   */
  async decrypt(encryptedText: string): Promise<string> {
    const key = await this.getEncryptionKey();

    try {
      // Base64 decode
      const encrypted = atob(encryptedText);

      // Simple XOR decryption (replace with AES-256-GCM in production)
      let decrypted = '';
      for (let i = 0; i < encrypted.length; i++) {
        const charCode = encrypted.charCodeAt(i) ^ key.charCodeAt(i % key.length);
        decrypted += String.fromCharCode(charCode);
      }

      return decrypted;
    } catch (error) {
      console.error('[JournalEncryption] Decryption failed:', error);
      throw new Error('Failed to decrypt journal entry');
    }
  },
};

/**
 * Export default instance
 */
export default SecureStorage;
