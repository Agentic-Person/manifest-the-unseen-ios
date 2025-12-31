---
task_id: DOCS-YYYY-MM-###
title: "Document: [Feature/API/Guide]"
docs_type: [api|user-guide|technical|architecture|how-to]
target: [Component/Feature name]
phase: "[Phase 1-5] - [Phase Name]"
status: [pending|in-progress|completed]
priority: [P0|P1|P2|P3]
assigned_agent: [api-documenter|user-guide-writer]
estimated_hours:
actual_hours:
created: YYYY-MM-DD
updated: YYYY-MM-DD
completed: YYYY-MM-DD
---

## Documentation Objective
What needs to be documented and for whom.

## Audience
**Primary readers**:
- Developers (internal/external)
- End users
- Future maintainers
- Stakeholders

**Assumed knowledge level**:
- What readers should already know
- Prerequisites

## Scope
**What to document**:
- Features/APIs/processes
- Key concepts
- Examples
- Common issues

**Out of scope**:
- What's not included (yet)
- Related docs elsewhere

## Documentation Outline

### API Documentation (if API docs)
#### [Function/Method Name]
**Description**: What it does

**Signature**:
```typescript
function example(param1: Type1, param2: Type2): ReturnType
```

**Parameters**:
- `param1` (Type1): Description
- `param2` (Type2): Description

**Returns**: ReturnType - Description

**Example**:
```typescript
const result = example(value1, value2);
```

**Error handling**:
- Error case 1: What triggers it, how to handle
- Error case 2: What triggers it, how to handle

### User Guide (if user guide)
#### Overview
- What this feature does
- When to use it
- Benefits

#### Getting Started
1. Step 1
2. Step 2
3. Step 3

#### Common Tasks
**Task 1: [Name]**
1. How to do it
2. Step by step
3. Screenshots (if needed)

**Task 2: [Name]**
1. How to do it
2. Step by step

#### Troubleshooting
**Problem 1**: [Issue description]
- **Cause**: Why it happens
- **Solution**: How to fix

### Technical Documentation (if technical docs)
#### Architecture Overview
- High-level design
- Key components
- Data flow

#### Implementation Details
- How it works internally
- Key decisions
- Trade-offs made

#### Integration Guide
- How to integrate with this component
- Dependencies
- Configuration needed

### How-To Guide (if how-to)
#### Prerequisites
- What you need before starting
- Required tools/access

#### Step-by-Step Guide
**Step 1**: [Action]
- Details
- Code example if applicable
- Expected result

**Step 2**: [Action]
- Details
- Code example
- Expected result

#### Common Pitfalls
1. **Pitfall description**
   - How to avoid
   - How to fix if encountered

## Content Requirements
**Sections needed**:
- [ ] Introduction/Overview
- [ ] Prerequisites
- [ ] Main content
- [ ] Examples
- [ ] Troubleshooting
- [ ] Related resources
- [ ] Changelog (if versioned)

**Supplementary materials**:
- [ ] Code examples
- [ ] Screenshots
- [ ] Diagrams
- [ ] Video tutorials (optional)

## Style Guide
**Tone**: [Formal|Conversational|Technical]

**Conventions**:
- Use active voice
- Short paragraphs
- Code examples for all features
- Clear headings and structure
- Links to related docs

**Formatting**:
- Markdown formatting
- Code blocks with syntax highlighting
- Callouts for important notes/warnings
- Consistent heading levels

## Quality Checklist
- [ ] **Accuracy**: Information is correct and up-to-date
- [ ] **Completeness**: All relevant topics covered
- [ ] **Clarity**: Easy to understand for target audience
- [ ] **Examples**: Sufficient code examples
- [ ] **Structure**: Logical organization
- [ ] **Links**: All links working
- [ ] **Code**: All code examples tested
- [ ] **Grammar**: No spelling/grammar errors
- [ ] **Accessibility**: Images have alt text
- [ ] **Searchability**: Keywords included for SEO

## Review Process
**Technical review**:
- [ ] Reviewed by subject matter expert
- [ ] Code examples validated
- [ ] Technical accuracy confirmed

**Editorial review**:
- [ ] Spelling/grammar checked
- [ ] Clarity and flow assessed
- [ ] Style guide compliance verified

## Deliverables
**Files to create/update**:
- `docs/path/to/file.md`
- `README.md` (if updating)
- Code comments in `src/component.ts`

**Location**: Where docs will be published
- Internal: `/docs` directory
- External: Documentation website
- Inline: Code comments

## Maintenance Plan
**Update triggers**:
- Feature changes
- Bug fixes affecting docs
- User feedback
- New best practices

**Review cycle**: [Monthly|Quarterly|As-needed]

**Owner**: Who maintains this documentation

## Notes
**Research sources**:
- Code reviewed
- SMEs consulted
- External references

**Decisions made**:
- Why documented this way
- Alternatives considered

**Future improvements**:
- What could be added later
- Video tutorials to create
- Interactive examples
