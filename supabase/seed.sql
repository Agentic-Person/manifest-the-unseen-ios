-- Manifest the Unseen - Database Seed Data
-- File: supabase/seed.sql
-- Description: Populates database with initial meditation content and test data
-- Use: `npx supabase db reset` (applies migrations + seed)
-- Or: `psql -h localhost -p 54322 -U postgres -d postgres -f supabase/seed.sql`

-- =============================================================================
-- MEDITATION SEED DATA
-- =============================================================================

-- Note: Audio files should be uploaded to Supabase Storage bucket 'meditations'
-- Format: meditations/{meditation-id}/{gender}-narrator.mp3

-- -----------------------------------------------------------------------------
-- Beginner Meditations (Novice Tier)
-- -----------------------------------------------------------------------------

INSERT INTO meditations (id, title, description, duration_seconds, audio_url, narrator_gender, tier_required, tags, order_index)
VALUES
  -- Meditation 1: Grounding and Presence
  (
    '00000000-0000-0000-0000-000000000001',
    'Grounding and Presence',
    'A gentle introduction to mindfulness, focusing on breath and body awareness to anchor yourself in the present moment.',
    600,  -- 10 minutes
    'meditations/00000000-0000-0000-0000-000000000001/male-narrator.mp3',
    'male',
    'novice',
    ARRAY['beginner', 'grounding', 'mindfulness', 'breath'],
    1
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    'Grounding and Presence',
    'A gentle introduction to mindfulness, focusing on breath and body awareness to anchor yourself in the present moment.',
    600,  -- 10 minutes
    'meditations/00000000-0000-0000-0000-000000000002/female-narrator.mp3',
    'female',
    'novice',
    ARRAY['beginner', 'grounding', 'mindfulness', 'breath'],
    2
  ),

  -- Meditation 2: Gratitude Practice
  (
    '00000000-0000-0000-0000-000000000003',
    'Daily Gratitude Practice',
    'Cultivate appreciation and abundance mindset by reflecting on the blessings in your life, big and small.',
    720,  -- 12 minutes
    'meditations/00000000-0000-0000-0000-000000000003/male-narrator.mp3',
    'male',
    'novice',
    ARRAY['gratitude', 'abundance', 'mindfulness'],
    3
  ),
  (
    '00000000-0000-0000-0000-000000000004',
    'Daily Gratitude Practice',
    'Cultivate appreciation and abundance mindset by reflecting on the blessings in your life, big and small.',
    720,  -- 12 minutes
    'meditations/00000000-0000-0000-0000-000000000004/female-narrator.mp3',
    'female',
    'novice',
    ARRAY['gratitude', 'abundance', 'mindfulness'],
    4
  ),

  -- Meditation 3: Letting Go of Fear
  (
    '00000000-0000-0000-0000-000000000005',
    'Releasing Fear and Worry',
    'A guided practice to identify limiting beliefs and fears, then release them with compassion and trust.',
    900,  -- 15 minutes
    'meditations/00000000-0000-0000-0000-000000000005/male-narrator.mp3',
    'male',
    'novice',
    ARRAY['fear', 'letting go', 'trust', 'healing'],
    5
  ),
  (
    '00000000-0000-0000-0000-000000000006',
    'Releasing Fear and Worry',
    'A guided practice to identify limiting beliefs and fears, then release them with compassion and trust.',
    900,  -- 15 minutes
    'meditations/00000000-0000-0000-0000-000000000006/female-narrator.mp3',
    'female',
    'novice',
    ARRAY['fear', 'letting go', 'trust', 'healing'],
    6
  );

-- -----------------------------------------------------------------------------
-- Intermediate Meditations (Awakening Tier)
-- -----------------------------------------------------------------------------

INSERT INTO meditations (id, title, description, duration_seconds, audio_url, narrator_gender, tier_required, tags, order_index)
VALUES
  -- Meditation 4: Self-Love and Compassion
  (
    '00000000-0000-0000-0000-000000000007',
    'Self-Love and Compassion',
    'Deepen your relationship with yourself through loving-kindness meditation and affirmations of self-worth.',
    1080,  -- 18 minutes
    'meditations/00000000-0000-0000-0000-000000000007/male-narrator.mp3',
    'male',
    'awakening',
    ARRAY['self-love', 'compassion', 'healing', 'affirmations'],
    7
  ),
  (
    '00000000-0000-0000-0000-000000000008',
    'Self-Love and Compassion',
    'Deepen your relationship with yourself through loving-kindness meditation and affirmations of self-worth.',
    1080,  -- 18 minutes
    'meditations/00000000-0000-0000-0000-000000000008/female-narrator.mp3',
    'female',
    'awakening',
    ARRAY['self-love', 'compassion', 'healing', 'affirmations'],
    8
  ),

  -- Meditation 5: Vision Manifestation
  (
    '00000000-0000-0000-0000-000000000009',
    'Vision Manifestation Journey',
    'Visualize your desired reality with clarity and emotion, aligning your energy with your deepest intentions.',
    1200,  -- 20 minutes
    'meditations/00000000-0000-0000-0000-000000000009/male-narrator.mp3',
    'male',
    'awakening',
    ARRAY['manifestation', 'visualization', 'law of attraction', 'goals'],
    9
  ),
  (
    '00000000-0000-0000-0000-00000000000a',
    'Vision Manifestation Journey',
    'Visualize your desired reality with clarity and emotion, aligning your energy with your deepest intentions.',
    1200,  -- 20 minutes
    'meditations/00000000-0000-0000-0000-00000000000a/female-narrator.mp3',
    'female',
    'awakening',
    ARRAY['manifestation', 'visualization', 'law of attraction', 'goals'],
    10
  );

-- -----------------------------------------------------------------------------
-- Advanced Meditations (Enlightenment Tier)
-- -----------------------------------------------------------------------------

INSERT INTO meditations (id, title, description, duration_seconds, audio_url, narrator_gender, tier_required, tags, order_index)
VALUES
  -- Meditation 6: Trust and Surrender
  (
    '00000000-0000-0000-0000-00000000000b',
    'Trust and Surrender to the Universe',
    'Release attachment to outcomes and surrender to the divine flow of life with trust and faith.',
    1500,  -- 25 minutes
    'meditations/00000000-0000-0000-0000-00000000000b/male-narrator.mp3',
    'male',
    'enlightenment',
    ARRAY['trust', 'surrender', 'faith', 'divine', 'letting go'],
    11
  ),
  (
    '00000000-0000-0000-0000-00000000000c',
    'Trust and Surrender to the Universe',
    'Release attachment to outcomes and surrender to the divine flow of life with trust and faith.',
    1500,  -- 25 minutes
    'meditations/00000000-0000-0000-0000-00000000000c/female-narrator.mp3',
    'female',
    'enlightenment',
    ARRAY['trust', 'surrender', 'faith', 'divine', 'letting go'],
    12
  );

-- =============================================================================
-- TEST USER DATA (Development Only)
-- =============================================================================
-- Uncomment for local development testing
-- DO NOT run in production!

-- Create test user profiles (requires users to exist in auth.users first)
-- Use Supabase Dashboard or supabase.auth.signUp() to create auth users

/*
-- Example: Insert test user (assumes auth user with this ID exists)
INSERT INTO users (id, email, full_name, subscription_tier, subscription_status, trial_end_date)
VALUES
  (
    'test-user-id-00000000-0000-0000-0000-000000000001',
    'test@example.com',
    'Test User',
    'novice',
    'trialing',
    NOW() + INTERVAL '7 days'
  )
ON CONFLICT (id) DO NOTHING;

-- Example: Test journal entries
INSERT INTO journal_entries (user_id, content, tags, mood)
VALUES
  (
    'test-user-id-00000000-0000-0000-0000-000000000001',
    'Today I reflected on my goals and felt a deep sense of gratitude for the journey ahead.',
    ARRAY['gratitude', 'goals', 'reflection'],
    'grateful'
  ),
  (
    'test-user-id-00000000-0000-0000-0000-000000000001',
    'I practiced the grounding meditation and felt more present throughout the day.',
    ARRAY['meditation', 'mindfulness', 'presence'],
    'calm'
  )
ON CONFLICT DO NOTHING;

-- Example: Test workbook progress
INSERT INTO workbook_progress (user_id, phase_number, worksheet_id, data, completed)
VALUES
  (
    'test-user-id-00000000-0000-0000-0000-000000000001',
    1,
    'wheel-of-life',
    '{"scores": {"health": 7, "relationships": 8, "career": 6, "finances": 5, "personal_growth": 9}}',
    true
  ),
  (
    'test-user-id-00000000-0000-0000-0000-000000000001',
    1,
    'values-assessment',
    '{"top_values": ["growth", "creativity", "freedom", "love", "authenticity"]}',
    false
  )
ON CONFLICT (user_id, phase_number, worksheet_id) DO NOTHING;
*/

-- =============================================================================
-- KNOWLEDGE EMBEDDINGS (To be populated via script)
-- =============================================================================
-- Knowledge base embeddings will be inserted via a separate ingestion script
-- that:
-- 1. Chunks source documents (PDFs, transcripts)
-- 2. Generates embeddings via OpenAI API
-- 3. Inserts into knowledge_embeddings table
--
-- See: scripts/ingest-knowledge-base.js (to be created)

-- Placeholder comment for future knowledge base data

-- =============================================================================
-- SEED COMPLETE
-- =============================================================================

-- Verify seeded data
SELECT 'Meditations seeded: ' || COUNT(*)::TEXT FROM meditations;
-- SELECT 'Test users seeded: ' || COUNT(*)::TEXT FROM users;
-- SELECT 'Test journals seeded: ' || COUNT(*)::TEXT FROM journal_entries;
