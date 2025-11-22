/**
 * Babel configuration for Expo
 *
 * This file configures Babel to properly transform the codebase
 * for both native (iOS/Android) and web platforms.
 */
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Handle import.meta syntax for web builds
      '@babel/plugin-syntax-import-meta',
    ],
  };
};
