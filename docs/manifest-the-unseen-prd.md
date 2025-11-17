# Product Requirements Document (PRD)
## Manifest the Unseen - iOS Application

**Version:** 1.0  
**Date:** November 16, 2025  
**Author:** Product Team  
**Status:** Draft for Review

---

## 1. Executive Summary

### 1.1 Product Vision
Manifest the Unseen is a transformative iOS mobile application that digitizes the comprehensive 202-page manifestation workbook by Lunar Rivers, providing users with an interactive journey through self-discovery, meditation, and practical manifestation techniques. The app combines structured workbook exercises with AI-guided wisdom, voice journaling, and meditation practices to help users align their energy, overcome limiting beliefs, and manifest their desired reality.

### 1.2 Product Goals
- Digitize and gamify the complete 10-phase Manifest the Unseen workbook
- Provide accessible meditation and breathing exercises for daily practice
- Enable seamless voice-to-text journaling for reflection and documentation
- Offer AI-powered guidance through a monk-like wisdom companion
- Create a supportive environment for personal transformation and manifestation

### 1.3 Target Audience
- **Primary:** Adults aged 25-55 interested in personal development, manifestation, and spirituality
- **Secondary:** Meditation practitioners, life coaches, wellness enthusiasts
- **User Personas:**
  - Sarah (32): Career professional seeking work-life balance and abundance mindset
  - Michael (41): Entrepreneur looking to overcome limiting beliefs and manifest business success
  - Lisa (28): Wellness coach wanting structured tools for personal and client growth

---

## 2. Product Overview

### 2.1 Core Value Proposition
A comprehensive manifestation companion that transforms the traditional workbook experience into an interactive, AI-enhanced mobile journey, making personal transformation accessible, trackable, and deeply personalized.

### 2.2 Key Differentiators
- Complete digitization of proven 10-phase manifestation framework
- AI monk companion trained on Nikola Tesla's energy principles and manifestation wisdom
- Seamless voice journaling with speech-to-text capability
- Built-in meditation and breathing exercises
- Progress tracking across all 10 phases
- Mobile-first design optimized for iOS

---

## 3. Feature Requirements

### 3.1 Core Features (MVP - Phase 1)

#### 3.1.1 Digital Workbook System
**Priority:** P0 (Critical)

**User Stories:**
- As a user, I want to access all 10 phases of the workbook digitally so I can work through them on my mobile device
- As a user, I want to complete worksheets within the app so I can track my manifestation journey
- As a user, I want to save my progress so I can return to where I left off

**Detailed Requirements:**

**Phase Structure:**
1. **Phase 1: Self-Evaluation (Pages 1-54)**
   - Wheel of Life assessment (8 life areas)
   - Feel Wheel emotional tracking
   - Habit identification and tracking
   - ABC Model worksheet
   - SWOT analysis
   - Personal values identification
   - Strengths/weaknesses assessment
   - Comfort zone exploration
   - "Know Yourself" prompts
   - Abilities rating system
   - Thought awareness exercises

2. **Phase 2: Values & Vision (Pages 55-69)**
   - Core values clarification
   - Vision board creation tools
   - Life purpose exploration
   - Priority mapping
   - Future self visualization

3. **Phase 3: Goal Setting (Pages 70-82)**
   - SMART goal framework
   - Action plan creation
   - Milestone tracking
   - Timeline visualization
   - Progress checkpoints

4. **Phase 4: Facing Fears & Limiting Beliefs (Pages 83-95)**
   - Decatastrophizing worksheet
   - Putting thoughts on trial
   - Reframing exercises
   - Manifestations vs. limiting beliefs
   - Cognitive restructuring
   - Core beliefs examination
   - Letter to past self

5. **Phase 5: Cultivating Self-Love & Self-Care (Pages 96-117)**
   - Self-care routines
   - Self-compassion exercises
   - Boundaries setting
   - Self-love affirmations
   - Daily rituals

6. **Phase 6: Manifestation Techniques (Pages 118-169)**
   - 3-6-9 Method
   - WOOP Method (Wish, Outcome, Obstacle, Plan)
   - Visualization exercises (wealth and abundance)
   - 21-Day Money Affirmation Challenge
   - Mirror Method
   - Scripting dialogs
   - Knot Method
   - Discount Trigger Method
   - Gratitude Blitz Jar

7. **Phase 7: Practicing Gratitude (Pages 170-177)**
   - Daily gratitude journaling
   - Gratitude prompts
   - Recognition exercises
   - Appreciation tracking

8. **Phase 8: Turning Envy Into Inspiration (Pages 178-183)**
   - Envy transformation exercises
   - Inspiration board creation
   - Competitive mindset shift

9. **Phase 9: Trust & Surrender (Pages 184-189)**
   - Letting go exercises
   - Trust-building activities
   - Surrender practices
   - Faith development

10. **Phase 10: Trust & Letting Go (Pages 190-196)**
    - Final integration exercises
    - Release rituals
    - Future timeline selection
    - Completion ceremony

**Technical Requirements:**
- Form input fields supporting: text, numbers, sliders (1-10 scales), multiple choice, long-form text areas
- Auto-save functionality every 30 seconds
- Cloud sync for data backup (iCloud integration)
- Export capability for individual phases or complete workbook (PDF format)
- Progress indicators showing % completion per phase and overall
- Visual timeline showing journey progression
- Ability to revisit and edit previous entries
- Smart prompts based on incomplete sections

**UI/UX Requirements:**
- Clean, calming design with spiritual/mystical aesthetic
- Intuitive navigation between phases and exercises
- Visual progress indicators
- Encouraging micro-animations
- Haptic feedback for completed exercises
- Golden/ethereal color palette matching brand identity
- Typography optimized for readability on mobile

**Acceptance Criteria:**
- [ ] All 10 phases accessible from main dashboard
- [ ] Each worksheet loads within 2 seconds
- [ ] Auto-save functions without user intervention
- [ ] Progress accurately tracked and displayed
- [ ] Users can navigate between phases freely
- [ ] All form inputs properly validated
- [ ] Data persists across app sessions

---

#### 3.1.2 Voice-to-Text Journaling System
**Priority:** P0 (Critical)

**User Stories:**
- As a user, I want to record my thoughts via voice so I can journal quickly and naturally
- As a user, I want my voice recordings transcribed to text so I can read and search my entries later
- As a user, I want to organize my journal entries by date and topic so I can track my growth

**Detailed Requirements:**

**Core Functionality:**
- Voice recording with real-time transcription
- Manual text entry option
- Entry categorization by:
  - Date/time
  - Associated workbook phase
  - Custom tags
  - Mood/emotion
- Search functionality across all entries
- Audio playback of original recordings
- Edit transcriptions

**Technical Requirements:**
- iOS native Speech framework integration
- AVFoundation for audio recording
- Core Data or CloudKit for storage
- Background audio processing
- Network handling for cloud transcription services (fallback)
- Audio quality: minimum 44.1kHz sampling rate
- Maximum recording length: 15 minutes per session
- Offline transcription capability (on-device processing preferred)

**Storage:**
- Text entries: iCloud sync
- Audio files: Optional local storage with iCloud backup
- Compression for audio files
- Estimated storage: 1-5MB per hour of audio

**Privacy:**
- End-to-end encryption for journal entries
- Biometric authentication (Face ID/Touch ID) for journal access
- Optional journal lock with passcode
- No third-party data sharing

**UI/UX Requirements:**
- Large, accessible record button
- Real-time waveform visualization during recording
- Transcription preview during recording
- Easy pause/resume functionality
- Entry preview cards in journal list
- Calendar view for entry browsing
- Tag-based filtering

**Acceptance Criteria:**
- [ ] Voice recording accuracy >90% for clear speech
- [ ] Transcription completes within 5 seconds of recording end
- [ ] All entries encrypted at rest
- [ ] Biometric lock functions correctly
- [ ] Search returns relevant results within 1 second
- [ ] Offline functionality maintained

---

#### 3.1.3 Meditation & Breathing Exercises
**Priority:** P0 (Critical)

**User Stories:**
- As a user, I want guided meditation sessions so I can develop a regular meditation practice
- As a user, I want breathing exercises with visual guides so I can calm my mind and regulate emotions
- As a user, I want to track my meditation practice so I can see my consistency

**Detailed Requirements:**

**Meditation Library:**
- **Tutorial Content:**
  - Introduction to Meditation (5 min)
  - Body Scan Technique (10 min)
  - Manifestation Meditation Basics (8 min)
  - Emotional Authority Practice (7 min)

- **Guided Sessions:**
  - 5-minute Morning Manifestation
  - 5-minute Evening Gratitude
  - 10-minute Abundance Alignment
  - 10-minute Limiting Beliefs Release
  - 5-minute Quick Reset
  - 10-minute Deep Alignment

**Breathing Exercises:**
From the workbook resources:
1. **Triangle Breathing**
   - Visual guide: triangle shape
   - Inhale 5 seconds → Hold 5 seconds → Exhale 5 seconds
   - Interactive visual guidance

2. **Box Breathing**
   - Visual guide: square shape
   - Inhale 4 seconds → Hold 4 seconds → Exhale 4 seconds → Hold 4 seconds
   - Interactive visual guidance

3. **5-Finger Breathing**
   - Visual guide: hand outline
   - Trace up finger (inhale) → Trace down finger (exhale)
   - Animated guidance through all 5 fingers

**Technical Requirements:**
- Audio streaming (AVPlayer)
- Background audio support
- Offline audio caching
- Timer functionality with notifications
- Haptic feedback synchronized with breathing rhythms
- Audio file formats: M4A (AAC) for optimal quality/size ratio
- Average file size: 5-15MB per guided meditation

**Tracking & Analytics:**
- Session completion tracking
- Total meditation time
- Streak counter
- Favorite meditations
- Practice frequency visualization
- Progress badges/achievements

**UI/UX Requirements:**
- Calming visual designs for each exercise
- Animated breathing guides
- Customizable timer durations
- Background ambient soundscapes
- Play/pause controls
- Session history with calendar view
- Reminder scheduling

**Acceptance Criteria:**
- [ ] All meditations playable offline
- [ ] Audio quality consistent and clear
- [ ] Visual breathing guides sync accurately
- [ ] Haptic feedback enhances experience
- [ ] Session data accurately tracked
- [ ] Users can set daily reminders
- [ ] Background playback works with screen off

---

#### 3.1.4 AI Monk Companion (Wisdom Chat)
**Priority:** P1 (High)

**User Stories:**
- As a user, I want to ask questions about manifestation so I can get personalized guidance
- As a user, I want insights based on my workbook progress so I receive relevant advice
- As a user, I want to explore Nikola Tesla's energy principles so I can deepen my understanding

**Detailed Requirements:**

**AI Knowledge Base:**
- Manifest the Unseen PDF content (all 10 chapters)
- Workbook exercises and methodologies
- Transcript 02: Shi Heng Yi Mindset teachings
- Transcript 03: Book Essence Hub content
- Nikola Tesla writings on:
  - Energy and vibration
  - Frequency and resonance
  - 3-6-9 principles
  - Thought and manifestation
- Universal Laws of Manifestation

**Chat Functionality:**
- Natural language processing
- Context-aware responses based on:
  - Current workbook phase
  - Recent journal entries (with permission)
  - User's stated goals
  - Past conversation history
- Suggested questions/prompts
- Ability to ask follow-up questions
- Share chat excerpts to journal

**AI Personality:**
- Wise, calm, monk-like tone
- Non-judgmental and supportive
- Incorporates Tesla quotes appropriately
- Uses metaphors and examples from nature
- Asks reflective questions
- Provides actionable guidance

**Technical Requirements:**
- Integration with AI API (Claude, GPT-4, or custom model)
- Vector database for knowledge base (Pinecone, Weaviate, or similar)
- RAG (Retrieval Augmented Generation) architecture
- Rate limiting: 50 messages per day (free tier)
- Response time: <5 seconds
- Context window: Last 10 message exchanges
- Secure API key management

**Privacy & Ethics:**
- Clear disclosure of AI nature
- No medical, legal, or financial advice
- Content moderation for harmful requests
- User data not used for AI training
- Conversation encryption

**UI/UX Requirements:**
- Chat bubble interface
- Typing indicators
- Message timestamps
- Copy message functionality
- Conversation history
- Searchable chat archive
- Quick prompt buttons for common questions

**Acceptance Criteria:**
- [ ] AI responds relevantly to manifestation questions
- [ ] Responses incorporate knowledge base content
- [ ] Conversation maintains context
- [ ] No inappropriate or harmful content generated
- [ ] Response time meets performance requirements
- [ ] Context awareness based on workbook progress works

---

### 3.2 Secondary Features (Post-MVP)

#### 3.2.1 Vision Board Creator
**Priority:** P2 (Medium)

**Features:**
- Image upload and library
- Text overlays and affirmations
- Collage creation tools
- Save and share functionality
- Daily vision board reminder

#### 3.2.2 Community Features
**Priority:** P3 (Low)

**Features:**
- Anonymous sharing of manifestation wins
- Discussion forums by topic
- Accountability partners matching
- Group meditation sessions
- Monthly challenges

#### 3.2.3 Advanced Analytics
**Priority:** P2 (Medium)

**Features:**
- Manifestation success tracking
- Pattern recognition in journal entries
- Energy level tracking over time
- Correlation insights (meditation vs. mood)
- Custom reports

#### 3.2.4 Integration Features
**Priority:** P3 (Low)

**Features:**
- Apple Health integration (mindful minutes)
- Calendar app integration for reminders
- Shortcuts app support
- Widget for home screen
- Watch app for quick meditation access

---

## 4. Technical Architecture Overview

### 4.1 Platform Requirements
- **Minimum iOS Version:** iOS 15.0+
- **Target Devices:** iPhone (primary), iPad (optimized)
- **Orientations:** Portrait (primary), Landscape (supported)
- **Accessibility:** Full VoiceOver support, Dynamic Type

### 4.2 Tech Stack (CONFIRMED)

**Frontend:**
- **Framework:** SwiftUI (primary) with UIKit where needed
- **Language:** Swift 5.9+
- **State Management:** Combine framework + SwiftUI @State/@Observable
- **Navigation:** SwiftUI NavigationStack
- **UI Components:** Native iOS components + custom spiritual-themed designs
- **Audio:** AVFoundation for playback
- **Speech Recognition:** OpenAI Whisper (embedded model)

**Backend/Services:**
- **Backend Platform:** Supabase (PostgreSQL + Real-time + Auth + Storage)
- **Authentication:** 
  - Supabase Auth with Apple Sign-In
  - Biometric authentication (local)
- **Database:** 
  - Supabase PostgreSQL (user data, workbook progress, journal entries)
  - Local: Core Data for offline caching
- **Real-time Sync:** Supabase Realtime for cross-device synchronization
- **Storage:** Supabase Storage (minimal - only for vision board images)

**AI/ML Services:**
- **Primary AI:** Claude API (Anthropic) - main wisdom chat
- **Secondary AI:** OpenAI GPT-4 - advanced reasoning, fallback
- **Voice Transcription:** OpenAI Whisper (on-device, embedded model)
  - whisper.cpp or WhisperKit for iOS
  - Runs locally - no audio leaves device
  - Fast, accurate, free
- **Vector Database:** 
  - Option A: Supabase pgvector extension (cost-effective, integrated)
  - Option B: Pinecone (if advanced vector search needed)

**Analytics & Monitoring:**
- **Analytics:** TelemetryDeck (privacy-focused) or Firebase Analytics
- **Crash Reporting:** Sentry
- **Performance:** Xcode Instruments + custom logging
- **A/B Testing:** Post-MVP (GrowthBook or Firebase Remote Config)

**Payments:**
- **Subscription Management:** StoreKit 2 + RevenueCat
  - RevenueCat handles subscription state, webhooks, and cross-platform prep
  - Simplifies subscription logic and analytics

**Push Notifications:**
- **Service:** APNs (Apple Push Notification service)
- **Management:** Supabase Edge Functions for scheduling
- **Local Notifications:** UserNotifications framework for reminders

**Third-Party SDKs (Minimal Approach):**
- RevenueCat (subscriptions)
- Sentry (crash reporting)
- TelemetryDeck (analytics)
- No bloated SDKs - keep app lean and fast

### 4.3 Architecture Decisions - Rationale

**Why Supabase?**
- ✅ Cost-effective managed PostgreSQL
- ✅ Built-in authentication
- ✅ Real-time subscriptions out of the box
- ✅ Edge Functions for serverless operations
- ✅ pgvector for AI embeddings
- ✅ Easy to scale as user base grows
- ✅ Generous free tier for development and early launch

**Why OpenAI Whisper (On-Device)?**
- ✅ Completely free - no per-minute transcription costs
- ✅ Privacy-first - audio never leaves device
- ✅ Fast transcription (1-2 seconds for typical journal entry)
- ✅ Works offline
- ✅ High accuracy for English
- ✅ Open-source with iOS implementations available

**Why Dual AI Providers (Claude + OpenAI)?**
- ✅ Claude excels at thoughtful, nuanced spiritual guidance
- ✅ OpenAI GPT-4 provides fallback and different reasoning style
- ✅ Future flexibility for users to choose or bring own keys
- ✅ Cost optimization through intelligent routing
- ✅ Redundancy if one service has downtime

**Why Native iOS Only?**
- ✅ Best performance and user experience
- ✅ Full access to iOS features (SwiftUI, HealthKit, Shortcuts, Widgets)
- ✅ Faster development for single platform
- ✅ Higher quality, better App Store positioning
- ✅ Premium feel aligned with wellness/spiritual market
- ✅ Easier to maintain and iterate quickly

### 4.4 Data Flow Architecture

**User Journey Data Flow:**
```
User Device (iOS App)
    ↓
Local Storage (Core Data) ← Auto-save every 30s
    ↓
Supabase Client (Real-time sync)
    ↓
Supabase Cloud (PostgreSQL + Auth + Storage)
    ↓
[Sync across devices via Supabase Realtime]
```

**Voice Journal Flow:**
```
User speaks → AVAudioRecorder captures
    ↓
Whisper model (on-device) transcribes
    ↓
Text stored in Core Data (local)
    ↓
Supabase sync (text only, no audio)
    ↓
Available across devices
```

**AI Chat Flow:**
```
User question
    ↓
Vector search in knowledge base (Supabase pgvector)
    ↓
Retrieve relevant context (RAG)
    ↓
Send to Claude API with context
    ↓
Stream response back to user
    ↓
Save conversation to Supabase
```

### 4.5 Offline Functionality Strategy

**What Works Offline:**
- ✅ All workbook exercises (pre-loaded)
- ✅ Voice journaling with transcription
- ✅ Reading past journal entries (cached)
- ✅ Meditation playback (cached audio)
- ✅ Breathing exercises
- ✅ Progress tracking

**What Requires Internet:**
- ❌ AI monk chat (API calls)
- ❌ Syncing data across devices
- ❌ Downloading new meditation content
- ❌ Vision board image uploads
- ❌ Subscription management (initial purchase/restore)

**Offline-First Design:**
- Local-first architecture with background sync
- Queue API requests when offline
- Clear UI indicators for online/offline status
- Graceful degradation of features

---

## 5. User Experience (UX) Requirements

### 5.1 Onboarding Flow
1. **Welcome Screen**
   - App introduction
   - Key value propositions
   - Beautiful visual design

2. **Permission Requests**
   - Microphone (for voice journaling)
   - Notifications (for reminders)
   - iCloud sync (data backup)

3. **Profile Setup**
   - Name
   - Manifestation goals (optional)
   - Starting intentions

4. **Tutorial**
   - Interactive walkthrough
   - Key feature highlights
   - First meditation preview

5. **Phase 1 Introduction**
   - Begin workbook journey

### 5.2 Core Navigation Structure

**Tab Bar (Bottom Navigation):**
1. **Home/Dashboard**
   - Current phase progress
   - Daily inspiration quote
   - Quick actions
   - Streak counter
   - Today's meditation

2. **Workbook**
   - Phase navigation
   - Current worksheet
   - Progress overview

3. **Journal**
   - Voice recording button (prominent)
   - Entry list
   - Search and filter

4. **Meditate**
   - Meditation library
   - Breathing exercises
   - Practice history

5. **Wisdom (AI Chat)**
   - Monk companion
   - Conversation history
   - Quick prompts

**Additional Screens:**
- Settings/Profile
- Progress/Analytics
- Resources library
- Notifications center

### 5.3 Design Principles
- **Calming:** Soft colors, generous spacing, smooth animations
- **Intuitive:** Clear labels, familiar patterns, minimal learning curve
- **Encouraging:** Positive reinforcement, celebration of milestones
- **Focused:** Minimal distractions, one task at a time
- **Beautiful:** High-quality visuals, thoughtful typography, brand-consistent

### 5.4 Accessibility Requirements
- VoiceOver fully supported
- Dynamic Type support
- High contrast mode
- Reduce Motion respect
- Color blindness considerations
- Minimum touch target: 44x44pt
- Clear focus indicators
- Descriptive labels for all interactive elements

---

## 6. Content Requirements

### 6.1 Meditation Audio Content
- 6 guided meditations (professionally recorded)
- Ambient background soundscapes (4-5 tracks)
- Binaural beats (optional enhancement)
- Voice: Calm, clear, gender-neutral or multiple options

### 6.2 Written Content
- All workbook exercises digitized
- Daily inspiration quotes (365+)
- Help documentation
- Tutorial copy
- Error messages and user guidance
- AI monk prompt library

### 6.3 Visual Assets
- App icon (multiple sizes)
- Splash screen
- Phase illustrations (10 unique images)
- Breathing exercise animations
- Progress badges/achievements
- Empty states illustrations
- Tutorial graphics

---

## 7. Performance Requirements

### 7.1 Speed & Responsiveness
- App launch: <3 seconds
- Screen transitions: <0.5 seconds
- Voice transcription: <5 seconds post-recording
- AI chat response: <5 seconds
- Worksheet auto-save: <1 second
- Audio playback start: <2 seconds

### 7.2 Resource Usage
- App size: <100MB initial download
- RAM usage: <150MB typical, <300MB peak
- Battery: <5% drain per 30-minute session
- Network: Minimal background data usage

### 7.3 Reliability
- Crash rate: <0.1%
- Offline functionality: Core features work without internet
- Data integrity: Zero data loss with auto-save and sync
- Uptime: 99.9% for cloud services

---

## 8. Security & Privacy Requirements

### 8.1 Data Protection
- End-to-end encryption for journal entries
- Encrypted at rest for all sensitive data
- Secure API communication (HTTPS only)
- No collection of unnecessary data
- GDPR and CCPA compliant

### 8.2 Authentication
- Apple Sign-In (primary)
- Biometric authentication for journal
- Optional passcode lock
- Session management
- Secure token storage

### 8.3 Privacy Policy
- Clear data usage disclosure
- User control over data sharing
- Right to delete all data
- No sale of personal information
- Transparent AI usage disclosure

---

## 9. Monetization Strategy ✅ CONFIRMED

### 9.1 Business Model
**Subscription-Based with 7-Day Free Trial**

All users get 7 days of full access to experience the complete app before choosing their path.

### 9.2 Subscription Tiers

**Zen Buddhist-Themed Tiers (RECOMMENDED)**

#### 🌱 Novice Path - $7.99/month or $59.99/year
*"Begin your journey of awakening"*

**Includes:**
- Full access to Phases 1-5 of the workbook
  - Self-Evaluation
  - Values & Vision  
  - Goal Setting
  - Facing Fears & Limiting Beliefs
  - Cultivating Self-Love & Self-Care
- 3 guided meditations (mix of 5 & 10 min)
- All breathing exercises (Triangle, Box, 5-Finger)
- 50 journal entries per month (voice or text)
- 30 AI chat messages per day
- 1 vision board
- Basic progress tracking
- Female narrator for meditations
- Standard email support

**Target User:** New to manifestation, exploring the practice, budget-conscious

---

#### 🧘 Awakening Path - $12.99/month or $99.99/year ⭐ MOST POPULAR
*"Deepen your practice and expand awareness"*

**Includes Everything in Novice Path, PLUS:**
- Full access to Phases 6-8
  - Manifestation Techniques (3-6-9 Method, WOOP, Scripting, etc.)
  - Practicing Gratitude
  - Turning Envy Into Inspiration
- 6 guided meditations (all session types)
- 200 journal entries per month
- 100 AI chat messages per day
- Up to 3 vision boards
- Advanced analytics with insights
- Both male and female narrator options
- Monthly new content on day 1 of release
- Priority email support

**Target User:** Committed to the practice, seeing results, wants deeper tools

---

#### ✨ Enlightenment Path - $19.99/month or $149.99/year
*"Embody mastery and unlimited potential"*

**Includes Everything in Awakening Path, PLUS:**
- Full access to Phases 9-10
  - Trust & Surrender
  - Trust & Letting Go
- ALL current and future guided meditations
- Unlimited journal entries
- Unlimited AI chat messages
- Unlimited vision boards
- Premium analytics with PDF exports
- Early access to new meditations (2 weeks early)
- Exclusive Tesla wisdom content modules
- Request specific meditation topics (1 per quarter)
- Priority video call support (1 per month)
- Lifetime discount lock (price increases won't affect you)
- Community features when launched (post-MVP)

**Target User:** Power users, manifestation practitioners, those seeing life-changing results

---

### 9.3 Annual Subscription Savings
- **Novice Path:** Save $36/year (37.5% off)
- **Awakening Path:** Save $56/year (36% off)  
- **Enlightenment Path:** Save $90/year (37.5% off)

### 9.4 Free Trial Implementation
**7-Day Trial Strategy:**
- All users get Enlightenment Path access for 7 days
- Onboarding guides them through Phases 1-3
- Daily encouragement notifications
- Progress tracking shows their journey
- On Day 5: Gentle reminder of trial ending
- On Day 6: Benefits summary and tier comparison
- On Day 7: Choose your path or lose access to paid features

**Post-Trial Grace Period:**
- Users can still read (but not edit) their journal entries
- Access to 1 free meditation per week
- Breathing exercises remain free forever
- Can upgrade anytime to regain full access

### 9.5 Pricing Psychology
**Why This Structure Works:**

1. **Anchoring Effect:** Enlightenment Path at $19.99 makes $12.99 feel like a great deal
2. **Goldilocks Principle:** Middle tier will be most popular (70% of conversions expected)
3. **Value Perception:** 7-day trial with full access shows the app's true value
4. **Content Gating:** Natural progression encourages upgrades (users want to complete all 10 phases)
5. **Annual Commitment:** Significant savings incentivize yearly subscriptions (better LTV)

### 9.6 Monetization Implementation

**Technical Requirements:**
- **StoreKit 2:** Native iOS subscription handling
- **RevenueCat Integration:** Simplifies subscription state management
  - Cross-platform ready (if we expand to Android)
  - Server-side subscription validation
  - Webhook handling
  - Analytics and metrics

**Subscription Features:**
- Free trial (7 days) - requires payment method upfront
- Automatic renewal
- Family Sharing support (App Store requirement)
- Restore purchases functionality
- Upgrade/downgrade between tiers
- Cancellation with access until period end
- Reactivation flow for churned users

**Revenue Operations:**
- Apple takes 30% Year 1, 15% after (subscriber for 1+ year)
- RevenueCat free up to $10k MRR, then 1% of tracked revenue
- Expected blended effective revenue rate: ~68% of gross after all fees

### 9.7 Conversion Funnel Strategy

**Acquisition → Trial → Paid**

1. **Acquisition (App Store)**
   - ASO optimized listing
   - "Start Your Free Trial" CTA
   - Social proof (ratings, testimonials)
   - Preview video showing transformation

2. **Trial Experience (Days 1-7)**
   - Personalized onboarding
   - Guided first meditation
   - Complete Phase 1 together
   - Daily check-ins and encouragement
   - Show value through actual use

3. **Conversion Prompts**
   - Day 5: "You're making progress! Continue your journey..."
   - Day 6: Feature comparison chart
   - Day 7: "Choose Your Path" with tier selection
   - Emphasize: "Your data is saved, pick up right where you left off"

4. **Post-Conversion**
   - Welcome to your path celebration
   - Unlock badge/achievement
   - Share accomplishment (optional)
   - Set up personalized practice schedule

### 9.8 Retention & Expansion Revenue

**Retention Tactics:**
- Monthly new content keeps subscribers engaged
- Progress tracking shows investment in journey
- Streaks and habits increase switching costs
- Personal journal creates emotional attachment
- AI monk becomes a trusted companion

**Expansion Opportunities:**
- **Year 2:** In-app purchases for special content bundles
- **Year 2:** One-time purchases for advanced courses
- **Year 3:** Certification program for coaches using the app
- **Year 3:** B2B licensing for wellness centers, therapists

### 9.9 Projected Revenue Model

**Conservative Estimates (Year 1):**

| Metric | Month 1 | Month 6 | Month 12 |
|--------|---------|---------|----------|
| Total Downloads | 1,000 | 8,000 | 25,000 |
| Trial Start Rate | 70% | 70% | 70% |
| Trial → Paid | 25% | 30% | 35% |
| Paid Users | 175 | 1,680 | 6,125 |
| Avg. Monthly Revenue per User | $10 | $11 | $12 |
| **Monthly Recurring Revenue** | **$1,750** | **$18,480** | **$73,500** |
| **Annual Revenue** | - | - | **$450,000** |

**Tier Distribution Assumption:**
- Novice Path: 20%
- Awakening Path: 65% (most popular)
- Enlightenment Path: 15%

### 9.10 Upgrade Prompts (Non-Intrusive)

**When to Show Upgrade Prompts:**
- User completes Phase 5 (end of Novice Path access)
- User hits monthly journal entry limit
- User reaches daily AI chat limit
- User tries to create additional vision boards
- User attempts to access locked phase

**How to Show:**
- Elegant modal with benefits
- "Not now" option always available
- Never more than once per day
- Never during meditation or deep work
- Always respectful of user experience

---

## 10. Analytics & Success Metrics

### 10.1 Key Performance Indicators (KPIs)

**Engagement Metrics:**
- Daily Active Users (DAU)
- Weekly Active Users (WAU)
- Monthly Active Users (MAU)
- Session length (target: 15-30 minutes)
- Session frequency (target: 5+ times/week)
- Feature usage rates
- Completion rate by phase

**Retention Metrics:**
- Day 1, 7, 30, 90 retention rates
- Churn rate
- Reactivation rate
- Streak maintenance

**Conversion Metrics:**
- Free to paid conversion rate (target: 5-10%)
- Trial to paid conversion (target: 40%+)
- Revenue per user
- Lifetime value (LTV)

**Quality Metrics:**
- App Store rating (target: 4.5+)
- Net Promoter Score (NPS)
- Support ticket volume
- Crash-free sessions (target: 99.9%+)

### 10.2 Event Tracking
- Workbook phase started/completed
- Worksheet completed
- Meditation session started/completed
- Journal entry created (voice vs. text)
- AI chat interaction
- Feature usage by type
- In-app purchase events
- Sharing/referral events

---

## 11. Launch & Marketing Requirements

### 11.1 Pre-Launch
- Beta testing program (TestFlight)
- Landing page with email signup
- Social media presence setup
- Press kit preparation
- App Store Optimization (ASO) research

### 11.2 Launch Assets
- App Store screenshots (6.5" and 5.5" displays)
- App preview video (30 seconds)
- App Store description (compelling copy)
- Keywords optimization
- Promotional text
- What's New section

### 11.3 Marketing Strategy
- Influencer partnerships (spiritual/wellness space)
- Content marketing (blog posts, guides)
- Social proof (testimonials, case studies)
- Paid acquisition (Facebook, Instagram, TikTok)
- App Store features pursuit
- PR outreach to wellness publications

---

## 12. Development Roadmap ✅ UPDATED

### 12.1 Pre-Development Phase (Weeks 1-2)
**Setup & Planning**
- [ ] Finalize licensing/rights for Lunar Rivers content
- [ ] Design system creation (colors, typography, components)
- [ ] Information architecture and user flows
- [ ] Supabase project setup
- [ ] Development environment configuration
- [ ] Repository setup and CI/CD pipeline
- [ ] Obtain API keys (Claude, OpenAI)

**Deliverables:**
- Design system documentation
- Technical architecture diagram
- Database schema design
- API integration plan
- Sprint backlog prioritized

---

### 12.2 Phase 1: Core Foundation (Weeks 3-8) - 6 weeks

#### Week 3-4: Authentication & Navigation
- [ ] Supabase authentication integration
- [ ] Apple Sign-In implementation
- [ ] Biometric authentication (Face ID/Touch ID)
- [ ] Core navigation structure (TabBar + NavigationStack)
- [ ] Onboarding flow (5 screens)
- [ ] User profile setup

#### Week 5-6: Workbook Foundation (Phases 1-3)
- [ ] Database schema for workbook data
- [ ] Form builder system (reusable components)
- [ ] Auto-save functionality
- [ ] Progress tracking system
- [ ] Phase 1: Self-Evaluation (all worksheets)
- [ ] Phase 2: Values & Vision (all worksheets)
- [ ] Phase 3: Goal Setting (all worksheets)

#### Week 7-8: Voice Journaling MVP
- [ ] OpenAI Whisper integration (whisper.cpp or WhisperKit)
- [ ] Audio recording with AVAudioRecorder
- [ ] Real-time transcription
- [ ] Journal entry CRUD operations
- [ ] Journal list and detail views
- [ ] Search functionality
- [ ] Entry encryption implementation

**Milestone 1 Deliverables:** Basic app structure, auth, first 3 workbook phases, voice journaling working

---

### 12.3 Phase 2: Core Features Completion (Weeks 9-14) - 6 weeks

#### Week 9-10: Workbook Phases 4-7
- [ ] Phase 4: Facing Fears & Limiting Beliefs
- [ ] Phase 5: Cultivating Self-Love & Self-Care
- [ ] Phase 6: Manifestation Techniques (all 9 methods)
- [ ] Phase 7: Practicing Gratitude
- [ ] Form validation and error handling
- [ ] Phase completion celebrations

#### Week 11-12: Workbook Phases 8-10 + Progress System
- [ ] Phase 8: Turning Envy Into Inspiration
- [ ] Phase 9: Trust & Surrender
- [ ] Phase 10: Trust & Letting Go
- [ ] Complete progress dashboard
- [ ] Streak tracking
- [ ] Achievement badges system
- [ ] Export functionality (PDF)

#### Week 13-14: Meditation & Breathing System
- [ ] Audio player with AVFoundation
- [ ] Meditation library UI
- [ ] 6 guided meditations (record or license)
- [ ] Male and female voice versions (12 total files)
- [ ] Breathing exercise animations
  - Triangle breathing visual
  - Box breathing visual
  - 5-finger breathing visual
- [ ] Haptic feedback integration
- [ ] Session tracking and history
- [ ] Meditation reminder scheduling

**Milestone 2 Deliverables:** Complete workbook (all 10 phases), meditation system, breathing exercises

---

### 12.4 Phase 3: AI & Advanced Features (Weeks 15-20) - 6 weeks

#### Week 15-16: AI Knowledge Base Setup
- [ ] Ingest all Lunar Rivers content
- [ ] Process Shi Heng Yi transcript
- [ ] Process Book Essence Hub transcript
- [ ] Add Tesla wisdom content
- [ ] Create embeddings with OpenAI
- [ ] Store vectors in Supabase pgvector
- [ ] Test retrieval accuracy

#### Week 17-18: AI Monk Chat Implementation
- [ ] Chat UI implementation
- [ ] RAG (Retrieval Augmented Generation) system
- [ ] Claude API integration
- [ ] OpenAI GPT-4 fallback logic
- [ ] Context-aware prompting (based on user phase)
- [ ] Conversation history management
- [ ] Rate limiting implementation
- [ ] Message encryption

#### Week 19-20: Vision Board & Integrations
- [ ] Vision board creator UI
- [ ] Image picker and upload
- [ ] Image storage in Supabase
- [ ] Text overlay and editing tools
- [ ] Save multiple boards
- [ ] Daily vision board reminder
- [ ] Share functionality
- [ ] Apple Health integration (mindful minutes)
- [ ] Shortcuts app actions

**Milestone 3 Deliverables:** AI monk working, vision boards functional, all features complete

---

### 12.5 Phase 4: Subscription & Polish (Weeks 21-24) - 4 weeks

#### Week 21-22: Subscription System
- [ ] StoreKit 2 integration
- [ ] RevenueCat setup and configuration
- [ ] 7-day free trial implementation
- [ ] Three-tier subscription products
- [ ] Paywall UI (tier comparison)
- [ ] Feature gating logic
- [ ] Restore purchases
- [ ] Family Sharing support
- [ ] Subscription status monitoring
- [ ] Upgrade/downgrade flows

#### Week 23: Analytics & Monitoring
- [ ] TelemetryDeck integration
- [ ] Event tracking implementation
- [ ] Conversion funnel tracking
- [ ] Sentry crash reporting
- [ ] Performance monitoring
- [ ] User journey analytics
- [ ] Dashboard for monitoring

#### Week 24: Polish & Optimization
- [ ] UI/UX refinements
- [ ] Accessibility audit and fixes
- [ ] Performance optimization
- [ ] Loading state improvements
- [ ] Error handling polish
- [ ] Animations and transitions
- [ ] Dark mode support (if not done earlier)
- [ ] Haptic feedback tuning
- [ ] Final design review

**Milestone 4 Deliverables:** Subscriptions working, analytics tracking, app polished

---

### 12.6 Phase 5: Testing & Launch Prep (Weeks 25-28) - 4 weeks

#### Week 25-26: Testing
- [ ] Internal QA testing (all features)
- [ ] TestFlight beta setup
- [ ] Beta tester recruitment (50-100 users)
- [ ] Bug tracking and prioritization
- [ ] Fix critical and high-priority bugs
- [ ] Performance testing on older devices
- [ ] Network condition testing
- [ ] Subscription flow testing

#### Week 27: App Store Preparation
- [ ] App Store Connect setup
- [ ] App Store screenshots (all required sizes)
- [ ] App preview video (30 seconds)
- [ ] App Store description (ASO optimized)
- [ ] Keywords research and selection
- [ ] Privacy policy creation
- [ ] Terms of service
- [ ] Support website/email setup
- [ ] Press kit preparation

#### Week 28: Final Launch Prep
- [ ] Address beta tester feedback
- [ ] Final bug fixes
- [ ] App Store submission
- [ ] Monitoring dashboard setup
- [ ] Customer support system ready
- [ ] Marketing materials ready
- [ ] Social media accounts setup
- [ ] Launch day communication plan

**Milestone 5 Deliverables:** App submitted to App Store, ready for launch

---

### 12.7 Timeline Summary

**Total Development Time: 28 weeks (~7 months)**

| Phase | Duration | Key Deliverables |
|-------|----------|------------------|
| Pre-Dev | 2 weeks | Setup, design system, planning |
| Phase 1: Foundation | 6 weeks | Auth, navigation, Phases 1-3, voice journal |
| Phase 2: Features | 6 weeks | Phases 4-10, meditation, breathing |
| Phase 3: AI & Advanced | 6 weeks | AI monk, vision boards, integrations |
| Phase 4: Subscription & Polish | 4 weeks | Payments, analytics, polish |
| Phase 5: Testing & Launch | 4 weeks | QA, App Store prep, launch |

**Expected Launch Date:** 7 months from development start

---

### 12.8 Post-Launch Roadmap (Months 8-12)

#### Month 8: Stabilization
- Monitor app performance and stability
- Fix any critical bugs discovered at scale
- Gather user feedback
- Analyze subscription conversion data
- Optimize onboarding based on data

#### Month 9: Content Expansion
- Add first monthly meditation
- Expand Tesla wisdom content
- Create additional journal prompts
- Launch first in-app event/challenge

#### Month 10: Feature Enhancement
- Advanced analytics for users
- Meditation customization options
- Additional breathing exercises
- Widget improvements
- Watch app consideration

#### Month 11: Community Foundation
- Design community features
- Begin development of sharing system
- Accountability partner matching
- Private groups structure

#### Month 12: Year 1 Review & Planning
- Comprehensive analytics review
- User satisfaction survey
- Feature prioritization for Year 2
- Android feasibility assessment
- Financial performance analysis

---

### 12.9 Resource Requirements

**Development Team (Recommended):**
- 1 iOS Developer (Full-time) - Lead
- 1 Backend Developer (Part-time/Contractor) - Supabase, AI integration
- 1 UI/UX Designer (Contractor) - Design system, screens, assets
- 1 QA Tester (Contractor) - Week 25-28
- 1 Content Specialist (Contractor) - Meditation scripts, copy
- 1 Voice Talent (Male + Female) - Meditation recording

**Alternative Lean Approach (Budget-Conscious):**
- 1 Full-Stack iOS Developer (You?) - 40hrs/week
- 1 Designer (Contractor) - 10-20hrs/week for first 8 weeks
- Use Fiverr/Upwork for voice talent
- Self-manage QA with TestFlight beta testers
- **Estimated cost:** $30,000 - $50,000 in contractor fees

**Tools & Services (Monthly Costs):**
- Supabase: Free tier initially, ~$25/mo at scale
- Claude API: ~$100-300/mo (depending on usage)
- OpenAI API: ~$50-150/mo (Whisper + GPT-4 fallback)
- RevenueCat: Free up to $10k MRR
- TelemetryDeck: ~$10/mo
- Sentry: Free tier or ~$26/mo
- Apple Developer: $99/year
- **Total:** ~$200-500/mo operating costs

---

### 12.10 Risk Mitigation in Timeline

**Potential Delays:**
- Whisper integration complexity: +1 week buffer built in
- AI knowledge base tuning: +1 week buffer built in  
- App Store review rejection: +1 week buffer built in
- Subscription implementation edge cases: +1 week buffer built in

**Contingency Plan:**
- 2-week buffer before committed launch date
- Feature prioritization list if timeline slips
- Weekly sprint reviews to catch delays early
- Parallel workstreams where possible (e.g., design + dev)

---

### 12.11 Success Metrics by Phase

**Phase 1 Success:**
- [ ] App doesn't crash
- [ ] Can create account and log in
- [ ] Can complete Phase 1 worksheet
- [ ] Can record and transcribe voice journal
- [ ] Data saves properly

**Phase 2 Success:**
- [ ] All 10 phases accessible and functional
- [ ] Meditation plays without issues
- [ ] Breathing animations are smooth
- [ ] Progress tracks accurately

**Phase 3 Success:**
- [ ] AI provides relevant responses
- [ ] Chat response time < 5 seconds
- [ ] Vision boards can be created and saved
- [ ] All integrations work

**Phase 4 Success:**
- [ ] Users can subscribe successfully
- [ ] Feature gating works correctly
- [ ] Analytics captures all key events
- [ ] No crashes or major bugs

**Phase 5 Success:**
- [ ] Beta testers give 4.0+ average rating
- [ ] App approved by App Store on first try
- [ ] Launch day goes smoothly
- [ ] Early users can onboard without issues

---

## 13. Risks & Mitigation

### 13.1 Technical Risks

**Risk:** AI API costs exceed budget
**Mitigation:** Implement rate limiting, caching, offer tiered access

**Risk:** Voice transcription accuracy issues
**Mitigation:** Use Apple's native Speech framework, allow manual editing

**Risk:** Data sync conflicts
**Mitigation:** Robust conflict resolution, last-write-wins with user notification

### 13.2 Business Risks

**Risk:** Low conversion to paid
**Mitigation:** Strong free tier value, clear upgrade benefits, compelling content

**Risk:** High user acquisition cost
**Mitigation:** Organic growth focus, referral program, influencer partnerships

**Risk:** Competition from similar apps
**Mitigation:** Unique IP (Lunar Rivers content), superior UX, AI differentiation

### 13.3 Legal/Compliance Risks

**Risk:** Content copyright issues
**Mitigation:** Proper licensing of all Lunar Rivers content, clear agreements

**Risk:** AI-generated harmful advice
**Mitigation:** Content filtering, disclaimers, human oversight of AI training

**Risk:** Privacy regulation violations
**Mitigation:** Legal review, compliance framework, transparent policies

---

## 14. Success Criteria

### 14.1 MVP Launch Success
- [ ] App approved and live on App Store
- [ ] 1,000 downloads in first month
- [ ] 4.0+ star rating
- [ ] <1% crash rate
- [ ] 30%+ Day 7 retention
- [ ] 5%+ free to paid conversion

### 14.2 6-Month Success
- [ ] 10,000+ downloads
- [ ] 4.5+ star rating
- [ ] 25%+ Month 1 retention
- [ ] 8%+ conversion rate
- [ ] $10,000+ MRR (subscription model)
- [ ] Featured in App Store (wellness category)

### 14.3 12-Month Vision
- [ ] 50,000+ downloads
- [ ] 4.7+ star rating
- [ ] Active community of manifestation practitioners
- [ ] Proven user success stories and testimonials
- [ ] Expansion to Android
- [ ] Strategic partnerships with wellness influencers

---

## 15. Decisions Confirmed

### 15.1 Technical Decisions ✅ CONFIRMED
- [x] **Platform:** Native iOS only for initial launch
  - Swift/SwiftUI development
  - Future Android expansion to be considered post-launch
  
- [x] **AI API Providers:** Dual provider approach
  - Primary: Claude API (Anthropic) - for monk wisdom chat
  - Secondary: OpenAI GPT-4 - for advanced reasoning
  - Future consideration: Allow users to input their own API keys (premium feature)
  
- [x] **Backend Services:** Supabase
  - Managed backend for user data, authentication, and sync
  - Cost-effective and scalable
  - Built-in real-time capabilities
  
- [x] **Audio Recording Storage:** No cloud storage needed
  - Audio transcribed to text via OpenAI Whisper (embedded in app)
  - Whisper runs on-device - free, fast, and private
  - Only transcribed text stored in Supabase
  - No audio files retained (privacy-first approach)

### 15.2 Business Decisions ✅ CONFIRMED
- [x] **Pricing Model:** Subscription-based with free trial
  - 7-day free trial with full access (onboarding period)
  - Three subscription tiers:
    - **Seeker Tier** (Beginner) - $7.99/month or $59.99/year
    - **Practitioner Tier** (Intermediate) - $12.99/month or $99.99/year
    - **Master Tier** (Pro/Advanced) - $19.99/month or $149.99/year
  - Alternative naming (Zen Buddhist theme):
    - **Novice Path** - Entry level with core features
    - **Awakening Path** - Intermediate with enhanced AI access
    - **Enlightenment Path** - Full access with unlimited features
  
- [x] **Platform Launch:** iOS exclusive
  - App Store only at launch
  - Focus on perfecting iOS experience first
  - Android consideration 12+ months post-launch
  
- [x] **Partnership Model:** No partnership with Lunar Rivers
  - Direct licensing or full content rights acquisition
  - Independent development and monetization
  - Full control over feature development and pricing
  
- [x] **Beta Testing:** TBD (to be determined based on development timeline)
  - Options: TestFlight private beta vs. phased App Store rollout
  - Decision to be made 2-3 months into development

### 15.3 Content Decisions ✅ CONFIRMED
- [x] **Meditation Voice Options:** Both male and female narrators
  - Dual voice recordings for each guided meditation
  - User can select preferred voice in settings
  - Consistent voice quality and calming tone for both
  
- [x] **Content Release Frequency:** Monthly updates
  - New meditation added monthly (alternating 5 and 10 minute)
  - New journal prompts and affirmations
  - Expanded AI knowledge base content
  - Seasonal themes and special event content
  
- [x] **Nikola Tesla Content:** Phased integration
  - Phase 1: Core quotes and principles in AI knowledge base
  - Phase 2: Dedicated "Tesla Wisdom" section (post-launch)
  - Phase 3: Tesla-specific meditations and exercises
  - Ongoing: Expansion of Tesla energy/frequency teachings in AI responses
  
- [x] **AI Monk Persona:** Authentic, wise, supportive
  - Based on Shi Heng Yi mindset teachings
  - Incorporates Tesla's scientific spirituality
  - Non-dogmatic, practical, grounded
  - Uses metaphors, reflective questions, and actionable guidance

### 15.4 Feature Prioritization ✅ CONFIRMED
- [x] **MVP Scope:** All features included from launch
  - Complete 10-phase workbook digitization (all 202 pages)
  - Full voice journaling with Whisper transcription
  - All meditation and breathing exercises
  - AI monk companion with full knowledge base
  - Progress tracking and analytics
  - This is an all-or-nothing comprehensive launch
  
- [x] **Vision Board:** Included in MVP
  - Part of Phase 2 (Values & Vision) and Phase 6 (Manifestation Techniques)
  - Users can create vision boards within the app
  - Image upload, text overlay, and save functionality
  
- [x] **Analytics Depth:** Comprehensive from day one
  - Full user journey tracking
  - Engagement metrics across all features
  - Conversion funnel analysis for subscription tiers
  - Retention and churn tracking
  
- [x] **Social Features:** Post-MVP
  - Not included in initial launch
  - Timeline: 6-9 months post-launch
  - Will include community sharing, accountability partners, group meditations
  - Dependent on user demand and engagement data

### 15.5 Subscription Tier Breakdown (Recommended)

**Option A: Zen Buddhist Theme** ✨ RECOMMENDED

| Feature | Novice Path | Awakening Path | Enlightenment Path |
|---------|-------------|----------------|-------------------|
| **Price** | $7.99/mo<br>$59.99/yr | $12.99/mo<br>$99.99/yr | $19.99/mo<br>$149.99/yr |
| **Workbook Access** | Phases 1-5 | Phases 1-8 | All 10 Phases |
| **Meditations** | 3 guided sessions | 6 guided sessions | All sessions + early access |
| **Journal Entries** | 50/month | 200/month | Unlimited |
| **AI Chat Messages** | 30/day | 100/day | Unlimited |
| **Voice Narrators** | Female only | Male + Female | Male + Female + priority requests |
| **Vision Board** | 1 board | 3 boards | Unlimited |
| **Analytics** | Basic | Advanced | Premium + exports |
| **New Content** | Standard access | Day 1 access | Early access + exclusive |
| **Support** | Standard | Priority email | Priority + video support |

**Option B: Traditional Naming**

| Feature | Seeker | Practitioner | Master |
|---------|---------|--------------|---------|
| **Price** | $7.99/mo<br>$59.99/yr | $12.99/mo<br>$99.99/yr | $19.99/mo<br>$149.99/yr |
| *(Same feature breakdown as above)* |

**Recommendation:** Use "Novice Path / Awakening Path / Enlightenment Path" naming to align with the spiritual nature of the app and create aspirational tier names that resonate with the manifestation journey.

---

## 16. Appendices

### 16.1 Workbook Phase Breakdown Summary
Detailed breakdown available in Section 3.1.1

### 16.2 Competitive Analysis
*To be completed in separate document*

- Insight Timer
- Headspace
- Calm
- Manifestation apps comparison

### 16.3 User Research Summary
*To be conducted and documented*

### 16.4 Technical Architecture Diagram
*To be created in Technical Design Document*

### 16.5 Wireframes & Mockups
*To be created in design phase*

---

## 17. Approval & Sign-off

**Product Owner:** ___________________ Date: __________

**Technical Lead:** ___________________ Date: __________

**Design Lead:** ___________________ Date: __________

**Stakeholder:** ___________________ Date: __________

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.1 | 2025-11-16 | Product Team | Initial draft |
| 1.0 | 2025-11-16 | Product Team | Complete PRD with all decisions confirmed |

---

## Executive Summary of Confirmed Decisions

### ✅ Technical Stack
- **Platform:** Native iOS (SwiftUI)
- **Backend:** Supabase (PostgreSQL, Auth, Storage, Realtime)
- **AI Providers:** Claude API (primary) + OpenAI GPT-4 (secondary)
- **Voice Transcription:** OpenAI Whisper (on-device, embedded)
- **Subscriptions:** StoreKit 2 + RevenueCat
- **Analytics:** TelemetryDeck + Sentry

### ✅ Business Model
- **Pricing:** 3-tier subscription (Novice $7.99, Awakening $12.99, Enlightenment $19.99)
- **Free Trial:** 7 days with full access
- **Revenue Model:** Recurring subscriptions (monthly/annual)
- **Launch:** iOS exclusive, App Store only

### ✅ Feature Scope
- **All 10 workbook phases** - Complete digitization (202 pages)
- **Voice journaling** - Whisper transcription, unlimited for higher tiers
- **Meditation library** - 6 guided sessions, male + female narrators
- **Breathing exercises** - Triangle, Box, 5-Finger with animations
- **AI monk companion** - RAG-powered wisdom chat with Tesla + Lunar Rivers knowledge
- **Vision boards** - Image-based manifestation tool
- **Progress tracking** - Comprehensive analytics and streaks

### ✅ Development Timeline
- **Total Duration:** 28 weeks (~7 months)
- **Team:** Lean team (1-2 developers + contractors)
- **Budget:** $30,000-$50,000 in contractor fees + $200-500/mo operating costs
- **Launch Goal:** App Store submission at Week 28

### ✅ Success Metrics
- **Month 1:** 1,000 downloads, 25% trial→paid conversion
- **Month 6:** 8,000 downloads, 30% conversion, $18k MRR
- **Month 12:** 25,000 downloads, 35% conversion, $73k MRR, $450k annual revenue

### ✅ Next Steps
1. **Finalize content licensing** with Lunar Rivers
2. **Create Technical Design Document** (TDD)
3. **Set up development environment** and Supabase project
4. **Begin UI/UX design** system and wireframes
5. **Start development** Sprint 1 (Week 3)

---

**Next Steps:**
1. ✅ PRD Review and approval
2. ⏭️ Technical Design Document creation (TDD)
3. ⏭️ Design system and UI mockups
4. ⏭️ Development sprint planning
5. ⏭️ Beta tester recruitment strategy

---

**Document Status:** ✅ **APPROVED AND READY FOR TDD**

