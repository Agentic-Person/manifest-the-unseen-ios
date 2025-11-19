# Manifest the Unseen - Mobile App

React Native mobile application with Expo for iOS and Android development.

## Quick Start

```bash
# Install dependencies
npm install

# Start Expo dev server
npm start

# Run on Android emulator
npm run android

# Run on iOS with Expo Go (scan QR code on iPhone)
# Or: npm run ios (requires macOS)
```

## Development Environment

This project uses **Expo** for streamlined development on Windows with cross-platform testing:

- **Primary Development**: Android emulator on Windows PC (fast iteration)
- **iOS Testing**: Expo Go app on iPhone/iPad (scan QR code, no macOS needed)
- **Production Builds**: EAS Build or cloud services (when ready for App Store)

### Platform-Specific Guides

- **[Android Emulator Setup](../docs/android-emulator-setup.md)** - Complete guide for Windows + Android Studio
- **[iOS Testing with Expo Go](../docs/ios-expo-go-setup.md)** - Test on real iPhone without macOS

## Tech Stack

### Core
- **React Native 0.73** - Cross-platform mobile framework
- **Expo SDK 54** - Development tools and managed workflow
- **TypeScript** - Type-safe JavaScript
- **React Navigation 6+** - Navigation library

### State Management
- **Zustand** - Lightweight state management
- **TanStack Query** (React Query) - Server state management
- **AsyncStorage** - Local persistence

### Backend
- **Supabase** - Backend-as-a-Service
  - PostgreSQL database with pgvector
  - Authentication (Apple Sign-In, email)
  - Real-time subscriptions
  - Storage for media files

## Available Scripts

### Development
```bash
npm start              # Start Expo dev server
npm run android        # Run on Android emulator
npm run ios            # Run on iOS (macOS only)
npm run expo-go        # Start with Expo Go
```

### Testing & Quality
```bash
npm test               # Run Jest tests
npm run lint           # Run ESLint
npm run type-check     # Run TypeScript compiler
```

### Building
```bash
npm run build:android  # Build Android (EAS Build)
npm run build:ios      # Build iOS (EAS Build)
```

## Development Workflow

### Windows + Android Emulator (Recommended)

1. Start Android emulator: `emulator -avd Pixel_5_API_33`
2. Start Expo: `npm start`
3. Press `a` to open on Android
4. Code → Save → Auto-reload (~2 seconds)

### iPhone + Expo Go

1. Start Expo: `npm start`
2. Scan QR code with iPhone Camera
3. App loads in Expo Go
4. Code → Save → Auto-reload

## Project Structure

```
mobile/
├── src/
│   ├── components/         # UI components (buttons, inputs, etc.)
│   ├── navigation/         # React Navigation setup
│   ├── screens/            # Screen components
│   ├── stores/             # Zustand state management
│   ├── services/           # External services (Supabase)
│   ├── hooks/              # Custom React hooks
│   ├── theme/              # Design system (tokens, colors)
│   └── types/              # TypeScript types
├── assets/                 # Images (icon, splash)
├── App.tsx                 # Root component
├── index.js                # Expo entry point
└── app.json                # Expo configuration
```

## Environment Variables

Create `.env` file:

```env
SUPABASE_URL=http://localhost:54321
SUPABASE_ANON_KEY=your_supabase_anon_key
ENABLE_AI_CHAT=false
ENABLE_VOICE_TRANSCRIPTION=false
ENABLE_ANALYTICS=false
DEBUG=true
```

Get local Supabase credentials:
```bash
npx supabase status
```

## Troubleshooting

### Expo Won't Start
```bash
npm start -- --clear
```

### Metro Cache Issues
```bash
npm start -- --reset-cache
```

### Android Emulator Issues
```bash
adb devices          # Check connection
adb kill-server      # Restart adb
adb start-server
```

### iOS Expo Go Issues
See [iOS Expo Go Guide](../docs/ios-expo-go-setup.md#troubleshooting)

### Supabase Connection
```bash
npx supabase status  # Verify running
cat .env             # Check credentials
```

## Building for Production

### EAS Build (Cloud, No macOS Needed)
```bash
npm install -g eas-cli
eas login
eas build:configure
eas build --platform ios
eas build --platform android
```

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Supabase React Native](https://supabase.com/docs/guides/getting-started/tutorials/with-react-native)
- [Android Setup Guide](../docs/android-emulator-setup.md)
- [iOS Setup Guide](../docs/ios-expo-go-setup.md)

## License

Proprietary - All rights reserved
