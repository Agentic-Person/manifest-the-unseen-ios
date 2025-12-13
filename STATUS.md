# Manifest the Unseen - Project Status

**Last Updated:** December 13, 2025

---

## Current Status: 🍎 App Store Review

| Item | Status |
|------|--------|
| **Version** | 1.0.0 |
| **Build** | 13 |
| **Git Tag** | `v1.0.0-beta.13` |
| **App Store** | Waiting for Review |
| **TestFlight** | Available (Build 13) |

---

## Recent Milestones

### December 13, 2025 - App Store Submission
- ✅ Submitted Build 13 to Apple App Store for review
- ✅ Set pricing to Free ($0.00) for 175 countries
- ✅ Configured Content Rights Information
- ✅ Uploaded iPad 13" screenshot (2048 × 2732px)
- ✅ Created milestone git tag `v1.0.0-beta.13`
- ⏳ Apple review typically completes within 24-48 hours

### December 12, 2025 - MVP Beta Stabilization
- ✅ Fixed critical auth/security issues from broken SecureStorage implementation
- ✅ Recovered lost UI features (HomeScreen ScrollView, Row 2 navigation)
- ✅ Fixed subscription gating bug (DEV bypass for enlightenment tier)
- ✅ Added Manuscript and ObservableScience screens to navigation
- ✅ Successfully deployed Build 13 to TestFlight

---

## Known Issues

### Medium Priority
| Issue | Description | Status |
|-------|-------------|--------|
| Habit Tracking | Progress not saving properly in workbook | To Fix |

### Low Priority
- None currently tracked

---

## App Features (MVP)

### Core Features
- ✅ 10-Phase Workbook with exercises
- ✅ Voice journaling with Whisper transcription
- ✅ AI Guru chat (Claude-powered)
- ✅ Meditation player with guided sessions
- ✅ Breathing exercises (Box, Deep, Calm)
- ✅ Vision board functionality
- ✅ Progress tracking

### Subscription Tiers (RevenueCat)
- Novice Path ($7.99/mo)
- Awakening Path ($12.99/mo)
- Enlightenment Path ($19.99/mo)

### Authentication
- Apple Sign-In (primary)
- Email/Password (fallback)
- DEV bypass mode for testing

---

## Technical Stack

| Component | Technology |
|-----------|------------|
| Framework | React Native + Expo |
| Language | TypeScript |
| Backend | Supabase (PostgreSQL) |
| Auth | Supabase Auth + Apple Sign-In |
| AI | Claude API (Anthropic) |
| Subscriptions | RevenueCat |
| Build | EAS Build |
| Distribution | TestFlight / App Store |

---

## Build History

| Build | Date | Notes |
|-------|------|-------|
| 13 | Dec 13, 2025 | MVP Beta - App Store Submission |
| 12 | Dec 12, 2025 | Fixed security revert issues |
| 11 | Dec 11, 2025 | Security fixes (broken - reverted) |
| 1-10 | Nov-Dec 2025 | Development iterations |

---

## Next Steps

1. **Wait for Apple Review** - Monitor for approval/rejection
2. **Fix Habit Tracking Bug** - Investigate and fix progress saving
3. **Marketing Prep** - Prepare launch assets and App Store optimization
4. **User Feedback** - Collect and address TestFlight beta feedback

---

## Repository

- **GitHub**: manifest-the-unseen-ios
- **Branch**: main
- **Latest Tag**: v1.0.0-beta.13

---

## Contact

For issues or questions, see the repository issues or CLAUDE.md for development guidance.
