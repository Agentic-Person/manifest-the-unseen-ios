-- Migration: Add line_timings column for Whisper-generated timestamps
-- Date: 2026-01-08
-- Purpose: Store pre-generated line-level timestamps for accurate prayer text synchronization

-- Add line_timings column to prayers table
ALTER TABLE prayers
ADD COLUMN IF NOT EXISTS line_timings JSONB;

-- Add comment explaining the format
COMMENT ON COLUMN prayers.line_timings IS
  'Pre-generated line-level timestamps from Whisper transcription. Format: [{line: 0, text: "...", startMs: 0, endMs: 5000}, ...]';
