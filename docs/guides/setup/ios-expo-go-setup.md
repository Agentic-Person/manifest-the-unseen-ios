# iOS Testing with Expo Go

Complete guide to testing Manifest the Unseen on iPhone or iPad using Expo Go - no macOS or Xcode required!

## Why Expo Go for iOS?

- **No macOS needed**: Test on real iPhone/iPad from your Windows PC
- **No Xcode**: Skip the 40GB download and complex setup
- **Instant updates**: Scan QR code → app loads in ~5 seconds
- **Hot reload**: Save code on Windows → changes appear on iPhone immediately
- **Free**: No Apple Developer account needed for development testing
- **Real device**: Test touch gestures, performance, real sensors

**Limitations**:
- Can't test native modules (push notifications, in-app purchases) until you build
- Requires same WiFi network as development PC
- For App Store submission, you'll need a macOS or cloud build service (EAS Build)

## Prerequisites

- **iPhone or iPad** running iOS 13.4 or later
- **Windows PC** with Node.js 18+ and Expo installed
- **Same WiFi network** for both PC and iPhone/iPad
- **Expo Go app** installed on iOS device (free)

## Step 1: Install Expo Go on iPhone/iPad

### Download from App Store

1. Open **App Store** on your iPhone or iPad
2. Search for **"Expo Go"**
3. Tap **Get** → **Install** (it's free)
4. Wait for installation to complete
5. Tap **Open** to launch Expo Go

### First Launch

1. Expo Go will request permissions:
   - **Camera**: Allow (for scanning QR codes)
   - **Notifications**: Allow (optional, for development alerts)
2. **Create an Expo account** (optional, but recommended):
   - Tap **Sign up**
   - Enter email and password
   - Verify email (check inbox)
3. Or **continue as guest** (can still scan QR codes)

Expo Go is now ready to receive your app!

## Step 2: Connect PC and iPhone to Same WiFi

### Critical Requirement

- **Both devices MUST be on the same WiFi network**
- **5 GHz WiFi recommended** for faster loading
- **Avoid guest networks** (may block device-to-device communication)
- **VPNs may interfere** - disable VPN on both devices during testing

### Verify Connection

On your Windows PC:
```bash
# Check your PC's IP address
ipconfig

# Look for "IPv4 Address" under your WiFi adapter
# Should be something like: 192.168.1.100
```

Remember this IP - you'll see it in the Expo QR code.

## Step 3: Start Expo Dev Server

### From Project Directory

Open a terminal and navigate to the mobile app:
```bash
cd C:\projects\mobileApps\manifest-the-unseen-ios\mobile
```

### Start Expo

```bash
npm start
# Or: npx expo start
```

You should see:
```
› Metro waiting on exp://192.168.1.100:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

› Using Expo Go
› Press s │ switch to development build
› Press a │ open Android
› Press w │ open web

› Press j │ open debugger
› Press r │ reload app
› Press m │ toggle menu
› Press o │ open project code in your editor

› Press ? │ show all commands
```

**Note the QR code displayed in the terminal.**

## Step 4: Load App on iPhone via QR Code

### Method 1: Scan with iPhone Camera (Recommended)

1. **Open the Camera app** on iPhone (not Expo Go)
2. **Point at the QR code** displayed in your Windows terminal
3. A **notification banner** will appear at the top:
   - "Open in Expo Go"
4. **Tap the notification**
5. Expo Go will open and start loading the app

### Method 2: Scan within Expo Go App

1. **Open Expo Go** app on iPhone
2. Tap **Scan QR Code** (on the Projects tab)
3. **Point camera** at the QR code in your terminal
4. App will automatically start loading

### Method 3: Manual URL Entry (Fallback)

If QR scanning doesn't work:

1. **Open Expo Go** on iPhone
2. Tap **Enter URL manually** (at bottom of Projects tab)
3. **Enter the URL** from terminal (e.g., `exp://192.168.1.100:8081`)
4. Tap **Connect**

### What Happens Next

- **JavaScript bundle downloads** (~5-10 seconds)
- **App splash screen** appears (purple with "Manifest the Unseen")
- **App loads** and shows the login screen
- **You're now running the app!**

## Step 5: Development Workflow

### Hot Reload in Action

1. **Make a code change** on your Windows PC (e.g., edit `mobile/App.tsx`)
2. **Save the file** (Ctrl + S in VS Code)
3. **Watch your iPhone** - app automatically reloads in ~2 seconds
4. **No need to rebuild or re-scan QR code**

This is the magic of Expo Go - instant feedback loop!

### Open Developer Menu

**Shake your iPhone** vigorously, or:
- **iPhone**: Shake device physically
- **iPad**: Shake device or press Cmd + D (if keyboard connected)

Developer menu shows options:
- **Reload**: Manually refresh the app
- **Go Home**: Return to Expo Go home
- **Debug Remote JS**: Open debugger in Chrome on PC
- **Show Performance Monitor**: FPS and memory usage
- **Enable Fast Refresh**: Hot reload (on by default)

### View Logs

Logs appear in two places:

1. **Windows Terminal** (where you ran `npm start`):
   - All console.log() statements
   - Errors and warnings
   - Bundle build progress

2. **Expo Go App** (shake → Show Performance Monitor):
   - App-specific logs
   - Native module warnings

### Reload Manually

If hot reload doesn't work:
- **Press `r`** in the Windows terminal
- Or **shake iPhone** → tap **Reload**

## Step 6: Test App Features

### What Works in Expo Go

✅ **Full UI and navigation**
- All screens (Login, Sign Up, Home, Dashboard)
- React Navigation works perfectly
- Design system (buttons, inputs, cards)
- Custom fonts and icons (once added)

✅ **Supabase integration**
- Authentication (email sign up/login)
- Database queries
- Real-time subscriptions
- Storage (vision board images)

✅ **State management**
- Zustand stores
- TanStack Query (React Query)
- AsyncStorage for caching

✅ **Most React Native features**
- TouchableOpacity, ScrollView, FlatList
- Gestures (swipe, pinch, rotate)
- Animations (Animated API, LayoutAnimation)
- Audio playback (react-native-track-player works in Expo Go)

### What Doesn't Work (Yet)

❌ **Native modules not included in Expo Go**:
- Push notifications (need development build)
- In-app purchases (need development build)
- Background tasks
- Advanced camera features
- Custom native modules

**Solution**: For these features, you'll need to build a custom development client:
```bash
npx expo prebuild
npx expo run:ios
```
This requires macOS or a cloud build service (EAS Build).

### Testing Checklist

Test these flows on iPhone:

1. **Authentication**:
   - Sign up with email (check Supabase dashboard)
   - Log in with existing account
   - Log out

2. **Navigation**:
   - Tab bar navigation (when implemented)
   - Screen transitions
   - Back button behavior

3. **Forms**:
   - Text input (keyboard appears)
   - Validation (error messages)
   - Submit actions

4. **Performance**:
   - Scroll smoothness (60 FPS)
   - Touch responsiveness
   - App launch time

5. **Design System**:
   - Buttons (primary, secondary, outline)
   - Typography (headings, body text)
   - Colors (purple theme, dark mode)
   - Spacing consistency

## Troubleshooting

### "Unable to Connect to Metro"

**Symptoms**: QR code scans, but app shows "Could not connect to development server"

**Solutions**:
1. **Verify same WiFi**: Check both PC and iPhone are on the same network
   ```bash
   # On PC, check IP:
   ipconfig
   # Note the IPv4 address (e.g., 192.168.1.100)
   ```
2. **Check Windows Firewall**:
   - Allow Node.js through firewall
   - Open Windows Defender Firewall → Allow an app
   - Find Node.js and check both Private and Public
3. **Restart Expo server**:
   ```bash
   # In terminal, press Ctrl+C to stop
   npm start
   ```
4. **Use Tunnel Mode** (slower but works through firewall):
   ```bash
   npx expo start --tunnel
   # Requires ngrok to be installed
   ```

### "Network Response Timed Out"

**Symptoms**: App starts loading but times out before JavaScript bundle downloads

**Solutions**:
1. **Move closer to WiFi router** (both PC and iPhone)
2. **Restart WiFi router**
3. **Disable VPN** on both devices
4. **Clear Expo cache**:
   ```bash
   npm start -- --clear
   ```
5. **Try LAN connection**:
   ```bash
   npx expo start --lan
   ```

### "Something Went Wrong" (Red Screen)

**Symptoms**: App loads but shows error screen in Expo Go

**Solutions**:
1. **Check terminal logs** on PC for error details (red text)
2. **Common issues**:
   - Missing environment variables (check `.env` file exists)
   - Supabase connection error (verify `SUPABASE_URL` and `SUPABASE_ANON_KEY`)
   - Import/export errors (check file paths)
3. **Clear Metro cache**:
   ```bash
   npm start -- --reset-cache
   ```
4. **Reinstall dependencies**:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

### QR Code Not Scanning

**iPhone Camera doesn't recognize QR code**:
1. **Update iOS**: Go to Settings → General → Software Update
2. **Enable Camera for QR**: Settings → Camera → Scan QR Codes (on)
3. **Better lighting**: Point camera at screen in good lighting
4. **Screenshot and scan**: Screenshot the QR code, send to iPhone, scan from Photos

**Expo Go doesn't scan QR code**:
1. **Update Expo Go**: Check App Store for updates
2. **Grant camera permission**: Settings → Expo Go → Camera (allow)
3. **Use manual URL entry** (Method 3 above)

### App Crashes on Startup

1. **Check Expo SDK compatibility**:
   ```bash
   npx expo-doctor
   # Checks for version mismatches
   ```
2. **View crash logs**:
   - Shake iPhone → tap "Go Home" → tap project again
   - Check terminal on PC for errors
3. **Verify package.json**:
   - Ensure all Expo packages match SDK version (54.x)

### Slow Performance

**App is laggy or slow to load**:
1. **Use 5 GHz WiFi** instead of 2.4 GHz (faster bundle transfer)
2. **Close other apps** on iPhone (free up RAM)
3. **Enable Fast Refresh**: Shake → Enable Fast Refresh
4. **Reduce console logs** (excessive logging slows down app)
5. **Check PC performance**: Close other apps, free up CPU

## Performance Tips

### Faster Development

- **Keep Expo server running**: Don't restart unless necessary
- **Use WiFi 5 or 6**: Faster JavaScript bundle transfer
- **Reduce bundle size**: Use production builds for large apps
- **Optimize images**: Use compressed images, not high-res originals

### Better Testing

- **Test on multiple iOS versions**: Borrow devices with iOS 13, 14, 15, 16
- **Test on iPad**: Different screen sizes reveal layout issues
- **Test in landscape**: Rotate iPhone to landscape mode
- **Test with slow network**: Settings → Developer → Network Link Conditioner

## Comparing Android Emulator vs iOS Expo Go

| Feature | Android Emulator | iOS Expo Go |
|---------|------------------|-------------|
| Setup Time | 30-60 min (Android Studio) | 5 min (install app) |
| Performance | Fast (native on PC) | Fast (real device) |
| Hot Reload | Instant (~1 sec) | Instant (~2 sec) |
| Touch/Gestures | Mouse (less realistic) | Real touch (perfect) |
| Debugging | Full Chrome DevTools | Limited (logs only) |
| Native Modules | All (with build) | Limited (Expo Go only) |
| Cost | Free | Free |
| Best For | Daily development | iOS-specific testing |

**Recommendation**:
- Use **Android emulator** for 80% of development (faster iteration)
- Use **iOS Expo Go** for iOS-specific testing and final verification before builds

## Next Steps

After successfully running on iPhone:

1. **Test all auth screens**: Sign up, login, logout
2. **Check design on iOS**: Fonts, colors, spacing may differ from Android
3. **Test gestures**: Swipe navigation, pull-to-refresh (when implemented)
4. **Verify Supabase**: Create journal entry, fetch from database
5. **Check performance**: Scroll lists, navigate between screens

When ready for native features (push notifications, purchases):
- Use **EAS Build** for cloud-based iOS builds (no macOS needed)
- Or use **Codemagic/Bitrise** (cloud build services)
- Or borrow a Mac for local builds with Xcode

## Resources

- [Expo Go on App Store](https://apps.apple.com/app/expo-go/id982107779)
- [Expo Go Documentation](https://docs.expo.dev/get-started/expo-go/)
- [Debugging with Expo](https://docs.expo.dev/debugging/runtime-issues/)
- [EAS Build for iOS](https://docs.expo.dev/build/introduction/)

## Quick Reference

### Daily Workflow

```bash
# 1. Start Expo server on Windows PC
cd C:\projects\mobileApps\manifest-the-unseen-ios\mobile
npm start

# 2. Scan QR code with iPhone Camera
# 3. Code on Windows → Save file → Auto-reload on iPhone
# 4. Test, iterate, repeat!
```

### Useful Commands in Terminal

While Expo is running, press:
- **`r`** - Reload app manually
- **`m`** - Toggle dev menu on device
- **`j`** - Open debugger in Chrome
- **`c`** - Clear Metro bundler cache
- **`?`** - Show all commands

### iPhone Shortcuts

- **Shake device** - Open developer menu
- **Swipe down from top** - Notifications (see Expo alerts)
- **Double-tap home** - Switch apps (force quit Expo Go if needed)

---

**Setup Status**: iPhone ready for testing with Expo Go. No macOS or Xcode required!
