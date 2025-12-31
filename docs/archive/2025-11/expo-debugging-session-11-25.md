# Expo Debugging Session - November 25, 2025

## Session Summary
Fixed the root cause of persistent `import.meta` errors and got Expo server running, but encountered timeout issues when connecting iPhone via Expo Go app.

---

## ✅ Problems SOLVED

### 1. Root Cause: Metro Package Exports Resolution
**Problem**: The `ws` package (used by Supabase) was being loaded with its ESM wrapper (`wrapper.mjs`) instead of the browser/CommonJS version, causing Metro to encounter `import.meta` syntax that React Native cannot support.

**Evidence**:
- Error: "Uncaught SyntaxError: Cannot use 'import.meta' outside a module"
- Persisted despite cache clearing, process killing, and config changes
- Caused by `@supabase/realtime-js@2.84.0` → `ws@8.18.3` dependency chain

**Solution Applied**:
1. Updated `mobile/metro.config.js`:
   - Added `config.resolver.unstable_conditionNames = ['browser', 'require', 'react-native']`
   - Forces Metro to prioritize browser/CommonJS versions over ESM
   - Removed `.mjs` from `sourceExts` (was making problem worse)

2. Updated `mobile/babel.config.js`:
   - Added `unstable_transformImportMeta: true` to babel-preset-expo options
   - Provides fallback transformation if Metro still encounters import.meta

**Committed**: `6d3d7f5` - "fix: resolve Metro package exports for Supabase ws compatibility"

---

## 🔄 Current Status

### What's Working
- ✅ Metro bundler starts successfully on port 8082
- ✅ Switched to Expo Go mode (from development build mode)
- ✅ QR code generates and is scannable
- ✅ iPhone can scan QR code via native Camera app
- ✅ Expo Go app recognizes the project and initiates connection
- ✅ Web browser can access http://localhost:8082
- ✅ Metro reports active TCP connections from client

### What's Broken
- ❌ iPhone connection times out with "unknown error - request timed out"
- ❌ Expo Go shows white spinning screen, then fails
- ❌ Terminal stuck waiting for Expo login (blocking bundle completion)

---

## ⚠️ Current Blockers

### Blocker 1: Expo Login Prompt
**Location**: PowerShell terminal running `npx expo start --clear --go`

**Terminal Output**:
```
It is recommended to log in with your Expo account before proceeding.
? Email or username » Log in to EAS with email or username
```

**Impact**: Server is waiting for user input, preventing app bundle from completing

**Next Step**:
- Press **Ctrl+C** to cancel login prompt
- OR press **Enter** to skip login
- Login not required for local development

### Blocker 2: Redirect Middleware Warning
**Terminal Output**:
```
[redirect middleware]: Unable to determine redirect location for runtime 'custom' and platform 'ios'
```

**Possible Cause**:
- app.json configuration issue
- Entry point mismatch
- Runtime configuration problem

**Files to Check**:
- `mobile/app.json` - verify `entryPoint: "./index.js"`
- `mobile/index.js` - verify exports App correctly
- `mobile/App.tsx` - verify root component exists and exports

### Blocker 3: Connection Timeout on iOS
**Symptom**: Expo Go app shows loading screen, then "unknown error - request timed out"

**Possible Causes**:
1. Bundle not completing due to login prompt
2. Network/firewall blocking connection
3. App.tsx missing or has errors
4. Configuration mismatch between server and client

---

## 🔍 Investigation Trail

### Session Timeline
1. Started with: "import.meta outside a module" error on localhost:8081
2. Discovered: Multiple stale Expo processes on ports 8081-8083
3. Killed processes, cleared caches (.expo, .metro-cache, node_modules/.cache, web, dist)
4. Updated metro.config.js and babel.config.js with package exports fix
5. Started server: `npx expo start --clear` (defaulted to port 8082)
6. Discovered: Server was in "development build" mode, not "Expo Go" mode
7. Switched: Pressed 's' to switch to Expo Go mode
8. Progress: QR code now scannable with iPhone Camera app
9. Blocker: Connection times out on iPhone

### Key Discovery: Development Build vs Expo Go
**Original QR Code URL**: `exp+manifest-the-unseen://expo-development-client/?url=...`
- This requires a custom development build (not Expo Go)
- Expo Go cannot open these URLs

**After Pressing 's'**: `exp://192.168.40.200:8082`
- Standard Expo Go URL format
- Compatible with Expo Go app
- Scannable via iPhone Camera app

### Expo Go App Confusion
**Problem**: User couldn't find "Scan QR code" button in Expo Go app
**Solution**: For iOS, you DON'T scan from within Expo Go
- Use the native **Camera app** to scan the QR code from the terminal
- Camera app detects the Expo URL and prompts to "Open in Expo Go"
- Tap the banner notification to launch in Expo Go

---

## 📋 Next Steps (Tomorrow's Session)

### Priority 1: Complete the Connection
1. **Cancel the login prompt**:
   - In PowerShell terminal, press **Ctrl+C** or just **Enter**
   - Watch for bundle to complete

2. **Test web browser first**:
   - Press 'w' in terminal to open web
   - Navigate to http://localhost:8082
   - **Verify import.meta error is GONE** (this proves our fix worked)

3. **Re-scan QR code on iPhone**:
   - After login prompt clears, scan QR code again
   - Should connect without timeout

### Priority 2: Fix Configuration Issues
If connection still fails, check these files:

**mobile/app.json**:
```json
{
  "expo": {
    "entryPoint": "./index.js",  // ← Verify this
    // Check for any iOS-specific misconfigurations
  }
}
```

**mobile/App.tsx**:
- Verify file exists
- Verify it exports a valid React component
- Check for any runtime errors

**mobile/index.js**:
```javascript
import { registerRootComponent } from 'expo';
import App from './App';

registerRootComponent(App);  // ← Verify this is correct
```

### Priority 3: Alternative Approaches
If Expo Go continues to fail:

**Option A: Run without --go flag**
```bash
npx expo start --clear
# Then press 's' to switch modes if needed
```

**Option B: Try tunnel mode**
```bash
npx expo start --tunnel
# Uses ngrok-like service, slower but bypasses local network issues
```

**Option C: Disable web platform entirely**
- Remove web config from app.json
- Focus on mobile-only development (aligns with PRD: "iOS primary")

---

## 🛠️ Technical Details

### Server Configuration
- **Port**: 8082 (8081 was occupied)
- **Mode**: Expo Go
- **Platform**: iOS (iPhone)
- **Network**: Local (192.168.40.200)
- **Metro URL**: exp://192.168.40.200:8082
- **Web URL**: http://localhost:8082

### Commands Used
```powershell
# Navigate to project
cd C:\projects\mobileApps\manifest-the-unseen-ios\mobile

# Start Expo (current session)
npx expo start --clear --go

# Switch to Expo Go mode (if started in dev build mode)
# Press 's' in terminal
```

### Files Modified This Session
1. `mobile/metro.config.js` - Added package exports resolution
2. `mobile/babel.config.js` - Added import.meta transformation
3. `.gitignore` - Added local settings and build artifacts

### Git Status
- **Current Branch**: main
- **Last Commit**: `6d3d7f5` - Metro/Babel config fixes
- **Pushed**: Yes
- **Uncommitted Changes**: None (clean working directory)

---

## 📚 Reference Links

### Expo Documentation
- [Expo Go vs Development Builds](https://docs.expo.dev/develop/development-builds/introduction/)
- [Metro Configuration](https://docs.expo.dev/guides/customizing-metro/)
- [Troubleshooting](https://docs.expo.dev/troubleshooting/overview/)

### GitHub Issues Referenced
- [Expo #30323: Can't use ESM package with import.meta](https://github.com/expo/expo/issues/30323)
- [Supabase #1258: unstable_enablePackageExports issue](https://github.com/supabase/supabase-js/issues/1258)
- [Supabase #1434: ws module import fails in React Native](https://github.com/supabase/supabase-js/issues/1434)

### Metro Package Exports
- [Metro Bundler: Package Exports](https://metrobundler.dev/docs/package-exports/)
- [Node.js: Package Exports](https://nodejs.org/api/packages.html#exports)

---

## 💡 Key Learnings

### 1. Metro Package Resolution
Metro's `unstable_enablePackageExports: true` (default in Expo SDK 54) can cause issues with packages that have ESM wrappers. The solution is to explicitly set condition priorities:
```javascript
config.resolver.unstable_conditionNames = ['browser', 'require', 'react-native'];
```

### 2. Expo Go vs Development Builds
- **Expo Go**: Pre-built app, works with standard Expo SDK packages, limited native modules
- **Development Build**: Custom build with your native code, required for custom native modules
- The URL format tells you which mode you're in:
  - `exp://` = Expo Go
  - `exp+project-name://` = Development Build

### 3. iOS QR Code Scanning
- iOS Expo Go app does NOT have a built-in QR scanner (was removed)
- Use the native **Camera app** to scan QR codes
- Camera app automatically detects Expo URLs and offers to open in Expo Go

### 4. Debugging Strategy
When encountering persistent errors:
1. Search for the EXACT error in package node_modules (find the source file)
2. Check package.json exports to understand module resolution
3. Verify Metro/bundler settings match package requirements
4. Test web first (faster iteration, easier debugging)
5. Use network inspection to verify client/server communication

---

## 🎯 Success Criteria for Next Session

### Minimum Viable Success
- [ ] Web browser loads app at localhost:8082 without import.meta error
- [ ] Confirms Metro config fix worked

### Full Success
- [ ] iPhone connects to Expo Go successfully
- [ ] App loads on iPhone (even if it shows errors, connection succeeds)
- [ ] Can see app UI or error messages on device

### Stretch Goal
- [ ] App renders workbook home screen on iPhone
- [ ] No TypeScript or runtime errors
- [ ] Ready to continue Supabase integration work

---

## 📝 Notes for Tomorrow

**Start Here**:
1. Open PowerShell, navigate to mobile directory
2. Run `npx expo start --clear --go`
3. When it prompts for login, just press **Enter** to skip
4. Press **'w'** to test web browser first
5. If web works, scan QR code on iPhone

**If Still Broken**:
- Check the "Priority 2" and "Priority 3" sections above
- Review App.tsx for runtime errors
- Consider disabling web support (mobile-only development)

**Session Context**:
This was a marathon debugging session (90+ minutes) that finally identified the root cause but got stuck on connection timeout. The core fix is solid - we just need to resolve the iOS connection configuration.

**Mood**: Frustrated but determined. We're close!

---

## Appendix: Full Error Messages

### Import.meta Error (RESOLVED)
```
Uncaught SyntaxError: Cannot use 'import.meta' outside a module
```
**Status**: Fixed via metro.config.js changes

### Redirect Middleware Warning (ACTIVE)
```
[redirect middleware]: Unable to determine redirect location for runtime 'custom' and platform 'ios'
```
**Status**: Under investigation

### Connection Timeout (ACTIVE)
```
There was a problem running the requested app
Unknown error - The request timed out
```
**Status**: Blocked by login prompt, needs resolution

---

**Session Duration**: ~90 minutes
**Session Date**: November 25, 2025, 11:00 PM - 12:30 AM
**Next Session**: Resume from "Next Steps" section above
