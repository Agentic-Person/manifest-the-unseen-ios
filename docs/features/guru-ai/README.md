# Guru AI Feature

The Guru AI is a premium, phase-based conversational AI guide that provides personalized insights and wisdom after users complete workbook phases.

## What the Guru Does

The Guru AI analyzes a user's completed workbook data and provides:

- **Deep Phase Analysis**: Personalized insights based on specific worksheet responses across all 10 phases
- **Pattern Recognition**: Identifies connections and themes the user may have missed
- **Life Area Assessment**: Dynamically detects weak life areas from Wheel of Life scores (below 5/10)
- **Smart Recommendations**: Suggests meditations and breathing exercises tailored to the user's needs
- **Conversational Wisdom**: Allows follow-up questions and continued dialogue about each phase
- **RAG-Powered Insights**: Draws from knowledge base of manifestation teachings (Shi Heng Yi, Tesla 3-6-9, etc.)

## Dynamic Life Area Detection

When users complete Phase 1's Wheel of Life assessment, the Guru AI automatically:

1. **Identifies Low-Scoring Areas**: Detects any of the 8 life areas scoring below 5/10:
   - Career
   - Health
   - Relationships
   - Finance
   - Personal Growth
   - Family
   - Recreation
   - Spirituality

2. **Dynamically Suggests Breathing Exercises**: Matches the primary weak area to a targeted breathing technique:
   - **Career** → Energy Boost (increases focus and motivation)
   - **Health** → Deep Calm (activates healing response)
   - **Relationships** → Coherent Breathing (opens heart center)
   - **Finance** → Box Breathing (reduces anxiety around money)
   - **Personal Growth** → Box Breathing (enhances clarity)
   - **Family** → Coherent Breathing (cultivates compassion)
   - **Recreation** → Deep Calm (promotes relaxation)
   - **Spirituality** → 4-7-8 Relaxation (deepens spiritual connection)

3. **Focuses Analysis on Weak Areas**: The Guru's insights prioritize helping the user address their specific life balance challenges

## Phase-Specific Guidance

Each of the 10 phases has a unique Guru personality and focus:

| Phase | Name | Guru Focus |
|-------|------|-----------|
| 1 | Self-Evaluation | Life balance patterns, SWOT analysis, values alignment |
| 2 | Values & Vision | Purpose clarity, vision board symbolism, authentic alignment |
| 3 | Goal Setting | SMART goals, action plans, feasibility assessment |
| 4 | Facing Fears | Core fears, limiting beliefs, cognitive restructuring |
| 5 | Self-Love & Self-Care | Self-compassion, nurturing practices, inner child healing |
| 6 | Manifestation Techniques | 3-6-9 Method, scripting, emotional alignment |
| 7 | Practicing Gratitude | Gratitude depth, scarcity-to-abundance mindset shift |
| 8 | Turning Envy Into Inspiration | Shadow work, reframing comparison, role model analysis |
| 9 | Trust & Surrender | Letting go of control, recognizing synchronicities |
| 10 | Trust & Letting Go | Journey integration, graduation reflection, sustaining growth |

## Required Subscription Tier

**Guru AI access requires Awakening or Enlightenment tier:**

- **Novice Path** ($7.99/mo): No Guru access
- **Awakening Path** ($12.99/mo): Full Guru access for all 10 phases
- **Enlightenment Path** ($19.99/mo): Full Guru access for all 10 phases

## How It Works

### User Flow

1. User completes all worksheets in a phase (e.g., Phase 1 has 11 worksheets)
2. "Consult Guru" button unlocks on the phase screen
3. User taps to enter Guru chat for that phase
4. First message triggers deep analysis:
   - Guru reads all worksheet data for the phase
   - Detects low-scoring life areas (if Phase 1)
   - Searches knowledge base for relevant wisdom (RAG)
   - Generates personalized insights with Claude API
5. User can ask follow-up questions in a conversational manner
6. Conversation is saved per phase (persistent across sessions)

### Technical Flow

```
User Message
    ↓
[Verify Subscription: Awakening+]
    ↓
[Verify Phase Completion: All worksheets done]
    ↓
[Fetch Phase Workbook Data]
    ↓
[Extract Low Life Areas (Phase 1 only)]
    ↓
[Generate Embedding via OpenAI]
    ↓
[Search Knowledge Base (pgvector RAG)]
    ↓
[Build Context: Phase Prompt + Workbook + Knowledge + Low Areas]
    ↓
[Call Claude API]
    ↓
[Save Conversation to ai_conversations]
    ↓
[Return Personalized Response]
```

## Key Files

### Mobile App (React Native + TypeScript)

- **`mobile/src/services/guruService.ts`**
  - Manages Guru conversations (create, fetch, delete)
  - Sends messages to Edge Function
  - Formats workbook data for AI analysis

- **`mobile/src/types/guru.ts`**
  - TypeScript interfaces for Guru conversations, messages, and requests
  - Defines `GuruConversation`, `GuruMessage`, `GuruAnalysisRequest`, etc.

- **`mobile/src/types/meditation.ts`**
  - Extended with `life_areas: string[]` field
  - Maps meditations to relevant life areas for dynamic suggestions

- **`mobile/src/constants/lifeAreaMappings.ts`**
  - Maps life areas to breathing exercises
  - Maps life areas to meditation types
  - Used for dynamic practice recommendations

- **`mobile/src/hooks/useGuru.ts`** (if exists)
  - React hook for managing Guru state and mutations
  - Likely uses TanStack Query for caching

### Backend (Supabase)

- **`supabase/functions/guru-analysis/index.ts`**
  - Edge Function (Deno runtime) that processes Guru requests
  - Authenticates user, verifies subscription and phase completion
  - Fetches workbook data, extracts low life areas
  - Generates OpenAI embeddings for RAG search
  - Calls Claude API with phase-specific system prompts
  - Saves conversations to database

- **`supabase/migrations/20251217000000_meditation_life_areas.sql`**
  - Adds `life_areas TEXT[]` column to `meditations` table
  - Enables dynamic meditation suggestions based on Wheel of Life scores

- **`supabase/seed.sql`**
  - Populates meditation records with life area tags
  - Example: Evening Healing Meditation → `['health', 'spirituality', 'personalGrowth']`

### Database Tables

- **`ai_conversations`**
  - Stores all Guru conversations with `conversation_type = 'guru'`
  - `guru_phase` column identifies which phase (1-10)
  - `messages JSONB` array stores full conversation history

- **`guru_sessions`**
  - Tracks Guru usage metrics (session start, phase analyzed)
  - Links to `ai_conversations` table

- **`meditations`**
  - Extended with `life_areas TEXT[]` for smart suggestions

- **`workbook_progress`**
  - Source data for Guru analysis
  - `data JSONB` contains all user worksheet answers
  - `completed BOOLEAN` and `phase_number` determine eligibility

- **`knowledge_embeddings`**
  - RAG knowledge base (327 entries)
  - `embedding vector(1536)` for similarity search
  - Contains Shi Heng Yi, Tesla 3-6-9, manifestation teachings

## Knowledge Base (RAG)

The Guru AI draws wisdom from:

- **Lunar Rivers "Manifest the Unseen" Workbook**: Complete 202-page methodology
- **Shi Heng Yi Teachings**: Mindfulness, self-mastery, letting go
- **Nikola Tesla 3-6-9 Principles**: Frequency, vibration, energy
- **Book Essence Hub Content**: Manifestation techniques and psychology

Content is chunked, embedded (OpenAI `text-embedding-3-small`), and stored in Supabase pgvector for fast similarity search.

## Recent Enhancements (Build 20, December 2025)

### Critical Bug Fix
- Fixed `guruService.ts` and `guru.ts` to use correct table name (`ai_conversations` instead of non-existent `guru_conversations`)

### Dynamic Life Area Detection
- Added `extractLowLifeAreas()` function to Edge Function
- Automatically detects Wheel of Life scores below 5/10
- Injects low areas into Claude system prompt for focused analysis

### Smart Practice Recommendations
- Phase-based static suggestions (e.g., Phase 1 → Evening Healing + Box Breathing)
- **NEW**: Dynamic breathing suggestions override based on primary weak life area
- Meditation suggestions remain phase-appropriate but contextualized to weak areas

### Database Schema
- Added `life_areas TEXT[]` column to `meditations` table
- Tagged all 6 meditation types with relevant life areas
- Enables future feature: "Meditations for Finance" filtering

## Testing Checklist

- [ ] Complete Phase 1 (11 worksheets)
- [ ] Verify Guru unlocks only after 100% completion
- [ ] Test with low Wheel of Life scores (e.g., Career=3, Health=4)
- [ ] Confirm Guru references specific low areas in response
- [ ] Verify dynamically suggested breathing exercise matches weak area
- [ ] Test conversation continuity (follow-up questions)
- [ ] Verify subscription gating (Awakening+ required)

## Future Enhancements

- Meditation filtering by life area in Meditate tab
- Guru "insights summary" after completing multiple phases
- Export Guru conversations as PDF
- Voice-based Guru interaction (speak questions, hear responses)
