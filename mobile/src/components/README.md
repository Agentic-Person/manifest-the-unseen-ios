## Component Library

Core UI components for Manifest the Unseen, built with React Native and TypeScript. All components use design tokens from `@/theme` and follow accessibility best practices.

### Components

1. **Button** - Primary interaction component with variants and states
2. **TextInput** - Form input with labels, errors, and validation
3. **Card** - Container component with elevation
4. **Loading** - Spinner and skeleton loading states
5. **Text** - Typography wrapper with design system variants

---

## Button

Reusable button component with haptic feedback and accessibility.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | required | Button text |
| `onPress` | `() => void` | required | Press handler |
| `variant` | `'primary' \| 'secondary' \| 'ghost' \| 'outline'` | `'primary'` | Visual style |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Button size |
| `disabled` | `boolean` | `false` | Disabled state |
| `loading` | `boolean` | `false` | Loading state (shows spinner) |
| `fullWidth` | `boolean` | `false` | Full width button |
| `enableHaptic` | `boolean` | `true` | Haptic feedback on press |

### Examples

```tsx
import { Button } from '@/components';

// Primary button
<Button
  title="Continue"
  onPress={handleContinue}
  variant="primary"
  size="lg"
/>

// Secondary button
<Button
  title="Skip"
  onPress={handleSkip}
  variant="secondary"
/>

// Ghost button
<Button
  title="Learn More"
  onPress={handleLearnMore}
  variant="ghost"
/>

// Outline button
<Button
  title="Cancel"
  onPress={handleCancel}
  variant="outline"
/>

// Loading state
<Button
  title="Saving..."
  onPress={handleSave}
  loading={isSaving}
/>

// Disabled state
<Button
  title="Complete Phase"
  onPress={handleComplete}
  disabled={!isPhaseComplete}
/>

// Full width
<Button
  title="Get Started"
  onPress={handleStart}
  fullWidth
/>
```

### Accessibility

- ✅ `accessibilityRole="button"`
- ✅ `accessibilityLabel` (defaults to `title`)
- ✅ `accessibilityState` (disabled, busy)
- ✅ Minimum 44pt touch target (iOS HIG)
- ✅ Haptic feedback on press

---

## TextInput

Form input component with label, error states, and character counter.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Input label |
| `value` | `string` | - | Input value |
| `onChangeText` | `(text: string) => void` | - | Change handler |
| `placeholder` | `string` | - | Placeholder text |
| `error` | `string` | - | Error message |
| `helperText` | `string` | - | Helper text |
| `disabled` | `boolean` | `false` | Disabled state |
| `multiline` | `boolean` | `false` | Multiline textarea |
| `numberOfLines` | `number` | `4` | Number of lines (multiline) |
| `maxLength` | `number` | - | Max character length |
| `showCharacterCount` | `boolean` | `false` | Show character counter |

### Examples

```tsx
import { TextInput } from '@/components';

// Basic input
<TextInput
  label="Email"
  value={email}
  onChangeText={setEmail}
  placeholder="Enter your email"
/>

// With error
<TextInput
  label="Password"
  value={password}
  onChangeText={setPassword}
  error="Password must be at least 8 characters"
  secureTextEntry
/>

// With helper text
<TextInput
  label="Username"
  value={username}
  onChangeText={setUsername}
  helperText="This will be visible to other users"
/>

// Multiline (textarea)
<TextInput
  label="Journal Entry"
  value={entry}
  onChangeText={setEntry}
  placeholder="Write your thoughts..."
  multiline
  numberOfLines={6}
/>

// With character counter
<TextInput
  label="Affirmation"
  value={affirmation}
  onChangeText={setAffirmation}
  maxLength={100}
  showCharacterCount
/>

// Disabled
<TextInput
  label="Email"
  value={email}
  disabled
/>
```

### Accessibility

- ✅ `accessibilityLabel` from `label`
- ✅ `accessibilityHint` from `helperText`
- ✅ `accessibilityRole="alert"` for errors
- ✅ `accessibilityState` (disabled)
- ✅ Minimum 44pt touch target

---

## Card

Container component with elevation and optional press behavior.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | required | Card content |
| `elevation` | `'flat' \| 'raised' \| 'lifted'` | `'raised'` | Elevation level |
| `onPress` | `() => void` | - | Press handler (makes card pressable) |
| `padding` | `keyof spacing \| number` | `'md'` | Padding size |

### Examples

```tsx
import { Card, Text } from '@/components';

// Basic card
<Card>
  <Text variant="h3">Phase 1</Text>
  <Text>Self-Evaluation</Text>
</Card>

// Pressable card
<Card elevation="raised" onPress={handlePress}>
  <Text variant="h4">Continue Journey</Text>
  <Text variant="caption">Tap to proceed</Text>
</Card>

// Flat card (with border)
<Card elevation="flat">
  <Text>Flat card with border</Text>
</Card>

// Lifted card (higher elevation)
<Card elevation="lifted">
  <Text>Important notice</Text>
</Card>

// Custom padding
<Card padding="lg">
  <Text>More padding</Text>
</Card>

<Card padding={32}>
  <Text>Custom padding (32px)</Text>
</Card>
```

### Accessibility

- ✅ `accessibilityRole="button"` when pressable
- ✅ `accessibilityLabel` support
- ✅ Press state visual feedback

---

## Loading

Spinner and skeleton loading states.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'spinner' \| 'skeleton'` | `'spinner'` | Loading variant |
| `skeletonType` | `'text' \| 'image' \| 'card'` | `'text'` | Skeleton type |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Size |
| `color` | `string` | `colors.primary[600]` | Spinner color |

### Examples

```tsx
import { Loading } from '@/components';

// Spinner
<Loading variant="spinner" size="large" />

// Small spinner
<Loading variant="spinner" size="small" />

// Custom color spinner
<Loading variant="spinner" color="#fbbf24" />

// Text skeleton
<Loading variant="skeleton" skeletonType="text" />

// Image skeleton
<Loading variant="skeleton" skeletonType="image" />

// Card skeleton
<Loading variant="skeleton" skeletonType="card" />
```

### Accessibility

- ✅ `accessibilityRole="progressbar"`
- ✅ `accessibilityLabel="Loading"`

---

## Text

Typography wrapper with design system variants.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `TypographyVariant` | `'body'` | Typography variant |
| `color` | `string` | `'primary'` | Text color |
| `align` | `'left' \| 'center' \| 'right' \| 'justify'` | `'left'` | Text alignment |
| `weight` | `'300' \| '400' \| ... \| '800'` | - | Font weight override |
| `numberOfLines` | `number` | - | Max lines (with ellipsis) |

### Typography Variants

- `display` - Hero text (48px)
- `h1` - Main heading (36px)
- `h2` - Section heading (32px)
- `h3` - Subsection heading (28px)
- `h4` - Card heading (24px)
- `h5` - List heading (20px)
- `h6` - Small heading (18px)
- `body` - Default body text (16px)
- `bodyLarge` - Large body text (18px)
- `bodySmall` - Small body text (14px)
- `caption` - Caption text (12px)
- `overline` - Labels, tags (12px uppercase)
- `button` - Button text (16px semibold)

### Examples

```tsx
import { Text } from '@/components';

// Headings
<Text variant="h1">Phase 1: Self-Evaluation</Text>
<Text variant="h2">Your Journey Begins</Text>
<Text variant="h3">Wheel of Life</Text>

// Body text
<Text variant="body">
  This exercise helps you evaluate your life balance.
</Text>

<Text variant="bodySmall">
  Complete all sections to proceed.
</Text>

// Caption
<Text variant="caption" color="secondary">
  Last updated: 2 hours ago
</Text>

// Overline (labels)
<Text variant="overline" color="secondary">
  Phase 1 • Self-Evaluation
</Text>

// Custom color
<Text variant="body" color={colors.primary[600]}>
  Start your manifestation journey
</Text>

// Text alignment
<Text variant="h2" align="center">
  Centered Heading
</Text>

// Weight override
<Text variant="body" weight="700">
  Bold body text
</Text>

// Truncate with ellipsis
<Text variant="body" numberOfLines={2}>
  This is a long text that will be truncated after two lines with an ellipsis...
</Text>
```

### Accessibility

- ✅ `allowFontScaling` (Dynamic Type support)
- ✅ `accessible` by default
- ✅ Proper heading hierarchy (h1-h6)

---

## Best Practices

### Component Usage

1. **Always use components** - Don't recreate buttons, inputs, etc.
2. **Use design tokens** - Import from `@/theme` for colors, spacing, etc.
3. **Accessibility first** - All components have built-in a11y support
4. **Composition over customization** - Combine components instead of adding props
5. **TypeScript strict** - Use proper types for all props

### Example: Building a Form

```tsx
import { View } from 'react-native';
import { Button, TextInput, Text, Card } from '@/components';
import { spacing } from '@/theme';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  return (
    <Card elevation="raised">
      <Text variant="h3" style={{ marginBottom: spacing.md }}>
        Welcome Back
      </Text>

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
        error={errors.email}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <View style={{ height: spacing.md }} />

      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your password"
        error={errors.password}
        secureTextEntry
      />

      <View style={{ height: spacing.lg }} />

      <Button
        title="Sign In"
        onPress={handleSignIn}
        fullWidth
      />

      <View style={{ height: spacing.sm }} />

      <Button
        title="Forgot Password?"
        onPress={handleForgotPassword}
        variant="ghost"
        size="sm"
      />
    </Card>
  );
}
```

### Example: Building a List

```tsx
import { FlatList } from 'react-native';
import { Card, Text, Loading } from '@/components';
import { spacing } from '@/theme';

function JournalList({ entries, isLoading }) {
  if (isLoading) {
    return (
      <>
        <Loading variant="skeleton" skeletonType="card" />
        <Loading variant="skeleton" skeletonType="card" />
        <Loading variant="skeleton" skeletonType="card" />
      </>
    );
  }

  return (
    <FlatList
      data={entries}
      renderItem={({ item }) => (
        <Card
          elevation="raised"
          onPress={() => handlePress(item.id)}
          style={{ marginBottom: spacing.md }}
        >
          <Text variant="h4">{item.title}</Text>
          <Text variant="caption" color="secondary">
            {item.created_at}
          </Text>
          <Text variant="body" numberOfLines={2}>
            {item.content}
          </Text>
        </Card>
      )}
      keyExtractor={(item) => item.id}
    />
  );
}
```

---

## Testing Components

All components should be tested with:

1. **Unit tests** - Component rendering and props
2. **Accessibility tests** - Screen reader compatibility
3. **Visual tests** - Snapshot testing

Example test:

```typescript
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from './Button';

describe('Button', () => {
  it('renders correctly', () => {
    const { getByText } = render(
      <Button title="Click me" onPress={() => {}} />
    );
    expect(getByText('Click me')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByRole } = render(
      <Button title="Click me" onPress={onPress} />
    );

    fireEvent.press(getByRole('button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    const onPress = jest.fn();
    const { getByRole } = render(
      <Button title="Click me" onPress={onPress} disabled />
    );

    const button = getByRole('button');
    expect(button).toBeDisabled();

    fireEvent.press(button);
    expect(onPress).not.toHaveBeenCalled();
  });
});
```

---

## Related Files

- `../theme/` - Design tokens used by components
- `../screens/` - Screen components using these primitives
- `../../packages/shared/` - Shared models and validation
