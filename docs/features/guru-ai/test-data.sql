-- Guru AI Test Data Population Script
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/zbyszxtwzoylyygtexdr/sql
--
-- This creates test data for jimmy@agenticpersonnel.com to test the Guru AI feature

-- =============================================================================
-- STEP 1: Get the user ID (user must already exist in auth.users via signup)
-- =============================================================================
-- First, check if the user exists:
-- SELECT id, email FROM auth.users WHERE email = 'jimmy@agenticpersonnel.com';

-- If user doesn't exist, they need to sign up through the app first.
-- The auth.users table is managed by Supabase Auth.

-- =============================================================================
-- STEP 2: Update user profile to enlightenment tier
-- =============================================================================
-- Replace 'USER_ID_HERE' with the actual UUID from auth.users

UPDATE users
SET
  subscription_tier = 'enlightenment',
  subscription_status = 'active'
WHERE email = 'jimmy@agenticpersonnel.com';

-- If user doesn't exist in public.users table yet, insert:
-- INSERT INTO users (id, email, full_name, subscription_tier, subscription_status)
-- SELECT id, email, 'Jimmy', 'enlightenment', 'active'
-- FROM auth.users WHERE email = 'jimmy@agenticpersonnel.com'
-- ON CONFLICT (id) DO UPDATE SET subscription_tier = 'enlightenment', subscription_status = 'active';

-- =============================================================================
-- STEP 3: Create Phase 1 Workbook Progress (11 worksheets)
-- =============================================================================
-- Get user ID for workbook entries
DO $$
DECLARE
  test_user_id UUID;
BEGIN
  -- Get user ID
  SELECT id INTO test_user_id FROM auth.users WHERE email = 'jimmy@agenticpersonnel.com';

  IF test_user_id IS NULL THEN
    RAISE EXCEPTION 'User jimmy@agenticpersonnel.com not found. Please sign up first.';
  END IF;

  -- Delete existing Phase 1 data (clean slate)
  DELETE FROM workbook_progress WHERE user_id = test_user_id AND phase_number = 1;

  -- 1. Wheel of Life (WITH LOW SCORES to test dynamic suggestions)
  INSERT INTO workbook_progress (user_id, phase_number, worksheet_id, data, completed, completed_at)
  VALUES (
    test_user_id, 1, 'wheel-of-life',
    '{
      "career": 3,
      "health": 4,
      "relationships": 7,
      "finance": 2,
      "personalGrowth": 6,
      "family": 8,
      "recreation": 5,
      "spirituality": 9
    }'::jsonb,
    true, NOW()
  );

  -- 2. Feel Wheel
  INSERT INTO workbook_progress (user_id, phase_number, worksheet_id, data, completed, completed_at)
  VALUES (
    test_user_id, 1, 'feel-wheel',
    '{
      "primaryEmotion": "hopeful",
      "secondaryEmotions": ["anxious", "determined", "grateful"],
      "emotionIntensity": 7,
      "physicalSensations": "Tension in shoulders, warmth in chest",
      "triggers": "Thinking about career change and financial goals"
    }'::jsonb,
    true, NOW()
  );

  -- 3. SWOT Analysis
  INSERT INTO workbook_progress (user_id, phase_number, worksheet_id, data, completed, completed_at)
  VALUES (
    test_user_id, 1, 'swot-analysis',
    '{
      "strengths": ["Creative problem solver", "Strong work ethic", "Good communicator", "Adaptable"],
      "weaknesses": ["Procrastination", "Fear of failure", "Poor financial planning", "Overthinking"],
      "opportunities": ["AI technology growth", "Remote work options", "Online learning", "Network expansion"],
      "threats": ["Economic uncertainty", "Industry disruption", "Health challenges", "Time constraints"]
    }'::jsonb,
    true, NOW()
  );

  -- 4. Habits Audit
  INSERT INTO workbook_progress (user_id, phase_number, worksheet_id, data, completed, completed_at)
  VALUES (
    test_user_id, 1, 'habits-audit',
    '{
      "goodHabits": [
        {"habit": "Morning meditation", "frequency": "daily", "impact": "high"},
        {"habit": "Reading before bed", "frequency": "daily", "impact": "medium"},
        {"habit": "Weekly exercise", "frequency": "weekly", "impact": "high"}
      ],
      "badHabits": [
        {"habit": "Late night scrolling", "frequency": "daily", "impact": "high"},
        {"habit": "Skipping meals", "frequency": "often", "impact": "medium"},
        {"habit": "Impulse spending", "frequency": "weekly", "impact": "high"}
      ],
      "habitToStart": "Daily budgeting review",
      "habitToStop": "Late night phone scrolling"
    }'::jsonb,
    true, NOW()
  );

  -- 5. Values Assessment
  INSERT INTO workbook_progress (user_id, phase_number, worksheet_id, data, completed, completed_at)
  VALUES (
    test_user_id, 1, 'values',
    '{
      "coreValues": ["Growth", "Freedom", "Authenticity", "Connection", "Creativity"],
      "valueRankings": {
        "Growth": 1,
        "Freedom": 2,
        "Authenticity": 3,
        "Connection": 4,
        "Creativity": 5
      },
      "valueConflicts": "Freedom vs Financial Security - want to quit job but need income",
      "valueLivingScore": 6
    }'::jsonb,
    true, NOW()
  );

  -- 6. ABC Model
  INSERT INTO workbook_progress (user_id, phase_number, worksheet_id, data, completed, completed_at)
  VALUES (
    test_user_id, 1, 'abc-model',
    '{
      "situations": [
        {
          "activatingEvent": "Received criticism on my work project",
          "beliefs": "I am not good enough, I will never succeed",
          "consequences": "Felt anxious, avoided similar tasks",
          "dispute": "One criticism does not define my abilities",
          "newEffect": "Viewed feedback as growth opportunity"
        }
      ],
      "commonThinkingTraps": ["All-or-nothing thinking", "Catastrophizing", "Mind reading"]
    }'::jsonb,
    true, NOW()
  );

  -- 7. Strengths & Weaknesses
  INSERT INTO workbook_progress (user_id, phase_number, worksheet_id, data, completed, completed_at)
  VALUES (
    test_user_id, 1, 'strengths-weaknesses',
    '{
      "topStrengths": [
        {"strength": "Empathy", "evidence": "Friends come to me for advice"},
        {"strength": "Creativity", "evidence": "Generate innovative solutions at work"},
        {"strength": "Persistence", "evidence": "Completed marathon training despite setbacks"}
      ],
      "areasForGrowth": [
        {"area": "Financial literacy", "plan": "Take online course, read 1 book/month"},
        {"area": "Public speaking", "plan": "Join toastmasters, practice weekly"},
        {"area": "Time management", "plan": "Use time-blocking technique"}
      ]
    }'::jsonb,
    true, NOW()
  );

  -- 8. Comfort Zone
  INSERT INTO workbook_progress (user_id, phase_number, worksheet_id, data, completed, completed_at)
  VALUES (
    test_user_id, 1, 'comfort-zone',
    '{
      "comfortZone": ["Working alone", "Familiar routines", "Known social circles"],
      "stretchZone": ["Networking events", "Leading meetings", "Trying new hobbies"],
      "panicZone": ["Public speaking to large crowds", "Major career change", "Starting a business"],
      "nextStretch": "Attend one networking event this month",
      "comfortExpansionGoal": "Move public speaking from panic to stretch zone within 6 months"
    }'::jsonb,
    true, NOW()
  );

  -- 9. Know Yourself
  INSERT INTO workbook_progress (user_id, phase_number, worksheet_id, data, completed, completed_at)
  VALUES (
    test_user_id, 1, 'know-yourself',
    '{
      "personalityTraits": ["Introverted", "Intuitive", "Feeling", "Perceiving"],
      "learningStyle": "Visual and kinesthetic",
      "energizers": ["Nature walks", "Creative projects", "Deep conversations"],
      "drainers": ["Large crowds", "Routine tasks", "Conflict"],
      "idealDay": "Wake early, meditate, creative work in morning, exercise, meaningful connection, reading",
      "lifePhilosophy": "Growth through authenticity and continuous learning"
    }'::jsonb,
    true, NOW()
  );

  -- 10. Abilities Rating
  INSERT INTO workbook_progress (user_id, phase_number, worksheet_id, data, completed, completed_at)
  VALUES (
    test_user_id, 1, 'abilities-rating',
    '{
      "abilities": {
        "communication": 8,
        "leadership": 5,
        "problemSolving": 8,
        "creativity": 9,
        "technicalSkills": 7,
        "emotionalIntelligence": 8,
        "financialManagement": 3,
        "timeManagement": 5,
        "stressManagement": 6,
        "networking": 4
      },
      "topAbility": "Creativity",
      "abilityToImprove": "Financial management",
      "improvementPlan": "Take budgeting course, use tracking app, monthly review"
    }'::jsonb,
    true, NOW()
  );

  -- 11. Thought Awareness
  INSERT INTO workbook_progress (user_id, phase_number, worksheet_id, data, completed, completed_at)
  VALUES (
    test_user_id, 1, 'thought-awareness',
    '{
      "thoughtPatterns": [
        {
          "thought": "I will never be financially stable",
          "frequency": "daily",
          "emotion": "anxiety",
          "reframe": "I am learning and improving my financial skills every day"
        },
        {
          "thought": "I am not qualified enough for better opportunities",
          "frequency": "often",
          "emotion": "self-doubt",
          "reframe": "My unique experiences and skills have value"
        }
      ],
      "positiveMantras": [
        "I am worthy of abundance",
        "Every step forward is progress",
        "I trust my journey"
      ],
      "mindfulnessPractice": "5-minute breathing meditation each morning"
    }'::jsonb,
    true, NOW()
  );

  RAISE NOTICE 'Successfully created Phase 1 test data for user: %', test_user_id;
END $$;

-- =============================================================================
-- VERIFICATION QUERIES
-- =============================================================================

-- Check user exists and has correct tier
SELECT id, email, subscription_tier, subscription_status
FROM users
WHERE email = 'jimmy@agenticpersonnel.com';

-- Check Phase 1 worksheets (should be 11)
SELECT
  worksheet_id,
  completed,
  completed_at,
  jsonb_pretty(data) as data_preview
FROM workbook_progress
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'jimmy@agenticpersonnel.com')
  AND phase_number = 1
ORDER BY worksheet_id;

-- Verify Wheel of Life has low scores
SELECT
  data->>'career' as career,
  data->>'health' as health,
  data->>'finance' as finance,
  data->>'relationships' as relationships
FROM workbook_progress
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'jimmy@agenticpersonnel.com')
  AND worksheet_id = 'wheel-of-life';

-- Count total worksheets per phase
SELECT phase_number, COUNT(*) as worksheet_count
FROM workbook_progress
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'jimmy@agenticpersonnel.com')
GROUP BY phase_number
ORDER BY phase_number;
