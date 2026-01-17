-- Manifest the Unseen - Add Prayer Type Migration
-- Migration: 20260117000000_add_prayer_type.sql
-- Description: Adds 'prayer' to meditation_type enum for spoken prayer content

-- =============================================================================
-- ADD PRAYER TYPE TO ENUM
-- =============================================================================

-- Add 'prayer' to the meditation_type enum
ALTER TYPE meditation_type ADD VALUE IF NOT EXISTS 'prayer';

COMMENT ON TYPE meditation_type IS 'Type of meditation content: guided (voice narration), breathing (instructional exercises), music (ambient/instrumental), prayer (spoken prayers)';

-- =============================================================================
-- MIGRATION COMPLETE
-- =============================================================================

-- Verify migration
SELECT 'Prayer type added to meditation_type enum' AS status;
