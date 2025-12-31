# iOS Permissions Configuration Guide

This guide documents all iOS permissions required for the Manifest the Unseen app and how to configure them.

## Overview

The app requires the following iOS permissions:

| Permission | Feature | Required | When Requested |
|------------|---------|----------|----------------|
| Microphone | Voice journaling | Yes | First journal recording |
| Background Audio | Meditation playback | Yes | Auto-granted with capability |
| Photo Library | Vision boards | Yes | First image upload |
| Camera | Vision boards (photo capture) | Optional | First camera use |
| Notifications | Daily reminders | Optional | User prompted in-app |

## Info.plist Configuration

All permissions are configured in `mobile/ios/ManifestTheUnseen/Info.plist`.

### 1. Microphone Permission

**Required for**: Voice journaling feature

**Configuration**:

```xml
<key>NSMicrophoneUsageDescription</key>
<string>Manifest the Unseen needs microphone access for voice journaling. Your recordings are transcribed on-device and never uploaded.</string>
```

**When Requested**: First time user taps the record button in voice journaling

**User-Facing Message**: Shows the description string above in iOS permission dialog

**Best Practices**:
- Explain WHY you need the permission
- Emphasize privacy (on-device transcription)
- Be concise and user-friendly

---

### 2. Background Audio Mode

**Required for**: Meditation audio playback continues when app is backgrounded

**Configuration**:

```xml
<key>UIBackgroundModes</key>
<array>
  <string>audio</string>
</array>
```

**When Granted**: Automatically enabled when capability is set (no user prompt)

**What It Enables**:
- Audio continues playing when user switches apps
- Lock screen controls appear
- Control center integration

**Testing**:
1. Start meditation playback
2. Press home button
3. Audio should continue playing
4. Lock screen should show playback controls

---

### 3. Photo Library Permission

**Required for**: Uploading images to vision boards

**Configuration**:

```xml
<!-- Read/Select Photos -->
<key>NSPhotoLibraryUsageDescription</key>
<string>Manifest the Unseen needs photo library access to add images to your vision boards.</string>

<!-- Save Photos (Optional) -->
<key>NSPhotoLibraryAddUsageDescription</key>
<string>Manifest the Unseen needs permission to save vision board images to your photo library.</string>
```

**When Requested**: First time user taps "Add Image" in vision board editor

**iOS 14+ Note**: On iOS 14+, users can grant "Limited" access (select specific photos)

**Implementation Note**:

```typescript
// Use limited photo library if available
import { PhotoLibrary } from 'react-native-image-picker';

// Request permission
const result = await PhotoLibrary.requestAuthorization();
// Returns: 'authorized', 'limited', 'denied', 'restricted'
```

---

### 4. Camera Permission

**Required for**: Taking photos directly for vision boards (optional feature)

**Configuration**:

```xml
<key>NSCameraUsageDescription</key>
<string>Manifest the Unseen needs camera access to take photos for your vision boards.</string>
```

**When Requested**: First time user taps "Take Photo" in vision board editor

**Alternative**: Users can skip this and only use existing photos from library

---

### 5. Push Notifications (Optional)

**Required for**: Daily reminders, meditation notifications

**Configuration**:

```xml
<key>NSUserNotificationsUsageDescription</key>
<string>Manifest the Unseen can send you daily inspiration, meditation reminders, and progress updates.</string>
```

**When Requested**: When user enables reminders in app settings

**Best Practice**: Don't request on app launch - wait until user wants to enable reminders

**Implementation**:

```typescript
// Request permission only when user opts in
import { requestNotifications } from 'react-native-permissions';

async function enableReminders() {
  const { status } = await requestNotifications(['alert', 'sound', 'badge']);
  if (status === 'granted') {
    // Schedule notifications
  }
}
```

---

## Complete Info.plist Example

Location: `mobile/ios/ManifestTheUnseen/Info.plist`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <!-- Existing keys from React Native template ... -->

  <!-- ============================================ -->
  <!-- Background Modes -->
  <!-- ============================================ -->
  <key>UIBackgroundModes</key>
  <array>
    <string>audio</string>
  </array>

  <!-- ============================================ -->
  <!-- Permission Descriptions -->
  <!-- ============================================ -->

  <!-- Microphone (Required - Voice Journaling) -->
  <key>NSMicrophoneUsageDescription</key>
  <string>Manifest the Unseen needs microphone access for voice journaling. Your recordings are transcribed on-device and never uploaded.</string>

  <!-- Photo Library (Required - Vision Boards) -->
  <key>NSPhotoLibraryUsageDescription</key>
  <string>Manifest the Unseen needs photo library access to add images to your vision boards.</string>

  <key>NSPhotoLibraryAddUsageDescription</key>
  <string>Manifest the Unseen needs permission to save vision board images to your photo library.</string>

  <!-- Camera (Optional - Vision Boards) -->
  <key>NSCameraUsageDescription</key>
  <string>Manifest the Unseen needs camera access to take photos for your vision boards.</string>

  <!-- Notifications (Optional - Reminders) -->
  <key>NSUserNotificationsUsageDescription</key>
  <string>Manifest the Unseen can send you daily inspiration, meditation reminders, and progress updates.</string>

  <!-- ============================================ -->
  <!-- Environment Configuration (react-native-config) -->
  <!-- ============================================ -->
  <key>Config</key>
  <dict>
    <key>APIKey</key>
    <string>$(API_KEY)</string>
  </dict>

  <!-- ============================================ -->
  <!-- App Transport Security (if needed) -->
  <!-- ============================================ -->
  <!-- Supabase uses HTTPS, so default ATS is fine -->
  <!-- Only add exceptions if using HTTP for development -->

</dict>
</plist>
```

---

## Xcode Capabilities Configuration

Some permissions require enabling capabilities in Xcode:

### 1. Background Modes

**Location**: Xcode → Target → Signing & Capabilities

1. Click **+ Capability**
2. Add **Background Modes**
3. Enable:
   - ✓ **Audio, AirPlay, and Picture in Picture**

### 2. Push Notifications (Optional)

**Location**: Xcode → Target → Signing & Capabilities

1. Click **+ Capability**
2. Add **Push Notifications**
3. Auto-configured with Apple Developer account

### 3. Sign In with Apple

**Location**: Xcode → Target → Signing & Capabilities

1. Click **+ Capability**
2. Add **Sign In with Apple**
3. Auto-configured with App ID from Apple Developer portal

---

## Permission Request Best Practices

### 1. Request in Context

**DON'T**:
```typescript
// On app launch - BAD!
useEffect(() => {
  requestMicrophonePermission();
  requestPhotoLibraryPermission();
  requestNotificationPermission();
}, []);
```

**DO**:
```typescript
// When user taps "Start Recording" - GOOD!
function handleRecordPress() {
  requestMicrophonePermission().then(granted => {
    if (granted) {
      startRecording();
    } else {
      showPermissionExplanation();
    }
  });
}
```

### 2. Explain Before Requesting

Show a pre-permission dialog explaining why:

```typescript
async function requestMicrophoneWithExplanation() {
  // Show custom dialog first
  const userWantsToGrant = await showAlert({
    title: 'Voice Journaling',
    message: 'To record your journal entries, we need microphone access. Your audio is transcribed on-device and never uploaded to servers.',
    buttons: ['Cancel', 'Allow'],
  });

  if (userWantsToGrant) {
    // Now request system permission
    const granted = await requestMicrophonePermission();
    return granted;
  }
  return false;
}
```

### 3. Handle Denial Gracefully

```typescript
function handlePermissionDenied(permission: string) {
  showAlert({
    title: `${permission} Access Needed`,
    message: `To use this feature, please enable ${permission} in Settings > Manifest the Unseen.`,
    buttons: [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Open Settings',
        onPress: () => Linking.openSettings()
      },
    ],
  });
}
```

### 4. Check Status Before Requesting

```typescript
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

async function ensureMicrophonePermission() {
  const status = await check(PERMISSIONS.IOS.MICROPHONE);

  switch (status) {
    case RESULTS.UNAVAILABLE:
      // Feature not available on this device
      return false;

    case RESULTS.DENIED:
      // Not requested yet - request it
      const result = await request(PERMISSIONS.IOS.MICROPHONE);
      return result === RESULTS.GRANTED;

    case RESULTS.GRANTED:
      // Already granted
      return true;

    case RESULTS.BLOCKED:
      // User denied previously - send to settings
      handlePermissionDenied('Microphone');
      return false;
  }
}
```

---

## Testing Permissions

### Reset Permissions (Simulator)

```bash
# Reset all permissions for the app
xcrun simctl privacy booted reset all com.yourcompany.manifesttheunseen
```

### Reset Permissions (Physical Device)

1. Settings → General → Transfer or Reset iPhone → Reset → Reset Location & Privacy
2. OR manually: Settings → Manifest the Unseen → (toggle permissions)

### Test Permission Flow

Create a test screen to verify each permission:

```typescript
// TestPermissionsScreen.tsx
import React from 'react';
import { View, Button, Text } from 'react-native';
import { check, request, PERMISSIONS } from 'react-native-permissions';

export function TestPermissionsScreen() {
  async function testPermission(permission: string, type: any) {
    const status = await check(type);
    console.log(`${permission} status:`, status);

    if (status === 'denied') {
      const result = await request(type);
      console.log(`${permission} request result:`, result);
    }
  }

  return (
    <View>
      <Text>Test Permissions</Text>

      <Button
        title="Test Microphone"
        onPress={() => testPermission('Microphone', PERMISSIONS.IOS.MICROPHONE)}
      />

      <Button
        title="Test Photo Library"
        onPress={() => testPermission('Photo Library', PERMISSIONS.IOS.PHOTO_LIBRARY)}
      />

      <Button
        title="Test Camera"
        onPress={() => testPermission('Camera', PERMISSIONS.IOS.CAMERA)}
      />

      <Button
        title="Test Notifications"
        onPress={() => testPermission('Notifications', PERMISSIONS.IOS.NOTIFICATIONS)}
      />
    </View>
  );
}
```

---

## App Store Review Guidelines

### Required for Approval

1. **Info.plist descriptions must be clear**: Explain WHY you need each permission
2. **Request in context**: Don't ask for all permissions on launch
3. **Function without permissions**: App shouldn't crash if permissions denied
4. **No tracking without consent**: Microphone/camera data must not be used for ads

### Common Rejection Reasons

- **Vague permission descriptions**: "This app needs microphone access" → REJECTED
- **Requesting too early**: All permissions on app launch → REJECTED
- **Missing descriptions**: Forgot Info.plist key → REJECTED
- **Unused permissions**: Requesting camera but not using it → REJECTED

### Our App's Justification

All permissions have clear use cases:

- **Microphone**: Voice journaling (core feature)
- **Photo Library**: Vision boards (core feature)
- **Camera**: Vision boards photo capture (optional)
- **Background Audio**: Meditation playback (core feature)
- **Notifications**: Daily reminders (opt-in)

---

## Privacy Manifest (iOS 17+)

iOS 17+ requires a privacy manifest for certain APIs.

**Location**: `mobile/ios/PrivacyInfo.xcprivacy`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>NSPrivacyTracking</key>
  <false/>

  <key>NSPrivacyTrackingDomains</key>
  <array/>

  <key>NSPrivacyCollectedDataTypes</key>
  <array>
    <dict>
      <key>NSPrivacyCollectedDataType</key>
      <string>NSPrivacyCollectedDataTypeAudioData</string>
      <key>NSPrivacyCollectedDataTypeLinked</key>
      <true/>
      <key>NSPrivacyCollectedDataTypeTracking</key>
      <false/>
      <key>NSPrivacyCollectedDataTypePurposes</key>
      <array>
        <string>NSPrivacyCollectedDataTypePurposeAppFunctionality</string>
      </array>
    </dict>
  </array>

  <key>NSPrivacyAccessedAPITypes</key>
  <array>
    <dict>
      <key>NSPrivacyAccessedAPIType</key>
      <string>NSPrivacyAccessedAPICategoryUserDefaults</string>
      <key>NSPrivacyAccessedAPITypeReasons</key>
      <array>
        <string>CA92.1</string>
      </array>
    </dict>
  </array>
</dict>
</plist>
```

---

## Troubleshooting

### Permission Dialog Not Showing

**Problem**: System permission dialog doesn't appear

**Causes**:
1. Missing Info.plist description
2. Permission already denied/granted
3. Simulator doesn't support feature

**Solution**:
```bash
# Reset simulator permissions
xcrun simctl privacy booted reset all com.yourcompany.manifesttheunseen

# Check Info.plist has description
grep -A 1 "NSMicrophoneUsageDescription" ios/ManifestTheUnseen/Info.plist
```

### "Missing Info.plist key" Crash

**Problem**: App crashes when requesting permission

**Error**:
```
This app has crashed because it attempted to access privacy-sensitive data without a usage description.
```

**Solution**: Add the required `NS*UsageDescription` key to Info.plist

### Permission Stuck in "Denied" State

**Problem**: Can't re-request permission after denial

**Solution**: User must manually enable in Settings:
```typescript
import { Linking } from 'react-native';

// Send user to settings
Linking.openSettings();
```

---

## Summary

**Minimum Required for Week 1**:
- ✓ Microphone permission (voice journaling)
- ✓ Background audio capability (meditation)

**Add in Week 2-3**:
- Photo Library (vision boards)
- Camera (optional photo capture)

**Add Later**:
- Push Notifications (reminders)

---

## Related Documentation

- `docs/dependencies-setup-guide.md` - Installing audio/form libraries
- `docs/api-keys-guide.md` - API key configuration
- Apple Docs: https://developer.apple.com/documentation/uikit/protecting_the_user_s_privacy

---

**Last Updated**: 2025-11-17
**Task**: TASK-2025-11-005
**Status**: Complete
