# Manifest the Unseen - Documentation

Welcome to the documentation for the **Manifest the Unseen** iOS app - a transformative manifestation workbook digitized into a mobile experience.

## Quick Links

| Document | Description |
|----------|-------------|
| [PRD](planning/manifest-the-unseen-prd.md) | Product Requirements Document |
| [TDD](planning/manifest-the-unseen-tdd.md) | Technical Design Document |
| [Project Status](operations/status/project-status.md) | Current build status & progress |
| [Security Status](security/README.md) | Security audit & compliance |
| [Roadmap](planning/mtu-roadmap.md) | Development roadmap & timeline |

---

## Documentation Structure

### [Planning](planning/)
Core project planning documents including PRD, TDD, summary, and roadmap.

| Document | Description |
|----------|-------------|
| [manifest-the-unseen-prd.md](planning/manifest-the-unseen-prd.md) | Complete Product Requirements Document |
| [manifest-the-unseen-tdd.md](planning/manifest-the-unseen-tdd.md) | Technical Design Document |
| [manifest-the-unseen-summary.md](planning/manifest-the-unseen-summary.md) | Quick reference summary |
| [mtu-roadmap.md](planning/mtu-roadmap.md) | Development roadmap |
| [project-structure.md](planning/project-structure.md) | Monorepo structure guide |

---

### [Guides](guides/)
Step-by-step guides organized by workflow stage.

- **[Setup](guides/setup/)** - Environment and project setup
- **[Development](guides/development/)** - Development workflows and commands
- **[Deployment](guides/deployment/)** - Build, TestFlight, and App Store processes

---

### [Architecture](architecture/)
Technical architecture documentation and decision records.

- **[Decisions](architecture/decisions/)** - Architecture Decision Records (ADRs)
  - [ADR-001: React Native Tech Stack](architecture/decisions/adr-001-react-native-tech-stack.md)

---

### [Features](features/)
Feature-specific documentation for core app capabilities.

| Feature | Description |
|---------|-------------|
| [Guru AI](features/guru-ai/) | AI wisdom chat system with RAG |
| [Subscriptions](features/subscriptions/) | RevenueCat integration & tier management |
| [Voice Journal](features/voice-journal/) | Voice recording & transcription |
| [Meditation](features/meditation/) | Meditation player system |

---

### [Security](security/)
Security audits, vulnerability scans, and best practices.

- [Security Overview](security/README.md) - Main security documentation hub
- **[Audits](security/audits/)** - Security audit reports
- **[Guides](security/guides/)** - Security implementation guides
- **[Scans](security/scans/)** - Vulnerability scan results

**Current Status:** PASSED - Zero Vulnerabilities (Last scan: Dec 12, 2025)

---

### [Operations](operations/)
Project status and operational documentation.

- **[Status](operations/status/)** - Build status and project progress
  - [project-status.md](operations/status/project-status.md) - Current status

---

### [Content](content/)
AI training content and wisdom source materials.

- **[Wisdom Sources](content/wisdom-sources/)** - Knowledge base materials for Guru AI

---

### [Archive](archive/)
Historical documentation preserved for reference.

- **[2025-11](archive/2025-11/)** - November 2025 session logs
- **[2025-12](archive/2025-12/)** - December 2025 session logs
- **[Agent Orchestration](archive/agent-orchestration/)** - Legacy multi-agent workflow docs

See [Archive README](archive/README.md) for details.

---

### [Templates](_templates/)
Document templates for creating new documentation.

- [adr-template.md](_templates/adr-template.md) - Architecture Decision Record template

---

## For Claude Code Users

See [CLAUDE.md](../CLAUDE.md) in the project root for AI assistant instructions and project context.

## Key Project Information

- **Tech Stack:** React Native + TypeScript + Supabase
- **Current Build:** See [project-status.md](operations/status/project-status.md)
- **Platform:** iOS (App Store)
- **Development Phase:** Active development

---

## Document Locations Quick Reference

| Looking For | Location |
|-------------|----------|
| Product requirements | `planning/manifest-the-unseen-prd.md` |
| Technical specifications | `planning/manifest-the-unseen-tdd.md` |
| Current build status | `operations/status/project-status.md` |
| Security compliance | `security/README.md` |
| RevenueCat setup | `features/subscriptions/` |
| AI chat implementation | `features/guru-ai/` |
| TestFlight deployment | `guides/deployment/` |
| Environment setup | `guides/setup/` |

---

*Last Updated: December 30, 2025*
