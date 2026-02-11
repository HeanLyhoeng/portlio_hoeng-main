-- ============================================
-- SUPABASE STORAGE SETUP
-- ============================================
-- This migration creates the storage bucket and policies for project images
-- Run this in your Supabase SQL Editor: https://app.supabase.com > SQL Editor
-- 
-- NOTE: You can also create the bucket via the Supabase Dashboard:
-- Storage > Create Bucket > Name: "projects" > Public: Yes

-- ============================================
-- STEP 1: Create the storage bucket
-- ============================================
-- This creates a public bucket named "projects" for storing images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'projects',
  'projects',
  true, -- Public bucket (anyone can view)
  5242880, -- 5MB file size limit (adjust as needed)
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'video/mov']
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- STEP 2: Create Storage Policies
-- ============================================

-- Policy 1: Allow anyone to READ (view) files
-- This makes uploaded images publicly accessible
CREATE POLICY "Allow public read access"
ON storage.objects
FOR SELECT
USING (bucket_id = 'projects');

-- Policy 2: Allow anyone to INSERT (upload) files
-- This allows your upload form to work from the frontend
-- NOTE: In production, you might want to restrict this to authenticated users
CREATE POLICY "Allow public insert access"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'projects');

-- Optional: Policy 3 - Allow updates (if you want to replace files)
-- Uncomment if you need to update/replace uploaded files
-- CREATE POLICY "Allow public update access"
-- ON storage.objects
-- FOR UPDATE
-- USING (bucket_id = 'projects')
-- WITH CHECK (bucket_id = 'projects');

-- Optional: Policy 4 - Allow deletes (if you want to delete files)
-- Uncomment if you need to delete uploaded files
-- CREATE POLICY "Allow public delete access"
-- ON storage.objects
-- FOR DELETE
-- USING (bucket_id = 'projects');

-- ============================================
-- ALTERNATIVE: Create via Dashboard
-- ============================================
-- If you prefer using the UI:
-- 1. Go to Storage in Supabase Dashboard
-- 2. Click "New bucket"
-- 3. Name: "projects"
-- 4. Public: Toggle ON
-- 5. File size limit: 5MB (or your preference)
-- 6. Allowed MIME types: image/*, video/*
-- 7. Then run only the policy SQL above

-- ============================================
-- VERIFICATION
-- ============================================
-- After running this migration, verify:
-- 1. Bucket exists: Check Storage > Buckets
-- 2. Policies exist: Check Storage > Buckets > projects > Policies
-- 3. Test upload: Try uploading a file via your frontend
