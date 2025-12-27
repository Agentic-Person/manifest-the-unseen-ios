-- H6 Security Fix: Add encryption metadata columns for journal entries
-- This migration adds support for AES-256-GCM client-side encryption

-- Add encryption IV column (initialization vector for AES-GCM)
ALTER TABLE journal_entries
ADD COLUMN IF NOT EXISTS encryption_iv TEXT;

-- Add encryption tag column (authentication tag for AES-GCM)
ALTER TABLE journal_entries
ADD COLUMN IF NOT EXISTS encryption_tag TEXT;

-- Add encryption version column (for future algorithm upgrades)
ALTER TABLE journal_entries
ADD COLUMN IF NOT EXISTS encryption_version INTEGER DEFAULT NULL;

-- Add comments for documentation
COMMENT ON COLUMN journal_entries.encrypted_content IS 'AES-256-GCM encrypted content (base64 encoded)';
COMMENT ON COLUMN journal_entries.encryption_iv IS 'Initialization vector for AES-GCM (base64 encoded)';
COMMENT ON COLUMN journal_entries.encryption_tag IS 'Authentication tag for AES-GCM (base64 encoded)';
COMMENT ON COLUMN journal_entries.encryption_version IS 'Encryption algorithm version: 1=AES-256-GCM';

-- Create partial index for finding unencrypted entries (useful for migration)
-- This index only includes entries that have plaintext content but no encrypted version
CREATE INDEX IF NOT EXISTS idx_journal_unencrypted
ON journal_entries(id)
WHERE encrypted_content IS NULL AND content IS NOT NULL AND content != '' AND content != '[encrypted]';

-- Note: The encrypted_content column already exists from initial_schema.sql
-- This migration only adds the IV and version metadata columns
