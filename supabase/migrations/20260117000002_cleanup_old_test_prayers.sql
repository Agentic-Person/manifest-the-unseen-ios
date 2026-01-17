-- Clean up old test prayers and document Communion with the Divine addition
-- This migration documents the manual cleanup performed on 2026-01-17

-- Step 1: Remove old test prayers from Jan 7 (already executed manually)
-- DELETE FROM prayers
-- WHERE title IN ('The Infinite Within', 'The Temple of the Heart')
--   AND audio_url IN ('prayers/the-infinite-within.m4a', 'prayers/the-temple-of-the-heart.m4a');

-- Step 2: Communion with the Divine was added via upload script
-- Prayer details:
--   - Title: "Communion With The Divine"
--   - Audio URL: prayers/038-communion-with-the-divine.m4a
--   - Duration: 730 seconds (12m 10s)
--   - Tier: awakening
--   - Created: 2026-01-17 18:40:58

-- Verification: Should have exactly 8 prayers with audio
-- SELECT title, audio_url, duration_seconds
-- FROM prayers
-- WHERE audio_url IS NOT NULL
-- ORDER BY title;

-- Expected results:
-- 1. Breaking The Chains
-- 2. Communion With The Divine
-- 3. Complete Declaration Of Restoration
-- 4. I Am At Peace
-- 5. I Am Open To Receive
-- 6. I Speak Healing
-- 7. The Courage To Be Still
-- 8. The Frequency Of Thankfulness
