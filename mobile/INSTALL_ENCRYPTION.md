# Quick Installation Guide: Encryption Support

## Step 1: Install expo-secure-store

```bash
cd mobile
npm install expo-secure-store
```

## Step 2: Rebuild Native Code

**IMPORTANT**: `expo-secure-store` requires native modules and does NOT work with Expo Go.

### For Development

```bash
# Clean and rebuild native code
npx expo prebuild --clean

# Run on iOS (requires macOS with Xcode)
npx expo run:ios

# Run on Android
npx expo run:android
```

### For Production (EAS Build)

```bash
# iOS
eas build --platform ios --profile production

# Android
eas build --platform android --profile production
```

## Step 3: Verify Installation

After rebuilding, test the encryption:

```typescript
import { SecureStorage } from './src/utils/secureStorage';

// Test basic storage
await SecureStorage.setItem('test', 'hello');
const value = await SecureStorage.getItem('test');
console.log(value); // Should print: "hello"
```

## What's Already Implemented

✅ **SecureStorage utility** created at `mobile/src/utils/secureStorage.ts`
✅ **AuthStore updated** to use hybrid storage (secure tokens + fast profile)
✅ **Workbook service** includes journal encryption helpers
✅ **Backward compatibility** for migration from old AsyncStorage format

## What You Need to Do

1. Install `expo-secure-store` (see Step 1 above)
2. Rebuild native code (see Step 2 above)
3. Test on a physical device (encryption requires real hardware)
4. Update code to use encrypted functions:

### Example: Use Encrypted Journal Storage

**Before**:
```typescript
import { upsertWorkbookProgress } from '../services/workbook';

await upsertWorkbookProgress(userId, phaseNumber, worksheetId, data);
```

**After** (with encryption):
```typescript
import { upsertWorkbookProgressEncrypted } from '../services/workbook';

await upsertWorkbookProgressEncrypted(userId, phaseNumber, worksheetId, data);
```

**Before**:
```typescript
import { getWorkbookProgress } from '../services/workbook';

const progress = await getWorkbookProgress(userId, phaseNumber, worksheetId);
```

**After** (with decryption):
```typescript
import { getWorkbookProgressDecrypted } from '../services/workbook';

const progress = await getWorkbookProgressDecrypted(userId, phaseNumber, worksheetId);
```

## Testing Checklist

- [ ] Install expo-secure-store
- [ ] Rebuild app with `npx expo run:ios` or `npx expo run:android`
- [ ] Sign in to app
- [ ] Create a journal entry
- [ ] Close and reopen app
- [ ] Verify journal entry is still readable (decryption works)
- [ ] Sign out
- [ ] Sign in again
- [ ] Verify session persisted (auth tokens encrypted/decrypted)

## Common Issues

### "SecureStore is not available"

**Problem**: Running in Expo Go

**Solution**: Use development build instead:
```bash
npx expo prebuild
npx expo run:ios
```

### "Module not found: expo-secure-store"

**Problem**: Package not installed

**Solution**:
```bash
npm install expo-secure-store
```

### "Session lost after app restart"

**Problem**: SecureStore not working on simulator

**Solution**: Test on physical device (encryption requires real hardware)

## Next Steps

For more details, see the full documentation:
- **ENCRYPTION_IMPLEMENTATION.md** - Complete implementation guide
- **src/utils/secureStorage.ts** - Source code with inline documentation

## Production Upgrade (Optional)

The current implementation uses basic XOR encryption for demonstration. For production, consider upgrading to AES-256-GCM:

```bash
npm install expo-crypto
```

See `ENCRYPTION_IMPLEMENTATION.md` section "Production Upgrade Path" for details.

---

**Quick Start**: Just run `npm install expo-secure-store && npx expo prebuild && npx expo run:ios`
