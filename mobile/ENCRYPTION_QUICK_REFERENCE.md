# Encryption Quick Reference Card

## Installation (Required)

```bash
npm install expo-secure-store
npx expo prebuild --clean
npx expo run:ios
```

## What's Encrypted?

✅ **Auth Tokens** (automatic via authStore)
✅ **Session Data** (automatic via authStore)
✅ **Journal Entries** (use encrypted functions - see below)

## What's NOT Encrypted?

❌ **User Profile** (name, email, tier) - fast AsyncStorage
❌ **App Settings** - non-sensitive
❌ **Worksheet Metadata** (timestamps, completion status)

## Basic Usage

### Auth Tokens (No Code Changes Needed)
Already handled automatically by authStore.

### Journal Entries (Update Your Code)

**Before:**
```typescript
import { upsertWorkbookProgress, getWorkbookProgress } from '../services/workbook';
```

**After:**
```typescript
import {
  upsertWorkbookProgressEncrypted,
  getWorkbookProgressDecrypted
} from '../services/workbook';
```

## Manual Encryption (Advanced)

```typescript
import { SecureStorage, JournalEncryption } from '../utils/secureStorage';

// Store encrypted value
await SecureStorage.setItem('my_key', 'secret_value');

// Retrieve encrypted value
const value = await SecureStorage.getItem('my_key');

// Encrypt text
const encrypted = await JournalEncryption.encrypt('private text');

// Decrypt text
const decrypted = await JournalEncryption.decrypt(encrypted);
```

## Encrypted Field Patterns

These field names are automatically encrypted:
- `journal`, `journal_entry`
- `reflection`, `daily_reflection`
- `thoughts`, `user_thoughts`
- `notes`, `private_notes`
- `entry`, `diary_entry`
- `answer`, `answer1`, `answer2`
- `response`, `user_response`
- `description`, `story`, `experience`

## Testing Checklist

```bash
# 1. Install package
npm install expo-secure-store

# 2. Rebuild
npx expo prebuild --clean
npx expo run:ios

# 3. Test
- [ ] Sign in
- [ ] Restart app
- [ ] Verify session persists
- [ ] Create journal entry
- [ ] Restart app
- [ ] Verify entry readable
```

## Common Errors

**"SecureStore is not available"**
→ Running in Expo Go. Use: `npx expo run:ios`

**"Failed to decrypt"**
→ Encryption key lost (reinstall). Delete entry and create new one.

**Session lost after update**
→ Check logs for migration. May need to re-sign in.

## Files to Know

- **Implementation**: `mobile/src/utils/secureStorage.ts`
- **Auth Store**: `mobile/src/stores/authStore.ts`
- **Workbook Service**: `mobile/src/services/workbook.ts`
- **Full Docs**: `mobile/ENCRYPTION_IMPLEMENTATION.md`
- **Install Guide**: `mobile/INSTALL_ENCRYPTION.md`

## Production Upgrade (Recommended)

Current: Basic XOR encryption (demo)
Recommended: AES-256-GCM (production)

```bash
npm install expo-crypto
```

See `ENCRYPTION_IMPLEMENTATION.md` for upgrade details.

## Support

Questions? Check:
1. `INSTALL_ENCRYPTION.md` - Quick start
2. `ENCRYPTION_IMPLEMENTATION.md` - Full guide
3. Code comments in `secureStorage.ts`

---

**TL;DR**: Install `expo-secure-store`, rebuild app, use encrypted functions for journals.
