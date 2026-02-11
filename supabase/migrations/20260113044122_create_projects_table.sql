-- ============================================
-- SUPABASE DATABASE SETUP
-- ============================================
-- This migration creates the projects table with proper schema and security
-- Run this in your Supabase SQL Editor: https://app.supabase.com > SQL Editor

-- ============================================
-- STEP 1: Create the projects table
-- ============================================
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  video_url TEXT,
  image_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- STEP 2: Enable Row Level Security (RLS)
-- ============================================
-- RLS ensures that all database operations go through policies
-- Without RLS, anyone with the anon key could do anything!
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 3: Create RLS Policies
-- ============================================

-- Policy 1: Allow anyone to READ (SELECT) projects
-- This makes your portfolio publicly viewable
CREATE POLICY "Allow public read access"
ON public.projects
FOR SELECT
USING (true);

-- Policy 2: Allow anyone to INSERT new projects
-- This allows your upload form to work from the frontend
-- NOTE: In production, you might want to restrict this to authenticated users
CREATE POLICY "Allow public insert access"
ON public.projects
FOR INSERT
WITH CHECK (true);

-- Optional: Policy 3 - Allow updates (if you want to edit projects later)
-- Uncomment if you need update functionality
-- CREATE POLICY "Allow public update access"
-- ON public.projects
-- FOR UPDATE
-- USING (true)
-- WITH CHECK (true);

-- Optional: Policy 4 - Allow deletes (if you want to delete projects)
-- Uncomment if you need delete functionality
-- CREATE POLICY "Allow public delete access"
-- ON public.projects
-- FOR DELETE
-- USING (true);

-- ============================================
-- STEP 4: Create an index for better query performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON public.projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects(category);

-- ============================================
-- VERIFICATION
-- ============================================
-- After running this migration, verify:
-- 1. Table exists: SELECT * FROM public.projects;
-- 2. RLS is enabled: Check in Table Editor > Settings
-- 3. Policies exist: Check in Authentication > Policies
