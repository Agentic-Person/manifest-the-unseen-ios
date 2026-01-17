# Supabase Connection Test - Browser Console

## Step 1: Open Browser Console
1. Navigate to http://localhost:3004
2. Open DevTools (F12 or Ctrl+Shift+I)
3. Go to the **Console** tab

## Step 2: Check Environment Variables
Run this in the console:

```javascript
// Check what Supabase URL and Key are loaded
console.log('Supabase URL:', process.env.EXPO_PUBLIC_SUPABASE_URL);
console.log('Supabase Key (first 20 chars):', process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20));
console.log('Key format:', process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY?.startsWith('eyJ') ? '✅ JWT (correct)' : '❌ Publishable (wrong)');
```

**Expected Output:**
- URL: `https://zbyszxtwzoylyygtexdr.supabase.co`
- Key starts with: `eyJhbGciOiJIUzI1NiIsI`
- Format: `✅ JWT (correct)`

## Step 3: Test Supabase Connection
Run this to test a simple query:

```javascript
// This assumes your Supabase client is accessible
// Check the Network tab while running this
const testConnection = async () => {
  console.log('🧪 Testing Supabase connection...');

  try {
    // Simple query to check connection
    const { data, error } = await window.supabaseClient
      ?.from('workbook_progress')
      .select('count')
      .limit(1);

    if (error) {
      console.error('❌ Supabase connection FAILED:', error);
      return false;
    }

    console.log('✅ Supabase connection SUCCESS:', data);
    return true;
  } catch (err) {
    console.error('❌ Exception during test:', err);
    return false;
  }
};

testConnection();
```

## Step 4: Check Network Tab
1. Open **Network** tab in DevTools
2. Filter by "supabase" or "workbook_progress"
3. Look for failed requests (red color)
4. Check response status codes:
   - ✅ 200/201: Success
   - ❌ 401: Auth failed (wrong key)
   - ❌ 400: Bad request
   - ⏳ Pending forever: Timeout issue

## Step 5: Test Workbook Save
1. Navigate to a workbook screen (e.g., Phase 1 > Wheel of Life)
2. Type something in a field
3. Wait 2 seconds (auto-save debounce)
4. Watch console for logs:
   - `[useAutoSave]` - Auto-save triggered
   - `[workbook.service]` - Database operation
   - `[useWorkbookProgress]` - Data loaded

## Common Issues & Fixes

### Issue: Key starts with "sb_publishable"
**Fix:** .env file has wrong key, needs JWT format

### Issue: Network requests show 401 Unauthorized
**Fix:** Supabase key is invalid or expired

### Issue: Requests timeout after 5-8 seconds
**Fix:** Supabase URL wrong or network issue

### Issue: No network requests appear
**Fix:** Supabase client not initialized properly

## Additional Debug Commands

```javascript
// Check if Supabase client exists
console.log('Supabase client:', typeof window.supabaseClient);

// Check auth state
console.log('Auth user:', window.supabaseClient?.auth.getUser());

// Watch for auto-save events
window.addEventListener('console', (e) => {
  if (e.message?.includes('useAutoSave')) {
    console.log('🔍 Auto-save event:', e);
  }
});
```

## Success Criteria

✅ JWT key format detected
✅ Supabase connection successful
✅ Network requests complete in <1 second
✅ Auto-save triggers within 2 seconds
✅ No console errors or red network requests

If all checks pass, Build 51 should work correctly!
