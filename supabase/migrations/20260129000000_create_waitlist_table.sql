-- Create waitlist table for landing page signups
CREATE TABLE waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  source TEXT DEFAULT 'hero_section',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for email lookups
CREATE INDEX idx_waitlist_email ON waitlist(email);

-- Add index for analytics queries
CREATE INDEX idx_waitlist_created_at ON waitlist(created_at);

-- Enable Row Level Security
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Allow public inserts (unauthenticated landing page visitors)
CREATE POLICY "Anyone can join waitlist"
  ON waitlist
  FOR INSERT
  WITH CHECK (true);

-- Only allow service role to read waitlist (admin access)
CREATE POLICY "Service role can read waitlist"
  ON waitlist
  FOR SELECT
  USING (auth.role() = 'service_role');

COMMENT ON TABLE waitlist IS 'Email waitlist for early access signups from landing page';
COMMENT ON COLUMN waitlist.source IS 'Where the signup came from (e.g., hero_section, pricing_section)';
