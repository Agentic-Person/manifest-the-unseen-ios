/**
 * New Journal Entry Screen
 *
 * Screen for creating a new journal entry with voice recording,
 * text input, and image attachments.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { colors, spacing, typography } from '@/theme';
import {
  useCreateJournalEntry,
  useUploadJournalImage,
} from '@/hooks';
import { VoiceRecorder, ImagePicker } from '@/components/journal';
import { Button } from '@/components/Button';
import * as Haptics from 'expo-haptics';

interface NewJournalEntryScreenProps {
  navigation: any;
}

/**
 * New Journal Entry Screen Component
 */
const NewJournalEntryScreen: React.FC<NewJournalEntryScreenProps> = ({ navigation }) => {
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);

  const createEntry = useCreateJournalEntry();
  const uploadImage = useUploadJournalImage();

  // Handle transcription completion
  const handleTranscriptionComplete = (text: string) => {
    // Append transcribed text to content
    setContent(prev => {
      if (prev.trim()) {
        return `${prev}\n\n${text}`;
      }
      return text;
    });
    setShowVoiceRecorder(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  // Handle voice recorder cancel
  const handleVoiceRecorderCancel = () => {
    setShowVoiceRecorder(false);
  };

  // Toggle voice recorder
  const handleToggleVoiceRecorder = () => {
    setShowVoiceRecorder(prev => !prev);
  };

  // Handle save entry
  const handleSave = async () => {
    // Validate content
    if (!content.trim() && images.length === 0) {
      Alert.alert(
        'Empty Entry',
        'Please add some content or images before saving.',
      );
      return;
    }

    try {
      // Upload images first (if any)
      let uploadedUrls: string[] = [];
      if (images.length > 0) {
        uploadedUrls = await Promise.all(
          images.map(uri => uploadImage.mutateAsync(uri))
        );
      }

      // Create entry
      await createEntry.mutateAsync({
        content: content.trim(),
        images: uploadedUrls,
      });

      // Success feedback
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Navigate back
      navigation.goBack();
    } catch (error) {
      console.error('Failed to save entry:', error);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(
        'Error',
        'Failed to save journal entry. Please try again.',
      );
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (content.trim() || images.length > 0) {
      Alert.alert(
        'Discard Entry?',
        'You have unsaved changes. Are you sure you want to discard this entry?',
        [
          {
            text: 'Keep Editing',
            style: 'cancel',
          },
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => navigation.goBack(),
          },
        ],
      );
    } else {
      navigation.goBack();
    }
  };

  const isSaving = createEntry.isPending || uploadImage.isPending;
  const canSave = (content.trim() || images.length > 0) && !isSaving;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>New Entry</Text>
          <Text style={styles.subtitle}>
            Capture your thoughts and feelings
          </Text>
        </View>

        {/* Voice Recorder Section */}
        {showVoiceRecorder ? (
          <VoiceRecorder
            onTranscriptionComplete={handleTranscriptionComplete}
            onCancel={handleVoiceRecorderCancel}
            maxDuration={900}
          />
        ) : (
          <Button
            title="🎤 Voice Record"
            onPress={handleToggleVoiceRecorder}
            variant="outline"
            size="lg"
            fullWidth
            style={styles.voiceButton}
          />
        )}

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or type below</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Text Input */}
        <TextInput
          style={styles.textInput}
          placeholder="Write your thoughts..."
          placeholderTextColor={colors.text.tertiary}
          value={content}
          onChangeText={setContent}
          multiline
          textAlignVertical="top"
          autoCorrect
          autoCapitalize="sentences"
          spellCheck
        />

        {/* Character Count (optional) */}
        {content.length > 0 && (
          <Text style={styles.charCount}>
            {content.length} characters
          </Text>
        )}

        {/* Image Picker */}
        <ImagePicker
          images={images}
          onImagesChange={setImages}
          maxImages={5}
          disabled={isSaving}
        />

        {/* Action Buttons */}
        <View style={styles.actions}>
          <Button
            title="Cancel"
            onPress={handleCancel}
            variant="ghost"
            size="lg"
            disabled={isSaving}
            style={styles.actionButton}
          />

          <Button
            title={isSaving ? 'Saving...' : 'Save Entry'}
            onPress={handleSave}
            variant="primary"
            size="lg"
            disabled={!canSave}
            loading={isSaving}
            style={styles.actionButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
  },
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.body.fontSize,
    color: colors.text.secondary,
  },
  voiceButton: {
    marginBottom: spacing.md,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border.default,
  },
  dividerText: {
    fontSize: typography.caption.fontSize,
    color: colors.text.tertiary,
    marginHorizontal: spacing.md,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  textInput: {
    backgroundColor: colors.background.elevated,
    borderRadius: 12,
    padding: spacing.md,
    fontSize: typography.body.fontSize,
    color: colors.text.primary,
    lineHeight: typography.body.lineHeight,
    minHeight: 200,
    borderWidth: 1,
    borderColor: colors.border.default,
    marginBottom: spacing.sm,
  },
  charCount: {
    fontSize: typography.caption.fontSize,
    color: colors.text.tertiary,
    textAlign: 'right',
    marginBottom: spacing.md,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  actionButton: {
    flex: 1,
  },
});

export default NewJournalEntryScreen;
