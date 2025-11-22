/**
 * Metro configuration for Expo
 *
 * Metro is the JavaScript bundler used by React Native.
 * This configuration extends Expo's default settings.
 *
 * @see https://docs.expo.dev/guides/customizing-metro/
 */
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

module.exports = config;
