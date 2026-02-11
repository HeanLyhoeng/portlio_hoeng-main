# Supabase Scripts and Migrations

This document describes all the Supabase-related scripts, queries, and migrations created for your project.

## 📋 Table of Contents

1. [SQL Queries](#sql-queries)
2. [Database Migrations](#database-migrations)
3. [Storage Bucket Migrations](#storage-bucket-migrations)
4. [Upload Scripts](#upload-scripts)
5. [TypeScript Functions](#typescript-functions)

---

## SQL Queries

### 1. Show Users Table Schema
**Location:** `supabase/queries/show_users_schema.sql`

This query shows the schema of the `users` table in the `auth` schema. Run this in your Supabase SQL Editor to see the table structure.

**Usage:**
```sql
-- Copy and paste the contents into Supabase SQL Editor
-- View the structure of your auth.users table
```

---

## Database Migrations

### 2. Create Products Table
**Location:** `supabase/migrations/20260114000000_create_products_table.sql`

Creates a new `products` table with the following columns:
- `id` (UUID, primary key, auto-generated)
- `name` (TEXT, required)
- `price` (DECIMAL(10,2), required, must be >= 0)
- `created_at` (TIMESTAMPTZ, auto-generated)

The migration also sets up Row Level Security (RLS) policies for public read and write access.

**To apply:**
1. Go to Supabase Dashboard > SQL Editor
2. Copy and paste the migration SQL
3. Run it

---

### 3. Orders Query (Last Week)
**Location:** `supabase/queries/orders_last_week.sql`

Contains multiple SQL query options to get all orders from the last week:
- Last 7 days (rolling window)
- Last calendar week (Monday to Sunday)
- Last complete week
- With join to user and order items data

**Note:** Adjust table and column names based on your actual schema.

---

## Storage Bucket Migrations

### 4. Create Images Storage Bucket
**Location:** `supabase/migrations/20260114000001_create_images_storage_bucket.sql`

Creates a public storage bucket named `images` with:
- 10MB file size limit
- Supports: JPEG, JPG, PNG, GIF, WEBP, SVG
- Public read/write/update/delete policies

**To apply:**
1. Go to Supabase Dashboard > SQL Editor
2. Copy and paste the migration SQL
3. Run it

---

### 5. Create Avatars Storage Bucket
**Location:** `supabase/migrations/20260114000002_create_avatars_storage_bucket.sql`

Creates a public storage bucket named `avatars` for user profile pictures with:
- 5MB file size limit
- Supports: JPEG, JPG, PNG, GIF, WEBP
- Public read/write/update/delete policies

**To apply:**
1. Go to Supabase Dashboard > SQL Editor
2. Copy and paste the migration SQL
3. Run it

---

## Upload Scripts

All scripts require environment variables from `rootproject.env`:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### 6. Upload CSV to Products Table
**Location:** `scripts/uploadCsvToProducts.js`

Uploads product data from a CSV file to the `products` table.

**Usage:**
```bash
node scripts/uploadCsvToProducts.js path/to/products.csv
```

**CSV Format:**
```csv
name,price
Product 1,19.99
Product 2,29.99
Product 3,39.99
```

---

### 7. Upload Image to Images Bucket
**Location:** `scripts/uploadImageToImages.js`

Uploads a single image file to the `images` storage bucket.

**Usage:**
```bash
node scripts/uploadImageToImages.js ./assets/my-photo.png
```

---

### 8. Upload All Images from Uploads Folder
**Location:** `scripts/uploadAllImagesFromUploads.js`

Scans the `/uploads` folder recursively and uploads all image files to the `images` bucket.

**Usage:**
```bash
node scripts/uploadAllImagesFromUploads.js
```

**Supported formats:** JPG, JPEG, PNG, GIF, WEBP, SVG

**Note:** The script will create the uploads folder structure if it doesn't exist, but you need to add images to it first.

---

### 9. Upload Image to Projects Bucket
**Location:** `scripts/uploadImageToProjects.js`

Uploads an image to the `projects` storage bucket using environment variables.

**Usage:**
```bash
node scripts/uploadImageToProjects.js ./path/to/image.png [optional-custom-filename.png]
```

---

## TypeScript Functions

### 10. Upload to Avatars Bucket (Client SDK)
**Location:** `Nuel-folio ux_ui-portfolio/src/utils/uploadToAvatars.ts`

A TypeScript function that can be used in your React/TypeScript application to upload files to the `avatars` bucket using the Supabase client SDK.

**Usage in React component:**
```typescript
import { uploadFileToAvatars } from '@/utils/uploadToAvatars';

const handleFileUpload = async (file: File) => {
  const { data, error } = await uploadFileToAvatars(
    file, 
    'user-123-avatar.png', // optional custom filename
    'users' // optional folder
  );
  
  if (error) {
    console.error('Upload failed:', error);
  } else {
    console.log('Upload successful:', data?.publicUrl);
  }
};
```

**Functions available:**
- `uploadFileToAvatars(file, fileName?, folder?)` - Upload a file
- `deleteFileFromAvatars(filePath)` - Delete a file

---

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run migrations:**
   - Copy each migration SQL file content
   - Go to Supabase Dashboard > SQL Editor
   - Paste and run each migration

3. **Test scripts:**
   ```bash
   # Test uploading an image
   node scripts/uploadImageToImages.js ./path/to/test-image.png
   
   # Test uploading products CSV
   node scripts/uploadCsvToProducts.js ./path/to/products.csv
   ```

---

## Environment Variables

Make sure your `rootproject.env` file contains:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

---

## Notes

- All storage buckets are set to **public** by default. Adjust policies in production.
- All tables have **public read/write** policies. Restrict these in production.
- Scripts use ES modules (`import/export`), compatible with Node.js 14+
- The CSV upload script uses a simple CSV parser (handles basic comma-separated values)
