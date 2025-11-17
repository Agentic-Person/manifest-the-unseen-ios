# AI Chat (Monk Companion) Workstream

**Status**: Not Started
**Timeline**: Weeks 15-20 (Phase 3)
**Priority**: P1 - Signature Feature

---

## Overview

The AI monk companion provides personalized wisdom guidance using RAG (Retrieval Augmented Generation). It's trained on manifestation wisdom from Lunar Rivers, Shi Heng Yi, Nikola Tesla, and more. Users can ask questions and receive thoughtful, context-aware responses.

## Timeline

- **Planning**: Weeks 13-14
- **Knowledge Base Setup**: Weeks 15-16
- **Chat Implementation**: Weeks 17-18
- **Testing & Refinement**: Weeks 19-20
- **Ongoing**: Content expansion, prompt tuning

## Key Agents Involved

- **Primary**: AI Integration Specialist (RAG, Claude API)
- **Support**: Backend Specialist (pgvector, Edge Functions), Frontend Specialist (chat UI)
- **Review**: Security Auditor (data privacy), Architecture Reviewer (cost optimization)

## Key Tasks

### Knowledge Base Setup (Weeks 15-16)
1. **Content Ingestion** (AI Integration Specialist)
   - Parse Manifest the Unseen PDF (202 pages)
   - Parse Shi Heng Yi transcript
   - Parse Book Essence Hub transcript
   - Parse Tesla writings
   - Chunk content (1000 chars, 200 overlap)

2. **Embedding Generation** (AI Integration Specialist)
   - Generate embeddings (OpenAI text-embedding-3-small)
   - Store in Supabase pgvector

3. **pgvector Setup** (Backend Specialist)
   - Enable extension
   - Create knowledge_embeddings table
   - Create ivfflat index
   - Write match_knowledge() function

### Chat Implementation (Weeks 17-18)
4. **Supabase Edge Function** (AI Integration Specialist + Backend Specialist)
   - ai-chat Edge Function (Deno)
   - Generate query embedding
   - Search pgvector
   - Build context + system prompt
   - Call Claude API
   - Save conversation

5. **Claude API Integration** (AI Integration Specialist)
   - Configure Claude Sonnet 4.5
   - Implement conversation context
   - Handle rate limiting
   - Fallback to GPT-4

6. **Chat UI** (Frontend Specialist)
   - Chat bubble interface
   - Message input (multiline)
   - Typing indicators
   - Conversation history
   - Quick prompts

7. **Context-Aware Prompting** (AI Integration Specialist)
   - Fetch user's current phase
   - Fetch recent journal entries
   - Fetch user's goals
   - Enhance system prompt

8. **Share to Journal** (Frontend Specialist)

### Testing & Refinement (Weeks 19-20)
9. **Prompt Engineering** (AI Integration Specialist)
10. **Rate Limiting** (Backend Specialist)
11. **Cost Optimization** (AI Integration Specialist)

## Dependencies

**Blocks**:
- None (standalone feature)

**Blocked By**:
- Authentication
- Supabase database
- Claude API key

## Success Metrics

- AI response time < 5 seconds
- Response relevance > 80% (user feedback)
- Context-awareness validated
- Cost per user < $0.50/month
- Users engage 3+ times per week

## Testing Checklist

- [ ] Knowledge base searchable
- [ ] Claude API responds correctly
- [ ] Responses are relevant
- [ ] Conversation context maintained
- [ ] Rate limiting enforced
- [ ] Share to journal works
- [ ] Cost tracking functional
- [ ] No inappropriate responses

## Technical Details

**RAG Flow**:
1. User message → Generate embedding
2. Search pgvector (top 5, similarity > 0.7)
3. Build system prompt with context
4. Call Claude API with conversation history
5. Stream response to user
6. Save to ai_conversations table

**Knowledge Sources**:
- Manifest the Unseen (202 pages)
- Shi Heng Yi transcript
- Book Essence Hub transcript
- Nikola Tesla writings
- Universal Laws of Manifestation

**AI Personality**:
- Wise, calm, monk-like
- Non-judgmental, supportive
- Uses nature metaphors
- Asks reflective questions
- Provides actionable guidance

**Database**:
```sql
CREATE TABLE knowledge_embeddings (
  id UUID PRIMARY KEY,
  content TEXT NOT NULL,
  embedding vector(1536),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_embeddings_vector ON knowledge_embeddings
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

CREATE TABLE ai_conversations (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  title TEXT,
  messages JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Rate Limits by Tier**:
- **Novice**: 30 messages/day
- **Awakening**: 100 messages/day
- **Enlightenment**: Unlimited

## Resources

- **PRD**: Section 3.1.4 - AI Monk Companion
- **TDD**: Section 6 - AI Chat with RAG
- **Claude Docs**: https://docs.anthropic.com/claude
- **Supabase pgvector**: https://supabase.com/docs/guides/ai/vector-indexes

## Current Status

**Not Started**

## Notes

(Add notes on prompt engineering, cost optimization strategies)
