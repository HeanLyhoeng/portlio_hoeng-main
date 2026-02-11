# 🚀 Supabase Setup Guide for Portfolio Website

Complete step-by-step guide to migrate from Firebase to Supabase for your React + Vite portfolio website.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Step 1: Create Supabase Account](#step-1-create-supabase-account)
3. [Step 2: Install Dependencies](#step-2-install-dependencies)
4. [Step 3: Configure Environment Variables](#step-3-configure-environment-variables)
5. [Step 4: Set Up Database](#step-4-set-up-database)
6. [Step 5: Set Up Storage](#step-5-set-up-storage)
7. [Step 6: Verify Setup](#step-6-verify-setup)
8. [Security Best Practices](#security-best-practices)
9. [Troubleshooting](#troubleshooting)
10. [Folder Structure](#folder-structure)

---

## Prerequisites

- ✅ Node.js and npm installed
- ✅ React + Vite project set up
- ✅ Basic understanding of SQL (optional, we provide all SQL)

---

## Step 1: Create Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Click **"Start your project"** or **"Sign up"**
3. Sign up with GitHub, Google, or email (free)
4. Click **"New Project"**
5. Fill in:
   - **Name**: Your project name (e.g., "nuel-portfolio")
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Select **Free** (no credit card needed)
6. Click **"Create new project"**
7. Wait 2-3 minutes for project to initialize

---

## Step 2: Install Dependencies

Open your terminal in the project root and run:

```bash
cd "Nuel-folio ux_ui-portfolio"
npm install @supabase/supabase-js
```

**Note**: If you get permission errors, try:
```bash
sudo chown -R $(whoami) ~/.npm
npm install @supabase/supabase-js
```

---

## Step 3: Configure Environment Variables

1. **Get your Supabase credentials:**
   - Go to your Supabase project dashboard
   - Click **Settings** (gear icon) → **API**
   - Copy:
     - **Project URL** (looks like: `https://xxxxx.supabase.co`)
     - **anon public** key (long string starting with `eyJ...`)

2. **Update your `.env` file:**
   
   Open `rootproject.env` and replace the placeholders:

   ```env
   VITE_SUPABASE_URL="https://YOUR_PROJECT_REF.supabase.co"
   VITE_SUPABASE_ANON_KEY="YOUR_ANON_PUBLIC_KEY"
   ```

   **Example:**
   ```env
   VITE_SUPABASE_URL="https://abcdefghijklmnop.supabase.co"
   VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
   ```

3. **Important**: 
   - Never commit `.env` files to git (they're already in `.gitignore`)
   - The `anon` key is safe to use in frontend (explained in Security section)

---

## Step 4: Set Up Database

### Option A: Using SQL Editor (Recommended)

1. Go to your Supabase dashboard
2. Click **SQL Editor** in the left sidebar
3. Click **"New query"**
4. Open the file: `supabase/migrations/20260113044122_create_projects_table.sql`
5. Copy the entire SQL content
6. Paste it into the SQL Editor
7. Click **"Run"** (or press `Cmd/Ctrl + Enter`)
8. You should see: ✅ "Success. No rows returned"

### Option B: Using Table Editor (Visual)

1. Go to **Table Editor** → **New Table**
2. Name: `projects`
3. Add columns:
   - `id` (uuid, primary key, default: `gen_random_uuid()`)
   - `title` (text, required)
   - `category` (text, required)
   - `video_url` (text, nullable)
   - `image_url` (text, required)
   - `created_at` (timestamptz, default: `now()`)
4. Click **"Save"**
5. Go to **Authentication** → **Policies** → `projects`
6. Create policies (see SQL file for exact policies)

**What this does:**
- Creates the `projects` table with proper schema
- Enables Row Level Security (RLS)
- Creates policies allowing public read and insert

---

## Step 5: Set Up Storage

### Option A: Using SQL Editor (Recommended)

1. Go to **SQL Editor** → **New query**
2. Open: `supabase/migrations/20260113044123_create_storage_bucket.sql`
3. Copy and paste the SQL
4. Click **"Run"**

### Option B: Using Dashboard (Visual)

1. Go to **Storage** in the left sidebar
2. Click **"New bucket"**
3. Configure:
   - **Name**: `projects`
   - **Public bucket**: ✅ Toggle ON (important!)
   - **File size limit**: `5` MB (or your preference)
   - **Allowed MIME types**: 
     - `image/jpeg`
     - `image/jpg`
     - `image/png`
     - `image/gif`
     - `image/webp`
     - `video/mp4`
     - `video/webm`
     - `video/mov`
4. Click **"Create bucket"**
5. Go to **Storage** → **Policies** → `projects`
6. Create policies:
   - **Policy 1**: SELECT (read) - `bucket_id = 'projects'`
   - **Policy 2**: INSERT (upload) - `bucket_id = 'projects'`

**What this does:**
- Creates a public storage bucket for project images
- Sets up policies for public read and upload access

---

## Step 6: Verify Setup

### Test Database

1. Go to **Table Editor** → `projects`
2. Click **"Insert row"**
3. Fill in:
   - `title`: "Test Project"
   - `category`: "VIDEO EDITING"
   - `image_url`: "https://example.com/test.jpg"
4. Click **"Save"**
5. You should see the row appear ✅

### Test Storage

1. Go to **Storage** → `projects`
2. Click **"Upload file"**
3. Upload a test image
4. Click on the uploaded file
5. Copy the **Public URL**
6. Open it in a new tab - it should display ✅

### Test Frontend

1. Start your dev server:
   ```bash
   npm run dev
   ```
2. Navigate to your upload form
3. Try uploading a project
4. Check the browser console for errors
5. Verify the project appears in your portfolio list

---

## Security Best Practices

### 🔐 Why the Anon Key is Safe

The **anon (anonymous) key** is designed to be public. Here's why it's safe:

1. **Row Level Security (RLS)**: All database operations go through RLS policies
2. **Limited Permissions**: The anon key can only do what your policies allow
3. **No Admin Access**: It cannot bypass RLS or access admin functions
4. **Standard Practice**: This is how Supabase is designed to work

**Example:**
```typescript
// ✅ SAFE - Uses anon key (public)
const supabase = createClient(url, anonKey);

// ❌ NEVER DO THIS - Service role key bypasses RLS
const supabase = createClient(url, serviceRoleKey); // DANGEROUS!
```

### 🛡️ Why RLS is Important

**Row Level Security (RLS)** is like a bouncer for your database:

- **Without RLS**: Anyone with the anon key can read/write everything
- **With RLS**: All operations must pass policy checks first

**Your policies:**
- ✅ Public can READ projects (portfolio is public)
- ✅ Public can INSERT projects (upload form works)
- ❌ Public CANNOT delete or update (unless you add policies)

### 📁 What to Avoid

1. **❌ Never expose service_role key**
   - This key bypasses RLS
   - Only use in server-side code (never frontend)

2. **❌ Don't disable RLS**
   - Always keep RLS enabled
   - Create policies instead

3. **❌ Don't allow DELETE without authentication**
   - Your current setup doesn't allow deletes (good!)
   - If you need deletes, require authentication

4. **❌ Don't upload huge files**
   - Free plan has limits
   - Validate file size (we do this in code)

5. **❌ Don't commit `.env` files**
   - Already in `.gitignore` ✅
   - Double-check before committing

---

## Troubleshooting

### Error: "Missing Supabase environment variables"

**Solution:**
1. Check that `rootproject.env` exists
2. Verify variables start with `VITE_`
3. Restart your dev server after changing `.env`
4. Check for typos in variable names

### Error: "new row violates row-level security policy"

**Solution:**
1. Go to **Authentication** → **Policies** → `projects`
2. Verify INSERT policy exists
3. Check policy condition: `WITH CHECK (true)`
4. Ensure RLS is enabled (not disabled)

### Error: "Bucket not found" or "Storage error"

**Solution:**
1. Go to **Storage** → Check if `projects` bucket exists
2. Verify bucket is **Public**
3. Check Storage policies are set correctly
4. Ensure file size is under limit (5MB default)

### Error: "Failed to fetch" or Network errors

**Solution:**
1. Check your Supabase URL is correct
2. Verify your project is active (not paused)
3. Check browser console for CORS errors
4. Free plan projects pause after 1 week of inactivity (just unpause in dashboard)

### Images not displaying

**Solution:**
1. Verify bucket is **Public** (not private)
2. Check the image URL format:
   ```
   https://YOUR_PROJECT.supabase.co/storage/v1/object/public/projects/filename.jpg
   ```
3. Test the URL directly in browser
4. Check browser console for 404 errors

### Upload works but project doesn't appear

**Solution:**
1. Check browser console for errors
2. Verify database insert succeeded
3. Go to **Table Editor** → `projects` → Check if row exists
4. Check `FeaturedWork.tsx` is fetching correctly
5. Verify RLS SELECT policy exists

---

## Folder Structure

Here's the recommended structure for your project:

```
Nuel-folio ux_ui-portfolio/
├── src/
│   ├── supabase.ts          ← Supabase client (NEW)
│   └── ...
├── components/
│   ├── AdminUpload.tsx      ← Updated to use Supabase
│   ├── FeaturedWork.tsx     ← Updated to use Supabase
│   └── ...
├── supabase/
│   └── migrations/
│       ├── 20260113044122_create_projects_table.sql
│       └── 20260113044123_create_storage_bucket.sql
├── rootproject.env           ← Environment variables
└── package.json
```

**Key Files:**
- `src/supabase.ts` - Supabase client configuration
- `components/AdminUpload.tsx` - Upload form (uses Supabase)
- `components/FeaturedWork.tsx` - Project list (uses Supabase)
- `supabase/migrations/` - Database and storage setup SQL

---

## File Size & Image Validation

The code includes validation:

- **Max file size**: 5MB (configurable in storage bucket settings)
- **Allowed types**: JPEG, PNG, GIF, WebP, MP4, WebM, MOV
- **Validation happens**: Before upload (saves bandwidth)

To change limits:
1. Update bucket settings in Supabase dashboard
2. Update `validateFile()` function in `AdminUpload.tsx`

---

## Next Steps

1. ✅ Test uploading a project
2. ✅ Verify projects appear in your portfolio
3. ✅ Test with different image sizes
4. ✅ Consider adding authentication for admin features (optional)
5. ✅ Set up backups (Supabase free plan includes daily backups)

---

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage Guide](https://supabase.com/docs/guides/storage)

---

## Summary Checklist

- [ ] Created Supabase account and project
- [ ] Installed `@supabase/supabase-js`
- [ ] Configured environment variables
- [ ] Created `projects` table with RLS
- [ ] Created `projects` storage bucket
- [ ] Set up storage policies
- [ ] Tested database insert
- [ ] Tested storage upload
- [ ] Verified frontend works
- [ ] Removed Firebase dependencies (optional cleanup)

---

**🎉 Congratulations!** Your portfolio is now powered by Supabase!

If you encounter any issues, refer to the Troubleshooting section or check the Supabase documentation.
