const path = require('path');
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration for Manifest the Unseen
 * Configured for monorepo structure with shared packages
 *
 * @type {import('metro-config').MetroConfig}
 */

const defaultConfig = getDefaultConfig(__dirname);

const config = {
  // Watch the entire monorepo
  watchFolders: [
    path.resolve(__dirname, '..'), // Parent directory (monorepo root)
  ],

  resolver: {
    // Look for node_modules in both mobile and monorepo root
    nodeModulesPaths: [
      path.resolve(__dirname, 'node_modules'),
      path.resolve(__dirname, '../node_modules'),
    ],

    // Resolve @manifest/shared package
    extraNodeModules: {
      '@manifest/shared': path.resolve(__dirname, '../packages/shared/src'),
    },

    // Asset extensions
    assetExts: [
      ...defaultConfig.resolver.assetExts,
      'db',
      'mp3',
      'm4a',
      'aac',
      'wav',
    ],

    // Source extensions
    sourceExts: [
      ...defaultConfig.resolver.sourceExts,
      'ts',
      'tsx',
    ],
  },

  transformer: {
    // Enable experimental import support
    unstable_allowRequireContext: true,

    // Babel transformer config
    babelTransformerPath: require.resolve('react-native/Libraries/ReactNative/BabelTransformerProxy.js'),
  },
};

module.exports = mergeConfig(defaultConfig, config);
