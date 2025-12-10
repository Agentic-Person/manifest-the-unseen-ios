-- Guru Sessions Migration
-- Migration: 20251209000000_guru_sessions.sql
-- Description: Adds Guru feature tables and columns for phase-specific AI analysis

-- =============================================================================
-- GURU SESSIONS TABLE
-- Tracks guru sessions per phase for Enlightenment tier users
-- =============================================================================

CREATE TABLE guru_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  conversation_id UUID REFERENCES ai_conversations(id) ON DELETE CASCADE,
  phase_number INTEGER NOT NULL CHECK (phase_number >= 1 AND phase_number <= 10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for guru_sessions
CREATE INDEX idx_guru_sessions_user ON guru_sessions(user_id);
CREATE INDEX idx_guru_sessions_phase ON guru_sessions(user_id, phase_number);
CREATE INDEX idx_guru_sessions_conversation ON guru_sessions(conversation_id);

COMMENT ON TABLE guru_sessions IS 'Tracks Guru analysis sessions for completed phases (Enlightenment tier only)';
COMMENT ON COLUMN guru_sessions.phase_number IS 'Phase number analyzed (1-10)';
COMMENT ON COLUMN guru_sessions.conversation_id IS 'Reference to the AI conversation for this session';

-- =============================================================================
-- EXTEND AI_CONVERSATIONS TABLE
-- Add columns to track conversation type and Guru phase context
-- =============================================================================

ALTER TABLE ai_conversations
ADD COLUMN IF NOT EXISTS conversation_type TEXT DEFAULT 'general',
ADD COLUMN IF NOT EXISTS guru_phase INTEGER DEFAULT NULL;

-- Create index for Guru conversations
CREATE INDEX idx_conversations_guru ON ai_conversations(user_id, conversation_type, guru_phase)
  WHERE conversation_type = 'guru';

COMMENT ON COLUMN ai_conversations.conversation_type IS 'Conversation type: "general" for regular chat, "guru" for phase analysis';
COMMENT ON COLUMN ai_conversations.guru_phase IS 'Phase number for Guru conversations (null for general chat)';

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

-- Enable RLS on guru_sessions table
ALTER TABLE guru_sessions ENABLE ROW LEVEL SECURITY;

-- Users can view their own guru sessions
CREATE POLICY "Users can view own guru sessions" ON guru_sessions
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own guru sessions
CREATE POLICY "Users can insert own guru sessions" ON guru_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own guru sessions
CREATE POLICY "Users can update own guru sessions" ON guru_sessions
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own guru sessions
CREATE POLICY "Users can delete own guru sessions" ON guru_sessions
  FOR DELETE USING (auth.uid() = user_id);

-- =============================================================================
-- MIGRATION COMPLETE
-- =============================================================================

COMMENT ON COLUMN guru_sessions.id IS 'Guru Sessions feature added - Premium Enlightenment tier feature for phase completion analysis';
