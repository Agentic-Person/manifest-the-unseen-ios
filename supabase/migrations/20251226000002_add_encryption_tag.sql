-- H6 Security Fix: Add encryption_tag column for AES-GCM authentication
-- This was missed in the initial encryption migration

-- Add encryption tag column (authentication tag for AES-GCM integrity verification)
ALTER TABLE journal_entries
ADD COLUMN IF NOT EXISTS encryption_tag TEXT;

-- Add comment for documentation
COMMENT ON COLUMN journal_entries.encryption_tag IS 'Authentication tag for AES-GCM (base64 encoded) - required for decryption';
