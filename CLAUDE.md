# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Manifest the Unseen** is a transformative iOS application that digitizes a 202-page manifestation workbook, combining structured exercises with AI-guided wisdom, voice journaling, and meditation practices.

**Current Status**: Planning/Pre-Development Phase - This repository contains comprehensive planning documents but no implementation code yet.

## Critical Context

This is currently a **documentation-only repository**. All project requirements, technical specifications, and business decisions are documented in `/docs/`:

- **manifest-the-unseen-prd.md** - Complete Product Requirements Document (202KB, definitive source)
- **manifest-the-unseen-tdd.md** - Technical Design Document with React Native + Supabase architecture
- **manifest-the-unseen-summary.md** - Quick reference summary of key decisions
- Additional transcripts with source wisdom content (Shi Heng Yi, Book Essence Hub)

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

## Project Structure (Planned)

```
manifest-the-unseen/
├── docs/                      # Current: Planning documents
├── packages/
│   └── shared/               # Shared TypeScript (models, validation, API, hooks)
├── mobile/                   # React Native app (iOS primary, Android future)
├── web/                      # Optional: Next.js companion web app
└── supabase/                 # Database migrations, Edge Functions, seed data
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

1. **Read the PRD first** (`docs/manifest-the-unseen-prd.md`) - it's the comprehensive source of truth (1,663 lines)
2. **Reference TDD** (`docs/manifest-the-unseen-tdd.md`) for implementation details
3. **Initialize in this order**:
   - Set up Supabase project + run migrations
   - Create React Native app with TypeScript
   - Set up monorepo structure
   - Configure authentication (Apple Sign-In)
   - Build shared package first (models, API client)
   - Then build mobile app features

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

**Content to Prepare**:
- 12 meditation audio files (6 sessions × 2 narrators: male + female)
- Workbook exercise content digitization (forms, prompts)
- 365+ daily inspiration quotes
- AI knowledge base ingestion (PDFs, transcripts in `/docs`)
- UI assets (icons, illustrations, animations)

## AI Knowledge Sources

AI monk companion trained on:
- Complete Lunar Rivers "Manifest the Unseen" book content
- Workbook methodology (all 10 phases)
- Shi Heng Yi mindset teachings (transcript in `/docs`)
- Book Essence Hub content (transcript in `/docs`)
- Nikola Tesla writings on energy, frequency, vibration, 3-6-9 principles

**RAG Implementation**: Content chunked, embedded with OpenAI (text-embedding-3-small), stored in Supabase pgvector for similarity search.

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

## When Implementation Begins

Future Claude instances should:

1. Start by creating the Supabase project and running database migrations from TDD
2. Initialize React Native with TypeScript template
3. Set up monorepo structure with Yarn/pnpm workspaces
4. Build shared package first (foundation for everything)
5. Implement authentication before any features
6. Follow the 28-week timeline from PRD Section 12
7. Reference both PRD and TDD constantly - they're comprehensive and authoritative

This is a **well-planned, ambitious project** with clear requirements, solid architecture decisions, and realistic timeline. The planning phase is complete - ready for implementation.
