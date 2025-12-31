# Manifest the Unseen - Master Development Plan

**Project**: Manifest the Unseen iOS App
**Duration**: 28 weeks (~7 months)
**Tech Stack**: React Native + Supabase
**Target**: App Store Launch

**Last Updated**: 2025-12-03
**Status**: Phase 2 Complete, Phase 3 MVP Complete, Asset System Built

---

## Executive Summary

This master plan outlines the complete 28-week development roadmap for Manifest the Unseen, a transformative iOS manifestation app. The timeline is broken into 5 major phases, from pre-development setup through App Store launch.

**Key Milestones**:
- ✅ Planning Complete (PRD, TDD approved)
- ✅ Development environment ready
- ✅ Foundation complete (Auth, Navigation, Database)
- ✅ Workbook Phases 1-10 complete (Ahead of schedule!)
- ✅ Voice Journal MVP complete (Whisper on-device transcription)
- ✅ Phase 2: Meditation & Breathing MVP Complete (2025-11-29)
- ✅ Phase 2: Meditation Audio Uploaded (2025-12-01) - 16 meditations in DB
- ✅ Phase 3: AI Chat Frontend Complete (2025-11-29)
- ✅ Phase 3: YouTube Transcript Scraper Tool Complete (2025-12-01) - 327 embeddings
- ✅ Phase 3: AI & RAG MVP Complete - Ready for Testing (2025-12-01)
- Week 20: AI & Advanced features complete
- Week 24: Subscriptions & polish complete
- Week 28: App Store submission

---

## Phase Breakdown

### Pre-Development (Weeks 1-2)
**Focus**: Setup & Planning
**Status**: Not Started
**Critical Path**: ✓ Must complete before Phase 1

### Phase 1: Foundation (Weeks 3-8)
**Focus**: Authentication, Navigation, Workbook Phases 1-3, Voice Journaling MVP
**Status**: Not Started
**Critical Path**: ✓ Blocks Phase 2

### Phase 2: Core Features (Weeks 9-14)
**Focus**: ~~Workbook Phases 4-10~~ ✅ COMPLETE, ~~Meditation Player~~ ✅ MVP COMPLETE, ~~Breathing Exercises~~ ✅ MVP COMPLETE, Progress System
**Status**: ✅ Meditation MVP Complete (2025-11-29)
**Plan Document**: See [`Meditation and Breathing MVP Plan.md`](./Meditation%20and%20Breathing%20MVP%20Plan.md) for implementation details
**Critical Path**: ✓ Blocks Phase 3

**Progress Notes**:
- ✅ All 10 workbook phases completed ahead of schedule (42 screen files)
- ✅ Meditation & Breathing MVP Complete (2025-11-29):
  - Database migration with meditation_type enum (guided, breathing, music)
  - TypeScript types (Meditation, SessionStats, BreathingPattern)
  - meditationService.ts (CRUD, session tracking, streak calculation)
  - useAudioPlayer hook (expo-av playback)
  - useMeditation hooks (TanStack Query integration)
  - MeditationCard, MeditationPlayerScreen, BreathingAnimation components
  - MeditateScreen with tabs (Meditations, Breathing, Music)
  - MeditateNavigator for stack navigation
  - Session stats display (total minutes, sessions, streak)
- ✅ Meditation Audio Content Uploaded (2025-12-01):
  - 3 guided meditations (female narrator, Enlightenment tier)
  - 6 music tracks (Novice tier)
  - 16 total meditations in database (3 guided, 3 breathing, 10 music)
  - Upload tool: `tools/meditation-upload/upload.js`
  - Storage bucket: `meditation-audio`
- 🎯 Next: Test meditation playback in mobile app

### Phase 3: AI & Advanced Features (Weeks 15-20)
**Focus**: AI Knowledge Base, RAG Implementation, Vision Boards, Integrations
**Status**: ✅ MVP Complete - Ready for Testing (2025-12-01)
**Plan Document**: See [`AI Chat and RAG MVP plan.md`](./AI%20Chat%20and%20RAG%20MVP%20plan.md) for detailed implementation strategy
**Critical Path**: ✓ Blocks Phase 4

**Progress Notes**:
- ✅ AI Chat Frontend Complete (2025-11-29):
  - Agent 3 completed: 8 files created, ~1,320 lines
  - Chat screen, components, hooks, service layer
  - "Wisdom" tab added to navigation
- ✅ YouTube Transcript Scraper Tool Complete (2025-12-01):
  - Tool: `tools/youtube-scraper/` (HTML interface + Node.js server)
  - 327 knowledge embeddings in database
  - Batch processing support (multiple URLs at once)
  - Running at http://localhost:3456
- ✅ Backend 100% ready:
  - Edge Function `ai-chat` (352 lines)
  - Database schema complete (`ai_conversations`, `knowledge_embeddings`)
  - pgvector similarity search configured
- 🎯 Next: Test AI chat end-to-end with real knowledge base

### Phase 4: Subscriptions & Polish (Weeks 21-24)
**Focus**: RevenueCat, Paywall, Analytics, Performance, Accessibility
**Status**: Not Started
**Critical Path**: ✓ Blocks Phase 5

### Phase 5: Testing & Launch (Weeks 25-28)
**Focus**: QA, TestFlight Beta, App Store Preparation, Submission
**Status**: Not Started
**Critical Path**: ✓ Final phase before launch

---

## Detailed Week-by-Week Breakdown

## Pre-Development Phase (Weeks 1-2)

### Week 1: Setup & Configuration

**Primary Agents**: Architecture Reviewer, Backend Specialist
**Workstreams**: All (setup)

**Tasks**:
1. **Project Initialization**
   - Initialize React Native project with TypeScript
   - Set up monorepo structure (packages/shared, mobile/)
   - Configure ESLint, Prettier, TypeScript
   - Set up Git repository and .gitignore

2. **Supabase Setup**
   - Create Supabase project
   - Configure authentication (Apple Sign-In, email/password)
   - Create initial database schema (users table)
   - Set up local Supabase development environment

3. **Development Environment**
   - Install iOS development tools (Xcode, CocoaPods)
   - Configure VS Code with React Native extensions
   - Set up iOS simulator
   - Test build pipeline

4. **Package Configuration**
   - Install core dependencies (React Navigation, TanStack Query, NativeWind, Zustand)
   - Configure NativeWind (Tailwind for React Native)
   - Set up shared package structure

**Deliverables**:
- [ ] React Native app builds successfully on iOS
- [ ] Supabase project created and accessible
- [ ] Shared package structure in place
- [ ] Development environment documented

**Risks**:
- Apple Developer account delays
- Supabase configuration issues
- M1/M2 Mac compatibility issues

---

### Week 2: Design System & Planning

**Primary Agents**: Frontend Specialist, Architecture Reviewer
**Workstreams**: All (planning)

**Tasks**:
1. **Design System Creation**
   - Define color palette (purple/gold/ethereal theme)
   - Typography scale (headings, body, small text)
   - Spacing system (4px increments)
   - Component library structure
   - Create design tokens for NativeWind

2. **Information Architecture**
   - Finalize screen flow diagrams
   - Navigation structure (Tab + Stack navigators)
   - User flow maps for key features
   - Data flow diagrams

3. **Database Schema Design**
   - Complete database schema from TDD
   - Create migration files
   - Plan RLS (Row Level Security) policies
   - Define indexes

4. **API Integration Planning**
   - Obtain Claude API key (Anthropic)
   - Obtain OpenAI API key
   - Configure RevenueCat account
   - Set up TelemetryDeck, Sentry accounts

**Deliverables**:
- [ ] Design system documented
- [ ] Complete database schema designed
- [ ] All API keys obtained
- [ ] Sprint backlog for Phase 1 prioritized

**Risks**:
- API key approval delays
- Design iteration requirements

---

## Phase 1: Foundation (Weeks 3-8)

### Weeks 3-4: Authentication & Navigation

**Primary Agents**: Backend Specialist, Frontend Specialist
**Workstreams**: Authentication
**Critical Path**: ✓ Blocks all user-specific features

**Tasks**:
1. **Supabase Authentication Implementation** (Backend Specialist)
   - Configure Apple Sign-In provider
   - Configure email/password auth
   - Create RLS policies for users table
   - Set up auth webhooks for user creation
   - Generate TypeScript types from schema

2. **Authentication UI** (Frontend Specialist)
   - Welcome/onboarding screens
   - Apple Sign-In button
   - Email/password login form
   - Sign-up flow
   - Loading and error states
   - Biometric lock setup (Face ID/Touch ID)

3. **Navigation Structure** (Frontend Specialist)
   - Bottom Tab Navigator (5 tabs: Home, Workbook, Journal, Meditate, Wisdom)
   - Stack navigators for each tab
   - Type-safe navigation with TypeScript
   - Screen transitions and animations
   - Deep linking structure (for notifications)

4. **User Profile Setup** (Frontend + Backend Specialists)
   - Profile data model (name, goals, current phase)
   - Profile creation screen
   - Profile editing screen
   - Avatar selection/upload (optional)

**Deliverables**:
- [ ] User can sign up with Apple or email
- [ ] User can log in and session persists
- [ ] Biometric re-authentication works for journal
- [ ] Navigation between all 5 tabs functional
- [ ] User profile can be created and edited

**Success Criteria**:
- Authentication flow completes in < 10 seconds
- Session persists across app restarts
- No authentication-related crashes

---

### Weeks 5-6: Workbook Foundation (Phases 1-3)

**Primary Agents**: Frontend Specialist, Forms & Data Specialist, Backend Specialist
**Workstreams**: Workbook System
**Critical Path**: ✓ Demonstrates core app value

**Tasks**:
1. **Database Schema for Workbook** (Backend Specialist)
   - Create workbook_progress table
   - Set up RLS policies (user can only access own data)
   - Create indexes for performance
   - Write auto-save function (PostgreSQL)

2. **Form Builder System** (Forms & Data Specialist)
   - Reusable form components (text input, number input, slider, radio, checkbox)
   - React Hook Form integration
   - Zod validation schemas
   - Form state persistence
   - Auto-save functionality (every 30 seconds)

3. **Phase 1: Self-Evaluation** (Forms & Data Specialist)
   - Wheel of Life assessment (8 areas, 1-10 scale)
   - Feel Wheel emotional tracking
   - Habit identification worksheet
   - ABC Model worksheet
   - SWOT analysis
   - Personal values identification
   - Strengths/weaknesses assessment
   - Comfort zone exploration
   - "Know Yourself" prompts
   - Abilities rating system
   - Thought awareness exercises

4. **Phase 2: Values & Vision** (Forms & Data Specialist)
   - Core values clarification
   - Vision board planning worksheet
   - Life purpose exploration
   - Priority mapping
   - Future self visualization

5. **Phase 3: Goal Setting** (Forms & Data Specialist)
   - SMART goal framework form
   - Action plan creation
   - Milestone tracking
   - Timeline visualization
   - Progress checkpoints

6. **Progress Tracking System** (Frontend Specialist)
   - Phase completion tracking
   - Overall progress percentage
   - Visual timeline/progress bar
   - Completion celebrations (animations/haptics)

**Deliverables**:
- [ ] Workbook Phases 1-3 fully functional
- [ ] Forms validate input correctly
- [ ] Auto-save working (every 30s)
- [ ] Progress tracked and displayed
- [ ] Data syncs to Supabase
- [ ] Users can navigate between phases

**Success Criteria**:
- User can complete Phase 1 worksheet in < 15 minutes
- Auto-save completes in < 1 second
- No data loss during save operations

---

### Weeks 7-8: Voice Journaling MVP

**Primary Agents**: Audio/Voice Specialist, Backend Specialist, Frontend Specialist
**Workstreams**: Voice Journaling
**Critical Path**: ✓ Key differentiator feature

**Tasks**:
1. **OpenAI Whisper Integration** (Audio/Voice Specialist)
   - Install react-native-whisper
   - Configure Whisper model (tiny or base model)
   - Test transcription accuracy
   - Optimize for performance (1-2 second transcription)

2. **Audio Recording** (Audio/Voice Specialist)
   - Install react-native-audio-recorder-player
   - Configure iOS audio session
   - Build recording UI (large record button, waveform)
   - Real-time recording duration display
   - Pause/resume functionality
   - Maximum recording length: 15 minutes

3. **Journal Entry Database** (Backend Specialist)
   - Create journal_entries table
   - Set up RLS policies
   - Add full-text search (tsvector for PostgreSQL)
   - Create indexes for tags, date, user_id
   - Encryption setup (optional - for encrypted_content field)

4. **Journal Entry CRUD** (Frontend Specialist)
   - Create journal entry screen
   - Journal entry list view (FlatList with virtualization)
   - Journal entry detail view
   - Edit transcription functionality
   - Delete entry with confirmation
   - Tag management
   - Mood selection

5. **Search Functionality** (Frontend Specialist)
   - Search bar component
   - Full-text search implementation (Supabase query)
   - Search results highlighting
   - Filter by tags
   - Filter by date range
   - Filter by mood

**Deliverables**:
- [ ] User can record voice journal entry
- [ ] Whisper transcribes in < 5 seconds
- [ ] Transcribed text saves to Supabase
- [ ] Audio files deleted after transcription
- [ ] Journal entries searchable
- [ ] Tags and mood tracking work
- [ ] All entries encrypted at rest

**Success Criteria**:
- Transcription accuracy > 90% for clear speech
- Recording and transcription UX is smooth and fast
- No audio files stored (privacy-first)
- Offline recording works (syncs when online)

---

## Phase 2: Core Features Completion (Weeks 9-14)

### Weeks 9-10: Workbook Phases 4-7

**Primary Agents**: Forms & Data Specialist, Frontend Specialist
**Workstreams**: Workbook System
**Critical Path**: ✓ Completes core manifestation content

**Tasks**:
1. **Phase 4: Facing Fears & Limiting Beliefs** (Forms & Data Specialist)
   - Decatastrophizing worksheet
   - Putting thoughts on trial exercise
   - Reframing exercises
   - Manifestations vs. limiting beliefs
   - Cognitive restructuring worksheet
   - Core beliefs examination
   - Letter to past self

2. **Phase 5: Cultivating Self-Love & Self-Care** (Forms & Data Specialist)
   - Self-care routines planner
   - Self-compassion exercises
   - Boundaries setting worksheet
   - Self-love affirmations
   - Daily rituals planner

3. **Phase 6: Manifestation Techniques** (Forms & Data Specialist)
   - 3-6-9 Method tracker (21-day)
   - WOOP Method worksheet (Wish, Outcome, Obstacle, Plan)
   - Visualization exercises (wealth and abundance)
   - 21-Day Money Affirmation Challenge
   - Mirror Method tracker
   - Scripting dialogs template
   - Knot Method
   - Discount Trigger Method
   - Gratitude Blitz Jar

4. **Phase 7: Practicing Gratitude** (Forms & Data Specialist)
   - Daily gratitude journaling
   - Gratitude prompts
   - Recognition exercises
   - Appreciation tracking

5. **Form Validation & Error Handling** (Forms & Data Specialist)
   - Comprehensive Zod schemas
   - Clear error messages
   - Prevent invalid submissions
   - Helpful inline validation

6. **Phase Completion Celebrations** (Frontend Specialist)
   - Animations for completing a phase
   - Haptic feedback
   - Achievement badges
   - Share accomplishment (optional)

**Deliverables**:
- [ ] Phases 4-7 fully implemented
- [ ] All forms validate correctly
- [ ] Phase completion celebrated
- [ ] Users can track 21-day challenges
- [ ] Manifestation techniques interactive

**Success Criteria**:
- Phase 6 manifestation methods are engaging and easy to use
- Users complete phases without confusion
- Validation prevents invalid data

---

### Weeks 11-12: Workbook Phases 8-10 + Progress Dashboard

**Primary Agents**: Forms & Data Specialist, Frontend Specialist, Backend Specialist
**Workstreams**: Workbook System
**Critical Path**: ✓ Completes all workbook content

**Tasks**:
1. **Phase 8: Turning Envy Into Inspiration** (Forms & Data Specialist)
   - Envy transformation exercises
   - Inspiration board creation
   - Competitive mindset shift worksheet

2. **Phase 9: Trust & Surrender** (Forms & Data Specialist)
   - Letting go exercises
   - Trust-building activities
   - Surrender practices
   - Faith development worksheet

3. **Phase 10: Trust & Letting Go** (Forms & Data Specialist)
   - Final integration exercises
   - Release rituals
   - Future timeline selection
   - Completion ceremony

4. **Complete Progress Dashboard** (Frontend Specialist)
   - Overall completion percentage (visual)
   - Phase-by-phase breakdown
   - Current streak (days active)
   - Total time invested
   - Achievements/badges earned
   - Visual timeline of journey
   - Motivational quotes

5. **Streak Tracking** (Backend Specialist + Frontend Specialist)
   - Daily check-in mechanism
   - Streak counter (consecutive days)
   - Longest streak record
   - Streak recovery (grace period)
   - Push notifications for streak maintenance

6. **Achievement Badges System** (Frontend Specialist)
   - Complete Phase 1 badge
   - Complete all phases badge
   - 7-day streak badge
   - 30-day streak badge
   - 100 journal entries badge
   - First meditation badge
   - Badge collection screen

7. **Export Functionality** (Backend Specialist + Frontend Specialist)
   - Export workbook progress to PDF
   - Export journal entries to PDF
   - Email export option
   - Share export via iOS share sheet

**Deliverables**:
- [ ] All 10 phases accessible and functional
- [ ] Progress dashboard shows complete journey
- [ ] Streak tracking works daily
- [ ] Achievements unlock and display
- [ ] Export to PDF functional
- [ ] Users can share progress (optional)

**Success Criteria**:
- All 10 phases completable without errors
- Progress dashboard is motivating and clear
- Export generates well-formatted PDF

---

### Weeks 13-14: Meditation & Breathing System

**Primary Agents**: Audio/Voice Specialist, Frontend Specialist, Backend Specialist
**Workstreams**: Meditation Player
**Critical Path**: ✓ Key wellness feature
**Plan Document**: [`Meditation and Breathing Plan.md`](./Meditation%20and%20Breathing%20Plan.md)

**Status**: Planning Complete - Ready for Implementation ✓

**Implementation Plan Overview**:
This feature will be built over 10-11 weeks (174-220 hours) in 10 phases:
1. Foundation (12-16h): meditationStore, meditationService, navigation
2. Meditation Player MVP (20-24h): Audio playback, narrator switching
3. Breathing Exercises MVP (18-22h): Visual animations, timing engine
4. Background Music (12-16h): Audio layering, volume mixing
5. Library & Home Screen (16-20h): Meditation browsing, cards
6. Visual Enhancements (14-18h): Mandalas, backgrounds, audio cues
7. History & Stats (12-16h): Session tracking, streaks
8. Additional Breathing Patterns (8-10h): 5+ comprehensive patterns
9. Content Creation (20-30h): AI voice generation, 6 meditations
10. Polish & Testing (16-20h): Performance, accessibility, edge cases

**Tasks**:
1. **Audio Player Setup** (Audio/Voice Specialist)
   - Install and configure react-native-track-player
   - Set up background audio playback
   - Configure iOS audio session for playback
   - Handle audio interruptions (calls, alarms)
   - Test on device (background playback)

2. **Meditation Library UI** (Frontend Specialist)
   - Meditation list view (6 sessions)
   - Meditation detail view (title, description, duration)
   - Narrator gender toggle (male/female)
   - Favorite meditations
   - Recently played
   - Continue where left off

3. **6 Guided Meditations** (Audio/Voice Specialist + Backend Specialist)
   - Source or record meditation audio files (12 total: 6 × 2 narrators)
   - Upload to Supabase Storage
   - Populate meditations table
   - Configure audio URLs
   - Test playback on device

   **Meditation Sessions**:
   - 5-minute Morning Manifestation
   - 5-minute Evening Gratitude
   - 10-minute Abundance Alignment
   - 10-minute Limiting Beliefs Release
   - 5-minute Quick Reset
   - 10-minute Deep Alignment

4. **Meditation Player UI** (Frontend Specialist)
   - Player controls (play/pause, skip -10s/+10s)
   - Progress bar (seekable)
   - Current time / total duration
   - Artwork display
   - Background blur effect
   - Minimized player (tab bar)

5. **Breathing Exercise Animations** (Frontend Specialist)
   - Triangle Breathing visual (5-5-5 pattern)
   - Box Breathing visual (4-4-4-4 pattern)
   - 5-Finger Breathing visual (hand trace animation)
   - Animated guidance synchronized with rhythm
   - Customizable durations
   - Haptic feedback synchronized with breath

6. **Haptic Feedback Integration** (Audio/Voice Specialist)
   - Install expo-haptics
   - Synchronize haptics with breathing phases
   - Test different haptic patterns
   - Make haptics optional (user preference)

7. **Session Tracking** (Backend Specialist)
   - Create meditation_sessions table
   - Track session start, duration, completion
   - Calculate total meditation time (lifetime)
   - Daily/weekly/monthly stats

8. **Meditation History & Stats** (Frontend Specialist)
   - Session history list
   - Calendar view of meditation days
   - Total meditation time
   - Favorite meditations
   - Completion rate
   - Streak counter for daily meditation

9. **Meditation Reminders** (Frontend Specialist)
   - Daily meditation reminder (customizable time)
   - Local notifications
   - Notification settings screen

**Deliverables** (See detailed plan document for full breakdown):
- [ ] meditationStore and meditationService implemented
- [ ] Navigation structure (MeditationNavigator, updated MainTabNavigator)
- [ ] Meditation player with expo-av audio playback
- [ ] Narrator switching (male/female)
- [ ] Breathing exercises with react-native-reanimated animations (60fps)
- [ ] 5+ breathing patterns (Box, Triangle, 4-7-8, Coherent, Wim Hof)
- [ ] Background music layer system (3-5 ambient tracks)
- [ ] Session tracking and history
- [ ] Meditation library/browser with cards
- [ ] Visual enhancements (mandalas, breathing circle, backgrounds)
- [ ] Stats and streaks (total time, sessions, consecutive days)
- [ ] 6 meditations with male + female narrators (12 audio files total)
- [ ] Daily reminders and notifications

**Success Criteria**:
- Audio plays without stuttering
- Background playback works with screen off
- Breathing animations are smooth (60fps on iPhone 11+)
- Haptics enhance experience without being jarring
- Session tracking is accurate and reliable
- Narrator switching is seamless (preserves playback position)
- Background music properly mixed (meditation 85%, music 30%)
- Memory usage <150MB, audio load time <2 seconds

---

## Phase 3: AI & Advanced Features (Weeks 15-20)

### Weeks 15-16: AI Knowledge Base Setup

**Primary Agents**: AI Integration Specialist, Backend Specialist
**Workstreams**: AI Chat
**Critical Path**: ✓ Enables AI monk companion
**Plan Document**: See [`AI Chat and RAG MVP plan.md`](./AI%20Chat%20and%20RAG%20MVP%20plan.md) for complete implementation strategy

**Status**: Planning Complete - Ready for Implementation ✓

**Implementation Overview**:
This feature will be built using a multi-agent orchestrator pattern with 3 specialized agents:
- **Agent 1**: Knowledge Ingestion Specialist (PDF parsing, chunking, embedding generation, pgvector population)
- **Agent 2**: Edge Function Validation (optional - testing and validation of ai-chat endpoint)
- **Agent 3**: Frontend UI Implementation (chat interface, conversation management, streaming responses)

Estimated Timeline: 10-14 hours for MVP completion

**Tasks**:
1. **Content Ingestion** (AI Integration Specialist)
   - Parse Manifest the Unseen PDF (202 pages)
   - Parse Shi Heng Yi transcript
   - Parse Book Essence Hub transcript
   - Parse Nikola Tesla writings
   - Chunk content (1000 chars with 200 overlap)
   - Clean and format text

2. **Embedding Generation** (AI Integration Specialist)
   - Set up OpenAI API client
   - Generate embeddings using text-embedding-3-small (1536 dimensions)
   - Batch processing for efficiency
   - Error handling and retries
   - Store embeddings in Supabase

3. **pgvector Setup** (Backend Specialist)
   - Enable pgvector extension in Supabase
   - Create knowledge_embeddings table
   - Create ivfflat index for similarity search
   - Write match_knowledge() PostgreSQL function
   - Test similarity search performance

4. **Knowledge Base Validation** (AI Integration Specialist)
   - Test retrieval accuracy with sample queries
   - Validate similarity threshold (0.7 default)
   - Optimize match count (5 default)
   - Test edge cases (very short queries, very long queries)
   - Document knowledge base structure

**Deliverables**:
- [ ] All knowledge sources ingested and embedded
- [ ] pgvector index created and optimized
- [ ] match_knowledge() function working correctly
- [ ] Retrieval accuracy validated (> 80% relevance)
- [ ] Knowledge base documented

**Success Criteria**:
- Vector search returns results in < 2 seconds
- Retrieved context is relevant to user queries
- No missing or corrupted embeddings

---

### Weeks 17-18: AI Monk Chat Implementation

**Primary Agents**: AI Integration Specialist, Backend Specialist, Frontend Specialist
**Workstreams**: AI Chat
**Critical Path**: ✓ Signature feature

**Tasks**:
1. **Supabase Edge Function - ai-chat** (AI Integration Specialist + Backend Specialist)
   - Create ai-chat Edge Function (Deno)
   - Authenticate user from request
   - Generate embedding for user message
   - Search knowledge base with pgvector
   - Build system prompt with context
   - Call Claude API (claude-sonnet-4-5-20250929)
   - Handle streaming responses
   - Save conversation to database
   - Error handling and logging

2. **Claude API Integration** (AI Integration Specialist)
   - Set up Claude API client
   - Configure system prompt (monk personality)
   - Implement conversation context management (last 10 exchanges)
   - Handle rate limiting
   - Implement fallback to GPT-4
   - Cost tracking

3. **AI Conversations Database** (Backend Specialist)
   - Create ai_conversations table
   - Store messages as JSONB
   - Create indexes for user_id, updated_at
   - RLS policies for user access

4. **Chat UI** (Frontend Specialist)
   - Chat bubble interface
   - User message input (multiline)
   - AI response display
   - Typing indicators
   - Message timestamps
   - Copy message functionality
   - Scroll to bottom
   - Keyboard handling

5. **Conversation Management** (Frontend Specialist)
   - Conversation history list
   - Start new conversation
   - Delete conversation (with confirmation)
   - Search conversations
   - Conversation titles (auto-generated from first message)

6. **Context-Aware Prompting** (AI Integration Specialist)
   - Fetch user's current workbook phase
   - Fetch recent journal entries (last 5)
   - Fetch user's stated goals
   - Include context in system prompt
   - Personalize AI responses

7. **Quick Prompts** (Frontend Specialist)
   - Pre-written question buttons
   - "Help me with limiting beliefs"
   - "Guide me through manifestation"
   - "Explain the 3-6-9 method"
   - "I'm feeling stuck"
   - Customize based on current phase

8. **Share to Journal** (Frontend Specialist)
   - Copy AI response
   - Save AI wisdom to journal
   - Tag automatically as "AI wisdom"

**Deliverables**:
- [ ] AI chat functional with relevant responses
- [ ] Claude API integration working
- [ ] Conversation history saved and loadable
- [ ] Context-aware prompting enhances responses
- [ ] Quick prompts available
- [ ] Share to journal works
- [ ] Rate limiting enforced by tier

**Success Criteria**:
- AI responds in < 5 seconds
- Responses are relevant and helpful
- Conversation context maintained across turns
- No hallucinations or off-topic responses
- Cost stays within budget ($100-300/month initially)

---

### Weeks 19-20: Vision Boards & Integrations

**Primary Agents**: Frontend Specialist, Backend Specialist
**Workstreams**: Vision Boards, Integrations
**Critical Path**: Optional but high value

**Tasks**:
1. **Vision Board Database** (Backend Specialist)
   - Create vision_boards table
   - Store images as JSONB (array of URLs)
   - RLS policies with tier-based limits
   - Create indexes

2. **Vision Board Creator UI** (Frontend Specialist)
   - Image picker (camera/photo library)
   - Image upload to Supabase Storage
   - Grid layout for images
   - Text overlay editor (affirmations)
   - Font selection
   - Color picker for text
   - Save vision board

3. **Vision Board Management** (Frontend Specialist)
   - Vision board list (thumbnails)
   - Create new board
   - Edit existing board
   - Delete board (with confirmation)
   - Set board as active/favorite
   - Tier-based limits (1 for Novice, 3 for Awakening, Unlimited for Enlightenment)

4. **Daily Vision Board Reminder** (Frontend Specialist)
   - Daily notification to view vision board
   - Customizable time
   - Opens vision board in full screen

5. **Share Functionality** (Frontend Specialist)
   - Export vision board as image
   - Share via iOS share sheet
   - Save to photo library

6. **Apple Health Integration** (Frontend Specialist)
   - Install react-native-health
   - Request HealthKit permissions
   - Write meditation sessions as "Mindful Minutes"
   - Test on device

7. **Shortcuts App Support** (Frontend Specialist)
   - Define app shortcuts
   - "Start Meditation" shortcut
   - "Create Journal Entry" shortcut
   - "View Vision Board" shortcut

8. **Widget Exploration** (Frontend Specialist)
   - Research iOS widget options for React Native
   - Design simple widget (daily quote, streak counter)
   - Implement if feasible, otherwise defer to post-MVP

**Deliverables**:
- [ ] Vision boards can be created and saved
- [ ] Image upload to Supabase Storage works
- [ ] Text overlays functional
- [ ] Tier-based limits enforced
- [ ] Daily reminder working
- [ ] Share to photo library/social works
- [ ] Apple Health integration writes mindful minutes
- [ ] Shortcuts app actions defined

**Success Criteria**:
- Vision board creation is intuitive and fun
- Image uploads complete in < 5 seconds
- Tier limits correctly enforced
- HealthKit integration approved by Apple

---

## Phase 4: Subscriptions & Polish (Weeks 21-24)

### Weeks 21-22: Subscription System

**Primary Agents**: Subscriptions Specialist, Backend Specialist, Frontend Specialist
**Workstreams**: Subscriptions
**Critical Path**: ✓ Required for monetization

**Tasks**:
1. **StoreKit 2 Configuration** (Subscriptions Specialist)
   - Configure subscription products in App Store Connect
   - Three tiers: Novice, Awakening, Enlightenment
   - Monthly and annual options (6 products total)
   - Configure 7-day free trial
   - Test sandbox environment

2. **RevenueCat Setup** (Subscriptions Specialist)
   - Create RevenueCat account
   - Configure products and entitlements
   - Set up webhooks
   - Test subscription purchase flow
   - Configure offerings

3. **RevenueCat Integration** (Subscriptions Specialist)
   - Install @revenuecat/purchases-react-native
   - Configure SDK with API key
   - Fetch offerings
   - Purchase flow implementation
   - Restore purchases
   - Check entitlements

4. **Paywall UI** (Frontend Specialist + Subscriptions Specialist)
   - Tier comparison screen
   - Monthly vs. annual toggle
   - Annual savings badge
   - Feature list per tier
   - "Most Popular" badge on Awakening
   - Terms and privacy links
   - Restore purchases button

5. **Feature Gating** (Subscriptions Specialist + Backend Specialist)
   - Client-side entitlement checks
   - Database-level RLS policies with tier checks
   - Workbook phase gating (Phases 1-5, 1-8, 1-10)
   - Meditation gating (3, 6, unlimited)
   - Journal entry limits (50, 200, unlimited per month)
   - AI chat limits (30, 100, unlimited per day)
   - Vision board limits (1, 3, unlimited)

6. **Subscription Status Sync** (Backend Specialist)
   - RevenueCat webhook handler (Supabase Edge Function)
   - Update users.subscription_tier on purchase
   - Handle subscription expiry
   - Handle refunds
   - Handle billing issues

7. **Upgrade/Downgrade Flows** (Frontend Specialist)
   - Upgrade prompt when hitting limits
   - In-app upgrade flow
   - Downgrade confirmation
   - Proration handling

8. **Family Sharing Support** (Subscriptions Specialist)
   - Enable Family Sharing in App Store Connect
   - Test family sharing flow
   - Ensure compliance with Apple guidelines

**Deliverables**:
- [ ] Subscriptions configured in App Store Connect
- [ ] RevenueCat fully integrated
- [ ] Paywall UI functional and compelling
- [ ] Feature gating works at all levels
- [ ] Subscription status syncs to Supabase
- [ ] Restore purchases works
- [ ] Upgrade/downgrade flows tested
- [ ] Family Sharing enabled

**Success Criteria**:
- Purchase flow completes in < 30 seconds
- Entitlements update immediately
- No false positives/negatives in feature gating
- Paywall converts > 25% of trial users

---

### Week 23: Analytics & Monitoring

**Primary Agents**: Backend Specialist, Frontend Specialist
**Workstreams**: All
**Critical Path**: ✓ Required for launch insights

**Tasks**:
1. **TelemetryDeck Integration** (Frontend Specialist)
   - Install TelemetryDeck SDK
   - Configure API key
   - Define key events to track
   - Test event tracking

2. **Event Tracking Implementation** (Frontend Specialist)
   - App lifecycle: app_opened, app_backgrounded
   - Authentication: sign_up, sign_in, sign_out
   - Workbook: phase_started, phase_completed, worksheet_completed
   - Journal: journal_created_voice, journal_created_text, journal_searched
   - Meditation: meditation_started, meditation_completed, breathing_exercise_completed
   - AI Chat: ai_chat_message_sent, ai_chat_conversation_started
   - Vision Board: vision_board_created, vision_board_viewed
   - Subscriptions: paywall_viewed, subscription_purchased, trial_started

3. **Conversion Funnel Tracking** (Frontend Specialist)
   - Trial started
   - Paywall viewed
   - Tier selected
   - Purchase initiated
   - Purchase completed
   - Trial converted

4. **Sentry Integration** (Frontend Specialist)
   - Install @sentry/react-native
   - Configure DSN
   - Test error reporting
   - Configure release tracking

5. **Performance Monitoring** (Frontend Specialist)
   - Enable Sentry performance monitoring
   - Track screen load times
   - Track API call latency
   - Identify slow operations

6. **User Journey Analytics** (Frontend Specialist)
   - Track onboarding completion rate
   - Track Phase 1 completion time
   - Track feature adoption (which features used)
   - Track retention Day 1, 7, 30

**Deliverables**:
- [ ] TelemetryDeck tracking all key events
- [ ] Sentry capturing errors and crashes
- [ ] Performance monitoring enabled
- [ ] Conversion funnel trackable
- [ ] Dashboard configured for monitoring

**Success Criteria**:
- All key events tracked accurately
- Crash reports show useful stack traces
- Performance issues identifiable
- Analytics privacy-compliant

---

### Week 24: Polish & Optimization

**Primary Agents**: Frontend Specialist, Performance Review Agent, Accessibility Review Agent
**Workstreams**: All
**Critical Path**: ✓ Required for App Store approval

**Tasks**:
1. **UI/UX Refinements** (Frontend Specialist)
   - Review all screens for consistency
   - Polish animations and transitions
   - Ensure design system compliance
   - Fix visual bugs
   - Improve empty states
   - Add loading skeletons

2. **Accessibility Audit** (Accessibility Review Agent + Frontend Specialist)
   - VoiceOver labels for all interactive elements
   - Touch target sizes (min 44x44pt)
   - Color contrast validation
   - Dynamic Type support
   - Reduce Motion respect
   - Test with VoiceOver enabled

3. **Performance Optimization** (Performance Review Agent + Frontend Specialist)
   - Identify and fix unnecessary re-renders
   - Optimize FlatList rendering
   - Lazy load heavy components
   - Optimize images
   - Reduce bundle size
   - Test on older devices (iPhone X, iPhone 11)

4. **Loading State Improvements** (Frontend Specialist)
   - Consistent loading spinners
   - Skeleton screens for list views
   - Optimistic updates
   - Error boundaries
   - Retry mechanisms

5. **Error Handling Polish** (Frontend Specialist)
   - User-friendly error messages
   - Network error handling
   - Offline state indicators
   - Graceful degradation

6. **Animations & Transitions** (Frontend Specialist)
   - Smooth screen transitions
   - Celebration animations for achievements
   - Micro-interactions (button presses, swipes)
   - Loading animations
   - Haptic feedback tuning

7. **Dark Mode Support** (Frontend Specialist)
   - Implement dark color scheme
   - Auto-switch based on system preference
   - Manual toggle in settings
   - Test all screens in dark mode

8. **Haptic Feedback Tuning** (Frontend Specialist)
   - Review all haptic feedback instances
   - Ensure appropriate intensity
   - Make haptics optional in settings

9. **Final Design Review** (Architecture Reviewer)
   - Review against PRD requirements
   - Ensure brand consistency
   - Check for design debt
   - Validate user flows

**Deliverables**:
- [ ] All screens polished and consistent
- [ ] Accessibility score > 95%
- [ ] Performance optimized (smooth 60fps)
- [ ] Dark mode fully supported
- [ ] Error handling comprehensive
- [ ] Final design approved

**Success Criteria**:
- App feels polished and professional
- VoiceOver users can navigate entire app
- App runs smoothly on iPhone X
- No jarring animations or transitions

---

## Phase 5: Testing & Launch (Weeks 25-28)

### Weeks 25-26: Testing

**Primary Agents**: Integration Test Agent, E2E Test Agent, Unit Test Agent, Code Review Agent, Security Auditor
**Workstreams**: All
**Critical Path**: ✓ Required for stable launch

**Tasks**:
1. **Internal QA Testing** (All specialists)
   - Test all features systematically
   - Test on multiple devices (iPhone SE, iPhone 13, iPhone 15 Pro)
   - Test on different iOS versions (15, 16, 17)
   - Test offline functionality
   - Test edge cases
   - Document bugs in issue tracker

2. **TestFlight Beta Setup** (Frontend Specialist)
   - Configure TestFlight in App Store Connect
   - Create beta build
   - Upload to TestFlight
   - Write beta testing instructions
   - Recruit 50-100 beta testers

3. **Beta Tester Recruitment** (Team effort)
   - Friends and family
   - Social media outreach
   - Beta testing communities
   - Provide clear feedback instructions

4. **Bug Tracking and Prioritization** (Code Review Agent)
   - Categorize bugs (critical, high, medium, low)
   - Create tasks for bug fixes
   - Assign to appropriate specialists
   - Track progress

5. **Critical Bug Fixes** (All specialists as needed)
   - Fix P0 (critical) bugs immediately
   - Fix P1 (high priority) bugs within 24 hours
   - Address P2 bugs if time allows
   - Defer P3 to post-launch

6. **Performance Testing** (Performance Review Agent)
   - Measure app launch time (target < 3 seconds)
   - Measure screen transition time (target < 0.5 seconds)
   - Measure API response times (target < 500ms)
   - Measure battery usage (target < 5% per 30-min session)
   - Test memory usage (target < 150MB typical)

7. **Security Testing** (Security Auditor)
   - Verify RLS policies work correctly
   - Test journal entry encryption
   - Check for exposed API keys
   - Test authentication flows for vulnerabilities
   - Validate data privacy compliance

8. **Network Condition Testing** (Integration Test Agent)
   - Test on slow 3G network
   - Test on Wi-Fi
   - Test offline mode
   - Test network switching mid-operation
   - Verify offline queue works

9. **Subscription Flow Testing** (Subscriptions Specialist)
   - Test free trial activation
   - Test subscription purchase
   - Test restore purchases
   - Test upgrade/downgrade
   - Test subscription expiry
   - Test refund flow (sandbox)
   - Test Family Sharing

**Deliverables**:
- [ ] All features tested on multiple devices
- [ ] TestFlight beta live with 50+ testers
- [ ] Critical bugs fixed
- [ ] Performance benchmarks met
- [ ] Security audit passed
- [ ] Subscription flows validated

**Success Criteria**:
- Crash rate < 0.5% during beta
- Beta tester satisfaction > 4.0/5.0
- No critical bugs remaining
- Performance targets met

---

### Week 27: App Store Preparation

**Primary Agents**: User Guide Writer, Frontend Specialist
**Workstreams**: Marketing, Documentation
**Critical Path**: ✓ Required for App Store submission

**Tasks**:
1. **App Store Connect Setup** (Frontend Specialist)
   - Create app record in App Store Connect
   - Configure app metadata (name, subtitle, category)
   - Set pricing (free with subscriptions)
   - Configure availability (US initially, expand later)
   - Age rating questionnaire

2. **App Store Screenshots** (Frontend Specialist + User Guide Writer)
   - Design template for screenshots
   - Capture screenshots for required sizes:
     - 6.5" display (iPhone 14 Pro Max, 15 Pro Max)
     - 5.5" display (iPhone 8 Plus)
   - Highlight key features:
     - Workbook phases
     - Voice journaling
     - Meditation player
     - AI monk chat
     - Progress tracking
     - Vision boards

3. **App Preview Video** (User Guide Writer + Frontend Specialist)
   - Script 30-second preview video
   - Record screen captures
   - Add text overlays
   - Background music (royalty-free)
   - Export in required format (H.264, 30fps)

4. **App Store Description** (User Guide Writer)
   - Compelling app description (optimized for ASO)
   - Feature list
   - Benefits and value proposition
   - Call-to-action
   - Keywords research for ASO
   - Subtitle (30 chars)
   - Promotional text (170 chars)

5. **Keywords Optimization** (User Guide Writer)
   - Research App Store keywords
   - Target: manifestation, meditation, journaling, self-help, spirituality, vision board
   - Analyze competitor keywords
   - Select 100 chars of keywords

6. **Privacy Policy** (User Guide Writer)
   - Draft comprehensive privacy policy
   - Cover data collection, usage, sharing
   - GDPR and CCPA compliance
   - Host on website or GitHub Pages

7. **Terms of Service** (User Guide Writer)
   - Draft terms of service
   - Subscription terms
   - User conduct
   - Intellectual property
   - Host on website or GitHub Pages

8. **Support Website/Email** (User Guide Writer)
   - Set up support email (support@manifesttheunseen.app)
   - Create simple support website or FAQ page
   - Contact information
   - Common issues and solutions

9. **Press Kit** (User Guide Writer)
   - App description
   - Key features
   - Screenshots
   - Founder story (optional)
   - Press release (optional)
   - Media assets (logo, icon, banner)

**Deliverables**:
- [ ] App Store Connect configured
- [ ] 10+ high-quality screenshots
- [ ] 30-second app preview video
- [ ] Optimized app description
- [ ] Privacy policy published
- [ ] Terms of service published
- [ ] Support website/email set up
- [ ] Press kit prepared

**Success Criteria**:
- Screenshots are professional and compelling
- App description clearly communicates value
- Keywords optimized for ASO
- Privacy policy compliant

---

### Week 28: Final Launch Prep & Submission

**Primary Agents**: All agents for final review, Frontend Specialist for submission
**Workstreams**: All
**Critical Path**: ✓ LAUNCH WEEK

**Tasks**:
1. **Address Beta Tester Feedback** (All specialists)
   - Review all beta feedback
   - Prioritize final fixes
   - Implement critical feedback
   - Test fixes

2. **Final Bug Fixes** (All specialists)
   - Fix any remaining critical bugs
   - Address high-priority issues
   - Test fixes thoroughly

3. **App Store Submission** (Frontend Specialist)
   - Create production build
   - Archive in Xcode
   - Upload to App Store Connect
   - Fill out App Review Information
   - Submit for review

4. **Monitoring Dashboard Setup** (Backend Specialist)
   - Configure TelemetryDeck dashboard
   - Set up Sentry alerts
   - Configure Supabase monitoring
   - Set up uptime monitoring

5. **Customer Support System Ready** (User Guide Writer)
   - Email support inbox monitored
   - FAQ page complete
   - Support response templates prepared
   - Escalation process defined

6. **Marketing Materials Ready** (User Guide Writer)
   - Social media posts scheduled
   - Launch announcement drafted
   - Influencer outreach prepared
   - Community engagement plan

7. **Launch Day Communication Plan** (Team effort)
   - Internal team coordination
   - Launch checklist
   - Issue escalation plan
   - Celebration plan 🎉

**Deliverables**:
- [ ] Beta feedback addressed
- [ ] App submitted to App Store
- [ ] Monitoring dashboards live
- [ ] Support system ready
- [ ] Marketing materials prepared
- [ ] Launch plan documented

**Success Criteria**:
- App approved by App Store on first submission (or minimal iterations)
- Monitoring in place for launch
- Team ready to respond to issues

---

## Post-Launch (Month 8+)

### Month 8: Stabilization
- Monitor app performance and stability
- Fix critical bugs discovered at scale
- Gather user feedback
- Analyze subscription conversion data
- Optimize onboarding based on data

### Month 9: Content Expansion
- Add first monthly meditation
- Expand Tesla wisdom content
- Create additional journal prompts
- Launch first in-app event/challenge

### Month 10: Feature Enhancement
- Advanced analytics for users
- Meditation customization options
- Additional breathing exercises
- Widget improvements
- Watch app consideration

### Month 11: Community Foundation
- Design community features
- Begin development of sharing system
- Accountability partner matching
- Private groups structure

### Month 12: Year 1 Review & Planning
- Comprehensive analytics review
- User satisfaction survey
- Feature prioritization for Year 2
- Android feasibility assessment
- Financial performance analysis

---

## Resource Allocation

### Agent Assignment by Phase

**Pre-Development (Weeks 1-2)**:
- Architecture Reviewer (lead)
- Backend Specialist
- Frontend Specialist

**Phase 1 (Weeks 3-8)**:
- Backend Specialist (lead)
- Frontend Specialist
- Forms & Data Specialist
- Audio/Voice Specialist
- Code Review Agent

**Phase 2 (Weeks 9-14)**:
- Forms & Data Specialist (lead)
- Frontend Specialist
- Backend Specialist
- Audio/Voice Specialist
- Code Review Agent

**Phase 3 (Weeks 15-20)**:
- AI Integration Specialist (lead)
- Backend Specialist
- Frontend Specialist
- Security Auditor
- Integration Test Agent

**Phase 4 (Weeks 21-24)**:
- Subscriptions Specialist (lead)
- Backend Specialist
- Frontend Specialist
- Performance Review Agent
- Accessibility Review Agent
- Security Auditor

**Phase 5 (Weeks 25-28)**:
- Integration Test Agent (lead)
- E2E Test Agent
- Unit Test Agent
- Security Auditor
- User Guide Writer
- All specialists (on-call for fixes)

---

## Risk Management

### High-Risk Items

1. **Whisper Integration Complexity** (Week 7-8)
   - **Risk**: On-device transcription may be slow or inaccurate
   - **Mitigation**: Test early, have cloud transcription fallback plan
   - **Buffer**: +1 week if needed

2. **AI Knowledge Base Tuning** (Weeks 15-16)
   - **Risk**: RAG may not return relevant context
   - **Mitigation**: Extensive testing, adjust similarity threshold and chunk strategy
   - **Buffer**: +1 week if needed

3. **App Store Review Rejection** (Week 28)
   - **Risk**: App may be rejected for guideline violations
   - **Mitigation**: Follow guidelines strictly, test thoroughly
   - **Buffer**: +1 week for resubmission

4. **Subscription Implementation Edge Cases** (Weeks 21-22)
   - **Risk**: RevenueCat integration bugs, edge cases
   - **Mitigation**: Thorough testing in sandbox, follow RevenueCat best practices
   - **Buffer**: +1 week if needed

### Medium-Risk Items

- Beta tester recruitment delays
- Meditation audio production delays
- Performance optimization challenges
- API cost overruns
- Third-party SDK issues

### Contingency Plan

**If timeline slips**:
1. De-scope non-critical features (vision boards, widgets)
2. Simplify workbook phases (fewer exercises per phase)
3. Reduce meditation count (4 instead of 6)
4. Launch without AI chat (add in Month 8)

**Feature prioritization if needed**:
- P0: Auth, Workbook Phases 1-5, Journal, Subscriptions
- P1: All 10 phases, Meditation, Progress tracking
- P2: AI Chat, Vision boards
- P3: Integrations, Widgets

---

## Success Metrics by Phase

**Phase 1 Success**:
- [ ] App doesn't crash
- [ ] User can create account and log in
- [ ] User can complete Phase 1 worksheet
- [ ] User can record and transcribe voice journal
- [ ] Data saves properly

**Phase 2 Success**:
- [ ] All 10 phases accessible and functional
- [ ] Meditation plays without issues
- [ ] Breathing animations are smooth
- [ ] Progress tracks accurately

**Phase 3 Success**:
- [ ] AI provides relevant responses
- [ ] Chat response time < 5 seconds
- [ ] Vision boards can be created and saved
- [ ] All integrations work

**Phase 4 Success**:
- [ ] Users can subscribe successfully
- [ ] Feature gating works correctly
- [ ] Analytics captures all key events
- [ ] No crashes or major bugs

**Phase 5 Success**:
- [ ] Beta testers give 4.0+ average rating
- [ ] App approved by App Store on first try (or quickly iterated)
- [ ] Launch day goes smoothly
- [ ] Early users can onboard without issues

---

## Weekly Check-In Process

**Every Monday**:
1. Review previous week's progress
2. Identify blockers
3. Adjust timeline if needed
4. Assign week's tasks to agents
5. Update master plan

**Every Friday**:
1. Review week's accomplishments
2. Test completed features
3. Document decisions made
4. Update stakeholders
5. Prepare next week's priorities

---

## Notes

This master plan is a living document. It will be updated weekly as development progresses. All changes should be logged with date and reason.

**Last Review Date**: 2025-12-01
**Next Review Date**: 2025-12-08
**Version**: 1.2

### Change Log

**2025-12-03**:
- Built complete Asset Management System (`mobile/src/assets/index.ts`)
  - PhaseImages: 10 workbook phase header images
  - MeditationImages: Guided (3), Breathing (3), Instrumental (13)
  - WorkbookExerciseImages: 37 exercise images across all 10 phases
  - Helper functions: `getPhaseImage()`, `getPhaseExerciseImages()`, `getInstrumentalImage()`
- Updated WorkbookScreen with phase image cards + LinearGradient overlays
- Updated PhaseDashboard component with dynamic phase images
- Created PhaseHeader component for reusable headers
- Updated MeditationCard to support optional images
- Theme updates: dark mode support, color refinements
- Component refinements across Button, Card, Text, TextInput
- Note: Images need resizing before final commit (currently 1.5-2.5MB each)

**2025-12-01**:
- Updated Phase 2: Meditation audio content uploaded (16 meditations in DB)
- Updated Phase 3: AI Chat MVP complete (frontend + 327 embeddings)
- Added YouTube Transcript Scraper tool completion
- Updated status to "MVP Complete - Ready for Testing"

**2025-11-29**:
- Phase 2 Meditation & Breathing MVP completed
- Phase 3 AI Chat Frontend completed (Agent 3)
- AI & RAG planning complete
