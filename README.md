# Manifest the Unseen

**A transformative iOS application that digitizes a 202-page manifestation workbook, combining structured exercises with AI-guided wisdom, voice journaling, and meditation practices.**

---

## Project Status

**Phase:** Pre-Development - Infrastructure Setup
**Current Week:** Week 1 (Days 1-5)
**Latest Completed Task:** TASK-2025-11-003 - React Native Setup Documentation

---

## What Is This Project?

Manifest the Unseen is a comprehensive manifestation and personal development app featuring:

- **Digital Workbook** - All 202 pages of the manifestation workbook digitized into interactive forms
- **Voice Journaling** - Tap-to-record journaling with on-device Whisper transcription
- **Meditation Library** - 12 guided meditations (6 sessions × 2 narrators)
- **Breathing Exercises** - Animated breathing techniques with haptic feedback
- **AI Monk Companion** - Claude-powered wisdom chat trained on manifestation teachings
- **Vision Boards** - Create and maintain visual manifestation boards
- **Progress Tracking** - Comprehensive analytics and achievement system

---

## Tech Stack

### Mobile App
- **Framework:** React Native with TypeScript
- **Styling:** NativeWind (Tailwind CSS for React Native)
- **Navigation:** React Navigation 6+
- **State Management:** Zustand + TanStack Query (React Query)
- **Forms:** React Hook Form + Zod validation
- **Audio:** react-native-track-player, react-native-audio-recorder-player
- **Transcription:** OpenAI Whisper (on-device)

### Backend
- **Platform:** Supabase (PostgreSQL + Auth + Storage + Edge Functions)
- **AI Services:** Claude API (Anthropic), OpenAI GPT-4
- **Vector Database:** pgvector (built into Supabase)
- **Subscriptions:** RevenueCat + StoreKit 2

### Shared Code
- **Monorepo:** npm workspaces
- **Shared Package:** `@manifest/shared` (TypeScript models, validation, utilities)

---

## Project Structure

```
manifest-the-unseen/
├── docs/                       # Documentation
│   ├── manifest-the-unseen-prd.md
│   ├── manifest-the-unseen-tdd.md
│   ├── react-native-setup-guide.md
│   ├── folder-structure.md
│   ├── setup-checklist.md
│   └── example-configs/
│
├── mobile/                     # React Native app (to be created)
│   └── (iOS app will be here)
│
├── packages/
│   └── shared/                 # Shared TypeScript code
│       ├── src/
│       │   ├── models/         # Data models
│       │   ├── validation/     # Zod schemas
│       │   ├── constants/      # Configuration
│       │   ├── utils/          # Utilities
│       │   ├── api/            # API clients
│       │   └── hooks/          # React hooks
│       └── package.json
│
├── supabase/                   # Backend (to be created)
│   └── (migrations, functions)
│
├── agent-orchestration/        # AI agent workflow
│   ├── tasks/
│   ├── agents/
│   └── workstreams/
│
├── package.json                # Monorepo root
├── CLAUDE.md                   # Claude Code instructions
└── README.md                   # This file
```

---

## Getting Started

### Prerequisites

Before you begin, ensure you have:

- **Node.js** v18+ ([Download](https://nodejs.org/))
- **Xcode** 15.0+ with Command Line Tools
- **CocoaPods** (`sudo gem install cocoapods`)
- **Watchman** (`brew install watchman`)
- **iOS Simulator** (installed via Xcode)

### Setup Instructions

**Step 1: Clone Repository** (when available)
```bash
git clone <repository-url>
cd manifest-the-unseen
```

**Step 2: Follow Setup Guide**
```bash
# Read the comprehensive setup guide
cat docs/react-native-setup-guide.md

# Or use the quick checklist
cat docs/setup-checklist.md
```

**Step 3: Initialize Project**

Follow the step-by-step instructions in `docs/react-native-setup-guide.md` to:
1. Initialize React Native with TypeScript
2. Set up monorepo structure
3. Configure NativeWind styling
4. Set up TypeScript strict mode
5. Create folder structure
6. Verify build

**Estimated Setup Time:** 6-8 hours

---

## Documentation

### Essential Reading

1. **[React Native Setup Guide](docs/react-native-setup-guide.md)** - Complete setup instructions
2. **[Setup Checklist](docs/setup-checklist.md)** - Quick reference checklist
3. **[Folder Structure](docs/folder-structure.md)** - Project organization guide
4. **[CLAUDE.md](CLAUDE.md)** - Claude Code project instructions

### Product Documentation

- **[Product Requirements Document (PRD)](docs/manifest-the-unseen-prd.md)** - Complete product specification
- **[Technical Design Document (TDD)](docs/manifest-the-unseen-tdd.md)** - Technical architecture
- **[Summary](docs/manifest-the-unseen-summary.md)** - Quick reference

### Task Documentation

- **[TASK-2025-11-003 Summary](docs/TASK-2025-11-003-SUMMARY.md)** - React Native setup task summary

---

## Development

### Current Status (Week 1)

- [x] **Day 1:** Planning and documentation review
- [x] **Day 2:** Supabase setup documentation (TASK-002)
- [x] **Day 3:** React Native setup documentation (TASK-003) ← **YOU ARE HERE**
- [ ] **Day 4:** Project initialization and build verification
- [ ] **Day 5:** Core dependencies installation

### Available Commands (After Setup)

```bash
# From monorepo root
npm run mobile:ios          # Run iOS app
npm run mobile:android      # Run Android app (future)
npm run shared:build        # Build shared package
npm run shared:dev          # Watch shared package
npm run lint                # Lint all workspaces
npm run type-check          # TypeScript check all workspaces
npm run test                # Test all workspaces
npm run clean               # Clean node_modules
npm run install-all         # Install all dependencies
```

---

## Architecture Highlights

### Why React Native?
- Cross-platform foundation (Android expansion planned)
- Faster development with hot reload
- Shared business logic with future web app
- Large ecosystem of libraries

### Why Monorepo?
- Share code between mobile and future web app
- Single source of truth for models and validation
- Easier dependency management
- Consistent TypeScript configuration

### Why Supabase?
- All-in-one backend (auth, database, storage, functions)
- Built-in pgvector for AI embeddings (no external vector DB)
- Row Level Security for data protection
- Generous free tier, cost-effective scaling

### Privacy-First Approach
- Voice transcription happens **on-device** (Whisper)
- Audio never leaves the device
- End-to-end encryption for journal entries
- No user data sold or shared

---

## Roadmap

### Week 1-2: Pre-Development
- [x] Documentation and planning
- [ ] Environment setup
- [ ] Supabase configuration
- [ ] Design system creation

### Week 3-8: Phase 1 - Foundation
- [ ] Authentication (Apple Sign-In)
- [ ] Navigation structure
- [ ] Workbook Phases 1-3
- [ ] Voice journaling MVP

### Week 9-14: Phase 2 - Features
- [ ] Workbook Phases 4-10
- [ ] Meditation player
- [ ] Breathing exercises
- [ ] Progress tracking

### Week 15-20: Phase 3 - AI & Advanced
- [ ] AI knowledge base ingestion
- [ ] Monk chat (RAG implementation)
- [ ] Vision boards
- [ ] Analytics

### Week 21-24: Phase 4 - Subscriptions
- [ ] RevenueCat integration
- [ ] Paywall implementation
- [ ] Feature gating
- [ ] Polish and optimization

### Week 25-28: Phase 5 - Launch
- [ ] QA testing
- [ ] TestFlight beta
- [ ] App Store submission
- [ ] Launch!

**Total Timeline:** 28 weeks (~7 months)

---

## Business Model

### Subscription Tiers

1. **Novice Path** - $7.99/month, $59.99/year
   - Phases 1-5, 3 meditations, 50 journals/month

2. **Awakening Path** - $12.99/month, $99.99/year ⭐ Most Popular
   - Phases 1-8, 6 meditations, 200 journals/month

3. **Enlightenment Path** - $19.99/month, $149.99/year
   - All 10 phases, unlimited everything

**Free Trial:** 7 days, full Enlightenment access

---

## Contributing

This is currently a private project in development. For questions or contributions, please contact the project team.

### Development Guidelines

- Follow TypeScript strict mode (no `any` types)
- Use NativeWind for all styling
- Write tests for new features
- Follow folder structure conventions
- Use shared package for cross-platform code

---

## Resources

### Official Documentation
- [React Native](https://reactnative.dev/docs/getting-started)
- [NativeWind](https://www.nativewind.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Supabase](https://supabase.com/docs)
- [Zustand](https://github.com/pmndrs/zustand)
- [TanStack Query](https://tanstack.com/query/latest)

### External APIs
- [Anthropic Claude](https://docs.anthropic.com/)
- [OpenAI](https://platform.openai.com/docs)
- [RevenueCat](https://docs.revenuecat.com/)

---

## License

UNLICENSED - Proprietary

---

## Contact

**Project Team:**
- Product Owner: [To be added]
- Technical Lead: [To be added]
- Frontend Specialist: [To be added]
- Backend Specialist: [To be added]

**Repository:** [To be added]
**Project Management:** [To be added]

---

**Last Updated:** November 17, 2025
**Version:** 1.0.0-alpha
**Status:** Pre-Development Phase

---

Let's build something transformative! 🚀✨
