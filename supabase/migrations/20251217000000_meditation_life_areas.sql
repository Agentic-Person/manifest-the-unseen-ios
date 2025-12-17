-- Migration: Add life_areas to meditations table
-- Date: 2025-12-17
-- Description: Enable smart meditation suggestions based on user's weak life areas from Wheel of Life

-- Add life_areas column to meditations table for smart suggestions
ALTER TABLE meditations ADD COLUMN IF NOT EXISTS life_areas TEXT[] DEFAULT '{}';

-- Create GIN index for efficient array queries
CREATE INDEX IF NOT EXISTS idx_meditations_life_areas ON meditations USING GIN(life_areas);

COMMENT ON COLUMN meditations.life_areas IS 'Life areas this meditation addresses: career, health, relationships, finance, personalGrowth, family, recreation, spirituality';
