# Quick Install Guide - Core Dependencies

This is a quick reference for installing all core dependencies. For detailed documentation, see `docs/dependencies-setup-guide.md`.

## Prerequisites

- Node.js v18+
- React Native project initialized (TASK-003 complete)
- CocoaPods installed

## Installation Commands

### 1. Audio Libraries

```bash
# Install all audio dependencies
npm install react-native-track-player \
            react-native-audio-recorder-player \
            @react-native-whisper/whisper

# Install iOS native modules
cd ios && pod install && cd ..
```

### 2. Form Libraries

```bash
# Install form handling and validation
npm install react-hook-form zod @hookform/resolvers
```

### 3. Environment Configuration

```bash
# Install environment variable loader
npm install react-native-config

# iOS setup
cd ios && pod install && cd ..

# Create environment file
cp ../.env.example .env
# Now edit .env with your actual API keys (see docs/api-keys-guide.md)
```

## All-in-One Installation

```bash
# Run from mobile/ directory
npm install \
  react-native-track-player \
  react-native-audio-recorder-player \
  @react-native-whisper/whisper \
  react-hook-form \
  zod \
  @hookform/resolvers \
  react-native-config

# Install iOS pods
cd ios && pod install && cd ..

# Setup environment
cp ../.env.example .env
```

## iOS Configuration Required

After installation, you MUST configure iOS permissions:

### Edit `ios/ManifestTheUnseen/Info.plist`

Add these keys:

```xml
<!-- Background Audio -->
<key>UIBackgroundModes</key>
<array>
  <string>audio</string>
</array>

<!-- Microphone Permission -->
<key>NSMicrophoneUsageDescription</key>
<string>Manifest the Unseen needs microphone access for voice journaling. Your recordings are transcribed on-device and never uploaded.</string>
```

## Verification

Test that everything installed correctly:

```bash
# Check dependencies
npm list react-native-track-player
npm list react-native-audio-recorder-player
npm list react-hook-form
npm list zod
npm list react-native-config

# Build iOS app
npm run ios
```

If the app builds and runs, installation is successful!

## Troubleshooting

### CocoaPods Issues

```bash
cd ios
pod deintegrate
pod cache clean --all
pod install
cd ..
```

### Build Errors

```bash
# Clean and rebuild
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
npm start -- --reset-cache
npm run ios
```

## Next Steps

1. Obtain API keys: `docs/api-keys-guide.md`
2. Fill in `.env` file with your keys
3. Test audio libraries initialization
4. Begin Week 2 feature development

---

For complete documentation, see:
- `docs/dependencies-setup-guide.md` - Full installation guide
- `docs/api-keys-guide.md` - API key setup guide
- `docs/react-native-setup-guide.md` - React Native setup
