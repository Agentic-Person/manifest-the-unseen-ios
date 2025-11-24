# ADR-001: React Native + TypeScript for Mobile Development

**Date**: 2025-11-17
**Status**: Accepted
**Deciders**: Project Owner, AI Orchestrator
**Related**: PRD Section 3, TDD Section 2, CLAUDE.md, All Specialist Agent Prompts

---

## Context and Problem Statement

The project documentation contained conflicting tech stack specifications:
- **PRD (manifest-the-unseen-prd.md)** specified **Native iOS (Swift 5.9+, SwiftUI)**
- **TDD (manifest-the-unseen-tdd.md)** and **CLAUDE.md** specified **React Native + TypeScript**

**Business context**: Manifest the Unseen is a premium iOS manifestation app digitizing a 202-page workbook, combining structured exercises with AI-guided wisdom, voice journaling, and meditation.

**Technical context**: The entire agent orchestration system (5 specialist agents, 7 workstreams, master plan) was built assuming React Native architecture.

**User impact**: Tech stack choice affects development speed, app quality, future expansion capability, and long-term maintenance.

**Current pain points**: Cannot begin Week 1 implementation until this fundamental decision is resolved.

---

## Decision Drivers

- **Development Speed**: 28-week timeline to App Store launch is aggressive
- **Cross-Platform Future**: Android expansion planned for Year 2
- **Code Reuse**: Shared business logic with potential web companion app
- **Agent Readiness**: All 5 specialist agent prompts are React Native-optimized
- **Ecosystem**: Rich library support for required features (audio, AI, forms)
- **Hot Reload**: Faster development iteration cycles
- **Developer Experience**: TypeScript provides strong typing and better tooling
- **App Quality**: Need native performance for audio, smooth animations
- **App Store Positioning**: Premium feel and presentation important

---

## Considered Options

### Option 1: Native iOS (Swift + SwiftUI)

**Description**: Build iOS-first with Swift 5.9+, SwiftUI for UI, Combine for state management, AVFoundation for audio

**Pros**:
- ✅ Maximum iOS performance and native feel
- ✅ Better App Store positioning (100% native)
- ✅ Full access to latest iOS features
- ✅ Smaller app bundle size
- ✅ No JavaScript bridge overhead

**Cons**:
- ❌ iOS-only (need separate Android codebase later)
- ❌ No code sharing with web companion
- ❌ All specialist agent prompts need rewriting
- ❌ Slower development (no hot reload)
- ❌ Smaller ecosystem for some features

**Effort**: Medium
**Cost**: Low (no framework licensing)
**Risk**: Medium (iOS-locked, agent prompts need rework)

---

### Option 2: React Native + TypeScript

**Description**: Build with React Native, TypeScript, NativeWind for styling, TanStack Query for data, Zustand for state

**Pros**:
- ✅ Cross-platform ready (Android future)
- ✅ Shared business logic with web app (60%+ reuse)
- ✅ Faster development with hot reload
- ✅ All specialist agents already configured
- ✅ Rich ecosystem (react-native-track-player, Whisper, etc.)
- ✅ Shared TypeScript models and validation
- ✅ Large developer community

**Cons**:
- ❌ JavaScript bridge can impact performance (mitigated by Hermes)
- ❌ Slightly larger bundle size
- ❌ May need native modules for advanced features
- ❌ Less "iOS-native" feel (mitigated by careful UI work)

**Effort**: Low (agents ready)
**Cost**: Low (open source)
**Risk**: Low (proven at scale, agents optimized)

---

### Option 3: Flutter

**Description**: Alternative cross-platform framework with Dart

**Pros**:
- ✅ Cross-platform
- ✅ Fast performance (compiled to native)
- ✅ Good UI framework

**Cons**:
- ❌ All agent prompts need rewriting
- ❌ Team unfamiliar with Dart
- ❌ Smaller ecosystem than React Native
- ❌ No web app code sharing (different paradigm)

**Effort**: High (new language, new agents)
**Cost**: Low (open source)
**Risk**: High (learning curve, agent rebuild)

---

## Decision Outcome

**Chosen Option**: Option 2 - React Native + TypeScript

**Rationale**:

1. **Agent Readiness is Critical**: All 5 specialist agents (Backend, Frontend, AI Integration, Audio, Subscriptions) are configured for React Native. Rewriting for Swift would delay Week 1 by days/weeks.

2. **28-Week Timeline**: Aggressive schedule requires maximum development velocity. React Native's hot reload and faster iteration cycles are essential.

3. **Future-Proof Architecture**:
   - Android expansion (Year 2): Reuse ~80% of codebase
   - Web companion app: Share models, validation, API clients
   - Shared package architecture supports both

4. **Proven Tech Stack**: React Native powers Instagram, Discord, Shopify mobile apps. Performance concerns are addressed by Hermes engine and careful architecture.

5. **Rich Ecosystem**: All required features have battle-tested libraries:
   - Audio: react-native-track-player
   - Voice: react-native-audio-recorder-player + Whisper
   - AI: Direct Claude/OpenAI API calls
   - Subscriptions: RevenueCat (excellent React Native SDK)

**Trade-offs Accepted**:
- **Marginally less native feel**: Acceptable - careful UI/UX work with NativeWind will deliver premium experience
- **Larger bundle size**: Acceptable - modern devices handle this easily, and users prioritize functionality

---

## Implementation Plan

### Immediate Actions
1. Update PRD Section 3 to reflect React Native - Owner: Orchestrator
2. Initialize React Native project with TypeScript template - Owner: Frontend Specialist
3. Validate all specialist prompts still accurate - Owner: Orchestrator

### Timeline
- **Phase 1 (Day 1)**: Update documentation, resolve conflicts
- **Phase 2 (Day 3)**: Initialize React Native project, test build
- **Phase 3 (Week 1-2)**: Set up architecture, navigation, state management
- **Completion**: End of Week 2 (infrastructure ready)

### Success Criteria
- [x] Documentation conflict resolved
- [ ] React Native project builds successfully on iOS simulator
- [ ] All specialist agents successfully executing React Native tasks
- [ ] Week 1 completed on schedule

---

## Consequences

### Positive Consequences
- ✅ **Immediate progress**: Week 1 can begin without agent reconfiguration
- ✅ **Faster development**: Hot reload accelerates iteration
- ✅ **Code reuse**: 60%+ shared with web, 80%+ shared with Android
- ✅ **Strong typing**: TypeScript prevents many bugs at compile time
- ✅ **Modern tooling**: Excellent IDE support, debugging tools

### Negative Consequences
- ⚠️ **Performance tuning required** - Mitigation: Use Hermes engine, memoization, FlatList virtualization
- ⚠️ **Native modules may be needed** - Mitigation: react-native-track-player, Whisper already have native bridges

### Risks
- 🟢 **Low Risk: Bundle size** - Acceptable for modern devices
- 🟢 **Low Risk: App Store approval** - React Native apps regularly featured
- 🟢 **Low Risk: Performance** - Hermes + optimization handles our use case

---

## Follow-Up

### Review Date
End of Week 8 (after Phase 1 complete) - Validate decision is working

### Related Tasks
- **TASK-2025-11-001**: Initialize Orchestration Workflow (this ADR)
- **TASK-2025-11-003**: Initialize React Native Project

### Related ADRs
- Future ADR-002 may cover specific architectural patterns

---

## Validation

### Confirmation Needed
- [x] Stakeholder approval (user confirmed React Native)
- [x] Technical feasibility validated (TDD + CLAUDE.md comprehensive)
- [x] Cost estimate confirmed (no additional costs)
- [x] Timeline realistic (28 weeks achievable)

### Metrics to Track
1. **Development Velocity**: Tasks completed per week - Target: 8-12 tasks/week
2. **App Performance**: Frame rate on target devices - Target: 60fps
3. **Code Reuse**: Shared code percentage - Target: 60%+

---

## References

**Documentation**:
- PRD Section 3: Tech Stack Requirements
- TDD Section 2: React Native Architecture
- CLAUDE.md: Complete tech stack guidance
- All specialist agent prompts in `/prompts/system-prompts/`

**Articles/Research**:
- React Native is used by Meta, Microsoft, Shopify, Discord
- Hermes engine significantly improves performance
- RevenueCat has excellent React Native support

---

## Notes

This decision resolves a critical blocker and allows Week 1 to proceed. The comprehensive planning in TDD and CLAUDE.md provides confidence this is the right choice. All specialist agents are ready to execute.

The PRD will be updated to reflect this decision and maintain consistency across all documentation.

---

**Last Updated**: 2025-11-17
**Updated By**: AI Orchestrator
**Change Summary**: Initial ADR creation documenting React Native decision
