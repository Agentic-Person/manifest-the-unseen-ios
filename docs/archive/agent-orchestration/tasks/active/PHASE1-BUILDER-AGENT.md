# Phase 1 Screen Builder Agent

**Task ID:** phase1-builder
**Created:** 2025-12-02
**Status:** PENDING
**Priority:** HIGH
**Parent:** WORKBOOK-TESTING-ORCHESTRATOR.md

---

## Overview

Creates the 7 missing Phase 1 exercise screens. These screens exist in the dashboard but clicking them only logs to console because they were never built.

---

## Missing Screens (7 total)

| Screen | Worksheet ID | Purpose | Template |
|--------|--------------|---------|----------|
| FeelWheelScreen.tsx | `feel-wheel` | Emotion identification wheel | WheelOfLifeScreen |
| AbcModelScreen.tsx | `abc-model` | Activating event, Belief, Consequence | Form-based |
| StrengthsWeaknessesScreen.tsx | `strengths-weaknesses` | Personal S&W analysis | SwotAnalysisScreen |
| ComfortZoneScreen.tsx | `comfort-zone` | Comfort zone mapping | Form-based |
| KnowYourselfScreen.tsx | `know-yourself` | Self-reflection questions | Form-based |
| AbilitiesRatingScreen.tsx | `abilities-rating` | Skills self-assessment | WheelOfLifeScreen |
| ThoughtAwarenessScreen.tsx | `thought-awareness` | Cognitive patterns logging | Form-based |

---

## File Locations

All files go in: `mobile/src/screens/workbook/Phase1/`

---

## Screen Template Pattern

Each screen should follow this structure:

```typescript
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import * as Haptics from 'expo-haptics';
import { useNavigation } from '@react-navigation/native';
import { useWorksheetProgress, useSaveProgress } from '../../../hooks/useWorkbook';

const PHASE_NUMBER = 1;
const WORKSHEET_ID = 'screen-id';

const formSchema = z.object({
  // Define form fields
});

type FormData = z.infer<typeof formSchema>;

export default function ScreenNameScreen() {
  const navigation = useNavigation();
  const { data: savedData } = useWorksheetProgress(PHASE_NUMBER, WORKSHEET_ID);
  const { mutate: saveProgress } = useSaveProgress();

  const { control, handleSubmit, watch } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: savedData?.data ?? {},
  });

  const handleSaveAndContinue = async (data: FormData) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    saveProgress({
      phaseNumber: PHASE_NUMBER,
      worksheetId: WORKSHEET_ID,
      data: data as unknown as Record<string, unknown>,
      completed: true,  // CRITICAL: Mark as complete
    });
    navigation.goBack();
  };

  return (
    <SafeAreaView className="flex-1 bg-[#1a1a2e]">
      <ScrollView className="flex-1 px-4">
        {/* Screen content */}
      </ScrollView>
    </SafeAreaView>
  );
}
```

---

## Screen Details

### 1. FeelWheelScreen.tsx
**Purpose:** Users select emotions from a wheel/grid
**Template:** WheelOfLifeScreen (similar interactive component)
**Form Fields:**
- `primaryEmotion: string`
- `secondaryEmotions: string[]`
- `notes: string`

### 2. AbcModelScreen.tsx
**Purpose:** ABC cognitive model (Activating event, Belief, Consequence)
**Template:** Form-based with text inputs
**Form Fields:**
- `activatingEvent: string`
- `belief: string`
- `consequence: string`
- `disputedBelief: string`
- `effectiveNewBelief: string`

### 3. StrengthsWeaknessesScreen.tsx
**Purpose:** Personal strengths and weaknesses analysis
**Template:** SwotAnalysisScreen (similar list format)
**Form Fields:**
- `strengths: string[]`
- `weaknesses: string[]`
- `actionPlan: string`

### 4. ComfortZoneScreen.tsx
**Purpose:** Map comfort zone, stretch zone, panic zone
**Template:** Form with zones
**Form Fields:**
- `comfortZone: string[]`
- `stretchZone: string[]`
- `panicZone: string[]`
- `commitments: string`

### 5. KnowYourselfScreen.tsx
**Purpose:** Self-reflection prompts
**Template:** Question-answer format
**Form Fields:**
- `values: string`
- `passions: string`
- `strengths: string`
- `idealDay: string`
- `legacy: string`

### 6. AbilitiesRatingScreen.tsx
**Purpose:** Rate skills/abilities on a scale
**Template:** WheelOfLifeScreen (sliders)
**Form Fields:**
- `abilities: { name: string, rating: number }[]`

### 7. ThoughtAwarenessScreen.tsx
**Purpose:** Log and challenge negative thoughts
**Template:** Form with multiple entries
**Form Fields:**
- `thoughts: { thought: string, challenge: string, replacement: string }[]`

---

## Implementation Order

1. Start with simpler screens (KnowYourselfScreen, StrengthsWeaknessesScreen)
2. Then wheel-based screens (FeelWheelScreen, AbilitiesRatingScreen)
3. Then complex screens (AbcModelScreen, ThoughtAwarenessScreen, ComfortZoneScreen)

---

## Checklist

- [ ] Create FeelWheelScreen.tsx
- [ ] Create AbcModelScreen.tsx
- [ ] Create StrengthsWeaknessesScreen.tsx
- [ ] Create ComfortZoneScreen.tsx
- [ ] Create KnowYourselfScreen.tsx
- [ ] Create AbilitiesRatingScreen.tsx
- [ ] Create ThoughtAwarenessScreen.tsx
- [ ] All screens include `completed: true` on save

---

## Dependencies

**Depends on:** PROGRESS-FIX-AGENT.md (must fix completion tracking first)
**Parallel with:** NAVIGATION-WIRING-AGENT.md
**Blocks:** Playwright testing

---

## Related Documents

- **Parent:** WORKBOOK-TESTING-ORCHESTRATOR.md
- **Templates:**
  - `Phase1/WheelOfLifeScreen.tsx`
  - `Phase1/SwotAnalysisScreen.tsx`
- **PRD:** `docs/manifest-the-unseen-prd.md` (exercise content)

---

**Document Version:** 1.0
**Last Updated:** 2025-12-02
