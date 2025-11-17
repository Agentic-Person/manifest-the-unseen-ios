# Orchestrator Daily Workflow Guide

This guide explains how to effectively use the agent orchestration system for daily development work on Manifest the Unseen.

---

## Overview

The orchestrator pattern allows you (human or AI orchestrator) to coordinate multiple specialist agents to work on different parts of the project simultaneously, track progress systematically, and maintain comprehensive documentation.

**Key Principle**: You are the conductor, agents are the musicians. Each agent has specific expertise and plays their part.

---

## Daily Workflow

### Morning Planning Routine (15-30 minutes)

#### 1. Review Yesterday's Progress

Open the most recent session log in `/logs/sessions/YYYY-MM/`:

```bash
# Navigate to current month
cd agent-orchestration/logs/sessions/2025-11

# Open latest session log
cat session-YYYY-MM-DD.md
```

**Questions to ask**:
- What was completed yesterday?
- Were there blockers?
- What needs follow-up today?

#### 2. Check Master Plan Progress

```bash
cat ../orchestrator/master-plan.md
```

**Verify**:
- Are we on track for this week's milestones?
- Any timeline slippage?
- Any dependencies blocking upcoming work?

#### 3. Review Active Tasks

```bash
ls tasks/active/
```

For each active task:
- Is it still being worked on?
- Is it blocked?
- Should it be completed or moved to blocked?

#### 4. Prioritize Today's Work

Based on:
- Master plan timeline (current week)
- Active tasks status
- Blockers to resolve
- Dependencies to unblock

Create today's priority list (3-5 items max):
1. **Priority 1 (Critical)**: Must complete today
2. **Priority 2 (High)**: Should complete today
3. **Priority 3 (Medium)**: Nice to complete

#### 5. Assign Tasks to Agents

For each priority task:
- Determine which specialist agent is best suited
- Check if custom system prompt exists
- Prepare agent with context

**Example**:
```
Priority 1: Implement Supabase authentication
→ Assign to: Backend Specialist
→ System Prompt: /prompts/system-prompts/backend-specialist.md
→ Context: PRD Section 8.2, TDD Section 6
```

---

### Execution Phase (4-6 hours)

#### 6. Spawn Specialist Agents

Use Claude Code's Task tool to spawn agents with specialist prompts:

**Pattern**:
```
Use the Backend Specialist system prompt from:
/agent-orchestration/prompts/system-prompts/backend-specialist.md

Task: Implement Supabase authentication with Apple Sign-In

Context:
- PRD Section 8.2 defines auth requirements
- TDD Section 6 has implementation details
- Create TASK-2025-11-001 for this work

Follow the backend specialist conventions for Supabase and RLS.
```

#### 7. Monitor Agent Progress

As agents work:
- Review code being written
- Ask clarifying questions
- Provide additional context
- Document decisions made

#### 8. Handle Handoffs Between Agents

When one agent completes work that another needs:

**Example**: Backend Specialist finishes database schema → Frontend Specialist needs it

```
Backend completed: Database schema for journal_entries

Now assign to Frontend Specialist:
- Use the journal_entries schema
- Build CRUD components
- Reference Backend Specialist's work in [file path]
```

#### 9. Log Decisions

When important decisions are made, create an ADR:

```bash
# Copy template
cp logs/decisions/template-adr.md logs/decisions/001-use-supabase-for-backend.md

# Fill it out
# Document the decision, options considered, rationale
```

---

### Evening Review (15-30 minutes)

#### 10. Update Task Statuses

For each task worked on today:

**If completed**:
```bash
# Move from active to completed
mv tasks/active/TASK-2025-11-001.md tasks/completed/
```

**If blocked**:
```bash
# Move to blocked, document blocker
mv tasks/active/TASK-2025-11-002.md tasks/blocked/
```

**If still in progress**:
- Update progress notes in task file
- Document what's remaining

#### 11. Create Session Log

```bash
# Copy template
cp logs/sessions/2025-11/session-template.md logs/sessions/2025-11/session-2025-11-17.md
```

Fill out:
- ✅ Tasks completed
- 🔄 Tasks in progress
- 🚧 Blockers encountered
- 📝 Decisions made
- 🎯 Tomorrow's priorities

#### 12. Update Master Plan (if needed)

If timeline changed or milestones shifted:

```bash
vim orchestrator/master-plan.md
```

Update:
- Week status (Not Started → In Progress → Completed)
- Timeline adjustments
- Risk notes

#### 13. Prepare Tomorrow's Priorities

Based on:
- What wasn't completed today
- Next items in master plan
- Blockers to resolve
- Dependencies

Write them in session log under "Tomorrow's Priorities"

---

## Weekly Review Process

### Every Monday Morning

#### 1. Review Last Week

- Open all last week's session logs
- Summarize accomplishments
- Identify patterns (recurring blockers, underestimated tasks)

#### 2. Check Phase Progress

```bash
cat orchestrator/master-plan.md
```

**Questions**:
- Did we meet last week's milestones?
- Are we on track for the phase?
- Do we need to adjust timeline?

#### 3. Update Master Plan

- Mark completed weeks
- Adjust timeline if needed
- Update risk section
- Add new dependencies discovered

#### 4. Review Workstreams

For each active workstream:

```bash
cat workstreams/[workstream]/README.md
```

- Update status
- Check dependencies
- Adjust timeline if needed

#### 5. Plan This Week

- Review master plan for this week's goals
- Break down into daily tasks
- Assign to agents
- Identify potential blockers

#### 6. Create Weekly Schedule

Optional: Create a weekly schedule file:

```bash
vim orchestrator/weekly-schedules/week-03.md
```

Document:
- Monday-Friday objectives
- Agent assignments
- Expected completions

---

### Every Friday Afternoon

#### 1. Week Retrospective

**What went well**:
- Accomplishments
- Smooth processes
- Good agent coordination

**What could improve**:
- Blockers encountered
- Process friction
- Agent coordination issues

**Action items for next week**:
- Process improvements
- Risks to mitigate

#### 2. Demos & Testing

- Test all features completed this week
- Do quick demos to validate
- Note any bugs for next week

#### 3. Update Stakeholders (if applicable)

- Send week summary
- Highlight accomplishments
- Flag any timeline concerns

---

## Agent Coordination Patterns

### Pattern 1: Sequential Work

When tasks must happen in order:

**Example**: Database → Backend API → Frontend UI

```
1. Backend Specialist: Create database schema
   → WAIT for completion
2. Backend Specialist: Write API functions
   → WAIT for completion
3. Frontend Specialist: Build UI consuming API
```

### Pattern 2: Parallel Work

When tasks can happen simultaneously:

**Example**: Voice journaling UI + Meditation player UI

```
Spawn in parallel:
1. Audio/Voice Specialist: Voice recording + Whisper
2. Frontend Specialist: Meditation player UI

Coordinate on shared components if needed
```

### Pattern 3: Review Workflow

After implementing a feature:

```
1. Implementation Agent: Build feature
   → Feature complete
2. Code Review Agent: Review code quality
   → Feedback provided
3. Security Auditor: Security review (if sensitive)
   → Approval or changes requested
4. Implementation Agent: Address feedback
   → Final approval
5. Move task to completed
```

### Pattern 4: Exploration → Implementation

When you need to research before implementing:

```
1. Explore Agent: Research best approach for [feature]
   → Creates exploration report
2. Architecture Reviewer: Review options
   → Recommendation made
3. Create ADR documenting decision
4. Implementation Agent: Build based on decision
```

---

## Task Management Best Practices

### Creating Tasks

Use templates:

```bash
cp tasks/templates/implementation-task.md tasks/active/TASK-2025-11-005.md
```

**Fill out**:
- Clear objective (one sentence)
- Detailed acceptance criteria
- Implementation steps
- Dependencies
- Resources

**Good task titles**:
- ✅ "Implement Supabase Auth with Apple Sign-In"
- ✅ "Build Journal Entry List with FlatList"
- ❌ "Do auth" (too vague)
- ❌ "Fix bug" (not descriptive)

### Task Naming Convention

**Format**: `TASK-YYYY-MM-###`

**Examples**:
- `TASK-2025-11-001` - First task in November 2025
- `TASK-2025-11-042` - 42nd task in November 2025

Use in-month incrementing numbers for easy sorting.

### Task Lifecycle

```
[backlog] → [active] → [in-review] → [completed]
              ↓
           [blocked]
```

**Transitions**:
- Backlog → Active: When agent starts work
- Active → In-Review: When code is ready for review
- In-Review → Completed: When approved
- Active → Blocked: When blocker discovered
- Blocked → Active: When blocker resolved

---

## Blocker Resolution

### When You Hit a Blocker

1. **Document it immediately**:
   - In task file under "Dependencies" or "Notes"
   - In session log under "Blockers Encountered"

2. **Categorize**:
   - **Technical**: Need to solve a technical problem
   - **Dependency**: Waiting for another task
   - **External**: Waiting for API key, content, etc.
   - **Decision**: Need architectural decision

3. **Create resolution plan**:
   - What's needed to unblock?
   - Who can help?
   - Timeline for resolution?

4. **Move task to blocked/:**:
```bash
mv tasks/active/TASK-2025-11-010.md tasks/blocked/
```

5. **Work on something else** while resolving blocker

6. **When resolved**, move back to active:
```bash
mv tasks/blocked/TASK-2025-11-010.md tasks/active/
```

---

## Decision Documentation

### When to Create an ADR

Create an ADR for:
- Architecture choices (e.g., "Use Supabase over Firebase")
- Technology selections (e.g., "Use React Native over Swift")
- Design patterns (e.g., "Use Zustand for global state")
- Security decisions (e.g., "On-device Whisper transcription")
- Major refactors

**Don't create ADRs for**:
- Small implementation details
- Obvious choices
- Temporary hacks (document as technical debt instead)

### ADR Naming

**Format**: `ADR-###-short-title.md`

**Examples**:
- `ADR-001-use-supabase-for-backend.md`
- `ADR-002-react-native-over-native-swift.md`
- `ADR-003-on-device-whisper-transcription.md`

---

## Communication with Specialist Agents

### Effective Agent Prompts

**Bad**:
```
Build authentication
```

**Good**:
```
You are the Backend Specialist (use system prompt from /prompts/system-prompts/backend-specialist.md).

Implement Supabase authentication for Manifest the Unseen iOS app.

Requirements (from PRD Section 8.2):
- Apple Sign-In (primary)
- Email/password (backup)
- Biometric re-authentication for journal access
- Session persistence

Technical approach (from TDD Section 6):
- Supabase Auth for provider management
- react-native-keychain for secure token storage
- RLS policies on users table

Create TASK-2025-11-015 for this work.

Follow Backend Specialist conventions for Supabase and RLS.
```

### Giving Context

Always provide agents with:
1. **What** they're building (objective)
2. **Why** it's important (context)
3. **How** to approach it (technical guidance)
4. **Where** to find info (PRD sections, TDD sections, examples)
5. **Who** is the user (use case)

### Reviewing Agent Work

After agent completes work:
1. **Read the code** they wrote
2. **Test the feature** if possible
3. **Ask questions** if unclear
4. **Request changes** if needed
5. **Approve** and move to next step

---

## Tips for Success

### Do's ✅

- ✅ **Use templates** for consistency
- ✅ **Log everything** - you'll thank yourself later
- ✅ **One task at a time** per agent (don't overload)
- ✅ **Clear acceptance criteria** for every task
- ✅ **Review agent work** before moving on
- ✅ **Update master plan** weekly
- ✅ **Create ADRs** for important decisions
- ✅ **Take breaks** - orchestration is mentally demanding

### Don'ts ❌

- ❌ **Don't skip session logs** - they're invaluable for debugging and retrospectives
- ❌ **Don't let tasks go stale** - review active tasks daily
- ❌ **Don't ignore blockers** - resolve them quickly
- ❌ **Don't skip testing** - verify features as you build
- ❌ **Don't forget to celebrate** - mark milestones!
- ❌ **Don't overcommit** - 3-5 tasks/day is plenty
- ❌ **Don't work in isolation** - document and communicate

---

## Troubleshooting

### "I'm overwhelmed by the number of tasks"

**Solution**: Focus on the master plan. What's the current week's priority? Start there. Defer everything else.

### "Agent is producing low-quality code"

**Solution**:
1. Check if you're using the right specialist prompt
2. Provide more context (PRD sections, examples)
3. Review and request revisions
4. If persistent, switch to different agent or manual coding

### "Timeline is slipping"

**Solution**:
1. Review master plan - identify bottleneck
2. Can tasks be parallelized?
3. Can features be descoped?
4. Add contingency buffer
5. Update master plan with realistic dates

### "Too many blockers"

**Solution**:
1. Categorize blockers (technical, dependency, external)
2. Resolve quick wins first
3. Escalate external blockers (API keys, etc.)
4. Create exploration tasks for technical blockers
5. Work on unblocked tasks meanwhile

---

## Quick Reference

### Daily Checklist

**Morning**:
- [ ] Review yesterday's session log
- [ ] Check active tasks
- [ ] Prioritize today's work (3-5 items)
- [ ] Assign tasks to agents

**During Day**:
- [ ] Spawn agents with clear prompts
- [ ] Monitor progress
- [ ] Document decisions
- [ ] Resolve blockers

**Evening**:
- [ ] Update task statuses
- [ ] Create session log
- [ ] Update master plan if needed
- [ ] Set tomorrow's priorities

**Weekly** (Monday):
- [ ] Review last week
- [ ] Update master plan
- [ ] Plan this week

**Weekly** (Friday):
- [ ] Week retrospective
- [ ] Test completed features
- [ ] Update stakeholders

---

## Example Session

See `/docs/example-session-walkthrough.md` for a detailed example of a full day using this workflow.

---

**Remember**: The orchestration system is a tool to help you stay organized and productive. Use what works, adapt what doesn't. The goal is to ship high-quality software efficiently, not to follow a rigid process.

Good luck! 🚀
