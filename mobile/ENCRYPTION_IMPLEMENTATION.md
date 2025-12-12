# Encryption Implementation Guide

## Overview

This document describes the encryption implementation for **Manifest the Unseen** mobile app, focusing on securing sensitive user data using `expo-secure-store` for hardware-backed encryption.

## Security Architecture

### Two-Tier Storage Strategy

The app uses a hybrid storage approach to balance security and performance:

1. **SecureStorage (Encrypted)** - For sensitive data
   - Authentication tokens (access/refresh tokens)
   - User session data
   - Encryption keys for journal entries
   - Biometric settings
   - Uses iOS Keychain / Android KeyStore (hardware-backed)

2. **AsyncStorage (Unencrypted)** - For non-sensitive data
   - User profile information (name, email, subscription tier)
   - App settings and preferences
   - UI state and navigation history
   - Cached non-sensitive data

### Why This Approach?

- **Security**: Auth tokens and journal entries are the highest-risk data and require encryption
- **Performance**: Profile data (name, email, tier) is low-risk and can be unencrypted for faster access
- **Compliance**: Meets security best practices for mobile apps handling personal data
- **User Experience**: Faster app launches (profile loads from AsyncStorage) while tokens remain secure

## Installation

### 1. Install expo-secure-store

```bash
cd mobile
npm install expo-secure-store
# or
npx expo install expo-secure-store
```

### 2. Rebuild Native Code

Since `expo-secure-store` requires native modules, you must rebuild:

```bash
# For iOS (development build)
npx expo run:ios

# For Android (development build)
npx expo run:android

# For production builds, use EAS Build
eas build --platform ios
eas build --platform android
```

**Note**: `expo-secure-store` does NOT work with Expo Go. You must use a development build or production build.

## Implementation Details

### 1. SecureStorage Utility (`mobile/src/utils/secureStorage.ts`)

The core encryption utility provides:

#### Basic Operations

```typescript
import { SecureStorage, SecureStorageKeys } from '../utils/secureStorage';

// Store encrypted data
await SecureStorage.setItem(SecureStorageKeys.AUTH_ACCESS_TOKEN, token);

// Retrieve encrypted data (automatically decrypted)
const token = await SecureStorage.getItem(SecureStorageKeys.AUTH_ACCESS_TOKEN);

// Remove encrypted data
await SecureStorage.removeItem(SecureStorageKeys.AUTH_ACCESS_TOKEN);

// Clear all secure storage
await SecureStorage.clearAll();
```

#### Store/Retrieve Objects

```typescript
// Store object as encrypted JSON
await SecureStorage.setObject('user_data', { id: '123', name: 'John' });

// Retrieve and parse encrypted JSON
const userData = await SecureStorage.getObject('user_data');
```

#### Platform Support

- **iOS**: Uses Keychain Services with `kSecAccessControlBiometryCurrentSet` for biometric protection
- **Android**: Uses KeyStore API with `REQUIRE_AUTHENTICATION` flag
- **Web**: Falls back to AsyncStorage (with console warnings) - not recommended for production

### 2. Authentication Token Storage

#### AuthTokenStorage Helper

```typescript
import { AuthTokenStorage } from '../utils/secureStorage';

// Store complete auth session (encrypted)
await AuthTokenStorage.setSession({
  access_token: 'eyJhbGc...',
  refresh_token: 'v1.MR...',
  expires_at: 1735812345,
  user: { id: 'user_123' }
});

// Retrieve session
const session = await AuthTokenStorage.getSession();

// Check if session is valid (not expired)
const isValid = await AuthTokenStorage.hasValidSession();

// Clear session on sign out
await AuthTokenStorage.clearSession();
```

#### Integration with Zustand Auth Store

The `authStore.ts` has been updated to use a **hybrid storage adapter**:

```typescript
// Hybrid storage implementation in authStore.ts
const createHybridStorage = (): StateStorage => {
  return {
    getItem: async (name: string) => {
      // 1. Try to get session from SecureStorage (encrypted)
      const secureSession = await AuthTokenStorage.getSession();

      // 2. Get profile from AsyncStorage (unencrypted, faster)
      const profile = await AsyncStorage.getItem(`${name}_profile`);

      // 3. Backward compatibility: migrate old AsyncStorage sessions
      const oldData = await AsyncStorage.getItem(name);
      if (oldData && oldData.session) {
        await AuthTokenStorage.setSession(oldData.session);
        await AsyncStorage.removeItem(name); // Remove old format
      }

      return JSON.stringify({ session: secureSession, profile });
    },

    setItem: async (name: string, value: string) => {
      const parsed = JSON.parse(value);

      // Store session in SecureStorage (encrypted)
      if (parsed.session) {
        await AuthTokenStorage.setSession(parsed.session);
      }

      // Store profile in AsyncStorage (unencrypted, fast access)
      if (parsed.profile) {
        await AsyncStorage.setItem(`${name}_profile`, JSON.stringify(parsed.profile));
      }
    },

    removeItem: async (name: string) => {
      await AuthTokenStorage.clearSession();
      await AsyncStorage.removeItem(`${name}_profile`);
    }
  };
};

// Zustand persist configuration
persist(
  (set, get) => ({ /* store implementation */ }),
  {
    name: 'manifest-auth-storage',
    storage: createJSONStorage(() => createHybridStorage()),
  }
)
```

### 3. Journal Entry Encryption

#### Automatic Encryption for Sensitive Fields

The workbook service (`mobile/src/services/workbook.ts`) includes intelligent field detection:

```typescript
// These field names trigger automatic encryption
const ENCRYPTED_FIELD_PATTERNS = [
  'journal',
  'reflection',
  'thoughts',
  'notes',
  'entry',
  'answer',
  'response',
  'description',
  'story',
  'experience',
];
```

#### Usage in App Code

```typescript
import {
  upsertWorkbookProgressEncrypted,
  getWorkbookProgressDecrypted
} from '../services/workbook';

// Save worksheet with automatic encryption of sensitive fields
const worksheetData = {
  question1: 'What is your goal?',
  answer1: 'My goal is to...', // ← Encrypted automatically (contains "answer")
  completed: false,
  timestamp: Date.now(),
};

await upsertWorkbookProgressEncrypted(
  userId,
  phaseNumber,
  worksheetId,
  worksheetData,
  false
);

// Load worksheet with automatic decryption
const progress = await getWorkbookProgressDecrypted(userId, phaseNumber, worksheetId);
// progress.data.answer1 is now decrypted and readable
```

#### How Field Detection Works

```typescript
const isSensitiveField = (fieldName: string): boolean => {
  const lowerFieldName = fieldName.toLowerCase();
  return ENCRYPTED_FIELD_PATTERNS.some(pattern =>
    lowerFieldName.includes(pattern)
  );
};

// Examples:
isSensitiveField('journal_entry')     // true  → encrypted
isSensitiveField('daily_reflection')  // true  → encrypted
isSensitiveField('user_thoughts')     // true  → encrypted
isSensitiveField('completed')         // false → NOT encrypted
isSensitiveField('timestamp')         // false → NOT encrypted
```

#### Recursive Encryption

The encryption helpers handle nested objects and arrays:

```typescript
const complexData = {
  section1: {
    journal: 'My private thoughts...',  // ← Encrypted
    completed: true,                     // ← NOT encrypted
  },
  entries: [
    { reflection: 'I learned...' },      // ← Encrypted
    { date: '2025-12-12' },              // ← NOT encrypted
  ],
};

const encrypted = await encryptWorksheetData(complexData);
// Only journal and reflection fields are encrypted
// Other fields remain unchanged for database indexing/sorting
```

### 4. JournalEncryption Helper

For manual encryption of specific content:

```typescript
import { JournalEncryption } from '../utils/secureStorage';

// Encrypt a journal entry
const encrypted = await JournalEncryption.encrypt('My private thoughts...');

// Decrypt a journal entry
const decrypted = await JournalEncryption.decrypt(encrypted);

// Get encryption key (auto-generated and securely stored)
const key = await JournalEncryption.getEncryptionKey();
```

**Important**: The current implementation uses **simple XOR encryption for demonstration**. For production, replace with **AES-256-GCM** using a library like `react-native-crypto` or `expo-crypto`.

## Migration Strategy

### Backward Compatibility

The implementation includes automatic migration from old AsyncStorage format to new SecureStorage:

```typescript
// On first app launch after update:
// 1. Check SecureStorage for session → not found
// 2. Check AsyncStorage for old session → found
// 3. Migrate session to SecureStorage
// 4. Remove old AsyncStorage session
// 5. Log: "[AuthStore] Migrated session to SecureStorage"
```

### Migration Steps for Users

1. **User updates app** from App Store
2. **App launches** and `authStore` initializes
3. **Hybrid storage adapter** detects old AsyncStorage session
4. **Session migrated** to SecureStorage automatically
5. **Profile remains** in AsyncStorage (no migration needed)
6. **Old combined storage** removed from AsyncStorage
7. **User continues** using app without interruption

No user action required - migration is transparent.

## Security Best Practices

### ✅ DO

- Use `SecureStorage` for all authentication tokens
- Use `SecureStorage` for encryption keys
- Use encrypted functions (`upsertWorkbookProgressEncrypted`) for journal entries
- Clear secure storage on sign out
- Log encryption/decryption events (without logging actual content)
- Test encryption on physical devices (not simulators/emulators)

### ❌ DON'T

- Store auth tokens in AsyncStorage
- Store journal content unencrypted
- Log decrypted content to console
- Hardcode encryption keys in code
- Use SecureStorage for frequently accessed non-sensitive data (performance impact)
- Rely on SecureStorage in Expo Go (won't work)

## Testing

### Unit Tests

```typescript
import { SecureStorage, AuthTokenStorage, JournalEncryption } from '../utils/secureStorage';

describe('SecureStorage', () => {
  it('stores and retrieves encrypted values', async () => {
    await SecureStorage.setItem('test_key', 'test_value');
    const value = await SecureStorage.getItem('test_key');
    expect(value).toBe('test_value');
  });

  it('returns null for non-existent keys', async () => {
    const value = await SecureStorage.getItem('non_existent');
    expect(value).toBeNull();
  });

  it('removes items successfully', async () => {
    await SecureStorage.setItem('test_key', 'test_value');
    await SecureStorage.removeItem('test_key');
    const value = await SecureStorage.getItem('test_key');
    expect(value).toBeNull();
  });
});

describe('AuthTokenStorage', () => {
  it('stores and retrieves session', async () => {
    const session = {
      access_token: 'token_123',
      refresh_token: 'refresh_456',
      expires_at: Date.now() + 3600000,
      user: { id: 'user_789' }
    };

    await AuthTokenStorage.setSession(session);
    const retrieved = await AuthTokenStorage.getSession();

    expect(retrieved.access_token).toBe(session.access_token);
    expect(retrieved.user.id).toBe('user_789');
  });

  it('detects expired sessions', async () => {
    const expiredSession = {
      access_token: 'token_123',
      refresh_token: 'refresh_456',
      expires_at: Date.now() - 1000, // Expired 1 second ago
    };

    await AuthTokenStorage.setSession(expiredSession);
    const isValid = await AuthTokenStorage.hasValidSession();

    expect(isValid).toBe(false);
  });
});

describe('JournalEncryption', () => {
  it('encrypts and decrypts text', async () => {
    const original = 'My private journal entry';
    const encrypted = await JournalEncryption.encrypt(original);
    const decrypted = await JournalEncryption.decrypt(encrypted);

    expect(encrypted).not.toBe(original); // Encrypted is different
    expect(decrypted).toBe(original);     // Decryption recovers original
  });
});
```

### Manual Testing Checklist

- [ ] **Fresh Install**: Install app on clean device, sign in, verify session persists after app restart
- [ ] **Migration**: Install old version, sign in, update to new version, verify session still works
- [ ] **Sign Out**: Sign out, verify secure storage is cleared, verify re-sign-in works
- [ ] **Journal Encryption**: Create journal entry, kill app, relaunch, verify entry is readable
- [ ] **Device Lock**: Enable device passcode, verify SecureStorage requires authentication (iOS)
- [ ] **Offline Mode**: Turn off network, verify encrypted data still accessible
- [ ] **App Deletion**: Delete app, reinstall, verify old encrypted data is NOT accessible (fresh state)

## Production Upgrade Path

### Current Implementation (Basic)

- **Encryption Algorithm**: Simple XOR (demonstration only)
- **Key Management**: Auto-generated random key stored in SecureStore
- **Security Level**: Basic protection against casual inspection

### Recommended Production Implementation

1. **Replace XOR with AES-256-GCM**:
   ```typescript
   import * as Crypto from 'expo-crypto';

   // Generate strong encryption key
   const key = await Crypto.getRandomBytesAsync(32); // 256 bits

   // Encrypt with AES-GCM (provides both encryption and authentication)
   const encrypted = await Crypto.encryptAsync({
     algorithm: Crypto.CryptoAlgorithm.AES_256_GCM,
     key: key,
     plaintext: text,
   });
   ```

2. **Add Key Rotation**:
   - Rotate encryption keys every 90 days
   - Re-encrypt journal entries with new key in background
   - Keep old key for 30 days for decryption during transition

3. **Add Biometric Authentication** (optional):
   ```typescript
   import * as LocalAuthentication from 'expo-local-authentication';

   const authenticated = await LocalAuthentication.authenticateAsync({
     promptMessage: 'Authenticate to access your journal',
     fallbackLabel: 'Use passcode',
   });

   if (authenticated.success) {
     const decrypted = await JournalEncryption.decrypt(encrypted);
   }
   ```

4. **Add Encryption Metadata**:
   ```typescript
   interface EncryptedData {
     version: 1,              // Encryption schema version
     algorithm: 'AES-256-GCM', // Algorithm used
     encrypted: string,        // Base64 encrypted data
     iv: string,              // Initialization vector
     authTag: string,         // Authentication tag (for GCM)
   }
   ```

## Troubleshooting

### Error: "SecureStore is not available"

**Cause**: Running in Expo Go (SecureStore not supported)

**Solution**: Use development build:
```bash
npx expo prebuild
npx expo run:ios
```

### Error: "Failed to decrypt journal entry"

**Cause**: Encryption key was deleted (app reinstall, device reset)

**Solution**:
1. Detect decryption failure
2. Show user message: "Unable to read journal entry (encryption key missing)"
3. Offer to delete corrupted entry

### Session Lost After App Update

**Cause**: Migration failed or secure storage was cleared

**Solution**:
1. Check logs for `[AuthStore] Migrated session to SecureStorage`
2. If not found, user needs to sign in again
3. Add Sentry tracking for migration failures

### Performance Issues with Large Journals

**Cause**: Encrypting/decrypting large text on main thread

**Solution**:
1. Move encryption to background thread (use `react-native-background-fetch`)
2. Cache decrypted data in memory (with auto-clear after 5 minutes)
3. Use pagination for journal lists

## Monitoring & Analytics

### Recommended Telemetry Events

```typescript
// Track encryption usage
telemetry.track('encryption_performed', {
  type: 'journal_entry',
  fieldCount: 5,
  duration: 45, // ms
});

// Track migration success
telemetry.track('auth_migration_completed', {
  from: 'AsyncStorage',
  to: 'SecureStorage',
  success: true,
});

// Track decryption failures (potential security issue)
telemetry.track('decryption_failed', {
  type: 'journal_entry',
  worksheetId: 'wheel_of_life',
  error: 'Invalid encryption key',
});
```

### Security Metrics to Monitor

- **Encryption Success Rate**: Should be >99.9%
- **Decryption Failure Rate**: Should be <0.1% (indicates key loss or corruption)
- **Migration Success Rate**: Should be 100% for users updating from old version
- **SecureStorage Availability**: Should be 100% on production builds (0% on Expo Go)

## Summary

### What's Encrypted

✅ **Auth Tokens** (access_token, refresh_token, session)
✅ **Journal Entries** (fields matching patterns: journal, reflection, thoughts, etc.)
✅ **Encryption Keys** (stored in SecureStorage)

### What's NOT Encrypted

❌ **User Profile** (name, email, subscription tier) - stored in AsyncStorage for performance
❌ **App Settings** (theme, preferences) - non-sensitive
❌ **Navigation State** (current tab, route) - temporary UI state
❌ **Worksheet Metadata** (phase number, completion status, timestamps) - needed for queries

### Key Benefits

1. **Security**: Auth tokens protected by hardware encryption (Keychain/KeyStore)
2. **Privacy**: Journal entries encrypted before leaving device
3. **Performance**: Profile data unencrypted for fast app launches
4. **Compatibility**: Automatic migration from old AsyncStorage format
5. **User Experience**: Transparent encryption - no user action required

### Installation Reminder

**IMPORTANT**: After implementing encryption, run:

```bash
npm install expo-secure-store
npx expo prebuild --clean
npx expo run:ios
```

SecureStore requires native modules and will NOT work in Expo Go.

---

**Last Updated**: 2025-12-12
**Implemented By**: Claude Sonnet 4.5
**Status**: ✅ Ready for Testing (Production upgrade to AES-256-GCM recommended)
