-- Manifest the Unseen - Initial Database Schema
-- Migration: 20250101000000_initial_schema.sql
-- Description: Creates initial tables, RLS policies, triggers, and functions

-- =============================================================================
-- EXTENSIONS
-- =============================================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable vector extension for AI embeddings
CREATE EXTENSION IF NOT EXISTS "vector";

-- =============================================================================
-- CUSTOM TYPES
-- =============================================================================

-- Subscription tier enumeration
CREATE TYPE subscription_tier AS ENUM ('novice', 'awakening', 'enlightenment');

-- Subscription status enumeration
CREATE TYPE subscription_status AS ENUM ('none', 'trialing', 'active', 'canceled', 'expired');

-- Meditation narrator gender
CREATE TYPE narrator_gender AS ENUM ('male', 'female');

-- =============================================================================
-- TABLES
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Users Table
-- Extends Supabase auth.users with app-specific profile data
-- -----------------------------------------------------------------------------
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  subscription_tier subscription_tier DEFAULT 'novice',
  subscription_status subscription_status DEFAULT 'none',
  subscription_expires_at TIMESTAMP WITH TIME ZONE,
  trial_end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for users table
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_subscription_tier ON users(subscription_tier);
CREATE INDEX idx_users_subscription_status ON users(subscription_status);

COMMENT ON TABLE users IS 'User profiles synced with Supabase Auth';
COMMENT ON COLUMN users.subscription_tier IS 'Current subscription tier: novice, awakening, or enlightenment';
COMMENT ON COLUMN users.subscription_status IS 'Current subscription status';
COMMENT ON COLUMN users.trial_end_date IS '7-day trial end date (set on first login)';

-- -----------------------------------------------------------------------------
-- Workbook Progress Table
-- Stores user progress through the 10-phase workbook
-- -----------------------------------------------------------------------------
CREATE TABLE workbook_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  phase_number INTEGER NOT NULL CHECK (phase_number >= 1 AND phase_number <= 10),
  worksheet_id TEXT NOT NULL,
  data JSONB NOT NULL DEFAULT '{}',
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, phase_number, worksheet_id)
);

-- Create indexes for workbook_progress
CREATE INDEX idx_workbook_user ON workbook_progress(user_id);
CREATE INDEX idx_workbook_phase ON workbook_progress(user_id, phase_number);
CREATE INDEX idx_workbook_completed ON workbook_progress(user_id, completed);

COMMENT ON TABLE workbook_progress IS 'User progress through workbook phases and worksheets';
COMMENT ON COLUMN workbook_progress.data IS 'JSONB field storing flexible worksheet data (form responses, notes, etc.)';
COMMENT ON COLUMN workbook_progress.phase_number IS 'Phase number (1-10)';
COMMENT ON COLUMN workbook_progress.worksheet_id IS 'Unique identifier for worksheet within a phase';

-- -----------------------------------------------------------------------------
-- Journal Entries Table
-- Voice and text journal entries with full-text search
-- -----------------------------------------------------------------------------
CREATE TABLE journal_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  encrypted_content TEXT,
  tags TEXT[] DEFAULT '{}',
  mood TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for journal_entries
CREATE INDEX idx_journal_user ON journal_entries(user_id);
CREATE INDEX idx_journal_date ON journal_entries(user_id, created_at DESC);
CREATE INDEX idx_journal_tags ON journal_entries USING GIN(tags);

-- Add full-text search column and index
ALTER TABLE journal_entries ADD COLUMN content_search tsvector
  GENERATED ALWAYS AS (to_tsvector('english', content)) STORED;
CREATE INDEX idx_journal_search ON journal_entries USING GIN(content_search);

COMMENT ON TABLE journal_entries IS 'User journal entries (voice transcribed to text)';
COMMENT ON COLUMN journal_entries.encrypted_content IS 'Encrypted version of content for privacy';
COMMENT ON COLUMN journal_entries.content_search IS 'Full-text search vector for content';

-- -----------------------------------------------------------------------------
-- Meditations Table
-- Guided meditation library (publicly readable)
-- -----------------------------------------------------------------------------
CREATE TABLE meditations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  duration_seconds INTEGER NOT NULL,
  audio_url TEXT NOT NULL,
  narrator_gender narrator_gender NOT NULL,
  tier_required subscription_tier DEFAULT 'novice',
  tags TEXT[] DEFAULT '{}',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for meditations
CREATE INDEX idx_meditation_tier ON meditations(tier_required);
CREATE INDEX idx_meditation_order ON meditations(order_index);

COMMENT ON TABLE meditations IS 'Guided meditation library with tier-based access control';
COMMENT ON COLUMN meditations.tier_required IS 'Minimum subscription tier required to access this meditation';
COMMENT ON COLUMN meditations.order_index IS 'Display order in meditation library';

-- -----------------------------------------------------------------------------
-- Meditation Sessions Table
-- Tracks user meditation practice
-- -----------------------------------------------------------------------------
CREATE TABLE meditation_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  meditation_id UUID NOT NULL REFERENCES meditations(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  duration_seconds INTEGER,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for meditation_sessions
CREATE INDEX idx_sessions_user ON meditation_sessions(user_id);
CREATE INDEX idx_sessions_meditation ON meditation_sessions(meditation_id);
CREATE INDEX idx_sessions_date ON meditation_sessions(user_id, created_at DESC);
CREATE INDEX idx_sessions_completed ON meditation_sessions(user_id, completed);

COMMENT ON TABLE meditation_sessions IS 'User meditation practice tracking';
COMMENT ON COLUMN meditation_sessions.duration_seconds IS 'Actual meditation duration (may differ from meditation.duration_seconds)';

-- -----------------------------------------------------------------------------
-- AI Conversations Table
-- Stores chat history with AI monk companion
-- -----------------------------------------------------------------------------
CREATE TABLE ai_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT,
  messages JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for ai_conversations
CREATE INDEX idx_conversations_user ON ai_conversations(user_id);
CREATE INDEX idx_conversations_date ON ai_conversations(user_id, updated_at DESC);

COMMENT ON TABLE ai_conversations IS 'AI monk chat conversations';
COMMENT ON COLUMN ai_conversations.messages IS 'Array of message objects: [{role: "user"|"assistant", content: string, timestamp: number}]';

-- -----------------------------------------------------------------------------
-- Vision Boards Table
-- User-created vision boards for manifestation
-- -----------------------------------------------------------------------------
CREATE TABLE vision_boards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  images JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for vision_boards
CREATE INDEX idx_vision_boards_user ON vision_boards(user_id);
CREATE INDEX idx_vision_boards_date ON vision_boards(user_id, created_at DESC);

COMMENT ON TABLE vision_boards IS 'User vision boards for manifestation';
COMMENT ON COLUMN vision_boards.images IS 'Array of image objects: [{url: string, caption: string, position: {x: number, y: number}}]';

-- -----------------------------------------------------------------------------
-- Knowledge Embeddings Table
-- AI knowledge base with vector embeddings for RAG
-- -----------------------------------------------------------------------------
CREATE TABLE knowledge_embeddings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content TEXT NOT NULL,
  embedding vector(1536),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create vector similarity search index
CREATE INDEX idx_embeddings_vector ON knowledge_embeddings
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

COMMENT ON TABLE knowledge_embeddings IS 'AI knowledge base with vector embeddings for RAG (Retrieval Augmented Generation)';
COMMENT ON COLUMN knowledge_embeddings.embedding IS 'OpenAI text-embedding-3-small vector (1536 dimensions)';
COMMENT ON COLUMN knowledge_embeddings.metadata IS 'Source information: {source: string, page: number, chapter: string, author: string}';

-- =============================================================================
-- FUNCTIONS
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Function: update_updated_at_column
-- Automatically updates the updated_at timestamp
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION update_updated_at_column IS 'Trigger function to automatically update updated_at timestamp';

-- -----------------------------------------------------------------------------
-- Function: match_knowledge
-- Vector similarity search for RAG
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION match_knowledge(
  query_embedding vector(1536),
  match_threshold FLOAT,
  match_count INT
)
RETURNS TABLE (
  id UUID,
  content TEXT,
  metadata JSONB,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    knowledge_embeddings.id,
    knowledge_embeddings.content,
    knowledge_embeddings.metadata,
    1 - (knowledge_embeddings.embedding <=> query_embedding) AS similarity
  FROM knowledge_embeddings
  WHERE 1 - (knowledge_embeddings.embedding <=> query_embedding) > match_threshold
  ORDER BY knowledge_embeddings.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

COMMENT ON FUNCTION match_knowledge IS 'Performs vector similarity search for RAG context retrieval';

-- =============================================================================
-- TRIGGERS
-- =============================================================================

-- Trigger for users.updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for workbook_progress.updated_at
CREATE TRIGGER update_workbook_updated_at BEFORE UPDATE ON workbook_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for journal_entries.updated_at
CREATE TRIGGER update_journal_updated_at BEFORE UPDATE ON journal_entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for ai_conversations.updated_at
CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON ai_conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for vision_boards.updated_at
CREATE TRIGGER update_vision_boards_updated_at BEFORE UPDATE ON vision_boards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

-- Enable RLS on all user-facing tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE workbook_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE meditation_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE vision_boards ENABLE ROW LEVEL SECURITY;
-- Note: meditations and knowledge_embeddings are public read, no RLS needed

-- -----------------------------------------------------------------------------
-- Users Table Policies
-- -----------------------------------------------------------------------------
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- -----------------------------------------------------------------------------
-- Workbook Progress Policies
-- -----------------------------------------------------------------------------
CREATE POLICY "Users can view own workbook" ON workbook_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own workbook" ON workbook_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own workbook" ON workbook_progress
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own workbook" ON workbook_progress
  FOR DELETE USING (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- Journal Entries Policies
-- -----------------------------------------------------------------------------
CREATE POLICY "Users can view own journals" ON journal_entries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own journals" ON journal_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own journals" ON journal_entries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own journals" ON journal_entries
  FOR DELETE USING (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- Meditation Sessions Policies
-- -----------------------------------------------------------------------------
CREATE POLICY "Users can view own meditation sessions" ON meditation_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own meditation sessions" ON meditation_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own meditation sessions" ON meditation_sessions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own meditation sessions" ON meditation_sessions
  FOR DELETE USING (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- AI Conversations Policies
-- -----------------------------------------------------------------------------
CREATE POLICY "Users can view own conversations" ON ai_conversations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own conversations" ON ai_conversations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own conversations" ON ai_conversations
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own conversations" ON ai_conversations
  FOR DELETE USING (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- Vision Boards Policies
-- -----------------------------------------------------------------------------
CREATE POLICY "Users can view own vision boards" ON vision_boards
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own vision boards" ON vision_boards
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own vision boards" ON vision_boards
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own vision boards" ON vision_boards
  FOR DELETE USING (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- Meditations Table Policies (Public Read)
-- -----------------------------------------------------------------------------
-- Meditations are publicly readable (tier gating happens in app logic)
CREATE POLICY "Anyone can view meditations" ON meditations
  FOR SELECT USING (true);

-- Only authenticated users via service role can manage meditations
-- (This will be done via admin functions or direct database access)

-- =============================================================================
-- INITIAL DATA SEEDING
-- =============================================================================

-- This will be populated in a separate seed.sql file
-- Placeholder comment for future meditation content and knowledge embeddings

-- =============================================================================
-- MIGRATION COMPLETE
-- =============================================================================

COMMENT ON SCHEMA public IS 'Manifest the Unseen - Initial schema with RLS, triggers, and vector search';
