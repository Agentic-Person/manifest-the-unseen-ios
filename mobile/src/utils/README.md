# Utilities

This directory contains shared utility functions and tools used throughout the mobile app.

## Logger (`logger.ts`)

Secure logging utility that automatically sanitizes sensitive data and respects development/production modes.

### Features

- **Development Only**: Logs only appear when `__DEV__` is true
- **Automatic Sanitization**: Removes sensitive fields like passwords, tokens, API keys, emails
- **Multiple Log Levels**: `debug`, `info`, `warn`, `error`
- **Production Safe**: All console.* calls are stripped from production builds via Babel

### Usage

```tsx
import { logger } from '../utils/logger';

// Basic logging
logger.debug('User action completed');
logger.info('Feature enabled');
logger.warn('Unusual behavior detected');
logger.error('Operation failed', error);

// Logging with context (automatically sanitized)
logger.debug('User signed in', {
  userId: user.id,
  email: user.email,  // Will be redacted: us***@example.com
  token: user.token   // Will show as: [REDACTED]
});

// Complex objects are sanitized recursively
logger.debug('API response', {
  data: {
    user: {
      email: 'test@example.com',  // Redacted
      password: 'secret123'        // [REDACTED]
    },
    access_token: 'abc123'         // [REDACTED]
  }
});
```

### Sensitive Fields

The following field names are automatically redacted when logging:

- `password`
- `token`, `access_token`, `refresh_token`, `accessToken`, `refreshToken`
- `api_key`, `apiKey`
- `secret`
- `authorization`
- `cookie`
- `session`
- `identityToken`
- `credential`
- `jwt`
- `bearer`

Email addresses are partially masked (e.g., `te***@example.com`).

### Production Behavior

In production builds:
1. The logger utility becomes a no-op (all methods do nothing)
2. Babel strips ALL `console.*` calls from the bundle
3. This provides:
   - Better performance (fewer function calls)
   - Smaller bundle size
   - Enhanced security (no accidental logging)

### Migration from console.log

Replace existing console logs:

```tsx
// Before
console.log('[Auth] User signed in:', user.email);
console.error('Failed to fetch:', error);

// After
logger.debug('User signed in', { email: user.email });
logger.error('Failed to fetch', error);
```

### Testing

The logger includes internal utilities for testing sanitization:

```tsx
import { _internals } from '../utils/logger';

// Test sanitization
const sanitized = _internals.sanitizeObject({
  email: 'test@example.com',
  password: 'secret123'
});

// Result:
// {
//   email: 'te***@example.com',
//   password: '[REDACTED]'
// }
```

## Adding New Utilities

When adding new utilities to this directory:

1. Create a new `.ts` file with clear naming
2. Add comprehensive JSDoc comments
3. Export utilities as named exports
4. Update this README with usage examples
5. Consider adding to a barrel export file if needed
