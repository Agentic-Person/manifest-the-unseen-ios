/**
 * Metro configuration for Expo
 *
 * Metro is the JavaScript bundler used by React Native.
 * This configuration extends Expo's default settings and adds web support.
 *
 * @see https://docs.expo.dev/guides/customizing-metro/
 */
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Force Metro to use browser/CommonJS versions instead of ESM to avoid import.meta errors
// This fixes the ws package (used by Supabase) which has ESM wrapper with import.meta
config.resolver.unstable_conditionNames = ['browser', 'require', 'react-native'];

// Enable web support with Metro
config.resolver.sourceExts = [...config.resolver.sourceExts, 'cjs'];

// Handle import.meta for web builds
config.transformer = {
  ...config.transformer,
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: true,
    },
  }),
  minifierConfig: {
    ...config.transformer?.minifierConfig,
    keep_classnames: true,
    keep_fnames: true,
    mangle: {
      keep_classnames: true,
      keep_fnames: true,
    },
  },
};

module.exports = config;
