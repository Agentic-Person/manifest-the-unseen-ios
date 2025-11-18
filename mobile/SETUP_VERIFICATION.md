# Setup Verification Checklist

Use this checklist to verify that all dependencies are installed correctly and all API keys are configured.

## Prerequisites Verification

Run these commands to verify prerequisites:

```bash
# Node.js version (should be v18+)
node --version

# npm version (should be v9+)
npm --version

# CocoaPods version (should be v1.12+)
pod --version

# Xcode command line tools
xcode-select --version
```

**Expected Output**:
```
v18.x.x or higher
9.x.x or higher
1.12.x or higher
xcode-select version 2396 or higher
```

---

## Dependency Installation Verification

### 1. Check npm Packages

```bash
cd mobile

# Audio libraries
npm list react-native-track-player
npm list react-native-audio-recorder-player
npm list @react-native-whisper/whisper

# Form libraries
npm list react-hook-form
npm list zod
npm list @hookform/resolvers

# Environment
npm list react-native-config
```

**Expected**: Each should show a version number (not "UNMET DEPENDENCY")

### 2. Check iOS Pods

```bash
cd ios
pod install
```

**Expected Output**:
```
Installing react-native-track-player (x.x.x)
Installing react-native-audio-recorder-player (x.x.x)
Installing RNWhisper (x.x.x)
...
Pod installation complete!
```

**Verify Podfile.lock contains**:
```bash
grep -E "(react-native-track-player|audio-recorder-player|RNWhisper)" Podfile.lock
```

---

## Environment Variables Verification

### 1. Check .env File Exists

```bash
cd mobile
ls -la .env
```

**Expected**: File should exist (not an error)

### 2. Verify .env Contents

```bash
# Check if key variables are present (without showing values)
grep -E "^[A-Z_]+=" .env | cut -d'=' -f1
```

**Expected Output**:
```
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
ANTHROPIC_API_KEY
OPENAI_API_KEY
REVENUECAT_API_KEY_IOS
APPLE_TEAM_ID
APPLE_SERVICES_ID
APPLE_KEY_ID
```

### 3. Verify .env is Gitignored

```bash
# Should return ".env"
grep "^\.env$" .gitignore
```

**Expected**: `.env` appears in .gitignore

---

## iOS Configuration Verification

### 1. Check Info.plist Permissions

```bash
cd ios/ManifestTheUnseen

# Microphone permission
grep -A 1 "NSMicrophoneUsageDescription" Info.plist

# Background audio
grep -A 2 "UIBackgroundModes" Info.plist
```

**Expected**:
```xml
<key>NSMicrophoneUsageDescription</key>
<string>Manifest the Unseen needs microphone access...</string>

<key>UIBackgroundModes</key>
<array>
  <string>audio</string>
</array>
```

### 2. Verify Xcode Project Opens

```bash
cd ios
open ManifestTheUnseen.xcworkspace
```

**Expected**: Xcode should open without errors

---

## Build Verification

### 1. Clean Build

```bash
cd mobile

# Clean Metro cache
npm start -- --reset-cache
# (Press Ctrl+C after it starts)

# Clean iOS build
cd ios
rm -rf ~/Library/Developer/Xcode/DerivedData
xcodebuild clean -workspace ManifestTheUnseen.xcworkspace -scheme ManifestTheUnseen
cd ..
```

### 2. Build and Run iOS

```bash
npm run ios
```

**Expected**:
- Build succeeds without errors
- iOS Simulator launches
- App opens showing the React Native welcome screen or your app

**Common Issues**:
- If build fails, see Troubleshooting section below

---

## Runtime Verification

### Create Test File

Create `mobile/src/test/setupTest.tsx`:

```typescript
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import Config from 'react-native-config';
import TrackPlayer from 'react-native-track-player';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

export function SetupTestScreen() {
  const [results, setResults] = useState<string[]>([]);

  const addResult = (test: string, passed: boolean) => {
    setResults(prev => [...prev, `${passed ? '✅' : '❌'} ${test}`]);
  };

  useEffect(() => {
    runTests();
  }, []);

  async function runTests() {
    setResults(['Running setup tests...']);

    // Test 1: Environment variables
    addResult('Supabase URL configured', !!Config.SUPABASE_URL);
    addResult('Anthropic API key configured', !!Config.ANTHROPIC_API_KEY);
    addResult('OpenAI API key configured', !!Config.OPENAI_API_KEY);
    addResult('RevenueCat iOS key configured', !!Config.REVENUECAT_API_KEY_IOS);

    // Test 2: Audio libraries
    try {
      await TrackPlayer.setupPlayer();
      addResult('Track Player initialized', true);
    } catch (error) {
      addResult('Track Player initialized', false);
      console.error('Track Player error:', error);
    }

    try {
      const recorder = new AudioRecorderPlayer();
      addResult('Audio Recorder initialized', true);
    } catch (error) {
      addResult('Audio Recorder initialized', false);
      console.error('Audio Recorder error:', error);
    }

    // Test 3: Forms (validation)
    try {
      const { z } = require('zod');
      const schema = z.object({ test: z.string() });
      schema.parse({ test: 'hello' });
      addResult('Zod validation working', true);
    } catch (error) {
      addResult('Zod validation working', false);
    }

    addResult('All tests complete!', true);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Setup Verification</Text>
      {results.map((result, index) => (
        <Text key={index} style={styles.result}>{result}</Text>
      ))}
      <Button title="Re-run Tests" onPress={runTests} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  result: {
    fontSize: 14,
    marginVertical: 4,
    fontFamily: 'monospace',
  },
});
```

### Add to App.tsx (Temporary)

```typescript
// In mobile/App.tsx
import { SetupTestScreen } from './src/test/setupTest';

function App() {
  return <SetupTestScreen />;
}
```

### Run and Verify

```bash
npm run ios
```

**Expected Output on Screen**:
```
✅ Supabase URL configured
✅ Anthropic API key configured
✅ OpenAI API key configured
✅ RevenueCat iOS key configured
✅ Track Player initialized
✅ Audio Recorder initialized
✅ Zod validation working
✅ All tests complete!
```

---

## API Keys Verification

### Test API Connections (Optional)

Create `mobile/src/test/apiTest.ts`:

```typescript
import Config from 'react-native-config';

export async function testAnthropicAPI() {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': Config.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 10,
        messages: [{ role: 'user', content: 'Hello' }],
      }),
    });

    if (response.ok) {
      console.log('✅ Anthropic API key is valid');
      return true;
    } else {
      console.error('❌ Anthropic API key is invalid');
      return false;
    }
  } catch (error) {
    console.error('❌ Anthropic API test failed:', error);
    return false;
  }
}

export async function testOpenAIAPI() {
  try {
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${Config.OPENAI_API_KEY}`,
      },
    });

    if (response.ok) {
      console.log('✅ OpenAI API key is valid');
      return true;
    } else {
      console.error('❌ OpenAI API key is invalid');
      return false;
    }
  } catch (error) {
    console.error('❌ OpenAI API test failed:', error);
    return false;
  }
}
```

**Note**: These tests will make actual API calls and may incur small costs (< $0.01).

---

## Troubleshooting

### CocoaPods Errors

```bash
cd ios
pod deintegrate
pod cache clean --all
rm -rf Pods Podfile.lock
pod install
cd ..
```

### Metro Bundler Cache Issues

```bash
npm start -- --reset-cache
```

### Xcode Build Errors

```bash
cd ios
rm -rf ~/Library/Developer/Xcode/DerivedData
xcodebuild clean -workspace ManifestTheUnseen.xcworkspace -scheme ManifestTheUnseen
cd ..
```

### Environment Variables Not Loading

```bash
# Verify .env exists
ls -la mobile/.env

# Restart bundler
npm start -- --reset-cache

# Rebuild iOS
cd ios && pod install && cd ..
npm run ios
```

### "Module not found" Errors

```bash
# Reinstall node_modules
rm -rf node_modules package-lock.json
npm install

# Reinstall pods
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
```

---

## Success Criteria

Mark this checklist complete when:

- [ ] All prerequisites verified (Node, npm, CocoaPods, Xcode)
- [ ] All npm packages installed successfully
- [ ] All iOS pods installed successfully
- [ ] `.env` file created with all required keys
- [ ] Info.plist configured with microphone and background audio permissions
- [ ] iOS app builds without errors
- [ ] iOS app runs in Simulator
- [ ] Setup test screen shows all green checkmarks
- [ ] No console errors or warnings

---

## Next Steps

Once verification is complete:

1. **Remove test files** (SetupTestScreen, apiTest.ts)
2. **Begin Week 2 development**:
   - Implement authentication (Apple Sign-In)
   - Build voice journaling feature
   - Create meditation player
3. **Reference documentation**:
   - `docs/dependencies-setup-guide.md` - Full setup guide
   - `docs/api-keys-guide.md` - API configuration
   - `docs/ios-permissions-guide.md` - Permissions

---

## Support

If you encounter issues:

1. Check troubleshooting section above
2. Review comprehensive guides in `docs/`
3. Check React Native troubleshooting: https://reactnative.dev/docs/troubleshooting
4. Check library documentation (links in dependency guide)

---

**Last Updated**: 2025-11-17
**Task**: TASK-2025-11-005
