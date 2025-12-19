-- Migration: Create prayers table for Guru AI Enhancement
-- Date: 2025-12-17
-- Description: Creates prayers table with life_areas tagging for dynamic recommendations

-- =============================================================================
-- PRAYERS TABLE
-- =============================================================================

CREATE TABLE prayers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  duration_seconds INTEGER DEFAULT 60,
  tier_required subscription_tier DEFAULT 'novice',
  life_areas TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for efficient queries
CREATE INDEX idx_prayers_life_areas ON prayers USING GIN(life_areas);
CREATE INDEX idx_prayers_tier ON prayers(tier_required);
CREATE INDEX idx_prayers_order ON prayers(order_index);

-- Enable Row Level Security
ALTER TABLE prayers ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Anyone can view prayers (read-only content)
CREATE POLICY "Anyone can view prayers" ON prayers FOR SELECT USING (true);

COMMENT ON TABLE prayers IS 'Prayer library with life area tagging for smart recommendations';
COMMENT ON COLUMN prayers.life_areas IS 'Life areas this prayer addresses: career, health, relationships, finance, personalGrowth, family, recreation, spirituality';
COMMENT ON COLUMN prayers.tier_required IS 'Minimum subscription tier required to access this prayer';
COMMENT ON COLUMN prayers.duration_seconds IS 'Estimated reading/prayer duration in seconds';

-- =============================================================================
-- SEED DATA: Initial Prayers
-- =============================================================================

INSERT INTO prayers (title, description, content, duration_seconds, tier_required, life_areas, tags, order_index) VALUES
(
  'Prayer for Career Success',
  'A prayer to align with your highest professional purpose and attract career opportunities',
  E'Divine Source, I call upon the infinite wisdom within me.\n\nI affirm that I am aligned with my highest professional purpose. I attract opportunities that honor my skills, talents, and values. My career path unfolds with clarity and purpose.\n\nI release all limiting beliefs about my worthiness of success. I am deserving of abundance, recognition, and fulfilling work.\n\nI trust that the universe conspires to support my highest good. The right opportunities, connections, and resources flow to me effortlessly.\n\nI am confident, capable, and ready to receive the blessings of meaningful work.\n\nAnd so it is.',
  90,
  'novice',
  ARRAY['career', 'personalGrowth'],
  ARRAY['success', 'manifestation', 'purpose'],
  1
),
(
  'Prayer for Financial Abundance',
  'Open yourself to receiving wealth and prosperity in all forms',
  E'Source of All Abundance, I acknowledge the infinite prosperity of the universe.\n\nI release all scarcity mindset and welcome wealth into my life. Money flows to me easily and frequently from expected and unexpected sources.\n\nI am a magnet for financial opportunities. I manage money wisely and it multiplies in my hands. My income exceeds my expenses, and I always have more than enough.\n\nI am grateful for the abundance I have and the abundance that is coming to me now. I use my wealth to create positive impact in my life and the lives of others.\n\nI trust in the universe''s ability to provide for all my needs and desires.\n\nThank you, thank you, thank you.\n\nAnd so it is.',
  120,
  'novice',
  ARRAY['finance', 'career'],
  ARRAY['abundance', 'prosperity', 'wealth'],
  2
),
(
  'Prayer for Healing',
  'Request divine healing for body, mind, and spirit',
  E'Divine Healer, I call upon your infinite healing power.\n\nI affirm that my body knows how to heal itself. Every cell in my body vibrates with perfect health and vitality. I release all dis-ease, pain, and suffering.\n\nI forgive myself and others for any harm, real or perceived. I release all emotional wounds that no longer serve my highest good.\n\nMy mind is clear, peaceful, and aligned with wellness. My spirit is strong and connected to Source.\n\nI am whole, I am healed, I am restored to perfect health in body, mind, and spirit.\n\nI give thanks for the healing that is taking place within me now.\n\nAnd so it is.',
  100,
  'awakening',
  ARRAY['health', 'spirituality'],
  ARRAY['healing', 'wellness', 'restoration'],
  3
),
(
  'Prayer for Loving Relationships',
  'Attract and nurture meaningful, loving connections',
  E'Divine Love, I open my heart to give and receive love freely.\n\nI attract relationships that are healthy, supportive, and aligned with my highest good. I am surrounded by people who see me, value me, and celebrate me.\n\nI release all patterns of codependency, people-pleasing, and fear-based connection. I stand in my authentic truth and attract those who love me as I am.\n\nMy relationships are mirrors reflecting my own growth and self-love. I communicate with compassion, listen with presence, and honor boundaries with grace.\n\nI am worthy of deep, meaningful love. I give love freely and receive love abundantly.\n\nThank you for the beautiful souls who walk beside me on this journey.\n\nAnd so it is.',
  110,
  'novice',
  ARRAY['relationships', 'family'],
  ARRAY['love', 'connection', 'harmony'],
  4
),
(
  'Prayer for Letting Go of Fear',
  'Release fear and step into courage and trust',
  E'Infinite Source of Courage, I call upon your strength within me.\n\nI acknowledge my fears without judgment. I see them, I honor them, and I release them. Fear does not control me; it informs me and then I let it go.\n\nI am safe. I am protected. I am guided by a wisdom greater than my understanding. I trust the journey even when I cannot see the destination.\n\nI release the need to control outcomes. I surrender my worries to the universe and trust that all is unfolding for my highest good.\n\nI am brave. I am resilient. I step forward with faith, knowing that the universe supports my every step.\n\nI choose love over fear. I choose trust over doubt. I choose peace over anxiety.\n\nAnd so it is.',
  115,
  'awakening',
  ARRAY['personalGrowth', 'spirituality'],
  ARRAY['courage', 'trust', 'surrender'],
  5
),
(
  'Prayer for Inner Peace',
  'Find stillness, calm, and serenity within',
  E'Divine Peace, I invite your presence into this moment.\n\nI release all chaos, stress, and overwhelm. I let go of the need to be anywhere but here, to do anything but breathe, to be anyone but myself.\n\nIn this moment, I am enough. I am complete. I am whole. Peace flows through me like a gentle river, washing away all tension and worry.\n\nMy mind is calm, my heart is open, my spirit is free. I rest in the stillness of my own being, knowing that all is well.\n\nI am grounded in the present moment. I trust the rhythm of life. I surrender to the flow of existence.\n\nPeace is my natural state. I choose peace. I embody peace. I radiate peace.\n\nAnd so it is.',
  95,
  'novice',
  ARRAY['spirituality', 'health', 'recreation'],
  ARRAY['peace', 'calm', 'serenity', 'mindfulness'],
  6
);

-- =============================================================================
-- VERIFICATION QUERY
-- =============================================================================
-- Uncomment to test after migration:
-- SELECT * FROM prayers WHERE life_areas && ARRAY['finance', 'career'];
