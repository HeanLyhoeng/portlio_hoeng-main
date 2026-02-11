# 📝 Supabase SQL Reference

Quick reference for all SQL snippets needed to set up your Supabase backend.

---

## 🗄️ Database Setup

### Create Projects Table

```sql
-- Create the projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  video_url TEXT,
  image_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access"
ON public.projects
FOR SELECT
USING (true);

-- Allow public insert access
CREATE POLICY "Allow public insert access"
ON public.projects
FOR INSERT
WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON public.projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects(category);
```

---

## 📦 Storage Setup

### Create Storage Bucket

```sql
-- Create the storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'projects',
  'projects',
  true, -- Public bucket
  5242880, -- 5MB file size limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'video/mov']
)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access
CREATE POLICY "Allow public read access"
ON storage.objects
FOR SELECT
USING (bucket_id = 'projects');

-- Allow public insert access
CREATE POLICY "Allow public insert access"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'projects');
```

---

## 🔍 Useful Queries

### View All Projects

```sql
SELECT * FROM public.projects 
ORDER BY created_at DESC;
```

### Count Projects by Category

```sql
SELECT category, COUNT(*) as count 
FROM public.projects 
GROUP BY category 
ORDER BY count DESC;
```

### Get Recent Projects (Last 10)

```sql
SELECT id, title, category, image_url, created_at 
FROM public.projects 
ORDER BY created_at DESC 
LIMIT 10;
```

### Delete a Project (if you add DELETE policy)

```sql
DELETE FROM public.projects 
WHERE id = 'your-project-id-here';
```

### View Storage Files

```sql
SELECT name, id, created_at, metadata 
FROM storage.objects 
WHERE bucket_id = 'projects' 
ORDER BY created_at DESC;
```

---

## 🛡️ Security Policies Reference

### Table Policies (RLS)

| Policy Name | Operation | Condition | Purpose |
|------------|-----------|-----------|---------|
| `Allow public read access` | SELECT | `USING (true)` | Anyone can view projects |
| `Allow public insert access` | INSERT | `WITH CHECK (true)` | Anyone can add projects |

### Storage Policies

| Policy Name | Operation | Condition | Purpose |
|------------|-----------|-----------|---------|
| `Allow public read access` | SELECT | `bucket_id = 'projects'` | Anyone can view images |
| `Allow public insert access` | INSERT | `bucket_id = 'projects'` | Anyone can upload images |

---

## 🔧 Advanced: Add Update/Delete Policies (Optional)

### Allow Updates

```sql
CREATE POLICY "Allow public update access"
ON public.projects
FOR UPDATE
USING (true)
WITH CHECK (true);
```

### Allow Deletes

```sql
CREATE POLICY "Allow public delete access"
ON public.projects
FOR DELETE
USING (true);
```

**⚠️ Warning**: Only add these if you need update/delete functionality. For production, consider requiring authentication instead of `USING (true)`.

---

## 📊 Schema Reference

### Projects Table Schema

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT `gen_random_uuid()` | Unique identifier |
| `title` | TEXT | NOT NULL | Project title |
| `category` | TEXT | NOT NULL | Project category |
| `video_url` | TEXT | NULLABLE | Optional video URL |
| `image_url` | TEXT | NOT NULL | Image URL (from storage or external) |
| `created_at` | TIMESTAMPTZ | DEFAULT `NOW()` | Creation timestamp |

---

## 🚨 Troubleshooting Queries

### Check if RLS is Enabled

```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'projects';
```

Expected: `rowsecurity = true`

### List All Policies on Projects Table

```sql
SELECT * FROM pg_policies 
WHERE tablename = 'projects';
```

### Check Storage Bucket Exists

```sql
SELECT * FROM storage.buckets 
WHERE id = 'projects';
```

### List Storage Policies

```sql
SELECT * FROM pg_policies 
WHERE tablename = 'objects' 
AND policyname LIKE '%projects%';
```

---

## 📚 Additional Resources

- [Supabase SQL Editor](https://app.supabase.com/project/_/sql)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Supabase RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)

---

**💡 Tip**: Save these queries in your Supabase SQL Editor as "Saved Queries" for quick access!
