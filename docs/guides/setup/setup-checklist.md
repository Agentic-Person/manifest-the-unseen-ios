# React Native Setup Checklist

**Quick reference for TASK-2025-11-003**

---

## Pre-Setup Checklist

- [ ] Node.js v18+ installed (`node --version`)
- [ ] npm v9+ installed (`npm --version`)
- [ ] Watchman installed (`watchman --version`)
- [ ] Xcode 15.0+ installed with Command Line Tools
- [ ] iOS Simulator downloaded in Xcode
- [ ] CocoaPods installed (`pod --version`)
- [ ] Yarn or pnpm installed (optional, recommended)

---

## Step 1: Initialize React Native (1 hour)

```bash
# Create React Native project with TypeScript
npx react-native@latest init ManifestTheUnseen --template react-native-template-typescript

# Navigate to project
cd ManifestTheUnseen

# Test initial build
npm run ios
```

**Verify:**
- [ ] App builds successfully
- [ ] iOS simulator opens
- [ ] Welcome screen displays
- [ ] Hot reload works

---

## Step 2: Set Up Monorepo (2 hours)

```bash
# Create monorepo structure
cd ..
mkdir -p manifest-the-unseen/{packages/shared/src,supabase}
mv ManifestTheUnseen manifest-the-unseen/mobile
cd manifest-the-unseen

# Copy root package.json from docs/example-configs/
# Copy packages/shared/package.json from docs/example-configs/
# Copy packages/shared/tsconfig.json from docs/example-configs/

# Install dependencies
npm install
cd packages/shared && npm install && cd ../..
cd mobile && npm install && cd ios && pod install && cd ../../..
```

**Verify:**
- [ ] Monorepo structure created
- [ ] Workspaces configured in root package.json
- [ ] Shared package has dependencies installed
- [ ] Mobile app still builds: `cd mobile && npm run ios`

---

## Step 3: Configure NativeWind (1.5 hours)

```bash
cd mobile

# Install NativeWind
npm install nativewind
npm install --save-dev tailwindcss

# Initialize Tailwind
npx tailwindcss init

# Copy configs from docs/example-configs/:
# - mobile-tailwind.config.js → tailwind.config.js
# - mobile-babel.config.js → babel.config.js

# Create NativeWind type declarations
mkdir -p src/types
# Copy nativewind.d.ts content from setup guide

# Test NativeWind in App.tsx (example in setup guide)
npm run ios
```

**Verify:**
- [ ] NativeWind installed
- [ ] Tailwind config created with custom colors
- [ ] Babel config includes NativeWind plugin
- [ ] Type declarations created
- [ ] Test component shows styled elements

---

## Step 4: Configure TypeScript (1 hour)

```bash
cd mobile

# Copy TypeScript config from docs/example-configs/
# - mobile-tsconfig.json → tsconfig.json

# Copy ESLint config
# - mobile-eslintrc.js → .eslintrc.js

# Copy Prettier config
# - mobile-prettierrc.js → .prettierrc.js

# Update metro.config.js for monorepo
# - mobile-metro.config.js → metro.config.js

# Run type check
npm run type-check
```

**Verify:**
- [ ] TypeScript strict mode enabled
- [ ] Path aliases configured (@/ and @manifest/shared)
- [ ] ESLint configured
- [ ] Prettier configured
- [ ] Type checking passes
- [ ] No lint errors

---

## Step 5: Create Folder Structure (0.5 hour)

```bash
cd mobile

# Create all folders
mkdir -p src/{components/{common,forms,layouts},screens/{auth,workbook,journal,meditation,ai,vision-board,settings},navigation,services/{api,supabase,storage},hooks,utils,types,assets/{images,fonts,audio},store,constants}

# Create index files
touch src/components/index.ts
touch src/screens/index.ts
touch src/hooks/index.ts
touch src/utils/index.ts
touch src/types/index.ts
touch src/constants/index.ts

# Copy constants from setup guide:
# - colors.ts
# - config.ts
# - index.ts
```

**Verify:**
- [ ] All folders created
- [ ] Index files in place
- [ ] Constants files created
- [ ] Folder structure matches docs/folder-structure.md

---

## Step 6: Set Up Testing (0.5 hour)

```bash
cd mobile

# Copy test configs from docs/example-configs/
# - mobile-jest.config.js → jest.config.js
# - mobile-jest.setup.js → jest.setup.js

# Create mock directories
mkdir -p __mocks__

# Run tests
npm test
```

**Verify:**
- [ ] Jest configured for React Native
- [ ] Test setup file created
- [ ] Mocks configured
- [ ] Tests run successfully

---

## Step 7: Build Shared Package (0.5 hour)

```bash
cd packages/shared

# Verify all source files exist:
# - src/index.ts
# - src/models/index.ts
# - src/validation/index.ts
# - src/constants/index.ts
# - src/utils/index.ts
# - src/api/index.ts (placeholder)
# - src/hooks/index.ts (placeholder)

# Build the package
npm run build

# Verify dist/ folder created
ls dist/
```

**Verify:**
- [ ] All source files created
- [ ] Build completes successfully
- [ ] dist/ folder contains compiled JS and type definitions
- [ ] No TypeScript errors

---

## Step 8: Final Integration Test (0.5 hour)

```bash
# From monorepo root
cd manifest-the-unseen

# Clean install everything
npm run clean
npm run install-all

# Build shared package
npm run shared:build

# Test mobile app with shared package
cd mobile

# Create test import in App.tsx:
# import { WORKBOOK_PHASES, formatDate } from '@manifest/shared';

# Run iOS
npm run ios
```

**Verify:**
- [ ] Shared package imports work
- [ ] No module resolution errors
- [ ] App builds successfully
- [ ] No TypeScript errors
- [ ] Hot reload working

---

## Step 9: Create Git Repository (0.5 hour)

```bash
# From monorepo root
git init
git add .
git commit -m "Initial React Native setup with monorepo structure

- React Native 0.73 with TypeScript
- Monorepo structure (mobile, packages/shared, supabase)
- NativeWind configured with custom theme
- TypeScript strict mode
- ESLint + Prettier
- Jest testing setup
- Complete folder structure

Implements TASK-2025-11-003"

# Create .github folder for future CI/CD
mkdir -p .github/workflows
```

**Verify:**
- [ ] Git initialized
- [ ] .gitignore in place
- [ ] Initial commit created
- [ ] All files tracked

---

## Final Verification Checklist

### Build & Run
- [ ] `npm run mobile:ios` works from monorepo root
- [ ] App opens in iOS simulator
- [ ] No errors in Metro bundler
- [ ] No errors in Xcode console

### TypeScript
- [ ] `npm run type-check` passes in all workspaces
- [ ] No TypeScript errors
- [ ] Path aliases working (@/ and @manifest/shared)

### Linting
- [ ] `npm run lint` passes in all workspaces
- [ ] ESLint configured properly
- [ ] Prettier formats code

### Testing
- [ ] `npm test` passes in mobile and shared
- [ ] Jest configured for React Native
- [ ] Coverage reporting works

### Monorepo
- [ ] Shared package builds successfully
- [ ] Mobile app imports from shared package
- [ ] Hot reload works with monorepo structure

### Documentation
- [ ] README.md exists with setup instructions
- [ ] docs/react-native-setup-guide.md created
- [ ] docs/folder-structure.md created
- [ ] All example configs in docs/example-configs/

---

## Common Issues

### Issue: Metro can't resolve @manifest/shared
**Solution:**
```bash
npm start -- --reset-cache
cd ios && pod install && cd ..
```

### Issue: CocoaPods build fails
**Solution:**
```bash
cd ios
pod deintegrate
rm -rf Pods Podfile.lock
pod install
cd ..
```

### Issue: TypeScript can't find types
**Solution:**
```bash
cd packages/shared
npm run build
cd ../../mobile
# Restart TypeScript server in editor
```

### Issue: Hot reload not working
**Solution:**
- Press Cmd+D in simulator
- Enable Fast Refresh
- Restart Metro bundler

---

## Next Steps After Setup

1. **Install Core Dependencies** (Week 1)
   - React Navigation
   - Zustand
   - TanStack Query
   - React Hook Form
   - Supabase client

2. **Set Up Navigation** (Week 1)
   - Create navigation structure
   - Auth stack
   - Main tabs

3. **Integrate Supabase** (Week 1-2)
   - Set up Supabase project
   - Configure authentication
   - Create database schema

4. **Build Design System** (Week 2)
   - Common components
   - Theme system
   - Layouts

---

## Estimated Time

- **Total Setup Time:** 6-8 hours
- **With troubleshooting:** 8-10 hours

## Success Criteria

✅ React Native builds on iOS simulator
✅ TypeScript strict mode with no errors
✅ Monorepo structure working
✅ NativeWind styling functional
✅ Shared package imports working
✅ Tests running successfully
✅ Hot reload working
✅ Documentation complete

**You're ready to start feature development!** 🚀
