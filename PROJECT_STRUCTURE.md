# Project Structure: Manifest the Unseen

**Status**: Week 1 Complete - Infrastructure Documentation Ready
**Phase**: Pre-Development (Week 1 of 28)

---

## 📁 Root Directory

```
manifest-the-unseen-ios/
├── README.md                    # Project overview & quick start
├── CLAUDE.md                    # AI agent instructions & project guide
├── PROJECT_STRUCTURE.md         # This file - directory guide
├── package.json                 # Monorepo workspace configuration
├── .gitignore                   # Git ignore rules
├── .env.example                 # Environment variables template
│
├── agent-orchestration/         # 🤖 Agent workflow & orchestration
├── docs/                        # 📚 All documentation & guides
├── mobile/                      # 📱 React Native iOS app (templates)
├── packages/                    # 📦 Shared code (monorepo)
├── supabase/                    # 🗄️ Backend (migrations, functions, seeds)
├── scripts/                     # 🔧 Utility scripts
│
└── [Config Files]               # ESLint, Prettier, etc.
```

---

## 🤖 Agent Orchestration (`agent-orchestration/`)

**Purpose**: Manage the 28-week development with AI specialist agents

```
agent-orchestration/
│
├── orchestrator/                # Master planning & coordination
│   ├── master-plan.md          # 28-week roadmap (source of truth)
│   ├── workflow-guide.md       # Daily/weekly orchestration process
│   ├── dependencies.md         # Task dependency mapping
│   └── weekly-schedules/       # Week-by-week breakdowns
│
├── agents/                      # Specialist agent configurations
│   ├── explore/                # Codebase exploration agents
│   ├── implement/              # Feature implementation specialists
│   ├── test/                   # Testing specialists
│   ├── review/                 # Code/security reviewers
│   └── docs/                   # Documentation agents
│
├── tasks/                       # Task tracking
│   ├── active/                 # Currently in progress
│   │   ├── TASK-2025-11-002.md   # Supabase setup
│   │   ├── TASK-2025-11-003.md   # React Native init
│   │   ├── TASK-2025-11-004.md   # Navigation & state
│   │   ├── TASK-2025-11-005.md   # Dependencies & API keys
│   │   ├── TASK-2025-11-006.md   # Dev tooling
│   │   └── TASK-2025-11-007.md   # Week 1 wrap-up
│   ├── completed/              # Finished tasks
│   ├── blocked/                # Blocked tasks
│   └── templates/              # Task templates
│
├── workstreams/                 # Feature-based organization
│   ├── authentication/         # Auth workstream
│   ├── workbook-system/        # Workbook workstream
│   ├── voice-journaling/       # Voice journaling workstream
│   ├── meditation-player/      # Meditation player workstream
│   ├── ai-chat/                # AI chat workstream
│   ├── vision-boards/          # Vision boards workstream
│   └── subscriptions/          # Subscriptions workstream
│
├── logs/                        # Activity & decision logging
│   ├── sessions/               # Daily session logs
│   │   └── 2025-11/
│   │       ├── session-2025-11-17.md  # Day 1
│   │       ├── session-2025-11-18.md  # Day 2
│   │       ├── session-2025-11-19.md  # Day 3
│   │       ├── session-2025-11-20.md  # Day 4
│   │       ├── session-2025-11-21.md  # Day 5
│   │       └── WEEK-1-SUMMARY.md      # Week 1 complete summary
│   └── decisions/              # Architecture Decision Records (ADRs)
│       ├── template-adr.md
│       └── ADR-001-react-native-tech-stack.md
│
└── prompts/                     # Agent system prompts
    ├── system-prompts/         # Specialist agent prompts
    └── task-prompts/           # Reusable task patterns
```

---

## 📚 Documentation (`docs/`)

**Purpose**: All setup guides, references, and technical documentation

```
docs/
│
├── manifest-the-unseen-prd.md  # Product Requirements Document (PRD)
├── manifest-the-unseen-tdd.md  # Technical Design Document (TDD)
├── manifest-the-unseen-summary.md  # Quick reference summary
│
├── [Setup Guides - 14 files]
│   ├── supabase-setup-guide.md          # Backend setup (comprehensive)
│   ├── auth-providers-config.md         # Apple Sign-In + email/password
│   ├── backend-quick-start.md           # 30-minute quick start
│   ├── react-native-setup-guide.md      # Frontend setup (comprehensive)
│   ├── dependencies-setup-guide.md      # All npm packages
│   ├── api-keys-guide.md                # Claude, OpenAI, RevenueCat, Apple
│   ├── ios-permissions-guide.md         # Permissions & privacy
│   └── TOOLING_README.md                # Development tools overview
│
├── [Reference Docs - 6 files]
│   ├── folder-structure.md              # Monorepo organization
│   ├── setup-checklist.md               # Quick verification checklist
│   ├── CODE_STANDARDS.md                # Coding guidelines (14KB)
│   ├── HUSKY_SETUP.md                   # Git hooks
│   ├── PACKAGE_JSON_SCRIPTS.md          # npm commands reference
│   ├── TOOLING_SETUP_CHECKLIST.md       # Tooling setup steps
│   └── TOOLING_SUMMARY.md               # Complete tooling overview
│
├── [Task Summaries - 3 files]
│   ├── TASK-2025-11-002-SUMMARY.md      # Supabase deliverables
│   ├── TASK-2025-11-003-SUMMARY.md      # React Native deliverables
│   └── TASK-2025-11-005-SUMMARY.md      # Dependencies deliverables
│
└── example-configs/             # Template configuration files
    ├── mobile-package.json      # Dependencies list
    ├── mobile-tsconfig.json     # TypeScript config
    ├── mobile-metro.config.js   # Metro bundler
    ├── mobile-babel.config.js   # Babel config
    ├── mobile-tailwind.config.js  # NativeWind theme
    ├── mobile-eslintrc.js       # ESLint rules
    ├── mobile-prettierrc.js     # Prettier config
    ├── mobile-jest.config.js    # Jest config
    └── mobile-jest.setup.js     # Test setup
```

---

## 📱 Mobile App (`mobile/`)

**Purpose**: React Native iOS app (template/example code from Week 1)

**Note**: This is NOT a functioning app yet - it's template code created during Week 1 to demonstrate structure. Actual implementation begins Week 2+.

```
mobile/
│
├── package.json                 # Mobile app dependencies
├── tsconfig.json                # TypeScript configuration
├── App.tsx                      # Root component with providers
│
├── [Setup Documentation]
│   ├── README.md                # Mobile app overview
│   ├── SETUP.md                 # Setup instructions
│   ├── INSTALL_DEPENDENCIES.md  # Quick install guide
│   ├── SETUP_VERIFICATION.md    # Verification checklist
│   └── NAVIGATION_STATE_SETUP.md  # Architecture overview
│
└── src/
    ├── index.ts                 # Central exports
    │
    ├── navigation/              # React Navigation
    │   ├── RootNavigator.tsx   # Root with auth flow
    │   └── MainTabNavigator.tsx  # Bottom tabs (5 tabs)
    │
    ├── screens/                 # Screen components (examples)
    │   ├── HomeScreen.tsx       # Dashboard placeholder
    │   ├── WorkbookScreen.tsx   # Workbook placeholder
    │   ├── MeditateScreen.tsx   # Meditation placeholder
    │   ├── JournalScreen.tsx    # Journal placeholder
    │   └── ProfileScreen.tsx    # Profile placeholder
    │
    ├── stores/                  # Zustand state management
    │   ├── index.ts            # Centralized exports
    │   ├── authStore.ts        # Auth & user state
    │   ├── settingsStore.ts    # App settings
    │   └── appStore.ts         # Global app state
    │
    ├── services/                # External services
    │   ├── index.ts            # Centralized exports
    │   ├── supabase.ts         # Supabase client & helpers
    │   └── queryClient.ts      # TanStack Query config
    │
    ├── hooks/                   # Custom React hooks
    │   └── useUser.ts          # User query hooks (example)
    │
    └── types/                   # TypeScript definitions
        ├── navigation.ts        # Navigation types
        ├── store.ts            # Store types
        └── database.ts         # Supabase schema types
```

---

## 📦 Shared Package (`packages/shared/`)

**Purpose**: Shared TypeScript code between mobile and future web app (60%+ code reuse)

```
packages/shared/
│
├── package.json                 # Shared package config
├── tsconfig.json                # TypeScript config
├── .eslintrc.js                # ESLint rules
├── jest.config.js              # Jest testing config
├── README.md                    # Package documentation
│
└── src/
    ├── index.ts                 # Main entry point
    │
    ├── models/                  # TypeScript interfaces
    │   └── index.ts            # User, Workbook, Journal, Meditation, etc.
    │
    ├── validation/              # Zod schemas
    │   └── index.ts            # Runtime validation schemas
    │
    ├── constants/               # App constants
    │   └── index.ts            # Tier limits, pricing, phases, colors
    │
    ├── utils/                   # Utility functions
    │   └── index.ts            # Date, text, array, validation helpers
    │
    ├── api/                     # API clients (placeholder)
    │   └── index.ts
    │
    └── hooks/                   # React hooks (placeholder)
        └── index.ts
```

---

## 🗄️ Backend (`supabase/`)

**Purpose**: Supabase backend (database, auth, functions, storage)

```
supabase/
│
├── config.toml                  # Supabase local dev config
├── README.md                    # Backend documentation
├── seed.sql                     # Seed data (12 meditations)
│
├── migrations/                  # Database migrations
│   ├── 20250101000000_initial_schema.sql   # 8 tables, RLS policies
│   └── 20250102000000_auth_triggers.sql    # Auto-create user profiles
│
└── functions/                   # Edge Functions
    └── ai-chat/
        └── index.ts            # AI monk chat with RAG (Claude + pgvector)
```

---

## 🔧 Scripts (`scripts/`)

**Purpose**: Utility scripts for testing and automation

```
scripts/
└── test-supabase-connection.js  # Automated backend testing (8 tests)
```

---

## ⚙️ Config Files (Root)

**Purpose**: Development tooling configuration

```
.eslintrc.js                     # ESLint configuration
.prettierrc                      # Prettier formatting rules
.prettierignore                  # Prettier ignore patterns
.lintstagedrc.json              # Pre-commit hook config
.gitignore                       # Git ignore rules
.env.example                     # Environment variables template
package.json                     # Monorepo workspace config
```

---

## 🚫 Ignored Files (`.gitignore`)

**Not tracked in Git**:
- `.env` - Your actual environment variables (secrets)
- `.mcp.json`, `mcp.json`, `ui.mcp.json` - MCP config (contains tokens)
- `node_modules/` - Dependencies
- Build outputs, logs, temp files

---

## 📊 Project Status

### Week 1 Complete ✅
- **96 files created** (~200KB documentation & code)
- **Backend**: Supabase schema, migrations, Edge Functions
- **Frontend**: React Native structure, navigation, state
- **Documentation**: 20+ comprehensive guides
- **Tooling**: ESLint, Prettier, TypeScript configured

### Next: Week 2 (Requires MCP Server Setup)
- Design system (colors, typography, components)
- Database migrations (run the SQL we created)
- pgvector setup for AI

---

## 🎯 Quick Reference

### Key Documents to Read
1. **README.md** - Project overview & quick start
2. **CLAUDE.md** - Complete project context for AI agents
3. **agent-orchestration/logs/sessions/2025-11/WEEK-1-SUMMARY.md** - What we accomplished

### Setup Guides (When Ready to Implement)
1. **docs/react-native-setup-guide.md** - Initialize React Native project
2. **docs/supabase-setup-guide.md** - Set up Supabase backend
3. **docs/dependencies-setup-guide.md** - Install all packages
4. **docs/api-keys-guide.md** - Obtain API keys

### For Development
- **Code Standards**: `docs/CODE_STANDARDS.md`
- **Folder Structure**: `docs/folder-structure.md`
- **Scripts Reference**: `docs/PACKAGE_JSON_SCRIPTS.md`

---

**Last Updated**: 2025-11-17 (Week 1 Complete)
**Status**: Infrastructure documented, ready for Week 2 implementation
