# Dependencies Setup Guide

This guide provides step-by-step instructions for installing all core dependencies for the Manifest the Unseen iOS application.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Audio Libraries](#audio-libraries)
3. [Form Libraries](#form-libraries)
4. [Environment Configuration](#environment-configuration)
5. [iOS Permissions](#ios-permissions)
6. [Verification](#verification)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before installing dependencies, ensure you have completed:

- **TASK-003**: React Native project initialized
- **Node.js**: v18 or higher installed
- **iOS Development**: Xcode 14+ installed (macOS only)
- **CocoaPods**: Installed (`sudo gem install cocoapods`)
- **Working Directory**: Navigate to project root

**Verify Prerequisites:**

```bash
node --version  # Should be v18+
npm --version   # Should be v9+
pod --version   # Should be v1.12+
xcode-select --version  # Verify Xcode command line tools
```

---

## Audio Libraries

The app requires three audio libraries for meditation playback, voice journaling, and transcription.

### 1. React Native Track Player

**Purpose**: Background audio playback for meditation sessions

```bash
cd mobile
npm install react-native-track-player
```

**iOS Native Setup:**

```bash
cd ios
pod install
cd ..
```

**Configuration** (create `mobile/src/services/playerSetup.ts`):

```typescript
import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
} from 'react-native-track-player';

export async function setupPlayer() {
  let isSetup = false;
  try {
    await TrackPlayer.getCurrentTrack();
    isSetup = true;
  } catch {
    await TrackPlayer.setupPlayer();
    await TrackPlayer.updateOptions({
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.SeekTo,
      ],
      compactCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
      ],
      progressUpdateEventInterval: 2,
      android: {
        appKilledPlaybackBehavior:
          AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
      },
    });
    isSetup = true;
  }
  return isSetup;
}
```

**iOS Background Mode:**

Edit `mobile/ios/ManifestTheUnseen/Info.plist` and add:

```xml
<key>UIBackgroundModes</key>
<array>
  <string>audio</string>
</array>
```

**Documentation**: https://react-native-track-player.js.org/docs/basics/installation

---

### 2. React Native Audio Recorder Player

**Purpose**: Voice journaling audio recording

```bash
npm install react-native-audio-recorder-player
```

**iOS Native Setup:**

```bash
cd ios
pod install
cd ..
```

**Basic Usage Example** (`mobile/src/services/audioRecorder.ts`):

```typescript
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

export class AudioRecorder {
  private audioRecorderPlayer: AudioRecorderPlayer;

  constructor() {
    this.audioRecorderPlayer = new AudioRecorderPlayer();
  }

  async startRecording(path: string) {
    const uri = await this.audioRecorderPlayer.startRecorder(path);
    this.audioRecorderPlayer.addRecordBackListener((e) => {
      console.log('Recording:', e.currentPosition);
      return;
    });
    return uri;
  }

  async stopRecording() {
    const result = await this.audioRecorderPlayer.stopRecorder();
    this.audioRecorderPlayer.removeRecordBackListener();
    return result;
  }
}
```

**Documentation**: https://github.com/hyochan/react-native-audio-recorder-player

---

### 3. React Native Whisper

**Purpose**: On-device voice transcription (privacy-first)

```bash
npm install @react-native-whisper/whisper
```

**iOS Native Setup:**

```bash
cd ios
pod install
cd ..
```

**Model Download** (required):

The Whisper model must be downloaded to the device. You'll need to download a `.bin` model file (recommend `ggml-base.en.bin` for English-only, ~75MB).

**Model Storage:**

Place the model in:
- iOS: `mobile/ios/models/ggml-base.en.bin`
- Add to Xcode project as a resource

**Usage Example** (`mobile/src/services/transcription.ts`):

```typescript
import { initWhisper, transcribe } from '@react-native-whisper/whisper';

export class TranscriptionService {
  private whisperContext: any;

  async initialize() {
    this.whisperContext = await initWhisper({
      filePath: 'ggml-base.en.bin', // Model file in app bundle
    });
  }

  async transcribeAudio(audioPath: string): Promise<string> {
    const result = await transcribe(this.whisperContext, {
      filePath: audioPath,
      language: 'en',
    });
    return result.transcription;
  }
}
```

**Performance Notes:**
- Transcription takes 1-2 seconds for typical journal entries (30-60 seconds of audio)
- Runs entirely on-device (no internet required)
- Audio never leaves the device (privacy-first design)

**Documentation**: https://github.com/mybigday/whisper.rn

---

## Form Libraries

### 1. React Hook Form

**Purpose**: Performant form state management for workbook exercises

```bash
npm install react-hook-form
```

### 2. Zod

**Purpose**: TypeScript-first schema validation

```bash
npm install zod
```

### 3. Hookform Resolvers

**Purpose**: Bridge between React Hook Form and Zod

```bash
npm install @hookform/resolvers
```

**Complete Installation:**

```bash
npm install react-hook-form zod @hookform/resolvers
```

**Example Form Setup** (`mobile/src/components/forms/ExampleForm.tsx`):

```typescript
import React from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Define validation schema
const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  age: z.number().min(18, 'Must be 18 or older').optional(),
});

type FormData = z.infer<typeof formSchema>;

export function ExampleForm() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  });

  const onSubmit = (data: FormData) => {
    console.log('Valid form data:', data);
  };

  return (
    <View>
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            <TextInput
              placeholder="Name"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
            {errors.name && <Text>{errors.name.message}</Text>}
          </>
        )}
      />

      <Button title="Submit" onPress={handleSubmit(onSubmit)} />
    </View>
  );
}
```

**Shared Schemas:**

Create reusable validation schemas in `packages/shared/src/schemas/`:

```typescript
// packages/shared/src/schemas/workbook.schema.ts
import { z } from 'zod';

export const wheelOfLifeSchema = z.object({
  health: z.number().min(1).max(10),
  relationships: z.number().min(1).max(10),
  career: z.number().min(1).max(10),
  finances: z.number().min(1).max(10),
  personal_growth: z.number().min(1).max(10),
  fun_recreation: z.number().min(1).max(10),
  environment: z.number().min(1).max(10),
  spirituality: z.number().min(1).max(10),
});

export type WheelOfLifeData = z.infer<typeof wheelOfLifeSchema>;
```

**Documentation:**
- React Hook Form: https://react-hook-form.com/get-started
- Zod: https://zod.dev/

---

## Environment Configuration

### 1. React Native Config

**Purpose**: Load environment variables in React Native

```bash
npm install react-native-config
```

**iOS Setup:**

```bash
cd ios
pod install
cd ..
```

**Configure Info.plist:**

Edit `mobile/ios/ManifestTheUnseen/Info.plist` and add before the closing `</dict>`:

```xml
<key>Config</key>
<dict>
  <key>APIKey</key>
  <string>$(API_KEY)</string>
</dict>
```

**Usage in Code:**

```typescript
import Config from 'react-native-config';

// Access environment variables
const supabaseUrl = Config.SUPABASE_URL;
const anthropicKey = Config.ANTHROPIC_API_KEY;
```

### 2. Create .env File

**IMPORTANT**: Copy `.env.example` to `.env` and fill in actual values:

```bash
cp .env.example .env
```

**Security Notes:**
- `.env` is already in `.gitignore` - NEVER commit it
- Use different `.env` files for development/staging/production
- Store production keys in secure password manager
- See `docs/api-keys-guide.md` for obtaining API keys

**Verify .gitignore:**

Ensure `mobile/.gitignore` contains:

```
# Environment variables
.env
.env.local
.env.*.local
```

---

## iOS Permissions

### Microphone Permission

**Required for**: Voice journaling feature

Edit `mobile/ios/ManifestTheUnseen/Info.plist`:

```xml
<key>NSMicrophoneUsageDescription</key>
<string>Manifest the Unseen needs microphone access for voice journaling. Your recordings are transcribed on-device and never uploaded.</string>
```

### Photo Library Permission (Future)

**Required for**: Vision board image uploads

```xml
<key>NSPhotoLibraryUsageDescription</key>
<string>Manifest the Unseen needs photo library access to add images to your vision boards.</string>

<key>NSPhotoLibraryAddUsageDescription</key>
<string>Manifest the Unseen needs permission to save vision board images to your photo library.</string>
```

### Camera Permission (Future)

**Required for**: Taking photos for vision boards

```xml
<key>NSCameraUsageDescription</key>
<string>Manifest the Unseen needs camera access to take photos for your vision boards.</string>
```

### Complete Info.plist Example

Your `mobile/ios/ManifestTheUnseen/Info.plist` should include:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <!-- ... existing keys ... -->

  <!-- Audio Background Mode -->
  <key>UIBackgroundModes</key>
  <array>
    <string>audio</string>
  </array>

  <!-- Permissions -->
  <key>NSMicrophoneUsageDescription</key>
  <string>Manifest the Unseen needs microphone access for voice journaling. Your recordings are transcribed on-device and never uploaded.</string>

  <key>NSPhotoLibraryUsageDescription</key>
  <string>Manifest the Unseen needs photo library access to add images to your vision boards.</string>

  <key>NSPhotoLibraryAddUsageDescription</key>
  <string>Manifest the Unseen needs permission to save vision board images to your photo library.</string>

  <key>NSCameraUsageDescription</key>
  <string>Manifest the Unseen needs camera access to take photos for your vision boards.</string>

  <!-- Environment Config -->
  <key>Config</key>
  <dict>
    <key>APIKey</key>
    <string>$(API_KEY)</string>
  </dict>
</dict>
</plist>
```

---

## Verification

### 1. Verify Dependencies Installed

```bash
cd mobile
npm list react-native-track-player
npm list react-native-audio-recorder-player
npm list @react-native-whisper/whisper
npm list react-hook-form
npm list zod
npm list react-native-config
```

All should show installed versions.

### 2. Verify iOS Pods

```bash
cd ios
pod install
```

Should complete without errors. Verify `Podfile.lock` contains:
- `react-native-track-player`
- `react-native-audio-recorder-player`
- `RNWhisper` (from @react-native-whisper/whisper)

### 3. Test iOS Build

```bash
cd ..
npm run ios
```

App should build and launch in iOS Simulator without errors.

### 4. Test Audio Libraries

Create a test component to verify audio libraries initialize:

```typescript
// mobile/src/screens/TestScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import TrackPlayer from 'react-native-track-player';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

export function TestScreen() {
  const [status, setStatus] = useState('Testing...');

  useEffect(() => {
    async function testLibraries() {
      try {
        // Test Track Player
        await TrackPlayer.setupPlayer();

        // Test Audio Recorder
        const recorder = new AudioRecorderPlayer();

        setStatus('All audio libraries initialized successfully!');
      } catch (error) {
        setStatus(`Error: ${error.message}`);
      }
    }
    testLibraries();
  }, []);

  return (
    <View>
      <Text>{status}</Text>
    </View>
  );
}
```

### 5. Test Form Libraries

```bash
# Create a test form component
# Should compile without TypeScript errors
```

### 6. Test Environment Variables

```typescript
// mobile/src/test/envTest.ts
import Config from 'react-native-config';

console.log('Supabase URL:', Config.SUPABASE_URL);
console.log('Has Anthropic Key:', !!Config.ANTHROPIC_API_KEY);
console.log('Has OpenAI Key:', !!Config.OPENAI_API_KEY);
```

**Expected Output:**
```
Supabase URL: https://your-project.supabase.co
Has Anthropic Key: true
Has OpenAI Key: true
```

---

## Troubleshooting

### CocoaPods Issues

**Problem**: `pod install` fails

**Solution**:
```bash
cd ios
pod deintegrate
pod cache clean --all
pod install
cd ..
```

### React Native Track Player Build Error

**Problem**: Xcode build fails with audio player errors

**Solution**:
1. Clean build folder in Xcode: `Product > Clean Build Folder`
2. Delete derived data: `rm -rf ~/Library/Developer/Xcode/DerivedData`
3. Reinstall pods:
   ```bash
   cd ios
   rm -rf Pods Podfile.lock
   pod install
   cd ..
   ```

### Whisper Model Not Found

**Problem**: Transcription fails with "model not found"

**Solution**:
1. Download model from: https://huggingface.co/ggerganov/whisper.cpp/tree/main
2. Place `ggml-base.en.bin` in `mobile/ios/models/`
3. Add to Xcode project:
   - Open Xcode
   - Right-click project > Add Files
   - Select `models` folder
   - Check "Copy items if needed"
   - Add to target

### Environment Variables Not Loading

**Problem**: `Config.VARIABLE_NAME` returns undefined

**Solution**:
1. Verify `.env` file exists in `mobile/` directory
2. Restart Metro bundler:
   ```bash
   npm start -- --reset-cache
   ```
3. Rebuild iOS app:
   ```bash
   cd ios
   pod install
   cd ..
   npm run ios
   ```

### Microphone Permission Denied

**Problem**: Audio recording fails on simulator

**Solution**:
- iOS Simulator doesn't have microphone access by default
- Test on physical device OR
- In Simulator: `Features > Microphone > Enable`

### TypeScript Errors with Zod

**Problem**: Type inference not working

**Solution**:
```typescript
// Use z.infer<> to extract TypeScript type
const schema = z.object({ name: z.string() });
type SchemaType = z.infer<typeof schema>; // { name: string }
```

---

## Next Steps

After completing this guide:

1. **Obtain API Keys**: Follow `docs/api-keys-guide.md`
2. **Update .env**: Fill in all API keys in `mobile/.env`
3. **Begin Development**: Proceed to Week 2 feature development
4. **Test Features**: Create audio recording and form components

---

## Dependencies Summary

### Audio (3 packages)
- `react-native-track-player` - Meditation playback
- `react-native-audio-recorder-player` - Voice recording
- `@react-native-whisper/whisper` - On-device transcription

### Forms (3 packages)
- `react-hook-form` - Form state management
- `zod` - Validation schemas
- `@hookform/resolvers` - Integration bridge

### Environment (1 package)
- `react-native-config` - Load .env variables

**Total**: 7 new npm packages + iOS native modules

---

## Related Documentation

- **API Keys**: `docs/api-keys-guide.md`
- **React Native Setup**: `docs/react-native-setup-guide.md`
- **Supabase Setup**: `docs/supabase-setup-guide.md`
- **TDD Section 7**: Audio Architecture
- **TDD Section 8**: AI Integration

---

**Last Updated**: 2025-11-17
**Task**: TASK-2025-11-005
**Status**: Complete
