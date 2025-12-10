# Upgrade Prompts - Visual Component Showcase

## Design System

### Colors

```
Primary Purple:    #9333EA  (Tier badges, headers)
Gold CTA:          #C9A227  (Upgrade button)
Dark Background:   #0F0A1A  (App background)
Card Background:   #1F1B2E  (Modal background)
White Text:        #FFFFFF  (Titles, primary text)
Gray Text:         #D1D5DB  (Descriptions)
Muted Text:        #9CA3AF  (Secondary actions)
```

### Typography

```
Title:       24px, Bold, White
Description: 16px, Regular, Gray (#D1D5DB)
Benefits:    15px, Regular, Gray (#D1D5DB)
Button:      18px, Bold, Dark (#1F1B2E on Gold)
Secondary:   16px, SemiBold, Muted Gray
```

## Component Previews

### 1. Base UpgradePrompt

```
┌────────────────────────────────────┐
│   ╔══════════════════════════════╗ │
│   ║       🔒                     ║ │ <- Purple Header
│   ║   Unlock Premium Feature    ║ │
│   ╚══════════════════════════════╝ │
│                                    │
│   This feature is available in     │
│   Awakening Path. Upgrade to       │
│   unlock your full potential.      │
│                                    │
│        ┌───────────────┐           │
│        │ Awakening Path│           │ <- Purple Badge
│        └───────────────┘           │
│                                    │
│   What you'll unlock:              │
│   ✨ Phases 1-8                    │
│   ✨ 6 guided meditations          │
│   ✨ 200 journal entries per month │
│   ✨ AI wisdom chat (50 per day)   │
│   ✨ Vision board creation         │
│   ✨ Daily inspiration             │
│                                    │
│   ┌──────────────────────────────┐ │
│   │      Upgrade Now             │ │ <- Gold Button
│   └──────────────────────────────┘ │
│                                    │
│        Maybe Later                 │ <- Gray Text Link
│                                    │
└────────────────────────────────────┘
```

### 2. PhaseLockedPrompt

**Example: Phase 6 Locked (Novice → Awakening)**

```
┌────────────────────────────────────┐
│   ╔══════════════════════════════╗ │
│   ║       🔒                     ║ │
│   ║     Unlock Phase 6           ║ │
│   ╚══════════════════════════════╝ │
│                                    │
│   Phase 6 is part of your deeper   │
│   manifestation journey. Upgrade   │
│   to Awakening Path to continue    │
│   your transformation.             │
│                                    │
│        ┌───────────────┐           │
│        │ Awakening Path│           │
│        └───────────────┘           │
│                                    │
│   What you'll unlock:              │
│   ✨ Phases 1-8                    │
│   ✨ 6 guided meditations          │
│   ✨ 200 journal entries per month │
│   ✨ AI wisdom chat (50 per day)   │
│   ✨ Vision board creation         │
│   ✨ Daily inspiration             │
│                                    │
│   ┌──────────────────────────────┐ │
│   │      Upgrade Now             │ │
│   └──────────────────────────────┘ │
│        Maybe Later                 │
└────────────────────────────────────┘
```

**Example: Phase 9 Locked (Awakening → Enlightenment)**

```
┌────────────────────────────────────┐
│   ╔══════════════════════════════╗ │
│   ║       🔒                     ║ │
│   ║     Unlock Phase 9           ║ │
│   ╚══════════════════════════════╝ │
│                                    │
│   Phase 9 is part of your deeper   │
│   manifestation journey. Upgrade   │
│   to Enlightenment Path to         │
│   continue your transformation.    │
│                                    │
│      ┌─────────────────────┐       │
│      │ Enlightenment Path  │       │
│      └─────────────────────┘       │
│                                    │
│   What you'll unlock:              │
│   ✨ All 10 phases                 │
│   ✨ All 18 guided meditations     │
│   ✨ Unlimited journal entries     │
│   ✨ Unlimited AI wisdom chat      │
│   ✨ Voice transcription           │
│   ✨ Priority support              │
│   ✨ Early access to new features  │
│                                    │
│   ┌──────────────────────────────┐ │
│   │      Upgrade Now             │ │
│   └──────────────────────────────┘ │
│        Maybe Later                 │
└────────────────────────────────────┘
```

### 3. MeditationLockedPrompt

**Example: Meditation 5 Locked**

```
┌────────────────────────────────────┐
│   ╔══════════════════════════════╗ │
│   ║       🔒                     ║ │
│   ║  Unlock "Deep Relaxation"    ║ │
│   ╚══════════════════════════════╝ │
│                                    │
│   Access powerful guided           │
│   meditations to deepen your       │
│   practice. Upgrade to Awakening   │
│   Path to unlock this meditation.  │
│                                    │
│        ┌───────────────┐           │
│        │ Awakening Path│           │
│        └───────────────┘           │
│                                    │
│   What you'll unlock:              │
│   ✨ Phases 1-8                    │
│   ✨ 6 guided meditations          │
│   ✨ 200 journal entries per month │
│   ✨ AI wisdom chat (50 per day)   │
│   ✨ Vision board creation         │
│   ✨ Daily inspiration             │
│                                    │
│   ┌──────────────────────────────┐ │
│   │      Upgrade Now             │ │
│   └──────────────────────────────┘ │
│        Maybe Later                 │
└────────────────────────────────────┘
```

### 4. QuotaExceededPrompt - Journal

**Example: Free Tier (5/5 used)**

```
┌────────────────────────────────────┐
│   ╔══════════════════════════════╗ │
│   ║       🔒                     ║ │
│   ║   Journal Limit Reached      ║ │
│   ╚══════════════════════════════╝ │
│                                    │
│   You've used 5 of your 5 monthly  │
│   journal entries.                 │
│                                    │
│   You've reached your monthly      │
│   journal limit. Upgrade to        │
│   Novice Path for more journal     │
│   entries.                         │
│                                    │
│        ┌──────────────┐            │
│        │ Novice Path  │            │
│        └──────────────┘            │
│                                    │
│   What you'll unlock:              │
│   ✨ Phases 1-5                    │
│   ✨ 3 guided meditations          │
│   ✨ 50 journal entries per month  │
│   ✨ AI wisdom chat (10 per day)   │
│   ✨ Progress tracking             │
│                                    │
│   ┌──────────────────────────────┐ │
│   │      Upgrade Now             │ │
│   └──────────────────────────────┘ │
│        Maybe Later                 │
└────────────────────────────────────┘
```

**Example: Novice Tier (50/50 used)**

```
┌────────────────────────────────────┐
│   ╔══════════════════════════════╗ │
│   ║       🔒                     ║ │
│   ║   Journal Limit Reached      ║ │
│   ╚══════════════════════════════╝ │
│                                    │
│   You've used 50 of your 50        │
│   monthly journal entries.         │
│                                    │
│   You've reached your monthly      │
│   journal limit. Upgrade to        │
│   Awakening Path for more journal  │
│   entries.                         │
│                                    │
│        ┌───────────────┐           │
│        │ Awakening Path│           │
│        └───────────────┘           │
│                                    │
│   What you'll unlock:              │
│   ✨ Phases 1-8                    │
│   ✨ 6 guided meditations          │
│   ✨ 200 journal entries per month │
│   ✨ AI wisdom chat (50 per day)   │
│   ✨ Vision board creation         │
│   ✨ Daily inspiration             │
│                                    │
│   ┌──────────────────────────────┐ │
│   │      Upgrade Now             │ │
│   └──────────────────────────────┘ │
│        Maybe Later                 │
└────────────────────────────────────┘
```

### 5. QuotaExceededPrompt - AI Chat

**Example: Free Tier (3/3 used)**

```
┌────────────────────────────────────┐
│   ╔══════════════════════════════╗ │
│   ║       🔒                     ║ │
│   ║  Daily Chat Limit Reached    ║ │
│   ╚══════════════════════════════╝ │
│                                    │
│   You've used 3 of your 3 daily    │
│   AI chat messages.                │
│                                    │
│   You've reached your daily AI     │
│   chat limit. Upgrade to Novice    │
│   Path for more conversations      │
│   with the AI monk.                │
│                                    │
│        ┌──────────────┐            │
│        │ Novice Path  │            │
│        └──────────────┘            │
│                                    │
│   What you'll unlock:              │
│   ✨ Phases 1-5                    │
│   ✨ 3 guided meditations          │
│   ✨ 50 journal entries per month  │
│   ✨ AI wisdom chat (10 per day)   │
│   ✨ Progress tracking             │
│                                    │
│   ┌──────────────────────────────┐ │
│   │      Upgrade Now             │ │
│   └──────────────────────────────┘ │
│        Maybe Later                 │
└────────────────────────────────────┘
```

### 6. FeatureLockedPrompt - Voice Transcription

```
┌────────────────────────────────────┐
│   ╔══════════════════════════════╗ │
│   ║       🔒                     ║ │
│   ║  Unlock Voice Transcription  ║ │
│   ╚══════════════════════════════╝ │
│                                    │
│   Transform your spoken thoughts   │
│   into text instantly. Upgrade to  │
│   Awakening Path to unlock voice   │
│   transcription for your journal   │
│   entries.                         │
│                                    │
│        ┌───────────────┐           │
│        │ Awakening Path│           │
│        └───────────────┘           │
│                                    │
│   What you'll unlock:              │
│   ✨ Phases 1-8                    │
│   ✨ 6 guided meditations          │
│   ✨ 200 journal entries per month │
│   ✨ AI wisdom chat (50 per day)   │
│   ✨ Vision board creation         │
│   ✨ Daily inspiration             │
│                                    │
│   ┌──────────────────────────────┐ │
│   │      Upgrade Now             │ │
│   └──────────────────────────────┘ │
│        Maybe Later                 │
└────────────────────────────────────┘
```

### 7. FeatureLockedPrompt - Vision Board

```
┌────────────────────────────────────┐
│   ╔══════════════════════════════╗ │
│   ║       🔒                     ║ │
│   ║    Unlock Vision Boards      ║ │
│   ╚══════════════════════════════╝ │
│                                    │
│   Create powerful visual           │
│   representations of your dreams.  │
│   Upgrade to Awakening Path to     │
│   unlock vision board creation.    │
│                                    │
│        ┌───────────────┐           │
│        │ Awakening Path│           │
│        └───────────────┘           │
│                                    │
│   What you'll unlock:              │
│   ✨ Phases 1-8                    │
│   ✨ 6 guided meditations          │
│   ✨ 200 journal entries per month │
│   ✨ AI wisdom chat (50 per day)   │
│   ✨ Vision board creation         │
│   ✨ Daily inspiration             │
│                                    │
│   ┌──────────────────────────────┐ │
│   │      Upgrade Now             │ │
│   └──────────────────────────────┘ │
│        Maybe Later                 │
└────────────────────────────────────┘
```

## Lock Indicators in UI

### Phase Card - Locked

```
┌──────────────────────────────────┐
│  Phase 6                         │
│  Manifestation Techniques        │
│                                  │
│  🔒 Locked                       │ <- Lock badge
└──────────────────────────────────┘
```

### Meditation Item - Locked

```
┌──────────────────────────────────┐
│  Deep Relaxation        🔒       │ <- Lock icon right
│  15 minutes                      │
└──────────────────────────────────┘
```

### Feature Button - Locked

```
┌─────────┐
│   🎤    │
│   🔒    │ <- Mini lock overlay
└─────────┘
```

### Quota Warning - Near Limit

```
┌──────────────────────────────────┐
│  ⚠️ 2 entries remaining this     │ <- Orange warning
│     month                        │
└──────────────────────────────────┘
```

### Quota Exceeded - Over Limit

```
┌──────────────────────────────────┐
│  Limit Reached - Upgrade for     │ <- Red error state
│  more                            │
└──────────────────────────────────┘
```

### Unlimited Badge - Premium

```
┌──────────────────────────────────┐
│  ✨ Unlimited                    │ <- Gold badge
└──────────────────────────────────┘
```

## Animation Specs

### Modal Entry
- **Type:** Fade + Scale
- **Duration:** 300ms
- **Easing:** ease-out
- **Initial:** opacity: 0, scale: 0.9
- **Final:** opacity: 1, scale: 1

### Modal Exit
- **Type:** Fade
- **Duration:** 200ms
- **Easing:** ease-in
- **Initial:** opacity: 1
- **Final:** opacity: 0

### Button Press
- **Type:** Scale
- **Duration:** 100ms
- **Active Opacity:** 0.8
- **Scale:** 0.98

### Benefits List
- **Type:** Stagger fade-in
- **Delay:** 50ms per item
- **Duration:** 200ms per item

## Accessibility

### VoiceOver Labels

```typescript
// Phase locked
accessibilityLabel="Phase 6: Manifestation Techniques. Locked. Requires Awakening Path subscription."

// Meditation locked
accessibilityLabel="Deep Relaxation meditation, 15 minutes. Locked. Requires Awakening Path."

// Quota exceeded
accessibilityLabel="Journal entry limit reached. 5 of 5 entries used this month. Upgrade to create more."

// Feature locked
accessibilityLabel="Voice transcription. Locked. Requires Awakening Path subscription."
```

### Focus Management

- Modal appears: Focus moves to title
- Upgrade button: Focused first (primary action)
- Escape key: Closes modal
- Tab navigation: Title → Benefits → Upgrade → Dismiss

## Responsive Behavior

### Small Screens (< 375px)
- Modal width: 90% of screen
- Padding: 16px (reduced from 20px)
- Font sizes: -2px across the board
- Benefits scrollable if > 5 items

### Large Screens (> 414px)
- Modal width: 400px (max)
- Standard padding and fonts
- All content visible without scroll

### Landscape Mode
- Modal height: max 80% of screen
- Content scrollable
- Header remains fixed at top

## Dark Mode Considerations

Current design is dark by default. For future light mode:

```
Light Mode Colors:
- Background: #FFFFFF
- Card: #F3F4F6
- Text: #1F2937
- Text Muted: #6B7280
- Primary Purple: #9333EA (same)
- Gold CTA: #C9A227 (same)
```

## Platform Differences

### iOS
- Native modal presentation style
- Haptic feedback on button press
- Safe area insets respected
- Smooth 60fps animations

### Android (Future)
- Material motion
- Ripple effects on buttons
- Back button closes modal
- Hardware back button support

## Testing Checklist

Visual QA:
- [ ] Modal centers on screen
- [ ] All text readable
- [ ] Benefits list not cut off
- [ ] Buttons touchable
- [ ] Lock icon displays
- [ ] Tier badge visible
- [ ] Purple header prominent
- [ ] Gold button stands out
- [ ] Overlay dims background
- [ ] Safe areas respected
- [ ] Landscape works
- [ ] Small screens work
- [ ] Large screens work

Interaction QA:
- [ ] Tap outside closes
- [ ] Escape key closes
- [ ] Upgrade button works
- [ ] Dismiss button works
- [ ] Animations smooth
- [ ] No jank or lag
- [ ] VoiceOver works
- [ ] Tab navigation works

## Design Assets

### Icon Sizes
- Lock emoji: 40px (header)
- Lock emoji: 16px (inline)
- Benefit sparkle: 16px

### Spacing
- Modal padding: 20px
- Header vertical: 24px
- Content vertical: 20px
- Benefits gap: 12px
- Button gap: 12px
- Section gap: 20-24px

### Border Radius
- Modal: 20px
- Tier badge: 20px (pill)
- Buttons: 12px

### Shadows
- Modal: 0 8px 16px rgba(147, 51, 234, 0.3)
- Button: 0 4px 8px rgba(201, 162, 39, 0.3)

## Copy Guidelines

### Tone
- **Empowering:** "Unlock your full potential"
- **Aspirational:** "Continue your transformation"
- **Specific:** "Phases 1-8" not "More phases"
- **Benefit-focused:** "What you'll unlock" not "What you're missing"

### Structure
- **Title:** Short, action-oriented (3-5 words)
- **Description:** Clear value prop (2-3 sentences)
- **Benefits:** Concrete features (5-7 bullets)

### Language
- Use "unlock" not "get access to"
- Use "upgrade" not "pay" or "subscribe"
- Use "continue" not "proceed"
- Use "transform" not "change"
