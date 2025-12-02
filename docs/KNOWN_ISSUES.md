# Known Issues

This document tracks known issues and their workarounds in the Manifest the Unseen app.

---

## CRITICAL: Supabase SDK Hanging on Web Platform

**Status**: Active workaround in place
**Severity**: High (affects web platform only)
**Date Discovered**: 2025-12-02
**Affects**: All Supabase queries on web (read and write operations)

### Symptoms

When running the app on web (`npx expo start --web`), Supabase SDK queries hang indefinitely:

1. **Read operations**: `supabase.from('table').select()` never resolves
2. **Write operations**: `supabase.from('table').upsert()` never resolves
3. **Console shows**: Query starts but never completes
4. **UI effect**: Screens stuck on "Loading..." forever

### Root Cause

The Supabase JavaScript SDK has a web-specific issue related to:
- Internal locking mechanism causing deadlocks
- Session storage interactions with web's localStorage
- The SDK's auth flow blocking database queries

**Note**: Direct REST API calls to Supabase work fine - the issue is specifically in the SDK's JavaScript client.

### Current Workaround

We've implemented a timeout-based workaround in `mobile/src/services/workbook.ts` and `mobile/src/services/supabase.ts`:

#### 1. Query Timeout Helper (`workbook.ts:17-25`)

```typescript
const withTimeout = <T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> => {
  const timeout = new Promise<T>((resolve) => {
    setTimeout(() => {
      console.log('[workbook.service] Query timed out after', ms, 'ms');
      resolve(fallback);
    }, ms);
  });
  return Promise.race([promise, timeout]);
};
```

#### 2. Read Operations - 5 second timeout (`workbook.ts:30-66`)

- Returns `null` on timeout (no existing data)
- Screens load with default values
- User can still interact with the app

#### 3. Write Operations - 8 second timeout (`workbook.ts:127-191`)

- Returns optimistic result on timeout
- UI doesn't freeze
- Data may not actually persist on web

#### 4. Supabase Client Config (`supabase.ts:50-98`)

```typescript
// Web-specific configuration
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: Platform.OS === 'web' ? webStorage : AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: Platform.OS === 'web',
    flowType: 'implicit',
    ...(Platform.OS === 'web' && { lock: noopLock }),
  },
});
```

### Impact by Platform

| Platform | Read Queries | Write Queries | Data Persistence |
|----------|--------------|---------------|------------------|
| iOS (native) | Works normally | Works normally | Full |
| Android (native) | Works normally | Works normally | Full |
| Web | Times out after 5s | Times out after 8s | Limited/None |

### Testing Notes

- Web testing shows UI doesn't hang (workaround effective)
- Progress tracking shows 0% on web (queries return null after timeout)
- On native iOS simulator/device, full functionality expected
- Test with `EXPO_PUBLIC_DEV_SKIP_AUTH=false` for real Supabase interaction

### Potential Fixes (TODO)

1. **Replace SDK with direct REST calls on web**
   - Use `fetch()` directly to Supabase REST API
   - Bypass SDK's problematic JavaScript client
   - Estimated effort: Medium

2. **Upgrade Supabase SDK**
   - Check for newer versions that may have fixed the issue
   - Current version: Check `package.json`
   - Monitor: https://github.com/supabase/supabase-js/issues

3. **Use a service worker for web**
   - Handle Supabase calls in service worker context
   - May bypass the locking issue

4. **Wait for Supabase fix**
   - Report issue to Supabase if not already reported
   - This is a known issue in the community

### Files Modified for Workaround

- `mobile/src/services/supabase.ts` - Web-specific auth config, noopLock
- `mobile/src/services/workbook.ts` - Timeout helper, wrapped queries

### Console Messages

When the workaround triggers, you'll see:

```
[workbook.service] Starting query: {userId: ..., phaseNumber: 1, worksheetId: ...}
[workbook.service] Query timed out after 5000 ms
[workbook.service] Query completed: {data: null, error: Object}
[workbook.service] Returning data: null
```

For writes:
```
[workbook.service] Starting upsert: {phaseNumber: 1, worksheetId: ..., completed: true}
[workbook.service] Upsert timed out - returning optimistic result
```

---

## Other Known Issues

### Voice Recording on Web

**Status**: Expected behavior (documented warning)
**Severity**: Low

Web browsers don't support the same audio recording APIs as native platforms. A warning is displayed to users on web suggesting they use the mobile app for voice journaling.

---

## Resolved Issues

### Dark Mode Not Working in Wisdom Section

**Status**: RESOLVED
**Date Fixed**: 2025-12-02
**Fix**: Added `userInterfaceStyle: "automatic"` to `app.json`

### VoiceRecorder State Not Resetting

**Status**: RESOLVED
**Date Fixed**: 2025-12-02
**Fix**: Reset recording state in VoiceRecorder.tsx when transitioning states

### 7 of 11 Phase 1 Exercises Missing

**Status**: RESOLVED
**Date Fixed**: 2025-12-02
**Fix**: Created all 7 missing screens:
- FeelWheelScreen.tsx
- AbcModelScreen.tsx
- StrengthsWeaknessesScreen.tsx
- ComfortZoneScreen.tsx
- KnowYourselfScreen.tsx
- AbilitiesRatingScreen.tsx
- ThoughtAwarenessScreen.tsx
