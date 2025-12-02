-- Manifest the Unseen - Meditation Types Migration
-- Migration: 20251129000000_meditation_types.sql
-- Description: Adds meditation type enum to distinguish guided, breathing, and music content

-- =============================================================================
-- ADD MEDITATION TYPE ENUM
-- =============================================================================

-- Create meditation type enumeration
CREATE TYPE meditation_type AS ENUM ('guided', 'breathing', 'music');

COMMENT ON TYPE meditation_type IS 'Type of meditation content: guided (voice narration), breathing (instructional exercises), music (ambient/instrumental)';

-- =============================================================================
-- ALTER MEDITATIONS TABLE
-- =============================================================================

-- Add type column to meditations table
ALTER TABLE meditations
ADD COLUMN type meditation_type DEFAULT 'guided';

-- Update existing rows to be explicitly 'guided'
UPDATE meditations SET type = 'guided' WHERE type IS NULL;

-- Create index for type queries
CREATE INDEX idx_meditation_type ON meditations(type);

COMMENT ON COLUMN meditations.type IS 'Content type: guided (voice meditation), breathing (exercises), music (ambient tracks)';

-- =============================================================================
-- INSERT BREATHING EXERCISES
-- =============================================================================

INSERT INTO meditations (id, title, description, duration_seconds, audio_url, narrator_gender, tier_required, type, tags, order_index)
VALUES
  -- Box Breathing
  (
    '00000000-0000-0000-0001-000000000001',
    'Box Breathing',
    'The classic 4-4-4-4 technique used by warriors and monks for thousands of years. Calms the nervous system and focuses the mind.',
    360,  -- 6 minutes
    'breathing/box-breathing.m4a',
    'female',
    'novice',
    'breathing',
    ARRAY['breathing', 'calm', 'focus', 'beginner', 'stress-relief'],
    20
  ),
  -- Deep Calm (5-2-5-2)
  (
    '00000000-0000-0000-0001-000000000002',
    'Deep Calm',
    'A 5-2-5-2 breathing pattern that activates your parasympathetic nervous system. Signal safety to every cell in your body.',
    480,  -- 8 minutes
    'breathing/deep-calm.m4a',
    'female',
    'novice',
    'breathing',
    ARRAY['breathing', 'relaxation', 'nervous-system', 'healing', 'sleep'],
    21
  ),
  -- Energy Boost
  (
    '00000000-0000-0000-0001-000000000003',
    'Energy Boost',
    'Quick rhythmic breathing to wake up your body, sharpen your mind, and ignite your motivation. Your natural caffeine.',
    300,  -- 5 minutes
    'breathing/energy-boost.m4a',
    'female',
    'novice',
    'breathing',
    ARRAY['breathing', 'energy', 'morning', 'motivation', 'awakening'],
    22
  );

-- =============================================================================
-- INSERT MEDITATION MUSIC
-- =============================================================================

INSERT INTO meditations (id, title, description, duration_seconds, audio_url, narrator_gender, tier_required, type, tags, order_index)
VALUES
  -- Tibetan Singing Bowls
  (
    '00000000-0000-0000-0002-000000000001',
    'Tibetan Singing Bowls',
    'Authentic Himalayan bowl sounds for deep meditation. Let the resonant tones guide you into stillness and presence.',
    720,  -- 12 minutes
    'music/tibetan-bowls.m4a',
    'female',  -- Not applicable for music, but required by schema
    'novice',
    'music',
    ARRAY['music', 'bowls', 'tibetan', 'healing', 'authentic', 'ambient'],
    30
  ),
  -- 432Hz Healing Frequency
  (
    '00000000-0000-0000-0002-000000000002',
    '432Hz Healing Frequency',
    'Pure healing frequencies tuned to 432Hz for cellular harmony and cosmic alignment. Deep space ambient for transcendence.',
    1440,  -- 24 minutes
    'music/432hz-frequency.m4a',
    'female',
    'novice',
    'music',
    ARRAY['music', 'frequency', '432hz', 'healing', 'cosmic', 'ambient'],
    31
  ),
  -- Nature & Tibetan Drums
  (
    '00000000-0000-0000-0002-000000000003',
    'Nature & Tibetan Drums',
    'Shamanic frame drums layered with forest ambience. An ancient grounding journey connecting you to earth and spirit.',
    1920,  -- 32 minutes
    'music/nature-drums.m4a',
    'female',
    'awakening',
    'music',
    ARRAY['music', 'drums', 'shamanic', 'nature', 'grounding', 'tribal'],
    32
  ),
  -- Ocean Waves
  (
    '00000000-0000-0000-0002-000000000004',
    'Ocean Waves',
    'Pure ocean soundscape for deep relaxation and sleep. Let the eternal rhythm of the sea wash away all stress.',
    1200,  -- 20 minutes
    'music/ocean-waves.m4a',
    'female',
    'novice',
    'music',
    ARRAY['music', 'ocean', 'nature', 'sleep', 'relaxation', 'waves'],
    33
  );

-- =============================================================================
-- MIGRATION COMPLETE
-- =============================================================================

-- Verify migration
SELECT 'Breathing exercises added: ' || COUNT(*)::TEXT FROM meditations WHERE type = 'breathing';
SELECT 'Music tracks added: ' || COUNT(*)::TEXT FROM meditations WHERE type = 'music';
SELECT 'Total meditations: ' || COUNT(*)::TEXT FROM meditations;
