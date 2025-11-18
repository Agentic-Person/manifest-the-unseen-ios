# Development Tooling Setup Checklist

This checklist guides you through setting up ESLint, Prettier, and Husky for the Manifest the Unseen mobile app.

## Prerequisites

- [ ] React Native project initialized (TASK-003 complete)
- [ ] Node.js 16+ installed
- [ ] Git repository initialized
- [ ] VS Code installed (recommended)

## Step 1: Install Dependencies

Run these commands in the `mobile/` directory:

```bash
cd mobile

# ESLint and TypeScript plugins
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm install --save-dev eslint-plugin-react eslint-plugin-react-native eslint-plugin-react-hooks

# Prettier and ESLint integration
npm install --save-dev prettier eslint-config-prettier

# Git hooks
npm install --save-dev husky lint-staged

# React Native testing library (if not already installed)
npm install --save-dev @testing-library/react-native @testing-library/jest-native
```

**Estimated time**: 2-3 minutes

## Step 2: Copy Configuration Files

Copy the pre-created configuration files into the mobile directory:

```bash
# From project root
cp .eslintrc.js mobile/.eslintrc.js
cp .prettierrc mobile/.prettierrc
cp .prettierignore mobile/.prettierignore
cp .lintstagedrc.json mobile/.lintstagedrc.json

# VS Code settings (keep at root or copy to mobile)
# .vscode/ directory is already at root - leave it there for workspace settings
```

**Estimated time**: 1 minute

## Step 3: Update package.json

Add the following scripts to `mobile/package.json`:

```json
{
  "scripts": {
    "lint": "eslint . --ext .ts,.tsx,.js,.jsx --max-warnings=0",
    "lint:fix": "eslint . --ext .ts,.tsx,.js,.jsx --fix",
    "format": "prettier --write \"**/*.{ts,tsx,js,jsx,json,md,yml,yaml}\"",
    "format:check": "prettier --check \"**/*.{ts,tsx,js,jsx,json,md,yml,yaml}\"",
    "type-check": "tsc --noEmit",
    "prepare": "cd .. && husky install"
  }
}
```

See `docs/PACKAGE_JSON_SCRIPTS.md` for complete scripts reference.

**Estimated time**: 2 minutes

## Step 4: Initialize Husky

```bash
# Initialize Husky (run from project root)
cd ..
npx husky install

# Create pre-commit hook
npx husky add .husky/pre-commit "cd mobile && npx lint-staged"

# Make hook executable (Git Bash/Linux/Mac)
chmod +x .husky/pre-commit
```

**Estimated time**: 1 minute

## Step 5: Test ESLint

```bash
cd mobile

# Run linter
npm run lint

# Expected: No errors if generated code is clean
# Fix any auto-fixable issues
npm run lint:fix
```

**Estimated time**: 1 minute

## Step 6: Test Prettier

```bash
# Format all files
npm run format

# Check formatting
npm run format:check

# Expected: All files formatted consistently
```

**Estimated time**: 1 minute

## Step 7: Test TypeScript

```bash
# Run type checker
npm run type-check

# Expected: No type errors
```

**Estimated time**: 1 minute

## Step 8: Test Git Hooks

```bash
# Make a small change to test hook
echo "// Test comment" >> src/App.tsx

# Stage and commit
git add src/App.tsx
git commit -m "test: verify pre-commit hook"

# Expected behavior:
# 1. lint-staged runs
# 2. ESLint checks the file
# 3. Prettier formats the file
# 4. File is automatically re-staged
# 5. Commit succeeds
```

**Estimated time**: 2 minutes

## Step 9: Configure VS Code

If VS Code is not auto-detecting the settings:

1. Open Command Palette (`Cmd/Ctrl + Shift + P`)
2. Type "Reload Window"
3. Press Enter

VS Code should now:
- [ ] Format files on save
- [ ] Show ESLint errors inline
- [ ] Organize imports on save
- [ ] Suggest installing recommended extensions

**Estimated time**: 1 minute

## Step 10: Install Recommended Extensions

When you open VS Code, you should see a notification to install recommended extensions.

Click "Install All" or manually install:

- ESLint (`dbaeumer.vscode-eslint`)
- Prettier (`esbenp.prettier-vscode`)
- React Native Tools (`msjsdiag.vscode-react-native`)
- Tailwind CSS IntelliSense (`bradlc.vscode-tailwindcss`)

**Estimated time**: 2 minutes

## Verification Checklist

After setup, verify everything works:

- [ ] `npm run lint` runs without errors
- [ ] `npm run format` formats all files
- [ ] `npm run type-check` passes
- [ ] VS Code shows ESLint errors inline
- [ ] VS Code formats files on save
- [ ] Git pre-commit hook runs on commit
- [ ] Pre-commit hook blocks commits with errors
- [ ] All team members have consistent formatting

## Troubleshooting

### ESLint Not Running

```bash
# Reinstall ESLint
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin

# Clear ESLint cache
rm -rf node_modules/.cache/eslint
```

### Prettier Not Formatting

Check VS Code settings:
1. Open Settings (`Cmd/Ctrl + ,`)
2. Search for "format on save"
3. Ensure it's checked
4. Search for "default formatter"
5. Ensure it's set to "Prettier - Code formatter"

### Husky Hooks Not Running

```bash
# Verify Husky is installed
ls -la .husky

# Reinstall hooks
rm -rf .husky
npx husky install
npx husky add .husky/pre-commit "cd mobile && npx lint-staged"
```

### Windows Line Ending Issues

```bash
# Configure Git
git config core.autocrlf true

# Or use .gitattributes
echo "* text=auto" > .gitattributes
git add .gitattributes
git commit -m "chore: configure line endings"
```

### Type Check Failing on React Native Types

```bash
# Reinstall @types
npm install --save-dev @types/react @types/react-native

# Verify tsconfig.json has correct settings
cat tsconfig.json
```

## Common Issues & Solutions

### Issue: ESLint shows errors for valid React Native code

**Solution**: Ensure `.eslintrc.js` extends `@react-native` preset

### Issue: Pre-commit hook too slow

**Solution**: lint-staged only runs on staged files, not entire codebase. If still slow:
- Remove `type-check` from lint-staged
- Move `type-check` to pre-push hook instead

### Issue: Team members have different formatting

**Solution**: Ensure all team members:
1. Install Prettier extension
2. Enable "Format on Save"
3. Use workspace settings (`.vscode/settings.json`)

## Next Steps

After completing this checklist:

1. Commit the configuration files:
   ```bash
   git add .eslintrc.js .prettierrc .lintstagedrc.json .vscode/ .husky/
   git commit -m "config: add ESLint, Prettier, and Husky configuration"
   ```

2. Update task status:
   - Mark TASK-2025-11-006 as complete
   - Document completion in session log

3. Share with team:
   - Push to GitHub
   - Notify team members to pull and run `npm install`
   - Ensure everyone has VS Code extensions installed

## Estimated Total Time

**Total setup time**: 15-20 minutes

Breakdown:
- Install dependencies: 3 min
- Copy configuration: 1 min
- Update package.json: 2 min
- Initialize Husky: 1 min
- Test tooling: 5 min
- Configure VS Code: 3 min
- Install extensions: 2 min
- Verification: 3 min

## Success Criteria

Setup is complete when:

- ✅ All dependencies installed
- ✅ Configuration files in place
- ✅ ESLint runs and catches errors
- ✅ Prettier formats code consistently
- ✅ TypeScript compilation succeeds
- ✅ Git hooks prevent bad commits
- ✅ VS Code auto-formats on save
- ✅ All team members have same setup

## Resources

- [ESLint Configuration](../.eslintrc.js)
- [Prettier Configuration](../.prettierrc)
- [Husky Setup Guide](./HUSKY_SETUP.md)
- [Code Standards](./CODE_STANDARDS.md)
- [Package.json Scripts Reference](./PACKAGE_JSON_SCRIPTS.md)

---

**Task**: TASK-2025-11-006
**Owner**: Frontend Specialist
**Last Updated**: 2025-11-17

Questions? Review the documentation above or ask in #dev-help.
