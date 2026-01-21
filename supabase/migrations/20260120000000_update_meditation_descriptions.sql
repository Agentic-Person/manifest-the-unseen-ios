-- Migration: Update meditation and prayer descriptions with specific content
-- Source: MTU_Meditation_Content_Stages.xlsx (Column G: Short_Description)

-- =====================================================
-- GUIDED MEDITATIONS (type = 'guided')
-- =====================================================

UPDATE meditations SET description = 'Visualization of divine healing light entering and restoring the body'
WHERE title ILIKE '%Healing Light%' AND type = 'guided';

UPDATE meditations SET description = 'Deep visualization of living water flowing through the body bringing restoration'
WHERE title ILIKE '%Rivers Of Living Water%' AND type = 'guided';

UPDATE meditations SET description = 'Visualization of opening heart and hands to receive abundance'
WHERE title ILIKE '%Opening To Receive%' AND type = 'guided';

UPDATE meditations SET description = 'Journey to the river of abundance, releasing lack and receiving flow'
WHERE title ILIKE '%River Of Abundance%' AND type = 'guided';

UPDATE meditations SET description = 'Meeting and embracing the inner child, returning to wholeness'
WHERE title ILIKE '%Coming Home To Yourself%' AND type = 'guided';

UPDATE meditations SET description = 'Journey through false mirrors to discover true radiant identity'
WHERE title ILIKE '%Mirror Of Truth%' AND type = 'guided';

UPDATE meditations SET description = 'Visualization of severing energetic attachments to past pain'
WHERE title ILIKE '%Cutting The Cords%' AND type = 'guided';

UPDATE meditations SET description = 'Journey to sacred temple, placing burdens in transformative fire'
WHERE title ILIKE '%Temple Of Release%' AND type = 'guided';

UPDATE meditations SET description = 'Becoming the eye of the storm, finding stillness amid chaos'
WHERE title ILIKE '%Calm Within The Storm%' AND type = 'guided';

UPDATE meditations SET description = 'Visualization of heart as rose blooming, opening to love'
WHERE title ILIKE '%Opening The Heart%' AND type = 'guided';

UPDATE meditations SET description = 'Journey into heart temple, healing walls, planting seed of desired love'
WHERE title ILIKE '%Temple Of The Heart%' AND type = 'guided';

UPDATE meditations SET description = 'Entering inner sanctuary, sitting with divine presence'
WHERE title ILIKE '%Kingdom Within%' AND type = 'guided';

UPDATE meditations SET description = 'Transcendent journey from finite self to infinite consciousness'
WHERE title ILIKE '%Infinite Within%' AND type = 'guided';

UPDATE meditations SET description = 'Visualization of purpose seed in heart, nurturing its growth'
WHERE title ILIKE '%Seed Of Purpose%' AND type = 'guided';

UPDATE meditations SET description = 'Visualization of turning palms upward, releasing what is controlled'
WHERE title ILIKE '%Open Hands%' AND type = 'guided';

-- =====================================================
-- BREATHING EXERCISES (type = 'breathing')
-- =====================================================

UPDATE meditations SET description = 'Classic 4-4-4-4 technique for calming the nervous system and focusing the mind'
WHERE title ILIKE '%Box Breathing%' AND type = 'breathing';

UPDATE meditations SET description = '5-2-5-2 pattern that activates the parasympathetic nervous system for deep relaxation'
WHERE title ILIKE '%Deep Calm%' AND type = 'breathing';

UPDATE meditations SET description = 'Visualization breathwork: Inhale golden light from heaven, exhale grounding energy to earth'
WHERE title ILIKE '%Currents Of Heaven And Earth%' AND type = 'breathing';

UPDATE meditations SET description = 'Alternate nostril breathing (Nadi Shodhana) for brain hemisphere balance and mental clarity'
WHERE title ILIKE '%Hemisphere Balance%' AND type = 'breathing';

-- =====================================================
-- PRAYERS (prayers table)
-- =====================================================

UPDATE prayers SET description = 'Short prayer declaring healing over body, mind, and spirit using biblical authority'
WHERE title ILIKE '%I Speak Healing%';

UPDATE prayers SET description = 'Comprehensive healing prayer covering every system of the body with scripture'
WHERE title ILIKE '%Complete Declaration Of Restoration%';

UPDATE prayers SET description = 'Declaration of openness to divine abundance and provision'
WHERE title ILIKE '%I Am Open To Receive%';

UPDATE prayers SET description = 'Comprehensive prayer shifting from lack consciousness to overflow'
WHERE title ILIKE '%Frequency Of Overflow%';

UPDATE prayers SET description = 'Declaration of inherent worthiness and divine identity'
WHERE title ILIKE '%I Am Worthy%';

UPDATE prayers SET description = 'Release of false labels and reclamation of true spiritual identity'
WHERE title ILIKE '%Reclaiming My True Identity%';

UPDATE prayers SET description = 'Declaration choosing forgiveness as a gift to self'
WHERE title ILIKE '%I Choose To Release%';

UPDATE prayers SET description = 'Comprehensive prayer releasing past wounds and choosing freedom'
WHERE title ILIKE '%Breaking The Chains%';

UPDATE prayers SET description = 'Declaration of peace as birthright, releasing anxiety and control'
WHERE title ILIKE '%I Am At Peace%';

UPDATE prayers SET description = 'Prayer embracing stillness as strength, speaking to fear and mind'
WHERE title ILIKE '%Courage To Be Still%';

UPDATE prayers SET description = 'Declaration of gratitude for breath, body, provision, and people'
WHERE title ILIKE '%I Am Grateful%';

UPDATE prayers SET description = 'Comprehensive gratitude prayer for body, mind, relationships, challenges'
WHERE title ILIKE '%Frequency Of Thankfulness%';

UPDATE prayers SET description = 'Comprehensive prayer for deep spiritual connection and union'
WHERE title ILIKE '%Communion With The Divine%';

UPDATE prayers SET description = 'Declaration of Kingdom within, turning inward to sacred presence'
WHERE title ILIKE '%Kingdom Is Within Me%';

-- =====================================================
-- VERIFICATION QUERIES (for manual checking)
-- =====================================================
-- Run these after migration to verify updates:
--
-- SELECT title, description FROM meditations WHERE type = 'guided' ORDER BY title;
-- SELECT title, description FROM meditations WHERE type = 'breathing' ORDER BY title;
-- SELECT title, description FROM prayers ORDER BY title;
