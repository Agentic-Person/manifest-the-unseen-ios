# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Manifest the Unseen** is a transformative iOS application that digitizes a 202-page manifestation workbook, combining structured exercises with AI-guided wisdom, voice journaling, and meditation practices.

**Current Status**: Active Development (~60% complete) - Build 36 on TestFlight, all 10 workbook phases implemented.

## Documentation Structure

All documentation is organized in `/docs/` with a central navigation hub at `docs/README.md`:

```
docs/
├── README.md                    # Start here - navigation hub
├── planning/                    # Core planning documents
│   ├── manifest-the-unseen-prd.md   # Product Requirements (definitive source)
│   ├── manifest-the-unseen-tdd.md   # Technical Design Document
│   ├── manifest-the-unseen-summary.md
│   └── mtu-roadmap.md               # Development roadmap
├── guides/
│   ├── setup/                   # 13 setup guides (React Native, Supabase, etc.)
│   ├── development/             # Code standards, tooling, testing
│   └── deployment/              # iOS workflow, TestFlight, migrations
├── features/
│   ├── guru-ai/                 # AI wisdom chat documentation
│   ├── subscriptions/           # RevenueCat integration
│   ├── voice-journal/           # Voice recording feature
│   └── meditation/              # Meditation player
├── security/
│   ├── audits/                  # Security audit reports
│   ├── guides/                  # Environment variables, API keys
│   └── scans/                   # Vulnerability scan results
├── operations/
│   ├── status/project-status.md # Current build status
│   └── known-issues.md
├── content/wisdom-sources/      # AI training content (transcripts, scriptures)
├── architecture/decisions/      # Architecture Decision Records (ADRs)
└── archive/                     # Historical docs (read-only)
```

### Key Documents
- **PRD**: `docs/planning/manifest-the-unseen-prd.md` - Complete requirements (1,670 lines)
- **TDD**: `docs/planning/manifest-the-unseen-tdd.md` - Technical architecture
- **Status**: `docs/operations/status/project-status.md` - Current build status
- **Security**: `docs/security/README.md` - Security documentation index

## ⚠️ CRITICAL: Project Status File Rules

**The `docs/operations/status/project-status.md` file is a VITAL working document.**

### NEVER DELETE OR CONDENSE INFORMATION

When updating project-status.md:

1. **ONLY ADD, NEVER DELETE** - Add new sections at the top, push older content down
2. **Keep ALL details** - Every bullet point, every file path, every commit hash matters
3. **Do NOT summarize or condense** existing entries to "save space"
4. **Do NOT replace detailed sections** with shorter versions
5. **Preserve the full history** - This document tracks the entire project journey

### When Adding New Entries

- Add new "Last Activity" section at top
- Move previous "Last Activity" to "Previous Activity"
- Keep ALL existing "Previous Activity" entries intact with full details
- Never truncate commit messages, file lists, or feature descriptions

### Archiving (ONLY when explicitly requested)

- The user will explicitly say "let's archive old entries" or similar
- User will review and approve what gets moved to archive
- Archived content goes to `MTU-project-status-archive.md`
- This is a manual process, NOT automatic

### File Size Governance

**Size Threshold**: When project-status.md exceeds **1,500 lines** (~60KB), alert the user:
> "Hey, project-status.md is now over 1,500 lines. Want to review for archiving?"

**Archiving Candidates** (safe to archive WITH user approval):
- Change log entries older than 30 days for features that are stable
- "Previous Activity" entries older than 2 weeks
- Resolved investigation sections where the fix is verified and shipped
- Build history for builds older than 10 versions back

**NEVER archive without asking**:
- Current/recent activity (last 2 weeks)
- Active bugs or investigations
- Current build information
- Features still being tested
- Any section the user hasn't explicitly approved for archiving

**Archive Process**:
1. Claude identifies candidates and presents a list to user
2. User approves/rejects each item
3. Approved items are MOVED (not deleted) to `MTU-project-status-archive.md`
4. A brief reference link remains in main file (e.g., "See archive for Dec 2025 entries")

### Why This Matters

- This file is essential for context when returning to the project
- Details that seem "old" may be needed for debugging or reference
- The user relies on this file to understand project history
- Losing information causes real problems and frustration

**If in doubt: ADD information, NEVER remove it.**

## Tech Stack (Finalized)

### Mobile App
- **Framework**: React Native with TypeScript
- **UI/Styling**: NativeWind (Tailwind CSS for React Native)
- **Navigation**: React Navigation 6+
- **State Management**: Zustand + TanStack Query (React Query)
- **Forms**: React Hook Form + Zod validation
- **Audio**: react-native-track-player
- **Voice Recording**: react-native-audio-recorder-player
- **Transcription**: OpenAI Whisper (on-device via react-native-whisper)
- **Subscriptions**: RevenueCat

### Backend
- **Platform**: Supabase (all-in-one)
  - PostgreSQL database with pgvector extension
  - Authentication (Apple Sign-In primary)
  - Real-time subscriptions
  - Storage (vision board images)
  - Edge Functions (Deno)
- **AI Services**:
  - Claude API (Anthropic) - primary wisdom chat
  - OpenAI GPT-4 - fallback/advanced reasoning
  - OpenAI embeddings (text-embedding-3-small) for RAG
  - pgvector for local similarity search (cost-effective)

### Shared Code Architecture
- Monorepo structure with `@manifest/shared` package
- Shared TypeScript models, validation schemas (Zod), API clients, hooks
- 60%+ code reuse between mobile and future web companion

## Key Architecture Decisions

### Why React Native (Not Native iOS)
- Cross-platform foundation (Android future expansion)
- Faster development with hot reload
- Shared business logic with potential web app
- Large ecosystem of libraries
- Still allows native modules when needed

### Why Supabase (Not Convex/Firebase)
- All-in-one: auth, database, storage, functions, real-time
- Built-in pgvector for AI embeddings (no external vector DB cost)
- Row Level Security (RLS) for data protection
- Standard PostgreSQL (easy migration if needed)
- Generous free tier, cost-effective scaling
- Excellent React Native SDK

### Voice Transcription Strategy
- OpenAI Whisper runs **on-device** (privacy-first, zero cost per transcription)
- Audio never leaves device, only text is synced
- Fast (1-2 seconds for typical journal entry)
- Works offline

### AI Chat Architecture (RAG)
1. User message → generate embedding via OpenAI API
2. Search local pgvector database for relevant knowledge
3. Pass context + user message to Claude API
4. Stream response back to user
5. Save conversation to Supabase

## Project Structure

```
manifest-the-unseen-ios/
├── CLAUDE.md                 # This file - AI assistant instructions
├── docs/                     # All documentation (see structure above)
├── mobile/                   # React Native app (Expo)
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── screens/          # Screen components (workbook phases, etc.)
│   │   ├── services/         # API clients, Supabase, RevenueCat
│   │   ├── stores/           # Zustand state management
│   │   ├── hooks/            # Custom React hooks
│   │   ├── utils/            # Utilities and helpers
│   │   └── theme/            # Design tokens, colors
│   └── app.json              # Expo configuration
├── packages/
│   └── shared/               # Shared TypeScript (models, validation, API)
├── supabase/
│   ├── migrations/           # Database migrations
│   └── functions/            # Edge Functions (Deno)
└── meditation-audio/         # Audio assets for meditations
```

## 🚨 CRITICAL: NEVER BUILD WITHOUT EXPLICIT APPROVAL

**BUILDS COST MONEY. DO NOT INITIATE BUILDS WITHOUT THE USER'S DIRECT INSTRUCTION.**

### Rules for EAS Builds:

1. **NEVER run `eas build` without the user explicitly saying:**
   - "Build it now"
   - "Create a build"
   - "Push to TestFlight"
   - Or similar clear, direct instruction

2. **ALWAYS ask first if unsure:**
   - "Are you ready for me to build this now?"
   - "Should I create build [X] with these changes?"
   - "Do you want to test locally first, or build for TestFlight?"

3. **Code changes ≠ Build approval:**
   - Just because you fixed bugs or added features does NOT mean build immediately
   - The user may want to make additional changes
   - The user may want to test locally first
   - The user may want to review the changes before spending money on a build

4. **When in doubt, DON'T BUILD:**
   - Commit and push code changes
   - Tell the user what's ready
   - Let THEM decide when to build

### Why This Matters:
- Each build costs money (EAS build credits)
- The user needs to coordinate TestFlight releases
- There may be multiple changes to batch together
- Building prematurely wastes money and creates unnecessary versions

**Remember: Your job is to prepare code for builds, not to decide when to build.**

## TestFlight Build Checklist

**IMPORTANT: Before creating a TestFlight build, ALWAYS complete these steps:**

1. ✅ **Commit all changes** - `git add . && git commit -m "message"`
2. ✅ **Push to GitHub** - `git push origin main`
3. ✅ **Increment build number** - Update `mobile/app.json` → `expo.ios.buildNumber`
4. ✅ **Commit the build number** - `git commit -am "build: increment iOS build number to X"`
5. ✅ **Push again** - `git push origin main`
6. ✅ **ASK USER FOR APPROVAL** - "Ready to build? All changes are committed."
7. ✅ **Run EAS build** (only after user approves) - `cd mobile && eas build --platform ios --profile production --non-interactive`
8. ✅ **Submit to App Store Connect** (after build completes) - `cd mobile && eas submit --platform ios --latest`

**Why this matters**: EAS Build pulls from the GitHub repository. If you don't commit and push, your build won't include your latest changes!

```bash
# Quick pre-build check
git status                    # Should show "nothing to commit, working tree clean"
git log --oneline -1          # Verify your latest commit is what you expect
git push origin main          # Ensure remote is up to date
```

## Development Commands (When Implemented)

These commands will be standard for a React Native + Supabase project:

### React Native Mobile App
```bash
# Install dependencies
cd mobile && npm install

# iOS development
npm run ios              # Run on iOS simulator
npm run ios:device       # Run on physical device

# Android (future)
npm run android

# Testing
npm test                 # Run Jest tests
npm run test:watch       # Watch mode
npm run lint             # ESLint
npm run type-check       # TypeScript

# Build for production
npm run build:ios        # iOS release build
```

### Supabase Backend
```bash
# Local development
npx supabase start       # Start local Supabase
npx supabase stop        # Stop local instance

# Database
npx supabase db reset    # Reset local DB
npx supabase db push     # Push migrations to remote
npx supabase db pull     # Pull remote schema

# Functions
npx supabase functions serve    # Run functions locally
npx supabase functions deploy   # Deploy to production

# Types
npx supabase gen types typescript --local > types/database.types.ts
```

### Shared Package
```bash
cd packages/shared
npm run build           # Build TypeScript
npm run dev             # Watch mode
npm run test            # Run tests
```

## High-Level Architecture

### Data Flow for Core Features

**Voice Journaling**:
1. User taps record → `react-native-audio-recorder-player` captures audio
2. On stop → audio file saved locally (temporary)
3. Whisper (on-device) transcribes → text output
4. Text saved to Supabase `journal_entries` table via shared API client
5. Audio file deleted (privacy)
6. Text synced across devices via Supabase Realtime

**AI Wisdom Chat**:
1. User message → Supabase Edge Function `ai-chat`
2. Function generates embedding via OpenAI API
3. Search pgvector database with similarity threshold
4. Top 5 relevant passages retrieved as context
5. Context + message sent to Claude API
6. Response streamed back to user
7. Conversation saved to `ai_conversations` table

**Workbook Progress**:
- Forms built with React Hook Form + Zod validation
- Auto-save every 30 seconds to Supabase via TanStack Query mutation
- Optimistic updates for instant UX
- RLS policies ensure users only see their own data
- Progress calculated from `workbook_progress` table

**Meditation Player**:
- Audio files stored in Supabase Storage
- `react-native-track-player` for playback (background support)
- Session tracking in `meditation_sessions` table
- Offline: cached audio files, queue sync when online

### Database Schema (Key Tables)

```sql
-- Core tables
users                    -- Synced with Supabase Auth
workbook_progress        -- JSONB data field for flexible worksheet storage
journal_entries          -- Full-text search enabled (tsvector)
meditations             -- Audio metadata, tier gating
meditation_sessions     -- Usage tracking
ai_conversations        -- JSONB messages array
vision_boards           -- JSONB images array
knowledge_embeddings    -- vector(1536) for RAG, ivfflat index

-- All tables have RLS enabled for user data isolation
```

### Subscription Tiers (RevenueCat)

Three tiers with 7-day free trial:
1. **Novice Path** ($7.99/mo, $59.99/yr): Phases 1-5, 3 meditations, 50 journals/mo
2. **Awakening Path** ($12.99/mo, $99.99/yr): Phases 1-8, 6 meditations, 200 journals/mo
3. **Enlightenment Path** ($19.99/mo, $149.99/yr): All 10 phases, unlimited everything

Feature gating enforced via:
- RevenueCat entitlements (source of truth)
- Supabase RLS policies (database level)
- Client-side checks (UX)

## Important Conventions

### When Starting Development

1. **Read the PRD first** (`docs/planning/manifest-the-unseen-prd.md`) - comprehensive source of truth
2. **Reference TDD** (`docs/planning/manifest-the-unseen-tdd.md`) for implementation details
3. **Check current status** (`docs/operations/status/project-status.md`) for what's already built
4. **Review setup guides** in `docs/guides/setup/` for environment configuration
5. **Check security docs** (`docs/security/`) before handling sensitive data

### Code Organization

- **Shared business logic** goes in `packages/shared` (models, validation, utilities, hooks)
- **Platform-specific UI** stays in `mobile/src/components`
- **API calls** always go through the shared Supabase client (type-safe)
- **Database queries** use TanStack Query hooks (caching, optimistic updates)
- **Forms** use React Hook Form + Zod schemas from shared package

### Security & Privacy

- Journal entries must be encrypted before storing (use react-native-keychain for keys)
- Enable RLS on ALL user tables in Supabase
- Never log sensitive data (journal content, user PII)
- API keys in environment variables, never hardcoded
- Whisper transcription stays on-device (privacy-first design)

### Performance

- Use `FlatList` for long lists (virtualization)
- Memoize expensive computations (`useMemo`, `useCallback`, `React.memo`)
- Lazy load screens with `React.lazy`
- Optimize images with `react-native-fast-image`
- Use Hermes JavaScript engine (enabled by default)

## Development Timeline

**Total: 28 weeks (~7 months) to App Store launch**

- **Weeks 1-2**: Setup, design system, Supabase configuration
- **Weeks 3-8**: Auth, navigation, Phases 1-3, voice journaling MVP
- **Weeks 9-14**: Phases 4-10, meditation/breathing system, progress tracking
- **Weeks 15-20**: AI knowledge base, chat RAG implementation, vision boards
- **Weeks 21-24**: Subscriptions (RevenueCat), analytics, polish
- **Weeks 25-28**: Testing, TestFlight beta, App Store submission

## Content Requirements

The app digitizes a 202-page workbook with 10 phases:
1. Self-Evaluation (Wheel of Life, SWOT, values, habits)
2. Values & Vision (vision boards, purpose)
3. Goal Setting (SMART goals, action plans)
4. Facing Fears & Limiting Beliefs (cognitive restructuring)
5. Cultivating Self-Love & Self-Care
6. Manifestation Techniques (3-6-9 Method, WOOP, scripting, etc.)
7. Practicing Gratitude
8. Turning Envy Into Inspiration
9. Trust & Surrender
10. Trust & Letting Go

**Content Status**:
- 18 meditation audio files completed (in `meditation-audio/`)
- All 10 workbook phases digitized and implemented
- Daily inspiration quotes integrated
- AI knowledge base populated (see `docs/content/wisdom-sources/`)
- UI assets complete

## AI Knowledge Sources

AI monk companion (Guru) trained on wisdom sources in `docs/content/wisdom-sources/`:
- `shi-heng-yi-mindset.md` - Mindset and manifestation teachings
- `book-essence-hub.md` - Book summaries and wisdom
- `scriptures-kjv.md` - Biblical references for meditation content
- `system-instructions-app-dev.md` - App-specific AI instructions

**RAG Implementation**: Content chunked, embedded with OpenAI (text-embedding-3-small), stored in Supabase pgvector for similarity search.

**Guru AI Documentation**: See `docs/features/guru-ai/` for system prompt design and testing.

## Common Pitfalls to Avoid

1. **Don't use native Swift/SwiftUI** - This is React Native, not native iOS
2. **Don't ignore the PRD** - It contains critical business logic and feature requirements
3. **Don't skip RLS setup** - Security is foundational, not an afterthought
4. **Don't store audio files** - Only transcribed text, for privacy and cost
5. **Don't hardcode tier limits** - Use RevenueCat entitlements as source of truth
6. **Don't build web app first** - Mobile iOS is MVP priority
7. **Don't use cloud vector databases** - pgvector is local to Supabase (cost savings)

## Testing Strategy

- **Unit tests**: Jest for shared package (models, validation, utilities)
- **Component tests**: React Native Testing Library for UI
- **Integration tests**: Test Supabase queries with test database
- **E2E tests**: Detox for critical user flows (post-MVP)
- **Manual testing**: TestFlight beta with 50-100 users (Week 25-26)

Target: 60%+ code coverage for shared package, critical paths tested for mobile app.

## Monitoring & Analytics

**Analytics** (TelemetryDeck - privacy-focused):
- App lifecycle events (open, background, crash)
- Feature usage (journal created, meditation completed, AI chat)
- Conversion funnel (trial start → subscription purchase)
- Retention metrics (D1, D7, D30)

**Error Tracking** (Sentry):
- Crash reporting with stack traces
- Performance monitoring
- User breadcrumbs for debugging

**Business Metrics**:
- Trial → Paid conversion target: 25-35%
- D7 retention target: 30%+
- Monthly meditation sessions per user: 12+
- Journal entries per user per week: 3+

## Cost Estimates

**Monthly Operating Costs**:
- Month 1: ~$40 (Supabase free, OpenAI $10, Claude $30)
- Month 6: ~$175 (Supabase $25, OpenAI $30, Claude $100, Vercel $20)
- Month 12: ~$450-500 (Supabase $75, OpenAI $75, Claude $300, Vercel $20, Sentry $26)

**Revenue Projections (Year 1)**:
- Month 1: $1,750 MRR (1,000 downloads, 25% conversion)
- Month 6: $18,480 MRR (8,000 downloads, 30% conversion)
- Month 12: $73,500 MRR (25,000 downloads, 35% conversion) = $450K annual revenue

## Success Criteria

**MVP Launch**:
- App approved on App Store
- <1% crash rate
- 4.0+ star rating
- 1,000 downloads in Month 1
- 25%+ trial→paid conversion

**6 Months**:
- 8,000+ downloads
- 4.5+ star rating
- 30% conversion rate
- $18K MRR

**12 Months**:
- 25,000+ downloads
- 4.7+ star rating
- Featured in App Store wellness category
- Android version planning begins

## Current Development Focus

The app is ~60% complete. Key areas for continued development:

1. **Check `docs/operations/status/project-status.md`** for current build status and blockers
2. **Review `docs/planning/mtu-roadmap.md`** for remaining features
3. **Test on TestFlight** - Build 36 is live for testing
4. **Security**: All critical security issues resolved (see `docs/security/audits/`)

### Recently Completed
- All 10 workbook phases implemented
- Guru AI with dynamic phase analysis
- Subscription tiers with RevenueCat
- Feature gating for free/paid users
- 18 meditation audio files

### Remaining Work
- TypeScript error fixes
- UI polish and animations
- Additional testing
- App Store submission preparation

This is a **well-planned, ambitious project** with clear requirements and solid architecture. Reference the PRD and TDD in `docs/planning/` for any implementation questions.
