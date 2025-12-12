/**
 * Secure Logger Utility
 *
 * Provides debug logging that:
 * - Respects __DEV__ flag (only logs in development)
 * - Sanitizes sensitive fields before logging
 * - Provides multiple log levels (debug, info, warn, error)
 * - Can be easily disabled in production via Babel transform
 *
 * Usage:
 * ```tsx
 * import { logger } from './utils/logger';
 *
 * logger.debug('User signed in', { userId: user.id });
 * logger.error('Auth failed', error);
 * ```
 */

/**
 * Sensitive field names to sanitize
 * These fields will be replaced with '[REDACTED]' in logs
 */
const SENSITIVE_FIELDS = [
  'password',
  'token',
  'access_token',
  'refresh_token',
  'accessToken',
  'refreshToken',
  'api_key',
  'apiKey',
  'secret',
  'authorization',
  'cookie',
  'session',
  'identityToken',
  'credential',
  'jwt',
  'bearer',
];

/**
 * Email regex pattern for sanitization
 */
const EMAIL_REGEX = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;

/**
 * Sanitize a single value
 * Redacts sensitive information while preserving data structure
 */
function sanitizeValue(value: any, key?: string): any {
  // Check if key is sensitive
  if (key && SENSITIVE_FIELDS.some((field) => key.toLowerCase().includes(field.toLowerCase()))) {
    return '[REDACTED]';
  }

  // Sanitize based on value type
  if (typeof value === 'string') {
    // Redact email addresses (show only first 2 chars + domain)
    return value.replace(EMAIL_REGEX, (email) => {
      const [localPart, domain] = email.split('@');
      return `${localPart.substring(0, 2)}***@${domain}`;
    });
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeValue(item));
  }

  if (value && typeof value === 'object') {
    return sanitizeObject(value);
  }

  return value;
}

/**
 * Sanitize an object recursively
 * Removes sensitive fields and redacts emails
 */
function sanitizeObject(obj: Record<string, any>): Record<string, any> {
  const sanitized: Record<string, any> = {};

  for (const [key, value] of Object.entries(obj)) {
    sanitized[key] = sanitizeValue(value, key);
  }

  return sanitized;
}

/**
 * Format log arguments
 * Sanitizes sensitive data and formats for output
 */
function formatArgs(...args: any[]): any[] {
  return args.map((arg) => {
    if (arg && typeof arg === 'object' && !(arg instanceof Error)) {
      return sanitizeObject(arg);
    }
    return arg;
  });
}

/**
 * Logger interface
 */
interface Logger {
  debug: (message: string, ...args: any[]) => void;
  info: (message: string, ...args: any[]) => void;
  warn: (message: string, ...args: any[]) => void;
  error: (message: string, ...args: any[]) => void;
}

/**
 * Development Logger
 * Active only when __DEV__ is true
 */
const devLogger: Logger = {
  debug: (message: string, ...args: any[]) => {
    if (__DEV__) {
      console.log(`[DEBUG] ${message}`, ...formatArgs(...args));
    }
  },

  info: (message: string, ...args: any[]) => {
    if (__DEV__) {
      console.info(`[INFO] ${message}`, ...formatArgs(...args));
    }
  },

  warn: (message: string, ...args: any[]) => {
    if (__DEV__) {
      console.warn(`[WARN] ${message}`, ...formatArgs(...args));
    }
  },

  error: (message: string, ...args: any[]) => {
    if (__DEV__) {
      console.error(`[ERROR] ${message}`, ...formatArgs(...args));
    }
  },
};

/**
 * Production Logger (No-op)
 * All methods are no-ops in production
 */
const prodLogger: Logger = {
  debug: () => {},
  info: () => {},
  warn: () => {},
  error: () => {},
};

/**
 * Exported Logger
 * Uses devLogger in development, prodLogger in production
 */
export const logger: Logger = __DEV__ ? devLogger : prodLogger;

/**
 * Explicitly expose sanitization utilities for testing
 */
export const _internals = {
  sanitizeValue,
  sanitizeObject,
  formatArgs,
};
