-- Migration: Add images column to journal_entries
-- Created: 2025-11-27
-- Feature: Voice Journal MVP

-- Add images array column to journal_entries
ALTER TABLE journal_entries
ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';

-- Create storage bucket for journal images (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('journal-images', 'journal-images', false)
ON CONFLICT (id) DO NOTHING;

-- RLS Policy: Users can upload to their own folder
CREATE POLICY "Users upload own journal images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'journal-images'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- RLS Policy: Users can view their own images
CREATE POLICY "Users view own journal images"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'journal-images'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- RLS Policy: Users can delete their own images
CREATE POLICY "Users delete own journal images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'journal-images'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- RLS Policy: Users can update their own images
CREATE POLICY "Users update own journal images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'journal-images'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
