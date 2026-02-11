-- ============================================
-- CREATE PRODUCTS TABLE
-- ============================================
-- This migration creates the products table with columns: id, name, price, and created_at
-- Run this in your Supabase SQL Editor: https://app.supabase.com > SQL Editor

-- ============================================
-- STEP 1: Create the products table
-- ============================================
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- STEP 2: Enable Row Level Security (RLS)
-- ============================================
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 3: Create RLS Policies
-- ============================================

-- Policy 1: Allow anyone to READ (SELECT) products
CREATE POLICY "Allow public read access"
ON public.products
FOR SELECT
USING (true);

-- Policy 2: Allow anyone to INSERT new products
-- NOTE: In production, you might want to restrict this to authenticated users
CREATE POLICY "Allow public insert access"
ON public.products
FOR INSERT
WITH CHECK (true);

-- Policy 3: Allow updates (optional)
CREATE POLICY "Allow public update access"
ON public.products
FOR UPDATE
USING (true)
WITH CHECK (true);

-- Policy 4: Allow deletes (optional)
CREATE POLICY "Allow public delete access"
ON public.products
FOR DELETE
USING (true);

-- ============================================
-- STEP 4: Create indexes for better query performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_name ON public.products(name);

-- ============================================
-- VERIFICATION
-- ============================================
-- After running this migration, verify:
-- SELECT * FROM public.products;
