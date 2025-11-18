# React Native Setup Guide - Manifest the Unseen

**Document Version:** 1.0
**Last Updated:** November 17, 2025
**Target Platform:** iOS (primary), Android (future)
**Framework:** React Native 0.73+ with TypeScript

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Initialization](#project-initialization)
3. [Monorepo Structure Setup](#monorepo-structure-setup)
4. [NativeWind Configuration](#nativewind-configuration)
5. [TypeScript Configuration](#typescript-configuration)
6. [Folder Structure](#folder-structure)
7. [Development Workflow](#development-workflow)
8. [Common Issues & Solutions](#common-issues--solutions)
9. [Next Steps](#next-steps)

---

## Prerequisites

Before starting, ensure you have the following installed:

### Required Software

#### 1. Node.js & npm
```bash
# Check versions
node --version  # Should be v18+ (recommended: v20.x)
npm --version   # Should be v9+

# Install via nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
nvm use 20
```

#### 2. Watchman (for React Native file watching)
```bash
# macOS
brew install watchman

# Verify installation
watchman --version
```

#### 3. Xcode (for iOS development)
- Download from Mac App Store (latest version, 15.0+)
- Install Xcode Command Line Tools:
```bash
xcode-select --install

# Verify installation
xcode-select -p
# Should output: /Applications/Xcode.app/Contents/Developer
```

- Open Xcode at least once and accept license agreements
- Install iOS Simulator:
  - Open Xcode → Preferences → Platforms
  - Download iOS 15.0+ simulator

#### 4. CocoaPods (for iOS dependency management)
```bash
# Install CocoaPods
sudo gem install cocoapods

# Verify installation
pod --version  # Should be 1.12+
```

#### 5. Package Manager (choose one)

**Option A: Yarn (recommended for monorepos)**
```bash
npm install -g yarn
yarn --version  # Should be 1.22+
```

**Option B: pnpm (faster alternative)**
```bash
npm install -g pnpm
pnpm --version  # Should be 8.0+
```

### Environment Verification Checklist

Run this verification script to ensure everything is ready:

```bash
# Save as verify-setup.sh and run: bash verify-setup.sh

echo "Checking React Native Prerequisites..."
echo ""

# Node.js
if command -v node &> /dev/null; then
    echo "✅ Node.js: $(node --version)"
else
    echo "❌ Node.js not found"
fi

# npm
if command -v npm &> /dev/null; then
    echo "✅ npm: $(npm --version)"
else
    echo "❌ npm not found"
fi

# Watchman
if command -v watchman &> /dev/null; then
    echo "✅ Watchman: $(watchman --version)"
else
    echo "❌ Watchman not found"
fi

# Xcode
if command -v xcodebuild &> /dev/null; then
    echo "✅ Xcode: $(xcodebuild -version | head -n1)"
else
    echo "❌ Xcode not found"
fi

# CocoaPods
if command -v pod &> /dev/null; then
    echo "✅ CocoaPods: $(pod --version)"
else
    echo "❌ CocoaPods not found"
fi

# Yarn
if command -v yarn &> /dev/null; then
    echo "✅ Yarn: $(yarn --version)"
else
    echo "⚠️  Yarn not found (optional)"
fi

echo ""
echo "Verification complete!"
```

---

## Project Initialization

### Step 1: Create React Native Project

```bash
# Navigate to your projects directory
cd ~/projects/mobileApps

# Initialize React Native project with TypeScript template
npx react-native@latest init ManifestTheUnseen --template react-native-template-typescript

# This creates a new directory: ManifestTheUnseen/
cd ManifestTheUnseen
```

### Step 2: Verify Initial Setup

```bash
# Install dependencies (if not already done)
npm install

# Test iOS build (this will take a few minutes the first time)
npm run ios

# Expected output:
# - Metro bundler starts
# - iOS simulator opens
# - App displays "Welcome to React Native" screen
```

**Troubleshooting first build:**
- If build fails, try cleaning: `cd ios && pod install && cd ..`
- If simulator doesn't open: `open -a Simulator` then run `npm run ios` again
- If Metro bundler issues: `npm start -- --reset-cache`

### Step 3: Test Hot Reload

1. Open `App.tsx` in your editor
2. Change some text
3. Save the file
4. App should reload automatically in simulator (Fast Refresh)

---

## Monorepo Structure Setup

### Step 1: Create Monorepo Root Structure

```bash
# Navigate to parent directory
cd ..

# Create monorepo structure
mkdir -p manifest-the-unseen/{packages/shared/src,supabase}

# Move React Native project to mobile/ subdirectory
mv ManifestTheUnseen manifest-the-unseen/mobile

# Navigate to monorepo root
cd manifest-the-unseen
```

Your structure should now look like:
```
manifest-the-unseen/
├── mobile/              # Moved React Native project
├── packages/
│   └── shared/
│       └── src/
└── supabase/
```

### Step 2: Create Root package.json (Workspace Configuration)

Create `package.json` in the monorepo root:

```json
{
  "name": "manifest-the-unseen",
  "version": "1.0.0",
  "private": true,
  "description": "Manifest the Unseen - Digital Manifestation Workbook",
  "workspaces": [
    "mobile",
    "packages/*"
  ],
  "scripts": {
    "mobile": "cd mobile && npm start",
    "mobile:ios": "cd mobile && npm run ios",
    "mobile:android": "cd mobile && npm run android",
    "shared:build": "cd packages/shared && npm run build",
    "shared:dev": "cd packages/shared && npm run dev",
    "shared:test": "cd packages/shared && npm test",
    "lint": "npm run lint --workspaces",
    "type-check": "npm run type-check --workspaces",
    "clean": "rm -rf node_modules mobile/node_modules packages/*/node_modules",
    "clean:ios": "cd mobile/ios && pod deintegrate && rm -rf Pods Podfile.lock && pod install",
    "install-all": "npm install && cd mobile/ios && pod install"
  },
  "devDependencies": {
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "eslint": "^8.50.0",
    "prettier": "^3.0.0",
    "typescript": "^5.2.0"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  }
}
```

### Step 3: Create Shared Package Structure

Create `packages/shared/package.json`:

```json
{
  "name": "@manifest/shared",
  "version": "1.0.0",
  "description": "Shared TypeScript code for Manifest the Unseen",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "test": "jest",
    "test:watch": "jest --watch",
    "lint": "eslint src --ext .ts,.tsx",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "zod": "^3.22.0",
    "@supabase/supabase-js": "^2.38.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.2.0",
    "jest": "^29.7.0",
    "@types/jest": "^29.5.0",
    "ts-jest": "^29.1.0"
  },
  "peerDependencies": {
    "react": ">=18.0.0",
    "react-native": ">=0.72.0"
  }
}
```

Create `packages/shared/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "declaration": true,
    "declarationMap": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts", "**/*.spec.ts"]
}
```

Create initial shared code structure:

```bash
mkdir -p packages/shared/src/{models,api,hooks,utils,validation}

# Create index file
cat > packages/shared/src/index.ts << 'EOF'
// Shared package entry point
export * from './models';
export * from './api';
export * from './hooks';
export * from './utils';
export * from './validation';
EOF

# Create placeholder files
touch packages/shared/src/models/index.ts
touch packages/shared/src/api/index.ts
touch packages/shared/src/hooks/index.ts
touch packages/shared/src/utils/index.ts
touch packages/shared/src/validation/index.ts
```

### Step 4: Link Shared Package to Mobile App

Update `mobile/package.json` to include shared package:

```json
{
  "dependencies": {
    "@manifest/shared": "*",
    // ... other dependencies
  }
}
```

Update `mobile/tsconfig.json` to add path alias:

```json
{
  "extends": "@tsconfig/react-native/tsconfig.json",
  "compilerOptions": {
    "paths": {
      "@manifest/shared": ["../packages/shared/src"],
      "@manifest/shared/*": ["../packages/shared/src/*"]
    }
  }
}
```

Update `mobile/metro.config.js` to resolve monorepo packages:

```javascript
const path = require('path');
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration for monorepo
 * https://facebook.github.io/metro/docs/configuration
 */

const defaultConfig = getDefaultConfig(__dirname);

const config = {
  watchFolders: [
    path.resolve(__dirname, '..'), // Watch parent directory (monorepo root)
  ],
  resolver: {
    nodeModulesPaths: [
      path.resolve(__dirname, 'node_modules'),
      path.resolve(__dirname, '../node_modules'),
    ],
    extraNodeModules: {
      '@manifest/shared': path.resolve(__dirname, '../packages/shared/src'),
    },
  },
};

module.exports = mergeConfig(defaultConfig, config);
```

### Step 5: Install Dependencies

```bash
# From monorepo root
npm install

# Install shared package dependencies
cd packages/shared
npm install
cd ../..

# Install mobile dependencies and pods
cd mobile
npm install
cd ios
pod install
cd ../..
```

### Step 6: Verify Monorepo Setup

```bash
# From monorepo root
npm run shared:build    # Should build TypeScript successfully
npm run mobile:ios      # Should run iOS app
```

---

## NativeWind Configuration

NativeWind brings Tailwind CSS utility classes to React Native.

### Step 1: Install NativeWind Dependencies

```bash
cd mobile

npm install nativewind
npm install --save-dev tailwindcss
```

### Step 2: Initialize Tailwind Configuration

```bash
npx tailwindcss init
```

This creates `tailwind.config.js`. Replace its content with:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand colors
        primary: {
          DEFAULT: '#9333EA',  // Deep purple
          50: '#FAF5FF',
          100: '#F3E8FF',
          200: '#E9D5FF',
          300: '#D8B4FE',
          400: '#C084FC',
          500: '#A855F7',
          600: '#9333EA',
          700: '#7E22CE',
          800: '#6B21A8',
          900: '#581C87',
        },
        secondary: {
          DEFAULT: '#F59E0B',  // Gold
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },
        ethereal: {
          DEFAULT: '#E9D5FF',  // Soft purple
          light: '#FAF5FF',
          dark: '#C084FC',
        },
        // Semantic colors
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
      },
      fontFamily: {
        sans: ['System'],
        serif: ['Georgia'],
        mono: ['Menlo', 'Monaco', 'Courier New'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'soft': '0 2px 15px rgba(147, 51, 234, 0.1)',
        'glow': '0 0 20px rgba(147, 51, 234, 0.3)',
      },
    },
  },
  plugins: [],
}
```

### Step 3: Configure Babel

Update `babel.config.js` to include NativeWind plugin:

```javascript
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'nativewind/babel',
  ],
};
```

### Step 4: Create TypeScript Declaration for NativeWind

Create `mobile/src/types/nativewind.d.ts`:

```typescript
/// <reference types="nativewind/types" />

import 'react-native';

declare module 'react-native' {
  interface ViewProps {
    className?: string;
  }
  interface TextProps {
    className?: string;
  }
  interface ImageProps {
    className?: string;
  }
  interface TouchableOpacityProps {
    className?: string;
  }
  interface ScrollViewProps {
    className?: string;
  }
}
```

### Step 5: Test NativeWind

Update `mobile/App.tsx` to test NativeWind:

```typescript
import React from 'react';
import {View, Text, SafeAreaView} from 'react-native';

function App(): React.JSX.Element {
  return (
    <SafeAreaView className="flex-1 bg-primary-50">
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-4xl font-bold text-primary-600 mb-4">
          Manifest the Unseen
        </Text>
        <Text className="text-lg text-gray-700 text-center">
          Transform your life through manifestation
        </Text>
        <View className="mt-8 p-6 bg-white rounded-2xl shadow-soft">
          <Text className="text-secondary-600 font-semibold">
            NativeWind is working! ✨
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default App;
```

Run the app to verify:
```bash
npm run ios
```

You should see styled text with the custom colors applied.

---

## TypeScript Configuration

### Mobile App TypeScript Configuration

Update `mobile/tsconfig.json`:

```json
{
  "extends": "@tsconfig/react-native/tsconfig.json",
  "compilerOptions": {
    "target": "esnext",
    "module": "commonjs",
    "lib": ["esnext"],
    "jsx": "react-native",
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "allowSyntheticDefaultImports": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "moduleResolution": "node",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@manifest/shared": ["../packages/shared/src"],
      "@manifest/shared/*": ["../packages/shared/src/*"]
    }
  },
  "include": [
    "src/**/*",
    "App.tsx"
  ],
  "exclude": [
    "node_modules",
    "babel.config.js",
    "metro.config.js",
    "jest.config.js",
    "__tests__",
    "android",
    "ios"
  ]
}
```

### ESLint Configuration

Create `mobile/.eslintrc.js`:

```javascript
module.exports = {
  root: true,
  extends: [
    '@react-native',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    // TypeScript specific rules
    '@typescript-eslint/no-unused-vars': ['error', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
    }],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',

    // React Native specific rules
    'react-native/no-inline-styles': 'warn',
    'react-native/no-color-literals': 'off', // NativeWind handles colors

    // General rules
    'no-console': ['warn', {allow: ['warn', 'error']}],
    'prefer-const': 'error',
    'no-var': 'error',
  },
  overrides: [
    {
      files: ['*.test.ts', '*.test.tsx', '*.spec.ts', '*.spec.tsx'],
      env: {
        jest: true,
      },
    },
  ],
};
```

### Prettier Configuration

Create `mobile/.prettierrc.js`:

```javascript
module.exports = {
  arrowParens: 'avoid',
  bracketSameLine: true,
  bracketSpacing: false,
  singleQuote: true,
  trailingComma: 'all',
  semi: true,
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
};
```

### Add Type Checking Scripts

Update `mobile/package.json` scripts section:

```json
{
  "scripts": {
    "android": "react-native run-android",
    "ios": "react-native run-ios",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx}\"",
    "type-check": "tsc --noEmit",
    "start": "react-native start",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

---

## Folder Structure

### Complete Mobile App Structure

Create the following folder structure in `mobile/src/`:

```bash
cd mobile
mkdir -p src/{components/{common,forms,layouts},screens/{auth,workbook,journal,meditation,ai,vision-board,settings},navigation,services/{api,supabase,storage},hooks,utils,types,assets/{images,fonts,audio},store,constants}
```

Detailed structure:

```
mobile/
├── android/                 # Android native code
├── ios/                     # iOS native code
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── common/          # Basic UI elements (Button, Card, Input, etc.)
│   │   ├── forms/           # Form-specific components
│   │   └── layouts/         # Layout components (Screen, Container, etc.)
│   ├── screens/             # Screen components (pages)
│   │   ├── auth/            # Authentication screens
│   │   ├── workbook/        # Workbook phases screens
│   │   ├── journal/         # Voice journaling screens
│   │   ├── meditation/      # Meditation player screens
│   │   ├── ai/              # AI chat screens
│   │   ├── vision-board/    # Vision board screens
│   │   └── settings/        # Settings screens
│   ├── navigation/          # Navigation configuration
│   │   ├── RootNavigator.tsx
│   │   ├── AuthStack.tsx
│   │   ├── MainTabs.tsx
│   │   └── types.ts
│   ├── services/            # External services integration
│   │   ├── api/             # API clients
│   │   ├── supabase/        # Supabase client & queries
│   │   └── storage/         # Local storage utilities
│   ├── hooks/               # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useWorkbook.ts
│   │   └── index.ts
│   ├── utils/               # Helper functions
│   │   ├── date.ts
│   │   ├── validation.ts
│   │   └── index.ts
│   ├── types/               # TypeScript type definitions
│   │   ├── models.ts
│   │   ├── navigation.ts
│   │   └── nativewind.d.ts
│   ├── assets/              # Static assets
│   │   ├── images/
│   │   ├── fonts/
│   │   └── audio/
│   ├── store/               # State management (Zustand)
│   │   ├── authStore.ts
│   │   ├── workbookStore.ts
│   │   └── index.ts
│   └── constants/           # App constants
│       ├── colors.ts
│       ├── config.ts
│       └── index.ts
├── App.tsx                  # Root component
├── index.js                 # Entry point
├── app.json                 # React Native config
├── package.json
├── tsconfig.json
├── babel.config.js
├── metro.config.js
├── tailwind.config.js
└── .eslintrc.js
```

### Create Index Files

Create `mobile/src/components/index.ts`:

```typescript
// Common components
export * from './common';
export * from './forms';
export * from './layouts';
```

Create `mobile/src/screens/index.ts`:

```typescript
// Screen exports
export * from './auth';
export * from './workbook';
export * from './journal';
export * from './meditation';
export * from './ai';
export * from './vision-board';
export * from './settings';
```

Create `mobile/src/hooks/index.ts`:

```typescript
// Custom hooks
export {default as useAuth} from './useAuth';
export {default as useWorkbook} from './useWorkbook';
```

Create `mobile/src/utils/index.ts`:

```typescript
// Utility functions
export * from './date';
export * from './validation';
```

### Create Example Files

Create `mobile/src/constants/colors.ts`:

```typescript
/**
 * App color constants
 * These align with Tailwind config but provide type-safe access
 */

export const Colors = {
  primary: {
    DEFAULT: '#9333EA',
    50: '#FAF5FF',
    100: '#F3E8FF',
    200: '#E9D5FF',
    300: '#D8B4FE',
    400: '#C084FC',
    500: '#A855F7',
    600: '#9333EA',
    700: '#7E22CE',
    800: '#6B21A8',
    900: '#581C87',
  },
  secondary: {
    DEFAULT: '#F59E0B',
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
  },
  ethereal: {
    DEFAULT: '#E9D5FF',
    light: '#FAF5FF',
    dark: '#C084FC',
  },
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  white: '#FFFFFF',
  black: '#000000',
} as const;

export type ColorKey = keyof typeof Colors;
```

Create `mobile/src/constants/config.ts`:

```typescript
/**
 * App configuration constants
 */

export const Config = {
  APP_NAME: 'Manifest the Unseen',
  APP_VERSION: '1.0.0',

  // API Configuration (will be loaded from env)
  SUPABASE_URL: process.env.SUPABASE_URL || '',
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || '',

  // Feature flags
  FEATURES: {
    VOICE_JOURNALING: true,
    AI_CHAT: true,
    MEDITATION: true,
    VISION_BOARD: true,
  },

  // Limits (will be overridden by subscription tier)
  DEFAULT_LIMITS: {
    JOURNAL_ENTRIES_PER_MONTH: 50,
    AI_MESSAGES_PER_DAY: 30,
    VISION_BOARDS: 1,
  },

  // App behavior
  AUTO_SAVE_INTERVAL_MS: 30000, // 30 seconds
  MEDITATION_SESSION_MIN_SECONDS: 60, // Count as session if > 1 minute

} as const;
```

Create `mobile/src/types/models.ts`:

```typescript
/**
 * Core data models
 * These should mirror types in @manifest/shared
 */

export interface User {
  id: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface WorkbookProgress {
  id: string;
  userId: string;
  phase: number; // 1-10
  completionPercentage: number;
  data: Record<string, any>; // JSONB data
  lastUpdated: string;
}

export interface JournalEntry {
  id: string;
  userId: string;
  content: string;
  transcribedAt: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface MeditationSession {
  id: string;
  userId: string;
  meditationId: string;
  durationSeconds: number;
  completedAt: string;
}

export interface Meditation {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  audioUrlMale: string;
  audioUrlFemale: string;
  tier: 'novice' | 'awakening' | 'enlightenment';
  order: number;
}

export interface VisionBoard {
  id: string;
  userId: string;
  title: string;
  images: Array<{
    url: string;
    caption: string | null;
  }>;
  createdAt: string;
  updatedAt: string;
}

export type SubscriptionTier = 'novice' | 'awakening' | 'enlightenment' | 'free';

export interface Subscription {
  tier: SubscriptionTier;
  isActive: boolean;
  expiresAt: string | null;
  isTrial: boolean;
}
```

---

## Development Workflow

### Daily Development Commands

```bash
# From monorepo root

# Start Metro bundler
npm run mobile

# Run on iOS simulator (in another terminal)
npm run mobile:ios

# Run on physical iOS device
cd mobile && npm run ios -- --device "Your iPhone Name"

# Type checking (before committing)
npm run type-check

# Linting
npm run lint

# Build shared package (when you make changes)
npm run shared:build

# Clean and reinstall everything (when things break)
npm run clean
npm run install-all
```

### Git Workflow

Create `.gitignore` at monorepo root:

```
# Dependencies
node_modules/
.pnp
.pnp.js

# Build outputs
dist/
build/
*.log

# iOS
mobile/ios/Pods/
mobile/ios/build/
mobile/ios/.xcode.env.local
*.pbxuser
!default.pbxuser
*.mode1v3
!default.mode1v3
*.mode2v3
!default.mode2v3
*.perspectivev3
!default.perspectivev3
xcuserdata/
*.xccheckout
*.moved-aside
DerivedData/
*.hmap
*.ipa
*.xcuserstate
ios/.xcode.env.local

# Android
mobile/android/app/build/
mobile/android/.gradle/
mobile/android/local.properties
*.apk
*.aab

# Testing
coverage/
.nyc_output/

# Environment
.env
.env.local
.env.*.local

# Editor
.vscode/
.idea/
*.swp
*.swo
*~
.DS_Store

# Metro
.metro-health-check*

# Temporary
tmp/
temp/
*.tmp
```

### Testing Setup

Create `mobile/jest.config.js`:

```javascript
module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|@supabase)/)',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@manifest/shared$': '<rootDir>/../packages/shared/src',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.test.{ts,tsx}',
    '!src/types/**/*',
  ],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
};
```

Create `mobile/jest.setup.js`:

```javascript
import 'react-native-gesture-handler/jestSetup';

// Mock native modules
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Mock NativeWind
jest.mock('nativewind', () => ({
  styled: () => Component => Component,
}));

// Global test utilities
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
};
```

---

## Common Issues & Solutions

### Issue 1: Metro Bundler Can't Find Modules

**Symptom:** `Unable to resolve module @manifest/shared`

**Solution:**
```bash
# Clear Metro cache
cd mobile
npm start -- --reset-cache

# Clear watchman cache
watchman watch-del-all

# Clean and rebuild
cd ios
pod deintegrate
pod install
cd ..
npm run ios
```

### Issue 2: iOS Build Fails - CocoaPods Issues

**Symptom:** Build fails with CocoaPods errors

**Solution:**
```bash
cd mobile/ios

# Clean CocoaPods
pod deintegrate
rm -rf Pods Podfile.lock

# Reinstall
pod install --repo-update

# If still fails, try installing with verbose output
pod install --verbose
```

### Issue 3: TypeScript Can't Find Shared Package

**Symptom:** TypeScript errors in imports from `@manifest/shared`

**Solution:**
1. Ensure shared package is built: `cd packages/shared && npm run build`
2. Check path mapping in `mobile/tsconfig.json`
3. Restart TypeScript server in your editor
4. Verify Metro config includes correct paths

### Issue 4: NativeWind Styles Not Applying

**Symptom:** className prop doesn't style components

**Solution:**
1. Verify `babel.config.js` includes `nativewind/babel` plugin
2. Clear Metro cache: `npm start -- --reset-cache`
3. Check `tailwind.config.js` content paths include your files
4. Ensure `nativewind.d.ts` type declarations exist

### Issue 5: Hot Reload Not Working

**Symptom:** Changes don't reflect in simulator

**Solution:**
1. In simulator: Press `Cmd+D` → "Reload"
2. Enable Fast Refresh: `Cmd+D` → "Enable Fast Refresh"
3. Restart Metro: Stop and run `npm start -- --reset-cache`
4. Check no syntax errors in console

### Issue 6: Build Succeeds but App Crashes on Launch

**Symptom:** White screen or immediate crash

**Solution:**
1. Check Metro bundler for errors
2. Look at Xcode console for error messages
3. Verify all dependencies are installed
4. Check for missing environment variables
5. Clear derived data: Xcode → Product → Clean Build Folder

---

## Next Steps

### Immediate Actions (Week 1)

1. **Install Core Dependencies**
   ```bash
   cd mobile
   npm install @react-navigation/native @react-navigation/native-stack
   npm install react-native-screens react-native-safe-area-context
   npm install zustand @tanstack/react-query
   npm install react-hook-form zod
   ```

2. **Set Up Navigation**
   - Create `src/navigation/RootNavigator.tsx`
   - Set up auth stack and main tabs
   - Configure navigation types

3. **Set Up State Management**
   - Create Zustand stores in `src/store/`
   - Configure TanStack Query client
   - Set up React Query DevTools (dev only)

4. **Create Design System**
   - Build common components (Button, Input, Card, etc.)
   - Implement theme system
   - Create reusable layouts

5. **Integrate Supabase**
   - Install Supabase client
   - Configure authentication
   - Set up real-time subscriptions
   - Create API service layer

### Week 2 Goals

1. Authentication screens (Sign In, Sign Up)
2. Onboarding flow
3. Main app navigation structure
4. First workbook screen prototype

### Reference Documentation

- React Native: https://reactnative.dev/docs/getting-started
- NativeWind: https://www.nativewind.dev/
- React Navigation: https://reactnavigation.org/docs/getting-started
- Zustand: https://github.com/pmndrs/zustand
- TanStack Query: https://tanstack.com/query/latest
- Supabase: https://supabase.com/docs/reference/javascript

---

## Summary

You've now set up:

✅ React Native with TypeScript
✅ Monorepo structure with shared package
✅ NativeWind styling system
✅ TypeScript strict mode configuration
✅ Complete folder structure
✅ Development tooling (ESLint, Prettier, Jest)
✅ iOS build environment

**Your project is ready for feature development!**

For questions or issues, refer to:
- This guide
- `/docs/manifest-the-unseen-prd.md` for product requirements
- `/docs/manifest-the-unseen-tdd.md` for technical architecture
- `CLAUDE.md` for project conventions

Happy coding! 🚀
