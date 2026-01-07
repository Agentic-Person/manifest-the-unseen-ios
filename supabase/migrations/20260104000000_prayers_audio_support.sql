-- Migration: Add audio support to prayers table for synchronized playback
-- Date: 2026-01-04
-- Description: Adds audio_url column to prayers table for the prayer player feature
--              where users can follow along with spoken prayers line-by-line

-- =============================================================================
-- ADD AUDIO URL COLUMN
-- =============================================================================

-- Add audio_url column to prayers table
ALTER TABLE prayers
ADD COLUMN IF NOT EXISTS audio_url TEXT;

-- Create index for efficient queries when filtering prayers with audio
CREATE INDEX IF NOT EXISTS idx_prayers_with_audio
ON prayers(audio_url)
WHERE audio_url IS NOT NULL;

-- Add column comment
COMMENT ON COLUMN prayers.audio_url IS 'Path to audio file in Supabase Storage (meditation-audio bucket, prayers/ folder). Example: prayers/the-presence-within.m4a. When present, enables synchronized line-by-line text display during playback.';

-- =============================================================================
-- VERIFICATION QUERY (uncomment to test)
-- =============================================================================
-- SELECT id, title, audio_url FROM prayers;
