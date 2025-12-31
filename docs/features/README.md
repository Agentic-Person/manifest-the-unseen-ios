# Features

Documentation for the core features of the Manifest the Unseen iOS app.

---

## Feature Overview

The app digitizes a 202-page manifestation workbook with these core features:

| Feature | Description | Status |
|---------|-------------|--------|
| [Guru AI](guru-ai/) | AI wisdom chat with RAG | Active |
| [Subscriptions](subscriptions/) | RevenueCat tier management | Active |
| [Voice Journal](voice-journal/) | Voice recording & transcription | In Development |
| [Meditation](meditation/) | Guided meditation player | In Development |
| Workbook | 10-phase structured exercises | In Development |
| Vision Boards | Visual manifestation boards | Planned |

---

## [Guru AI](guru-ai/)

The AI-powered wisdom companion, trained on manifestation teachings and Shi Heng Yi mindset content.

| Document | Description |
|----------|-------------|
| [README.md](guru-ai/README.md) | Guru AI feature overview |

**Key Features:**
- RAG (Retrieval-Augmented Generation) with pgvector
- Streaming responses via Claude API
- Contextual wisdom based on user's workbook progress
- Rate limiting (3 messages/day for free tier)

---

## [Subscriptions](subscriptions/)

RevenueCat-powered subscription management with three tiers.

| Document | Description |
|----------|-------------|
| *Pending migration* | Subscription documentation |

**Subscription Tiers:**
- **Novice Path** ($7.99/mo) - Phases 1-5, basic features
- **Awakening Path** ($12.99/mo) - Phases 1-8, more features
- **Enlightenment Path** ($19.99/mo) - All phases, unlimited access

**Related docs (to be migrated):**
- `REVENUECAT_SETUP_CHECKLIST.md`
- `REVENUECAT_QUICK_REFERENCE.md`
- `SUBSCRIPTION_FEATURE_GATING.md`

---

## [Voice Journal](voice-journal/)

Voice recording with on-device Whisper transcription for privacy-first journaling.

| Document | Description |
|----------|-------------|
| [audio-implementation-summary.md](voice-journal/audio-implementation-summary.md) | Audio implementation details |

**Key Features:**
- On-device transcription (privacy-first)
- Auto-save drafts
- Emotion tagging
- Full-text search

**Related docs (to be migrated):**
- `Voice-Journal-MVP.md`

---

## [Meditation](meditation/)

Guided meditation player with background audio support.

| Document | Description |
|----------|-------------|
| *Pending content* | Meditation feature documentation |

**Key Features:**
- Background audio playback
- Session tracking
- Multiple narrators (male/female)
- Breathing exercises

---

## Additional Features (Not Yet Documented)

### Workbook System
- 10 phases of manifestation exercises
- Progress tracking
- Auto-save with optimistic updates

### Vision Boards
- Image upload and arrangement
- Dream visualization

---

## Related Documentation

- [Technical Design Document](../planning/manifest-the-unseen-tdd.md) - Architecture details
- [Product Requirements](../planning/manifest-the-unseen-prd.md) - Full feature specifications
- [Roadmap](../planning/mtu-roadmap.md) - Development timeline

---

*See [main docs README](../README.md) for complete documentation index.*
