# Husky Git Hooks Setup Guide

This document explains how to set up and use Husky git hooks for the Manifest the Unseen project.

## Overview

Husky enables Git hooks to run automated checks before commits and pushes, ensuring code quality and preventing bugs from entering the codebase.

## Prerequisites

- Node.js 16+ installed
- Git repository initialized
- Project dependencies installed (`npm install`)

## Installation Steps

### 1. Install Dependencies

```bash
cd mobile  # or root directory for monorepo
npm install --save-dev husky lint-staged
```

### 2. Initialize Husky

```bash
# Enable Git hooks
npx husky install

# Add prepare script to package.json (auto-enables hooks after npm install)
npm pkg set scripts.prepare="husky install"
```

### 3. Create Pre-Commit Hook

```bash
# Create the pre-commit hook file
npx husky add .husky/pre-commit "npx lint-staged"
```

This will create a `.husky/pre-commit` file with the following content:

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

### 4. (Optional) Create Pre-Push Hook

For additional safety, create a pre-push hook that runs tests:

```bash
npx husky add .husky/pre-push "npm run test:ci"
```

### 5. Verify Setup

Test the hooks by making a commit:

```bash
git add .
git commit -m "test: verify husky setup"
```

You should see:
- ESLint running and fixing code
- Prettier formatting files
- TypeScript type checking (if configured in lint-staged)

## Configuration Files

### .lintstagedrc.json

Already configured in the project root:

```json
{
  "*.{ts,tsx}": [
    "eslint --fix --max-warnings=0",
    "prettier --write"
  ],
  "*.{js,jsx}": [
    "eslint --fix --max-warnings=0",
    "prettier --write"
  ],
  "*.{json,md,yml,yaml}": [
    "prettier --write"
  ]
}
```

### Package.json Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "prepare": "husky install",
    "lint": "eslint . --ext .ts,.tsx,.js,.jsx --max-warnings=0",
    "lint:fix": "eslint . --ext .ts,.tsx,.js,.jsx --fix",
    "format": "prettier --write \"**/*.{ts,tsx,js,jsx,json,md,yml,yaml}\"",
    "format:check": "prettier --check \"**/*.{ts,tsx,js,jsx,json,md,yml,yaml}\"",
    "type-check": "tsc --noEmit",
    "test:ci": "jest --ci --coverage --maxWorkers=2"
  }
}
```

## How It Works

### Pre-Commit Hook Flow

1. Developer runs `git commit`
2. Husky intercepts the commit
3. `lint-staged` runs on staged files only
4. For `.ts`/`.tsx` files:
   - ESLint runs with `--fix` flag
   - Prettier formats the code
   - Files are re-staged automatically
5. If any errors occur (ESLint errors, type errors), commit is blocked
6. If all checks pass, commit proceeds

### What Gets Checked

- **TypeScript/JavaScript files**: ESLint + Prettier
- **JSON/Markdown/YAML files**: Prettier only
- **Maximum warnings**: 0 (all warnings must be fixed)

## Troubleshooting

### Hooks Not Running

If hooks don't run after installation:

```bash
# Re-initialize Husky
rm -rf .husky
npx husky install
npx husky add .husky/pre-commit "npx lint-staged"
```

### Bypassing Hooks (Emergency Only)

To skip hooks in an emergency (NOT recommended):

```bash
git commit --no-verify -m "emergency fix"
```

**Warning**: Only use `--no-verify` in true emergencies. All bypassed commits should be cleaned up in a follow-up commit.

### Hooks Failing on CI/CD

In CI/CD environments, you may want to skip Husky installation:

```bash
# Set environment variable
HUSKY=0 npm install
```

Or in package.json:

```json
{
  "scripts": {
    "prepare": "husky install || true"
  }
}
```

### Windows Line Ending Issues

If you encounter line ending issues on Windows:

```bash
# Configure Git to handle line endings
git config core.autocrlf true

# Or for the repository only
git config --local core.autocrlf true
```

## Best Practices

1. **Never bypass hooks** unless absolutely necessary
2. **Fix warnings immediately** - don't accumulate technical debt
3. **Run `npm run lint` manually** before large commits to catch issues early
4. **Keep hooks fast** - only check staged files, not entire codebase
5. **Test hooks locally** before pushing to ensure they work for the team
6. **Update hook configs** when adding new file types or linters

## Advanced Configuration

### Adding Type Checking to Pre-Commit

To add TypeScript type checking to the pre-commit hook:

```json
{
  "*.{ts,tsx}": [
    "eslint --fix --max-warnings=0",
    "prettier --write",
    "bash -c 'npm run type-check'"
  ]
}
```

**Note**: This can slow down commits significantly. Consider moving type checking to pre-push instead.

### Adding Tests to Pre-Push

```bash
# Create pre-push hook
npx husky add .husky/pre-push "npm run test:ci"
```

This runs the full test suite before pushing to remote, catching bugs before they reach CI/CD.

### Monorepo-Specific Setup

For monorepo structure (mobile + shared packages):

```json
{
  "*.{ts,tsx}": [
    "bash -c 'cd $(git rev-parse --show-toplevel) && eslint --fix --max-warnings=0'",
    "prettier --write"
  ]
}
```

## Team Onboarding

When new developers join:

1. Clone repository
2. Run `npm install` (automatically runs `husky install` via `prepare` script)
3. Hooks are ready to use
4. First commit will verify hooks are working

## Maintenance

### Updating Husky

```bash
npm install --save-dev husky@latest
npx husky install
```

### Updating lint-staged

```bash
npm install --save-dev lint-staged@latest
```

## Resources

- [Husky Documentation](https://typicode.github.io/husky/)
- [lint-staged Documentation](https://github.com/okonet/lint-staged)
- [Git Hooks Documentation](https://git-scm.com/docs/githooks)

## Support

If you encounter issues with Husky setup:

1. Check this documentation first
2. Review error messages carefully
3. Verify all dependencies are installed
4. Consult the team's #dev-help channel
5. Open an issue in the repository

---

**Last Updated**: 2025-11-17
**Maintained By**: Frontend Specialist Team
