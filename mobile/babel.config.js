/**
 * Babel configuration for Expo
 *
 * This file configures Babel to properly transform the codebase
 * for both native (iOS/Android) and web platforms.
 *
 * Production builds automatically strip all console.* calls for:
 * - Better performance (fewer function calls)
 * - Smaller bundle size
 * - Enhanced security (no accidental logging in production)
 */
module.exports = function(api) {
  api.cache(true);

  const isProduction = process.env.NODE_ENV === 'production';

  return {
    presets: [
      [
        'babel-preset-expo',
        {
          // Enable experimental import.meta transformation as fallback
          unstable_transformImportMeta: true,
        },
      ],
    ],
    plugins: [
      // Strip all console.* calls in production builds
      // This removes console.log, console.warn, console.error, etc.
      // Development logging is still available via our logger utility which respects __DEV__
      ...(isProduction ? ['transform-remove-console'] : []),
    ],
  };
};
