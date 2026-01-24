/**
 * Journal Encryption Service
 *
 * H6 Security Fix: Provides AES-256-GCM encryption for journal entries.
 * Encryption keys are stored in the device's secure hardware keychain.
 *
 * Security Features:
 * - AES-256-GCM authenticated encryption (confidentiality + integrity)
 * - Keys stored in iOS Keychain / Android KeyStore via expo-secure-store
 * - Unique IV (initialization vector) per entry prevents pattern analysis
 * - Client-side encryption - data never leaves device unencrypted
 *
 * Usage:
 * ```typescript
 * // Encrypt
 * const { ciphertext, iv, tag } = await JournalEncryptionService.encrypt('My journal entry');
 *
 * // Decrypt
 * const plaintext = await JournalEncryptionService.decrypt(ciphertext, iv, tag);
 * ```
 */

import AesGcmCrypto, { EncryptedData } from 'react-native-aes-gcm-crypto';
import { SecureStorageKeys } from '../utils/secureStorage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { logger } from '../utils/logger';

// Encryption constants
const ENCRYPTION_VERSION = 1; // AES-256-GCM

/**
 * Encryption result containing ciphertext, IV, and auth tag
 */
export interface EncryptionResult {
  ciphertext: string; // Base64 encoded
  iv: string; // Base64 encoded initialization vector
  tag: string; // Base64 encoded authentication tag
  version: number; // Algorithm version for future upgrades
}

/**
 * Generate a random 256-bit key as hex string
 */
function generateRandomKey(): string {
  const array = new Uint8Array(32); // 256 bits
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(array);
  } else {
    // Fallback for environments without Web Crypto API
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Journal Encryption Service
 * Handles all encryption/decryption operations for journal entries
 */
export const JournalEncryptionService = {
  /**
   * Get the encryption key from secure storage, or generate a new one
   * Key is stored in device keychain (iOS) or keystore (Android)
   */
  async getOrCreateKey(): Promise<string> {
    try {
      // Check if key already exists
      const existingKey = await SecureStore.getItemAsync(SecureStorageKeys.JOURNAL_ENCRYPTION_KEY);

      if (existingKey) {
        if (__DEV__) {
          logger.debug('[JournalEncryption] Using existing encryption key');
        }
        return existingKey;
      }

      // Generate new key
      if (__DEV__) {
        logger.debug('[JournalEncryption] Generating new encryption key');
      }

      const newKey = generateRandomKey();

      // Store in secure storage
      await SecureStore.setItemAsync(SecureStorageKeys.JOURNAL_ENCRYPTION_KEY, newKey, {
        keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      });

      if (__DEV__) {
        logger.debug('[JournalEncryption] New key generated and stored');
      }

      return newKey;
    } catch (error) {
      logger.error('[JournalEncryption] Failed to get/create key:', error);
      throw new Error('Failed to initialize journal encryption');
    }
  },

  /**
   * Encrypt plaintext content using AES-256-GCM
   * @param plaintext - The text to encrypt
   * @returns EncryptionResult with ciphertext, IV, tag, and version
   */
  async encrypt(plaintext: string): Promise<EncryptionResult> {
    if (!plaintext) {
      throw new Error('Cannot encrypt empty content');
    }

    try {
      const key = await this.getOrCreateKey();

      // Encrypt using AES-256-GCM
      // The library generates IV internally and returns it with the encrypted data
      const encrypted: EncryptedData = await AesGcmCrypto.encrypt(
        plaintext,
        false, // inBinary = false for text
        key
      );

      if (__DEV__) {
        logger.debug('[JournalEncryption] Encrypted content:', {
          plaintextLength: plaintext.length,
          ciphertextLength: encrypted.content.length,
        });
      }

      return {
        ciphertext: encrypted.content,
        iv: encrypted.iv,
        tag: encrypted.tag,
        version: ENCRYPTION_VERSION,
      };
    } catch (error) {
      logger.error('[JournalEncryption] Encryption failed:', error);
      throw new Error('Failed to encrypt journal entry');
    }
  },

  /**
   * Decrypt ciphertext using AES-256-GCM
   * @param ciphertext - Base64 encoded encrypted content
   * @param iv - Base64 encoded initialization vector
   * @param tag - Base64 encoded authentication tag
   * @returns Decrypted plaintext
   */
  async decrypt(ciphertext: string, iv: string, tag: string): Promise<string> {
    if (!ciphertext || !iv || !tag) {
      throw new Error('Cannot decrypt: missing ciphertext, IV, or tag');
    }

    try {
      const key = await this.getOrCreateKey();

      // Decrypt using AES-256-GCM
      const plaintext = await AesGcmCrypto.decrypt(
        ciphertext,
        key,
        iv,
        tag,
        false // isBinary = false for text
      );

      if (__DEV__) {
        logger.debug('[JournalEncryption] Decrypted content:', {
          ciphertextLength: ciphertext.length,
          plaintextLength: plaintext.length,
        });
      }

      return plaintext;
    } catch (error) {
      logger.error('[JournalEncryption] Decryption failed:', error);
      throw new Error('Failed to decrypt journal entry');
    }
  },

  /**
   * Check if journal encryption is available on this platform
   * @returns true if encryption can be used
   */
  isAvailable(): boolean {
    // react-native-aes-gcm-crypto requires native modules
    // Available on iOS and Android, not on web
    return Platform.OS === 'ios' || Platform.OS === 'android';
  },

  /**
   * Get the current encryption version
   * Used to identify which algorithm was used for stored entries
   */
  getVersion(): number {
    return ENCRYPTION_VERSION;
  },

  /**
   * Check if an entry needs migration (has plaintext but no encrypted content)
   */
  needsEncryption(entry: { content?: string | null; encrypted_content?: string | null }): boolean {
    const hasPlaintext = !!entry.content && entry.content !== '' && entry.content !== '[encrypted]';
    const hasEncrypted = !!entry.encrypted_content;
    return hasPlaintext && !hasEncrypted;
  },
};

export default JournalEncryptionService;
