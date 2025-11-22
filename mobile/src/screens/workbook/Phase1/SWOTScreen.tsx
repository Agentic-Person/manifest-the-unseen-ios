/**
 * SWOT Analysis Screen
 *
 * Personal SWOT Analysis exercise with 4 quadrants:
 * Strengths, Weaknesses, Opportunities, Threats.
 * Users can add multiple items per quadrant with auto-save functionality.
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Button, Card, Text, TextInput } from '../../../components';
import { colors, spacing, borderRadius, shadows } from '../../../theme';
import type { WorkbookStackScreenProps } from '../../../types/navigation';

/**
 * SWOT Item structure
 */
interface SWOTItem {
  id: string;
  text: string;
  createdAt: Date;
}

/**
 * SWOT Quadrant structure
 */
interface SWOTQuadrant {
  id: 'strengths' | 'weaknesses' | 'opportunities' | 'threats';
  title: string;
  shortTitle: string;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
  promptQuestions: string[];
  items: SWOTItem[];
}

/**
 * Default SWOT data structure
 */
const getDefaultSWOTData = (): SWOTQuadrant[] => [
  {
    id: 'strengths',
    title: 'Strengths',
    shortTitle: 'S',
    color: colors.success[700],
    bgColor: colors.success[50],
    borderColor: colors.success[200],
    description: 'Internal positive attributes and resources',
    promptQuestions: [
      'What do you do better than others?',
      'What unique skills or talents do you have?',
      'What achievements are you most proud of?',
      'What resources do you have access to?',
    ],
    items: [],
  },
  {
    id: 'weaknesses',
    title: 'Weaknesses',
    shortTitle: 'W',
    color: colors.error[700],
    bgColor: colors.error[50],
    borderColor: colors.error[200],
    description: 'Internal negative attributes to improve',
    promptQuestions: [
      'What tasks do you usually avoid?',
      'What do others see as your weaknesses?',
      'What areas need improvement?',
      'What habits hold you back?',
    ],
    items: [],
  },
  {
    id: 'opportunities',
    title: 'Opportunities',
    shortTitle: 'O',
    color: colors.info[700],
    bgColor: colors.info[50],
    borderColor: colors.info[200],
    description: 'External factors that could help you',
    promptQuestions: [
      'What trends could you take advantage of?',
      'What opportunities are available to you?',
      'What contacts or networks can help you?',
      'What changes in your environment could benefit you?',
    ],
    items: [],
  },
  {
    id: 'threats',
    title: 'Threats',
    shortTitle: 'T',
    color: colors.warning[700],
    bgColor: colors.warning[50],
    borderColor: colors.warning[200],
    description: 'External factors that could harm you',
    promptQuestions: [
      'What obstacles do you face?',
      'What external factors threaten your goals?',
      'Is changing technology threatening your position?',
      'What competition do you face?',
    ],
    items: [],
  },
];

type Props = WorkbookStackScreenProps<'SWOT'>;

/**
 * SWOT Analysis Screen Component
 */
const SWOTScreen: React.FC<Props> = ({ navigation }) => {
  const [swotData, setSWOTData] = useState<SWOTQuadrant[]>(getDefaultSWOTData());
  const [expandedQuadrant, setExpandedQuadrant] = useState<string | null>(null);
  const [newItemText, setNewItemText] = useState<{ [key: string]: string }>({});
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  /**
   * Auto-save functionality
   */
  useEffect(() => {
    const saveTimer = setTimeout(() => {
      autoSave();
    }, 2000);

    return () => clearTimeout(saveTimer);
  }, [swotData]);

  /**
   * Auto-save progress to storage/backend
   */
  const autoSave = useCallback(async () => {
    setIsSaving(true);
    try {
      // TODO: Save to Supabase
      // await supabase.from('workbook_progress').upsert({
      //   exercise_id: 'swot-analysis',
      //   data: swotData,
      //   updated_at: new Date().toISOString(),
      // });
      console.log('Auto-saving SWOT data:', swotData);
      setLastSaved(new Date());
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setIsSaving(false);
    }
  }, [swotData]);

  /**
   * Add item to a quadrant
   */
  const addItem = (quadrantId: string) => {
    const text = newItemText[quadrantId]?.trim();
    if (!text) return;

    const newItem: SWOTItem = {
      id: `${quadrantId}-${Date.now()}`,
      text,
      createdAt: new Date(),
    };

    setSWOTData(prev =>
      prev.map(quadrant =>
        quadrant.id === quadrantId
          ? { ...quadrant, items: [...quadrant.items, newItem] }
          : quadrant
      )
    );

    setNewItemText(prev => ({ ...prev, [quadrantId]: '' }));
  };

  /**
   * Remove item from a quadrant
   */
  const removeItem = (quadrantId: string, itemId: string) => {
    setSWOTData(prev =>
      prev.map(quadrant =>
        quadrant.id === quadrantId
          ? { ...quadrant, items: quadrant.items.filter(item => item.id !== itemId) }
          : quadrant
      )
    );
  };

  /**
   * Toggle quadrant expansion
   */
  const toggleQuadrant = (quadrantId: string) => {
    setExpandedQuadrant(prev => (prev === quadrantId ? null : quadrantId));
  };

  /**
   * Calculate total items
   */
  const totalItems = swotData.reduce((sum, q) => sum + q.items.length, 0);

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoid}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>SWOT Analysis</Text>
          <Text style={styles.subtitle}>
            Analyze your personal Strengths, Weaknesses, Opportunities, and Threats
          </Text>
        </View>

        {/* Progress Summary */}
        <Card elevation="flat" style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            {swotData.map(quadrant => (
              <View key={quadrant.id} style={styles.summaryItem}>
                <View
                  style={[
                    styles.summaryBadge,
                    { backgroundColor: quadrant.bgColor, borderColor: quadrant.borderColor },
                  ]}
                >
                  <Text style={[styles.summaryBadgeText, { color: quadrant.color }]}>
                    {quadrant.shortTitle}
                  </Text>
                </View>
                <Text style={styles.summaryCount}>{quadrant.items.length}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.summaryTotal}>
            {totalItems} {totalItems === 1 ? 'item' : 'items'} total
          </Text>
        </Card>

        {/* SWOT Quadrants */}
        <View style={styles.quadrantsContainer}>
          {swotData.map(quadrant => (
            <QuadrantCard
              key={quadrant.id}
              quadrant={quadrant}
              isExpanded={expandedQuadrant === quadrant.id}
              onToggle={() => toggleQuadrant(quadrant.id)}
              newItemText={newItemText[quadrant.id] || ''}
              onNewItemTextChange={(text) =>
                setNewItemText(prev => ({ ...prev, [quadrant.id]: text }))
              }
              onAddItem={() => addItem(quadrant.id)}
              onRemoveItem={(itemId) => removeItem(quadrant.id, itemId)}
            />
          ))}
        </View>

        {/* Save Status */}
        {lastSaved && (
          <Text style={styles.saveStatus}>
            {isSaving ? 'Saving...' : `Last saved: ${lastSaved.toLocaleTimeString()}`}
          </Text>
        )}

        {/* Action Buttons */}
        <View style={styles.actions}>
          <Button
            title="Save & Continue"
            onPress={() => {
              autoSave();
              navigation.goBack();
            }}
            variant="primary"
            fullWidth
          />
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

/**
 * Quadrant Card Component
 */
const QuadrantCard: React.FC<{
  quadrant: SWOTQuadrant;
  isExpanded: boolean;
  onToggle: () => void;
  newItemText: string;
  onNewItemTextChange: (text: string) => void;
  onAddItem: () => void;
  onRemoveItem: (itemId: string) => void;
}> = ({
  quadrant,
  isExpanded,
  onToggle,
  newItemText,
  onNewItemTextChange,
  onAddItem,
  onRemoveItem,
}) => {
  return (
    <View
      style={[
        styles.quadrantCard,
        { backgroundColor: quadrant.bgColor, borderColor: quadrant.borderColor },
      ]}
    >
      {/* Header - Always visible */}
      <TouchableOpacity
        style={styles.quadrantHeader}
        onPress={onToggle}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={`${quadrant.title}, ${quadrant.items.length} items`}
        accessibilityHint={isExpanded ? 'Tap to collapse' : 'Tap to expand'}
      >
        <View style={styles.quadrantTitleRow}>
          <View
            style={[
              styles.quadrantBadge,
              { backgroundColor: quadrant.color },
            ]}
          >
            <Text style={styles.quadrantBadgeText}>{quadrant.shortTitle}</Text>
          </View>
          <View style={styles.quadrantTitleContainer}>
            <Text style={[styles.quadrantTitle, { color: quadrant.color }]}>
              {quadrant.title}
            </Text>
            <Text style={styles.quadrantDescription}>{quadrant.description}</Text>
          </View>
        </View>
        <View style={styles.quadrantMeta}>
          <Text style={[styles.quadrantCount, { color: quadrant.color }]}>
            {quadrant.items.length}
          </Text>
          <Text style={styles.expandIcon}>{isExpanded ? '−' : '+'}</Text>
        </View>
      </TouchableOpacity>

      {/* Expanded Content */}
      {isExpanded && (
        <View style={styles.quadrantContent}>
          {/* Prompt Questions */}
          <View style={styles.promptsContainer}>
            <Text style={styles.promptsTitle}>Questions to consider:</Text>
            {quadrant.promptQuestions.map((question, index) => (
              <Text key={index} style={styles.promptQuestion}>
                {'\u2022'} {question}
              </Text>
            ))}
          </View>

          {/* Existing Items */}
          {quadrant.items.length > 0 && (
            <View style={styles.itemsList}>
              {quadrant.items.map(item => (
                <View key={item.id} style={styles.itemRow}>
                  <Text style={styles.itemText}>{item.text}</Text>
                  <TouchableOpacity
                    onPress={() => onRemoveItem(item.id)}
                    style={styles.removeButton}
                    accessibilityLabel={`Remove ${item.text}`}
                    accessibilityRole="button"
                  >
                    <Text style={styles.removeButtonText}>x</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {/* Add New Item */}
          <View style={styles.addItemContainer}>
            <TextInput
              placeholder={`Add a ${quadrant.title.toLowerCase().slice(0, -1)}...`}
              value={newItemText}
              onChangeText={onNewItemTextChange}
              multiline
              numberOfLines={2}
              containerStyle={styles.addItemInput}
              onSubmitEditing={onAddItem}
              returnKeyType="done"
            />
            <Button
              title="Add"
              onPress={onAddItem}
              variant="primary"
              size="sm"
              disabled={!newItemText.trim()}
              style={styles.addButton}
            />
          </View>
        </View>
      )}
    </View>
  );
};

/**
 * Styles
 */
const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  content: {
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
    fontSize: 16,
    color: colors.text.secondary,
    lineHeight: 24,
  },
  summaryCard: {
    backgroundColor: colors.background.primary,
    marginBottom: spacing.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.sm,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryBadge: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  summaryBadgeText: {
    fontSize: 16,
    fontWeight: '700',
  },
  summaryCount: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  summaryTotal: {
    fontSize: 14,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
  quadrantsContainer: {
    gap: spacing.md,
  },
  quadrantCard: {
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    overflow: 'hidden',
  },
  quadrantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
  },
  quadrantTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  quadrantBadge: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  quadrantBadgeText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.white,
  },
  quadrantTitleContainer: {
    flex: 1,
  },
  quadrantTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 2,
  },
  quadrantDescription: {
    fontSize: 12,
    color: colors.text.tertiary,
  },
  quadrantMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  quadrantCount: {
    fontSize: 20,
    fontWeight: '700',
  },
  expandIcon: {
    fontSize: 24,
    fontWeight: '300',
    color: colors.text.tertiary,
  },
  quadrantContent: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    padding: spacing.md,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  promptsContainer: {
    marginBottom: spacing.md,
    padding: spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: borderRadius.md,
  },
  promptsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text.secondary,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  promptQuestion: {
    fontSize: 14,
    color: colors.text.tertiary,
    lineHeight: 22,
    paddingLeft: spacing.sm,
  },
  itemsList: {
    marginBottom: spacing.md,
    gap: spacing.xs,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    paddingRight: spacing.xs,
    ...shadows.xs,
  },
  itemText: {
    flex: 1,
    fontSize: 14,
    color: colors.text.primary,
    lineHeight: 20,
  },
  removeButton: {
    width: 28,
    height: 28,
    borderRadius: borderRadius.full,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  removeButtonText: {
    fontSize: 16,
    color: colors.text.tertiary,
    fontWeight: '500',
  },
  addItemContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  addItemInput: {
    flex: 1,
    marginBottom: 0,
  },
  addButton: {
    minHeight: 44,
    paddingHorizontal: spacing.md,
  },
  saveStatus: {
    fontSize: 12,
    color: colors.text.tertiary,
    textAlign: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  actions: {
    marginTop: spacing.md,
  },
  bottomSpacer: {
    height: spacing['2xl'],
  },
});

export default SWOTScreen;
