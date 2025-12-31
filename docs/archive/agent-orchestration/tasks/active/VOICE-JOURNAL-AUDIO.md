# Task: Voice Journal - Audio Infrastructure

**Task ID**: VOICE-JOURNAL-AUDIO
**Agent**: Audio Infrastructure Specialist
**Orchestrator**: Voice Journal Orchestrator
**Status**: 🔄 Ready to Start
**Priority**: P0 - Critical Path
**Dependencies**: None (can start immediately)

---

## Objective

Implement the audio recording and on-device Whisper transcription infrastructure for Voice Journal MVP.

---

## Deliverables

### 1. Install Dependencies

Add to `mobile/package.json`:
```bash
npx expo install expo-av expo-file-system
npm install whisper.rn
```

**Note**: If `whisper.rn` has Expo compatibility issues, fallback to `@whisper.rn/core` or `whisper-rn`.

### 2. Create whisperService.ts

**Path**: `mobile/src/services/whisperService.ts`

**Functions to implement**:

```typescript
/**
 * Check if Whisper model is downloaded
 */
export async function isModelDownloaded(): Promise<boolean>

/**
 * Download Whisper model with progress callback
 * Model: whisper-tiny (~40MB)
 */
export async function downloadModel(
  onProgress?: (progress: number) => void
): Promise<void>

/**
 * Transcribe audio file to text
 * @param audioUri - Local file URI
 * @returns Transcribed text
 */
export async function transcribe(audioUri: string): Promise<string>

/**
 * Delete audio file after transcription (privacy)
 */
export async function deleteAudioFile(uri: string): Promise<void>

/**
 * Get model file path
 */
export function getModelPath(): string
```

**Implementation Notes**:
- Store model in `FileSystem.documentDirectory`
- Use whisper-tiny model for balance of speed/accuracy
- Handle network errors during download
- Emit progress 0-100 during download

### 3. Create useWhisper.ts Hook

**Path**: `mobile/src/hooks/useWhisper.ts`

**Hook interface**:

```typescript
interface UseWhisperReturn {
  // Model status
  modelDownloaded: boolean;
  isDownloading: boolean;
  downloadProgress: number;
  downloadError: string | null;

  // Transcription
  isTranscribing: boolean;
  transcriptionError: string | null;

  // Actions
  downloadModel: () => Promise<void>;
  transcribe: (audioUri: string) => Promise<string>;
}

export function useWhisper(): UseWhisperReturn
```

**Implementation Notes**:
- Check model status on mount
- Expose download progress for UI
- Handle errors gracefully
- Clean up on unmount

### 4. Create useAudioRecorder.ts Hook

**Path**: `mobile/src/hooks/useAudioRecorder.ts`

**Hook interface**:

```typescript
type RecordingStatus = 'idle' | 'recording' | 'paused' | 'stopped';

interface UseAudioRecorderReturn {
  // Status
  status: RecordingStatus;
  duration: number; // seconds
  error: string | null;

  // Recording URI (after stopped)
  recordingUri: string | null;

  // Actions
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<string>; // Returns URI
  pauseRecording: () => Promise<void>;
  resumeRecording: () => Promise<void>;
  cancelRecording: () => Promise<void>;
}

export function useAudioRecorder(options?: {
  maxDuration?: number; // Default 15 minutes
}): UseAudioRecorderReturn
```

**Implementation Notes**:
- Use `expo-av` Audio API
- Configure audio session for recording
- Track duration with interval timer
- Clean up recordings on cancel
- Return file URI on stop

### 5. Update Exports

**Path**: `mobile/src/hooks/index.ts`

Add exports:
```typescript
export * from './useWhisper';
export * from './useAudioRecorder';
```

**Path**: `mobile/src/services/index.ts`

Add exports (create if doesn't exist):
```typescript
export * from './whisperService';
```

---

## Technical Requirements

### Audio Configuration (expo-av)

```typescript
const recordingOptions = {
  android: {
    extension: '.m4a',
    outputFormat: Audio.AndroidOutputFormat.MPEG_4,
    audioEncoder: Audio.AndroidAudioEncoder.AAC,
    sampleRate: 44100,
    numberOfChannels: 1,
    bitRate: 128000,
  },
  ios: {
    extension: '.m4a',
    outputFormat: Audio.IOSOutputFormat.MPEG4AAC,
    audioQuality: Audio.IOSAudioQuality.HIGH,
    sampleRate: 44100,
    numberOfChannels: 1,
    bitRate: 128000,
  },
  web: {
    mimeType: 'audio/webm',
    bitsPerSecond: 128000,
  },
};
```

### Audio Session Setup

```typescript
await Audio.setAudioModeAsync({
  allowsRecordingIOS: true,
  playsInSilentModeIOS: true,
  staysActiveInBackground: false,
  shouldDuckAndroid: true,
});
```

### Whisper Model Source

Use one of:
- GitHub releases from whisper.rn project
- Hugging Face hosted models
- Custom CDN (if available)

---

## Acceptance Criteria

- [ ] `npm install` completes without errors
- [ ] `isModelDownloaded()` returns false initially
- [ ] `downloadModel()` downloads with progress 0-100
- [ ] `isModelDownloaded()` returns true after download
- [ ] Recording starts/stops/pauses correctly
- [ ] Recording duration tracks accurately
- [ ] `transcribe()` converts audio to text
- [ ] `deleteAudioFile()` removes the file
- [ ] All hooks can be imported from `@/hooks`
- [ ] TypeScript compiles with 0 errors
- [ ] Works on iOS (primary platform)

---

## Testing Commands

```bash
# Verify packages installed
cd mobile && npm list expo-av expo-file-system whisper.rn

# TypeScript check
npm run type-check

# Test on device (Expo Go may not support whisper.rn)
# May need development build: eas build --profile development --platform ios
```

---

## Report Template

When complete, report to orchestrator:

```markdown
## Agent Report: Audio Infrastructure

### Status: [✅ Complete / ❌ Blocked / 🔄 In Progress]

### Files Created:
- `mobile/src/services/whisperService.ts`
- `mobile/src/hooks/useWhisper.ts`
- `mobile/src/hooks/useAudioRecorder.ts`

### Files Modified:
- `mobile/package.json` - Added expo-av, expo-file-system, whisper.rn
- `mobile/src/hooks/index.ts` - Added exports
- `mobile/src/services/index.ts` - Added exports

### Exports Added:
- `useWhisper` from `@/hooks`
- `useAudioRecorder` from `@/hooks`
- `whisperService` functions from `@/services`

### Tests:
- [ ] Model downloads with progress
- [ ] Recording captures audio
- [ ] Transcription produces text
- [ ] Audio deleted after transcription

### Issues:
- (Any blockers or concerns)

### Handoff Notes:
- UI Agent can now use useWhisper and useAudioRecorder
- Model download should be triggered on first Record tap
```

---

## Reference Files

- Audio Specialist Prompt: `agent-orchestration/prompts/system-prompts/audio-specialist.md`
- Feature Spec: `docs/Voice-Journal-MVP.md`
- Existing hooks pattern: `mobile/src/hooks/useWorkbook.ts`
- Existing services pattern: `mobile/src/services/supabase.ts`

---

**Estimated Effort**: 2-3 hours
**Blocking**: UI Agent (cannot start until this completes)
