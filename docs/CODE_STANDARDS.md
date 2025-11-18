# Code Standards & Contributing Guide

This document outlines the code quality standards, formatting rules, and best practices for the Manifest the Unseen project.

## Table of Contents

1. [Code Quality Tools](#code-quality-tools)
2. [TypeScript Guidelines](#typescript-guidelines)
3. [React & React Native Guidelines](#react--react-native-guidelines)
4. [Formatting Rules](#formatting-rules)
5. [File Structure & Naming](#file-structure--naming)
6. [Import Organization](#import-organization)
7. [Testing Standards](#testing-standards)
8. [Git Commit Guidelines](#git-commit-guidelines)
9. [Code Review Checklist](#code-review-checklist)

## Code Quality Tools

### ESLint

We use ESLint with TypeScript and React Native plugins to enforce code quality.

**Configuration**: `.eslintrc.js`

**Key Rules**:
- No `any` types allowed (`@typescript-eslint/no-explicit-any: error`)
- No unused variables (use `_` prefix for intentionally unused variables)
- No floating promises (all promises must be awaited or handled)
- No console.log in production code (use `console.warn` or `console.error` only)
- React Hooks rules enforced

**Running ESLint**:
```bash
# Check for errors
npm run lint

# Auto-fix issues
npm run lint:fix
```

### Prettier

We use Prettier for consistent code formatting across the team.

**Configuration**: `.prettierrc`

**Key Settings**:
- Single quotes for strings
- Semicolons required
- 100 character line width
- 2-space indentation
- Trailing commas in ES5 (objects, arrays)

**Running Prettier**:
```bash
# Format all files
npm run format

# Check formatting without modifying
npm run format:check
```

### TypeScript

Strict TypeScript configuration enforced.

**Running Type Check**:
```bash
npm run type-check
```

## TypeScript Guidelines

### Type Safety

**DO**: Use explicit types for function parameters and return values
```typescript
function calculateProgress(completed: number, total: number): number {
  return (completed / total) * 100;
}
```

**DON'T**: Use `any` type
```typescript
// BAD
function processData(data: any) {
  return data.value;
}

// GOOD
interface Data {
  value: string;
}

function processData(data: Data): string {
  return data.value;
}
```

### Null Safety

**DO**: Use optional chaining and nullish coalescing
```typescript
const userName = user?.profile?.name ?? 'Anonymous';
```

**DON'T**: Use non-null assertions unless absolutely necessary
```typescript
// AVOID
const name = user!.name;

// PREFER
const name = user?.name ?? 'Unknown';
```

### Type Inference

**DO**: Let TypeScript infer types when they're obvious
```typescript
const count = 5; // Type inferred as number
const items = ['apple', 'banana']; // Type inferred as string[]
```

**DON'T**: Over-annotate when types are clear
```typescript
// Unnecessary
const count: number = 5;
```

### Interfaces vs Types

**DO**: Use interfaces for object shapes that may be extended
```typescript
interface User {
  id: string;
  name: string;
}

interface AdminUser extends User {
  permissions: string[];
}
```

**DO**: Use types for unions, intersections, and complex types
```typescript
type Status = 'pending' | 'completed' | 'failed';
type Result = Success | Error;
```

## React & React Native Guidelines

### Component Structure

**Functional components only** - no class components

```typescript
import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';

interface Props {
  title: string;
  onPress?: () => void;
}

export const MyComponent: React.FC<Props> = ({ title, onPress }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Component logic
    setIsLoaded(true);
  }, []);

  return (
    <View>
      <Text>{title}</Text>
    </View>
  );
};
```

### Hooks Rules

**DO**: Follow hooks rules
- Call hooks at the top level (not in loops or conditions)
- Call hooks only in React functions

**DO**: Use custom hooks for shared logic
```typescript
// hooks/useAuth.ts
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Auth logic
  }, []);

  return { user, isAuthenticated: !!user };
};
```

**DO**: Add dependencies to useEffect correctly
```typescript
useEffect(() => {
  fetchData(userId);
}, [userId]); // Include all dependencies
```

### Component Naming

**DO**: Use PascalCase for components
```typescript
// Good
export const UserProfile = () => {};
export const WorkbookPhaseCard = () => {};

// Bad
export const userProfile = () => {};
export const workbook_phase_card = () => {};
```

### Props Destructuring

**DO**: Destructure props in function signature
```typescript
// Good
export const Button: React.FC<Props> = ({ title, onPress, disabled = false }) => {
  // ...
};

// Avoid
export const Button: React.FC<Props> = (props) => {
  const title = props.title;
  // ...
};
```

### State Management

**DO**: Use local state for component-specific data
```typescript
const [isOpen, setIsOpen] = useState(false);
```

**DO**: Use Zustand for global app state
```typescript
// stores/authStore.ts
import create from 'zustand';

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
```

**DO**: Use TanStack Query for server state
```typescript
import { useQuery } from '@tanstack/react-query';

export const useWorkbookProgress = (userId: string) => {
  return useQuery({
    queryKey: ['workbook', userId],
    queryFn: () => fetchWorkbookProgress(userId),
  });
};
```

### Styling with NativeWind

**DO**: Use NativeWind (Tailwind) classes for styling
```typescript
<View className="flex-1 bg-white p-4">
  <Text className="text-lg font-bold text-gray-900">Title</Text>
</View>
```

**AVOID**: Inline styles (except for dynamic values)
```typescript
// Avoid
<View style={{ padding: 16, backgroundColor: 'white' }}>

// Prefer
<View className="p-4 bg-white">

// OK for dynamic values
<View style={{ height: dynamicHeight }}>
```

## Formatting Rules

### Line Length

Maximum 100 characters per line. Break long lines:

```typescript
// Good
const result = calculateComplexValue(
  parameter1,
  parameter2,
  parameter3,
  parameter4
);

// Bad
const result = calculateComplexValue(parameter1, parameter2, parameter3, parameter4, parameter5);
```

### Indentation

- 2 spaces (not tabs)
- Consistent indentation enforced by Prettier

### Quotes

- Single quotes for strings: `'hello'`
- Double quotes for JSX attributes: `<View className="container">`

### Semicolons

Always use semicolons (enforced by Prettier).

### Trailing Commas

Use trailing commas in multi-line arrays/objects:

```typescript
const config = {
  api: 'https://api.example.com',
  timeout: 5000,
  retries: 3, // Trailing comma
};
```

## File Structure & Naming

### File Naming Conventions

- **Components**: PascalCase - `UserProfile.tsx`
- **Hooks**: camelCase with `use` prefix - `useAuth.ts`
- **Utils**: camelCase - `formatDate.ts`
- **Types**: PascalCase - `User.types.ts`
- **Constants**: camelCase - `apiEndpoints.ts`
- **Tests**: Same as file + `.test` - `UserProfile.test.tsx`

### Directory Structure

```
mobile/
├── src/
│   ├── components/
│   │   ├── common/          # Shared UI components
│   │   ├── workbook/        # Workbook-specific components
│   │   └── meditation/      # Meditation-specific components
│   ├── screens/             # Screen components
│   ├── navigation/          # Navigation configuration
│   ├── hooks/               # Custom hooks
│   ├── stores/              # Zustand stores
│   ├── services/            # API clients, external services
│   ├── utils/               # Helper functions
│   ├── types/               # TypeScript types/interfaces
│   ├── constants/           # App constants
│   └── assets/              # Images, fonts, etc.
```

## Import Organization

Order imports consistently:

```typescript
// 1. React & React Native
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

// 2. Third-party libraries
import { useQuery } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';

// 3. Shared package imports
import { User, WorkbookPhase } from '@manifest/shared';

// 4. Local imports - absolute paths
import { Button } from '@/components/common/Button';
import { useAuth } from '@/hooks/useAuth';
import { formatDate } from '@/utils/formatDate';

// 5. Relative imports (same directory)
import { PhaseCard } from './PhaseCard';
import styles from './styles';

// 6. Types (if not inline)
import type { Props } from './types';
```

VS Code will auto-organize imports on save.

## Testing Standards

### Test File Location

Place test files next to the code they test:

```
components/
├── Button/
│   ├── Button.tsx
│   ├── Button.test.tsx
│   └── index.ts
```

### Test Structure

```typescript
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from './Button';

describe('Button', () => {
  it('renders correctly with title', () => {
    const { getByText } = render(<Button title="Click Me" />);
    expect(getByText('Click Me')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(<Button title="Click" onPress={onPress} />);

    fireEvent.press(getByText('Click'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('disables interaction when disabled prop is true', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <Button title="Click" onPress={onPress} disabled />
    );

    fireEvent.press(getByText('Click'));

    expect(onPress).not.toHaveBeenCalled();
  });
});
```

### Coverage Requirements

- **Shared package**: 60%+ coverage required
- **Mobile app**: Critical paths tested
- Run tests before pushing: `npm test`

## Git Commit Guidelines

### Commit Message Format

```
type: description

Optional longer description

Co-Authored-By: Name <email>
```

### Commit Types

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation only
- `style:` - Formatting, missing semicolons, etc.
- `refactor:` - Code change that neither fixes a bug nor adds a feature
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks, dependency updates
- `perf:` - Performance improvements

### Examples

```bash
feat: add voice journal transcription with Whisper

Implements on-device Whisper transcription for journal entries.
Audio is transcribed locally and only text is synced to Supabase.

Co-Authored-By: Claude <noreply@anthropic.com>
```

```bash
fix: resolve meditation player crash on iOS 14

Fixed null reference error in audio player initialization
when accessing unavailable audio session on older iOS versions.
```

## Code Review Checklist

### Before Submitting PR

- [ ] All tests pass (`npm test`)
- [ ] No ESLint errors (`npm run lint`)
- [ ] Code is formatted (`npm run format`)
- [ ] TypeScript compiles (`npm run type-check`)
- [ ] No console.log statements left in code
- [ ] Sensitive data (API keys, passwords) not committed
- [ ] New features have tests
- [ ] Documentation updated if needed

### Reviewer Checklist

- [ ] Code follows project conventions
- [ ] No obvious bugs or security issues
- [ ] Logic is clear and maintainable
- [ ] Edge cases are handled
- [ ] Error handling is appropriate
- [ ] Performance considerations addressed
- [ ] No unnecessary complexity
- [ ] Tests cover new functionality

## Performance Best Practices

### React Native Performance

**DO**: Use `FlatList` for long lists
```typescript
<FlatList
  data={items}
  renderItem={({ item }) => <ItemCard item={item} />}
  keyExtractor={(item) => item.id}
  windowSize={10}
/>
```

**DO**: Memoize expensive computations
```typescript
const expensiveValue = useMemo(() => {
  return calculateExpensiveValue(data);
}, [data]);
```

**DO**: Memoize callbacks passed to children
```typescript
const handlePress = useCallback(() => {
  onItemPress(item.id);
}, [item.id, onItemPress]);
```

**DO**: Use `React.memo` for components that render often
```typescript
export const ListItem = React.memo<Props>(({ item, onPress }) => {
  return <TouchableOpacity onPress={onPress}>...</TouchableOpacity>;
});
```

### Avoid Re-renders

```typescript
// Bad - creates new object on every render
<Component style={{ padding: 10 }} />

// Good - use className or defined style object
<Component className="p-4" />
```

## Security Best Practices

**DO**: Validate user input with Zod schemas
```typescript
import { z } from 'zod';

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const result = userSchema.safeParse(formData);
```

**DO**: Use environment variables for secrets
```typescript
const API_KEY = process.env.OPENAI_API_KEY;
```

**DON'T**: Hardcode sensitive data
```typescript
// NEVER DO THIS
const apiKey = 'sk-1234567890abcdef';
```

**DO**: Sanitize user input before display
```typescript
import { sanitize } from '@/utils/sanitize';

const cleanText = sanitize(userInput);
```

## Accessibility

**DO**: Add accessibility labels
```typescript
<TouchableOpacity
  accessibilityLabel="Start meditation"
  accessibilityRole="button"
>
  <Text>Begin</Text>
</TouchableOpacity>
```

**DO**: Ensure sufficient color contrast
**DO**: Support dynamic text sizing
**DO**: Test with VoiceOver (iOS) / TalkBack (Android)

## Documentation

**DO**: Document complex logic with comments
```typescript
/**
 * Calculates user progress through workbook phases.
 *
 * @param completedExercises - Number of exercises completed
 * @param totalExercises - Total exercises in phase
 * @returns Progress percentage (0-100)
 */
export const calculateProgress = (
  completedExercises: number,
  totalExercises: number
): number => {
  if (totalExercises === 0) return 0;
  return Math.round((completedExercises / totalExercises) * 100);
};
```

**DO**: Keep comments up-to-date with code changes
**DON'T**: Comment obvious code

## Resources

- [TypeScript Best Practices](https://typescript-eslint.io/docs/)
- [React Native Performance](https://reactnative.dev/docs/performance)
- [TanStack Query Guide](https://tanstack.com/query/latest)
- [Zustand Documentation](https://github.com/pmndrs/zustand)

---

**Last Updated**: 2025-11-17
**Maintained By**: Frontend Specialist Team

Questions? Contact the development team or open a discussion in #dev-standards.
