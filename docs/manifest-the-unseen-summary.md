# Manifest the Unseen - Quick Reference Summary
## Confirmed Decisions & Key Information

**Document Date:** November 16, 2025  
**Status:** ✅ Approved - Ready for Technical Design Document

---

## 🎯 Project Overview

**Product:** Manifest the Unseen iOS App  
**Type:** Digital manifestation workbook + meditation + AI companion  
**Platform:** iOS exclusive (native Swift/SwiftUI)  
**Timeline:** 28 weeks (~7 months) to launch  
**Budget:** $30k-$50k contractor fees + $200-500/mo operating costs

---

## 💻 Technical Stack (CONFIRMED)

### Frontend
- **Language:** Swift 5.9+
- **Framework:** SwiftUI with UIKit where needed
- **State Management:** Combine + SwiftUI @Observable
- **Navigation:** NavigationStack
- **Audio:** AVFoundation

### Backend
- **Platform:** Supabase
  - PostgreSQL database
  - Authentication (Apple Sign-In)
  - Real-time sync
  - Storage (vision board images)
  - Edge Functions
  - pgvector for AI embeddings

### AI/ML
- **Primary AI:** Claude API (Anthropic) - wisdom chat
- **Secondary AI:** OpenAI GPT-4 - fallback/advanced reasoning
- **Voice Transcription:** OpenAI Whisper (embedded, on-device)
  - whisper.cpp or WhisperKit
  - Runs locally - free and private
  - No audio leaves device

### Services
- **Subscriptions:** StoreKit 2 + RevenueCat
- **Analytics:** TelemetryDeck (privacy-focused)
- **Crash Reporting:** Sentry
- **Push Notifications:** APNs

### Data Flow
```
User Input → Local Storage (Core Data) → Supabase (Cloud Sync)
Voice Recording → Whisper (On-Device) → Text → Supabase
User Question → Vector Search → Claude API → Response
```

---

## 💰 Business Model (CONFIRMED)

### Subscription Tiers - Zen Buddhist Theme

#### 🌱 Novice Path - $7.99/month ($59.99/year)
- Phases 1-5 of workbook
- 3 guided meditations (female voice)
- 50 journal entries/month
- 30 AI messages/day
- 1 vision board
- Basic analytics

#### 🧘 Awakening Path - $12.99/month ($99.99/year) ⭐ MOST POPULAR
- Phases 1-8 of workbook
- 6 guided meditations (male + female)
- 200 journal entries/month
- 100 AI messages/day
- 3 vision boards
- Advanced analytics
- Priority support

#### ✨ Enlightenment Path - $19.99/month ($149.99/year)
- ALL 10 phases
- Unlimited everything
- Early content access
- Premium support
- Exclusive Tesla content
- Community features (when launched)

### Free Trial
- **Duration:** 7 days
- **Access:** Full Enlightenment Path access
- **Conversion Goal:** 25-35% trial→paid

### Revenue Projections (Year 1)
- **Month 1:** 1,000 downloads, $1,750 MRR
- **Month 6:** 8,000 downloads, $18,480 MRR
- **Month 12:** 25,000 downloads, $73,500 MRR
- **Annual Total:** ~$450,000 revenue

---

## 🎨 Feature Scope (ALL IN MVP)

### ✅ Digital Workbook (Complete 202 pages)
**All 10 Phases:**
1. Self-Evaluation (Wheel of Life, SWOT, values, etc.)
2. Values & Vision
3. Goal Setting
4. Facing Fears & Limiting Beliefs
5. Cultivating Self-Love & Self-Care
6. Manifestation Techniques (3-6-9, WOOP, scripting, etc.)
7. Practicing Gratitude
8. Turning Envy Into Inspiration
9. Trust & Surrender
10. Trust & Letting Go

**Features:**
- All worksheets digitized as interactive forms
- Auto-save every 30 seconds
- Progress tracking with visual timeline
- Export to PDF
- Phase completion celebrations

### ✅ Voice Journaling
- Tap-to-record interface
- OpenAI Whisper transcription (on-device)
- Transcription in 1-2 seconds
- Text editing after transcription
- Search across all entries
- Tag and categorize entries
- Biometric lock (Face ID/Touch ID)
- End-to-end encryption

### ✅ Meditation Library
**6 Guided Meditations:**
- 5-minute Morning Manifestation
- 5-minute Evening Gratitude
- 10-minute Abundance Alignment
- 10-minute Limiting Beliefs Release
- 5-minute Quick Reset
- 10-minute Deep Alignment

**Both male and female voice narrators for each**

**Features:**
- Offline playback
- Background audio support
- Session tracking
- Streak counter
- Reminders
- Favorite meditations

### ✅ Breathing Exercises
**With animated visuals:**
1. Triangle Breathing (5-5-5 pattern)
2. Box Breathing (4-4-4-4 pattern)
3. 5-Finger Breathing (trace hand)

**Features:**
- Interactive animations
- Haptic feedback
- Customizable durations
- All free (not gated)

### ✅ AI Monk Companion
**Knowledge Base:**
- Complete Lunar Rivers content
- Shi Heng Yi mindset teachings
- Book Essence Hub content
- Nikola Tesla wisdom (energy, frequency, vibration)
- Universal Laws of Manifestation

**Features:**
- Natural conversational AI
- Context-aware (knows user's current phase)
- RAG architecture (retrieves relevant knowledge)
- Conversation history
- Quick prompts
- Share to journal
- Rate limited by tier

### ✅ Vision Board
- Image upload from camera/library
- Text overlays and affirmations
- Multiple boards (based on tier)
- Daily reminder
- Share functionality

### ✅ Progress & Analytics
- Overall workbook completion %
- Phase-by-phase progress
- Meditation streak tracking
- Journal entry frequency
- AI chat usage
- Daily practice consistency
- Achievement badges

---

## 📅 Development Timeline (28 Weeks)

### Weeks 1-2: Pre-Development
Setup, design system, planning

### Weeks 3-8: Phase 1 - Foundation (6 weeks)
- Auth + navigation
- Workbook Phases 1-3
- Voice journaling MVP

### Weeks 9-14: Phase 2 - Features (6 weeks)
- Workbook Phases 4-10
- Meditation + breathing system
- Progress tracking

### Weeks 15-20: Phase 3 - AI & Advanced (6 weeks)
- AI knowledge base setup
- Monk chat implementation
- Vision boards
- Integrations

### Weeks 21-24: Phase 4 - Subscriptions (4 weeks)
- StoreKit 2 + RevenueCat
- Paywall implementation
- Analytics + monitoring
- Polish + optimization

### Weeks 25-28: Phase 5 - Testing & Launch (4 weeks)
- QA testing
- TestFlight beta
- App Store preparation
- Submission + launch

---

## 🎯 Success Metrics

### Launch (Month 1)
- [ ] 1,000 downloads
- [ ] 4.0+ App Store rating
- [ ] <1% crash rate
- [ ] 25% trial→paid conversion
- [ ] 30% Day 7 retention

### 6 Months
- [ ] 8,000 downloads
- [ ] 4.5+ rating
- [ ] 30% conversion
- [ ] $18k MRR
- [ ] 25% Month 1 retention

### 12 Months
- [ ] 25,000 downloads
- [ ] 4.7+ rating
- [ ] 35% conversion
- [ ] $73k MRR
- [ ] $450k annual revenue

---

## 🚀 Content Requirements

### Audio Content Needed
- 6 guided meditations professionally recorded
- Male narrator version (6 recordings)
- Female narrator version (6 recordings)
- Total: 12 high-quality meditation audio files
- Format: M4A (AAC), ~5-15MB each

### Written Content
- All workbook exercises (from PDF)
- Daily inspiration quotes (365+)
- AI monk prompt library
- Help documentation
- Onboarding copy
- Error messages

### Visual Assets
- App icon (all sizes)
- Splash screen
- 10 phase illustrations
- Breathing exercise animations
- Progress badges
- Empty state illustrations
- Tutorial graphics
- App Store screenshots + preview video

---

## 💡 Key Design Principles

1. **Calming** - Soft colors, generous spacing, smooth animations
2. **Intuitive** - Clear labels, familiar patterns, minimal learning
3. **Encouraging** - Celebrate progress, positive reinforcement
4. **Focused** - One task at a time, minimal distractions
5. **Beautiful** - High-quality visuals, thoughtful typography
6. **Accessible** - VoiceOver, Dynamic Type, high contrast

### Color Palette
- Golden/ethereal primary colors
- Soft purples and blues
- Warm neutrals
- High contrast for text
- Dark mode support

---

## 🔒 Privacy & Security

- End-to-end encryption for journal entries
- On-device Whisper (audio never leaves device)
- No audio files stored
- Biometric authentication
- GDPR + CCPA compliant
- Transparent AI usage disclosure
- No user data sold or shared
- Clear privacy policy

---

## 📱 Device Requirements

- **Minimum iOS:** 15.0+
- **Target Devices:** iPhone (primary), iPad (optimized)
- **Orientations:** Portrait primary, landscape supported
- **Accessibility:** Full VoiceOver, Dynamic Type
- **Storage:** ~100MB app size
- **RAM:** <150MB typical, <300MB peak
- **Battery:** <5% per 30-min session

---

## 🎬 Next Steps

### Immediate (This Week)
1. ✅ Finalize and approve PRD
2. ⏭️ Create Technical Design Document (TDD)
3. ⏭️ Finalize content licensing with Lunar Rivers
4. ⏭️ Set up Supabase project
5. ⏭️ Obtain API keys (Claude, OpenAI)

### Week 1-2 (Pre-Development)
- Design system creation
- Information architecture
- Database schema design
- Development environment setup
- Repository + CI/CD configuration

### Week 3 (Sprint 1 Start)
- Begin iOS development
- Authentication implementation
- Core navigation structure

---

## 📞 Contact & Resources

### Development Resources
- **PRD:** `/mnt/user-data/outputs/manifest-the-unseen-prd.md`
- **TDD:** To be created next
- **Design Files:** To be created
- **Repository:** To be set up

### External Services to Set Up
1. Supabase account and project
2. Anthropic Claude API key
3. OpenAI API key
4. Apple Developer account ($99/year)
5. RevenueCat account
6. TelemetryDeck account
7. Sentry account

### Contractor Needs
- UI/UX Designer (10-20 hrs/week, Weeks 1-8)
- Voice talent (male + female for meditations)
- QA tester (Week 25-28)
- Content writer (meditation scripts)

---

## ✨ What Makes This Special

1. **Complete System** - Not just an app, a full transformation journey
2. **AI Wisdom** - First manifestation app with monk-like AI trained on Tesla + spiritual wisdom
3. **Voice-First** - Modern UX that respects users' time
4. **Proven Framework** - Based on successful 202-page workbook
5. **Privacy-First** - On-device transcription, encrypted journals
6. **Beautiful** - Premium design matching spiritual/wellness market
7. **All-In-One** - Workbook + journal + meditation + AI + vision board

---

**This is a comprehensive app with ambitious goals and a clear path to success. Let's build something transformative! 🙏✨**

---

**Document Version:** 1.0  
**Last Updated:** November 16, 2025  
**Next Document:** Technical Design Document (TDD)
