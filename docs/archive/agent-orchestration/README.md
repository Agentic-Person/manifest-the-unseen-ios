# Agent Orchestration System

**Project**: Manifest the Unseen - iOS Manifestation App
**Purpose**: Coordinate multiple specialist agents throughout 28-week development
**Status**: Active

---

## Overview

This directory contains the complete orchestration system for developing Manifest the Unseen using specialized AI agents. The system enables:

- **Systematic task tracking** with templates and workflows
- **Specialist agent coordination** with custom system prompts
- **Comprehensive documentation** via session logs and ADRs
- **28-week development roadmap** with clear milestones
- **Feature-based workstream organization**

**Key Benefits**:
- ✅ Multiple agents work in parallel on different features
- ✅ Clear accountability and progress tracking
- ✅ Comprehensive audit trail of all work
- ✅ Scalable process that supports team growth
- ✅ Reduces context-switching and cognitive load

---

## Directory Structure

```
agent-orchestration/
├── README.md                          # This file
│
├── orchestrator/                      # Master planning & coordination
│   ├── master-plan.md                # 28-week development roadmap
│   ├── workflow-guide.md             # Daily orchestration workflow
│   ├── weekly-schedules/             # Week-by-week task breakdown
│   └── dependencies.md               # Task dependency mapping
│
├── agents/                            # Agent configurations
│   ├── explore/                      # Codebase exploration agents
│   ├── implement/                    # Feature implementation agents
│   │   ├── backend-specialist.md
│   │   ├── frontend-specialist.md
│   │   ├── ai-integration-specialist.md
│   │   ├── audio-specialist.md
│   │   └── subscriptions-specialist.md
│   ├── test/                         # Testing specialist agents
│   ├── review/                       # Code/security review agents
│   └── docs/                         # Documentation agents
│
├── tasks/                             # Task tracking
│   ├── active/                       # Currently in progress
│   ├── completed/                    # Completed (archived)
│   ├── blocked/                      # Blocked tasks
│   └── templates/                    # Task templates
│       ├── implementation-task.md
│       ├── review-task.md
│       ├── exploration-task.md
│       ├── test-task.md
│       └── docs-task.md
│
├── workstreams/                       # Feature-based organization
│   ├── authentication/               # Auth workstream
│   ├── workbook-system/              # Workbook workstream
│   ├── voice-journaling/             # Voice journaling workstream
│   ├── meditation-player/            # Meditation player workstream
│   ├── ai-chat/                      # AI chat workstream
│   ├── vision-boards/                # Vision boards workstream
│   └── subscriptions/                # Subscriptions workstream
│
├── logs/                              # Activity logging
│   ├── sessions/                     # Daily session logs
│   │   └── 2025-11/
│   │       ├── session-template.md
│   │       └── session-YYYY-MM-DD.md (created daily)
│   └── decisions/                    # Architecture Decision Records (ADRs)
│       ├── template-adr.md
│       └── ###-decision-title.md
│
└── prompts/                           # Agent prompts
    ├── system-prompts/               # Custom system prompts for specialists
    │   ├── backend-specialist.md
    │   ├── frontend-specialist.md
    │   ├── ai-integration-specialist.md
    │   ├── audio-specialist.md
    │   └── subscriptions-specialist.md
    └── task-prompts/                 # Reusable task patterns
        ├── create-component.md
        ├── write-test.md
        └── review-pr.md
```

---

## Quick Start Guide

### For Daily Development

1. **Morning Planning** (15-30 min):
   ```bash
   # Review yesterday's work
   cat logs/sessions/2025-11/session-[yesterday].md

   # Check master plan progress
   cat orchestrator/master-plan.md

   # Review active tasks
   ls tasks/active/
   ```

2. **Assign Work to Agents**:
   - Pick 3-5 priority tasks for today
   - Determine best specialist agent for each
   - Load agent's custom system prompt if available
   - Spawn agent with clear context

3. **Execute & Monitor**:
   - Agents work on their assigned tasks
   - Monitor progress, provide clarification
   - Document decisions made

4. **Evening Review** (15-30 min):
   ```bash
   # Update task statuses
   mv tasks/active/TASK-XXX.md tasks/completed/

   # Create session log
   cp logs/sessions/2025-11/session-template.md \
      logs/sessions/2025-11/session-$(date +%Y-%m-%d).md
   ```

5. **Weekly Review** (Monday):
   - Review last week's progress
   - Update master plan
   - Plan this week's priorities

**Detailed workflow**: See [`orchestrator/workflow-guide.md`](orchestrator/workflow-guide.md)

---

## Core Components

### 1. Master Plan
**File**: `orchestrator/master-plan.md`

The master plan is the single source of truth for the 28-week development timeline. It includes:
- Phase breakdown (Pre-Dev, Phase 1-5)
- Week-by-week task breakdown
- Agent assignments
- Dependencies
- Success criteria

**Update frequency**: Weekly (Mondays)

---

### 2. Specialist Agents

Five essential custom system prompts optimize agent performance:

#### Backend Specialist
**Expertise**: Supabase, PostgreSQL, RLS, pgvector, Edge Functions
**Use for**: Database schema, API endpoints, authentication, AI backend

#### Frontend Specialist
**Expertise**: React Native, NativeWind, React Navigation, TanStack Query
**Use for**: UI components, screens, navigation, forms, state management

#### AI Integration Specialist
**Expertise**: Claude API, OpenAI API, RAG, pgvector, prompt engineering
**Use for**: AI chat implementation, knowledge base setup, context management

#### Audio/Voice Specialist
**Expertise**: Whisper, react-native-track-player, audio recording, haptics
**Use for**: Voice journaling, meditation player, breathing exercises

#### Subscriptions Specialist
**Expertise**: RevenueCat, StoreKit 2, feature gating, subscription flows
**Use for**: Paywall, subscription management, tier limits

**All prompts**: [`prompts/system-prompts/`](prompts/system-prompts/)

---

### 3. Task Templates

Five task templates for structured work tracking:

| Template | Use Case | Key Sections |
|----------|----------|--------------|
| **implementation-task.md** | Building features | Objective, Acceptance Criteria, Implementation Steps, Dependencies |
| **review-task.md** | Code/security review | Review Checklist, Findings, Approval Status |
| **exploration-task.md** | Research/analysis | Research Questions, Options, Recommendation |
| **test-task.md** | Writing tests | Test Cases, Coverage, Results |
| **docs-task.md** | Documentation | Audience, Content, Quality Checklist |

**All templates**: [`tasks/templates/`](tasks/templates/)

---

### 4. Workstreams

Seven feature-based workstreams organize related work:

1. **Authentication** (Weeks 3-4): Apple Sign-In, email/password, biometrics
2. **Workbook System** (Weeks 5-12): All 10 phases, forms, progress tracking
3. **Voice Journaling** (Weeks 7-8): Whisper transcription, journal CRUD, search
4. **Meditation Player** (Weeks 13-14): Audio playback, breathing exercises, tracking
5. **AI Chat** (Weeks 15-20): RAG, Claude API, knowledge base, context-aware prompts
6. **Vision Boards** (Weeks 19-20): Image upload, text overlays, tier limits
7. **Subscriptions** (Weeks 21-22): RevenueCat, paywall, feature gating

**Each workstream has**:
- README with overview, timeline, agents, tasks, dependencies, success metrics

**All workstreams**: [`workstreams/`](workstreams/)

---

### 5. Logging System

**Session Logs**: Daily logs of work completed, blockers, decisions
- **Template**: `logs/sessions/2025-11/session-template.md`
- **Create daily**: `session-YYYY-MM-DD.md`

**ADRs (Architecture Decision Records)**: Document important technical decisions
- **Template**: `logs/decisions/template-adr.md`
- **Naming**: `###-short-title.md` (e.g., `001-use-supabase-for-backend.md`)

**When to create ADRs**:
- Technology selections (Supabase, React Native, Whisper)
- Architecture choices (RAG implementation, offline-first)
- Security decisions (on-device transcription, encryption)

---

## How to Use This System

### Scenario 1: Starting a New Task

1. **Choose task template**:
```bash
cp tasks/templates/implementation-task.md tasks/active/TASK-2025-11-015.md
```

2. **Fill out task file**:
   - Clear objective
   - Acceptance criteria
   - Dependencies
   - Resources (PRD sections, TDD sections)

3. **Assign to specialist agent**:
   - Determine best agent (e.g., Backend Specialist)
   - Load custom system prompt
   - Provide task context

4. **Spawn agent**:
```
You are the Backend Specialist (use /prompts/system-prompts/backend-specialist.md).

Implement Supabase authentication for Manifest the Unseen.

Task: TASK-2025-11-015
Context: PRD Section 8.2, TDD Section 6
...
```

5. **Monitor & document**:
   - Review agent's work
   - Log progress in session log
   - Update task status

### Scenario 2: Weekly Planning

1. **Review last week** (Monday morning):
```bash
# Read all last week's session logs
cat logs/sessions/2025-11/session-2025-11-*

# Check master plan
vim orchestrator/master-plan.md
```

2. **Assess progress**:
   - Were milestones met?
   - Any timeline slippage?
   - Recurring blockers?

3. **Update master plan**:
   - Mark completed weeks
   - Adjust timeline if needed
   - Update risk notes

4. **Plan this week**:
   - Review master plan for this week
   - Break into daily tasks
   - Assign to agents

### Scenario 3: Making an Important Decision

1. **Create ADR**:
```bash
cp logs/decisions/template-adr.md logs/decisions/003-use-whisper-on-device.md
```

2. **Document**:
   - Context and problem
   - Options considered (cloud vs on-device transcription)
   - Decision made (on-device Whisper)
   - Rationale (privacy, cost, offline support)
   - Trade-offs (accuracy vs speed)

3. **Reference in tasks**:
   - Link to ADR in related tasks
   - Use ADR to guide implementation

---

## Agent Coordination Patterns

### Pattern 1: Sequential Work
Tasks that must happen in order (Database → API → UI)

**Example**:
1. Backend Specialist: Create journal_entries table
2. Backend Specialist: Write API functions
3. Frontend Specialist: Build journal UI

### Pattern 2: Parallel Work
Tasks that can happen simultaneously

**Example**:
- Audio/Voice Specialist: Voice recording + Whisper
- Frontend Specialist: Meditation player UI

### Pattern 3: Review Workflow
Implementation → Review → Fix → Approve

**Example**:
1. Frontend Specialist: Build feature
2. Code Review Agent: Review code
3. Security Auditor: Security review
4. Frontend Specialist: Address feedback
5. Approve & complete

### Pattern 4: Exploration → Implementation
Research → Decide → Build

**Example**:
1. Explore Agent: Research RAG approaches
2. Architecture Reviewer: Review options
3. Create ADR with decision
4. AI Integration Specialist: Implement

---

## Best Practices

### Task Management
- ✅ Use descriptive task titles
- ✅ Clear acceptance criteria for every task
- ✅ Update status daily
- ✅ Move completed tasks to /completed
- ✅ Document blockers immediately

### Agent Coordination
- ✅ Use appropriate specialist agents
- ✅ Provide sufficient context (PRD, TDD references)
- ✅ Review agent work before moving on
- ✅ One task per agent at a time
- ✅ Handle handoffs explicitly

### Documentation
- ✅ Create session log every day
- ✅ Create ADRs for important decisions
- ✅ Update master plan weekly
- ✅ Log blockers and resolutions
- ✅ Celebrate milestones

### Process
- ✅ Morning planning (15-30 min)
- ✅ Evening review (15-30 min)
- ✅ Weekly retrospective (Fridays)
- ✅ Weekly planning (Mondays)

---

## Troubleshooting

**Q: Too many active tasks, feeling overwhelmed**
A: Focus on master plan priorities. Work on 3-5 tasks max per day. Move non-critical to backlog.

**Q: Agent producing low-quality code**
A: Ensure you're using the right specialist prompt. Provide more context (PRD sections, examples). Review and request revisions.

**Q: Timeline slipping**
A: Review master plan, identify bottleneck. Can tasks be parallelized? Can features be descoped? Add buffer, update timeline.

**Q: Don't know which agent to use**
A: Check master plan agent assignments. Match task type to agent expertise. When in doubt, use general-purpose agent.

---

## Metrics & Success

**Track these weekly**:
- Tasks completed
- Blockers encountered & resolved
- Agent utilization (which agents used most)
- Timeline adherence (on track / behind / ahead)
- Code quality (review feedback, bugs found)

**Success indicators**:
- Consistent progress week-over-week
- Minimal blockers (or fast resolution)
- High-quality agent output
- On-time milestone completion
- Comprehensive documentation

---

## Resources

### Internal Documentation
- **PRD**: `/docs/manifest-the-unseen-prd.md` - Product requirements
- **TDD**: `/docs/manifest-the-unseen-tdd.md` - Technical design
- **CLAUDE.md**: `/CLAUDE.md` - Project guide for AI agents

### Orchestration Guides
- **Master Plan**: `orchestrator/master-plan.md`
- **Workflow Guide**: `orchestrator/workflow-guide.md`
- **Dependencies**: `orchestrator/dependencies.md`

### Templates
- **Tasks**: `tasks/templates/`
- **Session Logs**: `logs/sessions/2025-11/session-template.md`
- **ADRs**: `logs/decisions/template-adr.md`

---

## Getting Help

**For orchestration questions**:
- Read the workflow guide: `orchestrator/workflow-guide.md`
- Check examples in session logs
- Review master plan for context

**For technical questions**:
- Check PRD for requirements
- Check TDD for implementation guidance
- Check workstream READMEs for feature context
- Check ADRs for past decisions

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-11-17 | Initial orchestration system setup |

---

**Let's build something amazing! 🚀**

**Status**: Ready for Week 1 development
**Next Steps**: Begin Pre-Development Phase (Weeks 1-2)
