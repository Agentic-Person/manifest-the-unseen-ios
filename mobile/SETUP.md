# Mobile App Setup Guide

Complete guide to setting up the Manifest the Unseen mobile app.

## Prerequisites

Before you begin, ensure you have the following installed:

### Required Software

1. **Node.js 18+**
   ```bash
   node --version  # Should be 18.0.0 or higher
   ```

2. **Xcode 14+** (macOS only, for iOS development)
   - Install from Mac App Store
   - Install Command Line Tools: `xcode-select --install`

3. **CocoaPods** (for iOS dependencies)
   ```bash
   sudo gem install cocoapods
   ```

4. **Watchman** (recommended for React Native)
   ```bash
   brew install watchman
   ```

## Step-by-Step Setup

### 1. Initialize React Native Project

Since this is a new project, you'll need to initialize React Native:

```bash
# From the root directory
npx react-native init ManifestTheUnseen --template react-native-template-typescript

# Or use the existing mobile directory structure
cd mobile
```

### 2. Install Dependencies

```bash
npm install
```

This installs all dependencies defined in `package.json`:

**Core Dependencies:**
- `react-native` - Mobile framework
- `@react-navigation/native` - Navigation
- `@react-navigation/bottom-tabs` - Tab navigation
- `@react-navigation/native-stack` - Stack navigation
- `zustand` - State management
- `@tanstack/react-query` - Server state
- `@supabase/supabase-js` - Backend client

**Supporting Libraries:**
- `react-native-screens` - Native screens
- `react-native-safe-area-context` - Safe area handling
- `react-native-gesture-handler` - Gesture support
- `@react-native-async-storage/async-storage` - Local storage

### 3. Install iOS Dependencies

```bash
cd ios
pod install
cd ..
```

This installs native iOS dependencies via CocoaPods.

### 4. Configure Environment Variables

Create a `.env` file in the `mobile` directory:

```env
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Development Settings
DEV_MODE=true
```

**Getting Supabase Credentials:**
1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy the "Project URL" for `SUPABASE_URL`
4. Copy the "anon/public" key for `SUPABASE_ANON_KEY`

### 5. Configure iOS Project (Optional)

Edit `ios/ManifestTheUnseen/Info.plist` to add required permissions:

```xml
<key>NSCameraUsageDescription</key>
<string>We need camera access for vision boards</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>We need photo library access for vision boards</string>
<key>NSMicrophoneUsageDescription</key>
<string>We need microphone access for voice journaling</string>
```

### 6. Run the App

**iOS Simulator:**
```bash
npm run ios
```

**Physical iOS Device:**
```bash
npm run ios -- --device "Your Device Name"
```

**Start Metro Bundler Separately:**
```bash
npm start
```

## Project Configuration

### TypeScript Configuration

The `tsconfig.json` is already configured with:
- Strict mode enabled
- Path aliases (`@/*` maps to `src/*`)
- React Native preset

### Navigation Configuration

Navigation is set up with:
- **RootNavigator**: Handles auth flow
- **MainTabNavigator**: Bottom tabs for main app
- **Type-safe navigation**: Full TypeScript support

### State Management Configuration

Three Zustand stores are configured:
1. **authStore**: User authentication and profile
2. **settingsStore**: App settings and preferences
3. **appStore**: Global app state

All stores persist to AsyncStorage automatically.

### TanStack Query Configuration

Query client is configured with:
- 5-minute stale time
- 10-minute cache time
- Automatic retry on failure
- Global error handling

## Development Workflow

### 1. Start Development Server

```bash
npm start
```

This starts the Metro bundler.

### 2. Run on Device/Simulator

In a new terminal:
```bash
npm run ios
```

### 3. Hot Reloading

- **Fast Refresh**: Automatically enabled (edit and save files to see changes)
- **Manual Reload**: Shake device or press `Cmd+R` in simulator
- **Dev Menu**: Shake device or press `Cmd+D` in simulator

### 4. Debugging

**React Native Debugger:**
```bash
# Install globally
npm install -g react-devtools

# Run
react-devtools
```

**Chrome DevTools:**
1. Open Dev Menu (`Cmd+D`)
2. Select "Debug" (opens Chrome)
3. Use Chrome DevTools

**Flipper (Recommended):**
- Download from: https://fbflipper.com/
- Automatically connects to running app

## Common Commands

```bash
# Development
npm start                 # Start Metro bundler
npm run ios              # Run iOS app
npm run android          # Run Android app (future)

# Testing
npm test                 # Run Jest tests
npm run test:watch       # Run tests in watch mode
npm run lint             # Run ESLint
npm run type-check       # Run TypeScript type checking

# Cleaning
npm start -- --reset-cache        # Clear Metro cache
rm -rf node_modules && npm install # Reinstall dependencies
cd ios && pod deintegrate && pod install # Reinstall pods
```

## Troubleshooting

### Metro Bundler Issues

**Error: Metro bundler not starting**
```bash
# Clear cache and restart
npm start -- --reset-cache
```

**Error: Port already in use**
```bash
# Kill process on port 8081
lsof -ti:8081 | xargs kill
```

### iOS Build Issues

**Error: CocoaPods dependencies not found**
```bash
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
```

**Error: Xcode build failed**
```bash
# Clean build folder
cd ios
xcodebuild clean
cd ..
```

**Error: Developer certificate issues**
- Open `ios/ManifestTheUnseen.xcworkspace` in Xcode
- Select the project in navigator
- Go to Signing & Capabilities
- Select your development team

### TypeScript Issues

**Error: Cannot find module '@/...'**
- Restart TypeScript server in your editor
- Check `tsconfig.json` paths configuration

**Error: Type errors in imported modules**
```bash
# Regenerate types
npm run type-check
```

### Supabase Connection Issues

**Error: Supabase client not initialized**
- Check `.env` file exists
- Verify environment variables are correct
- Restart Metro bundler after changing `.env`

**Error: Authentication not working**
- Check Supabase project is active
- Verify anon key is correct (not service key)
- Check network connectivity

## Testing Strategy

### Unit Tests

```bash
npm test
```

Located in `__tests__/` directories or `.test.ts` files.

### Component Tests

```bash
npm test -- --coverage
```

Tests use `@testing-library/react-native`.

### Type Checking

```bash
npm run type-check
```

Ensures TypeScript types are correct.

### Manual Testing

Use the following test scenarios:

1. **Navigation Flow**
   - Test all tab navigation
   - Test back button behavior
   - Test deep linking (future)

2. **Authentication Flow**
   - Sign up with email
   - Sign in with email
   - Sign in with Apple (future)
   - Sign out

3. **Data Persistence**
   - Close app and reopen
   - Verify user stays signed in
   - Verify settings persist

4. **Network Handling**
   - Test offline mode (airplane mode)
   - Test slow network
   - Test network reconnection

## Next Steps

After setup is complete:

1. **Review the Architecture**
   - Read `README.md` for project structure
   - Understand navigation hierarchy
   - Review state management patterns

2. **Start Building Features**
   - Begin with authentication screens
   - Follow the 28-week timeline from PRD
   - Reference TDD for implementation details

3. **Set Up Additional Tools**
   - Error tracking (Sentry)
   - Analytics (TelemetryDeck)
   - Crash reporting
   - CI/CD pipeline

4. **Configure Backend**
   - Set up Supabase database tables
   - Configure Row Level Security (RLS)
   - Set up authentication providers
   - Create Edge Functions

## Resources

- **React Native**: https://reactnative.dev/
- **React Navigation**: https://reactnavigation.org/
- **Zustand**: https://docs.pmnd.rs/zustand/
- **TanStack Query**: https://tanstack.com/query/
- **Supabase**: https://supabase.com/docs/
- **TypeScript**: https://www.typescriptlang.org/

## Support

For issues or questions:
1. Check this setup guide
2. Review README.md
3. Check React Native troubleshooting docs
4. Check Supabase docs for backend issues

## License

Proprietary - All rights reserved
