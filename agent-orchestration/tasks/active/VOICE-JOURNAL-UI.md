# Task: Voice Journal - UI Components

**Task ID**: VOICE-JOURNAL-UI
**Agent**: UI Components Specialist
**Orchestrator**: Voice Journal Orchestrator
**Status**: ⏳ Waiting for Audio + Backend Agents
**Priority**: P0 - Critical Path
**Dependencies**:
- ✅ Audio Agent must complete first (useWhisper, useAudioRecorder)
- ✅ Backend Agent must complete first (useJournal hooks)

---

## Objective

Build the Journal UI screens and components that integrate voice recording, transcription, image selection, and entry management.

---

## Pre-Requisites Checklist

Before starting, verify these imports work:

```typescript
// From Audio Agent
import { useWhisper, useAudioRecorder } from '@/hooks';

// From Backend Agent
import {
  useJournalEntries,
  useCreateJournalEntry,
  useDeleteJournalEntry,
  useUploadJournalImage
} from '@/hooks';

import type { JournalEntry, CreateJournalEntry } from '@/types';
```

If imports fail, wait for respective agent to complete.

---

## Deliverables

### 1. Create VoiceRecorder Component

**Path**: `mobile/src/components/journal/VoiceRecorder.tsx`

**Visual Design**:
```
┌─────────────────────────────────────────┐
│                                         │
│            ⏺ 00:00:00                  │  ← Duration timer
│            Recording...                 │  ← Status text
│                                         │
│       ┌───────────────────┐            │
│       │                   │            │
│       │    🎤 RECORD      │            │  ← Large button
│       │                   │            │
│       └───────────────────┘            │
│                                         │
│         Tap to start/stop               │
│                                         │
│   [Cancel]              [Transcribe]    │  ← Action buttons
│                                         │
│   ┌─────────────────────────────────┐  │
│   │ Transcribing...  ████░░░░ 60%   │  │  ← Progress (when active)
│   └─────────────────────────────────┘  │
│                                         │
└─────────────────────────────────────────┘
```

**Props**:
```typescript
interface VoiceRecorderProps {
  onTranscriptionComplete: (text: string) => void;
  onCancel: () => void;
  maxDuration?: number; // Default 900 (15 minutes)
}
```

**States to handle**:
- `idle` - Ready to record
- `downloading` - Whisper model downloading (first use)
- `recording` - Capturing audio
- `transcribing` - Processing with Whisper
- `complete` - Text ready
- `error` - Something went wrong

**Implementation Notes**:
- Use `useWhisper` for model/transcription
- Use `useAudioRecorder` for recording
- Show model download progress on first use
- Add haptic feedback on start/stop (expo-haptics)
- Format duration as MM:SS or HH:MM:SS
- Dark mode colors from `@/theme/colors`

### 2. Create ImagePicker Component

**Path**: `mobile/src/components/journal/ImagePicker.tsx`

**Visual Design**:
```
┌───────────────────────────────────────────────────┐
│ 📷 Add Images (2/5)                               │
│                                                   │
│ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐         │
│ │   +   │ │ img1  │ │ img2  │ │       │         │
│ │       │ │   ✕   │ │   ✕   │ │       │         │
│ └───────┘ └───────┘ └───────┘ └───────┘         │
│  Add      Remove    Remove                       │
└───────────────────────────────────────────────────┘
```

**Props**:
```typescript
interface ImagePickerProps {
  images: string[];  // Array of local URIs
  onImagesChange: (images: string[]) => void;
  maxImages?: number; // Default 5
  disabled?: boolean;
}
```

**Implementation Notes**:
- Use `expo-image-picker` (already installed)
- Allow multiple selection
- Show count "X/5"
- Thumbnail with remove (X) button
- Horizontal scroll if many images
- Dark mode styling

### 3. Create JournalEntryCard Component

**Path**: `mobile/src/components/journal/JournalEntryCard.tsx`

**Visual Design**:
```
┌───────────────────────────────────────┐
│ Nov 27, 2025 • 2:30 PM                │  ← Date/time
│                                       │
│ Today I reflected on my morning       │  ← Preview text (2-3 lines)
│ meditation and felt grateful for...   │
│                                       │
│ [🖼️] [🖼️]                              │  ← Image thumbnails (if any)
└───────────────────────────────────────┘
```

**Props**:
```typescript
interface JournalEntryCardProps {
  entry: JournalEntry;
  onPress: () => void;
  onDelete?: () => void;
}
```

**Implementation Notes**:
- Format date nicely (e.g., "Nov 27, 2025 • 2:30 PM")
- Truncate content to 2-3 lines with ellipsis
- Show small image thumbnails if images exist
- Support swipe-to-delete (or long-press menu)
- Dark mode card background (`colors.background.elevated`)
- Haptic feedback on press

### 4. Update JournalScreen

**Path**: `mobile/src/screens/JournalScreen.tsx`

Replace placeholder with full implementation:

**Visual Design**:
```
┌─────────────────────────────────────────┐
│  📔 Journal                        [+]  │  ← Header + FAB
├─────────────────────────────────────────┤
│                                         │
│  [JournalEntryCard]                     │
│  [JournalEntryCard]                     │
│  [JournalEntryCard]                     │
│  [JournalEntryCard]                     │  ← FlatList
│  ...                                    │
│                                         │
│  ─────── Empty State ───────           │
│  📝 No journal entries yet             │
│  Tap + to create your first entry      │
│                                         │
└─────────────────────────────────────────┘
```

**Implementation**:
```typescript
export default function JournalScreen() {
  const navigation = useNavigation();
  const { data: entries, isLoading, refetch } = useJournalEntries();
  const deleteEntry = useDeleteJournalEntry();

  // Navigate to new entry screen
  const handleNewEntry = () => {
    navigation.navigate('NewJournalEntry');
  };

  // Handle entry tap (expand or navigate to detail)
  const handleEntryPress = (entry: JournalEntry) => {
    // For MVP: could expand inline or navigate
  };

  // Handle delete with confirmation
  const handleDelete = (id: string) => {
    Alert.alert('Delete Entry', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteEntry.mutate(id) }
    ]);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <JournalEntryCard
            entry={item}
            onPress={() => handleEntryPress(item)}
            onDelete={() => handleDelete(item.id)}
          />
        )}
        ListEmptyComponent={<EmptyState />}
        refreshing={isLoading}
        onRefresh={refetch}
      />
      <FAB icon="+" onPress={handleNewEntry} />
    </View>
  );
}
```

### 5. Create NewJournalEntryScreen

**Path**: `mobile/src/screens/NewJournalEntryScreen.tsx`

**Visual Design**:
```
┌─────────────────────────────────────────┐
│  ← New Entry                    [Save]  │
├─────────────────────────────────────────┤
│                                         │
│  ┌───────────────────────────────────┐  │
│  │         🎤 Voice Record           │  │
│  │         Tap to start              │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ─────────── or type below ───────────  │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │                                   │  │
│  │ Write your thoughts...            │  │
│  │                                   │  │
│  │ [Transcribed text appears here]   │  │
│  │                                   │  │
│  └───────────────────────────────────┘  │
│                                         │
│  📷 Add Images                          │
│  ┌──────┐ ┌──────┐ ┌──────┐            │
│  │  +   │ │      │ │      │            │
│  └──────┘ └──────┘ └──────┘            │
│                                         │
└─────────────────────────────────────────┘
```

**Implementation**:
```typescript
export default function NewJournalEntryScreen() {
  const navigation = useNavigation();
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);

  const createEntry = useCreateJournalEntry();
  const uploadImage = useUploadJournalImage();

  const handleTranscriptionComplete = (text: string) => {
    // Append transcribed text to content
    setContent(prev => prev ? `${prev}\n\n${text}` : text);
    setIsRecording(false);
  };

  const handleSave = async () => {
    if (!content.trim() && images.length === 0) {
      Alert.alert('Empty Entry', 'Please add some content or images.');
      return;
    }

    try {
      // Upload images first
      const uploadedUrls = await Promise.all(
        images.map(uri => uploadImage.mutateAsync(uri))
      );

      // Create entry
      await createEntry.mutateAsync({
        content: content.trim(),
        images: uploadedUrls,
      });

      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save entry. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <VoiceRecorder
        onTranscriptionComplete={handleTranscriptionComplete}
        onCancel={() => setIsRecording(false)}
      />

      <Text style={styles.divider}>or type below</Text>

      <TextInput
        style={styles.textInput}
        placeholder="Write your thoughts..."
        placeholderTextColor={colors.text.muted}
        value={content}
        onChangeText={setContent}
        multiline
        textAlignVertical="top"
      />

      <ImagePicker
        images={images}
        onImagesChange={setImages}
        maxImages={5}
      />

      <Button
        title="Save Entry"
        onPress={handleSave}
        loading={createEntry.isPending || uploadImage.isPending}
        disabled={!content.trim() && images.length === 0}
      />
    </ScrollView>
  );
}
```

### 6. Update Navigation

**Path**: `mobile/src/navigation/MainTabNavigator.tsx`

Add NewJournalEntry to the Journal stack:

```typescript
// Add to imports
import NewJournalEntryScreen from '@/screens/NewJournalEntryScreen';

// In the Journal Stack (or create one)
<Stack.Screen
  name="NewJournalEntry"
  component={NewJournalEntryScreen}
  options={{
    title: 'New Entry',
    headerStyle: { backgroundColor: colors.background.primary },
    headerTintColor: colors.text.primary,
  }}
/>
```

### 7. Create Component Index

**Path**: `mobile/src/components/journal/index.ts`

```typescript
export { default as VoiceRecorder } from './VoiceRecorder';
export { default as ImagePicker } from './ImagePicker';
export { default as JournalEntryCard } from './JournalEntryCard';
```

---

## Styling Requirements

All components must use dark mode colors:

```typescript
import { colors } from '@/theme/colors';

// Backgrounds
colors.background.primary    // Main screen background
colors.background.secondary  // Card backgrounds
colors.background.elevated   // Elevated elements

// Text
colors.text.primary         // Main text
colors.text.secondary       // Subtle text
colors.text.muted          // Placeholder text

// Accents
colors.primary[500]        // Primary actions
colors.gold                // Highlights

// Borders
colors.border.default      // Default borders
```

---

## Acceptance Criteria

- [ ] VoiceRecorder shows all states correctly
- [ ] VoiceRecorder triggers model download on first use
- [ ] VoiceRecorder captures audio and transcribes
- [ ] ImagePicker opens gallery and selects images
- [ ] ImagePicker shows thumbnails with remove option
- [ ] ImagePicker enforces max image limit
- [ ] JournalEntryCard displays entry data correctly
- [ ] JournalEntryCard supports delete action
- [ ] JournalScreen shows list of entries
- [ ] JournalScreen handles empty state
- [ ] JournalScreen has pull-to-refresh
- [ ] NewJournalEntryScreen saves entries
- [ ] Navigation to NewJournalEntry works
- [ ] All components follow dark mode theme
- [ ] Haptic feedback on key interactions
- [ ] TypeScript compiles with 0 errors

---

## Testing Flow

Complete user flow to test:

1. Open Journal tab → See empty state
2. Tap "+" → Navigate to NewJournalEntryScreen
3. Tap Record → (First time: model downloads)
4. Record voice → Stop → See transcription appear
5. Edit transcribed text if needed
6. Tap Add Images → Select from gallery
7. Tap Save → Return to Journal list
8. See new entry in list with preview and images
9. Swipe/long-press entry → Delete → Confirm → Entry removed

---

## Report Template

When complete, report to orchestrator:

```markdown
## Agent Report: UI Components

### Status: [✅ Complete / ❌ Blocked / 🔄 In Progress]

### Files Created:
- `mobile/src/components/journal/VoiceRecorder.tsx`
- `mobile/src/components/journal/ImagePicker.tsx`
- `mobile/src/components/journal/JournalEntryCard.tsx`
- `mobile/src/components/journal/index.ts`
- `mobile/src/screens/NewJournalEntryScreen.tsx`

### Files Modified:
- `mobile/src/screens/JournalScreen.tsx` - Full implementation
- `mobile/src/navigation/MainTabNavigator.tsx` - Added NewJournalEntry route

### Components Added:
- `VoiceRecorder` - Voice recording with transcription
- `ImagePicker` - Gallery image selection
- `JournalEntryCard` - Entry list item

### Tests:
- [ ] Full flow: Record → Transcribe → Save → View
- [ ] Text-only entry works
- [ ] Image-only entry works
- [ ] Delete entry works
- [ ] Empty state displays

### Issues:
- (Any blockers or concerns)

### Handoff Notes:
- Voice Journal MVP is feature complete
- Ready for integration testing
```

---

## Reference Files

- Existing screen pattern: `mobile/src/screens/WorkbookScreen.tsx`
- Existing component pattern: `mobile/src/components/workbook/`
- Theme colors: `mobile/src/theme/colors.ts`
- Feature Spec: `docs/Voice-Journal-MVP.md`

---

**Estimated Effort**: 3-4 hours
**Blocked By**: Audio Agent, Backend Agent (must complete first)
**Blocks**: Nothing (final phase)
