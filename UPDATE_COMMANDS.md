# Dependency Update Commands Reference
## Manifest the Unseen - React Native Mobile App

Generated: December 12, 2025

---

## Table of Contents

1. [Security Audit Commands](#security-audit-commands)
2. [Phase 1: Safe Patch Updates](#phase-1-safe-patch-updates)
3. [Phase 2: Minor Version Updates](#phase-2-minor-version-updates)
4. [Phase 3: Major Version Updates](#phase-3-major-version-updates)
5. [Testing & Verification](#testing--verification)
6. [Rollback Procedures](#rollback-procedures)

---

## Security Audit Commands

### Run Current Audit
```bash
cd mobile
npm audit
```

### Detailed Audit Report
```bash
cd mobile
npm audit --detail
```

### JSON Audit Report (for automated processing)
```bash
cd mobile
npm audit --json > audit-report.json
```

### Check for Moderate or Higher Severity
```bash
cd mobile
npm audit --audit-level=moderate
```

### List Outdated Packages
```bash
cd mobile
npm outdated
```

### Check Specific Package Security Status
```bash
cd mobile
npm view <package-name> > package-info.txt
```

---

## Phase 1: Safe Patch Updates

**Timeline:** Immediate (Next Sprint)
**Risk Level:** Very Low
**Testing Required:** Smoke tests

### Update All Phase 1 Packages at Once
```bash
cd mobile
npm update @supabase/supabase-js @tanstack/react-query expo expo-audio expo-av expo-build-properties expo-dev-client expo-file-system expo-haptics expo-image-picker expo-linear-gradient expo-splash-screen expo-status-bar babel-preset-expo
```

### Or Update Individual Packages

#### Backend & State Management
```bash
cd mobile
npm update @supabase/supabase-js
npm update @tanstack/react-query
```

#### Expo Core & Plugins
```bash
cd mobile
npm update expo
npm update expo-audio
npm update expo-av
npm update expo-build-properties
npm update expo-dev-client
npm update expo-file-system
npm update expo-haptics
npm update expo-image-picker
npm update expo-linear-gradient
npm update expo-splash-screen
npm update expo-status-bar
```

#### Build Tools
```bash
cd mobile
npm update babel-preset-expo
```

### Verify Phase 1 Updates
```bash
cd mobile
npm audit
npm outdated
```

### Expected Changes After Phase 1
```
@supabase/supabase-js: 2.86.0 → 2.87.1
@tanstack/react-query: 5.90.11 → 5.90.12
expo: 54.0.25 → 54.0.29
(and 15+ other patch updates)

Total: 0 vulnerabilities found (same as before)
```

---

## Phase 2: Minor Version Updates

**Timeline:** 2-3 weeks after Phase 1
**Risk Level:** Low
**Testing Required:** Full regression test suite

### Before Updating - Back Up Current Dependencies
```bash
cd mobile
cp package-lock.json package-lock.json.phase1-backup
```

### React Core Libraries
```bash
cd mobile
npm update react react-dom
npm update --save-dev @types/react
```

### Expo Audio Packages (Minor Versions)
```bash
cd mobile
npm update expo-file-system
npm update expo-haptics
npm update expo-image-picker
```

### React Native Community Packages
```bash
cd mobile
npm update @react-native-community/slider
```

### Development Tools
```bash
cd mobile
npm update --save-dev prettier
```

### Update All Phase 2 Packages at Once
```bash
cd mobile
npm update react react-dom expo-file-system expo-haptics expo-image-picker @react-native-community/slider && npm update --save-dev @types/react prettier
```

### Verify Phase 2 Updates
```bash
cd mobile
npm audit
npm outdated
```

### Testing After Phase 2
```bash
# Run all tests
cd mobile
npm test

# Check TypeScript compilation
npm run type-check

# Check linting
npm run lint

# Manual smoke test (iOS simulator)
npm run ios
```

---

## Phase 3: Major Version Updates

### IMPORTANT: Handle These Separately & Carefully

Major version updates involve breaking changes and may require code modifications. Plan these as part of a major release cycle.

---

## 3.1: React Navigation Stack Update (v6 → v7)

**Effort:** 1-2 weeks
**Breaking Changes:** Yes
**Recommendation:** Plan for major release cycle

### Before Starting
1. Read migration guide: https://reactnavigation.org/docs/migration-guides/
2. Create feature branch: `git checkout -b feat/react-navigation-v7`
3. Back up current version: `cp package-lock.json package-lock.json.react-nav-v6`

### Update Packages (All Together)
```bash
cd mobile
npm install @react-navigation/bottom-tabs@latest
npm install @react-navigation/native@latest
npm install @react-navigation/native-stack@latest
```

### Expected Updates
```
@react-navigation/bottom-tabs: 6.6.1 → 7.8.12
@react-navigation/native: 6.1.18 → 7.1.25
@react-navigation/native-stack: 6.11.0 → 7.8.6
```

### Common Changes Required in Code
```typescript
// Screen configuration format may change
// Navigation API may update
// Type definitions will change
// Review all navigation-related code

// See RootNavigator.tsx and navigation setup
```

### Testing After React Navigation Update
```bash
cd mobile
npm test
npm run type-check
npm run ios  # Full manual testing

# Test all navigation flows:
# - Tab navigation
# - Stack navigation
# - Deep linking
# - Parameters passing
```

### If Issues Occur - Rollback
```bash
cd mobile
npm ci  # Restore from package-lock.json
# Or restore backup:
cp package-lock.json.react-nav-v6 package-lock.json && npm ci
```

---

## 3.2: React Native Tool Chain Update (0.73 → 0.83)

**Effort:** 2-3 weeks
**Breaking Changes:** Yes
**Impact:** Requires native iOS/Android rebuild

### CRITICAL: Update All Tools Together
These packages must be updated as a set:
- @react-native/babel-preset
- @react-native/eslint-config
- @react-native/metro-config
- @react-native/typescript-config

```bash
cd mobile
npm install @react-native/babel-preset@latest
npm install @react-native/eslint-config@latest
npm install @react-native/metro-config@latest
npm install @react-native/typescript-config@latest
```

### Separately: Update React Native Itself
```bash
cd mobile
npm install react-native@latest
```

### Expected Updates
```
@react-native/babel-preset: 0.73.21 → 0.83.0
@react-native/eslint-config: 0.73.2 → 0.83.0
@react-native/metro-config: 0.73.5 → 0.83.0
@react-native/typescript-config: 0.73.1 → 0.83.0
react-native: 0.81.5 → latest
```

### Possible Configuration Changes
- metro.config.js may need updates
- babel.config.js may need updates
- ESLint configuration may need updates
- TypeScript config may need updates

### Testing After React Native Update
```bash
cd mobile
npm run type-check
npm run lint
npm test

# Clean rebuild
rm -rf ios/Pods
cd ios && pod install && cd ..

# Test on iOS simulator
npm run ios

# Test on physical device
npm run ios:device
```

### If Issues Occur - Rollback
```bash
cd mobile
rm -rf node_modules package-lock.json
git checkout package.json
npm install
```

---

## 3.3: Testing Framework Updates

**Effort:** 1-2 weeks
**Breaking Changes:** Yes
**Packages:** Jest, ESLint, React Testing Library

### Jest Major Update (29 → 30)
```bash
cd mobile
npm install --save-dev jest@latest
```

**Configuration Changes Needed:**
```javascript
// jest.config.js - Review for deprecated options
// Update test files - Some APIs may change
```

### ESLint Major Update (8 → 9)
```bash
cd mobile
npm install --save-dev eslint@latest
```

**Configuration Changes Needed:**
```javascript
// eslintrc config format may change
// Deprecated rules need to be removed
// Review .eslintignore file
```

### React Testing Library Update (12 → 13)
```bash
cd mobile
npm install --save-dev @testing-library/react-native@latest
```

**Test Changes Needed:**
```typescript
// Some query APIs may change
// Render options may be different
// Review test files
```

### All Together (Batch Update)
```bash
cd mobile
npm install --save-dev jest@latest eslint@latest @testing-library/react-native@latest
```

### Testing After Framework Updates
```bash
cd mobile
npm test
npm run lint
npm run type-check
```

### View Breaking Changes
```bash
# Jest changelog
npm view jest changelog

# ESLint changelog
npm view eslint changelog

# React Testing Library changelog
npm view @testing-library/react-native changelog
```

---

## Testing & Verification

### Complete Test Suite
```bash
cd mobile
npm audit
npm run type-check
npm run lint
npm test
```

### Full Smoke Test
```bash
cd mobile
npm run ios  # Start iOS simulator

# Manual testing checklist:
# [ ] App launches without errors
# [ ] Navigation works (tab navigation)
# [ ] Forms render correctly
# [ ] Audio playback works (if testing meditation/journaling)
# [ ] API calls work (check network tab if available)
# [ ] State management works (Zustand)
# [ ] Async storage works (persistence)
```

### Performance Check (Optional)
```bash
cd mobile
npm run build:ios
# Review build output and bundle size
```

### Run Tests in Watch Mode (During Development)
```bash
cd mobile
npm test -- --watch
npm run lint -- --fix  # Auto-fix linting issues
```

---

## Rollback Procedures

### Immediate Rollback (Last Update Only)
```bash
cd mobile
npm ci  # Restore from package-lock.json
```

### Rollback to Backup
```bash
cd mobile
# Find your backup file from before updates
cp package-lock.json.backup package-lock.json
npm ci
```

### Rollback Specific Package
```bash
cd mobile
npm install <package-name>@<old-version>
# Example:
npm install @supabase/supabase-js@2.86.0
```

### Complete Rollback (Nuclear Option)
```bash
cd mobile
rm -rf node_modules package-lock.json
git checkout package.json package-lock.json
npm install
```

### Revert Git Changes (If Committed)
```bash
# If you committed the update and want to undo
git revert <commit-hash>
# Or
git reset --hard <commit-hash>
```

---

## Scheduled Maintenance Commands

### Monthly Security Check
```bash
cd mobile
npm audit
# Should show: found 0 vulnerabilities
```

### Quarterly Dependency Review
```bash
cd mobile
npm outdated
# Review what updates are available
npm audit --json > audit-quarterly.json
```

### Before Each Release
```bash
cd mobile
npm audit --audit-level=moderate
npm run type-check
npm run lint
npm test
```

---

## Troubleshooting Update Issues

### Issue: Peer Dependency Conflicts
```bash
cd mobile
npm install --legacy-peer-deps
# Or upgrade npm and let it handle peer deps:
npm install -g npm@latest
npm install
```

### Issue: Network Errors During npm install
```bash
cd mobile
npm cache clean --force
npm install
```

### Issue: Lock File Conflicts (Git Merge)
```bash
cd mobile
rm package-lock.json
npm install
# Commit both package.json and new package-lock.json
```

### Issue: Build Fails After Update
```bash
cd mobile
# Clear cache and rebuild
npm cache clean --force
rm -rf node_modules
npm install
npm run ios  # Clean rebuild
```

### Issue: TypeScript Errors After Update
```bash
cd mobile
npm run type-check
# Fix any TypeScript issues, or update types:
npm install --save-dev @types/your-package@latest
```

### Issue: ESLint Errors After Update
```bash
cd mobile
npm run lint -- --fix  # Auto-fix what can be fixed
npm run lint  # Review remaining errors
```

---

## Environment & Prerequisites

### Before Running Any Update Commands

1. **Node Version Check**
   ```bash
   node --version
   npm --version
   # Required: Node 18+ (per package.json engines)
   ```

2. **Clean Working Directory**
   ```bash
   cd mobile
   git status
   # Should be clean (no uncommitted changes)
   ```

3. **Backup Current State**
   ```bash
   cd mobile
   cp package-lock.json package-lock.json.backup
   git stash  # Save any uncommitted changes
   ```

4. **Create Feature Branch (For Major Updates)**
   ```bash
   git checkout -b feat/update-dependencies
   ```

---

## Quick Reference Table

| Phase | Timing | Risk | Testing | Command |
|-------|--------|------|---------|---------|
| 1 | Immediate | Very Low | Smoke | `npm update @supabase/supabase-js @tanstack/react-query expo` |
| 2 | 2-3 weeks | Low | Regression | `npm update react react-dom` |
| 3a | Major cycle | High | Full | `npm install @react-navigation/bottom-tabs@latest` |
| 3b | Major cycle | High | Full | `npm install @react-native/babel-preset@latest` |
| 3c | Major cycle | High | Full | `npm install --save-dev jest@latest eslint@latest` |

---

## Additional Resources

- **npm audit docs:** https://docs.npmjs.com/cli/v10/commands/npm-audit
- **npm update docs:** https://docs.npmjs.com/cli/v10/commands/npm-update
- **npm outdated docs:** https://docs.npmjs.com/cli/v10/commands/npm-outdated
- **Package Migration Guides:**
  - React Navigation: https://reactnavigation.org/docs/migration-guides/
  - React Native: https://reactnative.dev/docs/upgrading
  - Jest: https://jestjs.io/docs/upgrading-to-jest-30
  - ESLint: https://eslint.org/docs/latest/use/migrating-to-9.0.0

---

**Last Updated:** December 12, 2025
**Current npm Version:** 10.x
**Current Node Requirement:** >=18
