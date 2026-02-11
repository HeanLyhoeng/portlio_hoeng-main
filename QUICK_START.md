# ⚡ Quick Start Checklist

Follow these steps in order to get your Supabase backend running in 10 minutes!

---

## ✅ Step-by-Step Checklist

### 1. Install Package
```bash
cd "Nuel-folio ux_ui-portfolio"
npm install @supabase/supabase-js
```

### 2. Get Supabase Credentials
- [ ] Go to [https://app.supabase.com](https://app.supabase.com)
- [ ] Create new project (or use existing)
- [ ] Go to **Settings** → **API**
- [ ] Copy **Project URL** and **anon public** key

### 3. Configure Environment
- [ ] Open `rootproject.env`
- [ ] Replace `YOUR_PROJECT_REF` with your Supabase URL
- [ ] Replace `YOUR_ANON_PUBLIC_KEY` with your anon key
- [ ] Save the file

### 4. Set Up Database
- [ ] Go to **SQL Editor** in Supabase dashboard
- [ ] Open `supabase/migrations/20260113044122_create_projects_table.sql`
- [ ] Copy all SQL
- [ ] Paste into SQL Editor
- [ ] Click **"Run"**
- [ ] Verify: ✅ "Success. No rows returned"

### 5. Set Up Storage
- [ ] Go to **SQL Editor** → **New query**
- [ ] Open `supabase/migrations/20260113044123_create_storage_bucket.sql`
- [ ] Copy all SQL
- [ ] Paste into SQL Editor
- [ ] Click **"Run"**
- [ ] Verify: ✅ "Success. No rows returned"

### 6. Verify Setup
- [ ] Go to **Table Editor** → `projects` (should exist)
- [ ] Go to **Storage** → `projects` bucket (should exist)
- [ ] Check **Authentication** → **Policies** → Both tables have policies

### 7. Test Your App
```bash
npm run dev
```
- [ ] Navigate to upload form
- [ ] Upload a test project
- [ ] Verify it appears in your portfolio

---

## 🎯 What Was Changed

### New Files Created
- ✅ `src/supabase.ts` - Supabase client configuration
- ✅ `supabase/migrations/20260113044122_create_projects_table.sql` - Database setup
- ✅ `supabase/migrations/20260113044123_create_storage_bucket.sql` - Storage setup
- ✅ `SUPABASE_SETUP_GUIDE.md` - Complete setup guide
- ✅ `SUPABASE_SQL_REFERENCE.md` - SQL snippets reference
- ✅ `QUICK_START.md` - This file

### Files Updated
- ✅ `components/AdminUpload.tsx` - Now uses Supabase instead of Firebase
- ✅ `components/FeaturedWork.tsx` - Now fetches from Supabase instead of Firestore
- ✅ `rootproject.env` - Environment variable template (update with your keys)

### Files You Can Remove (Optional)
- ⚠️ `src/firebaseConfig.ts` - No longer needed (but keep for now if you want to reference)
- ⚠️ Firebase dependencies in `package.json` - Can uninstall later

---

## 🔑 Key Concepts

### Environment Variables
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your anon (public) key (safe to expose)

### Database
- Table: `projects` - Stores project metadata
- RLS: Enabled - All queries go through security policies
- Policies: Public read & insert (safe for portfolio)

### Storage
- Bucket: `projects` - Stores uploaded images
- Public: Yes - Images are publicly accessible
- Policies: Public read & insert

---

## 🚨 Common Issues

### "Missing Supabase environment variables"
→ Check `rootproject.env` has correct values and restart dev server

### "new row violates row-level security policy"
→ Check RLS policies exist in Supabase dashboard

### "Bucket not found"
→ Run the storage migration SQL again

### Images not displaying
→ Verify bucket is **Public** in Storage settings

---

## 📚 Next Steps

1. ✅ Complete the checklist above
2. 📖 Read `SUPABASE_SETUP_GUIDE.md` for detailed explanations
3. 🔍 Check `SUPABASE_SQL_REFERENCE.md` for SQL queries
4. 🎨 Customize your upload form if needed
5. 🚀 Deploy your portfolio!

---

## 💡 Pro Tips

- **Free Plan Limits**: 500MB database, 1GB storage, 2GB bandwidth/month
- **Backups**: Free plan includes daily backups (7-day retention)
- **Pausing**: Free projects pause after 1 week inactivity (just unpause in dashboard)
- **Monitoring**: Check usage in **Settings** → **Usage**

---

**Need Help?** Check the full guide: `SUPABASE_SETUP_GUIDE.md`
