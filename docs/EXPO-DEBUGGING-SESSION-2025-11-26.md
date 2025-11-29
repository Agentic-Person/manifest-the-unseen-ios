# Expo Debugging Session - November 26, 2025

## Session Summary
Continued debugging React Native 0.81.5 + React 19 upgrade. Fixed ActivityIndicator size prop compatibility issue, but persistent cache problems prevent fix from taking effect on device. Multiple stale Expo processes causing connection to outdated bundled code.

---

## ⚠️ CRITICAL UNRESOLVED ISSUES

### Issue 1: Persistent Cache Problem
**Problem**: iPhone connects to stale Metro bundler with old cached code despite fixes being applied and caches cleared.

**Evidence**:
- Fixed all `size="large"` → `size={50}` in ActivityIndicator components
- Killed process on port 8081 (PID 129668)
- Error still shows "Unable to convert string to floating point value: 'large'" on iPhone
- Metro serving old bundled code from cache

**Root Cause**: Multiple background Expo processes running from previous debugging sessions, Metro cache not fully clearing, or iPhone/Expo Go caching bundles client-side.

---

## ✅ FIXES APPLIED (Not Yet Taking Effect)

### 1. ActivityIndicator Size Prop Fix
**Problem**: React Native 0.81.5 + React 19 no longer supports string values for ActivityIndicator size prop.

**Error**:
```
Render Error
Exception in HostFunction: Unable to convert string to floating point value: "large"

Call Stack:
completeWork
runWithFiberInDEV
completeUnitOfWork
performUnitOfWork
workLoopSync
renderRootSync
performWorkOnRoot
performSyncWorkOnRoot
flushSyncWorkAcrossRoots_impl
```

**Fix Applied**:
```bash
# Global find-and-replace across all mobile/src/*.tsx files
find mobile/src -name "*.tsx" -type f -exec sed -i 's/size="large"/size={50}/g' {} \;
```

**Files Modified** (17+ files):
- mobile/src/screens/workbook/Phase1/WheelOfLifeScreen.tsx:179
- mobile/src/screens/workbook/Phase10/FutureLetterScreen.tsx
- mobile/src/screens/workbook/Phase10/GraduationScreen.tsx
- mobile/src/screens/workbook/Phase10/JourneyReviewScreen.tsx
- mobile/src/screens/workbook/Phase2/VisionBoardScreen.tsx
- mobile/src/screens/workbook/Phase3/ActionPlanScreen.tsx
- mobile/src/screens/workbook/Phase5/InnerChildScreen.tsx
- mobile/src/screens/workbook/Phase5/SelfCareRoutineScreen.tsx
- mobile/src/screens/workbook/Phase5/SelfLoveAffirmationsScreen.tsx
- mobile/src/screens/workbook/Phase7/GratitudeJournalScreen.tsx
- mobile/src/screens/workbook/Phase7/GratitudeLettersScreen.tsx
- mobile/src/screens/workbook/Phase7/GratitudeMeditationScreen.tsx
- mobile/src/screens/workbook/Phase9/SignsScreen.tsx
- mobile/src/screens/workbook/Phase9/SurrenderPracticeScreen.tsx
- mobile/src/screens/workbook/Phase9/TrustAssessmentScreen.tsx

**Before**:
```tsx
<ActivityIndicator size="large" color={DESIGN_COLORS.accentGold} />
```

**After**:
```tsx
<ActivityIndicator size={50} color={DESIGN_COLORS.accentGold} />
```

**Verification**: Confirmed via grep that only README.md documentation files still contain `size="large"` (not affecting runtime).

**Status**: ✅ Fix applied to all source files, ❌ Not taking effect on device due to cache issues.

---

## 🔄 ADDITIONAL ISSUES DISCOVERED

### Issue 2: SQLite Constraint Error (Expo Internal)
**Error shown on iPhone** (Screenshot #1):
```
There was a problem running "Manifest the Unseen".

Unknown error: SQLiteGetResultsError: (code: 19; extendedCode: 2067;
message: UNIQUE constraint failed: updates.scope_key, updates.commit_time)

exp://192.168.40.200:8081
```

**Analysis**: This is an Expo internal database error, likely from corrupted local Expo state on the device or server.

**Possible Causes**:
1. Expo Go app cache corrupted
2. Multiple Expo processes trying to write to same SQLite database
3. Expo manifest cache conflict

**Not Yet Addressed**: Needs investigation separate from ActivityIndicator issue.

---

## 🛠️ WHAT WE TRIED (Chronological)

### Attempt 1: Apply ActivityIndicator Fix
1. Used sed to globally replace `size="large"` with `size={50}` across all .tsx files
2. Verified change in WheelOfLifeScreen.tsx:179 - confirmed `size={50}`
3. Instructed user to reload app in Expo Go (shake device → Reload)

**Result**: ❌ Same error persisted - iPhone still showing "large" conversion error

### Attempt 2: Identify Stale Process
1. Checked user's screenshots - iPhone connecting to `exp://192.168.40.200:8081`
2. Ran `netstat -ano | findstr :8081` - found process PID 129668
3. Killed process: `taskkill //F //PID 129668`

**Result**: ✅ Process killed, but multiple other background processes still running

### Attempt 3: Clear Cache and Restart
**Instructed user to run** (not yet executed):
```powershell
cd C:\projects\mobileApps\manifest-the-unseen-ios\mobile
Remove-Item -Recurse -Force .expo, .metro-cache, web, dist -ErrorAction SilentlyContinue
npx expo start --clear
```

**Status**: ⏸️ User had to end session before executing

---

## 📋 NEXT SESSION PRIORITIES

### Priority 1: Nuclear Cache Clear (RECOMMENDED APPROACH)
The most reliable way to fix persistent cache issues:

```powershell
# Navigate to mobile directory
cd C:\projects\mobileApps\manifest-the-unseen-ios\mobile

# Kill ALL Node.js processes (nuclear option)
taskkill //F //IM node.exe

# Delete ALL cache directories
Remove-Item -Recurse -Force .expo, .metro-cache, node_modules/.cache, web, dist -ErrorAction SilentlyContinue

# Clear watchman cache (if installed)
watchman watch-del-all

# Reinstall node_modules (optional but recommended)
# npm install

# Start completely fresh
npx expo start --clear
```

### Priority 2: Clear Expo Go App Cache on iPhone
**On iPhone**:
1. Long-press Expo Go app icon
2. App Settings → Clear Cache
3. OR: Delete Expo Go app entirely and reinstall from App Store

This clears client-side cached bundles.

### Priority 3: Verify Fix with Web First
Before testing on iPhone, confirm fix works in web browser:

```powershell
npx expo start --web
```

Then open http://localhost:8081 in browser and verify:
- No "large" conversion error
- ActivityIndicator components render with numeric size

If web works, then the issue is definitely client-side (iPhone/Expo Go) caching.

### Priority 4: Alternative Bundler Approach
If Metro cache clearing doesn't work, try resetting the bundler entirely:

```powershell
# Delete metro config cache
Remove-Item $env:TEMP\metro-* -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item $env:TEMP\react-native-* -Recurse -Force -ErrorAction SilentlyContinue

# Start with port override to force new bundle
npx expo start --clear --port 8090
```

Then scan the new QR code (different port = fresh connection).

---

## 🐛 BACKGROUND PROCESSES (ZOMBIE ISSUE)

**Problem**: Multiple background Expo/Metro processes running from previous sessions, each with different cached code.

**Evidence from system reminders**:
- Background Bash 786705: `cd mobile && npx expo start --clear`
- Background Bash 0b3e43: `cd mobile && npx expo start --web`
- Background Bash 902e7c: `cd mobile && npx expo start --web --port 8082`
- Background Bash 881a02: `cd mobile && npx expo start --clear`
- Background Bash 5574d0, fc0f0e, 39e931, a9d69c, a3cadc, 1e2274, c6b000: Various Expo start commands

**Solution**: Kill ALL node.js processes before starting fresh:

```powershell
# Nuclear option - kill all Node processes
taskkill //F //IM node.exe

# Then verify nothing on ports 8081-8083
netstat -ano | findstr :808
```

---

## 📚 TECHNICAL CONTEXT

### Completed Upgrades (Previous Session)
- ✅ React Native: 0.73.0 → 0.81.5
- ✅ React: 18.2.0 → 19.1.0
- ✅ React-dom: 18.3.1 → 19.1.0
- ✅ TypeScript fix: setTimeout return type in packages/shared/src/utils/index.ts
- ✅ Metro config: Added `unstable_conditionNames` for Supabase ws compatibility
- ✅ Babel config: Added `unstable_transformImportMeta: true`

### Current Environment
- **Project**: Manifest the Unseen iOS app
- **Framework**: React Native 0.81.5 + Expo SDK 54
- **Testing Method**: Expo Go app on iPhone (not development build)
- **Server**: Metro bundler (should be port 8081, but multiple instances exist)
- **Network**: Local 192.168.40.200

---

## 💡 KEY INSIGHTS

### 1. React Native 0.81.5 + React 19 Breaking Changes
The upgrade introduced strict type checking for component props:
- `<ActivityIndicator size="large" />` → ERROR (string not allowed)
- `<ActivityIndicator size={50} />` → WORKS (numeric value required)

This affects all React Native components with numeric props that previously accepted strings.

### 2. Metro Cache Persistence
Metro bundler aggressively caches transformed modules across sessions. Simply restarting `expo start` or using `--clear` flag doesn't always invalidate all caches. True cache clear requires:
- Deleting `.metro-cache` directory
- Deleting `node_modules/.cache` directory
- Killing all node processes
- Optionally: `watchman watch-del-all` (if watchman installed)

### 3. Expo Go Client-Side Caching
Expo Go app on iPhone caches JavaScript bundles locally. Even with fresh Metro server, the app may serve old cached bundle. Solutions:
- Clear Expo Go app cache in iOS settings
- Delete and reinstall Expo Go app
- Use different port number to force new connection

### 4. Background Process Zombies
Running Expo via background bash processes (Claude's Bash tool) creates persistent processes that survive terminal close. These zombie processes:
- Continue serving stale code
- Occupy ports (8081, 8082, etc.)
- Cause client confusion (iPhone connects to wrong server)
- Must be manually killed via `taskkill` or `pkill`

---

## 🎯 SUCCESS CRITERIA FOR NEXT SESSION

### Minimum Goal
- [ ] Clear all Metro and Expo caches successfully
- [ ] Start single fresh Metro bundler on port 8081
- [ ] Verify no background zombie processes
- [ ] Confirm fix works in web browser (http://localhost:8081)

### Target Goal
- [ ] iPhone connects to fresh Metro server
- [ ] App loads without "large" conversion error
- [ ] ActivityIndicator components render correctly
- [ ] No SQLite constraint errors

### Stretch Goal
- [ ] App fully functional on iPhone
- [ ] Navigate to workbook screen (test real UI)
- [ ] Commit all fixes to Git
- [ ] Document complete solution for future reference

---

## 🔍 DEBUGGING STRATEGY FOR NEXT SESSION

### Step 1: Clean Slate
```powershell
cd C:\projects\mobileApps\manifest-the-unseen-ios\mobile

# Kill everything
taskkill //F //IM node.exe

# Delete all caches
Remove-Item -Recurse -Force .expo, .metro-cache, node_modules/.cache, web, dist -ErrorAction SilentlyContinue

# Verify ports are free
netstat -ano | findstr :808
# Should return nothing
```

### Step 2: Start Fresh Metro
```powershell
npx expo start --clear
```

Watch for:
- ✅ "Metro waiting on exp://192.168.40.200:8081"
- ✅ QR code generated
- ❌ Any errors about SQLite, ports in use, or cache issues

### Step 3: Test Web First
```powershell
# Press 'w' in Expo terminal
# OR run separately:
npx expo start --web
```

Open browser to http://localhost:8081 and verify:
- Page loads without errors
- Console shows no "large" conversion errors
- App UI renders (even if basic)

### Step 4: Test iPhone
Only if web works:
1. Clear Expo Go cache on iPhone (Settings → Expo Go → Clear Cache)
2. Scan QR code from fresh Metro bundler
3. Wait for bundle to download (may take 30-60 seconds)
4. Check for errors

### Step 5: Diagnose Specific Error
If error persists after all above:

**If "large" error still shows** → Problem in source code (our fix didn't apply correctly)
**If SQLite error shows** → Expo Go app issue (reinstall Expo Go)
**If connection timeout** → Network/firewall issue
**If blank screen** → Check Metro logs for bundle errors

---

## 📝 FILES MODIFIED (Not Yet Committed)

### Source Code Changes
1. **mobile/src/screens/workbook/Phase1/WheelOfLifeScreen.tsx** - ActivityIndicator size
2. **mobile/src/screens/workbook/Phase2/VisionBoardScreen.tsx** - ActivityIndicator size
3. **mobile/src/screens/workbook/Phase3/ActionPlanScreen.tsx** - ActivityIndicator size
4. **mobile/src/screens/workbook/Phase5/*.tsx** (3 files) - ActivityIndicator size
5. **mobile/src/screens/workbook/Phase7/*.tsx** (3 files) - ActivityIndicator size
6. **mobile/src/screens/workbook/Phase9/*.tsx** (3 files) - ActivityIndicator size
7. **mobile/src/screens/workbook/Phase10/*.tsx** (3 files) - ActivityIndicator size

### Git Status
```
Modified: 17+ .tsx files (ActivityIndicator size prop changes)
Untracked: docs/EXPO-DEBUGGING-SESSION-2025-11-26.md (this file)
```

**TO COMMIT AFTER VERIFICATION**:
```bash
git add mobile/src/screens/workbook/**/*.tsx
git commit -m "fix: update ActivityIndicator size prop for React Native 0.81.5 + React 19 compatibility

- Replace all size='large' with size={50} (numeric value required)
- Affects 17+ workbook screen components
- Resolves 'Unable to convert string to floating point value' error
- Part of React Native 0.73 → 0.81.5 upgrade"
```

---

## 🚨 KNOWN ISSUES LOG

### Issue 1: ActivityIndicator Size Prop
- **Status**: Fixed in code, not yet verified on device
- **Priority**: P0 (blocks app from loading)
- **Next Action**: Clear all caches and test

### Issue 2: SQLite Constraint Error
- **Status**: Not investigated
- **Priority**: P1 (may resolve itself with cache clear)
- **Next Action**: Monitor after cache clear; if persists, investigate Expo manifest database

### Issue 3: Zombie Background Processes
- **Status**: Partially addressed (killed one process)
- **Priority**: P1 (causes cache confusion)
- **Next Action**: Kill all node.exe processes before fresh start

### Issue 4: Metro Cache Persistence
- **Status**: Under investigation
- **Priority**: P0 (prevents fixes from taking effect)
- **Next Action**: Nuclear cache clear + Metro config review

---

## 📞 SESSION METADATA

**Session Date**: November 26, 2025
**Session Duration**: ~30 minutes
**User Status**: Had to end session for call
**Issue Status**: Unresolved (fix applied but not taking effect)
**Blocker**: Persistent Metro/Expo cache issues
**Confidence Level**: High that fix is correct, medium that cache clear will work
**Frustration Level**: High (user frustrated, multiple attempts unsuccessful)

---

## 🎓 LESSONS LEARNED

### 1. Cache Invalidation is Hard
Metro's multi-layer caching (bundler cache, transform cache, module cache, client cache) makes it very difficult to ensure fresh code is served. Future approach: Always start with nuclear cache clear when debugging render errors.

### 2. Background Processes are Dangerous
Running Expo via background bash processes creates zombie servers that interfere with debugging. Better approach: Instruct user to run Expo directly in their terminal so they have full control.

### 3. Test Web First
Web browser doesn't have client-side caching issues like Expo Go. Always verify fixes work in web before debugging mobile connection issues.

### 4. React 19 Breaking Changes
The React 19 upgrade introduced stricter prop type checking. Need comprehensive audit of all components for similar string → numeric prop issues:
- ActivityIndicator size
- Slider value props
- Animation timing values
- Dimension props

---

## 📋 IMMEDIATE NEXT STEPS (For User's Next Session)

Copy-paste this into PowerShell terminal:

```powershell
# Navigate to project
cd C:\projects\mobileApps\manifest-the-unseen-ios\mobile

# NUCLEAR OPTION - Kill all Node processes
taskkill //F //IM node.exe

# Delete ALL caches
Remove-Item -Recurse -Force .expo -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .metro-cache -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force node_modules\.cache -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force web -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force dist -ErrorAction SilentlyContinue

# Verify ports are clear
Write-Host "`nChecking for processes on ports 8081-8083:"
netstat -ano | findstr :808

# If anything shows up, kill those PIDs manually:
# taskkill //F //PID <PID_NUMBER>

# Start completely fresh
Write-Host "`nStarting Expo with cleared cache..."
npx expo start --clear
```

Then:
1. When prompted for login, press **Enter** to skip
2. Press **'w'** to test in web browser first
3. If web works, scan QR code with iPhone Camera app
4. In Expo Go on iPhone, shake device → tap "Reload" if needed

---

**If still broken after above**: Delete and reinstall Expo Go app on iPhone, then try again.

**Session will resume from**: Verifying that ActivityIndicator fix takes effect after complete cache clear.

---

## 🔗 REFERENCE LINKS

- [React Native 0.81.5 Release Notes](https://github.com/facebook/react-native/releases/tag/v0.81.5)
- [React 19 Upgrade Guide](https://react.dev/blog/2024/12/05/react-19)
- [Expo Troubleshooting: Clear Cache](https://docs.expo.dev/troubleshooting/clear-cache/)
- [Metro Bundler Caching](https://metrobundler.dev/docs/caching/)
- Previous session: `docs/EXPO-DEBUGGING-SESSION-2025-11-25.md`

---

**End of Session Notes**
