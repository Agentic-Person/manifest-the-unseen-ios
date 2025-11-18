# Package.json Scripts Reference

This document provides the recommended npm scripts to add to your `package.json` when setting up the mobile app.

## Complete Scripts Section

Add these to `mobile/package.json`:

```json
{
  "name": "manifest-the-unseen-mobile",
  "version": "1.0.0",
  "scripts": {
    // Development
    "start": "react-native start",
    "ios": "react-native run-ios",
    "ios:device": "react-native run-ios --device",
    "android": "react-native run-android",

    // Build
    "build:ios": "cd ios && xcodebuild -workspace ManifestTheUnseen.xcworkspace -scheme ManifestTheUnseen -configuration Release",
    "build:android": "cd android && ./gradlew assembleRelease",

    // Code Quality
    "lint": "eslint . --ext .ts,.tsx,.js,.jsx --max-warnings=0",
    "lint:fix": "eslint . --ext .ts,.tsx,.js,.jsx --fix",
    "format": "prettier --write \"**/*.{ts,tsx,js,jsx,json,md,yml,yaml}\"",
    "format:check": "prettier --check \"**/*.{ts,tsx,js,jsx,json,md,yml,yaml}\"",
    "type-check": "tsc --noEmit",

    // Testing
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --maxWorkers=2",
    "test:e2e": "detox test",
    "test:e2e:build": "detox build",

    // Git Hooks
    "prepare": "cd .. && husky install",

    // Utilities
    "clean": "react-native-clean-project",
    "pods": "cd ios && pod install",
    "postinstall": "cd ios && pod install"
  }
}
```

## Root Package.json (Monorepo)

For the root `package.json` in a monorepo setup:

```json
{
  "name": "manifest-the-unseen",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "mobile",
    "packages/*"
  ],
  "scripts": {
    // Workspace management
    "clean": "rm -rf node_modules && rm -rf mobile/node_modules && rm -rf packages/*/node_modules",
    "install:all": "npm install && cd mobile && npm install && cd ../packages/shared && npm install",

    // Development
    "dev:mobile": "cd mobile && npm start",
    "dev:shared": "cd packages/shared && npm run dev",

    // Code Quality (run across all packages)
    "lint": "npm run lint --workspaces",
    "lint:fix": "npm run lint:fix --workspaces",
    "format": "prettier --write \"**/*.{ts,tsx,js,jsx,json,md,yml,yaml}\"",
    "type-check": "npm run type-check --workspaces",

    // Testing
    "test": "npm run test --workspaces",
    "test:coverage": "npm run test:coverage --workspaces",

    // Git Hooks
    "prepare": "husky install"
  },
  "devDependencies": {
    "husky": "^8.0.0",
    "lint-staged": "^15.0.0",
    "prettier": "^3.0.0"
  }
}
```

## Shared Package Scripts

For `packages/shared/package.json`:

```json
{
  "name": "@manifest/shared",
  "version": "1.0.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    // Development
    "dev": "tsc --watch",
    "build": "tsc",
    "clean": "rm -rf dist",

    // Code Quality
    "lint": "eslint . --ext .ts --max-warnings=0",
    "lint:fix": "eslint . --ext .ts --fix",
    "type-check": "tsc --noEmit",

    // Testing
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",

    // Prepare for publish
    "prepublishOnly": "npm run build"
  }
}
```

## Script Descriptions

### Development Scripts

- `start` - Start Metro bundler for React Native
- `ios` - Build and run on iOS simulator
- `ios:device` - Build and run on physical iOS device
- `android` - Build and run on Android emulator/device
- `dev:mobile` - Start mobile development server
- `dev:shared` - Watch mode for shared package

### Build Scripts

- `build:ios` - Create iOS release build
- `build:android` - Create Android release build
- `build` - Compile TypeScript (for shared package)

### Code Quality Scripts

- `lint` - Check for ESLint errors (fails on warnings)
- `lint:fix` - Auto-fix ESLint errors
- `format` - Format all files with Prettier
- `format:check` - Check formatting without modifying files
- `type-check` - Run TypeScript compiler without emitting files

### Testing Scripts

- `test` - Run all tests once
- `test:watch` - Run tests in watch mode (auto-rerun on changes)
- `test:coverage` - Run tests with coverage report
- `test:ci` - Run tests optimized for CI/CD (fewer workers, coverage)
- `test:e2e` - Run end-to-end tests with Detox
- `test:e2e:build` - Build E2E test app

### Git Hooks Scripts

- `prepare` - Automatically run after `npm install` to set up Husky

### Utility Scripts

- `clean` - Remove node_modules and build artifacts
- `pods` - Install iOS CocoaPods dependencies
- `postinstall` - Automatically run after `npm install`

## Usage Examples

### Development Workflow

```bash
# Start development
npm start

# In another terminal, run iOS
npm run ios

# Or Android
npm run android
```

### Code Quality Checks

```bash
# Check everything before committing
npm run lint
npm run format:check
npm run type-check
npm test
```

### Fix Issues Automatically

```bash
# Auto-fix linting and formatting
npm run lint:fix
npm run format
```

### CI/CD Pipeline

```bash
# Run all quality checks (typical CI pipeline)
npm run lint
npm run type-check
npm run test:ci
npm run build:ios
```

## Integration with Git Hooks

When Husky is set up, these scripts run automatically:

**Pre-commit** (via lint-staged):
- `eslint --fix` on staged `.ts/.tsx` files
- `prettier --write` on staged files
- Files are automatically re-staged

**Pre-push** (optional):
- `npm run test:ci`
- `npm run type-check`

## CI/CD Integration

### GitHub Actions Example

```yaml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test:ci
```

## Troubleshooting

### iOS Pod Install Fails

```bash
# Clean and reinstall pods
cd ios
rm -rf Pods Podfile.lock
pod install --repo-update
```

### Metro Bundler Issues

```bash
# Reset Metro cache
npm start -- --reset-cache
```

### Node Modules Issues

```bash
# Clean reinstall
npm run clean
npm install
```

### Type Check Errors After Dependency Update

```bash
# Regenerate types
cd supabase
npx supabase gen types typescript --local > ../mobile/src/types/database.types.ts
```

## Performance Tips

### Faster iOS Builds

Add to `~/.zshrc` or `~/.bashrc`:

```bash
export SKIP_BUNDLING=1  # Skip JS bundling during native build
export RCT_NO_LAUNCH_PACKAGER=1  # Don't auto-start Metro
```

### Faster Tests

```bash
# Run only changed tests
npm test -- --onlyChanged

# Run specific test file
npm test -- Button.test.tsx
```

### Parallel Linting

```bash
# Lint only changed files
npm run lint -- --cache

# Use multiple CPU cores
npm run lint -- --cache --max-warnings=0
```

## Additional Resources

- [React Native CLI Documentation](https://reactnative.dev/docs/environment-setup)
- [npm Scripts Documentation](https://docs.npmjs.com/cli/v8/using-npm/scripts)
- [Husky Documentation](https://typicode.github.io/husky/)

---

**Last Updated**: 2025-11-17
**Note**: Add these scripts when initializing the React Native project in TASK-003.
