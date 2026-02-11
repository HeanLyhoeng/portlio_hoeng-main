-- ============================================
-- CREATE IMAGES STORAGE BUCKET
-- ============================================
-- This migration creates a public storage bucket named 'images'
-- Run this in your Supabase SQL Editor: https://app.supabase.com > SQL Editor

-- ============================================
-- STEP 1: Create the storage bucket
-- ============================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'images',
  'images',
  true, -- Public bucket (anyone can view)
  10485760, -- 10MB file size limit (adjust as needed)
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- STEP 2: Create Storage Policies
-- ============================================

-- Policy 1: Allow anyone to READ (view) files
CREATE POLICY "Allow public read access for images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'images');

-- Policy 2: Allow anyone to INSERT (upload) files
-- NOTE: In production, you might want to restrict this to authenticated users
CREATE POLICY "Allow public insert access for images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'images');

-- Policy 3: Allow updates (if you want to replace files)
CREATE POLICY "Allow public update access for images"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'images')
WITH CHECK (bucket_id = 'images');

-- Policy 4: Allow deletes (if you want to delete files)
CREATE POLICY "Allow public delete access for images"
ON storage.objects
FOR DELETE
USING (bucket_id = 'images');

-- ============================================
-- VERIFICATION
-- ============================================
-- After running this migration, verify:
-- 1. Bucket exists: Check Storage > Buckets in Supabase Dashboard
-- 2. Policies exist: Check Storage > Buckets > images > Policies
