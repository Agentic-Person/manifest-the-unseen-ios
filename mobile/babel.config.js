/**
 * Babel configuration for Expo
 *
 * This file configures Babel to properly transform the codebase
 * for both native (iOS/Android) and web platforms.
 */
module.exports = function(api) {
  api.cache(true);
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
  };
};
