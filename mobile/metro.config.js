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

// Enable web support with Metro
config.resolver.sourceExts = [...config.resolver.sourceExts, 'mjs', 'cjs'];

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
