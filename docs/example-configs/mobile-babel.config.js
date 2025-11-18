module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    // NativeWind - Tailwind CSS for React Native
    'nativewind/babel',

    // Module resolver for path aliases
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@': './src',
          '@manifest/shared': '../packages/shared/src',
        },
      },
    ],

    // React Native Reanimated (if used in future)
    // 'react-native-reanimated/plugin', // Must be last
  ],
};
