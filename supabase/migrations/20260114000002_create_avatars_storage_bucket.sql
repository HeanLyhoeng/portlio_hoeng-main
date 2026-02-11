-- ============================================
-- CREATE AVATARS STORAGE BUCKET
-- ============================================
-- This migration creates a storage bucket named 'avatars' for user profile pictures
-- Run this in your Supabase SQL Editor: https://app.supabase.com > SQL Editor

-- ============================================
-- STEP 1: Create the storage bucket
-- ============================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true, -- Public bucket (anyone can view avatars)
  5242880, -- 5MB file size limit (adjust as needed)
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- STEP 2: Create Storage Policies
-- ============================================

-- Policy 1: Allow anyone to READ (view) files
CREATE POLICY "Allow public read access for avatars"
ON storage.objects
FOR SELECT
USING (bucket_id = 'avatars');

-- Policy 2: Allow anyone to INSERT (upload) files
-- NOTE: In production, you might want to restrict this to authenticated users
CREATE POLICY "Allow public insert access for avatars"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'avatars');

-- Policy 3: Allow updates (if you want to replace files)
CREATE POLICY "Allow public update access for avatars"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'avatars')
WITH CHECK (bucket_id = 'avatars');

-- Policy 4: Allow deletes (if you want to delete files)
CREATE POLICY "Allow public delete access for avatars"
ON storage.objects
FOR DELETE
USING (bucket_id = 'avatars');

-- ============================================
-- VERIFICATION
-- ============================================
-- After running this migration, verify:
-- 1. Bucket exists: Check Storage > Buckets in Supabase Dashboard
-- 2. Policies exist: Check Storage > Buckets > avatars > Policies
