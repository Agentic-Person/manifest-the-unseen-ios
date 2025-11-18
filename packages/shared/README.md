# @manifest/shared

Shared TypeScript code for Manifest the Unseen application.

## Overview

This package contains shared code used across the mobile app (and future web companion), including:

- **Models**: TypeScript interfaces for core data structures
- **Validation**: Zod schemas for runtime validation
- **Constants**: Shared configuration and constants
- **Utilities**: Helper functions for common tasks
- **API**: Supabase client and API service layer (to be implemented)
- **Hooks**: Custom React hooks for data fetching (to be implemented)

## Installation

This package is used internally within the monorepo workspace.

```bash
# From mobile app
npm install @manifest/shared
```

## Usage

### Importing Models

```typescript
import { User, WorkbookProgress, JournalEntry } from '@manifest/shared';

const user: User = {
  id: '123',
  email: 'user@example.com',
  displayName: 'John Doe',
  avatarUrl: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
```

### Using Validation Schemas

```typescript
import { signUpSchema, createJournalEntrySchema } from '@manifest/shared';

// Validate user input
const result = signUpSchema.safeParse({
  email: 'user@example.com',
  password: 'securePassword123',
});

if (result.success) {
  console.log('Valid data:', result.data);
} else {
  console.error('Validation errors:', result.error);
}

// Use with react-hook-form
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

const { control, handleSubmit } = useForm({
  resolver: zodResolver(signUpSchema),
});
```

### Using Constants

```typescript
import { TIER_LIMITS, WORKBOOK_PHASES, APP_CONFIG } from '@manifest/shared';

// Check tier limits
const userTier = 'awakening';
const limits = TIER_LIMITS[userTier];
console.log(`User can access ${limits.phases} phases`);

// Get phase metadata
const phase1 = WORKBOOK_PHASES[0];
console.log(`Phase 1: ${phase1.title} (${phase1.estimatedMinutes} minutes)`);

// Use app config
console.log(`Auto-save interval: ${APP_CONFIG.AUTO_SAVE_INTERVAL_MS}ms`);
```

### Using Utilities

```typescript
import { formatDate, formatRelativeTime, truncate, debounce } from '@manifest/shared';

// Format dates
const date = new Date();
console.log(formatDate(date)); // "November 17, 2025"
console.log(formatRelativeTime(date)); // "just now"

// Truncate text
const longText = "This is a very long text...";
console.log(truncate(longText, 20)); // "This is a very lo..."

// Debounce function
const handleSearch = debounce((query: string) => {
  console.log('Searching for:', query);
}, 300);
```

## Development

### Build

```bash
npm run build
```

This compiles TypeScript to JavaScript in the `dist/` folder.

### Development Mode (Watch)

```bash
npm run dev
```

Watches for changes and recompiles automatically.

### Testing

```bash
npm test           # Run tests once
npm run test:watch # Watch mode
npm run test:coverage # With coverage report
```

### Linting

```bash
npm run lint       # Check for issues
npm run lint:fix   # Auto-fix issues
```

### Type Checking

```bash
npm run type-check
```

## Structure

```
src/
├── models/       # TypeScript interfaces
├── validation/   # Zod schemas
├── constants/    # Shared constants
├── utils/        # Helper functions
├── api/          # API clients (to be implemented)
├── hooks/        # React hooks (to be implemented)
└── index.ts      # Main entry point
```

## Code Quality

This package enforces strict TypeScript rules:

- `strict: true`
- No `any` types allowed
- All functions must have return types
- Unused variables/parameters are errors
- Target coverage: 60%+

## Contributing

When adding new code to this package:

1. Add TypeScript interfaces to `models/`
2. Add validation schemas to `validation/`
3. Export from appropriate `index.ts` files
4. Write tests for new utilities
5. Run `npm run build` to verify compilation
6. Run `npm test` to ensure tests pass

## License

UNLICENSED - Internal use only
