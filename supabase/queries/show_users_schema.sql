-- ============================================
-- SHOW USERS TABLE SCHEMA
-- ============================================
-- Run this in your Supabase SQL Editor to see the structure of the 'users' table

-- Method 1: Get column information
SELECT 
    column_name,
    data_type,
    character_maximum_length,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'auth' 
  AND table_name = 'users'
ORDER BY ordinal_position;

-- Method 2: Get detailed table structure with constraints
SELECT 
    t.table_name,
    c.column_name,
    c.data_type,
    c.character_maximum_length,
    c.is_nullable,
    c.column_default,
    tc.constraint_type,
    kcu.constraint_name
FROM information_schema.tables t
JOIN information_schema.columns c ON t.table_name = c.table_name
LEFT JOIN information_schema.key_column_usage kcu 
    ON c.table_name = kcu.table_name 
    AND c.column_name = kcu.column_name
LEFT JOIN information_schema.table_constraints tc 
    ON kcu.constraint_name = tc.constraint_name
WHERE t.table_schema = 'auth' 
  AND t.table_name = 'users'
ORDER BY c.ordinal_position;

-- Method 3: Simple describe (PostgreSQL)
\d auth.users
